// Komponen Modal
Vue.component("app-modal", {
  template: "#tpl-app-modal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Konfirmasi",
    },
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "confirm", // confirm, alert, warning
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
  },
});
