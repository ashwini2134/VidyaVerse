import { useState, useEffect } from "react";
import { Search, ShieldAlert, Check, X, Clock } from "lucide-react";
import { authFetch } from "../../../authClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

interface RoleCounts {
  adminCount: number;
  studentCount: number;
  instructorCount: number;
}

interface HistoryLog {
  id: string;
  userId: string;
  changedById: string;
  fromRole: string;
  toRole: string;
  createdAt: string;
  user: { name: string; email: string; avatarUrl?: string };
  changedBy: { name: string };
}

export function RolesAndPermissionsTab() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState<RoleCounts>({ adminCount: 0, studentCount: 0, instructorCount: 0 });
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const data = await authFetch<{ users: User[], adminCount: number, studentCount: number, instructorCount: number }>(`/admin/roles/users?search=${encodeURIComponent(query)}`);
      setUsers(data.users);
      setCounts({ adminCount: data.adminCount, studentCount: data.studentCount, instructorCount: data.instructorCount });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await authFetch<HistoryLog[]>("/admin/roles/history");
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(search);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const showToast = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (user.role === newRole) return;

    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      return;
    }

    try {
      await authFetch(`/admin/roles/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      showToast("Role updated successfully", "success");
      fetchUsers(search);
      fetchHistory();
    } catch (err: any) {
      showToast(err.message || "Failed to update role", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Toast */}
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-xl z-50 text-white font-medium ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {message.text}
        </div>
      )}

      {/* Overview Banner */}
      <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] p-4 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">VIDYAVERSE has 3 built-in roles. Each role has a fixed set of permissions that cannot be deleted.</p>
          <p className="text-sm opacity-80 mt-1">You can customize what each role can access.</p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">👑 Admin</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Full access</p>
          <p className="text-lg font-semibold text-[var(--text-main)] mt-4">{counts.adminCount} users</p>
          <button className="mt-4 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] text-sm font-medium rounded-lg transition-colors w-full border border-[var(--border-light)]">
            View Perms
          </button>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">🎓 Student</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Learning access</p>
          <p className="text-lg font-semibold text-[var(--text-main)] mt-4">{counts.studentCount} users</p>
          <button className="mt-4 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] text-sm font-medium rounded-lg transition-colors w-full border border-[var(--border-light)]">
            View Perms
          </button>
        </div>

        <div className="bg-[var(--bg-surface)]/60 border border-[var(--border-light)]/60 rounded-xl p-6 opacity-75">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">👨‍🏫 Instructor</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Content access</p>
          <p className="text-lg font-semibold text-[var(--text-main)] mt-4">{counts.instructorCount} users</p>
          <div className="mt-4 px-4 py-2 bg-[var(--bg-surface)]/50 text-[var(--text-muted)] text-sm font-medium rounded-lg text-center border border-[var(--border-light)]/50">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg">
        <div className="px-6 py-5 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">Permission Matrix</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">What each role can do in VIDYAVERSE</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-light)]">
                <th className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Permission</th>
                <th className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)] text-center">Admin</th>
                <th className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)] text-center">Student</th>
                <th className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)] text-center">Instructor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2D3D]">
              {/* VIEW COURSES */}
              <tr className="bg-[var(--bg-surface)]/30"><td colSpan={4} className="px-6 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">VIEW COURSES</td></tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Browse published courses</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Access course content</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">View course analytics</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>
              
              {/* CONTENT MANAGEMENT */}
              <tr className="bg-[var(--bg-surface)]/30"><td colSpan={4} className="px-6 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">CONTENT MANAGEMENT</td></tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Create courses</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Clock className="w-5 h-5 text-[var(--text-muted)] mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Edit lessons</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Clock className="w-5 h-5 text-[var(--text-muted)] mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Build quizzes</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Clock className="w-5 h-5 text-[var(--text-muted)] mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Define projects</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Clock className="w-5 h-5 text-[var(--text-muted)] mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Publish courses</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>

              {/* STUDENT ACTIONS */}
              <tr className="bg-[var(--bg-surface)]/30"><td colSpan={4} className="px-6 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">STUDENT ACTIONS</td></tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Take quizzes</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Submit projects</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Earn certificates</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">View own portfolio</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
              </tr>

              {/* ADMIN FUNCTIONS */}
              <tr className="bg-[var(--bg-surface)]/30"><td colSpan={4} className="px-6 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">ADMIN FUNCTIONS</td></tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Access admin portal</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">View all students</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Manage settings</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">View operations monitor</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">View analytics</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><Clock className="w-5 h-5 text-[var(--text-muted)] mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Remove courses</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              
              {/* AI & AUTOMATION */}
              <tr className="bg-[var(--bg-surface)]/30"><td colSpan={4} className="px-6 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">AI & AUTOMATION</td></tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">AI project review</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">Configure AI settings</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-[var(--bg-surface)]/20">
                <td className="px-6 py-3 text-sm text-[var(--text-main)]">View AI review logs</td>
                <td className="px-6 py-3 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                <td className="px-6 py-3 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-light)] text-sm text-[var(--text-secondary)] flex gap-4">
          <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Full access</span>
          <span className="flex items-center gap-1"><X className="w-4 h-4 text-red-500" /> No access</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[var(--text-muted)]" /> Coming with Instructor role</span>
        </div>
      </section>

      {/* User Role Management */}
      <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--text-main)] mb-1">Manage User Roles</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Change the role of any user in the system</p>
        
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] text-[var(--text-main)] rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[var(--color-primary)]/50"
          />
        </div>

        {loading ? (
          <div className="text-center text-[var(--text-muted)] py-4">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-[var(--text-muted)] py-4">No users found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border-light)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Current Role</th>
                  <th className="px-4 py-3 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D3D]">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-[var(--bg-surface)]/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-xs font-bold text-[var(--text-main)]">
                          {user.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-medium text-[var(--text-main)]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' :
                        user.role === 'instructor' ? 'bg-green-500/20 text-green-400' :
                        'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-[var(--bg-body)] border border-[var(--border-light)] text-sm text-[var(--text-main)] rounded px-2 py-1 outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                        <option value="instructor" disabled>Instructor (Soon)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Role Change History */}
      <section className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] overflow-hidden shadow-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--text-main)] mb-6">Recent Role Changes</h2>
        {history.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">No role changes yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border-light)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Changed From</th>
                  <th className="px-4 py-3">Changed To</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Changed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D3D]">
                {history.map(log => (
                  <tr key={log.id} className="hover:bg-[var(--bg-surface)]/30">
                    <td className="px-4 py-3 text-sm text-[var(--text-main)] font-medium">{log.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{log.fromRole}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[var(--color-primary)]">{log.toRole}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{log.changedBy?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
