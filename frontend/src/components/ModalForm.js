import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalForm = ({ onClose, selectedDesa }) => {
  const [formData, setFormData] = useState({
    kelompok_desa: "",
    kabupaten: "",
    kabupatenNama: "", // Nama Kabupaten
    kecamatan: "",
    kecamatanNama: "", // Nama Kecamatan
    kelurahan: "",
    kelurahanNama: "", // Nama Kelurahan
    tahun_pembentukan: "",
    jumlah_hibah_diterima: "",
    jumlah_dana_sekarang: "",
    jumlah_anggota_awal: "",
    jumlah_anggota_sekarang: "",
    pengurus: "",
    latitude: "", // Tambahan latitude
    longitude: "", //
  });

  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [categoryNotification, setCategoryNotification] = useState("");
  const [showCategoryNotification, setShowCategoryNotification] = useState(false);

  const numberFields = ["jumlah_hibah_diterima", "jumlah_dana_sekarang", "jumlah_anggota_awal", "jumlah_anggota_sekarang", "latitude", "longitude"];

  useEffect(() => {
    if (selectedDesa) {
      setFormData({
        kelompok_desa: selectedDesa.kelompok_desa,
        kabupaten: selectedDesa.kabupaten || "",
        kecamatan: selectedDesa.kecamatan || "",
        kelurahan: selectedDesa.kelurahan || "",
        tahun_pembentukan: selectedDesa.tahun_pembentukan,
        jumlah_hibah_diterima: selectedDesa.jumlah_hibah_diterima,
        jumlah_dana_sekarang: selectedDesa.jumlah_dana_sekarang,
        jumlah_anggota_awal: selectedDesa.jumlah_anggota_awal,
        jumlah_anggota_sekarang: selectedDesa.jumlah_anggota_sekarang,
        pengurus: selectedDesa.pengurus || "",
        latitude: selectedDesa.latitude || "",
        longitude: selectedDesa.longitude || "",
      });
    }

    // Fetch Kabupaten data (DIY: id_provinsi = 34)
    axios
      .get("https://ibnux.github.io/data-indonesia/kabupaten/34.json")
      .then((res) => setKabupatenList(res.data))
      .catch((err) => console.error(err));
  }, [selectedDesa]);

  const fetchKecamatan = (kabupatenId) => {
    axios
      .get(`https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`)
      .then((res) => setKecamatanList(res.data))
      .catch((err) => console.error(err));
  };

  const fetchKelurahan = (kecamatanId) => {
    axios
      .get(`https://ibnux.github.io/data-indonesia/kelurahan/${kecamatanId}.json`)
      .then((res) => setKelurahanList(res.data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "latitude" || name === "longitude" ? value : numberFields.includes(name) ? parseInt(value, 10) || "" : value,
    });

    if (name === "kabupaten") {
      const selectedKabupaten = kabupatenList.find((kabupaten) => kabupaten.id === value);
      setFormData((prev) => ({
        ...prev,
        kabupaten: value,
        kabupatenNama: selectedKabupaten ? selectedKabupaten.nama : "", // Simpan nama kabupaten
      }));
      fetchKecamatan(value);
      setFormData((prev) => ({ ...prev, kecamatan: "", kelurahan: "", kecamatanNama: "", kelurahanNama: "" }));
      setKecamatanList([]);
      setKelurahanList([]);
    }

    if (name === "kecamatan") {
      const selectedKecamatan = kecamatanList.find((kecamatan) => kecamatan.id === value);
      setFormData((prev) => ({
        ...prev,
        kecamatan: value,
        kecamatanNama: selectedKecamatan ? selectedKecamatan.nama : "", // Simpan nama kecamatan
      }));
      fetchKelurahan(value);
      setFormData((prev) => ({ ...prev, kelurahan: "", kelurahanNama: "" }));
      setKelurahanList([]);
    }

    if (name === "kelurahan") {
      const selectedKelurahan = kelurahanList.find((kelurahan) => kelurahan.id === value);
      setFormData((prev) => ({
        ...prev,
        kelurahan: value,
        kelurahanNama: selectedKelurahan ? selectedKelurahan.nama : "", // Simpan nama kelurahan
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { jumlah_anggota_sekarang, jumlah_dana_sekarang, latitude, longitude } = formData;

    // Categorize based on the rules
    let kategori = "";

    if (jumlah_anggota_sekarang >= 25 && jumlah_anggota_sekarang <= 30 && jumlah_dana_sekarang >= 20000000 && jumlah_dana_sekarang <= 30000000) {
      kategori = "Tumbuh";
    } else if (jumlah_anggota_sekarang >= 31 && jumlah_anggota_sekarang <= 35 && jumlah_dana_sekarang > 30000000 && jumlah_dana_sekarang <= 40000000) {
      kategori = "Berkembang";
    } else if (jumlah_anggota_sekarang > 35 && jumlah_dana_sekarang > 40000000) {
      kategori = "Maju";
    } else {
      kategori = "Dalam Proses";
    }

    const updatedFormData = {
      ...formData,
      kategori,
      kabupaten: formData.kabupatenNama, // Kirimkan nama Kabupaten
      kecamatan: formData.kecamatanNama, // Kirimkan nama Kecamatan
      kelurahan: formData.kelurahanNama, // Kirimkan nama Kelurahan
      latitude: parseFloat(latitude), // Konversi latitude ke float
      longitude: parseFloat(longitude), // Konversi longitude ke float
    };

    try {
      if (selectedDesa) {
        // Edit data desa
        await axios.put(`http://localhost:5000/api/desa/${selectedDesa.id}`, updatedFormData);
        toast.success(`Data desa ${formData.kelompok_desa} berhasil diubah!`, { position: "top-right" });
      } else {
        // Add new desa
        await axios.post("http://localhost:5000/api/desa", updatedFormData);
        toast.success(`Data desa ${formData.kelompok_desa} berhasil ditambahkan!`, { position: "top-right" });
      }

      setCategoryNotification(`Kategori Desa: ${kategori}`);
      setShowCategoryNotification(true);

      setTimeout(() => setShowCategoryNotification(false), 3000);

      setFormData({
        kelompok_desa: "",
        kabupaten: "",
        kabupatenNama: "",
        kecamatan: "",
        kecamatanNama: "",
        kelurahan: "",
        kelurahanNama: "",
        tahun_pembentukan: "",
        jumlah_hibah_diterima: "",
        jumlah_dana_sekarang: "",
        jumlah_anggota_awal: "",
        jumlah_anggota_sekarang: "",
        pengurus: "",
        latitude: "",
        longitude: "",
      });

      onClose(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan dalam proses penyimpanan data.", { position: "top-right" });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-[600px] max-w-lg shadow-lg">
          <h2 className="text-center font-semibold text-xl mb-6 text-blue-600">{selectedDesa ? "Edit Data" : "Tambah Data Kelompok Desa"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kelompok Desa</label>
                <input type="text" name="kelompok_desa" value={formData.kelompok_desa} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Kelompok Desa" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kabupaten</label>
                <select name="kabupaten" value={formData.kabupaten} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Pilih Kabupaten</option>
                  {kabupatenList.map((kabupaten) => (
                    <option key={kabupaten.id} value={kabupaten.id}>
                      {kabupaten.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kecamatan</label>
                <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Pilih Kecamatan</option>
                  {kecamatanList.map((kecamatan) => (
                    <option key={kecamatan.id} value={kecamatan.id}>
                      {kecamatan.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kelurahan</label>
                <select name="kelurahan" value={formData.kelurahan} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Pilih Kelurahan</option>
                  {kelurahanList.map((kelurahan) => (
                    <option key={kelurahan.id} value={kelurahan.id}>
                      {kelurahan.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Pembentukan</label>
                <input type="date" name="tahun_pembentukan" value={formData.tahun_pembentukan} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Hibah Diterima</label>
                <input
                  type="number"
                  name="jumlah_hibah_diterima"
                  value={formData.jumlah_hibah_diterima}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah Hibah Diterima"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Dana Sekarang</label>
                <input
                  type="number"
                  name="jumlah_dana_sekarang"
                  value={formData.jumlah_dana_sekarang}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah Dana Sekarang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Anggota Awal</label>
                <input
                  type="number"
                  name="jumlah_anggota_awal"
                  value={formData.jumlah_anggota_awal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah Anggota Awal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Anggota Sekarang</label>
                <input
                  type="number"
                  name="jumlah_anggota_sekarang"
                  value={formData.jumlah_anggota_sekarang}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah Anggota Sekarang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pengurus</label>
                <input type="text" name="pengurus" value={formData.pengurus} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Nama Pengurus" />
              </div>
              {/* Latitude dan Longitude */}
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input type="text" step="0.000001" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Latitude" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input type="text" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Longitude" required />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
      {showCategoryNotification && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white p-4 rounded-lg z-50 text-center">{categoryNotification}</div>}
    </>
  );
};

export default ModalForm;
