import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

/* ================= CONFIG ================= */
const PAGE_SIZE = 5;
const DEFAULT_TOTAL_FEE = 45000;

/* ================= HELPERS ================= */
const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || { students: [] };

const getPayments = () =>
  JSON.parse(localStorage.getItem("payments")) || {};

const savePayments = (data) =>
  localStorage.setItem("payments", JSON.stringify(data));

/* ================= PAGE ================= */
export default function Payments() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);

  /* LOAD + SYNC */
  useEffect(() => {
    const users = getUsers();
    const storedPayments = getPayments();
    const updated = { ...storedPayments };

    users.students.forEach((s) => {
      if (!updated[s.id]) {
        updated[s.id] = {
          total: DEFAULT_TOTAL_FEE, // ✅ AUTO ₹45,000
          paid: 0,
          deadline: "",
          lastPayment: null,
          history: [],
        };
      }
    });

    savePayments(updated);
    setPayments(updated);
    setStudents(users.students);
  }, []);

  /* MERGED VIEW */
  const rows = useMemo(() => {
    return students.map((s) => {
      const p = payments[s.id] || {};
      const total = p.total || DEFAULT_TOTAL_FEE;
      const paid = p.paid || 0;
      const due = total - paid;

      const status =
        due === 0
          ? "PAID"
          : p.deadline && new Date(p.deadline) < new Date()
          ? "OVERDUE"
          : "PARTIAL";

      return {
        ...s,
        phone: s.phone || "—",
        total,
        paid,
        due,
        lastPayment: p.lastPayment || "—",
        deadline: p.deadline || "—",
        status,
      };
    });
  }, [students, payments]);

  /* PAGINATION */
  const start = (page - 1) * PAGE_SIZE;
  const paginated = rows.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  /* TOTALS */
  const totalFee = rows.reduce((a, b) => a + b.total, 0);
  const totalPaid = rows.reduce((a, b) => a + b.paid, 0);
  const totalDue = totalFee - totalPaid;

  /* SAVE PAYMENT */
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

  /* WHATSAPP */
  const sendWhatsAppReminder = (s) => {
    const msg = `Hello ${s.name}, your pending fee is ₹${s.due}. Please complete payment.`;
    window.open(
      `https://wa.me/91${s.phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payments Overview</h2>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 w-40">Student</th>
              <th className="w-32">Phone</th>
              <th className="w-28">Total</th>
              <th className="w-24">Paid</th>
              <th className="w-24">Due</th>
              <th className="w-32">Last Payment</th>
              <th className="w-28">Status</th>
              <th className="w-28 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{s.name}</td>
                <td>{s.phone}</td>
                <td>₹{s.total}</td>
                <td className="text-emerald-600">₹{s.paid}</td>
                <td className="text-red-600">₹{s.due}</td>
                <td>{s.lastPayment}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : s.status === "OVERDUE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="flex justify-center gap-3">
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

          {/* TOTAL BAR */}
          <tfoot>
            <tr>
              <td colSpan={8}>
                <div className="m-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 backdrop-blur-xl px-6 py-4 flex justify-between font-semibold">
                  <span>Total Fee: ₹{totalFee}</span>
                  <span className="text-emerald-600">
                    Collected: ₹{totalPaid}
                  </span>
                  <span className="text-red-600">
                    Pending: ₹{totalDue}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between text-sm">
        <span>
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} of{" "}
          {rows.length}
        </span>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-purple-600 text-white"
                  : "border"
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

/* ================= MODAL ================= */

function AddPaymentModal({ student, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");

  const [editingTotal, setEditingTotal] = useState(false);
  const [total, setTotal] = useState(student.total);

  const due = total - student.paid;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">Add Payment</h3>

        {/* TOTAL / PAID / DUE */}
        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span>Total Fee</span>
            {!editingTotal ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold">₹{total}</span>
                <button onClick={() => setEditingTotal(true)}>
                  <FaEdit />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  className="w-28 border rounded px-2 py-1"
                />
                <button onClick={() => setEditingTotal(false)}>
                  <FaCheck />
                </button>
                <button onClick={() => setTotal(student.total)}>
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <span>Paid</span>
            <span className="text-emerald-600">₹{student.paid}</span>
          </div>

          <div className="flex justify-between">
            <span>Due</span>
            <span className="text-red-600">₹{due}</span>
          </div>
        </div>

        <input
          type="number"
          placeholder="Payment Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
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
