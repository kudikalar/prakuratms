import { useState } from "react";
import {
  FaUsers,
  FaChartLine,
  FaCalendarCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const MOCK_BATCHES = [
  {
    id: 1,
    name: "Batch A",
    students: 30,
    progress: 72,
    attendance: 85,
    atRisk: 4,
  },
  {
    id: 2,
    name: "Batch B",
    students: 26,
    progress: 64,
    attendance: 78,
    atRisk: 7,
  },
  {
    id: 3,
    name: "Batch C",
    students: 34,
    progress: 81,
    attendance: 92,
    atRisk: 2,
  },
];

export default function BatchComparison() {
  const [selected, setSelected] = useState([]);

  const toggleBatch = (batch) => {
    setSelected((prev) =>
      prev.some((b) => b.id === batch.id)
        ? prev.filter((b) => b.id !== batch.id)
        : [...prev, batch]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Batch Comparison Dashboard</h1>
      <p className="text-sm text-gray-500">
        Compare batch performance metrics side-by-side
      </p>

      {/* Batch Selector */}
      <div className="flex flex-wrap gap-3">
        {MOCK_BATCHES.map((b) => (
          <button
            key={b.id}
            onClick={() => toggleBatch(b)}
            className={`px-4 py-2 rounded-full border
              ${
                selected.some((s) => s.id === b.id)
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
              }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {selected.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white/70 border shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">Metric</th>
                {selected.map((b) => (
                  <th key={b.id} className="px-4 py-3 text-center">
                    {b.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <Row
                label="Students"
                icon={<FaUsers />}
                values={selected.map((b) => b.students)}
              />
              <Row
                label="Avg Progress"
                icon={<FaChartLine />}
                values={selected.map((b) => `${b.progress}%`)}
              />
              <Row
                label="Attendance"
                icon={<FaCalendarCheck />}
                values={selected.map((b) => `${b.attendance}%`)}
              />
              <Row
                label="At Risk"
                icon={<FaExclamationTriangle />}
                danger
                values={selected.map((b) => b.atRisk)}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, icon, values, danger }) {
  return (
    <tr className="border-t">
      <td className="px-4 py-3 font-semibold flex items-center gap-2">
        {icon}
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`px-4 py-3 text-center ${
            danger ? "text-red-600 font-bold" : ""
          }`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
