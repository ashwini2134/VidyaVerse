import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../auth";
import { useBranding } from "../../context/BrandingContext";
import { authApi, AuthApiError, type OAuthProvider } from "../../authClient";
import "./LampLogin.css";

const isDev = import.meta.env.DEV;

function userFacingMessage(status: number, fallback: string): string {
  if (status === 401) return "Invalid email or password.";
  if (status === 429) return "Too many login attempts. Please try again later.";
  if (status >= 500) return "Something went wrong. Please try again.";
  return fallback;
}

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

// Deterministic-enough ambient dust motes — generated once per mount, not per render.
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
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], when: "beforeChildren", staggerChildren: 0.07, delayChildren: 0.12 },
  },
  exit: { opacity: 0, y: 16, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.28, ease: "easeIn" } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface LampLoginProps {
  /** Called after a successful login — e.g. to close a modal wrapping this component. */
  onSuccess?: () => void;
  /** Render sized to its container (e.g. inside a modal) instead of forcing a full 100vh scene. */
  embedded?: boolean;
}

export default function LampLogin({ onSuccess, embedded = false }: LampLoginProps) {
  const { login } = useAuth();
  const { branding } = useBranding();
  const [params] = useSearchParams();
  const oauthError = params.get("oauth_error");
  const prefersReducedMotion = useReducedMotion();
  const motes = useMotes(prefersReducedMotion ? 0 : 16);

  const [isOn, setIsOn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(oauthError);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    if (isDev) console.log("[auth] Login request started");

    try {
      await login(email, password);
      if (isDev) console.log("[auth] Login response received — 200");
      onSuccess?.();
    } catch (err) {
      let message: string;
      let status = 0;

      if (err instanceof AuthApiError) {
        status = err.status;
        message = userFacingMessage(status, err.message);
        if (isDev) console.log(`[auth] Login response received — ${status}`, err.message);
      } else if (err instanceof TypeError && err.message === "Failed to fetch") {
        message = "Unable to connect to the server.";
        if (isDev) console.log("[auth] Network error — server unreachable");
      } else {
        message = "Something went wrong. Please try again.";
        if (isDev) console.log("[auth] Unexpected error", err);
      }

      setErr(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`lamp-login${embedded ? " lamp-login--embedded" : ""}`}>
      <div className="lamp-login__motes" aria-hidden="true">
        {motes.map((m) => (
          <motion.span
            key={m.id}
            className="lamp-login__mote"
            style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
            animate={{ y: [0, -16, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="lamp-login__stage">
        <motion.div
          className="lamp-login__cone"
          animate={{ opacity: isOn ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <div className="lamp-login__fixture-col">
          <motion.div
            className="lamp-login__beam"
            animate={{ opacity: isOn ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <motion.div
            animate={{ rotate: isOn ? [0, -2.5, 1.5, -0.5, 0] : [0, 2.5, -1.5, 0.5, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ transformOrigin: "50% 96%" }}
          >
            <button
              type="button"
              className="lamp-login__lamp-btn"
              aria-pressed={isOn}
              aria-label={isOn ? "Pull the string to turn off the lamp and hide the sign-in form" : "Pull the string to turn on the lamp and reveal the sign-in form"}
              onClick={() => setIsOn((v) => !v)}
            >
              <svg viewBox="0 0 200 260" className="lamp-login__lamp-svg">
                <defs>
                  <linearGradient id="lampMetalBody" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--lamp-metal-light)" />
                    <stop offset="55%" stopColor="var(--lamp-metal)" />
                    <stop offset="100%" stopColor="var(--lamp-metal-dark)" />
                  </linearGradient>
                  <linearGradient id="lampPoleMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--lamp-metal-dark)" />
                    <stop offset="45%" stopColor="var(--lamp-metal-light)" />
                    <stop offset="100%" stopColor="var(--lamp-metal)" />
                  </linearGradient>
                  <linearGradient id="lampShadeTop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--lamp-metal-dark)" />
                    <stop offset="100%" stopColor="var(--lamp-metal)" />
                  </linearGradient>
                  <radialGradient id="lampBulbLit" cx="50%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#fffaf0" />
                    <stop offset="45%" stopColor="var(--lamp-glow-core)" />
                    <stop offset="100%" stopColor="var(--lamp-glow-mid)" />
                  </radialGradient>
                  <radialGradient id="lampSpill" cx="50%" cy="10%" r="90%">
                    <stop offset="0%" stopColor="var(--lamp-glow-core)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--lamp-glow-mid)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* cast shadow on the floor */}
                <ellipse cx="100" cy="243" rx="52" ry="7" fill="rgba(0,0,0,0.32)" />

                {/* flat foot */}
                <path d="M55,232 L145,232 L138,238 L62,238 Z" fill="url(#lampMetalBody)" />
                <ellipse cx="100" cy="238" rx="38" ry="4" fill="var(--lamp-metal-dark)" />

                {/* straight pole */}
                <rect x="97" y="46" width="6" height="188" fill="url(#lampPoleMetal)" />
                <rect x="98.5" y="46" width="1.25" height="188" fill="rgba(255,255,255,0.18)" />

                {/* wide flat pendant shade */}
                {isOn && <ellipse cx="100" cy="30" rx="86" ry="34" fill="url(#lampSpill)" />}
                <path d="M32,34 Q100,10 168,34 L160,42 Q100,24 40,42 Z" fill="url(#lampShadeTop)" stroke="rgba(0,0,0,0.25)" strokeWidth="0.75" />
                <ellipse
                  cx="100"
                  cy="42"
                  rx="60"
                  ry="9"
                  fill={isOn ? "url(#lampBulbLit)" : "#171a24"}
                  style={{ transition: "fill 0.4s ease" }}
                />
                <ellipse
                  cx="100"
                  cy="41"
                  rx="60"
                  ry="9"
                  fill="none"
                  stroke={isOn ? "rgba(255,246,224,0.6)" : "rgba(0,0,0,0.3)"}
                  strokeWidth="1"
                  style={{
                    transition: "stroke 0.4s ease, filter 0.4s ease",
                    filter: isOn ? "drop-shadow(0 0 10px rgba(255,214,140,0.85))" : "none",
                  }}
                />

                {/* pull cord + bead — the actual toggle affordance. Same tug motion
                    every time, on or off, because that's what pulling a real
                    pull-chain switch looks like regardless of direction. */}
                <motion.g
                  key={isOn ? "on" : "off"}
                  initial={{ y: 0 }}
                  animate={{ y: [0, 9, 0] }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <line x1="140" y1="40" x2="140" y2="86" stroke="var(--lamp-metal-light)" strokeWidth="1.25" />
                  <rect x="135" y="86" width="10" height="16" rx="4" fill="url(#lampBulbLit)" opacity={isOn ? 1 : 0.85} />
                  <rect x="135" y="86" width="10" height="16" rx="4" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.75" />
                </motion.g>
              </svg>
            </button>
          </motion.div>

          <motion.div
            className="lamp-login__glow"
            animate={{ opacity: isOn ? 0.85 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <div className="lamp-login__desk" />

          <AnimatePresence mode="wait">
            {!isOn && (
              <motion.p
                key="hint"
                className="lamp-login__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                Pull the string to sign in
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isOn && (
            <motion.div
              className="lamp-login__card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className="lamp-login__brand" variants={fieldVariants}>
                <img
                  src={branding?.logoUrl || `${import.meta.env.BASE_URL}logo.svg`}
                  alt={branding?.platformName || "VIDYAVERSE"}
                  className="lamp-login__logo"
                />
                <h1 className="lamp-login__title">Welcome back</h1>
                <p className="lamp-login__subtitle">Sign in to your {branding?.platformName || "VIDYAVERSE"} account</p>
              </motion.div>

              <form onSubmit={onSubmit}>
                <motion.div className="lamp-login__field" variants={fieldVariants}>
                  <label htmlFor="lamp-email" className="lamp-login__label">
                    Email Address
                  </label>
                  <div className="lamp-login__input-wrap">
                    <span className="lamp-login__input-icon">
                      <Mail size={16} />
                    </span>
                    <input
                      id="lamp-email"
                      type="email"
                      required
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="lamp-login__input"
                    />
                  </div>
                </motion.div>

                <motion.div className="lamp-login__field" variants={fieldVariants}>
                  <div className="lamp-login__label-row">
                    <label htmlFor="lamp-password" className="lamp-login__label">
                      Password
                    </label>
                    <Link to="/forgot-password" className="lamp-login__forgot">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="lamp-login__input-wrap">
                    <span className="lamp-login__input-icon">
                      <Lock size={16} />
                    </span>
                    <input
                      id="lamp-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="lamp-login__input"
                    />
                    <button
                      type="button"
                      className="lamp-login__input-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                {err && (
                  <motion.div className="lamp-login__error" variants={fieldVariants}>
                    <AlertCircle size={16} />
                    <div>{err}</div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="lamp-login__submit"
                  disabled={busy}
                  variants={fieldVariants}
                >
                  {busy ? (
                    "Signing in…"
                  ) : (
                    <>
                      <span>Sign in</span>
                      <span className="lamp-login__submit-arrow">→</span>
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div className="lamp-login__divider" variants={fieldVariants}>
                <span>Or continue with</span>
              </motion.div>

              <motion.div className="lamp-login__oauth" variants={fieldVariants}>
                {OAUTH_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="lamp-login__oauth-btn"
                    onClick={() => {
                      window.location.href = authApi.oauthUrl(p.id);
                    }}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                ))}
              </motion.div>

              <motion.div className="lamp-login__footer" variants={fieldVariants}>
                Don&apos;t have an account? <Link to="/register">Create one</Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
