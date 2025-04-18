import React, { useState } from "react";
import { formatTanggal, formatRupiah } from "../../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportKelompokDesa from "../ReportKelompokDesa";

const DetailInformasi = ({
  desa,
  profil,
  galeri,
  produk,
  pengurus,
  onEdit,
  onDelete,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-white p-6 shadow rounded-md">
      <div className="border-b-2 pb-1 border-black">
        <h1 className="text-xl font-semibold mb-2">{desa.kelompok_desa}</h1>
      </div>

      {/* Tampilan Mobile */}
      <div className="lg:hidden mt-4 space-y-4">
        <div>
          <p className="font-semibold">Alamat</p>
          <p>
            {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel.{" "}
            {desa.kelurahanNama}
          </p>
        </div>

        <div>
          <p className="font-semibold">Tanggal Pembentukan</p>
          <p>{formatTanggal(desa.tahun_pembentukan)}</p>
        </div>

        <div>
          <p className="font-semibold">Jumlah Hibah Diterima</p>
          <p>{formatRupiah(desa.jumlah_hibah_diterima)}</p>
        </div>

        <div>
          <p className="font-semibold">Jumlah Dana Sekarang</p>
          <p>{formatRupiah(desa.jumlah_dana_sekarang)}</p>
        </div>

        <div>
          <p className="font-semibold">Jumlah Anggota Awal</p>
          <p>{desa.jumlah_anggota_awal}</p>
        </div>

        <div>
          <p className="font-semibold">Jumlah Anggota Sekarang</p>
          <p>{desa.jumlah_anggota_sekarang}</p>
        </div>

        <div>
          <p className="font-semibold">Kategori</p>
          <p>{desa.kategori}</p>
        </div>
      </div>

      {/* Tampilan Desktop */}
      <div className="hidden lg:flex mt-4 space-x-4 lg:space-x-40">
        <div className="space-y-2 w-[100%]">
          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Alamat</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">
              {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel.{" "}
              {desa.kelurahanNama}
            </p>
          </div>

          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Tanggal Pembentukan</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">
              {formatTanggal(desa.tahun_pembentukan)}
            </p>
          </div>

          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Jumlah Hibah Diterima</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">
              {formatRupiah(desa.jumlah_hibah_diterima)}
            </p>
          </div>

          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Jumlah Dana Sekarang</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">
              {formatRupiah(desa.jumlah_dana_sekarang)}
            </p>
          </div>

          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Jumlah Anggota Awal</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">{desa.jumlah_anggota_awal}</p>
          </div>

          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Jumlah Anggota Sekarang</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">{desa.jumlah_anggota_sekarang}</p>
          </div>

          <div className="flex items-start">
            <p className="text-gray-600 flex-shrink-0 w-2/5">
              <strong>Kategori</strong>
            </p>
            <p>:</p>
            <p className="text-gray-600 ml-2">{desa.kategori}</p>
          </div>
        </div>
      </div>

      {/* Tombol */}
      <div className="mt-4 flex space-x-2 justify-end">
        <PDFDownloadLink
          document={
            <ReportKelompokDesa
              desa={desa}
              profil={profil}
              galeri={galeri}
              produk={produk}
              pengurus={pengurus}
            />
          }
          fileName="detail-desa.pdf"
          className="flex lg:w-3/12 justify-center py-1 px-2 space-x-2 text-sm lg:text-lg font-semibold bg-green-200 hover:bg-green-400 rounded-md shadow-sm cursor-pointer text-green-700 hover:text-white"
        >
          <>
            <FontAwesomeIcon className="mt-1" icon={faDownload} />
            <span>Cetak Hasil</span>
          </>
        </PDFDownloadLink>

        <button
          className="w-3/12 lg:w-2/12 text-sm lg:text-lg bg-blue-200 text-blue-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={onEdit}
        >
          Edit
        </button>

        <button
          className="w-3/12 lg:w-2/12 text-sm lg:text-lg bg-red-200 mr-2 text-red-600 font-semibold py-1 px-2 rounded-md shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={onDelete}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default DetailInformasi;
