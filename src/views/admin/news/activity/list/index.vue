<template>
  <div class="health comment">
    <el-tabs tab-position="left" style="width:100%;height:100%">
      <el-tab-pane label="哆咖医生" style="height: 100%;">
        <div class="health-top">
          <div class="title-bar">
            <p>筛选查询</p>
            <el-button size="mini" @click="search" type="primary">搜索查询</el-button>
          </div>
          <!-- 检索表单 -->
          <div class="m-t-20">
            <el-form
              :inline="true"
              :model="form"
              size="mini"
              class="demo-form-inline"
              label-width="100px"
            >
              <el-form-item label="名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="创建人">
                <el-input v-model="form.createrName"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="form.status">
                  <el-option label="全部" value></el-option>
                  <el-option label="未发布" :value="1"></el-option>
                  <el-option label="已发布" :value="2"></el-option>
                  <el-option label="已下线" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="form.createTime"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-date-picker
                  v-model="form.time"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="活动类型">
                <el-select v-model="form.tag">
                  <el-option label="全部" value></el-option>
                  <el-option label="医生邀请领红包" value="doctor_invite_get_packet"></el-option>
                  <el-option label="医生被邀请领红包" value="doctor_by_invaite_get_packet"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="title-bar">
          <p>数据列表</p>
          <el-button size="mini" @click="add" type="primary">新 增</el-button>
        </div>
        <div class="health-bottom" >
          <div class="column-bottom" v-loading="loading" :style="{height:tableHeight+'px'}">
            <el-table height="100%" ref="data" :data="data" stripe border style="width: 100%">
              <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="joinPersonCount" label="已参加人数" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column prop="grantAwardCount" label="已发放数" align="center"></el-table-column>
              <el-table-column prop="date" label="活动时间" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <p>{{ scope.row.beginTime + '-' + scope.row.endTime }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="createrName" label="创建人" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.status === 1">未发布</p>
                  <p v-if="scope.row.status === 2">已发布</p>
                  <p v-if="scope.row.status === 3">已下线</p>
                </template>
              </el-table-column>
              <el-table-column fixed="right" prop="date" label="操作" width="170" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status===1"
                    @click="update(scope.row)"
                    type="text"
                    size="small"
                  >编辑
                  </el-button>
                  <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
                  <el-button
                    v-if="scope.row.status===1"
                    @click="status(scope.row.id,2)"
                    type="text"
                    size="small"
                  >发布
                  </el-button>
                  <el-button
                    v-if="scope.row.status===2"
                    @click="status(scope.row.id,3)"
                    type="text"
                    size="small"
                  >下线
                  </el-button>
                  <el-button
                    v-if="scope.row.status===1 || scope.row.status===3"
                    @click="remove(scope.row)"
                    type="text"
                    size="small"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>

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
	export default {
		name: "Activity",
		data () {
			return {
				loading: false,
				tableHeight: 0,
				form: {
					name: "",
					createrName: "",
					status: "",
					createTime: [],
					time: [],
					tag: ""
				},
				data: [ {} ],
				pageNum: 1,
				pageSize: 10,
				pageLength: null
			};
		},
		mounted () {
			this.getData();
			// 获取 table 高度
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop-190;
			})
			window.onresize = ()=>{
				//调用methods中的事件
				this.$nextTick(() => {
					this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop-210;
				})
			}
		},
		methods: {
			// 获取活动列表
			getData (search) {
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/doctor/activityInfo/list",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					name: this.form.name,
					createrName: this.form.createrName,
					status: this.form.status,
					createTimeBegin:
						this.form.createTime === null ? "" : this.form.createTime[ 0 ],
					createTimeEnd:
						this.form.createTime === null ? "" : this.form.createTime[ 1 ],
					beginTime: this.form.time === null ? "" : this.form.time[ 0 ],
					endTime: this.form.time === null ? "" : this.form.time[ 1 ],
					tag: this.form.tag
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						if (search) {
							this.$message({
								type: "success",
								message: "查询完成",
								center: true
							});
						}
						this.data = res.data.result;
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
			// 查询
			search () {
				this.pageNum = 1;
				this.getData(true);
			},
			// 新增
			add () {
				this.$router.push("/news/activity/edit/add");
			},
			// 编辑
			update (row) {
				this.$router.push({
					path: "/news/activity/edit/update",
					query: {
						id: row.id
					}
				});
			},
			// 查看
			detail (row) {
				this.$router.push({
					path: "/news/activity/edit/detail",
					query: {
						id: row.id
					}
				});
			},
			// 修改状态
			status (id, status) {
				this.$post("/data/my", {
					pathL: "/doctor/activityInfo/status",
					id,
					status
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							type: "success",
							message: "设置成功",
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
							pathL: "/doctor/activityInfo/delete",
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
			},
			// 分页
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			}
		}
	};
</script>

