import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import useMediaQuery from "../useMediaQuery";
import DashboardComponent from "../Dashboard/DashboardComponent";
import Header from "../Dashboard/HeaderDashboard";

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

const KabupatenDashboard = () => {
  const { nama_kabupaten } = useParams();
  const [profil, setProfil] = useState({});
  const [kabupaten, setKabupaten] = useState({
    jumlah_maju: 0,
    jumlah_berkembang: 0,
    jumlah_tumbuh: 0,
    jumlah_desa: 0,
    periode_awal: new Date(),
    periode_akhir: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [desaList, setDesaList] = useState([]);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfil(response.data);
      } catch (error) {
        console.error(
          "Gagal mengambil profil:",
          error.response?.data?.error || error.message
        );
      }
    };

    fetchProfil();
  }, []);

  useEffect(() => {
    const fetchKabupatenDetail = async () => {
      try {
        const kabupatenResponse = await axios.get(
          `http://localhost:5000/api/kabupaten/detail/${nama_kabupaten}`
        );

        // Cek apakah respons valid
        if (!kabupatenResponse.data) {
          throw new Error("Data kabupaten tidak ditemukan");
        }

        console.log("Data kabupaten dari API:", kabupatenResponse.data); // Log data dari API

        const kabupatenData = kabupatenResponse.data;

        // Map nama kabupaten ke format yang diinginkan
        const mappedNamaKabupaten = mapKabupatenName(
          kabupatenData.nama_kabupaten
        );
        console.log("Mapped Nama Kabupaten:", mappedNamaKabupaten);

        // Ambil data desa berdasarkan kabupaten
        const desaResponse = await axios.get(
          `http://localhost:5000/api/desa?kabupaten=${mappedNamaKabupaten}`
        );
        const desaData = desaResponse.data;
        console.log("Data desa dari API:", desaData);

        setDesaList(desaData);

        const validDates = desaData
          .map((desa) =>
            desa.tanggal_pembentukan ? new Date(desa.tanggal_pembentukan) : null
          )
          .filter((date) => date !== null && !isNaN(date.getTime()));

        let startDate, endDate;

        if (validDates.length > 0) {
          startDate = new Date(
            Math.min(...validDates.map((date) => date.getTime()))
          );
          endDate = new Date(
            Math.max(...validDates.map((date) => date.getTime()))
          );
        } else {
          startDate = new Date(kabupatenData.periode_awal);
          endDate = new Date(kabupatenData.periode_akhir);
        }

        const categories = ["maju", "berkembang", "tumbuh"];
        const countData = {};

        for (const category of categories) {
          try {
            const mappedNamaKabupatenKategori = mapKabupatenName(
              kabupatenData.nama_kabupaten
            );
            const response = await axios.get(
              `http://localhost:5000/api/desa/count/${mappedNamaKabupatenKategori}/${category}`
            );
            countData[category] = response.data.count || 0;
          } catch (err) {
            console.error(`Gagal memuat data untuk kategori ${category}`, err);
            countData[category] = 0;
          }
        }

        const anggotaResponse = await axios.get(
          `http://localhost:5000/api/desa/anggota/${mappedNamaKabupaten}`
        );
        const anggotaData = anggotaResponse.data;
        const jumlahAnggota = anggotaData.data.anggotaPerKab;
        console.log("Data anggota dari API:", jumlahAnggota);

        const produkResponse = await axios.get(
          `http://localhost:5000/api/desa/total-produk-per-kabupaten/${mappedNamaKabupaten}`
        );
        const produkData = produkResponse.data.data; // Ambil data dari respons
        const produkPerDesa = produkData.totalProduk; // Ambil objek produk per desa
        console.log("Data produk dari API:", produkPerDesa);

        const desaMaju = countData.maju;
        const desaBerkembang = countData.berkembang;
        const desaTumbuh = countData.tumbuh;
        const totalJumlahKelompok = desaMaju + desaBerkembang + desaTumbuh;

        setKabupaten({
          ...kabupatenData,
          tanggal_awal: startDate,
          tanggal_akhir: endDate,
          desaMaju,
          desaBerkembang,
          desaTumbuh,
          totalJumlahKelompok,
          jumlahAnggota,
          produkPerDesa,
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat detail kabupaten", err);
        if (err.response) {
          console.error("Response error:", err.response.data); // Tampilkan data error dari backend
          setError(
            `Gagal memuat data kabupaten: ${
              err.response.data.error || err.message
            }`
          );
        } else {
          setError(`Gagal memuat data kabupaten: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchKabupatenDetail();
  }, [nama_kabupaten]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Audio type="Bars" color="#542d48" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <>
       <Header profil={profil}/>
      <div className="p-5">
        <DashboardComponent 
          data={kabupaten} lineChartData={desaList} profil={profil}
        />
      </div>
    </>
  );
};

export default KabupatenDashboard;
