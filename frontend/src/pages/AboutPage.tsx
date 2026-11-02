import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowRight, Code2, BrainCircuit, Users, GraduationCap, ClipboardCheck, TrendingUp } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Reveal from "../components/landing/Reveal";
import FooterSection from "../components/landing/FooterSection";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const headerBgOpacity = useTransform(scrollY, [0, 50], [0, 0.9]);
  const headerBackdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `transition-colors relative py-2 ${isActive ? "text-[var(--text-primary)]" : "hover:text-[var(--accent-indigo)]"}`;
    
  const activeUnderline = (
    <motion.div layoutId="nav-underline-about" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-indigo)] rounded-full" />
  );

  return (
    <div className="w-full min-h-screen bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans selection:bg-[var(--accent-indigo)]/25 overflow-x-hidden relative">
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00BFB3] z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation Header */}
      <motion.header
        className="fixed top-0 z-50 w-full border-b border-[var(--border-primary)]"
        style={{
          backgroundColor: useTransform(headerBgOpacity, o => `rgba(255, 255, 255, ${o})`),
          backdropFilter: headerBackdropBlur
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer select-none">
            <img src="/logo.svg" alt="VIDYAVERSE" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[var(--text-primary)] text-sm tracking-wide">VIDYAVERSE</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[var(--text-secondary)]">
            <NavLink to="/" end className={navLinkClass}>
              {({ isActive }) => (
                <>HOME{isActive && activeUnderline}</>
              )}
            </NavLink>
            <Link to="/#courses" className="transition-colors relative py-2 hover:text-[var(--accent-indigo)] cursor-pointer">
              COURSES
            </Link>
            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <>ABOUT US{isActive && activeUnderline}</>
              )}
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-indigo)] transition-colors">
              LOG IN
            </Link>
            <Link to="/register" className="px-5 py-2 rounded-lg bg-[var(--text-primary)] hover:bg-[#00BFB3] text-[#fff] text-xs font-bold transition-all shadow-sm">
              START LEARNING
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-indigo)] transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--border-primary)] p-6 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="VIDYAVERSE" className="w-7 h-7 object-contain" />
                <span className="font-bold text-[var(--text-primary)] text-xs">VIDYAVERSE</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-indigo)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-xs font-bold text-[var(--text-secondary)]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--accent-indigo)]">HOME</Link>
              <Link to="/#courses" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--accent-indigo)]">COURSES</Link>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-[var(--text-primary)]" : ""}>ABOUT US</NavLink>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-primary)]">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 border border-[var(--border-primary)] rounded-lg text-xs font-bold text-[var(--text-secondary)]">LOG IN</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 bg-[var(--accent-indigo)] rounded-lg text-xs font-bold text-[#fff]">START LEARNING</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-24 relative z-10">
        
        {/* Hero Section */}
        <section className="px-6 mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--accent-glow)] blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight mb-8 leading-tight">
                We believe learning <br className="hidden md:block" />
                should be <span className="text-[var(--accent-violet)]">active</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
                VIDYAVERSE was born out of frustration with the modern edtech landscape. Passive video consumption doesn't create engineers. Doing the work does.
              </p>
            </Reveal>
          </div>
        </section>

        {/* For Colleges & Institutions — the actual answer to "bring VIDYAVERSE to your college" */}
        <section className="px-6 mb-32">
          <div className="max-w-6xl mx-auto">
            <Reveal delay={0.1}>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-xs uppercase tracking-widest text-[var(--accent-indigo)] font-bold font-mono">
                  For Colleges &amp; Institutions
                </h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-3">
                  Bring VIDYAVERSE to your college.
                </h3>
                <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                  VIDYAVERSE is deployed through partner institutions, not sold seat-by-seat to individual students. Your students learn by building; you get outcomes you can actually report.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Reveal delay={0.2}>
                <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full">
                  <ClipboardCheck className="w-8 h-8 text-[var(--accent-indigo)] mb-6" />
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-3">Grading, off your faculty's plate</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Every submission is reviewed automatically, line-by-line, in seconds. Your instructors teach — they don't grade at 1am.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full">
                  <TrendingUp className="w-8 h-8 text-[var(--accent-violet)] mb-6" />
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-3">Outcomes you can report</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Every student graduates with a verifiable portfolio of real projects — evidence for placement stats and accreditation, not just a completion count.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full">
                  <GraduationCap className="w-8 h-8 text-[var(--accent-mint)] mb-6" />
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-3">A curriculum that stays current</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    No re-writing lecture slides every semester. The curriculum is maintained centrally and updated for every partner at once.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.5}>
              <div className="text-center">
                <button
                  onClick={() => window.location.href = 'mailto:contact@VIDYAVERSE.com'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--text-primary)] hover:bg-[#3B82F6] text-[#fff] rounded-lg font-bold text-sm transition-all shadow-md"
                >
                  Contact Us
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Narrative Section 1 */}
        <section className="px-6 mb-32">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <Reveal delay={0.1} direction="left">
              <div className="h-[400px] rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent-indigo)]/30 overflow-hidden relative shadow-[0_0_20px_rgba(27,43,68,0.08)]">
                <div className="absolute inset-0 bg-[var(--accent-indigo)]/8" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-[var(--bg-main)] border border-[var(--accent-indigo)]/30 flex items-center justify-center shadow-inner">
                    <Code2 className="w-12 h-12 text-[var(--accent-indigo)] opacity-70" />
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.2}>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">The broken promise of bootcamps</h2>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="text-[var(--text-primary)] font-semibold leading-relaxed">
                  Video ends. Editor opens. Cursor blinks. Nothing you watched tells you what to type first.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  For years, the industry promised that watching 40 hours of video tutorials would make you job-ready. But when you finally open a blank editor, you're paralyzed. The gap between theory and execution is massive — that gap is the actual product bootcamps were supposed to solve.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Traditional bootcamps solve this with human mentors, but that costs $15,000. It doesn't scale. We needed a system that provides the same level of granular, line-by-line feedback, but is accessible to everyone in the world.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Narrative Section 2 */}
        <section className="px-6 mb-32">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row">
            
            <div className="space-y-6 order-2 md:order-1">
              <Reveal delay={0.1}>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">Enter the AI Infrastructure</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We built an automated evaluation pipeline that integrates static analysis with Large Language Models. When you submit a project, our backend pulls your GitHub repo, parses the abstract syntax tree, and generates semantic feedback.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  It doesn't just check if your code runs. It checks if it's idiomatic, efficient, and readable. It's like having a senior developer pair-programming with you 24/7.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.4} direction="right" className="order-1 md:order-2">
              <div className="h-[400px] rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent-violet)]/30 overflow-hidden relative shadow-[0_0_20px_rgba(15,159,182,0.08)]">
                <div className="absolute inset-0 bg-[var(--accent-violet)]/8" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-[var(--bg-main)] border border-[var(--accent-violet)]/30 flex items-center justify-center shadow-inner">
                    <BrainCircuit className="w-12 h-12 text-[var(--accent-violet)] opacity-70" />
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* Values */}
        <section className="max-w-5xl mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-16">Our Core Values</h2>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Reveal delay={0.2}>
              <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full transition-colors hover:border-[var(--accent-indigo)]/50 hover:shadow-xl">
                <Code2 className="w-8 h-8 text-[var(--accent-indigo)] mb-6" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Learn by Doing</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  We optimize for time spent writing code, not time spent watching videos. The IDE is our primary classroom.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full transition-colors hover:border-[var(--accent-violet)]/50 hover:shadow-xl">
                <BrainCircuit className="w-8 h-8 text-[var(--accent-violet)] mb-6" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Real Feedback, Fast</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Every submission gets line-by-line feedback in seconds — not a pass/fail script, and not a two-week wait for a human grader.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] h-full transition-colors hover:border-[var(--accent-mint)]/50 hover:shadow-xl">
                <Users className="w-8 h-8 text-[var(--accent-mint)] mb-6" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Radical Accessibility</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  High-quality engineering education shouldn't cost $15,000. It should be scalable, affordable, and accessible to anyone.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Parent company connection */}
        <section className="px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal delay={0.1}>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                VIDYAVERSE is a premium learning platform focused on active, project-based education. We believe in building real skills through hands-on coding exercises, AI-reviewed projects, and verified portfolios that employers trust.
              </p>
            </Reveal>
          </div>
        </section>

      </main>

      <FooterSection />
    </div>
  );
}
