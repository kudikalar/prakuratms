import { useEffect, useState, useMemo } from "react";
import {
  FaUserGraduate,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaEye,
} from "react-icons/fa";

/* ================= MOCK DATA ================= */
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Ramesh Kumar",
    email: "ramesh@gmail.com",
    batch: "Playwright Jan 2025",
    course: "Playwright Automation",
    progress: 70,
    status: "Active",
  },
  {
    id: 2,
    name: "Anjali Sharma",
    email: "anjali@gmail.com",
    batch: "Playwright Jan 2025",
    course: "Playwright Automation",
    progress: 100,
    status: "Completed",
  },
  {
    id: 3,
    name: "Vijay Patel",
    email: "vijay@gmail.com",
    batch: "Manual Testing Dec 2024",
    course: "Manual Testing",
    progress: 45,
    status: "Active",
  },
];

/* ================= STATUS STYLES ================= */
const statusStyles = {
  Active: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");

  useEffect(() => {
    // Replace with API later
    setStudents(MOCK_STUDENTS);
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      const matchesBatch =
        selectedBatch === "All" || s.batch === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [students, search, selectedBatch]);

  const batches = ["All", ...new Set(students.map((s) => s.batch))];

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Student List
        </h1>
        <p className="text-sm text-gray-500">
          Students enrolled in your batches
        </p>
      </div>

      {/* ================= FILTERS ================= */}
      <div
        className="
          flex flex-col md:flex-row gap-4
          p-4 rounded-2xl
          bg-white/70 backdrop-blur-xl
          border border-white/40
        "
      >
        <div className="flex items-center gap-2 flex-1">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 rounded-xl border bg-white text-sm"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
      </div>

      {/* ================= STUDENT TABLE ================= */}
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
              <th className="px-4 py-3 text-left">Batch</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-500"
                >
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-t hover:bg-indigo-50/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FaUserGraduate className="text-indigo-500" />
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

                  <td className="px-4 py-3">
                    {student.batch}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{
                            width: `${student.progress}%`,
                          }}
                        />
                      </div>
                      <span>{student.progress}%</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${statusStyles[student.status]}
                      `}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="
                        inline-flex items-center gap-2
                        px-4 py-1.5 rounded-lg
                        bg-indigo-600 hover:bg-indigo-700
                        text-white text-xs font-semibold
                      "
                    >
                      <FaEye />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
