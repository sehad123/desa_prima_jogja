import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";

dayjs.locale("id");

const Header = () => {
  const [time, setTime] = useState(dayjs());
  const [profil, setProfil] = useState({});

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfil(response.data); // Set nama dan NIP ke state
      } catch (error) {
        console.error("Gagal mengambil profil:", error.response?.data?.error || error.message);
      }
    };

    fetchProfil();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000); // Update setiap detik

    return () => clearInterval(interval);
  }, []);

  const today = time.format("dddd, DD MMMM YYYY, HH:mm:ss");

  return (
    <>
      <div className="flex flex-col bg-white md:flex-row justify-between items-center p-4 md:p-12 md:py-8 shadow">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-2xl font-bold">Selamat datang!</h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-500 text-4xl mb-2 md:mb-0 md:mr-4" />
            <div className="text-center md:text-left">
              <p className="font-semibold">{profil.name}</p>
              <p className="text-gray-600">{profil.nip || "NIP tidak tersedia"}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-10">
          <div className="text-center md:text-right mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 text-4xl mb-2 md:mb-0 md:mr-4" />
              <div className="text-center md:text-left">
                <p className="font-semibold">{today.split(",")[0]}</p> <p className="text-gray-600">{today.split(",")[1]}</p>{" "}
              </div>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0 md:ml-4">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-500 text-4xl mb-2 md:mb-0 md:mr-4" />
              <div className="text-center md:text-left">
                <p className="font-semibold">{today.split(",")[2]}</p> {/* <p className="text-gray-600">{today.split(",")[1]}</p>{" "} */}
                <p className="text-gray-600">WIB</p>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
