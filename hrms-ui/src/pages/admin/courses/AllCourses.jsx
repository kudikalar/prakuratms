import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaLock } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

const COURSES_KEY = "PRAKURA_COURSES";
const BATCHES_KEY = "batches";
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

/* ================= STATUS HELPER ================= */
const getCourseStatus = (course) => {
  const s = String(course?.status || "ONGOING").toUpperCase();
  return ["UPCOMING", "ONGOING", "COMPLETED"].includes(s)
    ? s
    : "ONGOING";
};

/* ================= NORMALIZERS ================= */
const safeText = (val) => (val && String(val).trim() ? val : "—");
const safePrice = (val) =>
  typeof val === "number" && val >= 0 ? `₹${val}` : "—";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ONGOING");

  /* 🔎 SEARCH + FILTER */
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [modeFilter, setModeFilter] = useState("ALL");

  const navigate = useNavigate();

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/api/auth/admin/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        const fetchedCourses = Array.isArray(data.courses)
          ? data.courses
          : [];

        setCourses(fetchedCourses);
        localStorage.setItem(COURSES_KEY, JSON.stringify(fetchedCourses));
      } catch (err) {
        if (err.name !== "AbortError") {
          setToast({ show: true, message: "❌ Failed to load courses" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    return () => controller.abort();
  }, []);

  /* ================= GROUP BY STATUS ================= */
  const coursesByStatus = useMemo(
    () => ({
      UPCOMING: courses.filter(
        (c) => getCourseStatus(c) === "UPCOMING"
      ),
      ONGOING: courses.filter(
        (c) => getCourseStatus(c) === "ONGOING"
      ),
      COMPLETED: courses.filter(
        (c) => getCourseStatus(c) === "COMPLETED"
      ),
    }),
    [courses]
  );

  /* ================= FILTERED COURSES ================= */
  const filteredCourses = useMemo(() => {
    return coursesByStatus[activeTab].filter((c) => {
      const matchSearch =
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());

      const matchLevel =
        levelFilter === "ALL" || c.level === levelFilter;

      const matchMode =
        modeFilter === "ALL" || c.mode === modeFilter;

      return matchSearch && matchLevel && matchMode;
    });
  }, [coursesByStatus, activeTab, search, levelFilter, modeFilter]);

  /* ================= ANALYTICS ================= */
  const analytics = useMemo(() => {
    const paid = courses.filter((c) => c.price > 0).length;
    const free = courses.length - paid;
    return { total: courses.length, paid, free };
  }, [courses]);

  /* ================= DELETE LOCK (BATCH EXISTS) ================= */
  const hasBatch = (courseId) => {
    const batches = JSON.parse(localStorage.getItem(BATCHES_KEY)) || [];
    return batches.some((b) => String(b.courseId) === String(courseId));
  };

  /* ================= DELETE COURSE ================= */
  const deleteCourse = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/auth/admin/courses/${confirmId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setCourses((prev) => {
        const updated = prev.filter((c) => c._id !== confirmId);
        localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
        return updated;
      });

      setToast({ show: true, message: "🗑️ Course deleted successfully" });
    } catch {
      setToast({ show: true, message: "❌ Failed to delete course" });
    } finally {
      setConfirmId(null);
      setTimeout(() => setToast({ show: false, message: "" }), 2500);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100 rounded-[36px] p-6 shadow-[0_45px_150px_rgba(79,70,229,0.35)]">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
            Courses
          </h2>
          <p className="text-sm text-slate-600">
            Lifecycle, pricing & delivery overview
          </p>
        </div>

        <NavLink
          to="/admin/courses/add"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          <FaPlus /> Add Course
        </NavLink>
      </div>

      {/* ANALYTICS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <KPI label="Total Courses" value={analytics.total} />
        <KPI label="Paid Courses" value={analytics.paid} />
        <KPI label="Free Courses" value={analytics.free} />
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course title or category..."
            className="glass-input pl-10 w-full"
          />
        </div>

        <select className="glass-input" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="ALL">All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select className="glass-input" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
          <option value="ALL">All Modes</option>
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>
      </div>

      {/* TABLE */}
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {filteredCourses.map((course) => {
              const locked = hasBatch(course._id);
              return (
                <tr key={course._id} className="border-t hover:bg-indigo-100/40 transition">
                  <td className="px-4 py-3 font-semibold">{course.title}</td>
                  <td className="px-4 py-3">{safeText(course.category)}</td>
                  <td className="px-4 py-3 text-center">{safePrice(course.price)}</td>
                  <td className="px-4 py-3 flex justify-end gap-3">
                    <IconBtn onClick={() => navigate(`/admin/courses/add?id=${course._id}`)}>
                      <FaEdit />
                    </IconBtn>

                    <IconBtn
                      danger
                      disabled={locked}
                      title={locked ? "Cannot delete. Batch exists." : ""}
                      onClick={() => !locked && setConfirmId(course._id)}
                    >
                      {locked ? <FaLock /> : <FaTrash />}
                    </IconBtn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>

      {confirmId && (
        <ConfirmModal
          open
          title="Delete Course"
          message="This action cannot be undone."
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteCourse}
        />
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const KPI = ({ label, value }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow text-center">
    <p className="text-sm text-slate-600">{label}</p>
    <p className="text-3xl font-bold text-indigo-700">{value}</p>
  </div>
);

const IconBtn = ({ children, danger, ...props }) => (
  <button
    {...props}
    className={`p-2.5 rounded-full transition hover:scale-110 disabled:opacity-40 ${
      danger
        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
    }`}
  >
    {children}
  </button>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/65 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow ${className}`}>
    {children}
  </div>
);
