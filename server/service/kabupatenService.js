const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllKabupaten = async () => {
  return await prisma.kabupaten.findMany();
};

const getKabupatenById = async (id) => {
  return await prisma.kabupaten.findUnique({
    where: { id: Number(id) },
  });
};

const getKabupatenByName = async (nama_kabupaten) => {
  
  return await prisma.kabupaten.findFirst({
    where: { nama_kabupaten: nama_kabupaten },
  });
};

const createKabupaten = async (data) => {
  const { periode_awal, periode_akhir, ...rest } = data;

  // Pastikan periode_awal dan periode_akhir diubah ke tipe Date
  return await prisma.kabupaten.create({
    data: {
      ...rest,
      periode_awal: new Date(periode_awal),
      periode_akhir: new Date(periode_akhir),
    },
  });
};

const updateKabupaten = async (id, data) => {
  try {
    // Konversi jumlah_desa ke number jika ada
    const updateData = {
      ...data,
      jumlah_desa: data.jumlah_desa ? Number(data.jumlah_desa) : null
    };

    return await prisma.kabupaten.update({
      where: { id: Number(id) },
      data: updateData
    });
  } catch (error) {
    console.error("Prisma error:", error);
    throw error;
  }
};

// Validator tanggal (helper function)
const validateDate = (dateString) => {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Tambahkan method baru untuk update periode
const updateKabupatenPeriode = async function(id, periodeAwal, periodeAkhir) {
  try {
    return await Kabupaten.findByIdAndUpdate(
      id,
      {
        periode_awal: new Date(periodeAwal),
        periode_akhir: new Date(periodeAkhir)
      },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Failed to update periode: ${error.message}`);
  }
};

const getTotalJumlahDesa = async () => {
  const result = await prisma.kabupaten.aggregate({
    _sum: {
      jumlah_desa: true,
    },
  });
  return result._sum.jumlah_desa;
};

const deleteKabupaten = async (id) => {
  return await prisma.kabupaten.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  getAllKabupaten,
  getKabupatenById,
  createKabupaten,
  updateKabupaten,
  deleteKabupaten,
  getKabupatenByName,
  getTotalJumlahDesa,
  updateKabupatenPeriode,
};
