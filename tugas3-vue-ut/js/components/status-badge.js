// js/components/status-badge.js

Vue.component("status-badge", {
  template: "#tpl-status-badge",
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true },
    noteHtml: { type: String, default: "" }, // Untuk Tooltip/Preview
  },
  computed: {
    statusText() {
      if (this.qty === 0) return "Kosong ❌";
      if (this.qty < this.safety) return "Menipis ⚠️";
      return "Aman ✅";
    },
    statusClass() {
      if (this.qty === 0) return "status-kosong"; // Merah
      if (this.qty < this.safety) return "status-menipis"; // Orange
      return "status-aman"; // Hijau
    },
  },
});
