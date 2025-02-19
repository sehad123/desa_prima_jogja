import React, { useEffect, useState } from "react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import ModalKabupaten from "./Modal/ModalKabupaten";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";

const KabupatenPage = () => {
  const [kabupatenList, setKabupatenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Untuk modal konfirmasi penghapusan
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kabupatenToDelete, setKabupatenToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedErrorMessage = localStorage.getItem("errorMessages");
    if (storedErrorMessage) {
      setErrorMessage(storedErrorMessage);
      setShowErrorNotification(true);
    }

    return () => {
      localStorage.removeItem("errorMessages");
    };
  }, []);

  useEffect(() => {
    const storedSuccessMessage = localStorage.getItem("successMessages");
    if (storedSuccessMessage) {
      setSuccessMessage(storedSuccessMessage);
      setShowSuccessNotification(true);
    }

    return () => {
      localStorage.removeItem("successMessages");
    };
  }, []);

  const handleClose = () => {
    setShowErrorNotification(false);
    localStorage.removeItem("errorMessages");
    setShowSuccessNotification(false);
    localStorage.removeItem("successMessages");
  };

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
      const kabupatenNames = [
        "Kota Yogyakarta",
        "Sleman",
        "Bantul",
        "Kulon Progo",
        "GunungKidul",
      ];
      const categories = ["maju", "berkembang", "tumbuh"];

      // Fetch kabupaten data
      const kabupatenResponse = await axios.get(
        "http://localhost:5000/api/kabupaten"
      );
      const kabupatenList = kabupatenResponse.data;

      // Fetch counts for each kabupaten
      const countsPromises = kabupatenNames.map(async (kabupaten) => {
        const formattedKabupaten = formatKabupatenName(kabupaten); // Memformat nama kabupaten

        const counts = {};
        for (const category of categories) {
          try {
            // Mengencode nama kabupaten untuk menghindari masalah dengan spasi atau karakter lainnya
            const encodedKabupaten = encodeURIComponent(formattedKabupaten);
            const response = await axios.get(
              `http://localhost:5000/api/desa/count/${encodedKabupaten}/${category}`
            );
            counts[category] = response.data.count || 0;
          } catch (err) {
            console.error(
              `Error fetching count for ${formattedKabupaten} ${category}:`,
              err
            );
            counts[category] = 0;
          }
        }
        return { nama_kabupaten: kabupaten, counts }; // Gunakan nama kabupaten asli untuk pencocokan
      });

      const countsData = await Promise.all(countsPromises);

      // Merge kabupaten data with counts
      const mergedData = kabupatenList.map((kabupaten) => {
        const formattedKabupaten = formatKabupatenName(
          kabupaten.nama_kabupaten
        ); // Format nama kabupaten dari API
        const counts =
          countsData.find(
            (count) =>
              formatKabupatenName(count.nama_kabupaten) === formattedKabupaten
          )?.counts || {};
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
      await axios.delete(
        `http://localhost:5000/api/kabupaten/${kabupatenToDelete.id}`
      );
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

   // Halaman loading
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
        </div>
      );
    }
  
    if (error) {
      return <div className="text-center text-xl text-red-500">{error}</div>;
    }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const RealColor = ({ numReal, numTarget }) => {
    const num = Math.min(numReal / numTarget, 1);
    if (num < 0.25) {
      return (
        <>
          <span className="text-red-900 bg-red-100 px-2 ml-1 rounded-md ">
            {" "}
            {numReal}{" "}
          </span>
          <span className="ml-auto text-xl font-bold text-red-600">
            {(num * 100).toFixed(0)}%
          </span>
        </>
      );
    } else if (num < 0.5) {
      return (
        <>
          <span className="text-orange-900 bg-orange-200 px-2 ml-1 rounded-md ">
            {" "}
            {numReal}{" "}
          </span>
          <span className="ml-auto text-xl font-bold text-orange-400">
            {(num * 100).toFixed(0)}%
          </span>
        </>
      );
    } else if (num < 0.75) {
      return (
        <>
          <span className="text-yellow-900 bg-yellow-100 px-2 ml-1 rounded-md ">
            {" "}
            {numReal}{" "}
          </span>
          <span className="ml-auto text-xl font-bold text-yellow-300">
            {(num * 100).toFixed(0)}%
          </span>
        </>
      );
    } else if (num < 1) {
      return (
        <>
          <span className="text-blue-900 bg-blue-100 px-2 ml-1 rounded-md ">
            {" "}
            {numReal}{" "}
          </span>
          <span className="ml-auto text-xl font-bold text-blue-600">
            {(num * 100).toFixed(0)}%
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-green-900 bg-green-100 px-2 ml-1 rounded-md ">
            {" "}
            {numReal}{" "}
          </span>
          <span className="ml-auto text-xl font-bold text-green-600">
            {(num * 100).toFixed(0)}%
          </span>
        </>
      );
    }
  };

  const breadcrumbItems = [
    { label: "Beranda", path: "/peta-desa" },
    { label: "Kabupaten/Kota", path: null }, // Halaman aktif tidak memiliki tautan
  ];

  return (
    <>
      <div className="p-5">
      <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6">
          <div className="flex justify-between items-center p-4 bg-white">
          <h1 className="text-lg lg:text-xl font-medium text-gray-800">
            Daftar Kabupaten/Kota Provinsi D.I. Yogyakarta
          </h1>
          <button 
          onClick={() => navigate(`/peta-desa`)} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center text-sm lg:text-lg">
          Dashboard
        </button>
        </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer bg-white">
          {kabupatenList.map((kabupaten) => {
            const counts = kabupaten.counts || {};
            const totalKelompok =
              (counts.maju || 0) +
              (counts.berkembang || 0) +
              (counts.tumbuh || 0);
            const formattedPeriode =
              kabupaten.periode_awal && kabupaten.periode_akhir
                ? `${formatTanggal(kabupaten.periode_awal)} - ${formatTanggal(
                    kabupaten.periode_akhir
                  )}`
                : "Periode tidak tersedia";

            return (
              <div
                key={kabupaten.id}
                className="bg-white rounded-lg shadow-lg p-4 border-[1px] border-gray-300 relative"
                onClick={() => navigate(`/detail/${kabupaten.id}`)}
              >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start">
                  <div className="text-green-900 text-lg mr-2">✔</div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {kabupaten.nama_kabupaten}
                  </h2>
                </div>{" "}

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(kabupaten);
                    }}
                    className="inline-flex text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
                <p className="text-gray-500 text-sm mb-4">{formattedPeriode}</p>
              <div className="mb-2 text-slate-800 text-sm">
                <div className="flex items-center">
                  <span className="w-1/2">Ketua Forum</span>
                  <p className="flex">: {truncateText(kabupaten.ketua_forum, 35) || "Tidak tersedia"}</p>
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
                  <p className="flex">:</p>{" "}
                  <RealColor
                    numReal={totalKelompok}
                    numTarget={kabupaten.jumlah_desa}
                  />
                </div>
              </div>
            </div>
            );
          })}
        </div>

        <ToastContainer />

        {showModal && (
          <ModalKabupaten
            onClose={closeModal}
            selectedKabupaten={selectedKabupaten}
          />
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
              <p>
                Apakah Anda yakin ingin menghapus kabupaten{" "}
                {kabupatenToDelete?.nama_kabupaten}?
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KabupatenPage;
