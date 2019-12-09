<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <el-form ref="form" size="mini" class="m-t-20" :model="form" inline label-width="100px">
        <el-form-item label="服务包名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="服务包类型">
          <el-select v-model="form.packType" placeholder="请选择服务包类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="基础服务包" value="1"></el-option>
            <el-option label="增值服务包" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom" v-loading="loading" element-loading-text="拼命加载中">
      <div class="title-bar">
        <p>数据列表</p>
        <el-button @click="add" size="mini" type="primary">新增服务包模板</el-button>
      </div>
      <div class="column-bottom" ref="table">
        <el-table ref="data" :height="tableHeight" :data="data" border stripe style="width: 100%">
          <el-table-column prop="name" show-overflow-tooltip label="服务包名称" align="center">
          </el-table-column>
          <el-table-column prop="itemCount" show-overflow-tooltip label="服务项数量" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.itemCount}}项</p>
            </template>
          </el-table-column>
          <el-table-column prop="introduction" show-overflow-tooltip label="服务包适用人群" align="center">
          </el-table-column>
          <el-table-column prop="packType" show-overflow-tooltip label="服务包类型" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.packType===1">基础服务包</p>
              <p v-if="scope.row.packType===2">增值服务包</p>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" show-overflow-tooltip label="服务包价格" align="center">
            <template slot-scope="scope">
              <p>¥{{scope.row.totalPrice}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click="find(scope.row)" type="text" size="small">查看</el-button>
              <el-button v-if="scope.row.state===0" @click="update(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.state===0" @click="status(scope.row)" type="text" size="small">启用</el-button>
              <el-button v-if="scope.row.state===1" @click="status(scope.row)" type="text" size="small">禁用</el-button>
              <el-button v-if="scope.row.state===0" @click="remove(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
			tableHeight:0,
      form: {
        name: "",
        packType: "",
        date: ""
      },
      data: [],
      pageSize: 10,
      pageNum: 1,
      pageLength: 0,
      loading: true
    };
  },
  beforeRouteEnter(to, from, next) {
    if (
      from.name !== "商品管理/服务包管理/服务包列表/查看" &&
      from.name !== "商品管理/服务包管理/服务包列表/编辑"
    ) {
      next(vm => {
        vm.pageNum = 1;
        for (let i in vm.form) {
          vm.form[i] = "";
        }
        vm.getData(false);
      });
    } else {
      next(vm => {
        vm.getData(false);
      });
    }
  },
  methods: {
    // 获取数据
    getData(search) {
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/doctor/teamPackTemplate/listSearch",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.form.name,
        packType: this.form.packType === "" ? null : this.form.packType,
        createBTime:
          this.form.date === "" ? null : this.form.date[0] + " 00:00:00",
        createETime:
          this.form.date === "" ? null : this.form.date[1] + " 23:59:59"
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.data = res.data.result;
          this.pageLength = res.data.total;
          if (search) {
            this.$message({
              type: "success",
              message: "完成搜索",
              center: true
            });
          }
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 页数请求
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
    // 搜索
    search(form) {
      this.pageNum = 1;
      this.getData(true);
    },
    // 新增
    add() {
      this.$router.push({ name: "商品管理/服务包管理/服务包列表/新增" });
    },
    // 启用禁用
    status(row) {
      this.$post("/data/my", {
        pathL: "/doctor/teamPackTemplate/setUsingStatus",
        id: row.id,
        state: 1 - row.state
      }).then(res => {
        if (res.state === 0) {
          this.$message({
            type: "success",
            message: row.state === 0 ? "启用成功" : "禁用成功",
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
    },
    // 查看
    find(row) {
      this.$router.push({
        name: "商品管理/服务包管理/服务包列表/查看",
        query: {
          id: row.id
        }
      });
    },
    // 编辑
    update(row) {
      this.$router.push({
        name: "商品管理/服务包管理/服务包列表/编辑",
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
            pathL: "/doctor/teamPackTemplate/deleteTemplate",
            id: row.id,
            state: row.state
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
    }
  },
  mounted() {
    this.getData();
		this.$nextTick(()=> {
			this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
		})
		window.onresize=()=>{
			this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
		}
  }
};
</script>

