import React, { useState } from "react";
import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import axios from "axios";

const FormNotulensi = ({ isOpen, onClose, selectedDesa }) => {
  const [file, setFile] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCatatanChange = (e) => {
    setCatatan(e.target.value);
  };

  const handleSubmit = async (e) => {
    // Tambahkan parameter event
    e.preventDefault(); // Prevent default form submission

    setError("");
    setSubmitted(true);

    // Validasi
    if (!file) {
      setError("Harap unggah file");
      return;
    }

    if (!catatan) {
      setError("Harap masukkan catatan.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("catatan", catatan);

      await axios.post(
        `http://localhost:5000/api/desa/${selectedDesa.id}/notulensi`,
        formData
      );

      toast.success(`Berhasil menambahkan data Notulensi`);

      // Reset form
      setFile(null);
      setCatatan("");
      onClose(true);
    } catch (error) {
      console.error("Error uploading notulensi:", error);
      toast.error(`Gagal menambahkan data Notulensi`);
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
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Tambah Notulensi</h2>

          <form>
            <div className="mb-4">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-900"
              >
                Upload File Notulensi
              </label>
              <label
                className={`block text-xs ${
                  submitted && !file ? "text-red-600" : "text-gray-900"
                }`}
              >
                Unggah file dengan format .pdf
              </label>
              
              <input
                type="file"
                id="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                  submitted && !file
                    ? "ring-2 ring-inset ring-red-600"
                    : "ring-1 ring-inset ring-gray-300"
                }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="catatan"
                className="block text-sm font-medium text-gray-900"
              >
                Catatan
              </label>
              <label
                className={`block text-xs ${
                  submitted && catatan === "" ? "text-red-600" : "text-gray-900"
                }`}
              >
                Tuliskan catatan notulensi
              </label>
              <textarea
                type="text"
                id="catatan"
                rows="4"
                value={catatan}
                onChange={handleCatatanChange}
                className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                  submitted && catatan === ""
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
                  "Tambah Notulensi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  );
};

FormNotulensi.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedDesa: PropTypes.string.isRequired,
};

export default FormNotulensi;
