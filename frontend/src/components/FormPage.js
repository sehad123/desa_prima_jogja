import React, { useState } from "react";
import axios from "axios";

const FormPage = () => {
  const [formData, setFormData] = useState({
    nama_desa: "",
    tahun_pembentukan: "",
    jumlah_hibah_diterima: "",
    jumlah_dana_sekarang: "",
    jumlah_anggota_awal: "",
    jumlah_anggota_sekarang: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { nama_desa, ...predictData } = formData;
      const response = await axios.post("http://127.0.0.1:5000/predict", predictData);
      const categories = ["Berkembang", "Maju", "Tumbuh"];
      const interpretedResult = categories[response.data.kategori];
      setResult(`Desa ${nama_desa} termasuk kategori: ${interpretedResult}`);
    } catch (error) {
      console.error("Error:", error);
      setResult("Terjadi kesalahan dalam prediksi. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Form Prediksi</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Desa</label>
            <input type="text" name="nama_desa" value={formData.nama_desa} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          {Object.keys(formData)
            .filter((key) => key !== "nama_desa")
            .map((key) => (
              <div className="mb-4" key={key}>
                <label className="block text-gray-700 mb-2 capitalize">{key.replace(/_/g, " ")}</label>
                <input type="number" name={key} value={formData[key]} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
              </div>
            ))}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Prediksi
          </button>
        </form>
        {result && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">{result}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;
