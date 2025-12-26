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
    <div
      className="
        max-w-7xl mx-auto space-y-8 pb-24 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Payments Overview
        </h2>
        <p className="text-sm text-slate-600">
          Track fees, pending dues & payment history
        </p>
      </div>

      {/* ================= MOBILE TOTAL SUMMARY ================= */}
      <div className="md:hidden">
        <GlassCard>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-semibold">
              <span>Total Fee</span>
              <span>₹{totalFee}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-600">
              <span>Collected</span>
              <span>₹{totalPaid}</span>
            </div>
            <div className="flex justify-between font-semibold text-red-600">
              <span>Pending</span>
              <span>₹{totalDue}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginated.map((s) => (
          <GlassCard key={s.id}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{s.name}</h3>
              <StatusBadge status={s.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><b>Phone:</b> {s.phone}</div>
              <div><b>Total:</b> ₹{s.total}</div>
              <div className="text-emerald-600"><b>Paid:</b> ₹{s.paid}</div>
              <div className="text-red-600"><b>Due:</b> ₹{s.due}</div>
              <div className="col-span-2"><b>Last Pay:</b> {s.lastPayment}</div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setSelectedStudent(s)}
                className="text-purple-600 font-semibold"
              >
                Add Payment
              </button>

              {s.status !== "PAID" && (
                <button
                  onClick={() => sendWhatsAppReminder(s)}
                  className="text-green-600 text-xl"
                >
                  <FaWhatsapp />
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-slate-600">
                <tr>
                  <th className="py-3 text-left">Student</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Last Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td>{s.phone}</td>
                    <td className="text-center">₹{s.total}</td>
                    <td className="text-center text-emerald-600">₹{s.paid}</td>
                    <td className="text-center text-red-600">₹{s.due}</td>
                    <td className="text-center">{s.lastPayment}</td>
                    <td className="text-center">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="text-purple-600 font-semibold"
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTAL BAR */}
            <div className="mt-6 flex justify-between font-semibold text-sm">
              <span>Total Fee: ₹{totalFee}</span>
              <span className="text-emerald-600">
                Collected: ₹{totalPaid}
              </span>
              <span className="text-red-600">
                Pending: ₹{totalDue}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm">
        <span>
          Showing {start + 1}–
          {Math.min(start + PAGE_SIZE, rows.length)} of {rows.length}
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
      <div className="bg-white w-96 max-w-[90%] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">Add Payment</h3>

        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
          <Row label="Total Fee">
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
                  className="w-24 border rounded px-2 py-1"
                />
                <button onClick={() => setEditingTotal(false)}>
                  <FaCheck />
                </button>
                <button onClick={() => setTotal(student.total)}>
                  <FaTimes />
                </button>
              </div>
            )}
          </Row>

          <Row label="Paid">
            <span className="text-emerald-600">₹{student.paid}</span>
          </Row>

          <Row label="Due">
            <span className="text-red-600">₹{due}</span>
          </Row>
        </div>

        <input
          type="number"
          placeholder="Payment Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full glass-input"
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full glass-input"
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
