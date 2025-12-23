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

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [editing, setEditing] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  /* LOAD */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || { students: [] };
    setStudents(users.students || []);
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  const getBatchById = (id) => batches.find((b) => b.id === Number(id));

  /* FILTER + SORT */
  const processedStudents = useMemo(() => {
    return students
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const aVal =
          sort.key === "batch"
            ? getBatchById(a.batchId)?.name || ""
            : sort.key === "status"
            ? getBatchStatus(
                getBatchById(a.batchId)?.startDate,
                getBatchById(a.batchId)?.endDate
              )
            : a[sort.key];

        const bVal =
          sort.key === "batch"
            ? getBatchById(b.batchId)?.name || ""
            : sort.key === "status"
            ? getBatchStatus(
                getBatchById(b.batchId)?.startDate,
                getBatchById(b.batchId)?.endDate
              )
            : b[sort.key];

        return sort.dir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
  }, [students, search, sort, batches]);

  /* PAGINATION */
  const totalPages = Math.ceil(processedStudents.length / PAGE_SIZE);
  const paginated = processedStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => setPage(1), [search]);

  /* SAVE */
  const saveStudent = () => {
    if (!form.name || !form.email || !form.batchId) {
      setToast("⚠️ Fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || { students: [] };
    let updated;

    if (editing) {
      updated = users.students.map((s) =>
        s.id === form.id ? form : s
      );
      setToast("✅ Student updated");
    } else {
      updated = [...users.students, { ...form, id: Date.now() }];
      setToast("✅ Student added");
    }

    users.students = updated;
    localStorage.setItem("users", JSON.stringify(users));
    setStudents(updated);
    setForm(emptyStudent);
    setEditing(false);
  };

  const deleteStudent = () => {
    const users = JSON.parse(localStorage.getItem("users"));
    const updated = users.students.filter((s) => s.id !== confirmId);
    users.students = updated;
    localStorage.setItem("users", JSON.stringify(users));
    setStudents(updated);
    setConfirmId(null);
    setToast("🗑️ Student deleted");
  };

  const toggleSort = (key) => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="max-w-6xl space-y-4 text-gray-800">

      {/* HEADER */}
      <h2 className="text-2xl font-bold">Students</h2>

      {/* SEARCH (SMALLER) */}
      <GlassCard compact>
        <input
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-white/70 border border-white/50 focus:ring-2 focus:ring-purple-300 outline-none"
        />
      </GlassCard>

      {/* ADD STUDENT (COMPACT + SMALL BUTTON) */}
      <GlassCard compact>
        <div className="grid md:grid-cols-4 gap-3 items-center">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select
  value={form.batchId}
  onChange={(e) => setForm({ ...form, batchId: e.target.value })}
  className="
    w-full
    px-3 py-2
    text-sm
    rounded-xl
    bg-white/60 backdrop-blur-md
    border border-white/50
    shadow-inner
    text-gray-700
    focus:outline-none
    focus:ring-2 focus:ring-purple-400/60
    focus:border-purple-400
    transition-all duration-200
    hover:bg-white/70
    appearance-none
    cursor-pointer
  "
>
  <option value="" className="text-gray-400">
    Select Batch
  </option>
  {batches.map((b) => (
    <option key={b.id} value={b.id}>
      {b.name}
    </option>
  ))}
</select>


          <button
            onClick={saveStudent}
            className="
              flex items-center justify-center gap-1
              px-3 py-1.5
              text-xs font-semibold
              rounded-full
              bg-purple-600 hover:bg-purple-700
              text-white
              shadow-md transition
            "
          >
            <FaPlus className="text-[10px]" />
            {editing ? "Update" : "Add"}
          </button>
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard>
        <table className="w-full text-sm">
          <thead className="bg-white/50 backdrop-blur border-b text-gray-600">
            <tr>
              {["name", "email", "batch", "status"].map((col) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="py-2 px-2 cursor-pointer hover:text-purple-600"
                >
                  <span className="flex items-center gap-1 capitalize">
                    {col} <FaSort className="text-xs opacity-60" />
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
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-white/30 transition"
                >
                  <td
                    className="py-2 px-2 font-medium text-purple-700 cursor-pointer"
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
                  <td className="text-right px-2 space-x-2">
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                page === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-white/60 hover:bg-white/80"
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

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`
      w-full
      px-3 py-2
      text-sm
      rounded-xl
      bg-white/60 backdrop-blur-md
      border border-white/50
      shadow-inner
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2 focus:ring-purple-400/60
      focus:border-purple-400
      transition-all duration-200
      hover:bg-white/70
      ${className}
    `}
  />
);


const IconBtn = ({ children, danger, ...props }) => (
  <button
    {...props}
    className={`
      p-1.5 rounded-full transition
      ${danger
        ? "bg-red-100 text-red-600 hover:bg-red-200"
        : "bg-blue-100 text-blue-600 hover:bg-blue-200"}
    `}
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
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-200"}`}>
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

/* ================= GLASS ================= */

const GlassCard = ({ children, compact }) => (
  <div
    className={`bg-white/40 backdrop-blur-[24px] border border-white/40 rounded-2xl shadow ${
      compact ? "p-3" : "p-5"
    }`}
  >
    {children}
  </div>
);

/* ================= INPUT STYLE ================= */
