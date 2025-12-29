import { useEffect, useState, useMemo } from "react";
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
  FaStar,
  FaThLarge,
  FaTable,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* =====================================================
   STUDENT MOCK INTERVIEWS – ENTERPRISE PREMIUM EDITION
   • Card View + Prakura Purple Table View
   • Sorting + Pagination + Search
   • Glass UI v3 + Smooth Animations
===================================================== */

export default function MockInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [view, setView] = useState("card"); // card | table
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const navigate = useNavigate();

  /* ================= INIT ================= */

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

  /* ================= FILTER + SORT ================= */

  const filtered = useMemo(() => {
    return interviews
      .filter(
        (i) =>
          i.technology.toLowerCase().includes(search.toLowerCase()) ||
          i.interviewer.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "date")
          return new Date(b.date) - new Date(a.date);
        if (sortBy === "score")
          return (b.score || 0) - (a.score || 0);
        return 0;
      });
  }, [interviews, search, sortBy]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-slate-800">
          Mock Interviews
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track, prepare, and improve your interview performance
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap justify-between items-center gap-4">

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-xl border shadow">
          <FaSearch className="text-slate-400" />
          <input
            placeholder="Search interviewer or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm bg-transparent"
          />
        </div>

        {/* Sort */}
        <select
          className="px-4 py-2 rounded-xl border bg-white shadow text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="score">Sort by Score</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("card")}
            className={`px-4 py-2 rounded-xl border shadow flex items-center gap-2 ${
              view === "card"
                ? "bg-purple-600 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            <FaThLarge /> Card View
          </button>

          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-xl border shadow flex items-center gap-2 ${
              view === "table"
                ? "bg-purple-600 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            <FaTable /> Table View
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <PurpleTable
          data={paginated}
          navigate={navigate}
        />
      )}

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="space-y-6">
          {paginated.map((i) => (
            <InterviewCard key={i.id} data={i} navigate={navigate} />
          ))}
        </div>
      )}

      {!filtered.length && (
        <p className="text-center text-sm text-slate-400">
          No matching interview records
        </p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-5 pt-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="pagination-btn"
          >
            <FaArrowLeft />
          </button>

          <span className="text-sm text-slate-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="pagination-btn"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   PURPLE TABLE VIEW
===================================================== */

function PurpleTable({ data, navigate }) {
  return (
    <div className="overflow-x-auto rounded-3xl shadow-xl border border-purple-200 bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-600 text-white text-left">
            <th className="p-4">Technology</th>
            <th className="p-4">Interviewer</th>
            <th className="p-4">Date</th>
            <th className="p-4">Time</th>
            <th className="p-4">Score</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i) => (
            <tr
              key={i.id}
              className="border-b hover:bg-purple-50 transition"
            >
              <td className="p-4 font-medium">{i.technology}</td>
              <td className="p-4">{i.interviewer}</td>
              <td className="p-4">
                {new Date(i.date).toDateString()}
              </td>
              <td className="p-4">{i.time}</td>
              <td className="p-4">{i.score ? `${i.score}/10` : "-"}</td>

              <td className="p-4">
                <StatusBadge status={i.status} />
              </td>

              <td className="p-4 text-right">
                <TableActions item={i} navigate={navigate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================================
   CARD VIEW (GLASS)
===================================================== */

const InterviewCard = ({ data, navigate }) => (
  <div
    className="
      bg-white/60 backdrop-blur-2xl rounded-3xl p-6 shadow-xl 
      border border-white/40 hover:shadow-2xl hover:-translate-y-1 
      transition-all duration-300 space-y-4
    "
  >
    <div className="flex justify-between items-start gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FaUserTie className="text-indigo-600 text-lg" />
          <h3 className="font-bold text-slate-800 text-lg">
            {data.technology}
          </h3>
        </div>

        <p className="text-sm text-slate-600">
          Interviewer: {data.interviewer}
        </p>

        <p className="text-xs text-slate-500 mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FaCalendarAlt /> {new Date(data.date).toDateString()}
          </span>
          <span className="flex items-center gap-1">
            <FaClock /> {data.time}
          </span>
        </p>

        {data.score && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            Score: {data.score} / 10
          </p>
        )}
      </div>

      <StatusBadge status={data.status} />
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-3 pt-2">
      <TableActions item={data} navigate={navigate} />
    </div>
  </div>
);

/* =====================================================
   ACTIONS (SHARED)
===================================================== */

function TableActions({ item, navigate }) {
  return (
    <>
      {item.status === "Scheduled" && (
        <Action
          icon={<FaVideo />}
          label="Prepare / Join"
          onClick={() => navigate(`/student/mock/prepare/${item.id}`)}
        />
      )}

      {item.status === "Completed" && (
        <Action
          icon={<FaClipboardCheck />}
          label="View Feedback"
          onClick={() => navigate(`/student/mock/feedback/${item.id}`)}
        />
      )}

      {item.status === "Missed" && (
        <Action
          icon={<FaRedo />}
          label="Request Reattempt"
          onClick={() => navigate(`/student/mock/reattempt/${item.id}`)}
        />
      )}
    </>
  );
}

const Action = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="
      flex items-center gap-2 text-sm font-semibold text-indigo-600 
      hover:text-purple-600 hover:underline transition
    "
  >
    {icon}
    {label}
  </button>
);

/* =====================================================
   STATUS BADGE
===================================================== */

const StatusBadge = ({ status }) => {
  const map = {
    Scheduled: {
      icon: <FaHourglassHalf />,
      color: "text-yellow-700",
      bg: "bg-yellow-100/80 border border-yellow-300/50 shadow",
      pulse: "animate-pulse",
    },
    Completed: {
      icon: <FaCheckCircle />,
      color: "text-emerald-700",
      bg: "bg-emerald-100/80 border border-emerald-300/50 shadow",
    },
    Missed: {
      icon: <FaTimesCircle />,
      color: "text-red-700",
      bg: "bg-red-100/80 border border-red-300/50 shadow",
    },
  };

  const s = map[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full 
        text-xs font-semibold ${s.bg} ${s.color} ${s.pulse || ""}
      `}
    >
      {s.icon}
      {status}
    </span>
  );
};

/* =====================================================
   EXTRA CSS
===================================================== */

const customStyles = `
.pagination-btn {
  @apply px-3 py-2 rounded-xl bg-white/80 border border-white/60 backdrop-blur-xl shadow hover:bg-purple-100 disabled:opacity-40 transition;
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = customStyles;
  document.head.appendChild(style);
}
