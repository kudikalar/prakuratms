import { useState } from "react";
import {
  FaBullhorn,
  FaPlus,
  FaSearch,
  FaTimes,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEye,
  FaWhatsapp,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const initialAnnouncements = [
  {
    id: 1,
    title: "Playwright Workshop – 2 Days",
    message:
      "Next week we are conducting a 2-day Playwright JS workshop. Attendance is mandatory. Hands-on sessions and real-time project exposure included.",
    audience: "Students",
    date: "2025-01-02",
    status: "Published",
  },
  {
    id: 2,
    title: "Fee Payment Reminder",
    message:
      "Pending fee students are requested to complete payment before the due date to avoid access restrictions.",
    audience: "All",
    date: "2025-01-05",
    status: "Draft",
  },
];

/* ================= MAIN PAGE ================= */
export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase())
  );

  const shareOnWhatsApp = (announcement) => {
    const text = `📢 *${announcement.title}*

${announcement.message}

👥 Audience: ${announcement.audience}
📅 Date: ${announcement.date}

— Prakura TMS`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBullhorn className="text-purple-600" />
            Announcements
          </h1>
          <p className="text-sm text-gray-500">
            Create, view and share announcements
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
        >
          <FaPlus className="inline mr-2" />
          New Announcement
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/70 focus:ring-2 focus:ring-purple-300 outline-none"
        />
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl bg-white/70 backdrop-blur border shadow p-5"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {a.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {a.message}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {a.audience === "Students" && (
                      <FaUserGraduate className="text-emerald-500" />
                    )}
                    {a.audience === "Educators" && (
                      <FaChalkboardTeacher className="text-blue-500" />
                    )}
                    {a.audience === "All" && (
                      <FaUsers className="text-purple-500" />
                    )}
                    {a.audience}
                  </span>
                  <span>📅 {a.date}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    a.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {a.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewItem(a)}
                    className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaEye className="inline mr-1" />
                    View
                  </button>

                  <button
                    onClick={() => shareOnWhatsApp(a)}
                    className="px-3 py-1.5 text-xs rounded-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <FaWhatsapp className="inline mr-1" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No announcements found
          </div>
        )}
      </div>

      {showCreate && (
        <CreateAnnouncementModal
          onClose={() => setShowCreate(false)}
          onCreate={(data) =>
            setAnnouncements([
              { id: Date.now(), status: "Published", ...data },
              ...announcements,
            ])
          }
        />
      )}

      {viewItem && (
        <ViewAnnouncementModal
          data={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  );
}

/* ================= VIEW MODAL ================= */
function ViewAnnouncementModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{data.title}</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-700 mb-4">{data.message}</p>

        <div className="text-sm text-gray-500 space-y-1">
          <div>Audience: {data.audience}</div>
          <div>Date: {data.date}</div>
          <div>Status: {data.status}</div>
        </div>
      </div>
    </div>
  );
}

/* ================= CREATE MODAL ================= */
function CreateAnnouncementModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All");

  const handleSubmit = () => {
    if (!title || !message) return;
    onCreate({
      title,
      message,
      audience,
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">New Announcement</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border"
          />
          <textarea
            rows="4"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border"
          />
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border"
          >
            <option>All</option>
            <option>Students</option>
            <option>Educators</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-full">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-purple-600 text-white"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
