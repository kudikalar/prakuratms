import { useEffect, useState, useMemo } from "react";
import {
  FaGithub,
  FaCalendarDay,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaFilter,
} from "react-icons/fa";

/* =====================================================
   DAILY TASK SUBMISSION & GITHUB PR TRACKER (NEXT LEVEL)
===================================================== */

export default function DailyTaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    date: "",
    task: "",
    hours: "",
    prLink: "",
    prStatus: "Pending Review",
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
        prLink: "https://github.com/org/repo/pull/24",
        prStatus: "Changes Requested",
        prRemarks: "Reduce duplication and improve naming",
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const summary = useMemo(() => {
    const totalHours = tasks.reduce(
      (sum, t) => sum + Number(t.hours || 0),
      0
    );

    const approved = tasks.filter(
      (t) => t.prStatus === "Approved"
    ).length;

    return {
      totalHours,
      totalTasks: tasks.length,
      approved,
    };
  }, [tasks]);

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.prStatus === filter);

  /* ================= HANDLERS ================= */

  const submitTask = () => {
    if (!form.date || !form.task) return;

    setTasks((prev) => [
      {
        id: Date.now(),
        ...form,
        prStatus: form.prLink ? form.prStatus : "Pending Review",
      },
      ...prev,
    ]);

    setForm({
      date: "",
      task: "",
      hours: "",
      prLink: "",
      prStatus: "Pending Review",
      prRemarks: "",
    });
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Daily Task & GitHub Activity
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track daily work, productivity, and PR outcomes
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard label="Total Tasks" value={summary.totalTasks} />
        <SummaryCard label="Hours Logged" value={summary.totalHours} />
        <SummaryCard
          label="PRs Approved"
          value={summary.approved}
          highlight
        />
      </div>

      {/* ADD TASK */}
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
            label="Hours Spent"
            type="number"
            value={form.hours}
            onChange={(v) => setForm({ ...form, hours: v })}
          />

          <Input
            label="GitHub PR Link"
            value={form.prLink}
            onChange={(v) => setForm({ ...form, prLink: v })}
            placeholder="https://github.com/..."
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
          onClick={submitTask}
          className="
            flex items-center gap-2
            px-6 py-2 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold
          "
        >
          <FaPlus />
          Submit Task
        </button>
      </div>

      {/* FILTER */}
      <div className="flex items-center gap-3 text-sm">
        <FaFilter className="text-slate-500" />
        {["All", "Approved", "Changes Requested", "Pending Review"].map(
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

      {/* TASK LIST */}
      <div className="space-y-4">
        {filteredTasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>

      {!filteredTasks.length && (
        <p className="text-center text-sm text-slate-400">
          No tasks found
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const SummaryCard = ({ label, value, highlight }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3
      className={`text-2xl font-bold ${
        highlight ? "text-emerald-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const TaskCard = ({ task }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-slate-800">{task.task}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <FaCalendarDay /> {task.date} • <FaClock /> {task.hours || 0} hrs
        </p>
      </div>
      <PRStatus status={task.prStatus} />
    </div>

    {task.prLink && (
      <a
        href={task.prLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
      >
        <FaGithub />
        View Pull Request
      </a>
    )}

    {task.prRemarks && (
      <div className="text-sm bg-white/80 border rounded-xl p-3">
        <strong>Mentor Review:</strong> {task.prRemarks}
      </div>
    )}
  </div>
);

const PRStatus = ({ status }) => {
  const map = {
    Approved: { icon: <FaCheckCircle />, color: "text-emerald-600" },
    "Changes Requested": {
      icon: <FaExclamationTriangle />,
      color: "text-yellow-600",
    },
    "Pending Review": {
      icon: <FaClock />,
      color: "text-slate-500",
    },
  };

  return (
    <span
      className={`flex items-center gap-2 text-sm font-semibold ${map[status]?.color}`}
    >
      {map[status]?.icon}
      {status}
    </span>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
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
