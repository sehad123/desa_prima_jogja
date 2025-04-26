import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUsers, faMapMarkerAlt, faCalendarAlt, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
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
        const newCanvas = document.createElement("canvas");
        newCanvas.width = 400;
        newCanvas.height = 400;

        const context = newCanvas.getContext("2d");
        context.drawImage(canvas, 0, 0, 400, 400);

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
      convertChartToImage(lineChart, setLineChartImage);
      convertChartToImage(doughnutChart, setDoughnutChartImage);

      setTimeout(() => {
        if (LineChartImage && DoughnutChartImage) {
          console.log("Semua gambar siap, PDF bisa dihasilkan.");
        } else {
          console.warn("Gambar belum siap, harap tunggu.");
        }
      }, 1000);
    } catch (error) {
      console.error("Gagal menghasilkan gambar:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {isDashboard
                ? "Program Desa Prima Provinsi D.I. Yogyakarta"
                : isKabupaten
                ? `Program Desa Prima ${nama_kabupaten.includes("Yogyakarta") ? "" : "Kabupaten "}${nama_kabupaten}`
                : "Program Desa Prima"}
            </h1>
            <p className="text-purple-100">Ringkasan informasi program</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {isKabupaten && (
              <Link
                to={`/daftar-kelompok?kabupaten=${
                  data.nama_kabupaten === "Kota Yogyakarta"
                    ? data.nama_kabupaten
                    : `KAB. ${data.nama_kabupaten}`
                }`}
                className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg shadow hover:bg-purple-50 transition-colors"
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Daftar Kelompok
              </Link>
            )}

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
              className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg shadow hover:bg-purple-50 transition-colors"
              onClick={handleGeneratePDF}
            >
              <>
                <FontAwesomeIcon icon={faPrint} className="mr-2" />
                Unduh Laporan
              </>
            </PDFDownloadLink>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
    {/* Each item with fixed icon width */}
    <div className="flex items-start">
      <div className="w-12 mr-3 flex justify-center"> {/* Fixed width container */}
        <FontAwesomeIcon icon={faCalendarAlt} className="mt-2 text-3xl text-purple-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-500 text-sm font-medium">Periode Pembentukan</h3>
        <p className="text-gray-800 font-semibold">
          {formatTanggal(data.tanggal_awal)} - {formatTanggal(data.tanggal_akhir)}
        </p>
      </div>
    </div>

    <div className="flex items-start">
      <div className="w-12 mr-3 flex justify-center">
        <FontAwesomeIcon icon={faUsers} className="mt-2 text-3xl text-purple-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-500 text-sm font-medium">Jumlah Pelaku Usaha</h3>
        <p className="text-gray-800 font-semibold">{data.jumlahAnggota}</p>
      </div>
    </div>

    <div className="flex items-start">
      <div className="w-12 mr-3 flex justify-center">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-2 text-3xl text-purple-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-500 text-sm font-medium">Total Kelompok Desa Prima</h3>
        <p className="text-gray-800 font-semibold">{data.totalJumlahKelompok}</p>
      </div>
    </div>

    <div className="flex items-start">
      <div className="w-12 mr-3 flex justify-center">
        <FontAwesomeIcon icon={faBoxOpen} className="mt-2 text-3xl text-purple-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-500 text-sm font-medium">Jumlah Produk</h3>
        <p className="text-gray-800 font-semibold">{data.produkPerDesa}</p>
      </div>
    </div>
  </div>

          {/* Right Column - Status Kelompok */}
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Kelompok Maju</h3>
                  <p className="text-gray-800 font-semibold">{data.desaMaju}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Maju
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Kelompok Berkembang</h3>
                  <p className="text-gray-800 font-semibold">{data.desaBerkembang}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Berkembang
                </span>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Kelompok Tumbuh</h3>
                  <p className="text-gray-800 font-semibold">{data.desaTumbuh}</p>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Tumbuh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informasi;