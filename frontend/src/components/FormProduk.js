import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import { Audio } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const FormProduk = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Ubah menjadi `false` agar modal langsung tampil
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nama_produk: "",
    harga: "",
    deskripsi: "",
    foto_produk: null, // Untuk menampung file foto produk
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      foto_produk: e.target.files[0], // Menyimpan file foto produk
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.nama_produk || !formData.harga || !formData.deskripsi || !formData.foto_produk) {
      return; // Jangan kirim jika ada isian kosong
    }

    setLoading(true);
    try {
      // Simulasi pengiriman data
      console.log("Data yang dikirim:", formData);
      setLoading(false);
      onClose(); // Tutup modal setelah berhasil
    } catch (err) {
      setError("Gagal menyimpan data");
      setLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center text-left z-50 p-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-auto relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nama_produk" className="block text-sm font-medium text-gray-900">
                  Nama Produk
                </label>
                <input
                  id="nama_produk"
                  name="nama_produk"
                  type="text"
                  value={formData.nama_produk}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-2 px-3 mt-1 text-gray-900 shadow-sm ${
                    submitted && !formData.nama_produk ? "ring-2 ring-red-600" : "ring-1 ring-gray-300"
                  } placeholder:text-gray-400 focus:ring focus:ring-blue-600 sm:text-sm`}
                  placeholder="Masukkan nama produk"
                />
              </div>

              <div>
                <label htmlFor="harga" className="block text-sm font-medium text-gray-900">
                  Harga
                </label>
                <input
                  id="harga"
                  name="harga"
                  type="number"
                  value={formData.harga}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-2 px-3 mt-1 text-gray-900 shadow-sm ${
                    submitted && !formData.harga ? "ring-2 ring-red-600" : "ring-1 ring-gray-300"
                  } placeholder:text-gray-400 focus:ring focus:ring-blue-600 sm:text-sm`}
                  placeholder="Masukkan harga"
                />
              </div>

              <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-900">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-2 px-3 mt-1 text-gray-900 shadow-sm ${
                    submitted && !formData.deskripsi ? "ring-2 ring-red-600" : "ring-1 ring-gray-300"
                  } placeholder:text-gray-400 focus:ring focus:ring-blue-600 sm:text-sm`}
                  placeholder="Masukkan deskripsi produk"
                ></textarea>
              </div>

              <div>
                <label htmlFor="foto_produk" className="block text-sm font-medium text-gray-900">
                  Foto Produk
                </label>
                <input
                  id="foto_produk"
                  name="foto_produk"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`block w-full rounded-md border-0 py-2 px-3 mt-1 text-gray-900 shadow-sm ${
                    submitted && !formData.foto_produk ? "ring-2 ring-red-600" : "ring-1 ring-gray-300"
                  } placeholder:text-gray-400 focus:ring focus:ring-blue-600 sm:text-sm`}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Transition>
  );
};

export default FormProduk;
