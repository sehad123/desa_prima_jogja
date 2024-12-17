import React, { useState } from "react";
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
  faPeopleGroup,
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Table = ({ columns = [], data = [], isMobile }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "no",
    direction: "ascending",
  });

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
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue =
          sortConfig.key === "date" ? new Date(a.rawDate) : a[sortConfig.key];
        const bValue =
          sortConfig.key === "date" ? new Date(b.rawDate) : b[sortConfig.key];
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

  return (
    <div>
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
                  <div className="flex items-center">
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
                    <span
                      className={`ml-${column.id !== "actions" ? "6" : "0"}`}
                    >
                      {column.label}
                    </span>
                  </div>
                </th>
              ))}
              <th className="text-center py-3 px-4 font-semibold border-b-8 border-base cursor-pointer sticky right-0 bg-white z-10">
                Tindakan
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
                        className="py-3 px-4 text-center border-b-8 font-light border-base whitespace-nowrap"
                      >
                        {column.id === "kategori" ? (
                          <span
                            className={`${
                              row[column.id] === "Tumbuh"
                                ? "bg-yellow-200 text-yellow-900"
                                : row[column.id] === "Berkembang"
                                ? "bg-green-200 text-green-900"
                                : row[column.id] === "Maju"
                                ? "bg-blue-200 text-blue-900"
                                : "text-gray-500" // Default text color if none match
                            } px-2 py-1 rounded-md font-normal`}
                          >
                            {row[column.id]?.toString() || ""}
                          </span>
                        ) : (
                          row[column.id]?.toString() || ""
                        )}
                      </td>
                    ))}

                    <td className="py-3 px-4 border-b-8 font-light border-base sticky right-0 bg-white z-10">
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
                  colSpan={columns.length + 1}
                  className="text-center py-3 px-4"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-gray-500 mr-2"
                  />
                  Data Tidak Ditemukan, silahkan hapus beberapa filter atau
                  ganti kata pencarian
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
