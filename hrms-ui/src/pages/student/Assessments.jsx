import { useEffect, useState, useMemo } from "react";
import {
  FaClipboardList,
  FaPlayCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRedo,
  FaEye,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

/* =====================================================
   STUDENT ASSESSMENTS (TABLE LAYOUT + PAGINATION)
===================================================== */

const PAGE_SIZE = 5;

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  /* ================= INIT ================= */

  useEffect(() => {
    setAssessments([
      {
        id: 1,
        title: "Manual Testing – Basics",
        type: "MCQ",
        level: "Beginner",
        status: "Completed",
        score: 82,
        duration: "30 mins",
        attempts: 1,
        date: "2025-01-05",
      },
      {
        id: 2,
        title: "Automation – Playwright",
        type: "Practical",
        level: "Advanced",
        status: "Pending",
        score: null,
        duration: "90 mins",
        attempts: 0,
        date: "2025-01-10",
      },
      {
        id: 3,
        title: "SQL Fundamentals",
        type: "MCQ",
        level: "Intermediate",
        status: "Completed",
        score: 64,
        duration: "40 mins",
        attempts: 2,
        date: "2025-01-02",
      },
      {
        id: 4,
        title: "Java Basics",
        type: "MCQ",
        level: "Beginner",
        status: "Completed",
        score: 91,
        duration: "30 mins",
        attempts: 1,
        date: "2025-01-07",
      },
      {
        id: 5,
        title: "API Testing",
        type: "Practical",
        level: "Intermediate",
        status: "Pending",
        score: null,
        duration: "60 mins",
        attempts: 0,
        date: "2025-01-12",
      },
      {
        id: 6,
        title: "JavaScript Logic",
        type: "MCQ",
        level: "Intermediate",
        status: "Completed",
        score: 77,
        duration: "45 mins",
        attempts: 1,
        date: "2025-01-03",
      },
    ]);
  }, []);

  /* ================= FILTER + PAGINATION ================= */

  const filtered = useMemo(() => {
    if (filter === "ALL") return assessments;
    return assessments.filter((a) => a.status === filter);
  }, [assessments, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1); // reset page on filter change
  }, [filter]);

  /* ================= UI ================= */

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Assessments
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track, attempt and review your assessments
            </p>
          </div>

          {/* FILTER */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400" />
            {["ALL", "Pending", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                  ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow border border-white/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Assessment</th>
              <th>Type</th>
              <th>Level</th>
              <th>Status</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((a) => (
              <tr
                key={a.id}
                className="border-t hover:bg-white/80 transition"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">
                    {a.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(a.date).toDateString()} • {a.duration}
                  </div>
                </td>

                <td className="text-center">{a.type}</td>
                <td className="text-center">{a.level}</td>
                <td className="text-center">
                  <StatusBadge status={a.status} />
                </td>
                <td className="text-center">
                  {a.score !== null ? `${a.score}%` : "--"}
                </td>
                <td className="px-4 py-3">
                  <Actions status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!paginated.length && (
          <p className="text-center text-sm text-slate-400 py-8">
            No assessments found
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded bg-slate-100 disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded bg-slate-100 disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const StatusBadge = ({ status }) => {
  const map = {
    Completed: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Pending: {
      icon: <FaClock />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    Failed: {
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

const Actions = ({ status }) => (
  <div className="flex justify-center gap-2">
    {status === "Pending" && (
      <ActionBtn icon={<FaPlayCircle />} />
    )}
    {status === "Completed" && (
      <>
        <ActionBtn icon={<FaEye />} />
        <ActionBtn icon={<FaRedo />} outline />
      </>
    )}
  </div>
);

const ActionBtn = ({ icon, outline }) => (
  <button
    className={`p-2 rounded-lg text-sm transition
      ${
        outline
          ? "border hover:bg-slate-100"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
      }`}
  >
    {icon}
  </button>
);
