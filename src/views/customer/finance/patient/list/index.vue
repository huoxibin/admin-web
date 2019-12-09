<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button size="mini" @click="search" type="primary">搜索查询</el-button>
      </div>
      <el-form
        ref="form"
        size="mini"
        style="margin-top:18px"
        :model="form"
        inline
        label-width="100px"
      >
        <el-form-item label="家庭号">
          <el-input v-model="form.familyNo"></el-input>
        </el-form-item>
        <el-form-item label="消费人员">
          <el-input v-model="form.memberName"></el-input>
        </el-form-item>
        <el-form-item label="业务名称">
          <el-select v-model="form.memo">
            <el-option label="全部" value></el-option>
            <el-option label="账户充值" value="账户充值"></el-option>
            <el-option label="家医服务" value="家医服务"></el-option>
            <el-option label="会员套餐" value="会员套餐"></el-option>
            <el-option label="图文咨询" value="图文咨询"></el-option>
            <el-option label="语音咨询" value="语音咨询"></el-option>
            <el-option label="视频咨询" value="视频咨询"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input
            v-model="form.doctorName"
            onkeyup="value=value.replace(/[^a-zA-Z\d\u4e00-\u9fa5]/g,'')"
            onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^a-zA-Z\d\u4e00-\u9fa5]/g,''))"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.fromChannel">
            <el-option label="全部" value></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="账户余额" value="账户余额"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="form.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payStatus">
            <el-option label="全部" value></el-option>
            <el-option label="已支付" value="已支付"></el-option>
            <el-option label="已退费" value="已退费"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <p>数据列表</p>
        <el-button size="mini" @click="exportExcel" type="primary">导 出</el-button>
      </div>
      <div class="column-bottom" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="data" border stripe style="width: 100%">
          <el-table-column prop="familyNo" label="家庭号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fromAccount" label="消费人员" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fromType" label="业务名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fromChannel" label="支付方式" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="交易时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{zero(scope.row.orderAmount)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="发生金额" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{zero(scope.row.amount)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="discountAmount" label="优惠金额" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{zero(scope.row.discountAmount)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="familyBalance" label="家庭余额" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{zero(scope.row.familyBalance)}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="thirdServiceAmount"
            label="第三方服务费"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{zero(scope.row.thirdServiceAmount)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="doctorName" label="收款方" align="center"></el-table-column>
          <el-table-column prop="doctorId" label="医生号" align="center"></el-table-column>
          <el-table-column prop="payStatus" label="支付状态" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="record(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>
    <el-dialog title="查看交易明细详情" :append-to-body="true" :visible.sync="dialogVisible" width="60%">
      <el-form ref="findForm" size="mini" :model="findForm" label-width="100px">
        <div class="findForm">
          <div class="left">
            <el-form-item label="家庭号">
              <el-input v-model="findForm.familyNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="业务名称">
              <el-input v-model="findForm.fromType" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付账户">
              <el-input v-model="findForm.no" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单金额">
              <el-input v-model="findForm.orderAmount" disabled></el-input>
            </el-form-item>
            <el-form-item label="优惠金额">
              <el-input v-model="findForm.discountAmount" disabled></el-input>
            </el-form-item>
            <el-form-item label="第三方服务费">
              <el-input v-model="findForm.thirdServiceAmount" disabled></el-input>
            </el-form-item>
            <el-form-item label="收款方">
              <el-input v-model="findForm.doctorName" disabled></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="消费人员">
              <el-input v-model="findForm.fromAccount" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-input v-model="findForm.fromChannel" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="findForm.orderNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="交易时间">
              <el-input v-model="findForm.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="发生金额">
              <el-input v-model="findForm.amount" disabled></el-input>
            </el-form-item>
            <el-form-item label="账户余额">
              <el-input v-model="findForm.familyBalance" disabled></el-input>
            </el-form-item>
            <el-form-item label="医生号">
              <el-input v-model="findForm.doctorId" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付状态">
              <el-input v-model="findForm.payStatus" disabled></el-input>
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
			return {
				loading: false,
				dialogVisible: false,
				form: {
					familyNo: "",
					memberName: "",
					memo: "",
					doctorName: "",
					fromChannel: "",
					date: [],
					payStatus: "",
					serialNumber: ""
				},
				findForm: {},
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				data: [],
				pageSize: 10,
				pageLength: 0,
				pageNum: 1
			};
		},
		methods: {
			// 获取数据
			getData (search) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/family/accountMedicalOperating/operatingMedicalList",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					familyNo: this.form.familyNo,
					memberName: this.form.memberName,
					memo: this.form.memo,
					doctorName: this.form.doctorName,
					fromChannel: this.form.fromChannel,
					createTimeStart: this.form.date[ 0 ],
					createTimeEnd: this.form.date[ 1 ],
					payStatus: this.form.payStatus,
					serialNumber: this.form.serialNumber
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
			// 搜索
			search () {
				this.pageNum = 1;
				this.getData(true);
			},
			// 导出
			exportExcel () {
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let url = `
        ${ realm }family/accountMedicalOperating/exportExcel?
          &version=${ version }
          &accessToken=${ this.$store.getters.accessToken }
          &familyNo=${ this.form.familyNo }
          &memberName=${ this.form.memberName }
          &memo=${ this.form.memo }
          &doctorName=${ this.form.doctorName }
          &fromChannel=${ this.form.fromChannel }
          &createTimeStart=${
					this.form.date[ 0 ] === undefined ? "" : this.form.date[ 0 ]
					}
          &createTimeEnd=${
					this.form.date[ 1 ] === undefined ? "" : this.form.date[ 1 ]
					}
          &payStatus=${ this.form.payStatus }
          &serialNumber=${ this.form.serialNumber }
        `;
				this.$get("/data/exportExecl", {
					url: url.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			//   查看
			record (row) {
				this.dialogVisible = true;
				this.findForm = row;
				this.findForm.no = "- -";
			},
			// 补零
			zero (val) {
				let value = Math.round(parseFloat(val) * 100) / 100;
				let xsd = value.toString().split(".");
				if (xsd.length == 1) {
					value = value.toString() + ".00";
					return value;
				}
				if (xsd.length > 1) {
					if (xsd[ 1 ].length < 2) {
						value = value.toString() + "0";
					}
					return value;
				}
			}
		},
		mounted () {
      this.getData();
		}
	};
</script>

