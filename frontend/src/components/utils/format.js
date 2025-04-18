export const formatTanggal = (tanggal) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };
  
  export const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  export const formatKabupatenName = (name) => {
      if (!name) return name;
      const lowerName = name.toLowerCase();
      if (lowerName.includes("kab.")) {
        return (
          "Kab." +
          lowerName
            .split("kab.")[1]
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
      }
      if (lowerName.includes("kota")) {
        return (
          "Kota " +
          lowerName
            .split("kota")[1]
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
      }
      return lowerName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    export const formatDaftarKabupaten = (nama) => {
      if (!nama) return "-";
      return nama === "Kota Yogyakarta" 
        ? `Kota Yogyakarta` 
        : `Kabupaten ${nama}`;
    };
  
    export const formatKabupatenForAPI = (name) => {
      if (name.toLowerCase().includes('yogyakarta')) {
        return 'yogyakarta'; // atau 'kota-yogyakarta' sesuai kebutuhan backend
      }
      return name.replace(/KAB\.?\s*/i, '').replace(/\s+/g, '-').toLowerCase();
    };

    export const formatKabupatenModal = (name) => {
      if (!name) return '';
      
      // Standarisasi format: "KAB. SLEMAN" -> "Sleman"
      return name.toString()
        .replace(/KAB\.?\s*/i, '')  // Hapus "KAB." atau "KAB"
        .replace(/\s+/g, ' ')       // Hapus spasi berlebih
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    export const formatKabupatenNameForDatabase = (name) => {
      return name.toString()
        .replace(/KAB\.?\s*/i, '')
        .trim()
        .toLowerCase();
    };