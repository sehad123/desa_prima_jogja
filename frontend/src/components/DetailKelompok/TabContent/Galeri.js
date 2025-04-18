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
  faPhotoFilm
} from "@fortawesome/free-solid-svg-icons";

const Galeri = ({ 
  galeri, 
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
  desa
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
      {/* Checkbox Select All */}
      {selectedItems.length > 0 && (
        <div className="flex justify-between items-center mb-1 w-full">
          <div className="flex items-center space-x-4 lg:ml-2">
            <button
              className="text-gray-500"
              onClick={handleClearSelection}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <span className="text-gray-500">
              {selectedItems.length} selected
            </span>
            <button
              className="text-gray-500"
              onClick={handleSelectAll}
            >
              <FontAwesomeIcon
                icon={
                  selectedItems.length === galeri.length
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

            <button
              className="text-gray-500"
              onClick={handleDeleteMultiple}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      )}

      {/* Tombol Unggah */}
      <button
        className="w-1/2 border border-dashed border-gray-500 h-48 lg:w-36 lg:h-48 lg:mr-2 mt-2 p-2 flex flex-col justify-center items-center cursor-pointer"
        onClick={() => onAdd("galeri", desa)}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="w-1/2 h-1/2 lg:w-20 lg:h-20 text-gray-400"
        />
        <div className="w-full text-xs lg:text-sm text-center text-gray-500">
          Unggah Foto
        </div>
      </button>

      {/* Pesan jika tidak ada file */}
      {galeri.length === 0 && (
        <div className="w-full text-center text-gray-500 mt-3">
          Tidak ada file ditemukan
        </div>
      )}

      {/* Daftar Galeri */}
      {galeri.map((file) => (
        <div
          key={file.id}
          className="relative w-1/2 lg:w-40 p-2"
          onClick={() => onSelect(file)}
        >
          <div
            className={`border cursor-pointer ${
              selectedItems.some(item => item.id === file.id)
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
                    selectedItems.some(item => item.id === file.id)
                      ? faSquareCheck
                      : faSquare
                  }
                  className={`${
                    selectedItems.some(item => item.id === file.id)
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
                        if (file.gambar) {
                          onDownload(
                            file.gambar.startsWith('http') ? file.gambar : `http://localhost:5000${file.gambar}`,
                            `Galeri_${file.id}_${file.gambar.split('/').pop()}`
                          );
                        } else {
                          console.error('URL gambar tidak valid');
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2 text-gray-500" />
                      Download
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file, "galeri");
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2 text-gray-500" />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            {file.gambar ? (
              <div className="w-full h-40 flex justify-center items-center bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={`http://localhost:5000${file.gambar}`}
                  alt={file.gambar}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-500 italic">No Image</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Galeri;