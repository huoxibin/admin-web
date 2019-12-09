<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(formVal)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--检索条件-->
      <el-form ref="form" inline style="margin-top:18px;" :model="form" size="mini" label-width="100px">
        <el-form-item label="测量用户">
          <el-input v-model="formVal.userName" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="家庭号">
          <el-input v-model="formVal.familyId" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="formVal.mobile" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="测量时间">
          <el-date-picker v-model="formVal.date" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="心率状态">
          <el-select v-model="formVal.heartRateDesc" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in form.heartrateState" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收缩压状态">
          <el-select v-model="formVal.sbpDesc" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in form.systolicpressureState" :key="index" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="舒张压状态">
          <el-select v-model="formVal.dbpDesc" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in form.diastolicpressureState" :key="index" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="formVal.deviceSnType" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="测试用户" value="1"></el-option>
            <el-option label="正式用户" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--title栏-->
    <div class="health-bottom">
      <div class="title-bar">
        <p>
          <span>数据列表</span>
          <span>（共{{ pageLength }}条）</span>
          <span style="margin-left:20px;">当日测量总数:</span>
          <span>{{ todayCount }}</span>
          <span style="margin-left:20px;">累积测量总数:</span>
          <span>{{ totalCount }}</span>
        </p>
      </div>
      <!--数据列表-->
      <div class="column-bottom" :style="{'height':`${tableHeight}`}" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table :height="tableHeight" :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="name" label="测量用户" align="center"></el-table-column>
          <el-table-column prop="deviceSnType" label="用户类型" align="center"></el-table-column>
          <el-table-column prop="familyNo" label="家庭号" align="center"></el-table-column>
          <el-table-column prop="mobile" label="用户手机号" align="center"></el-table-column>
          <el-table-column prop="heartRate" label="最新心率" align="center"></el-table-column>
          <el-table-column prop="heartRateDesc" label="心率状态" align="center"></el-table-column>
          <el-table-column prop="sbp" label="最新收缩压" align="center"></el-table-column>
          <el-table-column prop="sbpDesc" label="收缩压状态" align="center"></el-table-column>
          <el-table-column prop="dbp" label="最新舒张压" align="center"></el-table-column>
          <el-table-column prop="dbpDesc" label="舒张压状态" align="center"></el-table-column>
          <el-table-column prop="measureTime" label="测量时间" align="center"></el-table-column>
          <el-table-column prop="countNumber" label="累计测量次数" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
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
		data () {
			return {
				tableHeight: 0,
				loading: false,//加载表示
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				//检索表单
				form: {
					heartrateState: [ '偏低', '正常', '偏高' ], //心率状态
					systolicpressureState: [ '偏低', '正常', '偏高', '严重增高' ],   //收缩压状态
					diastolicpressureState: [ '偏低', '正常', '偏高', '严重增高' ]  //舒张压状态
				},
				formVal: {
					isAll: '',
					userName: '', //测量用户
					familyId: '', //家庭号
					date: '', //测量时间
					heartRateDesc: '', //心率状态
					sbpDesc: '', //收缩压状态
					dbpDesc: '', //舒张压状态
					mobile: '',//手机号
					deviceSnType: ''//用户类型
				},
				//列表数据
				tableData: [],
				todayCount: '', //当日测量总数
				totalCount: '', //累积测量总数
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1, //当前页码
				didianActive: false
			}
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
		beforeRouteEnter (to, from, next) {
			if (from.name !== "统计分析/用户统计/血压测量统计/详情") {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.formVal) {
						vm.formVal[ i ] = "";
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
		methods: {
			//获取table列表
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/health/bloodPressure/queryLastestPressure",
					pageSize: this.pageSize,//每页显示得条数
					pageNum: this.pageNum,//当前页码
					userId: this.$store.getters.userId,
					userName: this.formVal.userName,//测量用户
					familyId: this.formVal.familyId,//家庭号
					beginDate: this.formVal.date === null || this.formVal.date === "" ? "" : this.formVal.date[ 0 ],//测量起始时间
					endDate: this.formVal.date === null || this.formVal.date === "" ? "" : this.formVal.date[ 1 ],//测量结束时间
					sbpDesc: this.formVal.sbpDesc,//收缩压状态
					dbpDesc: this.formVal.dbpDesc,//舒张压状态
					mobile: this.formVal.mobile,
					deviceSnType: this.formVal.deviceSnType,
					heartRateDesc: this.formVal.heartRateDesc,//心率状态
					isAll: this.formVal.isAll
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.tableData = res.data.result; //数据列表
						this.todayCount = res.data.result[ 0 ].todayCount;  //当日测量总数
						this.totalCount = res.data.result[ 0 ].totalCount;  //累积测量总数
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
						this.tableData = [];
						this.pageLength = 0;
					}
				})
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 搜索信息
			search (formVal) {
				if (formVal.familyId.replace(/[^\d]/g).includes(undefined)) {
					this.$message({
						message: "请输入正确的家庭号",
						type: "warning",
						center: true
					});
				}
				else {
					this.pageNum = 1;
					this.queryList();
				}
			},
			//查看
			find (row) {
				this.$router.push({
					name: "统计分析/用户统计/血压测量统计/详情",
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
					this.formVal.date = [ this.$route.query.start, this.$route.query.end ];
					this.formVal.isAll = this.$route.query.isAll;
					this.queryList();
				}
				else {
					if (this.didianActive) {
						this.formVal.isAll = 2;
						this.queryList();
					}
					else {
						this.queryList();
					}
				}
			},
		},
		mounted () {
			this.initPage();
		}
	}
</script>



