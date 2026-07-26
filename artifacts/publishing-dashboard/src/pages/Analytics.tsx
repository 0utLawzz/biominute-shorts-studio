import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "../components/Navbar";
import { StatusBadge } from "../components/StatusBadge";
import { Youtube, Eye, ThumbsUp, MessageSquare, Share2, RefreshCw, Loader2, Facebook } from "lucide-react";

interface EpisodeAnalytics {
  id: number;
  epNumber: number;
  hookTitle: string;
  youtubeVideoId: string | null;
  youtubeViews: number;
  youtubeLikes: number;
  youtubeComments: number;
  facebookVideoId: string | null;
  facebookViews: number;
  facebookLikes: number;
  facebookComments: number;
  facebookShares: number;
  publishedAt: string | null;
}

interface AnalyticsData {
  total: number;
  byEpisode: EpisodeAnalytics[];
  totalYoutubeViews: number;
  totalFacebookViews: number;
  totalYoutubeLikes: number;
  totalFacebookLikes: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingEpisodes, setRefreshingEpisodes] = useState<Set<number>>(new Set());

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/episodes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as AnalyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    // Refresh live from YouTube/Facebook APIs for all published episodes
    if (data) {
      const fbConnected = await fetch("/api/facebook/status")
        .then((r) => r.json())
        .then((d) => (d as { connected?: boolean }).connected ?? false)
        .catch(() => false);

      const epsToRefresh = data.byEpisode;
      for (const ep of epsToRefresh) {
        setRefreshingEpisodes((prev) => new Set(prev).add(ep.id));
        const promises: Promise<unknown>[] = [];
        if (ep.youtubeVideoId) {
          promises.push(
            fetch(`/api/analytics/youtube/${ep.id}`).catch(() => {}),
          );
        }
        if (ep.facebookVideoId && fbConnected) {
          promises.push(
            fetch(`/api/analytics/facebook/${ep.id}`).catch(() => {}),
          );
        }
        await Promise.all(promises);
        setRefreshingEpisodes((prev) => {
          const next = new Set(prev);
          next.delete(ep.id);
          return next;
        });
      }
    }
    await fetchData(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEAE0] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin" /></div>
      </div>
    );
  }

  const totalViewsYt = data?.totalYoutubeViews ?? 0;
  const totalViewsFb = data?.totalFacebookViews ?? 0;
  const totalLikesYt = data?.totalYoutubeLikes ?? 0;
  const totalLikesFb = data?.totalFacebookLikes ?? 0;

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-5xl text-[#0C0C0C]">📊 Analytics</h1>
            <p className="font-mono text-sm text-[#555] mt-1">
              Live performance metrics for published episodes
            </p>
          </div>
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className="brutal-btn bg-[#0C0C0C] text-white border-[2.5px] border-[#0C0C0C] flex items-center gap-2 py-3 px-5 font-mono text-xs font-bold uppercase disabled:opacity-40"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            REFRESH ALL
          </button>
        </div>

        {error && (
          <div className="font-mono text-sm font-bold text-[#C94A00] bg-[#fff3f0] border-2 border-[#C94A00] px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Aggregate Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="brutal-card p-5 bg-white border-t-[4px] border-t-[#8B2FC9]">
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="w-5 h-5 text-[#8B2FC9]" />
              <span className="font-mono text-[10px] font-bold uppercase">YouTube Views</span>
            </div>
            <span className="font-display text-4xl tabular-nums">{totalViewsYt.toLocaleString()}</span>
          </div>
          <div className="brutal-card p-5 bg-white border-t-[4px] border-t-[#1877F2]">
            <div className="flex items-center gap-2 mb-2">
              <Facebook className="w-5 h-5 text-[#1877F2]" />
              <span className="font-mono text-[10px] font-bold uppercase">FB Views</span>
            </div>
            <span className="font-display text-4xl tabular-nums">{totalViewsFb.toLocaleString()}</span>
          </div>
          <div className="brutal-card p-5 bg-white border-t-[4px] border-t-[#8B2FC9]">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-[#8B2FC9]" />
              <span className="font-mono text-[10px] font-bold uppercase">YT Likes</span>
            </div>
            <span className="font-display text-4xl tabular-nums">{totalLikesYt.toLocaleString()}</span>
          </div>
          <div className="brutal-card p-5 bg-white border-t-[4px] border-t-[#1877F2]">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-[#1877F2]" />
              <span className="font-mono text-[10px] font-bold uppercase">FB Likes</span>
            </div>
            <span className="font-display text-4xl tabular-nums">{totalLikesFb.toLocaleString()}</span>
          </div>
        </div>

        {/* Per-Episode Table */}
        {data && data.byEpisode.length > 0 ? (
          <div className="brutal-card bg-[#FAF7EE] overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-[#0C0C0C] bg-[#0C0C0C] text-white">
                  <th className="text-left p-3 font-bold uppercase">Ep</th>
                  <th className="text-left p-3 font-bold uppercase">Title</th>
                  <th className="text-left p-3 font-bold uppercase">
                    <div className="flex items-center gap-1"><Youtube className="w-3 h-3" /> Views</div>
                  </th>
                  <th className="text-left p-3 font-bold uppercase">
                    <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Likes</div>
                  </th>
                  <th className="text-left p-3 font-bold uppercase">
                    <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Comments</div>
                  </th>
                  <th className="text-left p-3 font-bold uppercase">
                    <div className="flex items-center gap-1"><Facebook className="w-3 h-3" /> FB Views</div>
                  </th>
                  <th className="text-left p-3 font-bold uppercase">
                    <Share2 className="w-3 h-3" /> Shares
                  </th>
                  <th className="text-left p-3 font-bold uppercase">
                    <RefreshCw className="w-3 h-3" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.byEpisode.map((ep) => {
                  const isRefreshing = refreshingEpisodes.has(ep.id);
                  return (
                    <tr key={ep.id} className="border-b border-[#CCC] hover:bg-[#E2DDD0] transition-colors">
                      <td className="p-3 font-bold">
                        <Link href={`/episodes/${ep.id}`} className="hover:text-[#C94A00]">
                          EP{ep.epNumber}
                        </Link>
                      </td>
                      <td className="p-3 max-w-[200px] truncate font-sans">{ep.hookTitle}</td>
                      <td className="p-3 tabular-nums font-bold" style={{ color: ep.youtubeViews ? "#8B2FC9" : "#999" }}>
                        {ep.youtubeViews.toLocaleString()}
                      </td>
                      <td className="p-3 tabular-nums">{ep.youtubeLikes.toLocaleString()}</td>
                      <td className="p-3 tabular-nums">{ep.youtubeComments.toLocaleString()}</td>
                      <td className="p-3 tabular-nums font-bold" style={{ color: ep.facebookViews ? "#1877F2" : "#999" }}>
                        {ep.facebookViews.toLocaleString()}
                      </td>
                      <td className="p-3 tabular-nums">{ep.facebookShares.toLocaleString()}</td>
                      <td className="p-3">
                        {ep.youtubeVideoId || ep.facebookVideoId ? (
                          <span className={`inline-flex items-center gap-1 font-bold ${isRefreshing ? "animate-pulse text-[#C94A00]" : "text-[#555]"}`}>
                            {isRefreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : "✓"}
                          </span>
                        ) : (
                          <span className="text-[#999]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="brutal-card p-12 bg-[#FAF7EE] text-center">
            <p className="font-display text-2xl text-[#555] mb-2">No published episodes yet</p>
            <p className="font-mono text-sm text-[#777]">Analytics will appear here once episodes are published to YouTube or Facebook.</p>
          </div>
        )}
      </main>
    </div>
  );
}
