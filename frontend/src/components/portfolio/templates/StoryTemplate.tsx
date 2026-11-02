import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Code, Award, Globe, Download, Pencil, Loader2, ArrowUpRight, Quote } from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import AnimatedCounter from './AnimatedCounter';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Clash Display', 'Calistoga', var(--font-sans), sans-serif";
const BODY_FONT = "var(--font-sans)";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const sectionEyebrow = "text-[11px] uppercase tracking-[0.22em] font-semibold";

export default function StoryTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);
  const featured = enrichedProjects[0];
  const rest = enrichedProjects.slice(1);
  const experience = portfolio?.experience ?? [];
  const education = portfolio?.education ?? [];
  const services = portfolio?.services ?? [];
  const testimonials = portfolio?.testimonials ?? [];

  return (
    <div
      className="min-h-screen text-[#ffffff] pb-24"
      style={{
        '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex, fontFamily: BODY_FONT,
        background: 'radial-gradient(ellipse 1200px 700px at 50% -10%, #1B1640 0%, #0A0918 45%, #050509 100%)',
      } as CSSProperties}
    >
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/15">
            {(avatarPreview || displayUser?.avatarUrl) ? (
              <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold">{initials}</span>
            )}
          </div>
          <span className="text-sm font-semibold text-[#ffffff]/80">{displayUser?.name || 'User'}</span>
        </div>
        {isOwn && (
          <div className="flex items-center gap-3 text-[12px] font-medium">
            <button onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')} className="flex items-center gap-1.5 text-[#ffffff]/60 hover:text-[#ffffff] transition-colors">
              <Pencil size={12} /> {tab === 'settings' ? 'View' : 'Edit'}
            </button>
            <button onClick={onDownloadPdf} disabled={downloading} className="flex items-center gap-1.5 text-[#ffffff]/60 hover:text-[#ffffff] transition-colors disabled:opacity-50">
              {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} PDF
            </button>
            <ShareLinkButton userId={displayUser?.id} label iconSize={12} className="flex items-center gap-1.5 text-[#ffffff]/60 hover:text-[#ffffff] transition-colors" />
          </div>
        )}
      </header>

      {isOwn && tab === 'settings' ? (
        <div className="max-w-5xl mx-auto px-6 pt-10">
          <div className="bg-white rounded-2xl p-2" style={{ colorScheme: 'light' }}>
            <SettingsPanel {...settingsProps} />
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="max-w-5xl mx-auto px-6 pt-16 pb-20">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentTheme.hex, boxShadow: `0 0 8px ${accentTheme.hex}` }} />
              <span className="text-[11px] font-medium text-[#ffffff]/70">Open to opportunities · {joinedDate}</span>
            </motion.div>
            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp}
              className="text-[48px] sm:text-[68px] font-bold leading-[0.98] tracking-tight"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {displayUser?.name || 'User'}
            </motion.h1>
            {displayUser?.bio && (
              <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[19px] text-[#ffffff]/60 leading-relaxed mt-6 max-w-2xl">
                {displayUser.bio}
              </motion.p>
            )}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-4 mt-8">
              {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-colors"><Code size={16} /></a>}
              {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-colors"><Award size={16} /></a>}
              {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-colors"><Globe size={16} /></a>}
            </motion.div>

            {stats && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/10">
                {[
                  { label: 'Problems Solved', value: stats.problemsSolved },
                  { label: 'Projects Built', value: stats.milestoneProjects + stats.capstoneProjects },
                  { label: 'Courses Completed', value: stats.coursesCompleted },
                  { label: 'Practice Accuracy', value: stats.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[32px] font-bold" style={{ fontFamily: DISPLAY_FONT }}>
                      <AnimatedCounter value={s.value} />
                    </div>
                    <div className="text-[12px] text-[#ffffff]/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </section>

          {isOwn && (
            <section className="max-w-5xl mx-auto px-6 pb-10">
              <CompletenessNudge
                completeness={completeness}
                onComplete={() => setTab('settings')}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: '#ffffff',
                  mutedColor: 'rgba(255,255,255,0.5)',
                  containerClassName: 'rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4',
                }}
              />
            </section>
          )}

          {/* Featured project */}
          {featured && (
            <section className="max-w-5xl mx-auto px-6 pb-6">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Featured Work</motion.p>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 sm:p-12"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="text-[30px] sm:text-[36px] font-bold" style={{ fontFamily: DISPLAY_FONT }}>{featured.name}</h3>
                  {featured.difficulty && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full" style={{ backgroundColor: `${accentTheme.hex}22`, color: accentTheme.hex }}>
                      {featured.difficulty}
                    </span>
                  )}
                </div>
                {featured.techStack && <p className="text-[14px] text-[#ffffff]/50 mt-3">{featured.techStack}</p>}
                <div className="flex items-center gap-5 mt-6">
                  {featured.githubUrl && <a href={featured.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[13px] font-medium text-[#ffffff]/70 hover:text-[#ffffff] transition-colors">Code <ArrowUpRight size={13} /></a>}
                  {featured.liveDemoUrl && <a href={featured.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[13px] font-medium text-[#ffffff]/70 hover:text-[#ffffff] transition-colors">Live Demo <ArrowUpRight size={13} /></a>}
                </div>
              </motion.div>
            </section>
          )}

          {/* Other projects, grouped by category */}
          {rest.length > 0 && (
            <section className="max-w-5xl mx-auto px-6 py-10">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>More Projects</motion.p>
              <div className="mt-4">
                <ProjectsByCategory
                  projects={rest}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: '#ffffff',
                    mutedColor: 'rgba(255,255,255,0.5)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    fontFamily: DISPLAY_FONT,
                    groupClassName: 'rounded-2xl border border-white/10 bg-white/[0.03] p-6',
                  }}
                />
              </div>
            </section>
          )}

          {/* GitHub activity */}
          <section className="max-w-5xl mx-auto px-6 py-10">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Activity</motion.p>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} bare hideTitle />
            </motion.div>
          </section>

          {/* Skills */}
          {(portfolio?.skills ?? []).length > 0 && (
            <section className="max-w-5xl mx-auto px-6 py-10">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Skills</motion.p>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-wrap gap-2.5 mt-4">
                {portfolio!.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-[13px] font-medium text-[#ffffff]/80">{skill}</span>
                ))}
              </motion.div>
            </section>
          )}

          {/* Experience + Education */}
          {(experience.length > 0 || education.length > 0) && (
            <section className="max-w-5xl mx-auto px-6 py-10 grid sm:grid-cols-2 gap-10">
              {experience.length > 0 && (
                <div>
                  <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Experience</motion.p>
                  <div className="mt-4 space-y-6">
                    {experience.map((e) => (
                      <motion.div key={e.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="pl-4 border-l-2 border-white/15">
                        <h4 className="text-[16px] font-bold">{e.role}</h4>
                        <p className="text-[13px] text-[#ffffff]/60 mt-0.5">{e.company}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[#ffffff]/40 mt-1.5">{e.startDate} – {e.current ? 'Present' : e.endDate}</p>
                        {e.description && <p className="text-[13.5px] text-[#ffffff]/60 leading-relaxed mt-2">{e.description}</p>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && (
                <div>
                  <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Education</motion.p>
                  <div className="mt-4 space-y-6">
                    {education.map((e) => (
                      <motion.div key={e.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="pl-4 border-l-2 border-white/15">
                        <h4 className="text-[16px] font-bold">{e.institution}</h4>
                        <p className="text-[13px] text-[#ffffff]/60 mt-0.5">{[e.degree, e.field].filter(Boolean).join(', ')}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[#ffffff]/40 mt-1.5">{e.startDate} – {e.endDate}</p>
                        {e.description && <p className="text-[13.5px] text-[#ffffff]/60 leading-relaxed mt-2">{e.description}</p>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="max-w-5xl mx-auto px-6 py-10">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Testimonials</motion.p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {testimonials.map((t) => (
                  <motion.div key={t.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <Quote size={18} className="text-[#ffffff]/25 mb-3" />
                    <p className="text-[14.5px] text-[#ffffff]/75 leading-relaxed italic">"{t.quote}"</p>
                    <div className="flex items-center gap-3 mt-4">
                      {t.avatarUrl && <img src={t.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
                      <div>
                        <p className="text-[13px] font-semibold text-[#ffffff]">{t.author}</p>
                        {(t.role || t.company) && <p className="text-[11.5px] text-[#ffffff]/50">{[t.role, t.company].filter(Boolean).join(', ')}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Services */}
          {services.length > 0 && (
            <section className="max-w-5xl mx-auto px-6 py-10">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>What I Do</motion.p>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {services.map((s) => (
                  <motion.div key={s.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <h4 className="text-[16px] font-bold">{s.title}</h4>
                    <p className="text-[13.5px] text-[#ffffff]/60 leading-relaxed mt-2">{s.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {(portfolio?.certificates ?? []).length > 0 && (
            <section className="max-w-5xl mx-auto px-6 py-10">
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={sectionEyebrow} style={{ color: accentTheme.hex }}>Certificates</motion.p>
              <div className="divide-y divide-white/10 mt-4">
                {portfolio!.certificates.map((cert, i) => (
                  <div key={i} className="py-4 first:pt-0 flex items-center justify-between gap-3">
                    <span className="text-[15px] font-semibold text-[#ffffff]">{cert.title || courseDisplayName(cert.courseSlug)}</span>
                    <div className="flex items-center gap-4 text-[12px]">
                      <span className="text-[#ffffff]/40">{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}</span>
                      <button onClick={() => window.open(`/verify/${cert.certNumber}`, '_blank')} className="font-semibold hover:underline" style={{ color: accentTheme.hex }}>Verify</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA / Contact */}
          <section className="max-w-5xl mx-auto px-6 pt-16 pb-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="rounded-3xl p-10 sm:p-14 text-center"
              style={{ background: `linear-gradient(135deg, ${accentTheme.hex}, ${accentTheme.darkHex})` }}
            >
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#ffffff]" style={{ fontFamily: DISPLAY_FONT }}>Let's build something together.</h2>
              <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:opacity-90 transition-opacity">GitHub</a>}
                {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-white/15 text-[#ffffff] text-[13px] font-semibold hover:bg-white/25 transition-colors">LinkedIn</a>}
              </div>
            </motion.div>
          </section>

          <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-[12px] text-[#ffffff]/30">
            {displayUser?.name || 'User'} · VIDYAVERSE Portfolio
          </footer>
        </>
      )}
    </div>
  );
}
