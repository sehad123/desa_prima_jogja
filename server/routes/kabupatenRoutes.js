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

// Get total jumlah_desa
router.get("/total-desa", async (req, res) => {
  try {
    const totalJumlahDesa = await kabupatenService.getTotalJumlahDesa();
    res.status(200).json({ totalJumlahDesa });
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
    const data = req.body;
    const updatedKabupaten = await kabupatenService.updateKabupaten(id, data);
    res.status(200).json(updatedKabupaten);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
