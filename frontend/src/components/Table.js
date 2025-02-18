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
  faUserTag,
  faClock,
  faPeopleGroup,
  faMagnifyingGlass,
  faPenToSquare,
  faCheck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Th = styled.th`
  display: flex; /* Menyusun teks dan ikon dalam satu baris */
  justify-content: flex-start; /* Menyusun teks dan ikon ke kiri */
  align-items: center; /* Menjaga vertikal alignment antara teks dan ikon */
  padding: 10px 20px; /* Memberikan ruang yang cukup di setiap sisi */
  white-space: nowrap; /* Menghindari pemotongan teks */
`;

const FontAwesomeStyled = styled(FontAwesomeIcon)`
  margin-left: 5px; /* Memberikan jarak antar ikon dan teks */
  font-size: 12px; /* Menyesuaikan ukuran ikon agar tidak terlalu besar */
`;

const Modal = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md text-center">
        <h2 className="text-lg font-semibold mb-4">Peringatan</h2>
        <p className="mb-6">{message}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

const Table = ({ columns = [], data = [], isMobile }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "no",
    direction: "ascending",
  });
  const [rowStatus, setRowStatus] = useState({});
  const [rowNotes, setRowNotes] = useState({});
  const [profil, setProfil] = useState({});
  const [updating, setUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfil(response.data); // Set nama dan NIP ke state
      } catch (error) {
        console.error(
          "Gagal mengambil profil:",
          error.response?.data?.error || error.message
        );
      }
    };

    fetchProfil();
  }, []);

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
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
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = async (id, status) => {
    if (profil.role !== "Pegawai") {
      setIsModalVisible(true);
      return;
    }
    try {
      setUpdating(true);
      setRowStatus((prev) => ({
        ...prev,
        [id]: status,
      }));
      await axios.patch(`http://localhost:5000/api/desa/${id}/status`, {
        status,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal memperbarui status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleNoteChange = (id, note) => {
    setRowNotes((prev) => ({
      ...prev,
      [id]: note,
    }));
  };

  const handleNoteUpdate = async (id) => {
    if (profil.role !== "Pegawai") {
      setIsModalVisible(true);
      return;
    }
    try {
      setUpdating(true);
      const note = rowNotes[id];
      await axios.patch(`http://localhost:5000/api/desa/${id}/catatan`, {
        catatan: note,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating catatan:", error);
      alert("Gagal memperbarui catatan.");
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
                ? "bg-blue-500 text-white"
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
      <div className="w-full p-2">
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
                      <input
                        type="text"
                        className="p-2 border border-gray-300 rounded-md w-full"
                        placeholder="Masukkan status"
                        value={rowStatus[row.id] || ""}
                        onChange={(e) =>
                          setRowStatus({
                            ...rowStatus,
                            [row.id]: e.target.value,
                          })
                        }
                      />
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
                        {row.status === "" || row.status === null ? (
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
                  <FontAwesomeIcon icon={faPeopleGroup} className="mr-1" />
                  <p className="text-left">{row.jumlah_dana_sekarang}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                  <p className="text-left">
                    {truncateText(row.jumlah_anggota_sekarang, 50)}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  <p>{row.tahun_pembentukan}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  <p>{row.kategori}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  {/* Catatan untuk Pegawai, bisa edit, untuk Ketua Forum hanya tampilkan catatan */}
                  {profil.role === "Pegawai" ? (
                    <input
                      type="text"
                      className="p-2 border border-gray-300 rounded-md w-full"
                      placeholder="Tambahkan catatan"
                      value={rowNotes[row.id] ?? row.catatan ?? ""}
                      onChange={(e) => handleNoteChange(row.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleNoteUpdate(row.id);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-gray-600">{row.catatan}</div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mt-1 flex justify-between">
                  <div className="flex items-center text-sm text-gray-600 mt-1"></div>
                  <Link to={`/desa/${row.id}`}>
                    <button className="bg-blue-500 text-white py-1 px-2 rounded-md">
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
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message="Hanya Pegawai yang dapat memperbarui status!"
      />
      <div className="overflow-x-auto relative">
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
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className="py-2 px-4 text-center border-b-8 font-light border-base whitespace-nowrap"
                      >
                        {truncateText(row[column.id]?.toString() || "", 70)}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-center border-b-8 font-light border-base">
                      {/* Jika Role Pegawai, tampilkan input status */}
                      {profil.role === "Pegawai" ? (
                        <input
                          type="text"
                          className="p-2 border border-gray-300 rounded-md w-full"
                          placeholder="Masukkan status"
                          value={rowStatus[row.id] || ""}
                          onChange={(e) =>
                            setRowStatus({
                              ...rowStatus,
                              [row.id]: e.target.value,
                            })
                          }
                        />
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
                          {row.status === "" || row.status === null ? (
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
                        <input
                          type="text"
                          className="p-2 border border-gray-300 rounded-md w-full"
                          placeholder="Tambahkan catatan"
                          value={rowNotes[row.id] ?? row.catatan ?? ""}
                          onChange={(e) =>
                            handleNoteChange(row.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleNoteUpdate(row.id);
                            }
                          }}
                        />
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
                      <Link to={`/desa/${row.id}`}>
                        <button className="bg-blue-500 text-white py-1 px-2 rounded-md">
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
                  className="text-center py-3 px-4"
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
    </div>
  );
};

export default Table;
