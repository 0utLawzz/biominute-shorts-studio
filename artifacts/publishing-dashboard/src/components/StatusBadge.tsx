import { Badge as UIBadge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, { border: string, text: string, bg: string }> = {
  draft: { border: "rgba(12,12,12,0.40)", text: "#555555", bg: "rgba(12,12,12,0.05)" },
  scripted: { border: "#2563EB", text: "#1d4ed8", bg: "rgba(37,99,235,0.10)" },
  complete: { border: "#0D9970", text: "#0A6B52", bg: "rgba(13,153,112,0.12)" },
  scheduled: { border: "#C9A800", text: "#8a6800", bg: "rgba(201,168,0,0.12)" },
  published: { border: "#8B2FC9", text: "#8B2FC9", bg: "rgba(139,47,201,0.12)" },
  building: { border: "#C94A00", text: "#C94A00", bg: "rgba(201,74,0,0.12)" },
};

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const normalizedStatus = status.toLowerCase();
  const colors = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.draft;

  return (
    <span
      className={`font-mono text-xs uppercase px-2 py-1 font-bold inline-block ${className}`}
      style={{
        border: `2px solid ${colors.border}`,
        color: colors.text,
        backgroundColor: colors.bg,
        boxShadow: "3px 3px 0 #0C0C0C",
        letterSpacing: "0.5px"
      }}
    >
      {status}
    </span>
  );
}
