import React, { useState } from "react";
import { PlusCircle, Clock, CheckCircle2, Hammer, CalendarCheck, FileText, Search, Filter } from "lucide-react";

export function StatusBands() {
  const [activeSeason, setActiveSeason] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [selectedEp, setSelectedEp] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#EDEAE0] text-[#0C0C0C] font-sans pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap');
        
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        .font-sans { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* TOP NAVIGATION / SUMMARY */}
      <header className="bg-[#0C0C0C] text-[#FAF7EE] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="font-display text-2xl tracking-widest flex items-baseline gap-1">
            <span>BIOMINUTE</span><span className="text-[#C94A00]">.</span><span className="text-[#0D9970]">SHORTS</span>
          </div>
          <div className="h-6 w-px bg-[#333]" />
          <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-[#999]">Publishing Board</h1>
        </div>

        <div className="flex gap-4">
          {Object.entries(STATS.byStatus).map(([status, count]) => {
            const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase">
                <Icon size={12} color={config.color} />
                <span className="text-[#999]">{status}</span>
                <span className="tabular-nums text-[#FAF7EE] bg-[#222] px-1.5 py-0.5 rounded-sm">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#C9A800] text-[#0C0C0C] font-mono font-bold text-xs px-4 py-2 border-[2px] border-[#C9A800] hover:bg-[#FAF7EE] hover:border-[#FAF7EE] transition-colors uppercase">
            <PlusCircle size={14} />
            New Episode
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pt-10">
        
        {/* COMPACT FILTER RAIL */}
        <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[2px] border-[#0C0C0C] pb-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#0C0C0C]" />
            <div className="flex bg-[#FAF7EE] border-[2px] border-[#0C0C0C] shadow-[2px_2px_0_#0C0C0C]">
              {SEASONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSeason(s.key)}
                  className={`font-mono font-bold px-3 py-1.5 uppercase text-[10px] border-r-[2px] border-[#0C0C0C] last:border-r-0 transition-colors ${
                    activeSeason === s.key ? "bg-[#0C0C0C] text-[#FAF7EE]" : "hover:bg-[#E2DDD0] text-[#0C0C0C]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input 
                type="text" 
                placeholder="Search episodes..." 
                className="font-mono text-xs bg-[#FAF7EE] border-[2px] border-[#0C0C0C] shadow-[2px_2px_0_#0C0C0C] pl-9 pr-4 py-1.5 outline-none focus:border-[#C94A00] focus:shadow-[2px_2px_0_#C94A00] transition-all w-64"
              />
            </div>

            <div className="flex gap-1 ml-4">
              {["all", ...Object.keys(STATUS_CONFIG)].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`font-mono text-[10px] font-bold px-2.5 py-1 uppercase border-[2px] transition-all
                    ${activeStatus === status 
                      ? "bg-[#0C0C0C] border-[#0C0C0C] text-[#FAF7EE] shadow-[2px_2px_0_#0C0C0C]" 
                      : "bg-[#FAF7EE] border-[#0C0C0C] text-[#0C0C0C] hover:-translate-y-[1px] shadow-[2px_2px_0_#0C0C0C] opacity-70 hover:opacity-100"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* EPISODE GRID BY SEASON */}
        <div className="space-y-16">
          {SEASONS.filter(s => s.key !== "all" && (activeSeason === "all" || activeSeason === s.key)).map(season => {
            const seasonEps = EPISODES.filter(ep => 
              ep.season === season.key && 
              (activeStatus === "all" || ep.status === activeStatus)
            );

            if (seasonEps.length === 0) return null;

            return (
              <section key={season.key}>
                <div className="flex items-baseline gap-4 mb-6">
                  <h2 className="font-display text-4xl text-[#0C0C0C] uppercase tracking-wide">{season.fullLabel}</h2>
                  <span className="font-mono text-xs font-bold text-[#555] bg-[#E2DDD0] px-2 py-0.5 rounded-sm">{seasonEps.length} EPISODES</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                  {seasonEps.map(ep => {
                    const config = STATUS_CONFIG[ep.status as keyof typeof STATUS_CONFIG];
                    const isSelected = selectedEp === ep.id;
                    const StatusIcon = config.icon;

                    return (
                      <div 
                        key={ep.id}
                        onClick={() => setSelectedEp(isSelected ? null : ep.id)}
                        className={`relative bg-[#FAF7EE] border-[2px] border-[#0C0C0C] flex flex-col cursor-pointer transition-all duration-200 ease-out
                          ${isSelected 
                            ? "shadow-[8px_8px_0_#0C0C0C] -translate-y-2 -translate-x-2 ring-2 ring-[#0C0C0C] ring-offset-2 ring-offset-[#EDEAE0]" 
                            : "shadow-[4px_4px_0_#0C0C0C] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#0C0C0C]"
                          }
                        `}
                      >
                        {/* Status Edge Treatment */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 border-r-[2px] border-[#0C0C0C]" 
                          style={{ backgroundColor: config.color }} 
                        />
                        
                        <div className="pl-5 p-4 flex flex-col h-full min-h-[160px]">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <span className="font-display text-3xl text-[#0C0C0C] leading-none shrink-0">EP {ep.epNumber}</span>
                            <span 
                              className="font-mono text-[9px] uppercase font-bold border-[1.5px] border-[#0C0C0C] px-1.5 py-0.5 flex items-center gap-1 bg-[#FAF7EE]"
                              style={{ color: config.color }}
                            >
                              <StatusIcon size={10} />
                              {ep.status}
                            </span>
                          </div>
                          
                          <h3 className="font-sans font-bold text-base leading-snug text-[#0C0C0C] mb-4 flex-grow">
                            {ep.title}
                          </h3>
                          
                          <div className="flex items-center justify-between border-t-[1.5px] border-[#E2DDD0] pt-3 mt-auto">
                            <div className="font-mono text-[10px] font-bold text-[#555] uppercase">
                              {ep.date ? ep.date : <span className="text-[#C94A00]">Unscheduled</span>}
                            </div>
                            <div className="font-mono text-[10px] font-bold text-[#0C0C0C] bg-[#E2DDD0] px-1.5 py-0.5">
                              {ep.duration}
                            </div>
                          </div>

                          {/* Expanded Attention State */}
                          {isSelected && (
                            <div className="absolute top-full left-[-2px] right-[-2px] mt-3 bg-[#0C0C0C] border-[2px] border-[#0C0C0C] p-4 shadow-[8px_8px_0_#C9A800] z-20 flex justify-between items-center text-[#FAF7EE] animate-in fade-in slide-in-from-top-2">
                              <div className="font-mono text-xs flex gap-4">
                                <button className="hover:text-[#C9A800] hover:underline underline-offset-4 transition-colors">Edit Script</button>
                                <button className="hover:text-[#C9A800] hover:underline underline-offset-4 transition-colors">View Assets</button>
                              </div>
                              <button className="bg-[#C9A800] text-[#0C0C0C] font-mono text-[10px] font-bold px-3 py-1.5 uppercase hover:bg-[#FAF7EE] transition-colors">
                                Publish Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

// --- MOCK DATA & CONFIG ---

const STATUS_CONFIG = {
  published: { color: "#8B2FC9", icon: CheckCircle2 },
  complete: { color: "#0A6B52", icon: CalendarCheck },
  scheduled: { color: "#0D9970", icon: Clock },
  building: { color: "#C9A800", icon: Hammer },
  scripted: { color: "#C94A00", icon: FileText },
  draft: { color: "#C94A00", icon: FileText },
};

const STATS = {
  total: 82,
  byStatus: {
    published: 45,
    complete: 12,
    scheduled: 8,
    building: 5,
    scripted: 8,
    draft: 4
  }
};

const SEASONS = [
  { key: "all", label: "All", fullLabel: "All Seasons" },
  { key: "s1", label: "S1", fullLabel: "S1: Morning Habits" },
  { key: "s2", label: "S2", fullLabel: "S2: Movement & Body" },
  { key: "s3", label: "S3", fullLabel: "S3: Sleep & Recovery" },
  { key: "s4", label: "S4", fullLabel: "S4: Stress & Mind" },
];

const EPISODES = [
  // S1
  { id: 1, epNumber: "101", title: "Why You Wake Up Tired (And How to Fix It)", season: "s1", status: "published", date: "OCT 01, 2023", duration: "0:58" },
  { id: 2, epNumber: "102", title: "The 90-Minute Sleep Cycle Myth", season: "s1", status: "published", date: "OCT 08, 2023", duration: "1:02" },
  { id: 3, epNumber: "103", title: "Caffeine Timing: The 90-Minute Rule", season: "s1", status: "published", date: "OCT 15, 2023", duration: "0:55" },
  { id: 4, epNumber: "104", title: "Stop Hitting Snooze: The Neuroscience", season: "s1", status: "published", date: "OCT 22, 2023", duration: "1:01" },
  
  // S2
  { id: 5, epNumber: "201", title: "Static Stretching is Making You Weaker", season: "s2", status: "scheduled", date: "NOV 05, 2023", duration: "1:05" },
  { id: 6, epNumber: "202", title: "The Truth About 10,000 Steps", season: "s2", status: "complete", date: "NOV 12, 2023", duration: "0:59" },
  { id: 7, epNumber: "203", title: "How Sitting Destroys Your Hip Flexors", season: "s2", status: "building", date: "NOV 19, 2023", duration: "1:00" },
  { id: 8, epNumber: "204", title: "Foam Rolling vs. Dynamic Warmups", season: "s2", status: "building", date: "NOV 26, 2023", duration: "0:54" },
  { id: 9, epNumber: "205", title: "Is Running Bad For Your Knees?", season: "s2", status: "scripted", date: null, duration: "1:10" },

  // S3
  { id: 10, epNumber: "301", title: "Mouth Taping for Better Sleep?", season: "s3", status: "draft", date: null, duration: "0:50" },
  { id: 11, epNumber: "302", title: "Why Melatonin Supplements Don't Work", season: "s3", status: "scripted", date: null, duration: "1:04" },
  { id: 12, epNumber: "303", title: "The Optimal Temperature for Deep Sleep", season: "s3", status: "draft", date: null, duration: "0:55" },
  { id: 13, epNumber: "304", title: "Magnesium Threonate vs Glycinate", season: "s3", status: "draft", date: null, duration: "1:02" },

  // S4
  { id: 14, epNumber: "401", title: "Physiological Sighs: Real-time Stress Relief", season: "s4", status: "draft", date: null, duration: "0:58" },
  { id: 15, epNumber: "402", title: "The Cortisol Spike: Friend or Foe?", season: "s4", status: "draft", date: null, duration: "1:05" },
];
