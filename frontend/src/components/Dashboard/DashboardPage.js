import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
import Header from "./Header";
import DoughnutChart from "./DoughnutChart";
import Informasi from "./Informasi";
import LineChart from "./LineChart";
import PetaDesa from "./PetaDesa";
import Breadcrumb from "../Breadcrumb";

const DashboardPage = () => {
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kabupatenData, setKabupatenData] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [kecamatanList, setKecamatanList] = useState([]); // New state for kecamatan
  const [selectedKategori, setSelectedKategori] = useState("");

  const navigate = useNavigate();

  const fetchDesaData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/desa");
      console.log(response.data); // Log untuk mengecek struktur data
      setDesaList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  const fetchKabupatenData = async () => {
    try {
      const response = await axios.get("https://ibnux.github.io/data-indonesia/kabupaten/34.json");
      setKabupatenData(response.data);
    } catch (err) {
      console.error("Gagal memuat data kabupaten:", err);
    }
  };

  const fetchKecamatan = (kabupatenId) => {
    axios
      .get(`https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`)
      .then((res) => setKecamatanList(res.data)) // Update kecamatanList
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDesaData();
    fetchKabupatenData();
  }, []);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatan(selectedKabupaten); // Fetch kecamatan when kabupaten changes
    }
  }, [selectedKabupaten]);

  const handleKabupatenChange = (e) => {
    const value = e.target.value;
    console.log("Kabupaten Selected:", value);
    setSelectedKabupaten(value);
  };

  const handleKecamatanChange = (e) => {
    const value = e.target.value;
    console.log("Kecamatan Selected:", value);
    setSelectedKecamatan(value);
  };

  const handleKategoriChange = (e) => {
    const value = e.target.value;
    console.log("Kategori Selected:", value);
    setSelectedKategori(value);
  };

  console.log("Selected Kabupaten:", selectedKabupaten);
  console.log("Selected Kecamatan:", selectedKecamatan);
  console.log("Selected Kategori:", selectedKategori);

  const filterDesa = () => {
    return desaList.filter((desa) => {
      const matchKabupaten = selectedKabupaten ? `${desa.kabupatenId}` === selectedKabupaten : true;
      const matchKecamatan = selectedKecamatan ? desa.kecamatanNama?.toLowerCase() === selectedKecamatan.toLowerCase() : true;
      const matchKategori = selectedKategori ? desa.kelompok_desa === selectedKategori : true;

      // Desa harus cocok dengan semua kondisi yang dipilih
      return matchKabupaten && matchKecamatan && matchKategori;
    });
  };

  // Halaman loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <>
    <Header />
    <Informasi />
    <div className="mt-6 grid grid-cols-3 gap-6">
        <LineChart />
        <DoughnutChart />
    </div>
    
    <div className="px-10">
    <PetaDesa />
    </div>
    </>
  );
};

export default DashboardPage;
