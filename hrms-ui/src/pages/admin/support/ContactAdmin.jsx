import { useState } from "react";

export default function ContactAdmin() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!message) return;
    console.log("MESSAGE TO ADMIN:", message);
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Contact Admin
        </h1>
        <p className="text-sm text-gray-500">
          Send a direct message to admin
        </p>
      </div>

      {sent && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✅ Message sent successfully
        </div>
      )}

      <textarea
        rows="4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your issue..."
        className="w-full px-4 py-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
      />

      <button
        onClick={submit}
        className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
      >
        Send Message
      </button>
    </div>
  );
}
