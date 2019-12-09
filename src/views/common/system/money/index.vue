<template>
  <div class="money" v-loading="loading" element-loading-text="拼命加载中">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分成比例设置</span>
      </div>
      <div>
        <el-form
          ref="platformShare"
          size="small"
          :rules="platformShareRules"
          :model="platformShare"
          label-width="180px"
        >
          <el-form-item label="分成比例" prop="value">
            <div class="platformShare">
              <el-input
                style="width:250px"
                v-model.number="platformShare.value"
                placeholder="请输入分成比例，n%的样式"
              ></el-input>
              <span style="margin-left:10px;">%</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100px;" @click="submit('platformShare')" type="primary">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>提现日期设置（以每月作为循环周期）</span>
      </div>
      <div>
        <el-form ref="withdrawTime" size="small" :model="withdrawTime" label-width="180px">
          <el-form-item label="开始日期">
            <el-select style="width:250px" v-model.number="withdrawTime.start" placeholder="请选择">
              <el-option v-for="item in date" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-select style="width:250px" v-model.number="withdrawTime.end" placeholder="请选择">
              <el-option v-for="item in date" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100px;" @click="submit('withdrawTime')" type="primary">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>提现金额设置</span>
      </div>
      <div>
        <el-form
          ref="withdrawAmount"
          :rules="withdrawAmountRules"
          size="small"
          :model="withdrawAmount"
          label-width="180px"
        >
          <el-form-item label="最小提现金额" prop="min">
            <el-input style="width:250px" v-model="withdrawAmount.min" placeholder="请输入最小提现金额（正整数）"></el-input>
          </el-form-item>
          <el-form-item label="最大提现金额" prop="max">
            <el-input style="width:250px" v-model="withdrawAmount.max" placeholder="请输入最大提现金额（正整数）"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100px;" @click="submit('withdrawAmount')" type="primary">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>提现短信设置</span>
      </div>
      <div>
        <el-form
          ref="doctorWithdrawSIMSend"
          :rules="tipsRules"
          size="small"
          :model="tips"
          label-width="180px"
        >
          <el-form-item label="大于等于此金额提醒" prop="money">
            <el-input style="width:250px" v-model="tips.money" placeholder="请输入大于最小提现金额的数字"></el-input>
          </el-form-item>

          <el-form-item label="提醒时间(每月循环）" required>
            <el-col :span="10">
              <el-form-item prop="day">
                <el-select v-model="tips.day" placeholder="天">
                  <el-option v-for="item in timelimit" :key="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="time">
                <el-time-select
                  style="width:133px"
                  v-model="tips.time"
                  :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:00'
                  }"
                  placeholder="时间"
                ></el-time-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="是否开启提醒" prop="max">
            <el-switch
              v-model="tips.open"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width:100px;"
              @click="submit('doctorWithdrawSIMSend')"
              type="primary"
            >提 交
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
	import {
		isValidScore,
		isValidNumber,
		isValidPrice,
		isValidFrequency,
		isValidMonth
	} from "@/utils/RegExp";

	let CheckScore = (rule, value, callback) => {
		if (value === "") {
			callback();
		}
		else if (!isValidScore(value)) {
			callback(new Error("请输入正确的分成比例"));
		}
		else {
			callback();
		}
	};
	let CheckNumber = (rule, value, callback) => {
		if (value === "") {
			callback(new Error("请输入提现金额"));
		}
		else if (!isValidNumber(value)) {
			callback(new Error("提现金额必须为正整数"));
		}
		else {
			callback();
		}
	};

	let CheckPrice = (rule, value, callback) => {
		console.log(callback);
		if (value === "") {
			callback(new Error("请输入提醒金额"));
		}
		else if (!isValidPrice(value)) {
			callback(new Error("提醒金额要大于最小提现金额"));
		}
		else {
			callback();
		}
	};

	let CheckMonthNumber = (rule, value, callback) => {
		if (value === "") {
			callback(new Error("请输入提醒金额"));
		}
		else if (!isValidMonth(value)) {
			callback(new Error("提醒金额必须为1~31"));
		}
		else {
			callback();
		}
	};

	export default {
		data () {
			return {
				loading: false,
				platformShare: {
					value: ""
				},
				platformShareRules: {
					value: [
						{
							required: true,
							validator: CheckScore,
							trigger: "blur"
						}
					]
				},
				timelimit: 31,
				tips: {
					money: "",
					time: "",
					day: "",
					open: false
				},
				withdrawTime: {
					start: "",
					end: ""
				},
				withdrawAmount: {
					min: "",
					max: ""
				},
				withdrawAmountRules: {
					min: [
						{
							required: true,
							validator: CheckNumber,
							trigger: "blur"
						}
					],
					max: [
						{
							required: true,
							validator: CheckNumber,
							trigger: "blur"
						}
					]
				},
				tipsRules: {
					money: [
						{
							required: true,
							validator: CheckPrice,
							trigger: "blur",
							message: "提醒金额要大于最小提现金额"
						}
					],
					time: [
						{
							required: true,
							trigger: "blur",
							message: "提醒日期不能为空"
						}
					],
					day: [
						{
							required: true,
							trigger: "blur",
							message: "提醒时间不能为空"
						}
					]
				},
				date: Array.from({length: 31}, (_, index) => index + 1)
			};
		},
		methods: {
			// 获取数据
			getData () {
				let that = this;
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/common/systemParam/queryBaseParams"
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						const list = res.data;
						for (let i in list) {
							switch (list[ i ].paramKey) {
								case "platformShare":
									this.platformShare.value = list[ i ].paramValue;
									break;
								case "withdrawTime":
									let withdrawTime = list[ i ].paramValue.split(",");
									this.withdrawTime.start = withdrawTime[ 0 ];
									this.withdrawTime.end = withdrawTime[ 1 ];
									break;
								case "withdrawAmount":
									let withdrawAmount = list[ i ].paramValue.split(",");
									this.withdrawAmount.min = withdrawAmount[ 0 ];
									this.withdrawAmount.max = withdrawAmount[ 1 ];
									break;
								case "doctorWithdrawSIMSend":
									let doctorWithdrawSIMSend = list[ i ].paramValue.split(",");
									that.tips.open = doctorWithdrawSIMSend[ 0 ] == 0 ? false : true;
									that.tips.money = doctorWithdrawSIMSend[ 1 ] || "";
									that.tips.day = doctorWithdrawSIMSend[ 2 ] || "";
									that.tips.time = doctorWithdrawSIMSend[ 3 ] || "";
									break;
							}
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
			// 提交表单
			submit (type) {
				let paramValue = "";
				let isWithdrawTime = true;
				let isWithdrawAmount = true;
				let isMesgTips = true;

				switch (type) {
					case "platformShare":
						paramValue = this.platformShare.value;
						if (paramValue == '') {
							this.$message("请设置分成比例");
							return;
						}
						break;
					case "withdrawTime":
						if (this.withdrawTime.start == '') {
							this.$message("请设置开始时间");
							return;
						}
						if (this.withdrawTime.end == '') {
							this.$message("请设置结束时间");
							return;
						}
						paramValue = this.withdrawTime.start + "," + this.withdrawTime.end;
						if (
							parseInt(this.withdrawTime.start) > parseInt(this.withdrawTime.end)
						) {
							isWithdrawTime = false;
						}
						break;
					case "withdrawAmount":

						if (this.withdrawAmount.min == '') {
							this.$message("请设置最小提现金额");
							return;
						}
						if (this.withdrawAmount.max == '') {
							this.$message("请设置最大提现金额");
							return;
						}
						paramValue = this.withdrawAmount.min + "," + this.withdrawAmount.max;
						if (
							parseInt(this.withdrawAmount.min) >
							parseInt(this.withdrawAmount.max)
						) {
							isWithdrawAmount = false;
						}
						break;
					case "doctorWithdrawSIMSend": {
						let openStatus = this.tips.open ? "1" : "0";
						if (this.tips.money == '') {
							this.$message("请设置提醒金额");
							return;
						}
						if (this.tips.day == '') {
							this.$message("请设置提醒日期");
							return;
						}
						if (this.tips.time == '') {
							this.$message("请设置提醒时间");
							return;
						}

						paramValue =
							openStatus +
							"," +
							this.tips.money +
							"," +
							this.tips.day +
							"," +
							this.tips.time;
						if (
							this.tips.money === "" ||
							this.tips.day === "" ||
							this.tips.time === "" || this.tips.money <= parseInt(this.withdrawAmount.min)
						) {
							isMesgTips = false;
						}
					}
						break;
				}
				this.$refs[ type ].validate(valid => {
					if (valid) {
						if (isWithdrawTime) {
							if (isWithdrawAmount) {
								if (isMesgTips) {
									this.$post("/data/my", {
										pathL: "/common/systemParam/saveValueByKey",
										paramKey: type,
										paramValue
									}).then(res => {
										if (res.state === 0) {
											this.changeStatus(); // 开启服务
											this.getData();
											this.$message({
												type: "success",
												message: "设置成功",
												center: true
											});
										}
										else {
											this.$message({
												message: res.msg,
												center: true
											});
										}
									});
								}
								else {
									this.$message({
										message: "提醒金额要大于最小提现金额",
										type: "warning",
										center: true
									});
								}
							}
							else {
								this.$message({
									message: "最大提现金额要大于等于最小提现金额",
									type: "warning",
									center: true
								});
							}
						}
						else {
							this.$message({
								message: "结束日期要大于等于开始日期",
								type: "warning",
								center: true
							});
						}
					}
					else {
						this.$message({
							message: "请填写正确的表单信息",
							center: true
						});
					}
				});
			},
			messagePop (mesg) {
				this.$message({
					type: "success",
					message: mesg,
					center: true
				});
			},
			siteTip () {
				let msg = "";
				if (this.tips.money === "") {
					msg = "请设置提醒金额！";
					this.messagePop(msg);
					return false;
				}
				if (this.tips.day === "") {
					msg = "请设置提醒日期！";
					this.messagePop(msg);
					return false;
				}
				if (this.tips.time === "") {
					msg = "请设置提醒时间！";
					this.messagePop(msg);
					return false;
				}
				return true;
			},
			// 设置提现的开启和关闭状态
			changeStatus () {
				if (!this.siteTip()) {
					return;
				}
				let strHour = this.tips.time.split(":");
				this.$post("/data/my", {
					pathL: "/doctor/common/sendSimJobStatus",
					status: this.tips.open ? 1 : 0,
					hour: strHour[ 0 ],
					minute: strHour[ 1 ],
					day: this.tips.day,
					canAmount: this.tips.money
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							type: "success",
							message: "设置成功！",
							center: true
						});
					}
					else {
						this.$message({
							message: "设置失败！",
							center: true
						});
					}
				});
			}
		},
		mounted () {
			this.getData();
		}
	};
</script>

<style scoped>
  .money {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .box-card {
    width: 500px;
    margin: 20px;
  }

  .platformShare {
    display: flex;
  }
</style>
