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

  const numberFields = ["jumlah_desa"];

  useEffect(() => {
    if (selectedKabupaten) {
      setFormData({
        nama_kabupaten: selectedKabupaten.nama_kabupaten,
        jumlah_desa: selectedKabupaten.jumlah_desa,
        periode_awal: selectedKabupaten.periode_awal,
        periode_akhir: selectedKabupaten.periode_akhir,
        ketua_forum: selectedKabupaten.ketua_forum,
      });
    }
  }, [selectedKabupaten]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: numberFields.includes(name) ? parseInt(value, 10) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedKabupaten) {
        // Edit data kabupaten
        await axios.put(`http://localhost:5000/api/kabupaten/${selectedKabupaten.id}`, formData);
        toast.success(`Data kabupaten ${formData.nama_kabupaten} berhasil diubah!`, { position: "top-right" });
      } else {
        // Add new kabupaten
        await axios.post("http://localhost:5000/api/kabupaten", formData);
        toast.success(`Data kabupaten ${formData.nama_kabupaten} berhasil ditambahkan!`, { position: "top-right" });
      }

      setFormData({
        nama_kabupaten: "",
        jumlah_desa: "",
        periode_awal: "",
        periode_akhir: "",
        ketua_forum: "",
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
        <div className="bg-white p-8 rounded-lg w-96 max-w-lg shadow-lg">
          <h2 className="text-center font-semibold text-xl mb-6 text-blue-600">{selectedKabupaten ? "Edit Data Kabupaten" : "Tambah Data Kabupaten"}</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div key={key} className="mb-3">
                <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/_/g, " ")}</label>
                <input
                  type={key.includes("periode") ? "date" : numberFields.includes(key) ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder={`Masukkan ${key.replace(/_/g, " ")}`}
                  required
                />
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none">
                {selectedKabupaten ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={onClose} className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none">
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
