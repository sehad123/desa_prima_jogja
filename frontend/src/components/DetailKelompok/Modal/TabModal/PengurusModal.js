import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import axios from "axios";

const FormPengurus = ({ isOpen, onClose, selectedDesa, initialData }) => {
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    nohp: "",
  });
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => {
        const same =
          prev.nama === initialData.nama &&
          prev.jabatan === initialData.jabatan &&
          prev.nohp === initialData.nohp;
  
        if (same) return prev;
  
        return {
          nama: initialData.nama || "",
          jabatan: initialData.jabatan || "",
          nohp: initialData.nohp || "",
        };
      });
    } else {
      setFormData({
        nama: "",
        jabatan: "",
        nohp: "",
      });
    }
  }, [initialData]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Validasi
    if (!formData.nama.trim()) {
      setError("Harap isi nama pengurus");
      return;
    }
    if (!formData.jabatan.trim()) {
      setError("Harap isi jabatan");
      return;
    }
    if (!formData.nohp.trim()) {
      setError("Harap isi nomor HP");
      return;
    }
  
    if (!/^\d+$/.test(formData.nohp.trim())) {
      setError("Nomor HP hanya boleh berisi angka");
      return;
    }
    
    setLoading(true);
    try {
      if (initialData) {
        await axios.put(
          `http://localhost:5000/api/desa/${selectedDesa.id}/pengurus/${initialData.id}`,
          formData
        );
        toast.success(`Data pengurus ${formData.nama} berhasil diperbarui!`);
      } else {
        await axios.post(
          `http://localhost:5000/api/desa/${selectedDesa.id}/pengurus`,
          formData
        );
        toast.success(`Data pengurus ${formData.nama} berhasil ditambahkan!`);
      }
      onClose(true);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Terjadi kesalahan dalam proses penyimpanan data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                    <Audio type="Bars" color="#542d48" height={80} width={80} />
                  </div>
                ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
          
          
          <button
            type="button"
            onClick={() => onClose(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Pengurus" : "Tambah Pengurus"}
          </h2>
          <div className="relative mb-2">
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-900"
            >
              Nama Pengurus
            </label>
            <label
              className={`block text-xs ${
                submitted && formData.nama === ""
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              Tuliskan nama pengurus
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama || ""}
              onChange={handleChange}
              className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                submitted && formData.nama === ""
                  ? "ring-2 ring-inset ring-red-600"
                  : "ring-1 ring-inset ring-gray-300"
              }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
            />
          </div>

          <div className="relative mb-2">
            <label
              htmlFor="jabatan"
              className="block text-sm font-medium text-gray-900"
            >
              Jabatan Pengurus
            </label>
            <label
              className={`block text-xs ${
                submitted && formData.jabatan === ""
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              Tuliskan jabatan pengurus
            </label>
            <input
              type="text"
              name="jabatan"
              id="jabatan"
              value={formData.jabatan || ""}
              onChange={handleChange}
              className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                submitted && formData.jabatan === ""
                  ? "ring-2 ring-inset ring-red-600"
                  : "ring-1 ring-inset ring-gray-300"
              }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
            />
          </div>

          <div className="relative mb-2">
            <label
              htmlFor="nohp_pengurus"
              className="block text-sm font-medium text-gray-900"
            >
              Nomor HP Pengurus
            </label>
            <label
              className={`block text-xs ${
                submitted && formData.nohp === ""
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              Tuliskan nomor HP pengurus
            </label>
            <input
              type="text"
              name="nohp"
              id="nohp_pengurus"
              value={formData.nohp || ""}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
              onChange={handleChange}
              className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                submitted && formData.nohp === ""
                  ? "ring-2 ring-inset ring-red-600"
                  : "ring-1 ring-inset ring-gray-300"
              }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-4 py-2 bg-secondary text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? (
                <Audio height={20} width={20} color="white" />
              ) : (
                "Kirim"
              )}
            </button>
          </div>
                
        </div>
    )}  
      </div>
    </Transition>
  );
};

FormPengurus.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default FormPengurus;
