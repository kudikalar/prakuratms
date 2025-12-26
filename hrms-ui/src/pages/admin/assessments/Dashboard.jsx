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
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Assessments
        </h1>
        <p className="text-sm text-gray-500">
          Manage and track student assessments
        </p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <select className="w-full px-4 py-2.5 rounded-xl bg-white/70 backdrop-blur border text-sm focus:ring-2 focus:ring-purple-300 outline-none">
          <option>Course</option>
        </select>

        <select className="w-full px-4 py-2.5 rounded-xl bg-white/70 backdrop-blur border text-sm focus:ring-2 focus:ring-purple-300 outline-none">
          <option>Batch</option>
        </select>

        <select className="w-full px-4 py-2.5 rounded-xl bg-white/70 backdrop-blur border text-sm focus:ring-2 focus:ring-purple-300 outline-none">
          <option>Year</option>
        </select>

        <select className="w-full px-4 py-2.5 rounded-xl bg-white/70 backdrop-blur border text-sm focus:ring-2 focus:ring-purple-300 outline-none">
          <option>Status</option>
        </select>
      </div>

      {/* ASSESSMENT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border shadow hover:shadow-lg transition"
          >
            {/* TITLE */}
            <h2 className="font-semibold text-lg text-gray-800">
              {a.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {a.course}
            </p>

            {/* META */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="text-gray-600">
                <span className="block text-xs text-gray-400">Batch</span>
                {a.batch}
              </div>

              <div className="text-gray-600">
                <span className="block text-xs text-gray-400">Year</span>
                {a.year}
              </div>

              <div className="text-gray-600">
                <span className="block text-xs text-gray-400">
                  Total Marks
                </span>
                {a.totalMarks}
              </div>

              <div>
                <span className="block text-xs text-gray-400">
                  Status
                </span>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    a.status === "Scheduled"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>

            {/* ACTION */}
            <button
              className="mt-5 w-full px-4 py-2.5 rounded-full
              bg-purple-600 hover:bg-purple-700
              text-white font-semibold shadow transition"
            >
              View Assessment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
