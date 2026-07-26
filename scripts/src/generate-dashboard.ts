import fs from 'node:fs';
import path from 'node:path';
import { db, episodesTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');
const DASHBOARD_OUTPUT = path.resolve(PROJECT_ROOT, 'exports/dashboard.html');
const EXPORTS_DIR = path.resolve(PROJECT_ROOT, 'exports');

type Episode = typeof episodesTable.$inferSelect;

function findEpisodeFolder(epNumber: number): string | null {
  const padded = String(epNumber).padStart(2, '0');
  if (!fs.existsSync(EXPORTS_DIR)) return null;
  const entries = fs.readdirSync(EXPORTS_DIR);
  const match = entries.find((name) => name.startsWith(`Episode-${padded}-`) && fs.existsSync(path.join(EXPORTS_DIR, name, 'episode.mp4')));
  return match ? `exports/${match}` : null;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'published': return 'published';
    case 'scheduled': return 'scheduled';
    case 'complete': return 'complete';
    case 'scripted': return 'scripted';
    default: return 'queued';
  }
}

function getParts(value: Date | string, options: Intl.DateTimeFormatOptions): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-PK', { timeZone: 'Asia/Karachi', ...options }).formatToParts(new Date(value));
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return map;
}

/** DD-MMM-YY hh:mm AM/PM — e.g. 20-Jul-26 02:00 PM */
function formatPKDateTime(value: Date | string | null | undefined): string {
  if (!value) return '';
  const p = getParts(value, { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
  return `${p.day}-${p.month}-${p.year} ${p.hour}:${p.minute} ${p.dayPeriod}`;
}

/** DD-MMM-YY — e.g. 20-Jul-26 */
function formatPKDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const p = getParts(value, { day: '2-digit', month: 'short', year: '2-digit' });
  return `${p.day}-${p.month}-${p.year}`;
}

function generateDashboard(episodes: Episode[]): string {
  const total = episodes.length;
  const published = episodes.filter((e) => e.status === 'published').length;
  const scheduled = episodes.filter((e) => e.status === 'scheduled').length;
  const complete = episodes.filter((e) => e.status === 'complete').length;
  const scripted = episodes.filter((e) => e.status === 'scripted').length;
  const queued = total - published - scheduled - complete - scripted;

  const cards = episodes
    .map((ep) => {
      const folder = findEpisodeFolder(ep.epNumber);
      const thumb = folder
        ? `        <video class="thumb" poster="${folder}/thumbnail.png" controls muted preload="none">
          <source src="${folder}/episode.mp4" type="video/mp4">
        </video>`
        : `        <div class="thumb placeholder">Not produced yet</div>`;

      const meta: string[] = [];
      if (ep.postDate) meta.push(`Post: ${formatPKDate(ep.postDate)}`);
      if (ep.status === 'published' && ep.publishedAt) meta.push(`Published: ${formatPKDateTime(ep.publishedAt)} PKT`);
      if (ep.status === 'scheduled' && ep.scheduledPublishAt) meta.push(`Scheduled: ${formatPKDateTime(ep.scheduledPublishAt)} PKT`);
      if (ep.youtubeVideoId) meta.push(`<a href="https://youtu.be/${ep.youtubeVideoId}" target="_blank">YouTube</a>`);

      return `
      <div class="card" data-status="${ep.status}">
        <div class="card-num">EP ${ep.epNumber}</div>
${thumb}
        <div class="card-body">
          <div class="card-title">${ep.hookTitle}</div>
          <div class="card-meta">
            <span class="badge ${statusBadgeClass(ep.status)}">${ep.status}</span>
          </div>
          <div class="card-details">${meta.join(' • ')}</div>
        </div>
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BioMinute — Production Dashboard</title>
<style>
  :root {
    --dark: #0F172A; --blue: #2F6FED; --emerald: #10B981; --orange: #F97316; --white: #FFFFFF; --purple: #8B5CF6;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--dark); color: var(--white);
    font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
    padding: 32px 24px 64px;
  }
  header { max-width: 1200px; margin: 0 auto 28px; }
  h1 {
    font-size: 28px; margin: 0 0 6px; font-weight: 700;
    background: linear-gradient(90deg, var(--blue), var(--emerald));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .sub { color: #94a3b8; font-size: 14px; margin-bottom: 18px; }
  .stats { display: flex; gap: 14px; margin-bottom: 8px; flex-wrap: wrap; }
  .stat {
    background: #16213e; border: 1px solid #1e2a4a; border-radius: 10px;
    padding: 10px 16px; font-size: 13px; color: #cbd5e1;
  }
  .stat b { color: var(--white); font-size: 16px; display: block; }
  .filters { display: flex; gap: 8px; margin: 18px 0; flex-wrap: wrap; }
  .filter-btn {
    background: #16213e; border: 1px solid #1e2a4a; color: #cbd5e1;
    padding: 7px 14px; border-radius: 20px; font-size: 13px; cursor: pointer;
  }
  .filter-btn.active { background: var(--blue); color: white; border-color: var(--blue); }
  .grid {
    max-width: 1200px; margin: 0 auto; display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px;
  }
  .card {
    background: #131c33; border: 1px solid #1e2a4a; border-radius: 14px; overflow: hidden;
    transition: transform 0.15s ease;
  }
  .card:hover { transform: translateY(-3px); border-color: var(--emerald); }
  .card-num {
    position: absolute; margin: 10px; font-size: 11px; font-weight: 700;
    letter-spacing: 1px; color: var(--emerald); font-family: monospace;
  }
  .thumb {
    width: 100%; aspect-ratio: 9/16; background: #0a0f1e; object-fit: cover; display: block;
  }
  .thumb.placeholder {
    display: flex; align-items: center; justify-content: center;
    color: #475569; font-size: 12px; text-align: center; padding: 16px;
  }
  .card-body { padding: 12px 14px 14px; position: relative; }
  .card-title { font-size: 13.5px; font-weight: 600; line-height: 1.35; margin-bottom: 8px; min-height: 36px; }
  .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-bottom: 6px; }
  .badge { padding: 3px 9px; border-radius: 20px; font-weight: 700; letter-spacing: 0.3px; text-transform: capitalize; }
  .badge.published { background: rgba(16,185,129,0.18); color: var(--emerald); }
  .badge.scheduled { background: rgba(139,92,246,0.18); color: var(--purple); }
  .badge.complete { background: rgba(47,111,237,0.18); color: var(--blue); }
  .badge.scripted { background: rgba(37,99,235,0.12); color: #2563EB; border: 1px solid rgba(37,99,235,0.35); }
  .badge.queued { background: rgba(249,115,22,0.15); color: var(--orange); }
  .card-details { font-size: 11px; color: #64748b; line-height: 1.5; }
  .card-details a { color: var(--emerald); text-decoration: none; }
  .card-details a:hover { text-decoration: underline; }
</style>
</head>
<body>
<header>
  <h1>BioMinute Production Dashboard</h1>
  <div class="sub">Live pipeline status — combines the local export folders, the database state, and the YouTube publishing queue.</div>
  <div class="stats">
    <div class="stat"><b>${total}</b>Total episodes</div>
    <div class="stat"><b>${published}</b>Published</div>
    <div class="stat"><b>${scheduled}</b>Scheduled</div>
    <div class="stat"><b>${complete}</b>Complete</div>
    <div class="stat"><b>${scripted}</b>Scripted</div>
    <div class="stat"><b>${queued}</b>Queued</div>
  </div>
  <div class="filters">
    <button class="filter-btn active" onclick="filterCards('all', this)">All</button>
    <button class="filter-btn" onclick="filterCards('published', this)">Published</button>
    <button class="filter-btn" onclick="filterCards('scheduled', this)">Scheduled</button>
    <button class="filter-btn" onclick="filterCards('complete', this)">Complete</button>
    <button class="filter-btn" onclick="filterCards('scripted', this)">Scripted</button>
    <button class="filter-btn" onclick="filterCards('queued', this)">Queued</button>
  </div>
</header>
<div class="grid" id="grid">
${cards}
</div>
<script>
function filterCards(status, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.card').forEach(c => {
    c.style.display = (status === 'all' || c.dataset.status === status) ? '' : 'none';
  });
}
</script>
</body>
</html>`;
}

async function main() {
  const episodes = await db
    .select()
    .from(episodesTable)
    .orderBy(asc(episodesTable.epNumber));

  if (episodes.length === 0) {
    console.warn('No episodes found in the database — dashboard is empty.');
  }

  const html = generateDashboard(episodes as Episode[]);
  fs.writeFileSync(DASHBOARD_OUTPUT, html);
  console.log(
    `Generated dashboard for ${episodes.length} episodes at ${path.resolve(DASHBOARD_OUTPUT)}`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
