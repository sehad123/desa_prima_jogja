import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import UserDetailDataFetch from "../../../../data/UserDataFetch";
import TimDataFetch from "../../../../data/TimDataFetch";
import { useNavigate } from "react-router-dom";

const kegiatan = [
  { id: 1, nama: "Rapat / Briefing / Pertemuan" },
  { id: 2, nama: "Perjalanan Dinas" },
  { id: 3, nama: "Kegiatan Sensus / Survei" },
  { id: 4, nama: "Kegiatan Eksternal & Lainnya" },
  { id: 5, nama: "Laporan Output Kegiatan" },
];

const AddActivityModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(false);
  const [isTimOpen, setIsTimOpen] = useState(false);
  const [tim, setTim] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const daftar = await TimDataFetch();
        if (isMounted) {
          setTim(daftar);
        }
      } catch (error) {
        if (isMounted) {
          // setError("Failed to fetch tim");
          navigate("/pageerror");
        }
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [formData, setFormData] = useState({
    team_id: "",
    team: "",
    created_by: "",
    type: "",
    name: "",
    place: "",
    date: "",
    time_start: "",
    time_end: "",
    edited_by: "",
    catatan: "",
  });

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await UserDetailDataFetch();
        setFormData((prevState) => ({
          ...prevState,
          created_by: data.id,
          edited_by: data.id,
        }));
      } catch (error) {
        // setError("Failed to fetch profil");
        // console.error("Error fetching profil:", error);
        navigate("/pageerror");
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  const kegiatanRef = useRef(null);
  const timRef = useRef(null);

  useEffect(() => {
    if (formData.type === "5" || formData.type === "Laporan Output Kegiatan") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date
      setFormData((prevState) => ({
        ...prevState,
        place: "BPS Kabupaten Sleman",
        date: today,
        time_start: "00:00",
        time_end: "00:00",
      }));
    }
  }, [formData.type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (kegiatanRef.current && !kegiatanRef.current.contains(event.target)) {
        setIsKegiatanOpen(false);
      }

      if (timRef.current && !timRef.current.contains(event.target)) {
        setIsTimOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocusKegiatan = () => {
    setIsKegiatanOpen(true);
  };

  const handleFocusTim = () => {
    setIsTimOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeTim = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      formData.type === "" ||
      formData.team === "" ||
      formData.name === "" ||
      formData.place === "" ||
      formData.date === "" ||
      formData.time_start === "" ||
      formData.time_end === ""
    ) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`/api/activity`, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      window.location.reload();
      localStorage.setItem("successMessages", "Berhasil menambahkan kegiatan");
    } catch (err) {
      navigate("/pageerror");
      localStorage.setItem("errorMessages", "Gagal menambahkan kegiatan");
    } finally {
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

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
      <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center text-left z-50 p-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <Audio type="Bars" color="#3FA2F6" height={80} width={80} />
          </div>
        ) : (
          <div className="bg-white top-4 p-2 md:px-4 lg:px-4 md:py-3 lg:py-3 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-screen overflow-auto relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
              Tambah Kegiatan
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div ref={kegiatanRef} className="relative">
                <label className="block text-sm font-medium text-gray-900">
                  Kegiatan
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.type === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Pilih kegiatan yang dihadiri
                </label>
                <input
                  id="type"
                  name="type"
                  type="text"
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.type === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                  value={
                    formData.type === "" ? "Pilih Kegiatan" : formData.type
                  }
                  onFocus={handleFocusKegiatan}
                  onChange={handleChange}
                  readOnly
                />
                {isKegiatanOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {kegiatan.map((kegiatan) => (
                        <div
                          key={kegiatan.id}
                          onClick={() => {
                            setFormData((prevState) => ({
                              ...prevState,
                              type: kegiatan.nama,
                            }));
                            setIsKegiatanOpen(false);
                          }}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-300"
                        >
                          {kegiatan.nama}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={timRef} className="relative">
                <label className="block text-sm font-medium text-gray-900">
                  Tim
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.team === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Pilih tim utama yang terlibat
                </label>
                <input
                  id="team"
                  name="team"
                  type="text"
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.team === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                  value={formData.team === "" ? "Pilih Tim" : formData.team}
                  onFocus={handleFocusTim}
                  onChange={handleChangeTim}
                  readOnly
                />
                {isTimOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {tim.map((teams) => (
                        <div
                          key={teams.id}
                          onClick={() => {
                            setFormData((prevState) => ({
                              ...prevState,
                              team_id: teams.id,
                              team: teams.name,
                            }));
                            setIsTimOpen(false);
                          }}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-300"
                        >
                          {teams.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nama Kegiatan
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.name === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan nama kegiatan
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.name === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                />
              </div>
              {formData.type !== "Laporan Output Kegiatan" && (
                <>
                  <div>
                    <label
                      htmlFor="place"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Tempat Kegiatan
                    </label>
                    <label
                      className={`block text-xs ${
                        submitted && formData.place === ""
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Tuliskan tempat kegiatan
                    </label>
                    <input
                      id="place"
                      name="place"
                      type="text"
                      value={formData.place}
                      onChange={handleChange}
                      className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && formData.place === ""
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Tanggal Kegiatan
                    </label>
                    <label
                      className={`block text-xs ${
                        submitted && formData.date === ""
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Pilih tanggal kegiatan
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      onFocus={(e) => e.target.showPicker()}
                      className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && formData.date === ""
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-900">
                        Waktu Mulai
                      </label>
                      <label
                        className={`block text-xs ${
                          submitted && formData.time_start === ""
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        Pilih waktu mulai kegiatan
                      </label>
                      <input
                        id="time_start"
                        name="time_start"
                        type="time"
                        value={formData.time_start}
                        onChange={handleChange}
                        onFocus={(e) => e.target.showPicker()}
                        className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                          submitted && formData.time_start === ""
                            ? "ring-2 ring-inset ring-red-600"
                            : "ring-1 ring-inset ring-gray-300"
                        }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-900">
                        Waktu Selesai
                      </label>
                      <label
                        className={`block text-xs ${
                          submitted && formData.time_end === ""
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        Pilih waktu selesai kegiatan
                      </label>
                      <input
                        id="time_end"
                        name="time_end"
                        type="time"
                        value={formData.time_end}
                        onChange={handleChange}
                        onFocus={(e) => e.target.showPicker()}
                        className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                          submitted && formData.time_end === ""
                            ? "ring-2 ring-inset ring-red-600"
                            : "ring-1 ring-inset ring-gray-300"
                        }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Klasifikasi Kegiatan
                    </label>
                    <label
                      className={`block text-xs 
                      text-gray-900
                  `}
                    >
                      Tuliskan klasifikasi pendukung, contoh: Tim ZI, Tim Sakip
                    </label>
                    <input
                      id="name"
                      name="catatan"
                      type="text"
                      value={formData.catatan}
                      onChange={handleChange}
                      className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm 
                      ring-1 ring-inset ring-gray-300
                  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                    />
                  </div>
                </>
              )}
              <div className="w-full flex justify-end">
                <button
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
              <div>
                <p className="block text-xs text-gray-900">
                  *File akan diupload melalui detail setiap kegiatan
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </Transition>
  );
};

export default AddActivityModal;
