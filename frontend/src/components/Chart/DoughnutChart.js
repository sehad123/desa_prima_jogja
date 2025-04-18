import React, { useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = ({ data, chartRef }) => {
  const {
    desaMaju,
    desaBerkembang,
    desaTumbuh,
    jumlah_desa,
    totalJumlahKelompok,
  } = data;

  // Fungsi untuk menentukan offset Y berdasarkan ukuran layar
  const getCenterYOffset = () => {
    const width = window.innerWidth;

    if (width < 500) {
      return 50; // HP menggunakan aturan desktop full
    } else if (width < 1024) {
      return 30; // Setengah desktop
    } else {
      return 50; // Desktop full
    }
  };

  // Plugin untuk menampilkan teks di tengah
  const centerTextPlugin = {
    id: "centerText",
    afterDraw: (chart) => {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;
      if (!chart.config.data.datasets.length) return;

      // Ambil totalDesa dari options
      const totalDesaValue = chart.config.options.plugins.centerText.totalDesa;

      // Hitung total data di chart
      const totalData = chart.config.options.plugins.centerText.totalJumlahDesa;
      const percentageKelompok = ((totalData / totalDesaValue) * 100).toFixed(
        1
      );

      ctx.save();
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Posisi teks di tengah chart
      const centerX = width / 2;
      const centerY = height / 2;

      const centerYOffset = getCenterYOffset(); // Dapatkan offset Y berdasarkan ukuran layar

      // Gambar teks persentase
      ctx.fillText(`${percentageKelompok}%`, centerX, centerY + centerYOffset);

      // Gambar teks "Kelompok Desa"
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("Kelompok Desa", centerX, centerY + centerYOffset + 21);

      ctx.restore();
    },
  };

  const desaDalamProses = jumlah_desa - totalJumlahKelompok;

  const doughnutChartData = {
    labels: ["Maju", "Berkembang", "Tumbuh", "Dalam Proses"],
    datasets: [
      {
        data: [desaMaju, desaBerkembang, desaTumbuh, desaDalamProses],
        backgroundColor: ["#4CAF50", "#FFC107", "#FF5722", "#808080"],
      },
    ],
  };

  const doughnutChartOptions = {
    cutout: "50%", // Pastikan ada ruang untuk teks di tengah
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      centerText: {
        totalDesa: jumlah_desa,
        totalJumlahDesa: totalJumlahKelompok,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.dataset;
            const value = dataset.data[context.dataIndex];
            const total = dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 25,
          font: {
            size: 14,
          },
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 12,
          weight: "bold",
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <>
      <h2 className="text-sm lg:text-lg font-bold text-center">
        Persentase Kelompok Menurut Kategori
      </h2>
      <div className="relative flex justify-center items-center w-full h-[300px] lg:h-[400px]">
        <Doughnut
          ref={chartRef}
          data={doughnutChartData}
          options={doughnutChartOptions}
          plugins={[centerTextPlugin]} // Plugin untuk teks di tengah
        />
      </div>
    </>
  );
};

export default DoughnutChart;
