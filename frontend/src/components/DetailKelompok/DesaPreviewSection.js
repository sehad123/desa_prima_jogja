import React from "react";
import PreviewContent from "./PriviewContent";

const DesaPreviewSection = ({ selectedTab, selectedItem }) => {
  return (
    <div className="w-full lg:w-1/2 bg-white shadow-md rounded-md p-6 mt-4 lg:mt-0 ml-0 lg:ml-4">
      <PreviewContent
        selectedTab={selectedTab}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default DesaPreviewSection;