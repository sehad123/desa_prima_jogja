import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faFileAlt,
  faChartLine,
  faChartPie,
  faTasks,
  faArchive,
  faCalendarAlt,
  faUser,
  faClock,
  faLock,
  faSchoolCircleCheck,
  faSitemap,
  faPenToSquare,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";

import ErrorNotification from "../../components/Doktan/Modal/ErrorNotification";
import SuccessNotification from "../../components/Doktan/Modal/SuccessNotification";
dayjs.locale("id");

const ShortcutCard = ({
  icon,
  title,
  description,
  href,
  className,
  target,
}) => {
  return (
    <Link
      to={href}
      className={`bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition flex flex-col items-center h-52 justify-center ${className}`}
      target={target}
    >
      <FontAwesomeIcon icon={icon} className="text-4xl mb-2" />
      <h3 className="text-xl font-bold text-center">{title}</h3>
      <p className="text-center">{description}</p>
    </Link>
  );
};

const BerandaPage = () => {
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profil, setProfil] = useState([]);
  let navigate = useNavigate();
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [time, setTime] = useState(dayjs());
  useEffect(() => {
    const peran = localStorage.getItem("roles");
    setRole(peran);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000); // Update setiap detik

    return () => clearInterval(interval);
  }, []);

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

  const menuItems = [
    {
      name: "Dokumentasi Kegiatan",
      href: "/doktan",
      icon: faFileAlt,
      target: "",
      description: "Tinjau dan kelola dokumentasi kegiatan.",
    },
    {
      name: "Monjali",
      href: "/monitoring-evaluasi/dashboard",
      icon: faChartLine,
      target: "",
      description: "Monitoring Kerja dan Evaluasi",
      classname: role.includes("katim") ? "block" : "hidden",
    },
    {
      name: "Pembinaan Statistik Sektoral",
      href: "/coming-soon",
      icon: faChartPie,
      target: "",
      description: "Ikuti pembinaan statistik sektoral",
    },
    {
      name: "Timeline SAKIP",
      href: "http://s.bps.go.id/TIMELINESAKIP",
      icon: faTasks,
      target: "_blank",
      description: "Lihat timeline SAKIP",
    },
    {
      name: "LKE Pembangunan ZI",
      href: "/coming-soon",
      icon: faSchoolCircleCheck,
      target: "",
      description: "Lihat LKE Pembangunan Zona Integritas",
    },
    {
      name: "LKE PM SPIP",
      href: "/coming-soon",
      icon: faSitemap,
      target: "",
      description: "Lihat LKE PM SPIP",
    },
    {
      name: "Administrasi Perkantoran",
      href: "https://sites.google.com/view/subbagumumsleman",
      icon: faArchive,
      target: "_blank",
      description: "Akses Administrasi Perkantoran",
    },
    {
      name: "e-TTD BPS",
      href: "https://ettd.bps.go.id/",
      icon: faPenToSquare,
      target: "_blank",
      description: "Akses halaman e-TTD BPS",
    },
    {
      name: "Panduan Adminsite",
      href: "https://drive.google.com/drive/folders/1z1XxyOUUAmIFvWdVCe8INSrxpKicPPa8?usp=sharing",
      icon: faBookOpen,
      target: "_blank",
      description: "Akses buku panduan Adminsite",
    },
    {
      name: "Dashboard Admin",
      href: "/admin/users",
      icon: faLock,
      description: "Halaman Dashboard khusus Super Admin",
      classname: role.includes("superADM") ? "block" : "hidden",
    },
  ];

  const today = time.format("dddd, DD MMMM YYYY, HH:mm:ss");

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await  axios.get("http://localhost:5000/api/desa");
        setProfil(data);
      } catch (error) {
        setError("Failed to fetch profil");
        
        navigate("/pageerror");
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  return (
    <>
      {showErrorNotification && errorMessage && (
        <ErrorNotification message={errorMessage} onClose={handleClose} />
      )}
      {showSuccessNotification && successMessage && (
        <SuccessNotification message={successMessage} onClose={handleClose} />
      )}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 md:p-14 md:py-10 shadow">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-2xl font-bold">Selamat datang!</h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
            <FontAwesomeIcon
              icon={faUser}
              className="text-gray-500 text-4xl mb-2 md:mb-0 md:mr-4"
            />
            <div className="text-center md:text-left">
              <p className="font-semibold">adien</p>
              <p className="text-gray-600">222111841</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-10">
          <div className="text-center md:text-right mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-gray-500 text-4xl mb-2 md:mb-0 md:mr-4"
              />
              <div className="text-center md:text-left">
                <p className="font-semibold">{today.split(",")[0]}</p>{" "}
                <p className="text-gray-600">{today.split(",")[1]}</p>{" "}
              </div>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0 md:ml-4">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
              <FontAwesomeIcon
                icon={faClock}
                className="text-gray-500 text-4xl mb-2 md:mb-0 md:mr-4"
              />
              <div className="text-center md:text-left">
                <p className="font-semibold">{today.split(",")[2]}</p>{" "}
                {/* <p className="text-gray-600">{today.split(",")[1]}</p>{" "} */}
                <p className="text-gray-600">WIB</p>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-8 md:pt-2 bg-base">
        {/* <h2 className="text-xl font-bold mb-4">Pintasan</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <ShortcutCard
              key={item.name}
              icon={item.icon}
              title={item.name}
              description={item.description}
              href={item.href}
              target={item.target}
              className={item.classname}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BerandaPage;
