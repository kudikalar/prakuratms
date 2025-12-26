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

const getBatches = () =>
  JSON.parse(localStorage.getItem("batches")) || [];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const formatINR = (v) =>
  `₹${new Intl.NumberFormat("en-IN").format(v || 0)}`;

/* ================= PAGE ================= */

export default function PaymentAnalytics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [batches, setBatches] = useState([]);

  /* ================= LOAD ================= */
  useEffect(() => {
    setStudents(getUsers().students);
    setPayments(getPayments());
    setBatches(getBatches());
  }, []);

  /* ================= COURSE RESOLVER ================= */
  const getCourseByBatch = (batchId) => {
    const batch = batches.find(
      (b) => String(b.id) === String(batchId)
    );
    if (!batch) return "General";

    if (typeof batch.course === "string") return batch.course;
    if (batch.course?.title) return batch.course.title;

    return "General";
  };

  /* ================= COURSE-WISE DATA ================= */
  const courseData = useMemo(() => {
    const map = {};

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p || !p.history?.length) return;

      const yearPayments = p.history.filter(
        (h) => new Date(h.date).getFullYear() === Number(year)
      );

      if (!yearPayments.length) return;

      const course = getCourseByBatch(s.batchId);

      if (!map[course]) {
        map[course] = { course, paid: 0, due: 0 };
      }

      const paidThisYear = yearPayments.reduce(
        (sum, h) => sum + Number(h.amount),
        0
      );

      const totalPaidTillNow = p.paid || 0;
      const due = Math.max(p.total - totalPaidTillNow, 0);

      map[course].paid += paidThisYear;
      map[course].due += due;
    });

    return Object.values(map);
  }, [students, payments, batches, year]);

  /* ================= TOTALS ================= */
  const totals = useMemo(() => {
    let total = 0;
    let collected = 0;
    let pending = 0;
    let overdue = 0;

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p || !p.history?.length) return;

      const yearPayments = p.history.filter(
        (h) => new Date(h.date).getFullYear() === Number(year)
      );

      if (!yearPayments.length) return;

      const paidThisYear = yearPayments.reduce(
        (sum, h) => sum + Number(h.amount),
        0
      );

      const due = Math.max(p.total - p.paid, 0);

      total += p.total;
      collected += paidThisYear;

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

  /* ================= PIE ================= */
  const pieData = useMemo(
    () =>
      [
        { name: "Collected", value: totals.collected },
        { name: "Pending", value: totals.pending },
        { name: "Overdue", value: totals.overdue },
      ].filter((d) => d.value > 0),
    [totals]
  );

  return (
    <div
      className="
        space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Payment Analytics
          </h2>
          <p className="text-slate-600 text-sm">
            Year-wise fee collection & pending analysis
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="glass-input w-32"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* MOBILE SUMMARY */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        <SummaryCard label="Total" value={formatINR(totals.total)} />
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
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
        </GlassCard>

        <GlassCard>
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
        </GlassCard>
      </div>

      {/* DESKTOP TOTAL BAR */}
      <div className="hidden md:block">
        <div className="rounded-xl bg-white/40 backdrop-blur-xl px-6 py-4 flex justify-between font-semibold">
          <span>Total: {formatINR(totals.total)}</span>
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

function GlassCard({ children }) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow">
      {children}
    </div>
  );
}

function SummaryCard({ label, value, className = "" }) {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className={`text-xl font-bold ${className}`}>{value}</h3>
    </div>
  );
}
