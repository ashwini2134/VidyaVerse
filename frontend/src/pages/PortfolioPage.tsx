import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../auth';
import { authApi, authFetch, authFetchBlob } from '../authClient';
import { projectsData } from '../data/projectsData';
import type { GithubActivityResponse } from '../components/portfolio/GitHubContributionChart';
import type { SettingsPanelProps } from '../components/portfolio/SettingsPanel';
import TemplateGallery from '../components/portfolio/TemplateGallery';
import { TEMPLATE_COMPONENTS, type TemplateComponentId } from '../components/portfolio/templates/registry';
import { accentThemeFor, type DisplayUser, type PortfolioData, type PortfolioStats, type TemplateProps, type ExperienceEntry, type EducationEntry, type ServiceEntry, type TestimonialEntry } from '../components/portfolio/templates/types';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function PortfolioPage() {
  const { userId } = useParams<{ userId?: string }>();
  const { user, checkAuth } = useAuth();
  const location = useLocation();
  const isOwn = !userId;

  const [tab, setTab] = useState<'overview' | 'settings'>(
    isOwn && location.pathname === '/settings' ? 'settings' : 'overview'
  );
  useEffect(() => {
    if (isOwn) setTab(location.pathname === '/settings' ? 'settings' : 'overview');
  }, [location.pathname, isOwn]);

  const [displayUser, setDisplayUser] = useState<DisplayUser | null>(isOwn ? user : null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [githubActivity, setGithubActivity] = useState<GithubActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Dedicated landing page identity — visible in the browser tab regardless
  // of which of the 10 templates is active, and regardless of entry point
  // (Shell sidebar nav or the Dashboard header button both route here).
  useEffect(() => {
    const previousTitle = document.title;
    document.title = displayUser?.name ? `VIDYAVERSE Portfolio — ${displayUser.name}` : 'VIDYAVERSE Portfolio';
    return () => { document.title = previousTitle; };
  }, [displayUser?.name]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (isOwn) {
          await authFetch('/portfolio/sync', { method: 'POST' }).catch(() => {});
          const [pf, st, gh] = await Promise.all([
            authFetch<PortfolioData>('/portfolio'),
            authFetch<PortfolioStats>('/portfolio/stats'),
            authFetch<GithubActivityResponse>('/portfolio/github-activity'),
          ]);
          if (cancelled) return;
          setPortfolio(pf);
          setStats(st);
          setGithubActivity(gh);
        } else {
          const data = await authFetch<{
            user: DisplayUser;
            portfolio: PortfolioData;
            stats: PortfolioStats;
            github: GithubActivityResponse;
          }>(`/portfolio/public/${userId}`);
          if (cancelled) return;
          setDisplayUser(data.user);
          setPortfolio(data.portfolio);
          setStats(data.stats);
          setGithubActivity(data.github);
        }
      } catch (err) {
        console.error('Failed to load portfolio', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId, isOwn]);

  useEffect(() => {
    if (isOwn && user) setDisplayUser(user);
  }, [user, isOwn]);

  const enrichedProjects = useMemo(() => {
    return (portfolio?.projects ?? [])
      .filter((p) => Boolean(p.completedAt))
      .map((p) => {
        const matched = projectsData.find((d) => d.id === p.projectId);
        return {
          ...p,
          name: matched?.title ?? p.title ?? p.projectId,
          techStack: matched?.technologies?.join(', ') ?? '',
          difficulty: matched?.difficulty,
          category: matched?.category,
        };
      });
  }, [portfolio]);

  // ── Settings form state (own profile only) ──
  const [formName, setFormName] = useState(user?.name || '');
  const [formBio, setFormBio] = useState(user?.bio || '');
  const [formGithubUrl, setFormGithubUrl] = useState(user?.githubUrl || '');
  const [formLinkedinUrl, setFormLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [formPortfolioUrl, setFormPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [formProfileVisibility, setFormProfileVisibility] = useState(user?.profileVisibility || 'public');
  const [formProfileTheme, setFormProfileTheme] = useState(user?.profileTheme || 'default');
  const [formPortfolioTemplate, setFormPortfolioTemplate] = useState(user?.portfolioTemplate || 'bento');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settingsSection, setSettingsSection] = useState<'profileInfo' | 'password' | 'notifications' | 'portfolioContent'>('profileInfo');

  // ── Portfolio content (Experience / Education / Services / Testimonials) ──
  const [formExperience, setFormExperience] = useState<ExperienceEntry[]>([]);
  const [formEducation, setFormEducation] = useState<EducationEntry[]>([]);
  const [formServices, setFormServices] = useState<ServiceEntry[]>([]);
  const [formTestimonials, setFormTestimonials] = useState<TestimonialEntry[]>([]);
  const [portfolioContentSaving, setPortfolioContentSaving] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setFormExperience(portfolio.experience ?? []);
      setFormEducation(portfolio.education ?? []);
      setFormServices(portfolio.services ?? []);
      setFormTestimonials(portfolio.testimonials ?? []);
    }
  }, [portfolio]);

  const handleSavePortfolioContent = async () => {
    setPortfolioContentSaving(true);
    try {
      const updated = await authFetch<PortfolioData>('/portfolio', {
        method: 'PATCH',
        body: JSON.stringify({
          experience: formExperience,
          education: formEducation,
          services: formServices,
          testimonials: formTestimonials,
        }),
      });
      setPortfolio(updated);
      showToast('success', 'Portfolio content saved!');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save portfolio content.');
    } finally {
      setPortfolioContentSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormName(user.name || '');
      setFormBio(user.bio || '');
      setFormGithubUrl(user.githubUrl || '');
      setFormLinkedinUrl(user.linkedinUrl || '');
      setFormPortfolioUrl(user.portfolioUrl || '');
      setFormProfileVisibility(user.profileVisibility || 'public');
      setFormProfileTheme(user.profileTheme || 'default');
      setFormPortfolioTemplate(user.portfolioTemplate || 'bento');
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const defaultNotifPrefs = {
    emailCourseUpdates: true,
    emailDeadlines: true,
    emailQuizResults: true,
    emailAchievements: true,
    emailStreakReminders: true,
    inAppMessages: true,
    inAppProjectReviews: true,
    inAppDailyMissions: true,
  };
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(defaultNotifPrefs);
  const [notifSaving, setNotifSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (isOwn && tab === 'settings' && settingsSection === 'notifications') {
      authApi.getNotificationPrefs().then((data) => setNotifPrefs(data.prefs)).catch(() => {});
    }
  }, [isOwn, tab, settingsSection]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Image must be under 2MB.');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload: { name?: string; bio?: string; avatarUrl?: string; githubUrl?: string; linkedinUrl?: string; portfolioUrl?: string; profileVisibility?: string; profileTheme?: string; portfolioTemplate?: string } = {};
      if (formName !== user?.name) payload.name = formName;
      if (formBio !== user?.bio) payload.bio = formBio;
      if (avatarPreview && avatarFile) payload.avatarUrl = avatarPreview;
      if (formGithubUrl !== user?.githubUrl) payload.githubUrl = formGithubUrl;
      if (formLinkedinUrl !== user?.linkedinUrl) payload.linkedinUrl = formLinkedinUrl;
      if (formPortfolioUrl !== user?.portfolioUrl) payload.portfolioUrl = formPortfolioUrl;
      if (formProfileVisibility !== user?.profileVisibility) payload.profileVisibility = formProfileVisibility;
      if (formProfileTheme !== user?.profileTheme) payload.profileTheme = formProfileTheme;
      if (formPortfolioTemplate !== user?.portfolioTemplate) payload.portfolioTemplate = formPortfolioTemplate;

      await authApi.updateProfile(payload);
      await checkAuth();
      showToast('success', 'Profile updated successfully!');
      setAvatarFile(null);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  // Scoped save for the template gallery's "Apply" button — persists only
  // portfolioTemplate, independent of whatever else might be mid-edit in
  // the rest of the Settings form, so picking a template never silently
  // saves unrelated unsaved changes.
  const handleApplyTemplate = async (id: string) => {
    try {
      await authApi.updateProfile({ portfolioTemplate: id });
      await checkAuth();
      setFormPortfolioTemplate(id);
      showToast('success', 'Template applied!');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to apply template.');
      throw err;
    }
  };

  const handleSaveNotificationPrefs = async () => {
    setNotifSaving(true);
    try {
      await authApi.updateProfile({ notificationPrefs: notifPrefs });
      showToast('success', 'Notification preferences saved.');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save preferences.');
    } finally {
      setNotifSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!passwordForm.current) { setPasswordError('Current password is required.'); return; }
    if (!passwordForm.newPass) { setPasswordError('New password is required.'); return; }
    if (passwordForm.newPass.length < 8) { setPasswordError('Password must be at least 8 characters.'); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordError('Passwords do not match.'); return; }
    setChangingPassword(true);
    try {
      await authApi.changePassword(passwordForm.current, passwordForm.newPass);
      showToast('success', 'Password changed successfully!');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const [downloading, setDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await authFetchBlob('/portfolio/download');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vidyaverse-portfolio-${(user?.name || 'portfolio').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to download portfolio PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const initials = getInitials(displayUser?.name);
  const joinedDate = displayUser?.createdAt
    ? new Date(displayUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const accentTheme = accentThemeFor(isOwn ? formProfileTheme : displayUser?.profileTheme);
  const templateId = (isOwn ? formPortfolioTemplate : displayUser?.portfolioTemplate) as TemplateComponentId;
  const Template = TEMPLATE_COMPONENTS[templateId] ?? TEMPLATE_COMPONENTS.bento;

  const [galleryOpen, setGalleryOpen] = useState(false);

  const settingsProps: SettingsPanelProps = {
    settingsSection, setSettingsSection,
    userEmail: user?.email, initials, avatarPreview, userAvatarUrl: user?.avatarUrl,
    fileInputRef, onAvatarChange: handleAvatarChange,
    onRemoveAvatar: () => { setAvatarPreview(null); setAvatarFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; },
    formName, setFormName, formBio, setFormBio, formGithubUrl, setFormGithubUrl,
    formLinkedinUrl, setFormLinkedinUrl, formPortfolioUrl, setFormPortfolioUrl,
    formProfileVisibility, setFormProfileVisibility, formProfileTheme, setFormProfileTheme,
    formPortfolioTemplate, setFormPortfolioTemplate,
    onBrowseTemplates: () => setGalleryOpen(true),
    saving, onSaveProfile: handleSaveProfile,
    passwordForm, setPasswordForm, passwordError, showPassword, setShowPassword,
    changingPassword, onChangePassword: handleChangePassword,
    notifPrefs, setNotifPrefs, defaultNotifPrefs, notifSaving, onSaveNotificationPrefs: handleSaveNotificationPrefs,
    formExperience, setFormExperience, formEducation, setFormEducation,
    formServices, setFormServices, formTestimonials, setFormTestimonials,
    portfolioContentSaving, onSavePortfolioContent: handleSavePortfolioContent,
  };

  // Live gallery previews reuse the student's real data — genuine
  // thumbnails of what each template will actually look like, not mockups.
  // Non-interactive (the LiveTemplatePreview wrapper disables pointer events).
  const previewProps: TemplateProps = {
    displayUser, stats, portfolio, enrichedProjects, githubActivity, accentTheme,
    isOwn: true, initials, joinedDate, loading: false, avatarPreview,
    tab: 'overview', setTab: () => {}, downloading: false, onDownloadPdf: () => {},
    settingsProps,
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed top-20 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === 'success'
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
      <Template
        displayUser={displayUser}
        stats={stats}
        portfolio={portfolio}
        enrichedProjects={enrichedProjects}
        githubActivity={githubActivity}
        accentTheme={accentTheme}
        isOwn={isOwn}
        initials={initials}
        joinedDate={joinedDate}
        loading={loading}
        avatarPreview={avatarPreview}
        tab={tab}
        setTab={setTab}
        downloading={downloading}
        onDownloadPdf={handleDownloadPdf}
        settingsProps={settingsProps}
      />
      {isOwn && (
        <TemplateGallery
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          onApply={handleApplyTemplate}
          currentTemplate={user?.portfolioTemplate || 'bento'}
          previewProps={previewProps}
        />
      )}
    </>
  );
}
