// hooks/useProvinsiData.js
import { useState, useEffect } from "react";
import axios from "axios";

const useProvinsiData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: {
      kelompokDesa: [],
      provinsi: null,
      kabupatenData: [],
      kecamatanList: [],
      selectedKabupaten: "",
    },
  });

  const fetchKabupatenData = async () => {
    try {
      const response = await axios.get(
        "https://ibnux.github.io/data-indonesia/kabupaten/34.json"
      );
      return response.data;
    } catch (err) {
      console.error("Gagal memuat data kabupaten:", err);
      return [];
    }
  };

  const fetchKecamatan = async (kabupatenId) => {
    try {
      const response = await axios.get(
        `https://ibnux.github.io/data-indonesia/kecamatan/${kabupatenId}.json`
      );
      return response.data;
    } catch (err) {
      console.error("Gagal memuat data kecamatan:", err);
      return [];
    }
  };

  const fetchProvinsiData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch data in parallel
      const [kabupatenRes, desaRes, produkRes, ibnuKabupatenData] =
        await Promise.all([
          axios.get("http://localhost:5000/api/kabupaten", { headers }),
          axios.get("http://localhost:5000/api/desa", { headers }),
          axios.get("http://localhost:5000/produk/total-produk", { headers }),
          fetchKabupatenData(),
        ]);

      // Process kabupaten data
      const kabupatenData = kabupatenRes.data || [];
      const totalJumlahDesa = kabupatenData.reduce(
        (sum, kabupaten) => sum + (kabupaten.jumlah_desa || 0),
        0
      );

      // Process desa data
      const kelompokDesaData = Array.isArray(desaRes.data)
        ? desaRes.data
        : desaRes.data?.data || [];

      const jumlahMaju = kelompokDesaData.filter(
        (d) => d.kategori === "Maju"
      ).length;
      const jumlahBerkembang = kelompokDesaData.filter(
        (d) => d.kategori === "Berkembang"
      ).length;
      const jumlahTumbuh = kelompokDesaData.filter(
        (d) => d.kategori === "Tumbuh"
      ).length;
      const totalAnggota = kelompokDesaData.reduce(
        (sum, desa) => sum + (desa.jumlah_anggota_sekarang || 0),
        0
      );

      // Process dates
      const dateDisplay =
        validDates.length > 0
          ? {
              startDate: new Date(
                Math.min(...validDates.map((d) => d.getTime()))
              ),
              endDate: new Date(
                Math.max(...validDates.map((d) => d.getTime()))
              ),
            }
          : {
              startDate: "-",
              endDate: "-",
            };

      // Process produk data
      const produkData = produkRes.data?.data || {};
      const produkPerDesa = produkData.totalProduk || {};

      setState({
        loading: false,
        error: null,
        data: {
          kelompokDesa: kelompokDesaData,
          provinsi: {
            desaMaju: jumlahMaju,
            desaBerkembang: jumlahBerkembang,
            desaTumbuh: jumlahTumbuh,
            jumlah_desa: totalJumlahDesa,
            tanggal_awal: dateDisplay.startDate, // Ini akan berupa Date object atau "-"
            tanggal_akhir: dateDisplay.endDate, // Ini akan berupa Date object atau "-"
            jumlahAnggota: totalAnggota,
            totalJumlahKelompok: jumlahMaju + jumlahBerkembang + jumlahTumbuh,
            produkPerDesa,
          },
          kabupatenData: ibnuKabupatenData,
          kecamatanList: [],
          selectedKabupaten: "",
        },
      });

      setError(null);
    } catch (err) {
      console.error("Gagal memuat data provinsi:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKabupaten = async (kabupatenId) => {
    try {
      const kecamatanData = await fetchKecamatan(kabupatenId);
      setState((prev) => ({
        ...prev,
        kecamatanList: kecamatanData,
        selectedKabupaten: kabupatenId,
      }));
    } catch (err) {
      console.error("Gagal memuat data kecamatan:", err);
    }
  };

  useEffect(() => {
    fetchProvinsiData();
  }, []);

  return {
    ...state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchProvinsiData,
    selectKabupaten: handleSelectKabupaten,
  };
};

export default useProvinsiData;
