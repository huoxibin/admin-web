<template>
  <div class="ovh">
    <!--表单-->
    <dk-form
      size="mini"
      :form="form"
      :config="formConfig"
      :inline="true"
      labelWidth="80px"
      slot="form"
      style="display: inline;"
    ><!-- 按钮 -->
    </dk-form>
    <el-form slot="btns" style="display: inline;" :inline="true" size="mini">
      <el-form-item label="">
        <el-button size="mini" type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <muiltCheck
      ref="muiltCheck"
      @setTableData="getTableData"
      @getSelectionData="getSelectionData"
      :recordTable.sync="tableConfig.tableData"
      :columns="tableConfig.columns"
      :totalValue="totalNum"
      :pageSize="pageSize"
      :pageNum="pageNum"
      :bindfield="bindfield"
    ></muiltCheck>
  </div>
</template>
<script>
	var pageIndexNum = 1;
	var pageSizeNum = 10;
	import muiltCheck from './muiltTable'
	export default {
		name: 'bindMember',
		components: {muiltCheck},
		data () {
			return {
				pageNum: 1,
				pageSize: 10,
				totalNum: 0,
				////////表格的内容配置////////
				form: {
					userName: '', //医生姓名
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "医生名称",
						value: "userName",
						option: {
							placeholder: "请输入医生名称",
							disabled: false
						}
					}
				],
				bindfield: {
					name1: 'id',
					name2: 'userName'
				},
				//表格配置数据
				tableConfig: {
					multipleSort: false,
					tableData: [],
					columns: [
						{width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection'},
						{
							field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
							formatter: function (rowData, rowIndex, pagingIndex, field) {
								return (pageIndexNum - 1) * pageSizeNum + (rowIndex + 1);
							}
						},
						{
							field: 'userName',
							title: '员工名称',
							width: 80,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{
							field: 'departmentName',
							title: '所属部门',
							width: 150,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{field: 'roleName', title: '角色', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
					],
				},
			}
		},
		props: {
			id: {
				type: String
			}
		},
		methods: {
			search () {
				this.pageSizeChange(this.pageSize);
			},
			getTableData (ps = 10, pn = 1) {
				this.pageSize = ps;
				this.pageNum = pn;
				pageIndexNum = pn;
				//重新获取当前页的数据
				this.loading = true;
				let that = this;
				this.$get("/data/my", {
					pathL: "/ap/sysUser/getUserListByTrafficChannelId",
					userName: this.form.userName,
					trafficChannelId: this.id,
					pageNum: pn,
					pageSize: ps
				}).then(res => {
					that.loading = false;
					if (!res.state) {
						that.tableConfig.tableData = res.data.result;
						that.totalNum = res.data.total;
						that.judgeChecked(that.tableConfig.tableData);
					}
					else {
						that.$message("获取讲师列表失败！");
					}
				});
			},
			getSelectionData (data) { //获取选择项
				this.$emit('selectionData', data);
			},
			judgeChecked (data) {
				this.tableConfig.tableData.forEach((item, index) => {
					item._checked = false;
					if (item.checked == 1) {
						const value = {
							_checked: true,
							userName: item.userName,
							roleName: item.roleName,
							trafficChannelId: item.trafficChannelId,
							departmentName: item.departmentName
						}
						this.$set(this.tableConfig.tableData, index, value) //这样就能被vue监控到，更新视图

					}
				})
			}
		},
		watch: {
			id () {
				this.getTableData();
			}
		}
	}
</script>
