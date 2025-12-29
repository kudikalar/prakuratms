import { useEffect, useState, useMemo } from "react";
import {
  FaGithub,
  FaCalendarDay,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaFilter,
  FaCheck,
} from "react-icons/fa";

/* =====================================================
   DAILY TASK SUBMISSION & GITHUB PR TRACKER – ADVANCED
===================================================== */

export default function DailyTaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    task: "",
    hours: "",
    prLink: "",
    prRemarks: "",
  });

  /* ================= INIT ================= */

  useEffect(() => {
    setTasks([
      {
        id: 1,
        date: "2025-01-20",
        task: "Implemented Playwright login tests",
        hours: 5,
        prLink: "https://github.com/org/repo/pull/23",
        prStatus: "Approved",
        prRemarks: "Good locator strategy and assertions",
      },
      {
        id: 2,
        date: "2025-01-21",
        task: "Refactored test framework",
        hours: 4,
        prLink: "",
        prStatus: "Task Only",
        prRemarks: "",
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.prStatus === filter);

  const todayStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter((t) => t.date === today);
    const hours = todayTasks.reduce(
      (sum, t) => sum + Number(t.hours || 0),
      0
    );
    return {
      tasks: todayTasks.length,
      hours,
    };
  }, [tasks]);

  const productivity =
    todayStats.hours >= 6
      ? "High"
      : todayStats.hours >= 3
      ? "Medium"
      : "Low";

  const canSubmit =
    form.task.trim().length > 0 && Number(form.hours) > 0;

  /* ================= HANDLERS ================= */

  const submitTask = () => {
    if (!canSubmit) return;

    const hasPR = form.prLink.trim().length > 0;

    setTasks((prev) => [
      {
        id: Date.now(),
        ...form,
        prStatus: hasPR ? "Pending Review" : "Task Only",
      },
      ...prev,
    ]);

    setForm({
      date: new Date().toISOString().slice(0, 10),
      task: "",
      hours: "",
      prLink: "",
      prRemarks: "",
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow">
          <FaCheck />
          Task submitted successfully
        </div>
      )}

      {/* HEADER */}
      <Header />

      {/* TODAY INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Insight label="Today’s Tasks" value={todayStats.tasks} />
        <Insight label="Hours Logged" value={todayStats.hours} />
        <Insight
          label="Productivity"
          value={productivity}
          highlight
        />
      </div>

      {/* ADD TASK */}
      <Form
        form={form}
        setForm={setForm}
        onSubmit={submitTask}
        canSubmit={canSubmit}
      />

      {/* FILTER */}
      <Filter filter={filter} setFilter={setFilter} />

      {/* TABLE */}
      <TaskTable tasks={filteredTasks} />
    </div>
  );
}

/* =====================================================
   SUB COMPONENTS
===================================================== */

const Header = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
    <h2 className="text-2xl font-semibold text-slate-800">
      Daily Task & GitHub Activity
    </h2>
    <p className="text-sm text-slate-500 mt-1">
      Silent validation • Smart insights • Real productivity
    </p>
  </div>
);

const Insight = ({ label, value, highlight }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3
      className={`text-2xl font-bold ${
        highlight ? "text-indigo-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const Form = ({ form, setForm, onSubmit, canSubmit }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
    <h3 className="font-semibold text-slate-800">
      Submit Today’s Work
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Date"
        type="date"
        value={form.date}
        onChange={(v) => setForm({ ...form, date: v })}
      />
      <Input
        label="Hours"
        type="number"
        value={form.hours}
        onChange={(v) => setForm({ ...form, hours: v })}
      />
      <Input
        label="GitHub PR Link"
        value={form.prLink}
        onChange={(v) => setForm({ ...form, prLink: v })}
      />
    </div>

    <Textarea
      label="Task Description"
      value={form.task}
      onChange={(v) => setForm({ ...form, task: v })}
    />

    <Textarea
      label="PR Review Remarks"
      value={form.prRemarks}
      onChange={(v) => setForm({ ...form, prRemarks: v })}
    />

    <button
      disabled={!canSubmit}
      onClick={onSubmit}
      className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white ${
        canSubmit
          ? "bg-indigo-600 hover:bg-indigo-700"
          : "bg-slate-300 cursor-not-allowed"
      }`}
    >
      <FaPlus />
      Submit Task
    </button>
  </div>
);

const Filter = ({ filter, setFilter }) => (
  <div className="flex items-center gap-3 text-sm">
    <FaFilter className="text-slate-500" />
    {["All", "Approved", "Pending Review", "Task Only"].map(
      (f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 rounded-full border ${
            filter === f
              ? "bg-indigo-600 text-white"
              : "bg-white/70"
          }`}
        >
          {f}
        </button>
      )
    )}
  </div>
);

const TaskTable = ({ tasks }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow border overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-100 sticky top-0">
        <tr>
          <th className="px-6 py-4 text-left">Date</th>
          <th className="px-6 py-4 text-left">Task</th>
          <th className="px-6 py-4 text-center">Hours</th>
          <th className="px-6 py-4 text-center">PR</th>
          <th className="px-6 py-4 text-center">Status</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((t) => (
          <tr key={t.id} className="border-t hover:bg-slate-50">
            <td className="px-6 py-4 flex items-center gap-2">
              <FaCalendarDay className="text-indigo-600" />
              {t.date}
            </td>
            <td className="px-6 py-4 font-medium">{t.task}</td>
            <td className="px-6 py-4 text-center">{t.hours}</td>
            <td className="px-6 py-4 text-center">
              {t.prLink ? (
                <a
                  href={t.prLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  <FaGithub />
                </a>
              ) : (
                "-"
              )}
            </td>
            <td className="px-6 py-4 text-center font-semibold">
              {t.prStatus}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {!tasks.length && (
      <p className="text-center py-6 text-slate-400">
        No tasks found
      </p>
    )}
  </div>
);

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 rounded-xl border bg-white/80"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 rounded-xl border bg-white/80"
    />
  </div>
);
