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
  const { periode_awal, periode_akhir, ...rest } = data;

  // Pastikan periode_awal dan periode_akhir diubah ke tipe Date
  return await prisma.kabupaten.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      periode_awal: periode_awal ? new Date(periode_awal) : undefined,
      periode_akhir: periode_akhir ? new Date(periode_akhir) : undefined,
    },
  });
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
  getTotalJumlahDesa, // Tambahkan ini
};
