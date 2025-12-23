import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= STATUS HELPERS ================= */

const STATUS_COLORS = {
  ToStart: "bg-gray-200/60 text-gray-800",
  InProgress: "bg-blue-200/60 text-blue-800",
  Done: "bg-green-200/60 text-green-800",
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

    const normalizedAllocations = {};

    storedBatches.forEach((batch) => {
      normalizedAllocations[batch.id] = {
        students: storedAllocations[batch.id]?.students || [],
        status: getBatchStatus(batch.startDate, batch.endDate),
      };
    });

    localStorage.setItem(
      "batchAllocations",
      JSON.stringify(normalizedAllocations)
    );

    setBatches(storedBatches);
    setStudents(storedStudents);
    setAllocations(normalizedAllocations);
  }, []);

  /* ================= LOAD STUDENTS FOR SELECTED BATCH ================= */
  useEffect(() => {
    if (!selectedBatch) return;
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

  /* ================= SAVE ALLOCATION ================= */
  const saveAllocation = () => {
    if (!selectedBatch) {
      setToast("⚠️ Please select a batch");
      return;
    }

    const updated = { ...allocations };

    // Remove student from other batches (1 student → 1 batch rule)
    Object.keys(updated).forEach((batchId) => {
      updated[batchId].students =
        updated[batchId].students.filter(
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

  const getStatusLabel = (st) =>
    st === "ToStart"
      ? "To Start"
      : st === "InProgress"
      ? "In Progress"
      : "Done";

  return (
    <div className="max-w-6xl space-y-8 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold">Batch Allocation</h2>
          <p className="text-sm text-gray-600">
            Allocate students from Students module
          </p>
        </div>
      </div>

      {/* ================= ALLOCATION PANEL ================= */}
      <GlassCard>
        <label className="text-sm font-medium">Select Batch</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full mt-1 mb-4 p-3 rounded-xl bg-white/70 border"
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
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold">
                Assign Students ({selectedStudents.length})
              </p>
              <input
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-lg bg-white/70 border text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              {filteredStudents.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 bg-white/60 p-3 rounded-xl"
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
              className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full
                bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
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
          const st = getBatchStatus(batch.startDate, batch.endDate);

          return (
            <GlassCard key={batch.id}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold">{batch.name}</h3>
                  <p className="text-sm text-gray-600">
                    {batch.course}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[st]}`}
                >
                  {getStatusLabel(st)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-700">
                <FaUsers />
                <span>{count} Students</span>
              </div>

              {count > 0 && (
                <div className="mt-2 text-xs text-gray-600">
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

/* ================= SHARED GLASS ================= */

const GlassCard = ({ children }) => (
  <div className="bg-white/40 backdrop-blur-[24px] border border-white/40 rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
    {children}
  </div>
);
