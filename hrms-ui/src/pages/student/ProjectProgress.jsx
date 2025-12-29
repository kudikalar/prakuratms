import { useEffect, useState, useMemo } from "react";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaPercentage,
  FaPlayCircle,
  FaMedal,
  FaRobot,
  FaStream,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECT PROGRESS TRACKER (NEXT LEVEL)
===================================================== */

export default function ProjectProgress() {
  const [milestones, setMilestones] = useState([]);
  const [activity, setActivity] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    setMilestones([
      {
        id: 1,
        title: "Requirement Understanding",
        description: "Analyze project requirements and scope",
        week: "Week 1",
        status: "Completed",
        completedOn: "2025-01-08",
      },
      {
        id: 2,
        title: "Test Scenario Preparation",
        description: "Prepare test scenarios and test cases",
        week: "Week 2",
        status: "Completed",
        completedOn: "2025-01-15",
      },
      {
        id: 3,
        title: "Automation Script Development",
        description: "Develop Playwright automation scripts",
        week: "Week 3",
        status: "In Progress",
        completedOn: null,
      },
      {
        id: 4,
        title: "Execution & Bug Reporting",
        description: "Execute scripts and log defects",
        week: "Week 4",
        status: "Pending",
        completedOn: null,
      },
    ]);

    setActivity([
      {
        id: 1,
        text: "Project initialized",
        time: new Date().toLocaleString(),
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const completedCount = useMemo(
    () => milestones.filter((m) => m.status === "Completed").length,
    [milestones]
  );

  const progress = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  const activeMilestone = milestones.find(
    (m) => m.status === "In Progress"
  );

  /* ================= AI INSIGHTS ================= */

  const aiInsights = useMemo(() => {
    if (progress === 100) {
      return {
        status: "Completed 🎉",
        suggestion: "Project successfully delivered.",
      };
    }

    if (progress >= 60) {
      return {
        status: "On Track ✅",
        suggestion:
          "Maintain momentum and prepare for final execution.",
      };
    }

    return {
      status: "Needs Attention ⚠️",
      suggestion:
        "Increase focus on current milestone to avoid delays.",
    };
  }, [progress]);

  /* ================= BADGES ================= */

  const badges = useMemo(() => {
    const earned = [];
    if (completedCount >= 1) earned.push("First Milestone");
    if (progress >= 50) earned.push("Halfway There");
    if (progress === 100) earned.push("Project Champion");
    return earned;
  }, [completedCount, progress]);

  /* ================= ACTIONS ================= */

  const markCompleted = (id) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: "Completed",
              completedOn: new Date().toISOString().slice(0, 10),
            }
          : m
      )
    );

    setActivity((prev) => [
      {
        id: Date.now(),
        text: "Completed milestone successfully",
        time: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <Section title="Project Progress Tracker" subtitle="Track milestones, intelligence & achievements" />

      {/* PROGRESS */}
      <ProgressCard progress={progress} active={activeMilestone} />

      {/* AI INSIGHTS */}
      <Card icon={<FaRobot />} title="AI Insights">
        <p className="font-semibold">{aiInsights.status}</p>
        <p className="text-sm text-slate-600 mt-1">
          {aiInsights.suggestion}
        </p>
      </Card>

      {/* BADGES */}
      <Card icon={<FaMedal />} title="Achievements">
        <div className="flex flex-wrap gap-2">
          {badges.length ? (
            badges.map((b) => (
              <span
                key={b}
                className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"
              >
                {b}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No badges earned yet
            </p>
          )}
        </div>
      </Card>

      {/* TIMELINE */}
      <Card title="Project Timeline">
        <div className="space-y-4 border-l-2 border-indigo-200 pl-6">
          {milestones.map((m) => (
            <Milestone
              key={m.id}
              data={m}
              onComplete={() => markCompleted(m.id)}
            />
          ))}
        </div>
      </Card>

      {/* ACTIVITY FEED */}
      <Card icon={<FaStream />} title="Activity Feed">
        <div className="space-y-2">
          {activity.map((a) => (
            <div
              key={a.id}
              className="text-sm text-slate-600"
            >
              • {a.text}
              <span className="block text-xs text-slate-400">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =====================================================
   SHARED COMPONENTS
===================================================== */

const Section = ({ title, subtitle }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
    <h2 className="text-2xl font-semibold text-slate-800">
      {title}
    </h2>
    <p className="text-sm text-slate-500 mt-1">
      {subtitle}
    </p>
  </div>
);

const Card = ({ title, icon, children }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const ProgressCard = ({ progress, active }) => (
  <Card icon={<FaPercentage />} title="Overall Completion">
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-indigo-600">
        {progress}%
      </span>
    </div>
    <div className="h-2 rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-indigo-600 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
    {active && (
      <p className="text-xs text-slate-500">
        Current focus:{" "}
        <span className="font-semibold">
          {active.title}
        </span>
      </p>
    )}
  </Card>
);

const Milestone = ({ data, onComplete }) => {
  const isActive = data.status === "In Progress";

  return (
    <div
      className={`relative p-4 rounded-xl bg-white border ${
        isActive ? "ring-2 ring-indigo-400/40" : ""
      }`}
    >
      <h4 className="font-semibold flex items-center gap-2">
        <FaTasks className="text-indigo-600" />
        {data.title}
      </h4>

      <p className="text-sm text-slate-600 mt-1">
        {data.description}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {data.week}
      </p>

      <Status status={data.status} />

      {isActive && (
        <button
          onClick={onComplete}
          className="mt-3 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
        >
          <FaPlayCircle />
          Mark as Completed
        </button>
      )}
    </div>
  );
};

const Status = ({ status }) => {
  const map = {
    Completed: { icon: <FaCheckCircle />, color: "text-emerald-600" },
    "In Progress": { icon: <FaClock />, color: "text-yellow-600" },
    Pending: { icon: <FaClock />, color: "text-slate-500" },
  };

  return (
    <span
      className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold ${map[status].color}`}
    >
      {map[status].icon}
      {status}
    </span>
  );
};
