import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
import Header from "./Header";
import Informasi from "./Informasi";
import PetaDesa from "./PetaDesa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { PDFDownloadLink, PDFViewer, Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import DoughnutChart from "../Chart/DoughnutChart";
import LineChart from "../Chart/LineChart";
import useMediaQuery from "../useMediaQuery";
import ReportDashboard from "./ReportDashboard"; // Import komponen ReportDashboard

const generateTimelineLabels = (startDate, endDate, points = 5) => {
  if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
    console.warn("⚠️ Skip generating timeline labels, invalid start or end date:", startDate, endDate);
    return [];
  }

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
  const [timelineLabels, setTimelineLabels] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  const fetchDesaData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/desa");
      console.log("📡 Data Desa dari API:", response.data);

      if (response.data.length > 0) {
        const validDates = response.data.map((desa) => (desa.tahun_pembentukan ? new Date(desa.tahun_pembentukan) : null)).filter((date) => date !== null && !isNaN(date.getTime()));

        console.log("✅ Tahun Pembentukan Valid:", validDates);

        if (validDates.length > 0) {
          const minDate = new Date(Math.min(...validDates.map((date) => date.getTime())));
          const maxDate = new Date(Math.max(...validDates.map((date) => date.getTime())));

          console.log("🗓️ Periode Awal (Dari Tahun Pembentukan):", minDate.toISOString());
          console.log("🗓️ Periode Akhir (Dari Tahun Pembentukan):", maxDate.toISOString());

          setStartDate(minDate.toISOString());
          setEndDate(maxDate.toISOString());
        } else {
          console.warn("⚠️ Tidak ada `tahun_pembentukan` yang valid.");
        }
      }

      setDesaList(response.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Gagal memuat data desa:", err);
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  const fetchKabupatenData = async () => {
    try {
      const response = await axios.get("https://ibnux.github.io/data-indonesia/kabupaten/34.json");
      setKabupatenData(response.data);
    } catch (err) {
      console.error("Gagal memuat data kabupaten:", err);
    }
  };

  const fetchKecamatan = (kabupatenId) => {
    axios
      .get(`https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`)
      .then((res) => setKecamatanList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfil(response.data);
      } catch (error) {
        console.error("Gagal mengambil profil:", error.response?.data?.error || error.message);
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

        const totalDesaResponse = await axios.get("http://localhost:5000/api/kabupaten/total-desa");
        setTotalDesa(totalDesaResponse.data.totalJumlahDesa || 0);

        const majuResponse = await axios.get("http://localhost:5000/api/desa/count/desa/maju", { headers });
        setDesaMaju(majuResponse.data.count);

        const berkembangResponse = await axios.get("http://localhost:5000/api/desa/count/desa/berkembang", { headers });
        setDesaBerkembang(berkembangResponse.data.count);

        const tumbuhResponse = await axios.get("http://localhost:5000/api/desa/count/desa/tumbuh", { headers });
        setDesaTumbuh(tumbuhResponse.data.count);

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
      console.warn("Skipping generateTimelineLabels due to invalid date:", startDate, endDate);
      return;
    }

    console.log("Generating timeline labels for:", startDate, endDate);
    const labels = generateTimelineLabels(startDate, endDate);
    setTimelineLabels(labels);
  }, [startDate, endDate]);

  const countDesaPerTimeline = (timeline, desaList, kategori) => {
    return timeline.map((date) => {
      const count = desaList.filter((desa) => {
        const desaStart = desa.tahun_pembentukan ? new Date(desa.tahun_pembentukan) : null;
        const timelineDate = new Date(date);

        if (!desaStart || isNaN(desaStart)) {
          console.warn(`🚨 Tahun pembentukan tidak valid untuk desa ID ${desa.id}:`, desa);
          return false;
        }

        return desa.kategori === kategori && desaStart <= timelineDate;
      }).length;

      return count;
    });
  };

  const lineChartData = {
    labels: timelineLabels,
    datasets: [
      {
        label: "maju",
        data: countDesaPerTimeline(timelineLabels, desaList, "Maju"),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: false,
      },
      {
        label: "berkembang",
        data: countDesaPerTimeline(timelineLabels, desaList, "Berkembang"),
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: false,
      },
      {
        label: "tumbuh",
        data: countDesaPerTimeline(timelineLabels, desaList, "Tumbuh"),
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.2)",
        fill: false,
      },
      {
        label: "total kelompok",
        data: timelineLabels.map(
          (date) =>
            countDesaPerTimeline(timelineLabels, desaList, "Maju")[timelineLabels.indexOf(date)] +
            countDesaPerTimeline(timelineLabels, desaList, "Berkembang")[timelineLabels.indexOf(date)] +
            countDesaPerTimeline(timelineLabels, desaList, "Tumbuh")[timelineLabels.indexOf(date)]
        ),
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: false,
      },
      {
        label: "total desa",
        data: timelineLabels.map(() => totalDesa),
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

  const handlePrint = async () => {
    const canvasDoughnut = DoughnutChartRef.current?.canvas;
    const canvasLine = LineChartRef.current?.canvas;

    if (!canvasDoughnut || !canvasLine) {
      console.error("Canvas not found");
      return;
    }

    const doughnutImage = canvasDoughnut.toDataURL("image/png");
    const lineImage = canvasLine.toDataURL("image/png");

    setDoughnutChartImage(doughnutImage);
    setLineChartImage(lineImage);

    // Tunggu hingga state diupdate
    setTimeout(() => {
      const pdf = (
        <ReportDashboard
          profil={profil}
          totalDesa={totalDesa}
          totalJumlahDesa={totalJumlahDesa}
          desaMaju={desaMaju}
          desaBerkembang={desaBerkembang}
          desaTumbuh={desaTumbuh}
          DoughnutChartImage={doughnutImage}
          LineChartImage={lineImage}
          isMobile={isMobile}
        />
      );

      // Gunakan PDFDownloadLink untuk mengunduh PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
      link.download = "desa-prima-yogyakarta.pdf";
      link.click();
    }, 100);
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
    <div>
      <Header />

      <div className="flex space-x-4 justify-end items-center pt-4 px-5">
        <div className="flex justify-center px-3 py-2 space-x-2 text-sm lg:text-lg font-semibold bg-green-200 hover:bg-green-400 rounded-md shadow-sm cursor-pointer text-green-700 hover:text-white">
          <PDFDownloadLink
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
            fileName="desa-prima-yogyakarta.pdf"
          >
            {({ loading }) => (loading ? "Loading document..." : <FontAwesomeIcon icon={faPrint} />)}
          </PDFDownloadLink>
        </div>

        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 shadow-md" onClick={() => navigate("/kabupaten-page")}>
          Daftar Kabupaten/Kota
        </button>
      </div>
      <div id="dashboard-content">
        <div className="p-5">
          <Informasi data_awal={startDate} data_akhir={endDate} />
        </div>

        <div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div ref={LineChartRef} className="lg:col-span-2 bg-white shadow-md p-6 rounded-md">
            <LineChart data={lineChartData} ref={LineChartRef} />
          </div>
          <div ref={DoughnutChartRef} className="bg-white shadow-md p-6 rounded-md">
            <DoughnutChart data={chartData} ref={DoughnutChartRef} />
          </div>
        </div>
      </div>
      <div className="p-5">
        <PetaDesa />
      </div>
    </div>
  );
};

export default DashboardPage;
