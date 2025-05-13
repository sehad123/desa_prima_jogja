const express = require("express");
const multer = require("multer"); // Untuk menangani upload file
const path = require("path");
const {
  editPengurusDesa,
  editProdukDesa,
  addPengurusDesa,
  getPengurusByDesaId,
  deletePengurusDesa,
  addProdukDesa,
  getProdukByDesaId,
  deleteProdukDesa,
  updateDesaCatatan,
  updateDesaStatus,
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
  countBantulDisetujui,
  countBantulDitolak,
  countBantulPending,
  countSlemanDisetujui,
  countSlemanDitolak,
  countSlemanPending,
  countYogyakartaDisetujui,
  countYogyakartaDitolak,
  countYogyakartaPending,
  countKulonProgoDisetujui,
  countKulonProgoPending,
  countKulonProgoDitolak,
  countGunungKidulDisetujui,
  countGunungKidulDitolak,
  countGunungKidulPending,
  countTotalAnggota,
  countAnggotaByKabupaten,
  countProdukByDesaPerKabupaten,
  countTotalProdukByKabupaten,
  getDesaByKabupaten,
  deleteMultipleItems,
  getTotalDesaCount,
  desaMaju,
  desaBerkembang,
  desaTumbuh,
  countTotalAndByKabupaten,
} = require("../service/desaService");

const router = express.Router();

// Tambahkan rute baru untuk setiap kategori dan kabupaten
router.get("/count/sleman/maju", async (req, res) => {
  try {
    const count = await countSlemanMaju();
    res.json({ kabupaten_kota: "Sleman", kategori: "Maju", count });
  } catch (error) {
    console.error("Error fetching Sleman Maju count:", error); // Log error
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/sleman/berkembang", async (req, res) => {
  try {
    const count = await countSlemanBerkembang();
    res.json({ kabupaten_kota: "Sleman", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/sleman/tumbuh", async (req, res) => {
  try {
    const count = await countSlemanTumbuh();
    res.json({ kabupaten_kota: "Sleman", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/maju", async (req, res) => {
  try {
    const count = await countBantulMaju();
    res.json({ kabupaten_kota: "Bantul", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/berkembang", async (req, res) => {
  try {
    const count = await countBantulBerkembang();
    res.json({ kabupaten_kota: "Bantul", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/tumbuh", async (req, res) => {
  try {
    const count = await countBantulTumbuh();
    res.json({ kabupaten_kota: "Bantul", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/maju", async (req, res) => {
  try {
    const count = await countKulonProgoMaju();
    res.json({ kabupaten_kota: "Kulon Progo", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/berkembang", async (req, res) => {
  try {
    const count = await countKulonProgoBerkembang();
    res.json({ kabupaten_kota: "Kulon Progo", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/tumbuh", async (req, res) => {
  try {
    const count = await countKulonProgoTumbuh();
    res.json({ kabupaten_kota: "Kulon Progo", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/maju", async (req, res) => {
  try {
    const count = await countGunungKidulMaju();
    res.json({ kabupaten_kota: "GunungKidul", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/berkembang", async (req, res) => {
  try {
    const count = await countGunungKidulBerkembang();
    res.json({ kabupaten_kota: "GunungKidul", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/tumbuh", async (req, res) => {
  try {
    const count = await countGunungKidulTumbuh();
    res.json({ kabupaten_kota: "GunungKidul", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/maju", async (req, res) => {
  try {
    const count = await countYogyakartaMaju();
    res.json({ kabupaten_kota: "Yogyakarta", kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/berkembang", async (req, res) => {
  try {
    const count = await countYogyakartaBerkembang();
    res.json({ kabupaten_kota: "Yogyakarta", kategori: "Berkembang", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/tumbuh", async (req, res) => {
  try {
    const count = await countYogyakartaTumbuh();
    res.json({ kabupaten_kota: "Yogyakarta", kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

// Routes untuk menghitung jumlah desa berdasarkan kategori
router.get("/count/desa/maju", async (req, res) => {
  try {
    const count = await desaService.countAllDesaMaju();
    res.json({ kategori: "Maju", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung desa kategori Maju" });
  }
});

router.get("/count/desa/berkembang", async (req, res) => {
  try {
    const count = await desaService.countAllDesaBerkembang();
    res.json({ kategori: "Berkembang", count });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal menghitung desa kategori Berkembang" });
  }
});

router.get("/count/desa/tumbuh", async (req, res) => {
  try {
    const count = await desaService.countAllDesaTumbuh();
    res.json({ kategori: "Tumbuh", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung desa kategori Tumbuh" });
  }
});

// status

// Tambahkan rute baru untuk setiap kategori dan kabupaten
router.get("/count/sleman/disetujui", async (req, res) => {
  try {
    const count = await countSlemanDisetujui();
    res.json({ kabupaten_kota: "Sleman", status: "Disetujui", count });
  } catch (error) {
    console.error("Error fetching Sleman Disetujui count:", error); // Log error
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/sleman/ditolak", async (req, res) => {
  try {
    const count = await countSlemanDitolak();
    res.json({ kabupaten_kota: "Sleman", status: "Ditolak", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/sleman/pending", async (req, res) => {
  try {
    const count = await countSlemanPending();
    res.json({ kabupaten_kota: "Sleman", status: "Pending", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/disetujui", async (req, res) => {
  try {
    const count = await countBantulDisetujui();
    res.json({ kabupaten_kota: "Bantul", status: "Disetujui", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/ditolak", async (req, res) => {
  try {
    const count = await countBantulDitolak();
    res.json({ kabupaten_kota: "Bantul", status: "Ditolak", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/bantul/pending", async (req, res) => {
  try {
    const count = await countBantulPending();
    res.json({ kabupaten_kota: "Bantul", status: "Pending", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/disetujui", async (req, res) => {
  try {
    const count = await countKulonProgoDisetujui();
    res.json({ kabupaten_kota: "Kulon Progo", status: "Disetujui", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/ditolak", async (req, res) => {
  try {
    const count = await countKulonProgoDitolak();
    res.json({ kabupaten_kota: "Kulon Progo", status: "Ditolak", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/kulonprogo/pending", async (req, res) => {
  try {
    const count = await countKulonProgoPending();
    res.json({ kabupaten_kota: "Kulon Progo", status: "Pending", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/disetujui", async (req, res) => {
  try {
    const count = await countGunungKidulDisetujui();
    res.json({ kabupaten_kota: "GunungKidul", status: "Disetujui", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/ditolak", async (req, res) => {
  try {
    const count = await countGunungKidulDitolak();
    res.json({ kabupaten_kota: "GunungKidul", status: "Ditolak", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/gunungkidul/pending", async (req, res) => {
  try {
    const count = await countGunungKidulPending();
    res.json({ kabupaten_kota: "GunungKidul", status: "Pending", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/disetujui", async (req, res) => {
  try {
    const count = await countYogyakartaDisetujui();
    res.json({ kabupaten_kota: "Yogyakarta", status: "Disetujui", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/ditolak", async (req, res) => {
  try {
    const count = await countYogyakartaDitolak();
    res.json({ kabupaten_kota: "Yogyakarta", status: "Ditolak", count });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghitung data" });
  }
});

router.get("/count/yogyakarta/pending", async (req, res) => {
  try {
    const count = await countYogyakartaPending();
    res.json({ kabupaten_kota: "Yogyakarta", status: "Pending", count });
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
router.post(
  "/:kelompokId/galeri",
  upload.single("gambar"),
  async (req, res) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Mendapatkan nama file yang di-upload
      const newImage = await addImageToGaleri(req.params.kelompokId, imagePath);
      res.status(201).json(newImage);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Gagal menambahkan gambar ke galeri desa" });
    }
  }
);

// Menghapus gambar dari galeri desa
router.delete("/:kelompokId/galeri/:id", async (req, res) => {
  try {
    const deletedImage = await deleteImageFromGaleri(req.params.id);
    res.json(deletedImage);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus gambar dari galeri desa" });
  }
});

// Route untuk mendapatkan semua produk desa berdasarkan kelompokId
router.get("/:kelompokId/produk", async (req, res) => {
  try {
    const produk = await getProdukByDesaId(req.params.kelompokId);
    res.json(produk);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil produk desa" });
  }
});

// Route untuk mendapatkan semua pengurus desa berdasarkan kelompokId
router.get("/:kelompokId/pengurus", async (req, res) => {
  try {
    const pengurus = await getPengurusByDesaId(req.params.kelompokId);
    res.json(pengurus);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil pengurus desa" });
  }
});

// Route untuk menambahkan produk desa
router.post("/:kelompokId/produk", upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File foto diperlukan" });
    }

    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const { nama, harga_awal, harga_akhir, pelaku_usaha, nohp, deskripsi } =
      req.body;

    const newProduk = await addProdukDesa(
      req.params.kelompokId,
      foto,
      nama,
      parseInt(harga_awal), // Ubah sesuai kebutuhan
      parseInt(harga_akhir), // Ubah sesuai kebutuhan
      deskripsi,
      pelaku_usaha,
      nohp
    );

    res.status(201).json(newProduk);
  } catch (error) {
    console.error("Error:", error); // Tambahkan logging
    res.status(500).json({
      error: "Gagal menambahkan produk desa",
      details: error.message, // Tambahkan detail error
    });
  }
});

// Route untuk menambahkan pengurus desa
router.post(
  "/:kelompokId/pengurus",
  upload.single("foto"),
  async (req, res) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const { nama, nohp, jabatan } = req.body;
      const newPengurus = await addPengurusDesa(
        req.params.kelompokId,
        imagePath,
        nama,
        nohp,
        jabatan
      );
      res.status(201).json(newPengurus);
    } catch (error) {
      res.status(500).json({ error: "Gagal menambahkan pengurus desa" });
    }
  }
);

// Route untuk menghapus produk desa
router.delete("/:kelompokId/produk/:id", async (req, res) => {
  try {
    const deletedProduk = await deleteProdukDesa(req.params.id);
    res.json(deletedProduk);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus produk desa" });
  }
});

// Route untuk menghapus pengurus desa
router.delete("/:kelompokId/pengurus/:id", async (req, res) => {
  try {
    const deletedPengurus = await deletePengurusDesa(req.params.id);
    res.json(deletedPengurus);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus pengurus desa" });
  }
});

// Route untuk mengedit produk desa
router.put(
  "/:kelompokId/produk/:id",
  upload.single("foto"),
  async (req, res) => {
    console.log("Request body:", req.body);
    console.log("File received:", req.file);

    try {
      const { nama, harga_awal, harga_akhir, pelaku_usaha, nohp, deskripsi } =
        req.body;

      // Handle file upload
      const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Prepare update data
      const updateData = {
        nama,
        harga_awal: parseInt(harga_awal),
        harga_akhir: parseInt(harga_akhir),
        pelaku_usaha,
        nohp,
        deskripsi,
      };

      // Only add foto if a new file was uploaded
      if (imagePath) {
        updateData.foto = imagePath;
      }

      const updatedProduk = await editProdukDesa(
        req.params.id,
        req.params.kelompokId,
        updateData // Pass regular object instead of FormData
      );

      res.json(updatedProduk);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Gagal mengedit produk desa",
        details: error.message,
      });
    }
  }
);

// Route untuk mengedit pengurus desa
router.put(
  "/:kelompokId/pengurus/:id",
  upload.single("foto"),
  async (req, res) => {
    console.log("File received:", req.file); // Debugging
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const { nama, jabatan, nohp } = req.body;
      const updatedPengurus = await editPengurusDesa(
        req.params.id,
        req.params.kelompokId,
        imagePath,
        nama,
        jabatan,
        nohp
      );
      res.json(updatedPengurus);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengedit pengurus desa" });
    }
  }
);

// Routes untuk notulensi
// Menambahkan file notulensi
router.post(
  "/:kelompokId/notulensi",
  upload.single("file"),
  async (req, res) => {
    try {
      const filePath = req.file.filename; // Mendapatkan nama file yang di-upload
      const catatan = req.body.catatan || "";
      const newNotulensi = await addFileNotulensi(
        req.params.kelompokId,
        filePath,
        catatan
      );
      res.status(201).json(newNotulensi);
    } catch (error) {
      res.status(500).json({ error: "Gagal menambahkan file notulensi" });
    }
  }
);

// Menghapus file notulensi
router.delete("/:kelompokId/notulensi/:id", async (req, res) => {
  try {
    const deletedFile = await deleteFileNotulensi(req.params.id);
    res.json(deletedFile);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus file notulensi" });
  }
});

// Routes untuk mendapatkan galeri dan notulensi
// Get all galeri images for a specific desa
router.get("/:kelompokId/galeri", async (req, res) => {
  try {
    const galeri = await getGaleriByDesaId(req.params.kelompokId); // udah diperbaiki nama fungsinya ya
    res.json(galeri);
  } catch (error) {
    console.error("Error saat ambil galeri:", error); // pastikan ini ada
    res.status(500).json({ error: "Gagal mengambil galeri desa" });
  }
});

// Get all notulensi for a specific desa
router.get("/:kelompokId/notulensi", async (req, res) => {
  try {
    const notulensi = await getNotulensiByDesaId(req.params.kelompokId);
    res.json(notulensi);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil notulensi desa" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Ambil kabupaten dari query string URL
    const kabupatenQuery = req.query.kabupaten; // Dapatkan nilai kabupaten dari URL query string

    // Jika ada parameter kabupaten, gunakan sebagai filter, jika tidak gunakan kabupatenFilter default
    const kabupatenFilter = kabupatenQuery
      ? [kabupatenQuery.toUpperCase()]
      : null;

    const desa = await getAllDesa(kabupatenFilter);
    res.json(desa);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data desa" });
  }
});
// Endpoint untuk mengambil list desa berdasarkan kabupaten
// router.get("/:kabupaten", getDesaByKabupaten);

router.post("/", async (req, res) => {
  try {
    const data = {
      ...req.body,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
    };
    const newDesa = await createDesa(data); // Data sudah termasuk kategori dari frontend
    res.status(201).json(newDesa);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: "Gagal menyimpan data desa." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDesa = await updateDesa(req.params.id, req.body);
    res.json(updatedDesa);
  } catch (error) {
    res.status(404).json({ error: "Desa tidak ditemukan" });
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

// Update status desa
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedStatus = await updateDesaStatus(req.params.id, status);
    res.json(updatedStatus);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Gagal memperbarui status desa." });
  }
});

// Update catatan desa
router.patch("/:id/catatan", async (req, res) => {
  const { catatan } = req.body;
  try {
    const updatedCatatan = await updateDesaCatatan(req.params.id, catatan);
    res.json(updatedCatatan);
  } catch (error) {
    console.error("Error updating catatan:", error);
    res.status(500).json({ error: "Gagal memperbarui catatan desa." });
  }
});

// Delete desa by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Validasi ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID harus berupa angka" });
    }

    const deletedDesa = await deleteDesa(id);
    res.json(deletedDesa);
  } catch (error) {
    console.error("Delete error:", error);

    if (
      error.code === "P2025" ||
      error.message.includes("Record to delete does not exist")
    ) {
      res.status(404).json({ error: "Desa tidak ditemukan" });
    } else {
      res.status(500).json({ error: error.message || "Gagal menghapus desa" });
    }
  }
});

// Rute untuk mendapatkan total anggota di kabupaten tertentu
router.get("/anggota/:kabupaten", async (req, res) => {
  try {
    const { kabupaten } = req.params;
    const anggotaPerKab = await countAnggotaByKabupaten(kabupaten);

    res.status(200).json({
      success: true,
      data: {
        kabupaten: kabupaten.toUpperCase(),
        anggotaPerKab,
      },
    });
  } catch (error) {
    console.error("Error in /anggota/:kabupaten route:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data total anggota di kabupaten",
      error: error.message,
    });
  }
});


// Rute untuk menghitung jumlah produk tiap desa berdasarkan nama_kabupaten
router.get("/produk-per-desa/:kabupaten", async (req, res) => {
  try {
    const { kabupaten } = req.params; // Ambil nama_kabupaten dari parameter URL
    const produkCountByDesa = await countProdukByDesaPerKabupaten(kabupaten);

    res.status(200).json({
      success: true,
      data: produkCountByDesa,
    });
  } catch (error) {
    console.error("Error in /produk-per-desa/:namaKabupaten route:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghitung jumlah produk per desa",
      error: error.message,
    });
  }
});

// Rute untuk menghitung total produk di seluruh desa dalam satu kabupaten berdasarkan nama_kabupaten
router.get("/total-produk-per-kabupaten/:kabupaten", async (req, res) => {
  try {
    const { kabupaten } = req.params; // Ambil nama_kabupaten dari parameter URL
    const totalProduk = await countTotalProdukByKabupaten(kabupaten);

    res.status(200).json({
      success: true,
      data: {
        kabupaten,
        totalProduk,
      },
    });
  } catch (error) {
    console.error(
      "Error in /total-produk-per-kabupaten/:namaKabupaten route:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Gagal menghitung total produk per kabupaten",
      error: error.message,
    });
  }
});

// Route untuk menghapus multiple items
router.post("/:id/delete-multiple", async (req, res) => {
  try {
    console.log('Incoming request:', {
      params: req.params,
      body: req.body,
      headers: req.headers
    });

    // Validasi input
    const { type, ids } = req.body;
    const desaId = req.params.id;

    if (!type || typeof type !== 'string') {
      return res.status(400).json({ 
        error: "Parameter 'type' harus ada dan berupa string",
        received: type
      });
    }

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ 
        error: "Parameter 'ids' harus ada dan berupa array",
        received: ids
      });
    }

    if (ids.length === 0) {
      return res.status(400).json({ 
        error: "Array 'ids' tidak boleh kosong"
      });
    }

    // Eksekusi penghapusan
    const result = await deleteMultipleItems(desaId, type, ids);
    
    console.log('Delete successful:', result);
    res.json(result);

  } catch (error) {
    console.error('Error in delete route:', {
      message: error.message,
      stack: error.stack,
      request: {
        params: req.params,
        body: req.body
      }
    });

    res.status(500).json({
      error: error.message || "Gagal menghapus item",
      type: "server_error",
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        receivedData: {
          params: req.params,
          body: req.body
        }
      } : undefined
    });
  }
});

// Endpoint khusus untuk filter kabupaten (alternatif)
router.get("/kabupaten/:namaKabupaten", async (req, res) => {
  try {
    const desaList = await getDesaByKabupaten(req.params.namaKabupaten);
    res.json(desaList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
