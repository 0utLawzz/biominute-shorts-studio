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

const Row = ({ row, platform }: { row: SocialRow; platform: "youtube" | "facebook" }) => {
  const ytLinked = !!row.youtubeVideoId;
  const fbLinked = !!row.facebookVideoId;
  const showLinked = platform === "youtube" ? ytLinked : fbLinked;
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
        {platform === "youtube" ? (
          showLinked ? (
            <a
              href={`https://youtu.be/${row.youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9970] hover:underline inline-flex items-center gap-1"
            >
              {row.youtubeVideoId?.slice(0, 8)}…
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[#999]">—</span>
          )
        ) : showLinked ? (
          <a
            href={`https://www.facebook.com/watch/?v=${row.facebookVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9970] hover:underline inline-flex items-center gap-1"
          >
            {row.facebookVideoId?.slice(0, 6)}…
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[#999]">—</span>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-xs">
        {row.scheduledPublishAt || row.postDate
          ? formatPKT(row.scheduledPublishAt || row.postDate || "")
          : <span className="text-[#999]">—</span>}
      </td>
    </tr>
  );
};

const YouTubeTab = ({ rows }: { rows: SocialRow[] }) => {
  const linked = rows.filter((r) => r.youtubeVideoId);
  const notLinked = rows.filter((r) => !r.youtubeVideoId);
  return (
    <div className="space-y-8">
      <div className="bg-[#FF0000] text-white font-display text-xl px-4 py-2 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] inline-block -rotate-1">
        {linked.length} UPLOADED  ·  {notLinked.length} PENDING
      </div>
      <p className="font-sans text-sm text-[#555]">
        Every Ep 1–100 with a YouTube video ID shows the icon 🔴 that links to the uploaded video on the channel.
        Hover any cell to see what it means. Click the pills to drill in.
      </p>
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
              <th className="px-4 py-2 font-display uppercase text-xs">Scheduled (PKT)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => <Row key={row.epNumber} row={row} platform="youtube" />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FacebookTab = ({ rows }: { rows: SocialRow[] }) => {
  const linked = rows.filter((r) => r.facebookVideoId);
  const notLinked = rows.filter((r) => !r.facebookVideoId);
  return (
    <div className="space-y-8">
      <div className="bg-[#1877F2] text-white font-display text-xl px-4 py-2 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] inline-block -rotate-1">
        {linked.length} POSTED  ·  {notLinked.length} PENDING
      </div>
      <p className="font-sans text-sm text-[#555]">
        Facebook cross-post is currently manual via <code className="font-mono bg-[#E2DDD0] px-1">fb-schedule</code>.
        Icon 🔵 means a Facebook post ID is recorded in the DB; ✗ means it has not been cross-posted yet.
      </p>
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
              <th className="px-4 py-2 font-display uppercase text-xs">Facebook link</th>
              <th className="px-4 py-2 font-display uppercase text-xs">Publish Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => <Row key={row.epNumber} row={row} platform="facebook" />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function SocialStatus() {
  const { data, isLoading, refetch, isFetching } = useQuery<SocialRowsResponse>({
    queryKey: ["/api/episodes/social-rows"],
    queryFn: () => customFetch("/api/episodes/social-rows"),
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
              <YouTubeTab rows={data?.rows ?? []} />
            </TabsContent>
            <TabsContent value="facebook">
              <FacebookTab rows={data?.rows ?? []} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
