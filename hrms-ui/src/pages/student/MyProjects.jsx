import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaChartLine,
  FaSearch,
  FaBolt,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECTS – MOBILE + DESKTOP
   ❌ NO CONTENT REMOVED
===================================================== */

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;
  const navigate = useNavigate();

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

  /* ================= FILTER + SEARCH + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...projects];

    if (filter !== "All") list = list.filter((p) => p.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.mentor.toLowerCase().includes(q) ||
          p.technology.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const x = a[sortField];
      const y = b[sortField];
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [projects, filter, search, sortField, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ================= SORT HANDLER ================= */
  const toggleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /* ================= ACTION HANDLING ================= */
  const openProject = (project) => {
    if (project.status === "Completed")
      navigate(`/student/projects/${project.id}/report`);
    else if (project.status === "Pending")
      navigate(`/student/projects/${project.id}/start`);
    else navigate(`/student/projects/${project.id}/work`);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow border">
        <h2 className="text-xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FaProjectDiagram className="text-purple-600" />
          My Projects
        </h2>
        <p className="text-xs md:text-sm text-slate-600 mt-1">
          Track progress, milestones & mentor feedback
        </p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">

        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white shadow text-sm"
            placeholder="Search by title, tech, mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Completed", "In Progress", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE – MOBILE SCROLL SAFE */}
      <div className="overflow-x-auto bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow border">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <Th label="Title" field="title" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Tech" field="technology" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Mentor" field="mentor" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <Th label="Progress" field="progress" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Insight</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-b hover:bg-purple-50 transition">
                <td className="px-4 py-3 font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <FaProjectDiagram className="text-indigo-500" />
                    {p.title}
                  </div>
                </td>
                <td className="px-4 py-3">{p.technology}</td>
                <td className="px-4 py-3">{p.mentor}</td>
                <td className="px-4 py-3"><Status status={p.status} /></td>
                <td className="px-4 py-3"><ProgressBar value={p.progress} /></td>
                <td className="px-4 py-3 text-slate-600">{new Date(p.deadline).toDateString()}</td>
                <td className="px-4 py-3 text-xs max-w-xs"><AIInsight progress={p.progress} status={p.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => openProject(p)} className="text-indigo-600 hover:underline flex items-center gap-1">
                    Open <FaArrowRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!paginated.length && (
          <p className="text-center py-6 text-slate-400">No matching records</p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="pagination-btn">‹</button>
          <span className="text-sm text-slate-600 font-medium">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="pagination-btn">›</button>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Th = ({ label, field, sortField, sortOrder, onSort }) => (
  <th onClick={() => onSort(field)} className="px-4 py-3 cursor-pointer select-none text-left">
    {label}
    {sortField === field && <span className="ml-1 text-xs">{sortOrder === "asc" ? "▲" : "▼"}</span>}
  </th>
);

const Status = ({ status }) => {
  const map = {
    Completed: { icon: <FaCheckCircle />, color: "text-emerald-600 bg-emerald-100" },
    "In Progress": { icon: <FaChartLine />, color: "text-yellow-600 bg-yellow-100" },
    Pending: { icon: <FaClock />, color: "text-slate-600 bg-slate-200" },
  };
  const s = map[status];

  return (
    <span className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
      {s.icon} {status}
    </span>
  );
};

const ProgressBar = ({ value }) => (
  <div className="w-24">
    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const AIInsight = ({ progress, status }) => {
  let text = "";
  if (status === "Completed") text = "Ready for resume shortlisting.";
  else if (progress >= 70) text = "Strong progress! Keep going.";
  else if (progress >= 30) text = "Good start. Maintain consistency.";
  else text = "Project pending. Start soon.";

  return (
    <span className="flex items-center gap-1 text-indigo-600 font-medium">
      <FaBolt className="text-yellow-500" /> {text}
    </span>
  );
};

/* Pagination styles */
const style = `
.pagination-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
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
