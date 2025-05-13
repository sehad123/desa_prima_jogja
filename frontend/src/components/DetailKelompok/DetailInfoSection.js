import React, { useState } from "react";
import { formatTanggal, formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportKelompokDesa from "./ReportKelompokDesa";

const DetailInfoSection = ({
  desa,
  profil,
  galeri,
  produk,
  pengurus,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Function to determine category color
  const getCategoryColor = (kategori) => {
    switch (kategori) {
      case "Maju":
        return "bg-green-100 text-green-800";
      case "Berkembang":
        return "bg-yellow-100 text-yellow-800";
      case "Tumbuh":
        return "bg-blue-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-500 p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-white">{desa.nama}</h1>
          <span
            className={`px-3 py-1 rounded-full text-md font-large ${getCategoryColor(
              desa.kategori
            )}`}
          >
            {desa.kategori}
          </span>
        </div>
        <p className="text-purple-100 mt-1">
          {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel.{" "}
          {desa.kelurahanNama}
        </p>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Grid Layout for Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-purple-50 p-2 rounded-lg mr-4">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Pembentukan</p>
                <p className="font-medium">
                  {formatTanggal(desa.tanggal_pembentukan)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-50 p-2 rounded-lg mr-4">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hibah Diterima</p>
                <p className="font-medium">
                  {formatRupiah(desa.jumlah_hibah_diterima)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-50 p-2 rounded-lg mr-4">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dana Sekarang</p>
                <p className="font-medium">
                  {formatRupiah(desa.jumlah_dana_sekarang)}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-purple-50 p-2 rounded-lg mr-4">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Anggota Awal</p>
                <p className="font-medium">{desa.jumlah_anggota_awal}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-50 p-2 rounded-lg mr-4">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Anggota Sekarang</p>
                <p className="font-medium">{desa.jumlah_anggota_sekarang}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <PDFDownloadLink
            document={
              <ReportKelompokDesa
                desa={desa}
                profil={profil}
                galeri={galeri}
                produk={produk}
                pengurus={pengurus}
              />
            }
            fileName={`laporan-desa-${desa.nama}.pdf`}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            <span>Unduh</span>
          </PDFDownloadLink>

          {profil?.role === "Ketua Forum" && (
            <>
              <button
                onClick={onEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                <span>Edit</span>
              </button>

              <button
                onClick={onDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                <span>Hapus</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailInfoSection;
