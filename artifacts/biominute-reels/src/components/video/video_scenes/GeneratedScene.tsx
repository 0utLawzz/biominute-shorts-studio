import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  CheckCircle2,
  Clock3,
  CloudSun,
  Dumbbell,
  Ear,
  Heart,
  Leaf,
  MoonStar,
  Music2,
  NotebookPen,
  PawPrint,
  Pill,
  Salad,
  Smile,
  Sparkles,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BOTTOM_SAFE_ZONE_PX } from "@/lib/video";

type EpisodeContent = {
  epNumber: number;
  title: string;
  season: string;
  voScript: string;
  visualDirection: string;
  citationCta: string;
};

const iconFor = (content: EpisodeContent): LucideIcon => {
  const text = `${content.title} ${content.visualDirection}`.toLowerCase();
  if (text.includes("melatonin") || text.includes("milk") || text.includes("sleep")) return MoonStar;
  if (text.includes("blanket")) return CloudSun;
  if (text.includes("journal") || text.includes("writing")) return NotebookPen;
  if (text.includes("music") || text.includes("hormone")) return Music2;
  if (text.includes("doomscroll") || text.includes("phone")) return Brain;
  if (text.includes("nature")) return Leaf;
  if (text.includes("laughter")) return Smile;
  if (text.includes("pets")) return PawPrint;
  if (text.includes("vegetable") || text.includes("nutrition")) return Salad;
  if (text.includes("exercise") || text.includes("workout")) return Dumbbell;
  if (text.includes("stress") || text.includes("anxiety")) return Heart;
  if (text.includes("sound") || text.includes("listening")) return Ear;
  if (text.includes("energy")) return Activity;
  return Sparkles;
};

const cleanSentences = (script: string) =>
  script
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const shorten = (value: string, max = 150) =>
  value.length <= max ? value : `${value.slice(0, max).replace(/\s+\S*$/, "")}…`;

function Shell({ children, accent = "#10B981" }: { children: React.ReactNode; accent?: string }) {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.06 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="absolute top-[7%] w-[560px] h-[560px] rounded-full blur-[140px]"
        style={{ background: `radial-gradient(circle, ${accent}30, transparent 68%)` }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:80px_80px]" />
      {children}
    </motion.div>
  );
}

export default function GeneratedScene({
  scene,
  content,
}: {
  scene: number;
  content: EpisodeContent;
}) {
  const Icon = iconFor(content);
  const sentences = cleanSentences(content.voScript);
  const accent = scene % 2 === 0 ? "#10B981" : "#2F6FED";
  const title = content.title.replace(/\?$/, "");
  const claims = [
    sentences[0] ?? content.visualDirection,
    sentences[1] ?? "Small, practical changes can make a meaningful difference.",
    sentences[2] ?? "The best approach depends on your goals and daily routine.",
  ];

  if (scene === 0) {
    return (
      <Shell accent={accent}>
        <div className="absolute top-[170px] flex flex-col items-center gap-7 z-10 w-full px-12 text-center">
          <motion.div
            className="w-[220px] h-[220px] rounded-full flex items-center justify-center border-2"
            style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}12` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 22 }}
          >
            <Icon size={108} strokeWidth={1.25} />
          </motion.div>
          <div className="px-6 py-3 rounded-2xl border" style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}12` }}>
            <span className="font-display font-bold text-[17px] uppercase tracking-wider">
              EP {content.epNumber} · {content.season.replace(/^S\d+:\s*/, "")}
            </span>
          </div>
        </div>
        <div className="absolute w-full px-12 text-center z-20" style={{ bottom: BOTTOM_SAFE_ZONE_PX + 90 }}>
          <motion.h1
            className="text-[#f8fafc] text-[43px] font-bold uppercase tracking-wider font-display leading-tight"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            {title}
          </motion.h1>
        </div>
      </Shell>
    );
  }

  if (scene === 4) {
    return (
      <Shell accent="#10B981">
        <div className="absolute top-[190px] z-10 w-[90%]">
          <motion.div
            className="bg-[#1e293b]/95 border border-[#334155] rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl"
            initial={{ scale: 0.86, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 25 }}
          >
            <div className="w-24 h-24 rounded-full bg-[#10B981] flex items-center justify-center">
              <CheckCircle2 size={48} color="#f8fafc" strokeWidth={1.8} />
            </div>
            <h2 className="text-[#f8fafc] text-[36px] font-bold uppercase tracking-wider font-display leading-tight mt-7">
              One useful takeaway
            </h2>
            <p className="text-[#94a3b8] text-[22px] leading-snug mt-6">{shorten(sentences.at(-1) ?? content.visualDirection, 190)}</p>
            <div className="flex items-center gap-3 mt-7 bg-[#0F172A]/80 px-5 py-4 rounded-xl border border-white/10">
              <Sparkles size={24} color="#10B981" />
              <span className="text-[#94a3b8] text-[20px]">Save this evidence-based tip</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute w-full px-12 z-30 flex justify-center" style={{ bottom: BOTTOM_SAFE_ZONE_PX + 55 }}>
          <div className="flex items-center gap-3 text-[#94a3b8] text-[17px] bg-[#0F172A]/90 px-5 py-4 rounded-xl border border-white/10">
            <span>{shorten(content.citationCta.replace(/^CTA:\s*/i, ""), 145)}</span>
          </div>
        </div>
      </Shell>
    );
  }

  const heading = scene === 1 ? "What the evidence says" : scene === 2 ? "What matters most" : "Keep it practical";
  const sceneClaims = scene === 1 ? claims : scene === 2 ? [content.visualDirection, claims[1], claims[2]] : [claims[2], claims[0], "Consistency beats chasing a perfect fix."];
  return (
    <Shell accent={accent}>
      <div className="absolute top-[145px] flex flex-col items-center gap-5 z-10 w-full px-10">
        <motion.div
          className="px-8 py-4 rounded-2xl border"
          style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}12` }}
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <span className="font-display font-bold text-[22px] uppercase tracking-wider">{heading}</span>
        </motion.div>
        {sceneClaims.map((claim, index) => (
          <motion.div
            key={`${scene}-${index}`}
            className="bg-[#1e293b] border border-[#334155] rounded-[24px] px-7 py-5 flex items-center gap-5 w-full"
            initial={{ x: index % 2 ? 35 : -35, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.25, type: "spring", stiffness: 120, damping: 25 }}
          >
            <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}20`, border: `3px solid ${accent}45` }}>
              {index === 0 ? <Icon size={28} color={accent} /> : index === 1 ? <Waves size={28} color={accent} /> : <Clock3 size={28} color={accent} />}
            </div>
            <p className="text-[#dbeafe] font-body text-[20px] leading-snug">{shorten(claim, 155)}</p>
          </motion.div>
        ))}
      </div>
      <div className="absolute w-full px-12 text-center z-20" style={{ bottom: BOTTOM_SAFE_ZONE_PX + 78 }}>
        <motion.h2
          className="text-[#f8fafc] text-[43px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          {scene === 1 ? "Not magic" : scene === 2 ? "Small changes" : "Make it doable"}
          <span className="block mt-2" style={{ color: accent }}>{scene === 1 ? "just evidence" : scene === 2 ? "add up" : "for your routine"}</span>
        </motion.h2>
      </div>
    </Shell>
  );
}