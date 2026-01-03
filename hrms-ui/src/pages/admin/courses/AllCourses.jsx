import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

const COURSES_KEY = "PRAKURA_COURSES";

/* =====================================================
   ALL COURSES – STATUS BASED (UPCOMING / ONGOING / COMPLETED)
   (PRODUCTION READY – DATE FREE)
===================================================== */

/* ===== STATUS HELPER ===== */
const getCourseStatus = (course) => {
  return course?.status || "ONGOING";
};

/* ===== NORMALIZERS ===== */
const safeText = (val) => (val && String(val).trim() ? val : "—");
const safePrice = (val) =>
  typeof val === "number" && val >= 0 ? `₹${val}` : "—";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ONGOING");

  const navigate = useNavigate();

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/auth/admin/courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const fetchedCourses = Array.isArray(data.courses)
          ? data.courses
          : [];

        setCourses(fetchedCourses);

        /* 🔥 SYNC TO SHARED STORAGE */
        localStorage.setItem(
          COURSES_KEY,
          JSON.stringify(fetchedCourses)
        );
      } catch {
        setToast({ show: true, message: "❌ Failed to load courses" });
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ================= GROUP BY STATUS ================= */
  const coursesByStatus = useMemo(
    () => ({
      UPCOMING: courses.filter((c) => getCourseStatus(c) === "UPCOMING"),
      ONGOING: courses.filter((c) => getCourseStatus(c) === "ONGOING"),
      COMPLETED: courses.filter((c) => getCourseStatus(c) === "COMPLETED"),
    }),
    [courses]
  );

  /* ================= DELETE COURSE ================= */
  const deleteCourse = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/auth/admin/courses/${confirmId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setCourses((prev) => {
        const updated = prev.filter((c) => c._id !== confirmId);

        /* 🔥 SYNC TO SHARED STORAGE */
        localStorage.setItem(
          COURSES_KEY,
          JSON.stringify(updated)
        );

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
    <div
      className="
        max-w-7xl mx-auto space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Courses</h2>
          <p className="text-sm text-slate-600">
            Manage courses by lifecycle status
          </p>
        </div>

        <NavLink
          to="/admin/courses/add"
          className="
            flex items-center gap-2 px-6 py-2.5 rounded-full
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-700 hover:to-indigo-700
            text-white font-semibold shadow-lg transition
          "
        >
          <FaPlus /> Add Course
        </NavLink>
      </div>

      {/* STATUS TABS */}
      <div className="flex gap-4 flex-wrap">
        {["UPCOMING", "ONGOING", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === status
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white/70 text-slate-600 hover:bg-white"
            }`}
          >
            {status} ({coursesByStatus[status].length})
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading && (
        <GlassCard>
          <p className="text-center text-slate-600">Loading courses...</p>
        </GlassCard>
      )}

      {!loading && coursesByStatus[activeTab].length === 0 && (
        <GlassCard>
          <p className="text-center text-slate-600">
            No {activeTab.toLowerCase()} courses found.
          </p>
        </GlassCard>
      )}

      {!loading && coursesByStatus[activeTab].length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/70 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-center">Duration</th>
                  <th className="px-4 py-3 text-center">Level</th>
                  <th className="px-4 py-3 text-center">Mode</th>
                  <th className="px-4 py-3 text-center">Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {coursesByStatus[activeTab].map((course) => (
                  <tr
                    key={course._id}
                    className="border-t hover:bg-white/50 transition"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {course.title}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {safeText(course.category)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {safeText(course.duration)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {safeText(course.level)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {safeText(course.mode)}
                    </td>

                    <td className="px-4 py-3 text-center font-medium">
                      {safePrice(course.price)}
                    </td>

                    <td className="px-4 py-3 flex justify-end gap-3">
                      <IconBtn
                        onClick={() =>
                          navigate(`/admin/courses/add?id=${course._id}`)
                        }
                      >
                        <FaEdit />
                      </IconBtn>

                      <IconBtn danger onClick={() => setConfirmId(course._id)}>
                        <FaTrash />
                      </IconBtn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* CONFIRM */}
      {confirmId && (
        <ConfirmModal
          open
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteCourse}
        />
      )}

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const IconBtn = ({ children, danger, ...props }) => (
  <button
    {...props}
    className={`p-2.5 rounded-full transition ${
      danger
        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
    }`}
  >
    {children}
  </button>
);

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/40 backdrop-blur-[24px]
      border border-white/40 rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
      ${className}
    `}
  >
    {children}
  </div>
);
