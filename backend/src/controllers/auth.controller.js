import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= HELPERS ================= */

const signAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const signRefreshToken = (user) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET not configured");
  }

  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/* ================= LOGIN ================= */

const loginByRole = async (req, res, expectedRole) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
      role: expectedRole,
      isActive: true,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: "Password not loaded from database",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

/* ROLE-BASED LOGIN EXPORTS */
export const adminLogin = (req, res) =>
  loginByRole(req, res, "ADMIN");

export const educatorLogin = (req, res) =>
  loginByRole(req, res, "EDUCATOR");

export const studentLogin = (req, res) =>
  loginByRole(req, res, "STUDENT");

/* ================= CREATE USERS ================= */

const createUserByRole = async (req, res, role) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("🔥 CREATE USER ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

/* ROLE-BASED CREATE EXPORTS */
export const createAdmin = (req, res) =>
  createUserByRole(req, res, "ADMIN");

export const createEducator = (req, res) =>
  createUserByRole(req, res, "EDUCATOR");

export const createStudent = (req, res) =>
  createUserByRole(req, res, "STUDENT");
