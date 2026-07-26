import React, { useState } from 'react';
import { Play, Plus, Clock, CheckCircle, PenTool, Edit3, CircleDashed, FileX, Calendar, ChevronRight, Activity } from 'lucide-react';

const EPISODES = [
  { ep: '050', season: 'S3', hook: 'Why do we hiccup?', status: 'published', date: '2023-11-20', duration: '0:58' },
  { ep: '049', season: 'S3', hook: 'Is caffeine actually dehydrating?', status: 'published', date: '2023-11-18', duration: '0:55' },
  { ep: '048', season: 'S3', hook: 'The science of goosebumps', status: 'published', date: '2023-11-15', duration: '0:59' },
  { ep: '047', season: 'S3', hook: 'Can you sleep with your eyes open?', status: 'scheduled', date: '2023-11-22', duration: '0:52' },
  { ep: '046', season: 'S3', hook: 'Why does stress cause gray hair?', status: 'scheduled', date: '2023-11-25', duration: '0:57' },
  { ep: '045', season: 'S3', hook: 'How memories are physically stored', status: 'building', date: '2023-11-28', duration: '--:--' },
  { ep: '044', season: 'S2', hook: 'The truth about double-dipping', status: 'approved', date: 'TBD', duration: '--:--' },
  { ep: '043', season: 'S2', hook: 'What causes brain freeze?', status: 'review', date: 'TBD', duration: '--:--' },
  { ep: '042', season: 'S2', hook: 'Why mosquito bites itch', status: 'scripted', date: 'TBD', duration: '--:--' },
  { ep: '041', season: 'S2', hook: 'Are left-handed people smarter?', status: 'draft', date: 'TBD', duration: '--:--' },
  { ep: '040', season: 'S2', hook: 'The real reason we yawn', status: 'published', date: '2023-10-10', duration: '0:54' },
  { ep: '039', season: 'S2', hook: 'Do sugar rushes exist?', status: 'published', date: '2023-10-05', duration: '0:56' },
  { ep: '038', season: 'S2', hook: 'Why knuckles crack', status: 'published', date: '2023-10-01', duration: '0:59' },
  { ep: '037', season: 'S1', hook: 'The 5-second rule debunked', status: 'published', date: '2023-09-20', duration: '0:51' },
  { ep: '036', season: 'S1', hook: 'Why onions make you cry', status: 'published', date: '2023-09-15', duration: '0:58' },
  { ep: '035', season: 'S1', hook: 'How long can you hold your breath?', status: 'rejected', date: 'TBD', duration: '--:--' },
];

const STATUS_COLORS: Record<string, string> = {
  published: '#0A6B52', // green
  scheduled: '#C94A00', // orange
  building: '#C9A800',  // yellow
  approved: '#0A6B52',  // green
  review: '#C94A00',    // orange
  scripted: '#C9A800',  // yellow
  draft: '#0C0C0C',     // dark
  rejected: '#0C0C0C',  // dark
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  published: <Play className="w-4 h-4" fill="currentColor" />,
  scheduled: <Calendar className="w-4 h-4" />,
  building: <Activity className="w-4 h-4" />,
  approved: <CheckCircle className="w-4 h-4" />,
  review: <Clock className="w-4 h-4" />,
  scripted: <PenTool className="w-4 h-4" />,
  draft: <Edit3 className="w-4 h-4" />,
  rejected: <FileX className="w-4 h-4" />,
};

export default function SplitViewDataDock() {
  const [activeSeason, setActiveSeason] = useState('ALL');

  const filteredEpisodes = activeSeason === 'ALL' 
    ? EPISODES 
    : EPISODES.filter(ep => ep.season === activeSeason);

  // Timeline: only show published/scheduled/building, sorted mostly by date
  const timelineEpisodes = EPISODES.filter(ep => 
    ['published', 'scheduled', 'building'].includes(ep.status)
  ).slice(0, 8); // Just show top 8 for the mockup

  return (
    <div 
      className="flex flex-col h-screen w-full bg-[#EDEAE0] text-[#0C0C0C] font-sans selection:bg-[#C9A800] selection:text-[#0C0C0C]"
      style={{ fontFamily: '"Space Grotesk", sans-serif' }}
    >
      {/* DATA DOCK (Top fixed bar) */}
      <header className="h-20 shrink-0 bg-[#0C0C0C] text-[#FAF7EE] flex items-center justify-between px-6 border-b-[3px] border-[#0C0C0C] shadow-lg z-20">
        <div className="flex items-center gap-4">
          <div 
            className="text-4xl tracking-wider pt-1 flex items-center gap-2"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            <div className="w-6 h-6 bg-[#C94A00] rounded-sm mb-1"></div>
            BIOMINUTE
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center gap-4 text-xs tracking-widest text-[#FAF7EE]/70 font-bold" style={{ fontFamily: '"DM Mono", monospace' }}>
            <span>PIPELINE HEALTH</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold tracking-wider text-[#C9A800]" style={{ fontFamily: '"DM Mono", monospace' }}>
            <span>TOTAL: 50</span>
            <span>|</span>
            <span className="text-[#0A6B52]">PUB: 12</span>
            <span>|</span>
            <span className="text-[#C9A800]">BLD: 3</span>
            <span>|</span>
            <span className="text-[#C94A00]">SCH: 5</span>
            <span>|</span>
            <span className="text-[#FAF7EE]">APR: 8</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#1A1A1A] border-[2px] border-[#2A2A2A] rounded-sm p-1">
            {['ALL', 'S3', 'S2', 'S1'].map(s => (
              <button
                key={s}
                onClick={() => setActiveSeason(s)}
                className={`px-3 py-1 text-sm font-bold transition-colors ${activeSeason === s ? 'bg-[#FAF7EE] text-[#0C0C0C]' : 'text-[#FAF7EE] hover:text-[#C9A800]'}`}
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                {s}
              </button>
            ))}
          </div>
          <button 
            className="flex items-center gap-2 bg-[#C94A00] hover:bg-[#0A6B52] text-[#FAF7EE] px-5 py-2.5 border-[2px] border-[#C94A00] hover:border-[#0A6B52] transition-colors shadow-[2px_2px_0px_#FAF7EE] hover:shadow-[1px_1px_0px_#FAF7EE] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none font-bold"
            style={{ fontFamily: '"DM Mono", monospace' }}
          >
            <Plus className="w-4 h-4" />
            NEW EP
          </button>
        </div>
      </header>

      {/* SPLIT VIEW */}
      <main className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT COLUMN: TIMELINE */}
        <section className="w-1/2 flex flex-col border-r-[3px] border-[#0C0C0C] bg-[#EDEAE0] z-10 relative shadow-[5px_0_15px_rgba(0,0,0,0.05)]">
          <div className="sticky top-0 bg-[#EDEAE0] border-b-[3px] border-[#0C0C0C] px-8 py-5 z-20 flex justify-between items-end">
            <h2 
              className="text-5xl tracking-widest text-[#0C0C0C] m-0 leading-none"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              TIMELINE
            </h2>
            <span className="text-sm font-bold pb-1" style={{ fontFamily: '"DM Mono", monospace' }}>RECENT & UPCOMING</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 pb-20 scrollbar-hide">
            <div className="relative border-l-[3px] border-[#0C0C0C] ml-6 space-y-10 py-4">
              {timelineEpisodes.map((ep, i) => (
                <div key={i} className="relative pl-8 group">
                  {/* Timeline Node */}
                  <div 
                    className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-[3px] border-[#0C0C0C] bg-[#EDEAE0] group-hover:scale-125 transition-transform z-10"
                    style={{ borderColor: STATUS_COLORS[ep.status] || '#0C0C0C', backgroundColor: ep.status === 'published' ? STATUS_COLORS[ep.status] : '#EDEAE0' }}
                  />
                  
                  {/* Content */}
                  <div className="flex flex-col gap-1 -mt-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#0C0C0C] text-[#FAF7EE] px-2 py-0.5 text-xs font-bold" style={{ fontFamily: '"DM Mono", monospace' }}>
                        {ep.date}
                      </span>
                      <span className="text-[#0C0C0C]/50 font-bold text-sm" style={{ fontFamily: '"DM Mono", monospace' }}>
                        EP {ep.ep}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#0C0C0C] mt-1 group-hover:text-[#C94A00] transition-colors leading-tight">
                      {ep.hook}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span 
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2 py-1 border-[2px] border-[#0C0C0C] shadow-[2px_2px_0px_#0C0C0C]"
                        style={{ 
                          backgroundColor: STATUS_COLORS[ep.status], 
                          color: ep.status === 'building' || ep.status === 'scripted' ? '#0C0C0C' : '#FAF7EE',
                          fontFamily: '"DM Mono", monospace'
                        }}
                      >
                        {STATUS_ICONS[ep.status]}
                        {ep.status}
                      </span>
                      <span className="text-sm font-bold text-[#0C0C0C]/60" style={{ fontFamily: '"DM Mono", monospace' }}>
                        {ep.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: EPISODE LIBRARY */}
        <section className="w-1/2 flex flex-col bg-[#EDEAE0]">
          <div className="sticky top-0 bg-[#EDEAE0] border-b-[3px] border-[#0C0C0C] px-8 py-5 z-20 flex justify-between items-end">
            <h2 
              className="text-5xl tracking-widest text-[#0C0C0C] m-0 leading-none"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              LIBRARY
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold pb-1 bg-[#C9A800] px-2 py-0.5 border-[2px] border-[#0C0C0C]" style={{ fontFamily: '"DM Mono", monospace' }}>
                {filteredEpisodes.length} ENTRIES
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#FAF7EE] border-b-[3px] border-[#0C0C0C] shadow-sm">
                <tr style={{ fontFamily: '"DM Mono", monospace' }} className="text-xs text-[#0C0C0C] tracking-widest">
                  <th className="p-4 font-bold w-16">EP</th>
                  <th className="p-4 font-bold w-16">SN</th>
                  <th className="p-4 font-bold">HOOK TITLE</th>
                  <th className="p-4 font-bold w-24">STATUS</th>
                  <th className="p-4 font-bold w-24 text-right">DATE</th>
                  <th className="p-4 font-bold w-16 text-center">
                    <ChevronRight className="w-4 h-4 mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: '"DM Mono", monospace' }} className="text-sm font-bold">
                {filteredEpisodes.map((ep, i) => (
                  <tr 
                    key={ep.ep}
                    className={`border-b-[2px] border-[#0C0C0C]/20 transition-all cursor-pointer hover:bg-[#C9A800] hover:text-[#0C0C0C] group
                      ${i % 2 === 0 ? 'bg-[#FAF7EE]' : 'bg-[#E2DDD0]'}`}
                  >
                    <td className="p-4 text-[#0C0C0C]/60 group-hover:text-[#0C0C0C]">{ep.ep}</td>
                    <td className="p-4">{ep.season}</td>
                    <td className="p-4 font-sans text-base max-w-[200px] truncate" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      {ep.hook}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#0C0C0C]"
                          style={{ backgroundColor: STATUS_COLORS[ep.status] }}
                        />
                        <span className="uppercase text-xs tracking-wider">{ep.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">{ep.date !== 'TBD' ? ep.date.substring(5) : 'TBD'}</td>
                    <td className="p-4 text-center">
                      <button className="p-1 rounded-sm border-[2px] border-transparent group-hover:border-[#0C0C0C] group-hover:bg-[#FAF7EE] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEpisodes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-[#0C0C0C]/50">
                <CircleDashed className="w-12 h-12 mb-4 animate-spin-slow" />
                <p style={{ fontFamily: '"DM Mono", monospace' }} className="font-bold">NO EPISODES FOUND</p>
              </div>
            )}
          </div>
        </section>
        
      </main>
    </div>
  );
}
