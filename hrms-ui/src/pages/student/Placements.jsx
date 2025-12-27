import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT PLACEMENT TRACKER (PRODUCTION READY)
===================================================== */

export default function StudentPlacements() {
  const [placements, setPlacements] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setPlacements([
      {
        id: 1,
        company: "TCS",
        role: "Junior Software Tester",
        interviewDate: "2025-01-12",
        status: "Scheduled",
      },
      {
        id: 2,
        company: "Infosys",
        role: "Automation Tester",
        interviewDate: "2024-12-20",
        status: "Selected",
      },
      {
        id: 3,
        company: "Wipro",
        role: "QA Engineer",
        interviewDate: "2024-12-10",
        status: "Rejected",
      },
    ]);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <h2 className="text-2xl font-semibold text-slate-800">
          Placement Tracker
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track your interview schedules and placement status
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {placements.map((p) => (
          <PlacementCard key={p.id} data={p} />
        ))}
      </div>

      {!placements.length && (
        <p className="text-center text-sm text-slate-400">
          No placement records available
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const PlacementCard = ({ data }) => (
  <div
    className="
      bg-white/70 backdrop-blur-xl
      rounded-2xl p-6 shadow
      border border-white/40
      hover:bg-white/80 transition
    "
  >
    <div className="flex justify-between items-start gap-4">
      {/* LEFT */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FaBuilding className="text-indigo-600" />
          <h3 className="font-semibold text-slate-800">
            {data.company}
          </h3>
        </div>

        <p className="text-sm text-slate-600 flex items-center gap-2">
          <FaBriefcase />
          {data.role}
        </p>

        <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
          <FaCalendarAlt />
          Interview Date:{" "}
          {new Date(data.interviewDate).toDateString()}
        </p>
      </div>

      {/* RIGHT */}
      <StatusBadge status={data.status} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Scheduled: {
      icon: <FaClock />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    Selected: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Rejected: {
      icon: <FaTimesCircle />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  };

  const s = map[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1 rounded-full text-xs font-medium
        ${s.bg} ${s.color}
      `}
    >
      {s.icon}
      {status}
    </span>
  );
};
