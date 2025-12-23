import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

/* ================= HELPERS ================= */
const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || { students: [] };

const getPayments = () =>
  JSON.parse(localStorage.getItem("payments")) || {};

/* ================= PAGE ================= */
export default function OverdueAlerts() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});

  useEffect(() => {
    setStudents(getUsers().students || []);
    setPayments(getPayments());
  }, []);

  /* ================= OVERDUE LIST ================= */
  const overdue = useMemo(() => {
    return students.filter((s) => {
      const p = payments[s.id];
      if (!p || !p.deadline) return false;
      return p.total - p.paid > 0 && new Date(p.deadline) < new Date();
    });
  }, [students, payments]);

  const sendReminder = (s, due) => {
    const msg = `Hello ${s.name}, your pending fee is ₹${due}. Please complete payment immediately.`;
    window.open(
      `https://wa.me/91${s.phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Overdue Alerts</h2>
        <p className="text-slate-500">
          Students with missed payment deadlines
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Deadline</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {overdue.map((s) => {
              const p = payments[s.id];
              const due = p.total - p.paid;

              return (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td>{s.phone}</td>
                  <td>₹{p.total}</td>
                  <td className="text-emerald-600">₹{p.paid}</td>
                  <td className="text-red-600 font-semibold">₹{due}</td>
                  <td className="text-red-500">{p.deadline}</td>
                  <td className="text-center">
                    <button
                      onClick={() => sendReminder(s, due)}
                      className="text-green-600"
                      title="Send WhatsApp Reminder"
                    >
                      <FaWhatsapp size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {overdue.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  🎉 No overdue payments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
