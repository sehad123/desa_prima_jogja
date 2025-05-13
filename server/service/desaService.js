const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// const getAllDesa = async () => {
//   return await prisma.kelompokDesa.findMany();
// };

const getAllDesa = async (kabupatenFilter = null) => {
  // Jika kabupatenFilter tidak diberikan, gunakan filter default
  const filter = kabupatenFilter || ["KAB. KULON PROGO", "KAB. SLEMAN", "KAB. BANTUL", "KOTA YOGYAKARTA", "KAB. GUNUNGKIDUL"];

  return await prisma.kelompokDesa.findMany({
    where: {
      kabupaten_kota: {
        in: filter, // Filter desa berdasarkan kabupaten yang ada di parameter URL atau default
      },
    },
  });
};

const createDesa = async (data) => {
  const { tanggal_pembentukan, ...rest } = data;

  return await prisma.kelompokDesa.create({
    data: {
      ...rest,
      tanggal_pembentukan: new Date(tanggal_pembentukan),
    },
  });
};

const updateDesa = async (id, data) => {
  const { tanggal_pembentukan, ...rest } = data;

  return await prisma.kelompokDesa.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      tanggal_pembentukan: tanggal_pembentukan ? new Date(tanggal_pembentukan) : undefined,
    },
  });
};

const updateDesaStatus = async (id, status) => {
  return await prisma.kelompokDesa.update({
    where: { id: Number(id) },
    data: { status }, // Update status saja
  });
};

const updateDesaCatatan = async (id, catatan) => {
  return await prisma.kelompokDesa.update({
    where: { id: Number(id) },
    data: { catatan }, // Update catatan saja
  });
};

const deleteDesa = async (id) => {
  return await prisma.kelompokDesa.delete({
    where: { id: parseInt(id) },
  });
};

const getDesaById = async (id) => {
  return await prisma.kelompokDesa.findUnique({
    where: { id: parseInt(id) },
  });
};

// Fetch all notulensi for a specific desa
const getNotulensiByDesaId = async (kelompokId) => {
  return await prisma.notulensi.findMany({
    where: { kelompokId: parseInt(kelompokId) },
  });
};

// Fetch all notulensi for a specific desa
const getProdukByDesaId = async (kelompokId) => {
  return await prisma.produk.findMany({
    where: { kelompokId: parseInt(kelompokId) },
  });
};

// Fetch all notulensi for a specific desa
const getPengurusByDesaId = async (kelompokId) => {
  return await prisma.pengurus.findMany({
    where: { kelompokId: parseInt(kelompokId) },
  });
};

const addProdukDesa = async (kelompokId, foto, nama, harga_awal, harga_akhir, deskripsi, pelaku_usaha, nohp) => {
  return await prisma.produk.create({
    data: {
      kelompokId: parseInt(kelompokId),
      foto: foto,
      nama: nama,
      harga_awal: harga_awal,
      harga_akhir: harga_akhir,
      pelaku_usaha: pelaku_usaha,
      nohp: nohp,
      deskripsi: deskripsi,
    },
  });
};

const addPengurusDesa = async (kelompokId, imagePath, nama, nohp, jabatan) => {
  return await prisma.pengurus.create({
    data: {
      kelompokId: parseInt(kelompokId),
      foto: imagePath,
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
  try {
    // Cari data berdasarkan ID
    const pengurus = await prisma.pengurus.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pengurus) {
      throw new Error("Data pengurus tidak ditemukan");
    }

    // Jika ada foto, coba hapus file dari server
    if (pengurus.foto) {
      const filePath = path.join(__dirname, "uploads", pengurus.foto); // Sesuaikan dengan struktur folder Anda
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Hapus data dari database
    return await prisma.pengurus.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error deleting pengurus:", error.message);
    throw new Error("Gagal menghapus pengurus");
  }
};
const deleteKasDesa = async (id) => {
  try {
    // Cari data berdasarkan ID
    const Kas = await prisma.kas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!Kas) {
      throw new Error("Data kas tidak ditemukan");
    }

    // Hapus data dari database
    return await prisma.kas.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error deleting kas:", error.message);
    throw new Error("Gagal menghapus kas");
  }
};

const addKasDesa = async (kelompokId, tgl_transaksi, jenis_transaksi, nama_transaksi, total_transaksi) => {
  return await prisma.kas.create({
    data: {
      kelompokId: parseInt(kelompokId),
      tgl_transaksi: new Date(tgl_transaksi),
      jenis_transaksi: jenis_transaksi,
      nama_transaksi: nama_transaksi,
      total_transaksi: parseInt(total_transaksi),
    },
  });
};

const editKasDesa = async (id, kelompokId, updateData) => {
  // Cari data kas berdasarkan ID
  const kas = await prisma.kas.findUnique({
    where: { id: parseInt(id) },
  });

  if (!kas) {
    throw new Error("Data kas tidak ditemukan");
  }

  // Perbarui data kas
  return await prisma.kas.update({
    where: { id: parseInt(id) },
    data: {
      kelompokId: parseInt(kelompokId) || kas.kelompokId,
      nama_transaksi: updateData.nama_transaksi || kas.nama_transaksi,
      jenis_transaksi: updateData.jenis_transaksi || kas.jenis_transaksi,
      tgl_transaksi: updateData.tgl_transaksi ? new Date(updateData.tgl_transaksi) : kas.tgl_transaksi,
      total_transaksi: parseInt(updateData.total_transaksi) || kas.total_transaksi,
    },
  });
};
// const editKasDesa = async (id, kelompokId, updateData) => {
//   try {
//     const kasData = {
//       tgl_transaksi: new Date(updateData.tgl_transaksi),
//       jenis_transaksi: updateData.jenis_transaksi,
//       nama_transaksi: updateData.nama_transaksi,
//       total_transaksi: parseInt(updateData.total_transaksi),
//     };

//     const updatedKas = await prisma.kas.update({
//       where: {
//         id: parseInt(id),
//         kelompokId: parseInt(kelompokId),
//       },
//       data: kasData,
//     });

//     return updatedKas;
//   } catch (error) {
//     console.error("Error in editKasDesa:", error);
//     throw new Error(`Gagal mengupdate kas: ${error.message}`);
//   }
// };

async function editProdukDesa(id, kelompokId, updateData) {
  try {
    // Siapkan data update
    const produkData = {
      nama: updateData.nama,
      harga_awal: parseInt(updateData.harga_awal),
      harga_akhir: parseInt(updateData.harga_akhir),
      pelaku_usaha: updateData.pelaku_usaha,
      nohp: updateData.nohp,
      deskripsi: updateData.deskripsi,
    };

    // Tambahkan foto jika ada
    if (updateData.foto) {
      produkData.foto = updateData.foto;
    }

    // Lakukan update dengan Prisma
    const updatedProduk = await prisma.produk.update({
      where: {
        id: parseInt(id),
        kelompokId: parseInt(kelompokId),
      },
      data: produkData,
    });

    return updatedProduk;
  } catch (error) {
    console.error("Error in editProdukDesa:", error);
    throw new Error(`Gagal mengupdate produk: ${error.message}`);
  }
}

const getKasByDesaId = async (kelompokId) => {
  return await prisma.kas.findMany({
    where: { kelompokId: parseInt(kelompokId) },
  });
};

const getDesaWithKasSummary = async (id) => {
  // Ambil data desa
  const desa = await prisma.kelompokDesa.findUnique({
    where: { id: parseInt(id) },
  });

  if (!desa) return null;

  // Ambil semua transaksi kas untuk desa ini
  const kasTransactions = await prisma.kas.findMany({
    where: { kelompokId: parseInt(id) },
  });

  // Hitung total pemasukan dan pengeluaran
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  kasTransactions.forEach((transaction) => {
    if (transaction.jenis_transaksi === "Pemasukan") {
      totalPemasukan += transaction.total_transaksi;
    } else if (transaction.jenis_transaksi === "Pengeluaran") {
      totalPengeluaran += transaction.total_transaksi;
    }
  });

  // Hitung dana sekarang: hibah + pemasukan - pengeluaran
  const danaSekarang = desa.jumlah_hibah_diterima + totalPemasukan - totalPengeluaran;

  return {
    ...desa,
    jumlah_dana_sekarang: danaSekarang, // Timpa nilai yang ada dengan yang dihitung
    kas: kasTransactions,
  };
};

const editPengurusDesa = async (id, kelompokId, imagePath, nama, jabatan, nohp) => {
  // Cari pengurus berdasarkan ID
  const pengurus = await prisma.pengurus.findUnique({
    where: { id: parseInt(id) },
  });

  if (!pengurus) {
    throw new Error("Pengurus tidak ditemukan");
  }

  // Jika ada gambar baru, hapus gambar lama dari server
  if (imagePath && produk.foto !== imagePath) {
    const oldFilePath = path.resolve(__dirname, "../uploads", produk.foto);
    if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
  }

  // Perbarui data pengurus
  return await prisma.pengurus.update({
    where: { id: parseInt(id) },
    data: {
      kelompokId: parseInt(kelompokId) || pengurus.kelompokId,
      foto: imagePath || pengurus.foto, // Gunakan gambar baru jika disediakan, atau tetap gunakan gambar lama
      nama: nama || pengurus.nama,
      jabatan: jabatan || pengurus.jabatan,
      nohp: nohp || pengurus.nohp,
    },
  });
};

// Fetch all galeri images for a specific desa
const getGaleriByDesaId = async (kelompokId) => {
  return await prisma.galeri.findMany({
    where: { kelompokId: parseInt(kelompokId) },
  });
};

const addImageToGaleri = async (kelompokId, imagePath) => {
  return await prisma.galeri.create({
    data: {
      kelompokId: parseInt(kelompokId),
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
const addFileNotulensi = async (kelompokId, filePath, catatan) => {
  return await prisma.notulensi.create({
    data: {
      kelompokId: parseInt(kelompokId),
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

const getDesaByKabupaten = async (kabupaten) => {
  try {
    if (!kabupaten) throw new Error("Parameter kabupaten diperlukan");

    // Decode URL dan standarisasi format
    const decodedKabupaten = decodeURIComponent(kabupaten)
      .toUpperCase()
      .replace("KAB.", "KAB. ") // Pastikan ada spasi setelah "KAB."
      .trim();

    // Cek format kabupaten di database
    const desa = await prisma.desa.findMany({
      where: {
        OR: [
          { kabupaten_kota: decodedKabupaten },
          { kabupaten_kota: decodedKabupaten.replace("KAB. ", "KAB.") }, // Format alternatif
          { kabupaten: decodedKabupaten }, // Jika kolom bernama 'kabupaten'
        ],
      },
    });

    if (desa.length === 0) {
      throw new Error(`Data tidak ditemukan untuk kabupaten ${decodedKabupaten}`);
    }

    return desa;
  } catch (error) {
    console.error("[SERVICE ERROR] getDesaByKabupaten:", error.message);
    throw new Error(`Gagal mengambil data: ${error.message}`);
  }
};

const countTotalAnggota = async (allDesa) => {
  return allDesa.reduce((sum, desa) => sum + (desa.jumlah_anggota_sekarang || 0), 0);
};

// Fungsi untuk menghitung total anggota di kabupaten tertentu
const countAnggotaByKabupaten = async (kabupaten) => {
  if (typeof kabupaten !== "string") {
    throw new Error(`Parameter 'kabupaten' harus string. Diterima: ${kabupaten}`);
  }

  const kabupatenQuery = kabupaten.toUpperCase() === "YOGYAKARTA" ? "KOTA YOGYAKARTA" : `KAB. ${kabupaten.toUpperCase()}`;

  const result = await prisma.kelompokDesa.aggregate({
    where: {
      kabupaten_kota: {
        equals: kabupaten,
      },
    },
    _sum: {
      jumlah_anggota_sekarang: true,
    },
  });

  return result._sum.jumlah_anggota_sekarang || 0;
};

const countByKabupatenAndKategori = async (kabupaten, kategori) => {
  try {
    // Format kabupaten untuk query
    let kabupatenQuery;
    if (kabupaten.toUpperCase() === "YOGYAKARTA") {
      kabupatenQuery = "KOTA YOGYAKARTA";
    } else {
      kabupatenQuery = `KAB. ${kabupaten.toUpperCase()}`;
    }

    const count = await prisma.kelompokDesa.count({
      where: {
        AND: [{ kategori: kategori.toUpperCase() }, { kabupaten_kota: kabupatenQuery }],
      },
    });

    return count;
  } catch (error) {
    console.error(`Error counting ${kabupaten} ${kategori}:`, error);
    throw error;
  }
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

// const countMaju = async () => {
//   return Desa.countDocuments({ kategori: "Maju" }); // Gunakan MongoDB atau ORM yang sesuai
// };

// const countBerkembang = async () => {
//   return Desa.countDocuments({ kategori: "Berkembang" });
// };

// const countTumbuh = async () => {
//   return Desa.countDocuments({ kategori: "Tumbuh" });
// };

const countDesaByKategori = async (kategori) => {
  return await prisma.kelompokDesa.count({
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

const countByKabupatenAndStatus = async (kabupaten, status) => {
  try {
    // Format kabupaten untuk query
    let kabupatenQuery;
    if (kabupaten.toUpperCase() === "YOGYAKARTA") {
      kabupatenQuery = "KOTA YOGYAKARTA";
    } else {
      kabupatenQuery = `KAB. ${kabupaten.toUpperCase()}`;
    }

    const count = await prisma.kelompokDesa.count({
      where: {
        AND: [{ status: status }, { kabupaten_kota: kabupatenQuery }],
      },
    });

    return count;
  } catch (error) {
    console.error(`Error counting ${kabupaten} ${status}:`, error);
    throw error;
  }
};

// Metode spesifik berdasarkan permintaan
const countSlemanDisetujui = async () => {
  return await countByKabupatenAndStatus("SLEMAN", "Disetujui");
};

const countSlemanDitolak = async () => {
  return await countByKabupatenAndStatus("SLEMAN", "Ditolak");
};

const countSlemanPending = async () => {
  return await countByKabupatenAndStatus("SLEMAN", "Pending");
};

const countBantulDisetujui = async () => {
  return await countByKabupatenAndStatus("BANTUL", "Disetujui");
};

const countBantulDitolak = async () => {
  return await countByKabupatenAndStatus("BANTUL", "Ditolak");
};

const countBantulPending = async () => {
  return await countByKabupatenAndStatus("BANTUL", "Pending");
};

const countKulonProgoDisetujui = async () => {
  return await countByKabupatenAndStatus("KULON PROGO", "Disetujui");
};

const countKulonProgoDitolak = async () => {
  return await countByKabupatenAndStatus("KULON PROGO", "Ditolak");
};

const countKulonProgoPending = async () => {
  return await countByKabupatenAndStatus("KULON PROGO", "Pending");
};

const countGunungKidulDisetujui = async () => {
  return await countByKabupatenAndStatus("GUNUNGKIDUL", "DIsetujui");
};

const countGunungKidulDitolak = async () => {
  return await countByKabupatenAndStatus("GUNUNGKIDUL", "Ditolak");
};

const countGunungKidulPending = async () => {
  return await countByKabupatenAndStatus("GUNUNGKIDUL", "Pending");
};

const countYogyakartaDisetujui = async () => {
  return await countByKabupatenAndStatus("YOGYAKARTA", "Disetujui");
};

const countYogyakartaDitolak = async () => {
  return await countByKabupatenAndStatus("YOGYAKARTA", "Ditolak");
};

const countYogyakartaPending = async () => {
  return await countByKabupatenAndStatus("YOGYAKARTA", "Pending");
};

const countMaju = async () => {
  return Desa.countDocuments({ kategori: "Maju" }); // Gunakan MongoDB atau ORM yang sesuai
};

const countBerkembang = async () => {
  return Desa.countDocuments({ kategori: "Berkembang" });
};

const countProdukByDesaPerKabupaten = async (namaKabupaten) => {
  // Ambil semua desa yang memiliki nama_kabupaten yang sama
  const desaList = await prisma.kelompokDesa.findMany({
    where: {
      kabupaten: namaKabupaten, // Gunakan nama_kabupaten sebagai filter
    },
  });

  // Ambil semua produk dari desa-desa tersebut
  const produkCountByDesa = {};

  for (const desa of desaList) {
    const produkCount = await prisma.produk.count({
      where: {
        kelompokId: desa.id, // Hitung produk berdasarkan kelompokId
      },
    });
    produkCountByDesa[desa.id] = produkCount; // Simpan jumlah produk untuk desa ini
  }

  return produkCountByDesa;
};

const countTotalProdukByKabupaten = async (namaKabupaten) => {
  try {
    // 1. Normalisasi input namaKabupaten
    const normalizedInput = namaKabupaten.trim().toUpperCase();

    // 2. Format nama kabupaten/kota
    let formattedKabupaten;
    if (normalizedInput === "YOGYAKARTA" || normalizedInput === "KOTA YOGYAKARTA") {
      formattedKabupaten = "KOTA YOGYAKARTA";
    } else {
      // Hilangkan 'KAB.' jika sudah ada di input, lalu tambahkan dengan format konsisten
      const cleanedName = normalizedInput.replace(/^KAB\.\s*/i, "");
      formattedKabupaten = `KAB. ${cleanedName}`;
    }

    // 3. Cari desa dengan query yang lebih robust
    const desaList = await prisma.kelompokDesa.findMany({
      where: {
        kabupaten_kota: {
          // Gunakan contains untuk fleksibilitas pencarian
          contains: formattedKabupaten.replace("KAB. ", ""),
        },
      },
      select: {
        id: true,
      },
    });

    if (!desaList.length) {
      console.warn(`Tidak ditemukan desa untuk kabupaten: ${formattedKabupaten}`);
      return 0;
    }

    // 4. Hitung total produk dengan optimasi query
    const totalProduk = await prisma.produk.count({
      where: {
        kelompokId: {
          in: desaList.map((desa) => desa.id),
        },
      },
    });

    return totalProduk;
  } catch (error) {
    console.error("Error in countTotalProdukByKabupaten:", error);
    throw new Error(`Gagal menghitung produk: ${error.message}`);
  }
};

const deleteMultipleItems = async (desaId, type, ids) => {
  try {
    // Validasi parameter
    if (!desaId || isNaN(desaId)) {
      throw new Error("ID desa tidak valid");
    }

    if (!Array.isArray(ids)) {
      throw new Error("Parameter ids harus berupa array");
    }

    if (ids.length === 0) {
      throw new Error("Tidak ada ID yang diberikan");
    }

    // Validasi semua ID (untuk Prisma yang menggunakan Int ID)
    const invalidIds = ids.filter((id) => isNaN(id));
    if (invalidIds.length > 0) {
      throw new Error(`ID tidak valid: ${invalidIds.join(", ")}`);
    }

    // Pemilihan model dengan error handling
    let modelConfig;
    const normalizedType = type.toLowerCase().trim();

    switch (normalizedType) {
      case "produk":
        modelConfig = {
          model: prisma.produk,
          relationField: "kelompokId",
        };
        break;
      case "pengurus":
        modelConfig = {
          model: prisma.pengurus,
          relationField: "kelompokId",
        };
        break;
      case "notulensi":
      case "materi":
        modelConfig = {
          model: prisma.notulensi,
          relationField: "kelompokId",
        };
        break;
      case "galeri":
        modelConfig = {
          model: prisma.galeri,
          relationField: "kelompokId",
        };
        break;
      default:
        throw new Error(`Tipe '${type}' tidak dikenali`);
    }

    // Eksekusi penghapusan dengan Prisma
    const deleteResult = await modelConfig.model.deleteMany({
      where: {
        id: { in: ids.map((id) => parseInt(id)) },
        [modelConfig.relationField]: parseInt(desaId),
      },
    });

    if (deleteResult.count === 0) {
      throw new Error("Tidak ada dokumen yang terhapus (mungkin tidak ditemukan)");
    }

    // Hapus file-file terkait jika ada
    if (["galeri", "pengurus", "produk", "notulensi"].includes(normalizedType)) {
      // Tentukan field yang akan dipilih berdasarkan tipe
      const fieldMap = {
        galeri: "gambar",
        pengurus: "foto",
        produk: "foto",
        notulensi: "file",
      };

      const fieldToSelect = fieldMap[normalizedType];

      const items = await modelConfig.model.findMany({
        where: { id: { in: ids.map((id) => parseInt(id)) } },
        select: { [fieldToSelect]: true },
      });

      for (const item of items) {
        const filePath = item[fieldToSelect];
        if (filePath) {
          try {
            const fullPath = path.join(__dirname, "uploads", filePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          } catch (fileError) {
            console.error(`Gagal menghapus file ${filePath}:`, fileError);
          }
        }
      }
    }

    return {
      success: true,
      message: `Berhasil menghapus ${deleteResult.count} item`,
      deletedCount: deleteResult.count,
    };
  } catch (error) {
    console.error("Error in deleteMultipleItems:", {
      message: error.message,
      stack: error.stack,
      inputParams: { desaId, type, ids },
    });
    throw error;
  }
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
  getDesaByKabupaten,
  editPengurusDesa,
  editProdukDesa,
  countTotalAnggota,
  countAnggotaByKabupaten,
  countProdukByDesaPerKabupaten,
  countTotalProdukByKabupaten,
  deleteMultipleItems,
  getKasByDesaId,
  addKasDesa,
  editKasDesa,
  deleteKasDesa,
};
