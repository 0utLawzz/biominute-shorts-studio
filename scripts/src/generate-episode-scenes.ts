import fs from "node:fs";
import path from "node:path";
import { db, episodesTable } from "@workspace/db";
import { and, gte, lte } from "drizzle-orm";

const root = path.resolve(import.meta.dirname, "../..");
const scenesDir = path.join(root, "artifacts/biominute-reels/src/components/video/video_scenes");

const contentTemplate = (episode: {
  epNumber: number;
  title: string;
  season: string;
  voScript: string;
  visualDirection: string;
  citationCta: string;
}) => `export const EPISODE_CONTENT = ${JSON.stringify(episode, null, 2)} as const;\n`;

const wrapperTemplate = (ep: number, scene: number) =>
  `import GeneratedScene from './GeneratedScene';\nimport { EPISODE_CONTENT } from './ep${ep}_Content';\n\nexport function Scene${scene}() {\n  return <GeneratedScene scene={${scene}} content={EPISODE_CONTENT} />;\n}\n`;

const rows = await db
  .select({
    epNumber: episodesTable.epNumber,
    title: episodesTable.hookTitle,
    season: episodesTable.season,
    voScript: episodesTable.voScript,
    visualDirection: episodesTable.visualDirection,
    citationCta: episodesTable.citationCta,
  })
  .from(episodesTable)
  .where(and(gte(episodesTable.epNumber, 81), lte(episodesTable.epNumber, 90)));

if (rows.length !== 10) {
  throw new Error(`Expected 10 episodes, found ${rows.length}`);
}

for (const row of rows) {
  fs.writeFileSync(path.join(scenesDir, `ep${row.epNumber}_Content.ts`), contentTemplate(row));
  for (let scene = 0; scene <= 4; scene++) {
    fs.writeFileSync(path.join(scenesDir, `ep${row.epNumber}_Scene${scene}.tsx`), wrapperTemplate(row.epNumber, scene));
  }
}

await db.$client.end();
console.log(`Generated archived scene wrappers for Episodes ${rows[0].epNumber}–${rows.at(-1)?.epNumber}.`);