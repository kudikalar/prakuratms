import { useEffect, useMemo, useState } from "react";
import Toast from "../../../components/Toast";

/* ================= CONSTANTS ================= */

const STATUS_COLORS = {
  Present:
    "bg-emerald-200/80 text-emerald-800 ring-1 ring-emerald-300",
  Absent:
    "bg-rose-200/80 text-rose-800 ring-1 ring-rose-300",
};

/* ================= HELPERS ================= */

const getId = (obj) => String(obj?._id || obj?.id || "");

const readLS = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

/* ================= COMPONENT ================= */

export default function AttendanceDashboard() {
  const user = readLS("user", {});

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
    setCourses(readLS("PRAKURA_COURSES", []));
    setBatches(readLS("batches", []));

    const users = readLS("users", {});
    setStudents(users.students || []);
  }, []);

  /* ================= FILTER BATCHES BY COURSE ================= */

  const filteredBatches = useMemo(() => {
    if (!courseId) return [];
    return batches.filter(
      (b) => String(b.courseId) === String(courseId)
    );
  }, [batches, courseId]);

  /* ================= AUTO SELECT FIRST BATCH ================= */

  useEffect(() => {
    if (filteredBatches.length > 0) {
      setBatchId(getId(filteredBatches[0]));
    } else {
      setBatchId("");
    }
  }, [filteredBatches]);

  /* ================= FILTER STUDENTS ================= */

  const batchStudents = useMemo(() => {
    if (!courseId || !batchId) return [];
    return students.filter(
      (s) =>
        String(s.courseId) === String(courseId) &&
        String(s.batchId) === String(batchId)
    );
  }, [students, courseId, batchId]);

  /* ================= LOAD ATTENDANCE ================= */

  useEffect(() => {
    if (!batchId || !selectedDate) {
      setAttendance({});
      return;
    }

    const store = readLS("attendance", {});
    setAttendance(store?.[selectedDate]?.[batchId] || {});
  }, [batchId, selectedDate]);

  /* ================= LOCK STATE ================= */

  const isLocked = useMemo(() => {
    const store = readLS("attendance", {});
    return Boolean(store?.[selectedDate]?.[batchId]);
  }, [batchId, selectedDate]);

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;

    batchStudents.forEach((s) => {
      if (attendance[getId(s)] === "Present") present++;
      if (attendance[getId(s)] === "Absent") absent++;
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

    const store = readLS("attendance", {});
    if (!store[selectedDate]) store[selectedDate] = {};

    const normalized = {};
    batchStudents.forEach((s) => {
      normalized[getId(s)] = attendance[getId(s)];
    });

    store[selectedDate][batchId] = normalized;
    localStorage.setItem("attendance", JSON.stringify(store));

    setToast("✅ Attendance saved successfully");
    window.dispatchEvent(new Event("attendance-updated"));
  };

  /* ================= UI ================= */

  return (
    <div
      className="
        max-w-7xl mx-auto space-y-10 pb-24 animate-fadeIn
        bg-gradient-to-br from-indigo-50 via-violet-50 to-rose-50
        rounded-[40px] p-6 md:p-8
        shadow-[0_50px_140px_rgba(79,70,229,0.25)]
      "
      data-testid="attendance-dashboard"
    >
      {/* HEADER */}
      <div>
        <h2
          className="
            text-2xl font-bold
            bg-gradient-to-r from-indigo-600 to-rose-500
            bg-clip-text text-transparent
          "
          data-testid="attendance-title"
        >
          Attendance Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Course → Batch → Date → Attendance
        </p>
      </div>

      {/* FILTER BAR */}
      <GlassCard>
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <Select
            value={courseId}
            onChange={setCourseId}
            placeholder="Select Course"
            options={courses.map((c) => ({
              value: getId(c),
              label: c.title,
            }))}
            dataTestId="attendance-course-select"
          />

          <Select
            value={batchId}
            onChange={setBatchId}
            placeholder="Select Batch"
            disabled={!courseId}
            options={filteredBatches.map((b) => ({
              value: getId(b),
              label: b.name,
            }))}
            dataTestId="attendance-batch-select"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="glass-input"
            data-testid="attendance-date"
          />

          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className={`px-3 py-1 rounded-full ${
                isLocked
                  ? "bg-rose-100 text-rose-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {isLocked ? "🔒 Locked" : "📝 Editable"}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* SUMMARY */}
      {batchId && (
        <div className="grid md:grid-cols-4 gap-5">
          <Stat label="Total" value={summary.total} />
          <Stat label="Present" value={summary.present} />
          <Stat label="Absent" value={summary.absent} />
          <Stat label="Pending" value={summary.pending} highlight />
        </div>
      )}

      {/* TABLE */}
      {batchId && (
        <GlassCard>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm min-w-[640px]"
              data-testid="attendance-table"
            >
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="text-left py-3">Student</th>
                  <th>Email</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>

              <tbody>
                {batchStudents.map((s) => (
                  <tr
                    key={getId(s)}
                    className="border-b last:border-0 hover:bg-indigo-50/40 transition"
                  >
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="text-slate-600">{s.email}</td>
                    <td className="text-right">
                      <select
                        disabled={isLocked}
                        value={attendance[getId(s)] || ""}
                        onChange={(e) =>
                          updateStatus(getId(s), e.target.value)
                        }
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-semibold
                          ${
                            STATUS_COLORS[
                              attendance[getId(s)]
                            ] || "bg-slate-100"
                          }
                          focus:outline-none
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
          </div>

          <button
            disabled={isLocked || summary.pending > 0}
            onClick={saveAttendance}
            className="
              mt-6 px-10 py-3 rounded-full
              text-white font-semibold
              bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500
              hover:from-indigo-700 hover:to-rose-600
              shadow-[0_15px_45px_rgba(79,70,229,0.45)]
              disabled:opacity-40
            "
            data-testid="attendance-save-button"
          >
            Save Attendance
          </button>
        </GlassCard>
      )}

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Select = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  dataTestId,
}) => (
  <select
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    className="glass-input"
    data-testid={dataTestId}
    aria-label={placeholder}
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
    <div className="text-center">
      <p className="text-xs tracking-widest uppercase text-slate-500">
        {label}
      </p>
      <p
        className={`text-3xl font-bold ${
          highlight ? "text-rose-600" : "text-indigo-600"
        }`}
      >
        {value}
      </p>
    </div>
  </GlassCard>
);

const GlassCard = ({ children }) => (
  <div
    className="
      bg-white/65 backdrop-blur-2xl
      border border-white/50
      rounded-3xl p-6
      shadow-[0_25px_80px_rgba(0,0,0,0.15)]
    "
  >
    {children}
  </div>
);
