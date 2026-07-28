import { Link, useLocation } from "wouter";
import { PlusCircle, AlertTriangle, LogOut } from "lucide-react";
import { useGetYouTubeStatus } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

const PRIMARY_LINKS = [
  { href: "/social-status", label: "Social" },
  { href: "/social-setup", label: "Setup" },
  { href: "/analytics", label: "Analytics" },
];

export function Navbar() {
  const [location] = useLocation();
  const { data: ytStatus } = useGetYouTubeStatus();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenHealth = (ytStatus as any)?.tokenHealth as string | undefined;

  return (
    <header className="sticky top-0 z-[100] min-h-[58px] bg-[#0C0C0C] border-b-[3px] border-[#0C0C0C] flex items-center px-6 gap-6">
      <Link href="/" className="flex items-center gap-1 font-display text-2xl tracking-widest cursor-pointer shrink-0">
        <span className="text-[#FAF7EE]">BIOMINUTE</span>
        <span className="text-[#C94A00]">.</span>
        <span className="text-[#0D9970]">SHORTS</span>
      </Link>
      <nav className="flex items-center gap-1 shrink-0" aria-label="Primary navigation">
        {PRIMARY_LINKS.map(({ href, label }) => {
          const isActive = location.startsWith(href);
          return (
            <Link key={href} href={href}>
              <span className={`whitespace-nowrap border-2 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wide transition ${
                isActive
                  ? "border-[#C9A800] bg-[#C9A800] text-[#0C0C0C]"
                  : "border-transparent text-[#999] hover:border-[#444] hover:text-white"
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
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
      <div className="ml-auto shrink-0 flex items-center gap-2">
        <Link href="/new">
          <span className="flex items-center gap-2 bg-[#C9A800] text-[#0C0C0C] font-mono font-bold text-xs px-4 py-2 border-[2px] border-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer uppercase">
            <PlusCircle size={14} />
            New Episode
          </span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      title="Lock dashboard"
      className="flex items-center gap-1.5 bg-[#0C0C0C] text-[#FAF7EE] font-mono font-bold text-[10px] px-3 py-2 border-[2px] border-[#0C0C0C] hover:bg-[#333] transition-colors uppercase"
    >
      <LogOut size={12} />
      Lock
    </button>
  );
}
