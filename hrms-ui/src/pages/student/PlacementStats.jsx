import { FaChartBar } from "react-icons/fa";

export default function PlacementStats() {
  const stats = [
    { course: "QA Automation", placed: 120, avgCTC: "4.5 LPA" },
    { course: "Manual Testing", placed: 90, avgCTC: "3.2 LPA" },
  ];

  return (
    <div className="bg-white/70 p-6 rounded-2xl shadow border">
      <h3 className="font-semibold flex items-center gap-2">
        <FaChartBar />
        Placement Statistics
      </h3>

      <table className="w-full mt-4 text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-center">Students Placed</th>
            <th className="p-3 text-center">Avg CTC</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{s.course}</td>
              <td className="p-3 text-center">{s.placed}</td>
              <td className="p-3 text-center">{s.avgCTC}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
