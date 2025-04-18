import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faArrowUp,
  faArrowDown,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faPeopleGroup,
  faMagnifyingGlass,
  faPenToSquare,
  faCheck,
  faBan,
  faMoneyBill,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useUserData from "../hooks/useUserData";

const Table = ({ columns = [], initialData = [], isMobile, onUpdate }) => {
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();
  const { profil } = useUserData();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "no",
    direction: "ascending",
  });
  const [rowStatus, setRowStatus] = useState({});
  const [rowNotes, setRowNotes] = useState({});
  const [updating, setUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [noteInput, setNoteInput] = useState("");

  // Gunakan useEffect untuk update state ketika prop berubah
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...initialData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [initialData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleNoteChange = (id, note) => {
    setRowNotes((prev) => ({
      ...prev,
      [id]: note,
    }));
  };

  // Modal untuk konfirmasi status
  const openStatusModal = (row, status) => {
    setSelectedRow(row);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedRow(null);
    setNewStatus("");
  };

  // Modal untuk catatan
  const openNoteModal = (row) => {
    setSelectedRow(row);
    setNoteInput(row.catatan || "");
    setShowNoteModal(true);
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setSelectedRow(null);
    setNoteInput("");
  };

  // Fungsi untuk handle status change dengan modal
  const confirmStatusChange = async () => {
    try {
      setUpdating(true);
      const response = await axios.patch(
        `http://localhost:5000/api/desa/${selectedRow.id}/status`,
        { status: newStatus }
      );

      if (onUpdate) {
        await onUpdate();
      }
      
      toast.success(
        `Status ${selectedRow.nama} berhasil diubah menjadi ${newStatus}`
      );
      closeStatusModal();
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      toast.error(
        `Gagal mengubah status: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setUpdating(false);
    }
  };

  // Fungsi untuk handle note change dengan modal
  const submitNote = async () => {
    try {
      setUpdating(true);
      await axios.patch(`http://localhost:5000/api/desa/${selectedRow.id}/catatan`, {
        catatan: noteInput,
      });

      if (onUpdate) {
        await onUpdate();
      }
      
      toast.success(
        `Catatan untuk ${selectedRow.nama} berhasil diperbarui`
      );
      closeNoteModal();
    } catch (error) {
      console.error("Error updating catatan:", error);
      toast.error("Gagal memperbarui catatan.");
    } finally {
      setUpdating(false);
    }
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const pageNumbers = [];
    const maxPageNumbers = 4;

    if (totalPages <= maxPageNumbers) {
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(0, page - 2);
      let endPage = Math.min(totalPages - 1, page + 2);

      if (page <= 2) {
        endPage = maxPageNumbers - 1;
      } else if (page >= totalPages - 3) {
        startPage = totalPages - maxPageNumbers;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return (
      <>
        <button
          onClick={() => handleChangePage(0)}
          disabled={page === 0}
          className="py-1 px-3 border rounded-md bg-gray-100 hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </button>
        <button
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
          className="py-1 px-3 border rounded-md bg-gray-100 hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handleChangePage(pageNumber)}
            className={`py-1 px-3 border rounded-md ${
              page === pageNumber
                ? "bg-secondary text-white"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          onClick={() => handleChangePage(page + 1)}
          disabled={page >= totalPages - 1}
          className="py-1 px-3 border rounded-md bg-gray-100 hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button
          onClick={() => handleChangePage(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="py-1 px-3 border rounded-md bg-gray-100 hover:bg-gray-300 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
      </>
    );
  };

  if (isMobile) {
    // Mobile view (list view)
    return (
      <div className="w-full px-5">
        {sortedData.length > 0 ? (
          sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="mb-4 border rounded-md p-4 bg-white"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-left">
                    {truncateText(row.kelompok_desa, 60)}
                  </h2>

                  <div className="flex justify-center space-x-2">
                    {/* Jika Role Pegawai, tampilkan input status */}
                    {profil.role === "Pegawai" ? (
                        <div className="flex justify-center space-x-2">
                        <button
                          className={`py-1 px-2 rounded-md ${
                            row.status === "Disetujui" ? "bg-green-500 text-white" : "bg-gray-300"
                          }`}
                          onClick={() => openStatusModal(row, "Disetujui")}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className={`py-1 px-2 rounded-md ${
                            row.status === "Ditolak" ? "bg-red-500 text-white" : "bg-gray-300"
                          }`}
                          onClick={() => openStatusModal(row, "Ditolak")}
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      </div>
                      ) : (
                      // Jika bukan Pegawai, tampilkan ikon status
                      <div className="flex justify-center space-x-2">
                        {row.status === "Disetujui" && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-green-500"
                          />
                        )}
                        {row.status === "Ditolak" && (
                          <FontAwesomeIcon
                            icon={faBan}
                            className="text-red-500"
                          />
                        )}
                        {row.status === "" || row.status === "Pending" ? (
                          <FontAwesomeIcon
                            icon={faClock}
                            className="text-gray-500"
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-left">{row.alamat}</p>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  <p className="text-left">{row.tahun_pembentukan}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
                  <p className="text-left">{row.jumlah_dana_sekarang}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <FontAwesomeIcon icon={faPeopleGroup} className="mr-1" />
                  <p className="text-left">
                    {truncateText(row.jumlah_anggota_sekarang, 50)}
                  </p>
                </div>

                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <p>{row.kategori}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  {/* Catatan untuk Pegawai, bisa edit, untuk Ketua Forum hanya tampilkan catatan */}
                  {profil.role === "Pegawai" ? (
                        <button
                        onClick={() => openNoteModal(row)}
                        className="text-secondary underline"
                      >
                        {row.catatan ? "Edit Catatan" : "Buat Catatan"}
                      </button>
                      ) : (
                    <div className="text-gray-600">{row.catatan}</div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mt-1 flex justify-between">
                  <div className="flex items-center text-sm text-gray-600 mt-1"></div>
                  <Link to={`/desa/${row.id}`}>
                    <button className="bg-secondary text-white py-1 px-2 rounded-md">
                      Detail
                    </button>
                  </Link>
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white text-gray-600">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-500 mb-2"
              size="2x"
            />
            <p>
              Data Tidak Ditemukan, silahkan hapus beberapa filter atau ganti
              kata pencarian
            </p>
          </div>
        )}
        <div className="flex flex-col justify-between items-center p-4 bg-white text-sm">
          <div>
            Menampilkan {page * rowsPerPage + 1} -{" "}
            {Math.min((page + 1) * rowsPerPage, data.length)} dari {data.length}{" "}
            data
          </div>
          <div className="flex items-center mt-4">
            <div>
              <p>Tampilkan: </p>
            </div>
            <div>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="mr-4 py-1 px-3 border rounded-md"
              >
                {[10, 25, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">{renderPageNumbers()}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto relative mt-3">
        <table className="min-w-full bg-white border-collapse text-sm">
          <thead className="bg-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="text-center py-3 px-4 font-semibold border-b-8 border-base cursor-pointer whitespace-nowrap relative"
                  onClick={() => {
                    if (column.id !== "actions") requestSort(column.id);
                  }}
                >
                  <div className="flex items-center justify-start">
                    {column.id !== "actions" && (
                      <FontAwesomeIcon
                        icon={
                          sortConfig.key === column.id
                            ? sortConfig.direction === "ascending"
                              ? faArrowUp
                              : faArrowDown
                            : faArrowUp
                        }
                        className={`absolute left-4 ${
                          sortConfig.key === column.id
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                    <div className="ml-4">
                      <span
                        className={`ml-${column.id !== "actions" ? "6" : "0"}`}
                      >
                        {column.label}
                      </span>
                    </div>
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 font-semibold border-b-8 border-base text-center">
                Status
              </th>
              <th className="py-3 px-4 font-semibold border-b-8 border-base text-center">
                Catatan
              </th>
              <th
                className="py-3 px-4 font-semibold border-b-8 border-base text-center sticky right-0 bg-white"
                style={{ zIndex: 1 }}
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100 rounded-full">
                    {columns.map((column) => {
                      // Tentukan alignment berdasarkan kolom
                      const alignment =
                        column.id === "nama" || column.id === "alamat"
                          ? "text-left"
                          : "text-center";

                      return (
                        <td
                          key={column.id}
                          className={`py-2 px-4 border-b-8 font-light border-base whitespace-nowrap ${alignment}`}
                        >
                          {truncateText(row[column.id]?.toString() || "", 30)}
                        </td>
                      );
                    })}
                    <td className="py-2 px-4 text-center border-b-8 font-light border-base">
                      {/* Jika Role Pegawai, tampilkan input status */}
                      {profil.role === "Pegawai" ? (
                        <div className="flex justify-center space-x-2">
                        <button
                          className={`py-1 px-2 rounded-md ${
                            row.status === "Disetujui" ? "bg-green-500 text-white" : "bg-gray-300"
                          }`}
                          onClick={() => openStatusModal(row, "Disetujui")}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className={`py-1 px-2 rounded-md ${
                            row.status === "Ditolak" ? "bg-red-500 text-white" : "bg-gray-300"
                          }`}
                          onClick={() => openStatusModal(row, "Ditolak")}
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      </div>
                      ) : (
                        // Jika bukan Pegawai, tampilkan ikon status
                        <div className="flex justify-center space-x-2">
                          {row.status === "Disetujui" && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-green-500"
                            />
                          )}
                          {row.status === "Ditolak" && (
                            <FontAwesomeIcon
                              icon={faBan}
                              className="text-red-500"
                            />
                          )}
                          {row.status === "" || row.status === "Pending" ? (
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-gray-500"
                            />
                          ) : null}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center border-b-8 font-light border-base whitespace-nowrap">
                      {/* Catatan untuk Pegawai, bisa edit, untuk Ketua Forum hanya tampilkan catatan */}
                      {profil.role === "Pegawai" ? (
                        <button
                        onClick={() => openNoteModal(row)}
                        className="text-secondary underline"
                      >
                        {row.catatan ? "Edit Catatan" : "Buat Catatan"}
                      </button>
                      ) : (
                        <div className="py-2 px-4 text-center font-light">
                          {row.catatan}
                        </div>
                      )}
                    </td>

                    <td
                      className="py-2 px-4 text-center border-b-8 font-light border-base sticky right-0 bg-white"
                      style={{ zIndex: 1 }}
                    >
                      <Link to={`/kelompok-desa/${row.id}`}>
                        <button className="bg-secondary text-white py-1 px-2 rounded-md">
                          Detail
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="text-center py-5 px-4"
                >
                  Data Tidak Ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4 bg-white text-sm">
        <div>
          Menampilkan {page * rowsPerPage + 1} -{" "}
          {Math.min((page + 1) * rowsPerPage, data.length)} dari {data.length}{" "}
          data
        </div>
        <div className="flex items-center">
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="mr-4 py-1 px-3 border rounded-md"
          >
            {[10, 25, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {renderPageNumbers()}
        </div>
      </div>
      {/* Modal Konfirmasi Status */}
      {showStatusModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Konfirmasi Perubahan Status
            </h3>
            <p>
              Apakah Anda yakin ingin mengubah status kelompok desa{" "}
              <strong>{selectedRow.kelompok_desa}</strong> menjadi{" "}
              <strong>{newStatus}</strong>?
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={updating}
                className={`px-4 py-2 rounded-md text-white ${
                  newStatus === "Disetujui" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {updating ? "Memproses..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catatan */}
      {showNoteModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Tambahkan Catatan untuk {selectedRow.kelompok_desa}
            </h3>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder="Masukkan catatan..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={closeNoteModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={submitNote}
                disabled={updating}
                className="px-4 py-2 bg-secondary text-white rounded-md"
              >
                {updating ? "Menyimpan..." : "Simpan Catatan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;