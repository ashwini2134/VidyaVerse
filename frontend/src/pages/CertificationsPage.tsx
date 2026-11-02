import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award, ChevronRight, Lock, Download, ShieldCheck,
  Sparkles, BookOpen, Brain, ExternalLink,
} from 'lucide-react';
import { authFetch, authFetchBlob } from '../authClient';
import { useAuth } from '../auth';
import { COURSE_FULL_NAMES, COURSE_SHORT_LABELS } from '../data/courseNames';

/* ─── config ─── */

interface CourseConfig {
  label:      string;
  fullName:   string;
  accent:     string;
  glow:       string;
  icon:       React.ReactNode;
}

const COURSES: Record<string, CourseConfig> = {
  python20: {
    label:    COURSE_SHORT_LABELS.python20,
    fullName: COURSE_FULL_NAMES.python20,
    accent:   '#00BFB3',
    glow:     'rgba(0,191,179,0.35)',
    icon:     <BookOpen size={18} strokeWidth={1.5} />,
  },
  'fundamentals-of-ai': {
    label:    COURSE_SHORT_LABELS['fundamentals-of-ai'],
    fullName: COURSE_FULL_NAMES['fundamentals-of-ai'],
    accent:   '#009E95',
    glow:     'rgba(0,158,149,0.35)',
    icon:     <Brain size={18} strokeWidth={1.5} />,
  },
};

/* ─── types ─── */

interface IssuedCert {
  id: string;
  courseSlug: string;
  certNumber: string;
  issuedAt: string;
  avgScore: number | null;
  capstoneTitle?: string | null;
}

interface ConditionRow {
  done: number;
  required?: number;
  passed: boolean;
}

interface EligibilityResult {
  eligible: boolean;
  alreadyIssued: boolean;
  conditions: {
    lecturesCompleted:    ConditionRow;
    practiceCompleted:    ConditionRow;
    tryItEngaged:         ConditionRow;
    quizzesPassed:        ConditionRow;
    problemsSubmitted:    ConditionRow;
    finalProjectApproved: ConditionRow;
    milestonesCompleted?: ConditionRow;
  };
  avgQuizScore: number | null;
}

interface EligibleStudent {
  userId: string;
  name: string;
  email: string;
  courseSlug: string;
  avgQuizScore: number | null;
}

/* ─── helpers ─── */

function remainingItems(conditions: EligibilityResult['conditions']): string[] {
  const items: string[] = [];
  if (!conditions.lecturesCompleted.passed) {
    const { done, required } = conditions.lecturesCompleted;
    items.push(`${(required ?? 0) - done} lecture${(required ?? 0) - done !== 1 ? 's' : ''} left to watch`);
  }
  if (!conditions.practiceCompleted.passed) {
    const { done, required } = conditions.practiceCompleted;
    items.push(`${(required ?? 0) - done} practice exercise${(required ?? 0) - done !== 1 ? 's' : ''} remaining`);
  }
  if (!conditions.tryItEngaged.passed) {
    const { done, required } = conditions.tryItEngaged;
    items.push(`${(required ?? 0) - done} "Try It Yourself" block${(required ?? 0) - done !== 1 ? 's' : ''} not yet engaged with`);
  }
  if (!conditions.quizzesPassed.passed) {
    const { done, required } = conditions.quizzesPassed;
    items.push(`${(required ?? 0) - done} quiz${(required ?? 0) - done !== 1 ? 'zes' : ''} not yet passed`);
  }
  if (!conditions.problemsSubmitted.passed) {
    const { done, required } = conditions.problemsSubmitted;
    items.push(`${(required ?? 0) - done} problem${(required ?? 0) - done !== 1 ? 's' : ''} still to submit`);
  }
  if (conditions.milestonesCompleted && !conditions.milestonesCompleted.passed) {
    const { done, required } = conditions.milestonesCompleted;
    items.push(`${(required ?? 0) - done} milestone project${(required ?? 0) - done !== 1 ? 's' : ''} remaining`);
  }
  if (!conditions.finalProjectApproved.passed) {
    items.push('Final project not yet approved');
  }
  return items;
}

function overallPct(conditions: EligibilityResult['conditions']): number {
  // weighted by total items where applicable
  const rows = Object.values(conditions);
  let total = 0, done = 0;
  rows.forEach(r => {
    const max = r.required ?? 1;
    total += max;
    done  += Math.min(r.done, max);
  });
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

/* ─── page ─── */

export default function CertificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin  = user?.role === 'admin';

  const [certs,       setCerts]       = useState<IssuedCert[]>([]);
  const [eligibility, setEligibility] = useState<Record<string, EligibilityResult>>({});
  const [eligible,    setEligible]    = useState<EligibleStudent[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [issuing,     setIssuing]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const [certsRes, eligRes] = await Promise.all([
          authFetch<{ certificates: IssuedCert[] }>('/certifications'),
          authFetch<{ eligibility: Record<string, EligibilityResult> }>('/certifications/eligibility'),
        ]);
        setCerts(certsRes.certificates ?? []);
        setEligibility(eligRes.eligibility ?? {});
        if (isAdmin) {
          try {
            const r = await authFetch<{ eligible: EligibleStudent[] }>('/certifications/admin/eligible');
            setEligible(r.eligible ?? []);
          } catch { /* hidden */ }
        }
      } catch (err: any) {
        setError(err?.message ?? 'Could not load certification data.');
      }
      setLoading(false);
    }
    load();
  }, [isAdmin]);

  async function handleIssue(userId: string, courseSlug: string) {
    const key = `${userId}:${courseSlug}`;
    setIssuing(key);
    try {
      await authFetch('/certifications/admin/issue', {
        method: 'POST',
        body: JSON.stringify({ userId, courseSlug }),
      });
      setEligible(prev => prev.filter(e => !(e.userId === userId && e.courseSlug === courseSlug)));
    } catch (err: any) {
      alert(err?.message ?? 'Failed to issue certificate');
    }
    setIssuing(null);
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">

      {/* ── header ── */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-8 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-slate-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-slate-400 transition-colors">Dashboard</button>
          <ChevronRight size={11} className="text-slate-700" />
          <span className="text-slate-400">Certifications</span>
        </nav>
        <h1 className="text-2xl font-black text-white tracking-tight">Your Certificates</h1>
        <p className="text-slate-500 text-sm mt-1">Finish a course to earn a verified certificate you can share anywhere.</p>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 space-y-8">

        {/* loading */}
        {loading && (
          <>{[0,1].map(i => <div key={i} className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />)}</>
        )}

        {/* error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-900/30 bg-red-950/15 p-8 text-center">
            <p className="text-sm font-semibold text-red-300 mb-1">Couldn't load your data</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {Object.keys(COURSES).map(slug => (
              <CertBlock
                key={slug}
                slug={slug}
                studentName={user?.name ?? 'Student'}
                result={eligibility[slug] ?? null}
                cert={certs.find(c => c.courseSlug === slug) ?? null}
              />
            ))}

            {/* admin panel */}
            {isAdmin && eligible.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                  <ShieldCheck size={13} /> Pending issuance
                </p>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden divide-y divide-slate-800/60">
                  {eligible.map(e => {
                    const key    = `${e.userId}:${e.courseSlug}`;
                    const course = COURSES[e.courseSlug];
                    return (
                      <div key={key} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `${course?.accent}15`, border: `1px solid ${course?.accent}35`, color: course?.accent }}
                        >
                          {e.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{e.name}</p>
                          <p className="text-xs text-slate-500 truncate">{e.email} · {course?.label}</p>
                        </div>
                        {e.avgQuizScore !== null && (
                          <span className="text-xs text-slate-400 hidden sm:block">avg <span className="text-white font-bold">{e.avgQuizScore}%</span></span>
                        )}
                        <button
                          onClick={() => handleIssue(e.userId, e.courseSlug)}
                          disabled={issuing === key}
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
                        >
                          {issuing === key ? 'Issuing…' : 'Issue'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Fetches the server-rendered VIDYAVERSE certificate PDF and saves it. */
async function downloadCertificate(certNumber: string) {
  const blob = await authFetchBlob(`/certifications/${certNumber}/download`);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vidyaverse-certificate-${certNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ─── CertBlock — one per course ─── */

function CertBlock({
  slug, studentName, result, cert,
}: {
  slug:        string;
  studentName: string;
  result:      EligibilityResult | null;
  cert:        IssuedCert | null;
}) {
  const course  = COURSES[slug];
  const accent  = course.accent;
  const issued  = !!cert;
  const allMet  = result?.eligible ?? false;
  const pct     = result ? overallPct(result.conditions) : 0;
  const left    = result ? remainingItems(result.conditions) : [];
  const [downloading, setDownloading] = useState(false);
  const [sealBroken, setSealBroken] = useState(() => {
    if (!cert) return false;
    try {
      return localStorage.getItem(`fa_cert_seal_${cert.certNumber}`) === '1';
    } catch {
      return false;
    }
  });
  const breakSeal = () => {
    setSealBroken(true);
    if (cert) {
      try {
        localStorage.setItem(`fa_cert_seal_${cert.certNumber}`, '1');
      } catch {
        // ignore — worst case the reveal just replays next visit
      }
    }
  };
  const issueDate = cert
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const courseTitleWithCapstone = cert?.capstoneTitle
    ? `${course.fullName} (Capstone: ${cert.capstoneTitle})`
    : course.fullName;

  return (
    <div className="rounded-3xl overflow-hidden border border-[var(--border-medium)]" style={{ background: 'var(--surface-card)' }}>

      {/* ── Certificate mockup ── */}
      <div className="relative" style={{ height: 340 }}>

        {/* certificate paper */}
        <div
          className="absolute inset-4 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: issued
              ? '#fdfbf6'
              : 'linear-gradient(135deg, rgba(0,65,105,0.06) 0%, rgba(0,100,145,0.1) 50%, rgba(0,65,105,0.06) 100%)',
            border: issued ? `2px solid ${accent}60` : '2px solid var(--border-medium)',
            filter: issued ? 'none' : 'none',
          }}
        >
          {/* decorative corner marks */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map(pos => (
            <div
              key={pos}
              className={`absolute ${pos} w-5 h-5`}
              style={{
                borderColor: issued ? `${accent}80` : 'var(--border-medium)',
                borderTopWidth:    pos.includes('top')    ? 2 : 0,
                borderLeftWidth:   pos.includes('left')   ? 2 : 0,
                borderBottomWidth: pos.includes('bottom') ? 2 : 0,
                borderRightWidth:  pos.includes('right')  ? 2 : 0,
                borderStyle: 'solid',
              }}
            />
          ))}

          {/* outer decorative ring */}
          <div
            className="absolute inset-6 rounded-xl pointer-events-none"
            style={{ border: issued ? '1px solid #d8d2c4' : '1px solid #1e2a3a60' }}
          />

          {/* certificate content — two completely separate states */}
          {issued ? (
            /* ── UNLOCKED: light certificate paper, matches the downloaded design ── */
            <div className="relative z-10 flex flex-col items-center px-10 text-center w-full">
              {/* logo mark */}
              <div className="absolute top-0 left-0 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, #60a5fa, ${accent})` }}
                >
                  GS
                </div>
                <div className="text-left leading-none">
                  <p className="text-[12px] font-bold" style={{ color: '#161b22' }}>VIDYAVERSE</p>
                  <p className="text-[7px] font-semibold tracking-[0.2em]" style={{ color: '#6b7280' }}>ACADEMY</p>
                </div>
              </div>

              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: `${accent}15`, border: `2px solid ${accent}50` }}
              >
                <Award size={20} style={{ color: accent }} />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#6b7280' }}>
                Certificate of Completion
              </p>

              <div className="w-24 h-px mb-4" style={{ background: `${accent}60` }} />

              <p className="text-[22px] font-black leading-tight mb-2"
                style={{ color: '#161b22', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>
                {studentName}
              </p>

              <p className="text-sm font-semibold leading-snug mb-4" style={{ color: accent }}>
                {courseTitleWithCapstone}
              </p>

              <div className="w-24 h-px mb-3" style={{ background: `${accent}60` }} />

              {issueDate && (
                <p className="text-[10px]" style={{ color: '#6b7280' }}>
                  {issueDate}{cert?.avgScore !== null && <> · Quiz avg {cert?.avgScore}%</>}
                </p>
              )}

              <p className="text-[9px] uppercase tracking-widest font-semibold mt-2" style={{ color: '#9ca3af' }}>
                VIDYAVERSE
              </p>
            </div>
          ) : (
            /* ── LOCKED: just the progress, no certificate text ── */
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface-card)', border: '2px solid var(--border-medium)' }}>
                <Lock size={20} className="text-slate-600" />
              </div>

              {result ? (
                <>
                  <div>
                    <span className="text-5xl font-black text-white">{pct}</span>
                    <span className="text-2xl font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-xs text-slate-500 -mt-1">toward your certificate</p>
                  <div className="w-44 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-600">Start the course to track progress</p>
              )}
            </div>
          )}
        </div>

        {/* wax seal — issued certs stay sealed until the learner breaks it once; stays broken after (per-cert, localStorage) */}
        <AnimatePresence>
          {issued && !sealBroken && (
            <motion.button
              type="button"
              onClick={breakSeal}
              aria-label="Break the seal to reveal your certificate"
              className="absolute inset-4 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer"
              style={{ background: 'rgba(10,14,26,0.88)', backdropFilter: 'blur(6px)' }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.45, ease: 'easeIn' }}
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94, rotate: -8 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${accent}, ${accent}88 70%)`,
                  boxShadow: `0 0 0 3px ${accent}30, 0 8px 20px -6px ${accent}80`,
                }}
              >
                <Award size={26} className="text-white" />
              </motion.div>
              <p className="text-white text-sm font-bold">Your certificate is sealed</p>
              <p className="text-slate-400 text-xs">Click the seal to break it open</p>
            </motion.button>
          )}
        </AnimatePresence>

        {/* course label pill — top left */}
        <div
          className="absolute top-7 left-7 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ background: `${accent}18`, border: `1px solid ${accent}35`, color: accent }}
        >
          {course.icon} {course.label}
        </div>

        {/* verified badge — top right */}
        {issued && (
          <div className="absolute top-7 right-7 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Sparkles size={10} /> Verified
          </div>
        )}
      </div>

      {/* ── bottom info strip ── */}
      <div className="px-6 py-5 border-t border-slate-800/60">
        {issued ? (
          /* earned: cert number + download */
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Certificate ID</p>
              <p className="text-xs font-mono text-slate-400">{cert!.certNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  setDownloading(true);
                  try {
                    await downloadCertificate(cert!.certNumber);
                  } catch {
                    alert('Could not generate the certificate PDF. Please try again.');
                  }
                  setDownloading(false);
                }}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}
              >
                <Download size={13} /> {downloading ? 'Generating…' : 'Download'}
              </button>
              <a
                href={`${window.location.origin}/#/verify/${cert!.certNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: accent }}
              >
                <ExternalLink size={13} /> Share
              </a>
            </div>
          </div>
        ) : allMet ? (
          /* all requirements met, waiting */
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#34d39920', border: '1px solid #34d39940' }}>
              <Sparkles size={15} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">You're done — certificate coming soon</p>
              <p className="text-xs text-slate-500 mt-0.5">All requirements are complete. An admin will review and issue your certificate shortly.</p>
            </div>
          </div>
        ) : result ? (
          /* in progress: what's left in plain English */
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2.5">What's left to unlock this certificate:</p>
            <ul className="space-y-1.5">
              {left.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
                    style={{ background: `${accent}20`, color: accent }}>
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
              {left.length > 3 && (
                <li className="text-xs text-slate-600 pl-6">+{left.length - 3} more</li>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-600">Progress data unavailable — make sure the backend is running.</p>
        )}
      </div>
    </div>
  );
}
