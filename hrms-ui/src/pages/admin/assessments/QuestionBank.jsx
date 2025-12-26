import { useState } from "react";

export default function QuestionBank() {
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: "",
    difficulty: "",
    type: "MCQ",
  });

  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const validate = () => {
    const e = {};

    if (!form.question) e.question = "Question text is required";
    if (!form.marks || form.marks <= 0)
      e.marks = "Valid marks required";
    if (!form.difficulty) e.difficulty = "Difficulty required";

    if (form.type === "MCQ") {
      if (form.options.some((o) => !o))
        e.options = "All options are required";
      if (!form.correctAnswer)
        e.correctAnswer = "Correct answer required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    setSuccess(false);
    if (!validate()) return;

    const newQuestion = {
      ...form,
      id: Date.now(),
    };

    setQuestions([newQuestion, ...questions]);

    setForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: "",
      difficulty: "",
      type: "MCQ",
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Question Bank
        </h1>
        <p className="text-sm text-gray-500">
          Create and manage assessment questions
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✅ Question added successfully
        </div>
      )}

      {/* ADD QUESTION */}
      <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-6 shadow space-y-4">
        {/* QUESTION */}
        <div>
          <textarea
            rows="3"
            value={form.question}
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
            placeholder="Enter question text"
            className={`w-full px-4 py-3 rounded-xl bg-white/70 border outline-none
            ${
              errors.question
                ? "border-red-400"
                : "focus:ring-2 focus:ring-purple-300"
            }`}
          />
          {errors.question && (
            <p className="text-xs text-red-500 mt-1">
              {errors.question}
            </p>
          )}
        </div>

        {/* TYPE + META */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
          >
            <option value="MCQ">MCQ</option>
            <option value="Descriptive">Descriptive</option>
          </select>

          <input
            type="number"
            value={form.marks}
            onChange={(e) =>
              setForm({ ...form, marks: e.target.value })
            }
            placeholder="Marks"
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 border outline-none
            ${
              errors.marks
                ? "border-red-400"
                : "focus:ring-2 focus:ring-purple-300"
            }`}
          />

          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({ ...form, difficulty: e.target.value })
            }
            className={`w-full px-4 py-2.5 rounded-xl bg-white/70 border outline-none
            ${
              errors.difficulty
                ? "border-red-400"
                : "focus:ring-2 focus:ring-purple-300"
            }`}
          >
            <option value="">Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* OPTIONS */}
        {form.type === "MCQ" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.options.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) =>
                    updateOption(i, e.target.value)
                  }
                  placeholder={`Option ${String.fromCharCode(
                    65 + i
                  )}`}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
                />
              ))}
            </div>

            <select
              value={form.correctAnswer}
              onChange={(e) =>
                setForm({
                  ...form,
                  correctAnswer: e.target.value,
                })
              }
              className={`w-full px-4 py-2.5 rounded-xl bg-white/70 border outline-none
              ${
                errors.correctAnswer
                  ? "border-red-400"
                  : "focus:ring-2 focus:ring-purple-300"
              }`}
            >
              <option value="">Correct Answer</option>
              {form.options.map(
                (opt, i) =>
                  opt && (
                    <option key={i} value={opt}>
                      Option {String.fromCharCode(65 + i)}
                    </option>
                  )
              )}
            </select>

            {errors.options && (
              <p className="text-xs text-red-500">
                {errors.options}
              </p>
            )}
          </>
        )}

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="px-6 py-2.5 rounded-full
            bg-purple-600 hover:bg-purple-700
            text-white font-semibold shadow transition"
          >
            Add Question
          </button>
        </div>
      </div>

      {/* QUESTION LIST */}
      {questions.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">
            Added Questions
          </h2>

          {questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white/70 backdrop-blur border rounded-xl p-4"
            >
              <p className="font-medium text-gray-800">
                {i + 1}. {q.question}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {q.type} | {q.difficulty} | Marks: {q.marks}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
