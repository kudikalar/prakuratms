import { create } from "zustand";

/*
  USER STRUCTURE EXPECTED IN localStorage:

  user = {
    id,
    name,
    email,
    role: "ADMIN" | "EDUCATOR" | "STUDENT" | "FINANCE" | "COUNSELLOR",
    plan?: string
  }

  token = "jwt-token-string"
*/

export const useAuthStore = create((set) => ({
  /* ================= STATE ================= */
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),

  /* Optional (for landing / pricing) */
  hasSubscription: !!JSON.parse(localStorage.getItem("user"))?.plan,
  plan: JSON.parse(localStorage.getItem("user"))?.plan || null,

  /* ================= ACTIONS ================= */

  login: ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    set({
      user,
      token,
      hasSubscription: !!user?.plan,
      plan: user?.plan || null,
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      hasSubscription: false,
      plan: null,
    });
  },

  /* ================= HELPERS ================= */

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  hasRole: (roles = []) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.role) return false;
    return roles.includes(user.role.toUpperCase());
  },
}));
