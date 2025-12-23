export default function Evaluation() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold mb-4">Evaluation</h1>

      <div className="bg-white/60 p-4 rounded-xl">
        <p className="font-medium">Explain Virtual DOM</p>

        <p className="text-sm mt-2 text-gray-700">
          Student Answer goes here...
        </p>

        <input className="input mt-3" placeholder="Marks" />
        <textarea className="input mt-3" placeholder="Feedback" />

        <button className="btn-primary mt-4">
          Submit Evaluation
        </button>
      </div>
    </div>
  );
}
