import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaWhatsapp } from "react-icons/fa";

/* ================= STORAGE ================= */
const USERS_KEY = "users";
const PAYMENTS_KEY = "payments";

/* ================= HELPERS ================= */
const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const loadUsers = () =>
  JSON.parse(localStorage.getItem(USERS_KEY)) || { students: [] };

const loadPayments = () =>
  JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || {};

const savePayments = (data) =>
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(data));

/* ================= PAGE ================= */
export default function PaymentsOverview() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [confirm, setConfirm] = useState(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    setStudents(loadUsers().students || []);
    setPayments(loadPayments());
  }, []);

  /* ================= ADD PAYMENT ================= */
  const addPayment = (id, total) => {
    const amount = Number(prompt("Enter payment amount"));
    if (!amount || amount <= 0) return;

    setPayments((prev) => {
      const p = prev[id] || { total, paid: 0 };
      const updated = {
        ...prev,
        [id]: {
          ...p,
          paid: p.paid + amount,
        },
      };
      savePayments(updated);
      return updated;
    });
  };

  /* ================= DELETE ================= */
  const deleteRecord = () => {
    setPayments((prev) => {
      const updated = { ...prev };
      delete updated[confirm.id];
      savePayments(updated);
      return updated;
    });
    setConfirm(null);
  };

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    let total = 0,
      paid = 0;

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p) return;
      total += p.total;
      paid += p.paid;
    });

    return { total, paid, pending: total - paid };
  }, [students, payments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Payments Overview</h1>
        <p className="text-slate-500">
          Course & batch wise fee tracking
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 flex gap-4">
        <select className="flex-1 rounded-xl px-4 py-3 bg-white">
          <option>All Courses</option>
        </select>
        <select className="flex-1 rounded-xl px-4 py-3 bg-white">
          <option>All Batches</option>
        </select>
        <button className="px-10 rounded-xl bg-white font-medium">
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-600">
              <th className="py-3">Student</th>
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
            {students.map((s) => {
              const p = payments[s.id] || { total: 45000, paid: 0 };
              const due = p.total - p.paid;
              const isPaid = due === 0;

              return (
                <tr key={s.id} className="border-b last:border-none">
                  <td className="py-3">{s.name}</td>
                  <td>{s.course}</td>
                  <td>—</td>
                  <td>{formatINR(p.total)}</td>
                  <td className="text-emerald-600">
                    {formatINR(p.paid)}
                  </td>
                  <td className="text-red-500">
                    {formatINR(due)}
                  </td>

                  <td>
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${
                        isPaid
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {isPaid ? "PAID" : "PARTIAL"}
                    </span>
                  </td>

           <td className="flex items-center gap-3">
  {/* ADD */}
  <button
    disabled={isPaid}
    onClick={() => addPayment(s.id, p.total)}
    className={`text-purple-600 font-medium ${
      isPaid && "opacity-40 cursor-not-allowed"
    }`}
  >
    Add
  </button>

  {/* WHATSAPP */}
  {!isPaid && (
    <a
      href={`https://wa.me/91${s.phone}`}
      target="_blank"
      rel="noreferrer"
      className="text-green-600"
    >
      <FaWhatsapp />
    </a>
  )}

  {/* DELETE — THIS WAS MISSING */}
  {!isPaid && (
    <button
      onClick={() => setConfirm({ id: s.id, name: s.name })}
      className="text-red-500 hover:scale-110 transition"
      title="Delete payment"
    >
      <FaTrash />
    </button>
  )}
</td>

                </tr>
              );
            })}
          </tbody>
        </table>

        {/* FOOTER TOTALS */}
        <div className="flex justify-between mt-6 text-sm font-semibold">
          <span>Total: {formatINR(summary.total)}</span>
          <span className="text-emerald-600">
            Collected: {formatINR(summary.paid)}
          </span>
          <span className="text-red-600">
            Pending: {formatINR(summary.pending)}
          </span>
        </div>
      </div>

      {/* DELETE MODAL */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold mb-6">
              Delete payment record for{" "}
              <span className="text-purple-600">
                {confirm.name}
              </span>
              ?
            </h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setConfirm(null)}
                className="px-8 py-2 rounded-xl bg-slate-100"
              >
                No
              </button>
              <button
                onClick={deleteRecord}
                className="px-8 py-2 rounded-xl bg-rose-500 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
