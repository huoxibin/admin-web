<template>
  <div class="interests">
    <el-table :data="data" :span-method="objectSpanMethod" border stripe>
      <el-table-column prop="honourName" label="会员级别" align="center"></el-table-column>
      <el-table-column prop="levelName" label="会员等级" align="center"></el-table-column>
      <el-table-column prop="name" label="成长值获取" align="center">
        <template slot-scope="scope">
          <p>{{ `${scope.row.levelIntegralFoot} - ${scope.row.levelIntegralTop}` }}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Interests",
  data: () => ({
    data: []
  }),
  created() {
    this.getData();
  },
  methods: {
    // 获取列表数据
    getData() {
      this.$get("/data/my", {
        pathL: "/doctor/creditHonourLevel/getHonourLevel"
      }).then(res => {
        if (res.state === 0) {
          this.data = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 合并行或列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        console.log(row.honourValue, rowIndex);
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
