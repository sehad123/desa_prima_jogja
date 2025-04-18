import { useState, useEffect } from "react";
import axios from "axios";

const kabupatenMapping = {
  1: "KAB. BANTUL",
  2: "KAB. SLEMAN",
  3: "KAB. KULON PROGO",
  4: "KAB. GUNUNGKIDUL",
  5: "KOTA YOGYAKARTA",
};

const useUserData = () => {
  const [state, setState] = useState({
    profil: {
      nip: '',
      email: '',
      name: '',
      role: '',
      kabupatenId: null,
      nama_kabupaten: ''
    },
    userList: [],
    loading: true,
    error: null
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const [profileRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/users/list", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setState({
        profil: {
          ...profileRes.data,
          nama_kabupaten: kabupatenMapping[profileRes.data.kabupatenId] || ''
        },
        userList: usersRes.data.map(user => ({
          ...user,
          nama_kabupaten: kabupatenMapping[user.kabupatenId] || ' '
        })),
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...state,
    refresh: fetchData
  };
};

export default useUserData;