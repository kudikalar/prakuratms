import { useEffect, useState } from "react";
import {
  FaUserTie,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaVideo,
  FaRedo,
  FaClipboardCheck,
} from "react-icons/fa";

/* =====================================================
   STUDENT MOCK INTERVIEWS – NEXT LEVEL
===================================================== */

export default function MockInterviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    setInterviews([
      {
        id: 1,
        interviewer: "Senior QA – Ramesh",
        technology: "Manual Testing",
        date: "2025-01-15",
        time: "10:30 AM",
        status: "Scheduled",
      },
      {
        id: 2,
        interviewer: "Automation Lead – Suresh",
        technology: "Playwright JS",
        date: "2025-01-08",
        time: "2:00 PM",
        status: "Completed",
        score: 7.5,
      },
      {
        id: 3,
        interviewer: "HR Panel",
        technology: "HR + Communication",
        date: "2024-12-28",
        time: "11:00 AM",
        status: "Missed",
      },
    ]);
  }, []);

  const grouped = {
    Scheduled: interviews.filter((i) => i.status === "Scheduled"),
    Completed: interviews.filter((i) => i.status === "Completed"),
    Missed: interviews.filter((i) => i.status === "Missed"),
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Mock Interviews
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track, prepare, and improve your interview performance
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard label="Scheduled" value={grouped.Scheduled.length} />
        <SummaryCard label="Completed" value={grouped.Completed.length} />
        <SummaryCard label="Missed" value={grouped.Missed.length} />
      </div>

      {/* SECTIONS */}
      {Object.entries(grouped).map(
        ([status, list]) =>
          list.length > 0 && (
            <div key={status} className="space-y-4">
              <h3 className="font-semibold text-slate-800">
                {status} Interviews
              </h3>
              {list.map((i) => (
                <InterviewCard key={i.id} data={i} />
              ))}
            </div>
          )
      )}

      {!interviews.length && (
        <p className="text-center text-sm text-slate-400">
          No mock interviews scheduled
        </p>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const SummaryCard = ({ label, value }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3 className="text-2xl font-bold text-indigo-600 mt-1">
      {value}
    </h3>
  </div>
);

const InterviewCard = ({ data }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border space-y-3">
    <div className="flex justify-between items-start gap-4">
      {/* LEFT */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FaUserTie className="text-indigo-600" />
          <h3 className="font-semibold text-slate-800">
            {data.technology}
          </h3>
        </div>

        <p className="text-sm text-slate-600">
          Interviewer: {data.interviewer}
        </p>

        <p className="text-xs text-slate-400 mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FaCalendarAlt />{" "}
            {new Date(data.date).toDateString()}
          </span>
          <span className="flex items-center gap-1">
            <FaClock /> {data.time}
          </span>
        </p>

        {data.score && (
          <p className="text-xs text-emerald-600 mt-2">
            Score: {data.score} / 10
          </p>
        )}
      </div>

      {/* RIGHT */}
      <StatusBadge status={data.status} />
    </div>

    {/* ACTIONS */}
    <div className="flex justify-end gap-3 pt-2">
      {data.status === "Scheduled" && (
        <Action icon={<FaVideo />} label="Prepare / Join" />
      )}
      {data.status === "Completed" && (
        <Action
          icon={<FaClipboardCheck />}
          label="View Feedback"
        />
      )}
      {data.status === "Missed" && (
        <Action icon={<FaRedo />} label="Request Reattempt" />
      )}
    </div>
  </div>
);

const Action = ({ icon, label }) => (
  <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline">
    {icon}
    {label}
  </button>
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
