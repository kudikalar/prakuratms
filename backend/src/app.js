import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

/* ================= LOAD ENV (MUST BE FIRST) ================= */
dotenv.config();

/* ================= APP INIT ================= */
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "*", // adjust later for prod
    credentials: true,
  })
);

app.use(express.json());

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    jwtLoaded: !!process.env.JWT_SECRET,
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 UNHANDLED ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

export default app;
