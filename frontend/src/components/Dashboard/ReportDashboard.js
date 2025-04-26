import React from "react";
import {
  Text,
  View,
  Page,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const formatDate = (dateString) => {
  if (!dateString) return "Tidak tersedia";
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const ReportDashboard = ({
  page,
  profil,
  data,
  lineChartImage,
  doughnutChartImage,
  isMobile,
}) => {
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
      marginBottom: 20, // Jarak antara informasi dan grafik
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
    chartContainer: {
      marginBottom: 20,
      alignItems: "center",
      pageBreakInside: "avoid",
    },
    chartLine: {
      height: "auto",
      borderWidth: 0.5,
      borderColor: "grey",
    },
    doughnutChartImage: {
      width: isMobile? 180 : 198,
      height: isMobile ? 220 : 200,
      alignSelf: "center",
    },
    lineChartImage: {
      width: isMobile ? 250 : "100%",
      height: "auto",
      alignSelf: "center",
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

  const persentaseKelompokDesa = data.jumlah_desa
    ? (
        ((data.desaMaju + data.desaBerkembang + data.desaTumbuh) /
          data.jumlah_desa) *
        100
      ).toFixed(1)
    : 0;

  const lingkupLaporan =
    page === "provinsi"
      ? "PROVINSI DAERAH ISTIMEWA YOGYAKARTA"
      : page === "kabupaten"
      ? `${
          data.nama_kabupaten.toUpperCase() === "YOGYAKARTA" ? "" : "KABUPATEN "
        }${data.nama_kabupaten.toUpperCase()}`
      : "";

  const ReportTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.reportTitle}>
        HASIL MONITORING PROGRAM DESA PRIMA
      </Text>
      <Text style={styles.reportTitle}>{lingkupLaporan}</Text>
      <View style={styles.underline} />
    </View>
  );

  const ProgramDetails = () => (
    <View style={styles.DetailsContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Nama</Text>
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
        <Text style={styles.detailTitle}>Jumlah Kelompok Desa</Text>
        <Text style={styles.detailText}>: {data.totalJumlahKelompok}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Kategori Maju</Text>
        <Text style={styles.detailText}>: {data.desaMaju}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Kategori Berkembang</Text>
        <Text style={styles.detailText}>: {data.desaBerkembang}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Kategori Tumbuh</Text>
        <Text style={styles.detailText}>: {data.desaTumbuh}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Jumlah Desa</Text>
        <Text style={styles.detailText}>: {data.jumlah_desa}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Periode Pembentukan</Text>
        <Text style={styles.detailText}>
          : {data.tanggal_awal ? formatDate(data.tanggal_awal) : "-"} -{" "}
          {data.tanggal_akhir ? formatDate(data.tanggal_akhir) : "-"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Persentase Kelompok</Text>
        <Text style={styles.detailText}>: {persentaseKelompokDesa}%</Text>
      </View>
    </View>
  );

  // Di ReportDashboard.js
  const ChartWithTitleDoughnut = ({
    title,
    chartImage,
    chartStyle,
    centerText,
  }) => {
    return (
      <View style={styles.chartContainer} wrap={false}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 15 }}>
          {title}
        </Text>
        <View style={{ position: "relative" }}>
          <Image src={chartImage} style={chartStyle} />
          {centerText && (
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 12,
                  marginLeft: 20,
                  marginTop: 10,
                }}
              >
                {centerText.percentage}%
              </Text>
              <Text style={{ fontSize: 12, marginLeft: 7 }}>
                {centerText.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const ChartWithTitle = ({ title, chartImage, chartStyle }) => {
    return (
      <View style={styles.chartContainer} wrap={false}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 15 }}>
          {title}
        </Text>
        <Image src={chartImage} style={chartStyle} />
      </View>
    );
  };

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
          {/* Informasi Desa */}
          <ProgramDetails />

          {/* Doughnut Chart */}
          <ChartWithTitleDoughnut
            title="Distribusi Kategori Kelompok Desa"
            chartImage={doughnutChartImage}
            chartStyle={styles.doughnutChartImage}
            centerText={{
              percentage: persentaseKelompokDesa,
              label: "Kelompok Desa",
            }}
          />

          <ChartWithTitle
            title="Progress Periodik Program Desa Prima"
            chartImage={lineChartImage}
            chartStyle={styles.lineChartImage}
          />
        </View>

        {/* Footer */}
        <Footer />
      </Page>
    </Document>
  );
};

export default ReportDashboard;
