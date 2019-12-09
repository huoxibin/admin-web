<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>

      <el-form ref="form" class="m-t-20" size="mini" inline style="margin-top:18px" :model="form" label-width="80px">
        <el-form-item label="家庭号">
          <el-input v-model="form.familyNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="form.devID" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="家庭成员">
          <el-input v-model="form.memberCount" placeholder="请输入家庭成员个数">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="会员情况">
          <el-select v-model="form.vipFlag" placeholder="请选择会员情况">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开通" value="1"></el-option>
            <el-option label="会员" value="2"></el-option>
            <el-option label="已过期" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="form.snType " placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="测试用户" value="1"></el-option>
            <el-option label="正式用户" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活时间">
          <el-date-picker v-model="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <span>数据列表</span>
      </div>
      <div class="column-bottom" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="data" border stripe style="width: 100%;" @sort-change="sortChange">
          <el-table-column label="序号" width="100" type="index" :index="indexMethod" align="center">
          </el-table-column>
          <el-table-column prop="familyNo" label="家庭号" align="center">
          </el-table-column>
          <el-table-column prop="SN" label="设备ID" align="center">
          </el-table-column>
          <el-table-column prop="snType" label="用户类型" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.snType == 1">测试用户</p>
              <P v-if="scope.row.snType == 2">正式用户</P>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" sortable="custom" label="激活时间" align="center">
          </el-table-column>
          <el-table-column prop="ipCity" label="位置" align="center">
          </el-table-column>
          <el-table-column prop="memberCount" label="家庭成员" align="center">
          </el-table-column>
          <el-table-column prop="followerCount" label="关注用户" align="center">
          </el-table-column>
          <el-table-column prop="vipFlag" label="会员情况" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.vipFlag===1">未开通</p>
              <p v-if="scope.row.vipFlag===2">会员</p>
              <p v-if="scope.row.vipFlag===3">已过期</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="170" align="center">
            <template slot-scope="scope">
              <el-button @click="record(scope.row)" type="text" size="small">查看家庭</el-button>
              <el-button @click="shoppingRec(scope.row)" type="text" size="small">购买记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
    <el-dialog title="购买记录" :append-to-body="true" center :visible.sync="dialogVisible" width="30%">
      <p v-if="recordList.length!==0" v-for="item,index in recordList" :key="index">{{item.payTime}} 购买了
        {{item.serviceName}}。</p>
      <p v-if="recordList.length===0">暂无购买记录！</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" type="primary">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				loading: true,
				dialogVisible: false,
				pageSize: 10,
				pageLength: 0,
				pageNum: 1,
				form: {
					mobile: '',//手机号
					snType: '',//用户类型
					familyNo: "",
					devID: "",
					memberCount: "",
					vipFlag: "",
					userType: '',//用户类型
					startTime: '',
					endTime: ''
				},
				date: null,
				data: [],
				recordList: [],
				sort: 1
			};
		},
		beforeRouteEnter (to, from, next) {
			if (from.name !== "统计分析/家庭统计/列表管理/家庭人员列表") {
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
			// 获取数据列表
			getData (search) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/family/familyInfoOperating/familyList",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					familyNo: this.form.familyNo,
					memberCount: this.form.memberCount,
					vipFlag: this.form.vipFlag,
					devID: this.form.devID,
					sort: this.sort,
					mobile: this.form.mobile,//手机号
					snType: this.form.snType, //用户类型
					startTime: this.date != null ? this.date[ 0 ] : '',//激活开始时间
					endTime: this.date != null ? this.date[ 1 ] : '', //激活结束时间
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
					}
				});
			},
			// 排序方式
			sortChange (sort) {
				this.pageNum = 1;
				if (sort.order === "ascending") {
					this.sort = 2;
					this.getData();
				}
				else {
					this.sort = 1;
					this.getData();
				}
			},
			// 序号
			indexMethod (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 查询
			search (form) {
				if (form.memberCount !== "") {
					if (form.memberCount.replace(/[^\d]/g).includes(undefined)) {
						this.$message({
							message: "请输入正确的家庭成员",
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
			//查看家庭
			record (row) {
				this.$router.push({
					name: "统计分析/家庭统计/列表管理/家庭人员列表",
					query: {
						familyNo: row.familyNo
					}
				});
			},
			//购买记录
			shoppingRec (row) {
				this.recordList = row.payRule;
				this.dialogVisible = true;
			},
			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.date = [ this.$route.query.start, this.$route.query.end ];
					this.getData();
				}
				else {
					this.getData();
				}
			}
		},
		mounted () {
			this.initPage();
		}
	};
</script>


