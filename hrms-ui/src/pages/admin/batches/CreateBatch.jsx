import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../../components/Toast";

export default function CreateBatch() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const [toast, setToast] = useState("");
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    course: "",
    startDate: "",
    endDate: "",
  });

  /* ===== LOAD COURSES FOR DROPDOWN ===== */
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(storedCourses);
  }, []);

  /* ===== LOAD BATCH FOR EDIT ===== */
  useEffect(() => {
    if (editId) {
      const batches = JSON.parse(localStorage.getItem("batches")) || [];
      const batch = batches.find((b) => b.id === Number(editId));
      if (batch) setForm(batch);
    }
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const batches = JSON.parse(localStorage.getItem("batches")) || [];

    if (editId) {
      const updated = batches.map((b) =>
        b.id === Number(editId) ? { ...form, id: b.id } : b
      );
      localStorage.setItem("batches", JSON.stringify(updated));
      setToast("✅ Batch updated successfully");
    } else {
      localStorage.setItem(
        "batches",
        JSON.stringify([...batches, { ...form, id: Date.now() }])
      );
      setToast("🎉 Batch created successfully");
    }

    setTimeout(() => navigate("/admin/batches"), 1500);
  };

  return (
    <div className="max-w-3xl space-y-6 text-gray-800">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/60 shadow"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold">
            {editId ? "Edit Batch" : "Create Batch"}
          </h2>
          <p className="text-sm text-gray-600">
            Batch scheduling and configuration
          </p>
        </div>
      </div>

      {/* FORM */}
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Batch Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. FSD-2025-Morning"
            required
          />

          {/* COURSE DROPDOWN */}
          <div>
            <label className="text-sm font-medium">Course</label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 rounded-xl bg-white/70 border"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />

          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="flex items-center gap-2
              px-6 py-2.5 rounded-full
              bg-purple-600 hover:bg-purple-700
              text-white font-semibold shadow"
          >
            <FaSave />
            {editId ? "Update Batch" : "Save Batch"}
          </button>
        </form>
      </GlassCard>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ===== SHARED UI ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 p-3 rounded-xl bg-white/70 border" />
  </div>
);

const GlassCard = ({ children }) => (
  <div className="
    bg-white/40 backdrop-blur-[24px]
    border border-white/40
    rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]
  ">
    {children}
  </div>
);
