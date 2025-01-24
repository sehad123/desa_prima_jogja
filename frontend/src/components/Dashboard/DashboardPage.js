import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
import Header from "./Header";
import Informasi from "./Informasi";
import PetaDesa from "./PetaDesa";

const DashboardPage = () => {
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kabupatenData, setKabupatenData] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [kecamatanList, setKecamatanList] = useState([]);

  const navigate = useNavigate();

  const fetchDesaData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/desa");
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
      .then((res) => setKecamatanList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDesaData();
    fetchKabupatenData();
  }, []);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatan(selectedKabupaten);
    }
  }, [selectedKabupaten]);

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
      <div className="relative">
        {/* Tombol dipindahkan ke pojok kanan atas */}
        <button className="absolute top-3 right-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 shadow-md" onClick={() => navigate("/kabupaten-page")}>
          Daftar Kabupaten/Kota
        </button>
      </div>
      <Informasi />
      <div className="px-10">
        <PetaDesa />
      </div>
    </>
  );
};

export default DashboardPage;
