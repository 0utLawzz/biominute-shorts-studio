import React, { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useListEpisodes, useApproveEpisode, useUpdateEpisode } from "@workspace/api-client-react";
import type { Episode } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function PreviewQueue() {
  const queryClient = useQueryClient();
  const { data: allBuilding, isLoading } = useListEpisodes({ status: "building" });
  const approveMutation = useApproveEpisode();
  const updateMutation = useUpdateEpisode();
  const [selected, setSelected] = useState<Episode | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Only show preview_ready episodes
  const episodes = allBuilding?.filter((ep) => ep.buildStage === "preview_ready") ?? [];

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function handleApprove(id: number) {
    approveMutation.mutate(
      { id },
      {
        onSuccess: () => {
          showToast("Episode approved and moved to queue ✓");
          queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
          setSelected(null);
        },
        onError: (e: any) => showToast(e?.message ?? "Failed to approve"),
      }
    );
  }

  function handleReject(id: number) {
    const note = prompt("Rejection note (optional):") ?? undefined;
    updateMutation.mutate(
      { id, data: { status: "rejected" as any, buildNote: note } as any },
      {
        onSuccess: () => {
          showToast("Episode sent back to rejected");
          queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
          setSelected(null);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />

      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0C0C0C] text-[#FAF7EE] font-mono text-xs font-bold px-5 py-3 border-[2px] border-[#C9A800] shadow-[3px_3px_0_#C9A800]">
          {toastMsg}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-[#8B2FC9] font-bold uppercase tracking-widest mb-1">Review & Approve</p>
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase">Preview Queue</h1>
          </div>
          <div className="bg-[#8B2FC9] text-white font-display text-xl px-4 py-1 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] -rotate-1">
            {isLoading ? "…" : episodes.length} AWAITING REVIEW
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Episode List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
            ) : episodes.length === 0 ? (
              <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] p-8 text-center shadow-[3px_3px_0_#0C0C0C]">
                <p className="font-display text-2xl text-[#0C0C0C]">QUEUE EMPTY</p>
                <p className="font-mono text-xs text-[#555] mt-2">Mark exported episodes as Preview Ready from the Building page.</p>
              </div>
            ) : (
              episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setSelected(ep)}
                  className={`w-full text-left p-4 border-[3px] shadow-[3px_3px_0_#0C0C0C] transition-all ${
                    selected?.id === ep.id
                      ? "bg-[#8B2FC9] border-[#8B2FC9] text-white"
                      : "bg-[#FAF7EE] border-[#0C0C0C] hover:border-[#8B2FC9]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-display text-2xl">EP {String(ep.epNumber).padStart(2, "0")}</span>
                    <span className={`font-mono text-xs font-bold border px-2 py-0.5 ${
                      selected?.id === ep.id ? "border-white text-white" : "border-[#8B2FC9] text-[#8B2FC9]"
                    }`}>
                      PREVIEW READY
                    </span>
                  </div>
                  <p className="font-sans text-sm line-clamp-2 mt-1">{ep.hookTitle}</p>
                  <p className="font-mono text-xs text-[#999] mt-1">{ep.postDate}</p>
                </button>
              ))
            )}
          </div>

          {/* Preview Panel */}
          <div>
            {selected ? (
              <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[5px_5px_0_#0C0C0C]">
                {/* Video Player */}
                <div className="bg-[#0C0C0C] border-b-[3px] border-[#0C0C0C] flex items-center justify-center" style={{ minHeight: 360 }}>
                  <video
                    key={selected.id}
                    controls
                    className="max-h-[480px] max-w-full"
                    style={{ aspectRatio: "9/16", maxHeight: 480 }}
                  >
                    <source src={`/api/episodes/${selected.id}/video`} type="video/mp4" />
                    <p className="text-white font-mono text-sm p-4">Video not available — ensure production was run.</p>
                  </video>
                </div>

                {/* Meta */}
                <div className="p-6 border-b-[3px] border-[#0C0C0C]">
                  <h2 className="font-display text-3xl text-[#0C0C0C] mb-1">EP {String(selected.epNumber).padStart(2, "0")} — {selected.hookTitle}</h2>
                  <p className="font-mono text-xs text-[#555]">{selected.season} · {selected.postDate}</p>
                </div>

                {/* Script */}
                <div className="p-6 border-b-[3px] border-[#0C0C0C]">
                  <p className="font-mono text-xs font-bold text-[#555] uppercase mb-2">VO Script</p>
                  <pre className="font-mono text-xs text-[#0C0C0C] whitespace-pre-wrap bg-[#E2DDD0] p-4 border-[2px] border-[#0C0C0C] max-h-48 overflow-y-auto">
                    {selected.voScript}
                  </pre>
                </div>

                {/* Actions */}
                <div className="p-6 flex gap-4">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={approveMutation.isPending}
                    className="flex items-center gap-2 font-mono font-bold text-sm px-6 py-3 border-[2px] border-[#0C0C0C] bg-[#0D9970] text-white shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase disabled:opacity-50"
                  >
                    {approveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    className="flex items-center gap-2 font-mono font-bold text-sm px-6 py-3 border-[2px] border-[#0C0C0C] bg-[#FAF7EE] text-[#C94A00] shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[5px_5px_0_#0C0C0C] flex items-center justify-center" style={{ minHeight: 360 }}>
                <div className="text-center">
                  <p className="font-display text-3xl text-[#0C0C0C]">SELECT AN EPISODE</p>
                  <p className="font-mono text-xs text-[#555] mt-2">Choose an episode from the list to preview it</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
