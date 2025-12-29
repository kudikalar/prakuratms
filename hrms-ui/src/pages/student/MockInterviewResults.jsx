import { useEffect, useState, useMemo } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

/* =====================================================
   MOCK INTERVIEW RESULTS – PRAKURA PURPLE TABLE UI
   (Search • Sorting • Pagination • No content removed)
===================================================== */

const PAGE_SIZE = 5;

export default function MockInterviewResults() {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("technology");
  const [sortOrder, setSortOrder] = useState("asc");

  /* ================= INIT ================= */
  useEffect(() => {
    setResults([
      {
        id: 1,
        technology: "Playwright JS",
        interviewer: "Automation Lead – Suresh",
        score: 8,
        status: "Pass",
        feedback:
          "Strong automation concepts. Improve framework explanation.",
      },
      {
        id: 2,
        technology: "Manual Testing",
        interviewer: "Senior QA – Ramesh",
        score: 6,
        status: "Needs Improvement",
        feedback:
          "Good fundamentals but needs better real-time examples.",
      },
      {
        id: 3,
        technology: "SQL Testing",
        interviewer: "DB Expert – Prakash",
        score: 9,
        status: "Pass",
        feedback: "Excellent query optimization and joins.",
      },
      {
        id: 4,
        technology: "Java Basics",
        interviewer: "Tech Panel",
        score: 5,
        status: "Needs Improvement",
        feedback: "Revise OOPs concepts and collections.",
      },
    ]);
  }, []);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...results];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.technology.toLowerCase().includes(q) ||
          r.interviewer.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }

    // sorting
    list.sort((a, b) => {
      const x = a[sortField];
      const y = b[sortField];
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [results, search, sortField, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= SORT HANDLER ================= */
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-3xl font-bold text-slate-800">
          Mock Interview Results
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Performance insights and mentor feedback
        </p>
      </div>

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by technology, interviewer, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow text-sm w-full md:w-80"
        />

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <p className="font-semibold text-indigo-600">
            Total: {results.length}
          </p>
          <p className="font-semibold text-emerald-600">
            Passed: {results.filter((r) => r.status === "Pass").length}
          </p>
          <p className="font-semibold text-purple-600">
            Avg Score:{" "}
            {results.length
              ? (
                  results.reduce((a, b) => a + b.score, 0) /
                  results.length
                ).toFixed(1)
              : 0}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <Th label="Technology" field="technology" onSort={toggleSort} sortField={sortField} sortOrder={sortOrder} />
              <Th label="Interviewer" field="interviewer" onSort={toggleSort} sortField={sortField} sortOrder={sortOrder} />
              <Th label="Score" field="score" onSort={toggleSort} sortField={sortField} sortOrder={sortOrder} />
              <Th label="Status" field="status" onSort={toggleSort} sortField={sortField} sortOrder={sortOrder} />
              <Th label="Feedback" field="feedback" onSort={toggleSort} sortField={sortField} sortOrder={sortOrder} />
            </tr>
          </thead>

          <tbody>
            {paginated.map((r) => (
              <tr key={r.id} className="border-b hover:bg-purple-50 transition">
                <td className="px-4 py-3">{r.technology}</td>
                <td className="px-4 py-3">{r.interviewer}</td>

                {/* Score */}
                <td className="px-4 py-3">
                  <Score score={r.score} />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Status status={r.status} />
                </td>

                {/* Feedback */}
                <td className="px-4 py-3 text-slate-600 max-w-xs">
                  {r.feedback}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty */}
        {!paginated.length && (
          <p className="text-center py-6 text-slate-400">
            No records found
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
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
   COMPONENTS
===================================================== */

const Th = ({ label, field, onSort, sortField, sortOrder }) => (
  <th
    onClick={() => onSort(field)}
    className="px-4 py-3 cursor-pointer select-none text-left"
  >
    {label}
    {sortField === field && (
      <span className="ml-1 text-xs">{sortOrder === "asc" ? "▲" : "▼"}</span>
    )}
  </th>
);

const Score = ({ score }) => (
  <div className="flex items-center gap-1 text-yellow-500">
    {Array.from({ length: score }).map((_, i) => (
      <FaStar key={i} />
    ))}
    <span className="text-xs text-slate-600 ml-1">
      ({score}/10)
    </span>
  </div>
);

const Status = ({ status }) => {
  const map = {
    Pass: {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    "Needs Improvement": {
      icon: <FaTimesCircle />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  };

  const s = map[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}
    >
      {s.icon}
      {status}
    </span>
  );
};

/* Add pagination button styles */
const style = `
.pagination-btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  transition: 0.2s;
}
.pagination-btn:hover {
  background: #eee;
}
.pagination-btn:disabled {
  opacity: 0.4;
}
`;

if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = style;
  document.head.appendChild(s);
}
