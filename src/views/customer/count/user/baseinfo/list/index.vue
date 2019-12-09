<template>
  <div class="health comment">
    <base-layout methods="get" ref="list" :form="form" @getData="getData" style="height: 100%;">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <el-form slot="form" labelWidth="120px" size="mini">
        <el-form-item label="所在地区">
          <base-area @handleArea="handleArea"></base-area>
        </el-form-item>
      </el-form>
      <!--表格-->
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="80"
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
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";

	export default {
		data: () => ({
			form: {
				pathL: "/user/member/listMemberInfo",
				name: '',
				mobile: '',
				countryId: '',
				provinceId: '',
				cityId: ''
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "用户姓名",
					value: "name",
					option: {
						placeholder: "请输入用户姓名",
						disabled: false
					}
				},
				{
					type: "input",
					label: "手机号",
					value: "mobile",
					option: {
						placeholder: "请输入用户手机号",
						disabled: false
					}
				},
				// {
				// 	type: "select",
				// 	label: "签约状态",
				// 	value: "companydate",
				// 	option: {
				// 		disabled: false,
				// 		data: [
				// 			{
				// 				label: "请选择",
				// 				value: 0
				// 			}, {
				// 				label: "等待签约",
				// 				value: 1
				// 			}, {
				// 				label: "已签约",
				// 				value: 2
				// 			}, {
				// 				label: "已完成",
				// 				value: 3
				// 			}, {
				// 				label: "已拒绝",
				// 				value: 4
				// 			},
				// 		]
				// 	}
				// }
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "用户姓名",
					value: "name"
				},
				{
					type: "",
					label: "年龄",
					value: "birthday",
					width: 50
				},
				{
					type: "",
					label: "性别",
					value: "sexName",
					width: 50
				},
				{
					type: "",
					label: "所在地区",
					value: "countryDetail"
				}, {
					type: "",
					label: "手机号",
					value: "mobile",
					width: 150
				}, {
					type: "",
					label: "签约团队",
					value: "signingTeamName"
				}, {
					type: "",
					label: "签约状态",
					value: "signingStatus"
				}, {
					type: "",
					label: "签约时间",
					value: "signingDate"
				},
			],
			tableData: [],
		}),
		mounted () {
		},
		methods: {
			// 获取数据
			getData (data) {
				this.tableData = data.result;
			},
			rowDetail (row) {
				this.$router.push({
          path:'/count/family/list/find/detail',
          query:{
						id:row.memberId, // 用户的id
						memberType:'member', //是关注用户，还是成员
						index:1, // 家庭中所在的序号
						familyNo:row.familyNo// 家庭id
          }
        });
			},
			handleArea (data) {
				this.form.provinceId = data.provinceId;
				this.form.cityId = data.cityId;
				this.form.countryId = data.countyId;
			},
		}
	};
</script>
