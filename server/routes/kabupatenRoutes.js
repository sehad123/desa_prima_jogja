const express = require("express");
const kabupatenService = require("../service/kabupatenService");

const router = express.Router();

// Get all kabupaten
router.get("/", async (req, res) => {
  try {
    const kabupaten = await kabupatenService.getAllKabupaten();
    res.status(200).json(kabupaten);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get kabupaten by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const kabupaten = await kabupatenService.getKabupatenById(id);
    if (!kabupaten) {
      return res.status(404).json({ message: "Kabupaten not found" });
    }
    res.status(200).json(kabupaten);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get total jumlah_desa
router.get("/total-desa", async (req, res) => {
  try {
    const totalJumlahDesa = await kabupatenService.getTotalJumlahDesa();
    res.status(200).json({ totalJumlahDesa });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get kabupaten by nama
router.get("/detail/:nama_kabupaten", async (req, res) => {
  try {
    const { nama_kabupaten } = req.params;
    
    // Cari berdasarkan nama kabupaten
    const kabupaten = await kabupatenService.getKabupatenByName(nama_kabupaten);
    
    if (!kabupaten) {
      return res.status(404).json({ message: "Kabupaten not found" });
    }

    res.status(200).json(kabupaten);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create new kabupaten
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newKabupaten = await kabupatenService.createKabupaten(data);
    res.status(201).json(newKabupaten);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update kabupaten by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Filter hanya field yang diperlukan
    const { nama_kabupaten, jumlah_desa, ketua_forum } = req.body;
    const updateData = { nama_kabupaten, jumlah_desa, ketua_forum };
    
    const updatedKabupaten = await kabupatenService.updateKabupaten(id, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedKabupaten
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update periode khusus
router.put("/:id/update-periode", async (req, res) => {
  try {
    const { id } = req.params;
    const { periode_awal, periode_akhir } = req.body;
    
    // Pindahkan logika ke service layer
    const updatedKab = await kabupatenService.updateKabupatenPeriode(
      id,
      periode_awal,
      periode_akhir
    );

    res.json(updatedKab);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Delete kabupaten by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await kabupatenService.deleteKabupaten(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
