import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ModalForm from "../Modal/ModalForm"; // Modal for adding data
import ModalDetail from "../Modal/ModalDetail"; // Modal for viewing details
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaFile, FaTrashAlt, FaEdit } from "react-icons/fa"; // Plus icon for adding data
import Breadcrumb from "../Breadcrumb";
import EditModal from "../Modal/ModalEdit";
import { Audio } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV, faEdit, faTimes, faDownload, faTrash, faSquareCheck, faSquare, faFilePdf, faFileWord, faFileExcel, faFilePowerpoint, faFileLines } from "@fortawesome/free-solid-svg-icons";
import TabPanel from "./TabPanel";
import ErrorNotification from "../Modal/ErrorNotification";
import SuccessNotification from "../Modal/SuccessNotification";

const DetailDesaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visibleOptionId, setVisibleOptionId] = useState(null);
  const [desa, setDesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteActivity, setLoadingDeleteActivity] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [modalType, setModalType] = useState(null); // Track which modal to show
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Menentukan apakah mode edit aktif
  const [selectedItem, setSelectedItem] = useState(null); // Item yang dipilih untuk preview dan edit
  const [itemToDelete, setItemToDelete] = useState(null); // Item yang akan dihapus
  const [deleteItemType, setDeleteItemType] = useState(null); // Tipe data yang dihapus: galeri atau notulensi
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEntityType, setEditEntityType] = useState(""); // "produk" or "pengurus"
  const [entityToEdit, setEntityToEdit] = useState(null);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [galeri, setGaleri] = useState([]);
  const [produk, setProduk] = useState([]);
  const [pengurus, setPengurus] = useState([]);
  const [notulensi, setNotulensi] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [note, setNote] = useState([]);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false); // Modal konfirmasi hapus item
  const toggleOption = (id) => {
    setVisibleOptionId(visibleOptionId === id ? null : id);
  };

  const [profil, setProfil] = useState({});

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfil(response.data); // Set nama dan NIP ke state
      } catch (error) {
        console.error("Gagal mengambil profil:", error.response?.data?.error || error.message);
      }
    };

    fetchProfil();
  }, []);

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
      console.log("Galeri Data:", response.data); // Tambahkan ini untuk debugging
    } catch (err) {
      console.error("Gagal memuat galeri", err);
    }
  };

  const fetchNotulensi = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}/notulensi`);
      setNotulensi(response.data);
      console.log("Notulensi Data:", response.data); // Tambahkan ini untuk debugging
    } catch (err) {
      console.error("Gagal memuat notulensi", err);
    }
  };
  const fetchProduk = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}/produk`);
      setProduk(response.data);
    } catch (err) {
      console.error("Gagal memuat Produk", err);
    }
  };
  const fetchPengurus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}/pengurus`);
      setPengurus(response.data);
    } catch (err) {
      console.error("Gagal memuat Pengurus", err);
    }
  };

  useEffect(() => {
    fetchDesaDetail();
  }, [id]);

  const kelompok_desa = desa ? desa.kelompok_desa : null;
  const tabsMap = {
    "Detail Kelompok": ["Pengurus", "Produk", "Notulensi / Materi", "Galeri"],
  };

  const defaultTab = "Pengurus";
  const [selectedTab, setSelectedTab] = useState(() => {
    const storedTab = localStorage.getItem("selectedTab");
    const validTabs = tabsMap["Detail Kelompok"] || [];
    return validTabs.includes(storedTab) ? storedTab : defaultTab;
  });

  useEffect(() => {
    const validTabs = tabsMap["Detail Kelompok"] || [];
    if (validTabs.includes(selectedTab)) {
      localStorage.setItem("selectedTab", selectedTab);
    } else {
      if (selectedTab !== defaultTab) {
        setSelectedTab(defaultTab);
      }
      localStorage.setItem("selectedTab", defaultTab);
    }
  }, [selectedTab, "Detail Kelompok"]);

  const tabs = tabsMap["Detail Kelompok"] || [];

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

  useEffect(() => {
    if (selectedTab === "Galeri") {
      fetchGaleri();
      setCurrentFiles(galeri);
    } else if (selectedTab === "Notulensi / Materi") {
      fetchNotulensi();
      setCurrentFiles(notulensi);
    } else if (selectedTab === "Produk") {
      fetchProduk();
      setCurrentFiles(produk);
    } else if (selectedTab === "Pengurus") {
      fetchPengurus();
      setCurrentFiles(pengurus);
    }
  }, [selectedTab, galeri, notulensi, produk, pengurus]);

  const handleModalClose = (isSuccess) => {
    setIsModalOpen(false);
    setSelectedDesa(null);
    setModalType(null);
    setSelectedItem(null); // Reset selected item

    if (isSuccess) {
      if (selectedTab === "Galeri") {
        fetchGaleri(); // Reload galeri jika tab galeri sedang aktif
      } else if (selectedTab === "Notulensi / Materi") {
        fetchNotulensi(); // Reload notulensi jika tab notulensi sedang aktif
      } else if (selectedTab === "Produk") {
        fetchProduk(); // Reload produk jika tab produk sedang aktif
      } else if (selectedTab === "Pengurus") {
        fetchPengurus(); // Reload pengurus jika tab pengurus sedang aktif
      }
    }
    fetchDesaDetail();
  };

  if (loading || loadingDelete || loadingDeleteActivity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleEdit = (desa) => {
    setSelectedDesa(desa);
    setModalType("form");
    setIsModalOpen(true);
  };

  const handleEditModal = (entity, type) => {
    setEntityToEdit(entity); // Set data awal untuk modal edit
    setEditEntityType(type); // Tentukan jenis entitas
    setIsEditModalOpen(true); // Buka modal
  };

  const handleEditSubmit = async (formData) => {
    try {
      const endpoint = editEntityType === "produk" ? "produk" : "pengurus";
      await axios.put(`http://localhost:5000/api/desa/${id}/${endpoint}/${formData.id}`, formData);

      toast.success(`${editEntityType === "produk" ? "Produk" : "Pengurus"} berhasil diperbarui!`);
      setIsEditModalOpen(false);

      // Refresh data setelah update
      if (editEntityType === "produk") fetchProduk();
      if (editEntityType === "pengurus") fetchPengurus();
    } catch (error) {
      toast.error("Gagal memperbarui data.");
      console.error(error);
    }
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

  const handleSelectFile = (file) => {
    setSelectedFiles((prev) => {
      const newSelectedFiles = prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file];

      return newSelectedFiles;
    });
  };

  const doubleActionFile = (file) => {
    handleSelectFile(file);
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
      } else if (deleteItemType === "produk") {
        await axios.delete(`http://localhost:5000/api/desa/${id}/produk/${itemToDelete.id}`);
        toast.success("Produk berhasil dihapus!");
        fetchProduk();
      } else if (deleteItemType === "pengurus") {
        await axios.delete(`http://localhost:5000/api/desa/${id}/pengurus/${itemToDelete.id}`);
        toast.success("Pengurus berhasil dihapus!");
        fetchPengurus();
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

  const renderGaleri = () => {
    return (
      <div className="flex flex-wrap justify-center md:justify-start">
        <button className="w-1/2 border border-dashed border-gray-500 h-48 lg:w-36 lg:h-48 lg:mr-2 mt-2 p-2 flex flex-col justify-center items-center cursor-pointer" onClick={() => handleAdd("galeri", desa)}>
          <FontAwesomeIcon icon={faPlus} className="w-1/2 h-1/2 lg:w-20 lg:h-20 text-gray-400" />
          <div className="w-full text-xs lg:text-sm text-center text-gray-500">Unggah Foto</div>
        </button>

        {galeri.length === 0 && <div className="w-full text-center text-gray-500 mt-3">Tidak ada file ditemukan</div>}

        {galeri.map((file) => (
          <div key={file.id} className="relative w-1/2 lg:w-40 p-2" onClick={() => handleItemSelect(file)}>
            <div className={`border cursor-pointer ${selectedFiles.includes(file) ? "border-blue-500" : "border-gray-400"}`}>
              <div className="h-8 bg-gray-300 flex justify-between">
                <div className={`${selectedFiles.includes(file) ? "hidden" : ""} text-white h-2 w-2 lg:h-7 lg:w-7`} onClick={() => handleSelectFile(file)}>
                  <FontAwesomeIcon icon={faSquare} className={`${selectedFiles.includes(file) ? "hidden" : ""} text-white h-7 w-7 lg:h-7 lg:w-7`} />
                </div>
                {selectedFiles.includes(file) && (
                  <div onClick={() => handleSelectFile(file)}>
                    <FontAwesomeIcon icon={faSquareCheck} className="text-blue-500 h-7 w-7" />
                  </div>
                )}

                <div className="relative z-100">
                  <button className="text-gray-500 pr-3" onClick={() => toggleOption(file.id)}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                  <div className={`${visibleOptionId === file.id ? "block" : "hidden"} absolute right-1 mt-2 w-36 bg-white border rounded-md shadow-lg`}>
                    <div className="flex hover:bg-gray-100">
                      <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-gray-400 pl-2 py-2" />
                      <button className="block w-full text-left px-4 text-gray-700" onClick={() => window.open(`http://localhost:5000${file.gambar}`, "_blank")}>
                        Download
                      </button>
                    </div>

                    <div className="flex hover:bg-gray-100">
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-gray-400 pl-2 py-2" />
                      <button className="block w-full text-left px-4 text-gray-700" onClick={() => openDeleteItemModal(file, "galeri")}>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {file.gambar ? (
                <div className="w-full h-40 flex justify-center items-center bg-gray-100 rounded-md overflow-hidden">
                  <img src={`http://localhost:5000${file.gambar}`} alt={file.gambar} className="w-full h-full object-contain" />
                </div>
              ) : (
                <p className="text-gray-500 italic">No Image</p>
              )}

              {/* <p className="text-sm mt-2 font-semibold text-gray-700 truncate">{formatTanggal(file.createdAt)}</p> */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNotulensi = () => {
    return (
      <div className="flex flex-wrap justify-center md:justify-start">
        <button className="w-1/2 border border-dashed border-gray-500 h-48 lg:w-36 lg:h-48 lg:mr-2 mt-2 p-2 flex flex-col justify-center items-center cursor-pointer" onClick={() => handleAdd("notulensi", desa)}>
          <FontAwesomeIcon icon={faPlus} className="w-1/2 h-1/2 lg:w-20 lg:h-20 text-gray-400" />
          <div className="w-full text-xs lg:text-sm text-center text-gray-500">Unggah Notulensi</div>
        </button>

        {notulensi.length === 0 && <div className="w-full text-center text-gray-500 mt-3">Tidak ada file ditemukan</div>}
        {notulensi.map((file) => (
          <div key={file.id} className="relative w-1/2 lg:w-40 p-2" onClick={() => handleItemSelect(file)}>
            <div className={`border cursor-pointer ${selectedFiles.includes(file) ? "border-blue-500" : "border-gray-400"}`}>
              <div className="h-8 bg-gray-300 flex justify-between">
                <div className={`${selectedFiles.includes(file) ? "hidden" : ""} text-white h-2 w-2 lg:h-7 lg:w-7`} onClick={() => handleSelectFile(file)}>
                  <FontAwesomeIcon icon={faSquare} className={`${selectedFiles.includes(file) ? "hidden" : ""} text-white h-7 w-7 lg:h-7 lg:w-7`} />
                </div>
                {selectedFiles.includes(file) && (
                  <div onClick={() => handleSelectFile(file)}>
                    <FontAwesomeIcon icon={faSquareCheck} className="text-blue-500 h-7 w-7" />
                  </div>
                )}

                <div className="relative z-100">
                  <button className="text-gray-500 pr-3" onClick={() => toggleOption(file.id)}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                  <div className={`${visibleOptionId === file.id ? "block" : "hidden"} absolute right-1 mt-2 w-36 bg-white border rounded-md shadow-lg`}>
                    <div className="flex hover:bg-gray-100">
                      <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-gray-400 pl-2 py-2" />
                      <button className="block w-full text-left px-4 text-gray-700" onClick={() => window.open(`http://localhost:5000/uploads/${file.file}`, "_blank")}>
                        Download
                      </button>
                    </div>

                    <div className="flex hover:bg-gray-100">
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-gray-400 pl-2 py-2" />
                      <button className="block w-full text-left px-4 text-gray-700" onClick={() => openDeleteItemModal(file, "notulensi")}>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {file.gambar ? (
                <img src={`http://localhost:5000${file.gambar}`} alt={file.gambar} className="w-full h-24 object-cover rounded-md" />
              ) : (
                <div className="flex justify-center items-center w-full h-24 bg-gray-200 rounded-md">
                  <FontAwesomeIcon icon={faFilePdf} className="text-gray-500 text-3xl" />
                </div>
              )}
              <p className="text-sm font-semibold text-gray-700 truncate text-center">{file.catatan}</p>
              {/* <p className="text-sm mt-2 font-semibold text-gray-700 truncate">{formatTanggal(file.createdAt)}</p> */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPengurus = () => (
    <>
      <div className="flex flex-wrap justify-center md:justify-start p-4">
        <button onClick={() => handleAdd("pengurus", desa)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center gap-2">
          <FaPlus /> Tambah Pengurus
        </button>
      </div>

      <div className="w-full p-2 pt-1 overflow-x-auto">
        {/* Check if mobile */}
        {window.innerWidth < 768 ? (
          // Kode untuk tampilan mobile
          <div className="block md:hidden">
            {pengurus.map((item, index) => (
              <div key={item.id} className="mb-4 border p-4 rounded-md bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-1">
                  {index + 1}. {item.nama}
                </h2>
                <div className="flex flex-col space-y-1 text-gray-700">
                  <div className="flex items-center">
                    <strong className="w-20 pl-3">Jabatan</strong>
                    <span>: {item.jabatan}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="w-20 pl-3">No HP</strong>
                    <span>: {item.nohp}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button onClick={() => handleEditModal(item, "pengurus")} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <FaEdit />
                  </button>
                  <button onClick={() => openDeleteItemModal(item, "pengurus")} className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Kode untuk tampilan desktop
          <table className="min-w-full text-sm border-collapse table-auto">
            <thead>
              <tr>
                <th className="border px-2 py-1">No</th>
                <th className="border px-2 py-1">Nama</th>
                <th className="border px-2 py-1">Jabatan</th>
                <th className="border px-2 py-1">No HP</th>
                <th className="border px-2 py-1">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengurus.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{item.nama}</td>
                  <td className="border px-2 py-1">{item.jabatan}</td>
                  <td className="border px-2 py-1">{item.nohp}</td>
                  <td className="border px-2 py-1 text-center">
                    <button onClick={() => handleEditModal(item, "pengurus")} className="mt-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <FaEdit />
                    </button>
                    <button className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600" onClick={() => openDeleteItemModal(item, "pengurus")}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderProduk = () => (
    <>
      <div className="flex flex-wrap justify-center md:justify-start">
        {/* Tombol untuk menambah file produk */}
        <button className="w-1/2 border border-dashed border-gray-500 h-48 lg:w-36 lg:h-48 lg:mr-2 mt-2 p-2 flex flex-col justify-center items-center cursor-pointer" onClick={() => handleAdd("produk", desa)}>
          <FontAwesomeIcon icon={faPlus} className="w-1/2 h-1/2 lg:w-20 lg:h-20 text-gray-400" />
          <div className="w-full text-xs lg:text-sm text-center text-gray-500">Unggah Produk</div>
        </button>

        {produk.length === 0 && <div className="w-full text-center text-gray-500 mt-3">Tidak ada produk ditemukan</div>}

        {/* Tampilkan foto produk dan nama produk dalam grid */}
        {produk.map((item) => (
          <div key={item.id} className="relative w-1/2 p-2 h-48 lg:w-36 lg:h-48" onClick={() => handleItemSelect(item)}>
            <div className="border overflow-hidden rounded-md">
              {/* Membungkus gambar dalam div agar penuh */}
              <div className="w-full h-40 flex justify-center items-center bg-gray-100">
                <img src={`http://localhost:5000${item.foto}`} alt={item.nama} className="w-full h-full object-contain" />
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold truncate">{item.nama}</p>
              </div>
            </div>

            {/* Tombol titik tiga di pojok kanan atas */}
            <div className="absolute p-2 top-2 right-2 cursor-pointer" onClick={() => toggleOption(item.id)}>
              <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600" />
            </div>

            {/* Menu Edit dan Hapus */}
            {visibleOptionId === item.id && (
              <div className="absolute top-8 right-2 bg-white border rounded-md shadow-md w-32">
                <div className="flex items-center p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleEditModal(item, "produk")}>
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </div>
                <div className="flex items-center p-2 cursor-pointer hover:bg-gray-100" onClick={() => openDeleteItemModal(item, "produk")}>
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Hapus
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const renderPreviewContent = () => {
    if (selectedTab === "Produk" && selectedItem) {
      return (
        <div className="p-4">
          <h3 className="text-lg font-semibold text-center">Preview Produk</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <strong className="w-1/4">Nama</strong>
              <span>: {selectedItem.nama}</span>
            </div>
            <div className="flex items-center">
              <strong className="w-1/4">Harga</strong>
              <span>: {formatRupiah(selectedItem.harga)}</span>
            </div>
            <div className="flex items-center">
              <strong className="w-1/4">Deskripsi</strong>
              <span>: {selectedItem.deskripsi}</span>
            </div>
            <div className="flex flex-col items-center w-full h-[500px] bg-gray-200 rounded-md overflow-hidden">
              <img src={`http://localhost:5000${selectedItem.foto}`} alt="Produk" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      );
    } else if (selectedTab === "Galeri" && selectedItem) {
      return (
        <div className="p-4 flex justify-center">
          <div className="text-center w-full">
            <h3 className="text-lg font-semibold mb-4">Preview Galeri</h3>
            <div className="flex justify-center items-center w-full h-[500px] bg-gray-200 rounded-md overflow-hidden">
              <img src={`http://localhost:5000${selectedItem.gambar}`} alt="Galeri" className="w-full h-full object-contain" />
            </div>
            <p className="mt-4">Diunggah {formatTanggal(selectedItem.createdAt)}</p>
          </div>
        </div>
      );
    } else if (selectedTab === "Notulensi / Materi" && selectedItem) {
      return (
        <div className="p-4">
          <h3 className="text-lg font-semibold text-center">Preview Notulensi</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-center items-center w-full h-[500px] bg-gray-200 rounded-md mb-4 mt-6">
              <iframe src={`http://localhost:5000/uploads/${selectedItem.file}`} width="100%" height="100%" style={{ border: "none" }} title="Notulensi Preview" />
            </div>
            <div className="flex items-center">
              <strong className="w-1/4">Diunggah pada</strong>
              <span>: {formatTanggal(selectedItem.createdAt)}</span>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() => window.open(`http://localhost:5000/uploads/${selectedItem.file}`, "_blank")}>
                Download File
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <p>Tidak ada file yang dipilih</p>;
  };

  const renderTabContent = () => {
    if (selectedTab === "Notulensi / Materi") {
      return renderNotulensi();
    }

    if (selectedTab === "Galeri") {
      return renderGaleri();
    }

    if (selectedTab === "Pengurus") {
      return renderPengurus();
    }

    if (selectedTab === "Produk") {
      return renderProduk();
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
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filesMap = {
    galeriFoto: photo,
    notulensiMateri: note,
  };

  const handleSelectAllFiles = () => {
    if (selectedFiles.length === currentFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(currentFiles);
    }
  };

  const onTabChange = (tab) => {
    setSelectedTab(tab); // Mengubah state selectedTab
    setSelectedFiles([]); // Reset file yang dipilih saat tab berubah
    setSelectedItem(null); // Reset selected item ketika tab berubah
    setIsEdit(false);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item); // Menyimpan item yang dipilih ke dalam state
  };

  const handleEditToggle = () => {
    setIsEdit((prev) => !prev); // Mengubah status mode edit
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Beranda", path: "/peta-desa" },
    { label: "Kabupaten/Kota", path: "/kabupaten-page" },
    {
      label: desa.kabupatenNama, // Nama kabupaten (contoh: Sleman, Bantul)
      path: `/detail-kabupaten/${encodeURIComponent(desa.kabupatenNama)}`,
    },
    {
      label: `Kelompok Desa - ${desa.kabupatenNama}`,
      path: `/kelompok-desa?kabupaten=${encodeURIComponent(desa.kabupatenNama)}`,
    },
    { label: desa.kelompok_desa, path: null }, // Halaman saat ini
  ];

  return (
    <>
      {showErrorNotification && errorMessage && <ErrorNotification message={errorMessage} onClose={handleClose} />}
      {showSuccessNotification && successMessage && <SuccessNotification message={successMessage} onClose={handleClose} />}
      <div className="p-5">
        <div className="p-1">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <button onClick={() => navigate(-1)} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none">
          Kembali
        </button>

        <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row py-2 space-x-6">
          <div className="flex flex-col w-full lg:w-1/2 space-y-6">
            <div className="bg-white p-6 shadow rounded-md">
              <div className="border-b-2 pb-1 border-black">
                <h1 className="text-xl font-semibold mb-2">{desa.kelompok_desa}</h1>
              </div>

              {/* Tampilan Mobile */}
              <div className="lg:hidden mt-4 space-y-4">
                <div>
                  <p className="font-semibold">Alamat</p>
                  <p>
                    {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel. {desa.kelurahanNama}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Tanggal Pembentukan</p>
                  <p>{formatTanggal(desa.tahun_pembentukan)}</p>
                </div>

                <div>
                  <p className="font-semibold">Jumlah Hibah Diterima</p>
                  <p>{formatRupiah(desa.jumlah_hibah_diterima)}</p>
                </div>

                <div>
                  <p className="font-semibold">Jumlah Dana Sekarang</p>
                  <p>{formatRupiah(desa.jumlah_dana_sekarang)}</p>
                </div>

                <div>
                  <p className="font-semibold">Jumlah Anggota Awal</p>
                  <p>{desa.jumlah_anggota_awal}</p>
                </div>

                <div>
                  <p className="font-semibold">Jumlah Anggota Sekarang</p>
                  <p>{desa.jumlah_anggota_sekarang}</p>
                </div>

                <div>
                  <p className="font-semibold">Kategori</p>
                  <p>{desa.kategori}</p>
                </div>
              </div>

              {/* Tampilan Desktop */}
              <div className="hidden lg:flex mt-4 space-x-4 lg:space-x-40">
                <div className="space-y-2 w-[100%]">
                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Alamat</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">
                      {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel. {desa.kelurahanNama}
                    </p>
                  </div>

                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Tanggal Pembentukan</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">{formatTanggal(desa.tahun_pembentukan)}</p>
                  </div>

                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Jumlah Hibah Diterima</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">{formatRupiah(desa.jumlah_hibah_diterima)}</p>
                  </div>

                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Jumlah Dana Sekarang</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">{formatRupiah(desa.jumlah_dana_sekarang)}</p>
                  </div>

                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Jumlah Anggota Awal</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">{desa.jumlah_anggota_awal}</p>
                  </div>

                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Jumlah Anggota Sekarang</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">{desa.jumlah_anggota_sekarang}</p>
                  </div>

                  <div className="flex items-start">
                    <p className="text-gray-600 flex-shrink-0 w-2/5">
                      <strong>Kategori</strong>
                    </p>
                    <p>:</p>
                    <p className="text-gray-600 ml-2">{desa.kategori}</p>
                  </div>
                </div>
              </div>

              {/* Tombol */}
              <div className="mt-4 flex space-x-2 justify-end">
                <div className="flex lg:w-3/12 justify-center py-1 px-2 space-x-2 text-sm lg:text-lg font-semibold bg-green-200 hover:bg-green-400 rounded-md shadow-sm cursor-pointer text-green-700 hover:text-white">
                  <div>
                    <FontAwesomeIcon icon={faDownload} />
                  </div>
                  <div>Cetak Hasil</div>
                </div>

                <button
                  className="w-3/12 lg:w-2/12 text-sm lg:text-lg bg-blue-200 text-blue-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={() => handleEdit(desa)}
                >
                  Edit
                </button>

                <button
                  className="w-3/12 lg:w-2/12 text-sm lg:text-lg bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Hapus
                </button>
              </div>
            </div>

            <div>
              <TabPanel tabs={tabs} selectedTab={selectedTab} onTabChange={onTabChange} className="shadow rounded-md text-xs w-1/2" />

              <div className="bg-white p-4 pb-6 shadow rounded-md border-gray">{renderTabContent()}</div>
            </div>
          </div>
          {/* Kotak Preview */}
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-md p-6 mt-4 lg:mt-0 ml-0 lg:ml-4">
            {/* <h3 className="text-xl font-semibold mb-2 text-center">Preview</h3> */}
            {renderPreviewContent()}
          </div>
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
              <p>Apakah Anda yakin ingin menghapus {deleteItemType === "galeri" ? "gambar" : deleteItemType === "notulensi" ? "notulensi" : deleteItemType === "produk" ? "produk" : "pengurus"} ini?</p>
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

        <EditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={handleEditSubmit} initialData={entityToEdit} entityType={editEntityType} />

        {isModalOpen && modalType === "form" && <ModalForm onClose={handleModalClose} selectedDesa={selectedDesa} />}
        {isModalOpen && modalType === "notulensi" && <ModalDetail onClose={handleModalClose} selectedDesa={selectedDesa} activeTab="notulensiMateri" />}
        {isModalOpen && modalType === "galeri" && <ModalDetail onClose={handleModalClose} selectedDesa={selectedDesa} activeTab="galeriFoto" />}
        {isModalOpen && modalType === "produk" && <ModalDetail onClose={handleModalClose} selectedDesa={selectedDesa} activeTab="uraianProduk" />}
        {isModalOpen && modalType === "pengurus" && <ModalDetail onClose={handleModalClose} selectedDesa={selectedDesa} activeTab="pengurusDesa" />}

        <ToastContainer />
      </div>
    </>
  );
};

export default DetailDesaPage;
