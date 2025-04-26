import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import ModalKabupaten from "../Modal/ModalKabupaten";
import { useNavigate } from "react-router-dom";
import KabupatenCard from "./KabupatenCard";
import useKabupatenData from "../hook/useKabupatenData";

const DaftarKabupaten = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kabupatenToDelete, setKabupatenToDelete] = useState(null);
  const [countsData, setCountsData] = useState({});

  const navigate = useNavigate();
  const { allKabupaten, refetch: refetchKabupaten } = useKabupatenData();

  // Fungsi yang lebih sederhana untuk mengambil data counts
  const fetchCountsData = async (kabupatenName) => {
    const formattedKabupaten = formatKabupatenName(kabupatenName);
    const categories = ["maju", "berkembang", "tumbuh"];
    const statuses = ["disetujui", "ditolak", "pending"];

    try {
      const counts = {};
      const countsStatus = {};

      // Fetch counts untuk kategori
      await Promise.all(
        categories.map(async (category) => {
          const encodedKabupaten = encodeURIComponent(formattedKabupaten);
          const response = await axios.get(
            `http://localhost:5000/api/desa/count/${encodedKabupaten}/${category}`
          );
          counts[category] = response.data.count || 0;
        })
      );

      // Fetch counts untuk status
      await Promise.all(
        statuses.map(async (status) => {
          const encodedKabupaten = encodeURIComponent(formattedKabupaten);
          const response = await axios.get(
            `http://localhost:5000/api/desa/count/${encodedKabupaten}/${status}`
          );
          countsStatus[status] = response.data.count || 0;
        })
      );

      return {
        counts,
        countsStatus,
        statusIcon: 
          countsStatus["ditolak"] > 0 ? "perlu-perhatian" :
          countsStatus["pending"] > 0 ? "perlu-dikoreksi" : "disetujui"
      };
    } catch (err) {
      console.error(`Error fetching counts for ${kabupatenName}:`, err);
      return {
        counts: {},
        countsStatus: {},
        statusIcon: "tidak-diketahui"
      };
    }
  };

  // Load data counts untuk semua kabupaten
  const loadAllCountsData = async () => {
    setLoading(true);
    try {
      const newCountsData = {};
      
      await Promise.all(
        allKabupaten.map(async (kabupaten) => {
          const data = await fetchCountsData(kabupaten.nama_kabupaten);
          newCountsData[kabupaten.id] = data;
        })
      );

      setCountsData(newCountsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading counts data:", err);
      setError("Gagal memuat data statistik");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allKabupaten.length > 0) {
      loadAllCountsData();
    }
  }, [allKabupaten]);

  const formatKabupatenName = (kabupatenName) => {
    return kabupatenName
      .replace("Kota", "")
      .replace(/\s+/g, "")
      .replace(/^(\w)/, (match) => match.toUpperCase());
  };

  const openModal = (kabupaten = null) => {
    setSelectedKabupaten(kabupaten);
    setShowModal(true);
  };

  const closeModal = (shouldRefresh = false) => {
    setShowModal(false);
    setSelectedKabupaten(null);
    
    if (shouldRefresh) {
      // Gunakan refetch dari hook useKabupatenData
      refetchKabupaten().then(() => {
        // Setelah data kabupaten ter-refresh, update counts data
        loadAllCountsData();
      });
    }
  };

  const confirmDeleteKabupaten = (kabupaten) => {
    setKabupatenToDelete(kabupaten);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!kabupatenToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/kabupaten/${kabupatenToDelete.id}`
      );
      toast.success("Data kabupaten berhasil dihapus.");
      setShowDeleteModal(false);
      setKabupatenToDelete(null);
      
      // Refresh data setelah delete
      refetchKabupaten().then(() => {
        loadAllCountsData();
      });
    } catch (err) {
      toast.error("Gagal menghapus data kabupaten.");
    }
  };

  const cancelDelete = () => {
    setKabupatenToDelete(null);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#542d48" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-0">
  {/* Header Section */}
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Daftar Kabupaten/Kota
        </h1>
        <p className="text-gray-500 mt-1">
          Provinsi Daerah Istimewa Yogyakarta
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-purple-600 text-sm">
          {allKabupaten.length} Kabupaten/Kota
        </span>
      </div>
    </div>
  </div>

  {/* Kabupaten Cards Grid */}
  <div className="px-7 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {allKabupaten.map((kabupaten) => (
      <KabupatenCard
        key={kabupaten.id}
        kabupaten={{
          ...kabupaten,
          ...(countsData[kabupaten.id] || {
            counts: {},
            statusIcon: "tidak-diketahui"
          })
        }}
        onEdit={() => openModal(kabupaten)}
        onDelete={() => confirmDeleteKabupaten(kabupaten)}
        onClick={() =>
          navigate(`/kabupaten-dashboard/${kabupaten.nama_kabupaten}`)
        }
      />
    ))}
  </div>

  {/* Empty State */}
  {allKabupaten.length === 0 && (
    <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada kabupaten</h3>
        <p className="text-gray-500">Belum ada data kabupaten yang tersedia</p>
      </div>
    </div>
  )}

  {/* Modal */}
  {showModal && (
    <ModalKabupaten
      isOpen={showModal}
      onClose={closeModal}
      selectedKabupaten={selectedKabupaten}
    />
  )}
</div>
  );
};

export default DaftarKabupaten;