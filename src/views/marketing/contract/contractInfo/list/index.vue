<template>
  <div class="health comment">
    <base-layout methods="get" ref="list" :form="form" @getData="getData" style="height: 100%;">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" @click="exportList">导出</el-button>
        <el-button size="mini" type="primary" @click="addRecord">新增</el-button>
      </div>
      <!--表格-->
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="100"
        index
        :pageNum="1"
        :pageSize="10"
        @sortChange="sortByData"
        @cellClick="goDetail"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button size="mini" type="primary"
                     :disabled="scope.row.process_status=='审核中' || scope.row.process_status=='通过'"
                     @click="rowDetail(scope.row)">编辑
          </el-button>
        </template>
      </dk-table>
    </base-layout>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";

	export default {
		data: () => ({
			form: {
				pathL: "/marketing/contractInfo/queryPage",
				field: "",
				sort: "",
				contractNo: "", //合同编号
				contractName: "", //合同名字
				companyName: "", //公司名
				region: "", //所属大区
				processStatus: 0,//状态
				signingData: "", //签署日期
				effectiveDate: "", //生效日期
				dueData: "", //截止日期
				contractTerm: "", //合同期限
				createByName: "" //合同负责人
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "合同编号",
					value: "contractNo",
					option: {
						placeholder: "请输入合同编号",
						disabled: false
					}
				},
				{
					type: "input",
					label: "合同名称",
					value: "contractName",
					option: {
						placeholder: "请输入合同名称",
						disabled: false
					}
				},
				{
					type: "input",
					label: "客户",
					value: "companyName",
					option: {
						placeholder: "请输入客户名字",
						disabled: false
					}
				},
				{
					type: "select",
					label: "所属大区",
					value: "region",
					option: {
						placeholder: "请选择所属大区",
						disabled: false,
						data: [
							{
								label: "全部",
								value: ""
							},
							{
								label: "华北",
								value: "华北"
							},
							{
								label: "华南",
								value: "华南"
							},
							{
								label: "华中",
								value: "华中"
							},
							{
								label: "西南",
								value: "西南"
							},
							{
								label: "西北",
								value: "西北"
							},
							{
								label: "华东",
								value: "华东"
							}
						]
					}
				},
				{
					type: "input",
					label: "签署日期",
					value: "signingData",
					option: {
						placeholder: "请输入签署日期",
						disabled: false
					}
				},
				{
					type: "input",
					label: "生效日期",
					value: "effectiveDate",
					option: {
						placeholder: "请输入签署日期",
						disabled: false
					}
				},

				{
					type: "input",
					label: "截止日期",
					value: "dueData",
					option: {
						placeholder: "请输入截止日期",
						disabled: false
					}
				},
				{
					type: "input",
					label: "合同期限",
					value: "contractTerm",
					option: {
						placeholder: "请输入合同期限",
						disabled: false
					}
				},
				{
					type: "input",
					label: "合同负责人",
					value: "createByName",
					option: {
						placeholder: "请输入负责人姓名",
						disabled: false
					}
				},

				{
					type: "select",
					label: "状态",
					value: "processStatus",
					option: {
						placeholder: "请选择状态",
						disabled: false,
						data: [
							{
								value: 0,
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
					label: "合同编号",
					value: "contract_no",
					cellClassName: 'f-blue c-p',
				},
				{
					type: "",
					label: "合同名称",
					value: "contract_name"
				},
				{
					type: "",
					label: "客户",
					value: "company_name"
				},
				{
					type: "",
					label: "所属大区",
					value: "region"
				},
				{
					type: "",
					label: "签署日期",
					value: "signing_data",
					sort: true
				},
				{
					type: "",
					label: "生效日期",
					value: "effective_date",
					sort: true
				},
				{
					type: "",
					label: "到期日期",
					value: "due_data",
					sort: true
				},
				{
					type: "",
					label: "合同期限",
					value: "contract_term",
					sort: true
				},
				{
					type: "",
					label: "审批人",
					value: "approval_name"
				},
				{
					type: "",
					label: "合同负责人",
					value: "user_name",
					cellClassName: 'f-blue',
				},
				{
					type: "",
					label: "状态",
					value: "process_status"
				}
			],

			tableData: [],
			/////////弹窗配置////////////
			importForm: {}
		}),
		mounted () {
		},
		methods: {
			// 获取数据
			getData (data) {
				for (let item of data.result.list) {
					switch (item.process_status) {
						case 1: {
							item.process_status = "临时保存"
						}
							break;
						case 2: {
							item.process_status = "审核中"
						}
							break;
						case 3: {
							item.process_status = "通过"
						}
							break;
						case 4: {
							item.process_status = "撤销"
						}
							break;
						case 5: {
							item.process_status = "拒绝"
						}
							break;
					}
				}
				this.tableData = data.result.list;
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
			importFile () {
				this.dialogConfig.dialogVisible = true;
			},
			exportList () {
				//导出
				let url = "/marketing/contractInfo/exportExcel";
				let remForm = this.form;
				delete remForm.pathL;
				exportExcel(url, remForm);
			},
			addRecord () {
				this.$router.push({
					path: "/contract/contractInfo/add",
					query: {tag: "add"}
				});
			},
			rowDetail (row) {
				this.$router.push({
					path: "/contract/contractInfo/add",
					query: {id: row.id, tag: "edit"}
				});
			},
			goDetail (rowObject) {
				if (rowObject.cell.cellIndex === 1) {
					this.$router.push({
						path: "/contract/contractInfo/detail",
						query: {id: rowObject.row.id}
					});
				}
			},

			importFileConfirm () {
				//导入的确认操作
				this.dialogConfig.dialogVisible = false;
			},
			importFileCancel () {
				//导入的取消操作
				this.dialogConfig.dialogVisible = false;
			}
		}
	};
</script>