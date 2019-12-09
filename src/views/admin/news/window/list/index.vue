<template>
  <div class="health comment">
    <el-tabs tab-position="left" style="width:100%;height:100%;">
      <el-tab-pane label="哆咖医生" style="height: 100%;">
        <div class="title-bar">
          <p>列表信息</p>
          <el-button @click="add" size="mini" type="primary">新增</el-button>
        </div>

          <div style="width: 100%; height: 88%" v-loading="loading">
            <el-table height="100%" :data="tableData" border stripe style="width: 100%">
              <el-table-column prop="date" type="index" :index="index" width="80" align="center"
                               label="序号"></el-table-column>
              <el-table-column prop="name" align="center" label="名称"></el-table-column>
              <el-table-column prop="image" align="center" label="图片">
                <template slot-scope="scope">
                  <div class="cover-wrap">
                    <img class="cover" :src="scope.row.image">
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="position" align="center" label="显示位置">
                <template slot-scope="scope">
                  <p v-if="scope.row.position===1">前沿</p>
                </template>
              </el-table-column>
              <el-table-column prop="dailynum" align="center" label="启动次数"></el-table-column>
              <el-table-column prop="targetValue" align="center" label="发布对象" show-overflow-tooltip></el-table-column>
              <el-table-column prop="address" align="center" label="上线/下线时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <p>{{`${scope.row.onlineTime} - ${scope.row.offlineTime}`}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="operateTime" align="center" label="操作时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="address" align="center" label="状态">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status===1?true:false"
                    @change="status(scope.row,'status')"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="address" align="center" label="优先显示">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.priority===1?true:false"
                    @change="status(scope.row,'priority')"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </template>
              </el-table-column> -->
              <el-table-column prop="address" align="center" width="140" fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status!==1"
                    @click="update(scope.row)"
                    type="text"
                    size="small"
                  >编辑
                  </el-button>
                  <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
                  <el-button
                    v-if="scope.row.status!==1"
                    @click="remove(scope.row)"
                    type="text"
                    size="small"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageLength"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
	import {
		getCurrDayTime
	} from '@/utils/getDate';
	export default {
		name: "Window",
		data () {
			return {
				tableHeight: 0,
				tableData: [],
				loading: false,
				pageLength: null,
				pageNum: 1,
				pageSize: 10
			};
		},
		mounted () {
			// 获取 table 高度
			// this.$nextTick(() => {
			// 	this.tableHeight = window.innerHeight - 50;
			// })
			// window.onresize = () => {
			// 	//调用methods中的事件
			// 	this.$nextTick(() => {
			// 		this.tableHeight = window.innerHeight - 50;
			// 	})
			// }
			this.getData();
		},
		methods: {
			//index
			index (index) {
				// console.log(index)
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 列表请求
			getData () {
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/doctor/doctorPopup/list",
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
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
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			// 新增
			add () {
				this.$router.push("/news/window/edit/add");
			},
			// 状态修改
			status (row, type) {
				let timestamp = new Date().getTime(); // 当前的时间戳
				if (new Date(row.offlineTime).getTime() < timestamp && row.status==2) {
					this.$message("已过下线时间,不能再开启！");
					return false;
				}
        //return
				const num = type === "status" ? row.status : row.priority;
				this.$post("/data/my", {
					pathL: "/doctor/doctorPopup/status",
					id: row.id,
					[ type ]: 3 - num
				}).then(res => {
					if (res.state === 0) {
						this.getData();
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 编辑
			update (row) {
				this.$router.push({
					path: "/news/window/edit/update",
					query: {
						id: row.id
					}
				});
			},
			// 查看
			detail (row) {
				this.$router.push({
					path: "/news/window/edit/detail",
					query: {
						id: row.id
					}
				});
			},
			// 删除
			remove (row) {
				this.$confirm("正在删除，是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$post("/data/my", {
							pathL: "/doctor/doctorPopup/delete",
							id: row.id
						}).then(res => {
							if (res.state === 0) {
								this.$message({
									type: "success",
									message: "删除成功!",
									center: true
								});
								this.getData();
							}
							else {
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
		}
	};
</script>
