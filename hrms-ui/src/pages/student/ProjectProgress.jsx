import { useEffect, useState, useMemo } from "react";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaPercentage,
  FaPlayCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECT PROGRESS TRACKER (NEXT LEVEL)
===================================================== */

export default function ProjectProgress() {
  const [milestones, setMilestones] = useState([]);

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
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Project Progress Tracker
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track milestones, progress, and completion flow
        </p>
      </div>

      {/* PROGRESS SUMMARY */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaPercentage className="text-indigo-600" />
            <p className="font-medium text-slate-700">
              Overall Completion
            </p>
          </div>
          <span className="text-2xl font-bold text-indigo-600">
            {progress}%
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {activeMilestone && (
          <p className="text-xs text-slate-500">
            Current focus:{" "}
            <span className="font-semibold text-slate-700">
              {activeMilestone.title}
            </span>
          </p>
        )}
      </div>

      {/* MILESTONES */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border">
        <h3 className="font-semibold text-slate-800 mb-4">
          Project Milestones
        </h3>

        <div className="space-y-4">
          {milestones.map((m) => (
            <Milestone
              key={m.id}
              data={m}
              onComplete={() => markCompleted(m.id)}
            />
          ))}
        </div>

        {!milestones.length && (
          <p className="text-center text-sm text-slate-400">
            No milestones defined
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Milestone = ({ data, onComplete }) => {
  const isActive = data.status === "In Progress";

  return (
    <div
      className={`p-4 rounded-xl border bg-white/80 space-y-2 ${
        isActive ? "ring-2 ring-indigo-400/40" : ""
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaTasks className="text-indigo-600" />
            {data.title}
          </h4>

          <p className="text-sm text-slate-600 mt-1">
            {data.description}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {data.week}
          </p>

          {data.completedOn && (
            <p className="text-xs text-emerald-600 mt-1">
              Completed on {new Date(data.completedOn).toDateString()}
            </p>
          )}
        </div>

        {/* STATUS */}
        <Status status={data.status} />
      </div>

      {/* ACTION */}
      {data.status === "In Progress" && (
        <button
          onClick={onComplete}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
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
    Completed: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
    },
    "In Progress": {
      icon: <FaClock />,
      color: "text-yellow-600",
    },
    Pending: {
      icon: <FaClock />,
      color: "text-slate-500",
    },
  };

  return (
    <span
      className={`flex items-center gap-2 text-sm font-semibold ${map[status]?.color}`}
    >
      {map[status]?.icon}
      {status}
    </span>
  );
};
