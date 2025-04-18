import React from 'react';
import DeleteDetailModal from './DeleteDetailModal';
import KelompokModal from "../../Modal/KelompokModal";
import TabDetailModal from './TabDetailModal';

const ModalManager = ({
  // State modal
  isDeleteMultipleModalOpen,
  isDeleteModalOpen,
  isDeleteItemModalOpen,
  isModalOpen,
  setIsDeleteItemModalOpen,
  
  // State data
  selectedTab,
  selectedItems,
  deleteItemType,
  itemToDelete,
  desa,
  id,
  selectedDesa,
  modalType,
  entityToEdit,
  
  // Handlers
  setSelectedItems,
  setIsDeleteMultipleModalOpen,
  setIsDeleteModalOpen,
  handleDeleteModalClose,
  handleDeleteMultipleConfirmed,
  handleDeleteDesa,
  handleDeleteItem,
  handleModalClose,
  
  // Fetch functions
  fetchGaleri,
  fetchNotulensi,
  fetchProduk,
  fetchPengurus,
  
  // Loading states
  loadingDeleteActivity,
  loadingDelete,
}) => {
    const handleDeleteItemConfirmed = async () => {
        try {
          const success = await handleDeleteItem(
            id,
            deleteItemType,
            itemToDelete,
            { fetchGaleri, fetchNotulensi, fetchProduk, fetchPengurus }
          );
          
          if (success) {
            setIsDeleteItemModalOpen(false);
            setSelectedItems([]);
          }
        } catch (error) {
          console.error("Error dalam handleDeleteItemConfirmed:", error);
        }
      };
      
      const handleDeleteDesaConfirmed = async () => {
        try {
          const success = await handleDeleteDesa(id, desa);
          if (success) {
            setIsDeleteModalOpen(false);
          }
        } catch (error) {
          console.error("Error dalam handleDeleteDesaConfirmed:", error);
        }
      };
      
  return (
    <>
      {/* Delete Multiple Modal */}
      {isDeleteMultipleModalOpen && (
        <DeleteDetailModal
          isOpen={isDeleteMultipleModalOpen}
          onClose={() => setIsDeleteMultipleModalOpen(false)}
          onConfirm={handleDeleteMultipleConfirmed}
          itemType={selectedTab.toLowerCase()}
          itemName={`${selectedItems?.length || 0} item`}
          isLoading={loadingDeleteActivity}
        />
      )}

      {/* Delete Desa Modal */}
      {isDeleteModalOpen && (
        <DeleteDetailModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteDesa}
          itemType="desa"
          itemName={desa?.namaDesa}
          isLoading={loadingDelete}
        />
      )}

      {/* Delete Item Modal */}
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


      {/* Form Modal */}
      {isModalOpen && modalType === "form" && (
        <KelompokModal 
          onClose={handleModalClose} 
          selectedDesa={selectedDesa}
          isEdit={true}
        />
      )}
      
      {/* Tab Detail Modal */}
      {isModalOpen &&
        (modalType === "pengurus" ||
          modalType === "produk" ||
          modalType === "notulensi" ||
          modalType === "galeri") && (
          <TabDetailModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            selectedDesa={
              modalType === "notulensi" || modalType === "galeri"
                ? selectedDesa
                : desa
            }
            activeTab={
              modalType === "notulensi"
                ? "notulensiMateri"
                : modalType === "galeri"
                ? "galeriFoto"
                : modalType === "produk"
                ? "uraianProduk"
                : "pengurusDesa"
            }
            initialData={
              ["produk", "pengurus"].includes(modalType)
                ? entityToEdit
                : undefined
            }
          />
        )}
      
    </>
  );
};

export default ModalManager;