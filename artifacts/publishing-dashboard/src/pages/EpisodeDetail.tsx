import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import { 
  useGetEpisode, 
  useUpdateEpisode, 
  useApproveEpisode, 
  usePublishToYouTube,
  useGetYouTubeStatus,
  useRunProduction,
  Episode,
  EpisodeUpdate
} from "@workspace/api-client-react";
import { Navbar } from "../components/Navbar";
import { YouTubeBanner } from "../components/YouTubeBanner";
import { StatusBadge } from "../components/StatusBadge";
import { ArrowLeft, CheckCircle, Youtube, Loader2, Save, Clapperboard, RefreshCw, Eye, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { formatPKT } from "../lib/date";
import { useToast } from "@/hooks/use-toast";

export default function EpisodeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: episode, isLoading, refetch } = useGetEpisode(id, { query: { enabled: !!id, queryKey: ["/api/episodes", id] } });
  const { data: ytStatus } = useGetYouTubeStatus();
  const updateMutation = useUpdateEpisode();
  const approveMutation = useApproveEpisode();
  const publishMutation = usePublishToYouTube();
  const runProductionMutation = useRunProduction();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<EpisodeUpdate>>({});
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [fbStatus, setFbStatus] = useState<{ connected: boolean } | null>(null);
  const [fbIsPending, setFbIsPending] = useState(false);
  const [ytAnalytics, setYtAnalytics] = useState<{ views: number; likes: number; comments: number } | null>(null);
  const [fbAnalytics, setFbAnalytics] = useState<{ views: number; likes: number; comments: number; shares: number } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const initRef = useRef<number | null>(null);

  // Facebook credentials check
  useEffect(() => {
    fetch("/api/facebook/status")
      .then((r) => r.json())
      .then((data) => setFbStatus(data as { connected: boolean }))
      .catch(() => setFbStatus({ connected: false }));
  }, []);

  useEffect(() => {
    if (episode && initRef.current !== episode.id) {
      initRef.current = episode.id;
      setEditForm({
        youtubeTitle: episode.youtubeTitle,
        hashtags: episode.hashtags,
        scheduledPublishAt: episode.scheduledPublishAt || undefined
      });
      setPendingStatus(episode.status);
    }
  }, [episode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EDEAE0] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin" /></div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-[#EDEAE0] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center font-display text-4xl">Episode Not Found</div>
      </div>
    );
  }

  const handleSaveMetadata = () => {
    updateMutation.mutate(
      { id, data: editForm },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
          toast({ title: "Saved", description: "Metadata updated successfully.", className: "bg-[#0A6B52] text-white border-2 border-black rounded-none" });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update metadata.", variant: "destructive" });
        }
      }
    );
  };

  const handleApprove = () => {
    if (!confirmApprove) {
      setConfirmApprove(true);
      return;
    }
    approveMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setConfirmApprove(false);
          refetch();
          toast({ title: "Approved", description: "Episode is approved and ready for publishing.", className: "bg-[#0A6B52] text-white border-2 border-black rounded-none" });
        }
      }
    );
  };

  const handleStatusChange = () => {
    if (!pendingStatus || pendingStatus === episode.status) return;
    updateMutation.mutate(
      { id, data: { status: pendingStatus as Episode["status"] } },
      {
        onSuccess: () => {
          refetch();
          toast({ title: "Status Updated", description: `Episode moved to ${pendingStatus.toUpperCase()}.`, className: "bg-[#0C0C0C] text-white border-2 border-black rounded-none" });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
      }
    );
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    setYtAnalytics(null);
    setFbAnalytics(null);

    const promises: Promise<unknown>[] = [];

    if (episode?.youtubeVideoId) {
      promises.push(
        fetch(`/api/analytics/youtube/${id}`)
          .then((r) => {
            if (!r.ok) throw new Error(`YouTube: ${r.status}`);
            return r.json();
          })
          .then((data) => {
            setYtAnalytics(data as { views: number; likes: number; comments: number });
          })
          .catch((err) => {
            console.error("YT analytics error:", err);
            setAnalyticsError(err instanceof Error ? err.message : "YouTube analytics failed");
          }),
      );
    }

    if (episode?.facebookVideoId) {
      promises.push(
        fetch(`/api/analytics/facebook/${id}`)
          .then((r) => {
            if (!r.ok) throw new Error(`Facebook: ${r.status}`);
            return r.json();
          })
          .then((data) => {
            setFbAnalytics(data as { views: number; likes: number; comments: number; shares: number });
          })
          .catch((err) => {
            console.error("FB analytics error:", err);
          }),
      );
    }

    await Promise.all(promises);
    setAnalyticsLoading(false);
  };

  const handlePublishFacebook = async () => {
    setFbIsPending(true);
    try {
      const res = await fetch(`/api/facebook/publish/${id}`, { method: "POST" });
      const data = (await res.json()) as { error?: string; message?: string; facebookVideoId?: string };
      if (!res.ok) throw new Error(data.error ?? "Facebook publish failed");
      refetch();
      toast({
        title: "Posted to Facebook",
        description: data.message ?? "Uploaded to Facebook Page.",
        className: "bg-[#1877F2] text-white border-2 border-black rounded-none",
      });
    } catch (err) {
      toast({
        title: "Facebook Error",
        description: err instanceof Error ? err.message : "Facebook publish failed",
        variant: "destructive",
      });
    } finally {
      setFbIsPending(false);
    }
  };

  const handleRunProduction = () => {
    runProductionMutation.mutate(
      { id },
      {
        onSuccess: () => {
          refetch();
          toast({ title: "Production Started", description: "Episode is now building.", className: "bg-[#C9A800] text-[#0C0C0C] border-2 border-black rounded-none" });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to start production.", variant: "destructive" });
        }
      }
    );
  };

  const handlePublish = () => {
    // We'll publish as private by default for this example unless scheduled
    publishMutation.mutate(
      { 
        id, 
        data: { 
          privacyStatus: "private", 
          scheduleAt: editForm.scheduledPublishAt || null 
        } 
      },
      {
        onSuccess: (res) => {
          refetch();
          toast({ title: "Published", description: res.message, className: "bg-[#8B2FC9] text-white border-2 border-black rounded-none" });
        },
        onError: (err) => {
          const description =
            (err.data && typeof err.data === "object" && "error" in err.data
              ? String((err.data as { error?: unknown }).error)
              : undefined) || err.message || "Failed to publish";
          toast({ title: "Publish Error", description, variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <YouTubeBanner />

      <main className="max-w-5xl mx-auto px-6 pt-8">
        
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-[#C94A00] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#0C0C0C] text-white font-display text-5xl px-4 py-1 border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#C94A00]">
                EP {episode.epNumber}
              </div>
              <StatusBadge status={episode.status} className="text-lg px-3 py-1.5" />
            </div>
            <h1 className="font-display text-5xl text-[#0C0C0C] leading-tight mb-2">
              {episode.hookTitle}
            </h1>
            <div className="flex gap-3 text-sm font-mono font-bold text-[#555] uppercase">
              <span className="bg-[#E2DDD0] px-2 py-1 border-2 border-[#0C0C0C]">Season {episode.season}</span>
              <span className="bg-[#E2DDD0] px-2 py-1 border-2 border-[#0C0C0C]">Post Date: {formatPKT(episode.postDate)}</span>
              <span className="bg-[#E2DDD0] px-2 py-1 border-2 border-[#0C0C0C]">Dur: {episode.duration}</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            {episode.status === "review" && (
              <button 
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className={`brutal-btn flex items-center justify-center gap-2 py-3 ${confirmApprove ? 'bg-[#0A6B52] text-white' : 'brutal-btn-primary'}`}
              >
                {approveMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                {confirmApprove ? "CONFIRM APPROVE?" : "APPROVE EPISODE"}
              </button>
            )}

            {(episode.status === "approved" || episode.status === "scheduled") && (
              <button 
                onClick={handlePublish}
                disabled={publishMutation.isPending || (!ytStatus?.connected)}
                className="brutal-btn bg-[#8B2FC9] text-white border-[2.5px] border-[#0C0C0C] flex items-center justify-center gap-2 py-3 hover:bg-[#7a28b0]"
              >
                {publishMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Youtube className="w-5 h-5" />}
                {episode.status === "scheduled" ? "UPDATE YOUTUBE" : "PUBLISH TO YOUTUBE"}
              </button>
            )}

            {/* YouTube token expired warning */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(ytStatus as any)?.tokenHealth === "expired" && (
              <div className="font-mono text-[10px] font-bold text-[#C94A00] border-[1.5px] border-[#C94A00] px-2 py-1.5 bg-[#fff3f0] flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>YT token expired — run <code className="bg-[#f0d9d0] px-0.5">youtube-reauth.ts</code> and update the secret.</span>
              </div>
            )}

            {episode.youtubeVideoId && (
              <a 
                href={`https://youtube.com/shorts/${episode.youtubeVideoId}`} 
                target="_blank" rel="noreferrer"
                className="brutal-btn brutal-btn-secondary flex items-center justify-center gap-2 py-3 bg-[#E2DDD0]"
              >
                <Youtube className="w-5 h-5 text-[#C94A00]" />
                VIEW ON YOUTUBE
              </a>
            )}

            {/* Facebook publish — show when credentials are present and not yet posted */}
            {fbStatus?.connected &&
              !episode.facebookVideoId &&
              ["approved", "building", "scheduled", "published"].includes(episode.status) && (
              <button
                onClick={handlePublishFacebook}
                disabled={fbIsPending}
                className="brutal-btn flex items-center justify-center gap-2 py-3 text-white border-[2.5px] border-[#0C0C0C]"
                style={{ backgroundColor: "#1877F2" }}
              >
                {fbIsPending ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                )}
                POST TO FACEBOOK
              </button>
            )}

            {episode.facebookVideoId && (
              <a
                href={`https://www.facebook.com/watch/?v=${episode.facebookVideoId}`}
                target="_blank" rel="noreferrer"
                className="brutal-btn brutal-btn-secondary flex items-center justify-center gap-2 py-3 bg-[#E2DDD0]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                VIEW ON FACEBOOK
              </a>
            )}

            {/* ── Manual Status Change ── */}
            <div className="border-t-[2px] border-[#0C0C0C] pt-3 space-y-2">
              <p className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-widest">Change Status</p>

              {episode.status === "scripted" && (
                <button
                  onClick={handleRunProduction}
                  disabled={runProductionMutation.isPending}
                  className="w-full brutal-btn bg-[#C9A800] text-[#0C0C0C] border-[2.5px] border-[#0C0C0C] flex items-center justify-center gap-2 py-2 text-sm hover:brightness-95"
                >
                  {runProductionMutation.isPending
                    ? <Loader2 className="animate-spin w-4 h-4" />
                    : <Clapperboard className="w-4 h-4" />}
                  RUN PRODUCTION
                </button>
              )}

              <div className="flex gap-2">
                <select
                  value={pendingStatus || episode.status}
                  onChange={(e) => setPendingStatus(e.target.value)}
                  className="flex-1 font-mono text-xs border-[2px] border-[#0C0C0C] bg-[#FAF7EE] px-2 py-2 shadow-[2px_2px_0_#0C0C0C] focus:outline-none uppercase"
                >
                  {(["draft","scripted","review","approved","scheduled","published","building","rejected"] as const).map(s => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusChange}
                  disabled={updateMutation.isPending || !pendingStatus || pendingStatus === episode.status}
                  className="brutal-btn bg-[#0C0C0C] text-white font-mono text-xs px-3 py-2 border-[2px] border-[#0C0C0C] disabled:opacity-40 flex items-center gap-1"
                >
                  {updateMutation.isPending ? <Loader2 className="animate-spin w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                  APPLY
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: Content Script & Visuals */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Script Panel */}
            <div className="brutal-card p-6 bg-[#FAF7EE]">
              <h2 className="font-display text-3xl mb-4 flex items-center gap-3">
                <span className="bg-[#0C0C0C] text-white px-2 py-0.5 text-xl rotate-[-2deg]">1</span>
                VO Script
              </h2>
              <div className="font-sans text-lg leading-relaxed text-[#0C0C0C] whitespace-pre-wrap p-4 bg-[#E2DDD0] border-l-[4px] border-[#C94A00]">
                {episode.voScript}
              </div>
            </div>

            {/* Visuals & Production Notes Panel */}
            <div className="brutal-card p-6 bg-[#FAF7EE]">
              <h2 className="font-display text-3xl mb-4 flex items-center gap-3">
                <span className="bg-[#0C0C0C] text-white px-2 py-0.5 text-xl rotate-[2deg]">2</span>
                Production Notes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase text-[#555] mb-2">Visual Direction</h3>
                  <p className="font-sans bg-white border-2 border-[#0C0C0C] p-3 text-sm shadow-[2px_2px_0_#0C0C0C]">
                    {episode.visualDirection}
                  </p>
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase text-[#555] mb-2">Thumbnail Prompt</h3>
                  <p className="font-sans bg-white border-2 border-[#0C0C0C] p-3 text-sm shadow-[2px_2px_0_#0C0C0C]">
                    {episode.thumbnailPrompt}
                  </p>
                </div>
                {/* NOTE: Audio/BGM display removed — audio/sound is for reel generation only. DO NOT add it back here. */}
              </div>
            </div>

            {/* Citation Panel */}
            <div className="brutal-card p-6 bg-[#FAF7EE]">
              <h2 className="font-display text-3xl mb-4 flex items-center gap-3">
                <span className="bg-[#0C0C0C] text-white px-2 py-0.5 text-xl">3</span>
                Citation CTA
              </h2>
              <div className="font-sans bg-white border-2 border-[#0C0C0C] p-4 font-medium shadow-[3px_3px_0_#0A6B52]">
                {episode.citationCta}
              </div>
            </div>

          </div>

          {/* RIGHT COL: YouTube Metadata Editable */}
          <div className="space-y-6">
            <div className="brutal-card p-6 bg-[#FAF7EE] border-[#0C0C0C]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-3xl">YT Metadata</h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="font-mono text-xs font-bold uppercase text-[#C94A00] hover:text-[#0C0C0C] underline decoration-2 underline-offset-4"
                  >
                    Edit
                  </button>
                ) : (
                  <button 
                    onClick={handleSaveMetadata}
                    disabled={updateMutation.isPending}
                    className="brutal-btn brutal-btn-primary py-1 px-3 text-xs flex items-center gap-1 shadow-brutal-sm"
                  >
                    {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-mono text-sm font-bold uppercase text-[#555] mb-2">Title</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="brutal-input w-full"
                      value={editForm.youtubeTitle || ""}
                      onChange={(e) => setEditForm(prev => ({...prev, youtubeTitle: e.target.value}))}
                    />
                  ) : (
                    <div className="font-sans font-bold text-lg">{episode.youtubeTitle}</div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-sm font-bold uppercase text-[#555] mb-2">Hashtags</label>
                  {isEditing ? (
                    <textarea 
                      className="brutal-input w-full min-h-[80px] resize-none"
                      value={editForm.hashtags || ""}
                      onChange={(e) => setEditForm(prev => ({...prev, hashtags: e.target.value}))}
                    />
                  ) : (
                    <div className="font-mono text-sm text-[#0A6B52] bg-[#E2DDD0] p-2 border-2 border-[#0A6B52] break-words">
                      {episode.hashtags}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-sm font-bold uppercase text-[#555] mb-2">Schedule Time</label>
                  {isEditing ? (
                    <input
                      type="datetime-local"
                      className="brutal-input w-full text-sm font-mono"
                      value={
                        editForm.scheduledPublishAt
                          ? // datetime-local expects "YYYY-MM-DDTHH:mm" (no seconds / tz)
                            new Date(editForm.scheduledPublishAt)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        // Convert local datetime string back to full ISO for storage
                        const iso = e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined;
                        setEditForm((prev) => ({ ...prev, scheduledPublishAt: iso }));
                      }}
                    />
                  ) : (
                    <div className="font-mono text-sm">
                      {episode.scheduledPublishAt
                        ? formatPKT(episode.scheduledPublishAt)
                        : "Not scheduled"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="brutal-card p-6 bg-[#FAF7EE]">
              <h2 className="font-display text-2xl mb-4">Timeline</h2>
              <div className="space-y-4 border-l-2 border-[#0C0C0C] ml-2 pl-4 relative">
                <TimelineItem date={episode.createdAt} label="Created" color="bg-[#555]" />
                {episode.approvedAt && <TimelineItem date={episode.approvedAt} label="Approved" color="bg-[#0A6B52]" />}
                {episode.publishedAt && <TimelineItem date={episode.publishedAt} label="Published" color="bg-[#8B2FC9]" />}
              </div>
            </div>

            {/* Analytics Panel */}
            {(episode.youtubeVideoId || episode.facebookVideoId) && (
              <div className="brutal-card p-6 bg-[#FAF7EE] border-t-[4px] border-t-[#C94A00]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl">📊 Analytics</h2>
                  <button
                    onClick={fetchAnalytics}
                    disabled={analyticsLoading}
                    className="brutal-btn bg-[#0C0C0C] text-white font-mono text-[10px] font-bold px-3 py-1.5 border-2 border-[#0C0C0C] flex items-center gap-1 disabled:opacity-40"
                  >
                    {analyticsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    REFRESH
                  </button>
                </div>

                {analyticsError && (
                  <div className="font-mono text-[10px] font-bold text-[#C94A00] bg-[#fff3f0] border-[1.5px] border-[#C94A00] px-2 py-1.5 mb-3">
                    {analyticsError.split(": ").pop()}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* YouTube Analytics */}
                  {episode.youtubeVideoId && (
                    <div className="border-2 border-[#0C0C0C] p-3 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Youtube className="w-4 h-4 text-[#8B2FC9]" />
                        <span className="font-mono text-[10px] font-bold uppercase">YouTube</span>
                      </div>
                      <div className="space-y-2">
                        <AnalyticRow label="Views" value={ytAnalytics?.views ?? episode.youtubeViews ?? 0} color="#8B2FC9" />
                        <AnalyticRow label="Likes" value={ytAnalytics?.likes ?? episode.youtubeLikes ?? 0} color="#8B2FC9" />
                        <AnalyticRow label="Comments" value={ytAnalytics?.comments ?? episode.youtubeComments ?? 0} color="#8B2FC9" />
                      </div>
                    </div>
                  )}

                  {/* Facebook Analytics */}
                  {episode.facebookVideoId && (
                    <div className="border-2 border-[#0C0C0C] p-3 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                        </svg>
                        <span className="font-mono text-[10px] font-bold uppercase">Facebook</span>
                      </div>
                      <div className="space-y-2">
                        <AnalyticRow label="Views" value={fbAnalytics?.views ?? episode.facebookViews ?? 0} color="#1877F2" />
                        <AnalyticRow label="Likes" value={fbAnalytics?.likes ?? episode.facebookLikes ?? 0} color="#1877F2" />
                        <AnalyticRow label="Comments" value={fbAnalytics?.comments ?? episode.facebookComments ?? 0} color="#1877F2" />
                        <AnalyticRow label="Shares" value={fbAnalytics?.shares ?? episode.facebookShares ?? 0} color="#1877F2" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

function TimelineItem({ date, label, color }: { date: string, label: string, color: string }) {
  return (
    <div className="relative">
      <div className={`absolute -left-[23px] top-1 w-3 h-3 ${color} border-2 border-[#0C0C0C] rounded-full`}></div>
      <div className="font-mono font-bold text-xs uppercase">{label}</div>
      <div className="font-sans text-sm text-[#555]">{formatPKT(date)}</div>
    </div>
  );
}

function AnalyticRow({ label, value, color }: { label: string; value: number; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    Views: <Eye className="w-3 h-3" />,
    Likes: <ThumbsUp className="w-3 h-3" />,
    Comments: <MessageSquare className="w-3 h-3" />,
    Shares: <Share2 className="w-3 h-3" />,
  };
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase" style={{ color }}>
        {icons[label] ?? null} {label}
      </span>
      <span className="font-display text-lg tabular-nums">{value.toLocaleString()}</span>
    </div>
  );
}
