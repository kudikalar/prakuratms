export default function AssessmentsDashboard() {
  const assessments = [
    {
      id: 1,
      title: "React Final Test",
      course: "Full Stack React",
      batch: "FSR-B12",
      year: "2025",
      status: "Scheduled",
      totalMarks: 100,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Assessments</h1>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <select className="input">Course</select>
        <select className="input">Batch</select>
        <select className="input">Year</select>
        <select className="input">Status</select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="bg-white/60 backdrop-blur-lg rounded-xl p-4 border"
          >
            <h2 className="font-medium">{a.title}</h2>
            <p className="text-sm text-gray-600">{a.course}</p>

            <div className="flex justify-between mt-3 text-sm">
              <span>{a.batch}</span>
              <span className="text-purple-600">{a.status}</span>
            </div>

            <button className="mt-4 btn-primary w-full">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
