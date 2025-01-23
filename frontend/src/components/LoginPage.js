import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // To store error messages
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      // Send login data to the server
      const response = await axios.post("http://localhost:5000/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, email, role, nip } = response.data;

      // Save token, email, and role to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userEmail", nip);
      localStorage.setItem("userRole", role);

      // Show success toast notification
      toast.success("Login berhasil!", {
        position: "top-right", // Position the toast in the top-right corner
        autoClose: 3000, // Auto-close after 3 seconds
        hideProgressBar: true, // Hide the progress bar
      });

      // Navigate to the target page after successful login
      // navigate("/beranda"); // Replace with your target page after login
      // navigate("/kabupaten-page"); // Replace with your target page after login
      navigate("/peta-desa"); // Replace with your target page after login
    } catch (error) {
      // Handle error, show error toast notification
      if (error.response && error.response.status === 401) {
        // Unauthorized error (incorrect email or password)
        toast.error("Email atau password salah. Silakan coba lagi.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        // Other errors (e.g., network error)
        toast.error("Terjadi kesalahan, periksa koneksi internet Anda.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Belum punya akun?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate("/register")}>
            Daftar
          </span>
        </p>
      </div>

      {/* Toast Container for the notifications */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
