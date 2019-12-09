<template>
  <div class="health comment">
    <div class="health-top">
      <!-- title -->
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(ygFrom)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!-- 表单查询 -->
      <el-form ref="ygFrom" class="m-t-10" size="mini" :inline="true" :model="ygFrom" label-width="120px"
               label-position="right">
        <el-form-item label="输入搜索">
          <el-input size="mini" v-model="ygFrom.userName" placeholder="姓名／手机号"></el-input>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select size="mini" v-model="ygFrom.areaId" @change="changeOther">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in divs" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分部">
          <el-select size="mini" v-model="ygFrom.divisionId" @change="changeNext">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in firstDivs" :key="index" :label="item.divisionName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select size="mini" v-model="ygFrom.departmentId">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in departs" :key="index" :label="item.departmentName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职位">
          <el-select size="mini" v-model="ygFrom.titleId">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in titles" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select size="mini" v-model="ygFrom.roleId">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in roles" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select size="mini" v-model="ygFrom.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker :picker-options="pickerOptions" size="mini" value-format="yyyy-MM-dd"
                          v-model="ygFrom.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>

    </div>
    <div class="health-bottom">
      <!-- 数据操作 -->
      <div class="title-bar">
        <span>数据列表</span>
        <el-button @click="addyg" size="mini" type="primary">新增</el-button>
      </div>

      <!-- 表格 -->
      <div class="column-bottom" v-loading="loading" element-loading-text="正在加载中">
        <el-table ref="data" :height="tableHeight" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="loginName" label="用户名" align="center" width="200">
          </el-table-column>
          <el-table-column prop="userName" label="姓名" align="center" width="200">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="roleName" label="角色" align="center" width="200">
          </el-table-column>
          <el-table-column prop="areaName" label="所属区域" align="center" width="200">
          </el-table-column>
          <el-table-column prop="divisionName" label="所属分部" align="center" width="200">
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录" align="center" width="200">
          </el-table-column>
          <el-table-column style="color:red" prop="status" label="账号状态" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status=== 1">启用</span>
              <span v-if="scope.row.status=== 2" style="color: red">禁用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button @click="updata(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="updataPassword(scope.row)" type="text" size="small">重置密码</el-button>
              <el-button v-if="scope.row.status=== 2" @click="status(scope.row)" type="text" size="small">启用</el-button>
              <el-button v-if="scope.row.status=== 1" @click="status(scope.row)" type="text" size="small">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
    <!-- 重置密码 -->
    <div class="password" v-show="psw">
      <div class="password_content">
        <div class="pw_top">
          <span>重置密码</span>
          <i @click="psw=false" class="el-icon-close"></i>
        </div>
        <div class="pw_center">
          <el-form ref="pwFrom" size="mini" :model="pwFrom" label-width="100px">
            <el-form-item label="输入新密码">
              <el-input v-model="pwFrom.newpwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="再次输入">
              <el-input v-model="pwFrom.newpwder" type="password"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="pw_bottom">
          <el-button @click="updatapsw(pwFrom)" size="mini" type="primary">确定</el-button>
          <el-button @click="psw=false" size="mini" type="info" plain>取消</el-button>
        </div>
      </div>
    </div>

    <!-- 分页 -->

    <div class="pagination">
      <el-pagination @size-change="handleSizeChange"
                     :current-page="pageNum"
                     :page-sizes="[10,20,50,100]"
                     :page-size="10"
                     @current-change="handleCurrentChange"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				tableHeight: 0,
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				loading: true,
				psw: false,
				pswID: null,
				oldPsw: null,
				divs: [],
				firstDivs: [],
				departs: [],
				roles: [],
				titles: [],
				tableData: [],
				ygFrom: {
					userName: "",
					status: "",
					roleId: "",
					titleId: "",
					departmentId: "",
					divisionId: "",
					areaId: "",
					date: "",
					areaName: "",
					deparName: "",
					divisionName: "",
					roleName: "",
					titleName: ""
				},
				pwFrom: {
					newpwd: "",
					newpwder: ""
				},
				pageLength: null,
				pageSize: 10,
				pageNum: 1
			};
		},
		beforeRouteEnter (to, from, next) {
			if (from.name !== "系统设置/员工管理/员工列表/修改员工") {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.ygFrom) {
						vm.ygFrom[ i ] = "";
					}
					vm.loadData();
				});
			}
			else {
				next(vm => {
					vm.loadData();
				});
			}
		},
		methods: {
			loadData () {
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysUser/list",
						pageSize: this.pageSize,
						pageNum: this.pageNum
					})
					.then(res => {
						if (res.data.state === 0) {
							this.tableData = res.data.data.page.result;
							this.pageLength = res.data.data.page.total;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			handleSizeChange (val) {
				this.pageSize = val;
				this.loadData();
			},
			handleCurrentChange (val) {
				this.pageNum = val;
				this.loadData();
			},
			addyg () {
				this.$router.push({
					name: "系统设置/员工管理/员工列表/新增员工"
				});
			},
			updata (row) {
				this.$router.push({
					name: "系统设置/员工管理/员工列表/修改员工",
					query: {
						id: row.id
					}
				});
			},

			status (row) {
				var status = 3 - row.status;
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysUser/status",
						id: row.id,
						status: status
					})
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								message: "设置成功",
								type: "success",
								center: true
							});
							this.loadData();
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			remove (row) {
				this.$confirm("您确定要删除该员工信息吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post("/data/my", {
								pathL: "/ap/sysUser/del",
								id: row.id
							})
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "删除成功",
										center: true
									});
									this.loadData();
								}
								else {
									this.$message({
										type: "info",
										message: res.data.msg,
										center: true
									});
								}
							})
							.catch(err => {
								console.log(err);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			search (ygFrom) {
				if (ygFrom.date === null) {
					ygFrom.date = "";
				}
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysUser/list",
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						status: ygFrom.status,
						startTime: ygFrom.date[ 0 ],
						endTime: ygFrom.date[ 1 ],
						userName: ygFrom.userName,
						mobile: ygFrom.userName,
						areaId: ygFrom.areaId,
						divisionId: ygFrom.divisionId,
						departmentId: ygFrom.departmentId,
						titleId: ygFrom.titleId,
						roleId: ygFrom.roleId
					})
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								type: "success",
								message: "完成查询",
								center: true
							});
							this.tableData = res.data.data.page.result;
							this.pageLength = res.data.data.page.total;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			updataPassword (row) {
				this.psw = true;
				this.pswID = row.id;
			},
			updatapsw (pwFrom) {
				if (pwFrom.newpwd === pwFrom.newpwder) {
					this.$axios
						.post(
							"/data/my",
							this.$qs.stringify({
								pathL: "/ap/sysUser/resetPwd",
								id: this.pswID,
								newPwd: this.$md5(pwFrom.newpwder)
							})
						)
						.then(res => {
							if (res.data.state === 0) {
								this.$message({
									message: "修改成功！",
									type: "success",
									center: true
								});
								for (let i in this.pwFrom) {
									this.pwFrom[ i ] = "";
								}
								this.psw = false;
							}
							else {
								this.$message({
									type: "info",
									message: res.data.msg,
									center: true
								});
							}
						})
						.catch(err => {
							console.log(err);
						});
				}
				else {
					this.$message({
						message: "请确保输入两次密码相同",
						center: true
					});
				}
			},
			changeOther (data) {
				this.ygFrom.divisionId = "";
				this.ygFrom.departmentId = "";
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysDivision/cascade",
							divisionId: data
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.firstDivs = res.data.data.divisions;
							this.departs = res.data.data.departs;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			changeNext (data) {
				this.ygFrom.departmentId = "";
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysDivision/cascade",
							divisionId: data
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.departs = res.data.data.departs;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		mounted () {
			this.$axios
				.post("/data/my", {
					pathL: "/ap/sysUser/list",
					pageSize: this.pageSize
				})
				.then(res => {
					if (res.data.state === 0) {
						this.loading = false;
						this.pageLength = res.data.data.page.total;
						this.tableData = res.data.data.page.result;
						var divs = res.data.data.divs;
						var titles = res.data.data.titles;
						var roles = res.data.data.roles;
						for (var i = 0; i < divs.length; i++) {
							this.divs.push({
								title: divs[ i ].divisionName,
								id: divs[ i ].id,
								parentId: divs[ i ].parentId
							});
						}

						for (var c = 0; c < titles.length; c++) {
							this.titles.push({
								title: titles[ c ].titleName,
								id: titles[ c ].id,
								parentId: titles[ c ].parentId
							});
						}
						for (var d = 0; d < roles.length; d++) {
							this.roles.push({
								title: roles[ d ].roleName,
								id: roles[ d ].id,
								parentId: roles[ d ].parentId
							});
						}
					}
					else {
						this.$message({
							type: "info",
							message: res.data.msg,
							center: true
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
			// 获取 table 高度
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop - 185;
			})
			window.onresize = () => {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop - 185;
			}
		}
	};
</script>

<style scoped>
  .password {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
  }

  .password_content {
    width: 600px;
    height: 240px;
    background: #fff;
  }

  .pw_top,
  .pw_bottom {
    width: 100%;
    height: 40px;
  }

  .pw_top {
    text-align: center;
    padding: 0 20px;
    box-sizing: border-box;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  .pw_top span {
    line-height: 40px;
  }

  .pw_center {
    width: 100%;
    height: 140px;
    padding: 20px;
    box-sizing: border-box;
  }

  .pw_top i {
    cursor: pointer;
    float: right;
    line-height: 40px;
  }

  .pw_bottom {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid #ccc;
  }
</style>
