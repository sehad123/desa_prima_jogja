import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return "Tidak tersedia";
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const Informasi = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [namaPegawai, setNamaPegawai] = useState("");
  const [Data, setData] = useState({
    periode_awal: "",
    periode_akhir: "",
    total_desa: 0,
    jumlah_maju: 0,
    jumlah_berkembang: 0,
    jumlah_tumbuh: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data user dari localStorage
        const userId = localStorage.getItem("userId");
        const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setNamaPegawai(userResponse.data.name);

        // Ambil data kabupaten
        const kabupatenResponse = await axios.get("http://localhost:5000/api/kabupaten");
        const kabupatenList = kabupatenResponse.data;

        // Ambil data desa
        const desaResponse = await axios.get("http://localhost:5000/api/desa");
        const desaList = desaResponse.data;

        // Hitung data yang dibutuhkan
        const periodeAwal = kabupatenList.reduce(
          (min, item) => (new Date(item.periode_awal) < new Date(min) ? item.periode_awal : min),
          kabupatenList[0]?.periode_awal || ""
        );
        const periodeAkhir = kabupatenList.reduce(
          (max, item) => (new Date(item.periode_akhir) > new Date(max) ? item.periode_akhir : max),
          kabupatenList[0]?.periode_akhir || ""
        );
        const totalDesa = kabupatenList.reduce((sum, item) => sum + item.jumlah_desa, 0);
        const jumlahMaju = desaList.filter((desa) => desa.kategori === "maju").length;
        const jumlahBerkembang = desaList.filter((desa) => desa.kategori === "berkembang").length;
        const jumlahTumbuh = desaList.filter((desa) => desa.kategori === "tumbuh").length;

        setData({
          periode_awal: periodeAwal,
          periode_akhir: periodeAkhir,
          total_desa: totalDesa,
          jumlah_maju: jumlahMaju,
          jumlah_berkembang: jumlahBerkembang,
          jumlah_tumbuh: jumlahTumbuh,
        });

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="p-8 grid grid-cols-3 gap-6">
      {/* Informasi Kabupaten dalam bentuk Card */}
      <div className="col-span-2 grid grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Pegawai</h2>
          <p>{namaPegawai}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Jumlah Desa</h2>
          <p>{Data.total_desa}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Periode Pembentukan</h2>
          <p>
            {formatDate(Data.periode_awal)} — {formatDate(Data.periode_akhir)}
          </p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Kelompok Desa Prima</h2>
          <p>{Data.total_desa}</p>
        </div>
      </div>

      {/* Informasi Kategori dalam bentuk Card */}
      <div className="col-span-1 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4 text-center">
          Jumlah Kelompok Berdasarkan Kategori
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-between w-1/2">
            <span className="text-gray-600">Maju</span>
            <span className="bg-green-200 text-green-800 px-4 py-1 rounded-md">
              {Data.jumlah_maju}
            </span>
          </div>
          <div className="flex justify-between w-1/2">
            <span className="text-gray-600">Berkembang</span>
            <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-md">
              {Data.jumlah_berkembang}
            </span>
          </div>
          <div className="flex justify-between w-1/2">
            <span className="text-gray-600">Tumbuh</span>
            <span className="bg-orange-200 text-orange-800 px-4 py-1 rounded-md">
              {Data.jumlah_tumbuh}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informasi;
