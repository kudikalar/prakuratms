import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

/* ================= HELPERS ================= */
const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || { students: [] };

const getPayments = () =>
  JSON.parse(localStorage.getItem("payments")) || {};

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

/* ================= PAGE ================= */
export default function PaymentAnalytics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});

  useEffect(() => {
    setStudents(getUsers().students);
    setPayments(getPayments());
  }, []);

  /* ================= COURSE-WISE AMOUNTS ================= */
  const courseData = useMemo(() => {
    const map = {};

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p) return;

      const hasYearPayment =
        p.history?.some(
          (h) => new Date(h.date).getFullYear() === Number(year)
        ) || false;

      if (!hasYearPayment) return;

      const course = s.course || "General";

      if (!map[course]) {
        map[course] = { course, paid: 0, due: 0 };
      }

      const due = p.total - p.paid;

      map[course].paid += p.paid;
      map[course].due += due > 0 ? due : 0;
    });

    return Object.values(map);
  }, [students, payments, year]);

  /* ================= TOTAL AMOUNTS (SOURCE OF TRUTH) ================= */
  const totals = useMemo(() => {
    let total = 0;
    let collected = 0;
    let pending = 0;
    let overdue = 0;

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p) return;

      const hasYearPayment =
        p.history?.some(
          (h) => new Date(h.date).getFullYear() === Number(year)
        ) || false;

      if (!hasYearPayment) return;

      const due = p.total - p.paid;

      total += p.total;
      collected += p.paid;

      if (due > 0) {
        if (p.deadline && new Date(p.deadline) < new Date()) {
          overdue += due;
        } else {
          pending += due;
        }
      }
    });

    return { total, collected, pending, overdue };
  }, [students, payments, year]);

  /* ================= PIE DATA (AMOUNT-BASED ✅) ================= */
  const pieData = useMemo(() => {
    return [
      { name: "Collected", value: totals.collected },
      { name: "Pending", value: totals.pending },
      { name: "Overdue", value: totals.overdue },
    ].filter((d) => d.value > 0);
  }, [totals]);

  const formatINR = (v) =>
    `₹${new Intl.NumberFormat("en-IN").format(v)}`;

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Payment Analytics</h2>
          <p className="text-slate-500">
            Amount-based analytics synced from Payment Overview
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded-lg px-3 py-2 w-32"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ================= MOBILE TOTAL SUMMARY ================= */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        <SummaryCard label="Total Fee" value={formatINR(totals.total)} />
        <SummaryCard
          label="Collected"
          value={formatINR(totals.collected)}
          className="text-emerald-600"
        />
        <SummaryCard
          label="Pending"
          value={formatINR(totals.pending)}
          className="text-yellow-600"
        />
        <SummaryCard
          label="Overdue"
          value={formatINR(totals.overdue)}
          className="text-red-600"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4">
            Payment Distribution (₹)
          </h3>
          <ResponsiveContainer height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                label={({ name, value }) =>
                  `${name}: ${formatINR(value)}`
                }
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatINR(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4">
            Course-wise Amount Breakdown
          </h3>
          <ResponsiveContainer height={260}>
            <BarChart data={courseData}>
              <XAxis dataKey="course" />
              <YAxis tickFormatter={formatINR} />
              <Tooltip formatter={(v) => formatINR(v)} />
              <Bar dataKey="paid" fill="#22c55e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="due" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= DESKTOP TOTAL BAR ================= */}
      <div className="hidden md:block">
        <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 px-6 py-4 flex justify-between font-semibold">
          <span>Total Fee: {formatINR(totals.total)}</span>
          <span className="text-emerald-600">
            Collected: {formatINR(totals.collected)}
          </span>
          <span className="text-yellow-600">
            Pending: {formatINR(totals.pending)}
          </span>
          <span className="text-red-600">
            Overdue: {formatINR(totals.overdue)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */
function SummaryCard({ label, value, className = "" }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className={`text-xl font-bold ${className}`}>{value}</h3>
    </div>
  );
}
