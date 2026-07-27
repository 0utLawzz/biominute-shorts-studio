// Seed: populates the `episodes` table from the newest master workbook
// in attached_assets/ (Production, Social, Schedule tabs).
// - Existing rows (1-36) are updated with workbook metadata only; their real
//   publish/schedule status and YouTube IDs are preserved.
// - New rows (37-50) and the two pipeline test slots (TEST-1, TEST-2) are inserted.
import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import { db, episodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../..");
const ATTACHED_ASSETS_DIR = path.join(PROJECT_ROOT, "attached_assets");
const EXPORTS_DIR = path.join(PROJECT_ROOT, "exports");
const DRY_RUN = process.argv.includes("--dry-run");

type DbStatus = "draft" | "scripted" | "complete" | "scheduled" | "published";

function hasExportedVideo(epNumber: number): boolean {
  const padded = String(epNumber).padStart(2, "0");
  if (!fs.existsSync(EXPORTS_DIR)) return false;
  const folder = fs.readdirSync(EXPORTS_DIR).find((f) => f.startsWith(`Episode-${padded}-`));
  if (!folder) return false;
  return fs.existsSync(path.join(EXPORTS_DIR, folder, "episode.mp4"));
}

function findMasterWorkbook(): string {
  const workbooks = fs
    .readdirSync(ATTACHED_ASSETS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.xlsx$/i.test(entry.name))
    .map((entry) => {
      const fullPath = path.join(ATTACHED_ASSETS_DIR, entry.name);
      return { fullPath, modifiedAt: fs.statSync(fullPath).mtimeMs };
    })
    .sort((a, b) => b.modifiedAt - a.modifiedAt);

  if (workbooks.length === 0) {
    throw new Error(`No .xlsx workbook found in ${ATTACHED_ASSETS_DIR}`);
  }

  return workbooks[0].fullPath;
}

function normalizePostDate(raw: string): Date | null {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function extractEpNumberFromSchedule(cellValue: unknown): number | null {
  const raw = String(cellValue ?? "");
  const match = raw.match(/\bEp\s*(\d+)\b/i);
  return match ? parseInt(match[1], 10) : null;
}

function workbookStatusToDb(status: string): DbStatus {
  const s = String(status ?? "").toLowerCase();
  if (s.includes("published")) return "published";
  if (s.includes("complete") || s.includes("approved")) return "complete";
  if (s.includes("scripted")) return "scripted";
  if (s.includes("test")) return "complete"; // test episodes are ready to schedule
  return "draft";
}

function parseDescriptionBlock(description: string): { citation: string; hashtags: string } {
  // The Social description already has the canonical template. We extract the citation
  // line and hashtags from it so the DB stores them separately.
  const lines = description.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  // Hashtags are the last line if it starts with #.
  let hashtags = "";
  if (lines.length > 0 && lines[lines.length - 1].startsWith("#")) {
    hashtags = lines.pop()!;
  }

  // Citation is the line starting with "Backed by:".
  const citationLine = lines.find((l) => l.toLowerCase().startsWith("backed by:"));
  const citation = citationLine ? citationLine.replace(/^Backed by:\s*/i, "").trim() : "";

  return { citation, hashtags };
}

async function main() {
  const masterWorkbook = findMasterWorkbook();
  console.log(
    `${DRY_RUN ? "[DRY RUN] " : ""}Using workbook: ${path.basename(masterWorkbook)}`,
  );

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(masterWorkbook);

  const prod = wb.getWorksheet("Production");
  const social = wb.getWorksheet("Social");
  const schedule = wb.getWorksheet("Schedule");

  if (!prod) throw new Error("Production sheet not found");
  if (!social) throw new Error("Social sheet not found");

  // -------------------------------------------------------------------------
  // Read Production sheet
  // Headers are on row 4; data starts at row 5.
  // -------------------------------------------------------------------------
  const prodByEp = new Map<number, Record<string, any>>();
  prod.eachRow((row, rowNumber) => {
    if (rowNumber <= 4) return;
    const epNumber = Number(row.getCell(1).value);
    if (!epNumber || Number.isNaN(epNumber)) return;
    prodByEp.set(epNumber, {
      title: String(row.getCell(2).value ?? ""),
      season: String(row.getCell(3).value ?? ""),
      status: String(row.getCell(4).value ?? ""),
      duration: String(row.getCell(5).value ?? ""),
      voScript: String(row.getCell(7).value ?? ""),
      visualDirection: String(row.getCell(8).value ?? ""),
      citation: String(row.getCell(9).value ?? ""),
    });
  });

  // -------------------------------------------------------------------------
  // Read Social sheet
  // Headers are on row 4; data starts at row 5.
  // -------------------------------------------------------------------------
  const socialByEp = new Map<number, Record<string, any>>();
  social.eachRow((row, rowNumber) => {
    if (rowNumber <= 4) return;
    const epNumber = Number(row.getCell(1).value);
    if (!epNumber || Number.isNaN(epNumber)) return;
    const description = String(row.getCell(4).value ?? "");
    const { citation, hashtags } = parseDescriptionBlock(description);
    socialByEp.set(epNumber, {
      youtubeTitle: String(row.getCell(3).value ?? ""),
      description,
      cta: String(row.getCell(5).value ?? ""),
      hashtags,
      thumbnailPrompt: String(row.getCell(7).value ?? ""),
      // Prefer the citation extracted from the canonical description; fall back to Production.
      citation: citation || String(row.getCell(9).value ?? ""),
    });
  });

  // -------------------------------------------------------------------------
  // Read Schedule sheet for post dates
  // Headers are on row 4; data starts at row 5.
  // -------------------------------------------------------------------------
  const scheduleByEp = new Map<number, Date | null>();
  if (schedule) {
    schedule.eachRow((row, rowNumber) => {
      if (rowNumber <= 4) return;
      const epNumber = extractEpNumberFromSchedule(row.getCell(4).value);
      const date = String(row.getCell(2).value ?? "");
      if (epNumber && date) {
        const normalized = normalizePostDate(date);
        if (normalized) scheduleByEp.set(epNumber, normalized);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Build episode rows
  // -------------------------------------------------------------------------
  const allEpNumbers = new Set([...prodByEp.keys(), ...socialByEp.keys()]);
  const rows: (typeof episodesTable.$inferInsert)[] = [];

  for (const epNumber of allEpNumbers) {
    const p = prodByEp.get(epNumber);
    const s = socialByEp.get(epNumber);
    if (!p || !s) continue; // need both sheets

    const exported = hasExportedVideo(epNumber);
    const dbStatus = workbookStatusToDb(p.status);
    let status: DbStatus = exported && dbStatus === "draft" ? "complete" : dbStatus;

    const citationText = s.citation || p.citation || "";
    const cta = s.cta ? `CTA: ${s.cta}` : "";
    const citationCta = [citationText, cta].filter(Boolean).join("\n\n");

    rows.push({
      epNumber,
      status,
      dateBuilt: null,
      postDate: scheduleByEp.get(epNumber) ?? null,
      season: p.season,
      aspectRatio: "9:16",
      duration: p.duration,
      hookTitle: p.title,
      youtubeTitle: s.youtubeTitle,
      voScript: p.voScript,
      visualDirection: p.visualDirection,
      bgSound: "",
      thumbnailPrompt: s.thumbnailPrompt,
      citationCta,
      hashtags: s.hashtags,
    });
  }

  // -------------------------------------------------------------------------
  // Add two test episode slots
  // -------------------------------------------------------------------------
  const testEpisodes: (typeof episodesTable.$inferInsert)[] = [
    {
      epNumber: 998,
      status: "complete",
      dateBuilt: null,
      postDate: null,
      season: "S1: Morning Habits",
      aspectRatio: "9:16",
      duration: "~30 seconds",
      hookTitle: "TEST-1: Pipeline Smoke Test (immediate publish)",
      youtubeTitle: "TEST-1 — BioMinute Pipeline Smoke Test",
      voScript: "This is a lightweight test episode used to verify the generate → export → publish path without touching real content.",
      visualDirection: "Minimal placeholder animation with BioMinute branding.",
      bgSound: "",
      thumbnailPrompt: "Dark slate background, 'TEST-1' badge, BioMinute wordmark.",
      citationCta: "CTA: Build a test episode and publish it instantly.",
      hashtags: "#BioMinute #Test #Pipeline",
    },
    {
      epNumber: 999,
      status: "complete",
      dateBuilt: null,
      postDate: null,
      season: "S1: Morning Habits",
      aspectRatio: "9:16",
      duration: "~30 seconds",
      hookTitle: "TEST-2: Scheduler Smoke Test (+1 day scheduled publish)",
      youtubeTitle: "TEST-2 — BioMinute Scheduler Smoke Test",
      voScript: "This is a lightweight test episode used to verify the unattended scheduler publishes on its own after a short delay.",
      visualDirection: "Minimal placeholder animation with BioMinute branding.",
      bgSound: "",
      thumbnailPrompt: "Dark slate background, 'TEST-2' badge, BioMinute wordmark.",
      citationCta: "CTA: Schedule this test episode and confirm it publishes automatically.",
      hashtags: "#BioMinute #Test #Scheduler",
    },
  ];
  rows.push(...testEpisodes);

  if (rows.length === 0) throw new Error("No episode rows parsed from workbook");

  if (DRY_RUN) {
    const existing = await db
      .select({ epNumber: episodesTable.epNumber, status: episodesTable.status })
      .from(episodesTable);
    const existingNumbers = new Set(existing.map((episode) => episode.epNumber));
    const toInsert = rows.filter((row) => !existingNumbers.has(row.epNumber));
    const toUpdate = rows.filter((row) => existingNumbers.has(row.epNumber));

    console.log(`[DRY RUN] Parsed ${rows.length} workbook/test rows.`);
    console.log(`[DRY RUN] Would insert ${toInsert.length} new rows.`);
    console.log(`[DRY RUN] Would update ${toUpdate.length} existing rows.`);
    console.log(
      `[DRY RUN] Database unchanged. Remove --dry-run to apply the seed.`,
    );
    return;
  }

  // -------------------------------------------------------------------------
  // Upsert: preserve existing publish/schedule state for real episodes
  // -------------------------------------------------------------------------
  const existing = await db
    .select({ epNumber: episodesTable.epNumber, status: episodesTable.status })
    .from(episodesTable);
  const existingMap = new Map(existing.map((e) => [e.epNumber, e.status]));

  const toInsert = rows.filter((r) => !existingMap.has(r.epNumber));
  const toUpdate = rows.filter((r) => existingMap.has(r.epNumber));

  if (toInsert.length > 0) {
    await db.insert(episodesTable).values(toInsert);
    console.log(`Inserted ${toInsert.length} new episodes.`);
  }

  // Statuses that are already in the live pipeline — never downgrade these.
  const LOCKED_STATUSES = new Set<string>(["published", "scheduled"]);

  for (const row of toUpdate) {
    const currentStatus = existingMap.get(row.epNumber)!;

    // Episodes 1–50 that are already published/scheduled keep their live state
    // AND keep their existing post/schedule dates so we don't wipe real history.
    const preserveLiveState = row.epNumber <= 50 && LOCKED_STATUSES.has(currentStatus);

    // scheduledPublishAt is recomputed from postDate + 09:00 UTC whenever a postDate
    // is present (fixes cumulative-drift bugs). For complete/scripted without a date, clear it.
    let scheduledPublishAt: Date | null | undefined = undefined; // undefined = leave unchanged
    if (row.postDate && !preserveLiveState) {
      const d = new Date(row.postDate);
      d.setUTCHours(9, 0, 0, 0);
      scheduledPublishAt = d;
    } else if (!row.postDate && !preserveLiveState) {
      scheduledPublishAt = null;
    }

    // Only overwrite status when the episode is NOT already live (1–50 published/scheduled).
    // Status always comes from row.status, which was already derived purely from the
    // workbook's own Status column in workbookStatusToDb() above — no hardcoded
    // episode-number ranges, ever. This is what makes future workbook edits (any
    // episode range, not just 51-100) sync correctly without code changes.
    let statusOverride: { status?: DbStatus } = {};
    if (!preserveLiveState) {
      statusOverride = { status: row.status as DbStatus };
    }

    await db
      .update(episodesTable)
      .set({
        ...(preserveLiveState ? {} : { postDate: row.postDate }),
        season: row.season,
        duration: row.duration,
        hookTitle: row.hookTitle,
        youtubeTitle: row.youtubeTitle,
        voScript: row.voScript,
        visualDirection: row.visualDirection,
        thumbnailPrompt: row.thumbnailPrompt,
        citationCta: row.citationCta,
        hashtags: row.hashtags,
        updatedAt: new Date(),
        ...statusOverride,
        ...(scheduledPublishAt !== undefined ? { scheduledPublishAt } : {}),
      })
      .where(eq(episodesTable.epNumber, row.epNumber));
  }

  if (toUpdate.length > 0) {
    console.log(`Updated metadata for ${toUpdate.length} existing episodes.`);
  }

  console.log(`Done. Total episodes in table: ${existing.length + toInsert.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
