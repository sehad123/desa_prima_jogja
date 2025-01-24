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

const updateDesaStatus = async (id, status) => {
  return await prisma.desa.update({
    where: { id: Number(id) },
    data: { status }, // Update status saja
  });
};

const updateDesaCatatan = async (id, catatan) => {
  return await prisma.desa.update({
    where: { id: Number(id) },
    data: { catatan }, // Update catatan saja
  });
};

const deleteDesa = async (id) => {
  return await prisma.desa.delete({
    where: { id: parseInt(id) },
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

// Fetch all notulensi for a specific desa
const getProdukByDesaId = async (desaId) => {
  return await prisma.produk.findMany({
    where: { desaId: parseInt(desaId) },
  });
};

// Fetch all notulensi for a specific desa
const getPengurusByDesaId = async (desaId) => {
  return await prisma.pengelola.findMany({
    where: { desaId: parseInt(desaId) },
  });
};

const addProdukDesa = async (desaId, imagePath, nama, harga, deskripsi) => {
  return await prisma.produk.create({
    data: {
      desaId: parseInt(desaId),
      foto: imagePath,
      nama: nama,
      harga: harga,
      deskripsi: deskripsi,
    },
  });
};

const addPengurusDesa = async (desaId, nama, nohp, jabatan) => {
  return await prisma.produk.create({
    data: {
      desaId: parseInt(desaId),
      nama: nama,
      nohp: nohp,
      jabatan: jabatan,
    },
  });
};

const deleteProdukDesa = async (id) => {
  const galeriImage = await prisma.produk.findUnique({
    where: { id: parseInt(id) },
  });

  if (!galeriImage) {
    throw new Error("Gambar tidak ditemukan");
  }

  // Hapus file dari server (pastikan path gambar sudah benar)
  const filePath = path.join(__dirname, "uploads", galeriImage.foto); // Pastikan path file sesuai
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Hapus file dari server
  }

  // Hapus data galeri dari database
  return await prisma.produk.delete({
    where: { id: parseInt(id) },
  });
};

const deletePengurusDesa = async (id) => {
  const pengelola = await prisma.pengelola.findUnique({
    where: { id: parseInt(id) },
  });

  if (!pengelola) {
    throw new Error("File notulensi tidak ditemukan");
  }
};

const editProdukDesa = async (id, desaId, imagePath, nama, harga, deskripsi) => {
  // Cari produk berdasarkan ID
  const produk = await prisma.produk.findUnique({
    where: { id: parseInt(id) },
  });

  if (!produk) {
    throw new Error("Produk tidak ditemukan");
  }

  // Jika ada gambar baru, hapus gambar lama dari server
  if (imagePath && produk.foto !== imagePath) {
    const oldFilePath = path.join(__dirname, "uploads", produk.foto);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  // Perbarui data produk
  return await prisma.produk.update({
    where: { id: parseInt(id) },
    data: {
      desaId: parseInt(desaId),
      foto: imagePath || produk.foto, // Gunakan gambar baru jika disediakan, atau tetap gunakan gambar lama
      nama: nama || produk.nama,
      harga: harga || produk.harga,
      deskripsi: deskripsi || produk.deskripsi,
    },
  });
};

const editPengurusDesa = async (id, desaId, nama, jabatan, nohp) => {
  // Cari pengurus berdasarkan ID
  const pengurus = await prisma.pengelola.findUnique({
    where: { id: parseInt(id) },
  });

  if (!pengurus) {
    throw new Error("Pengurus tidak ditemukan");
  }

  // Perbarui data pengurus
  return await prisma.pengelola.update({
    where: { id: parseInt(id) },
    data: {
      desaId: parseInt(desaId) || pengurus.desaId,
      nama: nama || pengurus.nama,
      jabatan: jabatan || pengurus.jabatan,
      nohp: nohp || pengurus.nohp,
    },
  });
};

// Fetch all galeri images for a specific desa
const getGaleriByDesaId = async (desaId) => {
  return await prisma.galeri.findMany({
    where: { desaId: parseInt(desaId) },
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
  addPengurusDesa,
  getPengurusByDesaId,
  deletePengurusDesa,
  addProdukDesa,
  getProdukByDesaId,
  deleteProdukDesa,
  updateDesaCatatan,
  updateDesaStatus,
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
  editPengurusDesa,
  editProdukDesa,
};
