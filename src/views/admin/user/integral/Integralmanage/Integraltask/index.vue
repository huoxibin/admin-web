<template>
  <div class="comment">
    <div class="title"><p>任务列表</p></div>
    <div ref="table" class="comment-table">
      <el-table :data="tableData" ref="table" :height="tableHeight" border stripe style="width: 100%"
                v-loading="loading" element-loading-text="正在加载中">
        <el-table-column type="index" label="序号" align="center" width="200px"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
        <el-table-column prop="integral" label="单次可获积分数" align="center"></el-table-column>
        <el-table-column prop="top" label="每日上限（分）" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="操作时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status===1" @change="status(scope.row)" active-color="#13ce66"
                       inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                       layout="total, prev, pager, next, jumper" :total="pageLength"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
	export default {
		data () {
			return {
				tableHeight: 0,
				tableData: [],
				pageSize: 10,//每页显示得条数
				pageLength: 0,//一共多少条数据
				pageNum: 1,//当前页码
				loading: true,
				accessToken: this.$store.getters.accessToken
			};
		},
		methods: {
			status (row) {
				//console.log(row.id + ',' + row.taskName + ',' + row.integral + ',' + row.top + ',' + row.updateTime + ',' + row.status)
				let message =
					row.status === 1
						? "关闭后，关于该项任务就停止加积分了! 是否要关闭？" : "开启后，关于该项任务就可以加积分了! 是否要开启？";
				let title = row.status === 1 ? "关闭" : "开启";
				let success = row.status === 1 ? "关闭成功" : "开启成功";
				let info = row.status === 1 ? "已取消关闭" : "已取消开启";
				let transmitStatus = "";
				if (row.status == '1') {
					transmitStatus = '2'
				}
				else {
					transmitStatus = '1'
				}
				this.$confirm(message, title, {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.$get("/data/my", {//更改状态 1开启, 2关闭
						pathL: "/family/honourTask/openOrClose",
						accessToken: this.accessToken,
						taskId: row.id,
						status: transmitStatus
					}).then(res => {
						if (res.state === 0) {
							this.$message({
								type: "success",
								message: success,
								center: true
							});
							this.queryList();//刷新列表
						}
						else {
							this.$message({
								message: res.msg,
								center: true
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: "info",
						message: info,
						center: true
					});
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			queryList () { //获取积分任务列表
				this.$get("/data/my", {
					pathL: "/family/honourTask/getHonourTaskList",
					accessToken: this.accessToken,
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize //每页显示得条数
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			}
		},
		mounted () {
			this.queryList()
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - this.$refs.table.offsetTop - 185;
			})
		}
	};
</script>

<style scoped>
  .service {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
  }

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    font-size: 14px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .table {
    flex: 1;
    overflow: hidden;
  }

  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
