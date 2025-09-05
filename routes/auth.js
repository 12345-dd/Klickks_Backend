import express from "express";
import bcrypt from "bcrypt";
import dbPromise from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    const db = await dbPromise;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    const db = await dbPromise;
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    req.session.userId = user.id;
    res.json({ message: "Login successful", user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/session", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
