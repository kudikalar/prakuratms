import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaChartLine,
  FaProjectDiagram,
  FaClipboardCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGithub,
  FaFilePdf,
} from "react-icons/fa";

/* =====================================================
   OVERALL STUDENT REPORT DASHBOARD
===================================================== */

export default function OverallStudentReport() {
  const [report, setReport] = useState(null);

  /* ================= INIT ================= */

  useEffect(() => {
    setReport({
      student: {
        name: "Ramesh Kumar",
        batch: "QA Automation – Jan 2025",
        email: "ramesh@example.com",
      },

      scores: {
        skill: 7.4,
        project: 7.8,
        consistency: 8.2,
        interviewReadiness: 7.6,
        overall: 7.9,
      },

      placement: {
        eligible: true,
        risk: "Low",
      },

      attendance: {
        percentage: 89,
        quality: "Good",
      },

      projects: {
        total: 3,
        completed: 2,
        authenticity: "High",
      },

      github: {
        activeDays: 18,
        prApproved: 6,
        prChanges: 2,
      },

      remarks:
        "Consistent performer with strong project ownership. Ready for interviews.",
    });
  }, []);

  if (!report) return null;

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* HEADER */}
      <Header student={report.student} />

      {/* SUMMARY SCORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Score title="Skill Score" value={report.scores.skill} icon={<FaChartLine />} />
        <Score title="Project Score" value={report.scores.project} icon={<FaProjectDiagram />} />
        <Score title="Consistency" value={report.scores.consistency} icon={<FaClipboardCheck />} />
        <Score title="Interview Ready" value={report.scores.interviewReadiness} icon={<FaCheckCircle />} />
        <Score title="Overall Rating" value={report.scores.overall} highlight />
      </div>

      {/* STATUS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlacementStatus data={report.placement} />
        <AttendanceCard data={report.attendance} />
        <ProjectCard data={report.projects} />
      </div>

      {/* GITHUB ACTIVITY */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border border-white/40">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <FaGithub className="text-indigo-600" />
          GitHub Activity Summary
        </h3>

        <div className="grid grid-cols-3 gap-6 text-center">
          <Metric label="Active Days" value={report.github.activeDays} />
          <Metric label="PRs Approved" value={report.github.prApproved} />
          <Metric label="PR Changes" value={report.github.prChanges} />
        </div>
      </div>

      {/* REMARKS */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border border-white/40">
        <h3 className="font-semibold text-slate-800 mb-2">
          Mentor / System Remarks
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          {report.remarks}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end">
        <button
          className="
            flex items-center gap-2
            px-6 py-2.5 rounded-2xl
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            text-white font-semibold
            shadow-md transition
          "
        >
          <FaFilePdf />
          Export Report (PDF)
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Header = ({ student }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border border-white/40">
    <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
      <FaUserGraduate className="text-indigo-600" />
      Overall Student Report
    </h2>

    <p className="text-sm text-slate-600 mt-1">
      {student.name} • {student.batch}
    </p>
    <p className="text-xs text-slate-500">{student.email}</p>
  </div>
);

const Score = ({ title, value, highlight, icon }) => {
  const color =
    value >= 8
      ? "text-emerald-600"
      : value >= 6.5
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border text-center">
      <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
        {icon}
        {title}
      </p>
      <h3
        className={`text-2xl font-bold mt-2 ${
          highlight ? "text-indigo-600" : color
        }`}
      >
        {value} / 10
      </h3>
    </div>
  );
};

const PlacementStatus = ({ data }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border border-white/40">
    <h3 className="font-semibold text-slate-800 mb-2">
      Placement Status
    </h3>

    <p
      className={`flex items-center gap-2 font-semibold ${
        data.eligible ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {data.eligible ? <FaCheckCircle /> : <FaExclamationTriangle />}
      {data.eligible ? "Eligible" : "Not Eligible"}
    </p>

    <span
      className={`
        inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
        ${data.risk === "Low"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"}
      `}
    >
      Risk Level: {data.risk}
    </span>
  </div>
);

const AttendanceCard = ({ data }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border border-white/40">
    <h3 className="font-semibold text-slate-800 mb-2">
      Attendance
    </h3>
    <p className="text-2xl font-bold text-indigo-600">
      {data.percentage}%
    </p>
    <p className="text-sm text-slate-500">
      Quality: {data.quality}
    </p>
  </div>
);

const ProjectCard = ({ data }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border border-white/40">
    <h3 className="font-semibold text-slate-800 mb-2">
      Projects
    </h3>
    <p className="text-sm text-slate-600">
      Completed: {data.completed} / {data.total}
    </p>
    <p className="text-sm text-slate-500">
      Authenticity: {data.authenticity}
    </p>
  </div>
);

const Metric = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-xl font-bold text-indigo-600">{value}</p>
  </div>
);
