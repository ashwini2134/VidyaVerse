import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Code, Award, Globe, Download, Pencil, Loader2, Briefcase, GraduationCap, FolderGit2, BadgeCheck } from 'lucide-react';
import GitHubContributionChart from '../GitHubContributionChart';
import SettingsPanel from '../SettingsPanel';
import AnimatedCounter from './AnimatedCounter';
import ProjectsByCategory from './ProjectsByCategory';
import ShareLinkButton from './ShareLinkButton';
import CompletenessNudge from './CompletenessNudge';
import { computeCompleteness } from './completeness';
import { courseDisplayName, type TemplateProps } from './types';

const DISPLAY_FONT = "'Calistoga', var(--font-sans), serif";

type Node = {
  key: string;
  sortKey: number;
  dateLabel: string;
  icon: typeof Briefcase;
  title: string;
  subtitle?: string;
  description?: string;
  action?: { label: string; onClick: () => void } | { label: string; href: string };
};

function safeParse(dateStr: string | undefined | null): number {
  if (!dateStr) return 0;
  const t = Date.parse(dateStr);
  return Number.isNaN(t) ? 0 : t;
}

export default function JourneyTemplate(props: TemplateProps) {
  const {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn, initials, joinedDate, loading, avatarPreview,
    tab, setTab, downloading, onDownloadPdf, settingsProps,
  } = props;

  const completeness = computeCompleteness(displayUser, portfolio);
  const experience = portfolio?.experience ?? [];
  const education = portfolio?.education ?? [];

  const nodes: Node[] = [
    ...experience.map((e): Node => ({
      key: `exp-${e.id}`,
      sortKey: safeParse(e.current ? new Date().toISOString() : e.endDate) || safeParse(e.startDate),
      dateLabel: `${e.startDate} – ${e.current ? 'Present' : e.endDate}`,
      icon: Briefcase,
      title: e.role,
      subtitle: e.company,
      description: e.description,
    })),
    ...education.map((e): Node => ({
      key: `edu-${e.id}`,
      sortKey: safeParse(e.endDate) || safeParse(e.startDate),
      dateLabel: `${e.startDate} – ${e.endDate}`,
      icon: GraduationCap,
      title: e.institution,
      subtitle: [e.degree, e.field].filter(Boolean).join(', '),
      description: e.description,
    })),
    ...enrichedProjects.filter((p) => p.completedAt).map((p): Node => ({
      key: `proj-${p.projectId}`,
      sortKey: safeParse(p.completedAt),
      dateLabel: new Date(p.completedAt as string).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      icon: FolderGit2,
      title: p.name,
      subtitle: p.techStack || undefined,
      action: p.githubUrl ? { label: 'View code', href: p.githubUrl } : undefined,
    })),
    ...(portfolio?.certificates ?? []).filter((c) => c.issuedAt).map((c): Node => ({
      key: `cert-${c.certNumber}`,
      sortKey: safeParse(c.issuedAt),
      dateLabel: new Date(c.issuedAt as string).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      icon: BadgeCheck,
      title: c.title || courseDisplayName(c.courseSlug),
      subtitle: 'Certificate earned',
    })),
  ].sort((a, b) => b.sortKey - a.sortKey);

  return (
    <div
      className="min-h-screen bg-[#EFF4EC] text-[#241F1A] pb-20"
      style={{ '--color-primary': accentTheme.hex, '--color-primary-dark': accentTheme.darkHex, fontFamily: 'var(--font-sans)' } as CSSProperties}
    >
      <div className="max-w-2xl mx-auto px-6 pt-14">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#DFE8DC] flex items-center justify-center flex-shrink-0 border-2 border-[#241F1A]/10">
              {(avatarPreview || displayUser?.avatarUrl) ? (
                <img src={avatarPreview || displayUser?.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-base font-bold">{initials}</span>
              )}
            </div>
            <div>
              <h1 className="text-[26px] font-bold tracking-tight" style={{ fontFamily: DISPLAY_FONT }}>{displayUser?.name || 'User'}'s Journey</h1>
              <p className="text-[12.5px] text-[#8A8069] mt-0.5">Started at VIDYAVERSE · {joinedDate}</p>
            </div>
          </div>
          {isOwn && (
            <div className="flex items-center gap-3 text-[12px] font-medium flex-shrink-0">
              <button onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')} className="flex items-center gap-1.5 text-[#8A8069] hover:text-[#241F1A] transition-colors">
                <Pencil size={12} /> {tab === 'settings' ? 'View' : 'Edit'}
              </button>
              <button onClick={onDownloadPdf} disabled={downloading} className="flex items-center gap-1.5 text-[#8A8069] hover:text-[#241F1A] transition-colors disabled:opacity-50">
                {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} PDF
              </button>
              <ShareLinkButton userId={displayUser?.id} label iconSize={12} className="flex items-center gap-1.5 text-[#8A8069] hover:text-[#241F1A] transition-colors" />
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
            {isOwn && (
              <CompletenessNudge
                completeness={completeness}
                onComplete={() => setTab('settings')}
                theme={{
                  accentHex: accentTheme.hex,
                  textColor: '#241F1A',
                  mutedColor: '#8A8069',
                  containerClassName: 'bg-white rounded-2xl border border-[#241F1A]/10 p-4 mt-6 flex items-center gap-4',
                }}
              />
            )}

            {displayUser?.bio && <p className="text-[14.5px] text-[#4A4436] leading-relaxed mt-6 max-w-lg">{displayUser.bio}</p>}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-[12px] text-[#8A8069]">
              {displayUser?.githubUrl && <a href={displayUser.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"><Code size={12} /> GitHub</a>}
              {displayUser?.linkedinUrl && <a href={displayUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"><Award size={12} /> LinkedIn</a>}
              {displayUser?.portfolioUrl && <a href={displayUser.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"><Globe size={12} /> Site</a>}
            </div>

            {stats && (
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8 pt-6 border-t border-[#241F1A]/10">
                {[
                  ['Problems Solved', stats.problemsSolved],
                  ['Projects Built', stats.milestoneProjects + stats.capstoneProjects],
                  ['Courses Completed', stats.coursesCompleted],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div className="text-[24px] font-bold" style={{ fontFamily: DISPLAY_FONT, color: accentTheme.hex }}>
                      <AnimatedCounter value={value} />
                    </div>
                    <div className="text-[11px] text-[#8A8069] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline */}
            <div className="mt-12 relative">
              {nodes.length === 0 ? (
                <p className="text-[13.5px] text-[#8A8069] italic">Nothing recorded yet — add experience, education, or complete a project to start your journey.</p>
              ) : (
                <div className="relative pl-8">
                  <div className="absolute left-[13px] top-2 bottom-2 w-px bg-[#241F1A]/15" />
                  <div className="space-y-8">
                    {nodes.map((n) => {
                      const Icon = n.icon;
                      return (
                        <motion.div key={n.key} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} className="relative">
                          <div
                            className="absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#EFF4EC]"
                            style={{ backgroundColor: accentTheme.hex }}
                          >
                            <Icon size={13} className="text-[#ffffff]" />
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.08em] text-[#8A8069] mb-1">{n.dateLabel}</div>
                          <h3 className="text-[16px] font-bold" style={{ fontFamily: DISPLAY_FONT }}>{n.title}</h3>
                          {n.subtitle && <p className="text-[13px] text-[#6B6350] mt-0.5">{n.subtitle}</p>}
                          {n.description && <p className="text-[13px] text-[#4A4436] leading-relaxed mt-1.5">{n.description}</p>}
                          {n.action && 'href' in n.action && (
                            <a href={n.action.href} target="_blank" rel="noreferrer" className="text-[12px] font-semibold mt-1.5 inline-block hover:underline" style={{ color: accentTheme.hex }}>{n.action.label}</a>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {enrichedProjects.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#241F1A]/10">
                <h2 className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#8A8069] mb-3">Projects by Category</h2>
                <ProjectsByCategory
                  projects={enrichedProjects}
                  theme={{
                    accentHex: accentTheme.hex,
                    textColor: '#241F1A',
                    mutedColor: '#8A8069',
                    borderColor: 'rgba(36,31,26,0.1)',
                    fontFamily: DISPLAY_FONT,
                    groupClassName: 'bg-white rounded-2xl border border-[#241F1A]/10 p-5',
                  }}
                />
              </div>
            )}

            {(portfolio?.skills ?? []).length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#241F1A]/10">
                <h2 className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#8A8069] mb-3">Skills Picked Up Along the Way</h2>
                <div className="flex flex-wrap gap-2">
                  {portfolio!.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-[#241F1A]/10 text-[12.5px] font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#8A8069] mb-3">GitHub Activity</h2>
              <GitHubContributionChart data={githubActivity} loading={loading} isOwn={isOwn} hideTitle />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
