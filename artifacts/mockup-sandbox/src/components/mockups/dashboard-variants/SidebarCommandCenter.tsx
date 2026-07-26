import React, { useState } from 'react';
import { PlayCircle, Plus, Calendar, Clock, Activity, Video, HardDrive, CheckCircle2, ChevronRight } from 'lucide-react';

const episodes = [
  { id: 1, epNumber: "101", season: "S1", hookTitle: "WHY YOU WAKE UP TIRED", status: "PUBLISHED", postDate: "2023-10-01", duration: "0:58" },
  { id: 2, epNumber: "102", season: "S1", hookTitle: "THE SUGAR MYTH EXPOSED", status: "PUBLISHED", postDate: "2023-10-03", duration: "1:02" },
  { id: 3, epNumber: "103", season: "S1", hookTitle: "HOW CAFFEINE REALLY WORKS", status: "SCHEDULED", postDate: "2023-10-05", duration: "0:59" },
  { id: 4, epNumber: "104", season: "S1", hookTitle: "YOUR GUT MICROBIOME SECRETS", status: "APPROVED", postDate: "2023-10-07", duration: "1:05" },
  { id: 5, epNumber: "201", season: "S2", hookTitle: "INTERMITTENT FASTING TRUTHS", status: "BUILDING", postDate: "TBD", duration: "--:--" },
  { id: 6, epNumber: "202", season: "S2", hookTitle: "THE SCIENCE OF DEEP SLEEP", status: "REVIEW", postDate: "TBD", duration: "--:--" },
  { id: 7, epNumber: "203", season: "S2", hookTitle: "ARE DAILY VITAMINS A SCAM?", status: "SCRIPTED", postDate: "TBD", duration: "--:--" },
  { id: 8, epNumber: "204", season: "S2", hookTitle: "WHAT STRESS DOES TO YOUR BRAIN", status: "DRAFT", postDate: "TBD", duration: "--:--" },
  { id: 9, epNumber: "301", season: "S3", hookTitle: "HYDRATION: HOW MUCH IS ENOUGH?", status: "DRAFT", postDate: "TBD", duration: "--:--" },
  { id: 10, epNumber: "302", season: "S3", hookTitle: "THE TRUTH ABOUT KETO DIET", status: "REJECTED", postDate: "TBD", duration: "--:--" },
  { id: 11, epNumber: "303", season: "S3", hookTitle: "BLUE LIGHT AND YOUR EYES", status: "DRAFT", postDate: "TBD", duration: "--:--" },
  { id: 12, epNumber: "304", season: "S3", hookTitle: "IS SITTING THE NEW SMOKING?", status: "SCRIPTED", postDate: "TBD", duration: "--:--" },
  { id: 13, epNumber: "401", season: "S4", hookTitle: "THE POWER OF PLACEBO EFFECT", status: "BUILDING", postDate: "TBD", duration: "--:--" },
  { id: 14, epNumber: "402", season: "S4", hookTitle: "WHY DO WE ACTUALLY YAWN?", status: "APPROVED", postDate: "TBD", duration: "1:01" },
  { id: 15, epNumber: "403", season: "S4", hookTitle: "CHOLESTEROL FINALLY EXPLAINED", status: "SCHEDULED", postDate: "2023-11-15", duration: "0:57" },
  { id: 16, epNumber: "404", season: "S4", hookTitle: "CAN YOU SWEAT OUT TOXINS?", status: "PUBLISHED", postDate: "2023-09-20", duration: "0:55" },
];

const SEASONS = ["ALL", "S1", "S2", "S3", "S4", "S5", "S6"];
const STATUSES = ["ALL", "PUBLISHED", "SCHEDULED", "APPROVED", "BUILDING", "REVIEW", "SCRIPTED", "DRAFT", "REJECTED"];

export default function SidebarCommandCenter() {
  const [activeSeason, setActiveSeason] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState("ALL");

  const filteredEpisodes = episodes.filter(ep => {
    const matchSeason = activeSeason === "ALL" || ep.season === activeSeason;
    const matchStatus = activeStatus === "ALL" || ep.status === activeStatus;
    return matchSeason && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PUBLISHED': return 'bg-[#0A6B52] text-white';
      case 'SCHEDULED': return 'bg-[#C9A800] text-black';
      case 'APPROVED': return 'bg-[#0A6B52] text-white';
      case 'BUILDING': return 'bg-[#C94A00] text-white';
      case 'REVIEW': return 'bg-[#C9A800] text-black';
      case 'REJECTED': return 'bg-red-600 text-white';
      default: return 'bg-gray-200 text-[#0C0C0C]';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#EDEAE0] text-[#0C0C0C] overflow-hidden selection:bg-[#C94A00] selection:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;600;700&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        .brutalist-shadow { box-shadow: 4px 4px 0px 0px #0C0C0C; }
        .brutalist-shadow-sm { box-shadow: 2px 2px 0px 0px #0C0C0C; }
      `}} />

      {/* LEFT SIDEBAR COMMAND CENTER */}
      <div className="w-72 bg-[#0C0C0C] text-[#EDEAE0] flex flex-col h-full shrink-0 border-r-4 border-[#0C0C0C] z-10 relative overflow-y-auto">
        <div className="p-6 pb-2">
          <h1 className="font-bebas text-5xl tracking-wide text-white leading-none">BIOMINUTE</h1>
          <div className="font-mono text-xs text-[#C9A800] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0A6B52] animate-pulse"></span>
            PIPELINE ONLINE
          </div>
        </div>

        {/* PIPELINE STATS */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          <div className="bg-[#1A1A1A] border-2 border-[#333] p-3 flex flex-col hover:border-[#C94A00] transition-colors cursor-default">
            <span className="font-mono text-[10px] text-gray-400 mb-1">TOTAL PIPELINE</span>
            <span className="font-bebas text-3xl leading-none">50</span>
          </div>
          <div className="bg-[#1A1A1A] border-2 border-[#333] p-3 flex flex-col hover:border-[#0A6B52] transition-colors cursor-default">
            <span className="font-mono text-[10px] text-gray-400 mb-1">PUBLISHED</span>
            <span className="font-bebas text-3xl leading-none text-[#0A6B52]">18</span>
          </div>
          <div className="bg-[#1A1A1A] border-2 border-[#333] p-3 flex flex-col hover:border-[#0A6B52] transition-colors cursor-default">
            <span className="font-mono text-[10px] text-gray-400 mb-1">APPROVED</span>
            <span className="font-bebas text-3xl leading-none text-[#0A6B52]">4</span>
          </div>
          <div className="bg-[#1A1A1A] border-2 border-[#333] p-3 flex flex-col hover:border-[#C9A800] transition-colors cursor-default">
            <span className="font-mono text-[10px] text-gray-400 mb-1">SCHEDULED</span>
            <span className="font-bebas text-3xl leading-none text-[#C9A800]">3</span>
          </div>
          <div className="bg-[#1A1A1A] border-2 border-[#333] p-3 flex flex-col col-span-2 hover:border-[#C94A00] transition-colors cursor-default">
            <span className="font-mono text-[10px] text-gray-400 mb-1">BUILDING</span>
            <div className="flex items-end justify-between">
              <span className="font-bebas text-3xl leading-none text-[#C94A00]">7</span>
              <Activity className="w-4 h-4 text-[#C94A00] mb-1" />
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="px-6 py-4 flex-1">
          <div className="mb-6">
            <h3 className="font-mono text-[11px] text-gray-400 mb-3 tracking-wider">FILTER BY SEASON</h3>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className={`font-mono text-xs px-3 py-1.5 border-2 transition-all ${activeSeason === s ? 'bg-[#EDEAE0] text-[#0C0C0C] border-[#EDEAE0] font-bold' : 'bg-transparent text-gray-400 border-[#333] hover:border-gray-500'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[11px] text-gray-400 mb-3 tracking-wider">FILTER BY STATUS</h3>
            <div className="flex flex-col gap-1.5">
              {STATUSES.map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`font-mono text-xs px-3 py-2 border-2 text-left transition-all flex items-center justify-between ${activeStatus === s ? 'bg-[#333] text-white border-[#555] font-bold' : 'bg-transparent text-gray-400 border-transparent hover:bg-[#1a1a1a]'}`}
                >
                  {s}
                  {activeStatus === s && <CheckCircle2 className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="p-6 mt-auto">
          <button className="w-full bg-[#C94A00] hover:bg-[#a63d00] text-white font-bebas text-xl py-3 px-4 flex items-center justify-center gap-2 border-2 border-transparent transition-colors shadow-[0_0_15px_rgba(201,74,0,0.3)]">
            <Plus className="w-5 h-5" />
            NEW EPISODE
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDEAE0] bg-[radial-gradient(#d5d1c4_1px,transparent_1px)] [background-size:20px_20px]">
        {/* HEADER */}
        <header className="px-8 py-6 border-b-4 border-[#0C0C0C] bg-[#EDEAE0] flex items-end justify-between shrink-0 z-10">
          <div>
            <h2 className="font-bebas text-6xl text-[#0C0C0C] leading-none tracking-tight">LIBRARY OVERVIEW</h2>
            <div className="font-mono text-sm font-semibold text-[#0C0C0C] mt-2 flex items-center gap-4">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
              <span className="w-1.5 h-1.5 bg-[#0C0C0C] rounded-full"></span>
              <span>SHOWING {filteredEpisodes.length} EPISODES</span>
            </div>
          </div>
        </header>

        {/* EPISODE GRID */}
        <div className="p-8 overflow-y-auto flex-1">
          {filteredEpisodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <HardDrive className="w-16 h-16 mb-4" />
              <p className="font-bebas text-3xl">NO EPISODES FOUND</p>
              <p className="font-mono text-sm">TRY ADJUSTING YOUR FILTERS</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEpisodes.map(ep => (
                <div key={ep.id} className="group bg-[#FAF7EE] border-4 border-[#0C0C0C] brutalist-shadow flex flex-col relative hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0_0_0_0_#0C0C0C] transition-all duration-200 cursor-pointer">
                  {/* TOP BAR */}
                  <div className="border-b-4 border-[#0C0C0C] flex justify-between items-center bg-white">
                    <div className="bg-[#C94A00] text-white font-bebas text-2xl px-3 py-1.5 border-r-4 border-[#0C0C0C]">
                      EP {ep.epNumber}
                    </div>
                    <div className="px-3 flex items-center gap-2 font-mono text-xs font-bold">
                      <span className="bg-[#EDEAE0] px-2 py-1 border-2 border-[#0C0C0C]">{ep.season}</span>
                      <span className={`px-2 py-1 border-2 border-[#0C0C0C] ${getStatusColor(ep.status)}`}>
                        {ep.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bebas text-3xl leading-[0.9] mb-4 text-[#0C0C0C] line-clamp-3 group-hover:text-[#C94A00] transition-colors">{ep.hookTitle}</h3>
                    
                    <div className="mt-auto grid grid-cols-2 gap-4 border-t-2 border-[#0C0C0C] border-dashed pt-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> POST DATE</span>
                        <span className="font-mono text-sm font-bold">{ep.postDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> DURATION</span>
                        <span className="font-mono text-sm font-bold">{ep.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* HOVER AFFORDANCE */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0C0C0C] text-[#EDEAE0] rounded-full p-4 brutalist-shadow-sm pointer-events-none">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
