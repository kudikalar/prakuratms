import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaEraser } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= CONFIG ================= */

const API_URL = "http://localhost:5000/api/auth/admin/courses";
const COURSES_KEY = "PRAKURA_COURSES";
const CATEGORY_KEY = "PRAKURA_COURSE_CATEGORIES";

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
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const clearForm = () => {
    setForm(emptyForm);
    setTouched({});
    setErrors({});
  };

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    const readCategories = () => {
      const raw = JSON.parse(localStorage.getItem(CATEGORY_KEY)) || [];

      const normalized = raw
        .map((c) =>
          typeof c === "string"
            ? { name: c, status: "Active" }
            : { name: c.name, status: c.status ?? "Active" }
        )
        .filter((c) => c.status === "Active");

      setCategories(normalized);
    };

    readCategories();
    window.addEventListener("storage", readCategories);
    window.addEventListener("focus", readCategories);
    document.addEventListener("visibilitychange", readCategories);

    return () => {
      window.removeEventListener("storage", readCategories);
      window.removeEventListener("focus", readCategories);
      document.removeEventListener("visibilitychange", readCategories);
    };
  }, []);

  /* ================= LOAD COURSE (EDIT MODE) ================= */

  useEffect(() => {
    if (!editId) return;

    const loadCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/${editId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error();

        setForm({
          title: data.course.title || "",
          category: data.course.category || "",
          duration: data.course.duration || "",
          description: data.course.description || "",
          level: data.course.level || "",
          mode: data.course.mode || "",
          price: data.course.price ?? "",
        });
      } catch {
        setToast({ show: true, message: "❌ Failed to load course" });
      }
    };

    loadCourse();
  }, [editId]);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Course title required";
    if (!form.category) e.category = "Select category";
    if (!form.duration) e.duration = "Duration required";
    if (!form.level) e.level = "Select level";
    if (!form.mode) e.mode = "Select mode";
    if (form.price && isNaN(Number(form.price))) e.price = "Invalid price";
    return e;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);
    setTouched({
      title: true,
      category: true,
      duration: true,
      level: true,
      mode: true,
      price: true,
    });

    if (Object.keys(v).length) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(editId ? `${API_URL}/${editId}` : API_URL, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: form.price === "" ? 0 : Number(form.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const existing = JSON.parse(localStorage.getItem(COURSES_KEY)) || [];

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
    } catch {
      setToast({ show: true, message: "❌ Save failed" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="
      relative max-w-5xl mx-auto p-5 md:p-8 space-y-10
      animate-fadeIn
      bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100
      rounded-[36px]
      shadow-[0_45px_140px_rgba(79,70,229,0.35)]
    ">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/25 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-32 w-96 h-96 bg-purple-400/25 rounded-full blur-3xl" />

      {/* HEADER */}
      <div className="
        glass-panel relative z-10
        flex items-center gap-4
        bg-white/70 backdrop-blur-2xl
        border border-white/60
        rounded-3xl p-5
        shadow-[0_25px_90px_rgba(0,0,0,0.18)]
      ">
        <button
          onClick={() => navigate("/admin/courses")}
          className="
            p-3 rounded-full
            bg-white/80 hover:bg-white
            shadow transition
          "
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="
            text-2xl md:text-3xl font-bold
            bg-gradient-to-r from-indigo-700 to-purple-700
            bg-clip-text text-transparent
          ">
            {editId ? "Edit Course" : "Add New Course"}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Configure course details and delivery
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="
        glass-card relative z-10
        bg-white/75 backdrop-blur-2xl
        border border-white/60
        rounded-3xl p-8
        shadow-[0_35px_120px_rgba(0,0,0,0.22)]
      ">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            <FloatingInput
              label="Course Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={touched.title && errors.title}
            />

            <FloatingSelect
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={categories.map((c) => c.name)}
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
              options={["Beginner", "Intermediate", "Advanced"]}
              error={touched.level && errors.level}
            />

            <FloatingSelect
              label="Mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              options={["Online", "Offline", "Hybrid"]}
              error={touched.mode && errors.mode}
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
              type="submit"
              disabled={loading}
              className="
                px-10 py-3 rounded-full
                font-semibold text-white
                bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
                hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700
                shadow-[0_18px_50px_rgba(79,70,229,0.55)]
                hover:scale-[1.03]
                transition
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
                  bg-white/80 border border-white/60
                  text-slate-700
                  hover:bg-white hover:shadow
                  transition
                "
              >
                <FaEraser className="inline mr-2" />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const FloatingInput = ({ label, error, ...props }) => (
  <div className="relative">
    <input
      {...props}
      placeholder=" "
      className="
        peer glass-input pt-6
        focus:ring-2 focus:ring-indigo-500/50
        transition
      "
    />
    <label className="
      absolute left-4 top-2
      text-xs text-slate-600
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-sm
      transition-all
    ">
      {label}
    </label>
{error && (
  <p className="mt-1 text-xs font-semibold text-red-600">
    {error}
  </p>
)}
  </div>
);

const FloatingSelect = ({ label, options, error, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="
        peer glass-input pt-6
        focus:ring-2 focus:ring-indigo-500/50
        transition
      "
    >
      <option value="" disabled />
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <label className="absolute left-4 top-2 text-xs text-slate-600">
      {label}
    </label>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FloatingTextarea = ({ label, error, ...props }) => (
  <div className="relative">
    <textarea
      {...props}
      rows={4}
      placeholder=" "
      className="
        peer glass-input pt-6
        focus:ring-2 focus:ring-indigo-500/50
        transition
      "
    />
    <label className="
      absolute left-4 top-2
      text-xs text-slate-600
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-sm
      transition-all
    ">
      {label}
    </label>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
