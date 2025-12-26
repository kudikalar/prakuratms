import { useState } from "react";
import {
  FaUserShield,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const LOGS = [
  {
    id: 1,
    user: "Admin",
    role: "Admin",
    action: "Created Announcement",
    module: "Notifications",
    ip: "192.168.1.10",
    time: "2025-01-15 10:32 AM",
  },
  {
    id: 2,
    user: "FinanceUser",
    role: "Finance",
    action: "Viewed Payment Analytics",
    module: "Finance",
    ip: "192.168.1.21",
    time: "2025-01-15 11:05 AM",
  },
];

/* ================= PAGE ================= */
export default function ActivityLogs() {
  const [search, setSearch] = useState("");

  const filtered = LOGS.filter(
    (l) =>
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex gap-2 items-center">
          <FaUserShield className="text-purple-600" />
          Activity Logs
        </h1>
        <p className="text-sm text-gray-500">
          Track all admin and system activities
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/70 focus:ring-2 focus:ring-purple-300 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-2xl border shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="px-4 py-3">{log.user}</td>
                <td className="px-4 py-3">{log.role}</td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.module}</td>
                <td className="px-4 py-3">{log.ip}</td>
                <td className="px-4 py-3">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No activity logs found
          </div>
        )}
      </div>
    </div>
  );
}
