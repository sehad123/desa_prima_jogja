import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faEllipsisV,
  faDownload,
  faTrash,
  faSquare,
  faSquareCheck,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { formatTanggal, formatRupiah } from "../../utils/format";

const Notulensi = ({
  notulensi,
  onAdd,
  onDeleteMultiple,
  onDelete,
  onSelect,
  onDownload,
  onDownloadMultiple,
  selectedItems = [],
  toggleOption,
  toggleSelectItem,
  toggleSelectAll,
  visibleOptionId,
  optionsRef = { current: {} },
  desa,
}) => {
  // Handler untuk tombol silang (clear selection)
  const handleClearSelection = (e) => {
    e.stopPropagation();
    toggleSelectItem([]); // Mengosongkan selectedItems
  };

  // Handler untuk select all
  const handleSelectAll = (e) => {
    e.stopPropagation();
    toggleSelectAll(); // Memanggil fungsi toggleSelectAll dari parent
  };

  // Handler untuk delete multiple
  const handleDeleteMultiple = (e) => {
    e.stopPropagation();
    onDeleteMultiple(); // Memanggil fungsi onDelete dari parent
  };
  return (
    <div className="flex flex-wrap justify-center md:justify-start">
      {selectedItems.length > 0 && (
        <div className="flex justify-between items-center mb-1 w-full">
          <div className="flex items-center space-x-4 lg:ml-2">
            <button className="text-gray-500" onClick={handleClearSelection}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <span className="text-gray-500">
              {selectedItems.length} selected
            </span>
            <button className="text-gray-500" onClick={handleSelectAll}>
              <FontAwesomeIcon
                icon={
                  selectedItems.length === notulensi.length
                    ? faSquareCheck
                    : faSquare
                }
              />
              <span className="ml-1">Select All</span>
            </button>
            <button
              className="text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadMultiple();
              }}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>

            <button className="text-gray-500" onClick={handleDeleteMultiple}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      )}
      <button
        className="w-1/2 border border-dashed border-gray-500 h-48 lg:w-36 lg:h-48 lg:mr-2 mt-2 p-2 flex flex-col justify-center items-center cursor-pointer"
        onClick={() => onAdd("notulensi", desa)}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="w-1/2 h-1/2 lg:w-20 lg:h-20 text-gray-400"
        />
        <div className="w-full text-xs lg:text-sm text-center text-gray-500">
          Unggah Notulensi
        </div>
      </button>

      {notulensi.length === 0 && (
        <div className="w-full text-center text-gray-500 mt-3">
          Tidak ada file ditemukan
        </div>
      )}
      {notulensi.map((file) => (
        <div
          key={file.id}
          className="relative w-1/2 lg:w-40 p-2"
          onClick={() => onSelect(file)}
        >
          <div
            className={`border cursor-pointer ${
              selectedItems.some((item) => item.id === file.id)
                ? "border-secondary"
                : "border-gray-400"
            }`}
          >
            <div className="h-8 bg-gray-300 flex justify-between">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectItem(file);
                }}
              >
                <FontAwesomeIcon
                  icon={
                    selectedItems.some((item) => item.id === file.id)
                      ? faSquareCheck
                      : faSquare
                  }
                  className={`${
                    selectedItems.some((item) => item.id === file.id)
                      ? "text-secondary"
                      : "text-white"
                  } h-7 w-7 lg:h-7 lg:w-7`}
                />
              </div>

              <div className="relative z-100">
                <button
                  className="text-gray-500 pr-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(file.id);
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
                {visibleOptionId === file.id && (
                  <div
                    ref={(el) => {
                      if (optionsRef.current) {
                        optionsRef.current[file.id] = el;
                      }
                    }}
                    className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200"
                  >
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `http://localhost:5000/uploads/${file.file}`,
                          "_blank"
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="mr-2 text-gray-500"
                      />
                      Download
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file, "notulensi");
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="mr-2 text-gray-500"
                      />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            {file.catatan ? (
              <div className="h-40 border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {/* Gambar mengambil sebagian besar tinggi */}
                <div className="flex-grow bg-gray-100 flex items-center justify-center overflow-hidden">
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="text-red-500 text-5xl"
                  />
                </div>
                {/* Nama produk di bagian bawah */}
                <div className="p-1 border-t flex-shrink-0">
                  <h3 className="font-normal text-sm text-gray-800 text-center truncate">
                    {file.catatan}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-40 bg-gray-200">
                <FontAwesomeIcon
                  icon={faFilePdf}
                  className="text-red-500 text-5xl"
                />
                <div className="p-1 border-t flex-shrink-0">
                  <h3 className="font-normal text-sm text-gray-800 text-center truncate">
                    {formatTanggal(file.createdAt)}
                  </h3>
                </div>
              </div>
            )}
            {/* <p className="text-sm mt-2 font-semibold text-gray-700 truncate">{formatTanggal(file.createdAt)}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notulensi;
