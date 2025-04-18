const express = require("express");
const router = express.Router();
const { 
  countProdukByKabupaten,
  countTotalProduk,
 } = require("../service/produkService");

// Rute untuk mendapatkan total produk
router.get("/total-produk", async (req, res) => {
  try {
    const totalProduk = await countTotalProduk();
    res.status(200).json({
      success: true,
      data: {
        totalProduk,
      },
    });
  } catch (error) {
    console.error("Error in /total-produk route:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data total produk",
      error: error.message,
    });
  }
});

// Rute untuk mendapatkan jumlah produk berdasarkan kabupaten
router.get("/produk-by-kabupaten/:kabupaten", async (req, res) => {
  try {
    const { kabupaten } = req.params; // Ambil parameter kabupaten dari URL
    const produkByKab = await countProdukByKabupaten(kabupaten);

    res.status(200).json({
      success: true,
      data: produkByKab,
    });
  } catch (error) {
    console.error("Error in /produk-by-kabupaten/:kabupaten route:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data produk berdasarkan kabupaten",
      error: error.message,
    });
  }
});

module.exports = router;
