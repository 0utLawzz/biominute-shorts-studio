import React, { useState } from 'react';
import { ChevronDown, Plus, Clock, Calendar, CheckCircle2, ChevronRight, PenTool, LayoutTemplate, MoreHorizontal, FileText } from 'lucide-react';

const episodes = [
  { id: '101', epNumber: '101', season: 'S3', hookTitle: 'Why Your Brain Craves Sugar', status: 'published', postDate: '2023-10-01', duration: '0:58' },
  { id: '102', epNumber: '102', season: 'S3', hookTitle: 'The Truth About Seed Oils', status: 'published', postDate: '2023-10-03', duration: '1:02' },
  { id: '103', epNumber: '103', season: 'S3', hookTitle: 'Can You Catch Up On Sleep?', status: 'published', postDate: '2023-10-05', duration: '0:55' },
  { id: '104', epNumber: '104', season: 'S3', hookTitle: 'Microplastics in Your Tea', status: 'published', postDate: '2023-10-08', duration: '1:05' },
  { id: '105', epNumber: '105', season: 'S3', hookTitle: 'Sunscreen Myths Debunked', status: 'published', postDate: '2023-10-10', duration: '0:59' },
  { id: '106', epNumber: '106', season: 'S3', hookTitle: 'Do Vitamins Actually Work?', status: 'scheduled', postDate: '2023-10-12', duration: '1:01' },
  { id: '107', epNumber: '107', season: 'S3', hookTitle: 'Why We Get Hangry', status: 'scheduled', postDate: '2023-10-15', duration: '0:54' },
  { id: '108', epNumber: '108', season: 'S3', hookTitle: 'The Gut-Brain Connection', status: 'scheduled', postDate: '2023-10-17', duration: '1:08' },
  { id: '109', epNumber: '109', season: 'S3', hookTitle: 'Is Standing Better Than Sitting?', status: 'building', postDate: '2023-10-20', duration: '1:00' },
  { id: '110', epNumber: '110', season: 'S3', hookTitle: 'How Caffeine Hacks Sleep', status: 'building', postDate: '2023-10-22', duration: '0:57' },
  { id: '111', epNumber: '111', season: 'S3', hookTitle: 'Why We Forget Dreams', status: 'building', postDate: '2023-10-25', duration: '0:59' },
  { id: '112', epNumber: '112', season: 'S3', hookTitle: 'The Science of Blushing', status: 'scripted', postDate: '2023-10-27', duration: '-' },
  { id: '113', epNumber: '113', season: 'S3', hookTitle: 'Can Stress Turn Hair Gray?', status: 'draft', postDate: '2023-10-29', duration: '-' },
  { id: '114', epNumber: '114', season: 'S3', hookTitle: 'Why Mosquitoes Love You', status: 'draft', postDate: '2023-10-31', duration: '-' },
  { id: '115', epNumber: '115', season: 'S3', hookTitle: 'Is Sugar Really Addictive?', status: 'draft', postDate: '2023-11-02', duration: '-' },
];

const COLORS = {
  bg: '#EDEAE0',
  dark: '#0C0C0C',
  orange: '#C94A00',
  green: '#0A6B52',
  yellow: '#C9A800',
  purple: '#8B2FC9',
  panelBg: '#FAF7EE'
};

const FONTS = {
  display: '"Bebas Neue", sans-serif',
  body: '"Space Grotesk", sans-serif',
  mono: '"DM Mono", monospace'
};

// @ts-ignore
const KanbanCard = ({ episode, color, isDraft = false }) => {
  return (
    <div 
      className="relative flex flex-col p-4 bg-[#FAF7EE] border-2 border-[#0C0C0C] cursor-pointer hover:-translate-y-1 hover:translate-x-[-1px] transition-transform"
      style={{
        boxShadow: `3px 3px 0 ${COLORS.dark}`,
        borderTop: isDraft ? `2px solid ${COLORS.dark}` : `6px solid ${color}`
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <span 
            className="px-1.5 py-0.5 text-xs font-bold border-2 border-[#0C0C0C] bg-white"
            style={{ fontFamily: FONTS.mono }}
          >
            {episode.season}
          </span>
          <span 
            className="font-bold text-sm tracking-tight"
            style={{ fontFamily: FONTS.mono }}
          >
            EP{episode.epNumber}
          </span>
        </div>
        <button className="text-[#0C0C0C] hover:bg-[#0C0C0C]/10 rounded p-1">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <h3 
        className="text-lg font-bold leading-tight mb-4 uppercase"
        style={{ fontFamily: FONTS.display, letterSpacing: '0.02em' }}
      >
        {episode.hookTitle}
      </h3>
      
      <div className="mt-auto flex justify-between items-center text-xs border-t-2 border-[#0C0C0C] border-dashed pt-3">
        <div className="flex items-center gap-1.5 font-bold" style={{ fontFamily: FONTS.mono }}>
          {episode.status === 'published' ? <CheckCircle2 size={14} color={color} /> : 
           episode.status === 'scheduled' ? <Calendar size={14} color={color} /> :
           episode.status === 'building' ? <LayoutTemplate size={14} color={color} /> :
           episode.status === 'scripted' ? <FileText size={14} color={color} /> :
           <PenTool size={14} />}
          <span>{episode.postDate}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[#0C0C0C]/60" style={{ fontFamily: FONTS.mono }}>
          <Clock size={12} />
          {episode.duration}
        </div>
      </div>
    </div>
  );
};

export default function KanbanPipeline() {
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  
  const building = episodes.filter(e => e.status === 'building');
  const scheduled = episodes.filter(e => e.status === 'scheduled');
  const published = episodes.filter(e => e.status === 'published');
  const draftsAndScripted = episodes.filter(e => ['draft', 'scripted'].includes(e.status));

  return (
    <div 
      className="flex flex-col font-sans"
      style={{ 
        backgroundColor: COLORS.bg, 
        fontFamily: FONTS.body, 
        color: COLORS.dark,
        height: '100vh',
        maxHeight: '100dvh'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500&family=Space+Grotesk:wght@300..700&display=swap');
        
        .kanban-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .kanban-scroll::-webkit-scrollbar-track {
          background: #EDEAE0;
          border-left: 2px solid #0C0C0C;
          border-top: 2px solid #0C0C0C;
        }
        .kanban-scroll::-webkit-scrollbar-thumb {
          background: #0C0C0C;
        }
        .kanban-scroll::-webkit-scrollbar-corner {
          background: #EDEAE0;
        }
      `}} />

      {/* Top Bar */}
      <header 
        className="flex items-center justify-between px-6 py-4 border-b-[3px] border-[#0C0C0C] z-10 relative flex-shrink-0"
        style={{ backgroundColor: COLORS.panelBg }}
      >
        <div className="flex items-center gap-6">
          <h1 
            className="text-3xl m-0 tracking-wider pt-1"
            style={{ fontFamily: FONTS.display }}
          >
            PIPELINE
          </h1>
          
          <div className="hidden md:flex gap-2" style={{ fontFamily: FONTS.mono }}>
            <div className="px-3 py-1 bg-white border-2 border-[#0C0C0C] text-xs font-bold shadow-[2px_2px_0_#0C0C0C]">
              TOT {episodes.length}
            </div>
            <div className="px-3 py-1 bg-[#8B2FC9]/20 border-2 border-[#0C0C0C] text-xs font-bold shadow-[2px_2px_0_#0C0C0C]">
              PUB {published.length}
            </div>
            <div className="px-3 py-1 bg-[#0A6B52]/20 border-2 border-[#0C0C0C] text-xs font-bold shadow-[2px_2px_0_#0C0C0C]">
              SCH {scheduled.length}
            </div>
            <div className="px-3 py-1 bg-[#C94A00]/20 border-2 border-[#0C0C0C] text-xs font-bold shadow-[2px_2px_0_#0C0C0C]">
              BLD {building.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-[#0C0C0C] bg-white shadow-[2px_2px_0_#0C0C0C] font-bold text-sm uppercase" style={{ fontFamily: FONTS.mono }}>
              SEASON 3 <ChevronDown size={16} />
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#0C0C0C] bg-[#C9A800] text-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[1px_1px_0_#0C0C0C] transition-all font-bold uppercase text-sm active:shadow-none active:translate-y-[3px] active:translate-x-[3px]" style={{ fontFamily: FONTS.mono }}>
            <Plus size={18} strokeWidth={3} />
            New Episode
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden relative p-6 kanban-scroll">
        <div className="flex gap-6 h-full items-start w-max">
          
          {/* BUILDING COLUMN */}
          <div className="flex flex-col w-[380px] h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-4 border-[#C94A00] flex-shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2 m-0 pt-1" style={{ fontFamily: FONTS.display, letterSpacing: '0.05em' }}>
                <span className="w-3 h-3 rounded-full bg-[#C94A00] border-2 border-[#0C0C0C]"></span>
                BUILDING
              </h2>
              <span className="px-2 py-0.5 border-2 border-[#0C0C0C] bg-white text-sm font-bold shadow-[2px_2px_0_#0C0C0C]" style={{ fontFamily: FONTS.mono }}>
                {building.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 kanban-scroll">
              {building.map(ep => (
                <KanbanCard key={ep.id} episode={ep} color={COLORS.orange} />
              ))}
            </div>
          </div>

          {/* SCHEDULED COLUMN */}
          <div className="flex flex-col w-[380px] h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-4 border-[#0A6B52] flex-shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2 m-0 pt-1" style={{ fontFamily: FONTS.display, letterSpacing: '0.05em' }}>
                <span className="w-3 h-3 rounded-full bg-[#0A6B52] border-2 border-[#0C0C0C]"></span>
                SCHEDULED
              </h2>
              <span className="px-2 py-0.5 border-2 border-[#0C0C0C] bg-white text-sm font-bold shadow-[2px_2px_0_#0C0C0C]" style={{ fontFamily: FONTS.mono }}>
                {scheduled.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 kanban-scroll">
              {scheduled.map(ep => (
                <KanbanCard key={ep.id} episode={ep} color={COLORS.green} />
              ))}
            </div>
          </div>

          {/* PUBLISHED COLUMN */}
          <div className="flex flex-col w-[380px] h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-4 border-[#8B2FC9] flex-shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2 m-0 pt-1" style={{ fontFamily: FONTS.display, letterSpacing: '0.05em' }}>
                <span className="w-3 h-3 rounded-full bg-[#8B2FC9] border-2 border-[#0C0C0C]"></span>
                PUBLISHED
              </h2>
              <span className="px-2 py-0.5 border-2 border-[#0C0C0C] bg-white text-sm font-bold shadow-[2px_2px_0_#0C0C0C]" style={{ fontFamily: FONTS.mono }}>
                {published.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 kanban-scroll">
              {published.map(ep => (
                <KanbanCard key={ep.id} episode={ep} color={COLORS.purple} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Drafts / Scripted Accordion (Bottom) */}
      <div className="border-t-[3px] border-[#0C0C0C] bg-[#FAF7EE] flex-shrink-0 z-20">
        <button 
          onClick={() => setIsDraftsOpen(!isDraftsOpen)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#EAE5D8] transition-colors"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-xl m-0 tracking-widest flex items-center gap-2 uppercase pt-1" style={{ fontFamily: FONTS.display }}>
              {isDraftsOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              Drafts & Scripted
            </h2>
            <span className="px-2 py-0.5 border-2 border-[#0C0C0C] bg-white text-xs font-bold" style={{ fontFamily: FONTS.mono }}>
              {draftsAndScripted.length} EPISODES
            </span>
          </div>
        </button>
        
        {isDraftsOpen && (
          <div className="p-6 border-t-[3px] border-[#0C0C0C] bg-[#EDEAE0] overflow-x-auto kanban-scroll" style={{ maxHeight: '350px' }}>
            <div className="flex gap-4 w-max">
              {draftsAndScripted.map(ep => (
                <div key={ep.id} className="w-[300px]">
                  <KanbanCard episode={ep} color={COLORS.dark} isDraft={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
