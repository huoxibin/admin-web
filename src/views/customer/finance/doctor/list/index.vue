<!--
* author: huoxibin
* created: 2018/8/24
* describe:财务管理/账户明细-医生
-->
<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--筛选条件-->
      <el-form
        ref="form"
        size="mini"
        style="margin-top:18px"
        :model="form"
        inline
        label-width="100px"
      >
        <el-form-item label="消费人员">
          <el-input v-model="form.fromAccount"></el-input>
        </el-form-item>
        <el-form-item label="医生号" prop="doctorId">
          <el-input v-model="form.doctorId" placeholder="请输入纯数字"></el-input>
        </el-form-item>
        <el-form-item label="业务名称">
          <el-select v-model="form.fromType" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option label="图文咨询" value="1"></el-option>
            <el-option label="语音咨询" value="2"></el-option>
            <el-option label="视频咨询" value="3"></el-option>
            <el-option label="家医服务" value="4"></el-option>
            <el-option label="活动收入" value="6"></el-option>
            <el-option label="招募奖励" value="7"></el-option>
            <!-- <el-option label="提现" value="11"></el-option>
            <el-option label="购买课程" value="201"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.toView" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="账户余额" value="账户余额"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="哆咖流水号">
          <el-input v-model="form.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payStatus" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option label="已支付" value="已支付"></el-option>
            <el-option label="已退费" value="已退费"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="form.date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!--列表-->
    <div class="health-bottom">
      <div class="title-bar">
        <p>数据列表</p>
        <el-button @click="exportExcel" size="mini" type="primary">导 出</el-button>
      </div>
      <div ref="table" class="column-bottom" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="tableData" border stripe style="width: 100%">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            :index="indexMethod"
            width="100px"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="doctorId" label="医生号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fromType" label="业务名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <p v-if="scope.row.fromType == 1">图文咨询</p>
              <p v-if="scope.row.fromType == 2">语音咨询</p>
              <p v-if="scope.row.fromType == 3">视频咨询</p>
              <p v-if="scope.row.fromType == 4">家庭服务</p>
              <p v-if="scope.row.fromType == 5">平台补贴</p>
              <p v-if="scope.row.fromType == 6">活动收入</p>
              <p v-if="scope.row.fromType == 7">招募奖励</p>
              <p v-if="scope.row.fromType == 8">专家补助</p>
              <p v-if="scope.row.fromType == 9">在线补助</p>
              <p v-if="scope.row.fromType == 11">提现</p>
              <p v-if="scope.row.fromType == 201">购买课程</p>
              <p v-if="scope.row.fromType == 202">个人所得税</p>
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="支付方式" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="serialNumber" label="哆咖流水号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sr" label="收入" align="center"></el-table-column>
          <el-table-column prop="ptfc" label="平台分成" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dksf" label="代扣税费" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amount" label="到账金额" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="zhye" label="账户余额" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="payStatus" label="支付状态" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="payTime" label="交易时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fromAccount" label="消费人员" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="familyNo" label="家庭号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="date" fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="record(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>
    <!--查看-->
    <el-dialog
      title="查看交易明细详情"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="60%"
      v-loading="loadingTixian"
      element-loading-text="拼命加载中"
    >
      <el-form ref="formPut" size="mini" :model="formPut" label-width="100px">
        <div class="form">
          <div class="left">
            <el-form-item label="姓名">
              <el-input v-model="formPut.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="业务名称">
              <el-input v-model="businessName" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付账户">
              <el-input v-model="formPut.account" disabled></el-input>
            </el-form-item>
            <el-form-item label="哆咖流水号">
              <el-input v-model="formPut.serialNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="收入">
              <el-input v-model="formPut.sr" disabled></el-input>
            </el-form-item>
            <el-form-item label="代扣税费">
              <el-input v-model="formPut.dksf" disabled></el-input>
            </el-form-item>
            <el-form-item label="账户余额">
              <el-input v-model="formPut.zhye" disabled></el-input>
            </el-form-item>
            <el-form-item label="家庭号">
              <el-input v-model="formPut.familyNo" disabled></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="医生号">
              <el-input v-model="formPut.doctorId" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-input v-model="formPut.payType" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="formPut.orderNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="交易时间">
              <el-input v-model="formPut.payTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="平台分成">
              <el-input v-model="formPut.ptfc" disabled></el-input>
            </el-form-item>
            <el-form-item label="到账金额">
              <el-input v-model="formPut.amount" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费人员">
              <el-input v-model="formPut.fromAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付状态">
              <el-input v-model="formPut.payStatus" disabled></el-input>
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
						callback(new Error("请输入纯数字"));
					}
					else {
						callback();
					}
				}, 500);
			};
			return {
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				loading: false, //数据列表加载的
				dialogVisible: false, //详情对话款显示与隐藏
				loadingTixian: false, //详情加载的
				//检索条件
				form: {
					fromAccount: "", //消费人员
					doctorId: "", //医生号
					fromType: "", //业务名称
					doctorName: "", //收款方
					toView: "", //支付方式
					serialNumber: "", //哆咖流水号
					payStatus: "", //支付状态
					date: [] //交易时间
				},
				//查看详情
				formPut: {
					account: ""
				},
				//查看详情 业务名称
				businessName: "",
				tableData: [], //列表数据
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1 //当前页码
			};
		},
		methods: {
			//获取table列表
			queryList () {
				if (isNaN(this.form.doctorId)) {
					this.form.doctorId = "";
					this.$message({
						message: "请输入正确的医生号",
						type: "warning",
						center: true
					});
					return;
				}
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/docAccountOperating/turnoverList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					fromAccount: this.form.fromAccount, //消费人员
					doctorId: this.form.doctorId, //医生号
					fromType: this.form.fromType, //业务名称
					doctorName: this.form.doctorName, //收款方
					toView: this.form.toView, //支付方式
					serialNumber: this.form.serialNumber, //哆咖流水号
					payStatus: this.form.payStatus, //支付状态
					createTimeStart: this.form.date === null ? "" : this.form.date[ 0 ], //交易时间
					createTimeEnd: this.form.date === null ? "" : this.form.date[ 1 ] //交易时间
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
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
			record (row) {
				this.dialogVisible = true;
				this.loadingTixian = true;
				this.$get("/data/my", {
					pathL: "/doctor/docAccountOperating/turnoverDetails",
					id: row.id
				}).then(res => {
					if (res.state === 0) {
						this.loadingTixian = false;
						this.formPut = res.data;
						//业务名称
						let businName = res.data.fromType;
						if (businName == 1) {
							this.businessName = "图文咨询";
						}
						if (businName == 2) {
							this.businessName = "语音咨询";
						}
						if (businName == 3) {
							this.businessName = "视频咨询";
						}
						if (businName == 4) {
							this.businessName = "家医服务";
						}
						if (businName == 5) {
							this.businessName = "发放的补贴费用";
						}
						if (businName == 6) {
							this.businessName = "活动收入";
						}
						if (businName == 7) {
							this.businessName = "招募奖励";
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
			// 导出表格
			exportExcel () {
				let createTimeStart_export =
					this.form.date === null || this.form.date[ 0 ] === undefined
						? ""
						: this.form.date[ 0 ];
				let createTimeEnd_export =
					this.form.date === null || this.form.date[ 1 ] === undefined
						? ""
						: this.form.date[ 1 ];
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let urlL = `${ realm }doctor/docAccountOperating/turnoverListExcel?
           &version=${ version }
           &accessToken=${ this.$store.getters.accessToken }
           &fromAccount=${ this.form.fromAccount }
           &doctorId=${ this.form.doctorId }
           &fromType=${ this.form.fromType }
           &doctorName=${ this.form.doctorName }
           &toView=${ this.form.toView }
           &serialNumber=${ this.form.serialNumber }
           &payStatus=${ this.form.payStatus }
           &createTimeStart=${ createTimeStart_export }
           &createTimeEnd=${ createTimeEnd_export }
        `;
				this.$get("/data/exportExecl", {
					url: urlL.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			}
		},
		mounted () {
			this.queryList();
		}
	};
</script>
