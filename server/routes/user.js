const express = require("express");
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const pool = req.pool;
  try {
    const { username, email, password, avatar } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    await pool.query(
      "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)",
      [username, email, password, avatar || null]
    );

    res.json({ success: true, message: "Register successful" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Register failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const pool = req.pool;
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
