<template>
  <div>
    <!--:paging-index="(pageNum-1)*pageSize"-->
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
      :columns="columns"
      :table-data="recordTable"
      row-hover-color="#eee"
      row-click-color="#edf7ff"
    ></v-table>
    <div style="margin-top: 10px;"></div>
    <v-pagination
      class="pull-right"
      size="mini"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      :total="totalValue"
      :page-size="pageSize"
      :layout="['total', 'prev', 'pager', 'next', 'jumper']">
    </v-pagination>
  </div>
</template>

<script>
	var pageSizeNum = 10;
	export default {
		name: "muiltCheck",
		props: {
			recordTable: {
				default () {
					return []
				},
				require: true,
				type: Array,
			},
			columns: {
				default () {
					return []
				},
				require: true,
				type: Array,
			},
			totalValue: {
				require: true,
				type: Number,
			},
			pageSize: {
				require: true,
				type: Number,
			},
			bindfield: {
				type: Object,
				require: true,
				default () {
					return {}
				},
			}
		},
		data () {
			return {
				tableData: this.recordTable,
				multipSelection: [ [] ],//所有的选择项
				// pageNum: 1,
				// pageSize: 10,
				// total: 0,
				currPage: 0,//当前页
			}
		},
		methods: {
			distinct (arr) { // 对数组去重
				let s = Array.from(new Set([ ...arr ]));
				return s;
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
			pageSizeChange (pageSize) {
				//this.pageNum = 1;
				this.pageSize = pageSize;
				this.$emit('setTableData', pageSize, 1);
			},
			pageChange (pageIndex) { //点击分页
				//this.pageNum = pageIndex;
				this.currPage = pageIndex - 1;
				this.$emit('setTableData', this.pageSize, pageIndex);
			},
			selectCheck () { //当分页的时候重置选中的项目
				let that = this;
				this.tableData.forEach(item => {
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
			}
		},
		watch: {
			recordTable () {
				//this.tableData = this.recordTable;
				this.selectCheck(); //重新设置页面勾选内容
			}
		},
		mounted () {

		}
	}
</script>

<style scoped>

</style>
