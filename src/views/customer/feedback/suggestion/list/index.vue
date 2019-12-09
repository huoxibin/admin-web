<template>
  <div class="health comment">
    <base-layout methods="get" ref="list" :form="form" @getData="getData" style="height: 100%;">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>

      <!--表格-->
      <dk-table
        slot="table"
        border
        height="100%"
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="100"
        index
        :pageNum="1"
        :pageSize="10"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="rowDetail(scope.row)">查看</el-button>
        </template>
      </dk-table>
    </base-layout>
    <dk-dialog
      :baseConfig="dialogConfig"
      :dialogShow.sync="dialogConfig.visible"
      :showCancelBtn=false
      :showConfirmBtn=false
      @closeDialog="closeDialog"
    >
      <dk-form :form="dialogform" :config="dialogformConfig" :inline="true" labelWidth="85px" slot="form"></dk-form>
      <dk-form :form="dialogform" :config="dialogformConfig1" :inline="false" labelWidth="85px" slot="form"></dk-form>

    </dk-dialog>
  </div>
</template>

<script>
	export default {
		data: () => ({
			form: {
				pathL: "/doctor/doctorInfo/getFeedBackList",
				doctorName: "",
				mobile: "",
				time: null,
				feedBackStartDate: null,
				feedBackEndDate: null
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "用户姓名",
					value: "doctorName",
					option: {
						placeholder: "请输入用户姓名",
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
					label: "反馈日期",
					value: "time",
					option: {
						type: 'daterange',
						disabled: false,
						format: 'yyyy-MM-dd'
					},
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "用户姓名",
					value: "doctorName"
				},
				{
					type: "",
					label: "用户手机号",
					value: "mobile"
				},
				{
					type: "",
					label: "反馈平台",
					value: "terminalType"
				},
				{
					type: "",
					label: "反馈日期",
					value: "createTime"
				}
			],
			tableData: [],
			dialogform: {},
			dialogformConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "用户姓名",
					value: "doctorName",
					option: {
						placeholder: "请输入用户姓名",
						disabled: true
					}
				},
				// 搜索条件相关配置
				{
					type: "input",
					label: "手机号",
					value: "mobile",
					option: {
						placeholder: "请输入用户姓名",
						disabled: true
					}
				},
				// 搜索条件相关配置
				{
					type: "input",
					label: "反馈时间",
					value: "createTime",
					option: {
						placeholder: "请输入用户姓名",
						disabled: true
					}
				},
				// 搜索条件相关配置
				{
					type: "input",
					label: "反馈平台",
					value: "terminalType",
					option: {
						placeholder: "请输入用户姓名",
						disabled: true
					}
				}
			],
			dialogformConfig1: [
				{
					type: "textarea",
					label: "反馈内容",
					value: "opinion",
					option: {
						type: "textarea",
						disabled: true,
						rows: 7
					}
				}
			],
			/////////弹窗配置////////////
			dialogConfig: {
				visible: false,
				width: "550px",
				title: "查看意见反馈"
			},
		}),
		watch: {
			'form.time' () {
				if (this.form.time) {
					this.form.feedBackStartDate = this.form.time[ 0 ];
					this.form.feedBackEndDate = this.form.time[ 1 ];
				}
				else {
					this.form.feedBackStartDate = null;
					this.form.feedBackEndDate = null;
				}
			},
		},
		methods: {
			// 获取数据
			getData (data) {
				this.tableData = data.result;
			},
			rowDetail (row) {
				this.dialogConfig.visible = true;
				this.dialogform = row;
			},
			closeDialog () {
				this.dialogConfig.visible = false;
			}
		}
	};
</script>