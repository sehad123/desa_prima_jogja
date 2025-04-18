import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const useDesaData = (kabupatenName) => {
  const { id } = useParams();
  const [desa, setDesa] = useState({ nama: [] });
  const [loading, setLoading] = useState(true);
  const [galeri, setGaleri] = useState([]);
  const [produk, setProduk] = useState([]);
  const [pengurus, setPengurus] = useState([]);
  const [notulensi, setNotulensi] = useState([]);
  const [error, setError] = useState(null);
  const [desaList, setDesaList] = useState([]);

  const handleError = useCallback((err, context) => {
    console.error(`Error in ${context}:`, err);
    setError(err.response?.data?.message || `Gagal memuat ${context}`);
    return null;
  }, []);

  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan");
        return false;
      }

      const response = await axios.get(
        `http://localhost:5000/api/desa/${id}/${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setter(response.data);
      return true;
    } catch (err) {
      handleError(err, endpoint);
      return false;
    }
  }, [id, handleError]);

  const fetchDesaData = useCallback(async (kabupaten_kota) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan");
        return;
      }
      
      // Gunakan parameter kabupaten_kota jika ada
      let url = 'http://localhost:5000/api/desa';
      if (kabupaten_kota) {
        url += `?kabupaten=${encodeURIComponent(kabupaten_kota)}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDesaList(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data desa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      fetchDesaData(kabupatenName);
    }
  }, [id, kabupatenName, fetchDesaData]);

  const fetchDesaDetail = useCallback(async () => {
    try {
      if (!id) return;

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan");
        return;
      }

      const [desaResponse, galeriResponse, produkResponse, pengurusResponse, notulensiResponse] = 
        await Promise.all([
          axios.get(`http://localhost:5000/api/desa/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/desa/${id}/galeri`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/desa/${id}/produk`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/desa/${id}/pengurus`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/desa/${id}/notulensi`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

      setDesa({
        ...desaResponse.data,
        nama: desaResponse.data.nama || []
      });
      setGaleri(galeriResponse.data);
      setProduk(produkResponse.data);
      setPengurus(pengurusResponse.data);
      setNotulensi(notulensiResponse.data);
    } catch (err) {
      handleError(err, "detail desa");
      setDesa({ nama: [] });
      setGaleri([]);
      setProduk([]);
      setPengurus([]);
      setNotulensi([]);
    }
  }, [id, handleError]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (id) {
          await fetchDesaDetail();
        } else {
          await fetchDesaData(kabupatenName);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, kabupatenName, fetchDesaDetail, fetchDesaData]);

  return { 
    desa,
    desaList,
    galeri,
    produk,
    pengurus,
    notulensi,
    loading,
    error,
    fetchDesaData,
    fetchDesaDetail,
    fetchGaleri: () => fetchData('galeri', setGaleri),
    fetchProduk: () => fetchData('produk', setProduk),
    fetchPengurus: () => fetchData('pengurus', setPengurus),
    fetchNotulensi: () => fetchData('notulensi', setNotulensi),
    refetchAll: id ? fetchDesaDetail : () => fetchDesaData(kabupatenName)
  };
};

export default useDesaData;