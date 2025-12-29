import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaBookOpen,
  FaClipboardCheck,
  FaCalendarCheck,
  FaTrophy,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const MOCK_PERFORMANCE = {
  studentName: "Ramesh Kumar",
  batch: "Playwright Jan 2025",
  course: "Playwright Automation",
  overallProgress: 72,
  attendance: 88,
  assessments: [
    {
      id: 1,
      title: "Basics Assessment",
      score: 78,
      max: 100,
    },
    {
      id: 2,
      title: "Selectors Test",
      score: 85,
      max: 100,
    },
    {
      id: 3,
      title: "Mini Project Review",
      score: 70,
      max: 100,
    },
  ],
};

export default function Performance() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Replace with API call
    setData(MOCK_PERFORMANCE);
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Performance Overview
        </h1>
        <p className="text-sm text-gray-500">
          Track learning progress and assessment performance
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid gap-6 md:grid-cols-3">
        <SummaryCard
          icon={<FaChartLine />}
          label="Overall Progress"
          value={`${data.overallProgress}%`}
          color="from-indigo-500 to-purple-500"
        />
        <SummaryCard
          icon={<FaCalendarCheck />}
          label="Attendance"
          value={`${data.attendance}%`}
          color="from-emerald-500 to-teal-500"
        />
        <SummaryCard
          icon={<FaTrophy />}
          label="Batch"
          value={data.batch}
          color="from-orange-500 to-yellow-400"
          text
        />
      </div>

      {/* ================= COURSE INFO ================= */}
      <InfoCard title="Course Information">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <FaBookOpen className="text-indigo-500" />
          <span>{data.course}</span>
        </div>
      </InfoCard>

      {/* ================= ASSESSMENTS ================= */}
      <InfoCard title="Assessments Performance">
        <div className="space-y-4">
          {data.assessments.map((a) => (
            <AssessmentRow key={a.id} assessment={a} />
          ))}
        </div>
      </InfoCard>
    </div>
  );
}

/* ================= SUMMARY CARD ================= */
function SummaryCard({ icon, label, value, color, text }) {
  return (
    <div
      className="
        rounded-2xl p-5
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow
      "
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            p-3 rounded-xl text-white
            bg-gradient-to-r ${color}
          `}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p
            className={`font-bold ${
              text ? "text-sm" : "text-xl"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= INFO CARD ================= */
function InfoCard({ title, children }) {
  return (
    <div
      className="
        rounded-2xl p-5
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow
      "
    >
      <h2 className="font-semibold text-gray-800 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ================= ASSESSMENT ROW ================= */
function AssessmentRow({ assessment }) {
  const percentage = Math.round(
    (assessment.score / assessment.max) * 100
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="flex items-center gap-2">
          <FaClipboardCheck className="text-indigo-500" />
          {assessment.title}
        </span>
        <span>
          {assessment.score}/{assessment.max}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* ================= LOADING ================= */
function Loading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded-xl" />
      <div className="h-32 bg-gray-200 rounded-xl" />
    </div>
  );
}
