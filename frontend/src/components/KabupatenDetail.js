import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

// Daftarkan elemen dan skala yang dibutuhkan
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const date = new Date(dateString);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Fungsi untuk memformat nama kabupaten
const formatKabupatenName = (kabupatenName) => {
  return kabupatenName
    .replace("Kota", "") // Menghapus kata "Kota" jika ada
    .replace(/\s+/g, "") // Menghapus semua spasi antara kata-kata
    .replace(/^(\w)/, (match) => match.toUpperCase()); // Mengubah huruf pertama menjadi huruf kapital
};

const KabupatenDetail = () => {
  const { id } = useParams();
  const [kabupaten, setKabupaten] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKabupatenDetail = async () => {
      try {
        // Fetch kabupaten details
        const kabupatenResponse = await axios.get(`http://localhost:5000/api/kabupaten/${id}`);
        const kabupatenData = kabupatenResponse.data;

        // Fetch count data for each category (Maju, Berkembang, Tumbuh)
        const categories = ["maju", "berkembang", "tumbuh"];
        const countData = {};

        // Memformat nama kabupaten
        const formattedKabupatenName = formatKabupatenName(kabupatenData.nama_kabupaten);

        // Request counts for Maju, Berkembang, Tumbuh
        for (const category of categories) {
          try {
            const response = await axios.get(`http://localhost:5000/api/desa/count/${formattedKabupatenName}/${category}`);
            countData[category] = response.data.count || 0; // Assign 0 if count is not available
          } catch (err) {
            console.error(`Gagal memuat data untuk kategori ${category}`, err);
            countData[category] = 0;
          }
        }

        // Merge kabupaten data with count data
        setKabupaten({
          ...kabupatenData,
          jumlah_maju: countData.maju,
          jumlah_berkembang: countData.berkembang,
          jumlah_tumbuh: countData.tumbuh,
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat detail kabupaten", err);
        setLoading(false);
      }
    };

    fetchKabupatenDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!kabupaten) return <div>Data tidak ditemukan</div>;

  // Data untuk chart garis
  const lineChartData = {
    labels: ["05/01/2024", "12/01/2024", "19/01/2024", "26/01/2024", "02/02/2024", "09/02/2024", "29/02/2024"],
    datasets: [
      {
        label: "Target",
        data: [20, 40, 60, 80, 100, 100, 100],
        borderColor: "#999999",
        fill: false,
      },
      {
        label: "Realisasi",
        data: [10, 30, 50, 70, 90, 95, 100],
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  // Data untuk chart donat
  const doughnutChartData = {
    labels: ["Maju", "Berkembang", "Tumbuh", "Dalam Proses"],
    datasets: [
      {
        data: [kabupaten.jumlah_maju, kabupaten.jumlah_berkembang, kabupaten.jumlah_tumbuh, 20],
        backgroundColor: ["#4CAF50", "#FFC107", "#FF5722", "#CCCCCC"],
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  const totalDesa = kabupaten.jumlah_maju + kabupaten.jumlah_berkembang + kabupaten.jumlah_tumbuh;
  const percentage = ((totalDesa / kabupaten.jumlah_desa) * 100).toFixed(1);

  return (
    <div className="p-5">
      <Header onLogout={handleLogout} />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{kabupaten.nama_kabupaten === "Kota Yogyakarta" ? kabupaten.nama_kabupaten : `Kabupaten ${kabupaten.nama_kabupaten}`}</h1>
        <Link to={`/kelompok-desa?kabupaten=${kabupaten.nama_kabupaten === "Kota Yogyakarta" ? kabupaten.nama_kabupaten : `KAB. ${kabupaten.nama_kabupaten.toUpperCase()}`}`}>
          <button className="bg-blue-700 text-white py-2 px-4 rounded-md shadow-md">Daftar Desa</button>
        </Link>
      </div>

      {/* Layout Grid 4 Bagian */}
      <div className="grid grid-cols-4 gap-6">
        {/* Bagian Atas Kiri: Informasi Kabupaten dalam bentuk Card */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">Ketua Forum</h2>
            <p>{kabupaten.ketua_forum}</p>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">Jumlah Desa</h2>
            <p>{kabupaten.jumlah_desa}</p>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">Periode Pembentukan</h2>
            <p>
              {formatDate(kabupaten.periode_awal)} — {formatDate(kabupaten.periode_akhir)}
            </p>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2">Kelompok Desa Prima</h2>
            <p>{kabupaten.jumlah_maju + kabupaten.jumlah_berkembang + kabupaten.jumlah_tumbuh}</p>
          </div>
        </div>

        {/* Bagian Atas Kanan: Informasi Kategori dalam bentuk Card */}
        <div className="col-span-2 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4 text-center">Jumlah Kelompok Berdasarkan Kategori</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between w-1/2">
              <span className="text-gray-600">Maju</span>
              <span className="bg-green-200 text-green-800 px-4 py-1 rounded-md">{kabupaten.jumlah_maju || 0}</span>
            </div>
            <div className="flex justify-between w-1/2">
              <span className="text-gray-600">Berkembang</span>
              <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-md">{kabupaten.jumlah_berkembang || 0}</span>
            </div>
            <div className="flex justify-between w-1/2">
              <span className="text-gray-600">Tumbuh</span>
              <span className="bg-orange-200 text-orange-800 px-4 py-1 rounded-md">{kabupaten.jumlah_tumbuh || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Grafik Periodik */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Grafik Periodik</h2>
          <Line data={lineChartData} />
        </div>

        {/* Diagram */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Jumlah Kelompok Desa Prima Berdasarkan Kategori</h2>
          {/* Perkecil ukuran diagram dengan style */}
          <div className="relative w-1/2 mx-auto">
            <Doughnut data={doughnutChartData} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl mt-[50px] font-bold">{percentage}%</p>
              <p className="text-sm text-gray-500">Desa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KabupatenDetail;