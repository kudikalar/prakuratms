import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

/* =====================================================
   COMPONENT
===================================================== */

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();

  /* ================= LOAD ================= */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("courses")) || [];
      setCourses(stored);
    } catch {
      setCourses([]);
    }
  }, []);

  /* ================= GROUP BY CATEGORY ================= */
  const groupedCourses = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      const category = c.category || "Uncategorized";
      if (!map[category]) map[category] = [];
      map[category].push(c);
    });

    Object.keys(map).forEach((k) =>
      map[k].sort((a, b) => a.title.localeCompare(b.title))
    );

    return map;
  }, [courses]);

  /* ================= DELETE ================= */
  const deleteCourse = () => {
    const updated = courses.filter((c) => c.id !== confirmId);
    setCourses(updated);
    localStorage.setItem("courses", JSON.stringify(updated));

    setToast({ show: true, message: "🗑️ Course deleted successfully" });
    setConfirmId(null);

    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        max-w-7xl mx-auto space-y-10 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            All Courses
          </h2>
          <p className="text-sm text-slate-600">
            Manage and organize training programs
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

      {/* ================= EMPTY STATE ================= */}
      {courses.length === 0 && (
        <GlassCard>
          <p className="text-center text-slate-600">
            No courses found. Click <strong>Add Course</strong> to get started.
          </p>
        </GlassCard>
      )}

      {/* ================= CATEGORY ROWS ================= */}
      {Object.entries(groupedCourses).map(([category, list]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-700">
            {category}
          </h3>

          {/* HORIZONTAL SCROLL ROW */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {list.map((course) => (
              <GlassCard
                key={course.id}
                hover
                className="min-w-[320px] max-w-[360px] flex-shrink-0"
              >
                <div className="flex flex-col justify-between h-full gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {course.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Duration: {course.duration || "—"}
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <IconBtn
                      onClick={() =>
                        navigate(`/admin/courses/add?id=${course.id}`)
                      }
                    >
                      <FaEdit />
                    </IconBtn>

                    <IconBtn
                      danger
                      onClick={() => setConfirmId(course.id)}
                    >
                      <FaTrash />
                    </IconBtn>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}

      {/* ================= CONFIRM MODAL ================= */}
      {confirmId && (
        <ConfirmModal
          open={!!confirmId}
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteCourse}
        />
      )}

      {/* ================= TOAST ================= */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */

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

const GlassCard = ({ children, hover, className = "" }) => (
  <div
    className={`
      bg-white/40 backdrop-blur-[24px]
      border border-white/40 rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
      ${hover ? "glass-hover" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);
