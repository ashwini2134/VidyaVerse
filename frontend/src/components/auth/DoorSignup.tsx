import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { AlertCircle, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../auth";
import { useBranding } from "../../context/BrandingContext";
import { authApi, type OAuthProvider } from "../../authClient";
import "./DoorSignup.css";

const OAUTH_PROVIDERS: { id: OAuthProvider; label: string; icon: ReactNode }[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "Continue with GitHub",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "Continue with LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

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
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], when: "beforeChildren", staggerChildren: 0.06, delayChildren: 0.25 },
  },
  exit: { opacity: 0, y: 16, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.25, ease: "easeIn" } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface DoorSignupProps {
  /** Called after successful account creation — e.g. to close a modal wrapping this component. */
  onSuccess?: () => void;
  /** Render sized to its container (e.g. inside a modal) instead of forcing a full 100vh scene. */
  embedded?: boolean;
}

export default function DoorSignup({ onSuccess, embedded = false }: DoorSignupProps) {
  const { register } = useAuth();
  const { branding } = useBranding();
  const prefersReducedMotion = useReducedMotion();
  const motes = useMotes(prefersReducedMotion ? 0 : 16);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await register(email, password, name, githubUrl);
      onSuccess?.();
    } catch {
      setErr("Could not register. Email may already be in use.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`door-signup${embedded ? " door-signup--embedded" : ""}`}>
      <div className="door-signup__motes" aria-hidden="true">
        {motes.map((m) => (
          <motion.span
            key={m.id}
            className="door-signup__mote"
            style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
            animate={{ y: [0, -16, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="door-signup__stage">
        <motion.div
          className="door-signup__wash"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        <div className="door-signup__fixture-col">
          <motion.div
            className="door-signup__beam"
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <div className="door-signup__frame">
            <div className="door-signup__jamb" />
            <div className="door-signup__doorway" />

            <button
              type="button"
              className="door-signup__door-btn"
              aria-pressed={isOpen}
              aria-label={isOpen ? "Close the door and hide the sign-up form" : "Open the door to create an account"}
              onClick={() => setIsOpen((v) => !v)}
            >
              <motion.div
                className="door-signup__door"
                animate={{ rotateY: isOpen ? -115 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              >
                <div className="door-signup__hinge door-signup__hinge--top" />
                <div className="door-signup__hinge door-signup__hinge--mid" />
                <div className="door-signup__hinge door-signup__hinge--bottom" />
                <div className="door-signup__door-panel door-signup__door-panel--top" />
                <div className="door-signup__door-panel door-signup__door-panel--bottom" />
                <div className="door-signup__knob-plate">
                  <div className="door-signup__knob" />
                </div>
              </motion.div>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.p
                key="hint"
                className="door-signup__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                Open the door to sign up
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="door-signup__card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className="door-signup__brand" variants={fieldVariants}>
                <img
                  src={branding?.logoUrl || `${import.meta.env.BASE_URL}logo.svg`}
                  alt={branding?.platformName || "VIDYAVERSE"}
                  className="door-signup__logo"
                />
                <h1 className="door-signup__title">Get started</h1>
                <p className="door-signup__subtitle">Create your {branding?.platformName || "VIDYAVERSE"} account</p>
              </motion.div>

              <form onSubmit={onSubmit}>
                <motion.div className="door-signup__field" variants={fieldVariants}>
                  <label htmlFor="door-name" className="door-signup__label">
                    Full Name
                  </label>
                  <div className="door-signup__input-wrap">
                    <span className="door-signup__input-icon">
                      <User size={16} />
                    </span>
                    <input
                      id="door-name"
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="door-signup__input"
                    />
                  </div>
                </motion.div>

                <motion.div className="door-signup__field" variants={fieldVariants}>
                  <label htmlFor="door-email" className="door-signup__label">
                    Email Address
                  </label>
                  <div className="door-signup__input-wrap">
                    <span className="door-signup__input-icon">
                      <Mail size={16} />
                    </span>
                    <input
                      id="door-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="door-signup__input"
                    />
                  </div>
                </motion.div>

                <motion.div className="door-signup__field" variants={fieldVariants}>
                  <label htmlFor="door-password" className="door-signup__label">
                    Password <span className="door-signup__label-optional">(min 8 characters)</span>
                  </label>
                  <div className="door-signup__input-wrap">
                    <span className="door-signup__input-icon">
                      <Lock size={16} />
                    </span>
                    <input
                      id="door-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="door-signup__input"
                    />
                    <button
                      type="button"
                      className="door-signup__input-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div className="door-signup__field" variants={fieldVariants}>
                  <label htmlFor="door-github" className="door-signup__label">
                    GitHub Profile <span className="door-signup__label-optional">(optional)</span>
                  </label>
                  <div className="door-signup__input-wrap">
                    <span className="door-signup__input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </span>
                    <input
                      id="door-github"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="door-signup__input"
                    />
                  </div>
                  <p className="door-signup__hint-text">
                    We&apos;ll use this to confirm project submissions are genuinely yours during AI review.
                  </p>
                </motion.div>

                {err && (
                  <motion.div className="door-signup__error" variants={fieldVariants}>
                    <AlertCircle size={16} />
                    <div>{err}</div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="door-signup__submit"
                  disabled={busy}
                  variants={fieldVariants}
                >
                  {busy ? (
                    "Creating account…"
                  ) : (
                    <>
                      <span>Create account</span>
                      <span className="door-signup__submit-arrow">→</span>
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div className="door-signup__divider" variants={fieldVariants}>
                <span>Or continue with</span>
              </motion.div>

              <motion.div className="door-signup__oauth" variants={fieldVariants}>
                {OAUTH_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="door-signup__oauth-btn"
                    onClick={() => {
                      window.location.href = authApi.oauthUrl(p.id);
                    }}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                ))}
              </motion.div>

              <motion.div className="door-signup__footer" variants={fieldVariants}>
                Already have an account? <Link to="/login">Sign in</Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
