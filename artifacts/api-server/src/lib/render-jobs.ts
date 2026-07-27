import { eq, sql } from "drizzle-orm";
import { db, renderJobsTable } from "@workspace/db";

export type RenderJobState = "running" | "succeeded" | "failed";

export class RenderAlreadyRunningError extends Error {
  readonly job: typeof renderJobsTable.$inferSelect;

  constructor(job: typeof renderJobsTable.$inferSelect) {
    super("A render is already running for this episode");
    this.name = "RenderAlreadyRunningError";
    this.job = job;
  }
}

function isProcessAlive(pid: number | null): boolean {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function isClaimStillFresh(startedAt: Date): boolean {
  return Date.now() - startedAt.getTime() < 2 * 60 * 1000;
}

/**
 * Atomically claim the single render slot for an episode.
 *
 * A terminal row can be reused. A running row is only reclaimed if its PID is
 * no longer alive, which makes the lock survive API restarts.
 */
export async function claimRenderJob(params: {
  episodeId: number;
  logPath: string;
}): Promise<typeof renderJobsTable.$inferSelect> {
  return db.transaction(async (tx) => {
    // Serialize claims even when this is the first render row for an episode.
    // A row lock alone cannot protect two concurrent INSERTs because neither
    // transaction can lock a row that does not exist yet.
    await tx.execute(sql`select pg_advisory_xact_lock(${params.episodeId})`);

    const [existing] = await tx
      .select()
      .from(renderJobsTable)
      .where(eq(renderJobsTable.episodeId, params.episodeId))
      .for("update");

    if (
      existing?.status === "running" &&
      (isProcessAlive(existing.pid) ||
        (existing.pid === null && isClaimStillFresh(existing.startedAt)))
    ) {
      throw new RenderAlreadyRunningError(existing);
    }

    if (existing) {
      const [claimed] = await tx
        .update(renderJobsTable)
        .set({
          status: "running",
          pid: null,
          logPath: params.logPath,
          startedAt: new Date(),
          finishedAt: null,
          error: null,
        })
        .where(eq(renderJobsTable.id, existing.id))
        .returning();
      return claimed;
    }

    const [claimed] = await tx
      .insert(renderJobsTable)
      .values({
        episodeId: params.episodeId,
        status: "running",
        logPath: params.logPath,
      })
      .returning();
    return claimed;
  });
}

export async function attachRenderPid(jobId: number, pid: number): Promise<void> {
  await db
    .update(renderJobsTable)
    .set({ pid })
    .where(eq(renderJobsTable.id, jobId));
}

export async function finishRenderJob(params: {
  jobId: number;
  status: Exclude<RenderJobState, "running">;
  error?: string | null;
}): Promise<void> {
  await db
    .update(renderJobsTable)
    .set({
      status: params.status,
      finishedAt: new Date(),
      error: params.error ?? null,
    })
    .where(eq(renderJobsTable.id, params.jobId));
}

/**
 * Stop active render children before the API process exits.
 *
 * The database row is durable, but detached children must not be left behind
 * when the workflow is intentionally restarted.
 */
export async function shutdownRenderJobs(): Promise<void> {
  const running = await db
    .select()
    .from(renderJobsTable)
    .where(eq(renderJobsTable.status, "running"));

  await Promise.all(
    running.map(async (job) => {
      terminateProcess(job.pid);
      await finishRenderJob({
        jobId: job.id,
        status: "failed",
        error: "API server stopped while the render was running",
      });
    }),
  );
}

export async function getRenderJob(
  episodeId: number,
  outputExists = false,
) {
  const [job] = await db
    .select()
    .from(renderJobsTable)
    .where(eq(renderJobsTable.episodeId, episodeId));

  if (!job) return null;
  if (job.status !== "running" || isProcessAlive(job.pid)) return job;

  // Reconcile a process that died while the server was down.
  const [reconciled] = await db
    .update(renderJobsTable)
    .set({
      status: outputExists ? "succeeded" : "failed",
      finishedAt: new Date(),
      error: outputExists
        ? null
        : job.error ?? "Render process is no longer running",
    })
    .where(eq(renderJobsTable.id, job.id))
    .returning();
  return reconciled;
}

export function terminateProcess(pid: number | null): void {
  if (!pid || pid <= 0 || !isProcessAlive(pid)) return;
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // The process can exit between the liveness check and SIGTERM.
  }
}