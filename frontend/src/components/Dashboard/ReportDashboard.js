import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

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
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  chartContainer: {
    fontSize: 13,
    marginTop: 30,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  chartImage: {
    width: "auto",
    height: "auto",
    alignSelf: "center",
    maxHeight: 200,
    margin: 10,
  },
  footerContainer: {
    alignSelf: "flex-end",
    textAlign: "center",
    marginTop: 40,
    minHeight: 150,
  },
  footerText: {
    fontSize: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  overallProgressImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
});

const ReportDashboard = ({ profil, totalDesa, totalJumlahDesa, desaMaju, desaBerkembang, desaTumbuh, DoughnutChartImage, LineChartImage }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>Laporan Desa Prima</Text>
        </View>

        {/* Information Section */}
        <View style={styles.contentContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>Nama Petugas:</Text>
            <Text style={styles.detailText}>{profil.name || "Tidak tersedia"}</Text>
            <Text style={styles.detailTitle}>NIP:</Text>
            <Text style={styles.detailText}>{profil.nip || "Tidak tersedia"}</Text>
            <Text style={styles.detailTitle}>Jumlah Kelompok Desa:</Text>
            <Text style={styles.detailText}>{totalJumlahDesa}</Text>
            <Text style={styles.detailTitle}>Jumlah Kategori Maju:</Text>
            <Text style={styles.detailText}>{desaMaju}</Text>
            <Text style={styles.detailTitle}>Jumlah Kategori Berkembang:</Text>
            <Text style={styles.detailText}>{desaBerkembang}</Text>
            <Text style={styles.detailTitle}>Jumlah Kategori Tumbuh:</Text>
            <Text style={styles.detailText}>{desaTumbuh}</Text>
            <Text style={styles.detailTitle}>Total Desa:</Text>
            <Text style={styles.detailText}>{totalDesa}</Text>
            <Text style={styles.detailTitle}>Periode Pembentukan:</Text>
            <Text style={styles.detailText}>17 Desember - 20 Desember 2025</Text>
            <Text style={styles.detailTitle}>Persentase Kelompok Desa:</Text>
            <Text style={styles.detailText}>{((desaMaju + desaBerkembang + desaTumbuh) / totalJumlahDesa) * 100}%</Text>
          </View>

          {/* Doughnut Chart */}
          <View style={styles.chartContainer}>
            <Image src={DoughnutChartImage} style={styles.chartImage} />
          </View>
        </View>

        {/* Line Chart */}
        <View style={styles.chartContainer}>
          <Image src={LineChartImage} style={styles.chartImage} />
        </View>

        {/* Footer with map */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Peta Persebaran</Text>
          {/* Add the map image or file here */}
          <Image src="path-to-your-map-image.png" style={styles.overallProgressImageContainer} />
        </View>
      </Page>
    </Document>
  );
};

export default ReportDashboard;
