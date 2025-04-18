import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const useDesaData = (kabupatenName) => {
  const { id } = useParams();
  const [desa, setDesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [galeri, setGaleri] = useState([]);
  const [produk, setProduk] = useState([]);
  const [pengurus, setPengurus] = useState([]);
  const [notulensi, setNotulensi] = useState([]);
  const [error, setError] = useState(null);
  const [desaList, setDesaList] = useState([]);

  // Fungsi generic untuk fetch data
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/desa/${id}/${endpoint}`);
      setter(response.data);
      return true;
    } catch (err) {
      console.error(`Gagal memuat ${endpoint}`, err);
      return false;
    }
  };

  const fetchDesaData = async (kabupatenName) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      let response;
      if (kabupatenName) {
        response = await axios.get(
          `http://localhost:5000/api/desa/kabupaten/${kabupatenName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.get("http://localhost:5000/api/desa", {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const desaListWithDetails = await Promise.all(
        response.data.map(async (desa) => {
          const [produk, pengurus] = await Promise.all([
            axios.get(`http://localhost:5000/api/desa/${desa.id}/produk`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`http://localhost:5000/api/desa/${desa.id}/pengurus`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
          ]);
          return { ...desa, produk: produk.data, pengurus: pengurus.data };
        })
      );

      setDesaList(desaListWithDetails);
    } catch (err) {
      console.error("Gagal memuat data desa:", err);
      setError("Gagal memuat data desa");
    } finally {
      setLoading(false);
    }
  };

  // Fetch semua data sekaligus
  const fetchAllData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch profil dan data desa terlebih dahulu
      await Promise.all([fetchDesaData()]);
      
      if (id) {
        const desaResponse = await axios.get(`http://localhost:5000/api/desa/${id}`);
        setDesa(desaResponse.data);
        
        // Fetch data lainnya secara paralel
        await Promise.all([
          fetchData('galeri', setGaleri),
          fetchData('produk', setProduk),
          fetchData('pengurus', setPengurus),
          fetchData('notulensi', setNotulensi)
        ]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch data berdasarkan tab yang aktif
  const fetchDataByTab = async (tab) => {
    switch (tab) {
      case "Galeri":
        await fetchData('galeri', setGaleri);
        break;
      case "Notulensi / Materi":
        await fetchData('notulensi', setNotulensi);
        break;
      case "Produk":
        await fetchData('produk', setProduk);
        break;
      case "Pengurus":
        await fetchData('pengurus', setPengurus);
        break;
      default:
        break;
    }
  };

  // Inisialisasi data saat pertama kali load
  useEffect(() => {
    fetchAllData();
  }, [id]);

  return { 
    desa,
    desaList,
    galeri,
    produk,
    pengurus,
    notulensi,
    loading,
    loadingData,
    error,
    fetchDesaData,
    fetchDesaDetail: () => fetchData('', setDesa),
    fetchGaleri: () => fetchData('galeri', setGaleri),
    fetchProduk: () => fetchData('produk', setProduk),
    fetchPengurus: () => fetchData('pengurus', setPengurus),
    fetchNotulensi: () => fetchData('notulensi', setNotulensi),
    fetchDataByTab,
    refetchAll: fetchAllData
  };
};

export default useDesaData;