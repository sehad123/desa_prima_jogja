const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const desaRoutes = require("./routes/desaRoutes");
const kabupatenRoutes = require("./routes/kabupatenRoutes");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Tambahkan route default
app.get("/", (req, res) => {
  res.send("API berjalan dengan baik");
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/users", userRoutes);
app.use("/api/desa", desaRoutes);
app.use("/api/kabupaten", kabupatenRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
