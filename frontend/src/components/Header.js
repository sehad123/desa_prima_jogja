import React from "react";
import { FaSignOutAlt, FaRegCalendarAlt, FaRegClock } from "react-icons/fa"; // Import icons

const Header = ({ onLogout }) => {
  const currentDate = new Date();

  // Fungsi untuk mendapatkan hari dalam bahasa Indonesia
  const getDayName = (date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[date.getDay()];
  };

  // Format tanggal dalam bahasa Indonesia
  const formatTanggal = (date) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  // Format waktu (jam, menit, detik)
  const formatWaktu = (date) => {
    return date.toLocaleTimeString("id-ID", { hour12: false });
  };

  return (
    <div className="flex justify-between items-center mb-5 pb-6 shadow-md border-b">
      {/* Bagian Kiri: Nama Website dan Selamat Datang */}
      <div className="text-xl font-semibold text-gray-700 ml-6">
        <div>Desa Prima Yogyakarta</div>
        <div className="text-sm text-gray-600">Selamat datang!</div>
      </div>

      {/* Bagian Kanan: Informasi Tanggal, Waktu, dan Logout */}
      <div className="flex items-center space-x-8 text-gray-600 mr-6">
        {/* Tanggal */}
        <div className="flex items-center space-x-2">
          <FaRegCalendarAlt size={20} />
          <div>
            <p className="text-sm font-semibold">{getDayName(currentDate)}</p>
            <p className="text-sm">{formatTanggal(currentDate)}</p>
          </div>
        </div>

        {/* Waktu */}
        <div className="flex items-center space-x-2">
          <FaRegClock size={20} />
          <div>
            <p className="text-sm font-semibold">{formatWaktu(currentDate)}</p>
            <p className="text-sm">WIB</p>
          </div>
        </div>

        {/* Logout Icon */}
        <button className="text-gray-600 hover:text-red-600" onClick={onLogout}>
          <FaSignOutAlt size={24} />
          <div>
            <p className="text-sm font-semibold">Log out</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
