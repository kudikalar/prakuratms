import { useEffect, useState } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const MOCK_BATCHES = [
  {
    id: 1,
    name: "Playwright Jan 2025",
    course: "Playwright Automation",
    startDate: "2025-01-10",
    endDate: "2025-02-20",
    status: "Ongoing",
  },
  {
    id: 2,
    name: "Full Stack Nov 2024",
    course: "Full Stack Development",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    status: "Completed",
  },
  {
    id: 3,
    name: "Manual Testing Feb 2025",
    course: "Manual Testing",
    startDate: "2025-02-05",
    endDate: "2025-03-10",
    status: "Upcoming",
  },
];

/* ================= STATUS STYLES ================= */
const statusStyles = {
  Upcoming: "bg-yellow-100 text-yellow-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

export default function MyBatches() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    // Replace with API call later
    setBatches(MOCK_BATCHES);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Batches
        </h1>
        <p className="text-sm text-gray-500">
          Batches you are enrolled in or assigned to
        </p>
      </div>

      {/* ================= BATCH LIST ================= */}
      {batches.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= BATCH CARD ================= */
function BatchCard({ batch }) {
  return (
    <div
      className="
        rounded-2xl p-5
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow-lg hover:shadow-xl
        transition
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg text-gray-800">
            {batch.name}
          </h2>
          <p className="text-xs text-gray-500">
            {batch.course}
          </p>
        </div>

        <span
          className={`
            text-xs px-3 py-1 rounded-full font-medium
            ${statusStyles[batch.status]}
          `}
        >
          {batch.status}
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <span>
            {batch.startDate} → {batch.endDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaUsers className="text-gray-400" />
          <span>Batch Access Enabled</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <ActionButton icon={<FaBookOpen />} label="View Course" />
        {batch.status === "Completed" && (
          <ActionButton
            icon={<FaCheckCircle />}
            label="Completed"
            disabled
          />
        )}
        {batch.status === "Upcoming" && (
          <ActionButton
            icon={<FaClock />}
            label="Starts Soon"
            disabled
          />
        )}
      </div>
    </div>
  );
}

/* ================= ACTION BUTTON ================= */
function ActionButton({ icon, label, disabled }) {
  return (
    <button
      disabled={disabled}
      className={`
        flex-1 flex items-center justify-center gap-2
        px-4 py-2 rounded-xl text-sm font-semibold
        ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }
        transition
      `}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================= EMPTY STATE ================= */
function EmptyState() {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        py-20
        bg-white/60 backdrop-blur-xl
        rounded-2xl border border-white/40
      "
    >
      <FaUsers className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">
        No Batches Assigned
      </h3>
      <p className="text-sm text-gray-500">
        Once you are assigned to a batch, it will appear here
      </p>
    </div>
  );
}
