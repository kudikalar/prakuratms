import { useEffect, useMemo, useState } from "react";
import {
  FaWhatsapp,
  FaEdit,
  FaCheck,
  FaTimes,
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
        batchStatus: batch?.status || "RUNNING",
        total,
        paid,
        due,
        lastPayment: p.lastPayment || "—",
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
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Payments Overview
        </h2>
        <p className="text-sm text-slate-600">
          Course & batch wise fee tracking
        </p>
      </div>

      {/* FILTERS */}
      <GlassCard>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
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
            className="bg-white/60 rounded-xl px-4"
          >
            Reset
          </button>
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th>Student</th>
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
              <tr key={s.id} className="border-b">
                <td>{s.name}</td>
                <td>{s.courseName}</td>
                <td>{s.batchName}</td>
                <td>₹{s.total}</td>
                <td className="text-emerald-600">₹{s.paid}</td>
                <td className="text-red-600">₹{s.due}</td>
                <td>
                  <StatusBadge status={s.status} />
                </td>
                <td className="flex gap-3">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="text-purple-600"
                  >
                    Add
                  </button>
                  {s.status !== "PAID" && (
                    <button
                      onClick={() => sendWhatsAppReminder(s)}
                      className="text-green-600"
                    >
                      <FaWhatsapp />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between font-semibold text-sm">
          <span>Total: ₹{totalFee}</span>
          <span className="text-emerald-600">
            Collected: ₹{totalPaid}
          </span>
          <span className="text-red-600">
            Pending: ₹{totalDue}
          </span>
        </div>
      </GlassCard>

      {/* RUNNING BATCH SUMMARY */}
      <GlassCard>
        <h3 className="font-semibold mb-4">
          Running Batches – Payment Summary
        </h3>

        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th>Batch</th>
              <th>Students</th>
              <th>Collected</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {batches
              .filter((b) => b.status === "RUNNING")
              .map((b) => {
                const batchStudents = rows.filter(
                  (r) => r.batchId === (b._id || b.id)
                );
                const collected = batchStudents.reduce(
                  (a, s) => a + s.paid,
                  0
                );
                const due = batchStudents.reduce(
                  (a, s) => a + s.due,
                  0
                );

                return (
                  <tr key={b._id || b.id} className="border-b">
                    <td>{b.name}</td>
                    <td className="text-center">
                      {batchStudents.length}
                    </td>
                    <td className="text-emerald-600 text-center">
                      ₹{collected}
                    </td>
                    <td className="text-red-600 text-center">
                      ₹{due}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </GlassCard>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm">
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
                  ? "bg-purple-600 text-white"
                  : "bg-white/60"
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
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow">
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === "PAID"
          ? "bg-green-200 text-green-800"
          : status === "OVERDUE"
          ? "bg-red-200 text-red-800"
          : "bg-yellow-200 text-yellow-800"
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-96 rounded-3xl p-6 space-y-4">
        <h3 className="font-semibold">Add Payment</h3>

        <div className="text-sm space-y-2">
          <Row label="Total Fee">
            {!editingTotal ? (
              <span>₹{total}</span>
            ) : (
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
              />
            )}
            <button onClick={() => setEditingTotal(!editingTotal)}>
              <FaEdit />
            </button>
          </Row>

          <Row label="Paid">
            <span className="text-emerald-600">
              ₹{student.paid}
            </span>
          </Row>

          <Row label="Due">
            <span className="text-red-600">₹{due}</span>
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

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
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
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      {children}
    </div>
  );
}
