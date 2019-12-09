<template>
  <div class="health comment">
    <div class="health-top">
      <!-- title -->
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(bmFrom)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!-- 表单查询 -->
      <el-form ref="bmFrom" class="m-t-10" size="mini" :model="bmFrom" label-width="100px" label-suffix="："
               label-position="right">
        <div class="ygtop">
          <el-form-item label="输入搜索">
            <el-input size="mini" style="width:150px" v-model="bmFrom.roleName" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item label="账号状态">
            <el-select size="mini" v-model="bmFrom.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value=1></el-option>
              <el-option label="禁用" value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker size="mini" :picker-options="pickerOptions" v-model="bmFrom.date" type="daterange"
                            value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </div>

      </el-form>

    </div>
    <!-- 数据操作 -->
    <div class="health-bottom">
      <div class="title-bar">
        <span>数据列表</span>
        <el-button @click="addMtk" size="mini" type="primary">新增</el-button>
      </div>

      <!-- 表格 -->
      <div class="column-bottom" v-loading="loading" element-loading-text="正在加载中">
        <el-table ref="data" :height="tableHeight" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="id" label="序号" align="center" width="70">
          </el-table-column>
          <el-table-column prop="platform" label="所属平台" align="center" width="200">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称" align="center" width="200">
          </el-table-column>
          <el-table-column prop="divisionId" label="所属机构" align="center" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.divisionId=== 0">北京健科云网科技有限公司</span>
            </template>
          </el-table-column>
          <el-table-column prop="descript" label="角色描述" align="center" width="200">
          </el-table-column>
          <el-table-column prop="delFlag" label="账号状态" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.delFlag=== 1">启用</span>
              <span v-if="scope.row.delFlag=== 2" style="color: red">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastOperateName" label="操作人" align="center" width="200">
          </el-table-column>
          <el-table-column prop="updateTime" label="操作日期" align="center" width="160">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button @click="updata(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
              <el-button v-if="scope.row.delFlag=== 2" @click="status(scope.row)" type="text" size="small">启用
              </el-button>
              <el-button v-if="scope.row.delFlag=== 1" @click="status(scope.row)" type="text" size="small">禁用
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          :page-sizes="[10,20,50,100]"
          :page-size="10"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageLength">
        </el-pagination>
      </div>
    </div>
    <!-- 新增角色 -->
    <div class="addmtk_wrap" v-show="addMtkShow">
      <div class="addmtk">
        <div class="addmtk_top">
          <span>新增角色</span>
          <i @click="addMtkShow=false" class="el-icon-close"></i>
        </div>

        <div class="addmtkshow">

          <!-- 平台 -->
          <div class="addmtkshow_left">
            <el-form ref="jsFrom" style="width:100%" :model="jsFrom" :rules="jsFromRules" label-width="100px"
                     label-suffix="：" label-position="right">
              <el-form-item label="所属企业">
                <el-input disabled size="mini" v-model="commonValue"></el-input>
              </el-form-item>
              <el-form-item label="角色名称" prop="roleName">
                <el-input size="mini" v-model="jsFrom.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色介绍" prop="descript">
                <el-input style="margin-top:15px;" resize="none" type="textarea" :rows="8" placeholder="请输入内容"
                          v-model="jsFrom.descript">
                </el-input>
              </el-form-item>
            </el-form>
          </div>

          <div class="addmtkshow_right">
            <el-tree :data="treeList" show-checkbox node-key="id" ref="tree" :props="treeProps">
            </el-tree>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="aniu">
          <el-button @click="add(jsFrom)" size="mini" type="primary">保存</el-button>
          <el-button @click="addMtkShow=false" size="mini" type="info" plain>取消</el-button>
        </div>
      </div>
    </div>

    <!-- 修改角色 -->
    <div class="addmtk_wrap" v-show="updataMtkShow">
      <div class="addmtk">
        <div class="addmtk_top">
          <span>修改角色</span>
          <i @click="updataMtkShow=false" class="el-icon-close"></i>
        </div>

        <div class="addmtkshow">

          <!-- 平台 -->
          <div class="addmtkshow_left">
            <el-form ref="updataFrom" style="width:100%" :model="updataFrom" :rules="jsFromRuleser" label-width="100px"
                     label-suffix="：" label-position="right">
              <el-form-item label="所属企业" prop="commonValue">
                <el-input disabled size="mini" v-model="commonValue"></el-input>
              </el-form-item>
              <el-form-item label="角色名称" prop="roleName">
                <el-input size="mini" v-model="updataFrom.roleName" :value="updataFrom.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色介绍" prop="descript">
                <el-input resize="none" style="margin-top:15px;" type="textarea" :rows="8" placeholder="请输入内容"
                          v-model="updataFrom.descript" :value="updataFrom.descript">
                </el-input>
              </el-form-item>
            </el-form>
          </div>

          <div class="addmtkshow_right">
            <el-tree :data="treeLists" show-checkbox node-key="id" ref="trees" :props="treeProps"
                     :default-checked-keys="selectedKey" :default-expanded-keys="selectedKey">
            </el-tree>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="aniu">
          <el-button @click="updataSubmit(updataFrom)" size="mini" type="primary">保存</el-button>
          <el-button @click="updataMtkShow=false" size="mini" type="info" plain>取消</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
	export default {
		data () {
			return {
				tableHeight: 0,
				loading: true,
				selectedKey: [],
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				commonValue: "北京健科云网科技有限公司",
				jsFromRules: {
					roleName: [
						{
							required: true,
							message: "请将字数控制在10个字之内！",
							trigger: "blur"
						},
						{
							min: 1,
							max: 10,
							message: "请将字数控制在10个字之内！",
							trigger: "blur"
						}
					]
				},
				jsFromRuleser: {
					roleName: [
						{
							required: true,
							message: "请将字数控制在10个字之内！",
							trigger: "blur"
						},
						{
							min: 1,
							max: 10,
							message: "请将字数控制在10个字之内！",
							trigger: "blur"
						}
					]
				},
				updataMtkShow: false,
				menuIds: [],
				pageLength: null,
				addTab: false,
				addMtkShow: false,
				tableData: [],
				treeList: [],
				treeLists: [],
				treeProps: {
					children: "children",
					label: "menuName"
				},
				jsFrom: {
					roleName: "",
					descript: ""
				},
				bmFrom: {
					roleName: "",
					status: "",
					date: ""
				},
				updataFrom: {},
				pageNum: 1,
				pageSize: 10
			};
		},
		methods: {
			loadData () {
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysRole/list",
							pageNum: this.pageNum,
							pageSize: this.pageSize
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.loading = false;
							this.tableData = res.data.data.result;
							this.pageLength = res.data.data.total;
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
				this.$confirm("您确定要删除该角色吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysRole/delete",
									id: Number(row.id)
								})
							)
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
			search (bmFrom) {
				console.log(bmFrom);
				if (bmFrom.date === null) {
					bmFrom.date = "";
				}
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysRole/list",
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							roleName: bmFrom.roleName,
							status: bmFrom.status,
							startTime: bmFrom.date[ 0 ],
							endTime: bmFrom.date[ 1 ]
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								type: "success",
								message: "完成查询",
								center: true
							});
							this.tableData = res.data.data.result;
							this.pageLength = res.data.data.total;
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
			status (row) {
				this.$axios
					.post(
						"/data/my",
						this.$qs.stringify({
							pathL: "/ap/sysRole/changeStatus",
							id: Number(row.id),
							status: 3 - Number(row.delFlag)
						})
					)
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								type: "success",
								message: "设置成功",
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
			updataSubmit (updataFrom) {
				var treeValues = this.$refs.trees.getCheckedNodes(false, true);
				var menuIdss = [];
				var lastUserId = this.$store.getters.userId;
				for (var q = 0; q < treeValues.length; q++) {
					menuIdss.push(treeValues[ q ].id);
				}

				let parentId = [];
				let parentIds = [];

				for (let c = 0; c < menuIdss.length; c++) {
					parentId[ c ] = this.$refs.trees.getNode(menuIdss[ c ]).parent.data.id;
					if (parentId[ c ] === undefined) {
					}
					else {
						parentIds.push(parentId[ c ]);
					}
				}
				const parentIdArr = new Set(parentIds);
				const idArr = [ ...[ ...parentIdArr ], ...menuIdss ];
				const idArrs = [ ...new Set(idArr) ];

				this.$refs.updataFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysRole/save",
									id: updataFrom.id,
									roleName: updataFrom.roleName,
									descript: updataFrom.descript,
									menuIds: idArrs.join(","),
									lastUserId: lastUserId,
									delFlag: updataFrom.delFlag
								})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "修改成功",
										center: true
									});
									this.updataMtkShow = false;
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
					}
					else {
						this.$message({
							message: "请填写正确的表单信息",
							center: true
						});
					}
				});
			},
			updata (row) {
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysRole/details",
						id: row.id
					})
					.then(res => {
						if (res.data.state === 0) {
							this.updataFrom = res.data.data;
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
				this.updataMtkShow = true;
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysMenu/getMenuByPlatform",
							platformType: 1,
							roleId: row.id
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.treeLists = res.data.data.trees;
							this.selectedKey = res.data.data.selected;
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
			add (jsFrom) {
				var treeValue = this.$refs.tree.getCheckedNodes();
				var menuIds = [];
				var lastUserId = this.$store.getters.userId;
				for (var p = 0; p < treeValue.length; p++) {
					menuIds.push(treeValue[ p ].id);
				}
				let parentId = [];
				let parentIds = [];
				for (let c = 0; c < menuIds.length; c++) {
					parentId[ c ] = this.$refs.tree.getNode(menuIds[ c ]).parent.data.id;
					if (parentId[ c ] === undefined) {
					}
					else {
						parentIds.push(parentId[ c ]);
					}
				}
				const parentIdArr = new Set(parentIds);
				const idArr = [ ...[ ...parentIdArr ], ...menuIds ];
				const idArrs = [ ...new Set(idArr) ];

				this.$refs.jsFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysRole/save",
									roleName: jsFrom.roleName,
									descript: jsFrom.descript,
									menuIds: idArrs.join(","),
									lastUserId: lastUserId
								})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "添加成功",
										center: true
									});
									this.addMtkShow = false;
									this.loadData();
									for (var i in this.jsFrom) {
										this.jsFrom[ i ] = "";
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
					}
					else {
						this.$message({
							message: "请填写正确的表单信息",
							center: true
						});
					}
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
			addMtk () {
				this.addMtkShow = true;
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysMenu/getMenuByPlatform",
							platformType: 1
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.treeList = res.data.data.trees;
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
			this.loadData();
			// 获取 table 高度
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop;
			})
			window.onresize = ()=>{
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop;

			}
		}
	};
</script>

<style scoped>
  .ygtop {
    display: flex;
  }

  .addmtk_wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .addmtk {
    width: 800px;
    height: 500px;
    background: #fff;
    border-radius: 5px;
    position: relative;
  }

  .addmtk_top {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px 5px 0 0;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
  }

  .addmtk_top i {
    float: right;
    margin: 0 10px;
    line-height: 40px;
    cursor: pointer;
  }


  .aniu {
    width: 100%;
    height: 50px;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #ccc;
    justify-content: space-around;
    align-items: center;
  }

  .addmtkshow {
    width: 100%;
    height: 410px;
    display: flex;
  }

  .addmtkshow_left,
  .addmtkshow_right {
    flex: 1;
    height: 100%;
    padding-top: 20px;
    box-sizing: border-box;
    overflow: auto;
  }

</style>
