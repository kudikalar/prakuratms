import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";

/* =====================================================
   MY BATCHES – EDUCATOR (ENTERPRISE READY)
===================================================== */

export default function MyBatches() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= INIT ================= */

  useEffect(() => {
    // API READY
    // GET /educator/batches

    setTimeout(() => {
      setBatches([
        {
          id: "BATCH-101",
          name: "Playwright Automation – Jan 2025",
          course: "Playwright Automation",
          students: 28,
          schedule: "Mon–Fri · 7:00 PM",
          status: "Active",
        },
        {
          id: "BATCH-102",
          name: "Selenium Java – Feb 2025",
          course: "Selenium Java",
          students: 24,
          schedule: "Tue–Sat · 6:30 PM",
          status: "Active",
        },
        {
          id: "BATCH-103",
          name: "API Automation – Mar 2025",
          course: "API Automation",
          students: 18,
          schedule: "Weekend · 10:00 AM",
          status: "Upcoming",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  /* ================= HANDLERS ================= */

  const openBatch = (batchId) => {
    // ✅ REMEMBER LAST BATCH (CRITICAL)
    localStorage.setItem("educator:lastBatch", batchId);

    // ✅ REDIRECT TO STUDENT LIST
    navigate(`/admin/educator/students/${batchId}`);
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Batches
        </h1>
        <p className="text-sm text-gray-500">
          Select a batch to manage students, attendance & performance
        </p>
      </div>

      {/* BATCH GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="rounded-2xl bg-white/70 backdrop-blur-xl
              border shadow-lg hover:shadow-xl transition"
          >
            <div className="p-5 space-y-4">

              {/* TITLE */}
              <div>
                <h3 className="font-semibold text-gray-800">
                  {batch.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {batch.course}
                </p>
              </div>

              {/* META */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <FaUsers /> {batch.students} Students
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> {batch.schedule}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold
                  ${
                    batch.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {batch.status}
                </span>
              </div>

              {/* ACTION */}
              <button
                onClick={() => openBatch(batch.id)}
                className="w-full mt-2 flex items-center justify-center gap-2
                  px-4 py-2.5 rounded-xl
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white text-sm font-semibold
                  hover:shadow-lg transition"
              >
                <FaLayerGroup />
                Open Batch
                <FaArrowRight />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {batches.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No batches assigned yet
        </div>
      )}
    </div>
  );
}
