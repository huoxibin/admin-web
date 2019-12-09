<template>
  <div class="health comment">
    <base-layout ref="layout" methods="get" :form="form" @getData="getData">
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="80px">
        <el-form-item label="订单号">
          <el-input v-model="form.orderSn"></el-input>
        </el-form-item>
        <el-form-item label="购买人">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="form.courseName"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.payChannelId">
            <el-option label="全部" value></el-option>
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="账户余额" value="3"></el-option>
            <el-option label="虚拟币支付" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payStatus">
            <el-option label="全部" value></el-option>
            <el-option label="已付款" value="1"></el-option>
            <el-option label="未付款" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus">
            <el-option label="全部" value></el-option>
            <el-option label="待支付" value="0"></el-option>
            <el-option label="学习中" value="1"></el-option>
            <el-option label="已完成" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="CreateTime"
            @change="getCreateTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker
            v-model="payTime"
            @change="getPayTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button size="mini" @click="exportFile" type="primary" class="pull-right">导出</el-button>
      </div>

      <!-- 表格 -->
      <el-table slot="table" height="100%" :data="data" border stripe style="width: 100%">
        <el-table-column prop="orderSn" label="订单号" align="center"></el-table-column>
        <el-table-column prop="doctorName" label="购买人" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" align="center"></el-table-column>
        <el-table-column prop="payChannelId" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="payStatus" label="支付状态" align="center"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="coursePrice" label="课程金额" align="center"></el-table-column>
        <el-table-column prop="discountAmount" label="优惠金额" align="center"></el-table-column>
        <el-table-column prop="payAmount" label="支付金额" align="center"></el-table-column>
        <el-table-column prop="payTime" label="支付时间" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="90" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editRowInfo(scope.$index, scope.row)" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--- 分页---->
      <div class="pull-right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageLength"
        ></el-pagination>
      </div>
    </base-layout>
    <!-- 弹窗 -->
    <el-dialog title="查看订单信息" append-to-body :visible.sync="dialogFormVisible" style="width: 90%">
      <el-form :model="dialogForm" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号" :label-width="formLabelWidth">{{dialogForm.orderSn}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购买人" :label-width="formLabelWidth">{{dialogForm.doctorName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称" :label-width="formLabelWidth">{{dialogForm.courseName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式" :label-width="formLabelWidth">{{dialogForm.payChannelId}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程金额" :label-width="formLabelWidth">{{form.coursePrice}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠金额" :label-width="formLabelWidth">{{dialogForm.discountAmount}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付金额" :label-width="formLabelWidth">{{dialogForm.payAmount}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下单时间" :label-width="formLabelWidth">{{dialogForm.orderTime}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付时间" :label-width="formLabelWidth">{{dialogForm.payTime}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付状态" :label-width="formLabelWidth">{{dialogForm.payStatus}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单状态" :label-width="formLabelWidth">{{dialogForm.orderStatus}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";

	export default {
		data: () => ({
			dialogFormVisible: false, //开启弹窗
			formLabelWidth: "100px",
			pageLength: 90,
			form: {
				pathL: "/doctor/doctorOrderOperator/getList",
				payTimeE: "", // 支付结束时间
				payTimeB: "", // 支付开始时间
				orderSn: "", //订单号
				doctorName: "", //医生姓名
				courseName: "", //课程名称
				payChannelId: "", //支付渠道
				orderStatus: "", //订单状态
				orderTimeB: "", //订单开始时间
				orderTimeE: "", //订单结束时间
				payStatus: "",//支付状态
				pageNum: 1,
				pageSize: 10,
			},
			data: [],
			CreateTime: null,
			payTime: null,
			dialogForm: []
		}),

		methods: {
			getCreateTime () {
				this.form.orderTimeB = this.CreateTime !== null ? this.CreateTime[ 0 ] : "";
				this.form.orderTimeE = this.CreateTime !== null ? this.CreateTime[ 1 ] : "";
			},
			getPayTime () {
				this.form.payTimeB = this.payTime !== null ? this.payTime[ 0 ] : "";
				this.form.payTimeE = this.payTime !== null ? this.payTime[ 1 ] : "";
			},
			// 列表检索钩子
			getData (data) {
				data.result.forEach(item => {
					switch (item.orderStatus) {
						case 0: {
							item.orderStatus = "待支付";
						}
							break;
						case 1: {
							item.orderStatus = "学习中";
						}
							break;
						case 2: {
							item.orderStatus = "已完成";
						}
							break;
					}

					switch (item.payStatus) {
						case 0: {
							item.payStatus = "未付款";
						}
							break;
						case 1: {
							item.payStatus = "已付款";
						}
							break;
					}
					if (item.discountAmount === 0) {
						item.discountAmount = '-';
					}
					switch (item.payChannelId) {
						case 1: {
							item.payChannelId = "微信";
						}
							break;
						case 2: {
							item.payChannelId = "支付宝";
						}
							break;
						case 3: {
							item.payChannelId = "账户余额";
						}
							break;
						case 4: {
							item.payChannelId = "虚拟币";
						}
							break;
					}
				});
				this.dealEmpyteShow(data.result);
			},
			dealEmpyteShow (data) {
				for (let item of data) {
					for (let it in item) {
						if (item[ it ] === "" || item[ it ] === null) {
							item[ it ] = "--";
						}
					}
				}
				this.data = data;
			},
			editRowInfo (index, row) {
				this.dialogFormVisible = true;
				this.dialogForm = row;

				switch (this.dialogForm.payStatus) {
					case 0: {
						this.dialogForm.payStatus = "未付款";
					}
						break;
					case 1: {
						this.dialogForm.payStatus = "已付款";
					}
						break;
				}
				switch (this.dialogForm.orderStatus) {
					case 0: {
						this.dialogForm.orderStatus = "待支付";
					}
						break;
					case 1: {
						this.dialogForm.orderStatus = "学习中";
					}
						break;
					case 2: {
						this.dialogForm.orderStatus = "已完成";
					}
						break;
				}
			},
			handleSizeChange (val) {
				this.pageSize = val;
				//this.loadData();
			},
			handleCurrentChange (val) {
				this.pageNum = val;
				//this.loadData();
			},
			exportFile () {
				let url = "/doctor/doctorOrderOperator/exportExcel";
				let remForm = JSON.parse(JSON.stringify(this.form));
				delete remForm.pathL;
				exportExcel(url, remForm);
			},

			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.orderTimeB = this.$route.query.start;
					this.form.orderTimeE = this.$route.query.end;
					this.CreateTime = [ this.$route.query.start, this.$route.query.end ];
				}
				this.$refs.layout.getData();
			}
		},
		mounted () {
			this.initPage();
		}
	};
</script>

