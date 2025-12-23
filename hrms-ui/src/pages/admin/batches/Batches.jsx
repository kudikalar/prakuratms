import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

/* ================= HELPERS ================= */

const getBatchStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return "Upcoming";
  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);

  if (today < start) return "Upcoming";
  if (today > end) return "Completed";
  return "Ongoing";
};

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const navigate = useNavigate();

  /* ================= LOAD ================= */
  useEffect(() => {
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  /* ================= DELETE ================= */
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const deleteBatch = () => {
    const updated = batches.filter((b) => b.id !== selectedId);
    setBatches(updated);
    localStorage.setItem("batches", JSON.stringify(updated));
    setShowModal(false);
    setToast("🗑️ Batch deleted successfully");
    setTimeout(() => setToast(""), 2000);
  };

  /* ================= FILTER ================= */
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchName = b.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCourse =
        courseFilter === "All" || b.course === courseFilter;

      return matchName && matchCourse;
    });
  }, [batches, search, courseFilter]);

  /* ================= CATEGORIZED ================= */
  const upcoming = filteredBatches.filter(
    (b) => getBatchStatus(b.startDate, b.endDate) === "Upcoming"
  );
  const ongoing = filteredBatches.filter(
    (b) => getBatchStatus(b.startDate, b.endDate) === "Ongoing"
  );
  const completed = filteredBatches.filter(
    (b) => getBatchStatus(b.startDate, b.endDate) === "Completed"
  );

  const uniqueCourses = [
    "All",
    ...new Set(batches.map((b) => b.course)),
  ];

  return (
    <div className="space-y-8 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Batches</h2>
          <p className="text-sm text-gray-600">
            Side-by-side categorized batches
          </p>
        </div>

        <NavLink
          to="/admin/batches/create"
          className="flex items-center gap-2 px-5 py-2.5
            rounded-full bg-purple-600 text-white font-semibold shadow"
        >
          <FaPlus /> Create Batch
        </NavLink>
      </div>

      {/* ================= FILTER BAR ================= */}
      <GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Search batch by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-xl bg-white/70 border"
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="p-3 rounded-xl bg-white/70 border"
          >
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* ================= SIDE BY SIDE COLUMNS ================= */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* UPCOMING */}
        <BatchColumn
          title="Upcoming"
          color="yellow"
          batches={upcoming}
          onEdit={(id) => navigate(`/admin/batches/create?id=${id}`)}
          onDelete={confirmDelete}
        />

        {/* ONGOING */}
        <BatchColumn
          title="Ongoing"
          color="blue"
          batches={ongoing}
          onEdit={(id) => navigate(`/admin/batches/create?id=${id}`)}
          onDelete={confirmDelete}
        />

        {/* COMPLETED */}
        <BatchColumn
          title="Completed"
          color="green"
          batches={completed}
          onEdit={(id) => navigate(`/admin/batches/create?id=${id}`)}
          onDelete={confirmDelete}
        />

      </div>

      {/* ================= CONFIRM DELETE ================= */}
      <ConfirmModal
        open={showModal}
        title="Delete Batch"
        message="Are you sure you want to delete this batch?"
        onConfirm={deleteBatch}
        onCancel={() => setShowModal(false)}
      />

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= COLUMN ================= */

const BatchColumn = ({ title, color, batches, onEdit, onDelete }) => {
  const colorMap = {
    yellow: "text-yellow-700",
    blue: "text-blue-700",
    green: "text-green-700",
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${colorMap[color]}`}>
        {title} ({batches.length})
      </h3>

      {batches.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-gray-500 italic text-center">
            No {title.toLowerCase()} batches
          </p>
        </GlassCard>
      ) : (
        batches.map((b) => (
          <GlassCard key={b.id}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{b.name}</h4>
                <p className="text-xs text-gray-600">
                  {b.course}
                </p>
                <p className="text-xs text-gray-500">
                  {b.startDate} → {b.endDate}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(b.id)}
                  className="p-1.5 rounded-full bg-blue-100 text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(b.id)}
                  className="p-1.5 rounded-full bg-red-100 text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
};

/* ================= GLASS ================= */

const GlassCard = ({ children }) => (
  <div className="
    bg-white/40 backdrop-blur-[24px]
    border border-white/40
    rounded-2xl p-4
    shadow-[0_20px_60px_rgba(0,0,0,0.15)]
  ">
    {children}
  </div>
);
