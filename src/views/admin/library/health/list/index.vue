<template>
  <div class="health comment">
    <!-- 搜索表单 -->
    <div class="health-top">

      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>

      <el-form ref="form" class="m-t-20" inline size="mini" :model="form" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model.number="form.topical" placeholder="支持输入1-10个汉字"></el-input>
        </el-form-item>
        <el-form-item label="栏目">
          <el-select v-model="form.channelId">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in columnList" :key="index" :label="item.channelName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div class="health-bottom">
      <div class="title-bar">
        <span>列表管理</span>
        <el-button @click="add" size="mini" type="primary">新增</el-button>
      </div>
      <div class="column-bottom"  v-loading="loading" element-loading-text="正在加载中">
        <el-table ref="data" :height="tableHeight" :data="data" border stripe style="width: 100%;">
          <el-table-column prop="id" show-overflow-tooltip label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="topical" show-overflow-tooltip label="文章标题" align="center">
          </el-table-column>
          <el-table-column prop="channelName" show-overflow-tooltip label="栏目" align="center">
          </el-table-column>
          <el-table-column prop="orderNumber" show-overflow-tooltip sortable label="排序" align="center">
          </el-table-column>
          <el-table-column prop="editTime" show-overflow-tooltip label="编辑时间" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status===1" @change="status(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="update(scope.row)" v-if="scope.row.status===0" type="text" size="small">编辑</el-button>
              <el-button @click="find(scope.row)" v-if="scope.row.status===0||scope.row.status===1" type="text" size="small">查看</el-button>
              <el-button @click="remove(scope.row)" v-if="scope.row.status===0" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      form: {
        topical: "",
        channelId: ""
      },
      data: [],
      columnList: [],
      pageLength: 0,
      pageNum: 1,
      pageSize: 10
    };
  },
  beforeRouteEnter(to, from, next) {
    if (
      from.name !== "知识库/健康评估/健康评估列表/查看" &&
      from.name !== "知识库/健康评估/健康评估列表/编辑"
    ) {
      next(vm => {
        vm.pageNum = 1;
        for (let i in vm.form) {
          vm.form[i] = "";
        }
        vm.getData();
      });
    } else {
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
        pathL: "/health/healthAssessmentInfo/assessmentListPage",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        channelId: this.form.channelId,
        topical: this.form.topical
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
    // 获取栏目信息
    getColumn() {
      this.$get("/data/my", {
        pathL: "/health/healthAssessmentChannel/channelList",
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res.state === 0) {
          this.columnList = res.data.result;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 搜索信息
    search(form) {
      this.pageNum = 1;
      this.getData();
      this.$message({
        message: "搜索完成",
        type: "success",
        center: true
      });
    },
    // 跳转新增路由
    add() {
      this.$router.push({
        name: "知识库/健康评估/健康评估列表/新增"
      });
    },
    // 页数请求
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
    // 编辑
    update(row) {
      this.$router.push({
        name: "知识库/健康评估/健康评估列表/编辑",
        query: {
          id: row.id
        }
      });
    },
    // 查看
    find(row) {
      this.$router.push({
        name: "知识库/健康评估/健康评估列表/查看",
        query: {
          id: row.id
        }
      });
    },
    // 删除
    remove(row) {
      this.$confirm("是否确认删除？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/data/my", {
            pathL: "/health/healthAssessmentInfo/deleteAssessment",
            id: row.id
          }).then(res => {
            if (res.state === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
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
    // 修改状态
    status(row) {
      let message =
        row.status === 1
          ? "关闭后，用户将无法看见数据，是否要关闭？"
          : "开启后，用户就可以查看该内容，是否要开启？";
      let title = row.status === 1 ? "关闭" : "开启";
      let success = row.status === 1 ? "关闭成功" : "开启成功";
      let info = row.status === 1 ? "已取消关闭" : "已取消开启";
      this.$confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/data/my", {
            pathL: "/health/healthAssessmentInfo/changeStatus",
            id: row.id,
            status: 1 - row.status
          }).then(res => {
            if (res.state === 0) {
              this.$message({
                type: "success",
                message: success,
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
            message: info,
            center: true
          });
        });
    }
  },
  mounted() {
    this.getData();
    this.getColumn();
		// 获取 table 高度
		this.$nextTick(()=> {
			this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
		})
		window.onresize=()=>{
			this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;

		}
  }
};
</script>
