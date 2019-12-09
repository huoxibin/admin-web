<template>
  <div class="health comment">
    <base-layout ref="loyout" methods="post" style="height: 100%" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="内容状态">
          <el-select v-model="form.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上线" value="1"></el-option>
            <el-option label="待审核" value="4"></el-option>
            <el-option label="未过审" value="2"></el-option>
            <el-option label="待上线" value="3"></el-option>
            <el-option label="已下线" value="5"></el-option>
            <el-option label="直播中" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.sysUserName"></el-input>
        </el-form-item>
        <el-form-item label="课程讲师">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="muiltVal.first" class="w-100" @change="choseVal(1)" placeholder="请选择">
            <el-option
              v-for="item in muiltselect.firstList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="muiltVal.second"
            class="w-100"
            @change="choseVal(2)"
            placeholder="请选择"
          >
            <el-option
              v-for="item in muiltselect.secondList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="muiltVal.threed"
            class="w-100"
            @change="choseVal(3)"
            placeholder="请选择"
          >
            <el-option
              v-for="item in muiltselect.threedList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布渠道">
          <el-select v-model="form.channel">
            <el-option label="全部" value=""></el-option>
            <el-option label="医哆咖" value="2"></el-option>
            <el-option label="哆咖医生" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="dateCreate"
            @change="getCreateTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>

          <!--<base-date v-model="dateCreate" type="daterange" format="yyyy-MM-dd" ></base-date>-->
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="datePublish"
            @change="getPublishTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="直播日期">
          <el-date-picker
            v-model="datePlay"
            @change="getLiveTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" @click="addInfo">新增</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="exportList">导出</el-button>
      </div>
      <!--表格-->

      <el-table ref="table" :height="tableHeight" slot="table" :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="courseName" label="课程名称" align="center" width="180"></el-table-column>
        <el-table-column prop="doctorName" label="课程讲师" align="center" width="110"></el-table-column>
        <el-table-column prop="classify" label="所属分类" align="center" width="200"></el-table-column>
        <el-table-column prop="typeName" label="所属类型" align="center" width="200"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
        <el-table-column prop="liveTime" label="直播时间" align="center" width="150"></el-table-column>
        <el-table-column prop="sysUserName" label="创建人" align="center"></el-table-column>
        <el-table-column prop="channel" label="发布渠道" align="center"></el-table-column>
        <el-table-column prop="readCount" label="阅读量" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>

        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status!=='待上线' && scope.row.status!=='待审核' && scope.row.status!=='已下线' && scope.row.status!=='审核未通过'"
              @click="toLineState(scope.$index, scope.row,5)"
            >下线
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status!=='已上线' && scope.row.status!=='直播中' && scope.row.status!=='待审核' && scope.row.status!=='审核未通过'"
              @click="toLineState(scope.$index, scope.row,1)"
            >发布
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status!=='已上线' && scope.row.status!=='直播中'"
              @click="toDel(scope.$index, scope.row)"
            >删除
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status!=='已上线' && scope.row.status!=='直播中' && scope.row.status!=='待上线' && scope.row.status!=='已下线'"
              @click="dialogCheckVisible = true;toReviewed(scope.$index, scope.row)"
            >审核
            </el-button>
            <el-button
              type="text"
              @click="showRowInfo(scope.$index, scope.row)"
              v-if="scope.row.status!=='待审核'"
              size="small"
            >查看
            </el-button>
            <el-button
              type="text"
              @click="editRowInfo(scope.$index, scope.row)"
              v-if="scope.row.status!=='已上线' && scope.row.status!=='直播中'"
              size="small"
            >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </base-layout>
    <!----审核的弹窗---->
    <el-dialog title="提示" :visible.sync="dialogCheckVisible" width="30%" append-to-body center>
      <el-form ref="checkForm" :rules="rules" :model="checkForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="checkForm.result">
            <el-radio :label="3">审核通过</el-radio>
            <el-radio :label="2">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" prop="desc" v-if="checkForm.showDesc">
          <el-input type="textarea" v-model="checkForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="13" :offset="6">
          <el-button @click="dialogCheckVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="saveReviewed()" size="mini">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
	import exportExcel from "@/api/excel";

	export default {
		data: () => ({
			tableHeight: 0,
			form: {
				pathL: "/doctor/livecourseInfo/list",
				name: "", // 课程名
				status: "", // 内容状态
				sysUserName: "", // 创建人
				doctorName: "", // 课程讲师
				baseId: "",
				departmentId: "",
				diseaseId: "",
				createTimeStart: "", // 创建开始时间
				createTimeEnd: "", // 创建结束时间
				publishTimeStart: "", //发布开始时间
				publishTimeEnd: "", //发布结束时间
				liveTimeStart: "", //直播开始日期
				liveTimeEnd: "", //直播结束时间
				pageNum: 1, //当前页
				pageSize: 10,//每页条数
				channel: ''
			},
			/////////////页面配置值///////////////
			dialogCheckVisible: false,
			rules: {
				desc: [
					{required: true, message: "请输入审核不通过原因", trigger: "blur"}
				]
			},
			checkForm: {
				id: null, //审核id
				result: null, //审核结果
				desc: "", //审核描述
				showDesc: false
			},
			dateCreate: null, //创建日期
			datePublish: null, // 发布日期
			datePlay: null, // 直播日期
			//////所属分类////////
			cateCurrLevel: {
				//设置获取当前分类下拉菜单的级别
				baseId: "", //1 级菜单
				departmentId: "", //二级菜单
				kind: 1 //级别菜单
			},
			muiltselect: {
				firstList: [],
				secondList: [],
				threedList: []
			},
			muiltVal: {
				first: "",
				second: "",
				threed: ""
			}, //三级多选的值
			tableData: []
		}),
		beforeRouteEnter (to, from, next) {
			if (from.path === "/commodity/playCourse/add") {
				next(vm => {
					console.log("不刷新定位"); // 重新进入页面并刷新表单
					vm.$refs.loyout.getData();
					vm.calcPageTable();
				});
			}
			else {
				console.log("重新刷新");
				next(vm => {
					vm.calcPageTable();
				});
			}
		},
		mounted () {
			// 获取 table 高度
			this.calcPageTable();
			this.getCateList(); //获取分类列表信息
		},
		watch: {
			"checkForm.result" () {
				if (this.checkForm.result == "2") {
					this.checkForm.showDesc = true;
				}
				else {
					this.checkForm.showDesc = false;
				}
			},
			$route () {
				this.calcPageTable();
			}
		},
		methods: {
			calcPageTable () {
				this.tableHeight = window.innerHeight - this.$refs.loyout.$refs.table.offsetTop - 80;
				//console.log(this.tableHeight);
			},
			// 获取数据
			getData (data) {
				if (!data.state) {
					data.result.forEach(item => {
						let arr = '';
						item.channel = item.channel.split(',');
						item.channel.forEach(im => {
							if (im == 1) {
								arr += ` 哆咖医生 `;
							}
							else {
								arr += ` 医哆咖 `;
							}
						})
						item.channel = arr;
					})
					this.tableData = data.result;
				}
			},
			getCreateTime () {
				this.form.createTimeStart =
					this.dateCreate !== null ? this.dateCreate[ 0 ] : "";
				this.form.createTimeEnd =
					this.dateCreate !== null ? this.dateCreate[ 1 ] : "";
			},
			getPublishTime () {
				this.form.publishTimeStart =
					this.datePublish !== null ? this.datePublish[ 0 ] : "";
				this.form.publishTimeEnd =
					this.datePublish !== null ? this.datePublish[ 1 ] : "";
			},
			getLiveTime () {
				this.form.liveTimeStart = this.datePlay !== null ? this.datePlay[ 0 ] : "";
				this.form.liveTimeEnd = this.datePlay !== null ? this.datePlay[ 1 ] : "";
			},
			choseVal (fg) {
				//监控下拉的变化
				switch (fg) {
					case 1: {
						//清空二级和三级的下拉列表
						this.muiltselect.secondList = [];
						this.muiltselect.threedList = [];
						//重置发送的参数
						this.cateCurrLevel.departmentId = "";
						this.cateCurrLevel.baseId = this.muiltVal.first;
						this.cateCurrLevel.kind = 2;
						//清空二级的选择项
						this.muiltVal.second = "";
						this.muiltVal.threed = "";
					}
						break;
					case 2: {
						this.muiltselect.threedList = []; //清空三级的 列表内容
						//重置发送的参数
						this.cateCurrLevel.kind = 3;
						this.cateCurrLevel.baseId = "";
						this.cateCurrLevel.departmentId = this.muiltVal.second;
						//清空三级的选择项
						this.muiltVal.threed = "";
					}
						break;
					case 3: {
					}
						break;
				}
				this.form.baseId = this.muiltVal.first;
				this.form.departmentId = this.muiltVal.second;
				this.form.diseaseId = this.muiltVal.threed;
				this.getCateList();
			},
			dealCateList (res) {
				//处理分类下拉列表的数据显示
				const firstRecord = {
					name: "请选择",
					id: ""
				};
				switch (this.cateCurrLevel.kind) {
					case 1: {
						this.muiltselect.firstList = res;
						this.muiltselect.firstList.unshift(firstRecord);
					}
						break;
					case 2: {
						this.muiltselect.secondList = res;
						this.muiltselect.secondList.unshift(firstRecord);
					}
						break;
					case 3: {
						this.muiltselect.threedList = res;
						this.muiltselect.threedList.unshift(firstRecord);
					}
						break;
				}
			},
			getCateList () {
				//获取分类信息
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getClassifyListByCondition",
					baseId: this.cateCurrLevel.baseId,
					departmentId: this.cateCurrLevel.departmentId,
					kind: this.cateCurrLevel.kind
				})
					.then(res => {
						if (!res.state) {
							that.dealCateList(res.data);
						}
					})
					.catch(err => {
					});
			},
			changeStatus: function (n) {
				switch (n) {
					case 4: {
						return "待审核";
					}
						break;
					case 2: {
						return "审核未通过";
					}
						break;
					case 3: {
						return "待上线";
					}
						break;
					case 1: {
						return "已上线";
					}
						break;
					case 5: {
						return "已下线";
					}
						break;
				}
			},
			toReviewed (idx, row) {
				this.checkForm.id = row.id;
				this.checkForm.result = null;
			}, //审核
			toDel (index, row) {
				let that = this;
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						that
							.$post("/data/my", {
								pathL: "/doctor/livecourseInfo/delete",
								id: row.id
							})
							.then(res => {
								if (!res.state) {
									that.$message({
										type: "success",
										message: "删除成功!"
									});
									setTimeout(() => {
										that.$refs.loyout.getData();
									}, 2000);
								}
								else {
									that.$message({
										type: "success",
										message: "删除失败!"
									});
								}
							})
							.catch(err => {
								console.log(err);
							});
						//this.delRecordeInfo=row;
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			toLineState: function (index, row, state) {
				let that = this;
				this.$post("/data/my", {
					pathL: "/doctor/livecourseInfo/edit",
					id: row.id,
					status: state
				})
					.then(res => {
						if (!res.state) {
							if (state == 1) {
								that.$message("上线成功！");
							}
							else {
								that.$message("下线成功！");
							}
							that.$refs.loyout.getData();
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			exportList () {
				//导出
				let sh = this.form;
				let url = "/doctor/livecourseInfo/export";
				let data = {
					name: sh.name, // 课程名
					status: sh.status, // 内容状态
					sysUserName: sh.sysUserName, // 创建人
					doctorName: sh.doctorName, // 课程讲师
					baseId: sh.baseId,
					departmentId: sh.departmentId,
					diseaseId: sh.diseaseId,
					createTimeStart: sh.createTimeStart, // 创建开始时间
					createTimeEnd: sh.createTimeEnd, // 创建结束时间
					publishTimeStart: sh.publishTimeStart, //发布开始时间
					publishTimeEnd: sh.publishTimeEnd, //发布结束时间
					liveTimeStart: sh.liveTimeStart, //直播开始日期
					liveTimeEnd: sh.liveTimeEnd //直播结束时间
				};
				exportExcel(url, data);
			},
			addInfo () {
				//添加课程
				this.$router.push({
					path: "/commodity/playCourse/add",
					query: {tag: "add"}
				});
			},
			showRowInfo (index, row) {
				this.$router.push({
					path: "/commodity/playCourse/detail",
					query: {id: row.id}
				});
			},
			editRowInfo (index, row) {
				//编辑课程
				this.$router.push({
					path: "/commodity/playCourse/add",
					query: {tag: "edit", id: row.id}
				});
			},
			saveReviewed: function () {
				let that = this;
				if (this.checkForm.result == 2 && this.checkForm.desc == "") {
					this.$message("请填写原因！");
					return;
				}
				else if (!this.checkForm.result) {
					this.dialogCheckVisible = false;
					return;
				}
				this.dialogCheckVisible = false;
				this.$post("/data/my", {
					pathL: "/doctor/livecourseInfo/edit",
					id: this.checkForm.id,
					status: this.checkForm.result,
					refuseReason: this.checkForm.desc
				})
					.then(res => {
						if (!res.state) {
							that.$message("操作成功！");
							that.$refs.loyout.getData();
						}
						else {
							that.$message("操作失败！请重试。");
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	};
</script>
