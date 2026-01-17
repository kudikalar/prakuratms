import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaUser,
  FaEnvelope,
  FaBookOpen,
  FaUsers,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

/* ================= STORAGE KEYS ================= */
const USERS_KEY = "users";
const COURSES_KEY = "PRAKURA_COURSES";
const BATCHES_KEY = "batches";

/* ================= HELPERS ================= */
const normalizeId = (v) => (v == null ? "" : String(v));

const normalizeBatches = (raw = []) =>
  raw.map((b) => ({
    ...b,
    id: normalizeId(b.id),
    courseId:
      typeof b.courseId === "object"
        ? normalizeId(b.courseId._id)
        : normalizeId(b.courseId),
  }));

/* ================= DEFAULT ================= */
const emptyStudent = {
  id: "",
  studentCode: "",
  name: "",
  email: "",
  courseId: "",
  batchId: "",
};

/* ================= STUDENT CODE ================= */
const generateStudentCode = (students = []) => {
  const prefix = "PKR-STU-";
  const last =
    students
      .map((s) => s.studentCode)
      .filter(Boolean)
      .map((c) => Number(c.replace(prefix, "")))
      .sort((a, b) => b - a)[0] || 0;

  return `${prefix}${String(last + 1).padStart(4, "0")}`;
};

/* ================= MAIN ================= */
export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [form, setForm] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });

  /* ================= LOAD ================= */
  useEffect(() => {
    const users =
      JSON.parse(localStorage.getItem(USERS_KEY)) || { students: [] };

    const coursesLS =
      JSON.parse(localStorage.getItem(COURSES_KEY)) || [];

    const batchesLS =
      JSON.parse(localStorage.getItem(BATCHES_KEY)) || [];

    const normalizedBatches = normalizeBatches(batchesLS);

    setStudents(users.students || []);
    setCourses(coursesLS);
    setBatches(normalizedBatches);

    localStorage.setItem(
      BATCHES_KEY,
      JSON.stringify(normalizedBatches)
    );
  }, []);

  /* ================= LOOKUPS ================= */
  const getCourseById = (id) =>
    courses.find((c) => normalizeId(c._id) === normalizeId(id));

  const getBatchById = (id) =>
    batches.find((b) => normalizeId(b.id) === normalizeId(id));

  /* ================= FILTERED BATCHES ================= */
  const availableBatches = useMemo(() => {
    if (!form.courseId) return [];
    return batches.filter(
      (b) => normalizeId(b.courseId) === normalizeId(form.courseId)
    );
  }, [form.courseId, batches]);

  /* ================= SAVE ================= */
  const saveStudent = () => {
    if (!form.name || !form.email || !form.courseId || !form.batchId) {
      setToast({ show: true, message: "❌ All fields required" });
      return;
    }

    const users =
      JSON.parse(localStorage.getItem(USERS_KEY)) || { students: [] };

    const duplicate = users.students.some(
      (s) =>
        s.email.toLowerCase() === form.email.toLowerCase() &&
        normalizeId(s.id) !== normalizeId(editingId)
    );

    if (duplicate) {
      setToast({ show: true, message: "⚠️ Email already exists" });
      return;
    }

    let updated;

    if (editingId) {
      updated = users.students.map((s) =>
        normalizeId(s.id) === normalizeId(editingId)
          ? { ...form, id: s.id }
          : s
      );
      setToast({ show: true, message: "✅ Student updated" });
    } else {
      updated = [
        ...users.students,
        {
          ...form,
          id: Date.now().toString(),
          studentCode: generateStudentCode(users.students),
        },
      ];
      setToast({ show: true, message: "✅ Student added" });
    }

    users.students = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    setStudents(updated);
    setForm(emptyStudent);
    setEditingId(null);
  };

  /* ================= EDIT ================= */
  const startEdit = (s) => {
    setForm({
      ...s,
      id: normalizeId(s.id),
      courseId: normalizeId(s.courseId),
      batchId: normalizeId(s.batchId),
    });
    setEditingId(normalizeId(s.id));
  };

  /* ================= DELETE ================= */
  const requestDelete = (id) => {
    setDeleteId(normalizeId(id));
    setShowDelete(true);
  };

  const confirmDelete = () => {
    const users =
      JSON.parse(localStorage.getItem(USERS_KEY)) || { students: [] };

    const updated = users.students.filter(
      (s) => normalizeId(s.id) !== normalizeId(deleteId)
    );

    users.students = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    setStudents(updated);
    setShowDelete(false);
    setDeleteId(null);

    setToast({ show: true, message: "🗑️ Student deleted" });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 sm:p-6 md:p-8 animate-fadeIn
      bg-gradient-to-br from-indigo-50 via-orange-50 to-pink-50
      rounded-[36px] shadow-[0_40px_120px_rgba(79,70,229,0.2)]">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold
          bg-gradient-to-r from-indigo-600 to-orange-500
          bg-clip-text text-transparent">
          Students
        </h2>
        <p className="text-sm text-slate-500">
          Create, update and manage student records
        </p>
      </div>

      {/* FORM */}
      <GlassCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <Field icon={<FaUser />} placeholder="Student Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })} />

          <Field icon={<FaEnvelope />} placeholder="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })} />

          <Select icon={<FaBookOpen />} value={form.courseId}
            onChange={(v) => setForm({ ...form, courseId: v, batchId: "" })}
            placeholder="Select Course"
            options={courses.map((c) => ({
              value: normalizeId(c._id),
              label: c.title,
            }))} />

          <Select icon={<FaUsers />} value={form.batchId}
            disabled={!form.courseId}
            onChange={(v) => setForm({ ...form, batchId: v })}
            placeholder={form.courseId ? "Select Batch" : "Select course first"}
            options={availableBatches.map((b) => ({
              value: normalizeId(b.id),
              label: b.name,
            }))} />

          <button
            onClick={saveStudent}
            className="h-[46px] w-full rounded-full px-6 font-semibold text-white
              bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500
              hover:scale-[1.02] active:scale-[0.98]
              shadow-[0_15px_40px_rgba(79,70,229,0.45)]
              transition">
            <FaPlus className="inline mr-1" />
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </GlassCard>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <GlassCard>
          <table className="w-full text-sm">
            <thead className="bg-white/60 text-slate-700">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Batch</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-indigo-50/40">
                  <td className="p-3 font-semibold text-indigo-600">{s.studentCode}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{getCourseById(s.courseId)?.title || "—"}</td>
                  <td>{getBatchById(s.batchId)?.name || "—"}</td>
                  <td className="text-right space-x-2">
                    <IconBtn onClick={() => startEdit(s)} color="indigo">
                      <FaEdit />
                    </IconBtn>
                    <IconBtn onClick={() => requestDelete(s.id)} color="rose">
                      <FaTrash />
                    </IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* MOBILE CARDS */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {students.map((s) => (
          <GlassCard key={s.id}>
            <div className="space-y-2">
              <div className="font-semibold text-indigo-600">{s.studentCode}</div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-slate-500">{s.email}</div>
              <div className="text-sm">
                {getCourseById(s.courseId)?.title} · {getBatchById(s.batchId)?.name}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <IconBtn onClick={() => startEdit(s)} color="indigo">
                  <FaEdit />
                </IconBtn>
                <IconBtn onClick={() => requestDelete(s.id)} color="rose">
                  <FaTrash />
                </IconBtn>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <ConfirmModal
        open={showDelete}
        title="Delete Student"
        message="This action cannot be undone. Continue?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDelete(false)}
      />

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
  <div className="bg-white/70 backdrop-blur-2xl border border-white/50
    rounded-3xl p-5 shadow-[0_25px_80px_rgba(0,0,0,0.15)]">
    {children}
  </div>
);

const Field = ({ icon, value, placeholder, onChange }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="glass-input pl-11 h-[46px] w-full"
    />
  </div>
);

const Select = ({
  icon,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="glass-input pl-11 h-[46px] w-full"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const IconBtn = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 text-${color}-700
      hover:bg-${color}-200 transition`}
  >
    {children}
  </button>
);
