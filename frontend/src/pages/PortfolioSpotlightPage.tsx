import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';
import { authFetch } from '../authClient';
import LiveTemplatePreview from '../components/portfolio/templates/LiveTemplatePreview';
import type { TemplateComponentId } from '../components/portfolio/templates/registry';
import { accentThemeFor, type DisplayUser, type PortfolioData, type PortfolioStats, type TemplateProps } from '../components/portfolio/templates/types';
import type { GithubActivityResponse } from '../components/portfolio/GitHubContributionChart';
import type { SettingsPanelProps } from '../components/portfolio/SettingsPanel';

interface SpotlightEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  bio: string;
  portfolioTemplate: string;
  profileTheme: string;
  completenessScore: number;
  monthlyXp: number;
  totalScore: number;
}

// Never actually rendered — spotlight cards are read-only previews of other
// students' portfolios (isOwn is always false, tab is always 'overview'),
// but TemplateProps still requires a well-typed settingsProps to satisfy
// the shared template contract.
const NOOP_SETTINGS_PROPS: SettingsPanelProps = {
  settingsSection: 'profileInfo', setSettingsSection: () => {},
  initials: '', avatarPreview: null,
  fileInputRef: { current: null }, onAvatarChange: () => {}, onRemoveAvatar: () => {},
  formName: '', setFormName: () => {}, formBio: '', setFormBio: () => {},
  formGithubUrl: '', setFormGithubUrl: () => {}, formLinkedinUrl: '', setFormLinkedinUrl: () => {},
  formPortfolioUrl: '', setFormPortfolioUrl: () => {}, formProfileVisibility: 'public', setFormProfileVisibility: () => {},
  formProfileTheme: 'default', setFormProfileTheme: () => {}, formPortfolioTemplate: 'bento', setFormPortfolioTemplate: () => {},
  onBrowseTemplates: () => {}, saving: false, onSaveProfile: () => {},
  passwordForm: { current: '', newPass: '', confirm: '' }, setPasswordForm: () => {},
  passwordError: '', showPassword: false, setShowPassword: () => {}, changingPassword: false, onChangePassword: () => {},
  notifPrefs: {}, setNotifPrefs: () => {}, defaultNotifPrefs: {}, notifSaving: false, onSaveNotificationPrefs: () => {},
  formExperience: [], setFormExperience: () => {}, formEducation: [], setFormEducation: () => {},
  formServices: [], setFormServices: () => {}, formTestimonials: [], setFormTestimonials: () => {},
  portfolioContentSaving: false, onSavePortfolioContent: () => {},
};

function getInitials(name?: string): string {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
}

function SpotlightCard({ entry, previewProps }: { entry: SpotlightEntry; previewProps: TemplateProps | null }) {
  const rankColor = entry.rank === 1 ? '#F5B700' : entry.rank === 2 ? '#B8C0C8' : entry.rank === 3 ? '#C97A3D' : 'var(--text-muted)';
  const navigate = useNavigate();
  return (
    // A <div> with a click handler, not <Link>/<a> — the live preview below
    // renders the student's actual template, which itself contains real
    // <a> tags (GitHub, project links); nesting those inside an anchor is
    // invalid HTML and breaks hydration.
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/portfolio/${entry.userId}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/portfolio/${entry.userId}`); }}
      className="group block cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: Math.min(entry.rank * 0.04, 0.3) }}
        className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] overflow-hidden transition-all duration-200 group-hover:border-[var(--color-primary)]/60 group-hover:shadow-[var(--shadow-lg)] group-hover:-translate-y-1"
      >
        <div className="relative">
          <span
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black text-white shadow-md"
            style={{ backgroundColor: rankColor }}
          >
            {entry.rank}
          </span>
          {previewProps ? (
            <LiveTemplatePreview templateId={entry.portfolioTemplate as TemplateComponentId} previewProps={previewProps} />
          ) : (
            <div className="h-[180px] bg-[var(--bg-dark-surface)] animate-pulse" />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--bg-dark-surface)] flex items-center justify-center flex-shrink-0">
              {entry.avatarUrl ? <img src={entry.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-[var(--text-main)]">{getInitials(entry.name)}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-[var(--text-main)] truncate">{entry.name}</p>
              {entry.bio && <p className="text-[11.5px] text-[var(--text-muted)] truncate">{entry.bio}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[var(--text-muted)]">
            <Flame size={12} style={{ color: 'var(--color-primary)' }} />
            {entry.monthlyXp.toLocaleString()} XP this month
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PortfolioSpotlightPage() {
  const [entries, setEntries] = useState<SpotlightEntry[]>([]);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState<Record<string, TemplateProps>>({});

  useEffect(() => {
    document.title = 'VIDYAVERSE Portfolio Spotlight';
    return () => { document.title = 'VIDYAVERSE — Bridge Your Learning. Build Your Future.'; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await authFetch<{ month: string; entries: SpotlightEntry[] }>('/portfolio/spotlight');
        if (cancelled) return;
        setEntries(data.entries);
        setMonth(data.month);

        const results = await Promise.all(
          data.entries.map(async (entry) => {
            try {
              const detail = await authFetch<{
                user: DisplayUser; portfolio: PortfolioData; stats: PortfolioStats; github: GithubActivityResponse;
              }>(`/portfolio/public/${entry.userId}`);
              const accentTheme = accentThemeFor(detail.user.profileTheme);
              const props: TemplateProps = {
                displayUser: detail.user, stats: detail.stats, portfolio: detail.portfolio,
                enrichedProjects: (detail.portfolio.projects ?? []).map((p) => ({ ...p, name: p.title ?? p.projectId, techStack: '' })),
                githubActivity: detail.github, accentTheme,
                isOwn: false, initials: getInitials(detail.user.name), joinedDate: detail.user.createdAt ? new Date(detail.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '',
                loading: false, avatarPreview: null,
                tab: 'overview', setTab: () => {}, downloading: false, onDownloadPdf: () => {},
                settingsProps: NOOP_SETTINGS_PROPS,
              };
              return [entry.userId, props] as const;
            } catch {
              return null;
            }
          })
        );
        if (cancelled) return;
        setPreviews(Object.fromEntries(results.filter((r): r is readonly [string, TemplateProps] => r !== null)));
      } catch (err) {
        console.error('Failed to load spotlight', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const monthLabel = month ? new Date(`${month}-01T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between gap-4 mb-1 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-[var(--color-primary)]" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Portfolio Spotlight</h1>
            <p className="text-[13px] text-[var(--text-muted)]">The 10 best student portfolios for {monthLabel || 'this month'} — ranked by completeness and monthly activity.</p>
          </div>
        </div>
        <Link
          to="/settings"
          className="flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#ffffff] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Improve my portfolio →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[260px] rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-light)] animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface)] p-10 text-center">
          <p className="text-[var(--text-muted)] text-sm">Nobody has qualified yet this month — fill out your portfolio and stay active to be first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {entries.map((entry) => (
            <SpotlightCard key={entry.userId} entry={entry} previewProps={previews[entry.userId] ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}
