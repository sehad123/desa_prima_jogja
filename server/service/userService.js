// userService.js
const jwt = require('jsonwebtoken'); // Tambahkan ini
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendWelcomeEmail } = require('./emailService');

// Fungsi untuk membuat user baru
const createUser = async (userData) => {
  try {
    // Validasi input wajib
    if (!userData.name || !userData.email || !userData.role) {
      throw { status: 400, message: 'Nama, email, dan role wajib diisi' };
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw { status: 400, message: 'Format email tidak valid' };
    }

    // Validasi role
    const validRoles = ['Admin', 'Pegawai', 'Ketua Forum'];
    if (!validRoles.includes(userData.role)) {
      throw { status: 400, message: 'Role tidak valid' };
    }

    // Validasi khusus Ketua Forum
    if (userData.role === 'Ketua Forum') {
      if (!userData.kabupatenId) {
        throw { status: 400, message: 'Kabupaten harus dipilih untuk Ketua Forum' };
      }
      if (isNaN(userData.kabupatenId)) {
        throw { status: 400, message: 'ID Kabupaten tidak valid' };
      }
    }

    // Cek duplikasi email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase().trim() }
    });

    if (existingUser) {
      throw { 
        status: 409, 
        message: 'Email sudah terdaftar',
        existingUserId: existingUser.id 
      };
    }

    // Generate password
    const generatedPassword = userData.password || 
                            Math.random().toString(36).slice(-8) + 'A1!';

    // Hash password
    const hashedPassword = await bcrypt.hash(generatedPassword, 8);

    // Siapkan data untuk Prisma
    const userCreateData = {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      role: userData.role,
      password: hashedPassword,
      nip: userData.nip, // Langsung gunakan nilai yang sudah dinormalisasi (bisa string atau null)
      sendEmail: Boolean(userData.sendEmail)
    };

    // Tambahkan kabupatenId jika role Ketua Forum
    if (userData.role === 'Ketua Forum') {
      userCreateData.kabupatenId = parseInt(userData.kabupatenId);
    }

    // Buat user baru
    const newUser = await prisma.user.create({
      data: userCreateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nip: true,  // Pastikan nip termasuk dalam select
        kabupatenId: true,
        createdAt: true
      }
    });

    // Handle pengiriman email
    if (userData.sendEmail) {
      try {
        await sendWelcomeEmail(newUser.email, newUser.name, generatedPassword);
        return {
          success: true,
          message: 'User berhasil dibuat dan email notifikasi terkirim',
          data: newUser,
          ...(!userData.password && { generatedPassword })
        };
      } catch (emailError) {
        console.error('Gagal mengirim email:', emailError);
        return {
          success: true,
          message: 'User berhasil dibuat tetapi gagal mengirim email',
          data: newUser,
          ...(!userData.password && { generatedPassword })
        };
      }
    }

    return {
      success: true,
      message: 'User berhasil dibuat',
      data: newUser,
      ...(!userData.password && { generatedPassword })
    };

  } catch (error) {
    console.error('Error in createUser:', error);
    
    if (error.code === 'P2011') {
      error.message = 'Data referensi tidak valid';
      error.details = 'Kabupaten yang dipilih tidak valid';
    }
    
    throw error;
  }
};

// Fungsi untuk update user
const updateUser = async (userId, updateData) => {
  try {
    // Validasi input
    if (!updateData.name || !updateData.email || !updateData.role) {
      throw { status: 400, message: 'Nama, email, dan role wajib diisi' };
    }

    // Siapkan data update
    const data = {
      name: updateData.name,
      email: updateData.email,
      role: updateData.role,
      ...(updateData.nip !== undefined && { nip: String(updateData.nip) }),
      ...(updateData.kabupatenId !== undefined && {
        kabupatenId: updateData.role === 'Ketua Forum' 
          ? parseInt(updateData.kabupatenId) 
          : null
      })
    };

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nip: true,
        kabupatenId: true
      }
    });

    return updatedUser;

  } catch (error) {
    console.error('Error in updateUser:', error);
    
    if (error.code === 'P2002') {
      throw { status: 400, message: 'Email sudah digunakan' };
    }
    if (error.code === 'P2025') {
      throw { status: 404, message: 'User tidak ditemukan' };
    }

    throw { status: 500, message: 'Gagal mengupdate user', details: error.message };
  }
};

// Fungsi untuk mendapatkan profil user
const getUserProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        name: true,
        email: true,
        role: true,
        nip: true,
        kabupatenId: true
      }
    });

    if (!user) {
      throw { status: 404, message: 'User tidak ditemukan' };
    }

    return user;

  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw { status: 500, message: 'Terjadi kesalahan pada server' };
  }
};

// Fungsi untuk login user
const loginUser = async (email, password) => {
  try {
    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        Kabupaten: {
          select: {
            nama_kabupaten: true
          }
        }
      }
    });

    if (!user) {
      throw { status: 404, message: "User tidak ditemukan" };
    }

    // 2. Verifikasi password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw { status: 401, message: "Password salah" };
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Siapkan data user untuk response
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      kabupatenId: user.kabupatenId,
      kabupatenName: user.Kabupaten?.nama_kabupaten || null
    };

    return { token, user: userData };

  } catch (error) {
    console.error('Login service error:', error);
    throw error; // Lempar error ke route handler
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get a user by ID
const getUserById = async (userId) => {
  try {
    console.log("User ID:", userId); // Debugging

    if (!userId) {
      throw new Error("User ID is missing");
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Delete a user by ID
const deleteUser = async (userId) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(userId) }
    });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

//change password
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Validasi input
    if (!currentPassword || !newPassword) {
      throw new Error('Current password dan new password harus diisi');
    }

    if (newPassword.length < 8) {
      throw new Error('Password baru minimal 8 karakter');
    }

    // Cari user termasuk password
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Validasi password lama
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Password lama tidak sesuai');
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { password: hashedPassword },
    });

    return { 
      success: true,
      message: 'Password berhasil diubah' 
    };

  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  loginUser,
  changePassword,
};