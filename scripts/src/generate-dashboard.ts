import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');
const PRODUCTION_LOG = path.resolve(PROJECT_ROOT, 'exports/production-log.md');
const DASHBOARD_OUTPUT = path.resolve(PROJECT_ROOT, 'exports/dashboard.html');

type EpisodeStatus = 'Complete' | 'Uncomplete' | 'Built — awaiting export';

interface Episode {
  number: number;
  title: string;
  status: EpisodeStatus;
  dateCompleted: string | null;
  folder: string;
  notes: string;
}

function parseProductionLog(): Episode[] {
  const content = fs.readFileSync(PRODUCTION_LOG, 'utf8');
  const lines = content.split('\n');
  const episodes: Episode[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.includes('Episode #') || trimmed.startsWith('|---')) {
      continue;
    }

    // Match the table row pattern exactly: | num | title | status | date | `folder` | notes |
    // This is more robust than splitting on every pipe because notes may contain pipes.
    const match = trimmed.match(
      /^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|$/
    );
    if (!match) continue;

    const [, numStr, title, status, dateCompleted, folderRaw, notes] = match;
    const number = parseInt(numStr, 10);
    if (Number.isNaN(number)) continue;

    const folder = folderRaw.replace(/\/$/, '');

    episodes.push({
      number,
      title: title.trim(),
      status: status.trim() as EpisodeStatus,
      dateCompleted: dateCompleted.trim() === '—' || dateCompleted.trim() === '-' ? null : dateCompleted.trim(),
      folder,
      notes: notes.trim(),
    });
  }

  return episodes.sort((a, b) => a.number - b.number);
}

function extractPlannedDate(notes: string): string | null {
  const match = notes.match(/Planned post date:\s*([^|]+)/i);
  return match ? match[1].trim() : null;
}

function generateDashboard(episodes: Episode[]): string {
  const total = episodes.length;
  const complete = episodes.filter((e) => e.status === 'Complete').length;
  const uncomplete = total - complete;

  const cards = episodes
    .map((ep) => {
      const displayStatus = ep.status === 'Complete' ? 'Complete' : 'Uncomplete';
      const statusClass = ep.status === 'Complete' ? 'complete' : 'queued';
      const date =
        ep.status === 'Complete'
          ? ep.dateCompleted || '—'
          : extractPlannedDate(ep.notes) || 'Not scheduled';

      // The dashboard lives in exports/; use a path relative to that folder so the
      // preview works whether the file is opened directly or served from the project root.
      const relativeFolder = ep.folder.replace(/^exports\//, '');
      const thumb =
        ep.status === 'Complete'
          ? `        <video class="thumb" poster="${relativeFolder}/thumbnail.png" controls preload="none">
          <source src="${relativeFolder}/episode.mp4" type="video/mp4">
        </video>`
          : `        <div class="thumb placeholder">Not produced yet</div>`;

      return `
      <div class="card" data-status="${displayStatus}">
        <div class="card-num">EP ${ep.number}</div>
${thumb}
        <div class="card-body">
          <div class="card-title">${ep.title}</div>
          <div class="card-meta">
            <span class="badge ${statusClass}">${displayStatus}</span>
            <span class="date">${date}</span>
          </div>
        </div>
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BioMinute — Production Dashboard</title>
<style>
  :root {
    --dark: #0F172A; --blue: #2F6FED; --emerald: #10B981; --orange: #F97316; --white: #FFFFFF;
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
  .filters { display: flex; gap: 8px; margin: 18px 0; }
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
  .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
  .badge { padding: 3px 9px; border-radius: 20px; font-weight: 700; letter-spacing: 0.3px; }
  .badge.complete { background: rgba(16,185,129,0.18); color: var(--emerald); }
  .badge.queued { background: rgba(249,115,22,0.15); color: var(--orange); }
  .date { color: #64748b; }
</style>
</head>
<body>
<header>
  <h1>BioMinute Production Dashboard</h1>
  <div class="sub">Self-contained repo preview — scripts, status, and finished videos travel together. Re-import into any Replit account and this still works.</div>
  <div class="stats">
    <div class="stat"><b>${total}</b>Total episodes</div>
    <div class="stat"><b>${complete}</b>Complete</div>
    <div class="stat"><b>${uncomplete}</b>Uncomplete</div>
  </div>
  <div class="filters">
    <button class="filter-btn active" onclick="filterCards('all', this)">All</button>
    <button class="filter-btn" onclick="filterCards('Complete', this)">Complete</button>
    <button class="filter-btn" onclick="filterCards('Uncomplete', this)">Uncomplete</button>
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

function main() {
  const episodes = parseProductionLog();
  if (episodes.length === 0) {
    throw new Error(`No episodes found in ${PRODUCTION_LOG}`);
  }
  const html = generateDashboard(episodes);
  fs.writeFileSync(DASHBOARD_OUTPUT, html);
  console.log(
    `Generated dashboard for ${episodes.length} episodes at ${path.resolve(DASHBOARD_OUTPUT)}`,
  );
}

main();
