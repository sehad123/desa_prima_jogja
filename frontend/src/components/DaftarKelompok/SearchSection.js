import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter, faPlus, faFileExport } from "@fortawesome/free-solid-svg-icons";

const SearchSection = ({
  search,
  profil,
  setSearch,
  toggleFilter,
  isFilterVisible,
  kabupatenName,
  userRole,
  exportToExcel,
  setIsModalOpen
}) => {

  return (
    <div className="bg-white px-6 py-5 w-full rounded-lg shadow-sm">
  {/* Title Section */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div className="mb-4 md:mb-0">
      <h1 className="text-2xl font-semibold text-gray-800">
        {userRole === "Ketua Forum" 
          ? `Daftar Kelompok Desa - ${kabupatenName}`
          : "Daftar Kelompok Desa"}
      </h1>
      {userRole === "Ketua Forum" && (
        <p className="text-sm text-gray-500 mt-1">Kabupaten {kabupatenName}</p>
      )}
    </div>

    {/* Desktop Search */}
    <div className="hidden md:flex items-center space-x-4">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari kelompok desa..."
          value={search.keyword || ""}
          onChange={(e) => setSearch({...search, keyword: e.target.value.toLowerCase()})}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        onClick={toggleFilter}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Filter"
      >
        <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
      </button>
    </div>
  </div>
  
  {/* Action Buttons */}
  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6 md:mb-0">
  {profil?.role === "ketua forum" && (
    <>
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
    >
      <FontAwesomeIcon icon={faPlus} className="mr-2" />
      <span>Tambah Data</span>
    </button>
    </>
  )}
    <button
      onClick={exportToExcel}
      className="flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
    >
      <FontAwesomeIcon icon={faFileExport} className="mr-2" />
      <span>Export Excel</span>
    </button>
  </div>

  {/* Mobile Search */}
  <div className="md:hidden mt-4">
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari kelompok desa..."
          value={search.keyword || ""}
          onChange={(e) => setSearch({...search, keyword: e.target.value.toLowerCase()})}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        onClick={toggleFilter}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Filter"
      >
        <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
      </button>
    </div>
  </div>
</div>
  );
};

export default SearchSection;