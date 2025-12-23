import { useEffect, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";

/* ================= HELPERS ================= */
const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || { students: [] };

const getPayments = () =>
  JSON.parse(localStorage.getItem("payments")) || {};

/* ================= PAGE ================= */
export default function Reports() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    setStudents(getUsers().students || []);
    setPayments(getPayments());
  }, []);

  /* ================= FILTERED ROWS ================= */
  const rows = useMemo(() => {
    return students.map((s) => {
      const p = payments[s.id] || {};
      const total = p.total || 0;
      const paid = p.paid || 0;
      const due = total - paid;

      return {
        name: s.name,
        phone: s.phone || "-",
        total,
        paid,
        due,
        deadline: p.deadline || "-",
        lastPayment: p.lastPayment || "-",
      };
    });
  }, [students, payments]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.total += r.total;
        acc.paid += r.paid;
        acc.due += r.due;
        return acc;
      },
      { total: 0, paid: 0, due: 0 }
    );
  }, [rows]);

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    const headers = [
      "Student",
      "Phone",
      "Total Fee",
      "Paid",
      "Due",
      "Last Payment",
      "Deadline",
    ];

    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.name,
          r.phone,
          r.total,
          r.paid,
          r.due,
          r.lastPayment,
          r.deadline,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finance-report.csv";
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Reports</h2>
          <p className="text-slate-500">
            Financial & student payment reports
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Fee" value={`₹${summary.total}`} />
        <SummaryCard
          title="Collected"
          value={`₹${summary.paid}`}
          positive
        />
        <SummaryCard
          title="Pending"
          value={`₹${summary.due}`}
          danger
        />
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Last Payment</th>
              <th>Deadline</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{r.name}</td>
                <td>{r.phone}</td>
                <td>₹{r.total}</td>
                <td className="text-emerald-600">₹{r.paid}</td>
                <td className="text-red-600">₹{r.due}</td>
                <td>{r.lastPayment}</td>
                <td>{r.deadline}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No report data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value, positive, danger }) => (
  <div
    className={`rounded-xl p-5 shadow border backdrop-blur-xl bg-white/60 ${
      positive
        ? "border-emerald-200"
        : danger
        ? "border-red-200"
        : "border-slate-200"
    }`}
  >
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);
