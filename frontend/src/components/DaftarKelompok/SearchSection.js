import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";

const SearchSection = ({
  search,
  setSearch,
  toggleFilter,
  isFilterVisible,
  kabupatenName,
  userRole,
  exportToExcel,
  setIsModalOpen
}) => {

  return (
    <div className="flex flex-col md:items-start bg-white px-5 pt-5 pb-1 w-full">
  <div className="border-b-2 border-grey items-start md:border-none pb-2 md:pb-0">
    <h1 className="text-lg lg:text-xl font-medium text-gray-800">
      {userRole === "Ketua Forum" 
        ? `Daftar Kelompok Desa - ${kabupatenName}`
        : "Daftar Kelompok Desa"}
    </h1>
  </div>
  
  {/* Desktop Layout */}
  <div className="hidden md:flex justify-between items-center w-full mt-2">
    <div className="flex justify-start">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary text-white py-2 px-4 rounded-md mt-4 mr-4 hover:bg-purple-400"
      >
        + Tambah Data
      </button>
      <button
        onClick={exportToExcel}
        className="bg-green-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-400"
      >
        Export to Excel
      </button>
    </div>

    <div className="flex lg:items-center mt-4">
      <div className="hidden md:block">
        <div className="flex ">
          <input
            type="text"
            placeholder="Masukkan kata kunci"
            value={search.keyword || ""}
            onChange={(e) => setSearch({...search, keyword: e.target.value.toLowerCase()})}
            className="text-sm px-3 py-2 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary w-full"
          />
          <div className="p-2 px-2 border border-l bg-secondary rounded-r-md">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex" onClick={toggleFilter}>
        <div className={`${isFilterVisible ? "hidden" : "md:hidden"} h-fit bg-gray-100 p-3 rounded-sm hover:bg-inactive cursor-pointer`}>
          <FontAwesomeIcon icon={faFilter} style={{ color: "#A8A8A8" }} />
        </div>
      </div>
    </div>
  </div>

  {/* Mobile Layout */}
  <div className="md:hidden flex flex-col w-full mt-3">
    {/* Baris Pertama: Tombol Aksi */}
    <div className="flex justify-center w-full p-1">
      <div className="flex">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-purple-400 mr-2"
        >
          + Tambah Data
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-400"
        >
          Export
        </button>
      </div>
    </div>

    {/* Baris Kedua: Search + Filter */}
    <div className="flex items-center mt-3 w-full">
      {/* Tombol Filter */}
      <div 
        className={`${isFilterVisible ? "hidden" : ""} h-fit bg-gray-100 p-3 rounded-sm hover:bg-inactive cursor-pointer mr-2`}
        onClick={toggleFilter}
      >
        <FontAwesomeIcon icon={faFilter} style={{ color: "#A8A8A8" }} />
      </div>
      
      {/* Search Input */}
      <div className="flex border flex-1">
        <input
          type="text"
          placeholder="Masukkan kata kunci"
          value={search.keyword || ""}
          onChange={(e) => setSearch({...search, keyword: e.target.value.toLowerCase()})}
          className="text-sm px-3 py-2 w-full border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <div className="p-2 px-2 border border-gray-600 bg-secondary rounded-r-md">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white" />
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default SearchSection;