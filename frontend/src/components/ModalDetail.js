import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ModalDetail = ({ onClose, selectedDesa, activeTab }) => {
  const [file, setFile] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [namaPengurus, setNamaPengurus] = useState("");
  const [harga, setHarga] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [nohp, setNohp] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [error, setError] = useState(""); // Untuk menyimpan pesan error

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNamaProdukChange = (e) => {
    setNamaProduk(e.target.value);
  };
  const handleNamaPengurusChange = (e) => {
    setNamaPengurus(e.target.value);
  };
  const handleHargaChange = (e) => {
    setHarga(e.target.value);
  };
  const handleJabatanChange = (e) => {
    setJabatan(e.target.value);
  };
  const handleNohpChange = (e) => {
    setNohp(e.target.value);
  };

  const handleDeskripsiChange = (e) => {
    setDeskripsi(e.target.value);
  };

  const handleCatatanChange = (e) => {
    setCatatan(e.target.value);
  };

  const handleSubmit = async () => {
    setError(""); // Reset error setiap kali submit

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
    } else if (activeTab === "uraianProduk") {
      if (!file) {
        setError("Harap unggah foto.");
        return;
      }
      formData.append("nama", namaProduk);
      formData.append("harga", harga);
      formData.append("deskripsi", deskripsi);
      formData.append("foto", file);

      try {
        await axios.post(`http://localhost:5000/api/desa/${selectedDesa.id}/produk`, formData);
        toast.success("Produk berhasil ditambahkan", { position: "top-right" });
        onClose(true); // Berikan sinyal sukses
      } catch (error) {
        console.error("Error uploading photo:", error);
        setError("Gagal mengunggah foto. Coba lagi.");
      }
    } else if (activeTab === "pengurusDesa") {
      // if (!file) {
      //   setError("Harap unggah foto.");
      //   return;
      // }
      formData.append("nama", namaPengurus);
      formData.append("nohp", nohp);
      formData.append("jabatan", jabatan);
      formData.append("foto", file);

      try {
        await axios.post(`http://localhost:5000/api/desa/${selectedDesa.id}/pengurus`, formData);
        toast.success("pengurus berhasil ditambahkan", { position: "top-right" });
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
  const tabTitles = {
    notulensiMateri: "Tambah Notulensi",
    galeriFoto: "Tambah Foto Galeri",
    uraianProduk: "Tambah Produk",
    pengurusDesa: "Tambah Pengurus Desa",
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{tabTitles[activeTab] || "Tambah Data"}</h2>

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
              <textarea id="catatan" rows="4" value={catatan} onChange={handleCatatanChange} className="mt-1 block w-full border border-gray-700 rounded-lg"></textarea>
            </div>
          </>
        )}

        {activeTab === "uraianProduk" && (
          <>
            <div className="mb-4">
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                Nama Produk
              </label>
              <input type="text" id="nama" onChange={handleNamaProdukChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                Harga Produk
              </label>
              <input type="number" id="harga" onChange={handleHargaChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Upload Gambar Produk
              </label>
              <input type="file" id="file" onChange={handleFileChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea id="deskripsi" rows="4" value={deskripsi} onChange={handleDeskripsiChange} className="mt-1 block w-full border border-gray-700 rounded-lg"></textarea>
            </div>
          </>
        )}

        {activeTab === "pengurusDesa" && (
          <>
            <div className="mb-4">
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                Nama Pengurus
              </label>
              <input type="text" id="nama" onChange={handleNamaPengurusChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                Nomer Handphone
              </label>
              <input type="number" id="harga" onChange={handleNohpChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
            </div>

            <div className="mb-4">
              <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700">
                Jabatan
              </label>
              <input type="text" id="jabatan" onChange={handleJabatanChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
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
