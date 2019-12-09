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
      <!--表格-->
      <dk-table
        slot="table"
        border
        stripe
        operating
        :operatingWidth="100"
        :data="tableData"
        :config="tableConfig"
        index
        :pageNum="1"
        :pageSize="10"
      >
        <template slot-scope="scope" fix="right">
          <el-button type="text" @click="detailRecord(scope.row)">查看</el-button>
        </template>
      </dk-table>
    </base-layout>
  </div>
</template>
<script>
	export default {
		data: () => ({
			currNum: 0,
			totalNum: 0,
			totalMeterNum: 0,
			form: {
				pathL: "/health/bodyTemperature/list",
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
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "测量用户",
					value: "userName"
				},
				{
					type: "",
					label: "用户类型",
					value: "userType"
				},
				{
					type: "",
					label: "家庭号",
					value: "familyNo"
				},
				{
					type: "",
					label: "用户手机号",
					value: "mobile"
				},
				{
					type: "",
					label: "体温",
					value: "centigrade"
				},
				{
					type: "",
					label: "测量时间",
					value: "measuringTime"
				},
				{
					type: "",
					label: "累计测量次数",
					value: "num"
				}
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
					if (item.centigrade !== '') {
						item.centigrade += '℃';
					}
				})
				this.currNum = data.result.todayNum;
				this.totalMeterNum = data.result.totalNum;
				this.tableData = data.result.list;
			},
			detailRecord (row) {
				this.$router.push({
					path: '/count/bodytemperature/detail',
          query:{
						id: row.userId,
						familyNo: row.familyNo,
          }
				})
			},
		}
	};
</script>
