import React from "react";
import DeleteModal from "./DeleteDetailModal";
import FormModal from "../../Modal/KelompokModal";
import DetailModal from "./TabDetailModal";

const Modals = ({
  isDeleteModalOpen,
  isDeleteItemModalOpen,
  isDeleteMultipleModalOpen,
  isModalOpen,
  modalType,
  entityToEdit,
  deleteItemType,
  itemToDelete,
  selectedItems,
  selectedTab,
  desa,
  onDelete,
  onDeleteItem,
  onDeleteMultiple,
  onModalClose,
  onDeleteModalClose,
  onDeleteItemModalClose,
  onDeleteMultipleModalClose,
}) => {
  return (
    <>
      {isDeleteModalOpen && <DeleteModal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} onConfirm={onDelete} itemType="desa" itemName={desa?.namaDesa} />}

      {isDeleteItemModalOpen && (
        <DeleteModal
          isOpen={isDeleteItemModalOpen}
          onClose={onDeleteItemModalClose}
          onConfirm={onDeleteItem}
          itemType={deleteItemType}
          itemName={deleteItemType === "galeri" ? "" : deleteItemType === "notulensi" ? itemToDelete?.catatan : itemToDelete?.nama}
        />
      )}

      {isDeleteMultipleModalOpen && <DeleteModal isOpen={isDeleteMultipleModalOpen} onClose={onDeleteMultipleModalClose} onConfirm={onDeleteMultiple} itemType={selectedTab.toLowerCase()} itemName={`${selectedItems.length} item`} />}

      {isModalOpen && modalType === "form" && <FormModal onClose={onModalClose} selectedDesa={desa} />}

      {isModalOpen && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          selectedDesa={desa}
          activeTab={modalType === "notulensi" ? "notulensiMateri" : modalType === "galeri" ? "galeriFoto" : modalType === "produk" ? "uraianProduk" : modalType === "kas" ? "kasDesa" : "pengurusDesa"}
          initialData={entityToEdit}
        />
      )}
    </>
  );
};

export default Modals;
