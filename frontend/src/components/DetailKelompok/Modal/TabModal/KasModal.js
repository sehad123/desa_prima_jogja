import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import axios from "axios";

const FormKasModal = ({ isOpen, onClose, selectedDesa, initialData }) => {
  const [formData, setFormData] = useState({
    jenis_transaksi: "",
    nama_transaksi: "",
    total_transaksi: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialData);

  // Reset form saat initialData atau modal dibuka
  useEffect(() => {
    if (initialData) {
      setFormData({
        jenis_transaksi: initialData.jenis_transaksi || "",
        nama_transaksi: initialData.nama_transaksi || "",
        total_transaksi: initialData.total_transaksi || "",
      });
    } else {
      setFormData({
        tgl_transaksi: new Date().toISOString().split("T")[0], // Tanggal hari ini untuk tambah data
        jenis_transaksi: "",
        nama_transaksi: "",
        total_transaksi: "",
      });
    }
    setError("");
    setSubmitted(false);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const { jenis_transaksi, nama_transaksi, total_transaksi } = formData;

    // Validasi untuk edit dan tambah data
    if (!jenis_transaksi || !nama_transaksi.trim() || !total_transaksi) {
      setError("Semua kolom wajib diisi dengan benar.");
      return;
    }

    if (!/^\d+$/.test(total_transaksi)) {
      setError("Total transaksi hanya boleh berisi angka.");
      return;
    }

    if (!selectedDesa || !selectedDesa.id) {
      toast.error("Data desa belum dipilih atau tidak valid.");
      return;
    }

    setLoading(true);
    try {
      const payload = isEdit ? { jenis_transaksi, nama_transaksi, total_transaksi } : { ...formData, tgl_transaksi: formData.tgl_transaksi || new Date().toISOString() };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/desa/${selectedDesa.id}/kas/${initialData.id}`, payload);
        toast.success(`Data kas ${nama_transaksi} berhasil diperbarui!`);
      } else {
        await axios.post(`http://localhost:5000/api/desa/${selectedDesa.id}/kas`, payload);
        toast.success(`Data kas ${nama_transaksi} berhasil ditambahkan!`);
      }
      onClose(true);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan dalam proses penyimpanan data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Transition show={isOpen} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <button onClick={() => onClose(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit Data Kas" : "Tambah Data Kas"}</h2>

          <form onSubmit={handleSubmit}>
            {/* Hanya tampilkan tanggal untuk tambah data */}
            {!isEdit && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Tanggal Transaksi</label>
                <input
                  type="date"
                  name="tgl_transaksi"
                  value={formData.tgl_transaksi}
                  onChange={handleChange}
                  className={`block w-full mt-1 rounded-md border-gray-300 shadow-sm ${submitted && !formData.tgl_transaksi ? "ring-2 ring-red-500" : ""}`}
                  required={!isEdit}
                />
              </div>
            )}

            {/* Jenis Transaksi */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Jenis Transaksi</label>
              <select
                name="jenis_transaksi"
                value={formData.jenis_transaksi}
                onChange={handleChange}
                className={`block w-full mt-1 rounded-md border-gray-300 shadow-sm ${submitted && !formData.jenis_transaksi ? "ring-2 ring-red-500" : ""}`}
                required
              >
                <option value="">-- Pilih Jenis --</option>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>

            {/* Nama Transaksi */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Nama Transaksi</label>
              <input
                type="text"
                name="nama_transaksi"
                value={formData.nama_transaksi}
                onChange={handleChange}
                className={`block w-full mt-1 rounded-md border-gray-300 shadow-sm ${submitted && !formData.nama_transaksi ? "ring-2 ring-red-500" : ""}`}
                required
              />
            </div>

            {/* Total Transaksi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Total Transaksi</label>
              <input
                type="number"
                name="total_transaksi"
                value={formData.total_transaksi}
                onChange={handleChange}
                className={`block w-full mt-1 rounded-md border-gray-300 shadow-sm ${submitted && !formData.total_transaksi ? "ring-2 ring-red-500" : ""}`}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => onClose(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Batal
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center">
                {loading ? <Audio height={20} width={20} color="white" /> : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  );
};

FormKasModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDesa: PropTypes.object,
  initialData: PropTypes.object,
};

export default FormKasModal;
