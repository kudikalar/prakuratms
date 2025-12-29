import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBell,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   EDUCATOR – LESSON PLANNER (ENTERPRISE)
===================================================== */

export default function LessonPlanner() {
  const [lessons, setLessons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [success, setSuccess] = useState("");

  /* ================= INIT ================= */

  useEffect(() => {
    setLessons([
      {
        id: 1,
        topic: "Playwright – Locators",
        course: "QA Automation",
        batch: "Batch A",
        date: "2025-01-04",
        duration: "2 hrs",
        status: "PLANNED",
        reminder: true,
        reminderTime: "09:00",
        reminderChannel: "EMAIL",
      },
      {
        id: 2,
        topic: "API Testing – REST Assured",
        course: "QA Automation",
        batch: "Batch B",
        date: "2025-01-03",
        duration: "1.5 hrs",
        status: "COMPLETED",
        reminder: false,
      },
    ]);
  }, []);

  /* ================= KPIs ================= */

  const kpis = useMemo(() => ({
    total: lessons.length,
    planned: lessons.filter(l => l.status === "PLANNED").length,
    completed: lessons.filter(l => l.status === "COMPLETED").length,
    reminders: lessons.filter(l => l.reminder).length,
  }), [lessons]);

  /* ================= SAVE ================= */

  const saveLesson = (lesson) => {
    if (editingLesson) {
      setLessons(prev =>
        prev.map(l => l.id === editingLesson.id ? { ...lesson, id: l.id } : l)
      );
      setSuccess("Lesson updated successfully");
    } else {
      setLessons(prev => [
        ...prev,
        { ...lesson, id: Date.now(), status: "PLANNED" }
      ]);
      setSuccess("Lesson added successfully");
    }

    setEditingLesson(null);
    setModalOpen(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  /* ================= DELETE ================= */

  const deleteLesson = (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  /* ================= DRAG & DROP ================= */

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("lessonId", id);
  };

  const onDrop = (e, date) => {
    const id = Number(e.dataTransfer.getData("lessonId"));
    setLessons(prev =>
      prev.map(l => l.id === id ? { ...l, date } : l)
    );
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lesson Planner</h2>
          <p className="text-sm text-slate-500">Plan, reschedule & manage lessons</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2"
        >
          <FaPlus /> Add Lesson
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total Lessons" value={kpis.total} />
        <Kpi label="Planned" value={kpis.planned} />
        <Kpi label="Completed" value={kpis.completed} />
        <Kpi label="Reminders On" value={kpis.reminders} />
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-3 rounded-xl">
          <FaCheckCircle /> {success}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-2xl border shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-white/80">
            <tr>
              <th className="px-6 py-4 text-left">Topic</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Batch</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Reminder</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lessons.map(l => (
              <tr
                key={l.id}
                draggable
                onDragStart={(e) => onDragStart(e, l.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, l.date)}
                className="border-t hover:bg-white/60"
              >
                <td className="px-6 py-4 font-medium">{l.topic}</td>
                <td className="px-6 py-4 text-center">{l.course}</td>
                <td className="px-6 py-4 text-center">{l.batch}</td>
                <td className="px-6 py-4 text-center">
                  <FaCalendarAlt className="inline mr-1" /> {l.date}
                </td>
                <td className="px-6 py-4 text-center">
                  <FaClock className="inline mr-1" /> {l.duration}
                </td>
                <td className="px-6 py-4 text-center">
                  {l.reminder && <FaBell className="text-amber-500" />}
                </td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button onClick={() => { setEditingLesson(l); setModalOpen(true); }}>
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteLesson(l.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <LessonModal
          initialData={editingLesson}
          onClose={() => { setModalOpen(false); setEditingLesson(null); }}
          onSave={saveLesson}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function LessonModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState(
    initialData || {
      topic: "",
      course: "",
      batch: "",
      date: "",
      duration: "",
      reminder: false,
      reminderTime: "",
      reminderChannel: "EMAIL",
    }
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.topic) e.topic = "Please enter lesson topic";
    if (!form.course) e.course = "Please enter course name";
    if (!form.batch) e.batch = "Please enter batch";
    if (!form.date) e.date = "Please select date";
    if (!form.duration) e.duration = "Please enter duration";
    if (form.reminder && !form.reminderTime)
      e.reminderTime = "Select reminder time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-xl mx-4
          bg-white/85 backdrop-blur-xl
          rounded-3xl shadow-2xl
          border border-white/40
          animate-scaleIn
        "
      >
        {/* HEADER */}
        <div className="px-6 py-5 rounded-t-3xl
          bg-gradient-to-r from-indigo-600 to-purple-600
          text-white"
        >
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit Lesson" : "Add New Lesson"}
          </h3>
          <p className="text-xs opacity-90 mt-1">
            Plan and schedule teaching sessions effectively
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          <Input
            label="Lesson Topic"
            placeholder="Playwright – Locator Strategies"
            value={form.topic}
            error={errors.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />

          <Input
            label="Course"
            placeholder="QA Automation"
            value={form.course}
            error={errors.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />

          <Input
            label="Batch"
            placeholder="Batch A (Jan 2025)"
            value={form.batch}
            error={errors.batch}
            onChange={(e) => setForm({ ...form, batch: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Lesson Date"
              type="date"
              value={form.date}
              error={errors.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Input
              label="Duration"
              placeholder="2 hrs / 90 mins"
              value={form.duration}
              error={errors.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
            />
          </div>

          {/* REMINDER */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.reminder}
                onChange={(e) =>
                  setForm({ ...form, reminder: e.target.checked })
                }
                className="
                  w-4 h-4 rounded
                  border-slate-300
                  text-indigo-600
                  focus:ring-indigo-500
                "
              />
              Enable lesson reminder
            </label>

            {form.reminder && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Reminder Time"
                  type="time"
                  value={form.reminderTime}
                  error={errors.reminderTime}
                  onChange={(e) =>
                    setForm({ ...form, reminderTime: e.target.value })
                  }
                />

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Reminder Channel
                  </label>
                  <select
                    value={form.reminderChannel}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reminderChannel: e.target.value,
                      })
                    }
                    className="
                      mt-1 w-full px-4 py-2.5
                      rounded-xl border
                      bg-white/70
                      focus:ring-2 focus:ring-indigo-400
                    "
                  >
                    <option value="EMAIL">Email Notification</option>
                    <option value="WHATSAPP">WhatsApp Message</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/30">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl
              text-sm font-semibold
              text-slate-600
              hover:bg-black/5
            "
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="
              px-6 py-2 rounded-xl
              bg-gradient-to-r from-indigo-600 to-purple-600
              text-white text-sm font-semibold
              shadow-lg shadow-indigo-500/30
              hover:from-indigo-700 hover:to-purple-700
              transition
            "
          >
            Save Lesson
          </button>
        </div>
      </div>
    </div>
  );
}


/* ================= SMALL ================= */

const Kpi = ({ label, value }) => (
  <div className="bg-white/70 rounded-xl p-4 border shadow text-center">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-medium">{label}</label>
    <input {...props} className="w-full px-4 py-2 rounded-xl border mt-1" />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
