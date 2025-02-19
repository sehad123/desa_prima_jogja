import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
import Header from "./Header";
import Informasi from "./Informasi";
import PetaDesa from "./PetaDesa";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import ReportDashboard from "./ReportDashboard";
import html2canvas from "html2canvas";
import DoughnutChart from "../Chart/DoughnutChart";
import LineChart from "../Chart/LineChart";
import useMediaQuery from "../useMediaQuery";

const generateTimelineLabels = (startDate, endDate, points = 5) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeline = [];
  
  for (let i = 0; i < points; i++) {
    const current = new Date(start.getTime() + ((end - start) / (points - 1)) * i);
    const formattedDate = current.toISOString().split("T")[0]; // Format YYYY-MM-DD
    timeline.push(formattedDate);
  }
  
  return timeline;
};

const DashboardPage = () => {
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [profil, setProfil] = useState({});
  const [kelompokDesa, setKelompokDesa] = useState(null);
  const [totalDesa, setTotalDesa] = useState(0);
  const [totalJumlahDesa, setTotalJumlahDesa] = useState(0);
  const [desaMaju, setDesaMaju] = useState(0);
  const [desaBerkembang, setDesaBerkembang] = useState(0);
  const [desaTumbuh, setDesaTumbuh] = useState(0);
  const [kabupatenData, setKabupatenData] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [kecamatanList, setKecamatanList] = useState([]);
  const DoughnutChartRef = useRef();
  const LineChartRef = useRef();
  const [DoughnutChartImage, setDoughnutChartImage] = useState(null);
  const [LineChartImage, setLineChartImage] = useState(null);

  const navigate = useNavigate();

  const fetchDesaData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/desa");
      setDesaList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  const fetchKabupatenData = async () => {
    try {
      const response = await axios.get(
        "https://ibnux.github.io/data-indonesia/kabupaten/34.json"
      );
      setKabupatenData(response.data);
    } catch (err) {
      console.error("Gagal memuat data kabupaten:", err);
    }
  };

  const fetchKecamatan = (kabupatenId) => {
    axios
      .get(
        `https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`
      )
      .then((res) => setKecamatanList(res.data))
      .catch((err) => console.error(err));
  };

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

        const kelompokDesaData = desaResponse.data;

        setKelompokDesa({
          ...kelompokDesaData,
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

  // const timelineLabels = generateTimelineLabels(kelompokDesa.periode_awal, kelompokDesaperiode_akhir);

  // **Data untuk LineChart**
  const lineChartData = {
    // labels: timelineLabels, // Label sumbu X
    datasets: [
      {
        label: "Desa Maju",
        // data: timelineLabels.map(() => desaMaju), // Tetap konstan untuk contoh
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: false,
      },
      {
        label: "Desa Berkembang",
        // data: timelineLabels.map(() => desaBerkembang), 
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: false,
      },
      {
        label: "Desa Tumbuh",
        // data: timelineLabels.map(() => desaTumbuh), 
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.2)",
        fill: false,
      },
      {
        label: "Total Kelompok Desa",
        // data: timelineLabels.map(() => desaTumbuh+desaMaju+desaBerkembang), 
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: false,
      },
      {
        label: "Total Desa Keseluruhan",
        // data: timelineLabels.map(() => totalJumlahDesa), 
        borderColor: "#999999",
        backgroundColor: "rgba(153, 153, 153, 0.2)",
        fill: false,
      },
    ],
  };

  const chartData = {
    desaMaju,
    desaBerkembang,
    desaTumbuh,
    totalDesa,
    totalJumlahDesa,
  };

  const captureComponentAsImage = async (ref) => {
    try {
      if (ref.current) {
        const canvas = await html2canvas(ref.current, {
          logging: true, // Untuk debugging
          allowTaint: true, // Mengizinkan gambar eksternal
          useCORS: true, // Menggunakan CORS untuk gambar eksternal
        });
        const imageUrl = canvas.toDataURL("image/png");
        console.log("Generated image URL:", imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    }
    return null;
  };

  const debugElements = () => {
    console.log("DoughnutChartRef:", DoughnutChartRef.current);
    console.log("LineChartRef:", LineChartRef.current);
  };

  const generatePDF = async () => {
    setTimeout(async () => {
      const DoughnutChartImg = await captureComponentAsImage(DoughnutChartRef);
      const LineChartImg = await captureComponentAsImage(LineChartRef);

      if (!DoughnutChartImg || !LineChartImg) {
        alert(
          "Gambar gagal dihasilkan. Pastikan elemen-elemen yang diperlukan terlihat dan ter-render dengan benar."
        );
        return;
      }

      setDoughnutChartImage(DoughnutChartImg);
      setLineChartImage(LineChartImg);
    }, 2000); // Tunggu 500ms untuk memberi waktu rendering elemen
  };

  const handlePrint = async () => {
    try {
      debugElements();
      await generatePDF();

      if (!DoughnutChartImage || !LineChartImage) {
        throw new Error(
          "Gambar tidak valid, pastikan gambar dapat diambil dengan benar."
        );
      }
    } catch (error) {
      console.error("Error during PDF generation:", error);
    }
  };

  useEffect(() => {
    fetchDesaData();
    fetchKabupatenData();
  }, []);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatan(selectedKabupaten);
    }
  }, [selectedKabupaten]);

  // Halaman loading
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

  return (
    <>
      <Header />
      <div className="flex space-x-4 justify-end items-center pt-4 px-5">
  {/* Tombol Cetak PDF */}
  <div className="flex justify-center px-3 py-2 space-x-2 text-sm lg:text-lg font-semibold bg-green-200 hover:bg-green-400 rounded-md shadow-sm cursor-pointer text-green-700 hover:text-white">
    <BlobProvider
      document={
        <ReportDashboard
          profil={profil}
          totalDesa={totalDesa}
          totalJumlahDesa={totalJumlahDesa}
          desaMaju={desaMaju}
          desaBerkembang={desaBerkembang}
          desaTumbuh={desaTumbuh}
          DoughnutChartImage={DoughnutChartImage}
          LineChartImage={LineChartImage}
          isMobile={isMobile}
        />
      }
    >
      {({ url, blob }) => {
        console.log("Generated URL:", url);
        console.log("Generated Blob:", blob);

        if (url) {
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 py-1 px-2 rounded-md"
            >
              <FontAwesomeIcon icon={faPrint} />
              <span className="sm:text-sm">Cetak PDF</span>
            </a>
          );
        } else {
          return <div>Failed to generate PDF</div>;
        }
      }}
    </BlobProvider>
  </div>

  {/* Tombol Daftar Kabupaten/Kota */}
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 shadow-md"
    onClick={() => navigate("/kabupaten-page")}
  >
    Daftar Kabupaten/Kota
  </button>
</div>

      <div className="p-5">
        <Informasi />
      </div>

      <div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          ref={LineChartRef}
          className="lg:col-span-2 bg-white shadow-md p-6 rounded-md"
        >
          <LineChart data={lineChartData} ref={LineChartRef} />
        </div>
        <div
          ref={DoughnutChartRef}
          className="bg-white shadow-md p-6 rounded-md"
        >
          <DoughnutChart data={chartData} ref={DoughnutChartRef} />
        </div>
      </div>
      <div className="p-5">
        <PetaDesa />
      </div>
    </>
  );
};

export default DashboardPage;
