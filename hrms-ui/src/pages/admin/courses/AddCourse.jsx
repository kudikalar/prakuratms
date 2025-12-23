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
  const [toast, setToast] = useState("");

  /* ================= LOAD COURSE FOR EDIT ================= */
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

    if (!data.title.trim()) {
      e.title = "Course title is required";
    } else if (data.title.length < 5) {
      e.title = "Title must be at least 5 characters";
    } else {
      const exists = courses.some(
        (c) =>
          c.title.toLowerCase() === data.title.toLowerCase() &&
          String(c.id) !== String(editId)
      );
      if (exists) e.title = "Course title already exists";
    }

    if (!data.category.trim()) {
      e.category = "Category is required";
    }

    if (!data.duration.trim()) {
      e.duration = "Duration is required";
    }

    if (!data.level) {
      e.level = "Please select course level";
    }

    if (!data.mode) {
      e.mode = "Please select course mode";
    }

    if (data.price && isNaN(data.price)) {
      e.price = "Price must be a number";
    }

    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm(emptyForm);
    setErrors({});
    setTouched({});
  };

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

    if (Object.keys(validationErrors).length > 0) {
      setToast("❌ Please fix validation errors");
      return;
    }

    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    if (editId) {
      const updated = courses.map((c) =>
        c.id === Number(editId) ? { ...form, id: c.id } : c
      );
      localStorage.setItem("courses", JSON.stringify(updated));
      setToast("✅ Course updated successfully");
    } else {
      localStorage.setItem(
        "courses",
        JSON.stringify([...courses, { ...form, id: Date.now() }])
      );
      setToast("🎉 Course added successfully");
    }

    setTimeout(() => navigate("/admin/courses"), 1500);
  };

  return (
    <div className="max-w-3xl space-y-6 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/courses")}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold">
            {editId ? "Edit Course" : "Add New Course"}
          </h2>
          <p className="text-sm text-gray-600">
            {editId
              ? "Update course details"
              : "Create and configure a training course"}
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Course Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, title: true })}
            error={touched.title && errors.title}
            placeholder="Full Stack Web Development"
          />

          <Input
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, category: true })}
            error={touched.category && errors.category}
            placeholder="IT, AI & ML, Cloud"
          />

          <Input
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, duration: true })}
            error={touched.duration && errors.duration}
            placeholder="6 Months / 24 Weeks"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Course Level"
              name="level"
              value={form.level}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, level: true })}
              error={touched.level && errors.level}
              options={["Beginner", "Intermediate", "Advanced"]}
            />

            <Select
              label="Mode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, mode: true })}
              error={touched.mode && errors.mode}
              options={["Online", "Offline", "Hybrid"]}
            />
          </div>

          <Input
            label="Price (Optional)"
            name="price"
            value={form.price}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, price: true })}
            error={touched.price && errors.price}
            placeholder="e.g. 25000"
          />

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 p-3 rounded-xl bg-white/70 border"
              placeholder="Course objectives, tools, outcomes..."
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
            >
              <FaSave />
              {editId ? "Update Course" : "Save Course"}
            </button>

            {!editId && (
              <button
                type="button"
                onClick={clearForm}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold"
              >
                <FaEraser /> Clear
              </button>
            )}
          </div>

        </form>
      </GlassCard>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= SHARED UI ================= */

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className={`w-full mt-1 p-3 rounded-xl bg-white/70 border ${
        error ? "border-red-400" : ""
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
      className={`w-full mt-1 p-3 rounded-xl bg-white/70 border ${
        error ? "border-red-400" : ""
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

const GlassCard = ({ children }) => (
  <div className="bg-white/40 backdrop-blur-[24px] border border-white/40 rounded-3xl p-6 shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
    {children}
  </div>
);
