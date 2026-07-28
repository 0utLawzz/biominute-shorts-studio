import React, { useState } from "react";
import { PlusCircle, Activity, CheckCircle2, Clock, Hammer, CalendarCheck, AlertTriangle, Play, MoreHorizontal, Filter, Search, FileVideo } from "lucide-react";
import "./styles.css";

// --- MOCK DATA ---
const STATS = {
  total: 142,
  published: 84,
  complete: 12,
  building: 3,
  scheduled: 8,
  draft: 35
};

const QUEUE_EPISODES = [
  {
    id: "ep-604",
    season: "S6",
    epNumber: 604,
    title: "The Truth About Telomeres and Cellular Aging",
    status: "building",
    postDate: "2024-05-10T14:00:00Z",
    daysOut: -1,
    duration: "00:58",
    urgent: true,
    action: "Review Render"
  },
  {
    id: "ep-605",
    season: "S6",
    epNumber: 605,
    title: "Why We Lose Muscle (And How to Stop It)",
    status: "complete",
    postDate: "2024-05-12T14:00:00Z",
    daysOut: 1,
    duration: "00:59",
    urgent: false,
    action: "Schedule"
  },
  {
    id: "ep-606",
    season: "S6",
    epNumber: 606,
    title: "Fasting for Longevity: What the Science Says",
    status: "draft",
    postDate: "2024-05-14T14:00:00Z",
    daysOut: 3,
    duration: "--:--",
    urgent: false,
    action: "Edit Script"
  }
];

const LIBRARY_EPISODES = [
  { id: "ep-607", season: "S6", epNumber: 607, title: "Sleep and Aging: The Cognitive Connection", status: "scheduled", postDate: "2024-05-16T14:00:00Z", duration: "01:00" },
  { id: "ep-608", season: "S6", epNumber: 608, title: "Can Supplements Actually Extend Life?", status: "scheduled", postDate: "2024-05-18T14:00:00Z", duration: "00:57" },
  { id: "ep-609", season: "S6", epNumber: 609, title: "The Role of Heat and Cold Exposure", status: "draft", postDate: "2024-05-20T14:00:00Z", duration: "--:--" },
  { id: "ep-610", season: "S6", epNumber: 610, title: "Blue Zones: Myth vs. Reality", status: "draft", postDate: "2024-05-22T14:00:00Z", duration: "--:--" },
  { id: "ep-603", season: "S6", epNumber: 603, title: "Understanding NAD+ and Energy", status: "published", postDate: "2024-05-08T14:00:00Z", duration: "00:59" },
  { id: "ep-602", season: "S6", epNumber: 602, title: "The Inflammation Theory of Disease", status: "published", postDate: "2024-05-06T14:00:00Z", duration: "00:55" },
  { id: "ep-601", season: "S6", epNumber: 601, title: "Introduction to Healthy Aging", status: "published", postDate: "2024-05-04T14:00:00Z", duration: "01:00" },
];

const STATUS_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  published: { bg: "#8B2FC9", text: "#FFFFFF", border: "#0C0C0C" },
  complete: { bg: "#0A6B52", text: "#FFFFFF", border: "#0C0C0C" },
  building: { bg: "#C9A800", text: "#0C0C0C", border: "#0C0C0C" },
  scheduled: { bg: "#0D9970", text: "#FFFFFF", border: "#0C0C0C" },
  draft: { bg: "#E2DDD0", text: "#555555", border: "#0C0C0C" }
};

export function ProductionQueue() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="biominute-theme pb-20">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 h-[58px] bg-[var(--foreground)] border-b-[3px] border-[var(--foreground)] flex items-center px-6 gap-6">
        <div className="flex items-center gap-1 font-display text-2xl tracking-widest cursor-pointer shrink-0">
          <span className="text-[var(--card)]">BIOMINUTE</span>
          <span className="text-[var(--secondary)]">.</span>
          <span className="text-[var(--primary)]">SHORTS</span>
        </div>

        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5 bg-[#1a1a1a] border-[1.5px] border-[#333] px-2 py-1">
            <Activity size={12} className="text-[var(--accent)]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
              3 RENDERING
            </span>
          </div>

          <div className="flex items-center gap-1">
            <StatusPill label="PUB" count={STATS.published} color="#8B2FC9" />
            <StatusPill label="CMP" count={STATS.complete} color="#0A6B52" />
            <StatusPill label="BLD" count={STATS.building} color="#C9A800" />
            <StatusPill label="SCH" count={STATS.scheduled} color="#0D9970" />
          </div>
        </div>

        <button className="shrink-0 flex items-center gap-2 bg-[var(--accent)] text-[var(--foreground)] font-mono font-bold text-xs px-4 py-2 border-[2px] border-[var(--foreground)] shadow-brutal-sm hover-brutal btn-brutal uppercase ml-auto lg:ml-4">
          <PlusCircle size={14} />
          New Episode
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-[var(--foreground)] leading-none uppercase">
              Production Queue
            </h1>
            <p className="font-mono text-sm text-[#555] uppercase tracking-widest mt-2">
              Focus on what needs attention next.
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="bg-[var(--card)] px-4 py-2 border-[2px] border-[var(--foreground)] shadow-brutal-sm flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#555] uppercase font-bold">In Draft</span>
                <span className="font-display text-2xl leading-none">{STATS.draft}</span>
              </div>
              <div className="w-px h-8 bg-[var(--foreground)] opacity-20"></div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-bold">Building</span>
                <span className="font-display text-2xl leading-none">{STATS.building}</span>
              </div>
              <div className="w-px h-8 bg-[var(--foreground)] opacity-20"></div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[var(--primary)] uppercase font-bold">Complete</span>
                <span className="font-display text-2xl leading-none">{STATS.complete}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE QUEUE */}
        <section className="mb-16 relative">
          <div className="absolute -top-4 -left-3 bg-[var(--foreground)] text-[var(--card)] font-mono font-bold text-sm px-4 py-1.5 border-[2px] border-[var(--foreground)] shadow-brutal-sm -rotate-2 z-10 uppercase tracking-wider">
            Action Required
          </div>
          
          <div className="bg-[var(--muted)] brutal-border-thick p-6 pt-8 shadow-brutal-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {QUEUE_EPISODES.map((ep, i) => (
                <div key={ep.id} className="bg-[var(--card)] brutal-border flex flex-col shadow-brutal-sm hover-brutal btn-brutal relative group">
                  {ep.urgent && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--secondary)] brutal-border rounded-full animate-pulse"></div>
                  )}
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start p-4 border-b-[2px] border-[var(--foreground)] bg-white">
                    <div>
                      <div className="font-mono text-[10px] font-bold text-[#555] mb-1">{ep.season}</div>
                      <div className="font-display text-3xl leading-none">EP {ep.epNumber}</div>
                    </div>
                    <div className={`font-mono text-[10px] font-bold px-2 py-1 brutal-border uppercase`}
                         style={{ backgroundColor: STATUS_COLORS[ep.status].bg, color: STATUS_COLORS[ep.status].text }}>
                      {ep.status}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <p className="font-sans font-bold text-base leading-snug mb-4 line-clamp-3">
                      {ep.title}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-mono mb-4">
                      <span className={ep.daysOut < 0 ? "text-[var(--secondary)] font-bold" : "text-[#555]"}>
                        {ep.daysOut < 0 ? `LATE BY ${Math.abs(ep.daysOut)}D` : `DUE IN ${ep.daysOut}D`}
                      </span>
                      <span className="text-[#555]">{ep.duration}</span>
                    </div>

                    <button className="w-full bg-[var(--foreground)] text-[var(--card)] font-mono font-bold uppercase text-xs py-2.5 brutal-border btn-brutal active-brutal flex items-center justify-center gap-2 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                      {ep.status === "building" ? <Hammer size={14} /> : <Play size={14} />}
                      {ep.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIBRARY LIST / DENSE TABLE */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="font-display text-4xl text-[var(--foreground)]">Full Library</h2>
            
            <div className="flex gap-4">
              <div className="flex items-center bg-[var(--card)] brutal-border shadow-brutal-sm px-3 py-1.5 w-64">
                <Search size={14} className="text-[#555] mr-2" />
                <input 
                  type="text" 
                  placeholder="SEARCH EPISODES..." 
                  className="bg-transparent border-none outline-none font-mono text-xs w-full uppercase placeholder:text-[#888]"
                />
              </div>
              <button className="bg-[var(--card)] brutal-border shadow-brutal-sm px-3 py-1.5 flex items-center gap-2 hover-brutal btn-brutal">
                <Filter size={14} />
                <span className="font-mono text-xs font-bold uppercase">Filter</span>
              </button>
            </div>
          </div>

          <div className="bg-[var(--card)] brutal-border-thick shadow-brutal flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-[80px_100px_1fr_120px_100px_60px] gap-4 p-3 border-b-[3px] border-[var(--foreground)] bg-[var(--muted)] font-mono text-[10px] font-bold uppercase text-[#555] items-center">
              <div>Season</div>
              <div>Episode</div>
              <div>Title</div>
              <div>Status</div>
              <div className="text-right">Duration</div>
              <div className="text-center">Action</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col">
              {LIBRARY_EPISODES.map((ep, i) => (
                <div key={ep.id} className="grid grid-cols-[80px_100px_1fr_120px_100px_60px] gap-4 p-3 border-b-[2px] border-[#CCC] last:border-b-0 items-center hover:bg-white transition-colors group cursor-pointer">
                  <div className="font-mono text-xs font-bold text-[#888]">{ep.season}</div>
                  <div className="font-display text-xl leading-none">EP {ep.epNumber}</div>
                  <div className="font-sans font-bold text-sm truncate pr-4">{ep.title}</div>
                  <div>
                    <span className="inline-flex items-center justify-center font-mono text-[10px] font-bold px-2 py-0.5 brutal-border uppercase min-w-[80px]"
                          style={{ backgroundColor: STATUS_COLORS[ep.status].bg, color: STATUS_COLORS[ep.status].text }}>
                      {ep.status}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-right text-[#555]">{ep.duration}</div>
                  <div className="flex justify-center">
                    <button className="p-1 hover:bg-[var(--muted)] rounded transition-colors text-[var(--foreground)] opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button className="bg-[var(--card)] text-[var(--foreground)] font-mono font-bold uppercase text-xs px-6 py-2.5 brutal-border shadow-brutal-sm hover-brutal btn-brutal active-brutal">
              Load More
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

function StatusPill({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase px-2 py-1 border-[1.5px] border-[#333] cursor-pointer hover:border-[#555] transition-colors">
      <CheckCircle2 size={11} style={{ color }} />
      <span className="text-[var(--card)]">{label}</span>
      <span className="text-[var(--card)] tabular-nums">{count}</span>
    </span>
  );
}
