import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaArrowLeft,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= STATUS HELPERS ================= */

const STATUS_COLORS = {
  ToStart: "bg-slate-200/70 text-slate-800",
  InProgress: "bg-indigo-200/70 text-indigo-800",
  Done: "bg-emerald-200/70 text-emerald-800",
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

const normalizeId = (v) => (v == null ? "" : String(v));

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

  const [editBatch, setEditBatch] = useState(null);
  const [deleteBatchId, setDeleteBatchId] = useState(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    const storedBatches =
      JSON.parse(localStorage.getItem("batches")) || [];

    const users =
      JSON.parse(localStorage.getItem("users")) || {};
    const storedStudents = (users.students || []).map((s) => ({
      ...s,
      id: normalizeId(s.id),
    }));

    const storedAllocations =
      JSON.parse(localStorage.getItem("batchAllocations")) || {};

    const normalizedAllocations = {};
    storedBatches.forEach((b) => {
      const bid = normalizeId(b.id);
      normalizedAllocations[bid] = {
        students:
          storedAllocations[bid]?.students?.map(normalizeId) || [],
        status: getBatchStatus(b.startDate, b.endDate),
      };
    });

    localStorage.setItem(
      "batchAllocations",
      JSON.stringify(normalizedAllocations)
    );

    setBatches(storedBatches.map((b) => ({ ...b, id: normalizeId(b.id) })));
    setStudents(storedStudents);
    setAllocations(normalizedAllocations);
  }, []);

  /* ================= LOAD STUDENTS ON BATCH ================= */

  useEffect(() => {
    if (!selectedBatch) {
      setSelectedStudents([]);
      return;
    }
    setSelectedStudents(
      allocations[selectedBatch]?.students || []
    );
  }, [selectedBatch, allocations]);

  /* ================= FILTER ================= */

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  /* ================= TOGGLE STUDENT ================= */

  const toggleStudent = (id) => {
    const sid = normalizeId(id);
    setSelectedStudents((prev) =>
      prev.includes(sid)
        ? prev.filter((s) => s !== sid)
        : [...prev, sid]
    );
  };

  /* ================= SAVE ALLOCATION ================= */

  const saveAllocation = () => {
    if (!selectedBatch) {
      setToast("⚠️ Please select a batch");
      return;
    }

    const updated = {};

    Object.keys(allocations).forEach((bid) => {
      updated[bid] = {
        ...allocations[bid],
        students: allocations[bid].students.filter(
          (sid) => !selectedStudents.includes(sid)
        ),
      };
    });

    const batch = batches.find((b) => b.id === selectedBatch);

    updated[selectedBatch] = {
      students: [...selectedStudents],
      status: getBatchStatus(batch?.startDate, batch?.endDate),
    };

    setAllocations(updated);
    localStorage.setItem("batchAllocations", JSON.stringify(updated));

    setToast("✅ Batch allocation saved");
    setTimeout(() => setToast(""), 2500);
  };

  /* ================= EDIT BATCH ================= */

  const saveBatchEdit = () => {
    const updatedBatches = batches.map((b) =>
      b.id === editBatch.id ? editBatch : b
    );

    const updatedAllocations = {
      ...allocations,
      [editBatch.id]: {
        ...allocations[editBatch.id],
        status: getBatchStatus(
          editBatch.startDate,
          editBatch.endDate
        ),
      },
    };

    setBatches(updatedBatches);
    setAllocations(updatedAllocations);

    localStorage.setItem("batches", JSON.stringify(updatedBatches));
    localStorage.setItem(
      "batchAllocations",
      JSON.stringify(updatedAllocations)
    );

    setEditBatch(null);
    setToast("✅ Batch updated");
    setTimeout(() => setToast(""), 2500);
  };

  /* ================= DELETE BATCH ================= */

  const confirmDeleteBatch = () => {
    const updatedBatches = batches.filter(
      (b) => b.id !== deleteBatchId
    );

    const updatedAllocations = { ...allocations };
    delete updatedAllocations[deleteBatchId];

    setBatches(updatedBatches);
    setAllocations(updatedAllocations);

    localStorage.setItem("batches", JSON.stringify(updatedBatches));
    localStorage.setItem(
      "batchAllocations",
      JSON.stringify(updatedAllocations)
    );

    if (selectedBatch === deleteBatchId) {
      setSelectedBatch("");
      setSelectedStudents([]);
    }

    setDeleteBatchId(null);
    setToast("🗑️ Batch deleted");
    setTimeout(() => setToast(""), 2500);
  };

  const getStudentNames = (ids = []) =>
    students
      .filter((s) => ids.includes(s.id))
      .map((s) => s.name)
      .join(", ");

  /* ================= UI ================= */

  return (
    <div className="
      max-w-6xl mx-auto space-y-10 pb-24 animate-fadeIn
      bg-gradient-to-br from-indigo-50 via-orange-50 to-pink-50
      rounded-[40px] p-6 md:p-8
      shadow-[0_40px_120px_rgba(79,70,229,0.25)]
    ">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/70 border border-white/50"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="
            text-2xl font-bold
            bg-gradient-to-r from-indigo-600 to-orange-500
            bg-clip-text text-transparent
          ">
            Batch Allocation
          </h2>
          <p className="text-sm text-slate-500">
            Assign, edit and manage batch allocations
          </p>
        </div>
      </div>

      {/* ALLOCATION */}
      <GlassCard>
        <label className="text-sm font-semibold">Select Batch</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="glass-input mt-2 mb-4"
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
              <p className="font-semibold text-sm">
                Assign Students
                <span className="ml-2 text-xs text-indigo-600">
                  ({selectedStudents.length})
                </span>
              </p>
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-48 text-sm"
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
              className="
                mt-6 flex items-center gap-2 px-8 py-3 rounded-full
                text-white font-semibold
                bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500
                hover:from-indigo-700 hover:to-orange-600
                shadow-[0_15px_40px_rgba(79,70,229,0.45)]
              "
            >
              <FaCheckCircle />
              Save Allocation
            </button>
          </>
        )}
      </GlassCard>

      {/* BATCH OVERVIEW */}
      <div className="grid md:grid-cols-3 gap-6">
        {batches.map((batch) => {
          const alloc = allocations[batch.id];
          const count = alloc?.students.length || 0;
          const status = alloc?.status;

          return (
            <GlassCard key={batch.id}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold">{batch.name}</h3>
                  <p className="text-sm text-slate-600">
                    {batch.course}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>

                  <button
                    onClick={() => setEditBatch(batch)}
                    className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => setDeleteBatchId(batch.id)}
                    className="p-2 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-indigo-600">
                <FaUsers />
                {count} Students
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

      {/* EDIT MODAL */}
      {editBatch && (
        <Modal>
          <h3 className="font-semibold text-lg mb-3">Edit Batch</h3>
          <input
            className="glass-input mb-2"
            value={editBatch.name}
            onChange={(e) =>
              setEditBatch({ ...editBatch, name: e.target.value })
            }
          />
          <input
            className="glass-input mb-2"
            value={editBatch.course}
            onChange={(e) =>
              setEditBatch({ ...editBatch, course: e.target.value })
            }
          />
          <input
            type="date"
            className="glass-input mb-2"
            value={editBatch.startDate || ""}
            onChange={(e) =>
              setEditBatch({ ...editBatch, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className="glass-input"
            value={editBatch.endDate || ""}
            onChange={(e) =>
              setEditBatch({ ...editBatch, endDate: e.target.value })
            }
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setEditBatch(null)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={saveBatchEdit} className="btn-primary">
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteBatchId && (
        <Modal>
          <h3 className="font-semibold text-lg">
            Delete Batch?
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            All students will be unassigned.
          </p>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setDeleteBatchId(null)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={confirmDeleteBatch} className="btn-danger">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= SHARED UI ================= */

const GlassCard = ({ children }) => (
  <div className="
    bg-white/65 backdrop-blur-2xl
    border border-white/50
    rounded-3xl p-6
    shadow-[0_25px_80px_rgba(0,0,0,0.15)]
  ">
    {children}
  </div>
);

const Modal = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative bg-white rounded-3xl p-6 w-96 shadow-xl">
      {children}
    </div>
  </div>
);
