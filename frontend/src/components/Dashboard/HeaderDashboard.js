import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

dayjs.locale("id");

const Header = ({
  profil,
}) => {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000); // Update setiap detik

    return () => clearInterval(interval);
  }, []);

  const today = time.format("dddd, DD MMMM YYYY, HH:mm:ss");

  return (
    <>
      <div className="flex flex-col bg-secondary md:flex-row justify-between items-center p-4 md:p-12 md:py-8 shadow">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-2xl text-purple-200 font-bold">
            Selamat datang!
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
            <FontAwesomeIcon
              icon={faUser}
              className="text-purple-200 text-4xl mb-2 md:mb-0 md:mr-4"
            />
            <div className="text-center md:text-left">
              <p className="text-white text-lg lg:text-xl font-semibold">
                {profil.name}
              </p>
              <p className="text-white">{profil.role || "NIP tidak tersedia"}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-10">
          <div className="text-center md:text-right mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-purple-200 text-4xl mb-2 md:mb-0 md:mr-4"
              />
              <div className="text-center md:text-left">
                <p className="font-semibold text-purple-200">
                  {today.split(",")[0]}
                </p>{" "}
                <p className="text-purple-200">{today.split(",")[1]}</p>{" "}
              </div>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0 md:ml-4">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mt-2">
              <FontAwesomeIcon
                icon={faClock}
                className="text-purple-200 text-4xl mb-2 md:mb-0 md:mr-4"
              />
              <div className="text-center md:text-left">
                <p className="font-semibold text-purple-200">
                  {today.split(",")[2]}
                </p>{" "}
                {/* <p className="text-gray-600">{today.split(",")[1]}</p>{" "} */}
                <p className="text-purple-200">WIB</p>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
