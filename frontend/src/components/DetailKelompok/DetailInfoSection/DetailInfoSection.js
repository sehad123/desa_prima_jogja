import React from "react";
import DetailInformasi from "./DetailInformasi";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent/TabContent";

const DetailInfoSection = ({
  desa,
  selectedTab,
  selectedItems,
  onTabChange,
  onItemSelect,
  onDeleteModalOpen,
}) => {
  return (
    <div className="flex flex-col w-full lg:w-1/2 space-y-6">
      <DetailInformasi
        desa={desa}
        onEdit={() => console.log("Edit clicked")}
        onDelete={onDeleteModalOpen}
      />

      <div>
        <TabNavigation
          selectedTab={selectedTab}
          onTabChange={onTabChange}
        />

        <div className="bg-white p-4 pb-6 shadow rounded-md border-gray">
          <TabContent
            selectedTab={selectedTab}
            desa={desa}
            selectedItems={selectedItems}
            onItemSelect={onItemSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailInfoSection;