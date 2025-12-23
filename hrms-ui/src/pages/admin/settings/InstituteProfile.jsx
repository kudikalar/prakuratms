import { useEffect, useState } from "react";
import Toast from "../../../components/Toast";

/* ================= DEFAULT ================= */
const defaultProfile = {
  name: "",
  code: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  logo: "",
  gst: "",
  bankName: "",
  accountNo: "",
  ifsc: "",
  upi: "",
};

/* ================= PAGE ================= */
export default function InstituteProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [toast, setToast] = useState("");

  /* LOAD */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("instituteProfile"));
    if (saved) setProfile(saved);
  }, []);

  /* SAVE */
  const saveProfile = () => {
    if (!profile.name || !profile.email || !profile.phone) {
      setToast("⚠️ Institute name, email & phone are required");
      return;
    }

    localStorage.setItem("instituteProfile", JSON.stringify(profile));
    setToast("✅ Institute profile saved successfully");
  };

  /* LOGO */
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setProfile({ ...profile, logo: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Institute Profile</h2>
        <p className="text-slate-500">
          Manage institute details & official information
        </p>
      </div>

      {/* LOGO */}
      <GlassCard>
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-xl border bg-white/60 flex items-center justify-center overflow-hidden">
            {profile.logo ? (
              <img src={profile.logo} alt="logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-slate-400 text-sm">No Logo</span>
            )}
          </div>

          <label className="cursor-pointer">
            <input type="file" hidden accept="image/*" onChange={handleLogo} />
            <span className="px-4 py-2 rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700">
              Upload Logo
            </span>
          </label>
        </div>
      </GlassCard>

      {/* BASIC INFO */}
      <GlassCard title="Basic Information">
        <Grid>
          <Input label="Institute Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <Input label="Institute Code" value={profile.code} onChange={(v) => setProfile({ ...profile, code: v })} />
          <Input label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
          <Input label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          <Input label="Website" value={profile.website} onChange={(v) => setProfile({ ...profile, website: v })} />
        </Grid>
      </GlassCard>

      {/* ADDRESS */}
      <GlassCard title="Address">
        <Grid>
          <Input label="Address" value={profile.address} onChange={(v) => setProfile({ ...profile, address: v })} />
          <Input label="City" value={profile.city} onChange={(v) => setProfile({ ...profile, city: v })} />
          <Input label="State" value={profile.state} onChange={(v) => setProfile({ ...profile, state: v })} />
          <Input label="Pincode" value={profile.pincode} onChange={(v) => setProfile({ ...profile, pincode: v })} />
        </Grid>
      </GlassCard>

      {/* FINANCE */}
      <GlassCard title="Finance & Billing">
        <Grid>
          <Input label="GST Number" value={profile.gst} onChange={(v) => setProfile({ ...profile, gst: v })} />
          <Input label="Bank Name" value={profile.bankName} onChange={(v) => setProfile({ ...profile, bankName: v })} />
          <Input label="Account Number" value={profile.accountNo} onChange={(v) => setProfile({ ...profile, accountNo: v })} />
          <Input label="IFSC Code" value={profile.ifsc} onChange={(v) => setProfile({ ...profile, ifsc: v })} />
          <Input label="UPI ID" value={profile.upi} onChange={(v) => setProfile({ ...profile, upi: v })} />
        </Grid>
      </GlassCard>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          className="px-6 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700"
        >
          Save Changes
        </button>
      </div>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= COMPONENTS ================= */

const GlassCard = ({ title, children }) => (
  <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow p-6 space-y-4">
    {title && <h3 className="font-semibold text-slate-700">{title}</h3>}
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);

const Input = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm text-slate-500">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl bg-white/70 border border-white/50 focus:ring-2 focus:ring-purple-400 outline-none"
    />
  </div>
);
