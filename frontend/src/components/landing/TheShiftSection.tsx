import { useRef } from "react";
import { X, Check, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";

const OLD_WAY = [
  "Passive video lectures with no interaction",
  "Generic multiple-choice assignments",
  "Getting stuck for days waiting for help",
  "No human or AI code reviews",
  "A static certificate with no proof of skill"
];

const VIDYAVERSE_WAY = [
  "Hands-on coding exercises built into every lecture",
  "Real-world GitHub projects evaluated against rubrics",
  "Detailed, line-by-line AI code reviews on every submission",
  "Semantic AI code reviews in under 10 seconds",
  "A verified, runnable portfolio to show employers"
];

export default function TheShiftSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "start 0.15"]
  });

  const videoOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const videoRotate = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const videoBlur = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const videoFilter = useTransform(videoBlur, (v) => `blur(${v}px)`);
  const codeOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const codeScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const codeRotate = useTransform(scrollYProgress, [0, 1], [8, 0]);

  return (
    <section ref={containerRef} className="py-24 bg-[var(--bg-main)] border-t border-[var(--border-primary)]/60 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
              Most courses hand you a video.<br />
              <span className="text-[#00BFB3]">We hand you a terminal.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-[var(--text-secondary)] text-lg leading-relaxed">
              Passive video consumption doesn't create job-ready developers. Here's what changes when you learn by building.
            </p>
          </Reveal>
        </div>

        {/* Scroll-linked morph: video player -> live code + AI review */}
        <Reveal delay={0.15} className="relative h-[340px] md:h-[420px] max-w-3xl mx-auto mb-16" style={{ perspective: 1200 }}>
          {/* Video player mock */}
          <motion.div
            style={{ opacity: videoOpacity, scale: videoScale, rotate: videoRotate, filter: videoFilter }}
            className="absolute inset-0 rounded-2xl border border-[var(--border-primary)] bg-[#0A0E1A] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-transparent" />
              <div className="relative w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-800">
              <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden mb-2">
                <div className="h-full w-1/3 bg-slate-500 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Lecture 4 — Loops &amp; Iteration</span>
                <span>04:12 / 12:40</span>
              </div>
            </div>
          </motion.div>

          {/* Code + AI review mock */}
          <motion.div
            style={{ opacity: codeOpacity, scale: codeScale, rotate: codeRotate }}
            className="absolute inset-0 rounded-2xl border border-[var(--accent-indigo)]/30 bg-[#0A0E1A] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="h-9 border-b border-slate-800 flex items-center px-4 gap-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              <span className="ml-3 text-[10px] text-slate-500 font-mono">loops.py — AI review in progress</span>
            </div>
            <div className="flex-1 p-5 font-mono text-xs sm:text-sm text-[#cbd5e1] flex flex-col gap-2.5 overflow-hidden">
              <div className="flex gap-4"><span className="text-slate-600 select-none">1</span><span><span className="text-blue-400">def</span> <span className="text-yellow-200">total_price</span>(items):</span></div>
              <div className="flex gap-4"><span className="text-slate-600 select-none">2</span><span className="pl-4">total = 0</span></div>
              <div className="flex gap-4"><span className="text-slate-600 select-none">3</span><span className="pl-4"><span className="text-blue-400">for</span> item <span className="text-blue-400">in</span> items:</span></div>
              <div className="flex gap-4"><span className="text-slate-600 select-none">4</span><span className="pl-8">total += item.price</span></div>
              <div className="flex gap-4"><span className="text-slate-600 select-none">5</span><span className="pl-4"><span className="text-blue-400">return</span> total</span></div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-2 flex items-start gap-2 rounded-lg border border-[var(--accent-indigo)]/30 bg-[var(--accent-indigo)]/10 px-3 py-2.5"
              >
                <Check className="w-3.5 h-3.5 text-[var(--accent-indigo)] mt-0.5 shrink-0" />
                <span className="text-[11px] text-[#cbd5e1] leading-relaxed">Works — but consider <code className="text-[var(--accent-indigo)]">sum(i.price for i in items)</code> for a more idiomatic one-liner.</span>
              </motion.div>
            </div>
          </motion.div>
        </Reveal>

        {/* Retained: Old Way vs Fraylon Way comparison */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Reveal direction="left" delay={0.2} className="w-full">
            <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full flex flex-col">
              <h3 className="text-lg font-bold text-[var(--text-muted)] mb-6 pb-4 border-b border-[var(--border-primary)]">
                The Old Way
              </h3>
              <ul className="space-y-5 flex-1">
                {OLD_WAY.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.3} className="w-full">
            <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--accent-indigo)]/30 h-full flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-indigo)]/10 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 pb-4 border-b border-[var(--accent-indigo)]/20">
                The VIDYAVERSE Way
              </h3>
              <ul className="space-y-5 flex-1 relative z-10">
                {VIDYAVERSE_WAY.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[var(--accent-indigo)]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--accent-indigo)]" />
                    </div>
                    <span className="text-sm text-[var(--text-primary)] opacity-90 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
