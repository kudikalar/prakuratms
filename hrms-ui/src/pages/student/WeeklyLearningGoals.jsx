import { useEffect, useState } from "react";
import {
  FaCalendarWeek,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from "react-icons/fa";

/* =====================================================
   STUDENT WEEKLY LEARNING GOALS – PRODUCTION READY
===================================================== */

export default function WeeklyLearningGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setGoals([
      {
        id: 1,
        week: "Week 1",
        title: "Revise Manual Testing Basics",
        status: "Completed",
      },
      {
        id: 2,
        week: "Week 1",
        title: "Practice SQL Joins",
        status: "Completed",
      },
      {
        id: 3,
        week: "Week 2",
        title: "Build Playwright Test Script",
        status: "In Progress",
      },
      {
        id: 4,
        week: "Week 2",
        title: "Mock Interview Preparation",
        status: "Pending",
      },
    ]);
  }, []);

  /* ================= HANDLERS ================= */

  const addGoal = () => {
    if (!newGoal.trim()) return;

    setGoals((g) => [
      ...g,
      {
        id: Date.now(),
        week: "Current Week",
        title: newGoal,
        status: "Pending",
      },
    ]);
    setNewGoal("");
  };

  const toggleStatus = (id) => {
    setGoals((g) =>
      g.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status:
                goal.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : goal
      )
    );
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Weekly Learning Goals
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Plan your weekly learning and track your progress
        </p>
      </div>

      {/* ADD GOAL */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border">
        <h3 className="font-semibold text-slate-800 mb-3">
          Add New Goal
        </h3>

        <div className="flex gap-3">
          <input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter your learning goal"
            className="flex-1 px-4 py-2 rounded-xl border bg-white/80"
          />
          <button
            onClick={addGoal}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold
            "
          >
            <FaPlus />
            Add
          </button>
        </div>
      </div>

      {/* GOALS LIST */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border">
        <h3 className="font-semibold text-slate-800 mb-4">
          My Goals
        </h3>

        <div className="space-y-3">
          {goals.map((g) => (
            <GoalItem
              key={g.id}
              goal={g}
              onToggle={() => toggleStatus(g.id)}
            />
          ))}
        </div>

        {!goals.length && (
          <p className="text-center text-sm text-slate-400">
            No goals added yet
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const GoalItem = ({ goal, onToggle }) => (
  <div
    className="
      flex justify-between items-center
      px-4 py-3 rounded-xl
      bg-white/80 border
    "
  >
    <div>
      <p className="font-medium text-slate-800">
        {goal.title}
      </p>
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <FaCalendarWeek />
        {goal.week}
      </p>
    </div>

    <button
      onClick={onToggle}
      className={`flex items-center gap-2 text-sm font-semibold ${
        goal.status === "Completed"
          ? "text-emerald-600"
          : goal.status === "In Progress"
          ? "text-yellow-600"
          : "text-slate-500"
      }`}
    >
      {goal.status === "Completed" ? (
        <FaCheckCircle />
      ) : (
        <FaClock />
      )}
      {goal.status}
    </button>
  </div>
);
