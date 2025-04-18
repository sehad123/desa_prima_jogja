import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useSelectionHandlers = (initialSelectedItems = []) => {
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [visibleOptionId, setVisibleOptionId] = useState(null);
  const optionsRef = useRef({});

  // Handle click outside dropdown
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
      a.download = filename || url.split("/").pop() || `file_${new Date().getTime()}`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.update(toastId, {
        render: "Download berhasil!",
        type: "success",
        isLoading: false,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.update(toastId, {
        render: error.message || "Gagal mengunduh file",
        type: "error",
        isLoading: false,
      });
    }
  };

  const handleDownloadMultiple = async (selectedItems, selectedTab) => {
    if (selectedItems.length === 0) {
      toast.warning("Pilih setidaknya satu item untuk diunduh");
      return;
    }

    const toastId = `download-${Date.now()}`;
    toast.loading(`Mempersiapkan ${selectedItems.length} file...`, {
      toastId,
    });

    try {
      let successful = 0;
      const failedDownloads = [];

      const downloadPDF = async (item, index) => {
        try {
          if (!item.file) throw new Error("File tidak tersedia di database");
          
          const fileName = `Notulensi_${item.catatan || item.id}.pdf`;
          const baseUrl = "http://localhost:5000";
          let filePath = item.file.replace(/^\/+/, "");
          if (!filePath.startsWith("uploads/")) {
            filePath = `uploads/${filePath}`;
          }
          const fileUrl = `${baseUrl}/${filePath}`;

          const headResponse = await fetch(fileUrl, {
            method: "HEAD",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (!headResponse.ok) {
            throw new Error(`File tidak ditemukan (${headResponse.status})`);
          }

          const response = await fetch(fileUrl, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (!response.ok) throw new Error(`Gagal mengambil file (${response.status})`);

          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);

          return true;
        } catch (error) {
          console.error(`Gagal mengunduh ${item.nama || `item ${index}`}:`, error);
          throw error;
        }
      };

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
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      const BATCH_SIZE = 2;
      for (let i = 0; i < selectedItems.length; i += BATCH_SIZE) {
        const batch = selectedItems.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map(async (item, idx) => {
            try {
              let downloadUrl, filename;

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

              if (!downloadUrl) throw new Error("URL tidak valid");

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (successful > 0) {
        toast.update(toastId, {
          render: `${successful}/${selectedItems.length} file berhasil diunduh`,
          type: "success",
          isLoading: false
        });
      } else {
        toast.update(toastId, {
          render: "Tidak ada file yang berhasil diunduh",
          type: "error",
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error utama:", error);
      toast.update(toastId, {
        render: "❌ Terjadi kesalahan sistem saat mengunduh",
        type: "error",
        isLoading: false,
      });
    }
  };

  const handleDeleteMultiple = async (selectedItems, selectedTab, id, fetchFunctions) => {
    // Validasi tambahan
    if (!selectedItems || !Array.isArray(selectedItems)) {
      toast.error("Data item tidak valid");
      throw new Error("selectedItems harus berupa array");
    }
  
    if (selectedItems.length === 0) {
      toast.warning("Pilih minimal 1 item", {
        toastId: "delete-warning",
      });
      return;
    }
  
    const toastId = toast.loading("Memproses penghapusan...", {
      toastId: "delete-loading"
    });
  
    try {
      const validItems = selectedItems.filter(
        (item) => item?.id && (!item.desaId || item.desaId.toString() === id)
      );
  
      const type = {
        Produk: "produk",
        Pengurus: "pengurus",
        "Notulensi / Materi": "notulensi",
        Galeri: "galeri",
      }[selectedTab];
  
      if (!type) {
        throw new Error("Jenis tab tidak valid");
      }
  
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
  
      // Update toast dengan delay
      setTimeout(() => {
        toast.update(toastId, {
          render: `Berhasil menghapus ${validItems.length} item`,
          type: "success",
          isLoading: false
        });
      }, 500);
  
      // Refresh data
      await Promise.all(
        Object.values(fetchFunctions)
          .filter(fn => typeof fn === "function")
          .map(fn => fn())
      );
  
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      
      toast.update(toastId, {
        render: error.response?.data?.message || "Gagal menghapus item",
        type: "error",
        isLoading: false,
      });
      
      throw error;
    }
  };

  return {
    downloadFile,
    handleDownloadMultiple,
    handleDeleteMultiple,
  };
};