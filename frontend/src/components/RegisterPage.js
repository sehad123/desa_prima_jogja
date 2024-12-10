import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); // To store error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to the server
      const response = await axios.post("http://localhost:5000/users/register", formData);

      // Show success toast notification
      toast.success("Registrasi berhasil! Silakan login.", {
        position: "top-right", // Position the toast in the top-right corner
        autoClose: 3000, // Auto-close after 3 seconds
        hideProgressBar: true, // Hide the progress bar
      });

      setError(""); // Clear any existing error messages
      setTimeout(() => navigate("/"), 2000); // Navigate to login after 2 seconds
    } catch (err) {
      // Show error toast notification
      toast.error("Registrasi gagal. Pastikan data yang Anda masukkan benar.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });

      setError("Registrasi gagal. Pastikan data yang Anda masukkan benar.");
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
            <label className="block text-gray-700 mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
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

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
