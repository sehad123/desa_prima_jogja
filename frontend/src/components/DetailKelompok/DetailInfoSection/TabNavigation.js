import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ModalForm from "../Modal/ModalForm"; // Modal for adding data
import DeleteDetailModal from "../Modal/FormDeleteDetail";
import ModalDetail from "../Modal/ModalDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Audio } from "react-loader-spinner";
import TabPanel from "./TabPanel";
import DetailInformasi from "./DetailInformasi";
import PreviewContent from "./PriviewContent";
import Pengurus from "./Tabs/Pengurus";
import Produk from "./Tabs/Produk";
import Notulensi from "./Tabs/Notulensi";
import Galeri from "./Tabs/Galeri";

const DetailDesaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const optionsRef = useRef({});
  const [desa, setDesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteActivity, setLoadingDeleteActivity] = useState(false);
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false); // Modal konfirmasi hapus item
  const [showOptions, setShowOptions] = useState(false);
  const [visibleOptionId, setVisibleOptionId] = useState(null);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] =
    useState(false);

  const handleClickOutside = (event) => {
    if (
      visibleOptionId &&
      optionsRef.current[visibleOptionId] &&
      !optionsRef.current[visibleOptionId].contains(event.target)
    ) {
      setVisibleOptionId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleOptionId]);

  const toggleOption = (id) => {
    setVisibleOptionId(visibleOptionId === id ? null : id);
  };

  const [profil, setProfil] = useState({});

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfil(response.data); // Set nama dan NIP ke state
      } catch (error) {
        console.error(
          "Gagal mengambil profil:",
          error.response?.data?.error || error.message
        );
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
      const response = await axios.get(
        `http://localhost:5000/api/desa/${id}/galeri`
      );
      setGaleri(response.data);
      console.log("Galeri Data:", response.data); // Tambahkan ini untuk debugging
    } catch (err) {
      console.error("Gagal memuat galeri", err);
    }
  };

  const fetchNotulensi = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/desa/${id}/notulensi`
      );
      setNotulensi(response.data);
      console.log("Notulensi Data:", response.data); // Tambahkan ini untuk debugging
    } catch (err) {
      console.error("Gagal memuat notulensi", err);
    }
  };
  const fetchProduk = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/desa/${id}/produk`
      );
      setProduk(response.data);
    } catch (err) {
      console.error("Gagal memuat Produk", err);
    }
  };
  const fetchPengurus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/desa/${id}/pengurus`
      );
      setPengurus(response.data);
    } catch (err) {
      console.error("Gagal memuat Pengurus", err);
    }
  };

  useEffect(() => {
    fetchDesaDetail();
  }, [id]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchDesaDetail(),
          fetchGaleri(),
          fetchProduk(),
          fetchPengurus(),
          fetchNotulensi(),
        ]);
        setLoadingData(false);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setLoadingData(false);
      }
    };

    fetchAllData();
  }, [id]);

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
  }, [selectedTab]);

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

  useEffect(() => {
    if (selectedTab === "Galeri") {
      setCurrentFiles(galeri);
    } else if (selectedTab === "Notulensi / Materi") {
      setCurrentFiles(notulensi);
    } else if (selectedTab === "Produk") {
      setCurrentFiles(produk);
    } else if (selectedTab === "Pengurus") {
      setCurrentFiles(pengurus);
    }
    // ... dan seterusnya
  }, [selectedTab, galeri, notulensi, produk, pengurus]);

  const toggleSelectItem = (item) => {
    if (Array.isArray(item)) {
      setSelectedItems([]);
      return;
    }
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === currentFiles.length) {
      setSelectedItems([]);
    } else {
      // Only select items that are visible in currentFiles
      setSelectedItems([...currentFiles]);
    }
  };

  const handleDownloadMultiple = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Pilih setidaknya satu item untuk diunduh", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const toastId = `download-${Date.now()}`;
    toast.loading(`Mempersiapkan ${selectedItems.length} file...`, {
      toastId,
      position: "top-center",
    });

    try {
      let successful = 0;
      const failedDownloads = [];

      // Fungsi khusus untuk download PDF
      const downloadPDF = async (item, index) => {
        try {
          // 1. Validasi file tersedia
          if (!item.file) {
            throw new Error("File tidak tersedia di database");
          }

          // 2. Format nama file yang aman
          const fileName = `Notulensi_${item.catatan || item.id}.pdf`;

          // 3. Bangun URL yang benar
          const baseUrl = "http://localhost:5000";
          let filePath = item.file.replace(/^\/+/, ""); // Hapus slash di awal
          if (!filePath.startsWith("uploads/")) {
            filePath = `uploads/${filePath}`; // Tambahkan folder uploads jika belum ada
          }
          const fileUrl = `${baseUrl}/${filePath}`;

          // 4. Verifikasi file ada di server
          const headResponse = await fetch(fileUrl, {
            method: "HEAD",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (!headResponse.ok) {
            throw new Error(`File tidak ditemukan (${headResponse.status})`);
          }

          // 5. Download menggunakan blob method
          const response = await fetch(fileUrl, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (!response.ok)
            throw new Error(`Gagal mengambil file (${response.status})`);

          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);

          return true;
        } catch (error) {
          console.error(
            `Gagal mengunduh ${item.nama || `item ${index}`}:`,
            error
          );
          throw error;
        }
      };

      // Proses download sequential untuk PDF (lebih stabil)
      if (selectedTab === "Notulensi / Materi") {
        for (const [index, item] of selectedItems.entries()) {
          try {
            toast.update(toastId, {
              render: `Mengunduh ${index + 1}/${selectedItems.length}: ${
                item.nama || `File ${index + 1}`
              }`,
              isLoading: true,
            });

            await downloadPDF(item, index);
            successful++;
          } catch (error) {
            failedDownloads.push({
              id: item.id,
              nama: item.nama,
              error: error.message,
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 500)); // Jeda antar file
        }
      }

      const downloadFile = async (url, filename, retries = 3) => {
        try {
          if (!url) {
            throw new Error("URL tidak valid");
          }

          const token = localStorage.getItem("authToken");
          if (!token) {
            throw new Error("Token tidak ditemukan");
          }

          const fullUrl = url.startsWith("http")
            ? url
            : `http://localhost:5000${url.startsWith("/") ? url : `/${url}`}`;

          const response = await fetch(fullUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Gagal mengambil file (${response.status})`);
          }

          const blob = await response.blob();
          if (!blob.size) {
            throw new Error("File kosong");
          }

          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);

          return true;
        } catch (err) {
          console.error(`Error downloading ${filename}:`, err);
          if (retries <= 1) throw err;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return downloadFile(url, filename, retries - 1);
        }
      };

      const BATCH_SIZE = 2;

      for (let i = 0; i < selectedItems.length; i += BATCH_SIZE) {
        const batch = selectedItems.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map(async (item, idx) => {
            try {
              let downloadUrl, filename;

              // Determine URL and filename based on tab
              if (selectedTab.toLowerCase().includes("galeri")) {
                downloadUrl = item.gambar;
                filename = `Galeri_${item.desaId}_${
                  item.gambar?.split("/").pop() || Date.now()
                }.jpg`;
              } else if (selectedTab.toLowerCase().includes("produk")) {
                downloadUrl = item.foto;
                filename = `Produk_${
                  item.nama?.replace(/[^a-z0-9]/gi, "_") || item.id
                }.${item.foto?.split(".").pop() || "jpg"}`;
              } else {
                return;
              }

              if (!downloadUrl) {
                throw new Error("URL tidak valid");
              }

              // Update progress
              toast.update(toastId, {
                render: `Memproses ${i + idx + 1}/${
                  selectedItems.length
                }: ${filename.substring(0, 20)}...`,
                type: "default",
                isLoading: true,
              });

              await downloadFile(downloadUrl, filename);
              successful++;
            } catch (error) {
              console.error(`Gagal mengunduh ${item.nama || "item"}:`, error);
              throw error;
            }
          })
        );

        // Handle failed downloads in batch
        results.forEach((result, idx) => {
          if (result.status === "rejected") {
            console.error(`Gagal mengunduh item ${i + idx}:`, result.reason);
          }
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Tampilkan hasil akhir
      if (successful > 0) {
        toast.update(toastId, {
          render: `${successful}/${selectedItems.length} file berhasil diunduh`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId, {
          render: "Tidak ada file yang berhasil diunduh",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error utama:", error);
      toast.update(toastId, {
        render: "❌ Terjadi kesalahan sistem saat mengunduh",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (url, filename) => {
    // Validasi input
    if (!url || typeof url !== "string") {
      toast.error("URL file tidak valid");
      console.error("Invalid URL:", url);
      return;
    }

    const toastId = toast.loading("Memulai download...");

    try {
      const token = localStorage.getItem("authToken");

      // Normalisasi URL
      let fullUrl;
      try {
        fullUrl = url.startsWith("http")
          ? url
          : url.startsWith("/")
          ? `http://localhost:5000${url}`
          : `http://localhost:5000/${url}`;
      } catch (e) {
        throw new Error("Format URL tidak valid");
      }

      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil file (${response.status})`);
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error("File kosong atau tidak valid");
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download =
        filename || url.split("/").pop() || `file_${new Date().getTime()}`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.update(toastId, {
        render: "Download berhasil!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.update(toastId, {
        render: error.message || "Gagal mengunduh file",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  // Improved handleDeleteMultiple function
  const handleDeleteMultiple = async () => {
    console.log("Memulai proses delete multiple...");

    // 0. Pastikan ada item terpilih
    if (selectedItems.length === 0) {
      toast.warning("Pilih minimal 1 item", {
        toastId: "delete-warning",
        position: "top-center", // Ubah posisi untuk testing
      });
      return;
    }

    try {
      // 1. Tutup modal dan tunggu benar-benar tertutup
      setIsDeleteMultipleModalOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay lebih panjang

      // 2. Tampilkan toast loading
      const loadingToast = toast.loading("Memproses penghapusan...", {
        position: "top-center",
      });

      // 3. Validasi item
      const validItems = selectedItems.filter(
        (item) => item.id && (!item.desaId || item.desaId.toString() === id)
      );

      // 4. Kirim request
      const type = {
        Produk: "produk",
        Pengurus: "pengurus",
        "Notulensi / Materi": "notulensi",
        Galeri: "galeri",
      }[selectedTab];

      const response = await axios.post(
        `http://localhost:5000/api/desa/${id}/delete-multiple`,
        { type, ids: validItems.map((i) => i.id) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 5. Update toast menjadi sukses
      toast.update(loadingToast, {
        render: `Berhasil menghapus ${validItems.length} item`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // 6. Update state
      setSelectedItems([]);
      await fetchGaleri();
      await fetchNotulensi();
      await fetchProduk();
    } catch (error) {
      console.error("Error:", {
        message: error.message,
        response: error.response?.data,
      });

      // Toast error spesifik
      toast.error(
        error.response?.data?.message ||
          "Gagal menghapus item. Silakan coba lagi",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    } finally {
      setLoadingDeleteActivity(false);
    }
  };

  if (loading || loadingDelete || loadingDeleteActivity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#542d48" height={80} width={80} />
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

  const handleEditModal = (item, type) => {
    setEntityToEdit(item);
    setEditEntityType(type);
    setModalType(type); // Ini penting untuk menentukan modal mana yang akan ditampilkan
    setIsModalOpen(true);
  };

  const handleAdd = (type, desa) => {
    setSelectedDesa(desa);
    setEntityToEdit(null);
    setModalType(type); // Set the modal type to either "galeri" or "notulensi"
    setIsModalOpen(true);
  };

  const handleSelectFile = (file) => {
    setSelectedFiles((prev) => {
      const newSelectedFiles = prev.includes(file)
        ? prev.filter((f) => f !== file)
        : [...prev, file];

      return newSelectedFiles;
    });
  };

  const doubleActionFile = (file) => {
    handleSelectFile(file);
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
    setSelectedTab(tab);
    setSelectedFiles([]);
    setSelectedItems([]); // Reset selected items when tab changes
    setSelectedItem(null);
    setIsEdit(false);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item); // Menyimpan item yang dipilih ke dalam state
  };

  const handleEditToggle = () => {
    setIsEdit((prev) => !prev); // Mengubah status mode edit
  };

  const confirmDeleteMultiple = () => {
    if (selectedItems.length === 0) {
      toast.warning("Tidak ada item yang dipilih");
      return;
    }
    setIsDeleteMultipleModalOpen(true);
  };

  // Fungsi untuk menghapus galeri atau notulensi
  const handleDeleteItem = async () => {
    try {
      if (deleteItemType === "galeri") {
        await axios.delete(
          `http://localhost:5000/api/desa/${id}/galeri/${itemToDelete.id}`
        );
        toast.success(`Gambar berhasil dihapus!`);
        fetchGaleri();
      } else if (deleteItemType === "notulensi") {
        await axios.delete(
          `http://localhost:5000/api/desa/${id}/notulensi/${itemToDelete.id}`
        );
        toast.success(
          `Notulensi "${itemToDelete.catatan || " "}" berhasil dihapus!`
        );
        fetchNotulensi();
      } else if (deleteItemType === "produk") {
        await axios.delete(
          `http://localhost:5000/api/desa/${id}/produk/${itemToDelete.id}`
        );
        toast.success(
          `Produk "${
            itemToDelete.nama || itemToDelete.namaProduk || " "
          }" berhasil dihapus!`
        );
        fetchProduk();
      } else if (deleteItemType === "pengurus") {
        await axios.delete(
          `http://localhost:5000/api/desa/${id}/pengurus/${itemToDelete.id}`
        );
        toast.success(
          `Pengurus "${
            itemToDelete.nama || itemToDelete.namaPengurus || " "
          }" berhasil dihapus!`
        );
        fetchPengurus();
      }
      setIsDeleteItemModalOpen(false);
    } catch (err) {
      toast.error(
        `Gagal menghapus ${deleteItemType}: ${
          err.response?.data?.message || err.message
        }`
      );
      console.error(err);
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Notulensi / Materi":
        return (
          <Notulensi
            notulensi={notulensi}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onDeleteMultiple={confirmDeleteMultiple} // Gunakan confirmDeleteMultiple langsung
            onDelete={(file, type) => {
              setItemToDelete(file);
              setDeleteItemType(type);
              setIsDeleteItemModalOpen(true);
            }}
            onDownload={downloadFile}
            onDownloadMultiple={handleDownloadMultiple}
            onSelect={handleItemSelect}
            selectedItems={selectedItems}
            toggleSelectItem={toggleSelectItem}
            toggleSelectAll={toggleSelectAll}
            toggleOption={toggleOption}
            visibleOptionId={visibleOptionId}
            optionsRef={optionsRef}
            desa={desa}
          />
        );
      case "Galeri":
        return (
          <Galeri
            galeri={galeri}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onDeleteMultiple={confirmDeleteMultiple} // Gunakan confirmDeleteMultiple langsung
            onDelete={(file, type) => {
              setItemToDelete(file);
              setDeleteItemType(type);
              setIsDeleteItemModalOpen(true);
            }}
            onDownload={downloadFile}
            onDownloadMultiple={handleDownloadMultiple}
            onSelect={handleItemSelect}
            selectedItems={selectedItems}
            toggleSelectItem={toggleSelectItem}
            toggleSelectAll={toggleSelectAll}
            toggleOption={toggleOption}
            visibleOptionId={visibleOptionId}
            optionsRef={optionsRef}
            desa={desa}
          />
        );
      case "Pengurus":
        return (
          <Pengurus
            pengurus={pengurus}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onEdit={(type, desa) => handleEditModal(type, desa)}
            onDelete={(file, type) => openDeleteItemModal(file, type)}
            onSelect={handleItemSelect}
            desa={desa}
          />
        );
      case "Produk":
        return (
          <Produk
            produk={produk}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onDeleteMultiple={confirmDeleteMultiple} // Gunakan confirmDeleteMultiple langsung
            onDelete={(file, type) => {
              setItemToDelete(file);
              setDeleteItemType(type);
              setIsDeleteItemModalOpen(true);
            }}
            onEdit={(type, desa) => handleEditModal(type, desa)}
            onDownloadMultiple={handleDownloadMultiple}
            onSelect={handleItemSelect}
            selectedItems={selectedItems}
            toggleSelectItem={toggleSelectItem}
            toggleSelectAll={toggleSelectAll}
            toggleOption={toggleOption}
            visibleOptionId={visibleOptionId}
            optionsRef={optionsRef}
            desa={desa}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="p-5">
        <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row py-2 space-x-0 lg:space-x-6">
          <div className="flex flex-col w-full lg:w-1/2 space-y-6">
            <DetailInformasi
              desa={desa}
              profil={profil}
              galeri={galeri}
              produk={produk}
              pengurus={pengurus}
              onEdit={() => handleEdit(desa)}
              onDelete={() => setIsDeleteModalOpen(true)}
            />

            <div>
              <TabPanel
                tabs={tabs}
                selectedTab={selectedTab}
                onTabChange={onTabChange}
                className="shadow rounded-md text-xs w-1/2"
              />

              <div className="bg-white p-4 pb-6 shadow rounded-md border-gray">
                {renderTabContent()}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-md p-6 mt-4 lg:mt-0 ml-0 lg:ml-4">
            <PreviewContent
              selectedTab={selectedTab}
              selectedItem={selectedItem}
              onDownload={downloadFile}
              onEdit={(selectedItem, selectedTab) =>
                handleEditModal(selectedItem, selectedTab.toLowerCase())
              }
              onDelete={(selectedItem, selectedTab) =>
                openDeleteItemModal(
                  selectedItem,
                  selectedTab === "Notulensi / Materi"
                    ? "notulensi"
                    : selectedTab.toLowerCase()
                )
              }
            />
          </div>
        </div>
      </div>

      {isDeleteMultipleModalOpen && (
        <DeleteDetailModal
          isOpen={isDeleteMultipleModalOpen}
          onClose={() => setIsDeleteMultipleModalOpen(false)}
          onConfirm={handleDeleteMultiple}
          itemType={selectedTab.toLowerCase()}
          itemName={`${selectedItems.length} item`}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteDetailModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDelete}
          itemType="desa"
          itemName={desa?.namaDesa}
        />
      )}

      {isDeleteItemModalOpen && (
        <DeleteDetailModal
          isOpen={isDeleteItemModalOpen}
          onClose={() => setIsDeleteItemModalOpen(false)}
          onConfirm={handleDeleteItem}
          itemType={deleteItemType}
          itemName={
            deleteItemType === "galeri"
              ? ""
              : deleteItemType === "notulensi"
              ? itemToDelete?.catatan
              : deleteItemType === "produk"
              ? itemToDelete?.nama || itemToDelete?.namaProduk
              : itemToDelete?.nama || itemToDelete?.namaPengurus
          }
        />
      )}

      {isModalOpen && modalType === "form" && (
        <ModalForm onClose={handleModalClose} selectedDesa={selectedDesa} />
      )}
     {isModalOpen && (
  <ModalDetail
    isOpen={isModalOpen}
    onClose={handleModalClose}
    selectedDesa={modalType === "notulensi" || modalType === "galeri" ? selectedDesa : desa}
    activeTab={
      modalType === "notulensi" ? "notulensiMateri" :
      modalType === "galeri" ? "galeriFoto" :
      modalType === "produk" ? "uraianProduk" :
      "pengurusDesa"
    }
    initialData={["produk", "pengurus"].includes(modalType) ? entityToEdit : undefined}
  />
)}
    </>
  );
};

export default DetailDesaPage;
