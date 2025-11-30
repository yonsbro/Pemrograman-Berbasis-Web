// Komponen Order Form
Vue.component("order-form", {
  template: "#tpl-order-form",
  data() {
    return {
      orderData: {
        nim: "",
        nama: "",
        upbjj: "",
        bahanAjar: [],
        metodePengiriman: "",
        catatan: "",
      },
      availableBahanAjar: [],
      selectedBahanAjar: [],
      orderHistory: [],
      showOrderSummary: false,
    };
  },
  async created() {
    await this.loadData();
  },
  computed: {
    // Total harga pesanan
    totalHarga() {
      return this.selectedBahanAjar.reduce((total, item) => {
        return total + item.harga * item.qty;
      }, 0);
    },

    // Validasi form
    isFormValid() {
      return (
        this.orderData.nim &&
        this.orderData.nama &&
        this.orderData.upbjj &&
        this.selectedBahanAjar.length > 0 &&
        this.orderData.metodePengiriman
      );
    },
  },
  methods: {
    async loadData() {
      try {
        const data = await ApiService.getBahanAjarData();
        this.availableBahanAjar = data.stok || [];
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },

    // Bahan ajar methods
    addBahanAjar(item) {
      const existingItem = this.selectedBahanAjar.find(
        (i) => i.kode === item.kode
      );
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        this.selectedBahanAjar.push({
          ...item,
          qty: 1,
        });
      }
    },

    removeBahanAjar(index) {
      this.selectedBahanAjar.splice(index, 1);
    },

    updateQuantity(index, newQty) {
      if (newQty < 1) {
        this.removeBahanAjar(index);
      } else {
        this.selectedBahanAjar[index].qty = newQty;
      }
    },

    // Order methods
    submitOrder() {
      if (!this.isFormValid) {
        alert("Silakan lengkapi semua data pesanan");
        return;
      }

      const order = {
        id: Date.now(),
        tanggal: new Date().toLocaleDateString("id-ID"),
        nim: this.orderData.nim,
        nama: this.orderData.nama,
        upbjj: this.orderData.upbjj,
        bahanAjar: [...this.selectedBahanAjar],
        totalHarga: this.totalHarga,
        metodePengiriman: this.orderData.metodePengiriman,
        status: "Menunggu Konfirmasi",
        catatan: this.orderData.catatan,
      };

      this.orderHistory.unshift(order);
      this.resetForm();
      this.showOrderSummary = true;

      // Simpan ke localStorage
      this.saveOrderHistory();
    },

    resetForm() {
      this.orderData = {
        nim: "",
        nama: "",
        upbjj: "",
        bahanAjar: [],
        metodePengiriman: "",
        catatan: "",
      };
      this.selectedBahanAjar = [];
    },

    saveOrderHistory() {
      localStorage.setItem("orderHistory", JSON.stringify(this.orderHistory));
    },

    loadOrderHistory() {
      const saved = localStorage.getItem("orderHistory");
      if (saved) {
        this.orderHistory = JSON.parse(saved);
      }
    },

    // Filter methods
    filterByUpbjj(upbjj) {
      if (!upbjj) return this.availableBahanAjar;
      return this.availableBahanAjar.filter((item) => item.upbjj === upbjj);
    },

    // Utility methods
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
  },

  filters: {
    currency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
  },
});
