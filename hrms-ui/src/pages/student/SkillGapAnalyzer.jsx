import { useEffect, useMemo, useState } from "react";
import {
  FaTools,
  FaCheckCircle,
  FaArrowDown,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

/* =====================================================
   STUDENT SKILL GAP ANALYZER – NEXT LEVEL
===================================================== */

export default function SkillGapAnalyzer() {
  const [skills, setSkills] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    setSkills([
      {
        skill: "Manual Testing",
        required: 80,
        current: 75,
        recommendation:
          "Revise test case design techniques and defect life cycle.",
      },
      {
        skill: "Automation (Playwright)",
        required: 75,
        current: 60,
        recommendation:
          "Practice locators, fixtures, and framework structure.",
      },
      {
        skill: "SQL",
        required: 70,
        current: 65,
        recommendation:
          "Focus on joins, subqueries, and real-time queries.",
      },
      {
        skill: "Communication",
        required: 70,
        current: 55,
        recommendation:
          "Improve mock interview explanations and confidence.",
      },
      {
        skill: "Git / Version Control",
        required: 60,
        current: 50,
        recommendation:
          "Practice daily commits and pull request workflows.",
      },
    ]);
  }, []);

  /* ================= DERIVED METRICS ================= */

  const enrichedSkills = useMemo(() => {
    return [...skills]
      .map((s) => {
        const gap = s.required - s.current;

        let level = "Strong";
        if (gap > 15) level = "Critical";
        else if (gap > 5) level = "Needs Improvement";

        return { ...s, gap, level };
      })
      .sort((a, b) => b.gap - a.gap);
  }, [skills]);

  const readinessScore = useMemo(() => {
    if (!skills.length) return 0;
    const total = skills.reduce((sum, s) => sum + s.current, 0);
    return Math.round(total / skills.length);
  }, [skills]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Skill Gap Analyzer
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Measure readiness against industry-required skill benchmarks
        </p>
      </div>

      {/* OVERALL READINESS */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaChartLine className="text-indigo-600 text-xl" />
          <p className="font-medium text-slate-700">
            Overall Skill Readiness
          </p>
        </div>
        <span
          className={`text-2xl font-bold ${
            readinessScore >= 75
              ? "text-emerald-600"
              : readinessScore >= 60
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {readinessScore}%
        </span>
      </div>

      {/* SKILLS */}
      <div className="space-y-4">
        {enrichedSkills.map((s, i) => (
          <SkillCard key={i} data={s} />
        ))}
      </div>

      {!skills.length && (
        <p className="text-center text-sm text-slate-400">
          No skill data available
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const SkillCard = ({ data }) => {
  const statusMap = {
    Strong: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      badge: "bg-emerald-100",
    },
    "Needs Improvement": {
      icon: <FaArrowDown />,
      color: "text-yellow-600",
      badge: "bg-yellow-100",
    },
    Critical: {
      icon: <FaExclamationTriangle />,
      color: "text-red-600",
      badge: "bg-red-100",
    },
  };

  const status = statusMap[data.level];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
      <div className="flex justify-between gap-6">
        {/* LEFT */}
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaTools className="text-indigo-600" />
            {data.skill}
          </h3>

          <p className="text-sm text-slate-600">
            {data.recommendation}
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-right space-y-2">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.badge} ${status.color}`}
          >
            {status.icon}
            {data.level}
          </span>

          {data.gap > 0 && (
            <p className="text-xs text-slate-500">
              Gap: {data.gap}%
            </p>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mt-4 space-y-2">
        <Progress label="Current Level" value={data.current} color="bg-indigo-500" />
        <Progress label="Required Level" value={data.required} color="bg-emerald-500" />
      </div>
    </div>
  );
};

const Progress = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-slate-200 mt-1">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);
