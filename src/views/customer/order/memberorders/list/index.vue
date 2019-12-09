<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <div>
          <el-button @click="reset(form)" size="mini" type="primary">重 置</el-button>
          <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
        </div>
      </div>
      <!-- 检索条件 -->

      <el-form style="margin-top:18px;padding-left: 20px" inline ref="form" size="mini" :model="form"
               label-width="80px">

        <el-form-item label="家庭号">
          <el-input style="width:100%" v-model="form.familyNumber" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="套餐名称">
          <el-input style="width:100%" v-model="form.name" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select style="width:100%" v-model="form.status">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div class="health-bottom" style="height: 100%">
      <div class="title-bar">
        <span>订单列表</span>
      </div>
      <div ref="table" class="column-bottom">
        <el-table ref="data" height="100%" :data="tableData" border v-loading="loading" element-loading-text="正在加载中"
                  :row-class-name="tableRowClassName">
          <el-table-column label="序号" align="center" type="index" :index="indexMethod" width="100px">
          </el-table-column>
          <el-table-column prop="familyNo" label="家庭号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="color:#409EFF;cursor:pointer;" @click="jumpOne(scope.row)">
                {{ scope.row.familyNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" show-overflow-tooltip label="订单号" align="center">
          </el-table-column>
          <el-table-column prop="comment" label="套餐名称" align="center" show-overflow-tooltip width="150px">
            <template slot-scope="scope">
              <div
                style="color:#409EFF;cursor:pointer;width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                @click="jumpTwo(scope.row)">
                {{ scope.row.comment}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="serviceCopy" :formatter="toFixed" show-overflow-tooltip label="价格(RMB)" align="center"
                           sortable>
            <template slot-scope="scope">
              {{scope.row.orderNumber === null ? '0' : scope.row.serviceCopy}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="来源" align="center">
            <template slot-scope="scope">
              {{scope.row.orderNumber === null ? '服务码' : '客户端'}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="激活时间" align="center">
          </el-table-column>
          <el-table-column prop="indate" show-overflow-tooltip label="有效期" sortable align="center">
          </el-table-column>
          <el-table-column prop="status" show-overflow-tooltip label="状态" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.status === 3 && scope.row.orderNumber !== null" style="color: #0000ff;">已支付</span>
              <span v-show="scope.row.status === 2 && scope.row.orderNumber !== null" style="color: #b5a464;">未支付</span>
              <span v-show="scope.row.status === 1 && scope.row.orderNumber !== null" style="color: #b5b5b5;">已过期</span>
              <span v-show="scope.row.status === 1 && scope.row.orderNumber == null"
                    style="color: #b5b5b5;">(赠送)已过期</span>
              <span v-show="scope.row.status === 2 && scope.row.orderNumber == null" style="color: #b5b5b5;">赠送</span>
              <span v-show="scope.row.status === 3 && scope.row.orderNumber == null" style="color: #b5b5b5;">赠送</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
  </div>
</template>


<script>
	export default {
		name: "",
		components: {},
		props: [],
		data () {
			return {
				timeVal: "",
				loading: true,
				//检索条件
				form: {
					familyNumber: "", //家庭号
					name: "", //套餐名称
					status: "" // 状态
				},
				status: [
					{value: 3, label: "已支付"},
					{value: 2, label: "未支付"},
					{value: 1, label: "已过期"}
				],
				tableData: [], //table内容
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1 //当前页码
			};
		},
		methods: {
			// 序号
			indexMethod (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			//金额保留2位小数
			toFixed (row) {
				let price = Number(row.serviceCopy).toFixed(2);
				return price;
			},
			//获取table列表
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/family/orderOperating/orderList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					familyNo: this.form.familyNumber, //家庭号
					comment: this.form.name, //套餐名称
					payStatus: this.form.status //支付状态
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						// console.log(res);
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//距离有效期10个自然日整行便色
			tableRowClassName (scope) {
				// console.log(scope.row);
				if (scope.row.inTenDay === 1) {
					return "warning-row";
				}
				return "";
			},
			// 重置搜索表单
			reset (form) {
				for (let i in form) {
					form[ i ] = "";
				}
				this.loading = true;
				this.pageNum = 1;
				// this.queryList();
				this.$get("/data/my", {
					pathL: "/family/orderOperating/orderList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					familyNo: this.form.familyNumber, //家庭号
					comment: this.form.name, //套餐名称
					payStatus: this.form.status //支付状态
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						// console.log(res);
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
						this.$message({
							message: "重置表单完成",
							type: "success",
							center: true
						});
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 搜索信息
			search (form) {
				this.pageNum = 1;
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/family/orderOperating/orderList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					familyNo: form.familyNumber, //家庭号
					comment: form.name, //套餐名称
					payStatus: form.status //支付状态
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
						this.$message({
							message: "搜索完成",
							type: "success",
							center: true
						});
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//家庭号跳转
			jumpOne (items) {
				this.$router.push({
					name: "统计分析/家庭统计/列表管理/家庭人员列表",
					query: {
						familyNo: items.familyNo
					}
				});
			},
			//套餐名称跳转
			jumpTwo (items) {
				this.$router.push({
					name: "商品管理/会员服务配置/列表/查看",
					query: {
						id: items.packageId
					}
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			}
		},
		mounted () {
			this.queryList();
		},
		watch: {},
		computed: {}
	};
</script>

