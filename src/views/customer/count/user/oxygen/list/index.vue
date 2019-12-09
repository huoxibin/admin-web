<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--检索条件-->
      <el-form
        ref="form"
        inline
        style="margin-top:18px;"
        :model="form"
        size="mini"
        label-width="100px"
      >
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
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="SpO2%标准">
          <el-select v-model="form.spo2Level">
            <el-option label="全部" value></el-option>
            <el-option v-for="item,index in spo2Level" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BPM标准">
          <el-select v-model="form.bpmLevel">
            <el-option label="全部" value></el-option>
            <el-option v-for="item,index in bpmLevel" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="form.deviceSnType" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="测试用户" value="1"></el-option>
            <el-option label="正式用户" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <!--title栏-->
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
      <!--数据列表-->
      <div class="column-bottom" :style="{'height':`${tableHeight}`}" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="data" stripe border style="width: 100%">
          <el-table-column prop="name" label="测量用户" align="center"></el-table-column>

          <el-table-column prop="deviceSnType" label="用户类型" align="center"></el-table-column>

          <el-table-column prop="familyNo" label="家庭号" align="center"></el-table-column>

          <el-table-column prop="mobile" label="用户手机号" align="center"></el-table-column>

          <el-table-column prop="spo2" label="最新SpO2%" align="center">
            <template slot-scope="scope">{{scope.row.spo2+' %'}}</template>
          </el-table-column>
          <el-table-column prop="spo2Level" label="SpO2%标准" align="center"></el-table-column>
          <el-table-column prop="bpm" label="最新BPM" align="center"></el-table-column>
          <el-table-column prop="bpmLevel" label="BPM标准" align="center"></el-table-column>
          <el-table-column prop="measuringTime" label="测量时间" align="center"></el-table-column>
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
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
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
					spo2Level: "",
					bpmLevel: "",
					mobile: "", //手机号
					deviceSnType: "" //用户类型
				},
				spo2Level: [ "低氧血症", "血氧偏低", "正常" ],
				bpmLevel: [ "偏低", "偏高", "正常" ],
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
		methods: {
			// 获取列表信息
			getData (search) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/health/bloodOxygen/queryLastestMeasure",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					userName: this.form.userName,
					familyId: this.form.familyId,
					mobile: this.form.mobile,
					deviceSnType: this.form.deviceSnType,
					beginDate:
						this.form.date === null || this.form.date === ""
							? ""
							: this.form.date[ 0 ],
					endDate:
						this.form.date === null || this.form.date === ""
							? ""
							: this.form.date[ 1 ],
					spo2Level: this.form.spo2Level,
					bpmLevel: this.form.bpmLevel,
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
				if (
					!/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/.test(
						form.mobile
					) &&
					form.mobile !== ""
				) {
					this.$message({
						message: "请输入正确的手机号",
						type: "warning",
						center: true
					});
				}
				else {
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
					name: "统计分析/用户统计/血氧测量统计/详情",
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
					this.tableHeight = `${window.innerHeight - this.$refs.table.offsetTop-320}px`;
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
			},
		},
		beforeRouteEnter (to, from, next) {
			if (from.name !== "统计分析/用户统计/血氧测量统计/详情") {
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
		}
	};
</script>


