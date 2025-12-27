import { useEffect, useState } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaLightbulb,
  FaChartLine,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECT EVALUATION & SCORING (NEXT LEVEL)
===================================================== */

export default function ProjectEvaluation() {
  const [evaluation, setEvaluation] = useState(null);

  /* ================= INIT ================= */

  useEffect(() => {
    setEvaluation({
      project: "HRMS Automation Testing",
      evaluatedBy: "Suresh Kumar",
      date: "2025-01-18",
      scores: [
        { label: "Requirement Understanding", score: 8, skill: "Business Analysis" },
        { label: "Test Coverage", score: 6, skill: "Test Design" },
        { label: "Automation Quality", score: 7, skill: "Playwright Automation" },
        { label: "Code Structure", score: 6, skill: "Framework Design" },
        { label: "Documentation", score: 8, skill: "Technical Documentation" },
      ],
      remarks:
        "Good understanding overall. Improve automation structure and reusability.",
    });
  }, []);

  if (!evaluation) return null;

  /* ================= CALCULATIONS ================= */

  const avg =
    evaluation.scores.reduce((a, b) => a + b.score, 0) /
    evaluation.scores.length;

  const strengths = evaluation.scores.filter(s => s.score >= 7);
  const improvements = evaluation.scores.filter(s => s.score < 7);

  const interviewReady =
    avg >= 7 && improvements.length <= 2;

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Project Evaluation & Scoring
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Mentor-driven assessment mapped to interview readiness
        </p>
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScoreCard title="Final Score" value={avg.toFixed(1)} />
        <ScoreCard title="Evaluator" value={evaluation.evaluatedBy} />
        <StatusCard ready={interviewReady} />
      </div>

      {/* BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SCORE DETAILS */}
        <div className="bg-white/70 rounded-2xl p-6 shadow border">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartLine /> Evaluation Breakdown
          </h3>

          <div className="space-y-4">
            {evaluation.scores.map((s, i) => (
              <ScoreRow key={i} data={s} />
            ))}
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaLightbulb /> Insights
          </h3>

          <div>
            <p className="font-medium text-slate-700 mb-1">
              Strengths
            </p>
            {strengths.length ? (
              <ul className="list-disc list-inside text-sm text-emerald-600">
                {strengths.map((s, i) => (
                  <li key={i}>{s.label} ({s.skill})</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">None yet</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-1">
              Needs Improvement
            </p>
            {improvements.length ? (
              <ul className="list-disc list-inside text-sm text-yellow-600">
                {improvements.map((s, i) => (
                  <li key={i}>{s.label} ({s.skill})</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No gaps identified</p>
            )}
          </div>
        </div>
      </div>

      {/* REMARKS */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border">
        <h3 className="font-semibold text-slate-800 mb-2">
          Mentor Remarks
        </h3>
        <p className="text-sm text-slate-700">
          {evaluation.remarks}
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const ScoreCard = ({ title, value }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border">
    <p className="text-sm text-slate-500">{title}</p>
    <h3 className="text-3xl font-bold text-indigo-600 mt-1">
      {value}
    </h3>
  </div>
);

const StatusCard = ({ ready }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border flex flex-col justify-center">
    <p className="text-sm text-slate-500">Interview Readiness</p>
    <div
      className={`flex items-center gap-2 mt-2 font-semibold ${
        ready ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {ready ? <FaCheckCircle /> : <FaArrowDown />}
      {ready ? "Interview Ready" : "Needs Improvement"}
    </div>
  </div>
);

const ScoreRow = ({ data }) => {
  const good = data.score >= 7;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-700 font-medium">
          {data.label}
        </span>
        <span
          className={`flex items-center gap-2 font-semibold ${
            good ? "text-emerald-600" : "text-yellow-600"
          }`}
        >
          {good ? <FaArrowUp /> : <FaArrowDown />}
          {data.score} / 10
        </span>
      </div>

      <div className="h-2 rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${
            good ? "bg-emerald-500" : "bg-yellow-400"
          }`}
          style={{ width: `${data.score * 10}%` }}
        />
      </div>

      <p className="text-xs text-slate-400">
        Skill: {data.skill}
      </p>
    </div>
  );
};
