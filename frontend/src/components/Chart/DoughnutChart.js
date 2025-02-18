import { forwardRef, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrasi plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = forwardRef(({ data }, ref) => {
  const chartRef = useRef(null);
  const { desaMaju, desaBerkembang, desaTumbuh, totalDesa, totalJumlahDesa } =
    data;

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

      ctx.fillText(`${percentageKelompok}%`, centerX, centerY + 50);
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("Kelompok Desa", centerX, centerY + 71);

      ctx.restore();
    },
  };

  const desaDalamProses = totalDesa - totalJumlahDesa;

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
    plugins: {
      centerText: {
        totalDesa: totalDesa,
        totalJumlahDesa: totalJumlahDesa,
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
      <h2 className="text-lg font-bold text-center">
        Desa Berdasarkan Kategori
      </h2>
      <div className="relative flex justify-center items-center w-full h-[300px] lg:h-[400px]">
        <Doughnut
          ref={chartRef}
          data={doughnutChartData}
          options={doughnutChartOptions}
          plugins={[centerTextPlugin]} // Perbaikan: Plugin masuk langsung di properti ini
        />
         <button onClick={() => downloadChartImage(ref, "doughnut_chart.png")} className="absolute top-4 right-4 text-blue-500 hover:text-blue-700" title="Unduh Diagram">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M12 16l4-5h-3V3h-2v8H8l4 5zm-7 2v2h14v-2H5z" />
            </svg>
          </button>
      </div>
    </>
  );
});

export default DoughnutChart;
