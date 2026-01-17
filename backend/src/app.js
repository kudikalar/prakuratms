import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/* ================= ROUTES ================= */
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import studentRoutes from "./routes/student.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";

/* ================= LOAD ENV ================= */
dotenv.config();

/* ================= APP INIT ================= */
const app = express();

/* ================= CORS (CRITICAL FIX) ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // dev
      "http://localhost:3000", // alt dev
      // "https://yourdomain.com" // prod
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ REQUIRED FOR DELETE / PUT */
app.options("*", cors());

/* ================= BODY PARSERS ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    jwtLoaded: Boolean(process.env.JWT_SECRET),
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* ================= ROUTES ================= */

/* 🔐 AUTH */
app.use("/api/auth", authRoutes);

/* 👨‍🎓 STUDENTS */
app.use("/api/student", studentRoutes);

/* 📚 COURSES */
app.use("/api/courses", courseRoutes);

/* 💰 PAYMENTS */
app.use("/api/payments", paymentsRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    path: req.originalUrl,
    message: "API endpoint not found",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 UNHANDLED ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
