import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import { Audio } from "react-loader-spinner";

const FormPengurus = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    namaPengurus: "",
    jabatan: "",
    nomorTelepon: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validasi form
    if (!formData.namaPengurus || !formData.jabatan || !formData.nomorTelepon) {
      return; // Jangan submit jika ada field yang kosong
    }

    setLoading(true);

    // Simulasi pengiriman data
    setTimeout(() => {
      console.log("Data submitted:", formData);
      setLoading(false);
      onClose(); // Tutup modal setelah berhasil
    }, 1000);
  };

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
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-auto relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Tambah Pengurus</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Nama Pengurus */}
              <div>
                <label
                  htmlFor="namaPengurus"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nama Pengurus
                </label>
                <input
                  id="namaPengurus"
                  name="namaPengurus"
                  type="text"
                  value={formData.namaPengurus}
                  onChange={handleChange}
                  className={`block w-full rounded-md border px-2 py-1 mt-1 shadow-sm ${
                    submitted && !formData.namaPengurus
                      ? "border-red-600"
                      : "border-gray-300"
                  }`}
                />
                {submitted && !formData.namaPengurus && (
                  <p className="text-red-600 text-xs mt-1">
                    Nama pengurus wajib diisi
                  </p>
                )}
              </div>

              {/* Jabatan */}
              <div>
                <label
                  htmlFor="jabatan"
                  className="block text-sm font-medium text-gray-900"
                >
                  Jabatan
                </label>
                <input
                  id="jabatan"
                  name="jabatan"
                  type="text"
                  value={formData.jabatan}
                  onChange={handleChange}
                  className={`block w-full rounded-md border px-2 py-1 mt-1 shadow-sm ${
                    submitted && !formData.jabatan
                      ? "border-red-600"
                      : "border-gray-300"
                  }`}
                />
                {submitted && !formData.jabatan && (
                  <p className="text-red-600 text-xs mt-1">Jabatan wajib diisi</p>
                )}
              </div>

              {/* Nomor Telepon */}
              <div>
                <label
                  htmlFor="nomorTelepon"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nomor Telepon
                </label>
                <input
                  id="nomorTelepon"
                  name="nomorTelepon"
                  type="text"
                  value={formData.nomorTelepon}
                  onChange={handleChange}
                  className={`block w-full rounded-md border px-2 py-1 mt-1 shadow-sm ${
                    submitted && !formData.nomorTelepon
                      ? "border-red-600"
                      : "border-gray-300"
                  }`}
                />
                {submitted && !formData.nomorTelepon && (
                  <p className="text-red-600 text-xs mt-1">
                    Nomor telepon wajib diisi
                  </p>
                )}
              </div>

              {/* Tombol */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 py-1 px-4 rounded-md hover:bg-gray-400"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700"
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

export default FormPengurus;
