import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Audio } from "react-loader-spinner";

import DesaDetailLayout from "../DetailKelompok/DetailDesaLayout";
import useDesaData from "../DetailKelompok/hooks/useDesaData";
import GaleriTab from "../DetailKelompok/TabContent/GaleriTab";
// import NotulensiTab from "../DetailKelompok/TabContent/NotulensiTab";
// import PengurusTab from "../DetailKelompok/TabContent/PengurusTab";
// import ProdukTab from "../DetailKelompok/TabContent/ProdukTab";
import KelompokModal from "../Modal/KelompokModal";
import DeleteDetailModal from "../DetailKelompok/Modal/DeleteDetailModal";
import TabDetailModal from "./Modal/TabDetailModal";
import useModalHandling from "./hooks/useModalHandling";
import useFileHandling from "./hooks/useFileHandling";

const DetailDesaPage = () => {
  const { 
    desa, 
    galeri, 
    produk, 
    pengurus, 
    notulensi, 
    profil, 
    loading, 
    error,
    fetchGaleri,  // Ambil fetchGaleri dari useDesaData
    fetchNotulensi,
    fetchProduk,
    fetchPengurus,
    fetchAllData,
    
    refetch 
  } = useDesaData();

  const {
    visibleOptionId,
    dropdownRef,
    handleClearSelection,
    handleDownloadClick,
    handleDownloadMultipleClick,
    handleItemSelect,
    toggleSelectItemClick,
    handleSelectAll,
    toggleOptionClick
  } = useFileHandling();

  const [selectedTab, setSelectedTab] = React.useState("Galeri");
  const [selectedItems, setSelectedItems] = useState([]);
  const [entityToEdit, setEntityToEdit] = useState(null);

  const {
    modals,
    selected,
    setSelected,
    openModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    openDeleteItemModal,
    closeDeleteItemModal,
    openDeleteMultipleModal,
    closeDeleteMultipleModal,
    handleDeleteItem,
    handleDeleteMultiple,
    handleDeleteClick,
    handleDeleteItemClick,
    handleDeleteMultipleClick,
    handleEdit,
    handleEditModal,
    handleAdd,
    handleModalClose
  } = useModalHandling(selectedItems, setSelectedItems, selectedTab.toLowerCase(), refetch);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#542d48" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      // case "Notulensi / Materi":
      //   return (
      //     <NotulensiTab
      //       notulensi={notulensi}
      //       onAdd={() => openModal("notulensi", desa)}
      //       onDeleteMultiple={openDeleteMultipleModal}
      //       onDelete={openDeleteItemModal}
      //       selectedItems={selected.selectedItems}
      //       setSelectedItems={(items) => setSelected(prev => ({ ...prev, selectedItems: items }))}
      //     />
      //   );
      case "Galeri":
        return (
          <GaleriTab
            galeri={galeri}
            desa={desa}
            onAdd={() => handleAdd("galeri", desa, fetchGaleri)}
            selectedItems={selectedItems}
            onSelectItem={setSelectedItems}
            refetch={refetch}
            onDeleteItem={handleDeleteItemClick}
            // onEdit={handleEditModal(selectedItems, "galeri")}
          />
        );
      // case "Pengurus":
      //   return (
      //     <PengurusTab
      //       pengurus={pengurus}
      //       onAdd={() => openModal("pengurus", desa)}
      //       onEdit={(item) => openModal("pengurus", item)}
      //       onDelete={openDeleteItemModal}
      //       onSelect={(item) => setSelected(prev => ({ ...prev, selectedItem: item }))}
      //     />
      //   );
      // case "Produk":
      //   return (
      //     <ProdukTab
      //       produk={produk}
      //       onAdd={() => openModal("produk", desa)}
      //       onDeleteMultiple={openDeleteMultipleModal}
      //       onDelete={openDeleteItemModal}
      //       onEdit={(item) => openModal("produk", item)}
      //       selectedItems={selected.selectedItems}
      //       setSelectedItems={(items) => setSelected(prev => ({ ...prev, selectedItems: items }))}
      //       onSelect={(item) => setSelected(prev => ({ ...prev, selectedItem: item }))}
      //     />
      //   );
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
      
      <DesaDetailLayout
        desa={desa}
        profil={profil}
        selectedTab={selectedTab}
        selectedItem={selected.selectedItems}
        onTabChange={setSelectedTab}
        onEditDesa={() => handleEdit(desa)}
        onDeleteDesa={openDeleteModal}
      >
        {renderTabContent()}
      </DesaDetailLayout>

      {/* Modals */}
      {modals.isDeleteModalOpen && (
        <DeleteDetailModal
        isOpen={modals.isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteClick}
          itemType="desa"
          itemName={desa?.namaDesa}
        />
      )}

{modals.isDeleteItemModalOpen && (
        <DeleteDetailModal
          isOpen={modals.isDeleteItemModalOpen}
          onClose={closeDeleteItemModal}
          onConfirm={handleDeleteItem}
          itemType={selected.deleteItemType}
          itemName={selected.itemToDelete?.nama || selected.itemToDelete?.catatan}
        />
      )}

{modals.isDeleteMultipleModalOpen && (
        <DeleteDetailModal
          isOpen={modals.isDeleteMultipleModalOpen}
          onClose={closeDeleteMultipleModal}
          onConfirm={handleDeleteMultiple}
          itemType={selectedTab.toLowerCase()}
          itemName={`${selectedItems.length} item`}
        />
      )}

      {modals.isModalOpen && selected.modalType === "form" && (
        <KelompokModal 
          onClose={(success) => {
            if (closeModal(success)) {
              refetch();
            }
          }} 
          selectedDesa={selected.selectedDesa} 
        />
      )}

{modals.isModalOpen && (
  <TabDetailModal
    isOpen={modals.isModalOpen}
    onClose={(success) => handleModalClose(success)}
    selectedDesa={desa}
    activeTab={
      selected.modalType === "notulensi" ? "notulensiMateri" :
      selected.modalType === "galeri" ? "galeriFoto" :
      selected.modalType === "produk" ? "uraianProduk" :
      "pengurusDesa"
    }
    initialData={["produk", "pengurus"].includes(selected.modalType) ? selected.entityToEdit : undefined}
  />
)}
    </>
  );
};

export default DetailDesaPage;