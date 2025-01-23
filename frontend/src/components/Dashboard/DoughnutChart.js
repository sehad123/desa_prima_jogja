import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Daftarkan elemen dan skala yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
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

// Fungsi untuk memformat nama kabupaten
const formatKabupatenName = (kabupatenName) => {
  return kabupatenName
    .replace("Kota", "") // Menghapus kata "Kota" jika ada
    .replace(/\s+/g, "") // Menghapus semua spasi antara kata-kata
    .replace(/^(\w)/, (match) => match.toUpperCase()); // Mengubah huruf pertama menjadi huruf kapital
};

const DoughnutChart = () => {
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const { id } = useParams();
  const [kabupaten, setKabupaten] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKabupatenDetail = async () => {
      try {
        // Fetch kabupaten details
        const kabupatenResponse = await axios.get(
          `http://localhost:5000/api/kabupaten/${id}`
        );
        const kabupatenData = kabupatenResponse.data;

        // Fetch count data for each category (Maju, Berkembang, Tumbuh)
        const categories = ["maju", "berkembang", "tumbuh"];
        const countData = {};

        // Memformat nama kabupaten
        const formattedKabupatenName = formatKabupatenName(
          kabupatenData.nama_kabupaten
        );

        // Request counts for Maju, Berkembang, Tumbuh
        for (const category of categories) {
          try {
            const response = await axios.get(
              `http://localhost:5000/api/desa/count/${formattedKabupatenName}/${category}`
            );
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
    labels: [
      "05/01/2024",
      "12/01/2024",
      "19/01/2024",
      "26/01/2024",
      "02/02/2024",
      "09/02/2024",
      "29/02/2024",
    ],
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
        data: [
          kabupaten.jumlah_maju,
          kabupaten.jumlah_berkembang,
          kabupaten.jumlah_tumbuh,
          20,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#FF5722", "#CCCCCC"],
      },
    ],
  };

  const downloadChartImage = (chartRef, filename) => {
    const chart = chartRef.current;
    if (!chart) return;

    // Konversi grafik ke gambar (Base64)
    const base64Image = chart.toBase64Image();
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = filename || "chart.png";
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  const totalDesa =
    kabupaten.jumlah_maju +
    kabupaten.jumlah_berkembang +
    kabupaten.jumlah_tumbuh;
  const percentage = ((totalDesa / kabupaten.jumlah_desa) * 100).toFixed(1);

  return (
   
        <div
          id="doughnut-chart-container"
          className="col-span-1 bg-white shadow-md p-6 rounded-md relative flex flex-col items-center"
        >
          {/* Header */}
          <h2 className="text-xl font-bold mb-4 text-center">
            Jumlah Kelompok Desa Prima Berdasarkan Kategori
          </h2>

          {/* Chart Container */}
          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            {/* Doughnut Chart */}
            <Doughnut ref={doughnutChartRef} data={doughnutChartData} />

            {/* Centered Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold mt-14">{percentage}%</p>
              <p className="text-sm text-gray-500 mt-1">Desa</p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={() =>
              downloadChartImage(doughnutChartRef, "doughnut_chart.png")
            }
            className="absolute top-4 right-4 text-blue-500 hover:text-blue-700"
            title="Unduh Diagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M12 16l4-5h-3V3h-2v8H8l4 5zm-7 2v2h14v-2H5z" />
            </svg>
          </button>
        </div>
  );
};

export default DoughnutChart;
