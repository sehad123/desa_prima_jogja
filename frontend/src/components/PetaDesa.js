import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const PetaDesa = () => {
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

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="p-5">
      <Header onLogout={handleLogout} />

      <div className=" mx-10 flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Sebaran Kelompok Desa Prima Berdasarkan Kategori</h1>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => navigate("/kabupaten-page")}>
          Daftar Kabupaten/Kota
        </button>
      </div>

      <div className="flex ml-10 gap-4 mb-5">
        <select className="border border-gray-300 rounded px-4 py-2" onChange={handleKabupatenChange} value={selectedKabupaten}>
          <option value="">Kabupaten</option>
          {kabupatenData &&
            kabupatenData.map((kabupaten) => (
              <option key={kabupaten.id} value={kabupaten.id}>
                {kabupaten.nama}
              </option>
            ))}
        </select>
        <select className="border border-gray-300 rounded px-4 py-2" onChange={handleKecamatanChange} value={selectedKecamatan}>
          <option value="">Kecamatan</option>
          {kecamatanList &&
            kecamatanList.map((kecamatan) => (
              <option key={kecamatan.id} value={kecamatan.nama}>
                {kecamatan.nama}
              </option>
            ))}
        </select>
        <select className="border border-gray-300 rounded px-4 py-2" onChange={handleKategoriChange} value={selectedKategori}>
          <option value="">Kategori</option>
          <option value="Maju">Maju</option>
          <option value="Berkembang">Berkembang</option>
          <option value="Tumbuh">Tumbuh</option>
        </select>
      </div>

      <div className="w-full px-40 h-[600px]">
        <MapContainer center={[-7.7956, 110.3695]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filterDesa().length === 0 ? (
            <p>Tidak ada desa yang sesuai dengan filter.</p>
          ) : (
            filterDesa().map((desa) => (
              <Marker
                key={desa.id}
                position={[desa.latitude, desa.longitude]}
                icon={L.icon({
                  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>
                  <strong>{desa.kelompok_desa}</strong>
                  <br />
                  {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel. {desa.kelurahanNama}
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default PetaDesa;
