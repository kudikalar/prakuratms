import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

/* ===============================
   MARK ATTENDANCE – EDUCATOR
================================ */

export default function MarkAttendance() {
  const { batchId } = useParams();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [session, setSession] = useState("Morning");
  const [students, setStudents] = useState({});

  /* ===== INIT (API READY) ===== */
  useEffect(() => {
    // Replace with API:
    // GET /educator/batches/:batchId/students
    setStudents({
      1: {
        id: 1,
        name: "Ravi Kumar",
        status: "Present",
      },
      2: {
        id: 2,
        name: "Sneha Reddy",
        status: "Present",
      },
      3: {
        id: 3,
        name: "Arjun Patel",
        status: "Absent",
      },
    });
  }, [batchId]);

  /* ===== SUMMARY ===== */
  const summary = useMemo(() => {
    const values = Object.values(students);
    return {
      total: values.length,
      present: values.filter((s) => s.status === "Present").length,
      absent: values.filter((s) => s.status === "Absent").length,
      late: values.filter((s) => s.status === "Late").length,
    };
  }, [students]);

  const updateStatus = (id, status) => {
    setStudents((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  };

  const markAll = (status) => {
    const updated = {};
    Object.values(students).forEach((s) => {
      updated[s.id] = { ...s, status };
    });
    setStudents(updated);
  };

  /* ===============================
     UI
  ================================ */

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Mark Attendance
        </h1>
        <p className="text-sm text-gray-500">
          Record daily attendance for your batch
        </p>
      </div>

      {/* ===== Controls ===== */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-gray-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border"
          />
        </div>

        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border"
        >
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => markAll("Present")}
            className="px-4 py-2 rounded-full
              bg-green-600 text-white hover:bg-green-700"
          >
            Mark All Present
          </button>

          <button
            onClick={() => markAll("Absent")}
            className="px-4 py-2 rounded-full
              bg-gray-600 text-white hover:bg-gray-700"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* ===== Summary ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total" value={summary.total} icon={<FaUsers />} />
        <SummaryCard
          label="Present"
          value={summary.present}
          icon={<FaCheckCircle />}
          color="green"
        />
        <SummaryCard
          label="Absent"
          value={summary.absent}
          icon={<FaTimesCircle />}
          color="red"
        />
        <SummaryCard
          label="Late"
          value={summary.late}
          icon={<FaClock />}
          color="orange"
        />
      </div>

      {/* ===== Student List ===== */}
      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border shadow-lg">
        {Object.values(students).map((s) => (
          <div
            key={s.id}
            className="flex flex-col sm:flex-row items-center justify-between
            px-6 py-4 border-t first:border-t-0"
          >
            <span className="font-medium">{s.name}</span>

            <div className="flex gap-2 mt-3 sm:mt-0">
              <StatusButton
                active={s.status === "Present"}
                onClick={() => updateStatus(s.id, "Present")}
                label="Present"
                color="green"
              />
              <StatusButton
                active={s.status === "Absent"}
                onClick={() => updateStatus(s.id, "Absent")}
                label="Absent"
                color="gray"
              />
              <StatusButton
                active={s.status === "Late"}
                onClick={() => updateStatus(s.id, "Late")}
                label="Late"
                color="orange"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== Save ===== */}
      <div className="text-right">
        <button
          onClick={() => {
            // POST /educator/attendance
            console.log({
              batchId,
              date,
              session,
              attendance: students,
            });
            alert("Attendance saved (mock)");
          }}
          className="px-6 py-2.5 rounded-full
            bg-purple-600 text-white hover:bg-purple-700"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}

/* ===============================
   SHARED COMPONENTS
================================ */

const SummaryCard = ({ label, value, icon }) => (
  <div
    className="rounded-xl p-4 bg-white/60 backdrop-blur border shadow
    flex items-center gap-3"
  >
    <div className="text-xl text-purple-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const StatusButton = ({ active, onClick, label, color }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-semibold
      border transition
      ${
        active
          ? color === "green"
            ? "bg-green-600 text-white"
            : color === "orange"
            ? "bg-orange-500 text-white"
            : "bg-gray-600 text-white"
          : "bg-white hover:bg-gray-100"
      }`}
  >
    {label}
  </button>
);
