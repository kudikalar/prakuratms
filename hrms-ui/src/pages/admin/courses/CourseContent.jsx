import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaBookOpen } from "react-icons/fa";
import Toast from "../../../components/Toast";

/* ================= DEFAULT ================= */

const emptyModule = {
  courseId: "",
  title: "",
  content: "",
};

export default function CourseContent() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState(emptyModule);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });

  /* ================= LOAD ================= */
  useEffect(() => {
    setCourses(JSON.parse(localStorage.getItem("courses")) || []);
    setModules(JSON.parse(localStorage.getItem("courseModules")) || []);
  }, []);

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};
    if (!data.courseId) e.courseId = "Course is required";
    if (!data.title.trim()) e.title = "Module title is required";
    else if (data.title.length < 3)
      e.title = "Minimum 3 characters required";
    if (!data.content.trim())
      e.content = "Module content is required";
    else if (data.content.length < 10)
      e.content = "Minimum 10 characters required";
    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= SAVE ================= */
  const addModule = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ courseId: true, title: true, content: true });

    if (Object.keys(validationErrors).length > 0) return;

    const updated = [
      ...modules,
      { ...form, id: Date.now() },
    ];

    setModules(updated);
    localStorage.setItem("courseModules", JSON.stringify(updated));

    setForm(emptyModule);
    setTouched({});
    setToast({ show: true, message: "✅ Module added successfully" });
  };

  /* ================= DELETE ================= */
  const deleteModule = (id) => {
    const updated = modules.filter((m) => m.id !== id);
    setModules(updated);
    localStorage.setItem("courseModules", JSON.stringify(updated));
    setToast({ show: true, message: "🗑️ Module deleted" });
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        max-w-5xl space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Syllabus & Content
        </h2>
        <p className="text-sm text-slate-600">
          Manage modules and syllabus for courses
        </p>
      </div>

      {/* ADD MODULE */}
      <GlassCard>
        <div className="space-y-4">
          {/* COURSE */}
          <div>
            <label className="text-sm font-medium">Course</label>
            <select
              value={form.courseId}
              onChange={(e) =>
                setForm({ ...form, courseId: e.target.value })
              }
              onBlur={() =>
                setTouched((t) => ({ ...t, courseId: true }))
              }
              className="glass-input mt-1"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.courseId && touched.courseId && (
              <p className="text-xs text-red-600 mt-1">
                {errors.courseId}
              </p>
            )}
          </div>

          {/* MODULE TITLE */}
          <div>
            <label className="text-sm font-medium">Module Title</label>
            <input
              placeholder="Module 1: Introduction"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              onBlur={() =>
                setTouched((t) => ({ ...t, title: true }))
              }
              className="glass-input mt-1"
            />
            {errors.title && touched.title && (
              <p className="text-xs text-red-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* CONTENT */}
          <div>
            <label className="text-sm font-medium">
              Module Content
            </label>
            <textarea
              rows="4"
              placeholder="Topics covered, tools, assignments..."
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
              onBlur={() =>
                setTouched((t) => ({ ...t, content: true }))
              }
              className="glass-input mt-1"
            />
            {errors.content && touched.content && (
              <p className="text-xs text-red-600 mt-1">
                {errors.content}
              </p>
            )}
          </div>

          <button
            onClick={addModule}
            className="
              flex items-center gap-2 px-7 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              shadow-lg transition
            "
          >
            <FaPlus /> Add Module
          </button>
        </div>
      </GlassCard>

      {/* MODULE LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {modules.map((m) => {
          const course = courses.find(
            (c) => String(c.id) === String(m.courseId)
          );

          return (
            <GlassCard key={m.id} className="glass-hover">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {m.title}
                  </h3>
                  <p className="text-xs text-purple-600 mt-1">
                    <FaBookOpen className="inline mr-1" />
                    {course?.title || "Unknown Course"}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    {m.content}
                  </p>
                </div>

                <button
                  onClick={() => deleteModule(m.id)}
                  className="
                    p-2 rounded-full
                    bg-rose-100 text-rose-600
                    hover:bg-rose-200 transition
                  "
                >
                  <FaTrash />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= GLASS ================= */

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/40 backdrop-blur-[24px]
      border border-white/40
      rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
      ${className}
    `}
  >
    {children}
  </div>
);
