import React, { useState, useEffect } from "react";
import { Save, RefreshCcw, ChevronDown, ChevronRight, Mail, Plus, X } from "lucide-react";
import { authFetch } from "../../../authClient";

export default function EmailTemplatesTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success'|'error'}|null>(null);

  const [showVariables, setShowVariables] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    trigger: "",
    subject: "",
    body: "",
    variables: [] as string[],
  });

  const AVAILABLE_VARIABLES = [
    "student_name", "platform_name", "course_name", "score", "passed",
    "status", "feedback", "certificate_url", "completion_date",
    "verification_id", "days_inactive", "last_lesson", "continue_url",
    "login_url", "course_url", "resubmit_url", "quiz_name",
    "project_name", "instructor_name", "next_step"
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await authFetch<any[]>("/admin/email-templates");
      if (data && data.length > 0) {
        setTemplates(data);
        setActiveTemplate(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: any) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Discard?")) return;
    }
    setActiveTemplate(template);
    setIsDirty(false);
    setShowVariables(false);
    setShowPreview(false);
    setShowCustomForm(false);
  };

  const handleChange = (field: string, value: string) => {
    setActiveTemplate((prev: any) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!activeTemplate) return;
    try {
      setSaving(true);
      const res = await authFetch<any>(`/admin/email-templates/${activeTemplate.templateKey}`, {
        method: "POST",
        body: JSON.stringify({
          subject: activeTemplate.subject,
          body: activeTemplate.body
        })
      });
      
      const newTemplates = templates.map(t => t.templateKey === res.templateKey ? res : t);
      setTemplates(newTemplates);
      setActiveTemplate(res);
      setIsDirty(false);
      showToast("Template saved ✓", "success");
    } catch (err) {
      showToast("Failed to save template.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!activeTemplate) return;
    if (!window.confirm("Reset this template to its default content?")) return;
    
    try {
      setSaving(true);
      const res = await authFetch<any>(`/admin/email-templates/${activeTemplate.templateKey}/reset`, {
        method: "POST"
      });
      
      const newTemplates = templates.map(t => t.templateKey === res.templateKey ? res : t);
      setTemplates(newTemplates);
      setActiveTemplate(res);
      setIsDirty(false);
      showToast("Template reset to default.", "success");
    } catch (err) {
      showToast("Failed to reset template.", "error");
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("email-body-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentBody = activeTemplate.body || "";
    const insertText = `{{${variable}}}`;
    
    const newBody = currentBody.substring(0, start) + insertText + currentBody.substring(end);
    handleChange("body", newBody);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 0);
  };

  const insertVariableIntoSubject = (variable: string) => {
    const input = document.getElementById("email-subject-editor") as HTMLInputElement;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentSub = activeTemplate.subject || "";
    const insertText = `{{${variable}}}`;
    
    const newSub = currentSub.substring(0, start) + insertText + currentSub.substring(end);
    handleChange("subject", newSub);
  };

  const getPreviewHtml = () => {
    if (!activeTemplate) return "";
    let html = activeTemplate.body || "";
    let sub = activeTemplate.subject || "";

    const sampleData: Record<string, string> = {
      student_name: "Priya",
      platform_name: "VIDYAVERSE",
      course_name: "Python for Beginners",
      score: "85%",
      passed: "✅ Passed",
      status: "Approved",
      feedback: "Great work on your submission!",
      certificate_url: "https://VIDYAVERSE.com/cert/ABC",
      completion_date: new Date().toLocaleDateString(),
      verification_id: "CERT-2025-ABC123",
      days_inactive: "3",
      last_lesson: "Introduction to Python",
      continue_url: "https://VIDYAVERSE.com/course/python",
      login_url: "https://VIDYAVERSE.com/login",
      course_url: "https://VIDYAVERSE.com/course/python",
      resubmit_url: "https://VIDYAVERSE.com/resubmit",
      quiz_name: "Module 1 Quiz",
      project_name: "Final Project",
      instructor_name: "Admin",
      next_step: "Continue to the next lesson!"
    };

    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, sampleData[key]);
      sub = sub.replace(regex, sampleData[key]);
    });

    return { body: html, subject: sub };
  };

  const toggleVariable = (v: string) => {
    setNewTemplate(prev => ({
      ...prev,
      variables: prev.variables.includes(v)
        ? prev.variables.filter(x => x !== v)
        : [...prev.variables, v]
    }));
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      showToast("Name, Subject, and Body are required.", "error");
      return;
    }
    const templateKey = newTemplate.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    try {
      setSaving(true);
      const res = await authFetch<any>("/admin/email-templates", {
        method: "POST",
        body: JSON.stringify({ ...newTemplate, templateKey })
      });
      setTemplates([...templates, res]);
      setActiveTemplate(res);
      setShowCustomForm(false);
      setNewTemplate({ name: "", trigger: "", subject: "", body: "", variables: [] });
      setIsDirty(false);
      showToast("Template created ✓", "success");
    } catch (err: any) {
      const msg = err?.message || "Failed to create template.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (loading) return <div className="p-8 text-[var(--text-secondary)]">Loading templates...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-xl z-50 border ${
          toastMessage.type === 'success' ? 'bg-[var(--bg-surface)] border-green-500/50 text-white' : 'bg-red-900/90 border-red-500/50 text-white'
        }`}>
          {toastMessage.msg}
        </div>
      )}

      {/* LEFT PANEL (35%) */}
      <div className="w-full md:w-[35%] flex flex-col gap-3 shrink-0">
        <button
          onClick={() => { setShowCustomForm(true); setShowVariables(false); setShowPreview(false); }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all text-sm font-medium"
        >
          <Plus size={16} />
          Customise Email
        </button>
        {templates.map(tmpl => (
          <div 
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTemplate?.id === tmpl.id 
                ? 'bg-[var(--bg-surface)] border-[var(--color-primary)] border-l-4 shadow-lg' 
                : 'bg-[var(--bg-body)] border-[var(--border-light)] hover:border-[var(--border-light)]'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--text-main)]">{tmpl.name}</h3>
              {tmpl.isCustomized ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/20">Customized</span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-light)]">Default</span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">{tmpl.trigger}</p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL (65%) */}
      <div className="w-full md:w-[65%] flex flex-col gap-6">
        {showCustomForm ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Customise Email</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Create a new custom email template</p>
              </div>
              <button
                onClick={() => setShowCustomForm(false)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Creation Form */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Template Name</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Assignment Reminder"
                    className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Trigger Description</label>
                  <input
                    type="text"
                    value={newTemplate.trigger}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, trigger: e.target.value }))}
                    placeholder="e.g. Sent when assignment is due"
                    className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Reminder: {{assignment_name}} is due soon!"
                    className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Email Body</label>
                  <textarea
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Hi {{student_name}},&#10;&#10;Your assignment is due soon!..."
                    className="w-full min-h-[200px] bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none font-mono text-sm leading-relaxed resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_VARIABLES.map(v => (
                      <button
                        key={v}
                        onClick={() => toggleVariable(v)}
                        className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${
                          newTemplate.variables.includes(v)
                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/30'
                            : 'bg-[var(--bg-body)] text-[var(--text-secondary)] border-[var(--border-light)] hover:border-[var(--border-light)]'
                        }`}
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="sticky bottom-4 z-10 pt-4">
              <button
                onClick={handleCreateTemplate}
                disabled={saving || !newTemplate.name || !newTemplate.subject || !newTemplate.body}
                className={`w-full py-3 rounded-lg font-medium shadow-xl transition-all flex justify-center items-center gap-2 ${
                  saving || !newTemplate.name || !newTemplate.subject || !newTemplate.body
                    ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-light)]'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Create Template
              </button>
            </div>
          </>
        ) : activeTemplate ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-main)]">{activeTemplate.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">{activeTemplate.trigger}</p>
              </div>
              <button 
                onClick={handleReset}
                disabled={!activeTemplate.isCustomized}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reset to Default
              </button>
            </div>

            {/* Editor Area */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div className="p-6 flex flex-col gap-6">
                
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Email Subject</label>
                  <input 
                    id="email-subject-editor"
                    type="text" 
                    value={activeTemplate.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {activeTemplate.variables.map((v: string) => (
                      <button 
                        key={v}
                        onClick={() => insertVariableIntoSubject(v)}
                        className="text-xs font-mono bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 px-2 py-1 rounded transition-colors"
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Email Body</label>
                  <div className="relative">
                    <textarea 
                      id="email-body-editor"
                      value={activeTemplate.body}
                      onChange={(e) => handleChange('body', e.target.value)}
                      className="w-full min-h-[280px] bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-[var(--color-primary)] outline-none font-mono text-sm leading-relaxed resize-y"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-wrap gap-2">
                      {activeTemplate.variables.map((v: string) => (
                        <button 
                          key={v}
                          onClick={() => insertVariable(v)}
                          className="text-xs font-mono bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 px-2 py-1 rounded transition-colors"
                        >
                          {`{{${v}}}`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-amber-500/80 mt-3 flex items-center gap-1">
                    <span>💡</span> Use {`{{variable}}`} syntax for dynamic content
                  </p>
                </div>
              </div>
            </div>

            {/* Variables Reference */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setShowVariables(!showVariables)}
              >
                <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                  <span>📋</span> Available Variables
                </h2>
                {showVariables ? <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" /> : <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />}
              </div>
              {showVariables && (
                <div className="p-6 border-t border-[var(--border-light)] bg-[var(--bg-body)]">
                  <table className="w-full text-left text-sm text-[var(--text-main)]">
                    <thead>
                      <tr className="border-b border-[var(--border-light)]">
                        <th className="pb-2 font-medium">Variable</th>
                        <th className="pb-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTemplate.variables.map((v: string) => (
                        <tr key={v} className="border-b border-[var(--border-light)]/50 last:border-0">
                          <td className="py-2"><code className="text-[var(--color-primary)] text-xs bg-[var(--color-primary)]/10 px-1 py-0.5 rounded">{`{{${v}}}`}</code></td>
                          <td className="py-2 text-[var(--text-secondary)]">Dynamic value for {v.replace('_', ' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Preview Email */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setShowPreview(!showPreview)}
              >
                <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                  <span>👁️</span> Preview Email
                </h2>
                {showPreview ? <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" /> : <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />}
              </div>
              {showPreview && (
                <div className="p-6 border-t border-[var(--border-light)] bg-[var(--bg-body)] flex justify-center">
                  
                  {/* Email Sim Card */}
                  <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden text-black font-sans text-sm">
                    <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-surface)] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                        <img src="/logo.svg" alt="VIDYAVERSE" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[var(--text-muted)]">From: <span className="font-medium text-[var(--text-main)]">VIDYAVERSE</span></div>
                        <div className="font-bold truncate mt-0.5">{getPreviewHtml().subject}</div>
                      </div>
                    </div>
                    <div className="p-6 whitespace-pre-wrap leading-relaxed">
                      {getPreviewHtml().body}
                    </div>
                    <div className="px-6 py-4 border-t border-[var(--border-light)] text-xs text-[var(--text-secondary)] text-center">
                      © {new Date().getFullYear()} VIDYAVERSE
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="sticky bottom-4 z-10 pt-4">
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className={`w-full py-3 rounded-lg font-medium shadow-xl transition-all flex justify-center items-center gap-2 ${
                  isDirty 
                    ? 'bg-[var(--color-primary)] hover:brightness-110 text-white' 
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-light)]'
                }`}
              >
                {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Template
              </button>
            </div>

          </>
        ) : null}
      </div>

    </div>
  );
}
