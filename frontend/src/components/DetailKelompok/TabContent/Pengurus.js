import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faUserTie } from "@fortawesome/free-solid-svg-icons";

const Pengurus = ({ pengurus, onAdd, onDelete, onEdit, desa, profil }) => {
  const isKetuaForum = profil?.role === "Ketua Forum";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-purple-400 text-2xl" />
          Daftar Anggota
        </h2>
        {isKetuaForum && (
          <button onClick={() => onAdd("pengurus", desa)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 shadow-md">
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
            <span className="text-sm">Tambah</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {pengurus.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada data pengurus</div>
          ) : (
            pengurus.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {index + 1}. {item.nama}
                    </h3>
                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium w-20">Jabatan</span>
                        <span>: {item.jabatan}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium w-20">No HP</span>
                        <span>: {item.nohp}</span>
                      </div>
                    </div>
                  </div>

                  {isKetuaForum && (
                    <div className="relative">
                      {/* Dropdown Trigger */}
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Tambahkan logika untuk toggle dropdown di sini
                          const dropdown = e.currentTarget.nextElementSibling;
                          dropdown.classList.toggle("hidden");
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="hidden absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item, "pengurus");
                              // Sembunyikan dropdown setelah klik
                              e.currentTarget.closest(".relative").querySelector("div.hidden").classList.add("hidden");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item, "pengurus");
                              // Sembunyikan dropdown setelah klik
                              e.currentTarget.closest(".relative").querySelector("div.hidden").classList.add("hidden");
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
          {pengurus.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada data pengurus</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No HP</th>
                  {isKetuaForum && <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {pengurus.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jabatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nohp}</td>
                    {isKetuaForum && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => onEdit(item, "pengurus")} className="text-blue-600 hover:text-blue-900 py-2 rounded-full hover:bg-purple-100 transition-colors" title="Edit">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={() => onDelete(item, "pengurus")} className="text-red-600 hover:text-red-900 py-2 rounded-full hover:bg-red-100 transition-colors" title="Hapus">
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

export default Pengurus;
