import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SuccessNotification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed z-50 top-20 md:top-4 right-4 bg-white text-black p-4 rounded-md shadow-lg flex items-center border-l-blue-500 border-l-8 border-2 border-gray-300">
      <span className="flex-1">{message}</span>
      <button className="ml-4 text-black" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
      </button>
    </div>
  );
};

export default SuccessNotification;
