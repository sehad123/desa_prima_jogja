import React from "react";
import TabPanel from "../TabPanel";
import { GaleriTab, NotulensiTab, PengurusTab, ProdukTab } from "../Tabs";

export const TabContent = ({
  tabs,
  selectedTab,
  onTabChange,
  galeri,
  notulensi,
  pengurus,
  produk,
  handleAdd,
  handleEditModal,
  openDeleteItemModal,
  downloadFile,
  handleDownloadMultiple,
  handleItemSelect,
  selectedItems,
  toggleSelectItem,
  toggleSelectAll,
  toggleOption,
  visibleOptionId,
  optionsRef,
  desa
}) => {
  return (
    <div>
      <TabPanel
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        className="shadow rounded-md text-xs w-1/2"
      />

      <div className="bg-white p-4 pb-6 shadow rounded-md border-gray">
        {selectedTab === "Notulensi / Materi" && (
          <NotulensiTab
            notulensi={notulensi}
            onAdd={handleAdd}
            onDeleteMultiple={() => confirmDeleteMultiple(selectedItems, setIsDeleteMultipleModalOpen)}
            onDelete={openDeleteItemModal}
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
        )}
        {selectedTab === "Galeri" && (
          <GaleriTab
            galeri={galeri}
            onAdd={handleAdd}
            onDeleteMultiple={() => confirmDeleteMultiple(selectedItems, setIsDeleteMultipleModalOpen)}
            onDelete={openDeleteItemModal}
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
        )}
        {selectedTab === "Pengurus" && (
          <PengurusTab
            pengurus={pengurus}
            onAdd={handleAdd}
            onEdit={handleEditModal}
            onDelete={openDeleteItemModal}
            onSelect={handleItemSelect}
            desa={desa}
          />
        )}
        {selectedTab === "Produk" && (
          <ProdukTab
            produk={produk}
            onAdd={handleAdd}
            onDeleteMultiple={() => confirmDeleteMultiple(selectedItems, setIsDeleteMultipleModalOpen)}
            onDelete={openDeleteItemModal}
            onEdit={handleEditModal}
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
        )}
      </div>
    </div>
  );
};