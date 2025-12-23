import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaEraser } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../../components/Toast";

export default function AddCourse() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    status: "Active",
  });

  /* ================= LOAD COURSE FOR EDIT ================= */
  useEffect(() => {
    if (editId) {
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const course = courses.find((c) => c.id === Number(editId));
      if (course) setForm(course);
    }
  }, [editId]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      title: "",
      category: "",
      duration: "",
      description: "",
      status: "Active",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    if (editId) {
      // UPDATE COURSE
      const updated = courses.map((c) =>
        c.id === Number(editId) ? { ...form, id: c.id } : c
      );
      localStorage.setItem("courses", JSON.stringify(updated));

      setToast("✅ Course updated successfully");
    } else {
      // ADD COURSE
      const newCourse = { ...form, id: Date.now() };
      localStorage.setItem(
        "courses",
        JSON.stringify([...courses, newCourse])
      );

      setToast("🎉 Course added successfully");
    }

    // ⏳ Delay navigation so toast is visible
    setTimeout(() => {
      navigate("/admin/courses");
    }, 1500);
  };

  return (
    <div className="max-w-3xl space-y-6 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/courses")}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
          title="Back to All Courses"
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
            placeholder="e.g. Full Stack Web Development"
            required
          />

          <Input
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. IT, AI & ML, Cloud Computing"
            required
          />

          <Input
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 6 Months / 24 Weeks"
            required
          />

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 p-3 rounded-xl bg-white/70 border"
              placeholder="Brief description of the course, objectives, and learning outcomes..."
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2
                px-6 py-2.5 rounded-full
                bg-purple-600 hover:bg-purple-700
                text-white font-semibold shadow"
            >
              <FaSave />
              {editId ? "Update Course" : "Save Course"}
            </button>

            {!editId && (
              <button
                type="button"
                onClick={clearForm}
                className="flex items-center gap-2
                  px-6 py-2.5 rounded-full
                  bg-gray-200 hover:bg-gray-300
                  font-semibold"
              >
                <FaEraser /> Clear
              </button>
            )}
          </div>

        </form>
      </GlassCard>

      {/* ================= SUCCESS TOAST ================= */}
      <Toast
        show={!!toast}
        message={toast}
        onClose={() => setToast("")}
      />
    </div>
  );
}

/* ================= SHARED UI ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-3 rounded-xl bg-white/70 border"
    />
  </div>
);

const GlassCard = ({ children }) => (
  <div
    className="
      bg-white/40 backdrop-blur-[24px]
      border border-white/40
      rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
    "
  >
    {children}
  </div>
);
