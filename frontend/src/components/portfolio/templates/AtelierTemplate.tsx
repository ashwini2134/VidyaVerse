import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Code, Award, Globe, Download, Pencil, Loader2 } from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import AnimatedCounter from './AnimatedCounter';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import ExperienceEducation from './ExperienceEducation';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Playfair Display', Georgia, serif";

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

const eyebrow = "text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#8C7A63]";

export default function AtelierTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);
  const services = portfolio?.services ?? [];
  const testimonials = portfolio?.testimonials ?? [];
  const featuredTestimonial = testimonials[0];

  return (
    <div
      className="min-h-screen bg-[#F6ECE7] text-[#2B2620] pb-24"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex, fontFamily: 'var(--font-sans)' } as CSSProperties}
    >
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold tracking-tight" style={{ fontFamily: DISPLAY_FONT }}>{displayUser?.name || 'User'}</span>
          {isOwn && (
            <div className="flex items-center gap-4 text-[12px] font-medium">
              <button onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')} className="flex items-center gap-1.5 text-[#8C7A63] hover:text-[#2B2620] transition-colors">
                <Pencil size={12} /> {tab === 'settings' ? 'View' : 'Edit'}
              </button>
              <button onClick={onDownloadPdf} disabled={downloading} className="flex items-center gap-1.5 text-[#8C7A63] hover:text-[#2B2620] transition-colors disabled:opacity-50">
                {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} PDF
              </button>
              <ShareLinkButton userId={displayUser?.id} label iconSize={12} className="flex items-center gap-1.5 text-[#8C7A63] hover:text-[#2B2620] transition-colors" />
            </div>
          )}
        </div>

        {isOwn && tab === 'settings' ? (
          <div className="pt-10"><SettingsPanel {...settingsProps} /></div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* Hero — asymmetric, avatar right */}
            <section className="grid sm:grid-cols-[1fr_auto] gap-8 items-center pt-14 pb-16">
              <motion.div initial="hidden" animate="visible" variants={fade}>
                <p className={eyebrow}>VIDYAVERSE Portfolio · {joinedDate}</p>
                <h1 className="text-[44px] sm:text-[56px] font-bold leading-[1.02] tracking-tight mt-3" style={{ fontFamily: DISPLAY_FONT }}>
                  {displayUser?.bio || 'Building thoughtful software, one project at a time.'}
                </h1>
                <div className="flex items-center gap-5 mt-6 text-[13px]">
                  {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#6B5F4C] hover:text-[#2B2620] transition-colors"><Code size={13} /> GitHub</a>}
                  {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#6B5F4C] hover:text-[#2B2620] transition-colors"><Award size={13} /> LinkedIn</a>}
                  {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#6B5F4C] hover:text-[#2B2620] transition-colors"><Globe size={13} /> Site</a>}
                </div>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fade} className="justify-self-center sm:justify-self-end">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#EDDCD3] border-4 border-white shadow-xl flex items-center justify-center">
                  {(avatarPreview || displayUser?.avatarUrl) ? (
                    <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold" style={{ fontFamily: DISPLAY_FONT }}>{initials}</span>
                  )}
                </div>
              </motion.div>
            </section>

            {isOwn && (
              <CompletenessNudge
                completeness={completeness}
                onComplete={() => setTab('settings')}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: '#2B2620',
                  mutedColor: '#8C7A63',
                  containerClassName: 'bg-white/60 rounded-2xl border border-[#2B2620]/10 p-4 mb-8 flex items-center gap-4',
                }}
              />
            )}

            {stats && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-[#2B2620]/10">
                {[
                  ['Problems Solved', stats.problemsSolved],
                  ['Projects Built', stats.milestoneProjects + stats.capstoneProjects],
                  ['Courses Completed', stats.coursesCompleted],
                  ['Practice Accuracy', stats.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—'],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div className="text-[28px] font-bold" style={{ fontFamily: DISPLAY_FONT, color: accentTheme.hex }}>
                      {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
                    </div>
                    <div className="text-[11px] text-[#8C7A63] mt-1">{label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Featured testimonial as pull-quote anchor */}
            {featuredTestimonial && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-16 text-center max-w-2xl mx-auto">
                <p className="text-[26px] sm:text-[32px] leading-snug" style={{ fontFamily: DISPLAY_FONT, fontStyle: 'italic' }}>
                  "{featuredTestimonial.quote}"
                </p>
                <p className="text-[13px] font-semibold mt-5">{featuredTestimonial.author}</p>
                {(featuredTestimonial.role || featuredTestimonial.company) && (
                  <p className="text-[12px] text-[#8C7A63]">{[featuredTestimonial.role, featuredTestimonial.company].filter(Boolean).join(', ')}</p>
                )}
              </motion.section>
            )}

            {/* Services as the offering menu */}
            {services.length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-10">
                <p className={eyebrow}>Services</p>
                <div className="grid sm:grid-cols-2 gap-px bg-[#2B2620]/10 mt-4 rounded-2xl overflow-hidden">
                  {services.map((s, i) => (
                    <div key={s.id} className="bg-[#F6ECE7] p-7">
                      <span className="text-[11px] font-mono text-[#8C7A63]">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-[19px] font-bold mt-2" style={{ fontFamily: DISPLAY_FONT }}>{s.title}</h3>
                      <p className="text-[13.5px] text-[#6B5F4C] leading-relaxed mt-2">{s.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Work */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-10">
              <p className={eyebrow}>Selected Work</p>
              <div className="mt-4">
                <ProjectsByCategory
                  projects={enrichedProjects}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: '#2B2620',
                    mutedColor: '#8C7A63',
                    borderColor: 'rgba(43,38,32,0.1)',
                    fontFamily: DISPLAY_FONT,
                  }}
                />
              </div>
            </motion.section>

            {((portfolio?.experience ?? []).length + (portfolio?.education ?? []).length) > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-10">
                <ExperienceEducation
                  experience={portfolio?.experience ?? []}
                  education={portfolio?.education ?? []}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: '#2B2620',
                    mutedColor: '#8C7A63',
                    borderColor: 'rgba(43,38,32,0.1)',
                    fontFamily: DISPLAY_FONT,
                    headingClassName: eyebrow,
                  }}
                />
              </motion.section>
            )}

            {(portfolio?.certificates ?? []).length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-10">
                <p className={eyebrow}>Certificates</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {portfolio!.certificates.map((cert, i) => (
                    <button key={i} onClick={() => window.open(`/verify/${cert.certNumber}`, '_blank')} className="px-4 py-2.5 rounded-full bg-white border border-[#2B2620]/10 text-[12.5px] font-medium hover:border-[#2B2620]/30 transition-colors">
                      {cert.title || courseDisplayName(cert.courseSlug)}
                    </button>
                  ))}
                </div>
              </motion.section>
            )}

            {(portfolio?.skills ?? []).length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-10">
                <p className={eyebrow}>Skills</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {portfolio!.skills.map((skill, i) => (
                    <span key={i} className="text-[13px] text-[#4A4030]">{skill}{i < portfolio!.skills.length - 1 ? ' · ' : ''}</span>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="py-10">
              <p className={eyebrow}>GitHub Activity</p>
              <div className="mt-4">
                <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} hideTitle />
              </div>
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
