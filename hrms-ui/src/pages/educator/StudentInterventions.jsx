export default function StudentInterventions() {
  const alerts = [
    {
      student: "Arjun Patel",
      reason: "Low Attendance",
      action: "Schedule Counseling",
    },
    {
      student: "Ravi Kumar",
      reason: "Low Progress",
      action: "Assign Mentor",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Student Intervention Alerts</h1>

      <div className="space-y-4">
        {alerts.map((a, i) => (
          <div key={i} className="p-4 bg-white/70 rounded-xl shadow border">
            <p className="font-semibold">{a.student}</p>
            <p className="text-sm text-red-600">{a.reason}</p>
            <button className="mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded">
              {a.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
