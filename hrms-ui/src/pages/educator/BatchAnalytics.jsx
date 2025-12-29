import { FaUsers, FaChartLine, FaCalendarCheck, FaExclamationTriangle } from "react-icons/fa";

export default function BatchAnalytics() {
  const metrics = {
    students: 42,
    avgProgress: 71,
    avgAttendance: 86,
    completionRate: 64,
    atRisk: 6,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Batch Performance Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Kpi label="Students" value={metrics.students} icon={<FaUsers />} />
        <Kpi label="Avg Progress" value={`${metrics.avgProgress}%`} icon={<FaChartLine />} />
        <Kpi label="Attendance" value={`${metrics.avgAttendance}%`} icon={<FaCalendarCheck />} />
        <Kpi label="Completion" value={`${metrics.completionRate}%`} icon={<FaChartLine />} />
        <Kpi label="At Risk" value={metrics.atRisk} danger icon={<FaExclamationTriangle />} />
      </div>

      <div className="rounded-xl bg-white/70 p-6 shadow">
        📈 Add charts here (Recharts / Chart.js ready)
      </div>
    </div>
  );
}

function Kpi({ label, value, icon, danger }) {
  return (
    <div className={`p-4 rounded-xl bg-white shadow border ${danger && "border-red-300"}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded ${danger ? "bg-red-100" : "bg-indigo-100"}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
