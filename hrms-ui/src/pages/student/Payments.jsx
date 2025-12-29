import { useEffect, useState, useMemo } from "react";
import {
  FaMoneyBillWave,
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCreditCard,
} from "react-icons/fa";

/* =====================================================
   STUDENT PAYMENTS – PRAKURA PURPLE PREMIUM TABLE VIEW
   (Default Table View + Glass UI + No content removed)
===================================================== */

export default function StudentPayments() {
  const [summary, setSummary] = useState({
    totalFee: 0,
    paid: 0,
    pending: 0,
  });

  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("All");

  /* ================= INIT ================= */

  useEffect(() => {
    const mockPayments = [
      {
        id: 1,
        date: "2025-01-02",
        amount: 20000,
        status: "Paid",
        mode: "UPI",
      },
      {
        id: 2,
        date: "2025-02-01",
        amount: 15000,
        status: "Pending",
        mode: "—",
      },
      {
        id: 3,
        date: "2025-03-01",
        amount: 15000,
        status: "Upcoming",
        mode: "—",
      },
    ];

    const totalFee = mockPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const paid = mockPayments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);

    setPayments(mockPayments);
    setSummary({
      totalFee,
      paid,
      pending: totalFee - paid,
    });
  }, []);

  /* ================= DERIVED ================= */

  const progress =
    summary.totalFee > 0
      ? Math.round((summary.paid / summary.totalFee) * 100)
      : 0;

  const filteredPayments = useMemo(() => {
    return payments.filter((p) =>
      filter === "All" ? true : p.status === filter
    );
  }, [payments, filter]);

  /* ================= UI ================= */

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FaMoneyBillWave className="text-purple-600" />
          Payments
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          View your fee details and payment history
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Stat
          label="Total Fee"
          value={`₹${summary.totalFee.toLocaleString()}`}
        />
        <Stat
          label="Paid"
          value={`₹${summary.paid.toLocaleString()}`}
          highlight
        />
        <Stat
          label="Pending"
          value={`₹${summary.pending.toLocaleString()}`}
          danger
        />
      </div>

      {/* PAYMENT PROGRESS */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/40">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Payment Completion</span>
          <span>{progress}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">
        {["All", "Paid", "Pending", "Upcoming"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === f
                ? "bg-purple-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE VIEW (Default) */}
      <div className="overflow-x-auto rounded-3xl shadow-xl border border-purple-200 bg-white">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Mode</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-purple-50 transition"
              >
                <td className="p-4">
                  {new Date(p.date).toDateString()}
                </td>

                <td className="p-4 font-medium">
                  ₹{p.amount.toLocaleString()}
                </td>

                <td className="p-4">
                  <StatusBadge status={p.status} />
                </td>

                <td className="p-4">{p.mode}</td>

                <td className="p-4 text-right">
                  {p.status === "Paid" ? (
                    <button className="text-indigo-600 hover:underline flex items-center gap-1">
                      <FaFileInvoice />
                      Invoice
                    </button>
                  ) : p.status === "Pending" ? (
                    <button className="flex items-center gap-1 text-emerald-600 hover:underline">
                      <FaCreditCard />
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filteredPayments.length && (
          <p className="text-sm text-slate-400 text-center py-4">
            No payment records available
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Stat = ({ label, value, highlight, danger }) => (
  <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/40 hover:shadow-xl transition">
    <p className="text-sm text-slate-500">{label}</p>
    <h3
      className={`text-2xl font-bold mt-1 ${
        highlight
          ? "text-emerald-600"
          : danger
          ? "text-red-600"
          : "text-purple-600"
      }`}
    >
      {value}
    </h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Paid: {
      icon: <FaCheckCircle />,
      color: "text-emerald-700",
      bg: "bg-emerald-100 border border-emerald-300/50 shadow",
    },
    Pending: {
      icon: <FaClock />,
      color: "text-yellow-700",
      bg: "bg-yellow-100 border border-yellow-300/50 shadow",
    },
    Upcoming: {
      icon: <FaTimesCircle />,
      color: "text-slate-600",
      bg: "bg-slate-200 border border-slate-400/40 shadow",
    },
  };

  const s = map[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}
    >
      {s.icon}
      {status}
    </span>
  );
};
