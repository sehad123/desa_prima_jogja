import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  const categoryColors = [
    { border: "#10B981", background: "rgba(16, 185, 129, 0.1)" },
    { border: "#F59E0B", background: "rgba(245, 158, 11, 0.1)" },
    { border: "#EF4444", background: "rgba(239, 68, 68, 0.1)" },
    { border: "#8B5CF6", background: "rgba(139, 92, 246, 0.1)" },
    { border: "#3B82F6", background: "rgba(59, 130, 246, 0.1)" },
  ];

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const colorIndex = index % categoryColors.length;
      return {
        ...dataset,
        borderColor: categoryColors[colorIndex].border,
        backgroundColor: categoryColors[colorIndex].background, // Menggunakan solid color sebagai alternatif
        pointBackgroundColor: categoryColors[colorIndex].border,
        pointBorderColor: categoryColors[colorIndex].border,
        pointHoverBackgroundColor: categoryColors[colorIndex].border,
        pointHoverBorderColor: "#FFFFFF",
        fill: true,
      };
    }),
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      onComplete: () => {
        // Chart selesai dirender
      },
    },
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "top",
        align: isMobile ? "center" : "end",
        labels: {
          color: "#1E293B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 10 : 12,
            weight: "500",
          },
          padding: isMobile ? 12 : 20,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: isMobile ? 10 : 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Periode",
          color: "#64748B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 10 : 12,
            weight: "500",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 9 : 11,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Jumlah Desa",
          color: "#64748B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 10 : 12,
            weight: "500",
          },
        },
        beginAtZero: true,
        grid: {
          color: "#E2E8F0",
        },
        ticks: {
          color: "#64748B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 9 : 11,
          },
        },
      },
    },
  };

  const handleCaptureScreenshot = async () => {
    if (!chartContainerRef.current) return;

    try {
      // Tunggu sebentar untuk memastikan chart benar-benar terrender
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(chartContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Untuk kualitas lebih tinggi
        logging: true, // Untuk debugging
        onclone: (clonedDoc) => {
          // Memastikan chart terlihat saat dikloning
          const clonedChart = clonedDoc.getElementById('chart-container');
          if (clonedChart) {
            clonedChart.style.opacity = '1';
            clonedChart.style.visibility = 'visible';
          }
        }
      });

      // Konversi canvas ke gambar
      const image = canvas.toDataURL('image/png');
      
      // Download gambar
      const link = document.createElement('a');
      link.download = 'line-chart-screenshot.png';
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Perkembangan Kelompok Desa Prima</h2>
        <button 
          onClick={handleCaptureScreenshot}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Unduh
        </button>
      </div>
      
      <div 
        ref={chartContainerRef}
        id="chart-container"
        className="relative h-[350px]"
      >
        <Line 
          ref={chartRef}
          data={enhancedData} 
          options={lineChartOptions} 
        />
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Data perkembangan jumlah desa per kategori dalam beberapa periode terakhir
      </div>
    </div>
  );
};

export default LineChart;