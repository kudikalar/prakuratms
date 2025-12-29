export default function RiskPrediction() {
  const students = [
    { name: "Arjun Patel", progress: 40, attendance: 55, daysInactive: 10 },
  ];

  const score = (s) =>
    Math.round(
      (100 - s.progress) * 0.4 +
      (100 - s.attendance) * 0.4 +
      s.daysInactive * 0.2
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Risk Prediction</h1>

      {students.map((s, i) => (
        <div key={i} className="p-4 bg-white/70 rounded-xl shadow border">
          <p className="font-semibold">{s.name}</p>
          <p className="text-sm">
            Risk Score:{" "}
            <span className="font-bold text-red-600">
              {score(s)}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
