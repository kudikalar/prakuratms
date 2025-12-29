import { useEffect, useState } from "react";
import {
  FaCalendarWeek,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from "react-icons/fa";

/* =====================================================
   STUDENT WEEKLY LEARNING GOALS – TABLE FORMAT
===================================================== */

export default function WeeklyLearningGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  /* ================= INIT ================= */

  useEffect(() => {
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
          Plan, track, and review your weekly learning objectives
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <FaPlus />
            Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Week</th>
              <th className="px-6 py-4 text-left">Goal</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((g) => (
              <tr
                key={g.id}
                className="border-t hover:bg-slate-50 transition"
              >
                {/* WEEK */}
                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                  <FaCalendarWeek className="text-indigo-600" />
                  {g.week}
                </td>

                {/* TITLE */}
                <td className="px-6 py-4 font-medium text-slate-800">
                  {g.title}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      g.status === "Completed"
                        ? "bg-emerald-100 text-emerald-600"
                        : g.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {g.status === "Completed" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaClock />
                    )}
                    {g.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleStatus(g.id)}
                    className="text-indigo-600 font-semibold hover:underline text-sm"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!goals.length && (
          <p className="text-center py-6 text-slate-400">
            No goals added yet
          </p>
        )}
      </div>
    </div>
  );
}
