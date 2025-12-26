import { useState } from "react";

export default function CreateAssessment() {
  const [form, setForm] = useState({
    title: "",
    type: "",
    course: "",
    batch: "",
    year: "",
    mode: "",
    duration: "",
    totalMarks: "",
    passMarks: "",
    attempts: "",
    startDate: "",
    resultVisibility: "",
    status: "Draft",
    negativeMarking: false,
    shuffle: false,
    instructions: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: null });
  };

  const validate = () => {
    const e = {};

    if (!form.title) e.title = "Assessment title is required";
    if (!form.type) e.type = "Assessment type is required";
    if (!form.course) e.course = "Course is required";
    if (!form.batch) e.batch = "Batch is required";
    if (!form.year) e.year = "Academic year is required";
    if (!form.duration || form.duration <= 0)
      e.duration = "Valid duration is required";
    if (!form.totalMarks || form.totalMarks <= 0)
      e.totalMarks = "Total marks required";
    if (
      !form.passMarks ||
      Number(form.passMarks) > Number(form.totalMarks)
    )
      e.passMarks = "Pass marks must be ≤ total marks";
    if (!form.startDate) e.startDate = "Start date & time required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    setSuccess(false);

    if (!validate()) return;

    // 🔗 API integration ready
    console.log("ASSESSMENT DATA", form);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Create Assessment
        </h1>
        <p className="text-sm text-gray-500">
          Configure assessment details, rules, and schedule
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✅ Assessment saved successfully. You can now add questions.
        </div>
      )}

      {/* FORM */}
      <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-6 shadow space-y-6">
        {/* BASIC INFO */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              error={errors.title}
              placeholder="Assessment Title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />

            <Select
              error={errors.type}
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              options={["MCQ", "Descriptive", "Mixed"]}
              label="Assessment Type"
            />

            <Field
              error={errors.course}
              placeholder="Course"
              value={form.course}
              onChange={(e) => update("course", e.target.value)}
            />

            <Field
              error={errors.batch}
              placeholder="Batch"
              value={form.batch}
              onChange={(e) => update("batch", e.target.value)}
            />

            <Field
              error={errors.year}
              placeholder="Academic Year (e.g. 2025)"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
            />

            <Select
              value={form.mode}
              onChange={(e) => update("mode", e.target.value)}
              options={["Online", "Offline"]}
              label="Assessment Mode"
            />
          </div>
        </section>

        {/* MARKS */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3">
            Marks & Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              error={errors.duration}
              placeholder="Duration (minutes)"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
            />

            <NumberField
              error={errors.totalMarks}
              placeholder="Total Marks"
              value={form.totalMarks}
              onChange={(e) => update("totalMarks", e.target.value)}
            />

            <NumberField
              error={errors.passMarks}
              placeholder="Pass Marks"
              value={form.passMarks}
              onChange={(e) => update("passMarks", e.target.value)}
            />

            <NumberField
              placeholder="Attempts Allowed"
              value={form.attempts}
              onChange={(e) => update("attempts", e.target.value)}
            />
          </div>

          <div className="flex gap-6 mt-4 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.negativeMarking}
                onChange={(e) =>
                  update("negativeMarking", e.target.checked)
                }
                className="accent-purple-600"
              />
              Negative Marking
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.shuffle}
                onChange={(e) => update("shuffle", e.target.checked)}
                className="accent-purple-600"
              />
              Shuffle Questions
            </label>
          </div>
        </section>

        {/* SCHEDULE */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3">
            Schedule & Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              type="datetime-local"
              error={errors.startDate}
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />

            <Select
              value={form.resultVisibility}
              onChange={(e) =>
                update("resultVisibility", e.target.value)
              }
              options={["Immediate", "After Evaluation"]}
              label="Result Visibility"
            />
          </div>
        </section>

        {/* INSTRUCTIONS */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3">
            Instructions
          </h2>

          <textarea
            rows="4"
            value={form.instructions}
            onChange={(e) => update("instructions", e.target.value)}
            placeholder="Assessment instructions for students..."
            className="w-full px-4 py-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
          />
        </section>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full
            bg-purple-600 hover:bg-purple-700
            text-white font-semibold shadow transition"
          >
            Save & Add Questions
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE FIELDS ---------- */

function Field({ error, ...props }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl bg-white/70 border outline-none
        ${error ? "border-red-400" : "focus:ring-2 focus:ring-purple-300"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function NumberField(props) {
  return <Field type="number" {...props} />;
}

function Select({ label, options, error, ...props }) {
  return (
    <div>
      <select
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl bg-white/70 border outline-none
        ${error ? "border-red-400" : "focus:ring-2 focus:ring-purple-300"}`}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
