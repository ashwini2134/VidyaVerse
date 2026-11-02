// Fraylon Admin - Phase 1
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Activity, BarChart2, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../auth";
import LogoutOverlay from "../auth/LogoutOverlay";

import { useBranding } from "../../context/BrandingContext";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { branding } = useBranding();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { label: "Content Studio", path: "/admin/content-studio", icon: BookOpen },
    { label: "Operations Monitor", path: "/admin/operations", icon: Activity },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart2 },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0f1e] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 transition-all duration-300 shadow-xl z-10">
        <div>
          <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800 gap-2">
            <img
              src={branding?.logoUrl || "/logo.svg"}
              alt={branding?.platformName || "Platform Logo"}
              className="h-8 w-auto object-contain flex-shrink-0"
            />
            <span className="font-bold text-white text-xl hidden md:block tracking-tight">{branding?.platformName || "VIDYAVERSE"} Admin</span>
          </div>

          <nav className="mt-6 flex flex-col gap-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 font-medium"
                        : "hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                  title={item.label}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="hidden md:block whitespace-nowrap">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="hidden md:flex flex-col px-3">
            <span className="text-sm text-slate-100 font-medium truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role}</span>
          </div>
          
          <button
            onClick={() => setLoggingOut(true)}
            className="flex items-center justify-center md:justify-start gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden md:block font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#0a0f1e] w-full relative">
        <Outlet />
      </main>

      {loggingOut && <LogoutOverlay onComplete={logout} />}
    </div>
  );
}
