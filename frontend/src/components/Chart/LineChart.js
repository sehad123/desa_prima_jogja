import React from "react";
import { Line } from "react-chartjs-2";
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

const LineChart = ({ data, chartRef }) => {
  // Color palette for different categories
  const categoryColors = [
    { border: "#10B981", background: "rgba(16, 185, 129, 0.1)" }, // Emerald
    { border: "#F59E0B", background: "rgba(245, 158, 11, 0.1)" }, // Amber
    { border: "#EF4444", background: "rgba(239, 68, 68, 0.1)" }, // Red
    { border: "#8B5CF6", background: "rgba(139, 92, 246, 0.1)" }, // Violet
    { border: "#3B82F6", background: "rgba(59, 130, 246, 0.1)" }, // Blue
  ];

  // Enhance the dataset with different colors for each category
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const colorIndex = index % categoryColors.length;
      return {
        ...dataset,
        borderColor: categoryColors[colorIndex].border,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, categoryColors[colorIndex].background);
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          return gradient;
        },
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: categoryColors[colorIndex].border,
        pointHoverBackgroundColor: categoryColors[colorIndex].border,
        pointHoverBorderColor: "#FFFFFF",
        fill: true,
      };
    }),
  };

  // Check if mobile device
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          boxHeight: isMobile ? 10 : 14,
          maxWidth: isMobile ? 100 : 150, // Tambahkan ini
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.datasets.map((dataset, i) => ({
                text: dataset.label, // Tampilkan teks lengkap
                fillStyle: dataset.borderColor,
                strokeStyle: dataset.borderColor,
                lineWidth: 1,
                pointStyle: "circle",
                hidden: !chart.getDatasetMeta(i).visible,
                index: i
              }));
            }
            return [];
          }
        },
        itemMargin: {
          x: isMobile ? 10 : 15,
          y: isMobile ? 2 : 4
        },
        padding: isMobile ? 10 : 15,
        maxHeight: isMobile ? 80 : undefined
      }
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
          padding: { top: 10 },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 9 : 11,
          },
          maxRotation: isMobile ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 5 : 6,
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
          padding: isMobile ? { bottom: 0, top: 10 } : { bottom: 10 },
        },
        beginAtZero: true,
        grid: {
          color: "#E2E8F0",
          drawBorder: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 9 : 11,
          },
          padding: 6,
          callback: (value) => {
            if (value % (isMobile ? 40 : 20) === 0) return value;
            return null;
          },
        },
        position: isMobile ? "left" : "left", // Tetap di kiri tapi bisa disesuaikan
        suggestedMax: data.datasets.reduce((max, dataset) => {
          const datasetMax = Math.max(...dataset.data);
          return datasetMax > max ? datasetMax * 1.1 : max;
        }, 100),
      },
    },
    elements: {
      point: {
        radius: isMobile ? 3 : 4,
        hoverRadius: isMobile ? 5 : 6,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
      },
      line: {
        tension: 0.3,
        borderWidth: isMobile ? 1.5 : 2,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="bg-white ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Perkembangan Kelompok Desa Prima
        </h2>
        <div className="text-xs px-2 sm:px-3 py-1 rounded-full bg-blue-50 text-blue-600">
          Periode: {data.labels[data.labels.length - 1]}
        </div>
      </div>
      <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
        <Line data={enhancedData} options={lineChartOptions} ref={chartRef} />
      </div>
      <div className="mt-2 sm:mt-3 text-xs text-center text-gray-500 px-2">
        Data perkembangan jumlah desa per kategori dalam beberapa periode
        terakhir
      </div>
    </div>
  );
};

export default LineChart;
