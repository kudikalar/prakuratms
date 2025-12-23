export default function QuestionBank() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold mb-4">Question Bank</h1>

      <div className="bg-white/60 p-4 rounded-xl border mb-4">
        <textarea
          className="input w-full"
          placeholder="Question text"
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <input className="input" placeholder="Option A" />
          <input className="input" placeholder="Option B" />
          <input className="input" placeholder="Option C" />
          <input className="input" placeholder="Option D" />
        </div>

        <select className="input mt-3">
          <option>Correct Answer</option>
        </select>

        <button className="btn-secondary mt-3">
          Add Question
        </button>
      </div>
    </div>
  );
}
