import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaEraser } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../../components/Toast";

const API_URL = "http://localhost:5000/api/auth/admin/courses";
const COURSES_KEY = "PRAKURA_COURSES";

/* ================= DEFAULT FORM ================= */
const emptyForm = {
  title: "",
  category: "",
  duration: "",
  description: "",
  level: "",
  mode: "",
  price: "",
};

export default function AddCourse() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false);

  /* ================= LOAD COURSE (EDIT MODE) ================= */
  useEffect(() => {
    if (!editId) return;

    const loadCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        const course = data.courses?.find((c) => c._id === editId);

        if (course) {
          setForm({
            title: course.title || "",
            category: course.category || "",
            duration: course.duration || "",
            description: course.description || "",
            level: course.level || "",
            mode: course.mode || "",
            price: course.price ?? "",
          });
        }
      } catch {
        setToast({ show: true, message: "❌ Failed to load course" });
      }
    };

    loadCourse();
  }, [editId]);

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};
    if (!data.title.trim()) e.title = "Course title is required";
    if (!data.category.trim()) e.category = "Category is required";
    if (!data.duration.trim()) e.duration = "Duration is required";
    if (!data.level) e.level = "Select course level";
    if (!data.mode) e.mode = "Select course mode";
    if (data.price !== "" && isNaN(Number(data.price)))
      e.price = "Price must be numeric";
    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      title: true,
      category: true,
      duration: true,
      level: true,
      mode: true,
      price: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        title: form.title.trim(),
        category: form.category.trim(),
        duration: form.duration.trim(),
        description: form.description.trim(),
        price: form.price === "" ? 0 : Number(form.price),
      };

      const res = await fetch(
        editId ? `${API_URL}/${editId}` : API_URL,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      /* 🔥 SYNC TO SHARED STORAGE (CRITICAL FIX) */
      const existing =
        JSON.parse(localStorage.getItem(COURSES_KEY)) || [];

      const updated = editId
        ? existing.map((c) => (c._id === editId ? data.course : c))
        : [...existing, data.course];

      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));

      setToast({
        show: true,
        message: editId
          ? "✅ Course updated successfully"
          : "🎉 Course created successfully",
      });

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      setToast({ show: true, message: err.message || "❌ Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm(emptyForm);
    setTouched({});
    setErrors({});
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        max-w-5xl mx-auto space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100/70 via-indigo-100/70 to-pink-100/70
        rounded-[32px] p-6 md:p-10
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/courses")}
          className="p-3 rounded-full bg-white/60 backdrop-blur border border-white/40 hover:scale-105 transition"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {editId ? "Edit Course" : "Add New Course"}
          </h2>
          <p className="text-sm text-slate-600">
            Manage course details and training configuration
          </p>
        </div>
      </div>

      {/* FORM */}
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <FloatingInput
              label="Course Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={touched.title && errors.title}
            />
            <FloatingInput
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              error={touched.category && errors.category}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FloatingInput
              label="Duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              error={touched.duration && errors.duration}
            />
            <FloatingInput
              label="Price (₹)"
              name="price"
              value={form.price}
              onChange={handleChange}
              error={touched.price && errors.price}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FloatingSelect
              label="Course Level"
              name="level"
              value={form.level}
              onChange={handleChange}
              error={touched.level && errors.level}
              options={["Beginner", "Intermediate", "Advanced"]}
            />
            <FloatingSelect
              label="Mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              error={touched.mode && errors.mode}
              options={["Online", "Offline", "Hybrid"]}
            />
          </div>

          <FloatingTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="flex flex-wrap gap-4 pt-6">
            <button
              disabled={loading}
              type="submit"
              className="
                px-10 py-3 rounded-full
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700
                text-white font-semibold
                shadow-xl transition
                disabled:opacity-60
              "
            >
              <FaSave className="inline mr-2" />
              {editId ? "Update Course" : "Save Course"}
            </button>

            {!editId && (
              <button
                type="button"
                onClick={clearForm}
                className="
                  px-8 py-3 rounded-full
                  bg-white/70 backdrop-blur
                  border border-white/50
                  text-slate-700
                  flex items-center gap-2
                "
              >
                <FaEraser /> Clear
              </button>
            )}
          </div>
        </form>
      </GlassCard>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const GlassCard = ({ children }) => (
  <div className="
    bg-white/35 backdrop-blur-[28px]
    border border-white/40 rounded-3xl p-8
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]
  ">
    {children}
  </div>
);

const FloatingInput = ({ label, error, value, ...props }) => (
  <div className="relative">
    <input
      {...props}
      value={value}
      placeholder=" "
      className="
        peer w-full px-4 pt-6 pb-2 rounded-xl
        bg-white/40 backdrop-blur-xl
        border border-white/40
        text-slate-800
        focus:outline-none focus:ring-2 focus:ring-indigo-400/50
      "
    />
    <label className="
      absolute left-4 top-2 text-xs text-slate-600
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
      peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
      transition-all
    ">
      {label}
    </label>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FloatingSelect = ({ label, options, value, error, ...props }) => (
  <div className="relative">
    <select
      {...props}
      value={value}
      className="
        peer w-full px-4 pt-6 pb-2 rounded-xl
        bg-white/40 backdrop-blur-xl
        border border-white/40
        text-slate-800 focus:outline-none
        focus:ring-2 focus:ring-indigo-400/50
      "
    >
      <option value="" disabled hidden />
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    <label className="absolute left-4 top-2 text-xs text-slate-600">
      {label}
    </label>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FloatingTextarea = ({ label, value, ...props }) => (
  <div className="relative">
    <textarea
      {...props}
      value={value}
      rows={4}
      placeholder=" "
      className="
        peer w-full px-4 pt-6 pb-2 rounded-xl
        bg-white/40 backdrop-blur-xl
        border border-white/40
        text-slate-800 focus:outline-none
        focus:ring-2 focus:ring-indigo-400/50
      "
    />
    <label className="
      absolute left-4 top-2 text-xs text-slate-600
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
      peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
      transition-all
    ">
      {label}
    </label>
  </div>
);
