export default function ReceiptUpload() {
  return (
    <div className="border border-dashed rounded-lg p-4 text-center">
      <p className="text-sm text-slate-500 mb-2">
        Upload Payment Receipt
      </p>
      <input type="file" className="text-sm" />
    </div>
  );
}
