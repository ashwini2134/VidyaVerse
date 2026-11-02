import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import FooterSection from "../landing/FooterSection";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

/**
 * Shared shell for the legal pages (Privacy Policy, Terms of Service, Cookie
 * Policy). Deliberately plain and static — no scroll animation, no motion —
 * because a legal document reads as more trustworthy when it behaves like
 * one, not like the rest of the marketing site.
 */
export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans">
      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="VIDYAVERSE" className="w-7 h-7 object-contain" />
            <span className="font-bold text-[var(--text-primary)] text-sm tracking-wide">VIDYAVERSE</span>
          </Link>
          <Link to="/" className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-indigo)] transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>

        <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Draft — pending legal review.</strong> This document accurately describes how the VIDYAVERSE
            platform currently works, but it has not yet been reviewed by legal counsel and is not a
            final, binding policy. Treat it as a good-faith disclosure, not a legal guarantee.
          </p>
        </div>

        <div className="mt-10 space-y-10 text-[var(--text-secondary)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_a]:text-[var(--accent-violet)] [&_a]:font-semibold [&_a:hover]:underline">
          {children}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
