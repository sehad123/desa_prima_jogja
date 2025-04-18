import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import axios from "axios";

const FormProduk = ({ 
  isOpen, onClose, selectedDesa, initialData            
}) => {
  const [formData, setFormData] = useState({
    nama: "",
    harga_awal: "",
    harga_akhir: "",
    pelaku_usaha: "",
    nohp: "",
    deskripsi: "",
    foto: null
  });
   const [loading, setLoading] = useState(false);
    const isEdit = !!initialData;
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({
      harga_akhir: ""
    });

    useEffect(() => {
      if (initialData) {
        setFormData({
          id: initialData.id,
          nama: initialData.nama || "",
          harga_awal: initialData.harga_awal || "",
          harga_akhir: initialData.harga_akhir || "",
          pelaku_usaha: initialData.pelaku_usaha || "",
          nohp: initialData.nohp || "",
          deskripsi: initialData.deskripsi || "",
          foto: initialData.fotoUrl ? initialData.fotoUrl : null // Jika edit, gunakan URL foto yang ada
        });
      }
    }, [initialData]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(e.target.files[0].type)) {
          setError('Hanya format JPG, PNG yang diperbolehkan');
          return;
        }
        setFormData(prev => ({ ...prev, foto: e.target.files[0] }));
      }
    };

    const handleBlur = (e) => {
      if (e.target.name === 'harga_akhir' && formData.harga_akhir && formData.harga_awal) {
        if (Number(formData.harga_akhir) <= Number(formData.harga_awal)) {
          setValidationErrors({
            harga_akhir: "Harga akhir harus lebih besar dari harga awal"
          });
        } else {
          setValidationErrors({ harga_akhir: "" });
        }
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitted(true);

      // Reset validation errors
  setValidationErrors({ harga_akhir: "" });
  
  // Validasi harga akhir harus lebih besar dari harga awal jika diisi
  if (formData.harga_akhir && Number(formData.harga_akhir) <= Number(formData.harga_awal)) {
    setValidationErrors({
      harga_akhir: "Harga akhir harus lebih besar dari harga awal"
    });
    return;
  }
      
      if (!formData.nama || !formData.harga_awal || !formData.deskripsi) {
        setError("Harap isi semua field yang wajib diisi");
        return;
      }
  
      setLoading(true);
      try {
        const dataToSend = new FormData();
        dataToSend.append('nama', formData.nama);
        dataToSend.append('harga_awal', formData.harga_awal);
        dataToSend.append('harga_akhir', formData.harga_akhir || '');
        dataToSend.append('pelaku_usaha', formData.pelaku_usaha || '');
        dataToSend.append('nohp', formData.nohp || '');
        dataToSend.append('deskripsi', formData.deskripsi);
        
        // Jika ada file baru atau edit mode tanpa file yang ada
        if (formData.foto instanceof File) {
          dataToSend.append('foto', formData.foto);
        } else if (isEdit && typeof formData.foto === 'string') {
          // Jika edit dan foto adalah string (URL), kirim sebagai string
          dataToSend.append('fotoUrl', formData.foto);
        }
  
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
  
        if (isEdit) {
          await axios.put(
            `http://localhost:5000/api/desa/${selectedDesa.id}/produk/${initialData.id}`,
            dataToSend,
            config
          );
          toast.success(`Data produk ${formData.nama} berhasil diperbarui!`);
        } else {
          await axios.post(
            `http://localhost:5000/api/desa/${selectedDesa.id}/produk`,
            dataToSend,
            config
          );
          toast.success(`Data produk ${formData.nama} berhasil ditambahkan!`);
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
                <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative max-h-[83vh] overflow-y-auto">
                  
                  
                  <button
                    type="button"
                    onClick={() => onClose(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
        
                  <h2 className="text-xl font-semibold mb-4">
                    {isEdit ? "Edit Produk" : "Tambah Produk"}
                  </h2>
        
        <div className="relative mb-2">
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nama Produk
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.nama === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan nama produk
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
              <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-900">
                      Rentang Harga Awal
                    </label>
                    <label
                      className={`block text-xs ${
                        submitted && formData.harga_awal === ""
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Tuliskan harga minimum
                    </label>
                    <input
                      id="harga_awal"
                      name="harga_awal"
                      type="number"
                      value={formData.harga_awal || ""}
                      onChange={handleChange}
                      className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && formData.harga_awal === ""
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-900">
                      Rentang Harga Akhir
                    </label>
                    <label
                      className={`block text-xs ${
                        submitted && formData.harga_akhir === ""
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Tuliskan harga maksimum
                    </label>
                    <input
    id="harga_akhir"
    name="harga_akhir"
    type="number"
    onBlur={handleBlur}
    value={formData.harga_akhir || ""}
    onChange={handleChange}
    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
      submitted && formData.harga_akhir === "" || validationErrors.harga_akhir
        ? "ring-2 ring-inset ring-red-600"
        : "ring-1 ring-inset ring-gray-300"
    } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
  />
  {validationErrors.harga_akhir && (
    <p className="mt-1 text-sm text-red-600">{validationErrors.harga_akhir}</p>
  )}
                  </div>
                </div>

                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <label
                      htmlFor="pelaku_usaha"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Nama Pelaku Usaha
                    </label>
                    <label
                      className={`block text-xs ${
                        submitted && formData.pelaku_usaha === ""
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Tuliskan nama pelaku usaha
                    </label>
                    <input
                      type="text"
                      id="pelaku_usaha"
                      name="pelaku_usaha"
                      value={formData.pelaku_usaha || ""}
                      onChange={handleChange}
                      className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && formData.pelaku_usaha === ""
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="nohp"
                      className="block text-sm font-medium text-gray-900"
                    >
                      No HP Pelaku Usaha
                    </label>
                    <label
                      className={`block text-xs ${
                        submitted && formData.noHppelaku_usaha === ""
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Tuliskan nomor HP pelaku usaha
                    </label>
                    <input
                      type="text"
                      id="nohp"
                      name="nohp"
                      value={formData.nohp || ""}
                      onChange={handleChange}
                      className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && formData.nohp === ""
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                    />
                  </div>
                </div>

                <div className="relative mb-2">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Upload Gambar Produk
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && !formData.foto
                        ? "text-red-600"
                        : "text-gray-900"
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
                      submitted && !formData.foto 
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                  {/* Preview Foto */}
                  {formData.foto && (
  <div className="mt-2 flex items-center gap-2">
    {formData.foto instanceof File ? (
      <>
        <img 
          src={URL.createObjectURL(formData.foto)} 
          alt="Preview" 
          className="h-20 w-20 object-cover rounded"
        />
        <button
          type="button"
          onClick={() => setFormData(prev => ({...prev, foto: null}))}
          className="text-red-500 text-sm"
        >
          Hapus
        </button>
      </>
    ) : (
      <>
        <img 
          src={formData.foto} 
          alt="Current" 
          className="h-20 w-20 object-cover rounded"
        />
        <span className="text-sm text-gray-500">Foto saat ini</span>
      </>
    )}
  </div>
)}
                </div>

                <div className="relative mb-2">
                  <label
                    htmlFor="deskripsi"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Deskripsi
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.deskripsi === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan deskripsi produk
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    rows="3"
                    value={formData.deskripsi || ""}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.deskripsi === ""
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

export default FormProduk;