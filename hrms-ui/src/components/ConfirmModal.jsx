export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="
        relative z-10 w-full max-w-sm
        bg-white/40 backdrop-blur-[24px]
        border border-white/40
        rounded-3xl p-6
        shadow-[0_30px_90px_rgba(0,0,0,0.3)]
        text-gray-800
      ">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-full
              bg-gray-200 hover:bg-gray-300
              font-semibold
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-full
              bg-red-500 hover:bg-red-600
              text-white font-semibold shadow
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
