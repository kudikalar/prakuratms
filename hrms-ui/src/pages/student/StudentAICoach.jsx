import { useEffect, useState } from "react";
import {
  FaBrain,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowUp,
  FaPlay,
} from "react-icons/fa";

/* =====================================================
   AI LEARNING COACH – STUDENT VIEW
===================================================== */

export default function StudentAICoach() {
  const [coach, setCoach] = useState(null);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with AI API later
    setCoach({
      focus: "Playwright Automation – Locators",
      reason:
        "Your automation score is below the placement benchmark. Improving locators will directly impact interview success.",
      actions: [
        "Practice 5 Playwright locator strategies",
        "Refactor 1 test case using Page Object Model",
        "Revise interview answer: Why locators fail?",
      ],
      risk: "Medium",
      motivation:
        "You are close to interview-ready. Focus consistently for the next 5 days.",
      placementBoost: {
        from: 72,
        to: 78,
      },
    });
  }, []);

  if (!coach) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <FaBrain className="text-indigo-600 text-2xl" />
        <h3 className="text-xl font-semibold text-slate-800">
          AI Learning Coach
        </h3>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40 space-y-5">
        {/* FOCUS */}
        <div>
          <p className="text-xs text-slate-500">Today’s Focus</p>
          <h4 className="text-lg font-semibold text-slate-800">
            {coach.focus}
          </h4>
        </div>

        {/* REASON */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-slate-700">
          <strong>Why this matters:</strong>
          <p className="mt-1">{coach.reason}</p>
        </div>

        {/* ACTIONS */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            Action Plan
          </p>

          <ul className="space-y-2">
            {coach.actions.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <FaCheckCircle className="text-emerald-500 mt-0.5" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* RISK + BOOST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* RISK */}
          <div
            className={`rounded-xl p-4 text-sm font-semibold flex items-center gap-2 ${
              coach.risk === "High"
                ? "bg-red-100 text-red-700"
                : coach.risk === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <FaExclamationTriangle />
            Risk Level: {coach.risk}
          </div>

          {/* PLACEMENT BOOST */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm font-semibold flex items-center gap-2">
            <FaArrowUp className="text-emerald-600" />
            Placement Probability:
            <span className="text-emerald-700">
              {coach.placementBoost.from}% → {coach.placementBoost.to}%
            </span>
          </div>
        </div>

        {/* MOTIVATION */}
        <div className="bg-white/80 border rounded-xl p-4 text-sm text-slate-700">
          💡 <strong>Coach says:</strong> {coach.motivation}
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button
            className="
              flex items-center gap-2
              px-6 py-2 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold
            "
          >
            <FaPlay />
            Start Today’s Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
