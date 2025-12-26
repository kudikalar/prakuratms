import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= CONFIG ================= */
const PAGE_SIZE = 10;

const emptyStudent = {
  id: null,
  name: "",
  email: "",
  batchId: "",
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= STATUS ================= */
const getBatchStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);
  if (today < start) return "To Start";
  if (today > end) return "Done";
  return "In Progress";
};

/* ================= COMPONENT ================= */

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [editing, setEditing] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      students: [],
    };
    setStudents(users.students || []);
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  const getBatchById = (id) =>
    batches.find((b) => b.id === Number(id));

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};

    if (!data.name.trim()) {
      e.name = "Student name is required";
    } else if (data.name.length < 3) {
      e.name = "Name must be at least 3 characters";
    }

    if (!data.email.trim()) {
      e.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
      e.email = "Invalid email format";
    } else {
      const exists = students.some(
        (s) =>
          s.email.toLowerCase() === data.email.toLowerCase() &&
          s.id !== data.id
      );
      if (exists) e.email = "Email already exists";
    }

    if (!data.batchId) {
      e.batchId = "Batch is required";
    }

    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= FILTER + SORT ================= */
  const processedStudents = useMemo(() => {
    return students
      .filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const getValue = (s) => {
          if (sort.key === "batch")
            return getBatchById(s.batchId)?.name || "";
          if (sort.key === "status")
            return getBatchStatus(
              getBatchById(s.batchId)?.startDate,
              getBatchById(s.batchId)?.endDate
            );
          return s[sort.key];
        };

        const aVal = getValue(a);
        const bVal = getValue(b);

        return sort.dir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
  }, [students, search, sort, batches]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(processedStudents.length / PAGE_SIZE);
  const paginated = processedStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => setPage(1), [search]);

  /* ================= SAVE ================= */
  const saveStudent = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true, batchId: true });

    if (Object.keys(validationErrors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("users")) || {
      students: [],
    };

    let updated;

    if (editing) {
      updated = users.students.map((s) =>
        s.id === form.id ? form : s
      );
      setToast({ show: true, message: "✅ Student updated" });
    } else {
      updated = [...users.students, { ...form, id: Date.now() }];
      setToast({ show: true, message: "✅ Student added" });
    }

    users.students = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setStudents(updated);
    resetForm();

    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  /* ================= DELETE ================= */
  const deleteStudent = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      students: [],
    };

    const updated = users.students.filter(
      (s) => s.id !== confirmId
    );

    users.students = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setStudents(updated);
    setConfirmId(null);

    setToast({ show: true, message: "🗑️ Student deleted" });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const resetForm = () => {
    setForm(emptyStudent);
    setEditing(false);
    setErrors({});
    setTouched({});
  };

  const toggleSort = (key) => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        max-w-6xl space-y-6 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      <h2 className="text-2xl font-bold text-slate-800">Students</h2>

      {/* SEARCH */}
      <GlassCard compact>
        <input
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input"
        />
      </GlassCard>

      {/* FORM */}
      <GlassCard compact>
        <div className="grid md:grid-cols-4 gap-3 items-start">
          <Field
            value={form.name}
            placeholder="Name"
            error={errors.name}
            touched={touched.name}
            onChange={(v) => {
              setForm({ ...form, name: v });
              setTouched((t) => ({ ...t, name: true }));
            }}
          />

          <Field
            value={form.email}
            placeholder="Email"
            error={errors.email}
            touched={touched.email}
            onChange={(v) => {
              setForm({ ...form, email: v });
              setTouched((t) => ({ ...t, email: true }));
            }}
          />

          <div>
            <select
              value={form.batchId}
              onChange={(e) => {
                setForm({ ...form, batchId: e.target.value });
                setTouched((t) => ({ ...t, batchId: true }));
              }}
              className="glass-input"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.batchId && touched.batchId && (
              <p className="text-xs text-red-600 mt-1">
                {errors.batchId}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <ActionBtn onClick={saveStudent}>
              <FaPlus /> {editing ? "Update" : "Add"}
            </ActionBtn>
            {editing && (
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-full bg-white/70"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard>
        <table className="w-full text-sm">
          <thead className="bg-white/50">
            <tr>
              {["name", "email", "batch", "status"].map((c) => (
                <th
                  key={c}
                  onClick={() => toggleSort(c)}
                  className="cursor-pointer px-2 py-2"
                >
                  <span className="flex items-center gap-1 capitalize">
                    {c} <FaSort className="text-xs opacity-60" />
                  </span>
                </th>
              ))}
              <th className="text-right px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => {
              const batch = getBatchById(s.batchId);
              const status = getBatchStatus(
                batch?.startDate,
                batch?.endDate
              );
              return (
                <tr key={s.id} className="border-b hover:bg-white/30">
                  <td
                    className="px-2 py-2 text-purple-700 font-medium cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/users/students/${s.id}`)
                    }
                  >
                    {s.name}
                  </td>
                  <td className="px-2">{s.email}</td>
                  <td className="px-2">{batch?.name || "—"}</td>
                  <td className="px-2">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-2 text-right">
                    <IconBtn onClick={() => { setForm(s); setEditing(true); }}>
                      <FaEdit />
                    </IconBtn>
                    <IconBtn danger onClick={() => setConfirmId(s.id)}>
                      <FaTrash />
                    </IconBtn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-full text-xs ${
                page === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-white/60"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {confirmId && (
        <ConfirmModal
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteStudent}
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

/* ================= SMALL COMPONENTS ================= */

const Field = ({ value, placeholder, error, touched, onChange }) => (
  <div>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="glass-input"
    />
    {error && touched && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

const ActionBtn = ({ children, ...props }) => (
  <button
    {...props}
    className="
      flex items-center gap-2 px-5 py-2 rounded-full
      bg-gradient-to-r from-purple-600 to-indigo-600
      hover:from-purple-700 hover:to-indigo-700
      text-white text-sm font-semibold shadow
    "
  >
    {children}
  </button>
);

const IconBtn = ({ children, danger, ...props }) => (
  <button
    {...props}
    className={`p-2 rounded-full ${
      danger
        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
    }`}
  >
    {children}
  </button>
);

const StatusBadge = ({ status }) => {
  const map = {
    "To Start": "bg-yellow-200 text-yellow-800",
    "In Progress": "bg-blue-200 text-blue-800",
    Done: "bg-green-200 text-green-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-5 w-72 space-y-3 shadow-xl">
      <h3 className="font-semibold">Delete Student?</h3>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1 bg-gray-100 rounded">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  </div>
);

const GlassCard = ({ children, compact }) => (
  <div
    className={`bg-white/40 backdrop-blur-[24px]
      border border-white/40 rounded-2xl shadow
      ${compact ? "p-3" : "p-5"}`}
  >
    {children}
  </div>
);
