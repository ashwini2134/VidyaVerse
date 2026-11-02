import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldAlert, Award, Calendar, Loader2, Sparkles } from "lucide-react";
import { authFetch } from "../authClient";
import { COURSE_FULL_NAMES as COURSE_NAMES } from "../data/courseNames";

interface VerifyResult {
  valid: boolean;
  certNumber?: string;
  recipientName?: string;
  courseSlug?: string;
  issuedAt?: string;
  avgScore?: number | null;
  capstoneTitle?: string | null;
  error?: string;
}

export default function VerifyCertificatePage() {
  const { certNumber } = useParams<{ certNumber: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    if (!certNumber) return;
    setLoading(true);
    authFetch<VerifyResult>(`/certifications/verify/${certNumber}`)
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        setResult({ valid: false, error: err.message || "Failed to verify certificate" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [certNumber]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between selection:bg-blue-500/25 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-[130px] pointer-events-none z-0" />

      {/* Header */}
      <header className="w-full border-b border-slate-900 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="VIDYAVERSE" className="w-8 h-8 object-contain" />
            <span className="font-bold text-white text-sm tracking-wide">VIDYAVERSE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 size={36} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 text-sm">Verifying credential authenticity...</p>
          </div>
        ) : result && result.valid ? (
          /* ── Valid Certificate View ── */
          <div className="w-full max-w-lg bg-slate-950/40 border border-emerald-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-emerald-500/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Top Badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 relative">
                <ShieldCheck size={32} />
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles size={11} /> Verified Authentic Credential
              </span>
            </div>

            {/* Info Fields */}
            <div className="space-y-5 border-t border-slate-900 pt-6">
              <div>
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Recipient</span>
                <span className="text-lg font-bold text-white mt-1 block">{result.recipientName}</span>
              </div>

              <div>
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Program / Course</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-2">
                  <Award size={16} className="text-blue-400 shrink-0" />
                  {(COURSE_NAMES[result.courseSlug || ""] || result.courseSlug) + (result.capstoneTitle ? ` (Capstone: ${result.capstoneTitle})` : '')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Issued Date</span>
                  <span className="text-sm text-slate-350 mt-1 flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-500" />
                    {result.issuedAt ? new Date(result.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Credential ID</span>
                  <span className="text-sm font-mono text-slate-350 mt-1 block truncate" title={result.certNumber}>
                    {result.certNumber}
                  </span>
                </div>
              </div>

              {result.avgScore !== null && result.avgScore !== undefined && (
                <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Average Quiz Score</span>
                  <span className="text-white font-bold">{result.avgScore}%</span>
                </div>
              )}
            </div>

            {/* Verification Footer Text */}
            <div className="mt-8 border-t border-slate-900 pt-6 text-center text-xs text-slate-500 leading-relaxed">
              This credential was issued electronically by VIDYAVERSE after the student completed all required lectures, coding assignments, quiz assessments, and capstone projects.
            </div>
          </div>
        ) : (
          /* ── Invalid/Not Found View ── */
          <div className="w-full max-w-md bg-slate-950/40 border border-red-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <ShieldAlert size={32} />
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-sm text-slate-400 mb-6">
              {result?.error || "We could not locate a credential matching the provided certificate identifier."}
            </p>
            
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/40 py-6 text-center text-xs text-slate-650">
        &copy; {new Date().getFullYear()} VIDYAVERSE. All rights reserved.
      </footer>
    </div>
  );
}
