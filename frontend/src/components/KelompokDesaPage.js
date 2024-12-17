import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./ModalForm";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMediaQuery from "./useMediaQuery";
import Table from "./Table";

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
  const [search, setSearch] = useState({
    kategori: "",
    kelompok_desa: "",
    kecamatanNama: "",
    kelurahanNama: "",
  });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [startDate, setStartDate] = useState(""); // Tambahkan state untuk tanggal awal
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Hook untuk mengambil URL location

  const getKabupatenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("kabupaten"); // Mengambil parameter 'kabupaten' dari URL
  };
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
      const isKategoriMatch = search.kategori
        ? desa.kategori.toLowerCase().includes(search.kategori.toLowerCase())
        : true;
      const isKelompokMatch = search.kelompok_desa
        ? desa.kelompok_desa
            .toLowerCase()
            .includes(search.kelompok_desa.toLowerCase())
        : true;
      const isKecamatanMatch = search.kecamatanNama
        ? desa.kecamatanNama
            .toLowerCase()
            .includes(search.kecamatanNama.toLowerCase())
        : true;
      const isKelurahanMatch = search.kelurahanNama
        ? desa.kelurahanNama
            .toLowerCase()
            .includes(search.kelurahanNama.toLowerCase())
        : true;

      const desaTanggal = new Date(desa.tahun_pembentukan); // Ubah tanggal pembentukan ke format Date
      const isDateInRange =
        (!startDate || new Date(startDate) <= desaTanggal) &&
        (!endDate || desaTanggal <= new Date(endDate)); // Filter berdasarkan rentang tanggal

      return (
        isKategoriMatch &&
        isKelompokMatch &&
        isKecamatanMatch &&
        isKelurahanMatch &&
        isDateInRange
      );
    });
    setFilteredDesaList(filteredData);
  }, [search, startDate, endDate, desaList]);

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
  const showAddButton = userRole === "admin";

  if (loading) {
    return (
      <div className="text-center text-xl text-gray-600">Memuat data...</div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
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

  return (
    <div className="p-5">
      {/* Flex container for two columns */}
      <div className="absolute top-26 left-10 ">
        <h2 className="text-2xl font-bold">
          {getKabupatenFromQuery() || "Kabupaten Tidak Ditemukan"}
        </h2>
      </div>
      <div className="flex gap-4 mt-16">
        {/* Left Container: Filter Section */}
        <div className="w-full md:w-1/4 bg-white p-4 border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Filter Pencarian</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="kelompok_desa"
              value={search.kelompok_desa}
              onChange={handleSearchChange}
              placeholder="Cari Kelompok Desa"
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="kecamatanNama"
              value={search.kecamatanNama}
              onChange={handleSearchChange}
              placeholder="Cari Kecamatan"
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="kelurahanNama"
              value={search.kelurahanNama}
              onChange={handleSearchChange}
              placeholder="Cari Kelurahan"
              className="p-2 border border-gray-300 rounded-lg"
            />
            <select
              name="kategori"
              value={search.kategori}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Pilih Kategori</option>
              <option value="Maju">Maju</option>
              <option value="Tumbuh">Tumbuh</option>
              <option value="Berkembang">Berkembang</option>
            </select>
            {/* Input Rentang Tanggal */}
            <label className="block">
              <p className=" text-gray-600 ">Dari</p>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="p-2 w-full border border-gray-300 rounded-lg"
              />
            </label>
            <label className="block">
              <p className=" text-gray-600">Sampai</p>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="p-2 w-full border border-gray-300 rounded-lg"
              />
            </label>
          </div>
        </div>

        {/* Right Container: Data Display Section */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Kategori Maju</h3>
              <p className="text-2xl font-bold">
                {calculateCategoryPercentage("Maju")}%
              </p>
            </div>
            
            <div className="p-4 bg-green-100 text-green-800 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Kategori Berkembang</h3>
              <p className="text-2xl font-bold">
                {calculateCategoryPercentage("Berkembang")}%
              </p>
            </div>

            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Kategori Tumbuh</h3>
              <p className="text-2xl font-bold">
                {calculateCategoryPercentage("Tumbuh")}%
              </p>
            </div>
          </div>

          <div className={`bg-white w-full md:w-[100%]`}>
            <div className="flex flex-col md:items-start bg-white p-4 w-full">
              <div className="flex items-center justify-between w-full p-2 md:pb-0">
                {/* Judul di kiri */}
                <h1 className="text-lg">Daftar Kelompok Desa Prima</h1>

                {/* Tombol Tambah Data di kanan */}
                {showAddButton && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition-all duration-300 ease-in-out"
                  >
                    + Tambah Data
                  </button>
                )}
              </div>

              {desaList.length === 0 ? (
                <p className="text-center text-lg text-gray-500">
                  Tidak ada data desa.
                </p>
              ) : (
                <div className="overflow-x-auto mt-5 w-full">
                  <Table
                    columns={columns}
                    data={filteredDesaList.map((desa, index) => ({
                      ...desa,
                      no: index + 1,
                      alamat: `${desa.kabupaten}, ${desa.kecamatan}, ${desa.kelurahan}`,
                      tahun_pembentukan: new Date(
                        desa.tahun_pembentukan
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }), // Format the date to "12 Oktober 2024"
                      jumlah_dana_sekarang: new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(desa.jumlah_dana_sekarang), // Format the number as currency "Rp300.000"
                    }))}
                    isMobile={isMobile}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleModalClose} selectedDesa={selectedDesa} />
      )}

      <ToastContainer />
    </div>
  );
};

export default KelompokDesa;
