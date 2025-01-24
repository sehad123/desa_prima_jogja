const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json({ name: user.name, nip: user.nip, role: user.role });
  } catch (error) {
    res.status(401).json({ error: "Token tidak valid" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password salah" });
    }

    // Membuat token tanpa email
    const token = jwt.sign({ id: user.id, role: user.role, nip: user.nip }, "secretKey", { expiresIn: "1h" });

    // Mengirimkan token, email, dan role secara terpisah
    res.json({ token, email: user.email, role: user.role, nip: user.nip });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role, nip } = req.body;

  // Validasi input
  if (!name || !email || !password || !role || !nip) {
    return res.status(400).json({ error: "Semua field wajib diisi." });
  }
  if (typeof nip !== "number" || nip <= 0) {
    return res.status(400).json({ error: "NIP harus berupa angka positif." });
  }

  try {
    // Periksa apakah email sudah digunakan
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email sudah terdaftar. Gunakan email lain." });
    }

    // Hash password dan buat user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, nip },
    });

    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (error) {
    console.error("Error di backend:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

module.exports = router;
