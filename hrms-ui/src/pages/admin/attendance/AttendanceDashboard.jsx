import { useEffect, useMemo, useState } from "react";
import Toast from "../../../components/Toast";

/* ================= UTIL ================= */

const STATUS_COLORS = {
  Present: "bg-green-200/70 text-green-800",
  Absent: "bg-red-200/70 text-red-800",
};

/* ================= COMPONENT ================= */

export default function AttendanceDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});
  const [toast, setToast] = useState("");
  const [confirmUnlock, setConfirmUnlock] = useState(false);

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    setCourses(JSON.parse(localStorage.getItem("courses")) || []);
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);

    const users = JSON.parse(localStorage.getItem("users")) || {};
    setStudents(users.students || []);
  }, []);

  /* ================= FILTER BATCHES BY COURSE (ROBUST) ================= */

  const filteredBatches = useMemo(() => {
    if (!courseId) return [];

    const selectedCourse = courses.find(
      (c) => String(c.id) === String(courseId)
    );

    return batches.filter((b) => {
      return (
        String(b.courseId) === String(courseId) ||
        String(b.course?.id) === String(courseId) ||
        String(b.course) === String(selectedCourse?.title)
      );
    });
  }, [batches, courses, courseId]);

  /* ================= AUTO SELECT FIRST BATCH ================= */

  useEffect(() => {
    if (filteredBatches.length) {
      setBatchId(String(filteredBatches[0].id));
    } else {
      setBatchId("");
    }
  }, [filteredBatches]);

  /* ================= RESOLVE STUDENTS FOR BATCH ================= */

  const batchStudents = useMemo(() => {
    if (!batchId) return [];

    const allocations =
      JSON.parse(localStorage.getItem("batchAllocations")) || {};

    const allocatedIds = allocations[batchId]?.students || [];

    return students.filter(
      (s) =>
        allocatedIds.includes(s.id) ||
        String(s.batchId) === String(batchId) // legacy fallback
    );
  }, [students, batchId]);

  /* ================= LOAD ATTENDANCE ================= */

  useEffect(() => {
    if (!batchId || !selectedDate) {
      setAttendance({});
      return;
    }

    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    setAttendance(store[selectedDate]?.[batchId] || {});
  }, [batchId, selectedDate]);

  /* ================= LOCK STATE ================= */

  const isLocked = useMemo(() => {
    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    return Boolean(store?.[selectedDate]?.[batchId]);
  }, [batchId, selectedDate]);

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;

    batchStudents.forEach((s) => {
      if (attendance[s.id] === "Present") present++;
      if (attendance[s.id] === "Absent") absent++;
    });

    return {
      total: batchStudents.length,
      present,
      absent,
      pending: batchStudents.length - (present + absent),
    };
  }, [attendance, batchStudents]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  /* ================= SAVE ================= */

  const saveAttendance = () => {
    if (summary.pending > 0) {
      setToast("⚠️ Mark attendance for all students");
      return;
    }

    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    if (!store[selectedDate]) store[selectedDate] = {};
    store[selectedDate][batchId] = attendance;

    localStorage.setItem("attendance", JSON.stringify(store));
    setToast("✅ Attendance saved & locked");
  };

  /* ================= UNLOCK ================= */

  const unlockAttendance = () => {
    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    delete store?.[selectedDate]?.[batchId];
    localStorage.setItem("attendance", JSON.stringify(store));

    setAttendance({});
    setConfirmUnlock(false);
    setToast("🔓 Attendance unlocked");
  };

  /* ================= UI ================= */

  return (
    <div
      className="
        max-w-6xl mx-auto space-y-8 pb-24 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Attendance Dashboard
        </h2>
        <p className="text-sm text-slate-600">
          Course → Batch → Date → Attendance
        </p>
      </div>

      {/* FILTER BAR */}
      <GlassCard>
        <div className="grid md:grid-cols-4 gap-4">
          <Select
            value={courseId}
            onChange={setCourseId}
            placeholder="Select Course"
            options={courses.map((c) => ({
              value: c.id,
              label: c.title,
            }))}
          />

          <Select
            value={batchId}
            onChange={setBatchId}
            placeholder="Select Batch"
            disabled={!courseId}
            options={filteredBatches.map((b) => ({
              value: b.id,
              label: b.name,
            }))}
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="glass-input"
          />

          <div className="flex items-center text-sm text-slate-600">
            {isLocked ? "🔒 Locked" : "📝 Editable"}
          </div>
        </div>
      </GlassCard>

      {/* LOCK MESSAGE */}
      {isLocked && (
        <div className="flex justify-between items-center px-6 py-3 rounded-xl bg-yellow-100 text-yellow-800">
          Attendance already submitted for this date.

          {user?.role === "Admin" && (
            <button
              onClick={() => setConfirmUnlock(true)}
              className="px-4 py-1.5 rounded-full bg-yellow-600 text-white text-sm font-semibold"
            >
              Unlock
            </button>
          )}
        </div>
      )}

      {/* SUMMARY */}
      {batchId && (
        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Total" value={summary.total} />
          <Stat label="Present" value={summary.present} />
          <Stat label="Absent" value={summary.absent} />
          <Stat label="Pending" value={summary.pending} highlight />
        </div>
      )}

      {/* TABLE */}
      {batchId && (
        <GlassCard>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-slate-600">
                <th className="text-left py-2">Student</th>
                <th>Email</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>

            <tbody>
              {batchStudents.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td>{s.email}</td>
                  <td className="text-right">
                    <select
                      disabled={isLocked}
                      value={attendance[s.id] || ""}
                      onChange={(e) =>
                        updateStatus(s.id, e.target.value)
                      }
                      className={`px-4 py-1.5 rounded-full ${
                        STATUS_COLORS[attendance[s.id]] ||
                        "bg-gray-100"
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            disabled={isLocked || summary.pending > 0}
            onClick={saveAttendance}
            className="
              mt-6 px-8 py-3 rounded-full
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              disabled:opacity-50
              text-white font-semibold
            "
          >
            Save Attendance
          </button>
        </GlassCard>
      )}

      {/* CONFIRM UNLOCK */}
      {confirmUnlock && (
        <ConfirmModal
          onCancel={() => setConfirmUnlock(false)}
          onConfirm={unlockAttendance}
        />
      )}

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= UI ================= */

const Select = ({ value, onChange, options, placeholder, disabled }) => (
  <select
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    className="glass-input"
  >
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const Stat = ({ label, value, highlight }) => (
  <GlassCard>
    <div className={`text-center ${highlight ? "text-red-600" : ""}`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </GlassCard>
);

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-80 space-y-4 shadow-xl">
      <h3 className="font-semibold text-lg">Unlock Attendance?</h3>
      <p className="text-sm text-gray-600">
        This will allow editing attendance for this date.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-yellow-600 text-white"
        >
          Unlock
        </button>
      </div>
    </div>
  </div>
);

const GlassCard = ({ children }) => (
  <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow">
    {children}
  </div>
);
