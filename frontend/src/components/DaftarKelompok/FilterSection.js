import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faAngleLeft, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import useMediaQuery from "../useMediaQuery";

const FilterSection = ({
  isFilterVisible,
  toggleFilter,
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  desaList,
  userRole,
  formatKabupatenName,
}) => {
      const isMobile = useMediaQuery("(max-width: 768px)");
      
  const [kategoriDropdownOpen, setKategoriDropdownOpen] = React.useState(false);
  const [kabupatenDropdownOpen, setKabupatenDropdownOpen] = React.useState(false);
  const [kecamatanDropdownOpen, setKecamatanDropdownOpen] = React.useState(false);
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
    const [showKecamatanDropdown, setShowKecamatanDropdown] = useState(false);
    const [showKabupatenDropdown, setShowKabupatenDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch(prev => ({ ...prev, [name]: value }));
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Untuk kategori dropdown
      if (
        !event.target.closest(".kategori-dropdown-container") && 
        !event.target.closest(".kategori-dropdown-button")
      ) {
        setKategoriDropdownOpen(false);
      }
      
      // Untuk kabupaten dropdown
      if (
        !event.target.closest(".kabupaten-dropdown-container") && 
        !event.target.closest(".kabupaten-dropdown-button")
      ) {
        setKabupatenDropdownOpen(false);
      }
      
      // Untuk kecamatan dropdown
      if (
        !event.target.closest(".kecamatan-dropdown-container") && 
        !event.target.closest(".kecamatan-dropdown-button")
      ) {
        setKecamatanDropdownOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
                className={`fixed top-28 md:top-0 left-auto md:relative w-11/12 md:w-1/5 bg-white shadow-md rounded-md p-4 z-40 z- transform ${
                  isMobile ? "translate-x-0" : "translate-x-0"
                } transition-transform duration-300 max-h-[80vh] overflow-y-auto`}
              >
                <div className="flex justify-between border-b-2 border-grey pb-4 mb-4">
                  <div className="">
                    <FontAwesomeIcon icon={faBars} className="" />
                  </div>
                  <div className="text-black text-lg font-normal">Filter Data</div>
                  <div
                    className="h-fit rounded-full hover:bg-inactive cursor-pointer transition-colors duration-300"
                    onClick={toggleFilter}
                  >
                    <FontAwesomeIcon
                      icon={isFilterVisible ? faAngleLeft : ""}
                      className="text-left"
                    />
                  </div>
                </div>
                {/* Kategori */}
                <div className="mb-4 kategori-dropdown-container">
                  <button
                    className="w-full text-left p-2 border rounded-lg flex items-center justify-between kategori-dropdown-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setKategoriDropdownOpen((prev) => !prev);
                    }}
                  >
                    Kategori
                    <FontAwesomeIcon
                      className="float-right cursor-pointer"
                      icon={kategoriDropdownOpen ? faAngleUp : faAngleDown}
                    />
                  </button>
                  {kategoriDropdownOpen && (
                    <div
                      className="flex flex-col mt-2 bg-white border rounded-lg p-2"
                      onClick={(e) => e.stopPropagation()} // Mencegah dropdown menutup ketika klik di dalamnya
                    >
                      {["Maju", "Tumbuh", "Berkembang"].map((kategori) => (
                        <label
                          key={kategori}
                          className="inline-flex items-center m-1"
                        >
                          <input
                            type="checkbox"
                            name="kategori"
                            value={kategori}
                            checked={search.kategori.includes(kategori)}
                            onChange={(e) => {
                              const value = e.target.value;
                              const isChecked = e.target.checked;
                              setSearch((prev) => ({
                                ...prev,
                                kategori: isChecked
                                  ? [...prev.kategori, value]
                                  : prev.kategori.filter((item) => item !== value),
                              }));
                            }}
                          />
                          <span className="ml-2 text-black text-sm">
                            {kategori}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
    
                {/* Kabupaten */}
                {userRole === "Pegawai" ||
                  (userRole === "Admin" && ( // Hanya tampilkan filter kabupaten untuk role pegawai
                    <div className="mb-4 kabupaten-dropdown-container">
                      <button
                        className="w-full text-left p-2 border rounded-lg flex items-center justify-between kabupaten-dropdown-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setKabupatenDropdownOpen((prev) => !prev);
                        }}
                      >
                        Kabupaten
                        <FontAwesomeIcon
                          className="float-right cursor-pointer"
                          icon={kabupatenDropdownOpen ? faAngleUp : faAngleDown}
                        />
                      </button>
                      {kabupatenDropdownOpen && (
                        <div
                          className="flex flex-col mt-2 bg-white border rounded-lg p-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {desaList
                            .map((desa) => desa.kabupaten_kota)
                            .filter(
                              (value, index, self) => self.indexOf(value) === index
                            )
                            .map((kabupaten_kota) => {
                              const formattedName = formatKabupatenName(kabupaten_kota);
                              return (
                                <label
                                  key={kabupaten_kota}
                                  className="inline-flex items-center m-1"
                                >
                                  <input
                                    type="checkbox"
                                    name="kabupatenNama"
                                    value={kabupaten_kota} // Tetap simpan value asli
                                    checked={search.kabupatenNama.includes(
                                      kabupaten_kota
                                    )}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      setSearch((prev) => ({
                                        ...prev,
                                        kabupatenNama: isChecked
                                          ? [...prev.kabupatenNama, value]
                                          : prev.kabupatenNama.filter(
                                              (item) => item !== value
                                            ),
                                      }));
                                    }}
                                  />
                                  <span className="ml-2 text-black text-sm">
                                    {formattedName}
                                  </span>
                                </label>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  ))}
    
                {/* Kecamatan */}
                <div className="mb-4 kecamatan-dropdown-container">
                  <button
                    className="w-full text-left p-2 border rounded-lg flex items-center justify-between kecamatan-dropdown-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setKecamatanDropdownOpen((prev) => !prev);
                    }}
                  >
                    Kecamatan
                    <FontAwesomeIcon
                      className="float-right cursor-pointer"
                      icon={kecamatanDropdownOpen ? faAngleUp : faAngleDown}
                    />
                  </button>
                  {kecamatanDropdownOpen && (
                    <div
                      className="flex flex-col mt-2 bg-white border rounded-lg p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {search.kabupatenNama.length > 0
                        ? // Jika ada kabupaten yang dipilih, tampilkan kecamatan dari kabupaten tersebut saja
                          desaList
                            .filter((desa) =>
                              search.kabupatenNama.includes(desa.kabupaten)
                            )
                            .map((desa) => desa.kecamatanNama)
                            .filter(
                              (value, index, self) => self.indexOf(value) === index
                            )
                            .map((kecamatan) => (
                              <label
                                key={kecamatan}
                                className="inline-flex items-center m-1"
                              >
                                <input
                                  type="checkbox"
                                  name="kecamatanNama"
                                  value={kecamatan}
                                  checked={search.kecamatanNama.includes(kecamatan)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const isChecked = e.target.checked;
                                    setSearch((prev) => ({
                                      ...prev,
                                      kecamatanNama: isChecked
                                        ? [...prev.kecamatanNama, value]
                                        : prev.kecamatanNama.filter(
                                            (item) => item !== value
                                          ),
                                    }));
                                  }}
                                />
                                <span className="ml-2 text-black text-sm">
                                  {kecamatan}
                                </span>
                              </label>
                            ))
                        : // Jika tidak ada kabupaten yang dipilih, tampilkan semua kecamatan
                          desaList
                            .map((desa) => desa.kecamatanNama)
                            .filter(
                              (value, index, self) => self.indexOf(value) === index
                            )
                            .map((kecamatan) => (
                              <label
                                key={kecamatan}
                                className="inline-flex items-center m-1"
                              >
                                <input
                                  type="checkbox"
                                  name="kecamatanNama"
                                  value={kecamatan}
                                  checked={search.kecamatanNama.includes(kecamatan)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const isChecked = e.target.checked;
                                    setSearch((prev) => ({
                                      ...prev,
                                      kecamatanNama: isChecked
                                        ? [...prev.kecamatanNama, value]
                                        : prev.kecamatanNama.filter(
                                            (item) => item !== value
                                          ),
                                    }));
                                  }}
                                />
                                <span className="ml-2 text-black text-sm">
                                  {kecamatan}
                                </span>
                              </label>
                            ))}
                    </div>
                  )}
                </div>
    
                {/* Tanggal */}
                <div className="mb-4">
                  <label className="block text-left">Tanggal</label>
                  <p className="block m-2 text-sm text-black font-light text-left">
                    Dari
                  </p>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full border rounded-md py-2 px-3 font-light text-sm"
                    placeholder="Dari"
                  />
                  <p className="block m-2 text-sm text-black font-light text-left">
                    Sampai
                  </p>
                  <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="w-full border rounded-md py-2 px-3 font-light text-sm"
                    placeholder="Sampai"
                  />
                </div>
    
                {/* Jumlah Anggota */}
                <div className="mb-4">
                  <label className="block text-left">Jumlah Anggota</label>
                  <p className="block m-2 text-sm text-black font-light text-left">
                    Dari
                  </p>
                  <input
                    type="number"
                    name="anggotaDari"
                    value={search.anggotaDari}
                    onChange={handleSearchChange}
                    className="w-full border rounded-md py-2 px-3 font-light text-sm"
                    placeholder="0"
                  />
                  <p className="block m-2 text-sm text-black font-light text-left">
                    Sampai
                  </p>
                  <input
                    type="number"
                    name="anggotaSampai"
                    value={search.anggotaSampai}
                    onChange={handleSearchChange}
                    className="w-full border rounded-md py-2 px-3 font-light text-sm"
                    placeholder="0"
                  />
                </div>
    
                {/* Jumlah Dana */}
                <div>
                  <label className="block text-left">Jumlah Dana</label>
                  <p className="block m-2 text-sm text-black font-light text-left">
                    Dari
                  </p>
                  <input
                    type="number"
                    name="danaDari"
                    value={search.danaDari}
                    onChange={handleSearchChange}
                    className="w-full border rounded-md py-2 px-3 font-light text-sm"
                    placeholder="0"
                  />
                  <p className="block m-2 text-sm text-black font-light text-left">
                    Sampai
                  </p>
                  <input
                    type="number"
                    name="danaSampai"
                    value={search.danaSampai}
                    onChange={handleSearchChange}
                    className="w-full border rounded-md py-2 px-3 font-light text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
  );
};

export default FilterSection;