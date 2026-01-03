import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Toast from "../../../components/Toast";

const COURSES_KEY = "PRAKURA_COURSES";

/* ================= DEFAULTS ================= */

const emptyEducator = {
  id: null,
  name: "",
  email: "",
  course: "",
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= COMPONENT ================= */

export default function Educators() {
  const [educators, setEducators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyEducator);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  /* ================= LOAD DATA ================= */
useEffect(() => {
  const users = JSON.parse(localStorage.getItem("users")) || {
    admins: [],
    educators: [],
    students: [],
  };

  let storedCourses =
    JSON.parse(localStorage.getItem(COURSES_KEY)) || [];

  // 🔐 fallback if storage wiped accidentally
  if (!storedCourses.length) {
    console.warn("Courses missing from storage");
  }

  setEducators(users.educators || []);
  setCourses(storedCourses);
}, []);


  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};

    if (!data.name.trim()) {
      e.name = "Educator name is required";
    } else if (data.name.length < 3) {
      e.name = "Name must be at least 3 characters";
    }

    if (!data.email.trim()) {
      e.email = "Email address is required";
    } else if (!isValidEmail(data.email)) {
      e.email = "Enter a valid email address";
    } else {
      const exists = educators.some(
        (ed) =>
          ed.email.toLowerCase() === data.email.toLowerCase() &&
          ed.id !== data.id
      );
      if (exists) e.email = "Email already exists";
    }

    if (!data.course) {
      e.course = "Please assign a course";
    }

    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= SAVE ================= */
  const saveEducator = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true, course: true });

    if (Object.keys(validationErrors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    let updated;

    if (editing) {
      updated = users.educators.map((e) =>
        e.id === form.id ? form : e
      );
      setToast({ show: true, message: "✅ Educator updated successfully" });
    } else {
      updated = [...users.educators, { ...form, id: Date.now() }];
      setToast({ show: true, message: "✅ Educator added successfully" });
    }

    users.educators = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setEducators(updated);
    resetForm();

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  /* ================= EDIT ================= */
  const startEdit = (educator) => {
    setForm(educator);
    setEditing(true);
    setErrors({});
    setTouched({});
  };

  /* ================= DELETE ================= */
  const deleteEducator = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    const updated = users.educators.filter(
      (e) => e.id !== confirmId
    );

    users.educators = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setEducators(updated);
    setConfirmId(null);

    setToast({ show: true, message: "🗑️ Educator deleted" });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  const resetForm = () => {
    setForm(emptyEducator);
    setEditing(false);
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
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Educators
        </h2>
        <p className="text-sm text-slate-600">
          Manage educators and assign courses
        </p>
      </div>

      {/* FORM */}
      <GlassCard>
        <div className="grid md:grid-cols-3 gap-4">
          {/* NAME */}
          <div>
            <input
              placeholder="Educator Name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setTouched((t) => ({ ...t, name: true }));
              }}
              className="glass-input"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setTouched((t) => ({ ...t, email: true }));
              }}
              className="glass-input"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* COURSE */}
          <div>
            <select
              value={form.course}
              onChange={(e) => {
                setForm({ ...form, course: e.target.value });
                setTouched((t) => ({ ...t, course: true }));
              }}
              className="glass-input"
            >
              <option value="">Assign Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.course && touched.course && (
              <p className="mt-1 text-xs text-red-600">
                {errors.course}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={saveEducator}
            className="
              flex items-center gap-2 px-7 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              shadow-lg transition
            "
          >
            <FaPlus />
            {editing ? "Update Educator" : "Add Educator"}
          </button>

          {editing && (
            <button
              onClick={resetForm}
              className="
                px-6 py-3 rounded-full
                bg-white/70 border border-white/50
                text-slate-700 flex items-center gap-2
              "
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>
      </GlassCard>

      {/* LIST */}
      <div className="grid gap-4">
        {educators.map((e) => (
          <GlassCard key={e.id} className="glass-hover">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {e.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {e.email}
                </p>
                <span className="text-xs text-purple-700">
                  Course: {e.course}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(e)}
                  className="
                    p-2.5 rounded-full
                    bg-indigo-100 text-indigo-600
                    hover:bg-indigo-200 transition
                  "
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmId(e.id)}
                  className="
                    p-2.5 rounded-full
                    bg-rose-100 text-rose-600
                    hover:bg-rose-200 transition
                  "
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* DELETE CONFIRM */}
      {confirmId && (
        <ConfirmModal
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteEducator}
        />
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/40 backdrop-blur-[24px]
      border border-white/40 rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
      ${className}`}
  >
    {children}
  </div>
);

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="relative glass-card w-80 animate-scaleIn">
      <h3 className="font-semibold text-lg text-slate-800">
        Delete Educator?
      </h3>
      <p className="text-sm text-slate-600 mt-1">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg
          bg-white/60 border border-white/50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg
          bg-red-600 hover:bg-red-700
          text-white font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
