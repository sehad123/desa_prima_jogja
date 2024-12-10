import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ModalDetail = ({ onClose, selectedDesa, activeTab }) => {
  const [file, setFile] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState(""); // Untuk menyimpan pesan error

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCatatanChange = (e) => {
    setCatatan(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDesa || !selectedDesa.id) {
      setError("Desa tidak ditemukan. Pastikan desa dipilih dengan benar.");
      return;
    }

    const formData = new FormData();

    if (activeTab === "notulensiMateri") {
      if (!file || !catatan) {
        setError("Harap unggah file dan masukkan catatan.");
        return;
      }

      formData.append("file", file);
      formData.append("catatan", catatan);

      try {
        await axios.post(`http://localhost:5000/api/desa/${selectedDesa.id}/notulensi`, formData);
        toast.success("Notulensi berhasil ditambahkan", { position: "top-right" });
        onClose(true); // Berikan sinyal sukses
      } catch (error) {
        console.error("Error uploading notulensi:", error);
        setError("Gagal mengunggah notulensi. Coba lagi.");
      }
    } else if (activeTab === "galeriFoto") {
      if (!file) {
        setError("Harap unggah foto.");
        return;
      }

      formData.append("gambar", file);

      try {
        await axios.post(`http://localhost:5000/api/desa/${selectedDesa.id}/galeri`, formData);
        toast.success("Gambar berhasil ditambahkan", { position: "top-right" });
        onClose(true); // Berikan sinyal sukses
      } catch (error) {
        console.error("Error uploading photo:", error);
        setError("Gagal mengunggah foto. Coba lagi.");
      }
    }
  };

  const resetForm = () => {
    setFile(null);
    setCatatan("");
    setError(""); // Reset pesan error
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{activeTab === "notulensiMateri" ? "Tambah Notulensi" : "Tambah Foto Galeri"}</h2>

        {/* Pesan Error */}
        {error && (
          <div className="text-red-500 text-sm mb-4">
            <p>{error}</p>
          </div>
        )}

        {activeTab === "notulensiMateri" && (
          <>
            <div className="mb-4">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Upload File Notulensi
              </label>
              <input type="file" id="file" onChange={handleFileChange} className="mt-1 block w-full border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">
                Catatan
              </label>
              <textarea id="catatan" rows="4" value={catatan} onChange={handleCatatanChange} className="mt-1 block w-full border-gray-300 rounded-md"></textarea>
            </div>
          </>
        )}

        {activeTab === "galeriFoto" && (
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload Foto
            </label>
            <input type="file" id="file" onChange={handleFileChange} className="mt-1 block w-full border-gray-300 rounded-md" />
          </div>
        )}

        <div className="mt-4 flex justify-end gap-4">
          <button onClick={() => onClose(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
            Batal
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;
