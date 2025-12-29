import { useEffect, useState, useMemo } from "react";
import {
  FaBookOpen,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaBell,
  FaCheckCircle,
  FaChartLine,
  FaBullseye,
  FaFire,
  FaBriefcase,
  FaArrowRight,
} from "react-icons/fa";

/* =========================================================
   STUDENT DASHBOARD – ENTERPRISE + AI READY
========================================================= */

export default function StudentDashboard() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    courses: 0,
    attendance: 0,
    assessments: 0,
    dues: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(0);

  /* ================= MOCK KPI HISTORY (API READY) ================= */

  const attendanceTrendData = [85, 88, 90, 92];
  const assessmentTrendData = [1, 2, 3, 4];

  /* ================= INIT ================= */

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      setUser(storedUser);

      setStats({
        courses: 3,
        attendance: 92,
        assessments: 4,
        dues: 5000,
      });

      setNotifications([
        { text: "Pending fees must be cleared", priority: "critical" },
        { text: "Mock interviews start Friday", priority: "important" },
        { text: "Resume review scheduled", priority: "important" },
        { text: "Attendance updated for your batch", priority: "info" },
      ]);

      setActivities([
        "Logged in to student portal",
        "Completed Automation module",
        "Assessment submitted successfully",
        "Attendance marked today",
      ]);

      setGoals([
        { text: "Complete Playwright module", done: true },
        { text: "Submit daily task", done: true },
        { text: "Update resume", done: false },
      ]);

      setStreak(6);
    } catch {
      setUser({});
    }
  }, []);

  /* ================= DERIVED ================= */

  const goalCompletion = useMemo(() => {
    if (!goals.length) return 0;
    return Math.round(
      (goals.filter((g) => g.done).length / goals.length) * 100
    );
  }, [goals]);

  const getTrendStatus = (data) => {
    if (data.length < 2) return "Stable";
    const diff = data[data.length - 1] - data[0];
    if (diff > 3) return "Improving";
    if (diff < -3) return "Dropping";
    return "Stable";
  };

  const placementProbability = useMemo(() => {
    let score = 0;

    if (stats.attendance >= 90) score += 30;
    else if (stats.attendance >= 80) score += 20;

    if (stats.assessments >= 4) score += 25;
    else if (stats.assessments >= 2) score += 15;

    if (goalCompletion >= 70) score += 25;
    else if (goalCompletion >= 40) score += 15;

    if (streak >= 5) score += 20;

    return Math.min(score, 100);
  }, [stats, goalCompletion, streak]);

  const placementReadiness = placementProbability >= 70;

  /* ================= UI ================= */

  return (
    <div className="min-h-full space-y-8 animate-fadeIn">

      {/* HEADER */}
      <GlassCard>
        <h2 className="text-2xl font-semibold text-slate-800">
          Welcome back, {user?.name || "Student"} 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Your learning, performance & placement command center
        </p>
      </GlassCard>

      {/* CORE KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat icon={<FaBookOpen />} title="Courses" value={stats.courses} />
        <Stat
          icon={<FaCalendarCheck />}
          title="Attendance"
          value={`${stats.attendance}%`}
          accent={stats.attendance >= 85}
        />
        <Stat icon={<FaClipboardList />} title="Assessments" value={stats.assessments} />
        <Stat
          icon={<FaMoneyBillWave />}
          title="Pending Dues"
          value={`₹${stats.dues.toLocaleString()}`}
          danger={stats.dues > 0}
        />
      </div>

      {/* KPI TRENDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendCard
          title="Attendance Trend"
          status={getTrendStatus(attendanceTrendData)}
        />
        <TrendCard
          title="Assessment Trend"
          status={getTrendStatus(assessmentTrendData)}
        />
      </div>

      {/* ACTIVITY + SMART NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">
            Recent Activity
          </h3>
          {activities.map((a, i) => (
            <Activity key={i} text={a} />
          ))}
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaBell className="text-indigo-600" />
            Smart Notifications
          </h3>

          {notifications.map((n, i) => (
            <div
              key={i}
              className={`flex gap-2 text-sm mb-3 p-2 rounded-lg ${
                n.priority === "critical"
                  ? "bg-red-50 text-red-700"
                  : n.priority === "important"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <FaCheckCircle />
              {n.text}
            </div>
          ))}
        </GlassCard>
      </div>

      {/* PERFORMANCE ZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* GOALS */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaBullseye className="text-indigo-600" />
            Daily Goals
          </h3>

          {goals.map((g, i) => (
            <div key={i} className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">{g.text}</span>
              <span className={g.done ? "text-emerald-600" : "text-yellow-600"}>
                {g.done ? "Done" : "Pending"}
              </span>
            </div>
          ))}

          <Progress value={goalCompletion} label="Completion" />
        </GlassCard>

        {/* STREAK */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaFire className="text-orange-500" />
            Learning Streak
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {streak} Days
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Consistency builds confidence
          </p>
        </GlassCard>

        {/* PLACEMENT PROBABILITY */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3">
            Placement Probability
          </h3>

          <p className="text-3xl font-bold text-indigo-600">
            {placementProbability}%
          </p>

          <div className="h-2 bg-slate-200 rounded-full mt-2">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${placementProbability}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Based on attendance, assessments, goals & consistency
          </p>
        </GlassCard>

        {/* PLACEMENT STATUS */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaBriefcase className="text-indigo-600" />
            Placement Status
          </h3>

          <p
            className={`text-lg font-bold ${
              placementReadiness ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {placementReadiness ? "Ready" : "In Progress"}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            AI-evaluated readiness
          </p>

          <button className="mt-4 flex items-center gap-2 text-sm text-indigo-600 hover:underline">
            View Improvement Plan <FaArrowRight />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40 hover:shadow-lg transition ${className}`}>
    {children}
  </div>
);

const Stat = ({ icon, title, value, accent, danger }) => (
  <GlassCard>
    <div className="flex items-center gap-3 mb-2">
      <span className={`text-lg ${danger ? "text-red-600" : accent ? "text-emerald-600" : "text-indigo-600"}`}>
        {icon}
      </span>
      <span className="text-sm font-medium text-slate-600">{title}</span>
    </div>
    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
  </GlassCard>
);

const TrendCard = ({ title, status }) => (
  <GlassCard>
    <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-600">
      Status: <strong>{status}</strong>
    </p>
    <p className="text-xs text-slate-500">Last checkpoints analysis</p>
  </GlassCard>
);

const Activity = ({ text }) => (
  <div className="flex justify-between items-center text-sm mb-3 px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 transition">
    <span className="text-slate-600">{text}</span>
    <span className="text-xs font-medium text-emerald-500">Done</span>
  </div>
);

const Progress = ({ value, label }) => (
  <div className="mt-4">
    <div className="flex justify-between text-xs text-slate-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-slate-200 mt-1">
      <div
        className="h-full rounded-full bg-indigo-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);
