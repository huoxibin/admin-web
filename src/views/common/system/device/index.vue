<template>
  <div class="health comment">
    <base-layout methods="get" :remPageNum="true" ref="list" :form="form" @getData="getData" style="height: 100%;">
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
        operating
        :operatingWidth="150"
        :data="tableData"
        :config="tableConfig"
        index
        :pageNum="1"
        :pageSize="10"
      >
        <template slot-scope="scope" fix="right">
          <el-button type="text" @click="detailRecord(scope.row.id)">查看</el-button>
          <el-button type="text" @click="editRecord(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delRecord(scope.row.id)">删除</el-button>
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
				pathL: "/common/external/getDeviceExternalPage",
				deviceModel: '', //设备型号
				startTime: '',//开始时间
				endTime: '',//结束时间
				dateTime: []
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "设备型号",
					value: "deviceModel",
					option: {
						placeholder: "请输入设备型号",
						disabled: false
					}
				},
				{
					type: "date",
					label: "添加时间",
					value: "dateTime",
					option: {
						type: "daterange",
						placeholder: "请选择添加时间",
						disabled: false,
						format: "yyyy-MM-dd"
					}
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "功能",
					value: "actionName",
					tooltip: true
				},
				{
					type: "",
					label: "功能指标",
					value: "param",
					tooltip: true
				},
				{
					type: "",
					label: "测量项",
					value: "measured",
					tooltip: true
				},
				{
					type: "",
					label: "设备厂商",
					value: "deviceFirm",
					tooltip: true
				},
				{
					type: "",
					label: "设备型号",
					value: "deviceModel",
					tooltip: true
				},
				{
					type: "",
					label: "蓝牙名称",
					value: "bluetooth",
					tooltip: true
				},
				{
					type: "",
					label: "应用于",
					value: "applyName",
					tooltip: true
				},
				{
					type: "",
					label: "证书名称",
					value: "ccieName",
					tooltip: true
				},
				{
					type: "",
					label: "证书代码",
					value: "ccieCode",
					tooltip: true
				},
				{
					type: "",
					label: "添加时间",
					value: "createTime",
					tooltip: true
				}
			],
			tableData: [],
		}),
		watch: {
			'form.dateTime' () {
				let date = this.form.dateTime;
				if (date) {
					this.form.startTime = date[ 0 ] || '';
					this.form.endTime = date[ 1 ] || '';
				}
				else {
					this.form.startTime = '';
					this.form.endTime = '';
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			if (from.path === "/system/device/add") {
				next(vm => {
					console.log("不刷新定位");
					vm.$refs.list.search();
				});
			}
			else {
				console.log("重新刷新");
				next();
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
				let url = "/common/external/exportExcelDeviceExternal";
				let remForm = JSON.parse(JSON.stringify(this.form));
				delete remForm.pathL;
				delete remForm.dateTime;
				exportExcel(url, remForm);
			},
			addRecord () {
				this.$router.push({
					path: '/system/device/add'
				})
			},
			detailRecord (id) {
				//查看详情
				this.$router.push({
					path: '/system/device/detail',
					query: {
						id
					}
				})
			},
			editRecord (id) {
				//编辑
				this.$router.push({
					path: '/system/device/add',
					query: {
						id,
						type: 'edit'
					}
				})
			},
			delRecord (id) {
				//删除记录
				this.$post('/data/my', {
					pathL: '/common/external/deleteDeviceExternal',
					id
				}).then(res => {
					if (res.state == 0) {
						this.$message("删除成功！");
						this.$refs.list.getData();
					}
				}).catch(err => {
					this.$message(err);
				})
			},

		}
	};
</script>
