import React from "react";
import TabPanel from "./TabPanel";

const DesaTabsSection = ({ tabs = ["Kas", "Produk", "Notulensi / Materi", "Galeri", "Pengurus"], selectedTab, onTabChange, children }) => {
  const tabsMap = {
    "Detail Kelompok": tabs,
  };

  return (
    <div>
      <TabPanel tabs={tabsMap["Detail Kelompok"]} selectedTab={selectedTab} onTabChange={onTabChange} className="shadow rounded-md text-xs w-1/2" />

      <div className="bg-white p-4 pb-6 shadow rounded-md border-gray">{children}</div>
    </div>
  );
};

export default DesaTabsSection;
