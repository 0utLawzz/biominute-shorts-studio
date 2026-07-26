import React from "react";
import { Link, useLocation } from "wouter";
import { PlusCircle, Activity, CheckCircle2, Clock, Hammer, CalendarCheck, AlertTriangle } from "lucide-react";
import { useGetEpisodeStats, useGetYouTubeStatus } from "@workspace/api-client-react";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/building", label: "Building" },
  { href: "/preview-queue", label: "Preview" },
  { href: "/scheduled", label: "Scheduled" },
  { href: "/published", label: "Published" },
  { href: "/analytics", label: "Analytics" },
];

const STATUS_PILLS = [
  { key: "published", label: "Pub", icon: CheckCircle2, color: "#8B2FC9", href: "/published" },
  { key: "complete", label: "Cmp", icon: CalendarCheck, color: "#0A6B52", href: "/" },
  { key: "building", label: "Bld", icon: Hammer, color: "#C9A800", href: "/building" },
  { key: "scheduled", label: "Sch", icon: Clock, color: "#0D9970", href: "/scheduled" },
];

export function Navbar() {
  const [location] = useLocation();
  const { data: stats } = useGetEpisodeStats();
  const { data: ytStatus } = useGetYouTubeStatus();

  const byStatus = stats?.byStatus;
  const total = stats?.total ?? 0;
  const published = byStatus?.published ?? 0;
  const complete = byStatus?.complete ?? 0;
  const building = byStatus?.building ?? 0;
  const scheduled = byStatus?.scheduled ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenHealth = (ytStatus as any)?.tokenHealth as string | undefined;

  // Surface a one-line system health readout based on real pipeline state.
  let systemStatus = { text: "SYSTEM READY", color: "#0A6B52" };
  if (building > 0) systemStatus = { text: `${building} RENDERING`, color: "#C9A800" };
  else if (scheduled > 0) systemStatus = { text: `${scheduled} QUEUED`, color: "#0D9970" };
  else if (complete > 0) systemStatus = { text: `${complete} READY TO PUBLISH`, color: "#0A6B52" };
  else if (published === total && total > 0) systemStatus = { text: "ALL PUBLISHED", color: "#8B2FC9" };

  return (
    <header className="sticky top-0 z-[100] h-[58px] bg-[#0C0C0C] border-b-[3px] border-[#0C0C0C] flex items-center px-6 gap-6">
      <Link href="/" className="flex items-center gap-1 font-display text-2xl tracking-widest cursor-pointer shrink-0">
        <span className="text-[#FAF7EE]">BIOMINUTE</span>
        <span className="text-[#C94A00]">.</span>
        <span className="text-[#0D9970]">SHORTS</span>
      </Link>

      <nav className="flex items-center gap-0.5 overflow-x-auto shrink min-w-0">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link key={href} href={href}>
              <span className={`whitespace-nowrap font-mono font-bold px-1.5 py-1 text-[10px] uppercase cursor-pointer transition-colors border-b-2 ${
                isActive
                  ? "text-[#C9A800] border-[#C9A800]"
                  : "text-[#999] border-transparent hover:text-white"
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Live pipeline status — visible on every page */}
      <div className="ml-auto hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#1a1a1a] border-[1.5px] border-[#333] px-2 py-1">
          <Activity size={12} style={{ color: systemStatus.color }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: systemStatus.color }}>
            {systemStatus.text}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {STATUS_PILLS.map(({ key, label, icon: Icon, color, href }) => {
            const count = byStatus?.[key as keyof typeof byStatus] ?? 0;
            return (
              <Link key={key} href={href}>
                <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase px-2 py-1 border-[1.5px] border-[#333] cursor-pointer hover:border-[#555] transition-colors" title={`${count} ${key}`}>
                  <Icon size={11} style={{ color }} />
                  <span className="text-[#FAF7EE]">{label}</span>
                  <span className="text-[#FAF7EE] tabular-nums">{count}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {tokenHealth === "expired" && (
        <a
          href="https://github.com/your-repo/scripts/src/youtube-reauth.ts"
          target="_blank"
          rel="noreferrer"
          title="YouTube refresh token is expired or revoked. Run scripts/src/youtube-reauth.ts to fix."
          className="shrink-0 flex items-center gap-1.5 bg-[#C94A00] text-white font-mono text-[10px] font-bold uppercase px-3 py-1.5 border-[1.5px] border-[#FF6B35] animate-pulse hover:animate-none cursor-pointer"
        >
          <AlertTriangle size={11} />
          YT TOKEN EXPIRED
        </a>
      )}

      <div className="shrink-0">
        <Link href="/new">
          <span className="flex items-center gap-2 bg-[#C9A800] text-[#0C0C0C] font-mono font-bold text-xs px-4 py-2 border-[2px] border-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer uppercase">
            <PlusCircle size={14} />
            New Episode
          </span>
        </Link>
      </div>
    </header>
  );
}
