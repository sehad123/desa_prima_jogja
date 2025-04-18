import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserModal = ({ isOpen, onClose, selectedUser }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    nip: "",
    role: "",
    email: "",
    kabupatenId: "",
  });

  const [aksesKabList, setAksesKabList] = useState([]);
  const [apiError, setApiError] = useState(null); // Untuk error yang ditampilkan di form
  const [toastError, setToastError] = useState(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isAksesOpen, setIsAksesOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        id: selectedUser.id,
        name: selectedUser.name || "",
        nip: selectedUser.nip || "",
        role: selectedUser.role || "",
        email: selectedUser.email || "",
        kabupatenId: selectedUser.kabupatenId || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        nip: "",
        role: "",
        email: "",
        kabupatenId: "",
      });
    }

    // Ambil data kabupaten
    axios
      .get("http://localhost:5000/api/kabupaten")
      .then((res) => setAksesKabList(res.data))
      .catch((err) => console.error(err));

    setLoading(false);
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setFormData({
        ...formData,
        role: value,
        kabupatenId: value === "Ketua Forum" ? formData.kabupatenId : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const roleRef = useRef(null);
  const aksesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }

      if (aksesRef.current && !aksesRef.current.contains(event.target)) {
        setIsAksesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generatePassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setApiError(null); // Reset error form
    setToastError(null);

    try {
      const plainPassword = !selectedUser ? generatePassword() : null;
      if (plainPassword) setGeneratedPassword(plainPassword);

      // Siapkan data untuk dikirim
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.nip && { nip: formData.nip }),
        ...(formData.role === "Ketua Forum" && {
          kabupatenId: formData.kabupatenId,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
        sendEmail: true,
        ...(!selectedUser && { password: plainPassword }),
      };

      console.log("Payload yang dikirim:", payload);

      let response;
      if (selectedUser) {
        // Edit data user
        response = await axios.put(
          `http://localhost:5000/users/users/list/${selectedUser.id}`,
          payload
        );
        toast.success(`Berhasil mengubah data User ${formData.name}`);
      } else {
        // Tambah data user baru
        response = await axios.post(
          "http://localhost:5000/users/users/list",
          payload
        );
        toast.success(`Berhasil menambahkan data User ${formData.name}`);
      }

      console.log("Response dari server:", response.data);

      // Reset form
      setFormData({
        name: "",
        nip: "",
        email: "",
        role: "",
        kabupatenId: "",
      });

      // Tutup modal dan reload
      onClose(true);
    } catch (error) {
      console.error("Detail error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Gagal menyimpan data user";

      if (error.response?.status === 400 || error.response?.status === 422) {
        // Error validasi, tampilkan di form
        setApiError(errorMessage);
      } else if (error.message.includes("Network Error")) {
        // Error jaringan, tampilkan di form
        setToastError(errorMessage);
        toast.error("Koneksi jaringan bermasalah. Silakan coba lagi.");
      } else {
        // Error lainnya, tampilkan sebagai toast

        setApiError(errorMessage); // Tetap tampilkan toast untuk error tertentu
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center text-left z-50 px-5 pt-10 pb-20">
        {loading ? (
          <div className="flex items-center justify-center">
            <Audio type="Bars" color="#542d48" height={80} width={80} />
          </div>
        ) : (
          <div className="bg-white top-4 p-2 md:px-4 lg:px-4 md:py-3 lg:py-3 rounded-lg shadow-lg w-full max-w-md md:max-w-md lg:max-w-md max-h-screen overflow-auto relative">
            {" "}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
              {selectedUser ? "Edit Data User" : "Tambah Data User"}
            </h2>
            {apiError && (
              <div className="mb-4 flex items-start p-3 bg-red-50 rounded-md border border-red-200">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                />
                <p className="text-red-700">{apiError}</p>
              </div>
            )}
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="relative">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Nama
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.name === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.name === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.email === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.name === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    NIP
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted ? "text-gray-900" : ""
                    }`}
                  >
                    Tuliskan NIP, kosongkan jika tidak memiliki NIP
                  </label>
                  <input
                    type="number"
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm
                    
                        ring-1 ring-inset ring-gray-300
                     placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>

                <div ref={roleRef} className="relative mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Role
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.role === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Pilih role
                  </label>
                  <select
                    id="role"
                    name="role"
                    className={`custom-select block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.role === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Role</option>
                    <option value="Pegawai">Pegawai</option>
                    <option value="Admin">Admin</option>
                    <option value="Ketua Forum">Ketua Forum</option>
                  </select>
                </div>

                {formData.role === "Ketua Forum" && (
                  <div ref={aksesRef} className="relative mb-2">
                    {/* Label utama "Akses" */}
                    <label className="block text-sm font-medium text-gray-900">
                      Akses Kabupaten
                    </label>

                    {/* Sub-label dengan validasi */}
                    <label
                      className={`block text-xs ${
                        submitted && !formData.kabupatenId
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {submitted && !formData.kabupatenId
                        ? "Harap pilih akses kabupaten/kota!"
                        : "Pilih akses kabupaten/kota"}
                    </label>

                    {/* Dropdown kabupaten */}
                    <select
                      name="kabupatenId"
                      value={formData.kabupatenId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kabupatenId: e.target.value,
                        })
                      }
                      className={`custom-select block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && !formData.kabupatenId
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                      required
                    >
                      <option value="">Pilih Kabupaten</option>
                      {aksesKabList.map((kabupaten) => (
                        <option key={kabupaten.id} value={kabupaten.id}>
                          {kabupaten.nama_kabupaten}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="w-full flex justify-end">
                <button
                  type="button"
                  className="w-2/12 text-sm bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/12 text-sm bg-blue-200 text-blue-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Kirim
                </button>
              </div>
              <div></div>
            </form>
          </div>
        )}
      </div>
    </Transition>
  );
};

export default UserModal;
