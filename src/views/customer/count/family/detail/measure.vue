<template>
  <div class="measure" ref="measure">
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item,index in list" :key="index" :label="item" :name="item">
        <el-table
          :data="data"
          :height="700"
          border
          stripe
          style="width: 100%"
          v-loading="loading"
          element-loading-text="拼命加载中"
        >
          <!-- 血压 -->
          <el-table-column prop="measureTime" v-if="index===0" label="时间min" align="center"></el-table-column>
          <el-table-column prop="sbp" v-if="index===0" label="高压mmHg" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.sbp}}</span>
              <img v-if="getflagUpOrDown(scope.row.sbpDesc,true,'高')" src="./../images/redUp.png" alt>
              <img v-if="getflagUpOrDown(scope.row.sbpDesc,false,'低')" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column prop="dbp" v-if="index===0" label="低压mmHg" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.dbp}}</span>
              <img v-if="getflagUpOrDown(scope.row.dbpDesc,true,'高')" src="./../images/redUp.png" alt>
              <img v-if="getflagUpOrDown(scope.row.dbpDesc,false,'低')" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column prop="heartRate" v-if="index===0" label="心率bpm" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.heartRate}}</span>
              <img v-if="getflagUpOrDown(scope.row.heartRateDesc,true,'高')" src="./../images/redUp.png" alt>
              <img v-if="getflagUpOrDown(scope.row.heartRateDesc,false,'低')" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column v-if="index===0" label="脉压差mmHg" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.sbp-scope.row.dbp}}</p>
            </template>
          </el-table-column>
          <!-- 血糖 -->
          <el-table-column prop="measuringDate" v-if="index===1" label="测量时间" align="center"></el-table-column>
          <el-table-column prop="emptyStomach" v-if="index===1" label="空腹mmol/L" align="center">
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.esh" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="afterBreakfast"
            v-if="index===1"
            label="早餐后2小时mmol/L"
            align="center"
          >
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.abf" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="beforeLunch" v-if="index===1" label="午餐前mmol/L" align="center">
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.blh" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="afterLunch" v-if="index===1" label="午餐后2小时mmol/L" align="center">
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.alh" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="beforeDinner" v-if="index===1" label="晚餐前mmol/L" align="center">
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.bdr" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="afterDinner" v-if="index===1" label="晚餐后2小时mmol/L" align="center">
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.adr" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="beforeBed" v-if="index===1" label="睡前mmol/L" align="center">
            <template slot-scope="scope">
              <p v-for="item,index in scope.row.bbd" :key="index">
                <span>{{item.number}}</span>
                <img v-if="getflagUpOrDown(item.icon,true,'高')" src="./../images/redUp.png" alt>
                <img v-if="getflagUpOrDown(item.icon,false,'低')" src="./../images/greenDown.png" alt>
              </p>
            </template>
          </el-table-column>
          <!-- 体温 -->
          <el-table-column prop="centigrade" v-if="index===2" label="体温" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.centigrade}}°</span>
              <img v-if="getflagUpOrDown(scope.row.centigradeLevel,true,'热')" src="./../images/redUp.png" alt>
              <img
                v-if="getflagUpOrDown(scope.row.centigradeLevel,false,'体温偏低')"
                src="./../images/greenDown.png"
                alt
              >
            </template>
          </el-table-column>
          <el-table-column prop="measuringTime" v-if="index===2" label="测量时间" align="center"></el-table-column>
          <!-- 心电 -->
          <el-table-column prop="averageHeartRate" v-if="index===3" label="平均心率" align="center">
            <template slot-scope="scope">
              <p>
                {{scope.row.averageHeartRate}}次/分
                <span v-if="scope.row.heartRisk ==1">(正常)</span>
                <span v-if="scope.row.heartRisk ==2">(偏低)</span>
                <span v-if="scope.row.heartRisk ==3">(偏高)</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="measuringTime" v-if="index===3" label="测量时间" align="center"></el-table-column>
          <el-table-column v-if="index===3" label="查看心电图" align="center">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
          <!-- 血氧 -->
          <el-table-column prop="spo2" v-if="index===4" label="SpO2%" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.spo2}}%</span>
              <!-- <img v-if="scope.row.spo2Level.includes('高')" src="./../images/redUp.png" alt=""> -->
              <!-- <img v-if="scope.row.spo2Level.includes('低')" src="./../images/greenDown.png" alt=""> -->
            </template>
          </el-table-column>
          <el-table-column prop="bpm" v-if="index===4" label="BPM" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.bpm}}</span>
              <img v-if="getflagUpOrDown(scope.row.bpmLevel,true,'高')" src="./../images/redUp.png" alt>
              <img v-if="getflagUpOrDown(scope.row.bpmLevel,true,'低')" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column prop="spo2Level" v-if="index===4" label="血氧标准" align="center"></el-table-column>
          <el-table-column prop="measuringTime" v-if="index===4" label="测量时间" align="center"></el-table-column>
          <!-- 体脂 -->
          <el-table-column prop="weight" v-if="index===5" label="体重" align="center"></el-table-column>
          <el-table-column prop="bmi" v-if="index===5" label="BMI" align="center"></el-table-column>
          <el-table-column prop="analyzeFatType" v-if="index===5" label="BMI标准" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.analyzeFatType===-1">无测量数据</p>
              <p v-if="scope.row.analyzeFatType===1">偏瘦</p>
              <p v-if="scope.row.analyzeFatType===2">标准</p>
              <p v-if="scope.row.analyzeFatType===3">超重</p>
              <p v-if="scope.row.analyzeFatType===4">肥胖前期</p>
              <p v-if="scope.row.analyzeFatType===5">I度肥胖</p>
              <p v-if="scope.row.analyzeFatType===6">II度肥胖</p>
              <p v-if="scope.row.analyzeFatType===7">III度肥胖</p>
            </template>
          </el-table-column>
          <el-table-column prop="measuringTime" v-if="index===5" label="测量时间" align="center"></el-table-column>
          <el-table-column
            prop="c1"
            label="酮体"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c1 }}
              <img v-if="changeNumber(scope.row.c1)>0.5" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c1)<0" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column
            prop="c2"
            label="潜血"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c2 }}
              <img v-if="changeNumber(scope.row.c2)>10" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c2)<0" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column
            prop="c3"
            label="葡萄糖"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c3 }}
              <img v-if="changeNumber(scope.row.c3)>5" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c3)<0" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column
            prop="c4"
            label="白细胞"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c4 }}
              <img v-if="changeNumber(scope.row.c4)>15" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c4)<0" src="./../images/greenDown.png" alt>

            </template>
          </el-table-column>
          <el-table-column
            prop="c5"
            label="胆红素"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c5 }}
              <img v-if="changeNumber(scope.row.c5)>17" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c5)<0" src="./../images/greenDown.png" alt>

            </template>
          </el-table-column>
          <el-table-column
            prop="c6"
            label="蛋白质"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c6 }}
              <img v-if="changeNumber(scope.row.c6)>0.15" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c6)<0" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column
            prop="c7"
            label="亚硝酸盐"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c7 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="c8"
            label="抗坏血酸"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c8 }}
              <img v-if="changeNumber(scope.row.c8)>0.5" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c8)<0" src="./../images/greenDown.png" alt>

            </template>
          </el-table-column>
          <el-table-column
            prop="c9"
            label="尿胆原"
            align="center"
            v-if="index===6"
          >
            <template slot-scope="scope">
              {{ scope.row.c9 }}
              <img v-if="changeNumber(scope.row.c9)>16" src="./../images/redUp.png" alt>
              <img v-if="changeNumber(scope.row.c9)<0" src="./../images/greenDown.png" alt>
            </template>
          </el-table-column>
          <el-table-column
            prop="measuringTime"
            label="测量时间"
            align="center"
            v-if="index===6"
          >
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageLength"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!--心电图对话框-->
    <el-dialog
      title
      :visible.sync="dialogeVisible"
      width="40%"
      top="4vh"
      center
      :modal-append-to-body="false"
    >
      <div class="bigBox" v-loading="loadingXin" element-loading-text="拼命加载中">
        <div class="xidian">
          <p>走速:{{elecForm.ecgSpeed}}</p>
          <p>增益:{{elecForm.ecgGain}}</p>
        </div>
        <div class="xiPic">
          <!--<img v-if="elecForm.ecgImage == null || elecForm.ecgImage == ''" src="../../images/doctorPic.png" alt="">-->
          <img
            v-if="elecForm.ecgImage != null && elecForm.ecgImage !== ''"
            v-bind:src="elecForm.ecgImage"
          >
        </div>
        <div class="xiTitle">
          <h2>心电分析</h2>
        </div>
        <div class="xinOne offect">
          <p>
            记录开始时间：
            <span>{{elecForm.measuringTime}}</span>
          </p>
          <p>
            记录时长：
            <span>30s</span>
          </p>
        </div>
        <div class="offect">
          平均心率：
          <span class="colorFont">{{elecForm.averageHeartRate}}次/分</span>
        </div>
        <div class="xinTwo offect">
          <p>
            节律正常范围：
            <span>{{elecForm.rhythmNormal}}%</span>
          </p>
          <p>
            疑似心率不齐或早搏：
            <span>{{elecForm.heartRateAbnormal}}%</span>
          </p>
          <p>
            疑似心房颤动或早搏：
            <span>{{elecForm.atriumAbnormal}}%</span>
          </p>
        </div>
        <div style="width:100%;border-bottom: 1px solid #e3e3e3"></div>
        <div class="xinThree offect">
          <p>
            心率正常范围：
            <span>{{elecForm.heartRateNormal}}%</span>
          </p>
          <p>
            稍快稍慢：
            <span>{{elecForm.heartRateSlightly}}%</span>
          </p>
          <p>
            过快过慢：
            <span>{{elecForm.heartRateExceed}}%</span>
          </p>
        </div>
        <div style="width:100%;border-bottom: 1px solid #e3e3e3"></div>
        <div class="offect status">
          <p v-if="elecForm.heartRisk ==1">
            心脏节律异常风险······
            <span style="padding-right: 20px;color: #6590FF;">正常</span>您的心脏节律异常风险低。请您继续保持良好的生活习惯：清淡饮食、适量运动、保证睡眠、戒烟限酒。少量的异常节律可以是心律不齐或者早搏、干扰引起，请您咨询医师或专业人员。定期和随时监测，有助您提早发现心脏风险。
          </p>
          <p v-if="elecForm.heartRisk ==2">
            心脏节律异常风险······
            <span style="padding-right: 20px;color:#FFAB2B">偏低</span>如您多次在静止、无干扰的状态下测量，异常节律仍高于10%，为了您的健康，请您咨询医师或专业人员。异常节律可以是心律不齐或者早搏、干扰引起，请您咨询医师或专业人员。请您定期或随时监测，跟踪心脏健康风险。
          </p>
          <p v-if="elecForm.heartRisk ==3">
            心脏节律异常风险······
            <span style="padding-right: 20px;color: #FF5F5F">偏高</span>如您多次在静止、无干扰的状态下测量，异常节律仍高于20%，提示您的心脏可能存在心律失常风险，建议您尽快咨询医师或专业人员。请您定期和随时监测，跟踪心脏健康风险。
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingXin: false, //心电弹框
      //心电图内容
      elecForm: {
        ecgSpeed: "", //走速
        ecgGain: "", //增益
        ecgImage: "", //图片
        measuringTime: "", //记录时间
        averageHeartRate: "", //平均心率
        heartRateSlightly: "", //节律正常范围
        heartRateNormal: "", //疑似心率不齐或早搏
        rhythmNormal: "", //节律正常范围
        heartRateAbnormal: "", //疑似心率不齐或早搏
        atriumAbnormal: "", //疑似心房颤动或早搏
        heartRateExceed: "", //过快过慢
        heartRisk: "" //正常、偏低、偏高
      },
      dialogeVisible: false, //查看对话框
      activeName: this.$route.query.active || "血压数据",
      list: [
        "血压数据",
        "血糖数据",
        "体温数据",
        "心电数据",
        "血氧数据",
        "体脂数据",
        "尿检数据",
      ],
      loading: false,
      data: [
        {
          averageHeartRate: "20~30",
          measuringTime: "2018 12-25"
        }
      ],
      index: "0",
      pageSize: 15,
      pageLength: 0,
      pageNum: 1,
      memberId: this.$route.query.id
    };
  },
  created() {
    this.getData("/health/bloodPressure/getBloodPresureHis", "0");
    if (this.$route.query.active) {
      const active = this.$route.query.active;
      switch (active) {
        case "血压数据":
          this.getData("/health/bloodPressure/getBloodPresureHis", "0");
          break;
        case "血糖数据":
          this.getData("/health/bloodSugar/queryAllBloodSugarNew", "1");
          break;
        case "体温数据":
          this.getData("/health/bodyTemperature/queryListByUserId", "2");
          break;
        case "心电数据":
          this.getData("/health/electrocardio/getEcgList", "3");
          break;
        case "血氧数据":
          this.getData("/health/bloodOxygen/queryListByUserId", "4");
          break;
        case "体脂数据":
          this.getTiz();
          break;
        case "尿检数据":
          this.getData('/health/urinalysis/details','1');
          break;
      }
    }
  },
  methods: {
		changeNumber (number) {
			if(number){
				return number.replace(/[^\d.]/g, '');
      }
		},
    getflagUpOrDown(str,fg,val){
			if(str){
				return str.includes(val)
      }
    },
    //心电查看
    view(row) {
      this.dialogeVisible = true;
      this.loadingXin = true;
      this.$get("/data/my", {
        pathL: "/health/electrocardio/getEcgSingle",
        heartRisk:
          row.heartRisk == 1 ? "正常" : row.heartRisk == 2 ? "偏低" : "偏高",
        id: row.id
      }).then(res => {
        this.loadingXin = false;
        if (res.state === 0) {
          // console.log(res.data);
          this.elecForm = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // tab切换
    handleClick(tab) {
      this.pageNum = 1;
      this.index = tab.index;
      switch (tab.index) {
        case "0":
          this.getData("/health/bloodPressure/getBloodPresureHis", "0");
          break;
        case "1":
          this.getData("/health/bloodSugar/queryAllBloodSugarNew", "1");
          break;
        case "2":
          this.getData("/health/bodyTemperature/queryListByUserId", "2");
          break;
        case "3":
          this.getData("/health/electrocardio/getEcgList", "3");
          break;
        case "4":
          this.getData("/health/bloodOxygen/queryListByUserId", "4");
          break;
        case "5":
          this.getTiz();
          break;
				case "6":
					this.getData('/health/urinalysis/details','6');
					break;
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      switch (this.index) {
        case "0":
          this.getData("/health/bloodPressure/getBloodPresureHis", "0");
          break;
        case "1":
          this.getData("/health/bloodSugar/queryAllBloodSugarNew", "1");
          break;
        case "2":
          this.getData("/health/bodyTemperature/queryListByUserId", "2");
          break;
        case "3":
          this.getData("/health/electrocardio/getEcgList", "3");
          break;
        case "4":
          this.getData("/health/bloodOxygen/queryListByUserId", "4");
          break;
        case "5":
          this.getTiz();
          break;
      }
    },
    // get获取信息
    getData(pathL, index) {
      let data = {};
      switch (index) {
        case "0":
        case "2":
        case "4":
          data = {
            pathL,
            memberId: this.memberId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          };
          break;
        case "3":
        case "1":
				case "6":
          data = {
            pathL,
            userId: this.memberId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          };
          break;
      }
      this.loading = true;
      this.$get("/data/my", data).then(res => {
        this.loading = false;
        if (res.state === 0) {
          if (index === "1") {
            let list = res.data.result;
            let change = val => val.split(",");
            for (let i = 0; i < list.length; i++) {
              list[i].emptyStomach = change(list[i].emptyStomach);
              list[i].emptyStomachLevel = change(list[i].emptyStomachLevel);
              list[i].afterBreakfast = change(list[i].afterBreakfast);
              list[i].afterBreakfastLevel = change(list[i].afterBreakfastLevel);
              list[i].beforeLunch = change(list[i].beforeLunch);
              list[i].beforeLunchLevel = change(list[i].beforeLunchLevel);
              list[i].afterLunch = change(list[i].afterLunch);
              list[i].afterLunchLevel = change(list[i].afterLunchLevel);
              list[i].beforeDinner = change(list[i].beforeDinner);
              list[i].beforeDinnerLevel = change(list[i].beforeDinnerLevel);
              list[i].afterDinner = change(list[i].afterDinner);
              list[i].afterDinnerLevel = change(list[i].afterDinnerLevel);
              list[i].beforeBed = change(list[i].beforeBed);
              list[i].beforeBedLevel = change(list[i].beforeBedLevel);
              list[i].esh = [];
              list[i].abf = [];
              list[i].blh = [];
              list[i].alh = [];
              list[i].bdr = [];
              list[i].adr = [];
              list[i].bbd = [];
              for (let j = 0; j < list[i].emptyStomach.length; j++) {
                list[i].esh.push({
                  number: list[i].emptyStomach[j],
                  icon: list[i].emptyStomachLevel[j]
                });
              }
              for (let j = 0; j < list[i].afterBreakfast.length; j++) {
                list[i].abf.push({
                  number: list[i].afterBreakfast[j],
                  icon: list[i].afterBreakfastLevel[j]
                });
              }
              for (let j = 0; j < list[i].beforeLunch.length; j++) {
                list[i].blh.push({
                  number: list[i].beforeLunch[j],
                  icon: list[i].beforeLunchLevel[j]
                });
              }
              for (let j = 0; j < list[i].afterLunch.length; j++) {
                list[i].alh.push({
                  number: list[i].afterLunch[j],
                  icon: list[i].afterLunchLevel[j]
                });
              }
              for (let j = 0; j < list[i].beforeDinner.length; j++) {
                list[i].bdr.push({
                  number: list[i].beforeDinner[j],
                  icon: list[i].beforeDinnerLevel[j]
                });
              }
              for (let j = 0; j < list[i].afterDinner.length; j++) {
                list[i].adr.push({
                  number: list[i].afterDinner[j],
                  icon: list[i].afterDinnerLevel[j]
                });
              }
              for (let j = 0; j < list[i].beforeBed.length; j++) {
                list[i].bbd.push({
                  number: list[i].beforeBed[j],
                  icon: list[i].beforeBedLevel[j]
                });
              }
            }
            this.data = list;
            this.pageLength = res.data.total;
          }
          else if(index==6){
						this.data = res.data.result.list;
						this.pageLength = res.data.total;
          }
					else {
						this.data = res.data.result;
						this.pageLength = res.data.total;
					}
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 体脂
    getTiz() {
      this.loading = true;
      this.$post("/data/my", {
        pathL: "/health/bodyFatRate/history",
        memberId: this.memberId,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.data = [
            ...(res.data.result.today === undefined
              ? []
              : res.data.result.today),
            ...(res.data.result.yesterday === undefined
              ? []
              : res.data.result.yesterday),
            ...(res.data.result.earlier === undefined
              ? []
              : res.data.result.earlier)
          ];
          this.pageLength = res.data.total;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.measure {
  width: 100%;
  height: 100%;
}
.status p {
  line-height: 30px;
}
.status p span {
  font-size: 20px;
}
.colorFont {
  color: #6590ff;
  font-size: 20px;
}
.offect {
  margin: 15px 0;
}
.bigBox div {
  font-size: 15px;
  font-weight: bolder;
}
.xinOne,
.xinTwo,
.xinThree {
  display: flex;
  justify-content: space-between;
}
.xiTitle {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.xidian {
  display: flex;
  justify-content: space-between;
  color: #9c9c9c;
}
.xiPic {
  width: 100%;
  height: 250px;
}
.xiPic img {
  width: 100%;
  height: 100%;
}

.pagination {
  width: 100%;
  height: 40px;
  background: #fff;
  box-sizing: border-box;
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
  z-index: 200;
  align-items: center;
}
</style>
