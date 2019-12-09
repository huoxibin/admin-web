<template>
  <div>
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
    <v-table
      :height="300"
      is-vertical-resize=""
      is-horizontal-resize
      style="width:100%"
      :multiple-sort="true"
      :min-height="350"
      even-bg-color="#f2f2f2"
      :select-all="selectALL"
      :select-change="selectChange"
      :columns="tableConfig.columns"
      :table-data="tableConfig.tableData"
      row-hover-color="#eee"
      row-click-color="#edf7ff"
      :paging-index="(pageNum-1)*pageSize"></v-table>
    <div style="margin-top: 10px;"></div>
    <v-pagination
      class="pull-right"
      size="mini"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      :total="total"
      :page-size="pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'jumper']">
    </v-pagination>
  </div>
</template>
<script>
	var pageIndexNum = 1;
	var pageSizeNum = 10;
	export default {
		name: 'muiltTableSelection',
		data () {
			return {
				////////表格的内容配置////////
				form: {
					doctorName: '', //医生姓名
					mobile: '' // 医生手机号
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "医生名称",
						value: "doctorName",
						option: {
							placeholder: "请输入医生名称",
							disabled: false
						}
					},
					{
						type: "input",
						label: "手机号",
						value: "mobile",
						option: {
							placeholder: "请输入手机号",
							disabled: false
						}
					}
				],
				pageNum: 1,
				pageSize: 10,
				total: 0,
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
							field: 'doctorName',
							title: '医生姓名',
							width: 80,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{
							field: 'hospitalName',
							title: '机构名称',
							width: 150,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{field: 'deptName', title: '科室', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
						{field: 'mobile', title: '手机号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
					],
				},
				multipSelection: [ [] ],//所有的选择项
				currPage: 0,//当前页
				bindfield: {
					name1: 'doctorId',
					name2: 'doctorName'
				},
			}
		},
		props: {},
		methods: {
			search () {
				this.pageSizeChange(this.pageSize);
			},
			selectALL (selection) { //选中所有的
				let fg = false;
				if (!this.multipSelection[ this.currPage ]) {
					this.multipSelection[ this.currPage ] = [];
				}
				if (selection.length) {
					fg = true;
				}
				else {
					this.multipSelection[ this.currPage ] = [];
					return;
				}
				let that = this;
				selection.map(item => {
					item._checked = true;
					let field = {};
					for (let i in this.bindfield) {
						field[ i ] = rowData[ that.bindfield[ i ] ];
					}
					this.multipSelection[ this.currPage ].push(field);
				})
				this.$emit('getSelectionData', this.multipSelection);
			},
			distinct (arr) { // 对数组去重
				let s = Array.from(new Set([ ...arr ]));
				return s;
			},
			selectChange (selection, rowData) { //存储选中的项
				rowData._checked = !rowData._checked;
				let that = this;
				if (!this.multipSelection[ this.currPage ]) {
					this.multipSelection[ this.currPage ] = [];
				}
				if (rowData._checked) {
					let field = {};
					for (let i in this.bindfield) {
						field[ that.bindfield[ `${ i }` ] ] = rowData[ that.bindfield[ `${ i }` ] ];
					}
					this.multipSelection[ this.currPage ].push(field);
				}
				else {
					this.multipSelection[ that.currPage ].forEach((item, index) => { //删除已勾选的存储值
						for (let i in item) {
							for (let m in that.bindfield) {
								if (i == that.bindfield[ `${ m }` ] && item[ `${ i }` ] == rowData[ that.bindfield[ `${ m }` ] ]) {
									that.multipSelection[ that.currPage ].splice(index, 1);
								}
							}
						}
					})
				}
				this.multipSelection[ this.currPage ] = this.distinct(this.multipSelection[ this.currPage ]);
				this.$emit('getSelectionData', this.multipSelection);
			},
			getTableData () {
				//重新获取当前页的数据
				this.loading = true;
				let that = this;
				this.$post("/data/my", {
					pathL: "/doctor/livecourseInfo/lectuerList",
					doctorName: this.form.doctorName,
					mobile: this.form.mobile,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					that.loading = false;
					if (!res.state) {
						that.tableConfig.tableData = res.data.result;
						that.total = res.data.total;
						that.selectCheck(); //重新设置页面勾选内容
					}
					else {
						that.$message("获取讲师列表失败！");
					}
				});
			},
			pageChange (pageIndex) { //点击分页
				pageIndexNum = pageIndex;
				this.pageNum = pageIndex;
				this.currPage = this.pageNum - 1;
				this.getTableData();
			},
			selectCheck () { //当分页的时候重置选中的项目
				let that = this;
				this.tableConfig.tableData.forEach(item => {
					item._checked = false;//重置所有的记录
					if (that.multipSelection[ that.currPage ]) { //有元素的时候遍历
						that.multipSelection[ that.currPage ].forEach(itm => {
							for (let i in itm) {
								for (let m in that.bindfield) {
									if (i == that.bindfield[ `${ m }` ] && item[ that.bindfield[ `${ m }` ] ] == itm[ i ]) {
										item._checked = true;//设置可选
									}
								}
							}
						})
					}
				})
			},
			pageSizeChange (pageSize) {
				this.pageNum = 1;
				pageIndexNum = 1;
				this.pageSize = pageSize;
				this.getTableData();
			}
		},
		created () {
			this.getTableData();
			this.tableConfig.tableData.forEach(item => {
				item._checked = false;
			})

		}
	}
</script>
