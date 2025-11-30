// js/services/api.js

const API_ENDPOINT = "./data/dataBahanAjar.json";

// Utility untuk format harga ke Rupiah
export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Utility untuk format tanggal
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Fungsi utama untuk fetch data
export const fetchData = async () => {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Memastikan nomor DO unik untuk tracking (jika ada duplikasi)
    const trackingMap = {};
    data.tracking.forEach((item) => {
      const key = Object.keys(item)[0];
      trackingMap[key] = item[key];
    });

    data.tracking = Object.keys(trackingMap).map((key) => ({
      doNumber: key,
      ...trackingMap[key],
    }));

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Handle error appropriately in the app
  }
};
