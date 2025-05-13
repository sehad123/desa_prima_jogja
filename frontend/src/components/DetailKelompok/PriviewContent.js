import React from "react";
import { formatTanggal, formatRupiah } from "../utils/format";

const PreviewContent = ({ selectedTab, selectedItem, onEdit, onDelete, onDownload }) => {
  if (!selectedItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">Tidak ada item yang dipilih</p>
        <p className="text-gray-400 text-sm mt-1">Pilih item untuk melihat preview</p>
      </div>
    );
  }

  const renderContent = () => {
    const renderDetailRow = (label, value) => (
      <div className="flex items-start py-2 border-b border-gray-100 last:border-0">
        <p className="text-gray-600 font-medium w-1/3">{label}</p>
        <p className="text-gray-800 flex-1">{value || "-"}</p>
      </div>
    );

    switch (selectedTab) {
      case "Produk":
        return (
          <div className="p-6">
            <div className="bg-white  overflow-hidden">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Detail Produk</h3>

              {renderDetailRow("Nama Produk", selectedItem.nama)}
              {renderDetailRow("Harga", `${formatRupiah(selectedItem.harga_awal)} - ${formatRupiah(selectedItem.harga_akhir)}`)}
              {renderDetailRow("Pelaku Usaha", selectedItem.pelaku_usaha)}
              {renderDetailRow("Nomor HP", selectedItem.nohp)}
              {renderDetailRow("Deskripsi", selectedItem.deskripsi)}

              <div className="rounded-lg p-4 my-6">
                <div className="bg-white rounded-md overflow-hidden shadow-inner max-w-xs mx-auto">
                  <img
                    src={`http://localhost:5000${selectedItem.foto}`}
                    alt={selectedItem.nama}
                    className="w-full h-auto max-h-180 object-contain" // max-h-48 membatasi tinggi maksimal
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500x300?text=Gambar+Tidak+Tersedia";
                    }}
                  />
                </div>
              </div>

              {/* <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(selectedItem, "produk")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(selectedItem, "produk")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div> */}
            </div>
          </div>
        );
      case "Kas":
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Detail Transaksi Kas</h3>

                {renderDetailRow("Tanggal Transaksi", formatTanggal(selectedItem.tgl_transaksi))}
                {renderDetailRow("Jenis Transaksi", selectedItem.jenis_transaksi)}
                {renderDetailRow("Nama Transaksi", selectedItem.nama_transaksi)}
                {renderDetailRow("Total Transaksi", formatRupiah(selectedItem.total_transaksi))}
              </div>
            </div>
          </div>
        );

      case "Galeri":
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Preview Galeri</h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="aspect-w-16 aspect-h-9 bg-white rounded-md overflow-hidden shadow-inner">
                    <img
                      src={`http://localhost:5000${selectedItem.gambar}`}
                      alt="Galeri"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x500?text=Gambar+Tidak+Tersedia";
                      }}
                    />
                  </div>
                </div>

                <div className="text-center text-gray-500 mb-6">Diunggah pada {formatTanggal(selectedItem.createdAt)}</div>

                {/* <div className="flex justify-center space-x-3">
                  <button
                    onClick={onDownload}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => onDelete(selectedItem, "galeri")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        );

      case "Notulensi / Materi":
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Preview Dokumen</h3>

              <div className="bg-gray-50 rounded-lg mb-6 h-[500px]">
                <iframe src={`http://localhost:5000/uploads/${selectedItem.file}`} className="w-full h-full border-0 rounded-md" title="Notulensi Preview" />
              </div>

              <div className="flex flex-col space-y-2 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">Diunggah pada {formatTanggal(selectedItem.createdAt)}</span>
                </div>
              </div>

              {/* <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => window.open(`http://localhost:5000/uploads/${selectedItem.file}`, "_blank")}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => onDelete(selectedItem, "notulensi")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div> */}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full py-10">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Format konten tidak dikenali</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default PreviewContent;
