import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "../page/Login";
import { Audio } from "react-loader-spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // To store error messages
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // New state for selected draft
  
    const location = useLocation();

    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('logoutSuccess') === 'true') {
        toast.success('Berhasil Logout dari Sistem Desa Prima', {
          id: 'logout-success' // ID unik
        });
        window.history.replaceState({}, document.title, "/");
      }
    }, [location]);

   useEffect(() => {
      const storedErrorMessage = localStorage.getItem("errorMessages");
      if (storedErrorMessage) {
        setErrorMessage(storedErrorMessage);
        setShowErrorNotification(true);
      }
  
      return () => {
        localStorage.removeItem("errorMessages");
      };
    }, []);
  
    useEffect(() => {
      const storedSuccessMessage = localStorage.getItem("successMessages");
      if (storedSuccessMessage) {
        setSuccessMessage(storedSuccessMessage);
        setShowSuccessNotification(true);
      }
  
      return () => {
        localStorage.removeItem("successMessages");
      };
    }, []);
  
    const handleClose = () => {
      setShowErrorNotification(false);
      localStorage.removeItem("errorMessages");
      setShowSuccessNotification(false);
      localStorage.removeItem("successMessages");
    };

    const emailInputRef = useRef(null);
      const passwordInputRef = useRef(null);
    
      const focusEmailInput = () => {
        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
      };
    
      const focusPasswordInput = () => {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      };

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(
        `http://localhost:5000/users/login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // Timeout 5 detik
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.error || 'Login gagal');
      }
  
      const { token, user } = response.data;
  
      // Simpan ke localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('showLoginToast', 'true');
      
      // Redirect berdasarkan role
      if (user.role === 'Ketua Forum' && user.kabupatenId) {
        navigate(`/kabupaten-dashboard/${user.kabupatenName}`);
      } else {
        navigate('/provinsi-dashboard');
      }
  
    } catch (error) {
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      
      if (error.response) {
        // Error dari server
        errorMessage = error.response.data?.error || errorMessage;
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        // Tidak ada response dari server
        errorMessage = 'Tidak dapat terhubung ke server. Cek koneksi internet Anda.';
      } else {
        // Error lainnya
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  <Login>
  <div className="sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="/images/logo_diy.png"
            alt="DP3AP DIY"
          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            SISTEM DESA PRIMA
          </h2>
          <p className="text-center text-lg">DP3AP Provinsi Yogyakarta</p>
        </div>

        <div className="mt-5 w-full items-center">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Audio type="Bars" color="#542d48" height={80} width={80} />
                    </div>
                  ) : (
                    <form className="space-y-6" method="POST" onSubmit={handleLogin}>
                      {error && (
                        <p className="text-center text-red-600 text-sm">
                          Email atau Password Salah
                        </p>
                      )}
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email 
                        </label>
                        <div className="mt-2 relative flex items-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 border-r border-gray-400 pr-2"
                            onClick={focusEmailInput}
                          />
                          <input
                            id="email"
                            name="email"
                            type="text"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            ref={emailInputRef}
                            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Password
                          </label>
                          {/* <div className="text-sm">
                            <a
                              href="/forgot"
                              className="font-semibold text-secondary hover:text-purple-600"
                            >
                              Lupa password?
                            </a>
                          </div> */}
                        </div>
                        <div className="mt-2 relative">
                          <FontAwesomeIcon
                            icon={faLock}
                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 border-r border-gray-400 pr-2"
                            onClick={focusPasswordInput}
                          />
                          <input
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            ref={passwordInputRef}
                            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                          />
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                          />
                        </div>
                      </div>
        
                      <div>
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-md bg-purple-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                        >
                          Masuk
                        </button>
                      </div>
                    </form>
                  )}
                </div>
  </Login>
  </>
  );
};

export default LoginPage;
