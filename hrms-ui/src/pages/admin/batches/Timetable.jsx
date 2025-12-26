import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

/* ================= CONSTANTS ================= */

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* ================= MAIN ================= */

export default function Timetable() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [entries, setEntries] = useState([]);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    day: "",
    subject: "",
    start: "",
    end: "",
  });

  /* ================= LOAD BATCHES ================= */
  useEffect(() => {
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  /* ================= LOAD TIMETABLE ================= */
  useEffect(() => {
    if (!selectedBatch) {
      setEntries([]);
      return;
    }
    const tables = JSON.parse(localStorage.getItem("timetables")) || {};
    setEntries(tables[selectedBatch] || []);
  }, [selectedBatch]);

  /* ================= GROUP BY DAY ================= */
  const groupedByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((d) => (map[d] = []));
    entries.forEach((e) => map[e.day]?.push(e));

    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => a.start.localeCompare(b.start));
    });

    return map;
  }, [entries]);

  /* ================= VALIDATION ================= */
  const isOverlap = () => {
    return entries.some(
      (e) =>
        e.day === form.day &&
        !(form.end <= e.start || form.start >= e.end)
    );
  };

  const addEntry = () => {
    if (!selectedBatch) {
      setToast("⚠️ Select a batch first");
      return;
    }

    if (!form.day || !form.subject || !form.start || !form.end) {
      setToast("⚠️ All fields are required");
      return;
    }

    if (form.start >= form.end) {
      setToast("❌ End time must be after start time");
      return;
    }

    if (isOverlap()) {
      setToast("⛔ Time slot overlaps for this day");
      return;
    }

    const updated = [...entries, form];
    setEntries(updated);

    const tables = JSON.parse(localStorage.getItem("timetables")) || {};
    tables[selectedBatch] = updated;
    localStorage.setItem("timetables", JSON.stringify(tables));

    setForm({ day: "", subject: "", start: "", end: "" });
    setToast("📅 Timetable updated successfully");
    setTimeout(() => setToast(""), 2000);
  };

  const deleteEntry = (day, index) => {
    const filtered = entries.filter(
      (e, i) => !(e.day === day && i === index)
    );

    setEntries(filtered);
    const tables = JSON.parse(localStorage.getItem("timetables")) || {};
    tables[selectedBatch] = filtered;
    localStorage.setItem("timetables", JSON.stringify(tables));
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/60 border border-white/50"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Batch Timetable
          </h2>
          <p className="text-sm text-slate-600">
            Manage batch schedules & time slots
          </p>
        </div>
      </div>

      {/* SELECT BATCH */}
      <GlassCard>
        <label className="text-sm font-medium">Select Batch</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="glass-input mt-1"
        >
          <option value="">-- Select Batch --</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </GlassCard>

      {/* FORM */}
      {selectedBatch && (
        <GlassCard>
          <div className="grid md:grid-cols-4 gap-3 mb-4">
            <select
              value={form.day}
              onChange={(e) =>
                setForm({ ...form, day: e.target.value })
              }
              className="glass-input"
            >
              <option value="">Day</option>
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              className="glass-input"
            />

            <input
              type="time"
              value={form.start}
              onChange={(e) =>
                setForm({ ...form, start: e.target.value })
              }
              className="glass-input"
            />

            <input
              type="time"
              value={form.end}
              onChange={(e) =>
                setForm({ ...form, end: e.target.value })
              }
              className="glass-input"
            />
          </div>

          <button
            onClick={addEntry}
            className="
              flex items-center gap-2
              px-7 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              shadow-lg transition
            "
          >
            <FaPlus /> Add Slot
          </button>
        </GlassCard>
      )}

      {/* TIMETABLE VIEW */}
      {selectedBatch &&
        DAYS.map(
          (day) =>
            groupedByDay[day]?.length > 0 && (
              <GlassCard key={day}>
                <h3 className="font-semibold mb-3 text-slate-800">
                  {day}
                </h3>

                {groupedByDay[day].map((e, i) => (
                  <div
                    key={i}
                    className="
                      flex justify-between items-center
                      bg-white/60 p-3 rounded-xl mb-2
                    "
                  >
                    <span className="font-medium">{e.subject}</span>
                    <span className="text-sm">
                      {e.start} – {e.end}
                    </span>
                    <button
                      onClick={() => deleteEntry(day, i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </GlassCard>
            )
        )}

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
