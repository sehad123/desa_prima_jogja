import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Audio } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const KelompokModal = ({ isOpen, onClose, selectedDesa, kabupatenName }) => {
  const [formData, setFormData] = useState({
    nama: "",
    kabupatenId: "",
    kabupaten_kota: kabupatenName || "",
    kabupatenNama: "", // Nama Kabupaten
    kecamatan: "",
    kecamatanNama: "", // Nama Kecamatan
    kelurahan: "",
    kelurahanNama: "", // Nama Kelurahan
    tanggal_pembentukan: "",
    jumlah_hibah_diterima: "",
    jumlah_dana_sekarang: "",
    jumlah_anggota_awal: "",
    jumlah_anggota_sekarang: "",
    status: "Pending",
    catatan: "",
    latitude: "", // Tambahan latitude
    longitude: "", //
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [isKabupatenOpen, setIsKabupatenOpen] = useState(false);
  const [isKecamatanOpen, setIsKecamatanOpen] = useState(false);
  const [isKelurahanOpen, setIsKelurahanOpen] = useState(false);
  const [categoryNotification, setCategoryNotification] = useState("");
  const [loadingCoordinates, setLoadingCoordinates] = useState(false);
  const [showCategoryNotification, setShowCategoryNotification] =
    useState(false);
  const kabupatenRef = useRef(null);
  const kecamatanRef = useRef(null);
  const kelurahanRef = useRef(null);
  const [dateError, setDateError] = useState("");
  const [coordinateError, setCoordinateError] = useState({
    latitude: "",
    longitude: "",
  });

  const numberFields = [
    "jumlah_hibah_diterima",
    "jumlah_dana_sekarang",
    "jumlah_anggota_awal",
    "jumlah_anggota_sekarang",
  ];

  const formatKabupatenName = (name) => {
    if (!name) return "";

    // Ubah ke format KAB. NAMA_KABUPATEN (huruf kapital)
    return name
      .toString()
      .replace(/kab\.?/i, "KAB.") // Standarisasi penulisan KAB.
      .replace(/\s+/g, " ") // Hapus spasi berlebih
      .trim()
      .split(" ")
      .map((word) => (word === "KAB." ? word : word.toUpperCase()))
      .join(" ");
  };

  const getKabupatenFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const kabupatenParam = urlParams.get("kabupaten");
    return kabupatenParam
      ? formatKabupatenName(decodeURIComponent(kabupatenParam))
      : null;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load data kabupaten terlebih dahulu
        const kabResponse = await axios.get(
          "https://ibnux.github.io/data-indonesia/kabupaten/34.json"
        );
        setKabupatenList(kabResponse.data);

        const kabupatenFromURL = getKabupatenFromURL();
        let initialKabupaten = null;

        if (selectedDesa) {
          // Cari ID kabupaten berdasarkan nama yang sudah diformat
          const formattedKabupaten = formatKabupatenName(
            selectedDesa.kabupaten_kota || selectedDesa.kabupaten
          );
          const kabupaten = kabResponse.data.find(
            (k) => formatKabupatenName(k.nama) === formattedKabupaten
          );
          initialKabupaten = kabupaten?.id || "";
        } else if (kabupatenFromURL) {
          const kabupaten = kabResponse.data.find(
            (k) => formatKabupatenName(k.nama) === kabupatenFromURL
          );
          initialKabupaten = kabupaten?.id || "";
        }

        // 3. Format tanggal pembentukan (TETAP DIPERTAHANKAN)
        const formattedDate = selectedDesa?.tanggal_pembentukan
          ? new Date(selectedDesa.tanggal_pembentukan)
              .toISOString()
              .split("T")[0]
          : "";

        // 4. Set data form (SEMUA FIELD TETAP ADA)
        setFormData({
          nama: selectedDesa?.nama || "",
          kabupatenId: selectedDesa?.kabupatenId || "",
          kabupaten_kota: initialKabupaten || "",
          kabupatenNama: selectedDesa?.kabupaten_kota
            ? formatKabupatenName(selectedDesa.kabupaten_kota)
            : formatKabupatenName(kabupatenFromURL) || "",
          kecamatan: selectedDesa?.kecamatan || "",
          kecamatanNama: selectedDesa?.kecamatan || "",
          kelurahan: selectedDesa?.kelurahan || "",
          kelurahanNama: selectedDesa?.kelurahan || "",
          tanggal_pembentukan: formattedDate, // TETAP ADA
          jumlah_hibah_diterima: selectedDesa?.jumlah_hibah_diterima || "",
          jumlah_dana_sekarang: selectedDesa?.jumlah_dana_sekarang || "",
          jumlah_anggota_awal: selectedDesa?.jumlah_anggota_awal || "",
          jumlah_anggota_sekarang: selectedDesa?.jumlah_anggota_sekarang || "",
          status: selectedDesa?.status || "Pending",
          catatan: selectedDesa?.catatan || "",
          latitude: selectedDesa?.latitude || "",
          longitude: selectedDesa?.longitude || "",
        });

        // 5. Jika ada kabupaten, load kecamatan
        if (initialKabupaten) {
          const kecResponse = await axios.get(
            `https://ibnux.github.io/data-indonesia/kecamatan/${initialKabupaten}.json`
          );
          setKecamatanList(kecResponse.data);

          // 6. Jika ada selectedDesa, cari ID kecamatan berdasarkan nama
          if (selectedDesa) {
            const kecamatan = kecResponse.data.find(
              (k) => k.nama === selectedDesa.kecamatan
            );

            if (kecamatan?.id) {
              setFormData((prev) => ({
                ...prev,
                kecamatan: kecamatan.id,
                kecamatanNama: selectedDesa.kecamatan || "",
              }));

              // 7. Load kelurahan
              const kelResponse = await axios.get(
                `https://ibnux.github.io/data-indonesia/kelurahan/${kecamatan.id}.json`
              );
              setKelurahanList(kelResponse.data);

              // 8. Cari ID kelurahan berdasarkan nama
              const kelurahan = kelResponse.data.find(
                (k) => k.nama === selectedDesa.kelurahan
              );

              if (kelurahan?.id) {
                setFormData((prev) => ({
                  ...prev,
                  kelurahan: kelurahan.id,
                  kelurahanNama: selectedDesa.kelurahan || "",
                }));
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDesa]);

  const fetchKecamatan = async (kabupatenIdIbnu) => {
    try {
      const res = await axios.get(
        `https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenIdIbnu}.json`
      );
      setKecamatanList(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchKelurahan = async (kecamatanId) => {
    try {
      const res = await axios.get(
        `https://ibnux.github.io/data-indonesia/kelurahan/${kecamatanId}.json`
      );
      setKelurahanList(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Fungsi untuk mendapatkan koordinat dari Nominatim API
  const getCoordinatesFromAddress = async (address) => {
    try {
      setLoadingCoordinates(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Yogyakarta, Indonesia&limit=1`
      );
      
      if (response.data && response.data.length > 0) {
        return {
          latitude: response.data[0].lat,
          longitude: response.data[0].lon
        };
      }
      return { latitude: "", longitude: "" };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error("Gagal mendapatkan koordinat");
      return { latitude: "", longitude: "" };
    } finally {
      setLoadingCoordinates(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        kabupatenRef.current &&
        !kabupatenRef.current.contains(event.target)
      ) {
        setIsKabupatenOpen(false);
      }

      if (
        kecamatanRef.current &&
        !kecamatanRef.current.contains(event.target)
      ) {
        setIsKecamatanOpen(false);
      }

      if (
        kelurahanRef.current &&
        !kelurahanRef.current.contains(event.target)
      ) {
        setIsKelurahanOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Validasi khusus untuk latitude dan longitude
    if (name === "latitude" || name === "longitude") {
      // Hanya izinkan angka, minus, dan titik
      const isValid = /^-?\d*\.?\d*$/.test(value);
      if (!isValid && value !== "") return;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    // Untuk field number
    if (numberFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value, 10) || 0,
      }));
      return;
    }

    // Untuk field kabupaten
    if (name === "kabupaten_kota") {
      const selectedKabupaten = kabupatenList.find((k) => k.id === value);
      const formattedName = formatKabupatenName(selectedKabupaten?.nama || "");

      setFormData((prev) => ({
        ...prev,
        kabupaten_kota: value, // Ganti dari 'kabupaten'
        kabupatenNama: formattedName,
        kecamatan: "",
        kecamatanNama: "",
        kelurahan: "",
        kelurahanNama: "",
      }));

      // Reset kecamatan dan kelurahan
      setKecamatanList([]);
      setKelurahanList([]);

      // Load kecamatan baru
      if (value) {
        fetchKecamatan(value); // Parameter tetap 'value' (kabupatenIdIbnu)
      }
      return;
    }

    // Untuk field kecamatan
    if (name === "kecamatan") {
      const selectedKecamatan = kecamatanList.find((k) => k.id === value);
      setFormData((prev) => ({
        ...prev,
        kecamatan: value,
        kecamatanNama: selectedKecamatan?.nama || "",
        kelurahan: "",
        kelurahanNama: "",
      }));

      // Reset kelurahan
      setKelurahanList([]);

      // Load kelurahan baru
      if (value) {
        fetchKelurahan(value);
      }
      return;
    }

    // Untuk field kelurahan
    if (name === "kelurahan") {
      const selectedKelurahan = kelurahanList.find((k) => k.id === value);
      const kelurahanName = selectedKelurahan?.nama || "";
      
      setFormData((prev) => ({
        ...prev,
        kelurahan: value,
        kelurahanNama: kelurahanName,
        latitude: "", // Reset while loading
        longitude: "" // Reset while loading
      }));
    
      if (value && kelurahanName) {
        try {
          setLoadingCoordinates(true);
          
          const kecamatanName = kecamatanList.find(k => k.id === formData.kecamatan)?.nama || "";
          const kabupatenName = kabupatenList.find(k => k.id === formData.kabupaten_kota)?.nama || "";
          
          // Format address for better geocoding results
          const fullAddress = `Kelurahan ${kelurahanName}, Kecamatan ${kecamatanName}, ${kabupatenName}, Daerah Istimewa Yogyakarta, Indonesia`;
          
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
          );
          
          if (response.data && response.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              latitude: response.data[0].lat,
              longitude: response.data[0].lon
            }));
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
          toast.error("Gagal mendapatkan koordinat otomatis. Silakan isi manual.");
        } finally {
          setLoadingCoordinates(false);
        }
      }
      return;
    }

    // Untuk field lainnya
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const requiredFields = {
      'nama': 'Nama Kelompok Desa',
      'kabupaten_kota': 'Kabupaten/Kota',
      'kecamatan': 'Kecamatan',
      'kelurahan': 'Kelurahan',
      'tanggal_pembentukan': 'Tanggal Pembentukan',
     
    };
  
    for (const [field, name] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        toast.error(`${name} harus diisi`, { position: "top-right" });
        return;
      }
    }

    const formattedKabupaten = formatKabupatenName(formData.kabupatenNama);

    const {
      jumlah_anggota_sekarang,
      jumlah_dana_sekarang,
      latitude,
      longitude,
    } = formData;

    // Tentukan kabupatenId berdasarkan nama kabupaten yang dipilih
    const kabupatenMapping = {
      "KAB. SLEMAN": 1,
      "KAB. BANTUL": 2,
      "KOTA YOGYAKARTA": 3,
      "KAB. KULON PROGO": 4,
      "KAB. GUNUNGKIDUL": 5,
    };

    const kabupatenId = kabupatenMapping[formData.kabupatenNama];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Tambah 1 hari (besok)
    tomorrow.setHours(0, 0, 0, 0); // Hilangkan bagian waktu

    const selectedDate = new Date(formData.tanggal_pembentukan);

    // Validasi: tanggal pembentukan tidak boleh lebih dari besok
    if (selectedDate > tomorrow) {
      console.log("Tanggal tidak boleh lebih dari hari ini.");
    }

    // Reset error messages
    setCoordinateError({
      latitude: "",
      longitude: "",
    });

    // Validasi koordinat sebelum submit
    const latRegex = /^-?\d{1,3}\.\d+$/;
    const lngRegex = /^-?\d{1,3}\.\d+$/;

    let isValid = true;
    const newErrors = {
      latitude: "",
      longitude: "",
    };

    if (!latRegex.test(formData.latitude)) {
      newErrors.latitude = "Format latitude tidak valid. Contoh: -7.9902294";
      isValid = false;
    }

    if (!lngRegex.test(formData.longitude)) {
      newErrors.longitude = "Format longitude tidak valid. Contoh: 110.8318301";
      isValid = false;
    }

    if (!isValid) {
      setCoordinateError(newErrors);
      return;
    }

    // Categorize based on the rules
    let kategori = "";

    if (
      jumlah_anggota_sekarang >= 25 &&
      jumlah_anggota_sekarang <= 30 &&
      jumlah_dana_sekarang >= 20000000 &&
      jumlah_dana_sekarang <= 30000000
    ) {
      kategori = "Tumbuh";
    } else if (
      jumlah_anggota_sekarang >= 31 &&
      jumlah_anggota_sekarang <= 35 &&
      jumlah_dana_sekarang > 30000000 &&
      jumlah_dana_sekarang <= 40000000
    ) {
      kategori = "Berkembang";
    } else if (
      jumlah_anggota_sekarang > 35 &&
      jumlah_dana_sekarang > 40000000
    ) {
      kategori = "Maju";
    } else {
      kategori = "Tumbuh";
    }

    const updatedFormData = {
      ...formData,
      kategori,
      kabupatenId: kabupatenId,
      kabupaten_kota: formData.kabupatenNama, // Kirimkan nama Kabupaten
      kecamatan: formData.kecamatanNama, // Kirimkan nama Kecamatan
      kelurahan: formData.kelurahanNama, // Kirimkan nama Kelurahan
      latitude: formData.latitude, // Konversi latitude ke float
      longitude: formData.longitude, // Konversi longitude ke float
    };

    try {
      if (selectedDesa) {
        // Edit data desa
        await axios.put(
          `http://localhost:5000/api/desa/${selectedDesa.id}`,
          updatedFormData
        );
        toast.success(`Data desa ${formData.nama} berhasil diubah!`, {
          position: "top-right",
        });
      } else {
        // Add new desa
        await axios.post("http://localhost:5000/api/desa", updatedFormData);
        toast.success(`Data desa ${formData.nama} berhasil ditambahkan!`, {
          position: "top-right",
        });
      }

      setCategoryNotification(`Kategori Desa: ${kategori}`);
      setShowCategoryNotification(true);

      setTimeout(() => setShowCategoryNotification(false), 3000);

      setFormData({
        nama: "",
        kabupatenId: "",
        kabupaten_kota: "",
        kabupatenNama: "",
        kecamatan: "",
        kecamatanNama: "",
        kelurahan: "",
        kelurahanNama: "",
        tanggal_pembentukan: "",
        jumlah_hibah_diterima: "",
        jumlah_dana_sekarang: "",
        jumlah_anggota_awal: "",
        jumlah_anggota_sekarang: "",
        status: "Pending",
        catatan: "",
        latitude: "",
        longitude: "",
      });

      onClose(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan dalam proses penyimpanan data.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center text-left z-50 p-4">
      {loading ? (
        <div className="flex items-center justify-center">
          <Audio type="Bars" color="#542d48" height={80} width={80} />
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
            {selectedDesa ? "Edit Data" : "Tambah Data Kelompok Desa"}
          </h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="flex space-x-4 mb-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900">
                    Nama Kelompok Desa
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.nama === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan nama kelompok desa
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.nama === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900">
                    Tanggal Pembentukan
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.tanggal_pembentukan === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan tanggal pembentukan
                  </label>
                  <input
                    type="date"
                    name="tanggal_pembentukan"
                    value={formData.tanggal_pembentukan}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Set max date ke hari ini
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      (submitted && formData.tanggal_pembentukan === "") ||
                      dateError
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                  {dateError && (
                    <p className="mt-1 text-xs text-red-600">{dateError}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-2">
                <div ref={kabupatenRef} className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-900">
                    Kabupaten/Kota
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.kabupaten_kota === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Pilih kabupaten/kota
                  </label>

                  {selectedDesa || getKabupatenFromURL() ? (
                    // Mode Edit atau dari URL - Tampilkan input readonly
                    <input
                      type="text"
                      readOnly
                      value={formData.kabupatenNama}
                      className="cursor-not-allowed block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm"
                    />
                  ) : (
                    // Mode Tambah - Tampilkan dropdown select
                    <select
                      name="kabupaten_kota"
                      onChange={handleChange}
                      className={`custom-select block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                        submitted && formData.kabupaten_kota === ""
                          ? "ring-2 ring-inset ring-red-600"
                          : "ring-1 ring-inset ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                      value={formData.kabupaten_kota}
                    >
                      <option value="" disabled>
                        Pilih Kabupaten/Kota
                      </option>
                      {kabupatenList.map((kabupaten) => (
                        <option key={kabupaten.id} value={kabupaten.id}>
                          {kabupaten.nama}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* Kecamatan */}
                <div ref={kecamatanRef} className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-900">
                    Kecamatan
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.kecamatan === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Pilih kecamatan
                  </label>
                  <select
                    name="kecamatan"
                    onChange={handleChange}
                    className={`custom-select block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.kecamatan === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                    value={
                      formData.kecamatan === ""
                        ? "Pilih Kecamatan"
                        : formData.kecamatan
                    }
                    disabled={!formData.kabupaten_kota}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {kecamatanList.map((kecamatan) => (
                      <option key={kecamatan.id} value={kecamatan.id}>
                        {kecamatan.nama}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Kelurahan */}
                <div ref={kelurahanRef} className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-900">
                    Kelurahan
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.kelurahan === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Pilih Kelurahan
                  </label>
                  <select
                    name="kelurahan"
                    onChange={handleChange}
                    className={`custom-select block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.kelurahan === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                    value={
                      formData.kelurahan === ""
                        ? "Pilih kelurahan"
                        : formData.kelurahan
                    }
                    disabled={!formData.kecamatan}
                  >
                    <option value="">Pilih kelurahan</option>
                    {kelurahanList.map((kelurahan) => (
                      <option key={kelurahan.id} value={kelurahan.id}>
                        {kelurahan.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mb-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900">
                    Jumlah Hibah Diterima
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.jumlah_hibah_diterima === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tulikans jumlah hibah diterima
                  </label>
                  <input
                    id="jumlah_hibah_diterima"
                    name="jumlah_hibah_diterima"
                    type="number"
                    value={formData.jumlah_hibah_diterima}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.jumlah_hibah_diterima === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900">
                    Jumlah Dana Sekarang
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.jumlah_dana_sekarang === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan jumlah dana Sekarang
                  </label>
                  <input
                    id="jumlah_dana_sekarang"
                    type="number"
                    name="jumlah_dana_sekarang"
                    value={formData.jumlah_dana_sekarang}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.jumlah_dana_sekarang === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>
              </div>
              <div className="flex space-x-4 mb-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900">
                    Jumlah Anggota Awal
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.jumlah_anggota_awal === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan jumlah anggota awal
                  </label>
                  <input
                    id="jumlah_anggota_awal"
                    name="jumlah_anggota_awal"
                    type="number"
                    value={formData.jumlah_anggota_awal}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.jumlah_anggota_awal === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900">
                    Jumlah Anggota Sekarang
                  </label>
                  <label
                    className={`block text-xs ${
                      submitted && formData.jumlah_anggota_sekarang === ""
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    Tuliskan jumlah anggota sekarang
                  </label>
                  <input
                    id="jumlah_anggota_sekarang"
                    type="number"
                    name="jumlah_anggota_sekarang"
                    value={formData.jumlah_anggota_sekarang}
                    onChange={handleChange}
                    className={`cursor-pointer block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
                      submitted && formData.jumlah_anggota_sekarang === ""
                        ? "ring-2 ring-inset ring-red-600"
                        : "ring-1 ring-inset ring-gray-300"
                    }  placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
                  />
                </div>
              </div>

              {/* Latitude dan Longitude */}
              <div className="flex space-x-4 mb-2">
  {/* Latitude */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-900">
      Latitude
      {loadingCoordinates && (
        <span className="ml-2 text-xs text-blue-500">Mencari koordinat...</span>
      )}
    </label>
    <input
      type="text"
      name="latitude"
      value={formData.latitude}
      onChange={handleChange}
      readOnly={loadingCoordinates}
      className={`block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
        loadingCoordinates ? "bg-gray-100" : ""
      } ${
        coordinateError.latitude && submitted && formData.latitude
          ? "ring-2 ring-inset ring-red-600"
          : "ring-1 ring-inset ring-gray-300"
      } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
    />
  </div>

  {/* Longitude */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-900">
      Longitude
    </label>
    <input
      type="text"
      name="longitude"
      value={formData.longitude}
      onChange={handleChange}
      readOnly={loadingCoordinates}
      className={`block w-full rounded-md border-0 py-2 px-2 mt-1 text-gray-900 shadow-sm ${
        loadingCoordinates ? "bg-gray-100" : ""
      } ${
        submitted && formData.longitude && coordinateError.longitude 
          ? "ring-2 ring-inset ring-red-600"
          : "ring-1 ring-inset ring-gray-300"
      } placeholder:text-gray-400 focus:ring-inset focus:ring-secondary sm:text-sm`}
    />
    {/* ... error message tetap ... */}
  </div>
</div>
            </div>

            <div className="w-full flex justify-end">
              <button
                className="w-2/12 text-sm bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary"
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
          </form>
        </div>
      )}
    </div>
  );
};

export default KelompokModal;
