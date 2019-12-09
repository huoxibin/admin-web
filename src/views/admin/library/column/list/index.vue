<template>
  <div class="column comment">
    <div class="column-top">
      <span>栏目列表管理</span>
      <el-button @click="add" size="mini" type="primary">新 增</el-button>
    </div>
    <div class="column-bottom" v-loading="loading" element-loading-text="拼命加载中">
      <el-table :data="data" ref="table" :height="tableHeight" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="channelName" label="栏目名称" align="center">
        </el-table-column>
        <el-table-column prop="weight" sortable label="排序" align="center">
        </el-table-column>
        <el-table-column prop="terminal" label="支持终端" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="编辑时间" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
			tableHeight:0,
      loading: true,
      data: [],
      pageSize: 10,
      pageLength: 0,
      pageNum: 1
    };
  },
  beforeRouteEnter(to, from, next) {
    if(
        from.name !== "知识库/评估栏目/栏目列表管理/编辑"
    ){
      next(vm=>{
        vm.pageNum =1;
        vm.getData();
      })
    }else {
      next(vm => {
        vm.getData();
      });
    }
  },
  methods: {
    // 获取数据列表
    getData() {
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/health/healthAssessmentChannel/channelList",
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.data = res.data.result;
          this.pageLength = res.data.total;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 新增
    add() {
      this.$router.push({ name: "知识库/评估栏目/栏目列表管理/新增" });
    },
    // 编辑
    update(row) {
      this.$router.push({
        name: "知识库/评估栏目/栏目列表管理/编辑",
        query: {
          id: row.id
        }
      });
    },
    // 删除
    remove(row) {
      this.$confirm("是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/data/my", {
            pathL: "/health/healthAssessmentChannel/delChannel",
            id: row.id
          }).then(res => {
            if (res.state === 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
                center: true
              });
              this.getData();
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
    // 页数请求
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    }
  },
  mounted() {
		// 获取 table 高度
		this.$nextTick(()=> {
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop -205;
		})
    this.getData();
  }
};
</script>
