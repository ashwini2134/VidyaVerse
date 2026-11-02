import { motion, useReducedMotion } from "framer-motion";

export default function HeroLogo() {
  const prefersReducedMotion = useReducedMotion();

  const breathe = prefersReducedMotion
    ? undefined
    : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.06, 1] };
  const breatheTransition = prefersReducedMotion
    ? undefined
    : { duration: 9, repeat: Infinity, ease: "easeInOut" as const };

  const drift = prefersReducedMotion
    ? undefined
    : { opacity: [0.4, 0.7, 0.4], scale: [1, 1.04, 1] };
  const driftTransition = prefersReducedMotion
    ? undefined
    : { duration: 11, repeat: Infinity, ease: "easeInOut" as const, delay: 1.5 };

  const float = prefersReducedMotion ? undefined : { y: [0, -3, 0] };
  const floatTransition = prefersReducedMotion
    ? undefined
    : { duration: 10, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Layer 1 — Background: broad, asymmetric ambient wash, part of the scene, not a spotlight */}
      <div
        className="absolute inset-[-10%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 38% 32%, rgba(0,125,175,0.10) 0%, transparent 62%)," +
            "radial-gradient(ellipse 55% 60% at 68% 70%, rgba(15,159,182,0.08) 0%, transparent 65%)," +
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(249,251,248,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Layer 2 — Ambient light: soft breathing glow the logo sits within, not on top of */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,125,175,0.16) 0%, rgba(15,159,182,0.08) 45%, transparent 75%)",
          filter: "blur(70px)",
        }}
        animate={breathe}
        transition={breatheTransition}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(121,200,194,0.14) 0%, transparent 70%)",
        }}
        animate={drift}
        transition={driftTransition}
      />

      {/* Layer 3 — The logo, softened into its light rather than pasted above it */}
      <motion.div
        className="relative z-10 w-[52%] max-w-[280px]"
        animate={float}
        transition={floatTransition}
      >
        <img
          src="/logo.svg"
          alt="VIDYAVERSE"
          className="w-full h-full object-contain"
          style={{
            opacity: 0.92,
            filter:
              "drop-shadow(0 0 18px rgba(15,159,182,0.14)) drop-shadow(0 0 4px rgba(0,125,175,0.1))",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 78% at 50% 48%, black 62%, transparent 96%)",
            maskImage:
              "radial-gradient(ellipse 78% 78% at 50% 48%, black 62%, transparent 96%)",
          }}
        />
      </motion.div>

      {/* Layer 4 — Very subtle foreground highlight, as if light spills just in front of the mark */}
      <motion.div
        className="absolute top-[46%] left-[54%] -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full pointer-events-none z-20"
        style={{
          background: "radial-gradient(circle, rgba(249,251,248,0.05) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
        animate={breathe}
        transition={breatheTransition}
      />

      {/* Faint atmospheric particles */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-[30%] left-[62%] w-[3px] h-[3px] rounded-full bg-[#79C8C2] pointer-events-none"
            style={{ filter: "blur(1px)" }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -14, -24] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-[62%] left-[38%] w-[2px] h-[2px] rounded-full bg-[#0F9FB6] pointer-events-none"
            style={{ filter: "blur(1px)" }}
            animate={{ opacity: [0, 0.4, 0], y: [0, -10, -18] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </>
      )}
    </div>
  );
}
