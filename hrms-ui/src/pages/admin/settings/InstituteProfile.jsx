import { useEffect, useState } from "react";
import Toast from "../../../components/Toast";

/* ================= DEFAULT STATE ================= */
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
  const [errors, setErrors] = useState({});

  /* ================= LOAD ================= */
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("instituteProfile")
      );
      if (saved) setProfile(saved);
    } catch {
      /* silent fail */
    }
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};

    if (!profile.name.trim())
      e.name = "Institute name is required";
    if (!profile.email.trim())
      e.email = "Email is required";
    if (!profile.phone.trim())
      e.phone = "Phone number is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SAVE ================= */
  const saveProfile = () => {
    if (!validate()) {
      setToast("⚠️ Please fix the highlighted errors");
      return;
    }

    localStorage.setItem(
      "instituteProfile",
      JSON.stringify(profile)
    );
    setToast("✅ Institute profile saved successfully");
  };

  /* ================= CLEAR ================= */
  const clearProfile = () => {
    setProfile(defaultProfile);
    setErrors({});
    localStorage.removeItem("instituteProfile");
    setToast("🧹 Form cleared");
  };

  /* ================= LOGO UPLOAD ================= */
  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setProfile((p) => ({ ...p, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-2 md:px-0">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
          Institute Profile
        </h2>
        <p className="text-sm text-slate-500">
          Manage institute details & official information
        </p>
      </div>

      {/* ================= LOGO ================= */}
      <StudentCard title="Institute Logo">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-xl border bg-white/70 flex items-center justify-center overflow-hidden">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="Institute Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-slate-400 text-sm">
                No Logo
              </span>
            )}
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogo}
            />
            <span className="px-4 py-2 rounded-xl bg-purple-600 text-white shadow hover:bg-purple-700">
              Upload Logo
            </span>
          </label>
        </div>
      </StudentCard>

      {/* ================= BASIC INFO ================= */}
      <StudentCard title="Basic Information">
        <Grid2>
          <Input
            label="Institute Name *"
            value={profile.name}
            error={errors.name}
            onChange={(v) =>
              setProfile({ ...profile, name: v })
            }
          />
          <Input
            label="Institute Code"
            value={profile.code}
            onChange={(v) =>
              setProfile({ ...profile, code: v })
            }
          />
          <Input
            label="Email *"
            value={profile.email}
            error={errors.email}
            onChange={(v) =>
              setProfile({ ...profile, email: v })
            }
          />
          <Input
            label="Phone *"
            value={profile.phone}
            error={errors.phone}
            onChange={(v) =>
              setProfile({ ...profile, phone: v })
            }
          />
          <Input
            label="Website"
            value={profile.website}
            onChange={(v) =>
              setProfile({ ...profile, website: v })
            }
          />
        </Grid2>
      </StudentCard>

      {/* ================= ADDRESS ================= */}
      <StudentCard title="Address">
        <Grid3>
          <Input
            label="Address"
            value={profile.address}
            onChange={(v) =>
              setProfile({ ...profile, address: v })
            }
          />
          <Input
            label="City"
            value={profile.city}
            onChange={(v) =>
              setProfile({ ...profile, city: v })
            }
          />
          <Input
            label="State"
            value={profile.state}
            onChange={(v) =>
              setProfile({ ...profile, state: v })
            }
          />
          <Input
            label="Pincode"
            value={profile.pincode}
            onChange={(v) =>
              setProfile({ ...profile, pincode: v })
            }
          />
        </Grid3>
      </StudentCard>

      {/* ================= FINANCE ================= */}
      <StudentCard title="Finance & Billing">
        <Grid3>
          <Input
            label="GST Number"
            value={profile.gst}
            onChange={(v) =>
              setProfile({ ...profile, gst: v })
            }
          />
          <Input
            label="Bank Name"
            value={profile.bankName}
            onChange={(v) =>
              setProfile({ ...profile, bankName: v })
            }
          />
          <Input
            label="Account Number"
            value={profile.accountNo}
            onChange={(v) =>
              setProfile({ ...profile, accountNo: v })
            }
          />
          <Input
            label="IFSC Code"
            value={profile.ifsc}
            onChange={(v) =>
              setProfile({ ...profile, ifsc: v })
            }
          />
          <Input
            label="UPI ID"
            value={profile.upi}
            onChange={(v) =>
              setProfile({ ...profile, upi: v })
            }
          />
        </Grid3>
      </StudentCard>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={clearProfile}
          className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300"
        >
          Clear
        </button>

        <button
          onClick={saveProfile}
          className="px-6 py-2 rounded-xl bg-purple-600 text-white shadow hover:bg-purple-700"
        >
          Save Changes
        </button>
      </div>

      <Toast
        show={!!toast}
        message={toast}
        onClose={() => setToast("")}
      />
    </div>
  );
}

/* ================= STUDENT-STYLE UI ================= */

const StudentCard = ({ title, children }) => (
  <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm space-y-4">
    {title && (
      <h3 className="font-semibold text-slate-700">
        {title}
      </h3>
    )}
    {children}
  </div>
);

/* FIXED GRIDS (TAILWIND SAFE) */
const Grid2 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {children}
  </div>
);

const Grid3 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {children}
  </div>
);

const Input = ({ label, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="text-sm text-slate-500">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-xl bg-white/70 border
        ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-white/50 focus:ring-purple-400"
        }
        focus:ring-2 outline-none`}
    />
    {error && (
      <p className="text-xs text-red-500">{error}</p>
    )}
  </div>
);
