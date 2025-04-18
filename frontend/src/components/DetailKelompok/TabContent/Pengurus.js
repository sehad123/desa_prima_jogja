import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const Pengurus = ({ pengurus,  onAdd, 
  onDelete, 
  onEdit,
  desa }) => {
  return (
    <>
      <div className="flex flex-wrap justify-center md:justify-start p-4">
        <button
          onClick={() => onAdd("pengurus", desa)}
          className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-purple-400 flex items-center gap-2"
        >
          <faPlus /> Tambah Pengurus
        </button>
      </div>

      <div className="w-full p-2 pt-1 overflow-x-auto">
              {/* Check if mobile */}
              {window.innerWidth < 768 ? (
                // Kode untuk tampilan mobile
                <div className="block md:hidden">
                  {pengurus.map((item, index) => (
                    <div
                      key={item.id}
                      className="mb-4 border p-4 rounded-md bg-white shadow-md"
                    >
                      <h2 className="text-lg font-semibold mb-1">
                        {index + 1}. {item.nama}
                      </h2>
                      <div className="flex flex-col space-y-1 text-gray-700">
                        <div className="flex items-center">
                          <strong className="w-20 pl-3">Jabatan</strong>
                          <span>: {item.jabatan}</span>
                        </div>
                        <div className="flex items-center">
                          <strong className="w-20 pl-3">No HP</strong>
                          <span>: {item.nohp}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-1 justify-end">
                      <button
                                                                  className="bg-blue-500 text-white py-1 px-2 rounded-md mr-2"
                                                                  onClick={() => onEdit(item, "pengurus")}
                                                                >
                                                                  <span className="pr-2">Edit</span>
                                                                  <FontAwesomeIcon icon={faEdit} />
                                                                </button>
                                                                <button
                                                                  className="bg-red-500 text-white py-1 px-2 rounded-md"
                                                                  onClick={() => onDelete(item, "pengurus")}
                                                                >
                                                                  <span className="pr-2">Hapus</span>
                                                                  <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Kode untuk tampilan desktop
                <table className="min-w-full text-sm border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">No</th>
                      <th className="border px-2 py-1">Nama</th>
                      <th className="border px-2 py-1">Jabatan</th>
                      <th className="border px-2 py-1">No HP</th>
                      <th className="border px-2 py-1">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengurus.map((item, index) => (
                      <tr key={item.id} className="text-center">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1">{item.nama}</td>
                        <td className="border px-2 py-1">{item.jabatan}</td>
                        <td className="border px-2 py-1">{item.nohp}</td>
                        <td className="border px-2 py-1 text-center">
                          <button
                                                                  className="bg-blue-500 text-white py-1 px-2 rounded-md mr-2"
                                                                  onClick={() => onEdit(item, "pengurus")}
                                                                >
                                                                  <FontAwesomeIcon icon={faEdit} />
                                                                </button>
                                                                <button
                                                                  className="bg-red-500 text-white py-1 px-2 rounded-md"
                                                                  onClick={() => onDelete(item, "pengurus")}
                                                                >
                                                                  <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
    </>
  );
};

export default Pengurus;