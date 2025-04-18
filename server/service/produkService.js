const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const countTotalProduk = async () => {
  try {
    const totalProduk = await prisma.produk.count();
    return totalProduk;
  } catch (error) {
    console.error("Error menghitung total produk:", error);
    throw error;
  }
};

// Fungsi untuk menghitung jumlah produk berdasarkan kabupaten
const countProdukByKabupaten = async (kabupaten) => {
  try {
    // Format nama kabupaten sesuai kebutuhan
    const cleanedKabupaten = kabupaten.replace(/^KAB\.\s*/i, "").toUpperCase();
    const formattedKabupaten = cleanedKabupaten === "YOGYAKARTA" 
      ? "KOTA YOGYAKARTA" 
      : `KAB. ${cleanedKabupaten}`;

    console.log("Nama Kabupaten yang Dicari:", formattedKabupaten);

    // Cari kabupaten berdasarkan nama yang diformat
    const kabupatenData = await prisma.kabupaten.findFirst({
      where: {
        nama_kabupaten: formattedKabupaten,
      },
      select: {
        id: true,
      },
    });

    console.log("Data Kabupaten yang Ditemukan:", kabupatenData);

    // Jika kabupaten tidak ditemukan
    if (!kabupatenData) {
      return {
        kabupaten: formattedKabupaten,
        jumlah: 0,
      };
    }

    // Hitung jumlah produk di kabupaten tersebut
    const jumlahProduk = await prisma.produk.count({
      where: {
        desa: {
          kabupatenId: kabupatenData.id, // Filter produk berdasarkan desa di kabupaten tertentu
        },
      },
    });

    console.log("Jumlah Produk di Kabupaten:", jumlahProduk);

    return {
      kabupaten: formattedKabupaten,
      jumlah: jumlahProduk,
    };
  } catch (error) {
    console.error("Error menghitung jumlah produk berdasarkan kabupaten:", error);
    throw error;
  }
};

module.exports = { 
  countTotalProduk,
  countProdukByKabupaten,
 };
