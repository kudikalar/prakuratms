import { useEffect, useState, useMemo } from "react";
import {
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaTasks,
  FaUserTie,
  FaCode,
  FaChartLine,
  FaMedal,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECTS – ENTERPRISE GRADE
===================================================== */

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    setProjects([
      {
        id: 1,
        title: "HRMS Automation Testing",
        type: "Live Project",
        technology: "Playwright + JavaScript",
        mentor: "Suresh Kumar",
        status: "In Progress",
        progress: 68,
        milestone: "Test Case Automation",
        deadline: "2025-02-15",
        placementRelevant: true,
      },
      {
        id: 2,
        title: "E-Commerce Manual Testing",
        type: "Internal Project",
        technology: "Manual + Test Scenarios",
        mentor: "Anitha R",
        status: "Completed",
        progress: 100,
        milestone: "Final Report Submitted",
        deadline: "2024-12-20",
        placementRelevant: false,
      },
      {
        id: 3,
        title: "Banking Domain Test Suite",
        type: "Capstone Project",
        technology: "Automation + SQL",
        mentor: "Prakash",
        status: "Pending",
        progress: 0,
        milestone: "Requirement Analysis",
        deadline: "2025-03-01",
        placementRelevant: true,
      },
    ]);
  }, []);

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const inProgress = projects.filter(p => p.status === "In Progress").length;
    const pending = projects.filter(p => p.status === "Pending").length;

    return { total, completed, inProgress, pending };
  }, [projects]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          My Projects
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track progress, milestones & mentor feedback
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Summary label="Total Projects" value={summary.total} />
        <Summary label="In Progress" value={summary.inProgress} highlight />
        <Summary label="Completed" value={summary.completed} success />
        <Summary label="Pending" value={summary.pending} />
      </div>

      {/* PROJECTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {!projects.length && (
        <p className="text-center text-sm text-slate-400">
          No projects assigned yet
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border space-y-4 hover:scale-[1.01] transition">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaProjectDiagram className="text-indigo-600" />
            {project.title}
          </h3>
          <p className="text-sm text-slate-500">
            {project.type}
          </p>
        </div>

        <Status status={project.status} />
      </div>

      {/* META */}
      <div className="text-sm text-slate-600 space-y-1">
        <Meta icon={<FaCode />} label="Technology" value={project.technology} />
        <Meta icon={<FaUserTie />} label="Mentor" value={project.mentor} />
        <Meta icon={<FaTasks />} label="Current Milestone" value={project.milestone} />
        <Meta icon={<FaClock />} label="Deadline" value={new Date(project.deadline).toDateString()} />
      </div>

      {/* PROGRESS */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* BADGES */}
      {project.placementRelevant && (
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
          <FaMedal />
          High Resume Value (Placement Project)
        </div>
      )}

      {/* ACTION */}
      <div className="pt-3 flex justify-end">
        <button
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
        >
          {project.status === "Completed"
            ? "View Report"
            : project.status === "Pending"
            ? "Start Project"
            : "Continue Work"}
          <FaArrowRight />
        </button>
      </div>
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
      icon: <FaChartLine />,
      color: "text-yellow-600",
    },
    Pending: {
      icon: <FaClock />,
      color: "text-slate-500",
    },
  };

  return (
    <span className={`flex items-center gap-2 text-sm font-semibold ${map[status]?.color}`}>
      {map[status]?.icon}
      {status}
    </span>
  );
};

const Summary = ({ label, value, highlight, success }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3
      className={`text-2xl font-bold mt-1 ${
        success
          ? "text-emerald-600"
          : highlight
          ? "text-indigo-600"
          : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const Meta = ({ icon, label, value }) => (
  <p className="flex items-center gap-2">
    <span className="text-indigo-500">{icon}</span>
    <span className="font-medium">{label}:</span> {value}
  </p>
);
