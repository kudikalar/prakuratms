import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= LOGIN ================= */

const loginByRole = async (req, res, expectedRole) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email,
      role: expectedRole,
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* 👇 THESE EXPORT NAMES MUST MATCH ROUTES 👇 */
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
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* 👇 THESE EXPORT NAMES MUST MATCH ROUTES 👇 */
export const createAdmin = (req, res) =>
  createUserByRole(req, res, "ADMIN");

export const createEducator = (req, res) =>
  createUserByRole(req, res, "EDUCATOR");

export const createStudent = (req, res) =>
  createUserByRole(req, res, "STUDENT");
