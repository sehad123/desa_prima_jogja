import React from "react";
import { formatTanggal, formatRupiah } from "../utils/format";

const PreviewContent = ({ selectedTab, selectedItem, onEdit, onDelete, onDownload }) => {
  if (!selectedItem) {
    return (
      <p className="text-gray-500 text-center mt-5">
        TIdak ada file yang dipilih untuk preview
      </p>
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case "Produk":
        return (
          <div className="p-3">
            <h3 className="text-lg font-semibold text-center">
              Preview Produk
            </h3>
            <div className="hidden lg:flex my-4 space-x-4 lg:space-x-40">
              <div className="space-y-2 w-[100%]">
                <div className="flex items-start">
                  <p className="text-gray-600 flex-shrink-0 w-1/3">
                    <strong>Nama Produk</strong>
                  </p>
                  <p>:</p>
                  <p className="text-gray-600 ml-2">{selectedItem.nama}</p>
                </div>

                <div className="flex items-start">
                  <p className="text-gray-600 flex-shrink-0 w-1/3">
                    <strong>Harga</strong>
                  </p>
                  <p>:</p>
                  <p className="text-gray-600 ml-2">
                    {formatRupiah(selectedItem.hargaAwal)} -{" "}
                    {formatRupiah(selectedItem.hargaAkhir)}
                  </p>
                </div>

                <div className="flex items-start">
                  <p className="text-gray-600 flex-shrink-0 w-1/3">
                    <strong>Nama Pelaku Usaha</strong>
                  </p>
                  <p>:</p>
                  <p className="text-gray-600 ml-2">
                    {selectedItem.pelakuUsaha}
                  </p>
                </div>

                <div className="flex items-start">
                  <p className="text-gray-600 flex-shrink-0 w-1/3">
                    <strong>Nomor Pelaku Usaha</strong>
                  </p>
                  <p>:</p>
                  <p className="text-gray-600 ml-2">{selectedItem.nohp}</p>
                </div>

                <div className="flex items-start">
                  <p className="text-gray-600 flex-shrink-0 w-1/3">
                    <strong>Deskripsi</strong>
                  </p>
                  <p>:</p>
                  <p className="text-gray-600 ml-2">{selectedItem.deskripsi}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col items-center w-full h-[400px] bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={`http://localhost:5000${selectedItem.foto}`}
                  alt="Produk"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => onEdit(selectedItem, "produk")}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                onClick={() => onDelete(selectedItem, "produk")}
              >
                Hapus
              </button>
            </div>
          </div>
        );
      case "Galeri":
        return (
          <div className="p-3 flex justify-center">
            <div className="text-center w-full">
              <h3 className="text-lg font-semibold mb-4">Preview Galeri</h3>
              <div className="flex justify-center items-center w-full h-[500px] bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={`http://localhost:5000${selectedItem.gambar}`}
                  alt="Galeri"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="mt-4">
                Diunggah {formatTanggal(selectedItem.createdAt)}
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={onDownload}
                >
                  Download
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={() => onDelete(selectedItem, "galeri")}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        );
      case "Notulensi / Materi":
        return (
          <div className="p-3">
            <h3 className="text-lg font-semibold text-center">
              Preview Notulensi
            </h3>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center items-center w-full h-[500px] bg-gray-200 rounded-md mb-4 mt-6">
                <iframe
                  src={`http://localhost:5000/uploads/${selectedItem.file}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Notulensi Preview"
                />
              </div>
              <div className="flex items-center">
                <strong className="w-1/4">Diunggah pada</strong>
                <span>: {formatTanggal(selectedItem.createdAt)}</span>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() =>
                    window.open(
                      `http://localhost:5000/uploads/${selectedItem.file}`,
                      "_blank"
                    )
                  }
                >
                  Download
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={() => onDelete(selectedItem, "notulensi")}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Tidak ada file yang dipilih</p>;
    }
  };

  return (
    <>
      {renderContent()}
      </>
  );
};

export default PreviewContent;
