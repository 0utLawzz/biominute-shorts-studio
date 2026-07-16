import React, { useState, useCallback } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { BuildingCard } from "../components/BuildingCard";
import {
  useListEpisodes,
  customFetch,
} from "@workspace/api-client-react";
import type { BuildStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Building() {
  const queryClient = useQueryClient();
  const { data: episodes, isLoading } = useListEpisodes({ status: "building" });
  const [buildStatuses, setBuildStatuses] = useState<Record<number, BuildStatus>>({});
  const [runningIds, setRunningIds] = useState<Set<number>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  const refreshStatus = useCallback(async (id: number) => {
    try {
      const status = await customFetch<BuildStatus>(`/api/episodes/${id}/build-status`);
      setBuildStatuses((prev) => ({ ...prev, [id]: status }));
    } catch {
      // non-fatal
    }
  }, []);

  async function handleRunProduction(id: number) {
    setRunningIds((prev) => new Set(prev).add(id));
    try {
      await customFetch(`/api/episodes/${id}/run-production`, { method: "POST" });
      showToast("Render started — polling for progress…");
      await refreshStatus(id);
    } catch (e: any) {
      showToast(e?.message ?? "Failed to start render");
    } finally {
      setRunningIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleMarkPreviewReady(id: number) {
    try {
      await customFetch(`/api/episodes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildStage: "preview_ready" }),
      });
      await refreshStatus(id);
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
    } catch (e: any) {
      showToast(e?.message ?? "Failed to update stage");
    }
  }

  async function handleReject(id: number) {
    const note = prompt("Rejection note (optional):") ?? undefined;
    try {
      await customFetch(`/api/episodes/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildNote: note }),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
      showToast("Episode rejected");
    } catch (e: any) {
      showToast(e?.message ?? "Failed to reject episode");
    }
  }

  async function handleApprove(id: number) {
    try {
      await customFetch(`/api/episodes/${id}/approve`, { method: "POST" });
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
      showToast("Episode approved! ✓");
    } catch (e: any) {
      showToast(e?.message ?? "Failed to approve episode");
    }
  }

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0C0C0C] text-[#FAF7EE] font-mono text-xs font-bold px-5 py-3 border-[2px] border-[#C9A800] shadow-[3px_3px_0_#C9A800] flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#C9A800]" />
          {toastMsg}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-[#C9A800] font-bold uppercase tracking-widest mb-1">Production Pipeline</p>
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase">Building</h1>
          </div>
          <div className="bg-[#C9A800] text-[#0C0C0C] font-display text-xl px-4 py-1 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] rotate-1">
            {isLoading ? "…" : (episodes?.length ?? 0)} IN PROGRESS
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#0C0C0C]" />
          </div>
        ) : !episodes || episodes.length === 0 ? (
          <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] p-16 text-center shadow-[5px_5px_0_#0C0C0C]">
            <p className="font-display text-4xl text-[#0C0C0C] mb-3">PIPELINE CLEAR</p>
            <p className="font-mono text-sm text-[#555]">No episodes currently in the building pipeline.</p>
            <a href="/new" className="inline-block mt-6 font-mono font-bold text-xs px-6 py-3 border-[2px] border-[#0C0C0C] bg-[#C9A800] text-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              + New Episode
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {episodes.map((ep) => (
              <BuildingCard
                key={ep.id}
                episode={ep}
                onRunProduction={handleRunProduction}
                onMarkPreviewReady={handleMarkPreviewReady}
                onReject={handleReject}
                onApprove={handleApprove}
                isRunningProduction={runningIds.has(ep.id)}
                buildStatus={buildStatuses[ep.id] ?? null}
                onRefreshStatus={refreshStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
