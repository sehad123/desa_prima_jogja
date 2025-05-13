const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  getUserProfile,
  deleteUser,
  changePassword,
} = require("../service/userService");

const router = express.Router();
// server.js atau controller Anda
const nodemailer = require("nodemailer");

// Setup transporter (sesuaikan dengan SMTP Anda)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "ilmaadien@gmail.com", // Gunakan environment variable
    pass: process.env.EMAIL_PASSWORD || "2022Agustus22", // Gunakan environment variable
  },
});

router.get("/list", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/list/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Create a new user
router.post("/users/list", async (req, res) => {
  try {
    // Validasi awal di route handler
    if (!req.body.name && !req.body.email && !req.body.role) {
      return res.status(400).json({ error: "Nama, email, dan role wajib diisi" });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: "Nama harus diisi" });
    }

    if (!req.body.email) {
      return res.status(400).json({ error: "Email harus diisi" });
    }

    if (!req.body.role) {
      return res.status(400).json({ error: "Role harus diisi" });
    }

    // Jika role Ketua Forum, pastikan kabupatenId ada
    if (req.body.role === "Ketua Forum" && !req.body.kabupatenId) {
      return res.status(400).json({ error: "Kabupaten harus dipilih untuk Ketua Forum" });
    }

    const result = await createUser({
      ...req.body,
      // Pastikan nip dikirim sebagai null jika kosong atau string kosong
      nip: req.body.nip || null
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in user creation route:", error);
    
    // Handle Prisma error khusus
    if (error.code === 'P2011') {
      return res.status(400).json({ 
        error: "Data tidak valid",
        details: "Kabupaten harus dipilih untuk Ketua Forum" 
      });
    }

    res.status(error.status || 500).json({
      error: error.message || "Terjadi kesalahan saat membuat user",
      ...(error.details && { details: error.details }),
    });
  }
});

router.put("/users/list/:id", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details })
    });
  }
});

router.delete("/list/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await deleteUser(userId);
    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal menghapus user", details: error.message });
  }
});

// ==================== GET PROFILE ====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Ambil token dari header

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token tidak valid" });
    }
    req.user = user; // Simpan data user di request
    next();
  });
};

// Gunakan middleware di endpoint yang memerlukan autentikasi
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// ==================== CHANGE PASSWORD ====================
const authMiddleware = async (req, res, next) => {
  // Izinkan preflight request
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Token tidak ditemukan" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User tidak ditemukan"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      error: "Autentikasi gagal",
      details: error.message
    });
  }
};

router.post("/password", authMiddleware, async (req, res) => {
  const { current_password, new_password, new_password_confirmation } = req.body;
  const userId = req.user.id;

  try {
    // Validasi input lebih ketat
    if (!current_password || !new_password || !new_password_confirmation) {
      return res.status(400).json({ 
        success: false,
        error: "Semua field harus diisi",
        fields: {
          current_password: !current_password,
          new_password: !new_password,
          new_password_confirmation: !new_password_confirmation
        }
      });
    }

    if (new_password !== new_password_confirmation) {
      return res.status(400).json({ 
        success: false,
        error: "Password baru dan konfirmasi password tidak sama"
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password baru minimal 8 karakter"
      });
    }

    const result = await changePassword(userId, current_password, new_password);
    
    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(400).json({ 
      success: false,
      error: error.message,
      code: error.code || 'PASSWORD_CHANGE_FAILED'
    });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Email dan password wajib diisi" 
      });
    }

    const { token, user } = await loginUser(email, password);
    
    res.status(200).json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error('Login route error:', error);
    
    const status = error.status || 500;
    const message = error.message || 'Terjadi kesalahan saat login';
    
    res.status(status).json({
      success: false,
      error: message
    });
  }
});

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  let { name, email, password, role, nip } = req.body;

  // Pastikan NIP berupa angka
  nip = parseInt(nip);
  if (!nip || isNaN(nip) || nip <= 0) {
    return res.status(400).json({ error: "NIP tidak valid" });
  }

  // Validasi input
  if (!name || !email || !password || !role || !nip) {
    return res.status(400).json({ error: "Semua field wajib diisi." });
  }

  try {
    // Periksa apakah email sudah digunakan
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email sudah terdaftar. Gunakan email lain." });
    }

    // Hash password dan buat user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        nip,
        // updatedAt: new Date(), // Hapus ini jika tidak ada di Prisma schema
      },
    });

    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// ==================== REGISTER ====================

module.exports = router;
