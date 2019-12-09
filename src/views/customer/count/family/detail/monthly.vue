<template>
  <div class="monthly">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="1" class="text-right" >
            <span style="line-height: 30px;">年：</span>
          </el-col>
          <el-col :span="23">
            <el-select size="mini" v-model="year" @change="change(year, month)">
              <el-option v-for="item in yearList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="m-t-20">
          <el-col :span="1" class="text-right">
            <span style="line-height: 30px;">月：</span>
          </el-col>
          <el-col :span="23">
            <el-select size="mini" v-model="month" @change="change(year, month)">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

      </div>
      <div class="show" v-loading="loading" element-loading-text="拼命加载中">
        <el-card shadow="hover" style="margin:20px 0;" v-if="dataNone">
          <p style="text-align:center;">暂无数据！</p>
        </el-card>
        <el-card shadow="hover" style="margin:20px 0;" v-if="advice!==0">
          <p style="text-align:center;">{{advice}}</p>
          <p style="text-align:center;">{{advice1}}</p>
        </el-card>
        <el-card shadow="hover" style="margin:20px 0;" v-if="pressureResult!==0">
          <div slot="header" class="clearfix">
            <h3>本月血压分析</h3>
          </div>
          <h4>1，测量次数</h4>
          <p>
            <span>本月一共进行了</span>
            <span>{{pressureResult.measurement.count}}</span>
            <span>次血压测量，</span>
            <span>{{pressureResult.measurement.toHigh}}</span>
            <span>次血压属于“偏高血压”，</span>
            <span>{{pressureResult.measurement.normal}}</span>
            <span>次血压属于“正常血压”。</span>
            <span>{{pressureResult.measurement.advice}}</span>
          </p>
          <h4>2，血压趋势</h4>
          <div class="xueya">
            <div class="left">
              <p>本月最高值：</p>
              <p>
                <span>高压</span>
                <span>{{pressureResult.trend.trend.sbpHighBloodPressure.sbp}}mmHg</span>
                <span>
                  {{pressureResult.trend.trend.sbpHighBloodPressure.addTime.monthValue}}-{{pressureResult.trend.trend.sbpHighBloodPressure.addTime.dayOfMonth}} {{pressureResult.trend.trend.sbpHighBloodPressure.addTime.hour}}:{{pressureResult.trend.trend.sbpHighBloodPressure.addTime.minute}}
                </span>
              </p>
              <p>
                <span>低压</span>
                <span>{{pressureResult.trend.trend.dbpHighBloodPressure.dbp}}mmHg</span>
                <span>
                  {{pressureResult.trend.trend.dbpHighBloodPressure.addTime.monthValue}}-{{pressureResult.trend.trend.dbpHighBloodPressure.addTime.dayOfMonth}} {{pressureResult.trend.trend.dbpHighBloodPressure.addTime.hour}}:{{pressureResult.trend.trend.dbpHighBloodPressure.addTime.minute}}
                </span>
              </p>
            </div>
            <div class="right">
              <p>本月最低值：</p>
              <p>
                <span>高压</span>
                <span>{{pressureResult.trend.trend.sbpLowBloodPressure.sbp}}mmHg</span>
                <span>
                  {{pressureResult.trend.trend.sbpLowBloodPressure.addTime.monthValue}}-{{pressureResult.trend.trend.sbpLowBloodPressure.addTime.dayOfMonth}} {{pressureResult.trend.trend.sbpLowBloodPressure.addTime.hour}}:{{pressureResult.trend.trend.sbpLowBloodPressure.addTime.minute}}
                </span>
              </p>
              <p>
                <span>低压</span>
                <span>{{pressureResult.trend.trend.dbpLowBloodPressure.dbp}}mmHg</span>
                <span>
                  {{pressureResult.trend.trend.dbpLowBloodPressure.addTime.monthValue}}-{{pressureResult.trend.trend.dbpLowBloodPressure.addTime.dayOfMonth}} {{pressureResult.trend.trend.dbpLowBloodPressure.addTime.hour}}:{{pressureResult.trend.trend.dbpLowBloodPressure.addTime.minute}}
                </span>
              </p>
            </div>
          </div>
          <h4>3，脉压差</h4>
          <p>{{pressureResult.pulse.advice}}</p>
        </el-card>
        <el-card shadow="hover" style="margin:20px 0;" v-if="sugarList!==0">
          <div slot="header" class="clearfix">
            <h3>本月血糖分析</h3>
          </div>
          <p>您本月共测量血糖{{sugarList.totalTimes}}次,其中：</p>
          <p v-for="item,index in sugarList.advice" :key="index">{{index+1+'.'+item}}</p>
        </el-card>
      </div>
    </el-card>
    <el-button style="width:100px;display:block;margin:20px auto;" @click="$router.go(-1)" size="mini" type="primary">返
      回
    </el-button>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				loading: true,
				year: new Date().getFullYear(),
				month: new Date().getMonth(),
				memberId: this.$route.query.id,
				dataNone: false,
				advice: 0,
				advice1: 0,
				sugarList: 0,
				pressureResult: 0,
				yearList: Array.from(
					{length: new Date().getFullYear() - 2017 + 1},
					(_, index) => index + 2017
				),
				monthList: Array.from(
					{length: 12},
					(_, index) => index + 1
				)
			};
		},
		methods: {
			// 获取月报
			getData () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/health/healthReport/getReportByYearAndMonth",
					year: this.year,
					month: this.month,
					memberId: this.memberId
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						if (res.data === null) {
							this.dataNone = true;
							this.advice = 0;
							this.pressureResult = 0;
							this.sugarList = 0;
						}
						else {
							this.dataNone = false;
							let list = JSON.parse(res.data.report);
							this.sugarList =
								list.sugarResult === undefined ? 0 : list.sugarResult;
							this.pressureResult =
								list.pressureResult === undefined ? 0 : list.pressureResult;
							this.advice = list.advice === undefined ? 0 : list.advice;
							this.advice1 = list.advice1 === undefined ? 0 : list.advice1;
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
			change (year, month) {
				this.getData();
			}
		},
		created () {
			this.getData();
		}
	};
</script>

<style scoped>
  .show p {
    margin: 20px 0;
  }

  .xueya {
    display: flex;
  }

  .xueya span {
    margin: 0 10px;
  }

  .left,
  .right {
    flex: 1;
  }
</style>
