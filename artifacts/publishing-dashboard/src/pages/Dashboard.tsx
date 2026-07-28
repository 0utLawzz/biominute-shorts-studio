import React, { useMemo, useState } from "react";
import {
  Episode,
  useGetEpisodeStats,
  useGetUpcomingEpisodes,
  useListEpisodes,
  ListEpisodesStatus,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  ChevronRight,
  Filter,
  Hammer,
  Loader2,
  MoreHorizontal,
  Play,
  Database,
  Send,
  X,
  Search,
} from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "../components/Navbar";
import { YouTubeBanner } from "../components/YouTubeBanner";
import { formatPKT } from "../lib/date";

const SEASONS = [
  { key: "all", label: "All" },
  { key: "S1: Morning Habits", label: "S1" },
  { key: "S2: Movement & Body", label: "S2" },
  { key: "S3: Sleep & Recovery", label: "S3" },
  { key: "S4: Stress & Mind", label: "S4" },
  { key: "S5: Nutrition & Myths", label: "S5" },
  { key: "S6: Healthy Aging & Longevity", label: "S6" },
] as const;

const STATUS_FILTERS = [
  "all",
  "draft",
  "scripted",
  "complete",
  "scheduled",
  "published",
  "building",
] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  published: { bg: "#8B2FC9", text: "#FFFFFF", accent: "#8B2FC9" },
  complete: { bg: "#0A6B52", text: "#FFFFFF", accent: "#0A6B52" },
  building: { bg: "#C9A800", text: "#0C0C0C", accent: "#C9A800" },
  scheduled: { bg: "#0D9970", text: "#FFFFFF", accent: "#0D9970" },
  scripted: { bg: "#C94A00", text: "#FFFFFF", accent: "#C94A00" },
  draft: { bg: "#E2DDD0", text: "#555555", accent: "#555555" },
};

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<ListEpisodesStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [seedState, setSeedState] = useState<"idle" | "checking" | "applying">("idle");
  const [seedPreview, setSeedPreview] = useState<{ inserted: number; updated: number } | null>(null);
  const [actionToast, setActionToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [selectedPublishIds, setSelectedPublishIds] = useState<number[]>([]);
  const [publishing, setPublishing] = useState(false);
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useGetEpisodeStats();
  const { data: upcoming, isLoading: upcomingLoading } = useGetUpcomingEpisodes();
  const { data: episodes, isLoading: episodesLoading } = useListEpisodes({
    season: activeSeason === "all" ? undefined : activeSeason,
    status: activeStatus === "all" ? undefined : activeStatus,
  });

  async function handleSeed() {
    setSeedState("checking");
    setActionToast(null);
    try {
      const res = await fetch("/api/episodes/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionToast({ ok: false, msg: data.detail || "Seed preview failed" });
      } else {
        setSeedPreview({ inserted: data.inserted ?? 0, updated: data.updated ?? 0 });
      }
    } catch (err: any) {
      setActionToast({ ok: false, msg: err.message || "Seed preview failed" });
    } finally {
      setSeedState("idle");
    }
  }

  async function applySeed() {
    setSeedState("applying");
    try {
      const res = await fetch("/api/episodes/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Seed failed");
      setSeedPreview(null);
      setActionToast({ ok: true, msg: `Seeded: ${data.inserted ?? 0} new, ${data.updated ?? 0} updated` });
      await queryClient.invalidateQueries();
    } catch (err: any) {
      setActionToast({ ok: false, msg: err.message || "Seed failed" });
    } finally {
      setSeedState("idle");
    }
  }

  const publishableEpisodes = (episodes ?? []).filter(
    (episode) => ["complete", "scheduled"].includes(episode.status) && !episode.youtubeVideoId,
  );

  async function publishSelected() {
    setPublishing(true);
    const failures: string[] = [];
    let publishedCount = 0;
    try {
      for (const id of selectedPublishIds) {
        const episode = publishableEpisodes.find((item) => item.id === id);
        if (!episode) continue;
        const res = await fetch(`/api/youtube/publish/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            privacyStatus: episode.scheduledPublishAt ? "private" : "public",
            scheduleAt: episode.scheduledPublishAt ?? null,
          }),
        });
        const data = await res.json();
        if (!res.ok) failures.push(`Ep ${episode.epNumber}: ${data.error || "failed"}`);
        else publishedCount += 1;
      }
      setPublishOpen(false);
      setSelectedPublishIds([]);
      setActionToast({
        ok: failures.length === 0,
        msg: failures.length === 0
          ? `${publishedCount} episode${publishedCount === 1 ? "" : "s"} sent to YouTube`
          : `${publishedCount} sent; ${failures.join(" • ")}`,
      });
      await queryClient.invalidateQueries();
    } catch (err: any) {
      setActionToast({ ok: false, msg: err.message || "Publish failed" });
    } finally {
      setPublishing(false);
    }
  }

  const filteredEpisodes = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return episodes ?? [];
    return (episodes ?? []).filter((episode) =>
      [episode.hookTitle, episode.youtubeTitle, String(episode.epNumber), episode.season]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [episodes, search]);

  const byStatus = stats?.byStatus;
  const inDraft = (byStatus?.draft ?? 0) + (byStatus?.scripted ?? 0);

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20 text-[#0C0C0C]">
      <Navbar />
      <YouTubeBanner />

      <main className="mx-auto max-w-[1500px] px-5 pt-10 sm:px-8">
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-6xl uppercase leading-none md:text-7xl">
              Production Queue
            </h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-[#555]">
              Focus on what needs attention next.
            </p>
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex border-2 border-[#0C0C0C] bg-[#FAF7EE] shadow-[3px_3px_0_#0C0C0C]">
              <QueueStat label="In Draft" value={inDraft} loading={statsLoading} />
              <QueueStat label="Building" value={byStatus?.building} loading={statsLoading} color="#C9A800" />
              <QueueStat label="Complete" value={byStatus?.complete} loading={statsLoading} color="#0A6B52" />
            </div>
            <button
              onClick={handleSeed}
              disabled={seedState !== "idle"}
              title="Preview workbook changes before seeding the database"
              className="flex items-center gap-2 border-2 border-[#0C0C0C] bg-[#FAF7EE] px-3 py-2 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0_#0C0C0C] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
            >
              <Database size={13} className={seedState === "checking" ? "animate-pulse" : ""} />
              {seedState === "checking" ? "Checking…" : "Seed"}
            </button>
            <button
              onClick={() => setPublishOpen(true)}
              disabled={publishableEpisodes.length === 0}
              title="Select complete episodes to publish or schedule on YouTube"
              className="flex items-center gap-2 border-2 border-[#0C0C0C] bg-[#C9A800] px-3 py-2 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0_#0C0C0C] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={13} />
              Publish
            </button>
          </div>
        </section>

        {actionToast && (
          <div
            className={`mb-6 border-2 border-[#0C0C0C] px-4 py-2 font-mono text-xs font-bold shadow-[3px_3px_0_#0C0C0C] ${
              actionToast.ok ? "bg-[#0A6B52] text-white" : "bg-[#C94A00] text-white"
            }`}
          >
            {actionToast.msg}
          </div>
        )}

        {seedPreview && (
          <div className="mb-6 border-2 border-[#0C0C0C] bg-[#C9A800] p-4 font-mono text-xs shadow-[3px_3px_0_#0C0C0C]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold uppercase">Seed preview</p>
                <p className="mt-1">Workbook would insert {seedPreview.inserted} and update {seedPreview.updated} episodes. Database is unchanged.</p>
              </div>
              <button onClick={() => setSeedPreview(null)} aria-label="Close seed preview"><X size={16} /></button>
            </div>
            <button onClick={applySeed} disabled={seedState !== "idle"} className="mt-3 border-2 border-[#0C0C0C] bg-[#FAF7EE] px-3 py-2 font-bold uppercase shadow-[2px_2px_0_#0C0C0C] disabled:opacity-60">
              {seedState === "applying" ? "Seeding…" : "Confirm & Seed Database"}
            </button>
          </div>
        )}

        {publishOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0C0C0C]/70 p-5" role="dialog" aria-modal="true" aria-labelledby="publish-title">
            <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto border-[3px] border-[#0C0C0C] bg-[#FAF7EE] p-5 shadow-[7px_7px_0_#0C0C0C]">
              <div className="flex items-center justify-between border-b-2 border-[#0C0C0C] pb-3">
                <div><h2 id="publish-title" className="font-display text-4xl uppercase">Publish Episodes</h2><p className="font-mono text-[10px] uppercase text-[#555]">Only episodes without a YouTube ID are shown.</p></div>
                <button onClick={() => setPublishOpen(false)} aria-label="Close publish dialog"><X /></button>
              </div>
              <div className="my-4 space-y-2">
                {publishableEpisodes.length === 0 ? <p className="font-mono text-xs">No publishable episodes in the current filter.</p> : publishableEpisodes.map((episode) => (
                  <label key={episode.id} className="flex cursor-pointer items-center gap-3 border-2 border-[#0C0C0C] bg-white p-3 font-mono text-xs">
                    <input type="checkbox" checked={selectedPublishIds.includes(episode.id)} onChange={(event) => setSelectedPublishIds((ids) => event.target.checked ? [...ids, episode.id] : ids.filter((id) => id !== episode.id))} />
                    <span className="font-bold">EP {episode.epNumber}</span>
                    <span className="truncate">{episode.hookTitle}</span>
                    <span className="ml-auto shrink-0 text-[#555]">{episode.scheduledPublishAt ? "SCHEDULE" : "NOW"}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setPublishOpen(false)} className="border-2 border-[#0C0C0C] px-3 py-2 font-mono text-xs font-bold uppercase">Cancel</button>
                <button onClick={publishSelected} disabled={publishing || selectedPublishIds.length === 0} className="border-2 border-[#0C0C0C] bg-[#C9A800] px-3 py-2 font-mono text-xs font-bold uppercase shadow-[2px_2px_0_#0C0C0C] disabled:opacity-50">{publishing ? "Publishing…" : `Confirm ${selectedPublishIds.length} Publish`}</button>
              </div>
            </div>
          </div>
        )}

        <ActionQueue episodes={upcoming ?? []} loading={upcomingLoading} />

        <section className="mt-14">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-5xl uppercase leading-none">Full Library</h2>
              <span className="border-2 border-[#0C0C0C] bg-[#C9A800] px-2 py-1 font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0_#0C0C0C]">
                {filteredEpisodes.length} Entries
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center border-2 border-[#0C0C0C] bg-[#FAF7EE] px-3 py-2 shadow-[3px_3px_0_#0C0C0C]">
                <Search size={14} className="mr-2 text-[#555]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="SEARCH EPISODES..."
                  aria-label="Search episodes"
                  className="w-48 bg-transparent font-mono text-xs uppercase outline-none placeholder:text-[#888]"
                />
              </div>
              <div className="flex border-2 border-[#0C0C0C] bg-[#FAF7EE] shadow-[3px_3px_0_#0C0C0C]">
                <Filter size={14} className="m-2.5 shrink-0" />
                {SEASONS.map((season) => (
                  <button
                    key={season.key}
                    onClick={() => setActiveSeason(season.key)}
                    className={`border-l-2 border-[#0C0C0C] px-2.5 py-2 font-mono text-[10px] font-bold uppercase transition ${
                      activeSeason === season.key ? "bg-[#0C0C0C] text-[#FAF7EE]" : "hover:bg-[#E2DDD0]"
                    }`}
                  >
                    {season.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status as ListEpisodesStatus | "all")}
                className={`border-2 border-[#0C0C0C] px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0_#0C0C0C] transition ${
                  activeStatus === status
                    ? "translate-x-[2px] translate-y-[2px] bg-[#0C0C0C] text-[#FAF7EE] shadow-none"
                    : "bg-[#FAF7EE] hover:-translate-x-px hover:-translate-y-px"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="overflow-hidden border-[3px] border-[#0C0C0C] bg-[#FAF7EE] shadow-[5px_5px_0_#0C0C0C]">
            <div className="hidden grid-cols-[80px_105px_minmax(240px,1fr)_125px_145px_55px] gap-4 border-b-[3px] border-[#0C0C0C] bg-[#E2DDD0] p-3 font-mono text-[10px] font-bold uppercase text-[#555] md:grid">
              <div>Season</div>
              <div>Episode</div>
              <div>Title</div>
              <div>Status</div>
              <div>Post Date</div>
              <div className="text-center">Open</div>
            </div>

            {episodesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin" />
              </div>
            ) : filteredEpisodes.length > 0 ? (
              filteredEpisodes.map((episode) => <LibraryRow key={episode.id} episode={episode} />)
            ) : (
              <div className="px-6 py-20 text-center">
                <p className="font-display text-3xl uppercase">No Episodes Found</p>
                <p className="mt-2 font-mono text-xs uppercase text-[#555]">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ActionQueue({
  episodes,
  loading,
}: {
  episodes: Episode[];
  loading: boolean;
}) {
  return (
    <section className="relative">
      <div className="absolute -left-3 -top-4 z-10 -rotate-2 border-2 border-[#0C0C0C] bg-[#0C0C0C] px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-wider text-[#FAF7EE] shadow-[3px_3px_0_#0C0C0C]">
        Action Required
      </div>
      <div className="border-[3px] border-[#0C0C0C] bg-[#E2DDD0] p-5 pt-8 shadow-[8px_8px_0_#0C0C0C]">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : episodes.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {episodes.slice(0, 3).map((episode, index) => (
              <QueueCard episode={episode} key={episode.id} urgent={index === 0 && episode.status === "building"} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center font-mono text-xs font-bold uppercase text-[#555]">
            No upcoming episodes scheduled
          </div>
        )}
      </div>
    </section>
  );
}

function QueueCard({ episode, urgent }: { episode: any; urgent: boolean }) {
  const daysOut = episode.postDate
    ? Math.ceil((new Date(episode.postDate).getTime() - Date.now()) / 86_400_000)
    : null;
  const dueLabel =
    daysOut === null ? "DATE TBD" : daysOut < 0 ? `LATE BY ${Math.abs(daysOut)}D` : daysOut === 0 ? "DUE TODAY" : `DUE IN ${daysOut}D`;
  const action = episode.status === "building" ? "Review Render" : episode.status === "complete" ? "Schedule" : "Edit Script";
  const ActionIcon = episode.status === "building" ? Hammer : episode.status === "complete" ? Play : MoreHorizontal;
  const colors = STATUS_COLORS[episode.status] ?? STATUS_COLORS.draft;

  return (
    <Link href={`/episodes/${episode.id}`}>
      <article className="group relative flex h-full cursor-pointer flex-col border-2 border-[#0C0C0C] bg-[#FAF7EE] shadow-[3px_3px_0_#0C0C0C] transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_#0C0C0C]">
        {urgent && <span className="absolute -right-2 -top-2 h-4 w-4 animate-pulse rounded-full border-2 border-[#0C0C0C] bg-[#C94A00]" />}
        <div className="flex items-start justify-between border-b-2 border-[#0C0C0C] bg-white p-4">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#555]">{seasonCode(episode.season)}</div>
            <div className="font-display text-3xl leading-none">EP {episode.epNumber}</div>
          </div>
          <StatusPill status={episode.status} />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <p className="mb-4 line-clamp-3 font-sans text-base font-bold leading-snug">{episode.hookTitle}</p>
          <div className="mb-4 flex items-center justify-between font-mono text-xs">
            <span className={daysOut !== null && daysOut < 0 ? "font-bold text-[#C94A00]" : "text-[#555]"}>{dueLabel}</span>
            <span className="text-[#555]">{episode.duration || "--:--"}</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-2 border-[#0C0C0C] bg-[#0C0C0C] py-2.5 font-mono text-xs font-bold uppercase text-[#FAF7EE] transition group-hover:bg-[#0A6B52]">
            <ActionIcon size={14} />
            {action}
          </div>
        </div>
      </article>
    </Link>
  );
}

function LibraryRow({ episode }: { episode: any }) {
  return (
    <Link href={`/episodes/${episode.id}`}>
      <div className="group grid cursor-pointer grid-cols-1 gap-2 border-b-2 border-[#CCC] p-4 transition hover:bg-white md:grid-cols-[80px_105px_minmax(240px,1fr)_125px_145px_55px] md:items-center md:gap-4 md:p-3">
        <div className="font-mono text-xs font-bold text-[#888]">{seasonCode(episode.season)}</div>
        <div className="font-display text-2xl leading-none">EP {episode.epNumber}</div>
        <div className="min-w-0">
          <div className="truncate font-sans text-sm font-bold">{episode.hookTitle}</div>
          <div className="mt-1 truncate font-mono text-[10px] uppercase text-[#777] md:hidden">{episode.youtubeTitle}</div>
        </div>
        <div><StatusPill status={episode.status} /></div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#555]">
          <Calendar size={13} />
          {formatPKT(episode.postDate)}
        </div>
        <div className="flex justify-end">
          <ChevronRight className="opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" size={17} />
        </div>
      </div>
    </Link>
  );
}

function QueueStat({ label, value, loading, color = "#0C0C0C" }: { label: string; value?: number; loading: boolean; color?: string }) {
  return (
    <div className="flex min-w-[74px] flex-col border-r border-[#0C0C0C]/20 px-3 py-2 last:border-r-0">
      <span className="font-mono text-[9px] font-bold uppercase text-[#555]">{label}</span>
      {loading ? <Loader2 size={18} className="mt-1 animate-spin" /> : <span className="font-display text-2xl leading-none" style={{ color }}>{value ?? 0}</span>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.draft;
  return (
    <span
      className="inline-flex min-w-[78px] items-center justify-center border-2 border-[#0C0C0C] px-2 py-1 font-mono text-[10px] font-bold uppercase"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  );
}

function seasonCode(season: string) {
  return season.split(":")[0].trim();
}