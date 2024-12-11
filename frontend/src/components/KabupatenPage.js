import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import ModalKabupaten from "./ModalKabupaten";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const KabupatenPage = () => {
  const [kabupatenList, setKabupatenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);

  // Untuk modal konfirmasi penghapusan
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kabupatenToDelete, setKabupatenToDelete] = useState(null);

  const navigate = useNavigate();

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };
  const formatKabupatenName = (kabupatenName) => {
    return kabupatenName
      .replace("Kota", "") // Menghapus kata "Kota" jika ada
      .replace(/\s+/g, "") // Menghapus semua spasi antara kata-kata
      .replace(/^(\w)/, (match) => match.toUpperCase()); // Mengubah huruf pertama menjadi huruf kapital
  };

  const fetchKabupatenData = async () => {
    try {
      const kabupatenNames = ["Kota Yogyakarta", "Sleman", "Bantul", "Kulon Progo", "GunungKidul"];
      const categories = ["maju", "berkembang", "tumbuh"];

      // Fetch kabupaten data
      const kabupatenResponse = await axios.get("http://localhost:5000/api/kabupaten");
      const kabupatenList = kabupatenResponse.data;

      // Fetch counts for each kabupaten
      const countsPromises = kabupatenNames.map(async (kabupaten) => {
        const formattedKabupaten = formatKabupatenName(kabupaten); // Memformat nama kabupaten

        const counts = {};
        for (const category of categories) {
          try {
            // Mengencode nama kabupaten untuk menghindari masalah dengan spasi atau karakter lainnya
            const encodedKabupaten = encodeURIComponent(formattedKabupaten);
            const response = await axios.get(`http://localhost:5000/api/desa/count/${encodedKabupaten}/${category}`);
            counts[category] = response.data.count || 0;
          } catch (err) {
            console.error(`Error fetching count for ${formattedKabupaten} ${category}:`, err);
            counts[category] = 0;
          }
        }
        return { nama_kabupaten: kabupaten, counts }; // Gunakan nama kabupaten asli untuk pencocokan
      });

      const countsData = await Promise.all(countsPromises);

      // Merge kabupaten data with counts
      const mergedData = kabupatenList.map((kabupaten) => {
        const formattedKabupaten = formatKabupatenName(kabupaten.nama_kabupaten); // Format nama kabupaten dari API
        const counts = countsData.find((count) => formatKabupatenName(count.nama_kabupaten) === formattedKabupaten)?.counts || {};
        return { ...kabupaten, counts };
      });

      setKabupatenList(mergedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching kabupaten data:", err);
      setError("Gagal memuat data kabupaten.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKabupatenData();
  }, []);

  const openModal = (kabupaten = null) => {
    setSelectedKabupaten(kabupaten);
    setShowModal(true);
  };

  const closeModal = (shouldRefresh = false) => {
    setSelectedKabupaten(null);
    setShowModal(false);
    if (shouldRefresh) {
      fetchKabupatenData();
    }
  };

  const confirmDeleteKabupaten = (kabupaten) => {
    setKabupatenToDelete(kabupaten);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!kabupatenToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/kabupaten/${kabupatenToDelete.id}`);
      toast.success("Data kabupaten berhasil dihapus.");
      setShowDeleteModal(false);
      setKabupatenToDelete(null);
      fetchKabupatenData();
    } catch (err) {
      toast.error("Gagal menghapus data kabupaten.");
    }
  };

  const cancelDelete = () => {
    setKabupatenToDelete(null);
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="p-5">
      <Header onLogout={handleLogout} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Kabupaten</h1>
        {/* <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
          <FaPlus className="mr-2" />
          Tambah Data
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
        {kabupatenList.map((kabupaten) => {
          const counts = kabupaten.counts || {};
          const totalKelompok = (counts.maju || 0) + (counts.berkembang || 0) + (counts.tumbuh || 0);
          const percentage = kabupaten.jumlah_desa ? ((totalKelompok / kabupaten.jumlah_desa) * 100).toFixed(2) : 0;
          const formattedPeriode = kabupaten.periode_awal && kabupaten.periode_akhir ? `${formatTanggal(kabupaten.periode_awal)} - ${formatTanggal(kabupaten.periode_akhir)}` : "Periode tidak tersedia";

          let percentageColor = "";
          if (percentage < 50) {
            percentageColor = "text-red-600";
          } else if (percentage >= 50 && percentage <= 75) {
            percentageColor = "text-yellow-600";
          } else {
            percentageColor = "text-green-600";
          }

          return (
            <div key={kabupaten.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 relative" onClick={() => navigate(`/detail/${kabupaten.id}`)}>
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(kabupaten);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <FaEdit />
                </button>
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteKabupaten(kabupaten);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button> */}
              </div>
              <div className="flex items-center mb-2">
                <div className="text-green-900 text-lg mr-2">✔</div>
                <h2 className="text-xl font-semibold text-gray-800">{kabupaten.nama_kabupaten}</h2>
              </div>{" "}
              <p className="text-gray-500 text-sm mb-4">{formattedPeriode}</p>
              <div className="mb-4">
                <p className="text-gray-700">
                  <strong>Ketua Forum:</strong> {kabupaten.ketua_forum || "Tidak tersedia"}
                </p>
                <p className="text-gray-700">
                  <strong>Jumlah Desa:</strong> {kabupaten.jumlah_desa || "Tidak tersedia"}
                </p>
                <p className="text-gray-700">
                  <strong>Jumlah Kelompok Maju:</strong> {counts.maju || 0}
                </p>
                <p className="text-gray-700">
                  <strong>Jumlah Kelompok Berkembang:</strong> {counts.berkembang || 0}
                </p>
                <p className="text-gray-700">
                  <strong>Jumlah Kelompok Tumbuh:</strong> {counts.tumbuh || 0}
                </p>
                <p className="text-gray-700">
                  <strong>Total Kelompok:</strong> {totalKelompok}
                </p>
              </div>
              {/* Persentase */}
              <div className="mt-4 text-center">
                <p className={`text-lg font-bold ${percentageColor}`}>{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer />

      {showModal && <ModalKabupaten onClose={closeModal} selectedKabupaten={selectedKabupaten} />}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus kabupaten {kabupatenToDelete?.nama_kabupaten}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={cancelDelete} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                Batal
              </button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KabupatenPage;
