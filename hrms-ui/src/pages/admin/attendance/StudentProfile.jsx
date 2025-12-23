import { useParams } from "react-router-dom";

export default function StudentProfile() {
  const { id } = useParams();
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const student = users.students.find((s) => String(s.id) === id);

  const attendance = JSON.parse(localStorage.getItem("attendance")) || {};

  const records = [];

  Object.entries(attendance).forEach(([date, batches]) => {
    Object.values(batches).forEach((batch) => {
      if (batch[id]) {
        records.push({
          date,
          status: batch[id],
        });
      }
    });
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold">{student.name}</h2>
      <p>{student.email}</p>

      <table className="w-full text-sm mt-6">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} className="border-t">
              <td>{r.date}</td>
              <td
                className={
                  r.status === "Present"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
