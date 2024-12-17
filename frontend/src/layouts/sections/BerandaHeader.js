import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faCaretDown,
  faCaretUp,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BerandaHeader = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(null);
  const [profil, setProfil] = useState([]);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileProfileDropdownOpen, setMobileProfileDropdownOpen] = useState(false);

  const navigate = useNavigate(); // Deklarasi navigate di sini

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
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

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    sessionStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      <header className="bg-primary top-0 left-0 font-poppins fixed w-full z-50 bg-opacity-95 border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center pl-2 pr-2 md:pr-3">
          <div className="flex items-center md:ml-4 flex-grow">
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className="md:text-black md:text-2xl md:cursor-pointer hidden md:block"
              onClick={handleSidebarToggle}
            />
            <Link
              to="/peta-desa"
              className="cursor-pointer ml-4 md:ml-8 flex items-center md:mr-0 flex-grow"
            >
              <img
                src="/images/logo_diy.png"
                alt="logo"
                width="34"
                height="36"
                className="block"
              />
              <p className="text-black leading-5 ml-2 text-left font-bold">
                DESA PRIMA
                <br />
                <span className="text-black font-light">
                  DP3AP Provinsi Yogyakarta
                </span>
              </p>
            </Link>
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className="text-black text-2xl cursor-pointer ml-16 mr-5 md:hidden"
              onClick={handleSidebarToggle}
            />
          </div>

          <div className="md:flex items-center space-x-4 lg:mr-10 hidden relative">
            <div
              className="flex flex-col items-end cursor-pointer"
              onClick={handleProfileDropdownToggle}
            >
              <p className="text-black font-semibold">{profil.name}</p>
              <p className="text-black font-light lg:text-sm">{profil.nip}</p>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleProfileDropdownToggle}
            >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-black text-2xl border border-gray-400 p-2 rounded-full"
                />
                <div className="rounded-full w-12 h-12 overflow-hidden">
                  <img
                    
                    className="w-full object-contain"
                  />
                </div>
            </div>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-11 mt-2 w-40 bg-white border rounded-lg">
                <a
                  href="/profil"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Profil
                </a>
                <a
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Keluar
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <CSSTransition
        in={isSidebarOpen}
        timeout={300}
        classNames={{
          enter: "sidebar-enter",
          enterActive: "sidebar-enter-active",
          exit: "sidebar-exit",
          exitActive: "sidebar-exit-active",
        }}
        unmountOnExit
      >
        <aside className="fixed lg:mt-12 w-full md:w-80 bg-white h-full shadow-xl z-40 transform transition-transform duration-300 ease-in-out overflow-x-scroll">
          <nav className="mt-20 md:mt-3 md:ml-0">
            <div className="flex flex-col items-center md:hidden pb-2 border-b border-grey-200">
              <div
                className="flex space-x-6 cursor-pointer"
                onClick={handleMobileProfileDropdownToggle}
              >
                <div className="flex items-center">
                  {profil.avatar === null ? (
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-black text-2xl border border-gray-400 p-2 rounded-full"
                    />
                  ) : (
                    <div className="rounded-full w-12 h-12 overflow-hidden">
                      <img
                        
                        className="w-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center ml-2">
                  <p className="text-black font-semibold">{profil.name}</p>
                  <p className="text-black font-light lg:text-sm">
                    {profil.nip}
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={isMobileProfileDropdownOpen ? faCaretUp : faCaretDown}
                  className="text-black text-xl ml-2"
                />
              </div>
              {isMobileProfileDropdownOpen && (
                <div className="w-full bg-white py-2 text-center cursor-pointer">
                  <a
                    href="/profil"
                    className="block px-4 py-2 text-black hover:bg-gray-200"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profil
                  </a>
                  <a
                    onClick={handleLogout}
                    className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
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
          </nav>
        </aside>
      </CSSTransition>

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
