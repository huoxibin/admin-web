<template>
  <div class="health comment">
    <base-layout methods="get" ref="list" :form="form" @getData="getData" style="height: 100%;">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-left" slot="btns">
        <span class="m-l-10">当日测量总数：<el-button type="text">{{currNum }}</el-button></span>
        <span class="m-l-10">累积测量总数：<el-button type="text">{{totalMeterNum }}</el-button></span>
      </div>
      <tableList slot="table" :tableData="tableData"></tableList>
      <dk-page @currentChange="changePage" :pageConfig="recordPage"></dk-page>
    </base-layout>
  </div>
</template>
<script>
  import tableList from './table'
	export default {
		components: {tableList},
		data: () => ({
			currNum: 0,
			totalNum: 0,
			totalMeterNum: 0,
			recordPage: {
				pageNum: 1,
				pageSize: 10,
				total: 0
			},
			form: {
				pathL: "/health/urinalysis/list",
				userName: '',
				familyNo: '',//家庭号
				mobile: '',//手机号
				measurTimeStart: '',//开始时间
				measurTimeEnd: '',//结束时间
				userType: '',
				dateTime: []
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "测量用户",
					value: "userName",
					option: {
						placeholder: "请输入测量用户",
						disabled: false
					}
				},
				{
					type: "input",
					label: "家庭号",
					value: "familyNo",
					option: {
						placeholder: "请输入家庭号",
						disabled: false
					}
				},
				{
					type: "input",
					label: "用户手机号",
					value: "mobile",
					option: {
						placeholder: "请输入用户手机号",
						disabled: false
					}
				},
				{
					type: "date",
					label: "测量时间",
					value: "dateTime",
					option: {
						type: "daterange",
						placeholder: "请选择测量时间",
						disabled: false,
						format: "yyyy-MM-dd"
					}
				},
				{
					type: "select",
					label: "用户类型",
					value: "userType",
					option: {
						placeholder: "请选择用户类型",
						disabled: false,
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: 1,
								label: "测试用户"
							},
							{
								value: 2,
								label: "正式用户"
							},
						]
					}
				},

			],
			tableData: [],
		}),
		watch: {
			'form.dateTime' () {
				let date = this.form.dateTime;
				if (date) {
					this.form.measurTimeStart = date[ 0 ] || '';
					this.form.measurTimeEnd = date[ 1 ] || '';
				}
				else {
					this.form.measurTimeStart = '';
					this.form.measurTimeEnd = '';
				}
			}
		},
		mounted () {
		},
		methods: {
			// 获取数据
			getData (data) {
				data.result.list.forEach(item => {
					switch (item.userType) {
						case "1": {
							item.userType = '测试用户';
						}
							break;
						case "2": {
							item.userType = '正式用户';
						}
							break;
					}
				})
				this.currNum = data.result.todayNum;
				this.totalMeterNum = data.result.totalNum;
				this.tableData = data.result.list;
			},
			changePage (val) {
				//单节点点击事件
				console.log(val);
				this.recordPage.pageNum = val;
				this.getDetail();
			},

		}
	};
</script>
