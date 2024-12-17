import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import UserDetailDataFetch from "../../../../data/UserDataFetch";
import TimDataFetch from "../../../../data/TimDataFetch";
import { useNavigate } from "react-router-dom";
import periodeKegiatanMap from "./DataSurvey"; // Import data from separate file

const AddKelompokModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(false);
  const [isTimOpen, setIsTimOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherKegiatan, setOtherKegiatan] = useState("");
  const [tim, setTim] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [filteredKegiatan, setFilteredKegiatan] = useState([]);

  const [formData, setFormData] = useState({
    team_id: "",
    team: "",
    petugas: "",
    period: "",
    name: "",
    target: "",
    realisasi: 0,
    date_start: "",
    date_end: "",
  });

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

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await UserDetailDataFetch();
        setFormData((prevState) => ({
          ...prevState,
          petugas: data.id,
        }));
      } catch (error) {
        navigate("/pageerror");
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  const periodeRef = useRef(null);
  const kegiatanRef = useRef(null);
  const timRef = useRef(null);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodeRef.current && !periodeRef.current.contains(event.target)) {
        setIsPeriodeOpen(false);
      }

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

  const handleFocusPeriode = () => {
    setIsPeriodeOpen(true);
  };

  const handleFocusKegiatan = () => {
    setIsKegiatanOpen(true);
  };

  const handleFocusTim = () => {
    setIsTimOpen(true);
  };

  const handleSelectPeriode = (selectedPeriode) => {
    setFormData((prevState) => ({
      ...prevState,
      period: selectedPeriode,
      name: "",
    }));

    const selectedKegiatanOptions = periodeKegiatanMap.find(
      (item) => item.periode === selectedPeriode
    )?.kegiatan;
    setFilteredKegiatan(selectedKegiatanOptions || []);

    setIsPeriodeOpen(false);
  };

  const handleChangeTim = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectKegiatan = (selectedKegiatan) => {
    if (selectedKegiatan === "Lainnya") {
      setIsOtherSelected(true);
      setFormData((prevState) => ({
        ...prevState,
        name: "",
      }));
    } else {
      setIsOtherSelected(false);
      setFormData((prevState) => ({
        ...prevState,
        name: selectedKegiatan,
      }));
      setIsKegiatanOpen(false);
    }
  };

  const handleChangeOtherKegiatan = (e) => {
    setOtherKegiatan(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  };

  const handleChangeKegiatan = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      formData.period === "" ||
      formData.team === "" ||
      formData.name === "" ||
      formData.target === "" ||
      formData.realisasi === "" ||
      formData.date_start === "" ||
      formData.date_end === ""
    ) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`/api/survey`, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
      localStorage.setItem("successMessages", "Berhasil menambahkan survey");
    } catch (err) {
      navigate("/pageerror");
      localStorage.setItem("errorMessages", "Gagal menambahkan survey");
    } finally {
      // setLoading(false);
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
          <div className="bg-white p-2 md:px-4 lg:px-4 md:py-3 lg:py-3 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-screen overflow-auto relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
              Tambah Pengurus
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>

            <div>
                <label
                  htmlFor="target"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nama 
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.target === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan nama pengurus
                </label>
                <input
                  id="target"
                  name="target"
                  type="text"
                  value={formData.target}
                  onChange={handleChange}
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.target === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                />
              </div>

              <div ref={periodeRef} className="relative">
                <label className="block text-sm font-medium text-gray-900">
                  Jabatan
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.period === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Pilih jabatan
                </label>
                {/* Periode Selection */}
                <div className="relative">
                  <input
                    id="type"
                    name="type"
                    type="text"
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.period === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                    value={
                      formData.period === ""
                        ? "Pilih Periode Kegiatan"
                        : formData.period
                    }
                    onFocus={handleFocusPeriode}
                    onChange={handleChange}
                    readOnly
                  />
                  {isPeriodeOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
                      {periodeKegiatanMap.map((option) => (
                        <div
                          key={option.periode}
                          onClick={() => {
                            handleSelectPeriode(option.periode);
                            setIsPeriodeOpen(false);
                          }}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-300"
                        >
                          {option.periode}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="target"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nomor Telepon
                </label>
                <label
                  className={`block text-xs ${
                    submitted && formData.target === ""
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  Tuliskan nomor telepon
                </label>
                <input
                  id="target"
                  name="target"
                  type="number"
                  value={formData.target}
                  onChange={handleChange}
                  className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                    submitted && formData.target === ""
                      ? "ring-2 ring-inset ring-red-600"
                      : "ring-1 ring-inset ring-gray-300"
                  }  placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                />
              </div>
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
                  *Pastikan semua isian sudah benar
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </Transition>
  );
};

export default AddKelompokModal;
