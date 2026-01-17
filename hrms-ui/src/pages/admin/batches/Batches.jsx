import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

/* ================= STORAGE KEYS ================= */
const BATCHES_KEY = "batches";
const COURSES_KEY = "PRAKURA_COURSES";

/* ================= HELPERS ================= */

const normalizeId = (v) => (v == null ? "" : String(v));

const normalizeBatches = (raw = []) =>
  raw.map((b) => ({
    ...b,
    id: normalizeId(b.id),
    courseId:
      typeof b.courseId === "object"
        ? normalizeId(b.courseId._id)
        : normalizeId(b.courseId),
  }));

const getBatchStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return "Upcoming";
  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);

  if (today < start) return "Upcoming";
  if (today > end) return "Completed";
  return "Ongoing";
};

const statusColor = {
  Upcoming: "bg-yellow-100 text-yellow-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

/* ================= AUTOMATION VIEW (UNCHANGED) ================= */

const buildAutomationIframeHTML = (batches, courses) => {
  const getCourseTitle = (id) =>
    courses.find((c) => normalizeId(c._id) === normalizeId(id))?.title || "—";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    margin: 0;
    padding: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont;
    background: #f8fafc;
  }
  .card {
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  .badge {
    display: inline-block;
    margin-top: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    background: #e5e7eb;
  }
</style>
</head>
<body>
  <h3>Batches – Automation View</h3>

  ${batches
    .map((b) => {
      const status = getBatchStatus(b.startDate, b.endDate);
      return `
        <div class="card">
          <strong>${b.name}</strong><br/>
          <small>${getCourseTitle(b.courseId)}</small><br/>
          <span class="badge">${status}</span>
        </div>
      `;
    })
    .join("")}
</body>
</html>
`;
};

/* ================= MAIN ================= */

export default function Batches() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sort, setSort] = useState("new");

  /* ================= LOAD + NORMALIZE ================= */
  useEffect(() => {
    const rawBatches = JSON.parse(localStorage.getItem(BATCHES_KEY)) || [];
    const rawCourses = JSON.parse(localStorage.getItem(COURSES_KEY)) || [];

    const normalized = normalizeBatches(rawBatches);

    setBatches(normalized);
    setCourses(rawCourses);

    // 🔐 Persist normalized data once (safe)
    localStorage.setItem(BATCHES_KEY, JSON.stringify(normalized));
  }, []);

  const getCourseTitle = (courseId) =>
    courses.find(
      (c) => normalizeId(c._id) === normalizeId(courseId)
    )?.title || "—";

  /* ================= DELETE ================= */

  const confirmDelete = (id) => {
    setSelectedId(normalizeId(id));
    setShowModal(true);
  };

  const deleteBatch = () => {
    const updated = batches.filter(
      (b) => normalizeId(b.id) !== normalizeId(selectedId)
    );

    setBatches(updated);
    localStorage.setItem(BATCHES_KEY, JSON.stringify(updated));

    setShowModal(false);
    setToast("🗑️ Batch deleted successfully");
    setTimeout(() => setToast(""), 2000);
  };

  /* ================= FILTER + SORT ================= */

  const filteredBatches = useMemo(() => {
    return batches
      .filter((b) => {
        const matchName = b.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

        const matchCourse =
          courseFilter === "All" ||
          normalizeId(b.courseId) === normalizeId(courseFilter);

        return matchName && matchCourse;
      })
      .sort((a, b) =>
        sort === "new"
          ? new Date(b.startDate) - new Date(a.startDate)
          : new Date(a.startDate) - new Date(b.startDate)
      );
  }, [batches, search, courseFilter, sort]);

  /* ================= GROUP ================= */

  const grouped = {
    Upcoming: filteredBatches.filter(
      (b) => getBatchStatus(b.startDate, b.endDate) === "Upcoming"
    ),
    Ongoing: filteredBatches.filter(
      (b) => getBatchStatus(b.startDate, b.endDate) === "Ongoing"
    ),
    Completed: filteredBatches.filter(
      (b) => getBatchStatus(b.startDate, b.endDate) === "Completed"
    ),
  };

  const uniqueCourses = [
    { id: "All", title: "All Courses" },
    ...courses.map((c) => ({
      id: normalizeId(c._id),
      title: c.title,
    })),
  ];

  /* ================= UI ================= */

  return (
    <div className="
      max-w-6xl mx-auto space-y-10 animate-fadeIn
      bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
      rounded-[32px] p-6 md:p-8
      shadow-[0_40px_120px_rgba(80,70,200,0.25)]
    ">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Batches</h2>
          <p className="text-sm text-slate-600">
            Manage & track training batches
          </p>
        </div>

        <NavLink
          to="/admin/batches/create"
          className="
            flex items-center gap-2 px-7 py-3 rounded-full
            font-semibold text-white
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-700 hover:to-indigo-700
            shadow-lg transition
          "
        >
          <FaPlus /> Create Batch
        </NavLink>
      </div>

      {/* FILTER BAR */}
      <GlassCard>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Search batch name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="glass-input"
          >
            {uniqueCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="glass-input"
          >
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>

          <div className="flex items-center text-sm text-slate-600">
            Total: {filteredBatches.length}
          </div>
        </div>
      </GlassCard>

      {/* COLUMNS */}
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(grouped).map(([status, list]) => (
          <BatchColumn
            key={status}
            title={status}
            batches={list}
            getCourseTitle={getCourseTitle}
            onEdit={(id) =>
              navigate(`/admin/batches/create?id=${id}`)
            }
            onDelete={confirmDelete}
          />
        ))}
      </div>

      <ConfirmModal
        open={showModal}
        title="Delete Batch"
        message="This action cannot be undone. Continue?"
        onConfirm={deleteBatch}
        onCancel={() => setShowModal(false)}
      />

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= COLUMN ================= */

const BatchColumn = ({ title, batches, getCourseTitle, onEdit, onDelete }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-slate-700">
      {title}
      <span className="ml-2 text-sm text-slate-500">
        ({batches.length})
      </span>
    </h3>

    {batches.length === 0 ? (
      <GlassCard>
        <p className="text-sm text-slate-500 italic text-center">
          No {title.toLowerCase()} batches
        </p>
      </GlassCard>
    ) : (
      batches.map((b) => {
        const status = getBatchStatus(b.startDate, b.endDate);

        return (
          <GlassCard key={b.id}>
            <div className="flex justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800">
                  {b.name}
                </h4>
                <p className="text-xs text-slate-600">
                  {getCourseTitle(b.courseId)}
                </p>
                <p className="text-xs text-slate-500">
                  {b.startDate} → {b.endDate}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${statusColor[status]}`}
                >
                  {status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(b.id)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(b.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        );
      })
    )}
  </div>
);

/* ================= SHARED UI ================= */

const GlassCard = ({ children }) => (
  <div className="
    bg-white/40 backdrop-blur-[24px]
    border border-white/40
    rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]
  ">
    {children}
  </div>
);
