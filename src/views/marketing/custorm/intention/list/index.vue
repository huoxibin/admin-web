<template>
  <div class="health comment">
    <layoutsearch methods="get" ref="list" :form="form" @getData="getData">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" @click="importFile">导入</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="addCustomer">新增</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="exportList">导出</el-button>
        <a
          class="el-button pull-right el-button--primary el-button--mini"
          :href="exportExcelConfig.exportUrl"
          :download="exportExcelConfig.exportTxt"
        >导入模板</a>
        <el-button
          size="mini"
          type="primary"
          class="pull-right"
          v-if="fpActive"
          @click="assignList"
        >分派
        </el-button>
      </div>
      <!--表格-->
      <custorm-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="200"
        index
        selection
        :pageNum="1"
        :pageSize="10"
        @cellClick="gotoCustorm"
        @sortChange="sortByData"
        @selectionChange="handleSelectionChange"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button size="mini" type="primary"
                     :disabled="scope.row.process_status=='审核中' || scope.row.process_status=='通过'"
                     @click="editDetail(scope.row)">编辑
          </el-button>
          <el-button size="mini" @click="rowDetailRecord(scope.row)">跟进记录</el-button>
        </template>
      </custorm-table>
    </layoutsearch>
    <dk-dialog
      :baseConfig="dialogConfig"
      :showConfirmBtn="false"
      :dialogShow.sync="dialogConfig.dialogVisible"
      @confirmCallback="importFileConfirm"
      @cancelCallback="importFileCancel"
      @closeDialog="importFileCancel"
    >
      <el-form
        slot="form"
        :inline="true"
        :rules="rules"
        :model="recordForm"
        size="mini"
        label-width="96px"
      >
        <el-form-item label="相关联系人">
          <el-input v-model="recordForm.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="跟进方式" prop="way">
          <el-select v-model="recordForm.way" placeholder="请选择跟进方式">
            <el-option label="请选择" value></el-option>
            <el-option label="电话" value="1"></el-option>
            <el-option label="发邮件" value="2"></el-option>
            <el-option label="发短信" value="3"></el-option>
            <el-option label="见面拜访" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拜访地点">
          <el-input v-model="recordForm.visitPlaces"></el-input>
        </el-form-item>
        <el-form-item label="下次联系时间">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="recordForm.nextContactTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form
        slot="form"
        :rules="rules"
        :inline="false"
        :model="recordForm"
        size="mini"
        label-width="96px"
      >
        <el-form-item label="跟进记录" prop="recordContent">
          <el-input type="textarea" v-model="recordForm.recordContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveRecord">提交</el-button>
        </el-form-item>
      </el-form>
      <!--跟进记录-->
      <el-card class="box-card" slot="tree">
        <div slot="header" class="clearfix">
          <span>跟进记录</span>
        </div>
        <div class="record-List" v-for="item in recordList" :key="item.id">
          <div class="text">{{item.createByName}} {{item.createTime}}</div>
          <div class="desc">{{item.recordContent}}</div>
          <div class="text">
            <span>相关联系人：{{item.contactPerson}}</span>
            <span class="m-l-10">跟进方式：{{item.way}}</span>
            <span class="m-l-10">拜访地点：{{item.visitPlaces}}</span>
          </div>
        </div>
      </el-card>
    </dk-dialog>
    <!--导入-->
    <sys-exportExcel
      @closeDialog="closeExportDialog"
      :dialogShow="exportExcelConfig.visible"
      :exportExcelConfig="exportExcelConfig"
      @cancelExcelConfig="cancelExcelConfig"
    ></sys-exportExcel>

    <!--分派弹窗-->
    <dk-dialog
      :showConfirmBtn="fpConfirmBtn"
      :baseConfig="fpDialog"
      :dialogShow.sync="fpDialog.dialogVisible"
      @confirmCallback="fpConfirm"
      @cancelCallback="fpCancel"
      @closeDialog="fpCancel"
    >
      <sys-addPeople slot="tree" ref="addpeople" @treeClick="selectRowfp">

      </sys-addPeople>

    </dk-dialog>
    <dk-dialog
      :baseConfig="closeRecordDialog"
      :dialogShow.sync="closeRecordDialog.visible"
      @confirmCallback="closeRecordConfirm"
      @cancelCallback="closeRecordCancel"
      @closeDialog="closeRecordCancel"
    >
      <dk-form
        :form="closeDialogform"
        :config="closeDialogConfig"
        :inline="true"
        labelWidth="30px"
        slot="form"
      ></dk-form>
    </dk-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";
	import layoutsearch from "./layout-search";
	import CustormTable from "./table";

	export default {
		components: {CustormTable, layoutsearch},
		data: () => ({
			form: {
				pathL: "/marketing/customerInfo/queryPage",
				field: "", //排序字段
				sort: "", //升序：ASC 降序：DESC
				customerNo: "", //排序字段
				companyName: "", //公司名
				companyNature: "", //公司类型
				registeredCapital: "", //注册资金
				provinceName: "", //所在城市
				customerType: "", //客户类型
				createTimeStr: "", //创建时间
				cityName: "", //申请城市
				nextContactTimeStr: "", //申请下次联系时间
				principalName: "", //负责人名
				pageNum: 1,
				pageSize: 4,
				processStatus: "",
				status: "",
				isAssignment: 0,
				workStatus: '',
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "客户编号",
					value: "customerNo",
					option: {
						placeholder: "请输入客户编号",
						disabled: false
					}
				},
				{
					type: "input",
					label: "公司名称",
					value: "companyName",
					option: {
						placeholder: "请输入公司名称",
						disabled: false
					}
				},
				{
					type: "select",
					label: "公司性质",
					value: "companyNature",
					option: {
						placeholder: "请输入公司性质",
						disabled: false,
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: "1",
								label: "国企"
							},
							{
								value: "2",
								label: "国有控股"
							},
							{
								value: "3",
								label: "私企"
							},
							{
								value: "4",
								label: "其他"
							}
						]
					}
				},
				{
					type: "input",
					label: "注册资金",
					value: "registeredCapital",
					option: {
						placeholder: "请输入注册资金",
						disabled: false
					}
				},
				{
					type: "input",
					label: "所在城市",
					value: "provinceName",
					option: {
						placeholder: "请输入城市名",
						disabled: false
					}
				},
				{
					type: "date",
					label: "下次联系时间",
					value: "nextContactTimeStr",
					option: {
						type: "datetime",
						placeholder: "请输入下次联系时间",
						disabled: false,
						format: "yyyy-MM-dd HH:mm:ss"
					}
				},
				{
					type: "select",
					label: "客户类型",
					value: "customerType",
					option: {
						placeholder: "请输入客户类型",
						disabled: false,
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: "1",
								label: "大客户"
							},
							{
								value: "2",
								label: "合伙人"
							},
							{
								value: "3",
								label: "经销商"
							}
						]
					}
				},
				{
					type: "input",
					label: "负责人",
					value: "principalName",
					option: {
						placeholder: "请输入负责人",
						disabled: false
					}
				},
				{
					type: "date",
					label: "创建时间",
					value: "createTimeStr",
					option: {
						type: "date",
						placeholder: "请输入创建时间",
						disabled: false,
						format: "yyyy-MM-dd"
					}
				},
				{
					type: "select",
					label: "客户状态",
					value: "status",
					option: {
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: 1,
								label: "意向客户"
							},
							{
								value: 2,
								label: "正式客户"
							},
							{
								value: 3,
								label: "关闭"
							}
						]
					}
				},
				{
					type: "select",
					label: "状态",
					value: "processStatus",
					option: {
						placeholder: "请选择",
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: 1,
								label: "临时保存"
							},
							{
								value: 2,
								label: "审核中"
							},
							{
								value: 3,
								label: "通过"
							},
							{
								value: 4,
								label: "撤销"
							},
							{
								value: 5,
								label: "拒绝"
							}
						]
					}
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "客户编号",
					cellClassName: "f-blue c-p",
					value: "customer_no",
					sort: true
				},
				{
					type: "",
					label: "公司名称",
					value: "company_name"
				},
				{
					type: "",
					label: "公司性质",
					value: "company_nature"
				},
				{
					type: "",
					label: "注册资金",
					value: "registered_capital"
				},
				{
					type: "",
					label: "所在城市",
					value: "city_name_sz"
				},

				{
					type: "",
					label: "申请城市",
					value: "name"
				},
				{
					type: "",
					label: "客户类型",
					value: "customer_type"
				},
				{
					type: "",
					label: "负责人",
					value: "user_name"
				},
				{
					type: "",
					label: "下次联系时间",
					value: "next_contact_time"
				},
				{
					type: "",
					label: "创建时间",
					value: "create_time",
					sort: true
				},
				{
					type: "",
					label: "客户状态",
					value: "status"
				},
				{
					type: "",
					label: "状态",
					value: "process_status"
				}
			],
			tableData: [],
			/////////弹窗配置////////////
			dialogConfig: {
				dialogVisible: false,
				width: "630px",
				cancelBtnTxt: "关闭"
			},
			recordForm: {
				customerId: "",
				recordContent: "", //描述
				contactPerson: "", //联系人
				way: "", //方式 1电话、2发邮件、3发短信、4见面拜访
				visitPlaces: "", //地点
				nextContactTime: "" //日期
			},
			recordList: [], // 跟进记录列表
			//////////导出并导入文件//////////////
			exportExcelConfig: {
				exportUrl:
					"http://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/excel%E6%A8%A1%E6%9D%BF/%E6%84%8F%E5%90%91%E5%AE%A2%E6%88%B7-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88-0.01.xlsx",
				exportTxt: "意向管理模板.xlsx",
				visible: false,
				uploadUrl: "/common/customerInfo/import"
			},
			customerId: "", // 获取当前的行 id
			///////////分派的内容//////////
			fpActive: false,
			fpConfirmBtn: false, // 分派确认
			fpSelectArr: [], // 分派的内容
			fpForm: {
				pathL: "/ap/sysUser/getSysDepartmentAndUserById",
				userName: ""
			},
			fpTableData: [],
			fpTableConfig: [
				{
					type: "",
					label: "部门名",
					value: "department_name"
				},
				{
					type: "",
					label: "人员",
					value: "user_name"
				}
			],
			fpDialog: {
				dialogVisible: false,
				width: "450px",
				title: "添加人员"
			},
			fpPeople: {
				id: "",
				principal: ""
			},
			////////关闭意向/////////
			closeRecordDialog: {
				visible: false,
				title: "意向状态变更",
				width: "200px"
			},
			closeDialogform: {
				pathL: "/marketing/customerInfo/updateStatus",
				id: "",
				status: true
			},
			closeDialogConfig: [
				{
					type: "radio",
					label: "",
					value: "status",
					option: {
						disabled: false,
						data: [
							{
								label: "关闭",
								value: true
							}
						]
					}
				}
			],
			rules: {
				way: [ {required: true, message: "请选择跟进方式", trigger: "blur"} ],
				recordContent: [
					{required: true, message: "请输入跟进记录", trigger: "blur"}
				]
			}
		}),
		mounted () {
			const btnArr = this.$store.getters.menuInfo.btnMenu;
			btnArr.forEach(item => {
				if (item.menuName === "营销平台") {
					for (let it of item.btnList) {
						if (it.linkUrl === "yixiang") {
							this.fpActive = true; //开启分派的权限
							this.getfpData(); // 获取分派组织
							this.form.isAssignment = 1;
						}
					}
				}
			});
			////工作台部分处理//
			if (this.$route.query.status != undefined) {
				if (this.$route.query.status != 4 && this.$route.query.status != 5) {
					this.form.status = parseInt(this.$route.query.status);
				}
				else {
					this.form.status = 1;
					this.form.workStatus = this.$route.query.status;
				}
			}
			if (this.$route.query.user != undefined) {
				this.form[ 'principalName' ] = this.$route.query.user;
			}
			this.$refs.list.getData();
			this.checkfpBtn();
		},
		methods: {
			// 获取数据
			getData (data) {
				this.tableData = [];
				for (let item of data.result.list) {
					switch (item.process_status) {
						case 1: {
							item.process_status = "临时保存";
						}
							break;
						case 2: {
							item.process_status = "审核中";
						}
							break;
						case 3: {
							item.process_status = "通过";
						}
							break;
						case 4: {
							item.process_status = "撤销";
						}
							break;
						case 5: {
							item.process_status = "拒绝";
						}
							break;
						default: {
							item.process_status = "-";
						}
							break;
					}
					switch (item.customer_type) {
						case 1: {
							item.customer_type = "大客户";
						}
							break;
						case 2: {
							item.customer_type = "合伙人";
						}
							break;
						case 3: {
							item.customer_type = "经销商";
						}
							break;
						default: {
							item.customer_type = "-";
						}
							break;
					}
					switch (item.status) {
						case 1: {
							item.status = "意向客户";
						}
							break;
						case 2: {
							item.status = "正式客户";
						}
							break;
						case 3: {
							item.status = "关闭";
						}
							break;
						default: {
							item.status = "-";
						}
							break;
					}
					switch (item.company_nature) {
						case 1: {
							item.company_nature = "国企";
						}
							break;
						case 2: {
							item.company_nature = "国有控股";
						}
							break;
						case 3: {
							item.company_nature = "私企";
						}
							break;
						case 4: {
							item.company_nature = "其他";
						}
							break;
						default: {
							item.company_nature = "-";
						}
							break;
					}
				}
				this.tableData = data.result.list;
			},

			importFile () {
				this.exportExcelConfig.visible = true;
			},
			exportList () {
				//导出
				let sh = JSON.parse(JSON.stringify(this.form));
				delete sh.pathL;
				let url = "/marketing/customerInfo/exportExcel";
				exportExcel(url, sh);
			},
			editDetail (row) {
				// let fg = this.getMenuAccess('/client/list');
				// if (fg) { // 有跳转的权限
				// 	window.open(`/client/list/update?id=${ row.id }&access=true`);
				// }
				// else {
				// 	this.$message('您没有该菜单权限无法访问');
				// }

				this.$router.push({
					path: "/marketing/client/list/update",
					query: {
						id: row.id
					}
				});
			},
			rowDetailRecord (row) {
				// 跟进记录
				this.customerId = row.id;
				this.dialogConfig.dialogVisible = true;
				this.recordList = []; //清空跟进记录
				this.getRecord(); // 获取跟进记录
			},
			importFileConfirm () {
				//导入的确认操作
				this.dialogConfig.dialogVisible = false;
			},
			importFileCancel () {
				//导入的取消操作
				this.dialogConfig.dialogVisible = false;
			},
			sortByData (obj) {
				// 排序
				this.form.field = `${ obj.prop }`;
				if (obj.order == "ascending") {
					this.form.sort = "ASC";
				}
				else {
					this.form.sort = "DESC";
				}
				this.$refs.list.search();
			},
			closeExportDialog (val) {
				this.exportExcelConfig.visible = false;
				if (val) {
					this.$message("导入成功！");
					setTimeout(() => {
						this.$refs.list.search();
					}, 1000);
				}
			},
			cancelExcelConfig (val) {
				this.exportExcelConfig.visible = false;
			},
			checkRecord () {
				if (this.recordForm.way === "") {
					this.$message("请选择跟进方式");
					return false;
				}
				if (this.recordForm.recordContent === "") {
					this.$message("请填写跟进记录");
					return false;
				}
				return true;
			},
			saveRecord () {
				if (!this.checkRecord()) {
					return;
				}
				let that = this;
				this.recordForm.customerId = this.customerId; // 客户id
				this.$post("/data/my", {
					pathL: "/marketing/records/add",
					...this.recordForm
				})
					.then(res => {
						that.recordForm.customerId = "";
						that.recordForm.recordContent = ""; //描述
						that.recordForm.contactPerson = ""; //联系人
						that.recordForm.way = ""; //方式 1电话、2发邮件、3发短信、4见面拜访
						that.recordForm.visitPlaces = ""; //地点
						that.recordForm.nextContactTime = ""; //日期
						if (!res.state) {
							that.$message("保存成功！");
							that.getRecord(); // 重新刷新跟进记录
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			getRecord () {
				// 获取跟进记录
				let that = this;
				this.$get("/data/my", {
					pathL: "/marketing/records/query",
					customerId: this.customerId
				})
					.then(res => {
						if (!res.state) {
							that.dealRecordList(res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealRecordList (data) {
				// 处理跟进记录值
				data.forEach(item => {
					switch (item.way) {
						case 1: {
							item.way = "电话";
						}
							break;
						case 2: {
							item.way = "发邮件";
						}
							break;
						case 3: {
							item.way = "发短信";
						}
							break;
						case 4: {
							item.way = "见面拜访";
						}
							break;
					}
				});
				this.recordList = data;
			},
			addCustomer () {
				// let url = '/client/list';
				// let fg = this.getMenuAccess(url);
				// if (fg) { // 有跳转的权限
				// 	window.open(`${ url }/add?access=true`);
				// }
				// else {
				// 	this.$message('您没有该菜单权限无法访问');
				// }
				this.$router.push({
					path: "/marketing/client/list/add"
				});
			},
			//////分派//////////
			handleSelectionChange (val) {
				this.fpSelectArr = [];
				val.map(item => {
					this.fpSelectArr.push(item.id);
				})
			},
			checkfpBtn () {
				if (this.fpPeople.id !== "" && this.fpPeople.principal !== "") {
					this.fpConfirmBtn = true;
				}
				else {
					this.fpConfirmBtn = false;
				}
			},
			fpConfirm () {
				let that = this;
				this.fpDialog.dialogVisible = false;
				this.$refs.addpeople.$refs.tree.setCheckedNodes([]); //取消高亮选择

				this.$post("/data/my", {
					pathL: "/marketing/customerInfo/assignment",
					id: this.fpPeople.id,
					principal: this.fpPeople.principal
				})
					.then(res => {
						if (!res.state) {
							that.$refs.list.search();
							that.fpPeople.principal = ""; //重置分配的内容
							that.fpPeople.id = ""; //重置分配的内容
						}
					})
					.catch(err => {
						console.log(err);
					});

			},
			fpCancel () {
				this.fpDialog.dialogVisible = false;
				this.$refs.addpeople.$refs.tree.setCheckedNodes([]); //取消高亮选择
				this.fpPeople.principal = ""; //重置分配的内容

			},
			assignList () {
				this.fpPeople.id = "";// 重置分派id
				this.fpDialog.dialogVisible = true;
				let idArr = "";
				this.fpSelectArr.forEach(item => {
					idArr += item + ",";
				});
				idArr = idArr.substr(0, idArr.length - 1);
				this.fpPeople.id = idArr; // 存储id
				this.checkfpBtn();
			},
			selectRowfp (row) {
				// 选择组织人员
				if (row) {
					if (row.pathIds == "u") {
						this.fpPeople.principal = row.id;
					}
				}
				else {
					this.fpPeople.principal = '';
				}

				this.checkfpBtn();
			},
			getfpData () {
				let that = this;
				this.$get("/data/my", {
					pathL: "/ap/sysUser/getSysDepartmentAndUserById"
				})
					.then(res => {
						if (!res.state) {
							that.fpTableData = res.data;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			searchCustorm () {
				let that = this;
				this.fpTableData = [];
				this.$get("/data/my", this.fpForm)
					.then(res => {
						if (!res.state) {
							that.fpTableData = res.data;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			////////客户管理/////////
			closeRecordConfirm () {
				let that = this;
				this.closeRecordDialog.visible = false;
				this.$post("/data/my", {
					pathL: this.closeDialogform.pathL,
					id: this.closeDialogform.id,
					status: 3
				})
					.then(res => {
						if (!res.state) {
							that.$message("关闭成功！");
							that.$refs.list.search();
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			closeRecordCancel () {
				this.closeRecordDialog.visible = false;
			},
			rowButtonClick (row) {
				if ((row.process_status !== "审核中" && row.process_status !== "通过") && (row.status !== "关闭" && row.status !== "正式客户")) {
					this.closeRecordDialog.visible = true;
					this.closeDialogform.id = row.id;
				}
			},
			getMenuAccess (url) {
				let hasAccess = false;
				const menuURL = this.$store.getters.menuInfo.menuURL.filter(
					item => item.menuName === "基础平台"
				);
				if (menuURL.length > 0) {
					if (menuURL[ 0 ].hasOwnProperty('urlList')) {
						for (let i = 0; i < menuURL[ 0 ].urlList.length; i++) {
							if (menuURL[ 0 ].urlList[ i ] == url) {
								hasAccess = true;
								break;
							}
							else {
								hasAccess = false;
							}
						}
					}
				}
				return hasAccess;
			},
			gotoCustorm (rowObject) {
				// let fg = this.getMenuAccess('/client/list');
				// if (fg) { // 有跳转的权限
				// 	if (rowObject.cell.cellIndex === 2) {
				// 		window.open(`/client/list/detail?markedId=110&id=${ rowObject.row.id }&access=true`);
				// 	}
				// 	if (rowObject.cell.cellIndex === 12) {
				// 		this.rowButtonClick(rowObject.row);
				// 	}
				// }
				// else {
				// 	this.$message('您没有该菜单权限无法访问');
				// }


				if (rowObject.cell.cellIndex === 2) {
					this.$router.push({
						path: "/marketing/client/list/detail",
						query: {
							id: rowObject.row.id
						}
					});
				}
				if (rowObject.cell.cellIndex === 12) {
					this.rowButtonClick(rowObject.row);
				}

			}
		}
	};
</script>
<style>
  .box-card {
    max-height: 300px;
    overflow: scroll;
  }
</style>
