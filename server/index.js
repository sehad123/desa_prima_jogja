const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const desaRoutes = require("./routes/desaRoutes");
const kabupatenRoutes = require("./routes/kabupatenRoutes");
const produkRoutes = require("./routes/produkRoutes");
const path = require("path");

const app = express();

// Konfigurasi CORS yang benar
const corsOptions = {
  origin: 'http://localhost:3000', // Sesuaikan dengan origin frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

// Tambahkan route default
app.get("/", (req, res) => {
  res.send("API berjalan dengan baik");
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/users", userRoutes);
app.use("/produk", produkRoutes);
app.use("/api/desa", desaRoutes);
app.use("/api/kabupaten", kabupatenRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
