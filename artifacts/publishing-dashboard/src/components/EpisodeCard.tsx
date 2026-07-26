import React from "react";
import { Episode } from "@workspace/api-client-react";
import { StatusBadge } from "./StatusBadge";
import { Link } from "wouter";
import { Calendar, PlaySquare } from "lucide-react";
import { formatPKT } from "../lib/date";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link href={`/episodes/${episode.id}`}>
      <div className="brutal-card p-5 cursor-pointer flex flex-col h-full bg-[#FAF7EE] hover:bg-white group">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-[#C94A00] text-white font-display text-4xl px-3 py-1 border-[3px] border-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] -rotate-2 group-hover:rotate-0 transition-transform">
            EP {episode.epNumber}
          </div>
          <StatusBadge status={episode.status} />
        </div>
        
        <h3 className="font-display text-2xl text-[#0C0C0C] leading-none mb-2 line-clamp-2" title={episode.hookTitle}>
          {episode.hookTitle}
        </h3>
        
        <p className="font-sans text-sm text-[#555] line-clamp-2 mb-4 flex-grow" title={episode.youtubeTitle}>
          {episode.youtubeTitle}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-xs bg-[#E2DDD0] border-2 border-[#0C0C0C] px-2 py-0.5 shadow-[2px_2px_0_#0C0C0C]">
              Season {episode.season}
            </span>
            <span className="font-mono text-xs bg-[#E2DDD0] border-2 border-[#0C0C0C] px-2 py-0.5 shadow-[2px_2px_0_#0C0C0C] flex items-center gap-1">
              <PlaySquare className="w-3 h-3" />
              {episode.duration}
            </span>
          </div>

          <div className="h-[3px] w-full bg-[#0C0C0C] opacity-20"></div>

          <div className="flex justify-between items-center text-xs font-mono text-[#0C0C0C] font-bold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0A6B52]" />
              {formatPKT(episode.postDate)}
            </div>
            {episode.status === "complete" && (
              <span className="text-[#0A6B52] uppercase tracking-wider">Complete</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
