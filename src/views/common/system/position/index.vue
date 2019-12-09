<template>
  <div class="health comment">
    <div class="health-top">
      <!-- title -->
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(bmFrom)" size="mini" type="primary">搜索查询</el-button>
      </div>

      <!-- 表单查询 -->
      <el-form :inline="true" ref="bmFrom" size="mini" :model="bmFrom" label-width="90px" label-position="right">
        <div class="ygtop" style="margin-top:20px;">
          <el-form-item label="输入搜索">
            <el-input size="mini" style="width:150px" v-model="bmFrom.titleName" placeholder="职位名称"></el-input>
          </el-form-item>
          <el-form-item label="账号状态">
            <el-select size="mini" v-model="bmFrom.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker size="mini" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                            :default-value="bmFrom.date" v-model="bmFrom.date" type="daterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>

    </div>
    <div class="health-bottom">
      <!-- 数据操作 -->
      <div class="title-bar">
        <span>数据列表</span>
        <el-button @click="boxShow='addShow'" size="mini" type="primary">新增</el-button>
      </div>

      <!-- 表格 -->
      <div class="column-bottom" v-loading="loading" element-loading-text="正在加载中">
        <el-table ref="data" :height="tableHeight" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="sort" label="显示排序" align="center" width="100">
          </el-table-column>
          <el-table-column prop="titleName" label="职位名称" align="center">
          </el-table-column>
          <el-table-column prop="status" label="账号状态" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status=== 1">启用</span>
              <span v-if="scope.row.status=== 2" style="color: red">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="操作人" align="center" width="100">
          </el-table-column>
          <el-table-column prop="updateTime" label="操作日期" align="center" width="200">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button @click="updataBox(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
              <el-button v-if="scope.row.status=== 2" @click="status(scope.row)" type="text" size="small">启用</el-button>
              <el-button v-if="scope.row.status=== 1" @click="status(scope.row)" type="text" size="small">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" :page-sizes="[10,20,50,100]" :page-size="15"
                       @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                       :total="pageLength">
        </el-pagination>
      </div>
    </div>
    <!-- 新增模态框 -->
    <div class="addmtk_wrap" v-if="boxShow==='addShow'">
      <div class="addmtk">
        <div class="addmtk_top">
          <span>新增职位</span>
          <i @click="boxShow=false" class="el-icon-close"></i>
        </div>
        <div class="addmtk_bottom" style="padding-top:20px">
          <el-form ref="addFrom" :model="addFrom" :rules="addFromRules" label-width="120px" style="width:500px"
                   label-suffix="：">
            <el-form-item label="职位名称" style="margin-bottom:10px;" prop="titleName">
              <el-input size="mini" v-model="addFrom.titleName" placeholder="职位名称"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" style="margin-bottom:10px;" prop="sort">
              <el-input size="mini" v-model="addFrom.sort" placeholder="显示排序"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNum">
              <el-input size="mini" v-model="addFrom.contactNum" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item label="职位介绍" style="margin-bottom:10px;">
              <el-input type="textarea" resize="none" :rows="3" placeholder="请输入内容" v-model="addFrom.introduce">
              </el-input>
            </el-form-item>
          </el-form>

          <!-- 按钮 -->
          <div class="aniu">
            <el-button @click="submit(addFrom)" size="mini" type="primary">保存</el-button>
            <el-button @click="boxShow=false" size="mini" type="info" plain>取消</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="addmtk_wrap" v-if="boxShow==='updataShow'">
      <div class="addmtk">
        <div class="addmtk_top">
          <span>修改职位</span>
          <i @click="boxShow=false" class="el-icon-close"></i>
        </div>
        <div class="addmtk_bottom" style="padding-top:20px">
          <el-form ref="updataFrom" :model="updataFrom" :rules="addFromRules" label-width="120px" style="width:500px"
                   label-suffix="：">
            <el-form-item label="职位名称" style="margin-bottom:10px;" prop="titleName">
              <el-input size="mini" v-model="updataFrom.titleName" placeholder="职位名称"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" style="margin-bottom:10px;" prop="sort">
              <el-input size="mini" v-model="updataFrom.sort" placeholder="显示排序"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNum">
              <el-input size="mini" v-model="updataFrom.contactNum" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item label="职位介绍" style="margin-bottom:10px;">
              <el-input type="textarea" resize="none" :rows="3" placeholder="请输入内容" v-model="updataFrom.introduce">
              </el-input>
            </el-form-item>
          </el-form>

          <!-- 按钮 -->
          <div class="aniu">
            <el-button @click="updata(updataFrom)" size="mini" type="primary">保存</el-button>
            <el-button @click="boxShow=false" size="mini" type="info" plain>取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import { isValidPhone } from "@/utils/RegExp.js";

	var CheckTel = (rule, value, callback) => {
		if (!value) {
			callback(new Error("请输入电话号码"));
		}
		else if (!isValidPhone(value)) {
			callback(new Error("请输入正确的11位手机号码"));
		}
		else {
			callback();
		}
	};
	export default {
		data () {
			return {
				tableHeight:0,
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				loading: true,
				pageLength: null,
				boxShow: null,
				tableData: [],
				addFromRules: {
					titleName: [
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
					],
					contactNum: [
						{
							required: true,
							validator: CheckTel,
							trigger: "blur"
						}
					],
					sort: [
						{
							required: true,
							message: "请输入数字排序",
							trigger: "blur"
						},
						{
							min: 1,
							max: 5,
							message: "请将字数控制在5个字之内！",
							trigger: "blur"
						}
					]
				},
				bmFrom: {
					titleName: "",
					status: "",
					date: ""
				},
				updataFrom: {},
				addFrom: {
					sort: "",
					contactNum: "",
					titleName: "",
					introduce: ""
				},
				divs: [],
				firstDivs: [],
				departs: [],
				roles: [],
				titles: [],
				pageSize: 10,
				pageNum: 1
			};
		},
		methods: {
			loadData () {
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysTitle/list",
						pageNum: this.pageNum,
						pageSize: this.pageSize
					})
					.then(res => {
						if (res.data.state === 0) {
							this.loading = false;
							this.pageLength = res.data.data.total;
							this.tableData = res.data.data.result;
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
				this.$confirm("您确定要删除该职位吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post("/data/my", {
								pathL: "/ap/sysTitle/remove",
								id: row.id
							})
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										message: "删除成功",
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
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			updataBox (row) {
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysTitle/list",
						id: row.id
					})
					.then(res => {
						if (res.data.state === 0) {
							this.updataFrom = res.data.data.result[ 0 ];
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
				this.boxShow = "updataShow";
			},
			updata (updataFrom) {
				this.$refs.updataFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post("/data/my", {
								pathL: "/ap/sysTitle/duplicate",
								id: updataFrom.id,
								titleName: updataFrom.titleName,
								sort: updataFrom.sort
							})
							.then(res => {
								if (res.data.state === 0) {
									this.$axios
										.post("/data/my", {
											pathL: "/ap/sysTitle/update",
											id: updataFrom.id,
											titleName: updataFrom.titleName,
											status: updataFrom.status,
											lastUserId: "1",
											sort: updataFrom.sort,
											introduce: updataFrom.introduce,
											contactNum: updataFrom.contactNum
										})
										.then(res => {
											if (res.data.state === 0) {
												this.$message({
													message: "修改成功",
													type: "success",
													center: true
												});
												this.boxShow = false;
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
			status (row) {
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysTitle/status",
						id: row.id,
						status: 3 - row.status
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
			handleSizeChange (val) {
				this.pageSize = val;
				this.loadData();
			},
			handleCurrentChange (val) {
				this.pageNum = val;
				this.loadData();
			},
			submit (addFrom) {
				var lastUserId = this.$store.getters.userId;
				this.$refs.addFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post("/data/my", {
								pathL: "/ap/sysTitle/duplicate",
								titleName: addFrom.titleName,
								sort: addFrom.sort
							})
							.then(res => {
								if (res.data.state === 0) {
									this.$axios
										.post("/data/my", {
											pathL: "/ap/sysTitle/save",
											titleName: addFrom.titleName,
											status: "1",
											sort: addFrom.sort,
											introduce: addFrom.introduce,
											contactNum: addFrom.contactNum,
											lastUserId: lastUserId
										})
										.then(res => {
											if (res.data.state === 0) {
												this.$message({
													message: "添加成功",
													type: "success",
													center: true
												});
												this.loadData();
												this.boxShow = false;
												for (let key in this.addFrom) {
													this.addFrom[ key ] = "";
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
			search (bmFrom) {
				if (bmFrom.date === null) {
					bmFrom.date = ""
				}
				this.$axios
					.post("/data/my", {
						pathL: "/ap/sysTitle/list",
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						status: bmFrom.status,
						startTime: bmFrom.date[ 0 ],
						endTime: bmFrom.date[ 1 ],
						titleName: bmFrom.titleName
					})
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								message: "查询完成",
								type: "success",
								center: true
							});
							this.pageLength = res.data.data.total;
							this.tableData = res.data.data.result;
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
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
			})
			window.onresize = ()=>{
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;

			}
		}
	};
</script>

<style scoped>


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
    width: 600px;
    height: 500px;
    background: #fff;
    border-radius: 5px;
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

  .addmtk_bottom {
    border-top: 1px solid #ccc;
  }

  .aniu {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }


</style>
