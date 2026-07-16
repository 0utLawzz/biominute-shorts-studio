import React from "react";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { Loader2, Clock, Calendar } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useListEpisodes } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export default function Scheduled() {
  const [, navigate] = useLocation();
  const { data: episodes, isLoading } = useListEpisodes({ status: "scheduled" });

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-[#0A6B52] font-bold uppercase tracking-widest mb-1">Publishing Queue</p>
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase">Scheduled</h1>
          </div>
          <div className="bg-[#0A6B52] text-white font-display text-xl px-4 py-1 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] rotate-1">
            {isLoading ? "…" : episodes?.length ?? 0} QUEUED
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#0C0C0C]" />
          </div>
        ) : !episodes || episodes.length === 0 ? (
          <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] p-16 text-center shadow-[5px_5px_0_#0C0C0C]">
            <p className="font-display text-4xl text-[#0C0C0C] mb-3">NOTHING SCHEDULED</p>
            <p className="font-mono text-sm text-[#555]">Approved episodes can be scheduled from their detail page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes
              .sort((a, b) => (a.scheduledPublishAt ?? a.postDate) > (b.scheduledPublishAt ?? b.postDate) ? 1 : -1)
              .map((ep) => {
                const targetDate = ep.scheduledPublishAt
                  ? new Date(ep.scheduledPublishAt)
                  : ep.postDate
                  ? new Date(ep.postDate)
                  : null;
                const days = targetDate ? differenceInDays(targetDate, new Date()) : null;
                const hours = targetDate ? differenceInHours(targetDate, new Date()) : null;
                const isPast = days !== null && days < 0;
                const isToday = days !== null && days === 0;
                const isSoon = days !== null && days <= 3 && days > 0;

                return (
                  <div
                    key={ep.id}
                    onClick={() => navigate(`/episodes/${ep.id}`)}
                    className="flex items-center gap-0 bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0C0C0C] transition-all cursor-pointer"
                  >
                      {/* Countdown badge */}
                      <div className={`w-28 shrink-0 flex flex-col items-center justify-center py-6 border-r-[3px] border-[#0C0C0C] ${
                        isPast ? "bg-[#C94A00]" : isToday ? "bg-[#C9A800]" : isSoon ? "bg-[#0A6B52]" : "bg-[#0C0C0C]"
                      }`}>
                        {isPast ? (
                          <span className="font-mono text-xs font-bold text-white uppercase">PAST DUE</span>
                        ) : isToday ? (
                          <>
                            <Clock size={18} className="text-[#0C0C0C] mb-1" />
                            <span className="font-mono text-xs font-bold text-[#0C0C0C] uppercase">Today</span>
                            <span className="font-mono text-[10px] text-[#0C0C0C]">{hours}h</span>
                          </>
                        ) : (
                          <>
                            <span className="font-display text-4xl text-white leading-none">{days}</span>
                            <span className="font-mono text-xs text-white font-bold uppercase">days</span>
                          </>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-6 py-4">
                        <div className="flex items-start gap-4 mb-1">
                          <span className="font-display text-3xl text-[#0C0C0C]">EP {String(ep.epNumber).padStart(2, "0")}</span>
                          <span className="font-mono text-xs text-[#555] font-bold pt-1.5">{ep.season.split(":")[0]?.trim()}</span>
                        </div>
                        <p className="font-sans font-semibold text-sm text-[#0C0C0C] line-clamp-1">{ep.hookTitle}</p>
                      </div>

                      {/* Date */}
                      <div className="shrink-0 px-6 py-4 border-l-[3px] border-[#0C0C0C] flex flex-col items-center gap-1">
                        <Calendar size={16} className="text-[#555]" />
                        {targetDate && (
                          <>
                            <span className="font-mono text-xs font-bold text-[#0C0C0C]">
                              {format(targetDate, "MMM d")}
                            </span>
                            <span className="font-mono text-xs text-[#555]">
                              {format(targetDate, "yyyy")}
                            </span>
                            {ep.scheduledPublishAt && (
                              <span className="font-mono text-[10px] text-[#0A6B52] font-bold">
                                {format(targetDate, "HH:mm")} UTC
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* YouTube badge */}
                      <div className="shrink-0 px-6 py-4 border-l-[3px] border-[#0C0C0C]">
                        {ep.youtubeVideoId ? (
                          <a
                            href={`https://youtube.com/watch?v=${ep.youtubeVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-xs font-bold text-[#C94A00] border-[2px] border-[#C94A00] px-3 py-1.5 hover:bg-[#C94A00] hover:text-white transition-colors"
                          >
                            YT ↗
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-[#999] font-bold">Not uploaded</span>
                        )}
                      </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
