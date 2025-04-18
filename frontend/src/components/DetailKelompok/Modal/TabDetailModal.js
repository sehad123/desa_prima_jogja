import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import FormGaleri from "./TabModal/GaleriModal";
import FormNotulensi from "./TabModal/NotulensiModal";
import FormPengurus from "./TabModal/PengurusModal";
import FormProduk from "./TabModal/ProdukModal";

const TabDetailModal = ({
  isOpen,
  onClose,
  selectedDesa,
  activeTab,
  initialData,
}) => {

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
      <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center text-left z-50 p-4">
        
          {activeTab === "notulensiMateri" && (
            <>
              <div>
                <FormNotulensi
                  isOpen={isOpen}
                  onClose={onClose}
                  selectedDesa={selectedDesa}
                />
              </div>
            </>
          )}

          {activeTab === "uraianProduk" && (
            <>
              <FormProduk
                isOpen={isOpen}
                onClose={onClose}
                selectedDesa={selectedDesa}
                initialData={initialData}
              />
            </>
          )}

          {activeTab === "pengurusDesa" && (
            <>
              <FormPengurus
                isOpen={isOpen}
                onClose={onClose}
                selectedDesa={selectedDesa}
                initialData={initialData}
              />
            </>
          )}

          {activeTab === "galeriFoto" && (
            <>
              <FormGaleri
                onClose={onClose}
                isOpen={isOpen}
                selectedDesa={selectedDesa}
              />
            </>
          )}
      </div>
    </Transition>
  );
};

export default TabDetailModal;
