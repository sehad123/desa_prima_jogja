import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  titleContainer: {
    textAlign: "center",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailRow: {
    marginBottom: 8,
    flexDirection: "row",
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: "bold",
    width: 150,
  },
  detailText: {
    fontSize: 11,
    color: "#3E3E3E",
  },
  footerContainer: {
    alignSelf: "flex-end",
    textAlign: "center",
    marginTop: 40,
    minHeight: 150,
  },
  footerText: {
    fontSize: 11,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

const DesaPDF = ({ desa, profil }) => {
  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>Laporan Detail Desa</Text>
        </View>

        {/* Information Section */}
        <View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Nama Petugas:</Text>
            <Text style={styles.detailText}>{profil?.name || "Tidak tersedia"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>NIP:</Text>
            <Text style={styles.detailText}>{profil?.nip || "Tidak tersedia"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Nama Kelompok Desa:</Text>
            <Text style={styles.detailText}>{desa.kelompok_desa}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Alamat:</Text>
            <Text style={styles.detailText}>
              {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel. {desa.kelurahanNama}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Tanggal Pembentukan:</Text>
            <Text style={styles.detailText}>{formatTanggal(desa.tahun_pembentukan)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Jumlah Hibah Diterima:</Text>
            <Text style={styles.detailText}>{formatRupiah(desa.jumlah_hibah_diterima)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Jumlah Dana Sekarang:</Text>
            <Text style={styles.detailText}>{formatRupiah(desa.jumlah_dana_sekarang)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Jumlah Anggota Awal:</Text>
            <Text style={styles.detailText}>{desa.jumlah_anggota_awal}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Jumlah Anggota Sekarang:</Text>
            <Text style={styles.detailText}>{desa.jumlah_anggota_sekarang}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Kategori:</Text>
            <Text style={styles.detailText}>{desa.kategori}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Yogyakarta, 25 Februari 2025</Text>
          <Text style={styles.footerText}>ttd</Text>
          <Text style={styles.footerText}>Setya Hadi Nugroho</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DesaPDF;
