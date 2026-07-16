import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, Play, CheckCircle, XCircle, Eye } from "lucide-react";
import type { Episode } from "@workspace/api-client-react";

const STAGES = ["script_ready", "rendering", "exported", "preview_ready"] as const;
type Stage = typeof STAGES[number];

const STAGE_LABELS: Record<Stage, string> = {
  script_ready: "Script Ready",
  rendering: "Rendering",
  exported: "Exported",
  preview_ready: "Preview Ready",
};

const STAGE_COLORS: Record<Stage, string> = {
  script_ready: "#C9A800",
  rendering: "#C94A00",
  exported: "#0D9970",
  preview_ready: "#8B2FC9",
};

interface BuildingCardProps {
  episode: Episode;
  onRunProduction: (id: number) => void;
  onMarkPreviewReady: (id: number) => void;
  onReject: (id: number) => void;
  onApprove: (id: number) => void;
  isRunningProduction?: boolean;
  buildStatus?: { buildStage?: string | null; videoExists?: boolean } | null;
  onRefreshStatus: (id: number) => void;
}

export function BuildingCard({
  episode,
  onRunProduction,
  onMarkPreviewReady,
  onReject,
  onApprove,
  isRunningProduction,
  buildStatus,
  onRefreshStatus,
}: BuildingCardProps) {
  const [, navigate] = useLocation();
  const stage = (buildStatus?.buildStage ?? episode.buildStage ?? "script_ready") as Stage;
  const stageIndex = STAGES.indexOf(stage);
  const stageColor = STAGE_COLORS[stage] ?? "#C9A800";
  const isRendering = stage === "rendering";

  // Poll while rendering
  useEffect(() => {
    if (!isRendering) return;
    const interval = setInterval(() => {
      onRefreshStatus(episode.id);
    }, 5000);
    return () => clearInterval(interval);
  }, [isRendering, episode.id, onRefreshStatus]);

  return (
    <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[5px_5px_0_#0C0C0C] flex flex-col">
      {/* Header */}
      <div className="border-b-[3px] border-[#0C0C0C] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl text-[#0C0C0C]">EP {String(episode.epNumber).padStart(2, "0")}</span>
          <span className="font-mono text-xs text-[#555] font-bold uppercase">{episode.season.split(":")[0]?.trim()}</span>
        </div>
        <div
          className="font-mono text-xs font-bold px-2 py-1 border-[2px] border-[#0C0C0C]"
          style={{ background: stageColor, color: stage === "script_ready" ? "#0C0C0C" : "#FAF7EE" }}
        >
          {STAGE_LABELS[stage] ?? stage.toUpperCase()}
        </div>
      </div>

      {/* Progress rail */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-0">
          {STAGES.map((s, i) => {
            const done = i < stageIndex;
            const active = i === stageIndex;
            const color = done || active ? STAGE_COLORS[s] : "#D0CCC0";
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                  <div
                    className="w-4 h-4 border-[2px] border-[#0C0C0C] flex items-center justify-center"
                    style={{ background: color }}
                  >
                    {done && <CheckCircle size={10} color="#FAF7EE" />}
                    {active && isRendering && <Loader2 size={10} className="animate-spin" color="#FAF7EE" />}
                  </div>
                  <span className="font-mono text-[9px] font-bold text-[#555] uppercase text-center leading-tight" style={{ minWidth: 48 }}>
                    {STAGE_LABELS[s]}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className="h-[2px] flex-1 -mt-4"
                    style={{ background: i < stageIndex ? STAGE_COLORS[STAGES[i + 1]] : "#D0CCC0" }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Hook title */}
      <div className="px-5 py-3 flex-1">
        <p className="font-sans font-semibold text-sm text-[#0C0C0C] line-clamp-2">{episode.hookTitle}</p>
        {episode.buildNote && (
          <p className="font-mono text-xs text-[#C94A00] mt-1">{episode.buildNote}</p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t-[3px] border-[#0C0C0C] px-5 py-3 flex flex-wrap gap-2">
        <button
          onClick={() => navigate(`/episodes/${episode.id}`)}
          className="font-mono text-xs font-bold px-3 py-1.5 border-[2px] border-[#0C0C0C] bg-[#FAF7EE] shadow-[2px_2px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
        >
          Edit
        </button>

        {stage === "script_ready" && (
          <button
            onClick={() => onRunProduction(episode.id)}
            disabled={isRunningProduction}
            className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 border-[2px] border-[#0C0C0C] bg-[#C9A800] text-[#0C0C0C] shadow-[2px_2px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningProduction ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
            Start Render
          </button>
        )}

        {stage === "rendering" && (
          <button
            disabled
            className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 border-[2px] border-[#0C0C0C] bg-[#C94A00] text-white shadow-[2px_2px_0_#0C0C0C] opacity-80 uppercase cursor-not-allowed"
          >
            <Loader2 size={11} className="animate-spin" />
            Rendering…
          </button>
        )}

        {stage === "exported" && (
          <button
            onClick={() => onMarkPreviewReady(episode.id)}
            className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 border-[2px] border-[#0C0C0C] bg-[#0D9970] text-white shadow-[2px_2px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
          >
            <Eye size={11} />
            Mark Preview Ready
          </button>
        )}

        {stage === "preview_ready" && (
          <button
            onClick={() => onApprove(episode.id)}
            className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 border-[2px] border-[#0C0C0C] bg-[#8B2FC9] text-white shadow-[2px_2px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
          >
            <CheckCircle size={11} />
            Approve
          </button>
        )}

        <button
          onClick={() => onReject(episode.id)}
          className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 border-[2px] border-[#0C0C0C] bg-[#FAF7EE] text-[#C94A00] shadow-[2px_2px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase ml-auto"
        >
          <XCircle size={11} />
          Reject
        </button>
      </div>
    </div>
  );
}
