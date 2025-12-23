export default function Results() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Results</h1>

      <table className="w-full bg-white/60 rounded-xl">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Student</th>
            <th>Score</th>
            <th>Status</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3">Ramesh</td>
            <td>78</td>
            <td className="text-green-600">Pass</td>
            <td>3</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
