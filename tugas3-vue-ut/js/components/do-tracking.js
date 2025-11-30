// Komponen DO Tracking
Vue.component("do-tracking", {
  template: "#tpl-do-tracking",
  data() {
    return {
      searchQuery: "",
      searchType: "nomorDO",
      trackingData: [],
      filteredTracking: [],
      newDO: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: this.getCurrentDate(),
        statusProgress: [],
      },
      availablePaket: [],
      showDOForm: false,
      selectedDO: null,
      newProgress: {
        keterangan: "",
      },
    };
  },
  async created() {
    await this.loadData();
  },
  computed: {
    // Generate nomor DO otomatis
    nextDONumber() {
      const currentYear = new Date().getFullYear();
      const existingDOs = this.trackingData.filter((doItem) => {
        const doNumber = Object.keys(doItem)[0];
        return doNumber.startsWith(`DO${currentYear}`);
      });

      const nextSequence = existingDOs.length + 1;
      return `DO${currentYear}-${nextSequence.toString().padStart(3, "0")}`;
    },

    // Paket yang dipilih detailnya
    selectedPaketDetail() {
      if (!this.newDO.paket) return null;
      return this.availablePaket.find((p) => p.kode === this.newDO.paket);
    },

    // Total harga berdasarkan paket
    totalHarga() {
      if (!this.selectedPaketDetail) return 0;
      return this.selectedPaketDetail.harga;
    },
  },
  watch: {
    // Watcher untuk pencarian
    searchQuery: function (newQuery) {
      this.searchTracking();
    },

    // Watcher untuk reset form ketika modal ditutup
    showDOForm: function (newVal) {
      if (!newVal) {
        this.resetDOForm();
      }
    },
  },
  methods: {
    async loadData() {
      try {
        const data = await ApiService.getBahanAjarData();
        this.trackingData = data.tracking || [];
        this.availablePaket = data.paket || [];
        this.filteredTracking = [...this.trackingData];
      } catch (error) {
        console.error("Error loading tracking data:", error);
      }
    },

    // Search methods
    searchTracking() {
      if (!this.searchQuery.trim()) {
        this.filteredTracking = [...this.trackingData];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredTracking = this.trackingData.filter((doItem) => {
        const doNumber = Object.keys(doItem)[0];
        const doData = doItem[doNumber];

        if (this.searchType === "nomorDO") {
          return doNumber.toLowerCase().includes(query);
        } else {
          return (
            doData.nim.includes(query) ||
            doData.nama.toLowerCase().includes(query)
          );
        }
      });
    },

    clearSearch() {
      this.searchQuery = "";
      this.filteredTracking = [...this.trackingData];
    },

    handleSearchKeydown(event) {
      if (event.key === "Enter") {
        this.searchTracking();
      } else if (event.key === "Escape") {
        this.clearSearch();
      }
    },

    // DO Management
    addNewDO() {
      this.showDOForm = true;
    },

    resetDOForm() {
      this.newDO = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: this.getCurrentDate(),
        statusProgress: [],
      };
    },

    validateDOForm() {
      const errors = {};

      if (!this.newDO.nim.trim()) errors.nim = "NIM wajib diisi";
      if (!this.newDO.nama.trim()) errors.nama = "Nama wajib diisi";
      if (!this.newDO.ekspedisi) errors.ekspedisi = "Ekspedisi wajib dipilih";
      if (!this.newDO.paket) errors.paket = "Paket wajib dipilih";

      // Validasi NIM format
      if (this.newDO.nim && !/^\d+$/.test(this.newDO.nim)) {
        errors.nim = "NIM harus berupa angka";
      }

      return errors;
    },

    saveDO() {
      const errors = this.validateDOForm();
      if (Object.keys(errors).length > 0) {
        // Tampilkan error (bisa diimplementasikan dengan modal atau alert)
        alert("Silakan periksa form yang belum terisi dengan benar");
        return;
      }

      const newDOData = {
        [this.nextDONumber]: {
          nim: this.newDO.nim,
          nama: this.newDO.nama,
          status: "Diproses",
          ekspedisi: this.newDO.ekspedisi,
          tanggalKirim: this.formatDate(this.newDO.tanggalKirim),
          paket: this.newDO.paket,
          total: this.totalHarga,
          perjalanan: [
            {
              waktu: this.getCurrentDateTime(),
              keterangan: "Pesanan diterima dan sedang diproses",
            },
          ],
        },
      };

      this.trackingData.push(newDOData);
      this.filteredTracking.push(newDOData);
      this.showDOForm = false;
      this.saveTrackingData();
    },

    addProgress(doNumber) {
      if (!this.newProgress.keterangan.trim()) {
        alert("Keterangan progress wajib diisi");
        return;
      }

      const doItem = this.trackingData.find(
        (item) => Object.keys(item)[0] === doNumber
      );
      if (doItem) {
        const doData = doItem[doNumber];
        doData.perjalanan.push({
          waktu: this.getCurrentDateTime(),
          keterangan: this.newProgress.keterangan,
        });

        // Update status berdasarkan progress terbaru
        if (
          this.newProgress.keterangan.toLowerCase().includes("selesai") ||
          this.newProgress.keterangan.toLowerCase().includes("terkirim")
        ) {
          doData.status = "Selesai";
        } else if (
          this.newProgress.keterangan.toLowerCase().includes("perjalanan")
        ) {
          doData.status = "Dalam Perjalanan";
        }

        this.newProgress.keterangan = "";
        this.saveTrackingData();
      }
    },

    viewDetails(doItem) {
      this.selectedDO = doItem;
    },

    closeDetails() {
      this.selectedDO = null;
    },

    // Utility methods
    getCurrentDate() {
      return new Date().toISOString().split("T")[0];
    },

    getCurrentDateTime() {
      return new Date().toLocaleString("id-ID");
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("id-ID", options);
    },

    formatDateTime(dateTimeString) {
      if (!dateTimeString) return "";
      return new Date(dateTimeString).toLocaleString("id-ID");
    },

    saveTrackingData() {
      // Simpan ke localStorage untuk simulasi
      localStorage.setItem("trackingData", JSON.stringify(this.trackingData));
    },

    // Filter untuk formatting
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

    date(value) {
      if (!value) return "";
      const date = new Date(value);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("id-ID", options);
    },
  },
});
