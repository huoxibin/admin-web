<template>
  <div class="">
    <!-- title -->
    <div class="health-top">
      <div class="title-bar m-b-20">
        <p>筛选查询</p>
        <el-button type="primary" size="mini" @click="search">搜索查询</el-button>
      </div>
      <!-- form -->
      <slot name="form"></slot>
    </div>
    <!-- btns -->
    <div class="health-bottom">
      <div class="title-bar">
        <p>{{ tableTitle }}</p>
        <slot name="btns"></slot>
      </div>

      <!-- table -->
      <div class="column-bottom" :style="{'height':`${tableHeight}px`}" ref="table" v-loading="loading"
           element-loading-text="拼命加载中">
        <slot name="table"></slot>
      </div>
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
		name: "BaseLayout",
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
			},
			remPageNum: {
				type: Boolean,
				default: false
			}
		},
		data: () => ({
			tableHeight: 300,
			loading: false,
			pageNum: 1,
			pageSize: 10,
			total: 0
		}),
		mounted () {
			// 获取 table 高度
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - this.$refs.table.offsetTop - 200;
			})
			this.getData();
		},
		methods: {

			// 获取数据
			getData (search) {
				let page = {
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
						this.loading = false;
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
						this.loading = false;
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 筛选查询
			search () {
				//debugger
				if (!this.remPageNum) {
					this.pageNum = 1;
				}
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
