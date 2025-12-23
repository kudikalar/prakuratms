import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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

export default function PaymentAnalytics() {
  const [year, setYear] = useState(new Date().getFullYear());

  const students = getUsers().students;
  const payments = getPayments();

  /* ================= MERGED DATA ================= */
  const rows = useMemo(() => {
    return students.map((s) => {
      const p = payments[s.id] || {};
      const total = p.total || 0;
      const paid = p.paid || 0;
      const due = total - paid;

      return {
        ...s,
        total,
        paid,
        due,
        deadline: p.deadline,
        lastPayment: p.lastPayment,
      };
    });
  }, [students, payments]);

  /* ================= PIE ================= */
  const pieData = useMemo(() => {
    let paid = 0,
      pending = 0,
      overdue = 0;

    rows.forEach((r) => {
      if (r.due <= 0) paid += r.paid;
      else if (r.deadline && new Date(r.deadline) < new Date()) overdue += r.due;
      else pending += r.due;
    });

    return [
      { name: "Paid", value: paid },
      { name: "Pending", value: pending },
      { name: "Overdue", value: overdue },
    ];
  }, [rows]);

  /* ================= BAR (MONTHLY) ================= */
  const barData = useMemo(() => {
    const map = {};

    rows.forEach((r) => {
      if (!r.lastPayment) return;
      const d = new Date(r.lastPayment);
      if (d.getFullYear() !== year) return;

      const month = d.toLocaleString("default", { month: "short" });
      map[month] = (map[month] || 0) + r.paid;
    });

    return Object.entries(map).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [rows, year]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Payment Analytics</h2>
        <p className="text-slate-500">Collections & dues overview</p>
      </div>

      {/* FILTER */}
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="border rounded-lg px-3 py-2"
      >
        {[2024, 2025, 2026].map((y) => (
          <option key={y}>{y}</option>
        ))}
      </select>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PIE */}
        <Card title="Payment Status">
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
        </Card>

        {/* BAR */}
        <Card title="Monthly Collection">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="amount" fill="#6366f1" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ================= UI ================= */

const Card = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-5">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);
