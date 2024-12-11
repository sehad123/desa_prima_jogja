import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalKabupaten = ({ onClose, selectedKabupaten }) => {
  const [formData, setFormData] = useState({
    nama_kabupaten: "",
    jumlah_desa: "",
    periode_awal: "",
    periode_akhir: "",
    ketua_forum: "",
  });

  useEffect(() => {
    if (selectedKabupaten) {
      // Saat edit, hanya isi data yang akan diedit
      setFormData({
        jumlah_desa: selectedKabupaten.jumlah_desa || "",
        ketua_forum: selectedKabupaten.ketua_forum || "",
      });
    } else {
      // Reset form saat create
      setFormData({
        nama_kabupaten: "",
        jumlah_desa: "",
        periode_awal: "",
        periode_akhir: "",
        ketua_forum: "",
      });
    }
  }, [selectedKabupaten]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "jumlah_desa" ? parseInt(value, 10) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedKabupaten) {
        // Update data kabupaten
        await axios.put(`http://localhost:5000/api/kabupaten/${selectedKabupaten.id}`, formData);
        toast.success(`Data kabupaten berhasil diubah!`, { position: "top-right" });
      } else {
        // Tambah data kabupaten
        await axios.post("http://localhost:5000/api/kabupaten", formData);
        toast.success(`Data kabupaten berhasil ditambahkan!`, { position: "top-right" });
      }

      onClose(true); // Close modal and refresh parent component
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan dalam proses penyimpanan data.", { position: "top-right" });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-96 max-w-lg shadow-lg">
          <h2 className="text-center font-semibold text-xl mb-6 text-blue-600">{selectedKabupaten ? "Edit Data Kabupaten" : "Tambah Data Kabupaten"}</h2>
          <form onSubmit={handleSubmit}>
            {/* Render semua kolom saat create */}
            {!selectedKabupaten && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Nama Kabupaten</label>
                  <input
                    type="text"
                    name="nama_kabupaten"
                    value={formData.nama_kabupaten}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder="Masukkan nama kabupaten"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Periode Awal</label>
                  <input type="date" name="periode_awal" value={formData.periode_awal} onChange={handleChange} className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400" required />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Periode Akhir</label>
                  <input type="date" name="periode_akhir" value={formData.periode_akhir} onChange={handleChange} className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400" required />
                </div>
              </>
            )}

            {/* Render hanya jumlah desa dan ketua forum */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Jumlah Desa</label>
              <input
                type="number"
                name="jumlah_desa"
                value={formData.jumlah_desa}
                onChange={handleChange}
                className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="Masukkan jumlah desa"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Ketua Forum</label>
              <input
                type="text"
                name="ketua_forum"
                value={formData.ketua_forum}
                onChange={handleChange}
                className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="Masukkan nama ketua forum"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none">
                {selectedKabupaten ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={() => onClose(false)} className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalKabupaten;
