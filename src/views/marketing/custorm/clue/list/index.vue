<template>
  <div class="health comment">
    <layoutsearch methods="get" :form="form" ref="list" @getData="getData">
      <!-- 表单 -->
      <dk-form :config="formConfig" :form="form" :inline="true" labelWidth="120px" slot="form"></dk-form>

      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" @click="requireFile">导入</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="addRecord">新增</el-button>
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
      <dk-table
        ref="multipleTable"
        slot="table"
        border
        stripe
        :data="tableData"
        :config="config"
        operating
        :operatingWidth="200"
        index
        :pageNum="1"
        :pageSize="10"
        selection
        :selectableSite="selectableSite"
        @buttonClick="clickRowDetail"
        @sortChange="sortByData"
        @selectionChange="handleSelectionChange"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="isEditDisabled(scope.row)"
            type="primary"
            @click="editRecord(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            :disabled="isEditDisabled(scope.row)"
            @click="gotoCustorm(scope.row)"
          >转到我的意向
          </el-button>
        </template>
      </dk-table>
      <!--导入-->
    </layoutsearch>
    <sys-exportExcel
      @closeDialog="closeExportDialog"
      :dialogShow="exportExcelConfig.visible"
      :exportExcelConfig="exportExcelConfig"
      @cancelExcelConfig="cancelExcelConfig"
    ></sys-exportExcel>
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
  </div>
</template>

<script>
	import layoutsearch from "./layout-search";
	import exportExcel from "@/api/excel";

	export default {
		components: {layoutsearch},
		data: () => ({
			selectableSite: [
				{
					name: 'status',
					val: '新线索'
				}
			],
			form: {
				pathL: "/marketing/clueInfo/queryPage",
				field: "", //排序字段
				sort: "", //升序：ASC 降序：DESC
				clueNo: "", //线索编号
				companyName: "", //公司名
				provinceName: "", //城市名
				provinceId: "", //省
				cityId: "", //市
				countyId: "", //区
				contactNameOne: "", //联系人
				contactTelOne: "", //联系方式
				customerType: "", // （1大客户，2合伙人，3经销商）
				clueSource: "", //线索来源（1展会，2朋友介绍，3活动/会议，4自己开发，5其他）
				principalName: "", //负责任
				createByName: "", //创建人
				createTimeStr: "", //创建时间
				status: "", // 线索状态
				isAssignment: 0,
				workStatus: '',
			},
			formConfig: [
				//相关的表格的配置
				{
					type: "input",
					label: "线索编号",
					value: "clueNo",
					option: {
						placeholder: "请输入线索编号",
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
					type: "input",
					label: "所在城市",
					value: "provinceName",
					option: {
						placeholder: "请输入所在城市",
						disabled: false
					}
				},
				{
					type: "input",
					label: "申请城市",
					value: "cityName",
					option: {
						placeholder: "请输入申请城市",
						disabled: false
					}
				},
				{
					type: "input",
					label: "联系人",
					value: "contactNameOne",
					option: {
						placeholder: "请输入联系人",
						disabled: false
					}
				},
				{
					type: "input",
					label: "联系方式",
					value: "contactTelOne",
					option: {
						placeholder: "请输入联系方式",
						disabled: false
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
								label: "全部",
								value: ""
							},
							{
								label: "大客户",
								value: "1"
							},
							{
								label: "合伙人",
								value: "2"
							},
							{
								label: "经销商",
								value: "3"
							}
						]
					}
				},
				{
					type: "select",
					label: "来源",
					value: "clueSource",
					option: {
						placeholder: "请输入来源",
						disabled: false,
						data: [
							{
								label: "全部",
								value: ""
							},
							{
								label: "活动/会议",
								value: 8
							},
							{
								label: "自己开发",
								value: 9
							},
							{
								label: "其他",
								value: 10
							},
							{
								label: "朋友介绍",
								value: 7
							},
							{
								label: "展会",
								value: 2
							},
							{
								label: "400客服",
								value: 5
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
						placeholder: "请输入创建时间",
						disabled: false,
						format: "yyyy-MM-dd"
					}
				},
				{
					type: "select",
					label: "线索状态",
					value: "status",
					option: {
						placeholder: "请输入创建时间",
						disabled: false,
						data: [
							{
								label: "全部",
								value: ""
							},
							{
								label: "新线索",
								value: 1
							},
							{
								label: "已处理",
								value: 2
							},
							{
								label: "关闭",
								value: 3
							}
						]
					}
				}
			],
			config: [
				//相关的表格的配置
				{
					type: "button",
					label: "线索编号",
					value: "clue_no",
					sort: true
				},
				{
					type: "",
					label: "公司名称",
					value: "company_name"
				},
				{
					type: "",
					label: "所在城市",
					value: "city_name_sz"
				},
				{
					type: "",
					label: "申请城市",
					value: "city_name"
				},
				{
					type: "",
					label: "联系人",
					value: "contact_name_one"
				},
				{
					type: "",
					label: "联系方式",
					value: "contact_tel_one"
				},
				{
					type: "",
					label: "客户类型",
					value: "customer_type"
				},
				{
					type: "",
					label: "来源",
					value: "clue_source"
				},
				{
					type: "",
					label: "负责人",
					value: "principal_name"
				},
				{
					type: "",
					label: "创建时间",
					value: "create_time",
					sort: true
				},
				{
					type: "",
					label: "线索状态",
					value: "status"
				}
			],
			tableData: [],
			//////////导出并导入文件//////////////
			exportExcelConfig: {
				exportUrl:
					"http://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/excel%E6%A8%A1%E6%9D%BF/%E7%BA%BF%E7%B4%A2-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88-0.01.xlsx",
				exportTxt: "线索导出模板.xlsx",
				visible: false,
				uploadUrl: "/marketing/clueInfo/importExcel"
			},
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
			//存储的分派内容
			// selectable:[{ // checkbox 判断条件
			//   name:'status',
			//   val:'新线索',
			// }],
			nodeKey: "id",
			treedata: []
		}),
		watch: {},
		mounted () {
			const btnArr = this.$store.getters.menuInfo.btnMenu;
			btnArr.forEach(item => {
				if (item.menuName === "营销平台") {
					for (let it of item.btnList) {
						if (it.linkUrl === "xiansuo") {
							this.fpActive = true; //开启分派的权限
							this.getfpData(); // 获取分派组织
							//debugger
							this.form.isAssignment = 1;
						}
					}
				}
			});
			////工作台部分处理//
			if (this.$route.query.status != undefined) {
				this.form[ 'status' ] = parseInt(this.$route.query.status);
				this.form.workStatus = this.$route.query.status;
			}
			if (this.$route.query.user != undefined) {
				this.form[ 'principalName' ] = this.$route.query.user;
			}
			this.$refs.list.getData();
			this.checkfpBtn();
		},
		methods: {
			//getselTree(){},
			searchCurrUserList () {
				let that = this;
				this.$get('/data/my', {
					pathL: '/marketing/clueInfo/toQueryPage',
					status: this.form.status,
					pageNum: 1,
					pageSize: 4
				}).then(res => {
					if (res.state == 0) {
						that.getData(res.data);
						that.$refs.list.total = res.data.total;

					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					that.$message(err)
				})
			},
			hasPrincipal (row) {
				//debugger
				if (row.principal == this.$store.getters.userInfo.id) { //是自己
					if (row.status == '新线索') {
						return false;
					}
					else {
						return true;
					}
				}
				else { //不是自己
					return true;
				}
			},
			isEditDisabled (row) {
				if (this.fpActive) { // 有分派权限
					if (!row.principal) {//无负责人
						return false;
					}
					else { //有负责人
						return this.hasPrincipal(row); // 判断负责人
					}
				}
				else { // 无分派权限
					return this.hasPrincipal(row); // 判断负责人
				}
			},
			checkfpBtn () {
				if (this.fpPeople.id !== "" && this.fpPeople.principal !== "") {
					this.fpConfirmBtn = true;
				}
				else {
					this.fpConfirmBtn = false;
				}
			},
			getfpData () {
				let that = this;
				that.fpTableData = [];
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
			// 获取数据
			getData (data) {
				for (let item of data.result.list) {
					switch (item.clue_source) {
						case 9: {
							item.clue_source = "自己开发";
						}
							break;
						case 8: {
							item.clue_source = "活动/会议";
						}
							break;
						case 1: {
							item.clue_source = "官网";
						}
							break;
						case 2: {
							item.clue_source = "展会";
						}
							break;
						case 3: {
							item.clue_source = "朋友圈";
						}
							break;
						case 4: {
							item.clue_source = "手机端广告";
						}
							break;
						case 5: {
							item.clue_source = "400客服";
						}
							break;
						case 6: {
							item.clue_source = "PC端广告";
						}
							break;
						case 7: {
							item.clue_source = "朋友介绍";
						}
							break;
						case 10: {
							item.clue_source = "其他";
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
					}
				}
				this.tableData = data.result.list;
				for (let item of this.tableData) {
					for (let it in item) {
						if (item[ it ] === "" || item[ it ] === null) {
							item[ it ] = "-";
						}
						if (it === "status") {
							switch (item[ it ]) {
								case 1: {
									item[ it ] = "新线索";
								}
									break;
								case 2: {
									item[ it ] = "已处理";
								}
									break;
								case 3: {
									item[ it ] = "关闭";
								}
									break;
							}
						}
					}
				}
				//this.checkfpBtn();
			},
			handleSelectionChange (val) {
				this.fpSelectArr = [];
				val.map(item => {
					this.fpSelectArr.push(item.id);
				})
				//this.checkfpBtn();
			},
			handleRowClick (row) {
				console.log(row);
			},
			handleInputConfirm (row) {
				console.log(row);
			},
			handleButtonClick (row) {
				console.log(row);
			},
			fpConfirm () {
				let that = this;
				this.fpDialog.dialogVisible = false;
				this.$refs.addpeople.$refs.tree.setCheckedNodes([]); //取消高亮选择
				this.$post("/data/my", {
					pathL: "/marketing/clueInfo/assignment",
					id: this.fpPeople.id,
					principal: this.fpPeople.principal
				})
					.then(res => {
						if (res.state == 0) {
							that.fpPeople.principal = ""; //重置分配的内容
							that.fpPeople.id = ""; //重置分配的内容
							that.$refs.list.search();

						}
						else {
							that.$message("分派失败！");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			fpCancel (obj) {
				this.$refs.addpeople.$refs.tree.setCheckedNodes([]); //取消高亮选择
				this.fpDialog.dialogVisible = false;
				this.fpPeople.principal = ""; //重置分配的内容
			},
			assignList () {
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
			exportList () {
				//导出
				let sh = this.form;
				let url = "/marketing/clueInfo/exportExcel";
				exportExcel(url, sh);
			},
			addRecord (row) {
				//添加线索
				this.$router.push({
					path: "/custorm/clue/add",
					query: {tag: "add"}
				});
			},
			editRecord (row) {
				//添加线索
				this.$router.push({
					path: "/custorm/clue/add",
					query: {tag: "edit", id: row.id}
				});
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
			//////////导入操作//////////////
			requireFile () {
				// 开启导入dialog
				this.exportExcelConfig.visible = true;
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
			gotoCustorm (row) {
				this.$post("/data/my", {
					pathL: "/marketing/clueInfo/goToMyIntention",
					id: row.id
				}).then(res => {
					if (!res.state) {
						this.$message("转入成功！");
						this.$refs.list.search();
					}
				}).catch(err => {
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
			clickRowDetail (row) {
				this.$router.push({
					path: "/custorm/clue/detail",
					query: {id: row.id}
				});
			}
		}
	};
</script>
