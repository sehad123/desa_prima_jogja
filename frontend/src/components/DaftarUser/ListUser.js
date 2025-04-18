import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import { Audio } from "react-loader-spinner";
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import useMediaQuery from "../useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";
import FormUser from "./Modal/UserModal";
import UserTable from "./UserTable";
import DeleteUserModal from "./Modal/DeleteUserModal";
import useUserData from "../hooks/useUserData";

const columns = [
  { id: "no", label: "No" },
  { id: "name", label: "Nama" },
  { id: "role", label: "Role" },
  { id: "email", label: "Email" },
  { id: "nip", label: "NIP" },
  { id: "nama_kabupaten", label: "Akses" },
];

const ListUser = () => {
  const navigate = useNavigate();
  const { 
    userList, 
    loading,
    refresh,
  } = useUserData();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "no",
    direction: "ascending",
  });
 
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const filteredUsers = useMemo(() => {
    return userList
      .filter((user) => {
        if (!user) return false; // Tambahkan pengecekan null
        
        const keyword = search.toLowerCase();
        const name = user.name ? user.name.toLowerCase() : '';
        const nip = user.nip ? user.nip.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const role = user.role ? user.role.toLowerCase() : '';
        const nama_kabupaten = user.nama_kabupaten ? user.nama_kabupaten.toLowerCase() : '';
  
        return (
          name.includes(keyword) ||
          nip.includes(keyword) ||
          email.includes(keyword) ||
          role.includes(keyword) ||
          nama_kabupaten.includes(keyword)
        );
      })
      .map((user, index) => ({ ...user, no: index + 1 }));
  }, [search, userList]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    refresh();
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredUsers];
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
  }, [filteredUsers, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalType("form");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete || !itemToDelete.id) {
      toast.error("Data yang akan dihapus tidak valid.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:5000/users/list/${itemToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response dari server:", response.data);
      toast.success(`User "${itemToDelete.name}" berhasil dihapus!`);
      setIsDeleteModalOpen(false);
      refresh();
    } catch (err) {
      console.error(
        "Error saat menghapus data:",
        err.response?.data || err.message
      );
      toast.error("Gagal menghapus data.");
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

    if (loading) {
      return <div className="flex items-center justify-center h-screen"><Audio type="Bars" color="#542d48" height={80} width={80} /></div>;
    }

  return (
    <>
      <div className="p-7">
        <div className={`ml-0 p-3 bg-white w-full`}>
          <div className="flex flex-col md:items-start bg-white p-3 w-full">
            <div className="border-b-2 border-grey items-start md:border-none pb-2 md:pb-0 lg:ml-3">
              <h1 className="text-lg lg:text-xl font-medium text-gray-800">Daftar User</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mt-4 gap-2 lg:ml-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-secondary text-white py-2 px-4 rounded-md text-sm w-full md:w-auto hover:bg-purple-400"
              >
                + Tambah User
              </button>

              <div className="flex w-full md:w-auto lg:mr-7 mt-2 lg:mt-0">
                <input
                  type="text"
                  placeholder="Masukkan kata kunci"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-sm px-3 py-2 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary w-full"
                />
                <button className="p-2 px-3 bg-secondary rounded-r-md hover:bg-secondary-dark transition-colors">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-white"
                  />
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <Audio type="Bars" color="#542d48" height={80} width={80} />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="pt-5 text-center text-lg text-gray-500">
                Tidak ada data user.
              </p>
            ) : (
              <UserTable
                columns={columns}
                sortedData={sortedData}
                sortConfig={sortConfig}
                requestSort={requestSort}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleEdit={handleEdit}
                setItemToDelete={setItemToDelete}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                isMobile={isMobile}
              />
            )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FormUser
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedUser={selectedUser}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDelete}
        itemToDelete={itemToDelete}
      />
      )}
    </>
  );
};

export default ListUser;