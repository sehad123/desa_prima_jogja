import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import ReportDashboard from "./ReportDashboard";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation, useParams, Link } from "react-router-dom";
import { formatTanggal, formatRupiah } from "../utils/format";

const Informasi = ({
  data = [],
  profil = [],
  isMobile,
  lineChart,
  doughnutChart,
}) => {
  const location = useLocation();
  const { nama_kabupaten } = useParams();
  const isDashboard = location.pathname === "/provinsi-dashboard";
  const isKabupaten = location.pathname.startsWith("/kabupaten-dashboard/");
  const [DoughnutChartImage, setDoughnutChartImage] = useState(null);
  const [LineChartImage, setLineChartImage] = useState(null);

  const pageType = location.pathname.includes("provinsi-dashboard")
    ? "provinsi"
    : location.pathname.includes("kabupaten-dashboard")
    ? "kabupaten"
    : "default";

  const convertChartToImage = (chartRef, setImage) => {
    if (chartRef.current) {
      const canvas = chartRef.current.querySelector("canvas");
      if (canvas) {
        // Buat canvas baru dengan ukuran yang sesuai
        const newCanvas = document.createElement("canvas");
        newCanvas.width = 400; // Sesuaikan dengan ukuran yang diinginkan
        newCanvas.height = 400;

        const context = newCanvas.getContext("2d");
        context.drawImage(canvas, 0, 0, 400, 400); // Render ulang dengan ukuran yang sesuai

        const image = newCanvas.toDataURL("image/png");
        setImage(image);
      }
    }
  };

  useEffect(() => {
    if (LineChartImage && DoughnutChartImage) {
      // Semua gambar sudah siap, PDF bisa dihasilkan
    }
  }, [LineChartImage, DoughnutChartImage]);

  const handleGeneratePDF = async () => {
    try {
      // Konversi grafik ke gambar
      convertChartToImage(lineChart, setLineChartImage);
      convertChartToImage(doughnutChart, setDoughnutChartImage);

      // Tunggu hingga semua gambar siap
      setTimeout(() => {
        if (LineChartImage && DoughnutChartImage) {
          console.log("Semua gambar siap, PDF bisa dihasilkan.");
        } else {
          console.warn("Gambar belum siap, harap tunggu.");
        }
      }, 1000); // Beri waktu untuk rendering
    } catch (error) {
      console.error("Gagal menghasilkan gambar:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row p-0 lg:p-2">
      <div className="flex flex-col w-full space-y-6">
        <div className="bg-white p-6 shadow rounded-md">
          <div className="pb-1 lg:border-b-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-xl font-semibold mb-2 md:mb-0 line-clamp-2">
              {isDashboard
                ? "Informasi Program Desa Prima Provinsi D.I. Yogyakarta"
                : isKabupaten
                ? `Informasi Program Desa Prima ${
                    nama_kabupaten.includes("Yogyakarta") ? "" : "Kabupaten "
                  }${nama_kabupaten}`
                : "Informasi Program Desa Prima"}
            </h1>
            <div className="flex flex-row space-x-3 pb-0 lg:pb-2">
              {/* Tombol Daftar Kelompok */}
              {isKabupaten && (
                <div className="px-2 py-1 font-semibold bg-secondary hover:bg-purple-400 rounded-md shadow-sm cursor-pointer text-white flex items-center justify-center min-h-[40px]">
                  <Link
                    to={`/daftar-kelompok?kabupaten=${
                      data.nama_kabupaten === "Kota Yogyakarta"
                        ? data.nama_kabupaten
                        : `KAB. ${data.nama_kabupaten}`
                    }`}
                  >
                    Daftar Kelompok
                  </Link>
                </div>
              )}

              {/* Tombol Cetak */}
              <div className="flex justify-center px-2 py-1 md:px-1 md:py-1 space-x-2 text-sm lg:text-lg font-semibold bg-blue-200 hover:bg-blue-400 rounded-md shadow-sm cursor-pointer text-blue-700 hover:text-white">
                <PDFDownloadLink
                  document={
                    <ReportDashboard
                      page={pageType}
                      profil={profil}
                      data={data}
                      lineChartImage={lineChart}
                      doughnutChartImage={doughnutChart}
                      isMobile={isMobile}
                    />
                  }
                  fileName="dashboard-desa.pdf"
                  className="flex justify-center px-2 py-1 space-x-2 font-semibold bg-blue-200 hover:bg-blue-400 rounded-md shadow-sm cursor-pointer text-blue-700 hover:text-white"
                  onClick={handleGeneratePDF}
                >
                  <>
                    Unduh
                    <FontAwesomeIcon className="m-1" icon={faPrint} />
                  </>
                </PDFDownloadLink>
              </div>
            </div>
          </div>

          <div className="mt-5 ml-2 flex flex-col space-y-4 lg:space-y-0 lg:space-x-20 lg:flex-row">
            {/* Bagian Kiri */}
            <div className="space-y-2 w-full lg:w-1/2">
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-1/2 mb-1">
                  <strong>Periode Pembentukan</strong>
                </p>
                <p className="text-gray-600 lg:ml-2 mb-2">
                  {formatTanggal(data.tanggal_awal)} -{" "}
                  {formatTanggal(data.tanggal_akhir)} 
                </p>
              </div>
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-1/2 mb-1">
                  <strong>Jumlah Pelaku Usaha</strong>
                </p>
                <p className="text-gray-600 lg:ml-2 mb-2">
                  {data.jumlahAnggota}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-1/2 mb-1">
                  <strong>Total Kelompok Desa Prima</strong>
                </p>
                <p className="text-gray-600 lg:ml-2 mb-2">
                  {data.totalJumlahKelompok}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-1/2">
                  <strong>Jumlah Produk</strong>
                </p>
                <p className="text-gray-600 lg:ml-2">{data.produkPerDesa}</p>
              </div>
            </div>

            {/* Bagian Kanan */}
            <div className="space-y-2 w-full lg:w-1/2">
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-2/3">
                  <strong>Jumlah Kelompok Maju</strong>
                </p>
                <p className="flex items-center justify-center lg:w-20 text-sm lg:text-lg bg-green-200 text-green-800 px-4 py-1 rounded-md">
                  {data.desaMaju}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-2/3">
                  <strong>Jumlah Kelompok Berkembang</strong>
                </p>
                <p className="flex items-center justify-center lg:w-20 text-sm lg:text-lg bg-yellow-200 text-yellow-800 px-4 py-1 rounded-md">
                  {data.desaBerkembang}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row items-start">
                <p className="text-gray-600 flex-shrink-0 w-full lg:w-2/3">
                  <strong>Jumlah Kelompok Tumbuh</strong>
                </p>
                <p className="flex items-center justify-center lg:w-20 text-sm lg:text-lg bg-red-200 text-red-800 px-4 py-1 rounded-md">
                  {data.desaTumbuh}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informasi;
