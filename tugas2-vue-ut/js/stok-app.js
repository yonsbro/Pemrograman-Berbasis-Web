// js/stok-app.js

var app = new Vue({
  el: "#app",
  data: {
    // Data dari template dataBahanAjar.js
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

    // Data Stok Utama
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>",
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
      },
      {
        kode: "ADPU4410",
        judul: "Kebijakan Publik",
        kategori: "MK Pilihan",
        upbjj: "Padang",
        lokasiRak: "R5-D9",
        harga: 55000,
        qty: 50,
        safety: 10,
        catatanHTML: "-",
      },
    ],

    // State untuk Filter (v-model)
    selectedUpbjj: "",
    selectedKategori: "",
    pesanSistem: "", // Untuk output Watcher
  },

  // COMPUTED PROPERTIES: Mengolah data secara reaktif
  computed: {
    filteredStok: function () {
      return this.stok.filter((item) => {
        // Logika filter ganda (UPBJJ & Kategori)
        const matchUpbjj =
          this.selectedUpbjj === "" || item.upbjj === this.selectedUpbjj;
        const matchKat =
          this.selectedKategori === "" ||
          item.kategori === this.selectedKategori;
        return matchUpbjj && matchKat;
      });
    },
  },

  // METHODS: Fungsi-fungsi pembantu
  methods: {
    // Method untuk menentukan kelas CSS berdasarkan stok (Binding Class)
    getStatusClass: function (item) {
      if (item.qty === 0) return "bg-danger";
      if (item.qty <= item.safety) return "bg-warning";
      return "bg-safe";
    },
    // Method untuk logika teks status
    getStatusText: function (item) {
      if (item.qty === 0) return "HABIS";
      if (item.qty <= item.safety) return "REORDER"; // Stok di bawah safety stock
      return "AMAN";
    },
  },

  // WATCHERS: Memantau perubahan variabel data
  watch: {
    // Watcher 1: Memantau filter UPBJJ
    selectedUpbjj: function (newVal, oldVal) {
      if (newVal !== "") {
        this.pesanSistem =
          "Admin sedang melihat data stok untuk UPBJJ: " + newVal;
      } else {
        this.pesanSistem = "Menampilkan semua data UPBJJ.";
      }
    },
    // Watcher 2: Memantau jumlah data yang tampil
    filteredStok: function (newVal) {
      if (newVal.length < 3 && newVal.length > 0) {
        console.log("Peringatan: Data yang ditampilkan sangat sedikit.");
      }
    },
  },
});
