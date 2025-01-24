const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// const getAllDesa = async () => {
//   return await prisma.desa.findMany();
// };

const getAllDesa = async (kabupatenFilter = null) => {
  // Jika kabupatenFilter tidak diberikan, gunakan filter default
  const filter = kabupatenFilter || ["KAB. KULON PROGO", "KAB. SLEMAN", "KAB. BANTUL", "KOTA YOGYAKARTA", "KAB. GUNUNGKIDUL"];

  return await prisma.desa.findMany({
    where: {
      kabupaten: {
        in: filter, // Filter desa berdasarkan kabupaten yang ada di parameter URL atau default
      },
    },
  });
};

const createDesa = async (data) => {
  const { tahun_pembentukan, ...rest } = data;

  return await prisma.desa.create({
    data: {
      ...rest,
      tahun_pembentukan: new Date(tahun_pembentukan),
    },
  });
};

const getDesaById = async (id) => {
  return await prisma.desa.findUnique({
    where: { id: parseInt(id) },
  });
};

// Fetch all notulensi for a specific desa
const getNotulensiByDesaId = async (desaId) => {
  return await prisma.notulensi.findMany({
    where: { desaId: parseInt(desaId) },
  });
};

// Fetch all galeri images for a specific desa
const getGaleriByDesaId = async (desaId) => {
  return await prisma.galeri.findMany({
    where: { desaId: parseInt(desaId) },
  });
};

const updateDesa = async (id, data) => {
  const { tahun_pembentukan, ...rest } = data;

  return await prisma.desa.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      tahun_pembentukan: tahun_pembentukan ? new Date(tahun_pembentukan) : undefined,
    },
  });
};

const deleteDesa = async (id) => {
  return await prisma.desa.delete({
    where: { id: parseInt(id) },
  });
};

const addImageToGaleri = async (desaId, imagePath) => {
  return await prisma.galeri.create({
    data: {
      desaId: parseInt(desaId),
      gambar: imagePath,
    },
  });
};

// Menghapus gambar dari galeri desa
const deleteImageFromGaleri = async (id) => {
  const galeriImage = await prisma.galeri.findUnique({
    where: { id: parseInt(id) },
  });

  if (!galeriImage) {
    throw new Error("Gambar tidak ditemukan");
  }

  // Hapus file dari server (pastikan path gambar sudah benar)
  const filePath = path.join(__dirname, "uploads", galeriImage.gambar); // Pastikan path file sesuai
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Hapus file dari server
  }

  // Hapus data galeri dari database
  return await prisma.galeri.delete({
    where: { id: parseInt(id) },
  });
};

// Menambahkan file notulensi ke desa
const addFileNotulensi = async (desaId, filePath, catatan) => {
  return await prisma.notulensi.create({
    data: {
      desaId: parseInt(desaId),
      file: filePath,
      catatan: catatan,
    },
  });
};

// Menghapus file notulensi
const deleteFileNotulensi = async (id) => {
  const notulensiFile = await prisma.notulensi.findUnique({
    where: { id: parseInt(id) },
  });

  if (!notulensiFile) {
    throw new Error("File notulensi tidak ditemukan");
  }

  // Hapus file dari server (pastikan path file sesuai)
  const filePath = path.join(__dirname, "uploads", notulensiFile.file); // Pastikan path file sesuai
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Hapus file dari server
  }

  // Hapus data notulensi dari database
  return await prisma.notulensi.delete({
    where: { id: parseInt(id) },
  });
};

const countByKabupatenAndKategori = async (kabupaten, kategori) => {
  const kabupatenFormatted = kabupaten === "YOGYAKARTA" ? "KOTA YOGYAKARTA" : `KAB. ${kabupaten}`;
  const allDesa = await prisma.desa.findMany({
    where: {
      kategori: kategori,
    },
  });
  return allDesa.filter((desa) => desa.kabupaten.toLowerCase().startsWith(kabupatenFormatted.toLowerCase())).length;
};

// Metode spesifik berdasarkan permintaan
const countSlemanMaju = async () => {
  return await countByKabupatenAndKategori("SLEMAN", "Maju");
};

const countSlemanBerkembang = async () => {
  return await countByKabupatenAndKategori("SLEMAN", "Berkembang");
};

const countSlemanTumbuh = async () => {
  return await countByKabupatenAndKategori("SLEMAN", "Tumbuh");
};

const countBantulMaju = async () => {
  return await countByKabupatenAndKategori("BANTUL", "Maju");
};

const countBantulBerkembang = async () => {
  return await countByKabupatenAndKategori("BANTUL", "Berkembang");
};

const countBantulTumbuh = async () => {
  return await countByKabupatenAndKategori("BANTUL", "Tumbuh");
};

const countKulonProgoMaju = async () => {
  return await countByKabupatenAndKategori("KULON PROGO", "Maju");
};

const countKulonProgoBerkembang = async () => {
  return await countByKabupatenAndKategori("KULON PROGO", "Berkembang");
};

const countKulonProgoTumbuh = async () => {
  return await countByKabupatenAndKategori("KULON PROGO", "Tumbuh");
};

const countGunungKidulMaju = async () => {
  return await countByKabupatenAndKategori("GUNUNGKIDUL", "Maju");
};

const countGunungKidulBerkembang = async () => {
  return await countByKabupatenAndKategori("GUNUNGKIDUL", "Berkembang");
};

const countGunungKidulTumbuh = async () => {
  return await countByKabupatenAndKategori("GUNUNGKIDUL", "Tumbuh");
};

const countYogyakartaMaju = async () => {
  return await countByKabupatenAndKategori("YOGYAKARTA", "Maju");
};

const countYogyakartaBerkembang = async () => {
  return await countByKabupatenAndKategori("YOGYAKARTA", "Berkembang");
};

const countYogyakartaTumbuh = async () => {
  return await countByKabupatenAndKategori("YOGYAKARTA", "Tumbuh");
};

const countMaju = async () => {
  return Desa.countDocuments({ kategori: "Maju" }); // Gunakan MongoDB atau ORM yang sesuai
};

const countBerkembang = async () => {
  return Desa.countDocuments({ kategori: "Berkembang" });
};

const countTumbuh = async () => {
  return Desa.countDocuments({ kategori: "Tumbuh" });
};

const countDesaByKategori = async (kategori) => {
  return await prisma.desa.count({
    where: { kategori: kategori },
  });
};

// Fungsi untuk menghitung jumlah semua desa dengan kategori "Maju"
const countAllDesaMaju = async () => {
  return await countDesaByKategori("Maju");
};

// Fungsi untuk menghitung jumlah semua desa dengan kategori "Berkembang"
const countAllDesaBerkembang = async () => {
  return await countDesaByKategori("Berkembang");
};

// Fungsi untuk menghitung jumlah semua desa dengan kategori "Tumbuh"
const countAllDesaTumbuh = async () => {
  return await countDesaByKategori("Tumbuh");
};

// Fungsi untuk menghitung total baris pada tabel kabupaten
// Service - Menambahkan log dan error handling

module.exports = {
  countDesaByKategori,
  countAllDesaMaju,
  countAllDesaBerkembang,
  countAllDesaTumbuh,
  getAllDesa,
  getDesaById,
  createDesa,
  updateDesa,
  deleteDesa,
  addImageToGaleri,
  deleteImageFromGaleri,
  addFileNotulensi,
  deleteFileNotulensi,
  getNotulensiByDesaId,
  getGaleriByDesaId,
  countByKabupatenAndKategori,
  countSlemanMaju,
  countSlemanBerkembang,
  countSlemanTumbuh,
  countBantulMaju,
  countBantulBerkembang,
  countBantulTumbuh,
  countKulonProgoMaju,
  countKulonProgoBerkembang,
  countKulonProgoTumbuh,
  countGunungKidulMaju,
  countGunungKidulBerkembang,
  countGunungKidulTumbuh,
  countYogyakartaMaju,
  countYogyakartaBerkembang,
  countYogyakartaTumbuh,
  countMaju,
  countTumbuh,
  countBerkembang,
};
