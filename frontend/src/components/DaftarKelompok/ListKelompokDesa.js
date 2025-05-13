import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Modal from "../Modal/KelompokModal";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import useMediaQuery from "../useMediaQuery";
import * as XLSX from "xlsx";
import FilterSection from "./FilterSection";
import SearchSection from "./SearchSection";
import ActiveFilters from "./ActiveFilters";
import DataTable from "./DataTable";
import useUserData from "../hooks/useUserData";

const formatKabupatenName = (name) => {
  if (!name) return name;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("kab.")) {
    return (
      "Kab." +
      lowerName
        .split("kab.")[1]
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }
  if (lowerName.includes("kota")) {
    return (
      "Kota " +
      lowerName
        .split("kota")[1]
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }
  return lowerName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const columns = [
  { id: "no", label: "No" },
  { id: "nama", label: "Nama" },
  { id: "alamat", label: "Alamat" },
  { id: "tanggal_pembentukan", label: "Tanggal Bentuk" },
  // { id: "jumlah_dana_sekarang", label: "Jumlah Dana" },
  // { id: "jumlah_anggota_sekarang", label: "Jumlah Anggota" },
  { id: "kategori", label: "Kategori" },
];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">Terjadi kesalahan dalam menampilkan data</div>;
    }

    return this.props.children;
  }
}

const ListKelompokDesa = () => {
  // State and hooks initialization
  const [desaList, setDesaList] = useState([]);
  const [filteredDesaList, setFilteredDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { profil } = useUserData();
  const { id } = useParams();

  const [search, setSearch] = useState({
    kategori: [], // Array untuk menyimpan kategori yang dipilih
    kecamatanNama: [], // Array untuk menyimpan kecamatan yang dipilih
    kabupatenNama: [],
    nama: "",
    kelurahanNama: "",
    anggotaDari: "",
    anggotaSampai: "",
    danaDari: "",
    danaSampai: "",
    keyword: "",
  });

  // Helper functions
  const getUserRole = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      return jwtDecode(token).role;
    } catch (error) {
      console.error("Token tidak valid:", error);
      return null;
    }
  };

  const userRole = getUserRole();
  const kabupatenName = new URLSearchParams(location.search).get("kabupaten");
  const formattedKabupaten = formatKabupatenName(kabupatenName); // Add this line

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Data fetching
  const fetchDesaData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      let response;
      if (kabupatenName) {
        response = await axios.get(`http://localhost:5000/api/desa?kabupaten=${kabupatenName}`);
      } else {
        response = await axios.get("http://localhost:5000/api/desa");
      }

      const desaListWithDetails = await Promise.all(
        response.data.map(async (desa) => {
          const [produk, pengurus] = await Promise.all([axios.get(`http://localhost:5000/api/desa/${desa.id}/produk`), axios.get(`http://localhost:5000/api/desa/${desa.id}/pengurus`)]);
          return { ...desa, produk: produk.data, pengurus: pengurus.data };
        })
      );

      setDesaList(desaListWithDetails);
      setLoading(false);
    } catch (err) {
      console.error("Gagal memuat data desa:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesaData();
  }, [location.search]);

  // Filtering logic
  useEffect(() => {
    const filteredData = desaList.filter((desa) => {
      const isKategoriMatch = search.kategori.length > 0 ? search.kategori.includes(desa.kategori) : true;

      const isKecamatanMatch = search.kecamatanNama.length > 0 ? search.kecamatanNama.includes(desa.kecamatanNama) : true;

      const isKabupatenMatch = userRole === "Pegawai" || userRole === "Admin" ? (search.kabupatenNama.length > 0 ? search.kabupatenNama.includes(desa.kabupaten_kota) : true) : true;

      const isKelompokMatch = search.nama ? desa.nama.toLowerCase().includes(search.nama.toLowerCase()) : true;

      const isKelurahanMatch = search.kelurahanNama ? desa.kelurahanNama.toLowerCase().includes(search.kelurahanNama.toLowerCase()) : true;

      const desaTanggal = new Date(desa.tanggal_pembentukan);
      const isDateInRange = (!startDate || new Date(startDate) <= desaTanggal) && (!endDate || desaTanggal <= new Date(endDate));

      const isAnggotaInRange = (!search.anggotaDari || desa.jumlah_anggota_sekarang >= search.anggotaDari) && (!search.anggotaSampai || desa.jumlah_anggota_sekarang <= search.anggotaSampai);

      const isDanaInRange = (!search.danaDari || desa.jumlah_dana_sekarang >= search.danaDari) && (!search.danaSampai || desa.jumlah_dana_sekarang <= search.danaSampai);

      return isKategoriMatch && isKecamatanMatch && isKabupatenMatch && isKelompokMatch && isKelurahanMatch && isDateInRange && isAnggotaInRange && isDanaInRange;
    });

    setFilteredDesaList(filteredData);
  }, [search, startDate, endDate, desaList, userRole]);

  useEffect(() => {
    const filteredData = desaList.filter((desa) => {
      const keyword = search.keyword ? search.keyword.toLowerCase() : "";
      const alamat = `${desa.kabupaten}, ${desa.kecamatan}, ${desa.kelurahan}, ${desa.kabupaten_kota}`.toLowerCase();

      return (
        (desa.nama && desa.nama.toLowerCase().includes(keyword)) ||
        (alamat && alamat.toLowerCase().includes(keyword)) ||
        (desa.kategori && desa.kategori.toLowerCase().includes(keyword)) ||
        (desa.jumlah_anggota_sekarang && desa.jumlah_anggota_sekarang.toString().includes(keyword)) ||
        (desa.jumlah_dana_sekarang && desa.jumlah_dana_sekarang.toString().includes(keyword)) ||
        (desa.tanggal_pembentukan &&
          new Date(desa.tanggal_pembentukan)
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

  const filteredDesa = filteredDesaList.map((desa, index) => ({
    ...desa,
    no: index + 1,
    alamat: `${desa.kelurahan}, ${desa.kecamatan}, ${desa.kabupaten}`,
    tanggal_pembentukan: new Date(desa.tanggal_pembentukan).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }), // Format the date to "12 Oktober 2024"
    jumlah_dana_sekarang: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(desa.jumlah_dana_sekarang), // Format the number as currency "Rp300.000"
    jumlah_hibah_diterima: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(desa.jumlah_hibah_diterima),
  }));

  // Excel export
  const exportToExcel = () => {
    // Data yang akan diekspor
    const data = filteredDesa.flatMap((desa) => {
      // Data utama desa
      const desaRow = {
        No: desa.no,
        Nama: desa.nama,
        Alamat: desa.alamat,
        "Tanggal Pembentukan": desa.tanggal_pembentukan,
        "Jumlah Hibah Diterima": desa.jumlah_hibah_diterima,
        "Jumlah Dana Sekarang": desa.jumlah_dana_sekarang,
        "Jumlah Anggota Sekarang": desa.jumlah_anggota_sekarang,
        "Jumlah Anggota Awal": desa.jumlah_anggota_awal,
        Kategori: desa.kategori,
      };

      // Jika tidak ada produk dan pengurus, buat satu baris dengan nilai "-"
      if (desa.produk.length === 0 && desa.pengurus.length === 0) {
        return [
          {
            ...desaRow,
            "Nama Produk": "-",
            "Harga Produk": "-",
            "Nama Pengurus": "-",
            "Jabatan Pengurus": "-",
            "No HP Pengurus": "-",
          },
        ];
      }

      // Baris pertama: desa + produk pertama (jika ada) + pengurus pertama (jika ada)
      const firstRow = {
        ...desaRow,
        "Nama Produk": desa.produk.length > 0 ? desa.produk[0].nama : "-",
        "Harga Produk": desa.produk.length > 0 ? `Rp ${desa.produk[0].harga_awal.toLocaleString("id-ID")} - Rp ${desa.produk[0].harga_akhir.toLocaleString("id-ID")}` : "-",
        "Nama Pengurus": desa.pengurus.length > 0 ? desa.pengurus[0].nama : "-",
        "Jabatan Pengurus": desa.pengurus.length > 0 ? desa.pengurus[0].jabatan : "-",
        "No HP Pengurus": desa.pengurus.length > 0 ? desa.pengurus[0].nohp : "-",
      };

      // Baris tambahan untuk produk (jika ada lebih dari satu produk)
      const produkRows = desa.produk.slice(1).map((produk) => ({
        No: "", // Kolom desa dikosongkan
        Nama: "",
        Alamat: "",
        "Tanggal Pembentukan": "",
        "Jumlah Hibah Diterima": "",
        "Jumlah Dana Sekarang": "",
        "Jumlah Anggota Sekarang": "",
        "Jumlah Anggota Awal": "",
        Kategori: "",
        "Nama Produk": produk.nama,
        "Harga Produk": `Rp ${produk.harga_awal.toLocaleString("id-ID")} - Rp ${produk.harga_akhir.toLocaleString("id-ID")}`,
        "Nama Pengurus": "", // Kolom pengurus dikosongkan
        "Jabatan Pengurus": "",
        "No HP Pengurus": "",
      }));

      // Baris tambahan untuk pengurus (jika ada lebih dari satu pengurus)
      const pengurusRows = desa.pengurus.slice(1).map((pengurus) => ({
        No: "", // Kolom desa dikosongkan
        Nama: "",
        Alamat: "",
        "Tanggal Pembentukan": "",
        "Jumlah Hibah Diterima": "",
        "Jumlah Dana Sekarang": "",
        "Jumlah Anggota Sekarang": "",
        "Jumlah Anggota Awal": "",
        Kategori: "",
        "Nama Produk": "", // Kolom produk dikosongkan
        "Harga Produk": "",
        "Nama Pengurus": pengurus.nama,
        "Jabatan Pengurus": pengurus.jabatan,
        "No HP Pengurus": pengurus.nohp,
      }));

      return [firstRow, ...produkRows, ...pengurusRows];
    });

    // Buat worksheet dari data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Buat workbook dan tambahkan worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kelompok Desa");

    // Ekspor ke file Excel
    XLSX.writeFile(workbook, "KelompokDesa.xlsx");
  };

  const clearFilters = () => {
    setSearch({
      kategori: [],
      kecamatanNama: [],
      kabupatenNama: [],
      keyword: "",
      anggotaDari: "",
      anggotaSampai: "",
      danaDari: "",
      danaSampai: "",
    });
    setStartDate("");
    setEndDate("");
  };

  const toggleFilter = () => setIsFilterVisible(!isFilterVisible);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDesa(null);
    // Panggil fetchDesaData dengan kabupatenName yang sesuai
    fetchDesaData(formattedKabupaten);

    // Pertahankan filter kabupaten
    if (formattedKabupaten) {
      setSearch((prev) => ({
        ...prev,
        kabupatenNama: [formattedKabupaten],
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#542d48" height={80} width={80} />
      </div>
    );
  }

  return (
    <>
      <ErrorBoundary>
        <div className={`App py-7 px-5 flex flex-col md:flex-row w-full lg:100% justify-center ${isFilterVisible ? "w-full" : ""} `}>
          {isMobile && <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 ${isFilterVisible ? "block" : "hidden"}`} onClick={toggleFilter}></div>}

          <div
            className={`${isFilterVisible ? "hidden" : "md:block"}
              hidden h-fit bg-white p-3 rounded-sm hover:bg-inactive cursor-pointer transition-colors duration-300`}
            onClick={toggleFilter}
          >
            <FontAwesomeIcon icon={faFilter} style={{ color: "#A8A8A8" }} />
          </div>
          {/* Filter Section */}
          {isFilterVisible && (
            <FilterSection
              isFilterVisible={isFilterVisible}
              toggleFilter={toggleFilter}
              search={search}
              setSearch={setSearch}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              desaList={desaList}
              userRole={userRole}
              formatKabupatenName={formatKabupatenName}
            />
          )}

          {/* Main Content */}
          <div className={`ml-0 md:ml-4 bg-white w-full md:w-[80%]`}>
            <SearchSection
              profil={profil}
              search={search}
              setSearch={setSearch}
              toggleFilter={toggleFilter}
              isFilterVisible={isFilterVisible}
              kabupatenName={kabupatenName}
              userRole={userRole}
              exportToExcel={exportToExcel}
              setIsModalOpen={setIsModalOpen}
            />

            <ActiveFilters userRole={userRole} search={search} setSearch={setSearch} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} formatCurrency={formatCurrency} clearFilters={clearFilters} />

            <DataTable
              desaList={desaList || []}
              filteredDesa={(filteredDesaList || []).map((desa, index) => ({
                ...desa,
                no: index + 1,
                alamat: `${desa.kelurahan || ""}, ${desa.kecamatan || ""}, ${desa.kabupaten_kota || ""}`,
                tanggal_pembentukan: desa.tanggal_pembentukan
                  ? new Date(desa.tanggal_pembentukan).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-",
                jumlah_dana_sekarang: formatCurrency(desa.jumlah_dana_sekarang || 0),
              }))}
              columns={columns}
              isMobile={isMobile}
              onUpdate={fetchDesaData}
            />
          </div>
        </div>

        {isModalOpen && <Modal isOpen={isModalOpen} onClose={handleModalClose} selectedDesa={selectedDesa} kabupatenName={formattedKabupaten} />}
      </ErrorBoundary>
    </>
  );
};

export default ListKelompokDesa;
