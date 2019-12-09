<template>
  <div class="health comment">
    <base-reform-layout methods="post" ref="list" :form="form" @getData="getData">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="230"
        index
        :pageNum="1"
        :pageSize="1"
        @sortChange="sortByData"
        @cellClick="goDetail"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="checkLook(scope.row)"
            @click="workConfigDetail.visible=true;rowDetail(scope.row);"
          >查看
          </el-button>
          <el-button size="mini" v-if="checkDelete(scope.row)" @click="deleteDetail(scope.row)">撤销</el-button>

          <el-button
            size="mini"
            v-if="checkapproval(scope.row)"
            @click="approvalDetail(scope.row)"
          >审批
          </el-button>
        </template>
      </dk-table>
    </base-reform-layout>
    <!--审批  type="detail"-->

    <sys-approvalWork
      type="detail"
      :userTreeData="userTreeData"
      :sendTreeData="sendTreeData"
      :data="approvalData"
      @closeDialog="closeWorkConfigDialog"
      :dialogShow.sync="workConfig.visible"
      :workConfig="workConfig"
      @cancelDialog="cancelWorkConfig"
    ></sys-approvalWork>
    <!--审批详情  type="detail"-->
    <sys-approvalWorkDetail
      type="detail"
      :userTreeData="userTreeData"
      :sendTreeData="sendTreeData"
      :data="approvalData"
      @closeDialog="closeWorkDetail"
      :dialogShow.sync="workConfigDetail.visible"
      :workConfig="workConfigDetail"
      @cancelDialog="cancelWorkDetail"
    ></sys-approvalWorkDetail>

    <sys-approvalWorkDel
      type="detail"
      :userTreeData="userTreeData"
      :sendTreeData="sendTreeData"
      :data="approvalData"
      @closeDialog="closeWorkDel"
      :dialogShow.sync="workConfigDel.visible"
      :workConfig="workConfigDel"
      @cancelDialog="cancelWorkDel"
    ></sys-approvalWorkDel>

    <sys-approvalWorkCheck
      type="detail"
      :userTreeData="userTreeData"
      :sendTreeData="sendTreeData"
      :data="approvalData"
      @closeDialog="closeWorkCheck"
      :dialogShow.sync="workConfigCheck.visible"
      :workConfig="workConfigCheck"
      @updataDialogShow="updataDialogShow"
      @cancelDialog="cancelWorkCheck"
      @otherOpDialog="otherWorkCheck"
    ></sys-approvalWorkCheck>


    <!----同意-审核的弹窗---->
    <dk-dialog
      :center="true"
      :baseConfig="approvalAgreeConfig"
      :dialogShow.sync="approvalAgreeConfig.visible"
      :showCancelBtn="false"
      @confirmCallback="approvalConfirm"
      @closeDialog="approvalCancel"
    >
      <dk-form
        style="width:100%;"
        :form="checkForm"
        :config="approvalformConfig"
        :inline="false"
        labelWidth="10px"
        slot="form"
      ></dk-form>
    </dk-dialog>

    <!----拒绝-审核的弹窗---->
    <dk-dialog
      :center="true"
      :baseConfig="approvalConfig"
      :dialogShow.sync="approvalConfig.visible"
      :showCancelBtn="false"
      @confirmCallback="approvalConfirm"
      @closeDialog="approvalCancel"
    >
      <dk-form
        style="width:100%;"
        :form="checkForm"
        :config="approvalformConfig"
        :inline="false"
        labelWidth="10px"
        slot="form"
      ></dk-form>
    </dk-dialog>
  </div>
</template>
<script>
	import BaseReformLayout from "@/components/base/_base-reFormLayout";

	export default {
		components: {BaseReformLayout},
		data () {
			return {
				checkFg: null,// 审批同意或者拒绝的标识 1： 同意  2 拒绝
				currRowID: "", // 当前行id
				userTreeData: [],
				sendTreeData: [],
				/////////审批弹窗配置////////////
				workConfig: {
					visible: false,
					width: "500px",
					title: "审批"
				},
				workConfigDel: {
					visible: false,
					width: "500px",
					title: "审批撤销",
					confirmBtnTxt: "撤销"
				},
				workConfigDetail: {
					visible: false,
					width: "500px",
					title: "审批",
					cancelBtnTxt: "关闭"
				},
				workConfigCheck: {
					visible: false,
					width: "500px",
					title: "审核",
					confirmBtnTxt: "同意",
					cancelBtnTxt: "拒绝",
					otherBtnTxt: "关闭"
				},
				approvalConfig: {
					visible: false,
					width: "500px",
					title: "审批说明",
					confirmBtnTxt: '确认拒绝'
				},
				approvalAgreeConfig: {
					visible: false,
					width: "500px",
					title: "审批说明",
					confirmBtnTxt: '确认同意'
				},
				approvalData: {},
				form: {
					pathL: "/common/audit/list",
					auditName: "", //审核名称
					auditType: '', //1:合同, 2:客户资质, 3:大客户报备, 4:订单报价, 5:生产计划, 6:退换货, 7:其他
					auditStatus: '', // 1:待审核, 2:审核中, 3:审核通过, 4:审核拒绝, 5:撤销
					auditNum: "", //编号
					send: "", //抄送人
					user: "", //发起人
					principal: "", //审批人
					createTime: "", //发起时间
					sortName: "", //audit_num:审核编号, business_type:审核类型, create_time:发起时间, audit_status:审核状态
					sortType: "" //排序字段 ASC:升序, DESC:降序
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "审核名称",
						value: "auditName",
						option: {
							placeholder: "请输入审核名称",
							disabled: false
						}
					},
					{
						type: "select",
						label: "审核类型",
						value: "auditType",
						option: {
							placeholder: "请输入审核类型",
							disabled: false,
							data: [
								{
									label: "全部",
									value: ""
								},
								{
									label: "加盟合同",
									value: 1
								},
								{
									label: "客户资质",
									value: 2
								},
								{
									label: "大客户报备",
									value: 3
								},
								{
									label: "订单报价",
									value: 4
								},
								{
									label: "生产计划",
									value: 5
								},
								{
									label: "退换货",
									value: 6
								},
								{
									label: "其他",
									value: 7
								}
							]
						}
					},
					{
						type: "select",
						label: "审核状态",
						value: "auditStatus",
						option: {
							placeholder: "请输入审核状态",
							disabled: false,
							data: [
								{
									label: "全部",
									value: ""
								},
								{
									label: "待审核",
									value: 1
								},
								{
									label: "审核中",
									value: 2
								},
								{
									label: "审核通过",
									value: 3
								},
								{
									label: "拒绝",
									value: 4
								},
								{
									label: "撤销",
									value: 5
								}
							]
						}
					},
					{
						type: "input",
						label: "审核编号",
						value: "auditNum",
						option: {
							placeholder: "请输入审核编号",
							disabled: false
						}
					},
					{
						type: "input",
						label: "抄送人",
						value: "send",
						option: {
							placeholder: "请输入抄送人",
							disabled: false
						}
					},
					{
						type: "input",
						label: "发起人",
						value: "user",
						option: {
							placeholder: "请输入发起人",
							disabled: false
						}
					},
					{
						type: "input",
						label: "当前审批人",
						value: "principal",
						option: {
							placeholder: "请输入当前审批人",
							disabled: false
						}
					},
					{
						type: "date",
						label: "发起时间",
						value: "createTime",
						option: {
							placeholder: "请输入发起时间",
							disabled: false,
							format: "yyyy-MM-dd"
						}
					}
				],
				tableData: [],
				tableConfig: [
					//相关的表格的配置
					{
						type: "",
						label: "审核编号",
						value: "auditNum",
						tooltip: true,
						sort: true
					},
					{
						type: "",
						label: "审核类型",
						value: "businessType",
						tooltip: true,
						sort: true
					},
					{
						type: "button",
						label: "审核名称",
						value: "auditName"
					},
					{
						type: "",
						label: "发起人",
						value: "userName",
						tooltip: true
					},
					{
						type: "",
						label: "发起时间",
						value: "createTime",
						tooltip: true,
						sort: true
					},
					{
						type: "",
						label: "当前审批人",
						value: "principalName",
						tooltip: true
					},
					{
						type: "",
						label: "抄送人",
						value: "sendName",
						tooltip: true
					},
					{
						type: "",
						label: "审核状态",
						value: "auditStatus",
						tooltip: true,
						sort: true
					}
				],
				// /审核详情///
				checkForm: {
					id: null, //审核id
					result: null, //审核结果
					desc: "", //审核描述
					showDesc: false
				},
				workForm: {},
				rules: {
					contractName: [
						{required: true, message: "请输入合同名称", trigger: "blur"}
					],
					partyA: [
						{required: true, message: "请输入甲方授权代表", trigger: "blur"}
					],
					selCustormval: [
						{required: true, message: "请输入乙方客户", trigger: "blur"}
					],
					partyB: [
						{required: true, message: "请输入乙方授权代表", trigger: "blur"}
					],
					authority: [
						{required: true, message: "请输入授权区域", trigger: "blur"}
					],
					region: [
						{required: true, message: "请输入所属大区", trigger: "blur"}
					],
					applicationType: [
						{required: true, message: "请输入申请类别", trigger: "blur"}
					],
					signingData: [
						{required: true, message: "请输入签署日期", trigger: "blur"}
					],
					effectiveDate: [
						{required: true, message: "请输入生效日期", trigger: "blur"}
					],
					contractTerm: [
						{required: true, message: "请输入合同到期日期", trigger: "blur"}
					],
					probationaryPeriod: [
						{required: true, message: "请输入考察期", trigger: "blur"}
					],
					probationaryPeriodDueData: [
						{required: true, message: "请输入考察期到期日期", trigger: "blur"}
					]
				},
				approvalformConfig: [
					{
						type: "textarea",
						label: "",
						value: "desc",
						option: {
							type: "textarea",
							disabled: false,
							rows: 3
						}
					}
				],
				workFormConfig: [
					{
						type: "input",
						label: "审核状态",
						value: "auditName",
						option: {
							disabled: false
						}
					},
					{
						type: "input",
						label: "审核编号",
						value: "auditName",
						option: {
							disabled: false
						}
					},
					{
						type: "input",
						label: "审核类型",
						value: "auditName",
						option: {
							disabled: false
						}
					},
					{
						type: "input",
						label: "审核名称",
						value: "auditName",
						option: {
							disabled: false
						}
					},
					{
						type: "textarea",
						label: "合同内容",
						value: "auditName",
						option: {
							disabled: false
						}
					}
				]
			};
		},
		mounted () {
			////工作台部分处理//
			if (this.$route.query.auditType != undefined) {
				this.form.auditType = parseInt(this.$route.query.auditType);
			}
			if (this.$route.query.auditStatus != undefined) {
				this.form.auditStatus = parseInt(this.$route.query.auditStatus);
			}
			if (this.$route.query.send != undefined) {
				this.form.send = this.$route.query.send;
			}
			if (this.$route.query.user != undefined) {
				this.form.user = this.$route.query.user;
			}
			if (this.$route.query.principal != undefined) {
				this.form.principal = this.$route.query.principal;
			}
			this.$refs.list.getData();
		},
		watch: {
			// "checkForm.result"() {
			//   if (this.checkForm.result === "no") {
			//     this.approvalformConfig[1].hide = false;
			//   } else {
			//     this.approvalformConfig[1].hide = true;
			//   }
			// }
		},
		methods: {
			getData (data) {
				this.dealData(data.result);
			},
			dealData (data) {
				// 处理回显的数据
				this.tableData = [];
				data.forEach(item => {

					switch (item.auditStatus) {
						case 1: {
							item.auditStatus = "待审核";
						}
							break;
						case 2: {
							item.auditStatus = "审核中";
						}
							break;
						case 3: {
							item.auditStatus = "审核通过";
						}
							break;
						case 4: {
							item.auditStatus = "审核拒绝";
						}
							break;
						case 5: {
							item.auditStatus = "撤销";
						}
							break;
					}
					switch (item.businessType) {
						case 1: {
							item.businessType = "加盟合同";
						}
							break;
						case 2: {
							item.businessType = "客户资质";
						}
							break;
						case 3: {
							item.businessType = "大客户报备";
						}
							break;
						case 4: {
							item.businessType = "订单报价";
						}
							break;
						case 5: {
							item.businessType = "生产计划";
						}
							break;
						case 6: {
							item.businessType = "退换货";
						}
							break;
						case 7: {
							item.businessType = "其他";
						}
							break;
					}
					item.sendName = item.sendName.replace(/null/g, "-");
				});
				this.tableData = data;
			},
			sortByData (obj) {
				// 排序
				switch (obj.prop) {
					case "auditNum": {
						obj.prop = "audit_num";
					}
						break;
					case "businessType": {
						obj.prop = "business_type";
					}
						break;
					case "createTime": {
						obj.prop = "create_time";
					}
						break;
					case "auditStatus": {
						obj.prop = "audit_status";
					}
						break;
				}
				this.form.sortName = `${ obj.prop }`;
				if (obj.order == "ascending") {
					this.form.sortType = "ASC";
				}
				else {
					this.form.sortType = "DESC";
				}
				this.$refs.list.search();
			},
			rowDetail (row) {
				let that = this;
				this.$post("/data/my", {
					pathL: "/common/audit/details",
					id: row.id
				})
					.then(res => {
						if (!res.state) {
							that.approvalData = res.data;
							that.userTreeData = res.data.users;
							that.sendTreeData = res.data.sends;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			closeWorkConfigDialog () {
				this.workConfig.visible = false;
			},
			cancelWorkConfig () {
				this.workConfig.visible = false;
			},
			deleteDetail (row) {
				this.currRowID = row.id;
				this.workConfigDel.visible = true;
				this.rowDetail(row);
			},
			closeWorkDel () {
				// 撤销审批
				let that = this;
				this.$post("/data/my", {
					pathL: "/common/audit/cancle",
					id: this.currRowID
				})
					.then(res => {
						if (res.state == 0) {
							that.$message("撤销成功！");
							that.workConfigDel.visible = false;
							that.$refs.list.search();
						}
						else {
							that.$message(res.msg);
						}
					})
					.catch(err => {
						that.$message(err);
					});
			},
			cancelWorkDetail () {
				this.workConfigDetail.visible = false;
			},
			closeWorkDetail () {
				this.workConfigDetail.visible = false;
			},
			cancelWorkDel (row) {
				//关闭撤销审批按钮
				this.workConfigDel.visible = false;
			},
			closeWorkCheck () { //同意审批
				this.checkFg = 'yes';
				this.approvalAgreeConfig.visible = true;
			},
			cancelWorkCheck () {
				//审批拒绝，开启拒绝理由弹窗
				this.checkFg = "no";
				this.approvalConfig.confirmBtnTxt = '确认拒绝';
				this.approvalConfig.visible = true;

			},
			otherWorkCheck () {
				//关闭撤销审批按钮
				this.workConfigCheck.visible = false;
			},
			approvalDetail (row) {
				// 审批
				this.workConfigCheck.visible = true;
				this.rowDetail(row);
				this.checkForm.id = row.id;
			},
			approvalConfirm () {
				let that = this;
				if (this.checkForm.desc == "") {
					this.$message("请填写原因！");
					return;
				}
				if(this.checkFg == 'yes'){
					this.approvalAgreeConfig.visible = false;
				}else{
					this.approvalConfig.visible = false;
				}
				this.$post("/data/my", {
					pathL: "/common/audit/status",
					auditId: this.checkForm.id,
					suggestion: this.checkFg,
					reason: this.checkForm.desc
				})
					.then(res => {
						if (res.state == 0) {
							that.$message("审批成功！");
							that.workConfigCheck.visible = false;
							that.$refs.list.search();
							that.checkForm.desc = "";
						}
						else {
							that.$message(res.msg);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			approvalCancel () {
				if(this.checkFg == 'yes'){
					this.approvalAgreeConfig.visible = false;
        }else{
					this.approvalConfig.visible = false;
        }
				this.checkForm.desc = "";
			},
			checkLook (row) {
				// 查看按钮
				//debugger
				switch (row.flag) {
					case 1: {
						//待我审核
						if (
							row.auditStatus == "审核中" ||
							row.auditStatus == "待审核" ||
							row.auditStatus == "审核通过" ||
							row.auditStatus == "审核拒绝"
						) {
							return true;
						}
					}
						break;
					case 2: {
						//我发起的
						//debugger
						return true;
					}
						break;
					case 4: {
						//我发起的
						//debugger
						return true;
					}
						break;
					case 3: {
						// 抄送我的
						if (row.auditStatus == "审核通过") {
							return true;
						}
					}
						break;
					case 5: {
						// 终审
						return true;
						// if(row.auditStatus=="审核通过" || row.auditStatus=="审核拒绝" || row.auditStatus=="审核中"){
						//   return true;
						// }
					}
						break;
				}
				return false;
			},
			checkDelete (row) {
				// 撤销按钮
				switch (row.flag) {
					case 1: //待我审核
					case 3: // 抄送我的
					case 4:
					case 5: //其他
					{
						return false;
					}
						break;
					case 2: {
						//我发起的
						if (row.auditStatus == "审核中") {
							return true;
						}
					}
						break;
				}
				return false;
			},
			checkapproval (row) {
				// 审批按钮
				switch (row.flag) {
					case 1: {
						//待我审核
						if (row.auditStatus == "待审核") {
							return true;
						}
					}
						break;
					case 2: //我发起的
					case 3: //抄送我的
					case 4: {
						return false;
					}
						break;
					case 5: {
						if (row.auditStatus == "待审核") {
							return true;
						}
					}
						break;
				}
				return false;
			},
			goDetail (rowObject) {
				if (rowObject.cell.cellIndex === 3) {
					// this.workConfigDetail.visible = true;
					// this.rowDetail(rowObject.row);
					switch (rowObject.row.businessType) {
						case '客户资质': {
							this.$router.push({
								path: '/marketing/client/list/detail',
								query: {
									id: rowObject.row.businessId,
								}
							})
							//businessId
						}
							break;
						case '加盟合同': {
							this.$router.push({
								path: '/contract/contractInfo/detail',
								query: {
									id: rowObject.row.businessId,
								}
							})
						}
							break;
					}

				}
			},
			updataDialogShow (fg) {
				this.workConfigCheck.visible = fg;
			}
		}
	};
</script>
