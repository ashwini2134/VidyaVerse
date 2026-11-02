import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Code, Award, Target, Link as LinkIcon, Download, CheckCircle2,
  BookOpen, FolderGit2, Zap, Loader2, Pencil, LayoutGrid, Settings as SettingsIcon,
} from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import AnimatedCounter from './AnimatedCounter';
import CursorSpotlight from './CursorSpotlight';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import ExperienceEducation from './ExperienceEducation';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Clash Display', 'Calistoga', var(--font-sans), sans-serif";

const cardEntrance = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, delay: Math.min(i * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const bentoCard = "bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-light)] transition-all duration-200 hover:border-[var(--color-primary)]/60 hover:shadow-[var(--shadow-sm)]";
const inView = { once: true, margin: '-60px' };

export default function BentoTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);

  return (
    <div
      className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] pb-16 font-sans"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex } as CSSProperties}
    >
      <div className="w-full h-[140px] relative overflow-hidden" style={{ background: `linear-gradient(120deg, #1E3A5F, #0D1117 70%)` }}>
        <CursorSpotlight color={`${accentTheme.hex}40`} size={360} />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <motion.div
          className="absolute -right-10 -top-10 w-52 h-52 rounded-full opacity-25 blur-2xl"
          style={{ background: accentTheme.hex }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-10 mb-6 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
            <div className="relative group/avatar">
              <div
                className="w-[78px] h-[78px] rounded-2xl bg-[var(--bg-dark-surface)] flex items-center justify-center border-[3px] border-transparent shadow-[var(--shadow-lg)] z-10 overflow-hidden rotate-[-2deg]"
                style={{ background: `linear-gradient(#1F2937, #1F2937) padding-box, linear-gradient(135deg, ${accentTheme.hex}, ${accentTheme.darkHex}) border-box` }}
              >
                {(avatarPreview || displayUser?.avatarUrl) ? (
                  <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-[var(--text-main)] tracking-widest">{initials}</span>
                )}
              </div>
              {isOwn && (
                <button
                  onClick={() => setTab('settings')}
                  title="Edit profile"
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-[#ffffff] flex items-center justify-center shadow-[var(--shadow-sm)] opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                >
                  <Pencil size={12} />
                </button>
              )}
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[26px] font-bold text-[#FFFFFF] leading-tight" style={{ fontFamily: DISPLAY_FONT }}>{displayUser?.name || 'User'}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs font-semibold rounded-full border border-[var(--border-light)] rotate-[-1.5deg]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  VIDYAVERSE Portfolio
                </span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)]">
                {displayUser?.bio || 'A living record of everything built and learned at VIDYAVERSE.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {joinedDate}</span>
              </div>
              {(displayUser?.githubUrl || displayUser?.linkedinUrl || displayUser?.portfolioUrl) && (
                <div className="flex items-center gap-4 mt-3 text-[var(--text-muted)] border-t border-[var(--border-light)]/40 pt-2.5 w-fit">
                  {displayUser?.githubUrl && (
                    <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 text-xs font-semibold">
                      <Code size={14} /> GitHub
                    </a>
                  )}
                  {displayUser?.linkedinUrl && (
                    <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 text-xs font-semibold">
                      <Award size={14} /> LinkedIn
                    </a>
                  )}
                  {displayUser?.portfolioUrl && (
                    <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 text-xs font-semibold">
                      <LinkIcon size={14} /> Personal Site
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {isOwn && (
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-full p-1">
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
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        active ? 'bg-[var(--color-primary)] text-[#ffffff]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Icon size={14} /> {t.label}
                    </button>
                  );
                })}
              </div>
              <ShareLinkButton userId={displayUser?.id} />
              <button
                onClick={onDownloadPdf}
                disabled={downloading}
                title="Download portfolio as PDF"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/60 transition-colors disabled:opacity-50"
              >
                {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              </button>
            </div>
          )}
        </div>

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
                  containerClassName: `${bentoCard} p-4 mb-6 flex items-center gap-4`,
                }}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Courses Completed', value: stats?.coursesCompleted ?? 0, icon: BookOpen },
                { label: 'Problems Solved', value: stats?.problemsSolved ?? 0, icon: Target },
                { label: 'Projects Built', value: (stats?.milestoneProjects ?? 0) + (stats?.capstoneProjects ?? 0), icon: FolderGit2 },
                { label: 'Practice Accuracy', value: stats?.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—', icon: CheckCircle2 },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i} custom={i} initial="hidden" animate="visible" variants={cardEntrance}
                    className={`${bentoCard} p-5 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-0.5`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentTheme.hex }} />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[32px] font-bold text-[var(--text-main)] leading-none tabular-nums" style={{ fontFamily: DISPLAY_FONT }}>
                        {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}
                      </span>
                      <div className="p-2 rounded-lg bg-[var(--color-brand-navy)] group-hover:bg-[var(--color-primary)] text-[#ffffff] border-2 border-white/80 shadow-sm transition-colors duration-200">
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="text-[13px] text-[var(--text-muted)] font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {stats && stats.problemsSolved > 0 && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={inView} transition={{ delay: 0.1 }} className={`${bentoCard} p-5 mb-6 flex flex-wrap items-center gap-6`}>
                <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Problems by difficulty</span>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <span key={d} className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d === 'easy' ? '#22c55e' : d === 'medium' ? '#eab308' : '#ef4444' }} />
                    {d.charAt(0).toUpperCase() + d.slice(1)}: <span className="font-semibold tabular-nums">{stats.problemsByDifficulty[d]}</span>
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} className="mb-6">
              <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} />
            </motion.div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-[var(--text-main)]" style={{ fontFamily: DISPLAY_FONT }}>Projects</h2>
                <Link to="/projects" className="text-sm text-[var(--color-primary)] hover:text-blue-300">Browse project catalog →</Link>
              </div>
              <ProjectsByCategory
                projects={enrichedProjects}
                emptyMessage="No projects yet. Complete a project to see it here."
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: 'var(--text-main)',
                  mutedColor: 'var(--text-muted)',
                  borderColor: 'var(--border-light)',
                  groupClassName: `${bentoCard} p-5`,
                }}
              />
            </div>

            {(portfolio?.experience ?? []).length + (portfolio?.education ?? []).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} className={`${bentoCard} p-6 mb-6`}>
                <ExperienceEducation
                  experience={portfolio?.experience ?? []}
                  education={portfolio?.education ?? []}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: 'var(--text-main)',
                    mutedColor: 'var(--text-muted)',
                    borderColor: 'var(--border-light)',
                    headingClassName: 'text-[15px] font-bold text-[var(--text-main)]',
                    headingStyle: { fontFamily: DISPLAY_FONT },
                  }}
                />
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} className={`${bentoCard} p-6`}>
                <h2 className="text-[18px] font-bold text-[var(--text-main)] mb-5" style={{ fontFamily: DISPLAY_FONT }}>Certificates Earned</h2>
                {(portfolio?.certificates ?? []).length === 0 ? (
                  <div className="text-center py-8">
                    <Award size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-[var(--text-muted)] text-sm">Complete a course to earn your first certificate!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolio!.certificates.map((cert, i) => (
                      <div key={i} className="relative bg-[var(--bg-body)] rounded-[8px] border border-[var(--border-light)] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-[var(--shadow-sm)]">
                            <Award size={20} className="text-[#ffffff]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[14px] text-[var(--text-main)]">{cert.title || courseDisplayName(cert.courseSlug)}</h4>
                            <p className="text-[12px] text-[var(--text-muted)]">
                              {cert.issuedAt
                                ? `Issued: ${new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                : 'Issued'}
                            </p>
                          </div>
                        </div>
                        <button
                          className="p-2 border border-[var(--border-light)] rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                          title="View certificate"
                          onClick={() => window.open(`/verify/${cert.certNumber}`, '_blank')}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ delay: 0.08 }} className={`${bentoCard} p-6`}>
                <h2 className="text-[18px] font-bold text-[var(--text-main)] mb-5" style={{ fontFamily: DISPLAY_FONT }}>Skills</h2>
                {(portfolio?.skills ?? []).length === 0 ? (
                  <div className="text-center py-8">
                    <Zap size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-[var(--text-muted)] text-sm">Complete courses and projects to build your skill set!</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {portfolio!.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={inView}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        whileHover={{ scale: 1.06 }}
                        className="bg-[var(--bg-dark-surface)] border border-[var(--border-light)] rounded-[20px] text-[var(--text-main)] text-[13px] font-medium px-4 py-1.5"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
