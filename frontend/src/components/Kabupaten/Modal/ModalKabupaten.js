import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ModalKabupaten = ({ isOpen, onClose, selectedKabupaten }) => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    nama_kabupaten: "",
    jumlah_desa: "",
    ketua_forum: "",
  });
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedKabupaten) {
      // Saat edit, hanya isi data yang akan diedit
      setFormData({
        nama_kabupaten: selectedKabupaten.nama_kabupaten || "",
        jumlah_desa: selectedKabupaten.jumlah_desa || "",
        ketua_forum: selectedKabupaten.ketua_forum || "",
      });

    
    } else {
      // Reset form saat create
      setFormData({
        nama_kabupaten: "",
        jumlah_desa: "",
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
      // Siapkan data yang akan dikirim
      const payload = {
        nama_kabupaten: formData.nama_kabupaten,
        jumlah_desa: formData.jumlah_desa,
        ketua_forum: formData.ketua_forum
      };
  
      if (selectedKabupaten) {
        const response = await axios.put(
          `http://localhost:5000/api/kabupaten/${selectedKabupaten.id}`,
          payload
        );
        
        toast.success(`Berhasil mengubah data Kabupaten/Kota ${formData.nama_kabupaten}`);
      } else {
        await axios.post("http://localhost:5000/api/kabupaten", payload);
        toast.success("Data kabupaten berhasil ditambahkan!");
      }
  
      onClose(true);
    } catch (error) {
      console.error("Detail Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || "Terjadi kesalahan dalam proses penyimpanan data";
        
      toast.error(errorMessage);
    }
  };

  return (
      <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center text-left z-50 px-5 pt-10 pb-20">
        <div className="bg-white top-4 p-2 md:px-4 lg:px-4 md:py-3 lg:py-3 rounded-lg shadow-lg w-full max-w-md md:max-w-md lg:max-w-md max-h-screen overflow-auto relative">
          {" "}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
            {selectedKabupaten
              ? "Edit Data Kabupaten"
              : "Tambah Data Kabupaten"}
          </h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="relative">
              {/* Render hanya jumlah desa dan ketua forum */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Nama
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.nama_kabupaten === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan nama kabupaten/kota
                </label>
                <input
                  type="text"
                  name="nama_kabupaten"
                  value={formData.nama_kabupaten}
                  onChange={handleChange}
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.nama_kabupaten === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Jumlah Desa
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.jumlah_desa === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan jumlah desa
                </label>
                <input
                  type="text"
                  name="jumlah_desa"
                  value={formData.jumlah_desa}
                  onChange={handleChange}
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.jumlah_desa === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Ketua Forum
                   </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.ketua_forum === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan nama ketua forum
                </label>
                <input
                  type="text"
                  name="ketua_forum"
                  value={formData.ketua_forum}
                  onChange={handleChange}
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.ketua_forum === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                />
              </div>

              {/* Buttons */}
              <div className="mt-3 w-full flex justify-end">
                <button
                  type="button"
                  className="w-2/12 text-sm bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/12 text-sm bg-blue-200 text-blue-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Kirim
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ModalKabupaten;
