import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";

const PetaDesa = () => {
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kabupatenData, setKabupatenData] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState(""); // Nama Kabupaten untuk filter marker
  const [selectedKabupatenId, setSelectedKabupatenId] = useState(""); // ID Kabupaten untuk daftar kecamatan
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [kecamatanList, setKecamatanList] = useState([]); // New state for kecamatan
  const [selectedKategori, setSelectedKategori] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDesaData();
    fetchKabupatenData();
  }, []);

  const fetchDesaData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/desa");
      console.log("Data Desa:", response.data); // Periksa struktur data desa
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
      console.log("Data Kabupaten:", response.data); // Periksa struktur data kabupaten
      setKabupatenData(response.data);
    } catch (err) {
      console.error("Gagal memuat data kabupaten:", err);
    }
  };

  const fetchKecamatan = (kabupatenId) => {
    axios
      .get(`https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`)
      .then((res) => {
        console.log("Data Kecamatan:", res.data); // Periksa struktur data kecamatan
        setKecamatanList(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (selectedKabupatenId) {
      fetchKecamatan(selectedKabupatenId);
    } else {
      setKecamatanList([]); // Reset kecamatan jika tidak ada kabupaten yang dipilih
    }
  }, [selectedKabupatenId]);

  const handleKabupatenChange = (e) => {
    const kabupatenNama = e.target.options[e.target.selectedIndex].text; // Ambil teks (nama kabupaten)
    const kabupatenId = e.target.value; // Ambil ID kabupaten

    console.log("Selected Kabupaten Nama:", kabupatenNama);
    console.log("Selected Kabupaten ID:", kabupatenId);

    setSelectedKabupaten(kabupatenNama); // Untuk filter marker
    setSelectedKabupatenId(kabupatenId); // Untuk fetch kecamatan
    setSelectedKecamatan(""); // Reset kecamatan saat kabupaten berubah
  };

  const handleKecamatanChange = (e) => {
    const value = e.target.value;
    console.log("Selected Kecamatan ID:", value); // Periksa nilai selectedKecamatan
    setSelectedKecamatan(value);
  };

  const handleKategoriChange = (e) => {
    const value = e.target.value;
    console.log("Selected Kategori:", value); // Periksa nilai selectedKategori
    setSelectedKategori(value);
  };

  const filterDesa = () => {
    return desaList.filter((desa) => {
      const matchKabupaten = selectedKabupaten ? desa.kabupatenNama === selectedKabupaten : true;
      const matchKecamatan = selectedKecamatan ? desa.kecamatanNama === selectedKecamatan : true;
      const matchKategori = selectedKategori ? desa.kategori === selectedKategori : true;

      return matchKabupaten && matchKecamatan && matchKategori;
    });
  };

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
    <div className="py-3 px-5 bg-white rounded-md shadow-md">
      <div className="mx-6 my-5 flex justify-between items-center">
        <h1 className="text-lg lg:text-xl font-bold mx-auto">Sebaran Kelompok Desa Prima Daerah Istimewa Yogyakarta</h1>
      </div>

      <div className="flex flex-col md:flex-row mx-4 gap-4 mb-5">
        <div className="md:w-1/3 flex flex-wrap items-center space-y-2 relative">
          <p className="text-sm lg:text-lg">Kabupaten/Kota</p>
          <select
            className="text-sm lg:text-lg border border-gray-300 rounded px-4 py-2 w-full appearance-none"
            onChange={handleKabupatenChange}
            value={selectedKabupatenId} // Gunakan ID untuk tracking daftar kecamatan
          >
            <option className="text-sm lg:text-lg" value="">
              Semua
            </option>
            {kabupatenData.map((kabupaten) => (
              <option key={kabupaten.id} value={kabupaten.id}>
                {kabupaten.nama}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 transform -translate-y-1 pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
          </div>
        </div>

        <div className="md:w-1/3 flex flex-wrap items-center space-y-2 relative">
          <p className="text-sm lg:text-lg">Kecamatan</p>
          <select className="text-sm lg:text-lg border border-gray-300 rounded px-4 py-2 w-full appearance-none" onChange={handleKecamatanChange} value={selectedKecamatan}>
            <option className="text-sm lg:text-lg" value="">
              Semua
            </option>
            {kecamatanList.map((kecamatan) => (
              <option key={kecamatan.id} value={kecamatan.nama}>
                {kecamatan.nama}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 transform -translate-y-1 pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
          </div>
        </div>

        <div className="md:w-1/3 flex flex-wrap items-center space-y-2 relative">
          <p className="text-sm lg:text-lg">Kategori</p>
          <select className="text-sm lg:text-lg border border-gray-300 rounded px-4 py-2 w-full appearance-none pr-8" onChange={handleKategoriChange} value={selectedKategori}>
            <option className="text-sm lg:text-lg" value="">
              Kategori
            </option>
            <option className="text-sm lg:text-lg" value="Maju">
              Maju
            </option>
            <option className="text-sm lg:text-lg" value="Berkembang">
              Berkembang
            </option>
            <option className="text-sm lg:text-lg" value="Tumbuh">
              Tumbuh
            </option>
          </select>
          {/* Ikon Dropdown */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1 pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className="w-full px-2 h-[600px]">
        <MapContainer center={[-7.7956, 110.3695]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filterDesa().length === 0 ? (
            <div className="text-center text-lg text-red-500">Tidak ada desa yang sesuai dengan filter.</div>
          ) : (
            filterDesa()
              .filter((desa) => desa.latitude && desa.longitude) // Hanya render marker jika ada koordinat
              .map((desa) => (
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
                    <strong className="text-sm lg:text-lg">{desa.kelompok_desa}</strong>
                    <br className="text-sm lg:text-lg" />
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
