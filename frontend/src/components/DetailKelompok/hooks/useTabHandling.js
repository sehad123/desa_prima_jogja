import { useState, useEffect } from 'react';

export const useTabHandler = (tabConfig, defaultTab, fetchFunctions) => {
  const [selectedTab, setSelectedTab] = useState(() => {
    const storedTab = localStorage.getItem("selectedTab");
    const validTabs = tabConfig["Detail Kelompok"] || [];
    return validTabs.includes(storedTab) ? storedTab : defaultTab;
  });

  const [currentFiles, setCurrentFiles] = useState([]);

  useEffect(() => {
    const validTabs = tabConfig["Detail Kelompok"] || [];
    if (validTabs.includes(selectedTab)) {
      localStorage.setItem("selectedTab", selectedTab);
    } else {
      if (selectedTab !== defaultTab) {
        setSelectedTab(defaultTab);
      }
      localStorage.setItem("selectedTab", defaultTab);
    }
  }, [selectedTab, tabConfig, defaultTab]);

  useEffect(() => {
    const loadData = async () => {
      switch(selectedTab) {
        case "Galeri":
          await fetchFunctions.fetchGaleri();
          setCurrentFiles(fetchFunctions.galeri);
          break;
        case "Notulensi / Materi":
          await fetchFunctions.fetchNotulensi();
          setCurrentFiles(fetchFunctions.notulensi);
          break;
        case "Produk":
          await fetchFunctions.fetchProduk();
          setCurrentFiles(fetchFunctions.produk);
          break;
        case "Pengurus":
          await fetchFunctions.fetchPengurus();
          setCurrentFiles(fetchFunctions.pengurus);
          break;
        default:
          break;
      }
    };

    loadData();
  }, [selectedTab, fetchFunctions]);

  return {
    selectedTab,
    setSelectedTab,
    currentFiles,
    setCurrentFiles,
    tabs: tabConfig["Detail Kelompok"] || []
  };
};