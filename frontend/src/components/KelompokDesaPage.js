import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal/ModalForm";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faBars,
  faAngleLeft,
  faAngleDown,
  faAngleUp,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import useMediaQuery from "./useMediaQuery";
import Table from "./Table";
import Breadcrumb from "./Breadcrumb";
import ErrorNotification from "./Modal/ErrorNotification";
import SuccessNotification from "./Modal/SuccessNotification";

const columns = [
  { id: "no", label: "No" },
  { id: "kelompok_desa", label: "Nama" },
  { id: "alamat", label: "Alamat" },
  { id: "tahun_pembentukan", label: "Tanggal Bentuk" },
  { id: "jumlah_dana_sekarang", label: "Jumlah Dana" },
  { id: "jumlah_anggota_sekarang", label: "Jumlah Anggota" },
  { id: "kategori", label: "Kategori" },
];

const options = columns
  .filter((column) => column.id !== "no")
  .map((column) => ({
    value: column.id,
    label: column.label,
  }));

const KelompokDesa = () => {
  const [desaList, setDesaList] = useState([]);
  const [filteredDesaList, setFilteredDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [search, setSearch] = useState({
    kategori: [], // Array untuk menyimpan kategori yang dipilih
    kecamatanNama: [], // Array untuk menyimpan kecamatan yang dipilih
    kelompok_desa: "",
    kelurahanNama: "",
    anggotaDari: "",
    anggotaSampai: "",
    danaDari: "",
    danaSampai: "",
  });

  const [kecamatanDropdownOpen, setKecamatanDropdownOpen] = useState(false);
  const [kategoriDropdownOpen, setKategoriDropdownOpen] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  useEffect(() => {
    const storedErrorMessage = localStorage.getItem("errorMessages");
    if (storedErrorMessage) {
      setErrorMessage(storedErrorMessage);
      setShowErrorNotification(true);
    }

    return () => {
      localStorage.removeItem("errorMessages");
    };
  }, []);

  useEffect(() => {
    const storedSuccessMessage = localStorage.getItem("successMessages");
    if (storedSuccessMessage) {
      setSuccessMessage(storedSuccessMessage);
      setShowSuccessNotification(true);
    }

    return () => {
      localStorage.removeItem("successMessages");
    };
  }, []);

  const handleClose = () => {
    setShowErrorNotification(false);
    localStorage.removeItem("errorMessages");
    setShowSuccessNotification(false);
    localStorage.removeItem("successMessages");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [startDate, setStartDate] = useState(""); // Tambahkan state untuk tanggal awal
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Hook untuk mengambil URL location
  const { id } = useParams(); // Ambil 'id' dari parameter URL

  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [showKecamatanDropdown, setShowKecamatanDropdown] = useState(false);

  const getKabupatenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("kabupaten"); // Mengambil parameter 'kabupaten' dari URL
  };

  const kabupatenName = getKabupatenFromQuery(); // Mendapatkan kabupaten untuk breadcrumb

  const fetchDesaData = async () => {
    try {
      const kabupatenName = getKabupatenFromQuery(); // Mendapatkan kabupaten dari URL
      if (kabupatenName) {
        const response = await axios.get(
          `http://localhost:5000/api/desa?kabupaten=${kabupatenName}`
        );
        setDesaList(response.data);
      } else {
        const response = await axios.get("http://localhost:5000/api/desa");
        setDesaList(response.data); // Jika kabupaten tidak ada, ambil semua desa
      }
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesaData();
  }, [location.search]); // Efek ini akan dijalankan setiap kali query URL berubah

  useEffect(() => {
    const filteredData = desaList.filter((desa) => {
      const isKategoriMatch =
        search.kategori.length > 0
          ? search.kategori.includes(desa.kategori)
          : true;

      const isKecamatanMatch =
        search.kecamatanNama.length > 0
          ? search.kecamatanNama.includes(desa.kecamatanNama)
          : true;

      const isKelompokMatch = search.kelompok_desa
        ? desa.kelompok_desa
            .toLowerCase()
            .includes(search.kelompok_desa.toLowerCase())
        : true;

      const isKelurahanMatch = search.kelurahanNama
        ? desa.kelurahanNama
            .toLowerCase()
            .includes(search.kelurahanNama.toLowerCase())
        : true;

      const desaTanggal = new Date(desa.tahun_pembentukan);
      const isDateInRange =
        (!startDate || new Date(startDate) <= desaTanggal) &&
        (!endDate || desaTanggal <= new Date(endDate));

      const isAnggotaInRange =
        (!search.anggotaDari ||
          desa.jumlah_anggota_sekarang >= search.anggotaDari) &&
        (!search.anggotaSampai ||
          desa.jumlah_anggota_sekarang <= search.anggotaSampai);

      const isDanaInRange =
        (!search.danaDari || desa.jumlah_dana_sekarang >= search.danaDari) &&
        (!search.danaSampai || desa.jumlah_dana_sekarang <= search.danaSampai);

      return (
        isKategoriMatch &&
        isKecamatanMatch &&
        isKelompokMatch &&
        isKelurahanMatch &&
        isDateInRange &&
        isAnggotaInRange &&
        isDanaInRange
      );
    });

    setFilteredDesaList(filteredData);
  }, [search, startDate, endDate, desaList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-kategori")) {
        setShowKategoriDropdown(false);
      }
      if (!event.target.closest(".dropdown-kecamatan")) {
        setShowKecamatanDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filteredData = desaList.filter((desa) => {
      const keyword = search.keyword ? search.keyword.toLowerCase() : "";

      return (
        (desa.kelompok_desa &&
          desa.kelompok_desa.toLowerCase().includes(keyword)) ||
        (desa.alamat && desa.alamat.toLowerCase().includes(keyword)) ||
        (desa.kategori && desa.kategori.toLowerCase().includes(keyword)) ||
        (desa.jumlah_anggota_sekarang &&
          desa.jumlah_anggota_sekarang.toString().includes(keyword)) ||
        (desa.jumlah_dana_sekarang &&
          desa.jumlah_dana_sekarang.toString().includes(keyword)) ||
        (desa.tahun_pembentukan &&
          new Date(desa.tahun_pembentukan)
            .toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .toLowerCase()
            .includes(keyword))
      );
    });

    setFilteredDesaList(filteredData);
  }, [search.keyword, desaList]);

  const handleModalClose = (isSuccess) => {
    setIsModalOpen(false);
    setSelectedDesa(null);
    fetchDesaData();
  };

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const getUserRole = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.role;
      } catch (error) {
        console.error("Token tidak valid:", error);
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();
  const showAddButton = userRole === "Ketua Forum";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const calculateCategoryPercentage = (category) => {
    const total = desaList.length;
    if (total === 0) return 0;
    const count = desaList.filter((desa) => desa.kategori === category).length;
    return ((count / total) * 100).toFixed(0);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDesaList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDesaList.length / itemsPerPage);

  const breadcrumbPaths = [
    { name: "Beranda", href: "/peta-desa" },
    { name: "Kabupaten/Kota", href: "/kabupaten-page" },
    {
      name: kabupatenName,
      href: `/detail/${id}`, // Tambahkan path ke halaman detail kabupaten
    },
    {
      name: `Kelompok Desa - ${kabupatenName}`,
      href: null, // Halaman saat ini
    },
  ];

  const filteredDesa = filteredDesaList.map((desa, index) => ({
    ...desa,
    no: index + 1,
    alamat: `${desa.kabupaten}, ${desa.kecamatan}, ${desa.kelurahan}`,
    tahun_pembentukan: new Date(desa.tahun_pembentukan).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ), // Format the date to "12 Oktober 2024"
    jumlah_dana_sekarang: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(desa.jumlah_dana_sekarang), // Format the number as currency "Rp300.000"
  }));

  const clearFilters = () => {
    setSearch({
      kategori: [],
      kecamatanNama: [],
      kelompok_desa: "",
      kelurahanNama: "",
      anggotaDari: "",
      anggotaSampai: "",
      danaDari: "",
      danaSampai: "",
    });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid black" : "none",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        border: state.isFocused ? "1px solid black" : "none",
        boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      },
      color: state.isFocused ? "#000000" : "#9CA3AF",
      fontSize: "15px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      fontSize: "14px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#000000" : "#9CA3AF",
    }),
  };

  return (
    <>
      {showErrorNotification && errorMessage && (
        <ErrorNotification message={errorMessage} onClose={handleClose} />
      )}
      {showSuccessNotification && successMessage && (
        <SuccessNotification message={successMessage} onClose={handleClose} />
      )}

<div className="p-5">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>
      
      {/* Flex container for two columns */}
      <div
        className={`App px-4 pb-4 pt-4 flex flex-col md:flex-row w-full lg:100% justify-center ${
          isFilterVisible ? "w-full" : ""
        } `}
      >
        
        {isMobile && (
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
              isFilterVisible ? "block" : "hidden"
            }`}
            onClick={toggleFilter}
          ></div>
        )}
        
        <div
          className={`${isFilterVisible ? "hidden" : "md:block"}
        hidden h-fit bg-white p-3 rounded-sm hover:bg-inactive cursor-pointer transition-colors duration-300`}
          onClick={toggleFilter}
        >
          <FontAwesomeIcon icon={faFilter} style={{ color: "#A8A8A8" }} />
        </div>

        {/* Left Container: Filter Section */}
        {isFilterVisible && (
          <div
            className={`fixed top-28 md:top-0 left-auto md:relative w-11/12 md:w-1/5 bg-white shadow-md rounded-md p-4 z-50 z- transform ${
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
            <div className="mb-4">
              <button
                className="w-full text-left p-2 border rounded-lg flex items-center justify-between"
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

            {/* Kecamatan */}
            <div className="mb-4">
              <button
                className="w-full text-left p-2 border rounded-lg flex items-center justify-between"
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
                  onClick={(e) => e.stopPropagation()} // Mencegah dropdown menutup ketika klik di dalamnya
                >
                  {desaList
                    .map((desa) => desa.kecamatanNama)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    ) // Remove duplicates
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
        )}

        {/* Right Container: Data Display Section */}

        <div className={`ml-0 md:ml-4 bg-white w-full md:w-[80%]`}>
          <div className="flex flex-col md:items-start bg-white p-4 w-full">
            <div className="border-b-2 border-grey items-start md:border-none pb-4 md:pb-0">
              <h1 className="text-lg">
                Daftar Kegiatan BPS Kabupaten Sleman{" "}
                {getKabupatenFromQuery() || "Kabupaten Tidak Ditemukan"}
              </h1>
            </div>
            <div className="flex justify-between items-center w-full">
              {showAddButton && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
                >
                  + Tambah Data
                </button>
              )}
              <div className="flex lg:items-center mt-4">
                <div className="hidden md:block">
                  <div className="flex border">
                    <input
                      type="text"
                      placeholder="Masukkan kata kunci"
                      value={search.keyword || ""}
                      onChange={(e) =>
                        setSearch({
                          ...search,
                          keyword: e.target.value.toLowerCase(),
                        })
                      }
                      className="text-sm px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="p-2 px-2 border-l bg-blue-500 rounded-r-md ">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex" onClick={toggleFilter}>
                  <div
                    className={`${
                      isFilterVisible ? "hidden" : "md:hidden"
                    } h-fit bg-gray-100 p-3 rounded-sm hover:bg-inactive cursor-pointer transition-colors duration-300`}
                    onClick={toggleFilter}
                  >
                    <FontAwesomeIcon
                      icon={faFilter}
                      style={{ color: "#A8A8A8" }}
                    />
                  </div>
                  {/* <p className="md:hidden text-black p-3">Buka filter</p> */}
                </div>
              </div>
            </div>
            <div className="flex mt-4 md:hidden justify-center">
              <div className="flex border">
                <input
                  type="text"
                  placeholder="Masukkan kata kunci"
                  value={search.keyword || ""}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      keyword: e.target.value.toLowerCase(),
                    })
                  }
                  className="text-sm px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="p-2 px-2 border-l  bg-blue-500 rounded-r-md ">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {desaList.length === 0 ? (
            <p className="text-center text-lg text-gray-500">
              Tidak ada data desa.
            </p>
          ) : (
            <div className="overflow-x-auto mt-2 w-full">
              <Table
                columns={columns}
                data={filteredDesa}
                isMobile={isMobile}
              />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleModalClose} selectedDesa={selectedDesa} />
      )}

      <ToastContainer />
    </>
  );
};

export default KelompokDesa;
