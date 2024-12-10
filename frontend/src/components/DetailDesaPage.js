import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ModalForm from "./ModalForm"; // Modal for adding data
import ModalDetail from "./ModalDetail"; // Modal for viewing details
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaFile, FaTrashAlt } from "react-icons/fa"; // Plus icon for adding data

const DetailDesaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [desa, setDesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [modalType, setModalType] = useState(null); // Track which modal to show
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("notulensiMateri");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Item yang akan dihapus
  const [deleteItemType, setDeleteItemType] = useState(null); // Tipe data yang dihapus: galeri atau notulensi

  const [galeri, setGaleri] = useState([]);
  const [notulensi, setNotulensi] = useState([]);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false); // Modal konfirmasi hapus item

  const openDeleteItemModal = (item, type) => {
    setItemToDelete(item);
    setDeleteItemType(type);
    setIsDeleteItemModalOpen(true);
  };

  // Fetching data function to reuse for both useEffect and modal refresh
  const fetchDesaDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}`);
      setDesa(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  const fetchGaleri = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}/galeri`);
      setGaleri(response.data);
    } catch (err) {
      console.error("Gagal memuat galeri", err);
    }
  };

  const fetchNotulensi = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}/notulensi`);
      setNotulensi(response.data);
    } catch (err) {
      console.error("Gagal memuat notulensi", err);
    }
  };

  useEffect(() => {
    fetchDesaDetail();
  }, [id]);

  useEffect(() => {
    if (activeTab === "galeriFoto") {
      fetchGaleri();
    } else if (activeTab === "notulensiMateri") {
      fetchNotulensi();
    }
  }, [activeTab]);

  const handleModalClose = (isSuccess) => {
    setIsModalOpen(false);
    setSelectedDesa(null);
    setModalType(null);

    if (isSuccess) {
      if (activeTab === "galeriFoto") {
        fetchGaleri(); // Reload galeri jika tab galeri sedang aktif
      } else if (activeTab === "notulensiMateri") {
        fetchNotulensi(); // Reload notulensi jika tab notulensi sedang aktif
      }
    }
    fetchDesaDetail();
  };

  const handleEdit = (desa) => {
    setSelectedDesa(desa);
    setModalType("form");
    setIsModalOpen(true);
  };

  const handleAdd = (type, desa) => {
    setSelectedDesa(desa);

    setModalType(type); // Set the modal type to either "galeri" or "notulensi"
    setIsModalOpen(true);
  };

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  // Fungsi untuk menghapus galeri atau notulensi
  const handleDeleteItem = async () => {
    try {
      if (deleteItemType === "galeri") {
        await axios.delete(`http://localhost:5000/api/desa/${id}/galeri/${itemToDelete.id}`);
        toast.success("Gambar berhasil dihapus!");
        fetchGaleri();
      } else if (deleteItemType === "notulensi") {
        await axios.delete(`http://localhost:5000/api/desa/${id}/notulensi/${itemToDelete.id}`);
        toast.success("Notulensi berhasil dihapus!");
        fetchNotulensi();
      }
      setIsDeleteItemModalOpen(false);
    } catch (err) {
      toast.error("Gagal menghapus data.");
      console.error(err);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const renderNotulensi = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 -mt-6 gap-6">
      {notulensi.map((notulensiItem) => (
        <div key={notulensiItem.id} className="relative flex flex-col items-center h-[160px] w-[160px] bg-white shadow-md rounded-lg p-4 border mt-6 border-gray-200">
          <a href={`http://localhost:5000/uploads/${notulensiItem.file}`} target="_blank" rel="noopener noreferrer" className="text-center">
            <div className="text-3xl flex justify-center items-center bg-blue-100 p-6 rounded-full">
              <FaFile color="blue" />
            </div>
            <p className="text-sm mt-4 font-semibold text-gray-700 truncate">{notulensiItem.catatan}</p>
          </a>
          <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600" onClick={() => openDeleteItemModal(notulensiItem, "notulensi")}>
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  );

  // Konten tab galeri
  const renderGaleri = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {galeri.map((gambar) => (
        <div key={gambar.id} className="relative bg-white shadow-md rounded-lg p-4 border h-[160px] w-[200px] border-gray-200 flex flex-col items-center">
          {gambar.gambar ? <img src={`http://localhost:5000${gambar.gambar}`} alt={gambar.gambar} className="w-24 h-24 object-cover rounded-lg shadow-md" /> : <p className="text-gray-500 italic">No Image</p>}
          <p className="text-sm mt-2 font-semibold text-gray-700 truncate">{formatTanggal(gambar.createdAt)}</p>
          <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600" onClick={() => openDeleteItemModal(gambar, "galeri")}>
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === "notulensiMateri") {
      return renderNotulensi();
    }

    if (activeTab === "galeriFoto") {
      return renderGaleri();
    }

    return <p className="text-gray-600">Pilih tab untuk menampilkan konten.</p>;
  };

  const handleDelete = async () => {
    try {
      // Ambil nama kabupaten sebelum menghapus desa
      const kabupatenNama = desa.kabupatenNama;

      await axios.delete(`http://localhost:5000/api/desa/${id}`);
      toast.success("Data desa berhasil dihapus!");

      setIsDeleteModalOpen(false);

      // Arahkan ke halaman kelompok desa dengan query parameter nama kabupaten
      navigate(`/kelompok-desa?kabupaten=${kabupatenNama}`);
    } catch (err) {
      setError("Gagal menghapus data.");
      toast.error("Gagal menghapus data.");
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Memuat detail desa...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="p-5">
      <button onClick={() => navigate(-1)} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none">
        Kembali
      </button>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">{desa.kelompok_desa}</h2>
            <p>
              <strong>Alamat:</strong> {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel. {desa.kelurahanNama}
            </p>
            <p>
              <strong>Tanggal Pembentukan:</strong> {formatTanggal(desa.tahun_pembentukan)}
            </p>
            <p>
              <strong>Jumlah Hibah Diterima:</strong> {formatRupiah(desa.jumlah_hibah_diterima)}
            </p>
            <p>
              <strong>Jumlah Dana Sekarang:</strong> {formatRupiah(desa.jumlah_dana_sekarang)}
            </p>
            <p>
              <strong>Jumlah Anggota Awal:</strong> {desa.jumlah_anggota_awal}
            </p>
            <p>
              <strong>Jumlah Anggota Sekarang:</strong> {desa.jumlah_anggota_sekarang}
            </p>
            <p>
              <strong>Kategori:</strong> {desa.kategori}
            </p>
            <p>
              <strong>Pengurus:</strong> {desa.pengurus}
            </p>
            <div className="mt-4 flex gap-4">
              <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none">Cetak Hasil</button>
              <button onClick={() => handleEdit(desa)} className="bg-blue-500 text-white py-1 px-6 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                onClick={() => setIsDeleteModalOpen(true)} // Buka modal konfirmasi hapus
              >
                Hapus
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            {/* Tab dan Tombol */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
              {/* Tab Navigation */}
              <nav className="flex space-x-4">
                <button className={`py-2 px-3 text-sm font-medium ${activeTab === "notulensiMateri" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-700"}`} onClick={() => setActiveTab("notulensiMateri")}>
                  Notulensi / Materi
                </button>
                <button className={`py-2 px-3 text-sm font-medium ${activeTab === "galeriFoto" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-700"}`} onClick={() => setActiveTab("galeriFoto")}>
                  Galeri Foto
                </button>
              </nav>

              {/* Tombol Tambah */}
              <button onClick={() => handleAdd(activeTab === "notulensiMateri" ? "notulensi" : "galeri", desa)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center gap-2">
                <FaPlus />
                {activeTab === "notulensiMateri" ? "Tambah Notulensi" : "Tambah Foto"}
              </button>
            </div>

            {/* Konten Tab */}
            <div className="bg-gray-50 p-4 rounded-lg">{renderTabContent()}</div>
          </div>
        </div>
        {/* 
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
          <h3 className="text-lg font-bold mb-4">Detail Informasi</h3>
          <div className="bg-gray-50 p-4 rounded-lg">{renderTabContent()}</div>
        </div> */}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus desa ini?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600" onClick={handleDeleteModalClose}>
                Batal
              </button>
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" onClick={handleDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteItemModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus {deleteItemType === "galeri" ? "gambar" : "notulensi"} ini?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600" onClick={() => setIsDeleteItemModalOpen(false)}>
                Batal
              </button>
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" onClick={handleDeleteItem}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && modalType === "form" && <ModalForm onClose={handleModalClose} selectedDesa={selectedDesa} />}
      {isModalOpen && modalType === "notulensi" && <ModalDetail onClose={handleModalClose} selectedDesa={selectedDesa} activeTab="notulensiMateri" />}
      {isModalOpen && modalType === "galeri" && <ModalDetail onClose={handleModalClose} selectedDesa={selectedDesa} activeTab="galeriFoto" />}

      <ToastContainer />
    </div>
  );
};

export default DetailDesaPage;
