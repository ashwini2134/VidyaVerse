import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import Reveal from "./Reveal";
import { useParallax } from "./hooks/useParallax";
import FraylonHeroLogo from "./FraylonHeroLogo";
import MagneticButton from "./MagneticButton";

const HEADLINE_LINE_1 = ["Don't", "Just", "Watch."];
const HEADLINE_LINE_2 = [
  { text: "Build.", accent: true },
  { text: "Ship.", accent: false },
  { text: "Get", accent: false },
  { text: "Hired.", accent: false },
];

const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const headlineWord: Variants = {
  hidden: { opacity: 0, y: 46, rotateX: -50, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useParallax(containerRef, 100, ["start start", "end start"]);

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );

  // Cursor-follow spotlight, spring-smoothed so it drifts rather than snaps.
  const spotlightX = useMotionValue(400);
  const spotlightY = useMotionValue(300);
  const spotlightXSpring = useSpring(spotlightX, { stiffness: 60, damping: 22 });
  const spotlightYSpring = useSpring(spotlightY, { stiffness: 60, damping: 22 });
  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${spotlightXSpring}px ${spotlightYSpring}px, rgba(0,191,179,0.12), transparent 70%)`;

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  return (
    <motion.section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ opacity: contentOpacity }}
      className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto overflow-hidden bg-[var(--bg-main)]"
    >
      {/* Cursor-follow spotlight — dormant until the pointer moves, purely additive light */}
      {!prefersReducedMotion && (
        <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ background: spotlightBg }} />
      )}

      {/* Fraylon Scene — contained to a panel on the right, like fraylontech.com's
          split layout, instead of a full-bleed dark background. Logo/animation itself untouched. */}
      <div
        className="hidden lg:block absolute top-6 bottom-6 right-0 w-[58%] rounded-3xl overflow-hidden z-0"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%)",
          maskImage: "linear-gradient(to right, transparent, black 8%)",
        }}
      >
        <FraylonHeroLogo />
      </div>

      {/* Left Content — sits on the white page background */}
      <div className="w-full lg:w-5/12 flex flex-col items-start text-left z-10 pt-10 lg:pt-0 pr-0 lg:pr-12">
        <Reveal delay={0.05}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BFB3]" />
            Project-Based Curriculum &bull; AI Code Review
          </div>
        </Reveal>

        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="visible"
          style={{ perspective: 800 }}
          className="mt-5 text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1]"
        >
          <span className="block">
            {HEADLINE_LINE_1.map((word) => (
              <motion.span key={word} variants={headlineWord} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {HEADLINE_LINE_2.map(({ text, accent }) => (
              <motion.span
                key={text}
                variants={headlineWord}
                className={`inline-block mr-[0.22em] ${accent ? "text-[#00BFB3]" : ""}`}
              >
                {text}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <Reveal delay={0.2}>
          <p className="mt-6 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg">
            VIDYAVERSE replaces passive video lectures with real projects, line-by-line AI code review, and a portfolio employers actually trust.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
            <MagneticButton className="w-full sm:w-auto">
              <Link to="/register" className="block w-full sm:w-auto px-8 py-3.5 bg-[var(--text-primary)] hover:bg-[#00BFB3] text-[var(--bg-main)] hover:text-white rounded-lg font-bold text-sm transition-colors duration-300 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-[#00BFB3] focus:ring-offset-2 focus:ring-offset-[var(--bg-main)]">
                Start Learning
              </Link>
            </MagneticButton>
            <a href="/#courses" className="w-full sm:w-auto px-8 py-3.5 border border-[var(--border-primary)] hover:border-[#00BFB3] bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-lg font-bold text-sm transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-[#00BFB3] focus:ring-offset-2 focus:ring-offset-[var(--bg-main)]">
              Explore Courses
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-xs text-[var(--text-muted)]">
            <Link to="/about" className="font-semibold text-[var(--text-secondary)] hover:text-[#3B82F6] transition-colors">
              Learn About VIDYAVERSE &rarr;
            </Link>
          </div>
        </Reveal>
      </div>
    </motion.section>
  );
}
