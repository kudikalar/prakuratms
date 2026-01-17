import { useEffect, useMemo, useState } from "react";
import {
  FaWhatsapp,
  FaEdit,
} from "react-icons/fa";

/* ================= CONFIG ================= */
const PAGE_SIZE = 5;
const DEFAULT_TOTAL_FEE = 45000;

/* ================= STORAGE HELPERS ================= */
const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || { students: [] };

const getPayments = () =>
  JSON.parse(localStorage.getItem("payments")) || {};

const savePayments = (data) =>
  localStorage.setItem("payments", JSON.stringify(data));

const getCourses = () =>
  JSON.parse(localStorage.getItem("PRAKURA_COURSES")) || [];

const getBatches = () =>
  JSON.parse(localStorage.getItem("batches")) || [];

/* ================= PAGE ================= */
export default function Payments() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [page, setPage] = useState(1);
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");

  const courses = getCourses();
  const batches = getBatches();

  /* ================= LOAD & NORMALIZE ================= */
  useEffect(() => {
    const users = getUsers();
    const storedPayments = getPayments();
    const updated = { ...storedPayments };

    users.students.forEach((s) => {
      if (!updated[s.id]) {
        updated[s.id] = {
          total: DEFAULT_TOTAL_FEE,
          paid: 0,
          deadline: "",
          lastPayment: null,
          history: [],
        };
      }
    });

    savePayments(updated);
    setPayments(updated);
    setStudents(users.students || []);
  }, []);

  /* ================= MERGED ROWS ================= */
  const rows = useMemo(() => {
    return students.map((s) => {
      const p = payments[s.id] || {};
      const total = p.total || DEFAULT_TOTAL_FEE;
      const paid = p.paid || 0;
      const due = total - paid;

      const course = courses.find((c) => c._id === s.courseId);
      const batch = batches.find(
        (b) => (b._id || b.id) === s.batchId
      );

      const status =
        due === 0
          ? "PAID"
          : p.deadline && new Date(p.deadline) < new Date()
          ? "OVERDUE"
          : "PARTIAL";

      return {
        ...s,
        phone: s.phone || "—",
        courseId: s.courseId,
        batchId: s.batchId,
        courseName: course?.title || "—",
        batchName: batch?.name || "—",
        total,
        paid,
        due,
        status,
      };
    });
  }, [students, payments, courses, batches]);

  /* ================= FILTER ================= */
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const courseMatch =
        courseFilter === "ALL" || r.courseId === courseFilter;
      const batchMatch =
        batchFilter === "ALL" || r.batchId === batchFilter;
      return courseMatch && batchMatch;
    });
  }, [rows, courseFilter, batchFilter]);

  /* ================= PAGINATION ================= */
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filteredRows.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  /* ================= TOTALS ================= */
  const totalFee = filteredRows.reduce((a, b) => a + b.total, 0);
  const totalPaid = filteredRows.reduce((a, b) => a + b.paid, 0);
  const totalDue = totalFee - totalPaid;

  /* ================= SAVE PAYMENT ================= */
  const savePayment = ({ studentId, amount, total, date, mode }) => {
    const updated = { ...payments };
    const p = updated[studentId];

    p.total = total;
    p.paid += Number(amount);
    p.lastPayment = date;
    p.history.push({ amount, date, mode });

    savePayments(updated);
    setPayments(updated);
    setSelectedStudent(null);
  };

  /* ================= WHATSAPP ================= */
  const sendWhatsAppReminder = (s) => {
    if (!s.phone || s.phone === "—") return;
    const msg = `Hello ${s.name}, your pending fee is ₹${s.due}. Please complete payment.`;
    window.open(
      `https://wa.me/91${s.phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  /* ================= UI ================= */
  return (
    <div className="relative max-w-7xl mx-auto space-y-10 pb-28 text-slate-100 animate-fadeIn">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* HEADER */}
      <div className="glass-panel bg-white/70 text-slate-900 shadow-[0_40px_120px_rgba(99,102,241,0.35)]">
        <h2 className="text-2xl font-bold">Payments Overview</h2>
        <p className="text-sm text-slate-600">
          Course & batch wise fee tracking
        </p>
      </div>

      {/* FILTERS */}
      <GlassCard>
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setBatchFilter("ALL");
              setPage(1);
            }}
            className="glass-input"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={batchFilter}
            disabled={courseFilter === "ALL"}
            onChange={(e) => {
              setBatchFilter(e.target.value);
              setPage(1);
            }}
            className="glass-input"
          >
            <option value="ALL">All Batches</option>
            {batches
              .filter(
                (b) =>
                  courseFilter === "ALL" ||
                  b.courseId === courseFilter
              )
              .map((b) => (
                <option key={b._id || b.id} value={b._id || b.id}>
                  {b.name}
                </option>
              ))}
          </select>

          <button
            onClick={() => {
              setCourseFilter("ALL");
              setBatchFilter("ALL");
              setPage(1);
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-900">
            <thead className="bg-slate-200/70 uppercase text-xs text-slate-700">
              <tr>
                <th className="text-left py-3 px-2">Student</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/40 hover:bg-indigo-100/40 transition"
                >
                  <td className="py-3 font-medium">{s.name}</td>
                  <td>{s.courseName}</td>
                  <td>{s.batchName}</td>
                  <td>₹{s.total}</td>
                  <td className="text-emerald-600 font-bold">
                    ₹{s.paid}
                  </td>
                  <td className="text-rose-600 font-bold">
                    ₹{s.due}
                  </td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="flex gap-3">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                    >
                      Add
                    </button>
                    {s.status !== "PAID" && (
                      <button
                        onClick={() => sendWhatsAppReminder(s)}
                        className="text-green-600 hover:scale-110 transition"
                      >
                        <FaWhatsapp />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="mt-6 flex justify-between bg-slate-100/70 rounded-xl p-4 text-sm font-bold text-slate-800">
          <span>Total: ₹{totalFee}</span>
          <span className="text-emerald-600">
            Collected: ₹{totalPaid}
          </span>
          <span className="text-rose-600">
            Pending: ₹{totalDue}
          </span>
        </div>
      </GlassCard>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm text-slate-300">
        <span>
          Showing {start + 1}–
          {Math.min(start + PAGE_SIZE, filteredRows.length)} of{" "}
          {filteredRows.length}
        </span>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white/60 text-slate-900"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {selectedStudent && (
        <AddPaymentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={savePayment}
        />
      )}
    </div>
  );
}

/* ================= UI ================= */

function GlassCard({ children }) {
  return (
    <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === "PAID"
          ? "bg-emerald-100 text-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
          : status === "OVERDUE"
          ? "bg-rose-100 text-rose-800 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
          : "bg-amber-100 text-amber-800 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
      }`}
    >
      {status}
    </span>
  );
}

/* ================= MODAL ================= */

function AddPaymentModal({ student, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");
  const [editingTotal, setEditingTotal] = useState(false);
  const [total, setTotal] = useState(student.total);

  const due = total - student.paid;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-2xl w-96 rounded-3xl p-6 space-y-4 shadow-2xl">
        <h3 className="font-semibold text-lg">Add Payment</h3>

        <div className="text-sm space-y-2">
          <Row label="Total Fee">
            {!editingTotal ? (
              <span>₹{total}</span>
            ) : (
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                className="glass-input w-24"
              />
            )}
            <button onClick={() => setEditingTotal(!editingTotal)}>
              <FaEdit />
            </button>
          </Row>

          <Row label="Paid">
            <span className="text-emerald-600 font-bold">
              ₹{student.paid}
            </span>
          </Row>

          <Row label="Due">
            <span className="text-rose-600 font-bold">
              ₹{due}
            </span>
          </Row>
        </div>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="glass-input w-full"
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="glass-input w-full"
        >
          <option>UPI</option>
          <option>Cash</option>
          <option>Card</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                studentId: student.id,
                amount,
                total,
                mode,
                date: new Date().toISOString().slice(0, 10),
              })
            }
            className="btn-primary"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-slate-600">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
