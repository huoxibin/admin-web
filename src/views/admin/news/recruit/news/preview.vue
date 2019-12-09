<template>
  <base-preview>
    <div class="recruit-preview">
      <h2>{{form.name}}</h2>
      <base-editview :element="form.content"></base-editview>
    </div>
  </base-preview>
</template>

<script>
export default {
  name: "CasePreview",
  data() {
    return {
      form: {}
    };
  },
  created() {
    this.getData(this.$route.query.id);
  },
  methods: {
    // 获取疾病信息
    getData(id) {
      this.$post("/data/my", {
        pathL: "/doctor/recruitInfo/details",
        id
      }).then(res => {
        if (res.state === 0) {
          this.form = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recruit-preview {
  padding: 10px;
  box-sizing: border-box;
  h2 {
    text-align: center;
  }
}
</style>

