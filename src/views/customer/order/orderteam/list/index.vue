<template>
  <div class="health comment">
    <!-- 搜索表单 -->
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <el-form inline label-width="100px" class="m-t-10" ref="form" size="mini" :model="form">
        <el-form-item label="订单号">
          <el-input v-model="form.orderNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="家医团队">
          <el-input v-model="form.teamName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="签约家庭号">
          <el-input v-model="form.familyNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="签约状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-for="item in signState" :key="item.value" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约提交时间">
          <el-date-picker v-model="form.submitdate" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约时间">
          <el-date-picker v-model="form.signdate" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div class="health-bottom">
      <div class="title-bar">
        <span>数据列表</span>
        <el-button @click="exportExcel" size="mini" type="primary">导出</el-button>
      </div>
      <div ref="table" class="column-bottom" v-loading="loading" element-loading-text="正在加载中">
        <el-table id="table" ref="data" height="100%" :data="data" border stripe style="width: 100%;">
          <el-table-column prop="orderNum" show-overflow-tooltip label="订单号" align="center"
                           width="180"></el-table-column>
          <el-table-column prop="teamName" show-overflow-tooltip label="家医团队" align="center"
                           width="80"></el-table-column>
          <el-table-column prop="familyNo" show-overflow-tooltip label="签约家庭号" align="center"
                           width="100"></el-table-column>
          <el-table-column prop="memberCount" show-overflow-tooltip label="家庭成员数" align="center"
                           width="100"></el-table-column>
          <el-table-column prop="packageCount" show-overflow-tooltip label="签约服务包数" align="center"
                           width="120"></el-table-column>
          <el-table-column prop="itemNotCount" show-overflow-tooltip label="待完成服务项数" align="center"
                           width="140"></el-table-column>
          <el-table-column prop="itemYesCount" show-overflow-tooltip label="已完成服务项数" align="center"
                           width="140"></el-table-column>
          <el-table-column prop="payTime" show-overflow-tooltip label="签约提交时间" align="center"
                           width="180"></el-table-column>
          <el-table-column prop="orderAmount" show-overflow-tooltip label="签约单金额" align="center"
                           width="140"></el-table-column>
          <el-table-column prop="statusTxt" show-overflow-tooltip label="签约状态" align="center"
                           width="140"></el-table-column>
          <el-table-column prop="signTime" show-overflow-tooltip label="签约时间" align="center" width="200"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
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
		data () {
			return {
				loading: false,
				form: {
					orderNum: "",
					teamName: "",
					familyNum: "",
					status: "",
					submitdate: [],
					signdate: []
				},
				signState: [
					{
						value: '全部',
						id: ''
					},
					{
						value: '等待签约',
						id: '1'
					},
					{
						value: '已签约',
						id: '2'
					},
					{
						value: '已完成',
						id: '5'
					}
				],
				pageSize: 10,//每页显示得条数
				pageLength: 0,//一共多少条数据
				pageNum: 1,//当前页码
				data: []
			};
		},
		methods: {
			// 搜索信息
			search (form) {
				//家医签约单列表
				this.pageNum = 1;
				this.queryList();
			},
			// 导出表格
			exportExcel () {
				let bPayTime_export = this.form.submitdate.length ? this.form.submitdate[ 0 ] : '';
				let ePayTime_export = this.form.submitdate.length ? this.form.submitdate[ 1 ] : '';
				let bSignTime_export = this.form.signdate.length ? this.form.signdate[ 0 ] : '';
				let eSignTime_export = this.form.signdate.length ? this.form.signdate[ 0 ] : '';
				let familyNo_export = this.form.familyNo ? this.form.familyNo : '';

				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let url = `
      ${ realm }doctor/teamSignInfo/export?
        &version=${ version }
      	&pageNum=${ this.pageNum }
	      &pageSize=${ this.pageSize }
        &orderNum=${ this.form.orderNum }
        &teamName=${ this.form.teamName }
        &familyNo=${ familyNo_export }
        &status=${ this.form.status }
        &bPayTime=${ bPayTime_export }
        &ePayTime=${ ePayTime_export }
        &bSignTime=${ bSignTime_export }
        &eSignTime=${ eSignTime_export }
      `;
				this.$get("/data/exportExecl", {
					url: url.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url
				});
			},
			//家医签约单列表
			queryList () {
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/doctor/teamSignInfo/orderList",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					orderNum: this.form.orderNum,
					teamName: this.form.teamName,
					familyNo: this.form.familyNo,
					status: this.form.status,
					bPayTime: this.form.submitdate === null ? "" : this.form.submitdate[ 0 ],
					ePayTime: this.form.submitdate === null ? "" : this.form.submitdate[ 1 ],
					bSignTime: this.form.signdate === null ? '' : this.form.signdate[ 0 ],
					eSignTime: this.form.signdate === null ? "" : this.form.signdate[ 1 ]
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.pageLength = res.data.total;
						let resData = res.data.result;
						for (let i = 0; i < resData.length; i++) {
							let resStatus = resData[ i ].status;
							switch (resStatus) {
								case 0:
									resData[ i ][ "statusTxt" ] = "";
									break;
								case 1:
									resData[ i ][ "statusTxt" ] = "等待签约";
									break;
								case 2:
									resData[ i ][ "statusTxt" ] = "已签约";
									break;
								case 3:
									resData[ i ][ "statusTxt" ] = "";
									break;
								case 4:
									resData[ i ][ "statusTxt" ] = "";
									break;
								case 5:
									resData[ i ][ "statusTxt" ] = "已完成";
									break;
							}
						}
						this.data = resData;
            /*this.$message({
             message: "搜索完成",
             type: "success",
             center: true
             });*/
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				})
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 编辑
			update (row) {
				this.$router.push({
					name: "医护管理/团队管理/家医团队列表/编辑家医团队",
					query: {
						id: row.id
					}
				});
			},
			// 查看家医签约单
			view (row) {
				this.$router.push({
					name: "订单管理/家医签约单管理/家医签约单列表/查看家医签约单",
					query: {
						signInfoId: row.signInfoId
					}
				});
			},
			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.signdate = [ this.$route.query.start, this.$route.query.end ];
					this.queryList();
				}
				else {
					this.queryList();
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			if (
				from.name !== "订单管理/家医签约单管理/家医签约单列表/查看家医签约单"
			) {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.form) {
						vm.form[ i ] = "";
					}
					;
					vm.initPage();
				})
			}
			else {
				next(vm => {
					vm.initPage();
				});
			}
		},
		mounted () {

			//console.log(this.pageSize);
			this.initPage();
		}
	};
</script>
