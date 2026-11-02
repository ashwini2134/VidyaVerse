import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Code, Award, Link as LinkIcon, Download, Pencil, Loader2,
  LayoutGrid, Settings as SettingsIcon,
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

const DISPLAY_FONT = "'Playfair Display', Georgia, serif";
const LABEL_FONT = "var(--font-mono)";
const inView = { once: true, margin: '-80px' };

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: Math.min(i * 0.08, 0.35), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function EditorialTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);

  return (
    <div
      className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] font-sans pb-20"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex } as CSSProperties}
    >
      {/* HERO */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${accentTheme.hex}, ${accentTheme.darkHex} 55%, #0D1117)`, backgroundSize: '200% 200%' }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }} />
        <CursorSpotlight color="rgba(255,255,255,0.22)" size={480} />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-16 relative z-10">
          {isOwn && (
            <div className="flex items-center justify-end gap-2 mb-10">
              <div className="inline-flex items-center gap-1 bg-white/10 border border-white/15 rounded-full p-1">
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
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        active ? 'bg-white text-[#161b22]' : 'text-[#ffffff]/80 hover:text-[#ffffff]'
                      }`}
                    >
                      <Icon size={14} /> {t.label}
                    </button>
                  );
                })}
              </div>
              <ShareLinkButton userId={displayUser?.id} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ffffff] hover:bg-white/20 transition-colors" />
              <button
                onClick={onDownloadPdf}
                disabled={downloading}
                title="Download portfolio as PDF"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ffffff] hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              </button>
            </div>
          )}

          <motion.div initial="hidden" animate="visible" custom={0} variants={revealUp} className="flex flex-col sm:flex-row items-start sm:items-end gap-7">
            <div className="relative group/avatar flex-shrink-0">
              <div className="w-[112px] h-[112px] rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/25 shadow-2xl rotate-[-3deg]">
                {(avatarPreview || displayUser?.avatarUrl) ? (
                  <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#ffffff] tracking-widest">{initials}</span>
                )}
              </div>
              {isOwn && (
                <button
                  onClick={() => setTab('settings')}
                  title="Edit profile"
                  className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white text-[#161b22] flex items-center justify-center shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                >
                  <Pencil size={13} />
                </button>
              )}
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-white/15 border border-white/20 rounded-full text-[#ffffff] text-[10px] font-bold tracking-[0.15em] uppercase mb-4" style={{ fontFamily: LABEL_FONT }}>
                VIDYAVERSE Portfolio
              </span>
              <h1
                className="text-[#ffffff] leading-[0.88] tracking-tight font-black"
                style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 'clamp(2.75rem, 8vw, 5.75rem)' }}
              >
                {displayUser?.name || 'User'}
              </h1>
              <p className="text-[#ffffff]/85 text-[15.5px] mt-3 max-w-lg">
                {displayUser?.bio || 'A living record of everything built and learned at VIDYAVERSE.'}
              </p>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={1} variants={revealUp} className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-10 pt-7 border-t border-white/15">
            {[
              ['Courses', stats?.coursesCompleted ?? 0],
              ['Problems', stats?.problemsSolved ?? 0],
              ['Projects', (stats?.milestoneProjects ?? 0) + (stats?.capstoneProjects ?? 0)],
              ['Accuracy', stats?.practiceAccuracy != null ? `${stats.practiceAccuracy}%` : '—'],
            ].map(([label, value], i) => (
              <div key={i}>
                <div className="text-[30px] font-black text-[#ffffff] leading-none tabular-nums" style={{ fontFamily: DISPLAY_FONT }}>
                  {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
                </div>
                <div className="text-[10.5px] text-[#ffffff]/70 font-bold mt-1.5 uppercase tracking-[0.12em]" style={{ fontFamily: LABEL_FONT }}>{label}</div>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-4 text-[11.5px] text-[#ffffff]/75 uppercase tracking-[0.06em]" style={{ fontFamily: LABEL_FONT }}>
              <span className="flex items-center gap-1.5"><Calendar size={13} /> {joinedDate}</span>
              {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff] flex items-center gap-1"><Code size={13} /> GitHub</a>}
              {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff] flex items-center gap-1"><Award size={13} /> LinkedIn</a>}
              {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff] flex items-center gap-1"><LinkIcon size={13} /> Site</a>}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-12">
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
                  containerClassName: 'rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-4 mb-12 flex items-center gap-4',
                }}
              />
            )}

            {stats && stats.problemsSolved > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={inView} custom={0} variants={revealUp} className="flex flex-wrap items-center gap-6 mb-12 text-sm uppercase tracking-[0.06em]" style={{ fontFamily: LABEL_FONT }}>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <span key={d} className="flex items-center gap-2 text-[var(--text-main)]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d === 'easy' ? '#22c55e' : d === 'medium' ? '#eab308' : '#ef4444' }} />
                    {d}: <span className="font-bold tabular-nums">{stats.problemsByDifficulty[d]}</span>
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div initial="hidden" whileInView="visible" viewport={inView} custom={1} variants={revealUp} className="mb-14">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-5" style={{ fontFamily: LABEL_FONT }}>GitHub Activity</h2>
              <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} hideTitle />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={inView} custom={2} variants={revealUp} className="mb-14">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]" style={{ fontFamily: LABEL_FONT }}>Projects</h2>
                <Link to="/projects" className="text-sm text-[var(--color-primary)] hover:text-blue-300 font-medium">View all →</Link>
              </div>
              <ProjectsByCategory
                projects={enrichedProjects}
                emptyMessage="No projects yet. Complete a project to see it here."
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: 'var(--text-main)',
                  mutedColor: 'var(--text-muted)',
                  borderColor: 'var(--border-light)',
                  fontFamily: DISPLAY_FONT,
                  groupClassName: 'rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-6',
                }}
              />
            </motion.div>

            {((portfolio?.experience ?? []).length + (portfolio?.education ?? []).length) > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={inView} custom={2.5} variants={revealUp} className="mb-14">
                <ExperienceEducation
                  experience={portfolio?.experience ?? []}
                  education={portfolio?.education ?? []}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: 'var(--text-main)',
                    mutedColor: 'var(--text-muted)',
                    borderColor: 'var(--border-light)',
                    fontFamily: DISPLAY_FONT,
                    headingClassName: 'text-[13px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]',
                    headingStyle: { fontFamily: LABEL_FONT },
                  }}
                />
              </motion.div>
            )}

            <motion.div initial="hidden" whileInView="visible" viewport={inView} custom={3} variants={revealUp} className="mb-14">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-5" style={{ fontFamily: LABEL_FONT }}>Certificates</h2>
              {(portfolio?.certificates ?? []).length === 0 ? (
                <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl p-8 text-center">
                  <Award size={28} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-[var(--text-muted)] text-sm">Complete a course to earn your first certificate!</p>
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-2 snap-x">
                  {portfolio!.certificates.map((cert, i) => (
                    <div key={i} className="min-w-[240px] snap-start rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-5 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: accentTheme.hex }}>
                        <Award size={22} className="text-[#ffffff]" />
                      </div>
                      <h4 className="font-bold text-[13.5px] text-[var(--text-main)]">{cert.title || courseDisplayName(cert.courseSlug)}</h4>
                      {cert.issuedAt && (
                        <p className="text-[11px] text-[var(--text-muted)] mt-1">
                          {new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </p>
                      )}
                      <button onClick={() => window.open(`/verify/${cert.certNumber}`, '_blank')} className="text-[11px] text-[var(--color-primary)] hover:underline mt-2 font-semibold">
                        Verify
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={inView} custom={4} variants={revealUp}>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-5" style={{ fontFamily: LABEL_FONT }}>Skills</h2>
              {(portfolio?.skills ?? []).length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm">Complete courses and projects to build your skill set!</p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {portfolio!.skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={inView}
                      transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      whileHover={{ scale: 1.08 }}
                      className="rounded-full text-[13px] font-bold px-4 py-2 border-2 transition-colors"
                      style={{ borderColor: accentTheme.hex, color: accentTheme.hex }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
