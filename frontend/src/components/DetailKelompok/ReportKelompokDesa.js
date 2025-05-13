import React from "react";
import { Text, View, Page, Document, StyleSheet, Image } from "@react-pdf/renderer";

const formatDate = (dateString) => {
  if (!dateString) return "Tidak tersedia";
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const ReportKelompokDesa = ({ desa, profil, galeri = [], produk = [], pengurus = [], kas = [] }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      marginBottom: 20,
    },
    reportTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
    },
    underline: {
      width: "100%",
      height: 2,
      backgroundColor: "#000",
    },
    contentContainer: {
      flexDirection: "column", // Ubah ke column untuk struktur vertikal
    },
    DetailsContainer: {
      marginBottom: 10, // Jarak antara informasi dan grafik
    },
    detailRow: {
      flexDirection: "row",
      marginBottom: 4,
    },
    detailTitle: {
      marginLeft: 10,
      marginBottom: 4,
      fontSize: 11,
      fontWeight: "bold",
      width: 150, // Lebar tetap untuk kolom judul
    },
    detailText: {
      fontSize: 11,
      marginBottom: 8,
      color: "#3E3E3E",
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderColor: "#000",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableTitle: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 0,
      marginBottom: 6,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#DEDEDE",
      borderBottomWidth: 1,
      borderBottomColor: "#000", // Adding border to differentiate header
      marginBottom: 0,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000", // Border to create compact row styling
      margin: 0,
    },
    tableColHeader: {
      flex: 1,
      textAlign: "center",
      justifyContent: "center",
      padding: 4,
      borderTopWidth: 1,
      borderTopColor: "#000",
      // borderLeftWidth: 1,
      // borderRLeftColor: "#000",
      margin: 0,
    },
    tableCol: {
      flex: 1,
      textAlign: "center",
      padding: 4,
      // borderRightWidth: 1,
      // borderRightColor: "#000",
      // borderLeftWidth: 1,
      // borderRLeftColor: "#000",
      justifyContent: "center",
      margin: 0,
    },
    productContainer: {
      flexDirection: "row",
      border: "1px solid #ddd",
      padding: 8,
    },
    productImageColumn: {
      width: "30%",
      paddingRight: 8,
    },
    productInfoColumn: {
      width: "70%",
    },
    productImage: {
      width: "100%",
      height: 120,
      objectFit: "contain",
    },
    image: {
      width: 100,
      height: 100,
    },
    galleryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 10,
      gap: 12,
      // alignItems: 'flex-end' // DIHAPUS atau diganti dengan 'stretch'
    },
    galleryItem: {
      width: "45%",
      display: "flex",
      flexDirection: "column",
      minHeight: 150, // Tinggi minimum container
      justifyContent: "space-between", // Ditambahkan
    },

    captionText: {
      fontSize: 11,
      textAlign: "center",
      paddingTop: 8,
      // height: 20 // Opsional: bisa dihapus jika ingin alami
    },

    imageWrapper: {
      height: 150,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: "#f9f9f9", // Background jika gambar tidak muncul
      // border: "1px dashed #ccc", // Garis bantu untuk debug
    },

    footerContainer: {
      alignSelf: "flex-end",
      textAlign: "center",
      marginTop: 40,
      breakInside: "avoid",
    },
    footerText: {
      fontSize: 11,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  const ReportTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.reportTitle}>Laporan Kegiatan Kelompok Desa {desa.nama}</Text>
      <View style={styles.underline} />
    </View>
  );

  const KelompokDetails = () => (
    <View style={styles.DetailsContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Nama Petugas</Text>
        <Text style={styles.detailText}>: {profil.name}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>NIP</Text>
        <Text style={styles.detailText}>: {profil.nip || "-"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jabatan</Text>
        <Text style={styles.detailText}>: {profil.role}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Nama Kelompok Desa</Text>
        <Text style={styles.detailText}>
          : {desa.kabupatenNama}, Kec. {desa.kecamatanNama}, Kel. {desa.kelurahanNama}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Tanggal Pembentukan</Text>
        <Text style={styles.detailText}>: {formatTanggal(desa.tanggal_pembentukan)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Hibah Diterima</Text>
        <Text style={styles.detailText}>: {formatRupiah(desa.jumlah_hibah_diterima)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Dana Sekarang</Text>
        <Text style={styles.detailText}>: {formatRupiah(desa.jumlah_dana_sekarang)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Anggota Awal</Text>
        <Text style={styles.detailText}>: {desa.jumlah_anggota_awal}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Anggota Sekarang</Text>
        <Text style={styles.detailText}>: {desa.jumlah_anggota_sekarang}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Kategori</Text>
        <Text style={styles.detailText}>: {desa.kategori}</Text>
      </View>
    </View>
  );

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableColHeader}>No</Text>
      <Text style={styles.tableColHeader}>Nama</Text>
      <Text style={styles.tableColHeader}>Jabatan</Text>
      <Text style={styles.tableColHeader}>No HP</Text>
    </View>
  );

  const TableRow = ({ item }) => {
    return (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCol]}>{item.id}</Text>
        <Text style={styles.tableCol}>{item.nama}</Text>
        <Text style={styles.tableCol}>{item.jabatan}</Text>
        <Text style={[styles.tableCol]}>{item.nohp}</Text>
      </View>
    );
  };

  const Produk = () => (
    <View>
      <Text style={styles.sectionTitle}> II. Produk</Text>
      {produk.length > 0 ? (
        <View>
          {produk.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                border: "1px solid #ddd",
                padding: 8,
                breakInside: "avoid", // Mencegah pemisahan di tengah elemen
              }}
              wrap={false} // Mencegah wrapping ke halaman berikutnya
            >
              {/* Kolom Gambar */}
              <View style={{ width: "30%", paddingRight: 8 }}>
                <Image
                  src={`http://localhost:5000${item.foto}`}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "contain",
                  }}
                />
              </View>

              {/* Kolom Deskripsi */}
              <View style={{ width: "70%" }}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailTitle, { width: 80 }]}>Nama Produk</Text>
                  <Text style={styles.detailText}>: {item.nama}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailTitle, { width: 80 }]}>Harga</Text>
                  <Text style={styles.detailText}>
                    : {formatRupiah(item.hargaAwal)} - {formatRupiah(item.hargaAkhir)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailTitle, { width: 80 }]}>Deskripsi</Text>
                  <Text style={styles.detailText}>: {item.deskripsi}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailTitle, { width: 80 }]}>Pelaku Usaha</Text>
                  <Text style={styles.detailText}>: {item.pelakuUsaha}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailTitle, { width: 80 }]}>No. HP</Text>
                  <Text style={styles.detailText}>: {item.nohp}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.tableCol}></Text>
      )}
    </View>
  );

  const Galeri = () => (
    <View>
      <Text style={styles.sectionTitle}>III. Galeri</Text>
      <View style={styles.galleryContainer}>
        {galeri.map((item) => {
          // Pastikan dimensi gambar valid
          const width = item.width || 1;
          const height = item.height || 1;
          const aspectRatio = width / height;
          const calculatedHeight = Math.min(100 / aspectRatio, 150);

          return (
            <View key={item.id} style={styles.galleryItem}>
              <View style={styles.imageWrapper}>
                {/* Tambahkan error handling */}
                <Image
                  src={`http://localhost:5000${item.gambar}`}
                  style={{
                    width: "90%",
                    height: calculatedHeight,
                    objectFit: "contain",
                  }}
                  cache={false} // Nonaktifkan cache
                  onError={(e) => console.log("Gagal memuat gambar:", e)}
                />
              </View>
              <Text style={styles.captionText}>{formatTanggal(item.createdAt)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const Footer = () => (
    <View style={styles.footerContainer} wrap={false}>
      <Text style={styles.footerText}>Yogyakarta, {formattedDate},</Text>
      <Text style={styles.footerText}>{profil.role}</Text>
      <Text style={[styles.footerText, { marginTop: 70 }]}>{profil.name}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ReportTitle />
        <View style={styles.contentContainer}>
          <KelompokDetails />

          <View>
            {pengurus.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>I. Rincian Pengurus Kelompok Desa</Text>
                <TableHeader />
                {pengurus.map((item, index) => (
                  <TableRow key={index} item={item} />
                ))}
              </>
            ) : (
              <Text style={styles.tableCol}></Text>
            )}
          </View>

          {produk.length > 0 ? (
            <>
              <Produk />
            </>
          ) : (
            <Text style={styles.tableCol}></Text>
          )}

          {galeri.length > 0 ? (
            <>
              <Galeri />
            </>
          ) : (
            <Text style={styles.tableCol}></Text>
          )}
        </View>

        {/* Footer */}
        <Footer />
      </Page>
    </Document>
  );
};

export default ReportKelompokDesa;
