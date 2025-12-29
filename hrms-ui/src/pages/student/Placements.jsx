import { useEffect, useState, useMemo } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

/* =====================================================
   STUDENT PLACEMENT TRACKER – PREMIUM TABLE (Option B)
   Glass UI + Sorting + Search + Pagination + Timeline
   NO CONTENT REMOVED
===================================================== */

const PAGE_SIZE = 5;

export default function StudentPlacements() {
  const [placements, setPlacements] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("company");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  /* ================= INIT ================= */
  useEffect(() => {
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

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...placements];

    // SEARCH
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.company.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }

    // SORT
    list.sort((a, b) => {
      const x = a[sortField];
      const y = b[sortField];
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [placements, search, sortField, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300/20 to-indigo-300/20 opacity-40"></div>

        <h2 className="text-3xl font-bold text-slate-800 relative z-10">Placement Tracker</h2>
        <p className="text-sm text-slate-500 mt-1 relative z-10">
          Track your interview schedules and placement status
        </p>
      </div>

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search company, role, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow text-sm w-full md:w-80"
        />

        {/* STATS */}
        <div className="flex gap-6 text-sm">
          <p className="font-semibold text-indigo-600">Total: {placements.length}</p>
          <p className="font-semibold text-emerald-600">
            Selected: {placements.filter((p) => p.status === "Selected").length}
          </p>
          <p className="font-semibold text-yellow-600">
            Scheduled: {placements.filter((p) => p.status === "Scheduled").length}
          </p>
          <p className="font-semibold text-red-600">
            Rejected: {placements.filter((p) => p.status === "Rejected").length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <Th label="Company" field="company" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Role" field="role" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Interview Date" field="interviewDate" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <th className="px-4 py-3">Timeline</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-b hover:bg-purple-50 transition">
                {/* Company */}
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
                    {p.company.slice(0, 1)}
                  </div>
                  {p.company}
                </td>

                {/* Role */}
                <td className="px-4 py-3">{p.role}</td>

                {/* Date */}
                <td className="px-4 py-3">
                  {new Date(p.interviewDate).toDateString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>

                {/* Timeline */}
                <td className="px-4 py-3">
                  <Timeline status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!paginated.length && (
          <p className="text-center py-6 text-slate-400">No records found</p>
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

const StatusBadge = ({ status }) => {
  const map = {
    Scheduled: {
      icon: <FaClock />,
      bg: "bg-yellow-100",
      color: "text-yellow-700",
    },
    Selected: {
      icon: <FaCheckCircle />,
      bg: "bg-emerald-100",
      color: "text-emerald-700",
    },
    Rejected: {
      icon: <FaTimesCircle />,
      bg: "bg-red-100",
      color: "text-red-700",
    },
  };

  const s = map[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}>
      {s.icon}
      {status}
    </span>
  );
};

const Timeline = ({ status }) => {
  const steps = ["Scheduled", "Interviewed", "Decision"];

  const activeIndex =
    status === "Scheduled" ? 0 :
    status === "Selected" || status === "Rejected" ? 2 :
    1;

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              i <= activeIndex
                ? status === "Selected"
                  ? "bg-emerald-600"
                  : status === "Rejected"
                  ? "bg-red-600"
                  : "bg-yellow-600"
                : "bg-slate-300"
            }`}
          ></div>

          {i < steps.length - 1 && (
            <div
              className={`h-1 w-8 rounded-full ${
                i < activeIndex
                  ? status === "Selected"
                    ? "bg-emerald-500"
                    : status === "Rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                  : "bg-slate-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

/* PAGINATION STYLE */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .pagination-btn {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid #ddd;
      background: white;
      transition: 0.2s;
    }
    .pagination-btn:hover { background: #eee; }
    .pagination-btn:disabled { opacity: 0.4; }
  `;
  document.head.appendChild(style);
}
