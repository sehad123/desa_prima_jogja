import React, { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, onSubmit, initialData, entityType }) => {
  const [formData, setFormData] = useState({});
  const isProduct = entityType === "produk";

  useEffect(() => {
    console.log("Initial Data:", initialData); // Debug initial data
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debug data form
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit {isProduct ? "Produk Desa" : "Pengurus Desa"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Common Fields */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input type="text" id="nama" name="nama" value={formData.nama || ""} onChange={handleChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" required />
          </div>

          {isProduct ? (
            <>
              {/* Product Specific Fields */}
              <div>
                <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                  Harga
                </label>
                <input type="number" id="harga" name="harga" value={formData.harga || ""} onChange={handleChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" required />
              </div>

              <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi || ""} onChange={handleChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" required />
              </div>

              <div>
                <label htmlFor="foto" className="block text-sm font-medium text-gray-700">
                  Foto Produk
                </label>
                <input type="file" id="foto" name="foto" onChange={(e) => setFormData((prev) => ({ ...prev, foto: e.target.files[0] }))} className="mt-1 block w-full border border-black rounded-md px-3 py-2" />
              </div>
            </>
          ) : (
            <>
              {/* Pengurus Specific Fields */}
              <div>
                <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700">
                  Jabatan
                </label>
                <input type="text" id="jabatan" name="jabatan" value={formData.jabatan || ""} onChange={handleChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" required />
              </div>

              <div>
                <label htmlFor="nohp" className="block text-sm font-medium text-gray-700">
                  No. HP
                </label>
                <input type="number" id="nohp" name="nohp" value={formData.nohp || ""} onChange={handleChange} className="mt-1 block w-full border border-black rounded-md px-3 py-2" required />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
