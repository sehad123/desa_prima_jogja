import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import axios from "axios";

const AgreementModal = ({ isOpen, onClose, handleAggree }) => {
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center text-left z-50">
        <div className="bg-white p-4 md:p-6 lg:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-16">
            Apakah yakin ingin menghapus data?
          </h2>
          <div className="w-full flex justify-end">
            <button
              className="w-2/12 bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              onClick={handleAggree}
              className="w-2/12 bg-blue-200 text-blue-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Hapus
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </Transition>
  );
};

export default AgreementModal;
