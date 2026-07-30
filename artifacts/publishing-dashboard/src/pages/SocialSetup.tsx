import React, { useState } from "react";
import { Loader2, Youtube, Facebook, CheckCircle2, XCircle, ExternalLink, KeyRound, RefreshCw, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Navbar } from "../components/Navbar";

interface YouTubeStatus {
  connected: boolean;
  channelName: string | null;
  channelId: string | null;
  tokenHealth: string;
  playlists: Record<string, boolean>;
}

interface FacebookStatus {
  connected: boolean;
  pageId: string | null;
  hasAccessToken: boolean;
  hasPageId: boolean;
}

const StatusDot = ({ ok }: { ok: boolean | null }) => {
  if (ok === null) return <span className="inline-block w-3 h-3 rounded-full bg-[#999]" />;
  if (ok) return <CheckCircle2 className="inline w-5 h-5 text-[#0D9970]" />;
  return <XCircle className="inline w-5 h-5 text-[#C94A00]" />;
};

const Section = ({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) => (
  <section
    className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[5px_5px_0_#0C0C0C] p-6"
    style={{ borderTop: `8px solid ${color}` }}
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="inline-flex items-center justify-center w-9 h-9 border-[3px] border-[#0C0C0C]" style={{ background: color, color: "#FAF7EE" }}>
        {icon}
      </span>
      <h2 className="font-display text-3xl text-[#0C0C0C] leading-none uppercase">{title}</h2>
    </div>
    {children}
  </section>
);

const CodeBlock = ({ children }: { children: string }) => (
  <code className="font-mono text-xs bg-[#0C0C0C] text-[#FAF7EE] px-2 py-1 inline-block break-all">{children}</code>
);

const LinkOut = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#0D9970] font-bold underline inline-flex items-center gap-1 hover:text-[#0A6B52]"
  >
    {children} <ExternalLink className="w-3 h-3" />
  </a>
);

const YouTubeSection = ({ status }: { status: YouTubeStatus | undefined }) => {
  const allPlaylistsConfigured = status?.playlists
    ? Object.values(status.playlists).every(Boolean)
    : false;

  return (
    <Section title="YouTube" icon={<Youtube className="w-5 h-5" />} color="#FF0000">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Connection</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot ok={status?.connected ?? null} />
            <span className="font-display text-xl">{status?.connected ? "CONNECTED" : "NOT CONNECTED"}</span>
          </div>
        </div>
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Token health</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot ok={status?.tokenHealth === "valid"} />
            <span className="font-display text-xl">
              {status?.tokenHealth === "valid"
                ? "REFRESH TOKEN OK"
                : status?.tokenHealth === "expired"
                  ? "REFRESH TOKEN EXPIRED"
                  : status?.tokenHealth === "no_credentials"
                    ? "NO CREDENTIALS"
                    : "PROBE ERROR"}
            </span>
          </div>
        </div>
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Channel</div>
          <div className="font-display text-base mt-1 truncate">
            {status?.channelId ? (
              <LinkOut href={`https://youtube.com/channel/${status.channelId}`}>
                {status?.channelName ?? status.channelId}
              </LinkOut>
            ) : (
              "—"
            )}
          </div>
        </div>
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Season playlists</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot ok={allPlaylistsConfigured} />
            <span className="font-display text-base">
              {status?.playlists ? `${Object.values(status.playlists).filter(Boolean).length} / 6` : "—"}
            </span>
          </div>
        </div>
      </div>

      {status?.tokenHealth === "expired" && (
        <div className="bg-[#FEF3C7] border-[3px] border-[#C9A800] p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 text-[#C9A800]" />
          <div className="font-sans text-sm">
            <strong>Refresh token expired.</strong> Run <CodeBlock>youtube-reauth.ts</CodeBlock> from a Replit Shell, then update the <CodeBlock>YOUTUBE_REFRESH_TOKEN</CodeBlock> secret.
          </div>
        </div>
      )}

      <h3 className="font-display text-xl uppercase mt-2 mb-3">Setup steps (one-time)</h3>
      <ol className="list-decimal pl-5 space-y-2 font-sans text-sm leading-relaxed">
        <li>
          Create a Google Cloud project at <LinkOut href="https://console.cloud.google.com/">console.cloud.google.com</LinkOut> and enable the <strong>YouTube Data API v3</strong>.
        </li>
        <li>
          In <strong>APIs &amp; Services → Credentials</strong>, create an <strong>OAuth 2.0 Client ID</strong> (type: Web application).
          Add <CodeBlock>http://localhost</CodeBlock> as an authorised redirect URI for local reauth.
        </li>
        <li>
          In Replit, open the <strong>Secrets</strong> tab and add these four secrets:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><CodeBlock>YOUTUBE_CLIENT_ID</CodeBlock> — paste your OAuth client ID</li>
            <li><CodeBlock>YOUTUBE_CLIENT_SECRET</CodeBlock> — paste your OAuth client secret</li>
            <li><CodeBlock>YOUTUBE_CHANNEL_ID</CodeBlock> — UC... string from your channel About page</li>
            <li><CodeBlock>YOUTUBE_CHANNEL_NAME</CodeBlock> — your channel's display name</li>
          </ul>
        </li>
        <li>
          Run the reauth tool to mint a refresh token:
          <pre className="font-mono text-xs bg-[#0C0C0C] text-[#FAF7EE] p-3 mt-2 overflow-x-auto">
            pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts
          </pre>
          Copy the printed refresh token into the <CodeBlock>YOUTUBE_REFRESH_TOKEN</CodeBlock> secret. The tool will also print suggested bindings for the six season playlists (<CodeBlock>YOUTUBE_PLAYLIST_S1</CodeBlock>...<CodeBlock>S6</CodeBlock>) — paste each into a secret.
        </li>
        <li>
          Restart the <strong>api-server</strong> workflow. The dashboard polls <CodeBlock>/api/youtube/status</CodeBlock> every page load; the pills above should flip to <span className="text-[#0D9970] font-bold">CONNECTED</span>.
        </li>
      </ol>

      <div className="mt-4 bg-[#0C0C0C] text-[#FAF7EE] p-3 font-mono text-xs">
        <KeyRound className="w-4 h-4 inline mr-2" />
        7 secrets total · all stored in Replit Secrets · never committed to the repo
      </div>
    </Section>
  );
};

const FacebookSection = ({ status }: { status: FacebookStatus | undefined }) => {
  return (
    <Section title="Facebook" icon={<Facebook className="w-5 h-5" />} color="#1877F2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Connection</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot ok={status?.connected ?? null} />
            <span className="font-display text-xl">{status?.connected ? "CONNECTED" : "NOT CONNECTED"}</span>
          </div>
        </div>
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Page</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot ok={status?.hasPageId ?? null} />
            {status?.pageId ? (
              <LinkOut href={`https://facebook.com/${status.pageId}`}>
                facebook.com/{status.pageId}
              </LinkOut>
            ) : (
              <span className="font-mono text-sm truncate">—</span>
            )}
          </div>
        </div>
        <div className="bg-white border-2 border-[#0C0C0C] p-4">
          <div className="font-mono text-xs text-[#555] uppercase">Access token set</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot ok={status?.hasAccessToken ?? null} />
            <span className="font-display text-base">{status?.hasAccessToken ? "PRESENT" : "MISSING"}</span>
          </div>
        </div>
      </div>

      <h3 className="font-display text-xl uppercase mt-2 mb-3">Setup steps (one-time)</h3>
      <ol className="list-decimal pl-5 space-y-2 font-sans text-sm leading-relaxed">
        <li>
          Create or open your Facebook Page that will host the shorts.
        </li>
        <li>
          Create a Facebook App at <LinkOut href="https://developers.facebook.com/apps/">developers.facebook.com/apps</LinkOut>.
          Add the product <strong>Pages API</strong> (or use Marketing API) and grant the <code className="font-mono text-xs bg-[#0C0C0C] text-[#FAF7EE] px-2 py-0.5">pages_manage_posts</code>, <code className="font-mono text-xs bg-[#0C0C0C] text-[#FAF7EE] px-2 py-0.5">pages_read_engagement</code>, and <code className="font-mono text-xs bg-[#0C0C0C] text-[#FAF7EE] px-2 py-0.5">pages_show_list</code> permissions.
        </li>
        <li>
          Generate a <strong>Page Access Token</strong> (long-lived, never-expires preferred) via the Graph API Explorer or the <LinkOut href="https://developers.facebook.com/tools/accesstoken/">Access Token Tool</LinkOut>. The token must be a <strong>Page</strong> token, not a User token.
        </li>
        <li>
          In Replit Secrets, add:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><CodeBlock>FACEBOOK_PAGE_ID</CodeBlock> — numeric page ID (find it in Page → About)</li>
            <li><CodeBlock>FACEBOOK_PAGE_ACCESS_TOKEN</CodeBlock> — the long-lived page token</li>
          </ul>
        </li>
        <li>
          Restart the <strong>api-server</strong> workflow. The dashboard polls <CodeBlock>/api/facebook/status</CodeBlock>; the pills above flip to <span className="text-[#0D9970] font-bold">CONNECTED</span>.
        </li>
        <li>
          To cross-post an already-uploaded YouTube episode, run:
          <pre className="font-mono text-xs bg-[#0C0C0C] text-[#FAF7EE] p-3 mt-2 overflow-x-auto">
            pnpm --filter @workspace/scripts exec tsx ./src/facebook-bulk-schedule.ts 36 37 38
          </pre>
          This uploads the MP4 from <CodeBlock>exports/Episode-NN-…/</CodeBlock> to the page with the standard title + description, scheduled 1/day starting tomorrow 09:00 UTC.
        </li>
      </ol>

      <div className="mt-4 bg-[#0C0C0C] text-[#FAF7EE] p-3 font-mono text-xs">
        <KeyRound className="w-4 h-4 inline mr-2" />
        2 secrets · Page Access Token never expires but can be invalidated if rotated · commit only the page ID; never commit the token
      </div>
    </Section>
  );
};

export default function SocialSetup() {
  const yt = useQuery<YouTubeStatus>({
    queryKey: ["/api/youtube/status"],
    queryFn: () => customFetch("/api/youtube/status"),
    refetchInterval: 60_000,
  });
  const fb = useQuery<FacebookStatus>({
    queryKey: ["/api/facebook/status"],
    queryFn: () => customFetch("/api/facebook/status"),
    refetchInterval: 60_000,
  });

  const [activeTab, setActiveTab] = useState<"youtube" | "facebook">("youtube");
  const bothConnected = yt.data?.connected && fb.data?.connected;

  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-[#C9A800] font-bold uppercase tracking-widest mb-1">Connect your accounts</p>
            <h1 className="font-display text-6xl text-[#0C0C0C] leading-none uppercase">Social Setup</h1>
            <p className="font-sans text-sm text-[#555] mt-2 max-w-2xl">
              Step-by-step walkthrough for connecting YouTube and Facebook to the BioMinute publishing pipeline. Every secret lives in Replit Secrets — never in this repo.
            </p>
            <div className="font-mono text-xs mt-3 flex flex-wrap gap-3">
              <span className="bg-[#FF0000] text-white px-2 py-1 border-2 border-[#0C0C0C]">
                YouTube: {yt.data?.connected ? "✓" : "✗"}
              </span>
              <span className="bg-[#1877F2] text-white px-2 py-1 border-2 border-[#0C0C0C]">
                Facebook: {fb.data?.connected ? "✓" : "✗"}
              </span>
              <span className="bg-[#0A6B52] text-white px-2 py-1 border-2 border-[#0C0C0C]">
                Both connected: {bothConnected ? "yes" : "no"}
              </span>
            </div>
          </div>
          <button
            onClick={() => { yt.refetch(); fb.refetch(); }}
            className="bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C] px-4 py-2 font-mono text-sm font-bold uppercase flex items-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#0C0C0C] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${yt.isFetching || fb.isFetching ? "animate-spin" : ""}`} /> Re-probe
          </button>
        </div>

        <div className="flex gap-0 mb-6 inline-flex border-[3px] border-[#0C0C0C] shadow-[4px_4px_0_#0C0C0C]">
          <button
            onClick={() => setActiveTab("youtube")}
            className={`px-5 py-2 font-display text-lg uppercase flex items-center gap-2 ${
              activeTab === "youtube" ? "bg-[#FF0000] text-white" : "bg-[#FAF7EE] text-[#999] hover:text-[#0C0C0C]"
            }`}
          >
            <Youtube className="w-4 h-4" /> YouTube
          </button>
          <button
            onClick={() => setActiveTab("facebook")}
            className={`px-5 py-2 font-display text-lg uppercase flex items-center gap-2 ${
              activeTab === "facebook" ? "bg-[#1877F2] text-white" : "bg-[#FAF7EE] text-[#999] hover:text-[#0C0C0C]"
            }`}
          >
            <Facebook className="w-4 h-4" /> Facebook
          </button>
        </div>

        {(yt.isLoading || fb.isLoading) ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#0C0C0C]" />
          </div>
        ) : activeTab === "youtube" ? (
          <YouTubeSection status={yt.data} />
        ) : (
          <FacebookSection status={fb.data} />
        )}

        <div className="mt-8 font-mono text-xs text-[#555]">
          Full troubleshooting: see <CodeBlock>docs/Social-Platforms-Setup.md</CodeBlock> in the repo.
        </div>
      </main>
    </div>
  );
}
