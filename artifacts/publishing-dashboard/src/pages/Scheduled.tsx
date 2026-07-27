import React from "react";
import { differenceInDays, differenceInHours } from "date-fns";
import { Loader2, Clock, Calendar, CheckCircle2, XCircle, Bot } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useListEpisodes, customFetch } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { formatPKT } from "../lib/date";

interface SchedulerLogEntry {
  ts: string;
  epNumber: number;
  hookTitle: string;
  status: "success" | "failed";
  youtubeVideoId?: string;
  error?: string;
}

export default function Scheduled() {
  const [, navigate] = useLocation();
  const { data: episodes, isLoading } = useListEpisodes({ status: "scheduled" });
  const { data: schedulerData } = useQuery<{ log: SchedulerLogEntry[]; lastChecked: string | null }>({
    queryKey: ["/api/scheduler/log"],
    queryFn: () => customFetch("/api/scheduler/log"),
    refetchInterval: 60_000,
  });

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
              .sort((a, b) => {
                const aDate = a.scheduledPublishAt ?? a.postDate;
                const bDate = b.scheduledPublishAt ?? b.postDate;
                if (!aDate && !bDate) return 0;
                if (!aDate) return 1;
                if (!bDate) return -1;
                return aDate > bDate ? 1 : -1;
              })
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
                          <span className="font-mono text-xs font-bold text-[#0C0C0C] text-center">
                            {formatPKT(targetDate)}
                          </span>
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
        {/* ── Auto-Publish Engine Log ── */}
        <section className="mt-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[#0A6B52]" />
              <h2 className="font-display text-3xl text-[#0C0C0C] uppercase">Auto-Publish Engine</h2>
            </div>
            <span className="font-mono text-[10px] text-[#555] uppercase tracking-wider">
              {schedulerData?.lastChecked
                ? `Last checked: ${formatPKT(schedulerData.lastChecked)}`
                : "Not yet checked this session"}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0A6B52] animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-[#0A6B52] uppercase">Running · every 15 min</span>
            </div>
          </div>

          {!schedulerData?.log || schedulerData.log.length === 0 ? (
            <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] p-8 text-center shadow-[4px_4px_0_#0C0C0C]">
              <p className="font-mono text-sm text-[#555]">No auto-publish events yet this session. The engine runs every 15 minutes.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedulerData.log.map((entry, i) => (
                <div key={i} className={`flex items-center gap-4 px-5 py-3 border-[2px] border-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] font-mono text-xs ${
                  entry.status === "success" ? "bg-[#E8F5E9]" : "bg-[#FEE8E8]"
                }`}>
                  {entry.status === "success"
                    ? <CheckCircle2 size={16} className="text-[#0A6B52] shrink-0" />
                    : <XCircle size={16} className="text-[#C94A00] shrink-0" />}
                  <span className="font-bold text-[#555] shrink-0">{formatPKT(entry.ts)}</span>
                  <span className="font-bold text-[#0C0C0C]">EP {String(entry.epNumber).padStart(2, "0")}</span>
                  <span className="text-[#555] truncate">{entry.hookTitle}</span>
                  {entry.status === "success" && entry.youtubeVideoId && (
                    <a
                      href={`https://youtube.com/watch?v=${entry.youtubeVideoId}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="ml-auto shrink-0 text-[#C94A00] font-bold border border-[#C94A00] px-2 py-0.5 hover:bg-[#C94A00] hover:text-white transition-colors"
                    >
                      YT ↗
                    </a>
                  )}
                  {entry.status === "failed" && (
                    <span className="ml-auto shrink-0 text-[#C94A00] font-bold truncate max-w-xs">{entry.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
