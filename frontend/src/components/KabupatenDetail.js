import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Audio } from "react-loader-spinner";
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
  Title,
  DoughnutController,
} from "chart.js";
import { useNavigate, useLocation } from "react-router-dom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Breadcrumb from "./Breadcrumb";
import DoughnutChart from "./Chart/DoughnutChart";
import LineChart from "./Chart/LineChart";

// Daftarkan elemen dan skala yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController,
  ChartDataLabels
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

const generateTimelineLabels = (startDate, endDate, points = 5) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeline = [];

  for (let i = 0; i < points; i++) {
    const current = new Date(
      start.getTime() + ((end - start) / (points - 1)) * i
    );
    const formattedDate = current.toISOString().split("T")[0]; // Format YYYY-MM-DD
    timeline.push(formattedDate);
  }

  return timeline;
};

const KabupatenDetail = () => {
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const { id } = useParams();
  const [kabupaten, setKabupaten] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Hook untuk mengambil URL location

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

  const getKabupatenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("kabupaten"); // Mengambil parameter 'kabupaten' dari URL
  };

  const kabupatenName = getKabupatenFromQuery();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  // Fungsi untuk menghitung jumlah desa berdasarkan timeline dan kategori
  const countDesaPerTimeline = (timeline, kategori) => {
    return timeline.map((date) => {
      return kabupaten.desaList.filter((desa) => {
        const desaStart = desa.tahun_pembentukan
          ? new Date(desa.tahun_pembentukan)
          : null;
        const timelineDate = new Date(date);

        if (!desaStart || isNaN(desaStart)) {
          console.warn(
            `🚨 Tahun pembentukan tidak valid untuk desa ID ${desa.id}:`,
            desa
          );
          return false;
        }

        return desa.kategori === kategori && desaStart <= timelineDate;
      }).length;
    });
  };

  const timelineLabels = generateTimelineLabels(
    kabupaten.periode_awal,
    kabupaten.periode_akhir
  );
  // Data untuk chart garis
  const lineChartData = {
    labels: timelineLabels, // Label sumbu X
    datasets: [
      {
        label: "maju",
        data: countDesaPerTimeline(timelineLabels, "Maju"),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: false,
      },
      {
        label: "berkembang",
        data: countDesaPerTimeline(timelineLabels, "Berkembang"),
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: false,
      },
      {
        label: "tumbuh",
        data: countDesaPerTimeline(timelineLabels, "Tumbuh"),
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.2)",
        fill: false,
      },
      {
        label: "total kelompok",
        data: timelineLabels.map(
          (date) =>
            countDesaPerTimeline(timelineLabels, "Maju")[
              timelineLabels.indexOf(date)
            ] +
            countDesaPerTimeline(timelineLabels, "Berkembang")[
              timelineLabels.indexOf(date)
            ] +
            countDesaPerTimeline(timelineLabels, "Tumbuh")[
              timelineLabels.indexOf(date)
            ]
        ),
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: false,
      },
      {
        label: "total desa",
        data: timelineLabels.map(() => kabupaten.jumlah_desa),
        borderColor: "#999999",
        backgroundColor: "rgba(153, 153, 153, 0.2)",
        fill: false,
      },
    ],
  };

  const desaMaju = kabupaten.jumlah_maju;
  const desaBerkembang = kabupaten.jumlah_berkembang;
  const desaTumbuh = kabupaten.jumlah_tumbuh;
  const totalDesa = kabupaten.jumlah_desa;
  const totalJumlahDesa =
    kabupaten.jumlah_maju +
    kabupaten.jumlah_berkembang +
    kabupaten.jumlah_tumbuh;

  // Data untuk chart donat
  const doughnutChartData = {
    desaMaju,
    desaBerkembang,
    desaTumbuh,
    totalDesa,
    totalJumlahDesa,
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

  const percentage = ((totalDesa / kabupaten.jumlah_desa) * 100).toFixed(1);

  const breadcrumbPaths = [
    { name: "Beranda", href: "/peta-desa" },
    { name: "Kabupaten/Kota", href: "/kabupaten-page" },
    {
      name: kabupaten.nama_kabupaten || "Kabupaten Tidak Ditemukan",
      href: kabupaten.nama_kabupaten ? `/detail/${id}` : null,
    },
  ];

  return (
    <>
      <div className="p-5">
        <Breadcrumb items={breadcrumbPaths} />
        <div className="bg-white p-4 rounded-md">
          <div className="px-2 flex justify-between items-center mb-4">
            <h1 className="text-lg lg:text-2xl font-medium">
              {kabupaten.nama_kabupaten === "Kota Yogyakarta"
                ? kabupaten.nama_kabupaten
                : `Kabupaten ${kabupaten.nama_kabupaten}`}
            </h1>
            <Link
              to={`/kelompok-desa?kabupaten=${
                kabupaten.nama_kabupaten === "Kota Yogyakarta"
                  ? kabupaten.nama_kabupaten
                  : `KAB. ${kabupaten.nama_kabupaten.toUpperCase()}`
              }`}
            >
              <button className="bg-blue-700 text-white text-xs lg:text-lg py-2 px-4 rounded-md shadow-md">
                Daftar Kelompok
              </button>
            </Link>
          </div>

          {/* Layout Grid 4 Bagian */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bagian Atas Kiri: Informasi Kabupaten dalam bentuk Card */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
                <h2 className="text-sm lg:text-lg font-bold mb-2">
                  Ketua Forum
                </h2>
                <p className="text-sm lg:text-lg">{kabupaten.ketua_forum}</p>
              </div>
              <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
                <h2 className="text-sm lg:text-lg font-bold mb-2">
                  Jumlah Desa
                </h2>
                <p className="text-sm lg:text-lg">{kabupaten.jumlah_desa}</p>
              </div>
              <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
                <h2 className="text-sm lg:text-lg font-bold mb-2">
                  Periode Pembentukan
                </h2>
                <p className="text-sm lg:text-lg">
                  {formatDate(kabupaten.periode_awal)} —{" "}
                  {formatDate(kabupaten.periode_akhir)}
                </p>
              </div>
              <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
                <h2 className="text-sm lg:text-lg font-bold mb-2">
                  Kelompok Desa Prima
                </h2>
                <p className="text-sm lg:text-lg">
                  {kabupaten.jumlah_maju +
                    kabupaten.jumlah_berkembang +
                    kabupaten.jumlah_tumbuh}
                </p>
              </div>
            </div>

            {/* Bagian Atas Kanan: Informasi Kategori dalam bentuk Card */}
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-sm lg:text-lg font-bold mb-4 text-center">
                Jumlah Kelompok Berdasarkan Kategori
              </h2>
              <div className="flex flex-col items-center space-y-4 px-6">
                <div className="flex justify-between w-full sm:w-40">
                  <span className="text-sm lg:text-lg text-gray-600">Maju</span>
                  <span className="text-sm lg:text-lg bg-green-200 text-green-800 px-4 py-1 rounded-md">
                    {kabupaten.jumlah_maju || 0}
                  </span>
                </div>
                <div className="flex justify-between w-full sm:w-40">
                  <span className="text-sm lg:text-lg text-gray-600">
                    Berkembang
                  </span>
                  <span className="text-sm lg:text-lg bg-blue-200 text-blue-800 px-4 py-1 rounded-md">
                    {kabupaten.jumlah_berkembang || 0}
                  </span>
                </div>
                <div className="flex justify-between w-full sm:w-40">
                  <span className="text-sm lg:text-lg text-gray-600">
                    Tumbuh
                  </span>
                  <span className="text-sm lg:text-lg bg-orange-200 text-orange-800 px-4 py-1 rounded-md">
                    {kabupaten.jumlah_tumbuh || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah */}

      <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          ref={lineChartRef}
          className="lg:col-span-2 bg-white shadow-md p-6 rounded-md"
        >
          <LineChart data={lineChartData} ref={lineChartRef} />
        </div>
        <div
          ref={doughnutChartRef}
          className="bg-white shadow-md p-6 rounded-md"
        >
          <DoughnutChart data={doughnutChartData} ref={doughnutChartRef} />
        </div>
      </div>
    </>
  );
};

export default KabupatenDetail;
