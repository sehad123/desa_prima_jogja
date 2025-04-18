import React from "react";
import DetailInfoSection from "./DetailInfoSection";
import DesaTabsSection from "./DesaTabsSection";
import DesaPreviewSection from "./DesaPreviewSection";

const DesaDetailLayout = ({ 
  desa, 
  profil, 
  pengurus,
  produk,
  galeri,
  selectedTab, 
  selectedItem,
  onTabChange,
  onEditDesa,
  onDeleteDesa,
  children 
}) => {
  return (
    <div className="p-5">
      <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row py-2 space-x-0 lg:space-x-6">
        <div className="flex flex-col w-full lg:w-1/2 space-y-6">
          <DetailInfoSection 
            desa={desa} 
            profil={profil}
            onEdit={onEditDesa}
            onDelete={onDeleteDesa}
            pengurus={pengurus}
            produk={produk}
            galeri={galeri}
          />
          
          <DesaTabsSection 
            selectedTab={selectedTab}
            onTabChange={onTabChange}
          >
            {children}
          </DesaTabsSection>
        </div>
        
        <DesaPreviewSection 
          selectedTab={selectedTab}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  );
};

export default DesaDetailLayout;