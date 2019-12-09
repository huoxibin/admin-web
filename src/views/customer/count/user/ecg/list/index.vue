<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--检索条件-->
      <el-form ref="form" inline style="margin-top:18px;" :model="form" size="mini" label-width="80px">
        <el-form-item label="测量用户">
          <el-input v-model="form.userName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="家庭号">
          <el-input v-model="form.familyNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="测量时间">
          <el-date-picker v-model="form.date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="form.deviceSnType" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="测试用户" value="1"></el-option>
            <el-option label="正式用户" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--title栏-->
    <div class="health-bottom">
      <div class="title-bar" style="border-top: 1px solid #ccc">
        <p>
          <span>数据列表</span>
          <span>（共{{pageLength}}条）</span>
          <span style="margin-left:20px;">当日测量总数：</span>
          <span>{{dayCount}}</span>
          <span style="margin-left:20px;">累积测量总数：</span>
          <span>{{amount}}</span>
        </p>
      </div>
      <!--数据列表-->
      <div class="column-bottom" :style="{'height':`${tableHeight}`}" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table :height="tableHeight" :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="name" label="测量用户" align="center">
          </el-table-column>
          <el-table-column prop="deviceSnType" label="用户类型" align="center"></el-table-column>
          <el-table-column prop="familyNo" label="家庭号" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="用户手机号" align="center"></el-table-column>
          <el-table-column prop="averageHeartRate" label="最新心率" align="center">
            <template slot-scope="scope">
              {{scope.row.averageHeartRate + '次/分'}}
            </template>
          </el-table-column>
          <el-table-column prop="heartRisk" label="心脏节律异常风" align="center">
          </el-table-column>
          <el-table-column prop="measuringTime" label="测量时间" align="center">
          </el-table-column>
          <el-table-column prop="amount" label="累计测量次数" align="center">
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button @click="find(scope.row)" type="text" size="small">查看</el-button>
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
		filters: {},
		data () {
			return {
				tableHeight:0,
				loading: false, //加载表示
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				//检索表单
				form: {
					date: [] //测量时间
				},
				//列表数据
				tableData: [],
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1, //当前页码
				amount: "", //累计测量总数
				dayCount: "", //当天测量数
				didianActive: false
			};
		},
		created () {
			//基础数据平台配置的按钮权限
			const btnArr = this.$store.getters.menuInfo.btnMenu;
			btnArr.forEach(item => {
				if (item.menuName == '客服平台') {
					for (let it of item.btnList) {
						let linkUrl = it.linkUrl;
						if (linkUrl == "assignUsers") {
							this.didianActive = true;
						}
					}
				}
			});
		},
		methods: {
			//获取table列表
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/health/electrocardio/getUsersEcgList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					userName: this.form.userName, //测量用户
					familyNo: this.form.familyNo, //家庭号
					startTime: this.form.date === null ? "" : this.form.date[ 0 ], //测量时间开始
					endTime: this.form.date === null ? "" : this.form.date[ 1 ], //测量时间结束
					mobile: this.form.mobile,//手机号
					deviceSnType: this.form.deviceSnType,//用户类型
					isAll: this.form.isAll
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
						this.amount = res.data.amount;
						this.dayCount = res.data.dayCount;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
						this.tableData = [];
						this.pageLength = 0;
					}
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 搜索信息
			search () {
				this.pageNum = 1;
				this.queryList();
			},
			//查看
			find (row) {
				this.$router.push({
					name: "统计分析/用户统计/心电测量统计/详情",
					query: {
						id: row.userId,
						familyNo: row.familyNo,
						mobile: row.mobile,
						deviceSnType: row.deviceSnType
					}
				});
			},
			//初始化
			initPage () {
				this.$nextTick(() => {
					this.tableHeight = `${ window.innerHeight - this.$refs.table.offsetTop - 320 }px`;
				})
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.date = [ this.$route.query.start, this.$route.query.end ];
					this.form.isAll = this.$route.query.isAll;
					this.queryList();
				}
				else {
					if (this.didianActive) {
						this.form.isAll = 2;
						this.queryList();
					}
					else {
						this.queryList();
					}
				}
			},
		},
		beforeRouteEnter (to, from, next) {
			if (from.name !== "统计分析/用户统计/心电测量统计/详情") {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.form) {
						vm.form[ i ] = "";
					}
					vm.initPage();
				});
			}
			else {
				next(vm => {
					vm.initPage();
				});
			}
		},
		mounted () {
			this.initPage();
		},

	};
</script>


