const express = require("express");
const multer = require("multer"); // Untuk menangani upload file
const path = require("path");
const {
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
} = require("../service/desaService");

const router = express.Router();

// Tambahkan rute baru untuk setiap kategori dan kabupaten
router.get("/count/sleman/maju", async (req, res) => {
  try {
    const count = await countSlemanMaju();
    res.json({ kabupaten: "Sleman", kategori: "Maju", count });
  } catch (error) {
    console.error("Error fetching Sleman Maju count:", error); // Log error
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/sleman/berkembang", async (req, res) => {
  try {
    const count = await countSlemanBerkembang();
    res.json({ kabupaten: "Sleman", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/sleman/tumbuh", async (req, res) => {
  try {
    const count = await countSlemanTumbuh();
    res.json({ kabupaten: "Sleman", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/maju", async (req, res) => {
  try {
    const count = await countBantulMaju();
    res.json({ kabupaten: "Bantul", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/berkembang", async (req, res) => {
  try {
    const count = await countBantulBerkembang();
    res.json({ kabupaten: "Bantul", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/tumbuh", async (req, res) => {
  try {
    const count = await countBantulTumbuh();
    res.json({ kabupaten: "Bantul", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/maju", async (req, res) => {
  try {
    const count = await countKulonProgoMaju();
    res.json({ kabupaten: "Kulon Progo", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/berkembang", async (req, res) => {
  try {
    const count = await countKulonProgoBerkembang();
    res.json({ kabupaten: "Kulon Progo", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/tumbuh", async (req, res) => {
  try {
    const count = await countKulonProgoTumbuh();
    res.json({ kabupaten: "Kulon Progo", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/maju", async (req, res) => {
  try {
    const count = await countGunungKidulMaju();
    res.json({ kabupaten: "GunungKidul", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/berkembang", async (req, res) => {
  try {
    const count = await countGunungKidulBerkembang();
    res.json({ kabupaten: "GunungKidul", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/tumbuh", async (req, res) => {
  try {
    const count = await countGunungKidulTumbuh();
    res.json({ kabupaten: "GunungKidul", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/maju", async (req, res) => {
  try {
    const count = await countYogyakartaMaju();
    res.json({ kabupaten: "Yogyakarta", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/berkembang", async (req, res) => {
  try {
    const count = await countYogyakartaBerkembang();
    res.json({ kabupaten: "Yogyakarta", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/tumbuh", async (req, res) => {
  try {
    const count = await countYogyakartaTumbuh();
    res.json({ kabupaten: "Yogyakarta", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

// Setup penyimpanan file dengan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Direktori tempat file akan disimpan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang unik
  },
});
const upload = multer({ storage: storage });

// Routes untuk galeri
// Menambahkan gambar ke galeri desa
router.post("/:desaId/galeri", upload.single("gambar"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Mendapatkan nama file yang di-upload
    const newImage = await addImageToGaleri(req.params.desaId, imagePath);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambahkan gambar ke galeri desa" });
  }
});

// Menghapus gambar dari galeri desa
router.delete("/:desaId/galeri/:id", async (req, res) => {
  try {
    const deletedImage = await deleteImageFromGaleri(req.params.id);
    res.json(deletedImage);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus gambar dari galeri desa" });
  }
});

// Routes untuk notulensi
// Menambahkan file notulensi
router.post("/:desaId/notulensi", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.filename; // Mendapatkan nama file yang di-upload
    const catatan = req.body.catatan || "";
    const newNotulensi = await addFileNotulensi(req.params.desaId, filePath, catatan);
    res.status(201).json(newNotulensi);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambahkan file notulensi" });
  }
});

// Menghapus file notulensi
router.delete("/:desaId/notulensi/:id", async (req, res) => {
  try {
    const deletedFile = await deleteFileNotulensi(req.params.id);
    res.json(deletedFile);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus file notulensi" });
  }
});

// Routes untuk mendapatkan galeri dan notulensi
// Get all galeri images for a specific desa
router.get("/:desaId/galeri", async (req, res) => {
  try {
    const galeri = await getGaleriByDesaId(req.params.desaId);
    res.json(galeri);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil galeri desa" });
  }
});

// Get all notulensi for a specific desa
router.get("/:desaId/notulensi", async (req, res) => {
  try {
    const notulensi = await getNotulensiByDesaId(req.params.desaId);
    res.json(notulensi);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil notulensi desa" });
  }
});

// Get all desa
router.get("/", async (req, res) => {
  try {
    // Ambil kabupaten dari query string URL
    const kabupatenQuery = req.query.kabupaten; // Dapatkan nilai kabupaten dari URL query string

    // Jika ada parameter kabupaten, gunakan sebagai filter, jika tidak gunakan kabupatenFilter default
    const kabupatenFilter = kabupatenQuery ? [kabupatenQuery.toUpperCase()] : null;

    const desa = await getAllDesa(kabupatenFilter);
    res.json(desa);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data desa" });
  }
});

// Get desa by ID
router.get("/:id", async (req, res) => {
  try {
    const desa = await getDesaById(req.params.id);
    if (desa) {
      res.json(desa);
    } else {
      res.status(404).json({ error: "Desa tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data desa" });
  }
});

// Create a new desa
router.post("/", async (req, res) => {
  try {
    const newDesa = await createDesa(req.body); // Data sudah termasuk kategori dari frontend
    res.status(201).json(newDesa);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: "Gagal menyimpan data desa." });
  }
});

// Update desa by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedDesa = await updateDesa(req.params.id, req.body);
    res.json(updatedDesa);
  } catch (error) {
    res.status(404).json({ error: "Desa tidak ditemukan" });
  }
});

// Delete desa by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDesa = await deleteDesa(req.params.id);
    res.json(deletedDesa);
  } catch (error) {
    res.status(404).json({ error: "Desa tidak ditemukan" });
  }
});

module.exports = router;
