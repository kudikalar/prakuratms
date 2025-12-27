import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

/* =====================================================
   STUDENT PLACEMENT READINESS SCORE
===================================================== */

export default function PlacementReadiness() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // 🔹 Replace with API later
    const data = {
      attendance: 88,
      assessments: 74,
      mockInterviews: 7.5,
      oneToOne: 8,
      projects: 70,
      feesCleared: true,
    };

    const overall = Math.round(
      data.attendance * 0.25 +
        data.assessments * 0.2 +
        data.mockInterviews * 10 * 0.2 +
        data.oneToOne * 10 * 0.15 +
        data.projects * 0.2
    );

    setMetrics({ ...data, overall });
  }, []);

  if (!metrics) return null;

  const eligible =
    metrics.attendance >= 85 &&
    metrics.mockInterviews >= 7 &&
    metrics.feesCleared;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Placement Readiness
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Overall evaluation of your placement preparedness
        </p>
      </div>

      {/* OVERALL SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard
          title="Overall Readiness"
          value={`${metrics.overall}%`}
          highlight
        />

        <StatusCard eligible={eligible} />

        <ScoreCard
          title="Attendance"
          value={`${metrics.attendance}%`}
        />
      </div>

      {/* BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Metric label="Assessments" value={metrics.assessments} />
        <Metric label="Mock Interviews" value={metrics.mockInterviews * 10} />
        <Metric label="1:1 Discussions" value={metrics.oneToOne * 10} />
        <Metric label="Live Projects" value={metrics.projects} />
      </div>

      {/* IMPROVEMENT GAP */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h3 className="font-semibold text-slate-800 mb-4">
          Improvement Gaps
        </h3>

        <Gap label="Assessment Score" current={metrics.assessments} target={80} />
        <Gap
          label="Mock Interview"
          current={metrics.mockInterviews * 10}
          target={75}
        />
        <Gap label="Project Quality" current={metrics.projects} target={80} />
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const ScoreCard = ({ title, value, highlight }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border">
    <p className="text-sm text-slate-500">{title}</p>
    <h3
      className={`text-3xl font-bold mt-1 ${
        highlight ? "text-indigo-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const StatusCard = ({ eligible }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border flex flex-col justify-center">
    <p className="text-sm text-slate-500">Placement Eligibility</p>
    <div
      className={`flex items-center gap-2 mt-2 font-semibold ${
        eligible ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {eligible ? <FaCheckCircle /> : <FaTimesCircle />}
      {eligible ? "Eligible" : "Not Eligible"}
    </div>
  </div>
);

const Metric = ({ label, value }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3 className="text-xl font-semibold text-slate-800">
      {value}%
    </h3>
  </div>
);

const Gap = ({ label, current, target }) => {
  const diff = target - current;
  const improved = diff <= 0;

  return (
    <div className="flex justify-between items-center py-3 border-b last:border-0">
      <span className="text-sm text-slate-700">{label}</span>

      <div
        className={`flex items-center gap-2 font-semibold ${
          improved ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {improved ? <FaArrowUp /> : <FaArrowDown />}
        {improved ? "On Track" : `${diff}% Needed`}
      </div>
    </div>
  );
};
