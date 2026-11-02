import React, { useState, useEffect, useRef } from "react";
import { Upload, X, Save, RefreshCcw } from "lucide-react";
import { authFetch, getToken } from "../../authClient";

import AIConfigTab from "../../components/admin/settings/AIConfigTab";
import EmailTemplatesTab from "../../components/admin/settings/EmailTemplatesTab";
import { RolesAndPermissionsTab } from "../../components/admin/settings/RolesAndPermissionsTab";
import { IntegrationsTab } from "../../components/admin/settings/IntegrationsTab";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Branding");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [branding, setBranding] = useState({
    platformName: "VIDYAVERSE",
    tagline: "Bridge Your Learning. Build Your Future.",
    primaryColor: "#1E3A8A",
    secondaryColor: "#0F172A",
    logoUrl: "",
    faviconUrl: ""
  });

  const [originalBranding, setOriginalBranding] = useState({ ...branding });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const data = await authFetch<any>("/admin/branding");
      if (data) {
        setBranding({
          platformName: data.platformName || "VIDYAVERSE",
          tagline: data.tagline || "Bridge Your Learning. Build Your Future.",
          primaryColor: data.primaryColor || "#1E3A8A",
          secondaryColor: data.secondaryColor || "#0F172A",
          logoUrl: data.logoUrl || "",
          faviconUrl: data.faviconUrl || ""
        });
        setOriginalBranding(data);
      }
    } catch (err) {
      console.error("Failed to fetch branding", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setBranding((prev) => {
      const next = { ...prev, [field]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(originalBranding));
      return next;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 2 * 1024 * 1024) {
      showToast("File exceeds 2MB limit", "error");
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      const endpoint = type === "logo" ? "/api/admin/branding/upload-logo" : "/api/admin/branding/upload-favicon";
      const token = getToken();
      
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (type === "logo") {
        handleChange("logoUrl", data.logoUrl);
      } else {
        handleChange("faviconUrl", data.faviconUrl);
      }
      showToast(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully ✓`);
    } catch (err) {
      console.error(err);
      showToast(`Failed to upload ${type}`, "error");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await authFetch("/admin/branding/save", {
        method: "POST",
        body: JSON.stringify(branding)
      });
      setOriginalBranding(res);
      setIsDirty(false);
      showToast("Branding saved successfully ✓");
      
      // Update CSS vars instantly for admin preview
      document.documentElement.style.setProperty('--color-primary', res.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', res.secondaryColor);
      document.title = res.platformName;
    } catch (err) {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all branding to defaults?")) {
      setBranding({
        platformName: "VIDYAVERSE",
        tagline: "Bridge Your Learning. Build Your Future.",
        primaryColor: "#1E3A8A",
        secondaryColor: "#0F172A",
        logoUrl: "",
        faviconUrl: ""
      });
      setIsDirty(true);
    }
  };

  const showToast = (msg: string, type = "success") => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const tabs = [
    { id: "Branding", label: "Branding" },
    { id: "AI Configuration", label: "AI Configuration" },
    { id: "Email Templates", label: "Email Templates" },
    { id: "Roles & Permissions", label: "Roles & Permissions" },
    { id: "Integrations", label: "Integrations" },
  ];

  if (loading) return <div className="p-8 text-[var(--text-secondary)]">Loading settings...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-[var(--bg-surface)] border border-[var(--border-light)] text-white px-4 py-2 rounded-lg shadow-xl z-50">
          {toastMessage}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight mb-6">Settings</h1>
        <div className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-[var(--bg-surface)] text-[var(--color-primary)] border-l-4 border-[var(--color-primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]/50 hover:text-[var(--text-main)] border-l-4 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === "AI Configuration" ? (
          <AIConfigTab />
        ) : activeTab === "Email Templates" ? (
          <EmailTemplatesTab />
        ) : activeTab === "Roles & Permissions" ? (
          <RolesAndPermissionsTab />
        ) : activeTab === "Integrations" ? (
          <IntegrationsTab />
        ) : activeTab !== "Branding" ? (
          <div className="bg-[var(--bg-surface)] rounded-xl p-8 border border-[var(--border-light)] text-center shadow-lg">
            <h3 className="text-xl font-medium text-[var(--text-main)] mb-2">{activeTab}</h3>
            <p className="text-[var(--text-secondary)]">This section is coming soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* PLATFORM IDENTITY */}
            <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-[var(--border-light)]">
                <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Platform Identity</h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Platform Name</label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">This name appears in the browser tab, emails, and throughout the platform.</p>
                  <input
                    type="text"
                    value={branding.platformName}
                    onChange={(e) => handleChange("platformName", e.target.value)}
                    maxLength={50}
                    placeholder="Enter platform name"
                    className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                  />
                  <div className="text-xs text-[var(--text-muted)] mt-2 text-right">
                    {branding.platformName.length}/50
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Tagline</label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">A short description shown on the login page and marketing materials.</p>
                  <input
                    type="text"
                    value={branding.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                    maxLength={100}
                    placeholder="Enter tagline"
                    className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* LOGO & FAVICON */}
            <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-[var(--border-light)]">
                <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Logo & Favicon</h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {/* Platform Logo */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Platform Logo</label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Recommended size: 200x50px. Supported formats: PNG, SVG, JPG. Max size: 2MB.</p>
                  
                  <div 
                    onClick={() => !branding.logoUrl && logoInputRef.current?.click()}
                    className={`border-2 border-dashed border-[var(--border-light)] rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                      !branding.logoUrl ? "hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-body)]/50 cursor-pointer" : "bg-[var(--bg-body)]"
                    }`}
                  >
                    {branding.logoUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <img src={branding.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                        <div className="flex gap-3">
                          <button onClick={() => handleChange("logoUrl", "")} className="text-xs font-medium text-red-400 hover:text-red-300">Remove</button>
                          <button onClick={() => logoInputRef.current?.click()} className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]">Replace</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[var(--text-muted)] mb-3" />
                        <p className="text-sm font-medium text-[var(--text-main)]">Click to upload or drag and drop</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">PNG, SVG, JPG up to 2MB</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      className="hidden" 
                      accept="image/png, image/svg+xml, image/jpeg" 
                      onChange={(e) => handleFileUpload(e, "logo")}
                    />
                  </div>
                </div>

                {/* Favicon */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Favicon</label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Small icon shown in browser tab. Must be square. Recommended: 32x32px ICO or PNG.</p>
                  
                  <div 
                    onClick={() => !branding.faviconUrl && faviconInputRef.current?.click()}
                    className={`border-2 border-dashed border-[var(--border-light)] rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                      !branding.faviconUrl ? "hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-body)]/50 cursor-pointer" : "bg-[var(--bg-body)]"
                    }`}
                  >
                    {branding.faviconUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <img src={branding.faviconUrl} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                        <div className="flex gap-3">
                          <button onClick={() => handleChange("faviconUrl", "")} className="text-xs font-medium text-red-400 hover:text-red-300">Remove</button>
                          <button onClick={() => faviconInputRef.current?.click()} className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]">Replace</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[var(--text-muted)] mb-2" />
                        <p className="text-sm font-medium text-[var(--text-main)]">Click to upload</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">PNG, ICO, SVG up to 2MB</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={faviconInputRef} 
                      className="hidden" 
                      accept="image/png, image/x-icon, image/svg+xml" 
                      onChange={(e) => handleFileUpload(e, "favicon")}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* COLORS */}
            <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-[var(--border-light)]">
                <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Colors</h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Primary Color</label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Main accent color used for buttons, links, and highlights throughout the platform.</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[var(--border-light)]">
                      <input 
                        type="color" 
                        value={branding.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={branding.primaryColor}
                      onChange={(e) => handleChange("primaryColor", e.target.value)}
                      className="w-32 bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Secondary Color</label>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Used for backgrounds and subtle accents.</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[var(--border-light)]">
                      <input 
                        type="color" 
                        value={branding.secondaryColor}
                        onChange={(e) => handleChange("secondaryColor", e.target.value)}
                        className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={branding.secondaryColor}
                      onChange={(e) => handleChange("secondaryColor", e.target.value)}
                      className="w-32 bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE PREVIEW */}
            <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg mb-8">
              <div className="px-6 py-4 border-b border-[var(--border-light)]">
                <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Live Preview</h2>
              </div>
              <div className="p-6">
                <div className="rounded-xl overflow-hidden border border-[var(--border-light)] bg-[var(--bg-body)]">
                  <div className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-[var(--border-light)] pb-4">
                      {branding.logoUrl ? (
                         <img src={branding.logoUrl} alt="Logo" className="h-8 object-contain" />
                      ) : (
                         <div className="w-8 h-8 rounded bg-[var(--bg-surface)]"></div>
                      )}
                      <span className="font-bold text-lg tracking-tight text-[var(--text-main)]">{branding.platformName}</span>
                    </div>

                    <div>
                      <div className="h-2 w-full rounded-full" style={{ backgroundColor: branding.primaryColor }}></div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <button 
                        className="px-5 py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-5 py-2.5 rounded-lg font-medium text-[var(--text-main)] border border-[var(--border-light)] bg-[var(--bg-surface)] hover:bg-[var(--bg-dark-surface)]/90 transition-colors"
                      >
                        Secondary Button
                      </button>
                    </div>

                    <div className="mt-4 text-[var(--text-secondary)]">
                      {branding.tagline}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sticky Actions */}
            <div className="sticky bottom-4 flex items-center justify-between bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-light)] shadow-2xl">
              <button 
                onClick={handleReset}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors px-4"
              >
                Reset to defaults
              </button>
              
              <button 
                onClick={handleSave}
                disabled={!isDirty || saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  isDirty 
                    ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20" 
                    : "bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
