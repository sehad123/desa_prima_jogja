import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useSelectionHandlers = (initialSelectedItems = []) => {
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [visibleOptionId, setVisibleOptionId] = useState(null);
  const optionsRef = useRef({});

  // Handle click outside dropdown
  const handleClickOutside = (event) => {
    if (visibleOptionId && optionsRef.current[visibleOptionId] && !optionsRef.current[visibleOptionId].contains(event.target)) {
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

  const toggleSelectAll = (currentFiles) => {
    if (selectedItems.length === currentFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...currentFiles]);
    }
  };

  return {
    selectedItems,
    setSelectedItems,
    visibleOptionId,
    optionsRef,
    toggleOption,
    toggleSelectItem,
    toggleSelectAll,
  };
};

export const useFileHandlers = () => {
  const downloadFile = async (url, filename) => {
    if (!url || typeof url !== "string") {
      toast.error("URL file tidak valid");
      console.error("Invalid URL:", url);
      return;
    }

    const toastId = toast.loading("Memulai download...");

    try {
      const token = localStorage.getItem("authToken");
      let fullUrl;

      try {
        if (url.startsWith("http") || url.startsWith("blob:")) {
          fullUrl = url;
        } else {
          // Jika path tidak dimulai dengan '/uploads', tambahkan
          const normalizedPath = url.startsWith("/") ? url : `/${url}`;
          if (!normalizedPath.startsWith("/uploads")) {
            fullUrl = `http://localhost:5000/uploads${normalizedPath}`;
          } else {
            fullUrl = `http://localhost:5000${normalizedPath}`;
          }
        }
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
      a.download = filename || url.split("/").pop() || `file_${new Date().getTime()}`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.dismiss(toastId);
      toast.success("Download berhasil!");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Gagal mengunduh file");
    }
  };

  const handleDownloadMultiple = async (selectedItems, selectedTab) => {
    if (!selectedItems?.length) {
      toast.error("Tidak ada item yang dipilih");
      return;
    }

    // Debug struktur data
    console.log("Selected Items Structure:", selectedItems);

    // Normalisasi dan validasi item
    const downloadableItems = selectedItems
      .map((item) => {
        // Normalisasi properti file
        const fileUrl = item?.gambar || item?.file || item?.url || item?.foto || null;

        // Validasi URL - tambahkan pengecekan untuk string biasa yang mungkin nama file
        const isValidUrl = fileUrl && typeof fileUrl === "string" && fileUrl.trim().length > 0;

        return {
          ...item,
          fileUrl: isValidUrl ? fileUrl : null,
          isValidUrl,
          itemName: item?.nama || item?.nama_produk || `Item ${item?.id || "unknown"}`,
        };
      })
      .filter((item) => item.isValidUrl);

    // Rest of your function remains the same...
    if (downloadableItems.length === 0) {
      toast.error("Tidak ada item dengan URL file yang valid untuk diunduh");
      console.error("Item tidak valid:", selectedItems);
      return;
    }

    const totalFiles = downloadableItems.length;
    let successfulDownloads = 0;
    const failedDownloads = [];
    const loadingToast = toast.loading(`Mempersiapkan ${totalFiles} file...`);

    try {
      for (const [index, item] of downloadableItems.entries()) {
        const currentPosition = index + 1;

        try {
          toast.dismiss(loadingToast);
          toast.loading(`Mengunduh ${currentPosition}/${totalFiles}: ${item.itemName}...`);

          // Pastikan URL lengkap (jika relative path)
          let fullUrl = item.fileUrl;
          if (!fullUrl.startsWith("http") && !fullUrl.startsWith("blob:")) {
            fullUrl = `${process.env.REACT_APP_API_URL || ""}${fullUrl}`;
          }

          console.log(`Downloading: ${item.itemName}`, { url: fullUrl });

          // Generate nama file
          let fileName = `${selectedTab}_${item.itemName.replace(/[^a-z0-9]/gi, "_")}`;
          const urlExt = fullUrl.split(".").pop().split(/\#|\?/)[0];
          if (urlExt && urlExt.length <= 5 && !fileName.includes(".")) {
            fileName += `.${urlExt.toLowerCase()}`;
          }

          // Download file
          await downloadFile(fullUrl, fileName);
          successfulDownloads++;
        } catch (error) {
          console.error(`Gagal mengunduh ${item.itemName}:`, error);
          failedDownloads.push({
            item: item.itemName,
            error: error.message,
            url: item.fileUrl,
            details: error.stack,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Hasil akhir
      toast.dismiss(loadingToast);
      if (successfulDownloads > 0) {
        toast.success(`${successfulDownloads}/${totalFiles} file berhasil diunduh`);
      }
      if (failedDownloads.length > 0) {
        console.error("Detail kegagalan:", failedDownloads);
        toast.error(`${failedDownloads.length} file gagal. Lihat konsol untuk detail.`, { duration: 5000 });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Error sistem: ${error.message}`);
      console.error("Error utama:", error);
    }
  };

  const handleDeleteMultiple = async (selectedItems, selectedTab, desaId, fetchFunctions) => {
    const toastId = toast.loading("Memproses penghapusan...");

    try {
      // Validasi input lebih ketat
      if (!selectedItems || !Array.isArray(selectedItems)) {
        toast.dismiss(toastId);
        return toast.error("Data item tidak valid");
      }

      if (selectedItems.length === 0) {
        toast.dismiss(toastId);
        return toast.error("Tidak ada item yang dipilih");
      }

      // Mapping endpoint ke type dengan validasi
      const endpointMap = {
        Produk: "produk",
        Pengurus: "pengurus",
        "Notulensi / Materi": "notulensi",
        Galeri: "galeri",
        KasDesa: "kas",
      };

      const type = endpointMap[selectedTab];
      if (!type) {
        toast.dismiss(toastId);
        return toast.error(`Jenis konten '${selectedTab}' tidak valid`);
      }

      // Validasi ID
      const invalidIds = selectedItems.filter((item) => !item.id).map((item) => item.id);
      if (invalidIds.length > 0) {
        toast.dismiss(toastId);
        return toast.error(`Beberapa ID tidak valid`);
      }

      // Siapkan payload dengan validasi
      const payload = {
        ids: selectedItems.map((item) => item.id),
        type,
      };

      // Kirim request dengan timeout
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"}/desa/${desaId}/delete-multiple`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 detik timeout
      });

      // Handle response lebih robust
      if (!response.data) {
        throw new Error("Tidak ada data response dari server");
      }

      if (response.data.success) {
        toast.success(`${selectedItems.length} item berhasil dihapus`);

        // Refresh data dengan error handling
        try {
          await Promise.allSettled([fetchFunctions.fetchDesaDetail(), fetchFunctions[`fetch${selectedTab.replace(/ /g, "")}`]()]);
        } catch (fetchError) {
          // console.error("Gagal refresh data:", fetchError);
          // toast("Item berhasil dihapus tetapi gagal refresh data", {
          //   icon: '⚠️', // Emoji warning
          //   style: {
          //     background: '#ffcc00',
          //     color: '#000'
          //   }
          // });
        }
      } else {
        throw new Error(response.data.message || "Gagal menghapus item");
      }
    } catch (error) {
      console.error("Delete error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
        stack: error.stack,
      });

      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Terjadi kesalahan server";

      toast.error(`Gagal menghapus: ${errorMessage}`);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    downloadFile,
    handleDownloadMultiple,
    handleDeleteMultiple,
  };
};
