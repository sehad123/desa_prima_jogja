import React, { useRef, useEffect, useState } from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import html2canvas from "html2canvas";

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
    marginTop: 30,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 40,
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

const ReportDashboard = ({ profil, totalDesa, totalJumlahDesa, desaMaju, desaBerkembang, desaTumbuh, DoughnutChartRef, LineChartRef }) => {
  const [doughnutChartImage, setDoughnutChartImage] = useState(null);
  const [lineChartImage, setLineChartImage] = useState(null);
  const [mapImage, setMapImage] = useState(null);

  // Fungsi untuk mengubah chart menjadi gambar Base64
  const captureChartImage = async (chartRef, setImage) => {
    if (chartRef && chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        setImage(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error("Gagal menangkap gambar chart:", error);
      }
    }
  };

  // Ambil gambar grafik setelah komponen ter-render
  useEffect(() => {
    const captureImages = async () => {
      await Promise.all([captureChartImage(DoughnutChartRef, setDoughnutChartImage), captureChartImage(LineChartRef, setLineChartImage)]);

      // Ambil gambar peta (contoh: dari elemen dengan ID "map")
      const mapElement = document.getElementById("map");
      if (mapElement) {
        html2canvas(mapElement).then((canvas) => {
          setMapImage(canvas.toDataURL("image/png"));
        });
      }
    };

    captureImages();
  }, [DoughnutChartRef, LineChartRef]);

  const currentDate = new Date().toLocaleDateString("id-ID", {
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
            <Text style={styles.detailText}>{profil?.name || "Tidak tersedia"}</Text>
            <Text style={styles.detailTitle}>NIP:</Text>
            <Text style={styles.detailText}>{profil?.nip || "Tidak tersedia"}</Text>
            <Text style={styles.detailTitle}>Jumlah Kelompok Desa:</Text>
            <Text style={styles.detailText}>{totalJumlahDesa || 0}</Text>
            <Text style={styles.detailTitle}>Jumlah Kategori Maju:</Text>
            <Text style={styles.detailText}>{desaMaju || 0}</Text>
            <Text style={styles.detailTitle}>Jumlah Kategori Berkembang:</Text>
            <Text style={styles.detailText}>{desaBerkembang || 0}</Text>
            <Text style={styles.detailTitle}>Jumlah Kategori Tumbuh:</Text>
            <Text style={styles.detailText}>{desaTumbuh || 0}</Text>
            <Text style={styles.detailTitle}>Total Desa:</Text>
            <Text style={styles.detailText}>{totalDesa || 0}</Text>
            <Text style={styles.detailTitle}>Periode Pembentukan:</Text>
            <Text style={styles.detailText}>{currentDate}</Text>
            <Text style={styles.detailTitle}>Persentase Kelompok Desa:</Text>
            <Text style={styles.detailText}>{totalJumlahDesa ? (((desaMaju + desaBerkembang + desaTumbuh) / totalJumlahDesa) * 100).toFixed(1) + "%" : "0%"}</Text>
          </View>

          {/* Doughnut Chart */}
          <View style={styles.chartContainer}>{doughnutChartImage && <Image src={doughnutChartImage} style={styles.chartImage} />}</View>
        </View>

        {/* Line Chart */}
        <View style={styles.chartContainer}>{lineChartImage && <Image src={lineChartImage} style={styles.chartImage} />}</View>

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

export default ReportDashboard;
