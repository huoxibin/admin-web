<template>

  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <span>菜单管理</span>
        <el-button @click="add" size="mini" type="primary">添加</el-button>
      </div>
    </div>
    <div class="health-bottom">
      <div class="column-bottom" v-loading="loading" element-loading-text="正在加载中">
        <el-table ref="data" :height="tableHeight" :data="tableData" stripe style="width: 100%">
          <el-table-column show-overflow-tooltip prop="status" label="编号" align="center">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="menuName" label="菜单名称" align="center">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="menuLevel" label="菜单级别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.menuLevel=== 0">一级</span>
              <span v-if="scope.row.menuLevel=== 1">二级</span>
              <span v-if="scope.row.menuLevel=== 2">三级</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="menuType" label="菜单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.menuType=== 1">资源菜单</span>
              <span v-if="scope.row.menuType=== 2">按钮菜单</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="linkUrl" label="菜单链接地址" align="center">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="icon" label="菜单图标" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="updata(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" :page-sizes="[10,20,50,100]" :page-size="15"
                     @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                     :total="pageLength">
      </el-pagination>
    </div>
    <div class="addMenu" v-if="boxShow==='addMenu'">
      <div class="addMenu_content">

        <div class="addMenu_top">
          <span>菜单信息编辑</span>
          <i @click="boxShow=false" class="el-icon-close"></i>
        </div>

        <div class="addMenu_center">
          <el-form ref="addMenuFrom" style="width:600px" size="mini" :rules="addMenuFromRules" :model="addMenuFrom"
                   label-width="100px">
            <el-form-item style="margin-top:20px" label="菜单名称" prop="menuName">
              <el-input v-model="addMenuFrom.menuName"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="addMenuFrom.menuType">
                <el-radio label=1>资源菜单</el-radio>
                <el-radio label=2>按钮菜单</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上级菜单" prop="region">
              <el-cascader style="width:500px" :options="options" v-model="addMenuFrom.region" @change="handleChange"
                           change-on-select :props="caspraops">
              </el-cascader>
            </el-form-item>
            <el-form-item label="链接地址" prop="linkUrl">
              <el-input v-model="addMenuFrom.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label="动作标识" prop="name">
              <el-input v-model="addMenuFrom.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="addMenuFrom.icon"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="addMenu_bottom">
          <el-button @click="addSubmit(addMenuFrom)" style="width:80px" size="mini" type="primary" round>确定
          </el-button>
        </div>

      </div>
    </div>

    <div class="updataMenu addMenu" v-if="boxShow==='updataMenu'">
      <div class="addMenu_content">

        <div class="addMenu_top">
          <span>菜单信息编辑</span>
          <i @click="boxShow=false" class="el-icon-close"></i>
        </div>

        <div class="addMenu_center">
          <el-form ref="updataFrom" style="width:600px" size="mini" :rules="addMenuFromRules" :model="updataFrom"
                   label-width="100px">
            <el-form-item label="菜单名称" style="margin-top:20px" prop="menuName">
              <el-input v-model="updataFrom.menuName"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="updataFrom.menuType">
                <el-radio :label=1>资源菜单</el-radio>
                <el-radio :label=2>按钮菜单</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上级菜单" prop="region">
              <el-cascader style="width:500px" :options="options" v-model="addMenuFrom.region" @change="handleChange"
                           change-on-select :props="caspraops">
              </el-cascader>
            </el-form-item>
            <el-form-item label="链接地址" prop="linkUrl">
              <el-input v-model="updataFrom.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label="动作标识" prop="name">
              <el-input v-model="updataFrom.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="updataFrom.icon"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="addMenu_bottom">
          <el-button @click="updataSubmit(updataFrom)" style="width:80px" size="mini" type="primary" round>确定
          </el-button>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
	export default {
		data () {
			return {
				tableHeight:0,
				loading: true,
				pageLength: null,
				boxShow: null,
				tableData: [],
				addMenuFrom: {
					menuName: "",
					parentId: "",
					linkUrl: "",
					icon: "",
					weight: "",
					platformType: ""
				},
				addMenuFromRules: {
					menuName: [
						{
							required: true,
							message: "内容不能为空!",
							trigger: "blur"
						}
					],
					menuType: [
						{
							required: true,
							message: "内容不能为空!",
							trigger: "change"
						}
					],
					linkUrl: [
						{
							required: true,
							message: "内容不能为空!",
							trigger: "blur"
						}
					]
				},
				updataFrom: {},
				pageSize: 10,
				pageNum: 1,
				options: [],
				caspraops: {
					value: "id",
					label: "menuName"
				},
				parentId: null
			};
		},
		methods: {
			loadData () {
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysMenu/listPage",
							pageNum: this.pageNum,
							pageSize: this.pageSize
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.loading = false;
							this.pageLength = res.data.data.total;
							this.tableData = res.data.data.result;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			handleChange (value) {
				var valueLength = value.length - 1;
				this.parentId = value[ valueLength ];
			},
			add () {
				this.boxShow = "addMenu";
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysMenu/getAllMenuTree"
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.options = res.data.data;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			updata (row) {
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysMenu/details",
						id: row.id
					})
					.then(res => {
						if (res.data.state === 0) {
							this.updataFrom = res.data.data;
						}
					})
					.catch(err => {
						console.log(err);
					});
				this.boxShow = "updataMenu";
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysMenu/getAllMenuTree",
							menuId: row.id
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.options = res.data.data;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			remove (row) {
				this.$confirm("是否执行删除操作?", "删除确认", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({pathL: "/ap/sysMenu/del", id: row.id})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "删除成功",
										center: true
									});
									this.addMenuShow = false;
									this.loadData();
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
			handleSizeChange (val) {
				this.pageSize = val;
				this.loadData();
			},
			handleCurrentChange (val) {
				this.pageNum = val;
				this.loadData();
			},
			addSubmit (addMenuFrom) {
				this.$refs.addMenuFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysMenu/save/",
									menuName: addMenuFrom.menuName,
									parentId: Number(this.parentId),
									linkUrl: addMenuFrom.linkUrl,
									icon: addMenuFrom.icon,
									platformType: 1,
									menuType: addMenuFrom.menuType
								})
							)
							.then(res => {
								console.log(res);
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "添加成功！",
										center: true
									});
									this.boxShow = false;
									this.loadData();
									for (var i in this.addMenuFrom) {
										this.addMenuFrom[ i ] = "";
									}
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
			updataSubmit (updataFrom) {
				this.$refs.updataFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysMenu/save/",
									id: updataFrom.id,
									menuName: updataFrom.menuName,
									parentId: Number(this.parentId),
									linkUrl: updataFrom.linkUrl,
									icon: updataFrom.icon,
									platformType: 1,
									menuType: updataFrom.menuType
								})
							)
							.then(res => {
								console.log(res);
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "修改成功！",
										center: true
									});
									for (var m in this.updataFrom) {
										this.updataFrom[ m ] = "";
									}
									this.boxShow = false;
									this.loadData();
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
			}
		},
		mounted () {
			this.loadData();
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
			})
      window.onresize=()=>{
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;

			}
		}
	};
</script>

<style scoped>
  .qxgl {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  .qxgl_content {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  .qxgl_top {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .qxgl_top span {
    font-size: 14px;
  }

  .fenye {
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

  .qxgl_bottom {
    width: 100%;
    flex: 1;
    background: red;
    display: flex;
    flex-flow: column wrap;
  }

  .table {
    flex: 1;
    width: 100%;
  }

  .addMenu {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.3);
  }

  .addMenu_content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 800px;
    height: 420px;
    background: #fff;
    border-radius: 10px;
  }

  .addMenu_top {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .addMenu_top i {
    cursor: pointer;
  }

  .addMenu_center {
    width: 100%;
    height: 320px;
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;
  }

  .addMenu_bottom {
    width: 100%;
    height: 50px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
</style>
