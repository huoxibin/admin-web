<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--筛选条件-->
      <el-form ref="form" size="mini" class="m-t-20" :model="form" inline label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="医生号" prop="doctorId">
          <!--<el-input v-model.number="form.doctorId"></el-input>-->
          <el-input v-model="form.doctorId" placeholder="请输入纯数字"></el-input>
        </el-form-item>
        <el-form-item label="账户类型">
          <el-select v-model="form.accountType" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="银行卡" value="银行卡"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.accountChars"></el-input>
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select v-model="form.status" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="未处理" value="1"></el-option>
            <el-option label="已处理" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="哆咖流水号">
          <el-input v-model="form.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="form.date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <p>数据列表</p>
        <el-button @click="exportExcel" size="mini" type="primary">导 出</el-button>
      </div>
      <!--列表-->
      <div ref="table" class="column-bottom" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="tableData" border stripe style="width: 100%">
          <el-table-column label="序号" align="center" type="index" :index="indexMethod" width="100px"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="doctorId" label="医生号" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="canWithdrawalAccount" label="可提现金额" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="amount" label="提现金额" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="taxAccount" label="代扣转账费" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bookedAccount" label="到账金额" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="balanceAccount" label="账户余额" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="toView" label="账号类型" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="toAccount" label="账号" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="提现状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.status === 1 ? '未处理' : '已处理'}}
            </template>
          </el-table-column>
          <el-table-column prop="serialNumber" label="哆咖流水号" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="date" label="操作" fixed="right" align="center" width="130">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
              <el-button v-show="scope.row.status === 1" @click="record(scope.row)" type="text" size="small">确认提现
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
    <!--查看-->
    <el-dialog title="提现申请信息查看" :append-to-body="true" :visible.sync="dialogVisible" width="60%"
               v-loading="loadingTixian" element-loading-text="拼命加载中">
      <el-form ref="formPut" size="mini" :model="formPut" label-width="100px">
        <div class="form">
          <div class="left">
            <el-form-item label="姓名">
              <el-input v-model="formPut.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formPut.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="提现金额">
              <el-input v-model="formPut.amount" disabled></el-input>
            </el-form-item>
            <el-form-item label="到账金额">
              <el-input v-model="formPut.bookedAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="账户类型">
              <el-input v-model="formPut.toView" disabled></el-input>
            </el-form-item>
            <el-form-item label="开户银行">
              <el-input v-model="formPut.branchBankName" disabled></el-input>
            </el-form-item>
            <el-form-item label="提现状态">
              <el-input v-model="formPutStatus" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="formPut.orderNo" disabled></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="医生号">
              <el-input v-model="formPut.doctorId" disabled></el-input>
            </el-form-item>
            <el-form-item label="可提现金额">
              <el-input v-model="formPut.canWithdrawalAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="代扣转账费">
              <el-input v-model="formPut.taxAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="账户余额">
              <el-input v-model="formPut.balanceAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="账户">
              <el-input v-model="formPut.toAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="申请时间">
              <el-input v-model="formPut.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="哆咖流水号">
              <el-input v-model="formPut.serialNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="到账时间">
              <el-input v-model="formPut.successTime" disabled></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data () {
			var checkAge = (rule, value, callback) => {
				setTimeout(() => {
					if (!Number.isInteger(value)) {
						callback(new Error('请输入纯数字'));
					}
					else {
						callback();
					}
				}, 500);
			};
			return {
				//医生号 项  检索 纯数字 验证
        /* rules2: {
         doctorId: [
         { validator: checkAge, trigger: 'blur',required: false }
         ]
         },*/
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				loading: false,//数据列表加载的
				loadingTixian: false,//详情加载的
				dialogVisible: false,//详情对话款显示与隐藏
				//检索条件
				form: {
					doctorName: '',
					doctorId: '',
					accountType: '',
					accountChars: '',
					status: '',
					serialNumber: '',
					date: [],
				},
				//提现详情
				formPut: {
					status: ''
				},
				formPutStatus: '',
				tableData: [],//列表数据
				pageSize: 10,//每页显示得条数
				pageLength: 0,//一共多少条数据
				pageNum: 1//当前页码
			};
		},
		methods: {
			//获取table列表
			queryList () {
				if (isNaN(this.form.doctorId)) {
					this.form.doctorId = '';
					this.$message({
						message: "请输入正确的医生号",
						type: "warning",
						center: true
					});
					return
				}
				;
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/docAccountOperating/turnoverToList",
					pageNum: this.pageNum,//当前页码
					pageSize: this.pageSize,//每页显示得条数
					doctorId: this.form.doctorId,//医生号
					doctorName: this.form.doctorName,//姓名
					accountChars: this.form.accountChars,//账号
					status: this.form.status,//提现状态
					accountType: this.form.accountType,//账户类型
					serialNumber: this.form.serialNumber,//哆咖流水号
					createTimeStart: this.form.date === null ? '' : this.form.date[ 0 ],//申请时间-起始
					createTimeEnd: this.form.date === null ? '' : this.form.date[ 1 ]//申请时间-终止
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
				})
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
			// 序号
			indexMethod (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			//   查看
			view (row) {
				this.dialogVisible = true;
				this.loadingTixian = true;
				//提现详情查看
				this.$get("/data/my", {
					pathL: "/doctor/docAccountOperating/turnoverToInfo",
					id: row.id
				}).then(res => {
					if (res.state === 0) {
						this.loadingTixian = false;
						this.formPut = res.data;
						if (this.formPut.status == 1) this.formPutStatus = '未处理';
						if (this.formPut.status == 2) this.formPutStatus = '已审核';
						if (this.formPut.status == 3) this.formPutStatus = '已处理';
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				})
			},
			//确认提现
			record (row) {
				this.$confirm(
					"点击提现确认，表示您已经同意该用户的提现申请，并已经发起转账。",
					"确认提现",
					{
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}
				)
					.then(() => {
						this.loading = true
						//确认按钮
						this.$post("/data/my", {
							pathL: "/doctor/doctorAccountturnover/checkToTurnover",
							id: row.id
						}).then(res => {
							if (res.state === 0) {
								this.queryList();
								this.$message({
									type: "success",
									message: "确认提现成功!"
								});
								this.loading = false;
							}
							else {
								this.$message({
									message: res.msg,
									center: true
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "取消"
						});
					});
			},
			// 导出表格
			exportExcel () {
				let createTimeStart_export = (this.form.date === null || this.form.date[ 0 ] === undefined) ? '' : this.form.date[ 0 ];
				let createTimeEnd_export = (this.form.date === null || this.form.date[ 1 ] === undefined) ? '' : this.form.date[ 1 ];
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let urlL = `${ realm }doctor/docAccountOperating/exportTurnoverToExcelFile?
           &version=${ version }
           &accessToken=${ this.$store.getters.accessToken }
           &doctorId=${ this.form.doctorId }
           &doctorName=${ this.form.doctorName }
           &accountType=${ this.form.accountType }
           &accountChars=${ this.form.accountChars }
           &status=${ this.form.status }
           &serialNumber=${ this.form.serialNumber }
           &createTimeStart=${ createTimeStart_export }
           &createTimeEnd=${ createTimeEnd_export }
        `;
				this.$get("/data/exportExecl", {
					url: urlL.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url
				});
			},
		},
		mounted () {
			this.queryList();
		}
	};
</script>

