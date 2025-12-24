import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * ✅ FORCE HASH ROUTER MODE
 * This prevents 404 errors like:
 * http://localhost:5173/admin/dashboard
 */
(function enforceHashRouter() {
  const { pathname, hash, search } = window.location;

  // If user hits /admin/dashboard or /login directly
  if (!hash || !hash.startsWith("#/")) {
    const newUrl = `/#${pathname}${search}`;
    window.location.replace(newUrl);
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
