import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Code, Award, Globe, Download, Pencil, Loader2 } from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Space Grotesk', var(--font-sans), sans-serif";
const BODY_FONT = "var(--font-sans)";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: Math.min(i * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const sectionHeading = "text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--text-main)] pb-2 mb-4 border-b-2 border-[var(--text-main)]";

export default function ResumeTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);
  const experience = portfolio?.experience ?? [];
  const education = portfolio?.education ?? [];
  const services = portfolio?.services ?? [];
  const testimonials = portfolio?.testimonials ?? [];

  return (
    <div
      className="min-h-screen bg-[#F7F6F3] text-[#1A1A18] pb-20"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex, fontFamily: BODY_FONT } as CSSProperties}
    >
      <div className="max-w-[820px] mx-auto px-6 pt-10">
        {isOwn && (
          <div className="flex justify-end gap-4 mb-4 text-[12px] font-medium">
            <button onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')} className="flex items-center gap-1.5 text-[#6B6862] hover:text-[#1A1A18] transition-colors">
              <Pencil size={12} /> {tab === 'settings' ? 'View' : 'Edit'}
            </button>
            <button onClick={onDownloadPdf} disabled={downloading} className="flex items-center gap-1.5 text-[#6B6862] hover:text-[#1A1A18] transition-colors disabled:opacity-50">
              {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} Download PDF
            </button>
            <ShareLinkButton userId={displayUser?.id} label iconSize={12} className="flex items-center gap-1.5 text-[#6B6862] hover:text-[#1A1A18] transition-colors" />
          </div>
        )}

        {isOwn && tab === 'settings' ? (
          <SettingsPanel {...settingsProps} />
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {isOwn && (
              <CompletenessNudge
                completeness={completeness}
                onComplete={() => setTab('settings')}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: '#1A1A18',
                  mutedColor: '#8A8680',
                  containerClassName: 'bg-white rounded-2xl border border-black/[0.08] p-4 mb-4 flex items-center gap-4',
                }}
              />
            )}
          <div className="bg-white rounded-2xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-8 sm:p-12">
            {/* Header */}
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-start gap-5 pb-6 border-b border-black/10">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#EDEBE6] flex items-center justify-center flex-shrink-0">
                {(avatarPreview || displayUser?.avatarUrl) ? (
                  <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-[#1A1A18]">{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[30px] font-bold tracking-tight leading-tight" style={{ fontFamily: DISPLAY_FONT }}>{displayUser?.name || 'User'}</h1>
                {displayUser?.bio && <p className="text-[14px] text-[#6B6862] mt-1.5">{displayUser.bio}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12.5px] text-[#6B6862]">
                  <span>VIDYAVERSE · Joined {joinedDate}</span>
                  {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"><Code size={12} /> GitHub</a>}
                  {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"><Award size={12} /> LinkedIn</a>}
                  {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"><Globe size={12} /> Site</a>}
                </div>
              </div>
            </motion.div>

            {/* Stat strip */}
            {stats && (
              <motion.div initial="hidden" animate="visible" custom={0.5} variants={fadeUp} className="grid grid-cols-4 gap-4 py-6 border-b border-black/10">
                {[
                  { label: 'Problems', value: stats.problemsSolved },
                  { label: 'Projects', value: stats.milestoneProjects + stats.capstoneProjects },
                  { label: 'Courses', value: stats.coursesCompleted },
                  { label: 'Accuracy', value: stats.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[22px] font-bold" style={{ fontFamily: DISPLAY_FONT, color: accentTheme.hex }}>{s.value}</div>
                    <div className="text-[10.5px] uppercase tracking-[0.06em] text-[#8A8680] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="pt-6">
                <h2 className={sectionHeading}>Experience</h2>
                <div className="space-y-5">
                  {experience.map((e) => (
                    <div key={e.id} className="flex gap-4">
                      <div className="w-[110px] flex-shrink-0 text-[11.5px] text-[#8A8680] pt-0.5">{e.startDate} – {e.current ? 'Present' : e.endDate}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-[15px] font-bold">{e.role}</h3>
                        </div>
                        <p className="text-[13px] text-[#6B6862]">{e.company}</p>
                        {e.description && <p className="text-[13px] text-[#4A4740] leading-relaxed mt-1.5">{e.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.2} variants={fadeUp} className="pt-8">
                <h2 className={sectionHeading}>Education</h2>
                <div className="space-y-5">
                  {education.map((e) => (
                    <div key={e.id} className="flex gap-4">
                      <div className="w-[110px] flex-shrink-0 text-[11.5px] text-[#8A8680] pt-0.5">{e.startDate} – {e.endDate}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold">{e.institution}</h3>
                        <p className="text-[13px] text-[#6B6862]">{[e.degree, e.field].filter(Boolean).join(', ')}</p>
                        {e.description && <p className="text-[13px] text-[#4A4740] leading-relaxed mt-1.5">{e.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Projects */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.4} variants={fadeUp} className="pt-8">
              <h2 className={sectionHeading}>Projects</h2>
              <ProjectsByCategory
                projects={enrichedProjects}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: '#1A1A18',
                  mutedColor: '#8A8680',
                  borderColor: 'rgba(26,26,24,0.1)',
                }}
              />
            </motion.section>

            {/* Skills */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.6} variants={fadeUp} className="pt-8">
              <h2 className={sectionHeading}>Skills</h2>
              {(portfolio?.skills ?? []).length === 0 ? (
                <p className="text-[13px] text-[#8A8680] italic">No skills recorded yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {portfolio!.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-md bg-[#F0EEE9] text-[12.5px] font-medium text-[#4A4740]">{skill}</span>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Certificates */}
            {(portfolio?.certificates ?? []).length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.8} variants={fadeUp} className="pt-8">
                <h2 className={sectionHeading}>Certificates</h2>
                <div className="space-y-2">
                  {portfolio!.certificates.map((cert, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 text-[13.5px]">
                      <span className="font-semibold">{cert.title || courseDisplayName(cert.courseSlug)}</span>
                      <span className="text-[12px] text-[#8A8680]">{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp} className="pt-8">
                <h2 className={sectionHeading}>Services</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {services.map((s) => (
                    <div key={s.id}>
                      <h3 className="text-[13.5px] font-bold">{s.title}</h3>
                      <p className="text-[12.5px] text-[#6B6862] leading-relaxed mt-1">{s.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2.2} variants={fadeUp} className="pt-8">
                <h2 className={sectionHeading}>Endorsements</h2>
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="border-l-2 pl-4" style={{ borderColor: accentTheme.hex }}>
                      <p className="text-[13.5px] text-[#4A4740] italic leading-relaxed">"{t.quote}"</p>
                      <p className="text-[12.5px] font-semibold mt-1.5">{t.author}{(t.role || t.company) && <span className="font-normal text-[#8A8680]"> — {[t.role, t.company].filter(Boolean).join(', ')}</span>}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* GitHub activity */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2.4} variants={fadeUp} className="pt-8">
              <h2 className={sectionHeading}>GitHub Activity</h2>
              <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} hideTitle />
            </motion.section>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
