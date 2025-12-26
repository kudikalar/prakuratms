import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= STATUS HELPERS ================= */

const STATUS_COLORS = {
  ToStart: "bg-gray-200/70 text-gray-800",
  InProgress: "bg-blue-200/70 text-blue-800",
  Done: "bg-green-200/70 text-green-800",
};

const STATUS_LABEL = {
  ToStart: "To Start",
  InProgress: "In Progress",
  Done: "Completed",
};

const getBatchStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return "ToStart";
  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);

  if (today < start) return "ToStart";
  if (today > end) return "Done";
  return "InProgress";
};

/* ================= MAIN ================= */

export default function BatchAllocation() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const storedBatches =
      JSON.parse(localStorage.getItem("batches")) || [];

    const users =
      JSON.parse(localStorage.getItem("users")) || {};
    const storedStudents = users.students || [];

    const storedAllocations =
      JSON.parse(localStorage.getItem("batchAllocations")) || {};

    const normalized = {};
    storedBatches.forEach((b) => {
      normalized[b.id] = {
        students: storedAllocations[b.id]?.students || [],
        status: getBatchStatus(b.startDate, b.endDate),
      };
    });

    localStorage.setItem(
      "batchAllocations",
      JSON.stringify(normalized)
    );

    setBatches(storedBatches);
    setStudents(storedStudents);
    setAllocations(normalized);
  }, []);

  /* ================= LOAD STUDENTS ON BATCH CHANGE ================= */
  useEffect(() => {
    if (!selectedBatch) {
      setSelectedStudents([]);
      return;
    }
    setSelectedStudents(
      allocations[selectedBatch]?.students || []
    );
  }, [selectedBatch, allocations]);

  /* ================= FILTER STUDENTS ================= */
  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  /* ================= TOGGLE STUDENT ================= */
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  /* ================= SAVE ================= */
  const saveAllocation = () => {
    if (!selectedBatch) {
      setToast("⚠️ Please select a batch");
      return;
    }

    const updated = { ...allocations };

    // Ensure one student → one batch
    Object.keys(updated).forEach((bid) => {
      updated[bid].students =
        updated[bid].students.filter(
          (id) => !selectedStudents.includes(id)
        );
    });

    const batch = batches.find(
      (b) => b.id === Number(selectedBatch)
    );

    updated[selectedBatch] = {
      students: selectedStudents,
      status: getBatchStatus(batch.startDate, batch.endDate),
    };

    setAllocations(updated);
    localStorage.setItem(
      "batchAllocations",
      JSON.stringify(updated)
    );

    setToast("✅ Batch allocation saved");
    setTimeout(() => setToast(""), 2500);
  };

  const getStudentNames = (ids = []) =>
    students
      .filter((s) => ids.includes(s.id))
      .map((s) => s.name)
      .join(", ");

  return (
    <div
      className="
        max-w-6xl mx-auto space-y-8 pb-24 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/60 border border-white/50"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Batch Allocation
          </h2>
          <p className="text-sm text-slate-600">
            Assign students to training batches
          </p>
        </div>
      </div>

      {/* ================= ALLOCATION PANEL ================= */}
      <GlassCard>
        <label className="text-sm font-medium">Select Batch</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="glass-input mt-1 mb-4"
        >
          <option value="">-- Select Batch --</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.course})
            </option>
          ))}
        </select>

        {selectedBatch && (
          <>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold">
                Assign Students
                <span className="ml-2 text-xs text-purple-700">
                  ({selectedStudents.length} selected)
                </span>
              </p>

              <input
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input text-sm w-48"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
              {filteredStudents.map((s) => (
                <label
                  key={s.id}
                  className="
                    flex items-center gap-3
                    bg-white/60 p-3 rounded-xl
                    hover:bg-white/80 transition
                  "
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>

            <button
              onClick={saveAllocation}
              disabled={!selectedBatch}
              className="
                mt-5 flex items-center gap-2 px-7 py-3 rounded-full
                font-semibold text-white
                bg-gradient-to-r from-purple-600 to-indigo-600
                hover:from-purple-700 hover:to-indigo-700
                shadow-lg transition
                disabled:opacity-50
              "
            >
              <FaCheckCircle />
              Save Allocation
            </button>
          </>
        )}
      </GlassCard>

      {/* ================= OVERVIEW ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {batches.map((batch) => {
          const alloc = allocations[batch.id];
          const count = alloc?.students.length || 0;
          const status = getBatchStatus(batch.startDate, batch.endDate);

          return (
            <GlassCard key={batch.id}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {batch.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {batch.course}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-700">
                <FaUsers />
                <span>{count} Students</span>
              </div>

              {count > 0 && (
                <div className="mt-2 text-xs text-slate-600">
                  {getStudentNames(alloc.students)}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= SHARED UI ================= */

const GlassCard = ({ children }) => (
  <div
    className="
      bg-white/40 backdrop-blur-[24px]
      border border-white/40
      rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
    "
  >
    {children}
  </div>
);
