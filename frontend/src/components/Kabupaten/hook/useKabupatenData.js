import { useState, useEffect } from "react";
import axios from "axios";

// Setup axios interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const mapKabupatenName = (nama_kabupaten) => {
  const kabupatenMapping = {
    "Kulon Progo": "KAB. KULON PROGO",
    Sleman: "KAB. SLEMAN",
    Bantul: "KAB. BANTUL",
    "Kota Yogyakarta": "KOTA YOGYAKARTA",
    Gunungkidul: "KAB. GUNUNGKIDUL",
  };

  return kabupatenMapping[nama_kabupaten] || nama_kabupaten;
};

const useKabupatenData = () => {
  const [allKabupaten, setAllKabupaten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const calculatePeriod = (desaData) => {
    const validDates = desaData
      .map((desa) => {
        try {
          return desa.tanggal_pembentukan ? new Date(desa.tanggal_pembentukan) : null;
        } catch {
          return null;
        }
      })
      .filter((date) => date && !isNaN(date.getTime()));
  
    if (validDates.length === 0) return { start: null, end: null };
  
    const formatDate = (date) => 
      date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
  
    return {
      start: formatDate(new Date(Math.min(...validDates.map((d) => d.getTime())))),
      end: formatDate(new Date(Math.max(...validDates.map((d) => d.getTime())))),
    };
  };

  const fetchAllKabupaten = async () => {
    try {
      setLoading(true);

      
      // 1. Ambil daftar semua kabupaten
      const kabupatenResponse = await axios.get(
        "http://localhost:5000/api/kabupaten"
      );
      const kabupatenList = kabupatenResponse.data;

      // 2. Untuk setiap kabupaten, ambil data desa dan hitung periode
      const kabupatenWithPeriod = await Promise.all(
        kabupatenList.map(async (kab) => {
          const mappedName = mapKabupatenName(kab.nama_kabupaten);
          const desaResponse = await axios.get(
            `http://localhost:5000/api/desa?kabupaten=${mappedName}`
          );

          const period = calculatePeriod(desaResponse.data);

          return {
            ...kab,
            tanggal_awal: period.start,
            tanggal_akhir: period.end,
            counts: {
              maju: 0, // Isi dengan data aktual jika diperlukan
              berkembang: 0,
              tumbuh: 0,
            },
          };
        })
      );

      setAllKabupaten(kabupatenWithPeriod);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching kabupaten data:", err);
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllKabupaten();
  }, []);

  return {
    allKabupaten,
    loading,
    error,
    refetch: fetchAllKabupaten,
  };
};

export default useKabupatenData;
