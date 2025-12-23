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

const COLORS = ["#22c55e", "#6366f1", "#facc15", "#ef4444"];

/* ================= PAGE ================= */
export default function PaymentAnalytics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});

  useEffect(() => {
    setStudents(getUsers().students);
    setPayments(getPayments());
  }, []);

  /* ================= COURSE-WISE ================= */
  const courseData = useMemo(() => {
    const map = {};

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p) return;

      const createdYear = new Date(s.id).getFullYear();
      if (createdYear !== Number(year)) return;

      const course = s.course || "General";

      if (!map[course]) {
        map[course] = { course, total: 0, paid: 0 };
      }

      map[course].total += p.total;
      map[course].paid += p.paid;
    });

    return Object.values(map).map((c) => ({
      ...c,
      due: c.total - c.paid,
    }));
  }, [students, payments, year]);

  /* ================= YEARLY SUMMARY ================= */
  const pieData = useMemo(() => {
    let paid = 0,
      pending = 0,
      overdue = 0;

    students.forEach((s) => {
      const p = payments[s.id];
      if (!p) return;

      const createdYear = new Date(s.id).getFullYear();
      if (createdYear !== Number(year)) return;

      const due = p.total - p.paid;

      if (due <= 0) paid++;
      else if (p.deadline && new Date(p.deadline) < new Date()) overdue++;
      else pending++;
    });

    return [
      { name: "Paid", value: paid },
      { name: "Pending", value: pending },
      { name: "Overdue", value: overdue },
    ];
  }, [students, payments, year]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Payment Analytics</h2>
          <p className="text-slate-500">
            Year & Course wise breakdown
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4">Course-wise Collection</h3>
          <ResponsiveContainer height={260}>
            <BarChart data={courseData}>
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="paid" fill="#22c55e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="due" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
