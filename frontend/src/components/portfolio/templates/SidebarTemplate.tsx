import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Code, Award, Target, Link as LinkIcon, Download, CheckCircle2,
  BookOpen, FolderGit2, Loader2, Pencil, LayoutGrid, Settings as SettingsIcon,
} from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import AnimatedCounter from './AnimatedCounter';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import ExperienceEducation from './ExperienceEducation';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Space Grotesk', var(--font-sans)";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: Math.min(i * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const hardCard = "bg-[var(--bg-surface)] border-[3px] border-[var(--text-main)] transition-transform duration-150";
const hardShadow = { boxShadow: '5px 5px 0 var(--text-main)' };

export default function SidebarTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);

  const statRows = [
    { label: 'Courses', value: stats?.coursesCompleted ?? 0, icon: BookOpen },
    { label: 'Problems', value: stats?.problemsSolved ?? 0, icon: Target },
    { label: 'Projects', value: (stats?.milestoneProjects ?? 0) + (stats?.capstoneProjects ?? 0), icon: FolderGit2 },
    { label: 'Accuracy', value: stats?.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—', icon: CheckCircle2 },
  ];

  return (
    <div
      className="min-h-screen text-[var(--text-main)] font-sans flex flex-col lg:flex-row"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex, background: '#FAF6ED' } as CSSProperties}
    >
      {/* SIDEBAR */}
      <aside className="w-full lg:w-72 flex-shrink-0 bg-[var(--bg-surface)] border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-[var(--text-main)] lg:min-h-screen lg:sticky lg:top-0 lg:self-start px-6 py-8 flex flex-col items-center text-center">
        <div className="relative group/avatar">
          <div
            className="w-24 h-24 bg-[var(--bg-dark-surface)] flex items-center justify-center overflow-hidden border-[3px] border-[var(--text-main)] rotate-[-2deg]"
            style={{ background: `linear-gradient(#1F2937, #1F2937) padding-box, linear-gradient(135deg, ${accentTheme.hex}, ${accentTheme.darkHex}) border-box`, boxShadow: '4px 4px 0 var(--text-main)' }}
          >
            {(avatarPreview || displayUser?.avatarUrl) ? (
              <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-[#ffffff] tracking-widest">{initials}</span>
            )}
          </div>
          {isOwn && (
            <button
              onClick={() => setTab('settings')}
              title="Edit profile"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--color-primary)] text-[#ffffff] border-2 border-[var(--text-main)] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
            >
              <Pencil size={13} />
            </button>
          )}
        </div>

        <h1 className="text-[21px] font-bold text-[var(--text-main)] mt-5" style={{ fontFamily: DISPLAY_FONT }}>{displayUser?.name || 'User'}</h1>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-[#ffffff] text-[10.5px] font-bold uppercase tracking-wide rotate-[1deg]"
          style={{ backgroundColor: accentTheme.hex, border: '2px solid var(--text-main)' }}
        >
          VIDYAVERSE Portfolio
        </span>
        <p className="text-[12.5px] text-[var(--text-secondary)] mt-3 leading-relaxed">
          {displayUser?.bio || 'A living record of everything built and learned at VIDYAVERSE.'}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-3">
          <Calendar size={12} /> Joined {joinedDate}
        </p>

        {(displayUser?.githubUrl || displayUser?.linkedinUrl || displayUser?.portfolioUrl) && (
          <div className="flex items-center gap-3 mt-3">
            {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border-2 border-[var(--text-main)] bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--color-primary)] hover:text-[#ffffff] transition-colors"><Code size={14} /></a>}
            {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border-2 border-[var(--text-main)] bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--color-primary)] hover:text-[#ffffff] transition-colors"><Award size={14} /></a>}
            {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border-2 border-[var(--text-main)] bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--color-primary)] hover:text-[#ffffff] transition-colors"><LinkIcon size={14} /></a>}
          </div>
        )}

        <div className="w-full h-[3px] bg-[var(--text-main)] my-6" />

        <div className="w-full space-y-2">
          {statRows.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center justify-between text-left px-3 py-2 border-2 border-[var(--text-main)] bg-[var(--bg-body)]">
                <span className="flex items-center gap-2 text-[11.5px] font-semibold text-[var(--text-secondary)]"><Icon size={13} /> {s.label}</span>
                <span className="text-[15px] font-bold text-[var(--text-main)] tabular-nums" style={{ fontFamily: DISPLAY_FONT }}>
                  {typeof s.value === 'number' ? <AnimatedCounter value={s.value} /> : s.value}
                </span>
              </div>
            );
          })}
        </div>

        {isOwn && (
          <>
            <div className="w-full h-[3px] bg-[var(--text-main)] my-6" />
            <div className="w-full space-y-2">
              {([
                { id: 'overview' as const, label: 'Overview', icon: LayoutGrid },
                { id: 'settings' as const, label: 'Settings', icon: SettingsIcon },
              ]).map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 border-2 border-[var(--text-main)] text-[13px] font-bold transition-colors ${
                      active ? 'text-[#ffffff]' : 'bg-[var(--bg-body)] text-[var(--text-main)] hover:bg-[var(--bg-dark-surface)]'
                    }`}
                    style={active ? { backgroundColor: accentTheme.hex } : undefined}
                  >
                    <Icon size={14} /> {t.label}
                  </button>
                );
              })}
              <button
                onClick={onDownloadPdf}
                disabled={downloading}
                className="w-full flex items-center gap-2 px-3 py-2.5 border-2 border-[var(--text-main)] bg-[var(--bg-body)] text-[13px] font-bold text-[var(--text-main)] hover:bg-[var(--bg-dark-surface)] transition-colors disabled:opacity-50"
              >
                {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Download PDF
              </button>
              <ShareLinkButton
                userId={displayUser?.id}
                label
                iconSize={14}
                className="w-full flex items-center gap-2 px-3 py-2.5 border-2 border-[var(--text-main)] bg-[var(--bg-body)] text-[13px] font-bold text-[var(--text-main)] hover:bg-[var(--bg-dark-surface)] transition-colors"
              />
            </div>
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-8 lg:px-12 lg:py-12 max-w-4xl">
        {isOwn && tab === 'settings' ? (
          <SettingsPanel {...settingsProps} />
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
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
                  containerClassName: `${hardCard} p-4 mb-7 flex items-center gap-4`,
                  containerStyle: hardShadow,
                }}
              />
            )}

            {stats && stats.problemsSolved > 0 && (
              <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn} className={`${hardCard} p-4 mb-7 flex flex-wrap items-center gap-6`} style={hardShadow}>
                <span className="text-[12.5px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">Problems by difficulty</span>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <span key={d} className="flex items-center gap-2 text-[13px] text-[var(--text-main)] font-semibold">
                    <span className="w-2.5 h-2.5 border border-[var(--text-main)]" style={{ backgroundColor: d === 'easy' ? '#22c55e' : d === 'medium' ? '#eab308' : '#ef4444' }} />
                    {d.charAt(0).toUpperCase() + d.slice(1)}: <span className="tabular-nums">{stats.problemsByDifficulty[d]}</span>
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn} className="mb-7">
              <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} />
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn} className="mb-7">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-[var(--text-main)]" style={{ fontFamily: DISPLAY_FONT }}>Projects</h2>
                <Link to="/projects" className="text-[13px] font-semibold text-[var(--color-primary)] hover:underline">View all →</Link>
              </div>
              <ProjectsByCategory
                projects={enrichedProjects}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: 'var(--text-main)',
                  mutedColor: 'var(--text-muted)',
                  borderColor: 'var(--border-light)',
                  fontFamily: DISPLAY_FONT,
                  groupClassName: `${hardCard} p-4`,
                  groupStyle: hardShadow,
                }}
              />
            </motion.div>

            {((portfolio?.experience ?? []).length + (portfolio?.education ?? []).length) > 0 && (
              <motion.div initial="hidden" animate="visible" custom={2.5} variants={fadeIn} className={`${hardCard} p-5 mb-7`} style={hardShadow}>
                <ExperienceEducation
                  experience={portfolio?.experience ?? []}
                  education={portfolio?.education ?? []}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: 'var(--text-main)',
                    mutedColor: 'var(--text-muted)',
                    borderColor: 'var(--border-light)',
                    fontFamily: DISPLAY_FONT,
                    headingClassName: 'text-[15px] font-bold text-[var(--text-main)]',
                    headingStyle: { fontFamily: DISPLAY_FONT },
                  }}
                />
              </motion.div>
            )}

            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
              <div className={`${hardCard} p-5`} style={hardShadow}>
                <h2 className="text-[15px] font-bold text-[var(--text-main)] mb-4" style={{ fontFamily: DISPLAY_FONT }}>Certificates</h2>
                {(portfolio?.certificates ?? []).length === 0 ? (
                  <p className="text-[12.5px] text-[var(--text-muted)]">None yet.</p>
                ) : (
                  <div className="space-y-3">
                    {portfolio!.certificates.map((cert, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 border-2 border-[var(--text-main)]" style={{ backgroundColor: accentTheme.hex }}>
                          <Award size={13} className="text-[#ffffff]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-bold text-[var(--text-main)] truncate">{cert.title || courseDisplayName(cert.courseSlug)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={`${hardCard} p-5`} style={hardShadow}>
                <h2 className="text-[15px] font-bold text-[var(--text-main)] mb-4" style={{ fontFamily: DISPLAY_FONT }}>Skills</h2>
                {(portfolio?.skills ?? []).length === 0 ? (
                  <p className="text-[12.5px] text-[var(--text-muted)]">None yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {portfolio!.skills.map((skill, i) => (
                      <span key={i} className="bg-[var(--bg-dark-surface)] border border-[var(--text-main)] text-[var(--text-main)] text-[11px] font-semibold px-2.5 py-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
