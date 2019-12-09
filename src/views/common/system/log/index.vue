<template>
  <div class="health comment">
    <base-layout methods="get" ref="list" :form="form" @getData="getData" style="height: 100%;">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" @click="exportList">导出</el-button>
      </div>
      <!--表格-->
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        index
        :pageNum="1"
        :pageSize="10"
      >
      </dk-table>
    </base-layout>
  </div>
</template>
<script>
	import exportExcel from "@/api/excel";

	export default {
		data: () => ({
			form: {
				pathL: "/ap/logUserOperator/listLogUserOperator",
				userName: '',
				dateTime: null,
				operationStartTime: '',
				operationEndTime: ''
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "操作人员",
					value: "userName",
					option: {
						placeholder: "请输入操作人员",
						disabled: false
					}
				},
				{
					type: "date",
					label: "操作时间",
					value: "dateTime",
					option: {
						type: "daterange",
						placeholder: "请选择操作时间",
						disabled: false,
						format: "yyyy-MM-dd"
					}
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "操作内容",
					value: "comment"
				},
				{
					type: "",
					label: "操作人员",
					value: "userName"
				},
				{
					type: "",
					label: "人员角色",
					value: "roleName"
				},
				{
					type: "",
					label: "操作时间",
					value: "operatorTime"
				}
			],
			tableData: [],
		}),
		watch: {
			'form.dateTime' () {
				let date = this.form.dateTime;
				if (date) {
					this.form.operationStartTime = date[ 0 ] || '';
					this.form.operationEndTime = date[ 1 ] || '';
				}
			}
		},
		mounted () {
		},
		methods: {
			// 获取数据
			getData (data) {
				this.tableData = data.result;
			},
			exportList () {
				//导出
				let url = "/ap/logUserOperator/exportExcelLogUserOperator";
				let remForm =JSON.parse(JSON.stringify(this.form));
        delete remForm.pathL;
				exportExcel(url, remForm);
			}
		}
	};
</script>
