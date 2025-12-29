import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaMapMarkerAlt,
  FaPlayCircle,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const MOCK_SCHEDULE = [
  {
    id: 1,
    title: "Playwright – Introduction",
    batch: "Playwright Jan 2025",
    date: "2025-01-12",
    time: "7:00 PM - 8:30 PM",
    mode: "Online",
    status: "Upcoming",
    link: "#",
  },
  {
    id: 2,
    title: "Selectors & Locators",
    batch: "Playwright Jan 2025",
    date: "2025-01-14",
    time: "7:00 PM - 8:30 PM",
    mode: "Online",
    status: "Upcoming",
    link: "#",
  },
  {
    id: 3,
    title: "Manual Testing – Test Cases",
    batch: "Manual Testing Dec 2024",
    date: "2024-12-10",
    time: "6:00 PM - 7:30 PM",
    mode: "Offline",
    status: "Completed",
  },
  {
    id: 4,
    title: "Recorded Session – Hooks",
    batch: "Playwright Jan 2025",
    date: "2025-01-08",
    time: "Recorded",
    mode: "Recorded",
    status: "Completed",
  },
];

/* ================= STATUS STYLES ================= */
const statusStyles = {
  Upcoming: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Replace with API call
    setSchedule(MOCK_SCHEDULE);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Schedule
        </h1>
        <p className="text-sm text-gray-500">
          Your upcoming and past training sessions
        </p>
      </div>

      {/* ================= SCHEDULE LIST ================= */}
      {schedule.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {schedule.map((item) => (
            <ScheduleCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SCHEDULE CARD ================= */
function ScheduleCard({ item }) {
  return (
    <div
      className="
        rounded-2xl p-5
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow hover:shadow-lg transition
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg text-gray-800">
            {item.title}
          </h2>
          <p className="text-xs text-gray-500">
            {item.batch}
          </p>
        </div>

        <span
          className={`
            text-xs px-3 py-1 rounded-full font-medium
            ${statusStyles[item.status]}
          `}
        >
          {item.status}
        </span>
      </div>

      {/* Info */}
      <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <span>{item.date}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaClock className="text-gray-400" />
          <span>{item.time}</span>
        </div>

        <div className="flex items-center gap-2">
          {item.mode === "Online" && (
            <>
              <FaVideo className="text-indigo-500" />
              <span>Online Session</span>
            </>
          )}

          {item.mode === "Offline" && (
            <>
              <FaMapMarkerAlt className="text-emerald-500" />
              <span>Offline Session</span>
            </>
          )}

          {item.mode === "Recorded" && (
            <>
              <FaPlayCircle className="text-purple-500" />
              <span>Recorded Session</span>
            </>
          )}
        </div>
      </div>

      {/* Action */}
      {item.mode === "Online" && item.status === "Upcoming" && (
        <button
          className="
            mt-5 px-5 py-2 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white text-sm font-semibold
            transition
          "
        >
          Join Class
        </button>
      )}

      {item.mode === "Recorded" && (
        <button
          className="
            mt-5 px-5 py-2 rounded-xl
            bg-purple-600 hover:bg-purple-700
            text-white text-sm font-semibold
            transition
          "
        >
          Watch Recording
        </button>
      )}
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
        No Sessions Scheduled
      </h3>
      <p className="text-sm text-gray-500">
        Your class schedule will appear here
      </p>
    </div>
  );
}
