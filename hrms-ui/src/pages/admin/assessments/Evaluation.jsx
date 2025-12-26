import { useState } from "react";

export default function Evaluation() {
  const questions = [
    {
      id: 1,
      question: "Explain Virtual DOM",
      maxMarks: 10,
      answer:
        "Virtual DOM is a lightweight copy of the real DOM used by React to improve performance...",
    },
    {
      id: 2,
      question: "What are React Hooks?",
      maxMarks: 10,
      answer:
        "Hooks are functions that let you use state and lifecycle features in functional components.",
    },
  ];

  const [evaluations, setEvaluations] = useState(
    questions.map((q) => ({
      questionId: q.id,
      marks: "",
      feedback: "",
    }))
  );

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (index, key, value) => {
    const updated = [...evaluations];
    updated[index][key] = value;
    setEvaluations(updated);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    questions.forEach((q, i) => {
      const marks = Number(evaluations[i].marks);
      if (marks === "" || isNaN(marks))
        e[i] = "Marks required";
      else if (marks < 0 || marks > q.maxMarks)
        e[i] = `Marks must be between 0 and ${q.maxMarks}`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const totalObtained = evaluations.reduce(
    (sum, e) => sum + Number(e.marks || 0),
    0
  );
  const totalMax = questions.reduce((sum, q) => sum + q.maxMarks, 0);

  const handleSubmit = () => {
    if (!validate()) return;

    console.log("EVALUATION RESULT", evaluations);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Evaluation
        </h1>
        <p className="text-sm text-gray-500">
          Review answers and submit marks
        </p>
      </div>

      {/* SUCCESS */}
      {submitted && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✅ Evaluation submitted successfully
        </div>
      )}

      {/* QUESTIONS */}
      <div className="space-y-5">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow"
          >
            <h2 className="font-semibold text-gray-800">
              Q{index + 1}. {q.question}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Max Marks: {q.maxMarks}
            </p>

            <p className="text-sm text-gray-700 mt-3">
              {q.answer}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  type="number"
                  placeholder="Marks"
                  value={evaluations[index].marks}
                  onChange={(e) =>
                    update(index, "marks", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/70 border outline-none
                  ${
                    errors[index]
                      ? "border-red-400"
                      : "focus:ring-2 focus:ring-purple-300"
                  }`}
                />
                {errors[index] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[index]}
                  </p>
                )}
              </div>

              <textarea
                rows="2"
                placeholder="Feedback (optional)"
                value={evaluations[index].feedback}
                onChange={(e) =>
                  update(index, "feedback", e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="bg-white/70 backdrop-blur border rounded-xl p-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total Score:
          <span className="font-semibold text-gray-800 ml-1">
            {totalObtained} / {totalMax}
          </span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            totalObtained >= totalMax * 0.4
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {totalObtained >= totalMax * 0.4 ? "Pass" : "Fail"}
        </span>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-full
          bg-purple-600 hover:bg-purple-700
          text-white font-semibold shadow transition"
        >
          Submit Evaluation
        </button>
      </div>
    </div>
  );
}
