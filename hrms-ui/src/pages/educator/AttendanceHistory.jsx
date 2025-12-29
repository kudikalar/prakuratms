import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

/* =====================================================
   ATTENDANCE HISTORY – EDUCATOR (PRODUCTION)
===================================================== */

export default function AttendanceHistory() {
  const { batchId } = useParams();

  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  /* ================= INIT (API READY) ================= */

  useEffect(() => {
    // TODO: API
    // GET /educator/batches/:batchId/attendance
    setRecords([
      {
        date: "2025-01-10",
        session: "Morning",
        summary: { total: 30, present: 26, absent: 3, late: 1 },
        students: [
          { id: 1, name: "Ravi Kumar", status: "Present" },
          { id: 2, name: "Sneha Reddy", status: "Late" },
          { id: 3, name: "Arjun Patel", status: "Absent" },
        ],
      },
      {
        date: "2025-01-09",
        session: "Evening",
        summary: { total: 30, present: 28, absent: 2, late: 0 },
        students: [
          { id: 1, name: "Ravi Kumar", status: "Present" },
          { id: 2, name: "Sneha Reddy", status: "Present" },
          { id: 3, name: "Arjun Patel", status: "Absent" },
        ],
      },
    ]);
  }, [batchId]);

  /* ================= FILTERING ================= */

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchDate = dateFilter ? r.date === dateFilter : true;
      const matchSession =
        sessionFilter === "All" || r.session === sessionFilter;
      const matchStatus =
        statusFilter === "All" ||
        r.students.some((s) => s.status === statusFilter);

      return matchDate && matchSession && matchStatus;
    });
  }, [records, dateFilter, sessionFilter, statusFilter]);

  /* ================= KPI SUMMARY ================= */

  const overall = useMemo(() => {
    return filteredRecords.reduce(
      (acc, r) => {
        acc.total += r.summary.total;
        acc.present += r.summary.present;
        acc.absent += r.summary.absent;
        acc.late += r.summary.late;
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );
  }, [filteredRecords]);

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <Header batchId={batchId} />

      {/* FILTER BAR */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <FilterIcon />

          <DateFilter value={dateFilter} onChange={setDateFilter} />
          <SelectFilter
            value={sessionFilter}
            onChange={setSessionFilter}
            options={["All", "Morning", "Afternoon", "Evening"]}
          />
          <SelectFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All", "Present", "Absent", "Late"]}
          />
        </div>
      </GlassCard>

      {/* OVERALL SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total" value={overall.total} icon={<FaUsers />} />
        <SummaryCard
          label="Present"
          value={overall.present}
          icon={<FaCheckCircle />}
          color="green"
        />
        <SummaryCard
          label="Absent"
          value={overall.absent}
          icon={<FaTimesCircle />}
          color="red"
        />
        <SummaryCard
          label="Late"
          value={overall.late}
          icon={<FaClock />}
          color="orange"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur border rounded-2xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-white/80 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4">Session</th>
              <th className="px-6 py-4">Present</th>
              <th className="px-6 py-4">Absent</th>
              <th className="px-6 py-4">Late</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r, idx) => (
              <>
                <tr
                  key={idx}
                  className="border-t hover:bg-white/60"
                >
                  <td className="px-6 py-4 font-medium">{r.date}</td>
                  <td className="px-6 py-4 text-center">{r.session}</td>
                  <td className="px-6 py-4 text-center">{r.summary.present}</td>
                  <td className="px-6 py-4 text-center">{r.summary.absent}</td>
                  <td className="px-6 py-4 text-center">{r.summary.late}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        setExpanded(expanded === idx ? null : idx)
                      }
                      className="text-indigo-600 font-semibold text-sm"
                    >
                      {expanded === idx ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {/* EXPANDED STUDENTS */}
                {expanded === idx && (
                  <tr className="bg-white/60">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {r.students.map((s) => (
                          <StudentChip key={s.id} student={s} />
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {!filteredRecords.length && (
          <div className="py-12 text-center text-gray-500">
            No attendance records found
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

const Header = ({ batchId }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800">
      Attendance History
    </h1>
    <p className="text-sm text-gray-500">
      Batch ID: <span className="font-semibold">{batchId}</span>
    </p>
  </div>
);

const FilterIcon = () => (
  <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
    <FaFilter />
  </div>
);

const DateFilter = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <FaCalendarAlt className="text-gray-500" />
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 rounded-xl bg-white/70 border"
    />
  </div>
);

const SelectFilter = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2 rounded-xl bg-white/70 border"
  >
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

const SummaryCard = ({ label, value, icon, color }) => (
  <div className="rounded-xl p-4 bg-white/70 border shadow flex items-center gap-3">
    <div
      className={`text-xl ${
        color === "green"
          ? "text-green-600"
          : color === "red"
          ? "text-red-600"
          : color === "orange"
          ? "text-orange-600"
          : "text-purple-600"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const StudentChip = ({ student }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border">
    <span className="font-medium">{student.name}</span>
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        student.status === "Present"
          ? "bg-green-100 text-green-700"
          : student.status === "Late"
          ? "bg-orange-100 text-orange-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {student.status}
    </span>
  </div>
);

const GlassCard = ({ children }) => (
  <div className="rounded-2xl p-4 bg-white/60 backdrop-blur border shadow">
    {children}
  </div>
);
