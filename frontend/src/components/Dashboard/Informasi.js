import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin untuk menampilkan persentase
import DoughnutChart from "../Chart/DoughnutChart";
import LineChart from "../Chart/LineChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels // Registrasi plugin
);

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
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const Informasi = () => {
  const navigate = useNavigate();
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [profil, setProfil] = useState({});
  const [totalDesa, setTotalDesa] = useState(0);
  const [totalJumlahDesa, setTotalJumlahDesa] = useState(0);
  const [desaMaju, setDesaMaju] = useState(0);
  const [desaBerkembang, setDesaBerkembang] = useState(0);
  const [desaTumbuh, setDesaTumbuh] = useState(0);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfil(response.data);
      } catch (error) {
        console.error(
          "Gagal mengambil profil:",
          error.response?.data?.error || error.message
        );
      }
    };

    fetchProfil();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        const desaResponse = await axios.get("http://localhost:5000/api/desa", {
          headers,
        });
        setTotalJumlahDesa(desaResponse.data.length);

        const totalDesaResponse = await axios.get(
          "http://localhost:5000/api/kabupaten/total-desa"
        );
        setTotalDesa(totalDesaResponse.data.totalJumlahDesa || 0);

        const majuResponse = await axios.get(
          "http://localhost:5000/api/desa/count/desa/maju",
          { headers }
        );
        setDesaMaju(majuResponse.data.count);

        const berkembangResponse = await axios.get(
          "http://localhost:5000/api/desa/count/desa/berkembang",
          { headers }
        );
        setDesaBerkembang(berkembangResponse.data.count);

        const tumbuhResponse = await axios.get(
          "http://localhost:5000/api/desa/count/desa/tumbuh",
          { headers }
        );
        setDesaTumbuh(tumbuhResponse.data.count);

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Memuat data...</div>;
  }

  return (
    <div className="space-y-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Informasi Kabupaten dalam bentuk Card */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Pegawai</h2>
          <p>{profil.name || "Tidak tersedia"}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Jumlah Desa</h2>
          <p>{totalDesa}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Periode Pembentukan</h2>
          <p>17 Desember - 20 Desember 2025</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Kelompok Desa Prima</h2>
          <p>{totalJumlahDesa}</p>{" "}
          {/* Menggunakan properti baru untuk jumlah desa kabupaten */}
        </div>
      </div>

      {/* Informasi Kategori dalam bentuk Card */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4 text-center">
          Jumlah Kelompok Berdasarkan Kategori
        </h2>
        <div className="flex flex-col items-center space-y-4 px-6">
          <div className="flex justify-between w-full sm:w-40">
            <span className="text-gray-600">Maju</span>
            <span className="bg-green-200 text-green-800 px-4 py-1 rounded-md">
              {desaMaju}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-40">
            <span className="text-gray-600">Berkembang</span>
            <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-md">
              {desaBerkembang}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-40">
            <span className="text-gray-600">Tumbuh</span>
            <span className="bg-orange-200 text-orange-800 px-4 py-1 rounded-md">
              {desaTumbuh}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informasi;
