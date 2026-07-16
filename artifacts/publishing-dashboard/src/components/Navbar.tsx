import React from "react";
import { Link, useLocation } from "wouter";
import { PlusCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/building", label: "Building" },
  { href: "/preview-queue", label: "Preview Queue" },
  { href: "/scheduled", label: "Scheduled" },
  { href: "/published", label: "Published" },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-[100] h-[58px] bg-[#0C0C0C] border-b-[3px] border-[#0C0C0C] flex items-center px-6 gap-6">
      <Link href="/" className="flex items-center gap-1 font-display text-2xl tracking-widest cursor-pointer shrink-0">
        <span className="text-[#FAF7EE]">BIOMINUTE</span>
        <span className="text-[#C94A00]">.</span>
        <span className="text-[#0D9970]">SHORTS</span>
      </Link>

      <nav className="flex gap-1 overflow-x-auto">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link key={href} href={href}>
              <span className={`whitespace-nowrap font-mono font-bold px-3 py-1 text-xs uppercase cursor-pointer transition-colors border-b-2 ${
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

      <div className="ml-auto shrink-0">
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
