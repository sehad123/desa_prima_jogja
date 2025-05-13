import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const KasDesa = ({ kas, onAdd, onDelete, onEdit, desa, profil }) => {
  const isKetuaForum = profil?.role === "Ketua Forum";
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Fungsi untuk menentukan warna berdasarkan jenis transaksi
  const getAmountColor = (jenis) => {
    return jenis === "Pemasukan" ? "text-green-600" : "text-red-600";
  };

  // Format angka dengan pemisah ribuan
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="text-purple-400 text-2xl" />
          Daftar Kas Desa
        </h2>
        {isKetuaForum && (
          <button onClick={() => onAdd("kas", desa)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 shadow-md">
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
            <span className="text-sm">Tambah</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {kas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada data kas desa</div>
          ) : (
            kas.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {index + 1}. {item.nama_transaksi}
                    </h3>
                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium w-20">Tanggal</span>
                        <span>: {new Date(item.tgl_transaksi).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium w-20">Jenis</span>
                        <span>: {item.jenis_transaksi}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium w-20">Total</span>
                        <span className={`${getAmountColor(item.jenis_transaksi)} font-semibold`}>: Rp {formatCurrency(item.total_transaksi)}</span>
                      </div>
                    </div>
                  </div>

                  {isKetuaForum && (
                    <div className="relative z-10">
                      {/* Toggle Dropdown */}
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div className={`${openDropdownId === item.id ? "block" : "hidden"} absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200`}>
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item, "kas");
                              setOpenDropdownId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item, "kas");
                              setOpenDropdownId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          {kas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada data kas desa</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Transaksi</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  {isKetuaForum && <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {kas.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.nama_transaksi}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.jenis_transaksi}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.tgl_transaksi).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${getAmountColor(item.jenis_transaksi)}`}>Rp{formatCurrency(item.total_transaksi)}</td>
                    {isKetuaForum && (
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => onEdit(item, "kas")} className="text-blue-600 hover:text-blue-900 py-1 px-2 rounded hover:bg-blue-100 transition-colors">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={() => onDelete(item, "kas")} className="text-red-600 hover:text-red-900 py-1 px-2 rounded hover:bg-red-100 transition-colors">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default KasDesa;
