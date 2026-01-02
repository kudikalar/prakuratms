import { useEffect, useState, useMemo } from "react";
import {
  FaBookOpen,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaBell,
  FaCheckCircle,
  FaBullseye,
  FaFire,
  FaBriefcase,
  FaArrowRight,
  FaBolt,
  FaMedal,
  FaStar,
  FaGift,
} from "react-icons/fa";

/* =========================================================
   STUDENT DASHBOARD – ENTERPRISE PREMIUM (TMS READY)
   ✔ No existing content removed
   ✔ Mobile + Desktop responsive
   ✔ AI Guidance
   ✔ Gamification
   ✔ Placement Journey
========================================================= */

export default function StudentDashboard() {
  /* ================= CORE STATE ================= */

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

  /* ================= COURSES (API READY) ================= */

  const [popularCourses] = useState([
    {
      id: 1,
      title: "QA Automation – Playwright",
      level: "Advanced",
      price: 25000,
      discount: 30,
      recommended: true,
    },
    {
      id: 2,
      title: "Manual Testing",
      level: "Beginner",
      price: 15000,
      discount: 20,
      recommended: false,
    },
  ]);

  const [upcomingCourses] = useState([
    {
      id: 3,
      title: "API Automation",
      launch: "Feb 2025",
      discount: 40,
    },
  ]);

  /* ================= INIT ================= */

  useEffect(() => {
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
      { text: "Attendance updated", priority: "info" },
    ]);

    setActivities([
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
  }, []);

  /* ================= DERIVED ================= */

  const goalCompletion = useMemo(() => {
    if (!goals.length) return 0;
    return Math.round(
      (goals.filter((g) => g.done).length / goals.length) * 100
    );
  }, [goals]);

  /* ================= GAMIFICATION ================= */

  const xp = useMemo(
    () => streak * 10 + stats.assessments * 30 + goalCompletion,
    [streak, stats, goalCompletion]
  );

  const level =
    xp < 300 ? "Beginner" : xp < 700 ? "Intermediate" : "Advanced";

  const badges = useMemo(() => {
    const b = [];
    if (streak >= 5) b.push("🔥 Consistency Champ");
    if (stats.assessments >= 3) b.push("🧠 Assessment Pro");
    if (goalCompletion >= 70) b.push("🎯 Goal Crusher");
    if (stats.attendance >= 90) b.push("📅 Attendance Star");
    return b;
  }, [streak, stats, goalCompletion]);

  /* ================= AI ENGINE ================= */

  const aiReason = () => {
    if (stats.attendance >= 90 && streak >= 5)
      return "You are consistent and ready to upgrade your skill level now.";
    if (stats.assessments >= 3)
      return "Your assessment performance indicates readiness for advanced learning.";
    return "Strengthen your fundamentals before placement phase.";
  };

  const aiActions = useMemo(() => {
    const a = [];
    if (stats.attendance < 85) a.push("Improve attendance");
    if (goalCompletion < 70) a.push("Complete daily goals");
    if (stats.assessments < 5) a.push("Attempt more assessments");
    if (streak < 7) a.push("Maintain a 7-day learning streak");
    if (!a.length) a.push("Start placement preparation");
    return a;
  }, [stats, goalCompletion, streak]);

  /* ================= PLACEMENT SCORE ================= */

  const placementScore = useMemo(() => {
    let s = 0;
    s += stats.attendance >= 90 ? 30 : 20;
    s += stats.assessments * 10;
    s += goalCompletion >= 70 ? 20 : 10;
    s += streak >= 5 ? 20 : 10;
    return Math.min(s, 100);
  }, [stats, goalCompletion, streak]);

  /* ================= UI ================= */

  return (
    <div className="space-y-12 animate-fadeIn">

      {/* ================= WELCOME ================= */}
      <GlassCard className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name || "Student"} 👋
        </h2>
        <p className="text-sm opacity-90">
          Your personalized learning & placement dashboard
        </p>
      </GlassCard>

      {/* ================= POPULAR COURSES ================= */}
      <Section title="🔥 Popular Courses">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {popularCourses.map((c) => (
      <div
        key={c.id}
        className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition"
      >
        {/* AI Badge */}
        {c.recommended && (
          <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full shadow">
            🤖 AI Recommended
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold">{c.title}</h3>
        <p className="text-sm opacity-90">Level: {c.level}</p>

        {/* AI Reason */}
        <p className="mt-3 text-sm bg-white/20 p-3 rounded-xl">
          {aiReason(c)}
        </p>

        {/* Price + CTA */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
          <span className="text-lg font-bold">
            ₹{c.price - (c.price * c.discount) / 100}
            <span className="ml-2 text-xs line-through opacity-70">
              ₹{c.price}
            </span>
          </span>

          <button
            onClick={() =>
              window.open(
                "https://web.rktestingtools.com/courses/712847",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="bg-white text-indigo-700 px-5 py-2 rounded-full font-semibold hover:bg-indigo-100 transition shadow"
          >
            Enroll Now
          </button>
        </div>
      </div>
    ))}
  </div>
</Section>


      {/* ================= UPCOMING COURSES ================= */}
      <Section title="🎁 Upcoming Courses & Offers">
        {upcomingCourses.map((c) => (
          <GlassCard key={c.id} className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{c.title}</h4>
              <p className="text-sm text-slate-500">Launch: {c.launch}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm">
              {c.discount}% Early Bird
            </span>
          </GlassCard>
        ))}
      </Section>

      {/* ================= PERFORMANCE ================= */}
      <Section title="📊 Performance Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat title="Courses" value={stats.courses} icon={<FaBookOpen />} />
          <Stat title="Attendance" value={`${stats.attendance}%`} icon={<FaCalendarCheck />} />
          <Stat title="Assessments" value={stats.assessments} icon={<FaClipboardList />} />
          <Stat title="Pending Dues" value={`₹${stats.dues}`} icon={<FaMoneyBillWave />} danger />
        </div>
      </Section>

      {/* ================= AI ACTION PLAN ================= */}
      <Section title="🤖 AI Action Plan">
        <GlassCard>
          <ul className="space-y-3">
            {aiActions.map((a, i) => (
              <li key={i} className="flex gap-3">
                <FaBolt className="text-indigo-600 mt-1" />
                <span className="text-sm">{a}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Section>

      {/* ================= GAMIFICATION ================= */}
      <Section title="🏆 Gamification">
        <div className="grid md:grid-cols-3 gap-6">
          <Stat title="Streak" value={`${streak} Days`} icon={<FaFire />} />
          <Stat title="XP" value={xp} icon={<FaStar />} />
          <Stat title="Level" value={level} icon={<FaMedal />} />
        </div>
      </Section>

      {/* ================= BADGES ================= */}
      <Section title="🏅 Achievements">
        <div className="flex flex-wrap gap-3">
          {badges.map((b, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm shadow"
            >
              {b}
            </span>
          ))}
        </div>
      </Section>

      {/* ================= PLACEMENT JOURNEY ================= */}
      <Section title="🎯 Placement Journey">
        <GlassCard>
          {[
            "Enrollment",
            "Core Training",
            "Projects",
            "Assessments",
            "Mock Interviews",
            "Placement Drive",
            "Offer Letter",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  i < 4 ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
              <span className="text-sm">{s}</span>
            </div>
          ))}
        </GlassCard>
      </Section>

      {/* ================= PLACEMENT SCORE ================= */}
      <Section title="📈 Placement Readiness">
        <GlassCard>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Readiness Score</span>
            <span className="font-bold text-indigo-600">{placementScore}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
              style={{ width: `${placementScore}%` }}
            />
          </div>
        </GlassCard>
      </Section>
    </div>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
    {children}
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40 ${className}`}
  >
    {children}
  </div>
);

const Stat = ({ title, value, icon, danger }) => (
  <GlassCard>
    <div className="flex items-center gap-3">
      <span className={`text-lg ${danger ? "text-red-600" : "text-indigo-600"}`}>
        {icon}
      </span>
      <span className="text-sm">{title}</span>
    </div>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </GlassCard>
);
