// js/components/ba-stock-page.js

Vue.component("ba-stock-page", {
  template: "#tpl-stock-page",
  props: ["upbjjs", "kategoris", "initialStock", "formatRupiah"],
  data() {
    return {
      stockData: JSON.parse(JSON.stringify(this.initialStock)), // salinan data
      filter: {
        upbjj: "",
        kategori: "",
        reorderOnly: false,
      },
      sortBy: "judul", // default sort
      editItem: null, // untuk data edit
    };
  },
  methods: {
    resetFilters() {
      this.filter.upbjj = "";
      this.filter.kategori = "";
      this.filter.reorderOnly = false;
      this.sortBy = "judul";
    },
    handleUpbjjChange() {
      // Logika Dependent Options: Reset Kategori jika UPBJJ diubah dari non-kosong ke kosong
      if (this.filter.upbjj === "") {
        this.filter.kategori = "";
      }
    },
    // ... (Fungsi CRUD: create, editItem, saveEdit, confirmDelete, deleteItem) ...
  },
  computed: {
    // Terapkan fitur di vue.js di mana di semua filter tidak perlu recompute kembali.
    // Solusi: Gunakan computed property yang berantai/pipelined.

    // 1. Filtered Stock (menggunakan v-model pada filter)
    filteredStock() {
      let tempStock = this.stockData;

      // Filter UT-Daerah
      if (this.filter.upbjj) {
        tempStock = tempStock.filter(
          (item) => item.upbjj === this.filter.upbjj
        );
      }

      // Filter Kategori (Dependent Option)
      if (this.filter.kategori) {
        tempStock = tempStock.filter(
          (item) => item.kategori === this.filter.kategori
        );
      }

      // Filter Re-Order
      if (this.filter.reorderOnly) {
        tempStock = tempStock.filter(
          (item) => item.qty < item.safety || item.qty === 0
        );
      }

      return tempStock;
    },

    // 2. Filtered AND Sorted Stock
    filteredAndSortedStock() {
      // Hanya mengurutkan hasil filter. Tidak perlu re-compute filter
      // karena filteredStock sudah di-cache oleh Vue computed
      return this.filteredStock.sort((a, b) => {
        let valA = a[this.sortBy];
        let valB = b[this.sortBy];

        // Case-insensitive sorting untuk string (judul)
        if (this.sortBy === "judul") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });
    },
  },
});
