<template>
  <el-button type="text" @click="open">{{btn}}</el-button>
</template>
<script>
export default {
  name: "DkMessage",
  props: {
    type: {
      type: String,
      default: "confirm"
    },
    aboutConfig: {
      type: Object,
      default: () => {
        return {};
      },
      require: true
    },
    baseConfig: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      title: this.aboutConfig.title,
      btn: this.aboutConfig.btn,
      content: this.aboutConfig.content
    };
  },
  watch: {
    aboutConfig() {
      this.title = this.aboutConfig.title;
      this.content = this.aboutConfig.content;
    }
  },
  methods: {
    open() {
      this["open" + this.type](this.baseConfig);
    },
    openalert(config) {
      let that = this;
      this.$alert(this.content, this.title, {
        confirmButtonText: "确定",
        callback: () => {
          that.$emit("confirmCallback");
        }
      });
    },
    openprompt(config) {
      let that = this;
      delete config["type"];
      this.$prompt(this.content, this.title, config)
        .then(({ value }) => {
          that.$emit("confirmCallback", value);
        })
        .catch(() => {
          that.$emit("cancelCallback");
        });
    },
    openconfirm(config) {
      let that = this;
      this.$confirm(this.content, this.title, config)
        .then(() => {
          that.$emit("confirmCallback");
        })
        .catch(() => {
          that.$emit("cancelCallback");
        });
    }
  }
};
</script>
