import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const PetaDesa = () => {
  const [desaList, setDesaList] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);
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
      setDesaList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data desa.");
      setLoading(false);
    }
  };

  const fetchGeoJson = async () => {
    try {
      const response = await axios.get("/geojson/kabupaten-yogyakarta2.json");
      setGeoJsonData(response.data);
    } catch (err) {
      console.error("Gagal memuat data GeoJSON:", err);
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

  const getStyle = (feature) => {
    const kabupaten = feature.properties.kabupaten;
    switch (kabupaten) {
      case "KAB. SLEMAN":
        return { fillColor: "red", color: "black", weight: 1, fillOpacity: 0.6 };
      case "KAB. KULON PROGO":
        return { fillColor: "yellow", color: "black", weight: 1, fillOpacity: 0.6 };
      case "KAB. GUNUNGKIDUL":
        return { fillColor: "darkgreen", color: "black", weight: 1, fillOpacity: 0.6 };
      case "KAB. BANTUL":
        return { fillColor: "blue", color: "black", weight: 1, fillOpacity: 0.6 };
      case "KOTA YOGYAKARTA":
        return { fillColor: "orange", color: "black", weight: 1, fillOpacity: 0.6 };
      default:
        return { fillColor: "gray", color: "black", weight: 1, fillOpacity: 0.6 };
    }
  };

  useEffect(() => {
    fetchDesaData();
    fetchGeoJson();
    fetchKabupatenData();
  }, []);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatan(selectedKabupaten); // Fetch kecamatan when kabupaten changes
    }
  }, [selectedKabupaten]);

  const handleKabupatenChange = (e) => {
    const selectedKabupaten = e.target.value;
    setSelectedKabupaten(selectedKabupaten);
    setSelectedKecamatan(""); // Reset kecamatan when kabupaten changes
    setKecamatanList([]); // Clear kecamatan list until it's fetched
  };

  const handleKecamatanChange = (e) => {
    setSelectedKecamatan(e.target.value);
  };

  const handleKategoriChange = (e) => {
    setSelectedKategori(e.target.value);
  };

  const filterDesa = () => {
    return desaList.filter((desa) => {
      const matchKabupaten = selectedKabupaten ? desa.kabupatenId === parseInt(selectedKabupaten, 10) : true;
      const matchKecamatan = selectedKecamatan ? desa.kecamatanNama.toLowerCase().includes(selectedKecamatan.toLowerCase()) : true;
      const matchKategori = selectedKategori ? desa.kelompok_desa === selectedKategori : true;

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
              <option key={kecamatan.id} value={kecamatan.name}>
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

          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={getStyle}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(`Kabupaten: ${feature.properties.kabupaten}`);
              }}
            />
          )}

          {filterDesa().map((desa) => (
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
          ))}

          {filterDesa().map((desa) => (
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
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PetaDesa;
