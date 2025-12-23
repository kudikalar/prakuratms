function LegalModal({ title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur" onClick={onClose} />

      <div className="relative bg-white rounded-2xl p-6 w-[520px] max-h-[80vh] overflow-y-auto shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-red-500">
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <p className="text-sm text-slate-600 leading-relaxed space-y-3">
          <span>
            Prakura IT Solutions provides enterprise-grade LMS, TMS, and HRMS platforms designed to
            securely manage learning, training, and organizational operations. By accessing or using
            our systems, users agree to comply with all applicable company policies, security
            standards, and legal regulations.
          </span>
          <br /><br />
          <span>
            Users are responsible for maintaining the confidentiality of their login credentials and
            for all activities conducted through their accounts. Unauthorized access, misuse of data,
            or attempts to compromise system integrity may result in suspension or termination of
            access without prior notice.
          </span>
          <br /><br />
          <span>
            We collect and process personal information solely for authentication, service delivery,
            and platform improvement purposes. Data is never sold to third parties and is handled in
            accordance with applicable data protection laws. Prakura IT Solutions reserves the right
            to update these terms and privacy policies periodically.
          </span>
        </p>
      </div>
    </div>
  );
}
