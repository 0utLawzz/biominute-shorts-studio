import React, { useState } from "react";
import { format } from "date-fns";
import { Loader2, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useListEpisodes, useGetEpisodeStats } from "@workspace/api-client-react";
import { Link } from "wouter";

const SEASONS = [
  { key: "all", label: "All" },
  { key: "S1: Morning Habits", label: "S1" },
  { key: "S2: Movement & Body", label: "S2" },
  { key: "S3: Sleep & Recovery", label: "S3" },
  { key: "S4: Stress & Mind", label: "S4" },
  { key: "S5: Nutrition & Myths", label: "S5" },
  { key: "S6: Healthy Aging & Longevity", label: "S6" },
];

export default function Published() {
  const [activeSeason, setActiveSeason] = useState("all");
  const { data: episodes, isLoading } = useListEpisodes({
    status: "published",
    season: activeSeason === "all" ? undefined : activeSeason,
  });
  const { data: stats } = useGetEpisodeStats();

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-[#8B2FC9] font-bold uppercase tracking-widest mb-1">All Episodes</p>
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase">Published</h1>
          </div>
          <div className="bg-[#8B2FC9] text-white font-display text-xl px-4 py-1 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] -rotate-1">
            {stats?.byStatus.published ?? "…"} TOTAL
          </div>
        </div>

        {/* Season filter */}
        <div className="flex mb-8 border-[3px] border-[#0C0C0C] bg-[#FAF7EE] shadow-[4px_4px_0_#0C0C0C] w-fit">
          {SEASONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSeason(s.key)}
              className={`font-mono font-bold px-5 py-2 uppercase text-sm border-r-[3px] border-[#0C0C0C] last:border-r-0 transition-colors ${
                activeSeason === s.key ? "bg-[#8B2FC9] text-white" : "hover:bg-[#E2DDD0] text-[#0C0C0C]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#0C0C0C]" />
          </div>
        ) : !episodes || episodes.length === 0 ? (
          <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] p-16 text-center shadow-[5px_5px_0_#0C0C0C]">
            <p className="font-display text-4xl text-[#0C0C0C] mb-3">NONE PUBLISHED YET</p>
            <p className="font-mono text-sm text-[#555]">
              {activeSeason !== "all" ? "No published episodes in this season." : "Start by approving and scheduling episodes."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {episodes
              .sort((a, b) => (b.epNumber ?? 0) - (a.epNumber ?? 0))
              .map((ep) => (
                <Link key={ep.id} href={`/episodes/${ep.id}`}>
                  <div className="flex items-center gap-0 bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#0C0C0C] transition-all cursor-pointer">
                    {/* Episode number */}
                    <div className="w-20 shrink-0 bg-[#8B2FC9] flex items-center justify-center py-4 border-r-[3px] border-[#0C0C0C]">
                      <span className="font-display text-3xl text-white">{String(ep.epNumber).padStart(2, "0")}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 px-5 py-3">
                      <p className="font-sans font-semibold text-sm text-[#0C0C0C] line-clamp-1">{ep.hookTitle}</p>
                      <p className="font-mono text-xs text-[#555] mt-0.5">{ep.season.split(":")[0]?.trim()}</p>
                    </div>

                    {/* Published date */}
                    <div className="shrink-0 px-5 py-3 border-l-[3px] border-[#0C0C0C]">
                      {ep.publishedAt && (
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-xs font-bold text-[#0C0C0C]">
                            {format(new Date(ep.publishedAt), "MMM d, yyyy")}
                          </span>
                          <span className="font-mono text-[10px] text-[#555]">published</span>
                        </div>
                      )}
                    </div>

                    {/* YouTube link */}
                    <div className="shrink-0 px-5 py-3 border-l-[3px] border-[#0C0C0C]">
                      {ep.youtubeVideoId ? (
                        <a
                          href={`https://youtube.com/watch?v=${ep.youtubeVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#C94A00] border-[2px] border-[#C94A00] px-3 py-1.5 hover:bg-[#C94A00] hover:text-white transition-colors"
                        >
                          <ExternalLink size={11} />
                          YouTube
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-[#999]">No video ID</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
