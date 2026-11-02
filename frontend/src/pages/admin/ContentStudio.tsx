// Fraylon Admin - Phase 2
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen, MoreVertical, Archive, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { PublishChecklist } from "../../components/admin/PublishChecklist";
import { authFetch } from "../../authClient";

export default function ContentStudio() {
  const navigate = useNavigate();
  const [showPublishChecklist, setShowPublishChecklist] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [courseToRemove, setCourseToRemove] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await authFetch<any[]>(`/admin/courses?search=${encodeURIComponent(search)}&status=${filter}`);
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounce);
  }, [search, filter]);

  const handlePublish = async (courseId: string) => {
    try {
      await authFetch(`/admin/courses/${courseId}/publish`, { method: "PATCH" });
      setCourses(courses.map(c => c.id === courseId ? { ...c, status: "PUBLISHED" } : c));
      setShowPublishChecklist(null);
    } catch (err: any) {
      alert("Error publishing course: " + err.message);
    }
  };

  const handleArchive = async (courseId: string) => {
    if (!confirm("Are you sure you want to archive this course?")) return;
    try {
      await authFetch(`/admin/courses/${courseId}/archive`, { method: "PATCH" });
      setCourses(courses.map(c => c.id === courseId ? { ...c, status: "ARCHIVED" } : c));
    } catch (err: any) {
      try {
        await authFetch(`/admin/courses/${courseId}/status`, { 
          method: "PATCH",
          body: JSON.stringify({ status: "ARCHIVED" })
        });
        setCourses(courses.map(c => c.id === courseId ? { ...c, status: "ARCHIVED" } : c));
      } catch (e: any) {
        alert("Error archiving course: " + e.message);
      }
    }
  };

  const handleRemove = async () => {
    if (!courseToRemove) return;
    try {
      await authFetch(`/admin/courses/${courseToRemove.id}`, { method: "DELETE" });
      setCourses(courses.filter(c => c.id !== courseToRemove.id));
      setCourseToRemove(null);
      // alert("Course removed"); // Instead of alert, we just remove it
    } catch (err: any) {
      alert("Error removing course: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">Content Studio</h1>
          <p className="text-[var(--text-secondary)] mt-1">Create and manage your courses and assessments</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/content-assessments')}
            className="bg-[var(--bg-surface)] border border-[var(--border-light)] hover:bg-[var(--bg-dark-surface)] text-[var(--text-main)] font-medium py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </button>
          <button 
            onClick={() => navigate('/admin/content-studio/new')}
            className="bg-[var(--color-brand-navy)] hover:bg-[var(--color-primary)] text-[var(--bg-body)] font-medium py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">Loading...</div>
      ) : courses.length === 0 && !search && filter === "All" ? (
        <div className="bg-[var(--bg-surface)] rounded-xl shadow-lg border border-[var(--border-light)] flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-[var(--bg-dark-surface)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-main)] mb-2">No courses yet</h3>
          <p className="text-[var(--text-secondary)] text-center max-w-sm mb-6">
            Start building your first interactive learning experience with VIDYAVERSE Studio.
          </p>
          <button 
            onClick={() => navigate('/admin/content-studio/new')}
            className="bg-[var(--color-brand-navy)] hover:bg-[var(--color-primary)] text-[var(--bg-body)] font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-sm"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 bg-[var(--bg-surface)] rounded-xl shadow-lg border border-[var(--border-light)] overflow-hidden min-h-0">
          {/* Controls */}
          <div className="p-4 border-b border-[var(--border-light)] flex flex-col sm:flex-row gap-4 justify-between bg-[var(--bg-surface)] shrink-0">
            <div className="relative max-w-md w-full">
              <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm bg-[var(--bg-body)]/50 text-[var(--text-main)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-[var(--border-light)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm bg-[var(--bg-body)]/50 text-[var(--text-main)] min-w-[150px]"
            >
              <option value="All">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm text-[var(--text-main)]">
              <thead className="bg-[var(--bg-surface)]/80 text-[var(--text-secondary)] font-medium uppercase text-xs border-b border-[var(--border-light)] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Lessons</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-[var(--border-light)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-dark-surface)] flex items-center justify-center text-[var(--color-primary)] shrink-0 overflow-hidden border border-[var(--color-primary)]/20">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-medium text-[var(--text-main)] line-clamp-1">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        course.status === 'PUBLISHED' ? 'bg-emerald-900/300/10 text-emerald-400 border-emerald-500/20' : 
                        course.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-[#0a0f1e]0/10 text-[var(--text-secondary)] border-slate-500/20'
                      }`}>
                        {course.status === 'PUBLISHED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {course.status === 'DRAFT' && <Clock className="w-3.5 h-3.5" />}
                        {course.status === 'ARCHIVED' && <Archive className="w-3.5 h-3.5" />}
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--text-main)] font-medium">{course._count?.lessons || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--text-main)] font-medium">{course.studentsEnrolled || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/admin/content-studio/${course.id}/lessons`)}
                          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                        >
                          Edit
                        </button>
                        {course.status === 'DRAFT' && (
                          <button 
                            onClick={() => setShowPublishChecklist(course.id)}
                            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Publish
                          </button>
                        )}
                        {course.status !== 'ARCHIVED' && (
                          <button 
                            onClick={() => handleArchive(course.id)}
                            className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            Archive
                          </button>
                        )}
                        <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
                            className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors p-1"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {activeDropdown === course.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-lg shadow-xl overflow-hidden z-20">
                              <button
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setCourseToRemove(course);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {courses.length === 0 && (search || filter !== "All") && (
              <div className="py-16 text-center text-[var(--text-secondary)]">
                No courses found matching your search.
              </div>
            )}
          </div>
        </div>
      )}

      {showPublishChecklist && (
        <PublishChecklist
          courseId={showPublishChecklist}
          onClose={() => setShowPublishChecklist(null)}
          onPublish={() => handlePublish(showPublishChecklist)}
        />
      )}

      {courseToRemove && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-body)] border border-[var(--border-light)] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-main)]">Remove Course?</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  This will remove the course from the student dashboard immediately. You can restore it later.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setCourseToRemove(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--border-light)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 text-sm font-medium text-[var(--bg-body)] bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-900/20"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
