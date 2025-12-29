import { useState } from "react";
import { useParams } from "react-router-dom";

export default function StudentNotes() {
  const { studentId } = useParams();
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState([]);

  const saveNote = () => {
    setHistory([
      ...history,
      { text: notes, date: new Date().toLocaleString() },
    ]);
    setNotes("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Educator Notes – Student #{studentId}</h1>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="w-full p-4 rounded-xl border"
        placeholder="Add observation or intervention note..."
      />

      <button onClick={saveNote} className="px-4 py-2 bg-indigo-600 text-white rounded">
        Save Note
      </button>

      <div className="space-y-3">
        {history.map((n, i) => (
          <div key={i} className="p-3 bg-white rounded shadow text-sm">
            <p>{n.text}</p>
            <p className="text-xs text-gray-400">{n.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
