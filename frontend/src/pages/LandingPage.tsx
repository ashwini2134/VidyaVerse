import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

import LampLogin from "../components/auth/LampLogin";
import DoorSignup from "../components/auth/DoorSignup";
import HeroSection from "../components/landing/HeroSection";
import TheShiftSection from "../components/landing/TheShiftSection";
import TeachingMethodologySection from "../components/landing/TeachingMethodologySection";
import BharatCodeAISection from "../components/landing/BharatCodeAISection";
import LiveLearningPreviewSection from "../components/landing/LiveLearningPreviewSection";
import LearnerPortfolioSection from "../components/landing/LearnerPortfolioSection";
import RoadmapSection from "../components/landing/RoadmapSection";
import PlatformCapabilitiesSection from "../components/landing/PlatformCapabilitiesSection";
import CoursesSection from "../components/landing/CoursesSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";
import FooterSection from "../components/landing/FooterSection";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    if (!loginOpen && !registerOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLoginOpen(false);
        setRegisterOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [loginOpen, registerOpen]);

  // Global scroll progress
  const { scrollY, scrollYProgress } = useScroll();
  
  // Header background opacity based on scroll
  const headerBgOpacity = useTransform(scrollY, [0, 50], [0, 0.9]);
  const headerBackdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  // Helper for NavLink active styling
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `transition-colors relative py-2 ${isActive ? "text-[var(--text-primary)]" : "hover:text-[var(--accent-indigo)]"}`;
    
  const activeUnderline = (
    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-indigo)] rounded-full" />
  );

  const scrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById("courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans selection:bg-[var(--accent-indigo)]/25 overflow-x-hidden relative">
      
      {/* Global Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00BFB3] z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation Header */}
      <motion.header 
        className="sticky top-0 z-50 border-b border-[var(--border-primary)]"
        style={{ 
          backgroundColor: useTransform(headerBgOpacity, o => `rgba(255, 255, 255, ${o})`),
          backdropFilter: headerBackdropBlur
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.svg" alt="VIDYAVERSE" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[var(--text-primary)] text-sm tracking-wide">VIDYAVERSE</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[var(--text-secondary)]">
            <NavLink to="/" end className={navLinkClass}>
              {({ isActive }) => (
                <>HOME{isActive && activeUnderline}</>
              )}
            </NavLink>
            <a href="#courses" onClick={scrollToCourses} className="transition-colors relative py-2 hover:text-[var(--accent-indigo)] cursor-pointer">
              COURSES
            </a>
            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <>ABOUT US{isActive && activeUnderline}</>
              )}
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => setLoginOpen(true)} className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-indigo)] transition-colors cursor-pointer">
              LOG IN
            </button>
            <button onClick={() => setRegisterOpen(true)} className="px-5 py-2 rounded-lg bg-[var(--text-primary)] hover:bg-[#00BFB3] text-[#fff] text-xs font-bold transition-all shadow-sm cursor-pointer">
              START LEARNING
            </button>
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
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-[var(--text-primary)]" : ""}>HOME</NavLink>
              <a href="#courses" onClick={scrollToCourses} className="hover:text-[var(--accent-indigo)] cursor-pointer">COURSES</a>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-[var(--text-primary)]" : ""}>ABOUT US</NavLink>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-primary)]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginOpen(true);
                }}
                className="w-full text-center py-2.5 border border-[var(--border-primary)] rounded-lg text-xs font-bold text-[var(--text-secondary)] cursor-pointer"
              >
                LOG IN
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRegisterOpen(true);
                }}
                className="w-full text-center py-2.5 bg-[var(--accent-indigo)] rounded-lg text-xs font-bold text-[#fff] cursor-pointer"
              >
                START LEARNING
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL — lamp-toggle sign-in experience, kept in landing-page context */}
      <AnimatePresence>
        {loginOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setLoginOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setLoginOpen(false)}
                aria-label="Close login"
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <LampLogin embedded onSuccess={() => setLoginOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGNUP MODAL — door-opening sign-up experience, kept in landing-page context */}
      <AnimatePresence>
        {registerOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setRegisterOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setRegisterOpen(false)}
                aria-label="Close sign up"
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <DoorSignup embedded onSuccess={() => setRegisterOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2) HERO SECTION */}
      <HeroSection />

      {/* 3) THE SHIFT — old way vs. VIDYAVERSE way, told once */}
      <TheShiftSection />

      {/* 3.5) BHARATCODE AI — personal coding companion */}
      <BharatCodeAISection />

      {/* 4) TEACHING METHODOLOGY — the 7-stage lecture loop */}
      <TeachingMethodologySection />

      {/* NEW) LIVE LEARNING PREVIEW — a real exercise, no login */}
      <LiveLearningPreviewSection />

      {/* NEW) THE PORTFOLIO ENGINE */}
      <LearnerPortfolioSection />

      {/* NEW) ROADMAP — the two learning paths */}
      <RoadmapSection />

      {/* 6-7) PLATFORM CAPABILITIES — merged stats + feature spotlight bento grid */}
      <PlatformCapabilitiesSection />

      {/* 8) COURSE / PROGRAM SPOTLIGHT */}
      <CoursesSection />

      {/* 10) FAQ */}
      <FAQSection />

      {/* 11) FINAL CTA BAND */}
      <CTASection />

      {/* 12) FOOTER */}
      <FooterSection />
      
    </div>
  );
}
