<template>
  <div class=" comment">
    <div class="health-top">
      <div class="title">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>

      <el-form ref="form" inline style="margin-top:18px;" :model="form" size="mini" label-width="80px">
        <el-form-item label="测量用户">
          <el-input v-model="form.userName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="家庭号">
          <el-input v-model="form.familyId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="测量时间">
          <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="血糖状态">
          <el-select v-model="form.sugarLevel">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in sugarLevel" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时段">
          <el-select v-model="form.timePeriod">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item,index in timePeriod" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
    <div class="health-bottom">
      <div class="title-bar" v-if="data.length!==0">
        <p>
          <span>数据列表</span>
          <span>（共{{pageLength}}条）</span>
          <span style="margin-left:20px;">当日测量总数:</span>
          <span>{{data[0].todayCount}}</span>
          <span style="margin-left:20px;">累积测量总数:</span>
          <span>{{data[0].totalCount}}</span>
        </p>
      </div>

      <div class="column-bottom" :style="{'height':`${tableHeight}`}" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table :height="tableHeight" :data="data" stripe border style="width: 100%">
          <el-table-column prop="name" label="测量用户" align="center">
          </el-table-column>
          <el-table-column prop="deviceSnType" label="用户类型" align="center"></el-table-column>
          <el-table-column prop="familyNo" label="家庭号" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="用户手机号" align="center"></el-table-column>
          <el-table-column prop="timePeriod" label="时段" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.timePeriod===1">空腹</p>
              <p v-if="scope.row.timePeriod===2">早餐后两小时</p>
              <p v-if="scope.row.timePeriod===3">午餐前</p>
              <p v-if="scope.row.timePeriod===4">午餐后两小时</p>
              <p v-if="scope.row.timePeriod===5">晚餐前</p>
              <p v-if="scope.row.timePeriod===6">晚餐后两小时</p>
              <p v-if="scope.row.timePeriod===7">睡前</p>
              <p v-if="scope.row.timePeriod===-1">其他</p>
            </template>
          </el-table-column>
          <el-table-column prop="mmol" label="最新血糖值" align="center">
            <template slot-scope="scope">
              {{scope.row.mmol+' mmol/L'}}
            </template>
          </el-table-column>
          <el-table-column prop="sugarLevel" label="血糖状态" align="center">
          </el-table-column>
          <el-table-column prop="timeResult" label="测量时间" align="center">
          </el-table-column>
          <el-table-column prop="countNumber" label="累计测量次数" align="center">
          </el-table-column>
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
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				tableHeight:0,
				form: {
					isAll: '',
					userName: "",
					familyId: "",
					date: "",
					sugarLevel: "",
					timePeriod: "",
					mobile: '',//手机号
					deviceSnType: ''//用户类型
				},
				sugarLevel: [ "偏低", "正常", "轻度偏高", "中度偏高", "严重升高" ],
				timePeriod: [
					{
						name: "空腹",
						id: "1"
					},
					{
						name: "早餐后两小时",
						id: "2"
					},
					{
						name: "午餐前",
						id: "3"
					},
					{
						name: "午餐后两小时",
						id: "4"
					},
					{
						name: "晚餐前",
						id: "5"
					},
					{
						name: "晚餐后两小时",
						id: "6"
					},
					{
						name: "睡前",
						id: "7"
					},
					{
						name: "其他",
						id: "-1"
					}
				],
				loading: true,
				data: [],
				pageNum: 1,
				pageSize: 10,
				pageLength: 0,
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
		mounted () {
			this.initPage();
		},
		beforeRouteEnter (to, from, next) {
			if (from.name !== "统计分析/用户统计/血糖测量统计/详情") {
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
		methods: {
			// 获取列表信息
			getData (search) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/health/bloodSugar/querySugarLastestMeasure",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					userName: this.form.userName,
					familyId: this.form.familyId,
					beginDate:
						this.form.date === null || this.form.date === ""
							? ""
							: this.form.date[ 0 ],
					endDate:
						this.form.date === null || this.form.date === ""
							? ""
							: this.form.date[ 1 ],
					mobile: this.form.mobile,
					deviceSnType: this.form.deviceSnType,
					sugarLevel: this.form.sugarLevel,
					timePeriod: this.form.timePeriod,
					isAll: this.form.isAll
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.data = res.data.result;
						this.pageLength = res.data.total;
						if (search) {
							this.$message({
								type: "success",
								message: "完成搜索",
								center: true
							});
						}
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
						this.data = [];
						this.pageLength = 0;
					}
				});
			},
			// 检索
			search (form) {
				if (form.familyId !== "") {
					if (form.familyId.replace(/[^\d]/g).includes(undefined)) {
						this.$message({
							message: "请输入正确的家庭号",
							type: "warning",
							center: true
						});
					}
					else {
						this.pageNum = 1;
						this.getData(true);
					}
				}
				else {
					this.pageNum = 1;
					this.getData(true);
				}
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			// 查看
			find (row) {
				this.$router.push({
					name: "统计分析/用户统计/血糖测量统计/详情",
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
				this.$nextTick(()=>{
					this.tableHeight = `${window.innerHeight - this.$refs.table.offsetTop-220}px`;
				})
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.date = [ this.$route.query.start, this.$route.query.end ];
					this.form.isAll = this.$route.query.isAll;
					this.getData();
				}
				else {
					if (this.didianActive) {
						this.form.isAll = 2;
						this.getData();
					}
					else {
						this.getData();
					}
				}
			}
		}
	};
</script>

<style scoped>
  .sugar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
  }

  .table {
    flex: 1;
    overflow: auto;
  }

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }

  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
