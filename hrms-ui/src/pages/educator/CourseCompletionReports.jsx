export default function CourseCompletionReports() {
  const courses = [
    { name: "Playwright", completion: 72 },
    { name: "Selenium", completion: 58 },
    { name: "API Testing", completion: 81 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Course Completion Reports</h1>

      {courses.map((c, i) => (
        <div key={i} className="p-4 bg-white/70 rounded-xl shadow">
          <p className="font-semibold">{c.name}</p>
          <div className="h-2 bg-gray-200 rounded overflow-hidden mt-2">
            <div
              className="h-full bg-indigo-600"
              style={{ width: `${c.completion}%` }}
            />
          </div>
          <p className="text-sm mt-1">{c.completion}% Completed</p>
        </div>
      ))}
    </div>
  );
}
