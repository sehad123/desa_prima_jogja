// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [formData, setFormData] = useState({
//     nama_desa: "",
//     tahun_pembentukan: "",
//     jumlah_hibah_diterima: "",
//     jumlah_dana_sekarang: "",
//     jumlah_anggota_awal: "",
//     jumlah_anggota_sekarang: "",
//   });

//   const [result, setResult] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { nama_desa, ...predictData } = formData; // Pisahkan nama desa dari data prediksi
//       const response = await axios.post("http://127.0.0.1:5000/predict", predictData);

//       // Interpretasi hasil prediksi
//       const categories = ["Berkembang", "Maju", "Tumbuh"];
//       const interpretedResult = categories[response.data.kategori];

//       setResult(`Desa ${nama_desa} termasuk kategori: ${interpretedResult}`);
//     } catch (error) {
//       console.error("Error:", error);
//       setResult("Terjadi kesalahan dalam prediksi. Silakan coba lagi.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4 text-center">Prediksi Kategori Desa Prima</h1>
//         <form onSubmit={handleSubmit}>
//           {/* Input untuk nama desa */}
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2">Nama Desa</label>
//             <input type="text" name="nama_desa" value={formData.nama_desa} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
//           </div>

//           {/* Input untuk data lainnya */}
//           {Object.keys(formData)
//             .filter((key) => key !== "nama_desa")
//             .map((key) => (
//               <div className="mb-4" key={key}>
//                 <label className="block text-gray-700 mb-2 capitalize">{key.replace(/_/g, " ")}</label>
//                 <input type="number" name={key} value={formData[key]} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
//               </div>
//             ))}

//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//             Prediksi
//           </button>
//         </form>
//         {result && (
//           <div className="mt-4 text-center">
//             <h2 className="text-xl font-bold">{result}</h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import KelompokDetail from "./page/KelompokDetail"; // Halaman detail desa
import DaftarKabKota from "./page/DaftarKabKota";
import KabDashboard from "./page/KabDashboard";
import DaftarKelompokDesa from "./page/DaftarKelompokDesa";
import ProvDashboard from "./page/ProvDashboard";
import PetaSebaran from "./page/PetaSebaran";
import DaftarUser from "./page/DaftarUser";
import Profil from "./page/Profil";
import { Toaster } from "react-hot-toast";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

const TitleUpdater = () => {
  const location = useLocation();

  React.useEffect(() => {
    const pathTitles = {
      "/": "Login - Desa Prima",
      "/peta-sebaran": "Peta Sebaran - Desa Prima",
      "/register": "Registrasi - Desa Prima",
      "/provinsi-dashboard": "Dashboard Provinsi - Desa Prima",
      "/daftar-kabupaten": "Daftar Kabupaten/Kota - Desa Prima",
      "/kabupaten-dashboard/:nama_kabupaten":
        "Dashboard Kabupaten/Kota - Desa Prima",
      "/daftar-kelompok": "Daftar Kelompok - Desa Prima",
      "/kelompok-desa/:id": "Detail Kelompok - Desa Prima",
      "/daftar-user": "Daftar User - Desa Prima",
      "/profil": "Profil - Desa Prima",
    };

    const getTitle = (path) => {
      for (const [pattern, title] of Object.entries(pathTitles)) {
        const regex = new RegExp(`^${pattern.replace(/:\w+/g, "\\w+")}$`);
        if (path.match(regex)) {
          return title;
        }
      }

      return "Halaman Tidak Ditemukan - Desa Prima";
    };

    document.title = getTitle(location.pathname);
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffff",
              color: "#363636",
              padding: "12px 12px", // Perbesar padding (atas-bawah: 16px, kiri-kanan: 24px)
              fontSize: "16px", // Perbesar ukuran font
            },
            closeButton: true,
          }}
        />
        <Router>
          <TitleUpdater />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/provinsi-dashboard" element={<ProvDashboard />} />
            <Route path="/peta-sebaran" element={<PetaSebaran />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/daftar-kelompok" element={<DaftarKelompokDesa />} />
            <Route path="/daftar-kabupaten" element={<DaftarKabKota />} />
            <Route path="/daftar-user" element={<DaftarUser />} />
            <Route
              path="/kabupaten-dashboard/:nama_kabupaten"
              element={<KabDashboard />}
            />
            <Route path="/kelompok-desa/:id" element={<KelompokDetail />} />
            <Route path="/profil" element={<Profil />} />
          </Routes>
        </Router>
      </MantineProvider>
    </>
  );
}

export default App;
