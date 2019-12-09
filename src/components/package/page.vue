<template>
  <div class="pagination pull-right m-t-10">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageConfig.pageNum"
      :page-size="pageConfig.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pageConfig.total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "DkPage",
  props: {
    pageConfig: {
      type: Object,
      require: true
    }
  },
  methods: {
    handleCurrentChange(page) {
      //
      this.$emit("currentChange", page);
    }
  }
};
</script>

<style scoped>
.pull-right {
  text-align: right;
}
.m-t-10 {
  margin-top: 10px;
}
</style>
