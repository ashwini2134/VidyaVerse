import { useState } from "react";
import { motion } from "framer-motion";

// ─── Reveal helper (matches pattern used in other landing components) ─────────
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Capability cards data ────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    icon: "🔍",
    title: "Intelligent Error Detection",
    points: [
      "Analyses your submitted Python code",
      "Understands which test cases failed",
      "Compares expected vs actual output",
      "Identifies syntax, logic and formatting mistakes",
    ],
  },
  {
    icon: "🧠",
    title: "Socratic AI Guidance",
    points: [
      "Identifies the root cause of the failure",
      "Shows evidence from your code and test results",
      "Provides a concept clue to guide understanding",
      "Asks a guiding question — not the answer",
      "Suggests a concrete next debugging step",
    ],
  },
  {
    icon: "📈",
    title: "Progressive Hints",
    points: [
      "Level 1 — Conceptual hint (gentle nudge)",
      "Level 2 — Targeted guidance (points to the area)",
      "Level 3 — Step-by-step reasoning (without the solution)",
    ],
  },
  {
    icon: "💡",
    title: "Learn Instead of Copy",
    points: [
      "Encourages you to reason through the problem",
      "Helps you understand why your code failed",
      "Builds independent problem-solving ability",
    ],
  },
];

// ─── Sample diagnosis data ────────────────────────────────────────────────────
const HINT_LEVELS = [
  {
    label: "Level 1 — Gentle",
    badge: "L1",
    color: "from-violet-500/10 to-violet-600/5",
    border: "border-violet-500/20",
    badgeColor: "bg-violet-500/15 text-violet-400",
    rootCause: "The code uses subtraction instead of addition.",
    evidence: "Your program outputs -2, while the expected result is 12.",
    conceptClue: "Think about which arithmetic operator calculates a sum.",
    guidingQuestion:
      "Which operator should combine these two numbers to produce 12?",
    nextStep: "Review the operator in your print statement.",
  },
  {
    label: "Level 2 — Targeted",
    badge: "L2",
    color: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/20",
    badgeColor: "bg-blue-500/15 text-blue-400",
    rootCause: "Wrong arithmetic operator used instead of addition.",
    evidence: "print(a - b) evaluates to -2, not 12.",
    conceptClue: "The problem asks for a sum — use the + operator.",
    guidingQuestion:
      "What does 'sum' mean in Python, and which operator computes it?",
    nextStep: "Change the operator inside your print() call.",
  },
  {
    label: "Level 3 — Step-by-Step",
    badge: "L3",
    color: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20",
    badgeColor: "bg-emerald-500/15 text-emerald-400",
    rootCause: "Subtraction operator (-) used where addition (+) is required.",
    evidence:
      "5 - 7 = -2 but 5 + 7 = 12. Your print uses - so it produces -2.",
    conceptClue:
      "Python arithmetic: + adds, - subtracts. The word 'sum' maps to +.",
    guidingQuestion:
      "If a = 5 and b = 7, what does print(a + b) output vs print(a - b)?",
    nextStep:
      "Replace - with + in your print statement and re-run the test case.",
  },
];

export default function BharatCodeAISection() {
  const [activeLevel, setActiveLevel] = useState(0);
  const level = HINT_LEVELS[activeLevel];

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-canvas) 0%, color-mix(in srgb, var(--accent-indigo) 3%, var(--bg-canvas)) 50%, var(--bg-canvas) 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <Reveal>
          <div className="text-center mb-16">
            {/* eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[11px] font-bold tracking-widest text-[var(--accent-indigo)] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-indigo)] animate-pulse" />
              Powered by BharatCode AI
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
              Meet BharatCode AI —
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-indigo), #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Personal Coding Companion
              </span>
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
              Don't just fix errors. Understand them.{" "}
              <strong className="text-[var(--text-primary)]">
                Learn from every mistake.
              </strong>
            </p>
          </div>
        </Reveal>

        {/* ── Capability cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 flex flex-col gap-4 hover:border-[var(--accent-indigo)]/40 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl">{cap.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm leading-snug">
                  {cap.title}
                </h3>
                <ul className="flex flex-col gap-2 mt-auto">
                  {cap.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)] leading-relaxed"
                    >
                      <span className="text-[var(--accent-indigo)] mt-0.5 flex-shrink-0">
                        ✦
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Interactive Demo ──────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl">
            {/* Demo header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-canvas)]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  bharatcode_demo.py
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                ⚠ Sample Demonstration — Not a Live API Response
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-primary)]">
              {/* Left — code + test results */}
              <div className="p-6 flex flex-col gap-5">
                {/* Student code */}
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">
                    Student Code
                  </p>
                  <div className="rounded-xl overflow-hidden border border-[var(--border-primary)]">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400">
                        Python
                      </span>
                    </div>
                    <pre className="bg-slate-950 text-sm font-mono text-slate-100 px-5 py-4 leading-relaxed overflow-x-auto">
                      <span className="text-slate-500"># Student submission</span>
                      {"\n"}
                      <span className="text-blue-400">a</span>{" "}
                      <span className="text-slate-400">=</span>{" "}
                      <span className="text-orange-400">5</span>
                      {"\n"}
                      <span className="text-blue-400">b</span>{" "}
                      <span className="text-slate-400">=</span>{" "}
                      <span className="text-orange-400">7</span>
                      {"\n"}
                      <span className="text-yellow-400">print</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-blue-400">a</span>{" "}
                      <span className="text-red-400 font-bold">-</span>{" "}
                      <span className="text-blue-400">b</span>
                      <span className="text-slate-300">)</span>
                    </pre>
                  </div>
                </div>

                {/* Test result */}
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">
                    Test Result
                  </p>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm">✗</span>
                      <span className="text-[12px] font-semibold text-red-400">
                        FAILED: Correct sum
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-primary)] p-3">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1.5">
                          Expected
                        </p>
                        <code className="text-sm font-mono text-emerald-400">
                          12
                        </code>
                      </div>
                      <div className="rounded-lg bg-[var(--bg-canvas)] border border-red-500/20 p-3">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1.5">
                          Actual
                        </p>
                        <code className="text-sm font-mono text-red-400">
                          -2
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — AI diagnosis */}
              <div className="p-6 flex flex-col gap-5">
                {/* Hint level selector */}
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-3">
                    BharatCode AI Diagnosis
                  </p>
                  <div className="flex gap-2 mb-5">
                    {HINT_LEVELS.map((h, i) => (
                      <button
                        key={h.badge}
                        onClick={() => setActiveLevel(i)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 ${
                          activeLevel === i
                            ? "bg-[var(--accent-indigo)] text-white border-[var(--accent-indigo)]"
                            : "border-[var(--border-primary)] text-[var(--text-muted)] hover:border-[var(--accent-indigo)]/50 hover:text-[var(--accent-indigo)]"
                        }`}
                      >
                        {h.badge}
                      </button>
                    ))}
                    <span className="ml-1 self-center text-[11px] text-[var(--text-muted)]">
                      {level.label}
                    </span>
                  </div>

                  {/* Diagnosis card */}
                  <motion.div
                    key={activeLevel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border ${level.border} bg-gradient-to-br ${level.color} p-5 flex flex-col gap-3.5`}
                  >
                    {[
                      { label: "Root Cause", value: level.rootCause, icon: "🎯" },
                      { label: "Evidence", value: level.evidence, icon: "🔬" },
                      { label: "Concept Clue", value: level.conceptClue, icon: "💡" },
                      {
                        label: "Guiding Question",
                        value: level.guidingQuestion,
                        icon: "❓",
                        italic: true,
                      },
                      { label: "Next Step", value: level.nextStep, icon: "👉" },
                    ].map((row) => (
                      <div key={row.label} className="flex gap-3">
                        <span className="flex-shrink-0 text-base mt-0.5">
                          {row.icon}
                        </span>
                        <div>
                          <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-0.5">
                            {row.label}
                          </p>
                          <p
                            className={`text-[13px] text-[var(--text-primary)] leading-relaxed ${
                              row.italic ? "italic" : ""
                            }`}
                          >
                            {row.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Sample label */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <p className="text-[10px] text-[var(--text-muted)]">
                    This is a sample AI demonstration. Real diagnoses are
                    generated live by{" "}
                    <span className="font-semibold text-[var(--text-secondary)]">
                      qwen-3.8-27b
                    </span>{" "}
                    via the BharatCode API using your actual code and test
                    failures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
