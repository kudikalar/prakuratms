import jwt from "jsonwebtoken";

/* ================= AUTH GUARD ================= */

export const protect = (req, res, next) => {
  // 🔍 TEMP DEBUG (keep for now, remove later if you want)
  console.log("🔍 Authorization Header:", req.headers.authorization);

  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization; // extra safety

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing after Bearer",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ JWT VERIFY ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ================= ROLE-BASED ACCESS ================= */

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
