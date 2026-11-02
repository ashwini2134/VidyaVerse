import { useState, useEffect } from "react";
import { Link2, Trash2, Plus, Zap, MessageSquare, BookOpen, Clock, PlayCircle, AlertCircle, RefreshCw } from "lucide-react";
import { authFetch } from "../../../authClient";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  _count?: { deliveries: number };
}

interface Delivery {
  id: string;
  event: string;
  status: string;
  responseCode: number;
  createdAt: string;
  webhook: { url: string };
}

export function IntegrationsTab() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [url, setUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const availableEvents = [
    { id: "student.enrolled", label: "Student enrolled in course" },
    { id: "quiz.completed", label: "Quiz completed (pass or fail)" },
    { id: "project.approved", label: "Project approved" },
    { id: "certificate.issued", label: "Certificate issued" },
    { id: "student.registered", label: "Student registered" },
    { id: "course.published", label: "Course published" }
  ];

  const fetchWebhooks = async () => {
    try {
      const data = await authFetch<Webhook[]>("/admin/integrations/webhooks");
      setWebhooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const data = await authFetch<Delivery[]>("/admin/integrations/webhooks/deliveries");
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWebhooks();
    fetchDeliveries();
  }, []);

  const showToast = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleAddWebhook = async () => {
    try {
      await authFetch("/admin/integrations/webhooks", {
        method: "POST",
        body: JSON.stringify({ url, events: selectedEvents, secretKey: secretKey || undefined })
      });
      showToast("Webhook endpoint added successfully", "success");
      setShowAddForm(false);
      setUrl("");
      setSecretKey("");
      setSelectedEvents([]);
      fetchWebhooks();
    } catch (err: any) {
      showToast(err.message || "Failed to add webhook", "error");
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!window.confirm("Delete this webhook endpoint?")) return;
    try {
      await authFetch(`/admin/integrations/webhooks/${id}`, { method: "DELETE" });
      showToast("Webhook deleted", "success");
      fetchWebhooks();
      fetchDeliveries();
    } catch (err: any) {
      showToast(err.message || "Failed to delete webhook", "error");
    }
  };

  const handleRetry = async (deliveryId: string) => {
    try {
      await authFetch(`/admin/integrations/webhooks/${deliveryId}/retry`, { method: "POST" });
      showToast("Retry triggered", "success");
      fetchDeliveries();
    } catch (err: any) {
      showToast("Failed to retry", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-xl z-50 text-white font-medium ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {message.text}
        </div>
      )}

      {/* Overview Banner */}
      <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] p-4 rounded-xl flex items-start gap-3">
        <Link2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Connect VIDYAVERSE to external tools and services.</p>
          <p className="text-sm opacity-80 mt-1">Webhooks let other apps receive real-time updates when things happen in your platform.</p>
        </div>
      </div>

      {/* Available Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" /> Zapier
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Automate workflows</p>
          <p className="text-sm text-[var(--text-secondary)]">Connect VIDYAVERSE to 5000+ apps</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)] font-medium">Status: Not Connected</span>
            <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-main)] text-sm font-medium rounded-lg transition-colors border border-[var(--border-light)]">
              Connect Zapier
            </a>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[var(--color-primary)]" /> Webhooks
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Send real-time data</p>
          <p className="text-sm text-[var(--text-secondary)]">to your own endpoints</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              Status: {webhooks.length > 0 ? <><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</> : <span className="text-[var(--text-muted)]">Inactive</span>}
            </span>
            <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg transition-colors">
              Manage Webhooks
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)]/60 border border-[var(--border-light)]/60 rounded-xl p-6 opacity-60">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-400" /> Slack
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Get notified in Slack</p>
          <div className="mt-10 flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)] font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> Coming Soon</span>
            <button disabled className="px-4 py-2 bg-[var(--bg-surface)] text-[var(--text-muted)] text-sm font-medium rounded-lg cursor-not-allowed">
              Connect Slack
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)]/60 border border-[var(--border-light)]/60 rounded-xl p-6 opacity-60">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-400" /> Google Classroom
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sync courses and students</p>
          <div className="mt-10 flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)] font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> Coming Soon</span>
            <button disabled className="px-4 py-2 bg-[var(--bg-surface)] text-[var(--text-muted)] text-sm font-medium rounded-lg cursor-not-allowed">
              Connect Google
            </button>
          </div>
        </div>
      </div>

      {/* Webhook Manager */}
      <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg p-6 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">Webhook Endpoints</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Plus className="w-4 h-4" /> Add Webhook Endpoint
          </button>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-6">VIDYAVERSE will send a POST request to these URLs when the selected events occur.</p>

        {showAddForm && (
          <div className="mb-8 p-5 rounded-lg border border-[var(--border-light)] bg-[var(--bg-surface)]/50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Endpoint URL</label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook" 
                  className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] text-[var(--text-main)] rounded-lg px-4 py-2 outline-none focus:border-[var(--color-primary)]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Events to trigger on:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableEvents.map(evt => (
                    <label key={evt.id} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-main)]">
                      <input 
                        type="checkbox" 
                        checked={selectedEvents.includes(evt.id)}
                        onChange={() => toggleEvent(evt.id)}
                        className="rounded border-[var(--border-light)] bg-[var(--bg-body)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                      />
                      {evt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Secret Key (optional):</label>
                <input 
                  type="text" 
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="webhook_secret_key" 
                  className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] text-[var(--text-main)] rounded-lg px-4 py-2 outline-none focus:border-[var(--color-primary)]/50"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Used to verify requests are from VIDYAVERSE</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-main)] text-sm font-medium rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddWebhook} className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg transition-colors">
                  Add Webhook
                </button>
              </div>
            </div>
          </div>
        )}

        {webhooks.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm bg-[var(--bg-body)]/30 rounded-lg border border-dashed border-[var(--border-light)]">
            No webhook endpoints added yet.<br/>Add your first endpoint above.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border-light)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Events</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Added</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D3D]">
                {webhooks.map(wh => (
                  <tr key={wh.id} className="hover:bg-[var(--bg-surface)]/30">
                    <td className="px-4 py-3 text-sm text-[var(--color-primary)] max-w-[200px] truncate cursor-pointer hover:underline" title={wh.url} onClick={() => navigator.clipboard.writeText(wh.url)}>
                      {wh.url}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-main)]">{wh.events.length} events</td>
                    <td className="px-4 py-3 text-sm flex items-center gap-1.5">
                      {wh.isActive ? <><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-green-400">Active</span></> : <><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="text-red-400">Error</span></>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{new Date(wh.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button className="text-[var(--text-secondary)] hover:text-white px-2">Edit</button>
                      <button onClick={() => handleDeleteWebhook(wh.id)} className="text-[var(--text-secondary)] hover:text-red-400 px-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Webhook Event Log */}
      <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--text-main)] mb-6">Recent Webhook Deliveries</h2>
        
        {deliveries.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">No webhook deliveries yet</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border-light)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Response</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D3D]">
                {deliveries.map(del => {
                  const isSuccess = del.status === "200 OK";
                  const isPending = del.status === "Pending";
                  return (
                    <tr key={del.id} className="hover:bg-[var(--bg-surface)]/30">
                      <td className="px-4 py-3 text-sm font-medium text-[var(--text-main)]">{del.event}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)] truncate max-w-[150px]" title={del.webhook?.url}>{del.webhook?.url}</td>
                      <td className="px-4 py-3 text-sm flex items-center gap-1.5 pt-4">
                        {isSuccess ? <><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-green-400">200 OK</span></> : 
                         isPending ? <><span className="w-2 h-2 rounded-full bg-yellow-500"></span> <span className="text-yellow-400">Pending</span></> :
                         <><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="text-red-400">Failed</span></>}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{del.responseCode || '-'}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{new Date(del.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        {!isSuccess && !isPending && (
                          <button onClick={() => handleRetry(del.id)} className="text-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs font-medium flex items-center justify-end gap-1 w-full">
                            <RefreshCw className="w-3 h-3" /> Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
