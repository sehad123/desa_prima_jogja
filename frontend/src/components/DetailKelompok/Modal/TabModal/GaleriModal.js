import React, { useState } from "react";
import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import axios from "axios";

const FormGaleri = ({ isOpen, onClose, selectedDesa }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); // Reset error setiap kali submit

    setSubmitted(true);

    if (!selectedDesa || !selectedDesa.id) {
      setError("Desa tidak ditemukan. Pastikan desa dipilih dengan benar.");
      return;
    }

    const formData = new FormData();

      if (!file) {
        setError("Harap unggah foto.");
        return;
      }

      formData.append("gambar", file);

      try {
        await axios.post(
          `http://localhost:5000/api/desa/${selectedDesa.id}/galeri`,
          formData
        );
        toast.success(`Berhasil menambahkan foto`);
        onClose(true); // Berikan sinyal sukses
        
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error(`Gagal mengunggah foto, coba lagi`);
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
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <h2 className="text-xl font-semibold mb-4">Tambah Foto Galeri</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-900"
              >
                Upload Galeri
              </label>
              <label
                className={`block text-xs ${
                  submitted && !file ? "text-red-600" : "text-gray-900"
                }`}
              >
                Unggah gambar dengan format .jpg, .png, dan .jpeg
              </label>
              <input
                type="file"
                id="file"
                accept="image/jpeg, image/png, image/jpg, image/webp"
                onChange={handleFileChange}
                className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                  submitted && !file 
                    ? "ring-2 ring-inset ring-red-600"
                    : "ring-1 ring-inset ring-gray-300"
                }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
              />
            </div>
            
            {preview && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview Gambar
                </label>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-48 w-full object-cover rounded"
                />
              </div>
            )}
            
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
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <Audio height={20} width={20} color="white" />
                ) : (
                  "Tambah Foto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  );
};

FormGaleri.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  desaId: PropTypes.string.isRequired
};

export default FormGaleri;