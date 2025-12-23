export default function CreateAssessment() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold mb-6">Create Assessment</h1>

      <div className="grid grid-cols-2 gap-4">
        <input className="input" placeholder="Assessment Title" />
        <select className="input"><option>Type</option></select>
        <select className="input"><option>Course</option></select>
        <select className="input"><option>Batch</option></select>
        <input className="input" placeholder="Year" />
        <input type="number" className="input" placeholder="Duration (mins)" />
        <input type="number" className="input" placeholder="Total Marks" />
        <input type="number" className="input" placeholder="Pass Marks" />
        <input type="datetime-local" className="input col-span-2" />
      </div>

      <button className="btn-primary mt-6">
        Save & Add Questions
      </button>
    </div>
  );
}
