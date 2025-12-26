import { FaShieldAlt } from "react-icons/fa";

/* ================= MOCK DATA ================= */
const SECURITY_EVENTS = [
  {
    id: 1,
    user: "Admin",
    event: "Login Successful",
    ip: "192.168.1.10",
    time: "2025-01-15 09:00 AM",
    status: "Success",
  },
  {
    id: 2,
    user: "FinanceUser",
    event: "Invalid Password Attempt",
    ip: "192.168.1.21",
    time: "2025-01-15 09:12 AM",
    status: "Failed",
  },
];

/* ================= PAGE ================= */
export default function SecurityAudit() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaShieldAlt className="text-red-600" />
          Security Audit
        </h1>
        <p className="text-sm text-gray-500">
          Monitor authentication and security-related events
        </p>
      </div>

      <div className="grid gap-4">
        {SECURITY_EVENTS.map((e) => (
          <div
            key={e.id}
            className="bg-white/70 backdrop-blur border rounded-xl p-4 shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-gray-800">{e.event}</h3>
              <p className="text-sm text-gray-500">
                User: {e.user} | IP: {e.ip}
              </p>
              <p className="text-xs text-gray-400">{e.time}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                e.status === "Success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {e.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
