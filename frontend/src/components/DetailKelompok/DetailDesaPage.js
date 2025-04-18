import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useDesaData from "../hooks/useDesaData";
import ModalManager from "./Modal/ModalManager";
import toast from "react-hot-toast";
import { Audio } from "react-loader-spinner";
import { useModalHandlers } from "./hooks/useModalHandling";
import { useTabHandler } from "./hooks/useTabHandling";
import {
  useSelectionHandlers,
  useFileHandlers,
} from "./hooks/useSelectionHandling";
import TabPanel from "./TabPanel";
import DetailInfoSection from "./DetailInfoSection";
import PreviewContent from "./PriviewContent";
import Pengurus from "./TabContent/Pengurus";
import Produk from "./TabContent/Produk";
import Notulensi from "./TabContent/Notulensi";
import Galeri from "./TabContent/Galeri";
import useUserData from "../hooks/useUserData";

const DetailDesaPage = () => {
  const { profil } = useUserData();

  const {
    desa,
    galeri,
    produk,
    pengurus,
    notulensi,
    loading,
    error,
    fetchDesaDetail,
    fetchGaleri,
    fetchProduk,
    fetchPengurus,
    fetchNotulensi,
  } = useDesaData();

  const {
    selectedItems,
    setSelectedItems,
    visibleOptionId,
    optionsRef,
    toggleOption,
    toggleSelectItem,
    toggleSelectAll,
  } = useSelectionHandlers();

  const { downloadFile, handleDownloadMultiple, handleDeleteMultiple } =
    useFileHandlers();

  const {
    // State
    isModalOpen,
    isDeleteModalOpen,
    isDeleteItemModalOpen,
    modalType,
    selectedDesa,
    itemToDelete,
    deleteItemType,
    entityToEdit,
    selectedItem,

    // Setters
    setIsDeleteModalOpen,
    setIsDeleteItemModalOpen,
    setItemToDelete,
    setDeleteItemType,
    setSelectedItem,

    // Handlers
    openDeleteItemModal,
    handleModalClose,
    handleEdit,
    handleEditModal,
    handleAdd,
    handleDeleteModalClose,
  } = useModalHandlers("Pengurus", {
    fetchGaleri,
    fetchNotulensi,
    fetchProduk,
    fetchPengurus,
    fetchDesaDetail,
  });

  const tabConfig = {
    "Detail Kelompok": ["Pengurus", "Produk", "Notulensi / Materi", "Galeri"],
  };

  const { selectedTab, setSelectedTab, currentFiles, setCurrentFiles, tabs } =
    useTabHandler(tabConfig, "Pengurus", {
      fetchGaleri,
      fetchNotulensi,
      fetchProduk,
      fetchPengurus,
      galeri,
      notulensi,
      produk,
      pengurus,
    });

  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteActivity, setLoadingDeleteActivity] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // Menentukan apakah mode edit aktif
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] =
    useState(false);

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
  }, [selectedTab]);

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

  const handleDeleteDesa = async () => {
    try {
      if (!id) {
        toast.error("ID desa tidak valid");
        return;
      }

      // Gunakan toast.promise di sini
      await toast.promise(
        axios.delete(`http://localhost:5000/api/desa/${id}`),
        {
          loading: "Menghapus data desa...",
          success: "Data desa berhasil dihapus!",
          error: (err) => {
            // Handle error spesifik
            if (err.response?.status === 404) {
              return "Desa tidak ditemukan";
            } else {
              return err.response?.data?.message || "Gagal menghapus data";
            }
          },
        }
      );

      setIsDeleteModalOpen(false);
      navigate(
         desa?.kabupatenNama
            ? `/daftar-kelompok?kabupaten=${encodeURIComponent(desa.kabupatenNama)}`
            : `/daftar-kelompok`
      );
    } catch (err) {
      // Error sudah dihandle oleh toast.promise,
      // tapi bisa tambahkan logging jika perlu
      console.error("Error detail:", err);
    }
  };

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

  // Update renderTabContent untuk konsisten dalam memanggil handlers
  const renderTabContent = () => {
    const commonProps = {
      onSelect: handleItemSelect,
      selectedItems: selectedItems || [],
      toggleSelectItem: toggleSelectItem,
      toggleSelectAll: () => toggleSelectAll(currentFiles),
      toggleOption: toggleOption,
      visibleOptionId: visibleOptionId,
      optionsRef: optionsRef,
      desa: desa,
    };

    switch (selectedTab) {
      case "Notulensi / Materi":
        return (
          <Notulensi
            notulensi={notulensi}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onDeleteMultiple={confirmDeleteMultiple}
            onDelete={(file, type) => {
              setItemToDelete(file);
              setDeleteItemType(type);
              setIsDeleteItemModalOpen(true);
            }}
            onDownload={downloadFile}
            onDownloadMultiple={() =>
              handleDownloadMultiple(selectedItems, selectedTab)
            }
            {...commonProps}
          />
        );
      case "Galeri":
        return (
          <Galeri
            galeri={galeri}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onDeleteMultiple={confirmDeleteMultiple}
            onDelete={(file, type) => {
              setItemToDelete(file);
              setDeleteItemType(type);
              setIsDeleteItemModalOpen(true);
            }}
            onDownload={downloadFile}
            onDownloadMultiple={() =>
              handleDownloadMultiple(selectedItems, selectedTab)
            }
            {...commonProps}
          />
        );
      case "Pengurus":
        return (
          <Pengurus
            pengurus={pengurus}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onEdit={(item, type) => handleEditModal(item, type)}
            onDelete={(file, type) => openDeleteItemModal(file, type)}
            {...commonProps}
          />
        );
      case "Produk":
        return (
          <Produk
            produk={produk}
            onAdd={(type, desa) => handleAdd(type, desa)}
            onDeleteMultiple={confirmDeleteMultiple}
            onDelete={(file, type) => {
              setItemToDelete(file);
              setDeleteItemType(type);
              setIsDeleteItemModalOpen(true);
            }}
            onEdit={(item, type) => handleEditModal(item, type)}
            onDownload={downloadFile}
            onDownloadMultiple={() =>
              handleDownloadMultiple(selectedItems, selectedTab)
            }
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  // Update confirmDeleteMultiple untuk konsisten
  const confirmDeleteMultiple = () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.warning("Tidak ada item yang dipilih");
      return;
    }
    setIsDeleteMultipleModalOpen(true);
  };

  // Update handleDeleteMultiple untuk menerima parameter
  const handleDeleteMultipleConfirmed = async () => {
    try {
      const result = await handleDeleteMultiple(
        selectedItems,
        selectedTab,
        id,
        {
          fetchGaleri,
          fetchNotulensi,
          fetchProduk,
          fetchPengurus,
        }
      );

      setIsDeleteMultipleModalOpen(false);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error in handleDeleteMultiple:", error);
    }
  };

  return (
    <>
      <div className="p-5">
        <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row py-2 space-x-0 lg:space-x-6">
          <div className="flex flex-col w-full lg:w-1/2 space-y-6">
            <DetailInfoSection
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

      <ModalManager
        // State modal
        isDeleteMultipleModalOpen={isDeleteMultipleModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleteItemModalOpen={isDeleteItemModalOpen}
        isModalOpen={isModalOpen}
        modalType={modalType}
        // State data
        selectedTab={selectedTab}
        selectedItems={selectedItems}
        deleteItemType={deleteItemType}
        itemToDelete={itemToDelete}
        desa={desa}
        id={id}
        selectedDesa={selectedDesa}
        entityToEdit={entityToEdit}
        // Handlers
        setIsDeleteMultipleModalOpen={setIsDeleteMultipleModalOpen}
        setIsDeleteItemModalOpen={setIsDeleteItemModalOpen} // JANGAN LUPA INI
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDeleteModalClose={handleDeleteModalClose}
        handleDeleteMultipleConfirmed={handleDeleteMultipleConfirmed}
        handleDeleteDesa={handleDeleteDesa}
        handleDeleteItem={handleDeleteItem}
        handleModalClose={handleModalClose}
        setSelectedItems={setSelectedItems}
        // Fetch functions
        fetchGaleri={fetchGaleri}
        fetchNotulensi={fetchNotulensi}
        fetchProduk={fetchProduk}
        fetchPengurus={fetchPengurus}
        // Loading states
        loadingDeleteActivity={loadingDeleteActivity}
        loadingDelete={loadingDelete}
      />
    </>
  );
};

export default DetailDesaPage;
