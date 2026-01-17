import { useEffect, useMemo, useState } from "react";
import { FaFileInvoice, FaDownload } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ================= STORAGE KEYS ================= */
const USERS_KEY = "users";
const COURSES_KEY = "PRAKURA_COURSES";
const PAYMENTS_KEY = "payments";
const AUTH_KEY = "user";

/* ================= HELPERS ================= */
const safeJSON = (k, f) => {
  try {
    return JSON.parse(localStorage.getItem(k)) || f;
  } catch {
    return f;
  }
};

const normalizeId = (v) => (v == null ? "" : String(v));

/* ================= RBAC ================= */
const getRole = () => {
  try {
    const role = JSON.parse(localStorage.getItem(AUTH_KEY))?.role;
    return role
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      : "Admin";
  } catch {
    return "Admin";
  }
};

const ROLE = getRole();

const RBAC = {
  Admin: ["stats", "enrollment", "revenue", "finance", "export"],
  Educator: ["stats", "enrollment", "revenue"],
  Student: ["stats", "enrollment"],
};

const canView = (k) => RBAC[ROLE]?.includes(k);

/* ================= DASHBOARD ================= */
export default function DashboardHome() {
  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState({});

  /* LOAD DATA */
  useEffect(() => {
    const load = () => {
      const users = safeJSON(USERS_KEY, {
        students: [],
        educators: [],
        admins: [],
      });

      setStudents(users.students || []);
      setEducators(users.educators || []);
      setAdmins(users.admins || []);
      setCourses(safeJSON(COURSES_KEY, []));
      setPayments(safeJSON(PAYMENTS_KEY, {}));
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  /* METRICS */
  const batchCount = useMemo(
    () => new Set(students.map((s) => s.batchId).filter(Boolean)).size,
    [students]
  );

  const enrollmentData = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const m = new Date(Number(s.id || Date.now())).toLocaleString("default", {
        month: "short",
      });
      map[m] = map[m] || { name: m, total: 0 };
      map[m].total++;
    });
    return Object.values(map);
  }, [students]);

  const finance = useMemo(() => {
    let total = 0,
      paid = 0;
    Object.values(payments).forEach((p) => {
      total += Number(p.total || 0);
      paid += Number(p.paid || 0);
    });
    return {
      total,
      paid,
      pending: total - paid,
    };
  }, [payments]);

  const monthlyFinance = useMemo(() => {
    const map = {};
    Object.values(payments).forEach((p) => {
      (p.history || []).forEach((h) => {
        const m = new Date(h.date).toLocaleString("default", {
          month: "short",
        });
        map[m] = map[m] || { name: m, collected: 0 };
        map[m].collected += Number(h.amount || 0);
      });
    });
    return Object.values(map);
  }, [payments]);

  const revenueByCourse = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const c = courses.find(
        (x) => normalizeId(x._id) === normalizeId(s.courseId)
      );
      const name = c?.title || "General";
      const price = Number(c?.price || 0);
      map[name] = map[name] || { name, value: 0 };
      map[name].value += price;
    });
    return Object.values(map);
  }, [students, courses]);

  /* EXPORT */
  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Students", students.length],
      ["Educators", educators.length],
      ["Admins", admins.length],
      ["Courses", courses.length],
      ["Batches", batchCount],
      ["Total Revenue", finance.total],
      ["Collected", finance.paid],
      ["Pending", finance.pending],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dashboard-report.csv";
    a.click();
  };

  return (
    <div className="relative max-w-7xl mx-auto p-6 md:p-8 space-y-10 animate-fade">

      {/* HEADER */}
      <div className="glass-panel">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500">
          Real-time analytics & financial insights
        </p>
      </div>

      {canView("stats") && (
        <Grid>
          <Stat title="Students" value={students.length} />
          <Stat title="Educators" value={educators.length} />
          <Stat title="Admins" value={admins.length} />
          <Stat title="Courses" value={courses.length} />
          <Stat title="Batches" value={batchCount} />
        </Grid>
      )}

      {canView("revenue") && (
        <Grid>
          <Stat title="Total Revenue" value={`₹${finance.total}`} />
          <Stat title="Collected" value={`₹${finance.paid}`} />
          <Stat title="Pending" value={`₹${finance.pending}`} />
        </Grid>
      )}

      {canView("enrollment") && (
        <GlassCard>
          <h3 className="font-semibold mb-4">Enrollment Growth</h3>
          <BarBlock data={enrollmentData} dataKey="total" />
        </GlassCard>
      )}

      {canView("revenue") && (
        <GlassCard>
          <h3 className="font-semibold mb-4">Revenue by Course</h3>
          <PieBlock data={revenueByCourse} />
        </GlassCard>
      )}

      {canView("finance") && (
        <GlassCard>
          <h3 className="font-semibold mb-4">Monthly Collections</h3>
          <BarBlock data={monthlyFinance} dataKey="collected" />
        </GlassCard>
      )}

      {canView("export") && (
        <GlassCard>
          <h3 className="flex items-center gap-2 font-semibold">
            <FaFileInvoice /> Reports
          </h3>
          <button
            onClick={exportCSV}
            className="btn-primary mt-4 flex items-center gap-2"
          >
            <FaDownload /> Export CSV
          </button>
        </GlassCard>
      )}
    </div>
  );
}

/* ================= UI ================= */

const Grid = ({ children }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);

const GlassCard = ({ children }) => (
  <div className="glass-card">{children}</div>
);

const Stat = ({ title, value }) => (
  <div className="glass-kpi">
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
      {title}
    </p>
    <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
      {value}
    </h3>
  </div>
);

const BarBlock = ({ data, dataKey }) => (
  <div className="h-[260px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            color: "#020617",
          }}
        />
        <Bar dataKey={dataKey} fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

const PieBlock = ({ data }) => (
  <div className="h-[260px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
