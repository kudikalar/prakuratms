import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaEraser } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= DEFAULT FORM ================= */

const emptyForm = {
  name: "",
  course: "",
  startDate: "",
  endDate: "",
  status: "Upcoming",
  notes: "",
};

export default function CreateBatch() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState("");

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    const storedCourses =
      JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(storedCourses);
  }, []);

  /* ================= LOAD BATCH FOR EDIT ================= */
  useEffect(() => {
    if (editId) {
      const batches =
        JSON.parse(localStorage.getItem("batches")) || [];
      const batch = batches.find(
        (b) => b.id === Number(editId)
      );
      if (batch) setForm(batch);
    }
  }, [editId]);

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};
    const batches =
      JSON.parse(localStorage.getItem("batches")) || [];

    if (!data.name.trim()) {
      e.name = "Batch name is required";
    } else if (data.name.length < 4) {
      e.name = "Batch name must be at least 4 characters";
    } else {
      const exists = batches.some(
        (b) =>
          b.name.toLowerCase() === data.name.toLowerCase() &&
          String(b.id) !== String(editId)
      );
      if (exists) e.name = "Batch name already exists";
    }

    if (!data.course) {
      e.course = "Please select a course";
    }

    if (!data.startDate) {
      e.startDate = "Start date is required";
    }

    if (!data.endDate) {
      e.endDate = "End date is required";
    }

    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        e.endDate = "End date must be after start date";
      }
    }

    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    // Auto status based on dates
    if (name === "startDate" || name === "endDate") {
      const today = new Date().setHours(0, 0, 0, 0);
      const start = new Date(updated.startDate).setHours(0, 0, 0, 0);
      const end = new Date(updated.endDate).setHours(0, 0, 0, 0);

      if (updated.startDate && updated.endDate) {
        if (today < start) updated.status = "Upcoming";
        else if (today > end) updated.status = "Completed";
        else updated.status = "Ongoing";
      }
    }

    setForm(updated);
  };

  const clearForm = () => {
    setForm(emptyForm);
    setErrors({});
    setTouched({});
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      name: true,
      course: true,
      startDate: true,
      endDate: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setToast("❌ Please fix validation errors");
      return;
    }

    const batches =
      JSON.parse(localStorage.getItem("batches")) || [];

    if (editId) {
      const updated = batches.map((b) =>
        b.id === Number(editId)
          ? { ...form, id: b.id }
          : b
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

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
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

      {/* ================= FORM ================= */}
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Batch Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, name: true })}
            error={touched.name && errors.name}
            placeholder="FSD-2025-Morning"
          />

          {/* COURSE */}
          <Select
            label="Course"
            name="course"
            value={form.course}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, course: true })}
            error={touched.course && errors.course}
            options={courses.map((c) => c.title)}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              onBlur={() =>
                setTouched({ ...touched, startDate: true })
              }
              error={touched.startDate && errors.startDate}
            />

            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              onBlur={() =>
                setTouched({ ...touched, endDate: true })
              }
              error={touched.endDate && errors.endDate}
            />
          </div>

          {/* STATUS */}
          <Select
            label="Batch Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["Upcoming", "Ongoing", "Completed"]}
          />

          {/* NOTES */}
          <div>
            <label className="text-sm font-medium">Notes / Remarks</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="w-full mt-1 p-3 rounded-xl bg-white/70 border"
              placeholder="Optional notes for batch planning..."
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
            >
              <FaSave />
              {editId ? "Update Batch" : "Save Batch"}
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
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
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
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
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
