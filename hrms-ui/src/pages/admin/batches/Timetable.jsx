import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

  useEffect(() => {
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    const tables = JSON.parse(localStorage.getItem("timetables")) || {};
    setEntries(tables[selectedBatch] || []);
  }, [selectedBatch]);

  const addEntry = () => {
    if (!form.day || !form.subject || !form.start || !form.end) return;

    const updated = [...entries, form];
    setEntries(updated);

    const tables = JSON.parse(localStorage.getItem("timetables")) || {};
    tables[selectedBatch] = updated;
    localStorage.setItem("timetables", JSON.stringify(tables));

    setForm({ day: "", subject: "", start: "", end: "" });
    setToast("📅 Timetable updated successfully");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="max-w-5xl space-y-6 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/batches")}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="text-2xl font-bold">Batch Timetable</h2>
          <p className="text-sm text-gray-600">
            Manage batch schedules and time slots
          </p>
        </div>
      </div>

      <GlassCard>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white/70 border"
        >
          <option value="">-- Select Batch --</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {selectedBatch && (
          <>
            <div className="grid md:grid-cols-4 gap-3 mb-4">
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="p-3 rounded-xl bg-white/70 border"
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
                className="p-3 rounded-xl bg-white/70 border"
              />

              <input
                type="time"
                value={form.start}
                onChange={(e) =>
                  setForm({ ...form, start: e.target.value })
                }
                className="p-3 rounded-xl bg-white/70 border"
              />

              <input
                type="time"
                value={form.end}
                onChange={(e) =>
                  setForm({ ...form, end: e.target.value })
                }
                className="p-3 rounded-xl bg-white/70 border"
              />
            </div>

            <button
              onClick={addEntry}
              className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700
                text-white font-semibold"
            >
              Add Slot
            </button>

            <div className="mt-6 space-y-2">
              {entries.map((e, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-white/60 p-3 rounded-xl"
                >
                  <span>{e.day}</span>
                  <span>{e.subject}</span>
                  <span>
                    {e.start} - {e.end}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </GlassCard>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

const GlassCard = ({ children }) => (
  <div className="bg-white/40 backdrop-blur-[24px] border border-white/40 rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
    {children}
  </div>
);
