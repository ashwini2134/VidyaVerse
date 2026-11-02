import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useBranding } from "../context/BrandingContext";
import "./NotFoundPage.css";

function useMotes(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 10 + Math.random() * 70,
        size: 1.5 + Math.random() * 2.5,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 4,
      })),
    [count]
  );
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], when: "beforeChildren", staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function NotFoundPage() {
  const { branding } = useBranding();
  const prefersReducedMotion = useReducedMotion();
  const motes = useMotes(prefersReducedMotion ? 0 : 14);
  const [found, setFound] = useState(false);

  return (
    <div className="not-found">
      <div className="not-found__motes" aria-hidden="true">
        {motes.map((m) => (
          <motion.span
            key={m.id}
            className="not-found__mote"
            style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
            animate={{ y: [0, -16, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="not-found__stage">
        <motion.div
          className="not-found__wash"
          animate={{ opacity: found ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <div className="not-found__fixture-col">
          <button
            type="button"
            className="not-found__compass-btn"
            aria-pressed={found}
            aria-label={found ? "You found your way home" : "Tap the compass to find your way home"}
            onClick={() => setFound(true)}
            disabled={found}
          >
            <div className="not-found__compass">
              <svg viewBox="0 0 100 100" className="not-found__compass-face">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#8890a6" strokeWidth="1" opacity="0.4" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2={deg % 90 === 0 ? "16" : "13"}
                    stroke="#8890a6"
                    strokeWidth="1.5"
                    opacity="0.5"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
                <text x="50" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#edeff5">N</text>

                <motion.g
                  animate={
                    found
                      ? { rotate: 0 }
                      : prefersReducedMotion
                      ? { rotate: 25 }
                      : { rotate: [10, -35, 50, -18, 30, 10] }
                  }
                  transition={
                    found
                      ? { type: "spring", stiffness: 60, damping: 10 }
                      : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }
                  style={{ originX: "50px", originY: "50px" }}
                >
                  <polygon points="50,14 44,50 50,58 56,50" fill="#e2564f" />
                  <polygon points="50,86 44,50 50,42 56,50" fill="#e8e6df" />
                </motion.g>
                <circle cx="50" cy="50" r="4" fill="#c9a15a" />
              </svg>
            </div>
          </button>

          <div className="not-found__404">404</div>

          <AnimatePresence mode="wait">
            {!found && (
              <motion.p
                key="hint"
                className="not-found__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                Tap the compass to find your way home
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {found && (
            <motion.div className="not-found__card" variants={cardVariants} initial="hidden" animate="visible">
              <motion.p className="not-found__eyebrow" variants={fieldVariants}>
                Off the map
              </motion.p>
              <motion.h1 className="not-found__title" variants={fieldVariants}>
                This page doesn&apos;t exist
              </motion.h1>
              <motion.p className="not-found__subtitle" variants={fieldVariants}>
                The link might be broken, or the page may have moved. Let&apos;s get you back to{" "}
                {branding?.platformName || "VIDYAVERSE"}.
              </motion.p>
              <motion.div className="not-found__actions" variants={fieldVariants}>
                <Link to="/" className="not-found__primary">
                  Take me home
                </Link>
                <div className="not-found__secondary-row">
                  <Link to="/about" className="not-found__secondary">
                    About Us
                  </Link>
                  <Link to="/login" className="not-found__secondary">
                    Log In
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
