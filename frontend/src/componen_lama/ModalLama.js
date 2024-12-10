import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalForm = ({ onClose, selectedDesa }) => {
  // Set initial state to empty form data or the selectedDesa if editing
  const [formData, setFormData] = useState({
    nama_desa: "",
    alamat_desa: "",
    tahun_pembentukan: "",
    jumlah_hibah_diterima: "",
    jumlah_dana_sekarang: "",
    jumlah_anggota_awal: "",
    jumlah_anggota_sekarang: "",
  });

  // To handle category prediction notification
  const [categoryNotification, setCategoryNotification] = useState("");
  const [showCategoryNotification, setShowCategoryNotification] = useState(false);

  const numberFields = ["tahun_pembentukan", "jumlah_hibah_diterima", "jumlah_dana_sekarang", "jumlah_anggota_awal", "jumlah_anggota_sekarang"];

  // Effect hook to populate form if editing
  useEffect(() => {
    if (selectedDesa) {
      setFormData({
        nama_desa: selectedDesa.nama_desa,
        alamat_desa: selectedDesa.alamat_desa,
        tahun_pembentukan: selectedDesa.tahun_pembentukan,
        jumlah_hibah_diterima: selectedDesa.jumlah_hibah_diterima,
        jumlah_dana_sekarang: selectedDesa.jumlah_dana_sekarang,
        jumlah_anggota_awal: selectedDesa.jumlah_anggota_awal,
        jumlah_anggota_sekarang: selectedDesa.jumlah_anggota_sekarang,
      });
    }
  }, [selectedDesa]);

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
      const predictResponse = await axios.post("http://127.0.0.1:5000/predict", formData);
      const categories = ["Berkembang", "Maju", "Tumbuh"];
      const interpretedResult = categories[predictResponse.data.kategori];

      const updatedFormData = { ...formData, kategori: interpretedResult };

      if (selectedDesa) {
        // Edit data desa
        await axios.put(`http://localhost:5000/api/desa/${selectedDesa.id}`, updatedFormData);
        toast.success(`Data desa ${formData.nama_desa} berhasil diubah!`, { position: "top-right" });
      } else {
        // Add new desa
        await axios.post("http://localhost:5000/api/desa", updatedFormData);
        toast.success(`Data desa ${formData.nama_desa} berhasil ditambahkan!`, { position: "top-right" });
      }

      setCategoryNotification(`Kategori Desa: ${interpretedResult}`);
      setShowCategoryNotification(true);

      setTimeout(() => setShowCategoryNotification(false), 3000);

      setFormData({
        nama_desa: "",
        alamat_desa: "",
        tahun_pembentukan: "",
        jumlah_hibah_diterima: "",
        jumlah_dana_sekarang: "",
        jumlah_anggota_awal: "",
        jumlah_anggota_sekarang: "",
      });

      onClose(true); // Pass 'true' to indicate success
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan dalam proses prediksi atau penyimpanan data.", { position: "top-right" });
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-96 max-w-lg shadow-lg">
          <h2 className="text-center font-semibold text-xl mb-6 text-blue-600">{selectedDesa ? "Edit Data" : "Tambah Data"}</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div key={key} className="mb-3">
                <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/_/g, " ")}</label>
                <input
                  type={numberFields.includes(key) ? "number" : "text"}
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
                {selectedDesa ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={onClose} className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notifikasi kategori di tengah halaman */}
      {showCategoryNotification && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white p-4 rounded-lg z-50 text-center">{categoryNotification}</div>}
    </>
  );
};

export default ModalForm;
