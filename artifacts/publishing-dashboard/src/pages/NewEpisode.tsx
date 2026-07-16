import React, { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Upload, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { customFetch } from "@workspace/api-client-react";

type Mode = null | "upload" | "ai";

const SEASONS = [
  "S1: Morning Habits",
  "S2: Movement & Body",
  "S3: Sleep & Recovery",
  "S4: Stress & Mind",
  "S5: Nutrition & Myths",
  "S6: Healthy Aging & Longevity",
];

const DEFAULT_FORM = {
  epNumber: "",
  postDate: "",
  season: SEASONS[0],
  duration: "60s",
  hookTitle: "",
  youtubeTitle: "",
  voScript: "",
  visualDirection: "",
  bgSound: "calm ambient",
  thumbnailPrompt: "",
  citationCta: "",
  hashtags: "",
  aspectRatio: "9:16",
};

export default function NewEpisode() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>(null);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGenerate() {
    if (!topic.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await customFetch<{
        hookTitle: string;
        youtubeTitle: string;
        voScript: string;
        visualDirection: string;
        thumbnailPrompt: string;
        citationCta: string;
        hashtags: string;
      }>("/api/episodes/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, season: form.season }),
      });
      setForm((prev) => ({
        ...prev,
        hookTitle: result.hookTitle,
        youtubeTitle: result.youtubeTitle,
        voScript: result.voScript,
        visualDirection: result.visualDirection,
        thumbnailPrompt: result.thumbnailPrompt,
        citationCta: result.citationCta,
        hashtags: result.hashtags,
      }));
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate script");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    const epNum = parseInt(form.epNumber, 10);
    if (isNaN(epNum) || epNum <= 0) {
      setError("Episode number must be a positive integer");
      return;
    }
    if (!form.postDate || !form.hookTitle || !form.voScript) {
      setError("Post date, hook title, and script are required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await customFetch<{ id: number }>("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          epNumber: epNum,
          postDate: form.postDate,
          season: form.season,
          duration: form.duration,
          hookTitle: form.hookTitle,
          youtubeTitle: form.youtubeTitle || form.hookTitle,
          voScript: form.voScript,
          visualDirection: form.visualDirection,
          bgSound: form.bgSound,
          thumbnailPrompt: form.thumbnailPrompt,
          citationCta: form.citationCta,
          hashtags: form.hashtags,
          aspectRatio: form.aspectRatio,
        }),
      });
      navigate(`/episodes/${created.id}`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create episode");
    } finally {
      setSaving(false);
    }
  }

  // ── Choice Gate ───────────────────────────────────────────────────────────────
  if (!mode) {
    return (
      <div className="min-h-screen bg-[#0C0C0C]">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="font-mono text-xs text-[#C9A800] font-bold uppercase tracking-widest mb-2">New Episode</p>
            <h1 className="font-display text-7xl text-[#FAF7EE] leading-none uppercase">
              HOW DO YOU<br />WANT TO START?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Upload Asset */}
            <button
              onClick={() => setMode("upload")}
              className="group text-left bg-[#1A1A1A] border-[3px] border-[#FAF7EE] p-8 shadow-[6px_6px_0_#FAF7EE] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              <div className="w-14 h-14 bg-[#FAF7EE] border-[3px] border-[#FAF7EE] flex items-center justify-center mb-6">
                <Upload size={28} className="text-[#0C0C0C]" />
              </div>
              <h2 className="font-display text-4xl text-[#FAF7EE] uppercase mb-3">UPLOAD ASSET</h2>
              <p className="font-mono text-xs text-[#999] leading-relaxed">
                You have the script ready. Fill in all fields manually and enter the building pipeline.
              </p>
              <div className="flex items-center gap-2 mt-6 font-mono text-xs font-bold text-[#C9A800] uppercase">
                Fill form <ChevronRight size={14} />
              </div>
            </button>

            {/* AI Generate */}
            <button
              onClick={() => setMode("ai")}
              className="group text-left bg-[#1A1A1A] border-[3px] border-[#C9A800] p-8 shadow-[6px_6px_0_#C9A800] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              <div className="w-14 h-14 bg-[#C9A800] border-[3px] border-[#C9A800] flex items-center justify-center mb-6">
                <Sparkles size={28} className="text-[#0C0C0C]" />
              </div>
              <h2 className="font-display text-4xl text-[#C9A800] uppercase mb-3">AI GENERATE</h2>
              <p className="font-mono text-xs text-[#999] leading-relaxed">
                Enter a health topic and get a complete script template instantly. Edit before saving.
              </p>
              <div className="flex items-center gap-2 mt-6 font-mono text-xs font-bold text-[#C9A800] uppercase">
                Generate draft <ChevronRight size={14} />
              </div>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Full Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#EDEAE0] pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setMode(null)}
            className="flex items-center gap-2 font-mono text-xs font-bold text-[#555] hover:text-[#0C0C0C] uppercase"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="h-[2px] bg-[#0C0C0C] flex-1" />
          <div className={`font-mono text-xs font-bold px-3 py-1 border-[2px] border-[#0C0C0C] uppercase ${
            mode === "ai" ? "bg-[#C9A800] text-[#0C0C0C]" : "bg-[#FAF7EE] text-[#0C0C0C]"
          }`}>
            {mode === "ai" ? "✦ AI Generate" : "↑ Upload Asset"}
          </div>
        </div>

        <h1 className="font-display text-5xl text-[#0C0C0C] uppercase mb-8">New Episode</h1>

        {/* AI Topic Generator (only in AI mode) */}
        {mode === "ai" && (
          <div className="bg-[#0C0C0C] border-[3px] border-[#0C0C0C] p-6 mb-8 shadow-[5px_5px_0_#C9A800]">
            <p className="font-mono text-xs text-[#C9A800] font-bold uppercase mb-3">✦ Generate from Topic</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. cold exposure, circadian rhythm, gut health…"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                className="flex-1 bg-[#1A1A1A] border-[2px] border-[#555] text-[#FAF7EE] font-mono text-sm px-4 py-2 placeholder:text-[#444] focus:border-[#C9A800] outline-none"
              />
              <button
                onClick={handleGenerate}
                disabled={generating || !topic.trim()}
                className="flex items-center gap-2 bg-[#C9A800] text-[#0C0C0C] font-mono font-bold text-xs px-5 py-2 border-[2px] border-[#C9A800] shadow-[3px_3px_0_#FAF7EE] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {generating ? "Generating…" : "Generate"}
              </button>
            </div>
            {form.hookTitle && (
              <p className="font-mono text-xs text-[#0D9970] mt-3">✓ Script generated — review and edit below before saving</p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-[#FFE8E8] border-[2px] border-[#C94A00] text-[#C94A00] font-mono text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Episode Number */}
          <Field label="Episode Number" required>
            <input
              type="number"
              min={1}
              value={form.epNumber}
              onChange={(e) => set("epNumber", e.target.value)}
              className={INPUT}
              placeholder="e.g. 37"
            />
          </Field>

          {/* Post Date */}
          <Field label="Post Date" required>
            <input
              type="date"
              value={form.postDate}
              onChange={(e) => set("postDate", e.target.value)}
              className={INPUT}
            />
          </Field>

          {/* Season */}
          <Field label="Season" required>
            <select value={form.season} onChange={(e) => set("season", e.target.value)} className={INPUT}>
              {SEASONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          {/* Duration */}
          <Field label="Duration">
            <input
              type="text"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              className={INPUT}
              placeholder="60s"
            />
          </Field>

          {/* Hook Title */}
          <Field label="Hook Title" required className="md:col-span-2">
            <input
              type="text"
              value={form.hookTitle}
              onChange={(e) => set("hookTitle", e.target.value)}
              className={INPUT}
              placeholder="The truth about X nobody tells you"
            />
          </Field>

          {/* YouTube Title */}
          <Field label="YouTube Title" className="md:col-span-2">
            <input
              type="text"
              value={form.youtubeTitle}
              onChange={(e) => set("youtubeTitle", e.target.value)}
              className={INPUT}
              placeholder="Auto-filled from hook title if empty"
            />
          </Field>

          {/* VO Script */}
          <Field label="VO Script" required className="md:col-span-2">
            <textarea
              rows={10}
              value={form.voScript}
              onChange={(e) => set("voScript", e.target.value)}
              className={`${INPUT} resize-y`}
              placeholder="[HOOK — 0:00-0:05]&#10;Your hook line here…"
            />
          </Field>

          {/* Visual Direction */}
          <Field label="Visual Direction" className="md:col-span-2">
            <textarea
              rows={4}
              value={form.visualDirection}
              onChange={(e) => set("visualDirection", e.target.value)}
              className={`${INPUT} resize-y`}
              placeholder="Describe the visual style, colors, and key imagery…"
            />
          </Field>

          {/* Thumbnail Prompt */}
          <Field label="Thumbnail Prompt" className="md:col-span-2">
            <textarea
              rows={3}
              value={form.thumbnailPrompt}
              onChange={(e) => set("thumbnailPrompt", e.target.value)}
              className={`${INPUT} resize-y`}
              placeholder="AI image generation prompt for thumbnail…"
            />
          </Field>

          {/* BG Sound */}
          <Field label="Background Sound">
            <input
              type="text"
              value={form.bgSound}
              onChange={(e) => set("bgSound", e.target.value)}
              className={INPUT}
              placeholder="calm ambient"
            />
          </Field>

          {/* Aspect Ratio */}
          <Field label="Aspect Ratio">
            <select value={form.aspectRatio} onChange={(e) => set("aspectRatio", e.target.value)} className={INPUT}>
              <option value="9:16">9:16 (Vertical / Shorts)</option>
              <option value="16:9">16:9 (Landscape)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </Field>

          {/* Citation CTA */}
          <Field label="Citation / CTA" className="md:col-span-2">
            <input
              type="text"
              value={form.citationCta}
              onChange={(e) => set("citationCta", e.target.value)}
              className={INPUT}
              placeholder="Source + call to action text"
            />
          </Field>

          {/* Hashtags */}
          <Field label="Hashtags" className="md:col-span-2">
            <input
              type="text"
              value={form.hashtags}
              onChange={(e) => set("hashtags", e.target.value)}
              className={INPUT}
              placeholder="#BioMinute #HealthScience …"
            />
          </Field>
        </div>

        {/* Save */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-xs font-bold px-6 py-3 border-[2px] border-[#0C0C0C] bg-[#FAF7EE] shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 font-mono text-xs font-bold px-8 py-3 border-[2px] border-[#0C0C0C] bg-[#C9A800] text-[#0C0C0C] shadow-[3px_3px_0_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving ? "Saving…" : "Save & Enter Pipeline"}
          </button>
        </div>
      </main>
    </div>
  );
}

const INPUT = "w-full bg-white border-[2px] border-[#0C0C0C] font-mono text-sm px-3 py-2 focus:border-[#C9A800] outline-none";

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-mono text-xs font-bold text-[#555] uppercase mb-1.5">
        {label} {required && <span className="text-[#C94A00]">*</span>}
      </label>
      {children}
    </div>
  );
}
