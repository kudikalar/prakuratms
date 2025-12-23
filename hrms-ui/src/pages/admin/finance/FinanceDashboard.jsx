import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= COLORS ================= */
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

/* ================= HELPERS ================= */
const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || { students: [] };

const getPayments = () =>
  JSON.parse(localStorage.getItem("payments")) || {};

/* ================= PAGE ================= */
export default function FinanceDashboard() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});

  useEffect(() => {
    setStudents(getUsers().students || []);
    setPayments(getPayments());
  }, []);

  /* ================= KPI CALCULATIONS ================= */
  const stats = useMemo(() => {
    let totalFee = 0;
    let totalPaid = 0;
    let overdueCount = 0;

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p) return;

      totalFee += p.total || 0;
      totalPaid += p.paid || 0;

      if (p.deadline && p.total - p.paid > 0) {
        if (new Date(p.deadline) < new Date()) overdueCount++;
      }
    });

    return {
      totalFee,
      totalPaid,
      totalDue: totalFee - totalPaid,
      overdueCount,
    };
  }, [students, payments]);

  /* ================= PIE DATA ================= */
  const pieData = [
    { name: "Paid", value: stats.totalPaid },
    { name: "Pending", value: stats.totalDue },
    { name: "Overdue", value: stats.overdueCount },
  ];

  /* ================= BAR DATA (MONTHLY) ================= */
  const barData = useMemo(() => {
    const map = {};
    Object.values(payments).forEach((p) => {
      p.history?.forEach((h) => {
        const month = new Date(h.date).toLocaleString("default", {
          month: "short",
        });
        map[month] = (map[month] || 0) + Number(h.amount);
      });
    });

    return Object.entries(map).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [payments]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Finance Dashboard</h2>
        <p className="text-slate-500">
          Institution-wide financial overview
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Kpi title="Total Fee" value={`₹${stats.totalFee}`} />
        <Kpi title="Collected" value={`₹${stats.totalPaid}`} positive />
        <Kpi title="Pending" value={`₹${stats.totalDue}`} danger />
        <Kpi title="Overdue Students" value={stats.overdueCount} warning />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={70}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-4">Monthly Collection</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <Bar dataKey="amount" fill="#6366f1" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Kpi = ({ title, value, positive, danger, warning }) => (
  <div
    className={`rounded-xl p-5 shadow border backdrop-blur-xl bg-white/60 ${
      positive
        ? "border-emerald-200"
        : danger
        ? "border-red-200"
        : warning
        ? "border-yellow-200"
        : "border-slate-200"
    }`}
  >
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const GlassCard = ({ children }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow">
    {children}
  </div>
);
