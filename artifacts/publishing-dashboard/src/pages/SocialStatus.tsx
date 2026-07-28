import React from "react";
import { Loader2, Youtube, Facebook, Folder, FileVideo, ExternalLink, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Navbar } from "../components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { formatPKT } from "../lib/date";

interface SocialRow {
  epNumber: number;
  hookTitle: string;
  status: string;
  hasFolder: boolean;
  hasVideoFile: boolean;
  youtubeVideoId: string | null;
  facebookVideoId: string | null;
  postDate: string | null;
  scheduledPublishAt: string | null;
}

interface SocialRowsResponse {
  total: number;
  rows: SocialRow[];
}

const CheckPill = ({ ok }: { ok: boolean }) => (
  <span
    className={`inline-flex w-7 h-7 items-center justify-center font-mono text-base font-bold border-2 border-[#0C0C0C] ${
      ok ? "bg-[#0D9970] text-[#FAF7EE]" : "bg-[#E2DDD0] text-[#999]"
    }`}
    title={ok ? "Available" : "Missing"}
  >
    {ok ? "✓" : "✗"}
  </span>
);

const YouTubePill = ({ row }: { row: SocialRow }) => {
  if (!row.youtubeVideoId) return <CheckPill ok={false} />;
  return (
    <a
      href={`https://youtu.be/${row.youtubeVideoId}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Open on YouTube"
      className="inline-flex w-7 h-7 items-center justify-center bg-[#FF0000] text-white border-2 border-[#0C0C0C] hover:scale-110 transition-transform"
    >
      <Youtube className="w-4 h-4" />
    </a>
  );
};

const FacebookPill = ({ row }: { row: SocialRow }) => {
  if (!row.facebookVideoId) return <CheckPill ok={false} />;
  return (
    <a
      href={`https://www.facebook.com/watch/?v=${row.facebookVideoId}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Open on Facebook"
      className="inline-flex w-7 h-7 items-center justify-center bg-[#1877F2] text-white border-2 border-[#0C0C0C] hover:scale-110 transition-transform"
    >
      <Facebook className="w-4 h-4" />
    </a>
  );
};

const LinkCell = ({
  href,
  id,
  emptyLabel = "—",
}: {
  href: string;
  id: string | null;
  emptyLabel?: string;
}) =>
  id ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#0D9970] hover:underline inline-flex items-center gap-1"
    >
      {id.slice(0, 8)}…
      <ExternalLink className="w-3 h-3" />
    </a>
  ) : (
    <span className="text-[#999]">{emptyLabel}</span>
  );

const Row = ({ row }: { row: SocialRow }) => {
  return (
    <tr className="border-b-[2px] border-[#0C0C0C] hover:bg-[#FAF7EE]">
      <td className="px-4 py-3 font-mono text-sm font-bold">
        <span className="bg-[#C94A00] text-white font-display text-xl px-2 py-0.5 border-2 border-[#0C0C0C] -rotate-1">
          {row.epNumber}
        </span>
      </td>
      <td className="px-4 py-3 font-sans text-sm text-[#0C0C0C] max-w-md">
        <div className="line-clamp-1" title={row.hookTitle}>{row.hookTitle ?? "—"}</div>
      </td>
      <td className="px-2 py-3 text-center">
        <CheckPill ok={row.hasFolder} />
      </td>
      <td className="px-2 py-3 text-center">
        <CheckPill ok={row.hasVideoFile} />
      </td>
      <td className="px-2 py-3 text-center">
        <YouTubePill row={row} />
      </td>
      <td className="px-2 py-3 text-center">
        <FacebookPill row={row} />
      </td>
      <td className="px-4 py-3 font-mono text-xs">
        <LinkCell
          href={`https://youtu.be/${row.youtubeVideoId ?? ""}`}
          id={row.youtubeVideoId}
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs">
        <LinkCell
          href={`https://www.facebook.com/watch/?v=${row.facebookVideoId ?? ""}`}
          id={row.facebookVideoId}
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs">
        {row.scheduledPublishAt || row.postDate
          ? formatPKT(row.scheduledPublishAt || row.postDate || "")
          : <span className="text-[#999]">—</span>}
      </td>
    </tr>
  );
};

const SocialTable = ({ rows }: { rows: SocialRow[] }) => {
  const trackedRows = rows.filter((row) => row.epNumber >= 1 && row.epNumber <= 100);
  return (
      <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[5px_5px_0_#0C0C0C] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0C0C0C] text-[#FAF7EE]">
            <tr>
              <th className="px-4 py-2 font-display uppercase text-xs">Ep</th>
              <th className="px-4 py-2 font-display uppercase text-xs">Title</th>
              <th className="px-2 py-2 font-display uppercase text-xs text-center" title="Export folder exists on disk">
                <Folder className="w-4 h-4 inline-block" />
              </th>
              <th className="px-2 py-2 font-display uppercase text-xs text-center" title="episode.mp4 inside folder">
                <FileVideo className="w-4 h-4 inline-block" />
              </th>
              <th className="px-2 py-2 font-display uppercase text-xs text-center" title="YouTube video ID present">
                <Youtube className="w-4 h-4 inline-block" />
              </th>
              <th className="px-2 py-2 font-display uppercase text-xs text-center" title="Facebook post ID present">
                <Facebook className="w-4 h-4 inline-block" />
              </th>
              <th className="px-4 py-2 font-display uppercase text-xs">YouTube link</th>
              <th className="px-4 py-2 font-display uppercase text-xs">Facebook link</th>
              <th className="px-4 py-2 font-display uppercase text-xs">Publish Date</th>
            </tr>
          </thead>
          <tbody>
            {trackedRows.map((row) => <Row key={row.epNumber} row={row} />)}
          </tbody>
        </table>
      </div>
  );
};

export default function SocialStatus() {
  const requestedEpisodes = new URLSearchParams(window.location.search).get("episodes");
  const { data, isLoading, refetch, isFetching } = useQuery<SocialRowsResponse>({
    queryKey: ["/api/episodes/social-rows", requestedEpisodes],
    queryFn: () =>
      customFetch(
        requestedEpisodes
          ? `/api/episodes/social-rows?episodes=${encodeURIComponent(requestedEpisodes)}`
          : "/api/episodes/social-rows",
      ),
    refetchInterval: 30_000,
  });

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-[#0D9970] font-bold uppercase tracking-widest mb-1">Cross-post health</p>
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase">Social Stats</h1>
            <p className="font-sans text-sm text-[#555] mt-2 max-w-xl">
              Per-episode presence on <strong>YouTube</strong> and <strong>Facebook</strong>. Read this tab to find out which episodes need a re-upload, an FB cross-post, or both.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] px-4 py-2 font-mono text-sm font-bold uppercase flex items-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#0C0C0C] transition-all"
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#0C0C0C]" />
          </div>
        ) : (
          <>
          {data?.rows && (() => {
            const trackedRows = data.rows.filter((row) => row.epNumber >= 1 && row.epNumber <= 100);
            return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                {
                  label: "YouTube complete",
                  value: trackedRows.filter((row) => row.youtubeVideoId).length,
                  color: "#FF0000",
                  icon: <Youtube className="w-7 h-7" />,
                },
                {
                  label: "Facebook complete",
                  value: trackedRows.filter((row) => row.facebookVideoId).length,
                  color: "#1877F2",
                  icon: <Facebook className="w-7 h-7" />,
                },
                {
                  label: "Both platforms",
                  value: trackedRows.filter((row) => row.youtubeVideoId && row.facebookVideoId).length,
                  color: "#0D9970",
                  icon: <CheckPill ok />,
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[5px_5px_0_#0C0C0C] p-5"
                >
                  <div className="flex items-center justify-between" style={{ color: metric.color }}>
                    <span className="font-display uppercase text-sm">{metric.label}</span>
                    {metric.icon}
                  </div>
                  <div className="font-display text-6xl leading-none mt-3" style={{ color: metric.color }}>
                    {metric.value}<span className="text-2xl text-[#555]">/100</span>
                  </div>
                  <div className="font-mono text-xs uppercase text-[#555] mt-2">
                    {metric.value === 100 ? "100 complete" : `${100 - metric.value} remaining`}
                  </div>
                </div>
              ))}
            </div>
            );
          })()}
          <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="bg-[#0C0C0C] border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] inline-flex mb-6">
              <TabsTrigger
                value="youtube"
                className="font-display text-lg px-5 py-2 data-[state=active]:bg-[#FF0000] data-[state=active]:text-[#FAF7EE] text-[#999] flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" /> YOUTUBE
              </TabsTrigger>
              <TabsTrigger
                value="facebook"
                className="font-display text-lg px-5 py-2 data-[state=active]:bg-[#1877F2] data-[state=active]:text-[#FAF7EE] text-[#999] flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" /> FACEBOOK
              </TabsTrigger>
            </TabsList>
            <TabsContent value="youtube">
              <SocialTable rows={data?.rows ?? []} />
            </TabsContent>
            <TabsContent value="facebook">
              <SocialTable rows={data?.rows ?? []} />
            </TabsContent>
          </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
