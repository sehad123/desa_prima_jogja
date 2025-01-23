import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Modal from "./ModalForm";
import Header from "./Dashboard/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMediaQuery from "./useMediaQuery";
import Table from "./Table";
import Breadcrumb from "./Breadcrumb";

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
    kategori: [], // Array untuk menyimpan kategori yang dipilih
    kecamatanNama: [], // Array untuk menyimpan kecamatan yang dipilih
    kelompok_desa: "",
    kelurahanNama: "",
    anggotaDari: "",
    anggotaSampai: "",
    danaDari: "",
    danaSampai: "",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");
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
        const response = await axios.get(`http://localhost:5000/api/desa?kabupaten=${kabupatenName}`);
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
      const isKategoriMatch = search.kategori.length > 0 ? search.kategori.includes(desa.kategori) : true;

      const isKecamatanMatch = search.kecamatanNama.length > 0 ? search.kecamatanNama.includes(desa.kecamatanNama) : true;

      const isKelompokMatch = search.kelompok_desa ? desa.kelompok_desa.toLowerCase().includes(search.kelompok_desa.toLowerCase()) : true;

      const isKelurahanMatch = search.kelurahanNama ? desa.kelurahanNama.toLowerCase().includes(search.kelurahanNama.toLowerCase()) : true;

      const desaTanggal = new Date(desa.tahun_pembentukan);
      const isDateInRange = (!startDate || new Date(startDate) <= desaTanggal) && (!endDate || desaTanggal <= new Date(endDate));

      const isAnggotaInRange = (!search.anggotaDari || desa.jumlah_anggota_sekarang >= search.anggotaDari) && (!search.anggotaSampai || desa.jumlah_anggota_sekarang <= search.anggotaSampai);

      const isDanaInRange = (!search.danaDari || desa.jumlah_dana_sekarang >= search.danaDari) && (!search.danaSampai || desa.jumlah_dana_sekarang <= search.danaSampai);

      return isKategoriMatch && isKecamatanMatch && isKelompokMatch && isKelurahanMatch && isDateInRange && isAnggotaInRange && isDanaInRange;
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
        (desa.kelompok_desa && desa.kelompok_desa.toLowerCase().includes(keyword)) ||
        (desa.alamat && desa.alamat.toLowerCase().includes(keyword)) ||
        (desa.kategori && desa.kategori.toLowerCase().includes(keyword)) ||
        (desa.jumlah_anggota_sekarang && desa.jumlah_anggota_sekarang.toString().includes(keyword)) ||
        (desa.jumlah_dana_sekarang && desa.jumlah_dana_sekarang.toString().includes(keyword)) ||
        (desa.tahun_pembentukan && new Date(desa.tahun_pembentukan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }).toLowerCase().includes(keyword))
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
    return <div className="text-center text-xl text-gray-600">Memuat data...</div>;
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
  const currentItems = filteredDesaList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDesaList.length / itemsPerPage);

  const breadcrumbItems = [
    { label: "Beranda", path: "/peta-desa" },
    { label: "Kabupaten/Kota", path: "/kabupaten-page" },
    {
      label: kabupatenName,
      path: `/detail/${id}`, // Tambahkan path ke halaman detail kabupaten
    },
    {
      label: `Kelompok Desa - ${kabupatenName}`,
      path: null, // Halaman saat ini
    },
  ];

  return (
    <div className="p-5">
      <Breadcrumb items={breadcrumbItems} />
      {/* Flex container for two columns */}
      <div className="absolute top-26 left-10 ">
        <h2 className="text-2xl font-bold">{getKabupatenFromQuery() || "Kabupaten Tidak Ditemukan"}</h2>
      </div>
      <div className="flex gap-4 mt-16">
        {/* Left Container: Filter Section */}
        <div className="w-full md:w-1/4 bg-white p-4 border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Filter Pencarian</h2>
          <div className="flex flex-col gap-4">
            {/* Kategori */}
            <div className="relative">
              <button
                className="w-full text-left p-2 border rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowKategoriDropdown((prev) => !prev);
                }}
              >
                Kategori
                <span className="float-right">{showKategoriDropdown ? "▲" : "▼"}</span>
              </button>
              {showKategoriDropdown && (
                <div
                  className="mt-2 bg-white border rounded-lg shadow-md p-2"
                  onClick={(e) => e.stopPropagation()} // Mencegah dropdown menutup ketika klik di dalamnya
                >
                  {["Maju", "Tumbuh", "Berkembang"].map((kategori) => (
                    <label key={kategori} className="block px-4 py-1">
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
                            kategori: isChecked ? [...prev.kategori, value] : prev.kategori.filter((item) => item !== value),
                          }));
                        }}
                      />
                      <span className="ml-2">{kategori}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Kecamatan */}
            <div className="relative">
              <button
                className="w-full text-left p-2 border rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowKecamatanDropdown((prev) => !prev);
                }}
              >
                Kecamatan
                <span className="float-right">{showKecamatanDropdown ? "▲" : "▼"}</span>
              </button>
              {showKecamatanDropdown && (
                <div
                  className="mt-2 bg-white border rounded-lg shadow-md p-2"
                  onClick={(e) => e.stopPropagation()} // Mencegah dropdown menutup ketika klik di dalamnya
                >
                  {desaList
                    .map((desa) => desa.kecamatanNama)
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                    .map((kecamatan) => (
                      <label key={kecamatan} className="block px-4 py-1">
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
                              kecamatanNama: isChecked ? [...prev.kecamatanNama, value] : prev.kecamatanNama.filter((item) => item !== value),
                            }));
                          }}
                        />
                        <span className="ml-2">{kecamatan}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>

            {/* Tanggal */}
            <div>
              <label className="block font-medium text-gray-700">Tanggal</label>
              <p className="pb-2 block text-sm text-gray-500">Dari</p>
              <input type="date" name="startDate" value={startDate} onChange={handleStartDateChange} className="p-2 border border-gray-300 rounded-lg w-full" placeholder="Dari" />
              <p className="pt-2 block text-sm text-gray-500">Sampai</p>
              <input type="date" name="endDate" value={endDate} onChange={handleEndDateChange} className="p-2 border border-gray-300 rounded-lg w-full mt-2" placeholder="Sampai" />
            </div>

            {/* Jumlah Anggota */}
            <div>
              <label className="block font-medium text-gray-700">Jumlah Anggota</label>
              <p className="pb-2 block text-sm text-gray-500">Dari</p>
              <input type="number" name="anggotaDari" value={search.anggotaDari} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded-lg w-full" placeholder="0" />
              <p className="pt-2 block text-sm text-gray-500">Sampai</p>
              <input type="number" name="anggotaSampai" value={search.anggotaSampai} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded-lg w-full mt-2" placeholder="0" />
            </div>

            {/* Jumlah Dana */}
            <div>
              <label className="block font-medium text-gray-700">Jumlah Dana</label>
              <p className="pb-2 block text-sm text-gray-500">Dari</p>
              <input type="number" name="danaDari" value={search.danaDari} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded-lg w-full" placeholder="0" />
              <p className="pt-2 block text-sm text-gray-500">Sampai</p>
              <input type="number" name="danaSampai" value={search.danaSampai} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded-lg w-full mt-2" placeholder="0" />
            </div>
          </div>
        </div>

        {/* Right Container: Data Display Section */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Kategori Maju</h3>
              <p className="text-2xl font-bold">{calculateCategoryPercentage("Maju")}%</p>
            </div>

            <div className="p-4 bg-green-100 text-green-800 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Kategori Berkembang</h3>
              <p className="text-2xl font-bold">{calculateCategoryPercentage("Berkembang")}%</p>
            </div>

            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Kategori Tumbuh</h3>
              <p className="text-2xl font-bold">{calculateCategoryPercentage("Tumbuh")}%</p>
            </div>
          </div>

          <div className={`bg-white w-full md:w-[100%]`}>
            <div className="flex flex-col md:items-start bg-white p-4 w-full">
              <div className="flex items-center justify-between w-full p-2 md:pb-0">
                {/* Judul di kiri */}
                <h1 className="text-lg">Daftar Kelompok Desa Prima</h1>

                {/* Tombol Tambah Data di kanan */}
                {showAddButton && (
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition-all duration-300 ease-in-out">
                    + Tambah Data
                  </button>
                )}
              </div>

              {/* Pencarian */}
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  placeholder="Masukkan kata kunci"
                  value={search.keyword || ""}
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value.toLowerCase() })}
                  className="text-sm px-3 py-2 w-full border rounded-lg focus:outline-none"
                />
              </div>

              {desaList.length === 0 ? (
                <p className="text-center text-lg text-gray-500">Tidak ada data desa.</p>
              ) : (
                <div className="overflow-x-auto mt-5 w-full">
                  <Table
                    columns={columns}
                    data={filteredDesaList.map((desa, index) => ({
                      ...desa,
                      no: index + 1,
                      alamat: `${desa.kabupaten}, ${desa.kecamatan}, ${desa.kelurahan}`,
                      tahun_pembentukan: new Date(desa.tahun_pembentukan).toLocaleDateString("id-ID", {
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

      {isModalOpen && <Modal onClose={handleModalClose} selectedDesa={selectedDesa} />}

      <ToastContainer />
    </div>
  );
};

export default KelompokDesa;
