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
   STUDENT DASHBOARD – PREMIUM ENTERPRISE (FIXED)
========================================================= */

export default function StudentDashboard() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    courses: 0,
    attendance: "0%",
    assessments: 0,
    dues: "₹0",
  });

  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(0);

  /* ================= INIT ================= */

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      setUser(storedUser);

      setStats({
        courses: 3,
        attendance: "92%",
        assessments: 4,
        dues: "₹5,000",
      });

      setNotifications([
        "Mock interviews start from Friday",
        "2-Day Playwright JS workshop next week",
        "Attendance updated for Batch A",
        "Resume review scheduled",
      ]);

      setActivities([
        "Logged in to student portal",
        "Completed Automation Testing module",
        "Assessment submitted successfully",
        "Attendance marked for today",
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

  const attendanceNum = parseInt(stats.attendance);
  const placementReadiness =
    attendanceNum >= 85 && stats.assessments >= 3;

  const goalCompletion = useMemo(() => {
    if (!goals.length) return 0;
    return Math.round(
      (goals.filter((g) => g.done).length / goals.length) * 100
    );
  }, [goals]);

  /* ================= UI ================= */

  return (
    <div className="min-h-full space-y-8 animate-fadeIn">
      {/* HEADER */}
      <GlassCard>
        <h2 className="text-2xl font-semibold text-slate-800">
          Welcome, {user?.name || "Student"} 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Your learning, performance & placement command center
        </p>
      </GlassCard>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat icon={<FaBookOpen />} title="Enrolled Courses" value={stats.courses} />
        <Stat icon={<FaCalendarCheck />} title="Attendance" value={stats.attendance} />
        <Stat icon={<FaClipboardList />} title="Assessments" value={stats.assessments} />
        <Stat icon={<FaMoneyBillWave />} title="Pending Dues" value={stats.dues} />
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACTIVITIES */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">
            Recent Activities
          </h3>
          {activities.map((item, index) => (
            <Activity key={index} text={item} />
          ))}
        </GlassCard>

        {/* NOTIFICATIONS */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaBell className="text-indigo-600" />
            Notifications
          </h3>

          {notifications.length ? (
            notifications.map((note, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-600 mb-3">
                <FaCheckCircle className="text-emerald-500 mt-0.5" />
                {note}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No new notifications</p>
          )}
        </GlassCard>
      </div>

      {/* PREMIUM ZONE */}
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

          <Progress value={goalCompletion} label="Goal Completion" />
        </GlassCard>

        {/* STREAK */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaFire className="text-orange-500" />
            Learning Streak
          </h3>
          <p className="text-3xl font-bold text-orange-600">{streak} Days</p>
          <p className="text-sm text-slate-500 mt-1">
            Keep learning daily to stay consistent
          </p>
        </GlassCard>

        {/* PERFORMANCE INSIGHT (FIX FOR FaChartLine) */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaChartLine className="text-indigo-600" />
            AI Performance Insight
          </h3>
          <p className="text-sm text-slate-600">
            Your performance trend is <strong>upward</strong>.  
            Focus on automation depth to unlock next placement tier.
          </p>
        </GlassCard>

        {/* PLACEMENT */}
        <GlassCard>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaBriefcase className="text-indigo-600" />
            Placement Readiness
          </h3>

          <p
            className={`text-lg font-bold ${
              placementReadiness ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {placementReadiness ? "Ready" : "In Progress"}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Based on attendance & assessments
          </p>

          <button className="mt-4 flex items-center gap-2 text-sm text-indigo-600 hover:underline">
            View AI Improvement Plan <FaArrowRight />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE UI COMPONENTS
========================================================= */

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/70 backdrop-blur-xl
      rounded-2xl p-6 shadow
      border border-white/40
      ${className}
    `}
  >
    {children}
  </div>
);

const Stat = ({ icon, title, value }) => (
  <GlassCard>
    <div className="flex items-center gap-3 text-indigo-600 mb-2">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
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
