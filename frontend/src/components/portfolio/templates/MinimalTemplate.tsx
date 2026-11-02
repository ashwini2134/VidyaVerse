import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Code, Award, Link as LinkIcon, Download, Pencil, Loader2 } from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import ExperienceEducation from './ExperienceEducation';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Playfair Display', Georgia, serif";
const BODY_FONT = "'Source Serif 4', Georgia, serif";
const LABEL_FONT = "var(--font-mono)";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: Math.min(i * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const sectionLabel = "text-[10.5px] uppercase tracking-[0.18em] font-semibold text-[var(--text-muted)] mb-4";

export default function MinimalTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);

  const statLine = stats
    ? [
        `${stats.problemsSolved} problem${stats.problemsSolved === 1 ? '' : 's'} solved`,
        `${(stats.milestoneProjects + stats.capstoneProjects)} project${(stats.milestoneProjects + stats.capstoneProjects) === 1 ? '' : 's'} built`,
        `${stats.coursesCompleted} course${stats.coursesCompleted === 1 ? '' : 's'} completed`,
        stats.practiceAccuracy != null ? `${stats.practiceAccuracy}% practice accuracy` : null,
      ].filter(Boolean)
    : [];

  return (
    <div
      className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] pb-20"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex, fontFamily: BODY_FONT } as CSSProperties}
    >
      <div className="max-w-3xl mx-auto px-6 pt-14">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <div className="relative group/avatar flex-shrink-0">
              <div className="w-16 h-16 bg-[var(--bg-dark-surface)] flex items-center justify-center overflow-hidden border-2 border-[var(--text-main)]">
                {(avatarPreview || displayUser?.avatarUrl) ? (
                  <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover grayscale contrast-110" />
                ) : (
                  <span className="text-sm font-bold text-[var(--text-main)]" style={{ fontFamily: LABEL_FONT }}>{initials}</span>
                )}
              </div>
              {isOwn && (
                <button
                  onClick={() => setTab('settings')}
                  title="Edit profile"
                  className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-[var(--color-primary)] text-[#ffffff] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                >
                  <Pencil size={10} />
                </button>
              )}
            </div>
            <div>
              <h1
                className="text-[38px] sm:text-[44px] font-black text-[var(--text-main)] leading-[0.95] tracking-tight"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {displayUser?.name || 'User'}
              </h1>
              <p className="text-[11px] mt-1.5 text-[var(--text-muted)] uppercase tracking-[0.14em]" style={{ fontFamily: LABEL_FONT }}>
                VIDYAVERSE · Joined {joinedDate}
              </p>
            </div>
          </div>

          {isOwn && (
            <div className="flex items-center gap-3 text-[11px] pt-1 uppercase tracking-[0.1em]" style={{ fontFamily: LABEL_FONT }}>
              <button onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')} className="text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4">
                {tab === 'settings' ? 'View' : 'Edit'}
              </button>
              <button onClick={onDownloadPdf} disabled={downloading} className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4 disabled:opacity-50">
                {downloading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />} PDF
              </button>
              <ShareLinkButton userId={displayUser?.id} label iconSize={11} className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4" />
            </div>
          )}
        </motion.div>

        {displayUser?.bio && (
          <motion.p initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-[15.5px] text-[var(--text-secondary)] leading-relaxed mt-5 max-w-xl italic">
            "{displayUser.bio}"
          </motion.p>
        )}

        {(displayUser?.githubUrl || displayUser?.linkedinUrl || displayUser?.portfolioUrl) && (
          <motion.div initial="hidden" animate="visible" custom={1.2} variants={fadeUp} className="flex items-center gap-5 mt-4 text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]" style={{ fontFamily: LABEL_FONT }}>
            {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] flex items-center gap-1.5"><Code size={12} /> GitHub</a>}
            {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] flex items-center gap-1.5"><Award size={12} /> LinkedIn</a>}
            {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] flex items-center gap-1.5"><LinkIcon size={12} /> Site</a>}
          </motion.div>
        )}

        <motion.div
          className="h-[3px] bg-[var(--text-main)] my-8 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

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
                  textColor: 'var(--text-main)',
                  mutedColor: 'var(--text-muted)',
                  containerClassName: 'border-2 border-[var(--text-main)] p-4 mb-8 flex items-center gap-4',
                }}
              />
            )}

            {statLine.length > 0 && (
              <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-[14px] text-[var(--text-main)] font-semibold mb-1.5">
                {statLine.join('  ·  ')}
              </motion.p>
            )}
            {stats && stats.problemsSolved > 0 && (
              <motion.p initial="hidden" animate="visible" custom={2.2} variants={fadeUp} className="text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-10" style={{ fontFamily: LABEL_FONT }}>
                Easy {stats.problemsByDifficulty.easy} · Medium {stats.problemsByDifficulty.medium} · Hard {stats.problemsByDifficulty.hard}
              </motion.p>
            )}
            {(!stats || stats.problemsSolved === 0) && <div className="mb-10" />}

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={3} variants={fadeUp} className="mb-10">
              <h2 className={sectionLabel} style={{ fontFamily: LABEL_FONT }}>GitHub Activity</h2>
              <div className="border-2 border-[var(--text-main)] p-4">
                <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} hideTitle />
              </div>
            </motion.section>

            {((portfolio?.experience ?? []).length + (portfolio?.education ?? []).length) > 0 && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={3} variants={fadeUp} className="mb-10">
                <ExperienceEducation
                  experience={portfolio?.experience ?? []}
                  education={portfolio?.education ?? []}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: 'var(--text-main)',
                    mutedColor: 'var(--text-muted)',
                    borderColor: 'var(--border-light)',
                    fontFamily: DISPLAY_FONT,
                    headingClassName: sectionLabel,
                    headingStyle: { fontFamily: LABEL_FONT },
                  }}
                />
              </motion.section>
            )}

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={3} variants={fadeUp} className="mb-10">
              <h2 className={sectionLabel} style={{ fontFamily: LABEL_FONT }}>Projects</h2>
              <ProjectsByCategory
                projects={enrichedProjects}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: 'var(--text-main)',
                  mutedColor: 'var(--text-muted)',
                  borderColor: 'var(--border-light)',
                  fontFamily: DISPLAY_FONT,
                }}
              />
            </motion.section>

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={3} variants={fadeUp} className="mb-10">
              <h2 className={sectionLabel} style={{ fontFamily: LABEL_FONT }}>Certificates</h2>
              {(portfolio?.certificates ?? []).length === 0 ? (
                <p className="text-[14px] text-[var(--text-muted)] italic">No certificates yet.</p>
              ) : (
                <div className="divide-y-2 divide-[var(--border-light)]">
                  {portfolio!.certificates.map((cert, i) => (
                    <div key={i} className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
                      <span className="text-[15px] font-bold text-[var(--text-main)]" style={{ fontFamily: DISPLAY_FONT }}>{cert.title || courseDisplayName(cert.courseSlug)}</span>
                      <div className="flex items-center gap-4 uppercase tracking-[0.08em] text-[10.5px]" style={{ fontFamily: LABEL_FONT }}>
                        <span className="text-[var(--text-muted)]">
                          {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                        </span>
                        <button onClick={() => window.open(`/verify/${cert.certNumber}`, '_blank')} className="text-[var(--color-primary)] hover:underline underline-offset-4 font-semibold">
                          Verify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={3} variants={fadeUp}>
              <h2 className={sectionLabel} style={{ fontFamily: LABEL_FONT }}>Skills</h2>
              {(portfolio?.skills ?? []).length === 0 ? (
                <p className="text-[14px] text-[var(--text-muted)] italic">No skills recorded yet.</p>
              ) : (
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {portfolio!.skills.join('  ·  ')}
                </p>
              )}
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
