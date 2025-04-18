import React, { useEffect, useState } from "react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import Header from "./Dashboard/HeaderDashboard";
import DashboardComponent from "./Dashboard/DashboardComponent";

const ProvinsiDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  const [profil, setProfil] = useState({});
  const [kelompokDesa, setKelompokDesa] = useState([]); // Pastikan ini selalu array
  const [provinsi, setProvinsi] = useState({
      jumlah_maju: 0,
      jumlah_berkembang: 0,
      jumlah_tumbuh: 0,
      jumlah_desa: 0,
      periode_awal: new Date(),
      periode_akhir: new Date(),
    });
    const [totalJumlahDesa, setTotalJumlahDesa] = useState(0);
    const [desaMaju, setDesaMaju] = useState(0);
    const [desaBerkembang, setDesaBerkembang] = useState(0);
    const [desaTumbuh, setDesaTumbuh] = useState(0);
    const [kabupatenData, setKabupatenData] = useState([]);
    const [selectedKabupaten, setSelectedKabupaten] = useState(""); 
    const [kecamatanList, setKecamatanList] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
     const [showErrorNotification, setShowErrorNotification] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const [showSuccessNotification, setShowSuccessNotification] = useState(false);
      const [successMessage, setSuccessMessage] = useState("");
        

  const fetchKabupatenData = async () => {
    try {
      const response = await axios.get(
        "https://ibnux.github.io/data-indonesia/kabupaten/34.json"
      );
      setKabupatenData(response.data);
    } catch (err) {
      console.error("Gagal memuat data kabupaten:", err);
    }
  };

  const fetchKecamatan = (kabupatenId) => {
    axios
      .get(
        `https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`
      )
      .then((res) => setKecamatanList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfil(response.data);
      } catch (error) {
        console.error(
          "Gagal mengambil profil:",
          error.response?.data?.error || error.message
        );
      }
    };

    fetchProfil();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
    
        const headers = { Authorization: `Bearer ${token}` };
    
        // Ambil data kabupaten dari API
        const kabupatenResponse = await axios.get(
          `http://localhost:5000/api/kabupaten`
        );
    
        // Cek apakah respons valid
        if (!kabupatenResponse.data) {
          throw new Error("Data kabupaten tidak ditemukan");
        }
    
        console.log("Data kabupaten dari API:", kabupatenResponse.data); // Log data dari API
    
        const kabupatenData = kabupatenResponse.data;
    
        // Hitung total jumlah desa dari kolom `jumlah_desa` di tabel kabupaten
        const totalJumlahDesa = kabupatenData.reduce(
          (sum, kabupaten) => sum + (kabupaten.jumlah_desa || 0),
          0
        );
        console.log("Total jumlah desa dari seluruh kabupaten:", totalJumlahDesa);
    
        // Ambil data desa dari API
        const desaResponse = await axios.get("http://localhost:5000/api/desa", {
          headers,
        });
    
        // Pastikan data desa adalah array
        const kelompokDesaData = Array.isArray(desaResponse.data)
          ? desaResponse.data
          : desaResponse.data.data || []; // Ambil array dari properti `data` jika ada
    
        console.log("Data desa dari API:", kelompokDesaData);
    
        // Simpan data desa ke state
        setKelompokDesa(kelompokDesaData);
    
        // Hitung jumlah desa berdasarkan kategori
        const jumlahMaju = kelompokDesaData.filter(
          (desa) => desa.kategori === "Maju"
        ).length;
        const jumlahBerkembang = kelompokDesaData.filter(
          (desa) => desa.kategori === "Berkembang"
        ).length;
        const jumlahTumbuh = kelompokDesaData.filter(
          (desa) => desa.kategori === "Tumbuh"
        ).length;
    
        console.log("Jumlah desa maju:", jumlahMaju);
        console.log("Jumlah desa berkembang:", jumlahBerkembang);
        console.log("Jumlah desa tumbuh:", jumlahTumbuh);
    
        // Simpan jumlah desa ke state
        setDesaMaju(jumlahMaju);
        setDesaBerkembang(jumlahBerkembang);
        setDesaTumbuh(jumlahTumbuh);
    
        // Hitung total anggota dari seluruh desa
        const totalAnggota = kelompokDesaData.reduce(
          (sum, desa) => sum + (desa.jumlah_anggota_sekarang || 0),
          0
        );
        console.log("Total anggota dari seluruh desa:", totalAnggota);
    
        // Hitung tanggal awal dan akhir berdasarkan tanggal_pembentukan
        const validDates = kelompokDesaData
          .map((desa) =>
            desa.tanggal_pembentukan
              ? new Date(desa.tanggal_pembentukan)
              : null
          )
          .filter((date) => date !== null && !isNaN(date.getTime()));
    
        let startDate, endDate;
    
        if (validDates.length > 0) {
          startDate = new Date(
            Math.min(...validDates.map((date) => date.getTime()))
          );
          endDate = new Date(
            Math.max(...validDates.map((date) => date.getTime()))
          );
        } else {
          startDate = new Date(); // Default to current date if no valid dates
          endDate = new Date(); // Default to current date if no valid dates
        }
    
        setStartDate(startDate.toISOString());
        setEndDate(endDate.toISOString());
    
        // Simpan total jumlah desa ke state
        setTotalJumlahDesa(totalJumlahDesa);
    
        // Ambil data produk dari API
        const produkResponse = await axios.get(
          `http://localhost:5000/produk/total-produk`
        );
        const produkData = produkResponse.data.data; // Ambil data dari respons
        const produkPerDesa = produkData.totalProduk; // Ambil objek produk per desa
        console.log("Data produk dari API:", produkPerDesa);
    
        // Hitung total jumlah kelompok
        const totalJumlahKelompok = jumlahMaju + jumlahBerkembang + jumlahTumbuh;
    
        // Update desaList dengan data statistik
        setProvinsi({
          desaMaju: jumlahMaju,
          desaBerkembang: jumlahBerkembang,
          desaTumbuh: jumlahTumbuh,
          jumlah_desa: totalJumlahDesa, // Simpan total jumlah desa di sini
          tanggal_awal: startDate,
          tanggal_akhir: endDate,
          jumlahAnggota: totalAnggota,
          totalJumlahKelompok,
          produkPerDesa,
        });
    
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data", err);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    fetchKabupatenData();
  }, []);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatan(selectedKabupaten);
    }
  }, [selectedKabupaten]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#542d48" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <>
    <Header profil={profil}/>
    <div className="p-5">
        <DashboardComponent 
          data={provinsi} lineChartData={kelompokDesa} profil={profil}
        />
      </div>
      </>
  );
};

export default ProvinsiDashboard;
