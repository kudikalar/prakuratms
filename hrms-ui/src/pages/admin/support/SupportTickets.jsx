import { useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";

export default function SupportTickets() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Unable to access assessment",
      description:
        "The assessment is not visible even though it is scheduled today.",
      category: "Assessment",
      priority: "High",
      status: "Open",
      createdAt: "2025-01-12",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Support Tickets
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage your support issues
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
        >
          <FaPlus className="inline mr-2" />
          New Ticket
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
        />
      </div>

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.map((t) => (
          <div
            key={t.id}
            className="bg-white/70 backdrop-blur border rounded-2xl p-5 shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {t.subject}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {t.category} • Created: {t.createdAt}
                </p>

                {expandedId === t.id && (
                  <p className="text-sm text-gray-700 mt-3">
                    {t.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    t.status === "Open"
                      ? "bg-yellow-100 text-yellow-700"
                      : t.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {t.status}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    t.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : t.priority === "Medium"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t.priority}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setExpandedId(expandedId === t.id ? null : t.id)
              }
              className="text-sm text-purple-600 mt-3 hover:underline"
            >
              {expandedId === t.id ? "Hide Details" : "View Details"}
            </button>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No support tickets found
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <CreateTicketModal
          onClose={() => setShowModal(false)}
          onCreate={(ticket) =>
            setTickets([{ id: Date.now(), ...ticket }, ...tickets])
          }
        />
      )}
    </div>
  );
}

/* ================= CREATE TICKET MODAL ================= */

function CreateTicketModal({ onClose, onCreate }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = () => {
    if (!subject || !description) return;

    onCreate({
      subject,
      description,
      category,
      priority,
      status: "Open",
      createdAt: new Date().toISOString().split("T")[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Create Support Ticket
          </h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ticket Subject"
            className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-300 outline-none"
          />

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue"
            className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-300 outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border"
            >
              <option>General</option>
              <option>Assessment</option>
              <option>Payments</option>
              <option>Attendance</option>
              <option>Technical</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2.5 rounded-xl border"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
