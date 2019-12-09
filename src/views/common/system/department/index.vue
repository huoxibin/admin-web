<template>
  <div class="health comment">
    <d-layout methods="post" :form="form" ref="list" @getData="getData">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>

      <div class="pull-right" slot="btns">
        <el-button @click="add" size="mini" type="primary">新增</el-button>
      </div>

      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="180"
        index
        :pageNum="1"
        :pageSize="10"
        :isRowKey="rowkey"
      >
        <template slot-scope="scope">
          <el-button @click="updata(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
          <el-button v-if="scope.row.status=== '禁用'" @click="status(scope.row)" type="text" size="small">启用</el-button>
          <el-button v-if="scope.row.status=== '启用'" @click="status(scope.row)" type="text" size="small">禁用</el-button>
        </template>
      </dk-table>

    </d-layout>

    <!--新增部门-->
    <el-dialog
      center
      title="新增部门"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="addConfig.visible"
      :width="addConfig.width">
      <dk-form style="width: 100%"
               ref="addform"
               :form="addform"
               :rules="addFromRules"
               :config="addformConfig"
               :inline="false"
      ></dk-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="addConfirm">确 定</el-button>
        <el-button size="mini" @click="addCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--修改部门-->
    <el-dialog
      center
      title="修改部门"
      append-to-body
      :visible.sync="modifyConfig.visible"
      :width="modifyConfig.width"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <dk-form style="width: 100%"
               ref="modifyform"
               :form="addform"
               :rules="addFromRules"
               :config="modifyFormConfig"
               :inline="false"
      ></dk-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="modifyConfirm">确 定</el-button>
        <el-button size="mini" @click="modifyCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import DkForm from "../../../../components/package/form";
	import DLayout from "./d-layout";
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
		components: {DkForm, DLayout},
		data () {
			return {
				rowkey: 'id',
				remid: '',
				form: {
					pathL: '/ap/sysDepartment/list',
					departmentName: "",
					status: "",
					date: "",
					areaId: "",
					divisionId: ""
				},
				addform: {
					areaId: "",
					divisionId: "",
					departmentName: "",
					sort: "",
					phoneNumber: "",
					introduce: "",
					lastUserId: ""
				},
				modifyform: {
					areaId: "",
					divisionId: "",
					departmentName: "",
					sort: "",
					phoneNumber: "",
					introduce: "",
					lastUserId: ""
				},
				tableData: [],
				tableConfig: [
					//相关的表格的配置
					{
						type: "",
						label: "部门名称",
						value: "departmentName",
						width: '300px',
						align: "left"
					},
					{
						type: "",
						label: "所属区域",
						value: "areaName",
						tooltip: true
					},
					{
						type: "",
						label: "所属分部",
						value: "divisionName",
						tooltip: true
					},
					{
						type: "",
						label: "账号状态",
						value: "status",
						tooltip: true
					}, {
						type: "",
						label: "联系电话",
						value: "phoneNumber",
						tooltip: true
					}, {
						type: "",
						label: "操作人",
						value: "userName",
						tooltip: true
					}, {
						type: "",
						label: "操作日期",
						value: "updateTime",
						tooltip: true
					}
				],
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "输入搜索",
						value: "departmentName",
						option: {
							placeholder: "请输入搜索内容",
							disabled: false
						}
					},
					{
						type: "select",
						label: "账号状态",
						value: "status",
						option: {
							placeholder: "请选择",
							disabled: false,
							data: [
								{
									label: '全部',
									value: ''
								}, {
									label: '启用',
									value: "1"
								}, {
									label: '禁用',
									value: "2"
								},
							]
						}
					},
					{
						type: "date",
						label: "创建时间",
						value: "date",
						option: {
							type: "daterange",
							placeholder: "请输入创建时间",
							disabled: false,
							format: 'yyyy-MM-dd'
						}
					},
					{
						type: "select",
						label: "所属区域",
						value: "areaId",
						option: {
							placeholder: "请输入所属区域",
							disabled: false,
							data: [ {
								label: '全部',
								value: ''
							} ]
						}
					},
					{
						type: "select",
						label: "所属分部",
						value: "divisionId",
						option: {
							placeholder: "请输入所属分部",
							disabled: false,
							data: [ {
								label: "全部",
								value: ''
							} ]
						}
					}
				],
				addFromRules: {
					areaId: [
						{required: true, message: "请选择所属区域", trigger: "change"}
					],
					phoneNumber: [
						{
							required: true,
							validator: CheckTel,
							trigger: "blur"
						}
					],
					departmentName: [
						{
							required: true,
							message: "字数不能为空，请将字数控制在10个字之内！",
							trigger: "blur"
						},
						{
							min: 1,
							max: 10,
							message: "字数不能为空，请将字数控制在10个字之内！",
							trigger: "blur"
						}
					],
					sort: [
						{
							required: true,
							message: "请输入排序数字",
							trigger: "blur"
						},
						{
							min: 1,
							max: 5,
							message: "字数不能为空，请将字数控制在5个字之内！",
							trigger: "blur"
						}
					]
				},
				addformConfig: [
					{
						type: "select",
						label: "所属区域",
						value: "areaId",
						option: {
							placeholder: "请选择所属区域",
							disabled: false,
							selectOnChange: 'changeDivisionAdd',
							data: []
						}
					},
					{
						type: "select",
						label: "所属分部",
						value: "divisionId",
						option: {
							placeholder: "请选择所属分部",
							disabled: false,
							data: []
						}
					},
					{
						type: "cascader",
						label: "所属部门",
						value: "pathIds",
						option: {
							placeholder: "请选择所属分部",
							disabled: false,
							cascader: {
								data: [],
								filterable: true,
								changeOnSelect: true
							}
						}
					},
					{
						type: "input",
						label: "部门名称",
						value: "departmentName",
						option: {
							placeholder: "请输入部门名称",
							disabled: false
						}
					},
					{
						type: "input",
						label: "联系电话",
						value: "phoneNumber",
						option: {
							placeholder: "请输入联系电话",
							disabled: false
						}
					},
					{
						type: "textarea",
						label: "职位介绍",
						value: "introduce",
						option: {
							placeholder: "请输入职位介绍",
							disabled: false
						}
					},
				],
				modifyFormConfig: [
					{
						type: "select",
						label: "所属区域",
						value: "areaId",
						option: {
							placeholder: "请选择所属区域",
							disabled: false,
							data: [],
							selectOnChange: 'changeDivision'
						}
					},
					{
						type: "select",
						label: "所属分部",
						value: "divisionId",
						option: {
							placeholder: "请选择所属分部",
							disabled: false,
							data: []
						}
					},
					{
						type: "cascader",
						label: "所属部门",
						value: "pathIds",
						hide: true,
						option: {
							placeholder: "请选择所属分部",
							disabled: false,
							cascader: {
								data: [],
								filterable: true,
								changeOnSelect: true
							}
						}
					},
					{
						type: "input",
						label: "部门名称",
						value: "departmentName",
						option: {
							placeholder: "请输入部门名称",
							disabled: false
						}
					},
					{
						type: "input",
						label: "联系电话",
						value: "phoneNumber",
						option: {
							placeholder: "请输入联系电话",
							disabled: false
						}
					},
					{
						type: "textarea",
						label: "职位介绍",
						value: "introduce",
						option: {
							placeholder: "请输入职位介绍",
							disabled: false
						}
					},
				],
				areaList: [],// 所属区域列表
				departmentList: [],// 分部的所有列表
				departmentTreeList: [],// 分部的所有列表
				//添加
				addConfig: {
					visible: false,
					title: "新增部门",
					width: '500px',
					confirmBtnTxt: '保存'
				},
				modifyConfig: {
					visible: false,
					title: "修改部门",
					width: '500px',
					confirmBtnTxt: '保存'
				}
			}
		},
		mounted () {
			this.getarea();
			this.getDepartmentTree();
		},
		watch: {
			"form.areaId" () {
				let that = this;
				this.form.divisionId = '';
				this.formConfig[ 4 ].option.data = [];
				this.departmentList.forEach(item => {
					if (that.form.areaId == item.parentId) {
						that.formConfig[ 4 ].option.data.push(item);
					}
				})
				let itm = {
					label: '全部',
					value: ''
				}
				that.formConfig[ 4 ].option.data.unshift(itm);
			},
			"form.date" (now) {
				this.form.startTime = now[ 0 ];
				this.form.endTime = now[ 1 ];
			}
		},
		methods: {
			changeDivision () {// select 所属分部选择
				this.siteDivisionShow(true);// true 是监控，false 是赋值
			},
			changeDivisionAdd () {// 添加 select 所属分部选择
				this.siteAddDivisionShow(true);// true 是监控，false 是赋值
			},
			siteAddDivisionShow (fg) {
				let that = this;
				if (fg) {
					this.addform.divisionId = '';
				}
				this.addformConfig[ 1 ].option.data = [];
				this.departmentList.forEach(item => {
					if (that.addform.areaId == item.parentId) {
						that.addformConfig[ 1 ].option.data.push(item);
					}
				})
				//debugger
			},
			siteDivisionShow (fg) {
				let that = this;
				if (fg) {
					this.addform.divisionId = '';
				}
				this.modifyFormConfig[ 1 ].option.data = [];
				this.departmentList.forEach(item => {
					if (that.addform.areaId == item.parentId) {
						that.modifyFormConfig[ 1 ].option.data.push(item);
					}
				})
				//debugger
			},
			getDepartmentTree () {
				let that = this;
				this.$get('/data/my', {
					pathL: '/ap/sysDepartment/query'
				}).then(res => {
					if (res.state == 0) {
						let list = that.getNoChildrenTree(res.data.rootNodes);
						that.departmentTreeList = list;
						that.addformConfig[ 2 ].option.cascader.data = list;
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			getNoChildrenTree (data) {
				let that = this;
				data.forEach(item => {
					if (item.children.length > 0) {
						that.getNoChildrenTree(item.children);
					}
					else {
						delete item.children;
					}
				})
				return data;
			},
			getarea () { //获取所属区域
				let that = this;
				this.$post('/data/my', {
					pathL: "/ap/sysDepartment/list",
					pageSize: this.pageSize
				}).then(res => {
					if (res.state === 0) {
						const itemArea = res.data.divs;
						const itemDeparment = res.data.firstDivs;
						itemArea.forEach(item => {
							let itm = {
								label: item.divisionName,
								value: item.id,
								parentId: item.parentId
							}
							that.formConfig[ 3 ].option.data.push(itm);
							that.addformConfig[ 0 ].option.data.push(itm);
							that.areaList.push(itm);
						})
						itemDeparment.forEach(item => {
							let itm = {
								label: item.divisionName,
								value: item.id,
								parentId: item.parentId
							}
							that.departmentList.push(itm);
						})

					}
					else {
						that.$message({
							type: "info",
							message: res.data.msg,
							center: true
						});
					}
				}).catch(err => {
					console.log(err);
				})
			},
			getData (data) {
				this.dealData(data.page);
			},
			dealData (data) {
				let dataArr = {
					endRow: data.endRow,
					pageNum: data.pageNum,
					pageSize: data.pageSize,
					pages: data.pages,
					data: this.siteHasChildren(data.result),
					startRow: data.startRow,
					total: data.total
				}
				this.tableData = data.result;
			},
			siteHasChildren (data) {
				let that = this;
				data.forEach(item => {
					item.status = item.status == 1 ? '启用' : '禁用';
					if (item.children.length > 0) {
						item.hasChildren = true;
						that.siteHasChildren(item.children);
					}
					else {
						delete item.children;
					}
				})
				return data;
			},
			///弹窗操作////
			add () {
				this.addConfig.visible = true;
				this.addformConfig[ 0 ].option.data = this.areaList;
				this.addformConfig[ 2 ].option.cascader.data = this.departmentTreeList;

			},
			updata (row) { // 重新取了下列的值
				this.remid = row.id;
				this.modifyConfig.visible = true;
				this.modifyFormConfig[ 2 ].option.cascader.data = this.departmentTreeList;
				this.modifyFormConfig[ 0 ].option.data = this.areaList;
				let that = this;
				this.$post("/data/my", {
					pathL: "/ap/sysDepartment/edit",
					id: row.id
				})
					.then(res => {
						if (res.state === 0) {
							that.addform = that.dealAddFormVal(res.data.page.result[ 0 ]);
							that.siteDivisionShow(false);
							//that.$refs.list.getData(false);
						}
						else {
							this.$message({
								type: "info",
								message: res.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealAddFormVal (data) {
				data.pathIds = data.pathIds.substr(0, data.pathIds.length - 1);
				data.pathIds = data.pathIds.split('_');
				let arr = [];
				for (let i = 0; i < data.pathIds.length; i++) {
					data.pathIds[ i ] = parseInt(data.pathIds[ i ]);
				}
				//debugger
				return data;
			},
			remove (row) {
				let that = this;
				this.$confirm("您确定要删除该部门吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysDepartment/delete",
									id: row.id
								})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "删除成功",
										center: true
									});
									that.$refs.list.getData(false);
									that.getDepartmentTree();
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
				console.log(row.id);
			},
			addConfirm () {//添加确认
				let that = this;
				var lastUserId = this.$store.getters.userId;

				this.$refs.addform.$children[ 0 ].validate(valid => {
					if (valid) {
						that.$post("/data/my", {
							pathL: "/ap/sysDepartment/duplicate",
							areaId: that.addform.areaId,
							divisionId: that.addform.divisionId,
							departmentName: that.addform.departmentName
						})
							.then(res => {
								if (res.state === 0) {
									let pObject = {
										parentId: 0,
										pathLevel: 0,
										pathIds: ''
									}
									if (that.addform.pathIds != undefined) {
										pObject.parentId = that.addform.pathIds[ that.addform.pathIds.length - 1 ];
										pObject.pathLevel = that.addform.pathIds.length;
										pObject.pathIds = that.addform.pathIds.join("_") + "_";
									}
									that.$post("/data/my", {
										pathL: "/ap/sysDepartment/create",
										areaId: that.addform.areaId,
										divisionId: that.addform.divisionId,
										departmentName: that.addform.departmentName,
										phoneNumber: that.addform.phoneNumber,
										introduce: that.addform.introduce,
										lastUserId: lastUserId,
										parentId: pObject.parentId,//最后一个id
										pathLevel: pObject.pathLevel,//选的级别
										pathIds: pObject.pathIds,//所有的id
									})
										.then(res => {
											if (res.state === 0) {
												that.$message({
													message: "添加成功",
													type: "success",
													center: true
												});
												that.addConfig.visible = false;
												that.$refs.list.getData(false);
												that.getDepartmentTree();
												that.$refs.addform.$children[ 0 ].resetFields();
											}
											else {
												that.$message({
													type: "info",
													message: res.msg,
													center: true
												});
												that.$message({
													message: "添加失败",
													type: "success",
													center: true
												});
												that.addConfig.visible = false;
												that.$refs.addform.$children[ 0 ].resetFields();

											}
										})
										.catch(err => {
											that.$message({
												message: err,
												type: "success",
												center: true
											});
										});
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
							});
					}
					else {
						this.$message({
							message: "请输入信息",
							center: true
						});
					}
				});
			},
			addCancel () {//添加取消
				this.$refs.addform.$children[ 0 ].resetFields();
				this.addConfig.visible = false;

			},
			modifyConfirm () {//修改确认
				let that = this;
				var lastUserId = this.$store.getters.userId;
				this.$refs.modifyform.$children[ 0 ].validate(valid => {
					if (valid) {
						that.$post("/data/my", {
							pathL: "/ap/sysDepartment/duplicate",
							id: that.remid,
							areaId: that.addform.areaId,
							divisionId: that.addform.divisionId,
							departmentName: that.addform.departmentName
						})
							.then(res => {
								if (res.state === 0) {
									that.$post("/data/my", {
										pathL: "/ap/sysDepartment/update",
										id: that.remid,
										areaId: that.addform.areaId,
										divisionId: that.addform.divisionId,
										departmentName: that.addform.departmentName,
										phoneNumber: that.addform.phoneNumber,
										introduce: that.addform.introduce,
										lastUserId: lastUserId
									})
										.then(res => {

											if (res.state === 0) {

												that.$message({
													message: "修改成功",
													type: "success",
													center: true
												});
												that.modifyConfig.visible = false;
												that.$refs.list.getData(false);
												that.$refs.modifyform.$children[ 0 ].resetFields();
												that.getDepartmentTree();
											}
											else {

												that.$message({
													type: "info",
													message: res.msg,
													center: true
												});
												that.$message({
													message: "修改失败",
													type: "success",
													center: true
												});
												that.modifyConfig.visible = false;
											}
										})
										.catch(err => {
											console.log(err);
										});
								}
								else {
									this.$message({
										type: "info",
										message: res.msg,
										center: true
									});
								}
							})
							.catch(err => {
							});
					}
				})
			},
			modifyCancel () {
				this.modifyConfig.visible = false;
				this.$refs.modifyform.$children[ 0 ].resetFields();
				this.remid = '';
			},
			status (row) {
				let that = this;
				let status = row.status == "启用" ? 2 : 1;
				this.$post("/data/my", {
					pathL: "/ap/sysDepartment/status",
					id: row.id,
					status: status
				})
					.then(res => {
						if (res.state === 0) {
							that.$message({
								message: "设置成功",
								type: "success",
								center: true
							});
							that.getDepartmentTree();
							that.$refs.list.getData(false);
						}
						else {
							that.$message({
								type: "info",
								message: res.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	}
</script>

<style scoped>

</style>