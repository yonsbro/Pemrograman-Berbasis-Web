// js/app.js
import { fetchData, formatRupiah, formatDate } from "./services/api.js";

// Pastikan semua komponen diimpor di sini sebelum inisialisasi Vue
// import './components/status-badge.js';
// import './components/ba-stock-table.js';
// ... dan komponen lainnya ...

document.addEventListener("DOMContentLoaded", async () => {
  const initialData = await fetchData();

  if (initialData) {
    new Vue({
      el: "#app",
      data: {
        // State untuk navigasi
        currentTab: "stok", // 'stok' | 'tracking' | 'order'

        // Data utama dari JSON
        rawStock: initialData.stok || [],
        rawTracking: initialData.tracking || [],

        // Data referensi
        upbjjList: initialData.upbjjList || [],
        kategoriList: initialData.kategoriList || [],
        pengirimanList: initialData.pengirimanList || [],
        paketList: initialData.paket || [],

        // Utilitas
        formatRupiah: formatRupiah,
        formatDate: formatDate,
      },
      methods: {
        setTab(tab) {
          this.currentTab = tab;
        },

        // Metode CRUD dasar (akan disempurnakan di komponen)
        addStock(newStock) {
          this.rawStock.push(newStock);
        },
        updateStock(updatedStock) {
          const index = this.rawStock.findIndex(
            (s) => s.kode === updatedStock.kode
          );
          if (index !== -1) {
            this.rawStock.splice(index, 1, updatedStock);
          }
        },
        deleteStock(kode) {
          this.rawStock = this.rawStock.filter((s) => s.kode !== kode);
        },

        // Metode untuk Tracking
        addTracking(newDO) {
          this.rawTracking.push(newDO);
        },
        updateTracking(doNumber, newStatus, newJourney) {
          const trackingItem = this.rawTracking.find(
            (t) => t.doNumber === doNumber
          );
          if (trackingItem) {
            trackingItem.status = newStatus;
            trackingItem.perjalanan.push(newJourney);
          }
        },
      },
      computed: {
        // Untuk generate Nomor DO otomatis (Contoh: DO2025-001)
        nextDoNumber() {
          const year = new Date().getFullYear();
          // Temukan DO number terakhir, ekstrak sequence number
          const lastDO = this.rawTracking.reduce((max, t) => {
            const match = t.doNumber.match(/DO\d{4}-(\d+)/);
            const num = match ? parseInt(match[1]) : 0;
            return num > max ? num : max;
          }, 0);

          const nextNum = lastDO + 1;
          return `DO${year}-${String(nextNum).padStart(3, "0")}`;
        },
      },
    });
  }
});
