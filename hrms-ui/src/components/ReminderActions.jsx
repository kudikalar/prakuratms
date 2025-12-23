export default function ReminderActions({ phone }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => alert(`SMS sent to ${phone}`)}
        className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700"
      >
        Send SMS
      </button>
      <button
        onClick={() => alert(`WhatsApp sent to ${phone}`)}
        className="px-3 py-1 text-xs rounded bg-green-100 text-green-700"
      >
        WhatsApp
      </button>
    </div>
  );
}
