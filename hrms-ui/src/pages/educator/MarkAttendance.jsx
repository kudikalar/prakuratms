import { useEffect, useState, useMemo } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const MOCK_BATCHES = [
  "Playwright Jan 2025",
  "Manual Testing Dec 2024",
];

const MOCK_SESSIONS = [
  "Session 1 – Introduction",
  "Session 2 – Locators",
  "Session 3 – Assertions",
];

const MOCK_STUDENTS = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh@gmail.com" },
  { id: 2, name: "Anjali Sharma", email: "anjali@gmail.com" },
  { id: 3, name: "Vijay Patel", email: "vijay@gmail.com" },
];

export default function MarkAttendance() {
  const [batch, setBatch] = useState("");
  const [session, setSession] = useState("");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    // Initialize attendance
    const initial = {};
    MOCK_STUDENTS.forEach((s) => {
      initial[s.id] = true; // default present
    });
    setAttendance(initial);
  }, []);

  /* ================= HANDLERS ================= */
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markAllPresent = () => {
    const all = {};
    MOCK_STUDENTS.forEach((s) => {
      all[s.id] = true;
    });
    setAttendance(all);
  };

  const summary = useMemo(() => {
    const present = Object.values(attendance).filter(Boolean).length;
    const total = MOCK_STUDENTS.length;
    return { present, absent: total - present };
  }, [attendance]);

  const handleSubmit = () => {
    const payload = {
      batch,
      session,
      attendance,
      date: new Date().toISOString(),
    };

    console.log("Attendance Payload:", payload);
    alert("Attendance submitted successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Mark Attendance
        </h1>
        <p className="text-sm text-gray-500">
          Select batch and session to mark attendance
        </p>
      </div>

      {/* ================= CONTROLS ================= */}
      <div
        className="
          grid gap-4 md:grid-cols-3
          p-4 rounded-2xl
          bg-white/70 backdrop-blur-xl
          border border-white/40
        "
      >
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white text-sm"
        >
          <option value="">Select Batch</option>
          {MOCK_BATCHES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white text-sm"
        >
          <option value="">Select Session</option>
          {MOCK_SESSIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={markAllPresent}
          className="
            px-4 py-2 rounded-xl
            bg-emerald-600 hover:bg-emerald-700
            text-white text-sm font-semibold
          "
        >
          Mark All Present
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="flex gap-4">
        <SummaryBadge
          icon={<FaCheckCircle />}
          label="Present"
          value={summary.present}
          color="bg-green-100 text-green-700"
        />
        <SummaryBadge
          icon={<FaTimesCircle />}
          label="Absent"
          value={summary.absent}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* ================= STUDENT LIST ================= */}
      <div
        className="
          rounded-2xl overflow-hidden
          bg-white/70 backdrop-blur-xl
          border border-white/40
        "
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map((student) => (
              <tr
                key={student.id}
                className="border-t hover:bg-indigo-50/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-indigo-500" />
                    <div>
                      <p className="font-medium">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-center">
                  {attendance[student.id] ? (
                    <span className="text-green-600 font-semibold">
                      Present
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Absent
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() =>
                      toggleAttendance(student.id)
                    }
                    className={`
                      px-4 py-1.5 rounded-lg text-xs font-semibold
                      ${
                        attendance[student.id]
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }
                    `}
                  >
                    {attendance[student.id]
                      ? "Mark Absent"
                      : "Mark Present"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= SUBMIT ================= */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!batch || !session}
          className={`
            flex items-center gap-2
            px-6 py-2 rounded-xl
            text-sm font-semibold
            ${
              !batch || !session
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }
          `}
        >
          <FaCalendarCheck />
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

/* ================= SUMMARY BADGE ================= */
function SummaryBadge({ icon, label, value, color }) {
  return (
    <div
      className={`
        flex items-center gap-2
        px-4 py-2 rounded-xl text-sm font-semibold
        ${color}
      `}
    >
      {icon}
      {label}: {value}
    </div>
  );
}
