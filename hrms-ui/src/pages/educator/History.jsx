import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUserCheck,
  FaBookOpen,
  FaClipboardList,
} from "react-icons/fa";

/* ================= MOCK HISTORY DATA ================= */
const MOCK_HISTORY = [
  {
    id: 1,
    type: "Attendance",
    title: "Playwright – Locators Session",
    description: "Attendance marked for Playwright Jan 2025 batch",
    date: "2025-01-14",
    icon: <FaUserCheck className="text-green-600" />,
  },
  {
    id: 2,
    type: "Class",
    title: "Selectors & Locators",
    description: "Online session conducted",
    date: "2025-01-14",
    icon: <FaCalendarAlt className="text-indigo-600" />,
  },
  {
    id: 3,
    type: "Assessment",
    title: "Basics Assessment",
    description: "Score: 78 / 100",
    date: "2025-01-10",
    icon: <FaClipboardList className="text-purple-600" />,
  },
  {
    id: 4,
    type: "Course",
    title: "Manual Testing Course Completed",
    description: "Batch: Manual Testing Dec 2024",
    date: "2024-12-31",
    icon: <FaBookOpen className="text-emerald-600" />,
  },
];

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Replace with API call
    setHistory(MOCK_HISTORY);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          History
        </h1>
        <p className="text-sm text-gray-500">
          View your past sessions, attendance, and assessments
        </p>
      </div>

      {/* ================= HISTORY LIST ================= */}
      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= HISTORY ITEM ================= */
function HistoryItem({ item }) {
  return (
    <div
      className="
        flex items-start gap-4
        p-5 rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow hover:shadow-lg transition
      "
    >
      <div
        className="
          p-3 rounded-xl
          bg-gray-100 flex items-center justify-center
        "
      >
        {item.icon}
      </div>

      <div className="flex-1">
        <h2 className="font-semibold text-gray-800">
          {item.title}
        </h2>
        <p className="text-sm text-gray-600">
          {item.description}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <FaCalendarAlt />
          <span>{item.date}</span>
          <span className="px-2 py-0.5 rounded-full bg-gray-200">
            {item.type}
          </span>
        </div>
      </div>
    </div>
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
      <FaCalendarAlt className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">
        No History Available
      </h3>
      <p className="text-sm text-gray-500">
        Your activity history will appear here
      </p>
    </div>
  );
}
