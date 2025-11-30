// js/tracking-app.js

var app = new Vue({
  el: "#app",
  data: {
    // Data paket (referensi nama paket)
    daftarPaket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar" },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar" },
    ],
    // Data Tracking (Simulasi Database)
    trackingData: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        perjalanan: [
          {
            waktu: "2025-08-25 10:12:20",
            keterangan: "Penerimaan di Loket: TANGSEL",
          },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          {
            waktu: "2025-08-26 08:44:01",
            keterangan: "Diteruskan ke Kantor Tujuan",
          },
        ],
      },
    },

    // State Form
    inputResi: "",
    hasilTracking: null, // Object hasil pencarian
    sudahMencari: false, // Flag untuk conditional rendering
    validasiPesan: "Masukkan minimal 5 karakter.",
  },

  methods: {
    cariData: function () {
      // Validasi sederhana sebelum mencari
      if (this.inputResi.length < 5) {
        alert("Nomor resi terlalu pendek!");
        return;
      }

      this.sudahMencari = true;
      // Mencari key di dalam object trackingData
      if (this.trackingData.hasOwnProperty(this.inputResi)) {
        this.hasilTracking = this.trackingData[this.inputResi];
      } else {
        this.hasilTracking = null; // Reset jika tidak ketemu
      }
    },

    // Helper untuk mendapatkan nama paket dari kode
    getNamaPaket: function (kodePaket) {
      // Mencari di array daftarPaket
      var paket = this.daftarPaket.find((p) => p.kode === kodePaket);
      return paket ? paket.nama : kodePaket;
    },
  },

  // WATCHERS
  watch: {
    // Watcher 1: Memantau input secara realtime
    inputResi: function (newVal) {
      // Reset hasil jika user mengetik ulang
      if (this.sudahMencari) {
        this.sudahMencari = false;
        this.hasilTracking = null;
      }

      // Validasi realtime
      if (newVal.length === 0) {
        this.validasiPesan = "Input tidak boleh kosong.";
      } else if (newVal.length < 5) {
        this.validasiPesan = "Mengetik... (minimal 5 karakter)";
      } else {
        this.validasiPesan = "Format panjang valid. Silakan tekan Cari.";
      }
    },
  },
});
