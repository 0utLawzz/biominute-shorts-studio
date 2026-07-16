import React, { useState } from "react";
import { 
  useGetEpisodeStats, 
  useListEpisodes, 
  useGetUpcomingEpisodes,
  ListEpisodesStatus 
} from "@workspace/api-client-react";
import { EpisodeCard } from "../components/EpisodeCard";
import { Navbar } from "../components/Navbar";
import { YouTubeBanner } from "../components/YouTubeBanner";
import { format, differenceInDays } from "date-fns";
import { Loader2, PlusCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<ListEpisodesStatus | "all">("all");

  const SEASONS = [
    { key: "all", label: "All" },
    { key: "S1: Morning Habits", label: "S1" },
    { key: "S2: Movement & Body", label: "S2" },
    { key: "S3: Sleep & Recovery", label: "S3" },
    { key: "S4: Stress & Mind", label: "S4" },
    { key: "S5: Nutrition & Myths", label: "S5" },
    { key: "S6: Healthy Aging & Longevity", label: "S6" },
  ];

  const STATUS_FILTERS = [
    "all", "draft", "review", "approved", "scheduled", "published", "building", "rejected"
  ] as const;

  const { data: stats, isLoading: statsLoading } = useGetEpisodeStats();
  const { data: upcoming, isLoading: upcomingLoading } = useGetUpcomingEpisodes();
  const { data: episodes, isLoading: episodesLoading } = useListEpisodes({ 
    season: activeSeason === "all" ? undefined : activeSeason, 
    status: activeStatus === "all" ? undefined : activeStatus 
  });

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <YouTubeBanner />

      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* STATS HEADER */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase tracking-wide">
              Overview
            </h1>
            <div className="flex items-center gap-3">
              <div className="bg-[#D4A800] text-[#0C0C0C] font-display text-xl px-4 py-1 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] rotate-1">
                STATUS REPORT
              </div>
              <Link href="/new">
                <span className="flex items-center gap-2 bg-[#0C0C0C] text-[#FAF7EE] font-mono font-bold text-xs px-4 py-2 border-[2px] border-[#0C0C0C] shadow-[3px_3px_0_#C9A800] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer uppercase">
                  <PlusCircle size={14} />
                  New Episode
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Total" value={stats?.total} loading={statsLoading} color="bg-[#FAF7EE]" />
            <StatCard label="Published" value={stats?.byStatus.published} loading={statsLoading} color="bg-[#FAF7EE]" textColor="text-[#8B2FC9]" />
            <StatCard label="Approved" value={stats?.byStatus.approved} loading={statsLoading} color="bg-[#FAF7EE]" textColor="text-[#0A6B52]" />
            <StatCard label="Building" value={stats?.byStatus.building} loading={statsLoading} color="bg-[#FAF7EE]" textColor="text-[#C9A800]" href="/building" />
            <StatCard label="Scheduled" value={stats?.byStatus.scheduled} loading={statsLoading} color="bg-[#FAF7EE]" textColor="text-[#0A6B52]" href="/scheduled" />
          </div>
        </section>

        {/* UPCOMING STRIP */}
        <section className="mb-14 relative">
          <div className="absolute -top-3 -left-3 bg-[#0A6B52] text-white font-mono font-bold text-sm px-3 py-1 border-[2.5px] border-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] -rotate-3 z-10">
            NEXT UP
          </div>
          <div className="bg-[#E2DDD0] border-[3px] border-[#0C0C0C] p-6 shadow-[5px_5px_0_#0C0C0C]">
            {upcomingLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-[#0C0C0C]" /></div>
            ) : upcoming && upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcoming.slice(0, 3).map((ep) => {
                  const days = differenceInDays(new Date(ep.postDate), new Date());
                  const daysLabel = days < 0 ? "PAST DUE" : days === 0 ? "TODAY" : `IN ${days} DAYS`;
                  const daysStyle = days < 0 ? "text-[#8B2FC9] border-[#8B2FC9]" : "text-[#C94A00] border-[#0C0C0C]";
                  return (
                    <div key={ep.id} className="bg-[#FAF7EE] border-2 border-[#0C0C0C] p-4 flex flex-col justify-between shadow-[3px_3px_0_#0C0C0C]">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-display text-2xl text-[#0C0C0C]">EP {ep.epNumber}</span>
                          <span className={`font-mono text-xs font-bold bg-[#FAF7EE] border-2 px-2 py-0.5 ${daysStyle}`}>
                            {daysLabel}
                          </span>
                        </div>
                        <p className="font-sans font-medium text-sm line-clamp-2">{ep.hookTitle}</p>
                      </div>
                      <div className="mt-4 font-mono text-xs text-[#555] font-bold">
                        {format(new Date(ep.postDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center font-mono font-bold text-[#555] py-4 uppercase">
                No upcoming episodes scheduled
              </div>
            )}
          </div>
        </section>

        {/* FULL LIST */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-4xl text-[#0C0C0C]">Episode Library</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Season Tabs */}
              <div className="flex border-[3px] border-[#0C0C0C] bg-[#FAF7EE] shadow-[3px_3px_0_#0C0C0C] flex-wrap">
                {SEASONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSeason(s.key)}
                    className={`font-mono font-bold px-4 py-1.5 uppercase text-sm border-r-[3px] border-[#0C0C0C] last:border-r-0 transition-colors ${
                      activeSeason === s.key ? "bg-[#C94A00] text-white" : "hover:bg-[#E2DDD0] text-[#0C0C0C]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status as any)}
                    className={`font-mono text-xs font-bold px-3 py-1.5 uppercase border-[2px] border-[#0C0C0C] shadow-[2px_2px_0_#0C0C0C] transition-all
                      ${activeStatus === status 
                        ? "bg-[#0C0C0C] text-[#FAF7EE] translate-x-[2px] translate-y-[2px] shadow-none" 
                        : "bg-[#FAF7EE] text-[#0C0C0C] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0_#0C0C0C]"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {episodesLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-[#0C0C0C]" /></div>
          ) : episodes && episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {episodes.map(ep => (
                <EpisodeCard key={ep.id} episode={ep} />
              ))}
            </div>
          ) : (
             <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] p-12 text-center shadow-[5px_5px_0_#0C0C0C]">
                <p className="font-display text-2xl text-[#0C0C0C]">NO EPISODES FOUND</p>
                <p className="font-mono text-sm text-[#555] mt-2">Try adjusting your filters.</p>
             </div>
          )}
        </section>

      </main>
    </div>
  );
}

function StatCard({ label, value, loading, color, textColor = "text-[#0C0C0C]", href }: { 
  label: string; value?: number | string; loading: boolean; color: string; textColor?: string; href?: string;
}) {
  const content = (
    <div className={`${color} border-[3px] border-[#0C0C0C] p-5 shadow-[4px_4px_0_#0C0C0C] ${href ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0C0C0C] transition-all cursor-pointer" : ""}`}>
      <p className="font-mono text-xs font-bold uppercase text-[#555] mb-1">{label}</p>
      {loading ? (
         <div className="h-10 flex items-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
      ) : (
        <p className={`font-display text-5xl leading-none ${textColor}`}>{value ?? 0}</p>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
