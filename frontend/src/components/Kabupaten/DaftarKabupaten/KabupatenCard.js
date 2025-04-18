import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaBell } from "react-icons/fa";

const RealColor = ({ numReal, numTarget }) => {
  const num = Math.min(numReal / numTarget, 1);
  
  if (num < 0.25) {
    return (
      <>
        <span className="text-red-900 bg-red-100 px-2 ml-1 rounded-md">
          {numReal}
        </span>
        <span className="ml-auto text-xl font-bold text-red-600">
          {(num * 100).toFixed(2)}%
        </span>
      </>
    );
  } else if (num < 0.5) {
    return (
      <>
        <span className="text-orange-900 bg-orange-200 px-2 ml-1 rounded-md">
          {numReal}
        </span>
        <span className="ml-auto text-xl font-bold text-orange-400">
          {(num * 100).toFixed(2)}%
        </span>
      </>
    );
  } else if (num < 0.75) {
    return (
      <>
        <span className="text-yellow-900 bg-yellow-100 px-2 ml-1 rounded-md">
          {numReal}
        </span>
        <span className="ml-auto text-xl font-bold text-yellow-300">
          {(num * 100).toFixed(2)}%
        </span>
      </>
    );
  } else if (num < 1) {
    return (
      <>
        <span className="text-blue-900 bg-blue-100 px-2 ml-1 rounded-md">
          {numReal}
        </span>
        <span className="ml-auto text-xl font-bold text-blue-600">
          {(num * 100).toFixed(2)}%
        </span>
      </>
    );
  } else {
    return (
      <>
        <span className="text-green-900 bg-green-100 px-2 ml-1 rounded-md">
          {numReal}
        </span>
        <span className="ml-auto text-xl font-bold text-green-600">
          {(num * 100).toFixed(2)}%
        </span>
      </>
    );
  }
};

const renderStatusIcon = (statusIcon) => {
  switch (statusIcon) {
    case "disetujui":
      return <FaCheckCircle className="text-green-500 text-lg mr-2" />;
    case "perlu-perhatian":
      return <FaExclamationTriangle className="text-red-500 text-lg mr-2" />;
    case "perlu-dikoreksi":
      return <FaBell className="text-yellow-300 text-lg mr-2" />;
    default:
      return null;
  }
};

const formatTanggal = (tanggal) => {
  const date = new Date(tanggal);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const KabupatenCard = ({ kabupaten, onEdit, onDelete, onClick }) => {
  const counts = kabupaten.counts || {};
  const totalKelompok =
    (counts.maju || 0) + (counts.berkembang || 0) + (counts.tumbuh || 0);
  
  const formattedPeriode =
    kabupaten.tanggal_awal && kabupaten.tanggal_akhir
      ? `${formatTanggal(kabupaten.tanggal_awal)} - ${formatTanggal(
          kabupaten.tanggal_akhir
        )}`
      : "Periode tidak tersedia";

  return (
    <div
      className="bg-white rounded-md shadow-md p-4 border-[1px] border-gray-300 hover:bg-slate-100 relative"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          {renderStatusIcon(kabupaten.statusIcon)}
          <h2 className="text-xl font-semibold text-gray-800">
            {kabupaten.nama_kabupaten}
          </h2>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-secondary text-white py-1 px-2 rounded-md text-sm hover:bg-purple-400"
          >
            Edit
          </button>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mb-3">{formattedPeriode}</p>
      
      <div className="mb-2 text-slate-800 text-sm">
        <div className="flex items-center">
          <span className="w-1/2">Ketua Forum</span>
          <p className="flex">
            : {truncateText(kabupaten.ketua_forum, 35) || "Tidak tersedia"}
          </p>
        </div>
        <div className="flex items-center">
          <span className="w-1/2">Jumlah Desa</span>
          <p className="flex">: {kabupaten.jumlah_desa || "Tidak tersedia"}</p>
        </div>
        <div className="flex items-center">
          <span className="w-1/2">Kategori Maju</span>
          <p className="flex">: {counts.maju || 0}</p>
        </div>
        <div className="flex items-center">
          <span className="w-1/2">Kategori Berkembang</span>
          <p className="flex">: {counts.berkembang || 0}</p>
        </div>
        <div className="flex items-center">
          <span className="w-1/2">Kategori Tumbuh</span>
          <p className="flex">: {counts.tumbuh || 0}</p>
        </div>
        <div className="flex items-center">
          <span className="w-1/2">Total Kelompok</span>
          <p className="flex">:</p>
          <RealColor
            numReal={totalKelompok}
            numTarget={kabupaten.jumlah_desa}
          />
        </div>
      </div>
    </div>
  );
};

export default KabupatenCard;