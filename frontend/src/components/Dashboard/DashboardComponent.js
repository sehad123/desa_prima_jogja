import React, { useEffect, useState, useRef } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import useMediaQuery from "../useMediaQuery";
import html2canvas from "html2canvas";
import DoughnutChart from "../Chart/DoughnutChart";
import LineChart from "../Chart/LineChart"; // Import komponen LineChart
import Informasi from "./Informasi";
import { toast } from "react-hot-toast";

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

const DashboardComponent = ({
  data,
  lineChartData = [],
  profil,
}) => {
  const LineChartRef = useRef(null);
  const DoughnutChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [desaList, setDesaList] = useState([]);
  const [timelineLabels, setTimelineLabels] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [LineChartImage, setLineChartImage] = useState(null);
  const [DoughnutChartImage, setDoughnutChartImage] = useState(null);
  const { tanggal_awal, tanggal_akhir} = data;

  const generateTimelineLabels = (tanggal_awal, tanggal_akhir, points = 5) => {
    if (
      !tanggal_awal ||
      !tanggal_akhir ||
      isNaN(new Date(tanggal_awal)) ||
      isNaN(new Date(tanggal_akhir))
    ) {
      console.warn(
        "⚠️ Skip generating timeline labels, invalid start or end date:",
        tanggal_awal,
        tanggal_akhir
      );
      return [];
    }
  
    const awal = new Date(tanggal_awal);
    const akhir = new Date(tanggal_akhir);
    const timeline = [];
  
    for (let i = 0; i < points; i++) {
      const current = new Date(
        awal.getTime() + ((akhir - awal) / (points - 1)) * i
      );
      const formattedDate = current.toISOString().split("T")[0]; // Format YYYY-MM-DD
      timeline.push(formattedDate);
    }
  
    return timeline;
  };
  
  const countDesaPerTimeline = (timeline, lineChartData, kategori) => {
    return timeline.map((date) => {
      const count = lineChartData.filter((data) => {
        const dataStart = data.tanggal_pembentukan
          ? new Date(data.tanggal_pembentukan)
          : null;
        const timelineDate = new Date(date);
  
        if (!dataStart || isNaN(dataStart)) {
          console.warn(
            `🚨 Tahun pembentukan tidak valid untuk data ID ${data.id}:`,
            data
          );
          return false;
        }
  
        return data.kategori === kategori && dataStart <= timelineDate;
      }).length;
  
      return count;
    });
  };

  const lineChart = {
    labels: timelineLabels,
    datasets: [
      {
        label: "maju",
        data: countDesaPerTimeline(timelineLabels, lineChartData, "Maju"),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: false,
      },
      {
        label: "berkembang",
        data: countDesaPerTimeline(timelineLabels, lineChartData, "Berkembang"),
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: false,
      },
      {
        label: "tumbuh",
        data: countDesaPerTimeline(timelineLabels, lineChartData, "Tumbuh"),
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.2)",
        fill: false,
      },
      {
        label: "total kelompok",
        data: timelineLabels.map(
          (date) =>
            countDesaPerTimeline(timelineLabels, lineChartData, "Maju")[
              timelineLabels.indexOf(date)
            ] +
            countDesaPerTimeline(timelineLabels, lineChartData, "Berkembang")[
              timelineLabels.indexOf(date)
            ] +
            countDesaPerTimeline(timelineLabels, lineChartData, "Tumbuh")[
              timelineLabels.indexOf(date)
            ]
        ),
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: false,
      },
      {
        label: "total desa",
        data: timelineLabels.map(() => lineChartData.totalDesa),
        borderColor: "#999999",
        backgroundColor: "rgba(153, 153, 153, 0.2)",
        fill: false,
      },
    ],
  };

 // Fungsi untuk mengonversi chart ke gambar
 const convertChartToImage = (chartRef, setImage) => {
  if (chartRef.current) {
    const canvas = chartRef.current.querySelector("canvas");
    if (canvas) {
      html2canvas(canvas).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        setImage(image);
      });
    }
  }
};

 useEffect(() => {
    // Cek apakah ada notifikasi login yang perlu ditampilkan
    const showToast = localStorage.getItem('showLoginToast');
    if (showToast) {
      toast.success("Login ke SiMoPri berhasil!");
      localStorage.removeItem('showLoginToast'); // Hapus setelah ditampilkan
    }
  }, []);

useEffect(() => {
  const timeout = setTimeout(() => {
    if (LineChartRef.current && DoughnutChartRef.current) {
      convertChartToImage(LineChartRef, setLineChartImage);
      convertChartToImage(DoughnutChartRef, setDoughnutChartImage);
    }
  }, 1000); // Tunggu 1 detik sebelum mengambil gambar

  return () => clearTimeout(timeout);
}, [LineChartRef.current, DoughnutChartRef.current]);

useEffect(() => {
  if (
    !tanggal_awal ||
    !tanggal_akhir ||
    isNaN(new Date(tanggal_awal)) ||
    isNaN(new Date(tanggal_akhir))
  ) {
    console.warn(
      "Skipping generateTimelineLabels due to invalid date:",
      tanggal_awal,
      tanggal_akhir
    );
    return;
  }

  console.log("Generating timeline labels for:", tanggal_awal, tanggal_akhir);
  const labels = generateTimelineLabels(tanggal_awal, tanggal_akhir);
  setTimelineLabels(labels);
}, [tanggal_awal, tanggal_akhir]);

  return (
    <>
       <div>
              <Informasi
                isMobile={isMobile}
                data={data}
                profil={profil}
                lineChart={LineChartImage}
                doughnutChart={DoughnutChartImage}
              />
            </div>

      <div className="py-5 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:px-2">
        {/* Line Chart */}
        <div
          ref={LineChartRef}
          className="lg:col-span-2 bg-white shadow-md p-6 rounded-md"
        >
          <LineChart data={lineChart} ref={LineChartRef} />
        </div>

        {/* Doughnut Chart */}
        <div
          ref={DoughnutChartRef}
          className="bg-white shadow-md p-6 rounded-md"
        >
          <DoughnutChart data={data} ref={DoughnutChartRef} />
        </div>
      </div>
    </>
  );
};

export default DashboardComponent;