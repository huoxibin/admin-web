<template>
  <div>
    <div class="header-page">
      筛选查询
      <el-button size="mini" type="primary" @click="search.pageNum=1;searchCourseList();">搜索查询</el-button>
    </div>
    <!-- 检索条件 -->
    <el-form
      class="m-t-10"
      slot="search"
      :inline="true"
      :model="search"
      size="mini"
      label-width="80px"
    >
      <el-form-item label="课程名称">
        <el-input v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item label="内容状态">
        <el-select v-model="search.statusVal">
          <el-option
            v-for="item in search.status"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="search.people"></el-input>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-input v-model="search.teacher"></el-input>
      </el-form-item>
      <el-form-item label="所属分类">
        <el-select
          v-model="search.category.first"
          class="w-100"
          @change="choseVal(1)"
          placeholder="请选择"
        >
          <el-option
            v-for="item in search.category.firstList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-select
          v-model="search.category.second"
          class="w-100"
          @change="choseVal(2)"
          placeholder="请选择"
        >
          <el-option
            v-for="item in search.category.secondList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-select
          v-model="search.category.threed"
          class="w-100"
          @change="choseVal(3)"
          placeholder="请选择"
        >
          <el-option
            v-for="item in search.category.threedList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布渠道">
        <el-select v-model="search.platformType">
          <el-option label="全部" value=""></el-option>
          <el-option label="医哆咖" value="2"></el-option>
          <el-option label="哆咖医生" value="1"></el-option>
          <el-option label="哆咖医生web端" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="search.createTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-date-picker
          v-model="search.issueTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div class="header-page">
      数据列表
      <div class="pull-right">
        <el-button size="mini" type="primary" class="" @click="$router.push({path:'/commodity/theme/list'})">主题管理
        </el-button>
        <el-button size="mini" type="primary" @click="addInfo">新建</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="exportList">导出</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      slot="table"
      ref="table"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="tableData"
      border
      stripe
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column prop="name" label="课程名称" align="center" width="180"></el-table-column>
      <el-table-column prop="teacher" label="课程讲师" align="center" width="110"></el-table-column>
      <el-table-column prop="price" label="课程价格" align="center" width="110"></el-table-column>
      <el-table-column prop="discountedPrice" label="折扣价" align="center" width="130"></el-table-column>
      <el-table-column prop="category" label="所属分类" align="center" width="200"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
      <el-table-column prop="people" label="创建人" align="center"></el-table-column>
      <el-table-column prop="platformType" label="发布渠道" align="center"></el-table-column>
      <el-table-column prop="num" label="购买数" align="center"></el-table-column>
      <el-table-column prop="readnum" label="阅读量" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" width="170">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status!=='待上线' && scope.row.status!=='待审核' && scope.row.status!=='已下线' && scope.row.status!=='审核未通过'"
            @click="toLineState(scope.$index, scope.row,2)"
          >下线
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status!=='已上线' && scope.row.status!=='待审核' && scope.row.status!=='审核未通过'"
            @click="toLineState(scope.$index, scope.row,1)"
          >发布
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status!=='已上线'"
            @click="toDel(scope.$index, scope.row)"
          >删除
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status!=='已上线' && scope.row.status!=='待上线' && scope.row.status!=='已下线'"
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
            v-if="scope.row.status!=='已上线'"
            size="small"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--- 分页---->
    <div class="pull-right">
      <el-pagination
        :current-page.sync="search.pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>

    <!----审核的弹窗---->
    <el-dialog title="提示" :visible.sync="dialogCheckVisible" width="30%" append-to-body center>
      <el-form ref="checkForm" :rules="rules" :model="checkForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="checkForm.result">
            <el-radio :label="1">审核通过</el-radio>
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
		name: "dkDoctorTab",
		props: [ "currentP" ],
		data () {
			return {
				tableHeight: 0,
				loading: false, //加载
				checkForm: {
					id: null, //审核id
					result: null, //审核结果
					desc: "", //审核描述
					showDesc: false
				},
				rules: {
					desc: [
						{required: true, message: "请输入审核不通过原因", trigger: "blur"}
					]
				},
				dialogCheckVisible: false, //审核的弹窗
				delRecordeInfo: {}, //需要删除的信息
				pageLength: 0, //总分页数
				search: {
					platformType: '',//发布渠道
					id: "", //课程的id
					name: "", //课程名称
					statusVal: "", //选择后的值
					status: [
						{
							value: "",
							label: "全部"
						},
						{
							value: "4",
							label: "待审核"
						},
						{
							value: "2",
							label: "审核未通过"
						},
						{
							value: "3",
							label: "待上线"
						},
						{
							value: "1",
							label: "已上线"
						},
						{
							value: "5",
							label: "已下线"
						}
					], //课程状态
					people: "", //创建人
					price: "", //价格
					teacher: "", //讲师
					num: "", //购买数
					readnum: "", //阅读量
					category: {
						first: "",
						firstRem: "",
						firstList: [],
						second: "",
						secondRem: "",
						secondList: [],
						threed: "",
						threedRem: "",
						threedList: []
					},
					cateCurrLevel: {
						//设置获取当前分类下拉菜单的级别
						baseId: "", //1 级菜单
						departmentId: "", //二级菜单
						kind: 1 //级别菜单
					},
					createTime: "",
					issueTime: "",
					pageNum: 1, //当前页
					pageSize: 10 //每页条数
				},
				tableData: []
			};
		},
		mounted () {
			// 获取 table 高度
			this.searchCourseList(); //初始化表格数据
			this.getCateList(); //获取分类列表信息
			this.$nextTick(() => {
				this.tableHeight = `${ window.innerHeight - this.$refs.table.$el.offsetTop - 180 }px`;
			})
		},
		watch: {
			currentP () {
				this.search.pageNum = this.currentP;
			},
			"checkForm.result" () {
				if (this.checkForm.result == "2") {
					this.checkForm.showDesc = true;
				}
				else {
					this.checkForm.showDesc = false;
				}
			}
		},
		methods: {
			toLineState (index, row, state) {
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/OnOrDownLine",
					courseId: row.id,
					kind: state
				})
					.then(res => {
						if (!res.state) {
							if (state == 1) {
								that.$message("上线成功！");
							}
							else {
								that.$message("下线成功！");
							}
							that.searchCourseList();
						}
					})
					.catch(err => {
					});
			},
			exportList () {
				//导出
				let that = this;
				let sh = that.search;
				let url = "/doctor/course/exportCourse";
				let data = {
					courseName: sh.name, //课程名
					status: sh.statusVal, // 状态
					creater: sh.people, //创建人
					lecturerName: sh.teacher, //讲师
					baseId: sh.category.first, //一级id
					departmentId: sh.category.second, //二级id
					diseaseId: sh.category.threed, //三级id
					createTimeStart: sh.createTime[ 0 ] || "", //创建开始时间
					createTimeEnd: sh.createTime[ 1 ] || "", //创建结束时间
					publishTimeStart: sh.issueTime[ 0 ] || "", //发布开始时间
					publishTimeEnd: sh.issueTime[ 1 ] || "" //发布开始时间
				};
				exportExcel(url, data);
			},
			toReviewed (idx, row) {
				this.checkForm.id = row.id;
				this.checkForm.result = null;
			}, //审核
			saveReviewed () {
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
				this.$get("/data/my", {
					pathL: "/doctor/course/auditCourse",
					courseId: this.checkForm.id,
					kind: this.checkForm.result,
					refuseReason: this.checkForm.desc
				})
					.then(res => {
						if (!res.state) {
							that.$message("操作成功！");
							that.searchCourseList(); //初始化表格数据
						}
						else {
							that.$message("操作失败！请重试。");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			searchCourseList () {
				//搜索课程列表
				//this.search.pageNum=1;
				this.loading = true;
				let that = this;
				let sh = that.search;
				this.$get("/data/my", {
					pathL: "/doctor/course/getCourseList",
					courseName: sh.name, //课程名
					status: sh.statusVal, // 状态
					creater: sh.people, //创建人
					lecturerName: sh.teacher, //讲师
					baseId: sh.category.first, //一级id
					departmentId: sh.category.second, //二级id
					diseaseId: sh.category.threed, //三级id
					createTimeStart: sh.createTime ? sh.createTime[ 0 ] : "", //创建开始时间
					createTimeEnd: sh.createTime ? sh.createTime[ 1 ] : "", //创建结束时间
					publishTimeStart: sh.issueTime ? sh.issueTime[ 0 ] : "", //发布开始时间
					publishTimeEnd: sh.issueTime ? sh.issueTime[ 1 ] : "", //发布开始时间
					pageNum: sh.pageNum, //当前页
					pageSize: sh.pageSize, //每页条数
					platformType: sh.platformType//发布渠道
				})
					.then(res => {
						if (!res.state) {
							that.loading = false;
							that.tableData = [];
							that.$nextTick(() => {
								that.dealTableData(res.data.result);
								that.pageLength = res.data.total;
							});
						}
					})
					.catch(err => {
					});
			},
			changeStatus (n) {
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
			dealTableData (data) {
				//处理返回的表格数据
				let that = this;
				data.forEach((item, index) => {
					let price = "￥";
					if (item.costType == 1) {
						price = "免费";
					}
					else {
						price += item.courseCost;
					}
					item.platformType = item.platformType.split(',');
					let arr = [];
					item.platformType.forEach(im => {
						switch (im) {
							case "1": {
								arr.push(`哆咖医生`);
							}
								break;
							case "2": {
								arr.push(`医哆咖`);
							}
								break;
							case "3": {
								arr.push(`哆咖医生web端`);
							}
								break;
						}
					})
					item.platformType = arr.join(', ');
					const it = {
						name: item.name, //
						teacher: item.lecturer,
						price: price, //课程价格
						platformType: item.platformType,
						category: item.diseaseClassify, //所属分类
						people: item.creater, //创建人
						num: item.buyCount, //购买数
						readnum: item.readCount, //阅读量
						status: that.changeStatus(item.status), //状态
						id: item.id, //课程id,
						discountedPrice: item.discountedPrice === null ? '-' : `￥${ item.discountedPrice }`, //折扣价
						createTime: item.createTime //折扣价
					};
					that.tableData.push(it);
				});
			},
			choseVal (fg) {
				//监控下拉的变化
				let obj = this.search;
				switch (fg) {
					case 1: {
						//清空二级和三级的下拉列表
						obj.category.secondList = [];
						obj.category.threedList = [];
						//重置发送的参数
						obj.cateCurrLevel.departmentId = "";
						obj.cateCurrLevel.baseId = obj.category.first;
						obj.cateCurrLevel.kind = 2;
						//清空二级的选择项
						obj.category.second = "";
						obj.category.threed = "";
					}
						break;
					case 2: {
						obj.category.threedList = []; //清空三级的 列表内容
						//重置发送的参数
						obj.cateCurrLevel.kind = 3;
						obj.cateCurrLevel.baseId = "";
						obj.cateCurrLevel.departmentId = obj.category.second;
						//清空三级的选择项
						obj.category.threed = "";
					}
						break;
					case 3: {
					}
						break;
				}
				this.getCateList();
			},
			dealCateList (res) {
				//处理分类下拉列表的数据显示
				const firstRecord = {
					name: "请选择",
					id: ""
				};
				switch (this.search.cateCurrLevel.kind) {
					case 1: {
						this.search.category.firstList = res;
						this.search.category.firstList.unshift(firstRecord);
					}
						break;
					case 2: {
						this.search.category.secondList = res;
						this.search.category.secondList.unshift(firstRecord);
					}
						break;
					case 3: {
						this.search.category.threedList = res;
						this.search.category.threedList.unshift(firstRecord);
					}
						break;
				}
			},
			getCateList () {
				//获取分类信息
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getClassifyListByCondition",
					baseId: that.search.cateCurrLevel.baseId,
					departmentId: that.search.cateCurrLevel.departmentId,
					kind: that.search.cateCurrLevel.kind
				})
					.then(res => {
						if (!res.state) {
							that.dealCateList(res.data);
						}
					})
					.catch(err => {
					});
			},
			toDel (index, row) {
				let that = this;
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						that
							.$get("/data/my", {
								pathL: "/doctor/course/deleteCourse",
								courseId: row.id
							})
							.then(res => {
								if (!res.state) {
									that.$message({
										type: "success",
										message: "删除成功!"
									});
									that.searchCourseList();
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
			handleSizeChange (val) {
				let sh = this.search;
				sh.pageSize = val; //每页条数
				this.searchCourseList();
			},
			handleCurrentChange (val) {
				let sh = this.search;
				sh.pageNum = val; //当前页
				this.searchCourseList();
				this.$emit("getPageNum", sh.pageNum); //返回当前页
			},
			showRowInfo (index, row) {
				this.$router.push({
					path: "/commodity/course/detail",
					query: {id: row.id}
				});
			},
			editRowInfo (index, row) {
				//编辑课程
				this.$router.push({
					path: "/commodity/course/add",
					query: {tag: "edit", id: row.id}
				});
			},
			addInfo () {
				//添加课程
				this.$router.push({
					path: "/commodity/course/add",
					query: {tag: "add"}
				});
			}
		}
	};
</script>

<style scoped>
</style>
