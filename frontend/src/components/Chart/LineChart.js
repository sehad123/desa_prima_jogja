import React, { forwardRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const LineChart = forwardRef(({ data }, ref) => {
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5, // Mengurangi jumlah ticks di sumbu X pada mobile
        },
      },
      y: {
        beginAtZero: true,
        max: 120, // Membatasi nilai maksimal agar grafik lebih tinggi
      },
    },
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-center">
        Jumlah Kelompok Desa Prima Secara Periodik
      </h2>
      <div className="h-[300px] lg:h-[400px]">
        <Line data={data} options={lineChartOptions} ref={ref} />
      </div>
    </>
  );
});

export default LineChart;
