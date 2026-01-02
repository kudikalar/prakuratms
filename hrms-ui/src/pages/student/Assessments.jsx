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
  FaSearch,
  FaChartLine,
} from "react-icons/fa";

/* =====================================================
   STUDENT ASSESSMENTS – MOBILE + DESKTOP
   ❌ NO CONTENT REMOVED
===================================================== */

const PAGE_SIZE = 5;

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  /* ================= FILTER + SEARCH + DATE ================= */

  const filtered = useMemo(() => {
    let list = [...assessments];

    if (filter !== "ALL") list = list.filter((a) => a.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.level.toLowerCase().includes(q)
      );
    }

    if (startDate) list = list.filter((a) => new Date(a.date) >= new Date(startDate));
    if (endDate) list = list.filter((a) => new Date(a.date) <= new Date(endDate));

    return list;
  }, [assessments, filter, search, startDate, endDate]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => setPage(1), [filter, search, startDate, endDate]);

  /* ================= INSIGHTS ================= */

  const avgScore = filtered.filter((a) => a.score !== null).reduce((s, a) => s + a.score, 0);
  const completedCount = filtered.filter((a) => a.status === "Completed").length;

  const insight =
    completedCount === 0
      ? "Start attempting assessments to improve your readiness."
      : avgScore / completedCount > 80
      ? "Excellent performance! You're in the top tier."
      : avgScore / completedCount > 60
      ? "Good progress. Keep improving your scores!"
      : "You need to focus on consistency and revision.";

  /* ================= UI ================= */

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow border">
        <h2 className="text-xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FaClipboardList className="text-indigo-600" />
          Assessments
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Track, attempt and review your assessments
        </p>
      </div>

      {/* INSIGHTS */}
      <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border shadow flex items-center gap-3">
        <FaChartLine className="text-purple-600 text-xl" />
        <span className="text-sm text-slate-700">{insight}</span>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow border space-y-4">

        {/* SEARCH + STATUS */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow w-full lg:w-80">
            <FaSearch className="text-slate-400" />
            <input
              className="w-full outline-none text-sm"
              placeholder="Search assessments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
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

        {/* DATE FILTERS */}
        <div className="flex flex-wrap gap-3 items-center">
          <FaFilter className="text-slate-400" />

          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-1.5 rounded-xl border bg-white text-sm" />
          <span className="text-slate-400 text-sm">to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-1.5 rounded-xl border bg-white text-sm" />

          <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-xs text-red-500 underline">
            Clear
          </button>
        </div>
      </div>

      {/* TABLE – MOBILE SCROLL SAFE */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow border overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-purple-600 text-white">
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
              <tr key={a.id} className="border-t hover:bg-purple-50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(a.date).toDateString()} • {a.duration}
                  </div>
                </td>
                <td className="text-center">{a.type}</td>
                <td className="text-center">{a.level}</td>
                <td className="text-center"><StatusBadge status={a.status} /></td>
                <td className="text-center">{a.score !== null ? `${a.score}%` : "--"}</td>
                <td className="px-4 py-3"><Actions status={a.status} /></td>
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
        <div className="flex justify-center md:justify-end items-center gap-4">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-2 rounded bg-slate-100 disabled:opacity-40">
            <FaChevronLeft />
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 rounded bg-slate-100 disabled:opacity-40">
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatusBadge = ({ status }) => {
  const map = {
    Completed: { icon: <FaCheckCircle />, color: "text-emerald-600", bg: "bg-emerald-100" },
    Pending: { icon: <FaClock />, color: "text-yellow-600", bg: "bg-yellow-100" },
    Failed: { icon: <FaTimesCircle />, color: "text-red-600", bg: "bg-red-100" },
  };

  const s = map[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}>
      {s.icon}
      {status}
    </span>
  );
};

const Actions = ({ status }) => (
  <div className="flex justify-center gap-2">
    {status === "Pending" && <ActionBtn icon={<FaPlayCircle />} />}
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
      ${outline ? "border hover:bg-slate-100" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
  >
    {icon}
  </button>
);
