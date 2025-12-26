import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaEraser } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= DEFAULT FORM ================= */

const emptyForm = {
  title: "",
  category: "",
  duration: "",
  description: "",
  level: "",
  mode: "",
  price: "",
  status: "Active",
};

export default function AddCourse() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });

  /* ================= LOAD (EDIT) ================= */
  useEffect(() => {
    if (editId) {
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const course = courses.find((c) => c.id === Number(editId));
      if (course) setForm(course);
    }
  }, [editId]);

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};
    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    if (!data.title.trim()) e.title = "Course title is required";
    else if (data.title.length < 5)
      e.title = "Minimum 5 characters required";
    else {
      const exists = courses.some(
        (c) =>
          c.title.toLowerCase() === data.title.toLowerCase() &&
          String(c.id) !== String(editId)
      );
      if (exists) e.title = "Course already exists";
    }

    if (!data.category.trim()) e.category = "Category is required";
    if (!data.duration.trim()) e.duration = "Duration is required";
    if (!data.level) e.level = "Select course level";
    if (!data.mode) e.mode = "Select course mode";
    if (data.price && isNaN(data.price)) e.price = "Must be numeric";

    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

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

    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    if (editId) {
      const updated = courses.map((c) =>
        c.id === Number(editId) ? { ...form, id: c.id } : c
      );
      localStorage.setItem("courses", JSON.stringify(updated));
      setToast({ show: true, message: "✅ Course updated successfully" });
    } else {
      localStorage.setItem(
        "courses",
        JSON.stringify([...courses, { ...form, id: Date.now() }])
      );
      setToast({ show: true, message: "🎉 Course added successfully" });
    }

    setTimeout(() => navigate("/admin/courses"), 1400);
  };

  const clearForm = () => {
    setForm(emptyForm);
    setErrors({});
    setTouched({});
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/courses")}
          className="p-2 rounded-full bg-white/60 border border-white/50"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {editId ? "Edit Course" : "Add New Course"}
          </h2>
          <p className="text-sm text-slate-600">
            Create and manage training programs
          </p>
        </div>
      </div>

      {/* FORM */}
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Course Title"
            name="title"
            placeholder="e.g. Full Stack Web Development"
            value={form.title}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            error={touched.title && errors.title}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Category"
              name="category"
              placeholder="IT, AI & ML, Cloud, Testing"
              value={form.category}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, category: true }))}
              error={touched.category && errors.category}
            />

            <Input
              label="Duration"
              name="duration"
              placeholder="e.g. 6 Months / 24 Weeks"
              value={form.duration}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, duration: true }))}
              error={touched.duration && errors.duration}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Course Level"
              name="level"
              value={form.level}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, level: true }))}
              error={touched.level && errors.level}
              options={["Beginner", "Intermediate", "Advanced"]}
            />

            <Select
              label="Mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, mode: true }))}
              error={touched.mode && errors.mode}
              options={["Online", "Offline", "Hybrid"]}
            />
          </div>

          <Input
            label="Price (Optional)"
            name="price"
            placeholder="e.g. 25000"
            value={form.price}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, price: true }))}
            error={touched.price && errors.price}
          />

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Course objectives, tools covered, career outcomes..."
              className="glass-input mt-1"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="submit"
              className="
                flex items-center gap-2 px-7 py-3 rounded-full
                font-semibold text-white
                bg-gradient-to-r from-purple-600 to-indigo-600
                hover:from-purple-700 hover:to-indigo-700
                shadow-lg transition
              "
            >
              <FaSave />
              {editId ? "Update Course" : "Save Course"}
            </button>

            {!editId && (
              <button
                type="button"
                onClick={clearForm}
                className="
                  px-6 py-3 rounded-full
                  bg-white/70 border border-white/50
                  text-slate-700 flex items-center gap-2
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

/* ================= SHARED UI ================= */

const GlassCard = ({ children }) => (
  <div className="bg-white/40 backdrop-blur-[24px] border border-white/40 rounded-3xl p-6 shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
    {children}
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className={`glass-input mt-1 ${
        error ? "border-red-400 focus:ring-red-400/40" : ""
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const Select = ({ label, error, options, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      {...props}
      className={`glass-input mt-1 ${
        error ? "border-red-400 focus:ring-red-400/40" : ""
      }`}
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);
