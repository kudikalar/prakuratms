import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const deleteBatch = () => {
    const updated = batches.filter((b) => b.id !== selectedId);
    setBatches(updated);
    localStorage.setItem("batches", JSON.stringify(updated));
    setShowModal(false);
    setToast("🗑️ Batch deleted successfully");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="space-y-8 text-gray-800">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Batches</h2>
          <p className="text-sm text-gray-600">Manage training batches</p>
        </div>

        <NavLink
          to="/admin/batches/create"
          className="flex items-center gap-2 px-5 py-2.5
            rounded-full bg-purple-600 text-white font-semibold shadow"
        >
          <FaPlus /> Create Batch
        </NavLink>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {batches.map((b) => (
          <GlassCard key={b.id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-sm text-gray-600">
                  {b.course} · {b.startDate}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/admin/batches/create?id=${b.id}`)
                  }
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => confirmDelete(b.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <ConfirmModal
        open={showModal}
        title="Delete Batch"
        message="Are you sure you want to delete this batch?"
        onConfirm={deleteBatch}
        onCancel={() => setShowModal(false)}
      />

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

const GlassCard = ({ children }) => (
  <div className="
    bg-white/40 backdrop-blur-[24px]
    border border-white/40
    rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]
  ">
    {children}
  </div>
);
