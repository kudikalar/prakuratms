import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * ✅ FORCE CORRECT HASH + BASE ROUTING
 * Handles:
 *  - /admin/dashboard
 *  - /login
 *  - /
 * Converts to:
 *  - /prakuratms/#/admin/dashboard
 */
(function enforceCorrectUrl() {
  const BASE = "/prakuratms";
  const { pathname, hash, search } = window.location;

  // Already correct
  if (pathname.startsWith(BASE) && hash.startsWith("#/")) return;

  // Remove base if duplicated
  const cleanPath = pathname.replace(BASE, "");

  const target = `${BASE}/#${cleanPath || "/login"}${search}`;
  window.location.replace(target);
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
