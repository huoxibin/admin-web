<template>
  <div class="health-bottom">
    <!-- title -->
    <div class="title-bar m-b-20">
      <p>筛选查询</p>
      <el-button type="primary" size="mini" @click="search">搜索查询</el-button>
    </div>
    <!-- form -->
    <slot name="form"></slot>
    <!-- btns -->
    <div class="title-bar">
      <p>{{ tableTitle }}</p>
      <slot name="btns"></slot>
    </div>

    <!-- table -->
    <div class="column-bottom" ref="table" v-loading="loading" element-loading-text="拼命加载中">
      <slot name="table"></slot>
    </div>

    <!-- pagination -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
	export default {
		name: "layout-search",
		props: {
			// table title ( 选填 )
			tableTitle: {
				type: String,
				default: "数据列表"
			},
			form: {
				type: Object,
				required: true
			},
			methods: {
				type: String,
				default: "get"
			}
		},
		data: () => ({
			loading: false,
			pageNum: 1,
			pageSize: 10,
			total: 0
		}),

		mounted () {
			// 获取 table 高度

		},
		methods: {
			// 获取数据
			getData (search) {
				const page = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				};
				// 合并数据层
				const data = {...this.form, ...page};
				this.loading = true;
				this[ `$${ this.methods }` ]("/data/my", data).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.$emit("getData", res.data);
						this.total = res.data.total;
						if (search) {
							this.$message({
								type: "success",
								message: "搜索完成",
								center: true
							});
						}
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 筛选查询
			search () {
				this.pageNum = 1;
				this.form.workStatus = '';
				this.getData(true);
			},
			// 分页列表
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			}
		}
	};
</script>