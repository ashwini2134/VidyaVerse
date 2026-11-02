import LegalPageLayout from "../components/legal/LegalPageLayout";

const COOKIES: { name: string; purpose: string; type: string; lifespan: string }[] = [
  {
    name: "Refresh token",
    purpose: "Keeps you signed in between visits without re-entering your password.",
    type: "Strictly necessary — HTTP-only, not readable by JavaScript",
    lifespan: "Until you sign out or it expires",
  },
  {
    name: "OAuth state",
    purpose: "Confirms a Google/GitHub/LinkedIn sign-in request actually came from you, not a forged request.",
    type: "Strictly necessary",
    lifespan: "A few minutes, during sign-in only",
  },
];

const LOCAL_STORAGE: { name: string; purpose: string }[] = [
  { name: "Access token", purpose: "Authenticates your API requests while you're signed in." },
  { name: "Session/UI state", purpose: "Small bits of state like your last-viewed course or preferences." },
];

export default function CookiePolicy() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="July 16, 2026">
      <section>
        <h2>What we actually use</h2>
        <p>
          VIDYAVERSE uses a small, fixed set of cookies and browser-storage items to keep you signed in and
          the app working. We don't use advertising, tracking, or analytics cookies — there's currently no
          third-party tracking script on this platform to disclose.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <div className="space-y-4">
          {COOKIES.map((c) => (
            <div key={c.name} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                <h3 className="font-bold text-[var(--text-primary)]">{c.name}</h3>
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--accent-violet)]">{c.type}</span>
              </div>
              <p className="text-sm mb-2">{c.purpose}</p>
              <p className="text-xs text-[var(--text-muted)]">Lifespan: {c.lifespan}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Browser storage (not cookies, but similar in spirit)</h2>
        <p>
          We also use your browser's local storage for a couple of items. These aren't cookies — they're not sent
          to any server automatically — but we're listing them here for full transparency:
        </p>
        <ul>
          {LOCAL_STORAGE.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> — {item.purpose}
            </li>
          ))}
        </ul>
        <p>All of this is cleared automatically when you sign out.</p>
      </section>

      <section>
        <h2>Because it's all strictly necessary</h2>
        <p>
          Every item above is required for the platform to function — signing in, staying signed in, and keeping
          your session secure. There's nothing here you can selectively opt out of via a cookie banner, because
          there's nothing optional to opt out of; that's also why we haven't put a cookie-consent banner in front
          of the site.
        </p>
      </section>
    </LegalPageLayout>
  );
}
