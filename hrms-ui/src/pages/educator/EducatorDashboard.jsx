import { useEffect, useState, useMemo } from "react";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaBookOpen,
  FaClipboardCheck,
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaFire,
  FaArrowRight,
} from "react-icons/fa";

/* =====================================================
   EDUCATOR DASHBOARD – ENTERPRISE COMMAND CENTER
===================================================== */

export default function EducatorDashboard() {
  const [educator, setEducator] = useState({});
  const [stats, setStats] = useState({
    courses: 0,
    batches: 0,
    students: 0,
    attendance: 0,
  });
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [streak, setStreak] = useState(0);

  /* ================= INIT ================= */

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      setEducator(user);

      // 🔹 Replace with API later
      setStats({
        courses: 4,
        batches: 3,
        students: 86,
        attendance: 93,
      });

      setActivities([
        "Marked attendance for Batch A",
        "Uploaded Playwright lesson content",
        "Evaluated Automation assignment",
        "Scheduled mock interviews",
      ]);

      setAlerts([
        { text: "3 students pending assessment evaluation", type: "warning" },
        { text: "Mock interview panel tomorrow", type: "info" },
      ]);

      setStreak(12);
    } catch {
      setEducator({});
    }
  }, []);

  /* ================= DERIVED ================= */

  const attendanceStatus = useMemo(() => {
    if (stats.attendance >= 90) return "Excellent";
    if (stats.attendance >= 80) return "Good";
    return "Needs Attention";
  }, [stats.attendance]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* HEADER */}
      <GlassCard>
        <h2 className="text-2xl font-semibold text-slate-800">
          Welcome, {educator?.name || "Educator"} 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Teaching performance, student progress & academic control
        </p>
      </GlassCard>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat icon={<FaBookOpen />} label="Courses" value={stats.courses} />
        <Stat icon={<FaChalkboardTeacher />} label="Batches" value={stats.batches} />
        <Stat icon={<FaUsers />} label="Students" value={stats.students} />
        <Stat
          icon={<FaClipboardCheck />}
          label="Attendance"
          value={`${stats.attendance}%`}
          accent={stats.attendance >= 85}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT ACTIVITY */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">
            Recent Activities
          </h3>

          {activities.map((a, i) => (
            <Activity key={i} text={a} />
          ))}
        </GlassCard>

        {/* ALERTS */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaBell className="text-indigo-600" />
            Alerts
          </h3>

          {alerts.length ? (
            alerts.map((a, i) => (
              <div
                key={i}
                className={`text-sm mb-3 px-3 py-2 rounded-lg ${
                  a.type === "warning"
                    ? "bg-yellow-50 text-yellow-800"
                    : "bg-indigo-50 text-indigo-800"
                }`}
              >
                {a.text}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No alerts at the moment
            </p>
          )}
        </GlassCard>
      </div>

      {/* PERFORMANCE ZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* STREAK */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaFire className="text-orange-500" />
            Teaching Streak
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {streak} Days
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Continuous teaching engagement
          </p>
        </GlassCard>

        {/* ATTENDANCE HEALTH */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaClipboardCheck className="text-indigo-600" />
            Attendance Health
          </h3>
          <p className="text-lg font-bold text-slate-800">
            {attendanceStatus}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Average across batches
          </p>
        </GlassCard>

        {/* PERFORMANCE INSIGHT */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaChartLine className="text-indigo-600" />
            AI Insight
          </h3>
          <p className="text-sm text-slate-600">
            Student engagement is trending <strong>positive</strong>.  
            Focus on weaker topics in Automation frameworks.
          </p>
        </GlassCard>

        {/* QUICK ACTION */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-indigo-600" />
            Today
          </h3>
          <p className="text-sm text-slate-600">
            2 sessions scheduled
          </p>
          <button className="mt-4 flex items-center gap-2 text-sm text-indigo-600 hover:underline">
            View Schedule <FaArrowRight />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

/* =====================================================
   REUSABLE UI COMPONENTS
===================================================== */

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40 hover:shadow-lg transition ${className}`}
  >
    {children}
  </div>
);

const Stat = ({ icon, label, value, accent }) => (
  <GlassCard>
    <div className="flex items-center gap-3 mb-2">
      <span
        className={`text-lg ${
          accent ? "text-emerald-600" : "text-indigo-600"
        }`}
      >
        {icon}
      </span>
      <span className="text-sm font-medium text-slate-600">
        {label}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
  </GlassCard>
);

const Activity = ({ text }) => (
  <div className="flex justify-between items-center text-sm mb-3 px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 transition">
    <span className="text-slate-600">{text}</span>
    <span className="text-xs font-medium text-emerald-500">Done</span>
  </div>
);
