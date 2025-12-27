import { useEffect, useState } from "react";
import {
  FaUserTie,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

/* =====================================================
   STUDENT – SCHEDULED MOCK INTERVIEWS (NEXT LEVEL)
===================================================== */

const PAGE_SIZE = 4;

export default function ScheduledInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setInterviews([
      {
        id: 1,
        technology: "Manual Testing",
        interviewer: "Senior QA – Ramesh",
        mode: "Online",
        date: "2025-01-20",
        time: "10:30 AM",
        status: "Scheduled",
      },
      {
        id: 2,
        technology: "Playwright Automation",
        interviewer: "Automation Lead – Suresh",
        mode: "Offline",
        date: "2025-01-15",
        time: "2:00 PM",
        status: "Completed",
      },
      {
        id: 3,
        technology: "HR & Communication",
        interviewer: "HR Panel",
        mode: "Online",
        date: "2025-01-10",
        time: "11:00 AM",
        status: "Missed",
      },
    ]);
  }, []);

  /* ================= FILTERING ================= */

  const filtered = interviews.filter(
    (i) =>
      (statusFilter === "All" || i.status === statusFilter) &&
      (modeFilter === "All" || i.mode === modeFilter)
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= STATS ================= */

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i) => i.status === "Scheduled").length,
    completed: interviews.filter((i) => i.status === "Completed").length,
    missed: interviews.filter((i) => i.status === "Missed").length,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Scheduled Interviews
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your mock interview schedules
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Summary label="Total" value={stats.total} />
        <Summary label="Upcoming" value={stats.scheduled} />
        <Summary label="Completed" value={stats.completed} />
        <Summary label="Missed" value={stats.missed} />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4">
        <Select
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={["All", "Scheduled", "Completed", "Missed"]}
        />
        <Select
          label="Mode"
          value={modeFilter}
          onChange={setModeFilter}
          options={["All", "Online", "Offline"]}
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {paginated.map((i) => (
          <InterviewCard key={i.id} data={i} />
        ))}
      </div>

      {!filtered.length && (
        <p className="text-center text-sm text-slate-400">
          No interviews found
        </p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded border disabled:opacity-40"
          >
            <FaArrowLeft />
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border disabled:opacity-40"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Summary = ({ label, value }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3 className="text-2xl font-bold text-indigo-600">{value}</h3>
  </div>
);

const InterviewCard = ({ data }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border hover:bg-white/80 transition">
    <div className="flex justify-between gap-6">
      {/* LEFT */}
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FaUserTie className="text-indigo-600" />
          {data.technology}
        </h3>

        <p className="text-sm text-slate-600">
          Interviewer: {data.interviewer}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <FaCalendarAlt />
            {new Date(data.date).toDateString()}
          </span>
          <span className="flex items-center gap-1">
            <FaClock />
            {data.time}
          </span>
          <span className="flex items-center gap-1">
            <FaVideo />
            {data.mode}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right space-y-3">
        <StatusBadge status={data.status} />

        {data.status === "Scheduled" && (
          <Action label="Join Interview" />
        )}

        {data.status === "Completed" && (
          <Action label="View Feedback" secondary />
        )}

        {data.status === "Missed" && (
          <Action label="Request Reschedule" secondary />
        )}
      </div>
    </div>
  </div>
);

const Action = ({ label, secondary }) => (
  <button
    className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${
      secondary
        ? "border text-indigo-600 hover:bg-indigo-50"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    {label}
  </button>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 px-4 py-2 rounded-xl border bg-white"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Scheduled: {
      icon: <FaHourglassHalf />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    Completed: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Missed: {
      icon: <FaTimesCircle />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  };

  const s = map[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}
    >
      {s.icon}
      {status}
    </span>
  );
};
