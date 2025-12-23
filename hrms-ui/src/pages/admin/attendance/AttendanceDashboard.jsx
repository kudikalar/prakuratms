import { useEffect, useMemo, useState } from "react";
import Toast from "../../../components/Toast";

/* ================= UTIL ================= */
const todayStr = new Date().toISOString().split("T")[0];

const STATUS_COLORS = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
};

/* ================= COMPONENT ================= */
export default function AttendanceDashboard() {
  const user = JSON.parse(localStorage.getItem("user")); // 👈 ADMIN CHECK

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [attendance, setAttendance] = useState({});
  const [toast, setToast] = useState("");
  const [confirmUnlock, setConfirmUnlock] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    setCourses(JSON.parse(localStorage.getItem("courses")) || []);
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);

    const users = JSON.parse(localStorage.getItem("users")) || {};
    setStudents(users.students || []);
  }, []);

  /* ================= FILTER BATCHES ================= */
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

  /* ================= LOAD SAVED ATTENDANCE ================= */
  useEffect(() => {
    if (!batchId) return;
    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    setAttendance(store?.[todayStr]?.[batchId] || {});
  }, [batchId]);

  /* ================= LOCK LOGIC (BASED ON SUBMISSION) ================= */
  const isLocked = useMemo(() => {
    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    return Boolean(store?.[todayStr]?.[batchId]);
  }, [batchId]);

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
    if (!store[todayStr]) store[todayStr] = {};

    store[todayStr][batchId] = attendance;
    localStorage.setItem("attendance", JSON.stringify(store));

    setToast("✅ Attendance saved & locked");
  };

  /* ================= UNLOCK (ADMIN ONLY) ================= */
  const unlockAttendance = () => {
    const store = JSON.parse(localStorage.getItem("attendance")) || {};
    if (store?.[todayStr]?.[batchId]) {
      delete store[todayStr][batchId];
      localStorage.setItem("attendance", JSON.stringify(store));
    }

    setAttendance({});
    setConfirmUnlock(false);
    setToast("🔓 Attendance unlocked. You can edit now.");
  };

  return (
    <div className="space-y-10 text-gray-800">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold">Attendance Dashboard</h2>
        <p className="text-sm text-gray-600">
          Select course → batch → mark attendance
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <GlassCard>
        <div className="grid md:grid-cols-3 gap-4">
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

          <input type="date" value={todayStr} disabled className="input" />
        </div>
      </GlassCard>

      {/* ================= LOCK MESSAGE + UNLOCK ================= */}
      {isLocked && (
        <div className="flex items-center justify-between px-6 py-3 rounded-xl bg-yellow-100 text-yellow-800">
          🔒 Attendance already submitted for today.

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
                      className={`px-4 py-1.5 rounded-full
                        ${
                          STATUS_COLORS[attendance[s.id]] ||
                          "bg-gray-100"
                        }
                      `}
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

/* ================= UI COMPONENTS ================= */

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
        This will allow editing today’s attendance.
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
