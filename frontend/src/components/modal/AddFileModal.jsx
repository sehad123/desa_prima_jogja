import React, { useState, useRef } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const allowedExtensions = {
  "Galeri Laporan": ["jpeg", "jpg", "png"],
  "Galeri Foto": ["jpeg", "jpg", "png"],
  "Notulensi / Materi": [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xlsx",
    "xls",
    "txt",
  ],
  default: ["pdf"],
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const validateFileExtensionsAndSize = (files, tab) => {
  const allowedExts = allowedExtensions[tab] || allowedExtensions.default;
  return files.filter((file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    return allowedExts.includes(ext) && file.size <= MAX_FILE_SIZE;
  });
};

const AddFileModal = ({ isOpen, onClose, selectedTab, id, laporan }) => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileCaptions, setFileCaptions] = useState({});
  const [captionErrors, setCaptionErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = validateFileExtensionsAndSize(files, selectedTab);
    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    event.target.value = null;
  };

  const handleRemoveFile = (file) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile !== file)
    );
    setFileCaptions((prevCaptions) => {
      const newCaptions = { ...prevCaptions };
      delete newCaptions[file.name];
      return newCaptions;
    });
    setCaptionErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[file.name];
      return newErrors;
    });
  };

  const handleCaptionChange = (event, fileName) => {
    const { value } = event.target;
    setFileCaptions((prevCaptions) => ({
      ...prevCaptions,
      [fileName]: value,
    }));
    setCaptionErrors((prevErrors) => ({
      ...prevErrors,
      [fileName]: value ? "" : "Caption wajib diisi",
    }));
  };

  const handleUpload = () => {
    handleUploadFiles();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = validateFileExtensionsAndSize(files, selectedTab);
    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadFiles = async () => {
    if (selectedTab === "Galeri Laporan") {
      const newErrors = {};
      selectedFiles.forEach((file) => {
        if (!fileCaptions[file.name]) {
          newErrors[file.name] = "Caption wajib diisi";
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setCaptionErrors(newErrors);
        return;
      }
    }
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/pageerror");
      return;
    }
    const lap = laporan[0];
    const formDataList = selectedFiles.map((file) => {
      let formData = new FormData();
      if (selectedTab === "Galeri Laporan") {
        formData.append("lap_out_id", lap.id);
        formData.append("name", fileCaptions[file.name]);
        formData.append("path", file);
      } else {
        formData.append("activity_id", id);
        formData.append("path", file);
      }
      return formData;
    });

    let endpoint;
    switch (selectedTab) {
      case "Galeri Foto":
        endpoint = `/api/photos`;
        break;
      case "Galeri Laporan":
        endpoint = `/api/lap-out-photos`;
        break;
      case "Undangan":
        endpoint = `/api/letters`;
        break;
      case "Presensi":
        endpoint = `/api/attendance_lists`;
        break;
      case "Notulensi / Materi":
        endpoint = `/api/notes`;
        break;
      default:
        throw new Error("Unknown tab selected");
    }

    try {
      for (const formData of formDataList) {
        await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
          },
        });
      }
      window.location.reload();
      localStorage.setItem(
        "successMessages",
        "Berhasil mengunggah file untuk kegiatan"
      );
    } catch (error) {
      navigate("/pageerror");
      localStorage.setItem(
        "errorMessages",
        "Gagal mengunggah file untuk kegiatan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      contentLabel="Add File Modal"
      className="relative w-11/12 lg:w-full z-50 max-w-2xl min-h-1.5 h-auto mx-auto bg-white p-4 rounded-lg outline-none"
      overlayClassName={`fixed z-50 inset-0 bg-black bg-opacity-75 flex items-center justify-center ${
        loading ? "pointer-events-none" : ""
      }`}
    >
      <div>
        <div className="border-b-2 border-grey md:border-none pb-1 md:pb-0">
          <h2 className="text-xl mb-2 text-center md:text-left">{`Unggah ${
            selectedTab === "Galeri Foto" ? "Foto" : "File"
          }`}</h2>
        </div>
        <h2 className="text-xs md:text-sm mb-4 mt-2 lg:mt-0">
          *Maksimal 4 file dengan ukuran maksimal setiap file {MAX_FILE_SIZE_MB}
          MB, format:{" "}
          {selectedTab === "Galeri Foto" || selectedTab === "Galeri Laporan"
            ? "jpeg, jpg, png"
            : "pdf"}
        </h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
          </div>
        ) : (
          <div
            className="bg-gray-100 border-dashed border-2 border-gray-300 p-4 text-center mb-4 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <button
              onClick={handleFileInputClick}
              className="bg-blue-500 text-sm md:text text-white py-2 px-4 rounded"
            >
              Choose Files ({selectedFiles.length})
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="mb-2 lg:mt-2 text-sm md:text">or drag a file here</p>
          </div>
        )}
        {loading ? (
          ""
        ) : (
          <>
            {selectedTab === "Galeri Laporan" && (
              <div className="border-t border-gray-300 pt-4 mb-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`caption-${index}`}
                      className="block text-xs md:text-sm text-gray-700"
                    >
                      <span className="text-red-500">*</span> Keterangan gambar (Caption) untuk {file.name}
                    </label>
                    {captionErrors[file.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {captionErrors[file.name]}
                      </p>
                    )}
                    <input
                      type="text"
                      id={`caption-${index}`}
                      className={`mt-1 p-1 text-xs md:text-sm block w-full border ${
                        captionErrors[file.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={fileCaptions[file.name] || ""}
                      onChange={(event) =>
                        handleCaptionChange(event, file.name)
                      }
                    />
                  </div>
                ))}
                {selectedFiles.length > 0 && (
                  <div className="border-t border-gray-300 pt-4 mb-4">
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2"
                        >
                          <span className="truncate text-xs md:text-sm">
                            {file.name}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveFile(file)}
                          >
                            <FaTimes />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="w-3/12 md:2/12 text-sm md:text bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2                 focus:ring-blue-500"
                onClick={handleRequestClose}
              >
                Batal
              </button>
              <button
                className="w-3/12 md:w-2/12 text-sm md:text bg-blue-500 text-white font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleUpload}
                disabled={loading}
              >
                Unggah
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddFileModal;
