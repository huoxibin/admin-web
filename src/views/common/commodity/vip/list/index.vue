<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <div>
          <el-button @click="reset(form)" size="mini" type="primary">重 置</el-button>
          <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
        </div>
      </div>

      <el-form ref="form" size="mini" inline style="margin-top:18px" :model="form" label-width="100px">
        <el-form-item label="套餐名称">
          <el-input v-model="form.packageName"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <p>订单列表</p>
        <el-button @click="add" size="mini" type="primary">添加套餐</el-button>
      </div>
      <div ref="table" class="column-bottom">
        <el-table :height="tableHeight" :data="tableData" border stripe style="width: 100%" v-loading="loading" element-loading-text="正在加载中"
                  ref="data">
          <el-table-column label="序号" align="center" type="index" :index="indexMethod" width="100px">
          </el-table-column>

          <el-table-column prop="name" label="套餐名称" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="面向人群" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.directFamilyKind === 0 ? '全部' : (scope.row.directFamilyKind === 1 ? '非会员家庭' : '会员家庭')}}
            </template>
          </el-table-column>
          <el-table-column prop="memberCount" label="人数" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.memberCount == 3">3</span>
              <span v-if="scope.row.memberCount == 4">4</span>
              <span v-if="scope.row.memberCount == 5">5</span>
              <span v-if="scope.row.memberCount == 6">6</span>
              <span v-if="scope.row.memberCount == 999">不限制</span>
              <span v-if="scope.row.memberCount == -1">不配置</span>
            </template>
          </el-table-column>
          <el-table-column prop="indate" label="有效期限" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.indate}}{{scope.row.indateType === 1 ? '年' : (scope.row.indateType === 2 ? '月' : '日')}}
            </template>
          </el-table-column>
          <el-table-column prop="price" :formatter="toFixed" label="价格(RMB)" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column sortable prop="sort" label="排序" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column sortable prop="editTime" label="编辑时间" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status=== 1" @change="statusChange(scope.row)" active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="120" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status===2" @click="update(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" @click="find(scope.row)" size="small">查看</el-button>
              <el-button v-if="scope.row.status===2" @click="remove(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				tableHeight:0,
				//搜索form检验
				form: {
					price: '',
					packageName: ''
				},
				tableData: [
					{status: 2}
				],
				pageNum: 1,//当前页码
				pageSize: 10,//y一页显示多少条
				pageLength: 0,//总共多少条数据
				loading: true
			};
		},
		beforeRouteEnter (to, from, next) {
			if (
				from.name !== "商品管理/会员服务配置/列表/查看"
				&&
				from.name !== "商品管理/会员服务配置/列表/编辑"
			) {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.form) {
						vm.form[ i ] = "";
					}
					;
					vm.queryList();
				})
			}
			else {
				next(vm => {
					vm.queryList();
				});
			}
		},
		methods: {
			// 序号
			indexMethod (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			//金额保留2位小数
			toFixed (row) {
				if (row.price) {
					let price = row.price.toFixed(2);
					return price;
				}
				return '';
			},
			//获取会员套餐列表
			queryList (val) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/family/familyServicepackage/getAllPackagesWithSearch",
					pageNum: this.pageNum,//当前页码
					pageSize: this.pageSize,//每页显示得条数
          /* price:this.form.price,//价格
           packageName:this.form.packageName//套餐名称*/
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
				})
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 搜索
			search (form) {
				this.pageNum = 1;
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/family/familyServicepackage/getAllPackagesWithSearch",
					pageNum: this.pageNum,//当前页码
					pageSize: this.pageSize,//每页显示得条数
					price: this.form.price === '' ? null : this.form.price,//价格
					packageName: this.form.packageName//套餐名称
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
						this.$message({
							message: "搜索完成",
							type: "success",
							center: true
						});
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				})
			},
			// 重置搜索表单
			reset (form) {
				for (let i in form) {
					form[ i ] = "";
				}
				;
				this.loading = true;
				this.pageNum = 1;
				// this.queryList();
				this.$get("/data/my", {
					pathL: "/family/familyServicepackage/getAllPackagesWithSearch",
					pageNum: this.pageNum,//当前页码
					pageSize: this.pageSize,//每页显示得条数
          /* price:this.form.price,//价格
           packageName:this.form.packageName//套餐名称*/
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
						this.$message({
							message: "搜索表单已重置",
							type: "success",
							center: true
						});
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 添加套餐
			add () {
				this.$router.push({
					name: "商品管理/会员服务配置/列表/新增"
				});
			},
			// 编辑
			update (row) {
				this.$router.push({
					name: "商品管理/会员服务配置/列表/编辑",
					query: {
						id: row.id
					}
				});
			},
			// 查看
			find (row) {
				this.$router.push({
					name: "商品管理/会员服务配置/列表/查看",
					query: {
						id: row.id
					}
				});
			},
			// 修改状态
			statusChange (row) {
				let message = row.status === 1 ? "关闭后，即下架此套餐，还要继续关闭吗？" : "开启后，即上架此套餐，是否继续开启吗？";
				let title = row.status === 1 ? "关闭" : "开启";
				let success = row.status === 1 ? "关闭成功" : "开启成功";
				let info = row.status === 1 ? "已取消关闭" : "已取消开启";
				let statusNum = Number(3 - row.status);
				this.$confirm(message, title, {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					//改变状态接口
					this.$post("/data/my", {
						pathL: "/family/familyServicepackage/changeStatus",
						id: row.id,//记录ID
						status: statusNum //状态 1-开启 2-关闭
					}).then(res => {
						if (res.state === 0) {
							console.log(res);
							this.queryList();
							this.$message({
								type: "success",
								message: success,
								center: true
							});
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
							message: info,
							center: true
						});
					});
			},
			// 删除
			remove (row) {
				this.$confirm("删除后该套餐将无法找回，是否继续删除？", "删除", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					//删除按钮接口
					this.$post("/data/my", {
						pathL: "/family/familyServicepackage/delServicePackage",
						id: row.id//记录ID
					}).then(res => {
						if (res.state === 0) {
							this.queryList();
							this.$message({
								type: "success",
								message: "删除成功",
								center: true
							});
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
						message: "已取消删除",
						center: true
					});
				});
			}
		},
		mounted () {
			this.queryList();
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
			})
			window.onresize=()=>{
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;

			}
		}
	};
</script>
