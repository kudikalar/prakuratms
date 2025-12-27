import { useEffect, useState } from "react";
import {
  FaUserFriends,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

/* =====================================================
   STUDENT 1:1 DISCUSSIONS – PRODUCTION READY
===================================================== */

export default function OneToOneDiscussions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // 🔹 Replace with API later
    setSessions([
      {
        id: 1,
        week: "Week 1",
        date: "2025-01-05",
        mentor: "Ramesh (QA Lead)",
        topics: ["Manual Testing Basics", "SDLC"],
        status: "Completed",
        previousScore: 5,
        currentScore: 7,
        feedback:
          "Good improvement in fundamentals. Need to work on real-time examples.",
      },
      {
        id: 2,
        week: "Week 2",
        date: "2025-01-12",
        mentor: "Suresh (Automation Lead)",
        topics: ["Playwright Framework", "Selectors"],
        status: "Completed",
        previousScore: 7,
        currentScore: 8,
        feedback:
          "Strong automation concepts. Improve explanation clarity.",
      },
      {
        id: 3,
        week: "Week 3",
        date: "2025-01-19",
        mentor: "HR Panel",
        topics: ["Communication", "Confidence"],
        status: "Scheduled",
        previousScore: 8,
        currentScore: null,
        feedback: null,
      },
    ]);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <h2 className="text-2xl font-semibold text-slate-800">
          1:1 Discussions
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Weekly mentoring sessions and improvement tracking
        </p>
      </div>

      {/* SESSION LIST */}
      <div className="space-y-4">
        {sessions.map((s) => (
          <SessionCard key={s.id} data={s} />
        ))}
      </div>

      {!sessions.length && (
        <p className="text-center text-sm text-slate-400">
          No 1:1 sessions available
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const SessionCard = ({ data }) => {
  const improvement =
    data.currentScore !== null
      ? data.currentScore - data.previousScore
      : null;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
      <div className="flex justify-between items-start gap-4">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaUserFriends className="text-indigo-600" />
            <h3 className="font-semibold text-slate-800">
              {data.week}
            </h3>
          </div>

          <p className="text-sm text-slate-600">
            Mentor: {data.mentor}
          </p>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <FaCalendarAlt />
            {new Date(data.date).toDateString()}
          </p>

          <p className="text-sm text-slate-600 mt-2">
            Topics:{" "}
            <span className="font-medium">
              {data.topics.join(", ")}
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <StatusBadge status={data.status} />
      </div>

      {/* IMPROVEMENT SECTION */}
      {data.status === "Completed" && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Score label="Previous" value={data.previousScore} />
          <Score label="Current" value={data.currentScore} />
          <Improvement value={improvement} />
        </div>
      )}

      {/* FEEDBACK */}
      {data.feedback && (
        <div className="mt-4">
          <p className="text-sm text-slate-500">Mentor Feedback</p>
          <p className="text-sm text-slate-700">
            {data.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

/* ================= HELPERS ================= */

const StatusBadge = ({ status }) => {
  const map = {
    Completed: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Scheduled: {
      icon: <FaClock />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
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

const Score = ({ label, value }) => (
  <div className="bg-white/80 rounded-xl p-4 text-center border">
    <p className="text-xs text-slate-500">{label}</p>
    <h3 className="text-xl font-bold text-slate-800">
      {value}/10
    </h3>
  </div>
);

const Improvement = ({ value }) => (
  <div className="bg-white/80 rounded-xl p-4 text-center border">
    <p className="text-xs text-slate-500">Improvement</p>
    <div
      className={`flex justify-center items-center gap-2 text-xl font-bold ${
        value >= 0 ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {value >= 0 ? <FaArrowUp /> : <FaArrowDown />}
      {Math.abs(value)}
    </div>
  </div>
);
