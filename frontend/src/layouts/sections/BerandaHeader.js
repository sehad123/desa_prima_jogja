import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faCaretDown,
  faCaretUp,
  faTimes,
  faFileAlt,
  faChartPie,
  faTasks,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useUserData from "../../components/hooks/useUserData";


const BerandaHeader = () => {
  const { profil } = useUserData();
  const [isDropdownOpen, setDropdownOpen] = useState(null);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileProfileDropdownOpen, setMobileProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Refs untuk menyimpan referensi ke elemen dropdown
  const profileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  const navigate = useNavigate(); // Deklarasi navigate di sini

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const handleProfileDropdownToggle = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleMobileProfileDropdownToggle = () => {
    setMobileProfileDropdownOpen(!isMobileProfileDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setProfileDropdownOpen(false);
    }
    if (
      mobileProfileDropdownRef.current &&
      !mobileProfileDropdownRef.current.contains(event.target)
    ) {
      setMobileProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Hapus event listener saat komponen di-unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      name: "Beranda",
      icon: faHome,
      allowedRoles: ["Admin", "Pegawai", "Ketua Forum"],
      href: profil.role === "Ketua Forum" 
        ? `/kabupaten-dashboard/${encodeURIComponent(profil.nama_kabupaten.replace(/^KAB\.\s*/i, ''))}` 
        : "/provinsi-dashboard"
    },
    {
      name: "Daftar User",
      href: "/daftar-user",
      icon: faFileAlt,
      target: "",
      allowedRoles: ["Admin"],
    },
    {
      name: "Daftar Kab/Kota",
      href: "/daftar-kabupaten",
      icon: faFileAlt,
      target: "",
      allowedRoles: ["Pegawai", "Admin"],
    },
    {
      name: "Daftar Kelompok",
      href:
        profil.role === "Ketua Forum"
          ? `http://localhost:3000/daftar-kelompok?kabupaten=${profil.nama_kabupaten}`
          : "/daftar-kelompok",
      icon: faChartPie,
      target: "",
      allowedRoles: ["Admin", "Ketua Forum", "Pegawai"],
    },
    {
      name: "Peta Sebaran",
      href: "/peta-sebaran",
      icon: faTasks,
      target: "",
      allowedRoles: ["Pegawai", "Admin"],
    },
  ];

  // Filter menu berdasarkan role
  const filteredMenu = menuItems.filter((item) => item.allowedRoles.includes(profil.role));

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  
    navigate("/?logoutSuccess=true");
  };

  return (
    <>
      <header className="bg-secondary top-0 left-0 font-poppins fixed w-full z-50 bg-opacity-95 border-b border-gray-200 shadow-sm">
  <div className="flex h-16 items-center px-4 md:px-6">
    {/* Elemen Kiri (Logo) */}
    <div className="flex items-center"> {/* Berikan lebar 25% */}
      <Link to="/dashboard" className="cursor-pointer flex items-center">
        <img src="/images/logo_diy.png" alt="logo" width="34" height="36" className="block" />
        <p className="text-accent leading-5 ml-2 text-left font-bold text-sm lg:text-lg">
                DESA PRIMA
                <br />
                <span className="text-white font-light text-sm lg:text-lg">DP3AP Provinsi Yogyakarta</span>
              </p>
      </Link>
    </div>

    {/* Navigasi (Nav) */}
    <nav className="flex-grow flex justify-center mx-4">
  <div className="hidden md:flex space-x-6 lg:space-x-8">
    {filteredMenu.map((menu, index) => (
      <div key={index} className="relative group">
        {menu.submenu ? (
          <div className="cursor-pointer flex items-center" onClick={() => handleDropdownToggle(index)}>
            {menu.name}
            <FontAwesomeIcon icon={isDropdownOpen === index ? faCaretUp : faCaretDown} className="ml-2" />
          </div>
        ) : (
          <a href={menu.href} target={menu.target} className="flex items-center text-purple-200 hover:underline hover:text-white">
            {menu.name}
          </a>
        )}
        {menu.submenu && isDropdownOpen === index && (
          <ul className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
            {menu.submenu.map((submenu, subIndex) => (
              <li key={subIndex} className="p-2 hover:bg-gray-200">
                <a href={submenu.href} className="flex items-center hover:underline hover:text-white">
                  <FontAwesomeIcon icon={submenu.icon} className="mr-2" />
                  {submenu.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
</nav>

    {/* Elemen Kanan (Profil) */}
    <div className="flex items-center justify-end space-x-4 lg:mr-10"> {/* Berikan lebar 25% dan justify-end */}
      <div className="hidden md:flex flex-col items-end cursor-pointer" onClick={handleProfileDropdownToggle}>
        <p className="text-white font-semibold">{profil.name}</p>
        <p className="text-white font-light lg:text-sm">{profil.role}</p>
      </div>
      <div className="hidden md:flex cursor-pointer" onClick={handleProfileDropdownToggle}>
        <FontAwesomeIcon icon={faUser} className="text-white text-2xl border border-gray-400 p-2 rounded-full" />
      </div>
      {isProfileDropdownOpen && (
        <div className="absolute right-0 top-11 mt-2 w-40 bg-secondary border rounded-lg shadow-md">
          <a href="/profil" className="block px-4 py-2 text-sm text-purple-200 hover:underline hover:text-white">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profil
          </a>
          <a onClick={handleLogout} className="block px-4 py-2 text-sm text-purple-200 hover:underline hover:text-white cursor-pointer">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Keluar
          </a>
        </div>
      )}
    </div>

    {/* Tombol Menu Mobile */}
    <div className="md:hidden flex items-center">
      <button onClick={handleMobileMenuToggle} className="p-2">
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-white text-xl" />
      </button>
    </div>
  </div>

  {/* Menu Mobile */}
  {isMobileMenuOpen && (
    <CSSTransition
      in={isMobileMenuOpen}
      timeout={300}
      classNames={{
        enter: "sidebar-enter",
        enterActive: "sidebar-enter-active",
        exit: "sidebar-exit",
        exitActive: "sidebar-exit-active",
      }}
      unmountOnExit
    >
      <aside className="fixed top-16 w-full bg-secondary h-full shadow-xl z-40 transform transition-transform duration-300 ease-in-out overflow-x-scroll">
        <nav className="mt-4">
          <div className="flex flex-col items-center pb-2 border-b border-white">
            <div
              className="flex space-x-6 cursor-pointer"
              onClick={handleMobileProfileDropdownToggle}
            >
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-purple-200 text-2xl border border-gray-400 p-2 rounded-full"
                />
              </div>
              <div className="flex flex-col items-center ml-2">
                <p className="text-white font-semibold">{profil.name}</p>
                <p className="text-white font-light lg:text-sm">
                  {profil.nip}
                </p>
              </div>
              <FontAwesomeIcon
                icon={isMobileProfileDropdownOpen ? faCaretUp : faCaretDown}
                className="text-white text-xl ml-2 mt-3"
              />
            </div>
            {isMobileProfileDropdownOpen && (
              <div className="w-full bg-secondary py-2 text-center cursor-pointer">
                <a
                  href="/profil"
                  className="block px-4 py-2 text-white hover:underline hover:text-purple-200"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Profil
                </a>
                <a
                  onClick={handleLogout}
                  className="block px-4 py-2 text-white hover:underline hover:text-purple-200 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-2 cursor-pointer"
                  />
                  Keluar
                </a>
              </div>
            )}
          </div>
          <ul className="space-y-0">
            {filteredMenu.map((menu, index) => (
              <li key={index} className="group relative">
                <div
                  className={`flex items-center justify-between text-white py-4 px-3 border-b-2 cursor-pointer hover:bg-purple-700 transition-colors duration-200 ${
                    location.pathname === menu.href ? "bg-purple-800" : ""
                  } ${menu.classname || ""}`}
                >
                    <a
                      href={menu.href}
                      target={menu.target}
                      className="text-white flex-1 text-center md:text-left hover:underline hover:text-purple-200"
                    >
                      <FontAwesomeIcon icon={menu.icon} className="mr-2" />
                      {menu.name}
                    </a>
                  

                  {menu.submenu && (
                    <div
                      className=""
                      onClick={() => handleDropdownToggle(index)}
                    >
                      <FontAwesomeIcon
                        icon={
                          isDropdownOpen === index ? faCaretUp : faCaretDown
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {menu.submenu && isDropdownOpen === index && (
                  <ul className="pl-8 bg-white shadow-md">
                    {menu.submenu.map((submenu, subIndex) => (
                      <li
                        key={subIndex}
                        className="p-3 hover:bg-gray-200 transition-colors duration-200"
                      >
                        <div className="w-[100%] flex-1 text-center md:text-left">
                          <a
                            className="w-full h-full flex justify-start text-left md:text-left hover:underline hover:text-blue-600"
                            href={submenu.href}
                          >
                            <div>
                              <FontAwesomeIcon
                                icon={submenu.icon}
                                className="mr-2"
                              />
                            </div>
                            {submenu.name}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </CSSTransition>
  )}
</header>

      <style jsx>{`
        .sidebar-enter {
          transform: translateX(-100%);
        }
        .sidebar-enter-active {
          transform: translateX(0);
          transition: transform 300ms ease-out;
        }
        .sidebar-exit {
          transform: translateX(0);
        }
        .sidebar-exit-active {
          transform: translateX(-100%);
          transition: transform 300ms ease-in;
        }

        @media (max-width: 767px) {
          .sidebar-enter {
            transform: translateY(-100%);
          }
          .sidebar-enter-active {
            transform: translateY(0);
            transition: transform 300ms ease-out;
          }
          .sidebar-exit {
            transform: translateY(0);
          }
          .sidebar-exit-active {
            transform: translateY(-100%);
            transition: transform 300ms ease-in;
          }
        }
      `}</style>
    </>
  );
};

export default BerandaHeader;