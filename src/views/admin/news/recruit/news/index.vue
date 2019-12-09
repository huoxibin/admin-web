<template>
  <div class="health comment">
    <base-layout ref="layout" methods="post" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="招募主题">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="适应症状">
          <el-input v-model="form.symptom"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button size="mini" type="primary" @click="$router.push('/news/recruit/news/add')">新 增</el-button>
        <el-button size="mini" type="success" @click="exportExcel">导 出</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        ref="table"
        slot="table"
        :data="data"
        border
        stripe
        style="width: 100%"
        :height="tableHeight"
        @sort-change="sortChange"
      >
        <el-table-column type="index" :index="serialNumber" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="招募主题" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="symptom" label="适应症状" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="priority"
          label="权重"
          sortable="custom"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="offTime"
          label="报名截止时间"
          sortable="custom"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="planNum"
          label="计划人数"
          sortable="custom"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="enterTo"
          label="待审核"
          sortable="custom"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="enterIn"
          label="审核通过"
          sortable="custom"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="enterOut" label="审核失败" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status === 1"
              @change="handleStatus(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 2"
              type="text"
              size="small"
              @click="update(scope.row.id)"
            >编辑</el-button>
            <el-button type="text" size="small" @click="preview(scope.row.id)">预览</el-button>
            <el-button
              v-if="scope.row.status === 2"
              type="text"
              size="small"
              @click="deleteRow(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
  </div>
</template>

<script>
import exportExcel from "@/api/excel";
export default {
  name: "RecruitNews",
  data: () => ({
		tableHeight:0,
    form: {
      pathL: "/doctor/recruitInfo/list",
      name: "",
      symptom: ""
    },
    data: [],
    pageNum: 1,
    pageSize: 10
  }),
  methods: {
    // 获取列表数据
    getData(data) {
      this.data = data.result;
    },
    // 表格序号
    serialNumber(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    },
    // 导出excel
    exportExcel() {
      exportExcel("doctor/recruitInfo/export", this.form);
    },
    // 编辑
    update(id) {
      this.$router.push({
        path: "/news/recruit/news/update",
        query: { id }
      });
    },
    // 预览
    preview(id) {
      this.$router.push({
        path: "/news/recruit/news/preview",
        query: { id }
      });
    },
    // 删除
    deleteRow(id) {
      this.$confirm("此操作将删除该信息, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const getData = this.$refs.layout.getData;
          this.$post("/data/my", {
            pathL: "/doctor/recruitInfo/delete",
            id
          }).then(res => {
            if (res.state === 0) {
              getData();
              this.$message({
                type: "success",
                message: "删除成功",
                center: true
              });
            } else {
              this.$message({
                message: res.msg,
                center: true
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true
          });
        });
    },
    // 改变排序
    sortChange(sort) {
      if (sort.column) {
        const getData = this.$refs.layout.getData;
        this.form.sortName = sort.column.property;
        this.form.sortType = sort.order === "ascending" ? "ASC" : "DESC";
        getData();
      }
    },
    // 改变状态
    handleStatus(row) {
      const getData = this.$refs.layout.getData;
      this.$post("/data/my", {
        pathL: "/doctor/recruitInfo/edit",
        id: row.id,
        status: 3 - row.status
      }).then(res => {
        if (res.state === 0) {
          getData();
          this.$message({
            type: "success",
            message: "设置成功",
            center: true
          });
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  },
  mounted(){
		// 获取 table 高度
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		})
		window.onresize = ()=>{
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		}
  },
};
</script>


