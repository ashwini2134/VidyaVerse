import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import AnimatedCounter from './AnimatedCounter';
import Typewriter from './Typewriter';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import ExperienceEducation from './ExperienceEducation';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const MONO = 'var(--font-mono)';
const INK = '#D4D4D8';
const MUTED = '#71717A';
const PANEL = '#0F0F10';
const BORDER = '#27272A';

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: Math.min(i * 0.06, 0.3) },
  }),
};

function PromptLine({ children }: { children: React.ReactNode }) {
  return <div className="text-[12.5px] mb-2" style={{ color: MUTED }}>{children}</div>;
}

export default function TerminalTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const accent = accentTheme.hex;
  const completeness = computeCompleteness(displayUser, portfolio);

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: '#0A0A0A', color: INK, fontFamily: MONO, '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex } as CSSProperties}
    >
      {/* Subtle grid texture — deliberately faint, no scanlines/grain (heavy retro texture reads as cliché, not craft) */}
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 relative">
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, backgroundColor: PANEL }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: '#151516' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EAB308' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22C55E' }} />
            <span className="ml-3 text-[11px] truncate" style={{ color: MUTED }}>student@vidyaverse:~/portfolio</span>
            {isOwn && (
              <div className="ml-auto flex items-center gap-3 text-[11.5px] flex-shrink-0">
                <button onClick={() => setTab('overview')} style={{ color: tab === 'overview' ? accent : MUTED }} className="hover:text-[#ffffff] transition-colors">
                  [overview]
                </button>
                <button onClick={() => setTab('settings')} style={{ color: tab === 'settings' ? accent : MUTED }} className="hover:text-[#ffffff] transition-colors">
                  [settings]
                </button>
                <button onClick={onDownloadPdf} disabled={downloading} style={{ color: MUTED }} className="hover:text-[#ffffff] transition-colors disabled:opacity-50 flex items-center gap-1">
                  {downloading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />} pdf
                </button>
                <ShareLinkButton userId={displayUser?.id} label iconSize={11} className="hover:text-[#ffffff] transition-colors flex items-center gap-1" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <PromptLine><span style={{ color: accent }}>$</span> whoami</PromptLine>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 rounded overflow-hidden" style={{ border: `1px solid ${BORDER}`, backgroundColor: '#151516' }}>
                {(avatarPreview || displayUser?.avatarUrl) ? (
                  <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] font-bold" style={{ color: accent }}>{initials}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#ffffff]">
                <Typewriter text={displayUser?.name || 'user'} />
              </h1>
            </div>

            <PromptLine><span style={{ color: accent }}>$</span> cat bio.txt</PromptLine>
            <p className="text-[13.5px] mb-6 leading-relaxed" style={{ color: INK }}>
              {displayUser?.bio || 'A living record of everything built and learned at VIDYAVERSE.'}
            </p>

            <PromptLine><span style={{ color: accent }}>$</span> echo $STATUS</PromptLine>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px]" style={{ color: MUTED }}>
              <span>living_portfolio=<span style={{ color: accent }}>true</span></span>
              <span>joined=<span style={{ color: INK }}>"{joinedDate}"</span></span>
              {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff] transition-colors">[github]</a>}
              {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff] transition-colors">[linkedin]</a>}
              {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff] transition-colors">[site]</a>}
            </div>
          </div>
        </div>

        {isOwn && tab === 'settings' ? (
          <div className="mt-8 rounded-lg p-5 sm:p-6" style={{ backgroundColor: '#F5F5F5' }}>
            <SettingsPanel {...settingsProps} />
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: accent, borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            {isOwn && (
              <div className="mt-8">
                <CompletenessNudge
                  completeness={completeness}
                  onComplete={() => setTab('settings')}
                  theme={{
                    accentHex: accent,
                    textColor: INK,
                    mutedColor: MUTED,
                    containerClassName: 'rounded-lg p-4 flex items-center gap-4',
                    containerStyle: { border: `1px solid ${BORDER}`, backgroundColor: PANEL },
                  }}
                />
              </div>
            )}

            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn} className="mt-8 rounded-lg p-6" style={{ border: `1px solid ${BORDER}`, backgroundColor: PANEL }}>
              <div className="text-[12px] mb-5" style={{ color: MUTED }}>$ portfolio stats --summary</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {[
                  ['COURSES', stats?.coursesCompleted ?? 0],
                  ['PROBLEMS', stats?.problemsSolved ?? 0],
                  ['PROJECTS', (stats?.milestoneProjects ?? 0) + (stats?.capstoneProjects ?? 0)],
                  ['ACCURACY', stats?.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—'],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <div className="text-[22px] font-bold tabular-nums" style={{ color: accent }}>
                      {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
                    </div>
                    <div className="text-[10px] mt-1 tracking-wider" style={{ color: MUTED }}>{label}</div>
                  </div>
                ))}
              </div>
              {stats && stats.problemsSolved > 0 && (
                <div className="flex flex-wrap gap-5 mt-5 pt-5 text-[11.5px]" style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}>
                  <span>easy=<span style={{ color: '#22C55E' }}>{stats.problemsByDifficulty.easy}</span></span>
                  <span>medium=<span style={{ color: '#EAB308' }}>{stats.problemsByDifficulty.medium}</span></span>
                  <span>hard=<span style={{ color: '#EF4444' }}>{stats.problemsByDifficulty.hard}</span></span>
                </div>
              )}
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn} className="mt-6">
              <div className="text-[12px] mb-3" style={{ color: MUTED }}>$ github --activity</div>
              <div
                className="rounded-lg p-6"
                style={{
                  border: `1px solid ${BORDER}`, backgroundColor: PANEL,
                  '--text-main': '#FFFFFF', '--text-muted': MUTED, '--bg-dark-surface': '#1C1C1E',
                } as CSSProperties}
              >
                <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} hideTitle bare />
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn} className="mt-8">
              <div className="text-[12px] mb-3" style={{ color: MUTED }}>$ ls projects/</div>
              <ProjectsByCategory
                projects={enrichedProjects}
                emptyMessage="No projects yet. Complete a project to see it here."
                theme={{
                  accentHex: accent,
                  textColor: '#ffffff',
                  mutedColor: MUTED,
                  borderColor: BORDER,
                  fontFamily: MONO,
                  groupClassName: 'rounded-lg p-4',
                  groupStyle: { border: `1px solid ${BORDER}`, backgroundColor: PANEL },
                }}
              />
            </motion.div>

            {((portfolio?.experience ?? []).length + (portfolio?.education ?? []).length) > 0 && (
              <motion.div initial="hidden" animate="visible" custom={2.5} variants={fadeIn} className="mt-8">
                <div className="text-[12px] mb-3" style={{ color: MUTED }}>$ cat experience.json</div>
                <div className="rounded-lg p-6" style={{ border: `1px solid ${BORDER}`, backgroundColor: PANEL }}>
                  <ExperienceEducation
                    experience={portfolio?.experience ?? []}
                    education={portfolio?.education ?? []}
                    theme={{
                      accentHex: accent,
                      textColor: '#ffffff',
                      mutedColor: MUTED,
                      borderColor: BORDER,
                      fontFamily: MONO,
                      headingClassName: 'text-[11px] uppercase tracking-wider',
                      headingStyle: { color: MUTED },
                    }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn} className="mt-8">
              <div className="text-[12px] mb-3" style={{ color: MUTED }}>$ ls certificates/</div>
              <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, backgroundColor: PANEL }}>
                {(portfolio?.certificates ?? []).length === 0 ? (
                  <div className="p-6 text-[13px]" style={{ color: MUTED }}>No certificates yet.</div>
                ) : (
                  portfolio!.certificates.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-3.5 text-[12.5px]"
                      style={{ borderBottom: i < portfolio!.certificates.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                    >
                      <span>
                        <span style={{ color: '#22C55E' }}>✓ </span>
                        <span style={{ color: INK }}>{(cert.title || courseDisplayName(cert.courseSlug)).toLowerCase().replace(/[^a-z0-9]+/g, '_')}.cert</span>
                      </span>
                      <button onClick={() => window.open(`/verify/${cert.certNumber}`, '_blank')} className="hover:text-[#ffffff] transition-colors" style={{ color: accent }}>
                        [verify]
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn} className="mt-8">
              <div className="text-[12px] mb-3" style={{ color: MUTED }}>$ cat skills.json</div>
              <div className="rounded-lg p-5 text-[13px] leading-relaxed" style={{ border: `1px solid ${BORDER}`, backgroundColor: PANEL }}>
                {(portfolio?.skills ?? []).length === 0 ? (
                  <span style={{ color: MUTED }}>[]</span>
                ) : (
                  <>
                    <span style={{ color: MUTED }}>[</span>
                    {portfolio!.skills.map((skill, i) => (
                      <span key={i}>
                        <span style={{ color: accent }}>"{skill}"</span>
                        {i < portfolio!.skills.length - 1 && <span style={{ color: MUTED }}>, </span>}
                      </span>
                    ))}
                    <span style={{ color: MUTED }}>]</span>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
