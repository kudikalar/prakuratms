import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaUser,
  FaEnvelope,
  FaBookOpen,
  FaUsers,
  FaTrash,
} from "react-icons/fa";
import Toast from "../../../components/Toast";

/* ================= STORAGE KEYS ================= */
const USERS_KEY = "users";
const COURSES_KEY = "PRAKURA_COURSES";
const BATCHES_KEY = "batches";

/* ================= DEFAULT ================= */
const emptyStudent = {
  id: null,
  studentCode: "",
  name: "",
  email: "",
  courseId: "",
  batchId: "",
};

/* ================= STUDENT CODE GENERATOR ================= */
const generateStudentCode = (students = []) => {
  const prefix = "PKR-STU-";
  const lastNumber =
    students
      .map((s) => s.studentCode)
      .filter(Boolean)
      .map((c) => parseInt(c.replace(prefix, ""), 10))
      .sort((a, b) => b - a)[0] || 0;

  return `${prefix}${String(lastNumber + 1).padStart(4, "0")}`;
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [toast, setToast] = useState({ show: false, message: "" });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {
      students: [],
    };

    const coursesLS =
      JSON.parse(localStorage.getItem(COURSES_KEY)) || [];
    const batchesLS =
      JSON.parse(localStorage.getItem(BATCHES_KEY)) || [];

    // normalize old batches (safety)
    const normalizedBatches = batchesLS.map((b) => {
      if (b.courseId) return b;
      const course = coursesLS.find((c) => c.title === b.course);
      return { ...b, courseId: course?._id || "" };
    });

    localStorage.setItem(
      BATCHES_KEY,
      JSON.stringify(normalizedBatches)
    );

    setStudents(users.students || []);
    setCourses(coursesLS);
    setBatches(normalizedBatches);
  }, []);

  /* ================= HELPERS ================= */
  const getCourseById = (id) =>
    courses.find((c) => String(c._id) === String(id));

  const getBatchById = (id) =>
    batches.find((b) => String(b.id) === String(id));

  const availableBatches = useMemo(() => {
    if (!form.courseId) return [];
    return batches.filter(
      (b) => String(b.courseId) === String(form.courseId)
    );
  }, [form.courseId, batches]);

  /* ================= SAVE STUDENT ================= */
  const saveStudent = () => {
    if (!form.name || !form.email || !form.courseId || !form.batchId) {
      setToast({ show: true, message: "❌ All fields required" });
      return;
    }

    const users =
      JSON.parse(localStorage.getItem(USERS_KEY)) || {
        students: [],
      };

    // prevent duplicate email
    const exists = users.students.some(
      (s) => s.email.toLowerCase() === form.email.toLowerCase()
    );
    if (exists) {
      setToast({ show: true, message: "⚠️ Email already exists" });
      return;
    }

    const studentCode = generateStudentCode(users.students);

    const newStudent = {
      ...form,
      id: Date.now(),
      studentCode, // ✅ PERMANENT UNIQUE CODE
    };

    const updated = [...users.students, newStudent];
    users.students = updated;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setStudents(updated);
    setForm(emptyStudent);

    setToast({ show: true, message: "✅ Student added successfully" });
  };

  /* ================= DELETE STUDENT ================= */
  const deleteStudent = (id) => {
    const users =
      JSON.parse(localStorage.getItem(USERS_KEY)) || {
        students: [],
      };

    const updated = users.students.filter((s) => s.id !== id);
    users.students = updated;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setStudents(updated);

    setToast({ show: true, message: "🗑️ Student removed" });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Students</h2>
        <p className="text-sm text-slate-600">
          Create and view student records
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white/50 backdrop-blur-2xl border border-white/40 rounded-3xl p-6 shadow-xl">
        <div className="grid md:grid-cols-5 gap-4 items-end">

          <Field
            icon={<FaUser />}
            placeholder="Student Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Field
            icon={<FaEnvelope />}
            placeholder="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Select
            icon={<FaBookOpen />}
            value={form.courseId}
            onChange={(v) =>
              setForm({ ...form, courseId: v, batchId: "" })
            }
            placeholder="Select Course"
            options={courses.map((c) => ({
              value: c._id,
              label: c.title,
            }))}
          />

          <Select
            icon={<FaUsers />}
            value={form.batchId}
            disabled={!form.courseId}
            onChange={(v) => setForm({ ...form, batchId: v })}
            placeholder={
              form.courseId ? "Select Batch" : "Select Course First"
            }
            options={availableBatches.map((b) => ({
              value: b.id,
              label: b.name,
            }))}
          />

          <button
            onClick={saveStudent}
            className="h-[46px] flex items-center justify-center gap-2 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="bg-white/50 backdrop-blur-2xl border border-white/40 rounded-3xl p-6 shadow-xl">
        <h3 className="font-semibold text-slate-800 mb-4">
          Saved Students
        </h3>

        {students.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No students added yet
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/60">
              <tr>
                <th className="px-3 py-2 text-left">Student Code</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Course</th>
                <th className="px-3 py-2 text-left">Batch</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-white/40">
                  <td className="px-3 py-2 font-semibold text-indigo-600">
                    {s.studentCode}
                  </td>
                  <td className="px-3 py-2 font-medium text-purple-700">
                    {s.name}
                  </td>
                  <td className="px-3 py-2">{s.email}</td>
                  <td className="px-3 py-2">
                    {getCourseById(s.courseId)?.title || "—"}
                  </td>
                  <td className="px-3 py-2">
                    {getBatchById(s.batchId)?.name || "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => deleteStudent(s.id)}
                      className="p-2 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

const Field = ({ icon, value, placeholder, onChange }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="glass-input pl-11 h-[46px]"
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
      className="glass-input pl-11 h-[46px]"
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
