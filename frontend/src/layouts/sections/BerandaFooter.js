import React, { useState, useEffect } from "react";

const BerandaFooter = () => {
  const [role, setRole] = useState([]); // Default role sebagai array kosong

  useEffect(() => {
    const peran = localStorage.getItem("role");
    setRole(peran ? JSON.parse(peran) : []); // Parse JSON dan fallback ke array kosong jika null
  }, []);

  return (
    <footer className="bg-secondary text-white z-20 w-full flex flex-col items-center justify-end pt-5">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left px-4 md:px-8">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 font-light">
          <img src="/images/logo_diy.png" alt="Logo" className="mb-2 w-10 h-12" />
          <p className="font-bold text-sm lg:text-lg">
            DINAS PEMBERDAYAAN PEREMPUAN <br />
            DAN PERLINDUNGAN ANAK
          </p>
          <p className="text-sm lg:text-lg">Copyright © 2024 | DP3AP2 DIY</p>
          <p className="text-sm lg:text-lg">Hanya Untuk Internal Dinas</p>
          <p className="text-sm lg:text-lg">All rights reserved</p>
        </div>
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 font-light">
          <p className="font-bold text-sm lg:text-lg">Tautan</p>
          <a href="/kabupaten-page" className="hover:underline text-sm lg:text-lg">
            Beranda
          </a>

          {/* Pastikan role adalah array sebelum menggunakan includes */}
          {role.includes("katim") && (
            <a href="/monitoring-evaluasi/dashboard" className="hover:underline text-sm lg:text-lg">
              Dashboard
            </a>
          )}
        </div>

        <div className="flex flex-col items-center md:items-start">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126489.25470985468!2d110.19763626380063!3d-7.812124770284489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a583d27b3156b%3A0x687ba19ee706c38a!2sDP3AP2%20DIY%20(Dinas%20Pemberdayaan%20Perempuan%2C%20Perlindungan%20Anak%20dan%20Pengendalian%20Penduduk)!5e0!3m2!1sen!2sid!4v1733016757890!5m2!1sen!2sid"
            width="300"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="mt-4"
          ></iframe>
        </div>
        <div className="flex flex-col items-center mt-6 lg:mt-0 md:items-start font-light">
          <p className="font-bold text-sm lg:text-lg">Hubungi Kami</p>
          <p className="text-sm lg:text-lg">Jl. Tentara Rakyat Mataram No.31 Yogyakarta</p>
          <p className="text-sm lg:text-lg">(0274) 562714 , (0274) 558402</p>
          <p className="text-sm lg:text-lg">dp3ap2@jogjaprov.go.id</p>
        </div>
      </div>
      <div className="mt-6 pb-4">
        <p className="text-sm lg:text-lg text-yellow-50 font-semibold">Dinas Pemberdayaan Perempuan, Perlindungan Anak, dan Pengendalian Penduduk Provinsi D.I. Yogyakarta</p>
      </div>
    </footer>
  );
};

export default BerandaFooter;
