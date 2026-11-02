import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { api, type Course } from "./api";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Settings,
  Trophy,
  X,
  PlusCircle,
  FileText,
  Layout,
  Code,
  HelpCircle,
  Briefcase,
  UploadCloud,
  RefreshCw,
  Zap,
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { authApi } from "./authClient";

import { useBranding } from "./context/BrandingContext";
import { useTheme } from "./hooks/useTheme";

function Logo({ expanded }: { expanded: boolean }) {
  const { branding } = useBranding();

  return (
    <NavLink to="/" className="flex items-center gap-2 flex-shrink-0 px-4 h-16 border-b border-[var(--border-primary)] overflow-hidden">
      <img
        src={branding?.logoUrl || `${import.meta.env.BASE_URL}logo.svg`}
        alt={branding?.platformName || "VIDYAVERSE"}
        className="h-8 w-auto object-contain flex-shrink-0"
      />
      <span className={`font-bold text-[var(--text-primary)] text-base tracking-wide whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
        {branding?.platformName || "VIDYAVERSE"}
      </span>
    </NavLink>
  );
}

const navLinkBase =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-2";

const navLinkActive =
  "bg-[var(--accent-indigo)]/15 text-[var(--text-primary)] border-l-[var(--accent-indigo)] shadow-sm";

const navLinkInactive =
  "text-[var(--text-secondary)] hover:bg-[var(--accent-indigo)]/10 hover:text-[var(--text-primary)] border-transparent";

const subLinkBase =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 border";

const subLinkActive =
  "text-[var(--text-primary)] bg-[var(--accent-indigo)]/15 border-[var(--accent-indigo)]/30";

const subLinkInactive =
  "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo)]/10 border-transparent";

export default function Shell() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [contentStudioOpen, setContentStudioOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const leaveTimer = useRef<number | null>(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState<any[]>([]);
  const [notifUnread, setNotifUnread] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const data = await authApi.getInAppNotifications();
      setNotifList(data.notifications);
      setNotifUnread(data.unread);
    } catch {}
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await authApi.markNotificationRead(id);
      setNotifList((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
      setNotifUnread((u) => Math.max(0, u - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await authApi.markAllNotificationsRead();
      setNotifList((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
      setNotifUnread(0);
    } catch {}
  };

  const onCoursePage = location.pathname.startsWith("/course/");
  const onContentStudio = location.pathname.startsWith("/admin/content-studio");
  const courseSlug = onCoursePage ? location.pathname.split("/")[2] : null;

  const pathParts = location.pathname.split('/');
  let adminCourseId = "draft";
  if (pathParts[1] === "admin" && pathParts[2] === "content-studio" && pathParts[3] && pathParts[3] !== "new") {
    adminCourseId = pathParts[3];
  }

  useEffect(() => {
    api.courses().then(setCourses).catch(err => console.error('[shell] load courses failed', err));
  }, []);

  useEffect(() => {
    if (onCoursePage) {
      setCoursesOpen(false);
      setExpanded(false);
    }
  }, [onCoursePage]);

  const handleMouseEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = window.setTimeout(() => {
      setExpanded(false);
      setCoursesOpen(false);
    }, 150);
  };

  const handleCourseClick = () => {
    setSidebarOpen(false);
    setCoursesOpen(false);
    setTimeout(() => setExpanded(false), 100);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg-main)]">
      {/* Header */}
      <header className="flex-shrink-0 bg-[var(--bg-header)] z-50">
        <div className="flex h-16 items-center gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-all duration-200 flex-shrink-0 md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <NavLink to="/" className="md:hidden flex items-center gap-2 flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="VIDYAVERSE"
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold text-[var(--text-primary)] text-base tracking-wide">VIDYAVERSE</span>
          </NavLink>

          <div className="flex-1" />

          <div className="flex items-center gap-3 text-sm">
            {user?.role === 'admin' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-primary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-violet)] animate-pulse-subtle" />
                <span className="text-[var(--text-primary)] font-semibold text-xs whitespace-nowrap">
                  Review Mode
                </span>
                <span className="text-[var(--text-muted)] text-[10px] hidden md:inline">
                  All lectures unlocked
                </span>
              </div>
            )}
              {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-primary)]">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)]" />
                <span className="text-[var(--text-primary)] truncate max-w-[140px] font-medium">
                  {user.name}
                </span>
                <span className="text-xs text-[var(--text-muted)] capitalize hidden md:inline">
                  {user.role}
                </span>
              </div>
            )}

            <NavLink to="/portfolio" className="hidden md:flex rounded-lg bg-[var(--color-primary)] hover:bg-[var(--brand-primary-dark)] text-[var(--accent-text)] px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Portfolio
            </NavLink>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) fetchNotifs(); }}
                className="relative rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-all duration-200 border border-transparent hover:border-[var(--border-primary)]"
              >
                <Bell size={20} />
                {notifUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent-indigo)] text-[10px] font-bold text-[var(--accent-text)] flex items-center justify-center">
                    {notifUnread > 9 ? '9+' : notifUnread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-[12px] shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)]">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
                    {notifUnread > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-[var(--accent-indigo)] hover:text-[var(--accent-violet)]">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifList.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">No notifications yet.</div>
                    ) : (
                      notifList.slice(0, 20).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleMarkRead(n.id)}
                          className={`w-full text-left px-4 py-3 border-b border-[var(--border-primary)] hover:bg-[var(--accent-indigo)]/8 transition-colors ${
                            n.readAt ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="text-sm font-medium text-[var(--text-primary)]">{n.title}</div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.body}</div>
                          <div className="text-[10px] text-[var(--text-muted)] mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-all duration-200 border border-transparent hover:border-[var(--border-primary)]"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <NavLink to={user?.role === 'admin' ? '/admin/settings' : '/settings'} className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-all duration-200 border border-transparent hover:border-[var(--border-primary)]">
              <Settings size={20} />
            </NavLink>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--accent-indigo)]/10 text-[var(--text-primary)] px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 border border-[var(--border-primary)] hover:border-[var(--accent-indigo)]/30 whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`fixed inset-y-0 left-0 md:relative md:inset-auto
          flex-shrink-0 flex flex-col border-r border-[var(--border-primary)]
          bg-[var(--bg-sidebar)] transition-all duration-200 ease-in-out
          z-40
          ${expanded ? "w-64" : "w-16"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="flex-shrink-0 overflow-hidden">
            <Logo expanded={expanded} />
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* ── Core navigation (all users) ── */}
            <NavLink to="/" end onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Dashboard">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><LayoutDashboard size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Dashboard</span>
            </NavLink>

            {/* Courses dropdown */}
            <div>
              <button type="button" onClick={() => expanded && setCoursesOpen((o) => !o)}
                onMouseEnter={() => !expanded && setExpanded(true)}
                className={`${navLinkBase} ${onCoursePage ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'} appearance-none`}
                title="Courses">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><BookOpen size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Courses</span>
                <span className={`transition-all duration-200 overflow-hidden flex-shrink-0 flex items-center ${expanded ? 'w-4 opacity-100' : 'w-0 opacity-0'}`}>
                  <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${coursesOpen ? "rotate-0" : "-rotate-90"}`} />
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expanded && coursesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pt-1 pb-1 pl-3 space-y-0.5">
                  {courses.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500 animate-pulse">Loading...</div>
                  ) : courses.map((course) => {
                    const isActive = courseSlug === course.slug;
                    return (
                      <NavLink key={course.id} to={`/course/${course.slug}`} onClick={handleCourseClick}
                        className={`${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}>
                        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[var(--accent-indigo)]' : 'bg-[var(--border-primary)]'}`} />
                        </span>
                        <span className="truncate">{course.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>

            <NavLink to="/projects" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Projects">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><FolderKanban size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Projects</span>
            </NavLink>

            <NavLink to="/assessments" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Assessments">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><ClipboardList size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Assessments</span>
            </NavLink>

            <NavLink to="/certifications" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Certifications">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Award size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Certifications</span>
            </NavLink>

            <NavLink to="/portfolio" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Portfolio">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Briefcase size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Portfolio</span>
            </NavLink>

            <NavLink to="/leaderboard" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Leaderboard">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Trophy size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Leaderboard</span>
            </NavLink>

            <NavLink to="/spotlight" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="Portfolio Spotlight">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Sparkles size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Spotlight</span>
            </NavLink>

            <NavLink to="/ai-mentor" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
              title="AI Mentor">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Zap size={18} /></span>
              <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>AI Mentor</span>
            </NavLink>

            {/* ── Admin navigation ── */}
            {user?.role === "admin" && <>
              <div className="border-t border-[var(--border-primary)] my-2" />
              <div className={`px-3 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                Admin
              </div>

              {/* Content Studio dropdown */}
              <div className="mb-2">
                <button type="button" onClick={() => expanded && setContentStudioOpen((o) => !o)}
                  onMouseEnter={() => !expanded && setExpanded(true)}
                  className={`${navLinkBase} ${onContentStudio ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'} appearance-none`}
                  title="Content Studio">
                  <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><BookOpen size={18} /></span>
                  <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Content Studio</span>
                  <span className={`transition-all duration-200 overflow-hidden flex-shrink-0 flex items-center ${expanded ? 'w-4 opacity-100' : 'w-0 opacity-0'}`}>
                    <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${contentStudioOpen ? "rotate-0" : "-rotate-90"}`} />
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expanded && contentStudioOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="pt-1 pb-1 pl-3 space-y-0.5">
                    <NavLink to="/admin/content-studio" end onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Course Creation">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><PlusCircle size={16} /></span>
                      <span className="truncate">Course Creation</span>
                    </NavLink>

                    <NavLink to={adminCourseId === "draft" ? "/admin/content-studio/new" : `/admin/content-studio/${adminCourseId}/blueprint`} onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Blueprint Builder">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><FileText size={16} /></span>
                      <span className="truncate">Blueprint Builder</span>
                    </NavLink>

                    <NavLink to={`/admin/content-studio/${adminCourseId}/lessons`} onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Lesson Editor">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Layout size={16} /></span>
                      <span className="truncate">Lesson Editor</span>
                    </NavLink>

                    <NavLink to={`/admin/content-studio/${adminCourseId}/exercise`} onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Exercise Builder">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Code size={16} /></span>
                      <span className="truncate">Exercise Builder</span>
                    </NavLink>

                    <NavLink to={`/admin/content-studio/${adminCourseId}/quiz`} onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Quiz Builder">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><HelpCircle size={16} /></span>
                      <span className="truncate">Quiz Builder</span>
                    </NavLink>

                    <NavLink to={`/admin/content-studio/${adminCourseId}/project`} onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Project Builder">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Briefcase size={16} /></span>
                      <span className="truncate">Project Builder</span>
                    </NavLink>

                    <NavLink to={`/admin/content-studio/${adminCourseId}/publish`} onClick={() => { setSidebarOpen(false); setContentStudioOpen(true); }}
                      className={({ isActive }) => `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`}
                      title="Course Publishing">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><UploadCloud size={16} /></span>
                      <span className="truncate">Course Publishing</span>
                    </NavLink>
                  </div>
                </div>
              </div>

              <NavLink to="/admin/analytics" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="Analytics">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><BarChart3 size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Analytics</span>
              </NavLink>

              <NavLink to="/admin/operations" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="Operations Monitor">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><AlertTriangle size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Operations Monitor</span>
              </NavLink>

              <NavLink to="/admin/testing" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="Test Center">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><RefreshCw size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Test Center</span>
              </NavLink>

              <NavLink to="/admin/course-testing" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="Course Testing">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><BookOpen size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Course Testing</span>
              </NavLink>

              <NavLink to="/admin/course-testing/python" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="Python Course Testing">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Zap size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Python Course</span>
              </NavLink>

              <NavLink to="/admin/lms-testing" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="LMS Core Testing">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><ClipboardList size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>LMS Core Testing</span>
              </NavLink>

              <NavLink to="/admin/settings" onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${expanded ? '' : 'justify-center px-2 gap-0'}`}
                title="Settings">
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0"><Settings size={18} /></span>
                <span className={`truncate flex-1 text-left transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden flex-grow-0'}`}>Settings</span>
              </NavLink>
            </>}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
