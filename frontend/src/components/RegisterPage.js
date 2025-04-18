import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nip: "",
    role: "Pegawai", // Default value for role
  });
  const [error, setError] = useState(""); // To store error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi input di frontend
    if (!formData.nip || isNaN(formData.nip) || formData.nip <= 0) {
      toast.error("NIP harus berupa angka positif.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/users/register", formData);

      toast.success("Registrasi berhasil! Silakan login.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registrasi gagal.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Registrasi</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">NIP</label>
            <input
              type="number" // Input hanya menerima angka
              name="nip"
              value={formData.nip}
              onChange={
                (e) => setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || "" }) // Konversi ke integer
              }
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded" required>
              <option value="Pegawai">Pegawai</option>
              <option value="Ketua Forum">Ketua Forum</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Registrasi
          </button>
        </form>
        <p className="mt-4 text-center">
          Sudah punya akun?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
