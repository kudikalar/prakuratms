import { useState } from "react";

export default function PPTUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadPPT = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("ppt", file);

    await fetch("/api/upload-ppt", {
      method: "POST",
      body: formData,
    });

    alert("PPT uploaded & converted successfully");
    setUploading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-bold mb-3">Upload PPT</h2>

      <input
        type="file"
        accept=".ppt,.pptx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadPPT}
        disabled={uploading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload & Convert"}
      </button>
    </div>
  );
}
