import { useEffect, useMemo, useState } from "react";
import Toast from "../../../components/Toast";

/* ================= UTIL ================= */

const STATUS_COLORS = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
};

/* ================= COMPONENT ================= */

export default function AttendanceDashboard() {
  const user = JSON.parse(localStorage.getItem("user")); // Admin check

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

  /* ================= FILTER BATCHES BY COURSE ================= */

  const filteredBatches = batches.filter((b) => {
    const cid = b.courseId ?? b.course?.id ?? "";
    return String(cid) === String(courseId);
  });

  /* ================= AUTO SELECT FIRST BATCH ================= */

  useEffect(() => {
    if (filteredBatches.length) {
      setBatchId(String(filteredBatches[0].id));
    } else {
      setBatchId("");
    }
  }, [filteredBatches]);

  /* ================= FILTER STUDENTS ================= */

  const batchStudents = students.filter(
    (s) => String(s.batchId) === String(batchId)
  );

  /* ================= LOAD ATTENDANCE (DATE + BATCH) ================= */

  useEffect(() => {
    if (!batchId || !selectedDate) return;

    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    setAttendance(store?.[selectedDate]?.[batchId] || {});
  }, [batchId, selectedDate]);

  /* ================= LOCK LOGIC ================= */

  const isLocked = useMemo(() => {
    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    return Boolean(store?.[selectedDate]?.[batchId]);
  }, [batchId, selectedDate]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  /* ================= SAVE ATTENDANCE ================= */

  const saveAttendance = () => {
    if (batchStudents.some((s) => !attendance[s.id])) {
      setToast("⚠️ Mark attendance for all students");
      return;
    }

    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    if (!store[selectedDate]) store[selectedDate] = {};

    store[selectedDate][batchId] = attendance;
    localStorage.setItem("attendance", JSON.stringify(store));

    setToast("✅ Attendance saved & locked");
  };

  /* ================= UNLOCK ATTENDANCE (ADMIN) ================= */

  const unlockAttendance = () => {
    const store = JSON.parse(localStorage.getItem("attendance")) || {};

    if (store?.[selectedDate]?.[batchId]) {
      delete store[selectedDate][batchId];
      localStorage.setItem("attendance", JSON.stringify(store));
    }

    setAttendance({});
    setConfirmUnlock(false);
    setToast("🔓 Attendance unlocked for selected date");
  };

  return (
    <div className="space-y-10 text-gray-800">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold">Attendance Dashboard</h2>
        <p className="text-sm text-gray-600">
          Select course → batch → date → mark attendance
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
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
            className="input"
          />

          <div className="text-sm text-gray-500 flex items-center">
            {isLocked ? "🔒 Locked" : "📝 Editable"}
          </div>
        </div>
      </GlassCard>

      {/* ================= LOCK MESSAGE ================= */}
      {isLocked && (
        <div className="flex items-center justify-between px-6 py-3 rounded-xl bg-yellow-100 text-yellow-800">
          🔒 Attendance already submitted for this date.

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

      {/* ================= TABLE ================= */}
      {batchId && (
        <GlassCard>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th>Student</th>
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
            disabled={isLocked}
            onClick={saveAttendance}
            className="mt-6 px-8 py-2.5 rounded-full
              bg-purple-600 hover:bg-purple-700
              disabled:opacity-50
              text-white font-semibold"
          >
            Save Attendance
          </button>
        </GlassCard>
      )}

      {/* ================= CONFIRM UNLOCK ================= */}
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
    className="input"
  >
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-80 space-y-4 shadow-xl">
      <h3 className="font-semibold text-lg">Unlock Attendance?</h3>
      <p className="text-sm text-gray-600">
        This will allow editing attendance for selected date.
      </p>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100">
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
  <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow">
    {children}
  </div>
);
