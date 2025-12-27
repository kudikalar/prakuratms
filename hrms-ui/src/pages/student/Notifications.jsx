import { useEffect, useState, useMemo } from "react";
import {
  FaBell,
  FaBullhorn,
  FaCalendarAlt,
  FaBriefcase,
  FaCheckCircle,
  FaFilter,
  FaEnvelopeOpenText,
} from "react-icons/fa";

/* =====================================================
   STUDENT NOTIFICATIONS – PREMIUM
===================================================== */

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showUnread, setShowUnread] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setNotifications([
      {
        id: 1,
        title: "Mock Interviews",
        message:
          "Mock interviews will start from Friday. Be prepared with resume and basics.",
        type: "Interview",
        date: "2025-01-06",
        read: false,
      },
      {
        id: 2,
        title: "Playwright JS Workshop",
        message:
          "2-day Playwright JS workshop scheduled next week. Attendance is mandatory.",
        type: "Workshop",
        date: "2025-01-04",
        read: true,
      },
      {
        id: 3,
        title: "Attendance Update",
        message:
          "Your attendance has been updated for the current week.",
        type: "Attendance",
        date: "2025-01-03",
        read: true,
      },
      {
        id: 4,
        title: "Placement Drive",
        message:
          "New placement drive announced. Check eligibility and apply.",
        type: "Placement",
        date: "2025-01-02",
        read: false,
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) =>
        filter === "All" ? true : n.type === filter
      )
      .filter((n) =>
        showUnread ? !n.read : true
      );
  }, [notifications, filter, showUnread]);

  /* ================= ACTIONS ================= */

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <FaBell />
              Notifications
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Important announcements and updates
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white/70 rounded-2xl p-4 shadow border flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FaFilter />
          Filter:
        </div>

        {["All", "Workshop", "Interview", "Placement", "Attendance"].map(
          (t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                filter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          )
        )}

        <label className="ml-auto flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnread}
            onChange={() => setShowUnread((p) => !p)}
          />
          Show Unread Only
        </label>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
        >
          <FaEnvelopeOpenText />
          Mark all as read
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredNotifications.map((n) => (
          <NotificationCard
            key={n.id}
            data={n}
            onRead={() => markAsRead(n.id)}
          />
        ))}
      </div>

      {!filteredNotifications.length && (
        <p className="text-center text-sm text-slate-400">
          No notifications found
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const NotificationCard = ({ data, onRead }) => (
  <div
    onClick={!data.read ? onRead : undefined}
    className={`
      bg-white/70 backdrop-blur-xl
      rounded-2xl p-6 shadow
      border transition cursor-pointer
      ${data.read ? "opacity-75" : "border-indigo-300 hover:shadow-lg"}
    `}
  >
    <div className="flex justify-between items-start gap-4">
      {/* LEFT */}
      <div className="flex gap-3">
        <IconByType type={data.type} />

        <div>
          <h3 className="font-semibold text-slate-800">
            {data.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {data.message}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {new Date(data.date).toDateString()}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      {!data.read && (
        <span className="text-xs text-indigo-600 font-semibold">
          NEW
        </span>
      )}
    </div>
  </div>
);

const IconByType = ({ type }) => {
  const map = {
    Workshop: <FaBullhorn className="text-indigo-600" />,
    Attendance: <FaCalendarAlt className="text-emerald-600" />,
    Interview: <FaBriefcase className="text-purple-600" />,
    Placement: <FaCheckCircle className="text-blue-600" />,
    Default: <FaBell className="text-slate-600" />,
  };

  return (
    <div className="text-xl mt-1">
      {map[type] || map.Default}
    </div>
  );
};
