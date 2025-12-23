function ForgotModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const sendReset = () => {
    if (!email || !emailRegex.test(email)) {
      setStatus("Please enter a valid registered email address.");
      return;
    }
    setStatus("Password reset link has been sent to your email.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur" onClick={onClose} />

      <div className="relative bg-white rounded-2xl p-6 w-96 shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-red-500">
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
        <p className="text-xs text-slate-500 mb-4">
          Enter your registered email address. We will send you a secure password reset link.
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Registered email"
          className="w-full px-4 py-2 border rounded mb-2 focus:ring-2 focus:ring-purple-400"
        />

        {status && (
          <p className={`text-xs mb-2 ${status.includes("sent") ? "text-emerald-600" : "text-red-500"}`}>
            {status}
          </p>
        )}

        <button
          onClick={sendReset}
          className="w-full py-2 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
