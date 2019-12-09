<template>
  <div class="health" style="margin: 10px;">
    <!-- 健康信息 -->
    <el-card class="work-order-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>健康信息</span>
      </div>
      <el-form
              ref="form"
              size="mini"
              label-width="110px"
              label-suffix="："
              v-loading="healthLoading"
      >
        <el-form-item label="身高">
          <span>{{useHeight}}</span>
        </el-form-item>
        <el-form-item label="体重">
          <span>{{useWeight}}</span>
        </el-form-item>
        <el-form-item label="腰围">
          <span>{{useWaistline}}</span>
        </el-form-item>
        <el-form-item label="是否吸烟">
          <span>{{customSmoke}}</span>
        </el-form-item>
        <el-form-item label="是否饮酒">
          <span>{{customsDrink}}</span>
        </el-form-item>
        <el-form-item label="睡眠情况">
          <span>{{customInsomnia}}</span>
        </el-form-item>
        <el-form-item label="是否每日摄入过多油脂，高钠盐类食物">
          <span>{{toofull}}</span>
        </el-form-item>
        <el-form-item label="是否长期精神紧张">
          <span>{{tooOil}}</span>
        </el-form-item>
        <el-form-item label="服药情况">
          <span>{{takeMedicine}}</span>
        </el-form-item>
        <el-form-item label="运动水平">
          <span>{{customSports}}</span>
        </el-form-item>
        <el-form-item label="症状描述">
          <span>--</span>
        </el-form-item>
        <el-form-item label="过敏史">
          <span>{{allergyInfor}}</span>
        </el-form-item>
        <el-form-item label="生育史">
          <span>{{produceHistory}}</span>
        </el-form-item>
        <el-form-item label="家族史">
          <span>{{familyHistory}}</span>
        </el-form-item>
        <el-form-item label="既往史">
          <span>{{medicalHistory}}</span>
        </el-form-item>
        <el-form-item label="血压数据">
          <el-button type="primary" @click="handleHealthInfo('血压数据')">查 看</el-button>
        </el-form-item>
        <el-form-item label="血糖数据">
          <el-button type="primary" @click="handleHealthInfo('血糖数据')">查 看</el-button>
        </el-form-item>
        <el-form-item label="体温数据">
          <el-button type="primary" @click="handleHealthInfo('体温数据')">查 看</el-button>
        </el-form-item>
        <el-form-item label="血氧数据">
          <el-button type="primary" @click="handleHealthInfo('血氧数据')">查 看</el-button>
        </el-form-item>
        <el-form-item label="心电数据">
          <el-button type="primary" @click="handleHealthInfo('心电数据')">查 看</el-button>
        </el-form-item>
        <el-form-item label="体脂数据">
          <el-button type="primary" @click="handleHealthInfo('体脂数据')">查 看</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 健康服务数据 -->
    <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="70%"
            :append-to-body="true"
    >
      <el-table :data="tableData" border style="width: 100%" height="300" v-loading="loading">
        <!-- 血压 -->
        <el-table-column prop="date" label="收缩压" align="center" v-if="dialogTitle ==='血压数据'">
          <template slot-scope="scope">{{ scope.row.sbp +' mmHg '}}</template>
        </el-table-column>
        <el-table-column prop="date" label="舒张压" align="center" v-if="dialogTitle ==='血压数据'">
          <template slot-scope="scope">{{ scope.row.dbp +' mmHg '}}</template>
        </el-table-column>
        <el-table-column prop="date" label="心率" align="center" v-if="dialogTitle ==='血压数据'">
          <template slot-scope="scope">{{ scope.row.heartRate +' bpm '}}</template>
        </el-table-column>
        <el-table-column prop="measureTime" label="测量时间" align="center" v-if="dialogTitle ==='血压数据'">
          <template slot-scope="scope">{{ scope.row.measureTime }}</template>
        </el-table-column>
        <!-- 血糖 -->
        <el-table-column prop="date" label="时段" align="center" v-if="dialogTitle ==='血糖数据'">
          <template slot-scope="scope">
            <p v-if="scope.row.timePeriod===1">空腹</p>
            <p v-if="scope.row.timePeriod===2">早餐后两小时</p>
            <p v-if="scope.row.timePeriod===3">午餐前</p>
            <p v-if="scope.row.timePeriod===4">午餐后两小时</p>
            <p v-if="scope.row.timePeriod===5">晚餐前</p>
            <p v-if="scope.row.timePeriod===6">晚餐后两小时</p>
            <p v-if="scope.row.timePeriod===7">睡前</p>
            <p v-if="scope.row.timePeriod===-1">随机血糖</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="血糖值" align="center" v-if="dialogTitle ==='血糖数据'">
          <template slot-scope="scope">
            <span>{{scope.row.mmol+' mmol/L'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="血糖标准" align="center" v-if="dialogTitle ==='血糖数据'">
          <template slot-scope="scope">
            <span>{{scope.row.sugarLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeResult" label="测量时间" align="center" v-if="dialogTitle ==='血糖数据'">
          <template slot-scope="scope">{{ scope.row.timeResult }}</template>
        </el-table-column>
        <!-- 体温 -->
        <el-table-column prop="date" label="体温" align="center" v-if="dialogTitle ==='体温数据'">
          <template slot-scope="scope">
            <span>{{scope.row.centigrade}}°</span>
          </template>
        </el-table-column>
        <el-table-column prop="measuringTime" label="测量时间" align="center" v-if="dialogTitle ==='体温数据'">
          <template slot-scope="scope">{{ scope.row.measuringTime }}</template>
        </el-table-column>
        <!-- 血氧 -->
        <el-table-column prop="date" label="SpO2%" align="center" v-if="dialogTitle ==='血氧数据'">
          <template slot-scope="scope">
            <span>{{scope.row.spo2}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="BPM" align="center" v-if="dialogTitle ==='血氧数据'">
          <template slot-scope="scope">
            <span>{{scope.row.bpm}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spo2Level" label="血氧标准" align="center" v-if="dialogTitle ==='血氧数据'">
          <template slot-scope="scope">{{ scope.row.spo2Level }}</template>
        </el-table-column>
        <el-table-column
                prop="measuringTime"
                label="测量时间"
                align="center"
                v-if="dialogTitle ==='血氧数据'"
        >
          <template slot-scope="scope">{{ scope.row.measuringTime }}</template>
        </el-table-column>
        <!-- 心电 -->
        <el-table-column prop="date" label="平均心率" align="center" v-if="dialogTitle ==='心电数据'">
          <template slot-scope="scope">
            <p>
              {{scope.row.averageHeartRate + '次/分'}}
              <span v-if="scope.row.heartRisk ==1">(正常)</span>
              <span v-if="scope.row.heartRisk ==2">(偏低)</span>
              <span v-if="scope.row.heartRisk ==3">(偏高)</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
                prop="measuringTime"
                label="测量时间"
                align="center"
                v-if="dialogTitle ==='心电数据'"
        >
          <template slot-scope="scope">{{ scope.row.measuringTime }}</template>
        </el-table-column>
        <!-- 体脂 -->
        <el-table-column prop="weight" label="体重" align="center" v-if="dialogTitle ==='体脂数据'">
          <template slot-scope="scope">{{ scope.row.weight }}</template>
        </el-table-column>
        <el-table-column prop="bmi" label="BMI" align="center" v-if="dialogTitle ==='体脂数据'">
          <template slot-scope="scope">{{ scope.row.bmi }}</template>
        </el-table-column>
        <el-table-column prop="date" label="BMI标准" align="center" v-if="dialogTitle ==='体脂数据'">
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
        <el-table-column
                prop="measuringTime"
                label="测量时间"
                align="center"
                v-if="dialogTitle ==='体脂数据'"
        >
          <template slot-scope="scope">{{ scope.row.measuringTime }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
   export default {
      name: "health",
      props: {
         phone: String
      },
      data() {
         return {
            tableData: [],
            useHeight: "--", //身高
            useWeight: "--", //体重
            useWaistline: "--", //腰围
            customSmoke: "--", //吸烟
            customsDrink: "--", //饮酒
            customInsomnia: "--", //睡眠
            toofull: "--", //是否每日摄入过多油脂？
            tooOil: "--", //是否长期精神紧张？
            takeMedicine: "--", //服药情况
            customSports: "--", //是否常运动？
            // --针状描述---
            allergyInfor: "--", //过敏史
            produceHistory: "--", //生育史
            familyHistory: "--", //家族史
            medicalHistory: "--", //既往病史
            dialogTitle: "",
            dialogVisible: false,
            userId: null,
            loading: true,
            healthLoading: false
         };
      },
      // created() {
      //    const phone = this.phone;
      //    this.getId(phone);
      // },
      watch: {
         phone: {
            handler(now) {
               this.getId(now);
            },
            immediate: true
         }
         // phone(now) {
         //    this.getId(now);
         // }
      },
      methods: {
         // 获取ID
         getId(phone) {
            this.healthLoading = true;
            this.$get("/data/my", {
               pathL: "/customer/workOrder/getMemberIdByPhone",
               phone
            }).then(res => {
               if (res.state === 0) {
                  this.queryListHealth(res.data.id);
                  this.userId = res.data.id;
               } else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            });
         },
         // 查看健康数据
         handleHealthInfo(item) {
            this.dialogVisible = true;
            this.dialogTitle = item;
            switch (item) {
               case "血压数据":
                  this.getTableData(
                     "/health/bloodPressure/queryAllPressureByUserId",
                     "userId"
                  );
                  break;
               case "血糖数据":
                  this.getTableData(
                     "/health/bloodSugar/queryAllSugarByUserId",
                     "userId"
                  );
                  break;
               case "体温数据":
                  this.getTableData(
                     "/health/bodyTemperature/queryListByUserId",
                     "memberId"
                  );
                  break;
               case "血氧数据":
                  this.getTableData(
                     "/health/bloodOxygen/queryListByUserId",
                     "memberId"
                  );
                  break;
               case "心电数据":
                  this.getTableData("/health/electrocardio/getEcgList", "userId");
                  break;
               case "体脂数据":
                  this.getTableData("/health/bodyFatRate/history", "memberId", "$post");
                  break;
            }
         },
         getTableData(pathL, key, methods = "$get") {
            this.loading = true;
            const data = {
               pathL,
               [key]: this.userId,
               pageNum: 1,
               pageSize: 99999
            };
            this[methods]("/data/my", data).then(res => {
               this.loading = false;
               if (res.state === 0) {
                  if (methods === "$post") {
                     this.tableData = res.data.result.earlier;
                  } else {
                     this.tableData = res.data.result;
                  }
               } else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            });
         },
         //（既往病史、家族史）过滤器
         diseaseFilter(v) {
            var arr = {
               check0: "无",
               jb1: "高血压、",
               jb2: "冠心病、",
               jb3: "糖尿病、",
               jb4: "高血脂、",
               jb5: "脑梗死/脑卒中、",
               jb6: "脑出血、",
               jb7: "肝病、",
               jb8: "结核、",
               jb9: "肿瘤、",
               jb10: "手术、",
               jb11: "外伤、",
               jb12: "脂肪肝、",
               jb15: "消化道溃疡高、",
               jb16: "尿酸、",
               jb17: "痛风、",
               jb18: "肥胖症、",
               jb19: "动脉粥样硬化、",
               jb20: "肾脏病、",
               jb21: "骨关节炎、",
               jb22: "骨质疏松、",
               jb23: "外周血管疾病、",
               jb24: "巨大儿生产史、",
               jb25: "多囊卵巢综合征、",
               jb26: "癌症、",
               jb27: "血液病、",
               jb28: "其他、"
            };
            return arr[v];
         },
         //过敏史
         allergyFilter(v) {
            var arr = {
               jb13: "药物过敏、",
               jb14: "食物过敏、"
            };
            return arr[v];
         },
         //吸烟过滤器
         smokeFilter(v) {
            var arr = {
               yd1: "<5根、",
               yd2: "5~10根、",
               yd3: "11~19根、",
               yd4: "≥20根、"
            };
            return arr[v];
         },
         //饮酒 过滤器
         drinkFilter(v) {
            var arr = {
               check1: "偶尔",
               check2: "经常",
               yd1: "<100g、",
               yd2: "100~200g、",
               yd3: "201~300g、",
               yd4: "301~400g、",
               yd5: ">400g、"
            };
            return arr[v];
         },
         //服药情况 过滤器
         takeMedicineFilter(v) {
            var arr = {
               check0: "无",
               jb1: "降压药、",
               jb2: "使血压升高的药物、",
               jb3: "降糖药、",
               jb4: "其他、"
            };
            return arr[v];
         },
         //运动方式 过滤器
         sportsLevelFilter(v) {
            var arr = {
               check0: "无",
               jb1: "诊断为心脏病、",
               jb2: "有过胸痛的感觉、",
               jb3: "因为头晕跌倒或晕厥、",
               jb4: "有其他原因限制运动、"
            };
            return arr[v];
         },
         //是否运动
         customSportsFilter(v) {
            const arr = {
               yd1: "散步、",
               yd2: "游泳、",
               yd3: "慢跑、",
               yd4: "广场舞、",
               yd5: "太极拳、",
               yd6: "羽毛球、",
               yd7: "乒乓球、",
               yd8: "踢毽子、",
               yd9: "其他"
            };
            return arr[v];
         },
         //健康信息
         queryListHealth(memberId) {
            this.healthLoading = true;
            this.$get("/data/my", {
               pathL: "/health/healthInfo/getInfo",
               memberId,
               healthVersion: 2
            }).then(res => {
               this.healthLoading = false;
               if (res.state === 0) {
                  var msgSecond = JSON.parse(decodeURIComponent(res.data.healthInfo));
                  // console.log(msgSecond);
                  if (msgSecond == null) {
                  } else {
                     let userInfor = msgSecond.userInfor;
                     this.useHeight =
                        userInfor.height == "" || userInfor.height == undefined
                           ? "--"
                           : userInfor.height + " CM";
                     this.useWeight =
                        userInfor.weight == "" || userInfor.weight == undefined
                           ? "--"
                           : userInfor.weight + " KG";
                     this.useWaistline =
                        userInfor.waistline == "--" || userInfor.waistline == undefined
                           ? "--"
                           : userInfor.waistline + " CM";
                     this.useWeightIndex =
                        userInfor.weightIndex == "" || userInfor.weightIndex == undefined
                           ? "--"
                           : userInfor.weightIndex + " %";
                     for (var i in msgSecond) {
                        let iJdata = msgSecond[i];
                        //既往病史
                        if (i == "medicalHistory") {
                           // let diseaseList = iJdata.medicalHistory.split(',');
                           let diseaseList = iJdata.split(",");
                           let diseaseListLength = diseaseList.length;
                           // console.log(diseaseListLength);
                           // console.log(diseaseList);
                           if (diseaseList.length == 4 && diseaseList[0] == "") {
                              this.medicalHistory = "--";
                           } else if (
                              diseaseList.length == 4 &&
                              diseaseList[0] == "check0"
                           ) {
                              this.medicalHistory = "无";
                           } else {
                              var inputText = [];
                              for (var i = 0; i < diseaseList.length; i++) {
                                 inputText.push(this.diseaseFilter(diseaseList[i]));
                              }
                              var inputContent = inputText
                                 .join("")
                                 .replace(/,$/g, "")
                                 .replace(/、$/g, "");
                              var jb26Info =
                                 JSON.parse(diseaseList[diseaseListLength - 3]).jb26Info ==
                                 ""
                                    ? ""
                                    : "癌症：" +
                                    JSON.parse(diseaseList[diseaseListLength - 3])
                                       .jb26Info +
                                    "；";
                              var jb27Info =
                                 JSON.parse(diseaseList[diseaseListLength - 2]).jb27Info ==
                                 ""
                                    ? ""
                                    : "血液病：" +
                                    JSON.parse(diseaseList[diseaseListLength - 2])
                                       .jb27Info +
                                    "；";
                              var jb28Info =
                                 JSON.parse(diseaseList[diseaseListLength - 1]).jb28Info ==
                                 ""
                                    ? ""
                                    : "其他：" +
                                    JSON.parse(diseaseList[diseaseListLength - 1])
                                       .jb28Info +
                                    "；";
                              var jb29Info = (jb26Info + jb27Info + jb28Info).replace(
                                 /、$/g,
                                 ""
                              );
                              var jb30Info =
                                 jb26Info == "" && jb27Info == "" && jb28Info == ""
                                    ? ""
                                    : "（" + jb29Info + "）";
                              this.medicalHistory = inputContent + jb30Info;
                           }
                        }
                        //过敏史
                        if (i == "allergyInfor") {
                           let diseaseList = iJdata.allergyHistory.split(",");
                           if (diseaseList.length == 1 && diseaseList[0] == "") {
                              this.allergyInfor = "--";
                           } else if (
                              diseaseList.length == 1 &&
                              diseaseList[0] == "check0"
                           ) {
                              this.allergyInfor = "无";
                           } else if (
                              diseaseList.length == 1 &&
                              diseaseList[0] == "check1"
                           ) {
                              this.allergyInfor = "有";
                           } else {
                              var inputText = [];
                              for (var i = 0; i < diseaseList.length; i++) {
                                 inputText.push(this.allergyFilter(diseaseList[i]));
                              }
                              var inputContent = inputText
                                 .join("")
                                 .replace(/,$/g, "")
                                 .replace(/、$/g, "");
                              var jb13Info =
                                 iJdata.jb13Info == ""
                                    ? ""
                                    : "药物过敏：" + iJdata.jb13Info + "；";
                              var jb14Info =
                                 iJdata.jb14Info == ""
                                    ? ""
                                    : "食物过敏：" + iJdata.jb14Info + "；";
                              var jb15Info = (jb13Info + jb14Info).replace(/、$/g, "");
                              var jb16Info =
                                 jb13Info == "" && jb14Info == ""
                                    ? ""
                                    : "(" + jb15Info + ")";
                              this.allergyInfor = inputContent + jb16Info;
                           }
                        }
                        //生育史
                        if (i == "produceHistory") {
                           if (iJdata == "") {
                              this.produceHistory = "--";
                           } else if (iJdata == "check0") {
                              this.produceHistory = "无";
                           } else if (iJdata == "check1") {
                              this.produceHistory = "有";
                           }
                        }
                        //家族史
                        if (i == "familyHistory") {
                           // let diseaseList = iJdata.familyHistory.split(',');
                           let diseaseList = iJdata.split(",");
                           let diseaseListLength = diseaseList.length;
                           // console.log(diseaseList);
                           if (diseaseList.length == 1 && diseaseList[0] == "") {
                              this.familyHistory = "--";
                           } else if (
                              diseaseList.length == 1 &&
                              diseaseList[0] == "check0"
                           ) {
                              this.familyHistory = "无";
                           } else {
                              var inputText = [];
                              for (var i = 0; i < diseaseList.length; i++) {
                                 inputText.push(this.diseaseFilter(diseaseList[i]));
                              }
                              var inputContent = inputText
                                 .join("")
                                 .replace(/,$/g, "")
                                 .replace(/、$/g, "");

                              var family_jb26Info =
                                 JSON.parse(diseaseList[diseaseListLength - 3])
                                    .family_jb26Info == ""
                                    ? ""
                                    : "癌症：" +
                                    JSON.parse(diseaseList[diseaseListLength - 3])
                                       .family_jb26Info +
                                    "；";
                              var family_jb27Info =
                                 JSON.parse(diseaseList[diseaseListLength - 2])
                                    .family_jb27Info == ""
                                    ? ""
                                    : "血液病：" +
                                    JSON.parse(diseaseList[diseaseListLength - 2])
                                       .family_jb27Info +
                                    "；";
                              var family_jb28Info =
                                 JSON.parse(diseaseList[diseaseListLength - 1])
                                    .family_jb28Info == ""
                                    ? ""
                                    : "其他：" +
                                    JSON.parse(diseaseList[diseaseListLength - 1])
                                       .family_jb28Info +
                                    "；";
                              var family_jb29Info = (
                                 family_jb26Info +
                                 family_jb27Info +
                                 family_jb28Info
                              ).replace(/、$/g, "");
                              var family_jb30Info =
                                 family_jb26Info == "" &&
                                 family_jb27Info == "" &&
                                 family_jb28Info == ""
                                    ? ""
                                    : "（" + family_jb29Info + "）";
                              this.familyHistory = inputContent + family_jb30Info;
                           }
                        }
                        //服药情况
                        if (i == "takeMedicine") {
                           let diseaseList = iJdata.takeMedicine.split(",");
                           if (diseaseList.length == 1 && diseaseList[0] == "") {
                              this.takeMedicine = "--";
                           } else if (
                              diseaseList.length == 1 &&
                              diseaseList[0] == "check0"
                           ) {
                              this.takeMedicine = "无";
                           } else {
                              var inputText = [];
                              for (var i = 0; i < diseaseList.length; i++) {
                                 inputText.push(this.takeMedicineFilter(diseaseList[i]));
                              }
                              var inputContent = inputText
                                 .join("")
                                 .replace(/,$/g, "")
                                 .replace(/、$/g, "");
                              var jb1Info =
                                 iJdata.jb1Info == "" || iJdata.jb1Info == undefined
                                    ? ""
                                    : "降压药：" + iJdata.jb1Info + "；";
                              var jb2Info =
                                 iJdata.jb2Info == "" || iJdata.jb2Info == undefined
                                    ? ""
                                    : "使血压升高的药物：" + iJdata.jb2Info + "；";
                              var jb3Info =
                                 iJdata.jb3Info == "" || iJdata.jb3Info == undefined
                                    ? ""
                                    : "降糖药：" + iJdata.jb3Info + "；";
                              var jb4Info =
                                 iJdata.jb4Info == "" || iJdata.jb4Info == undefined
                                    ? ""
                                    : "其他：" + iJdata.jb4Info + "；";
                              var jb5Info = (jb1Info + jb2Info + jb3Info + jb4Info).replace(
                                 /、$/g,
                                 ""
                              );
                              var jb6Info =
                                 jb1Info == "" &&
                                 jb2Info == "" &&
                                 jb3Info == "" &&
                                 jb4Info == ""
                                    ? ""
                                    : "（" + jb5Info + "）";
                              this.takeMedicine = inputContent + jb6Info;
                           }
                        }
                        //运动水平
                        if (i == "sportsLevel") {
                           let diseaseList = iJdata.sportsLevel.split(",");
                           if (diseaseList.length == 1 && diseaseList[0] == "") {
                              this.sportsLevel = "--";
                           } else if (
                              diseaseList.length == 1 &&
                              diseaseList[0] == "check0"
                           ) {
                              this.sportsLevel = "无";
                           } else {
                              var inputText = [];
                              for (var i = 0; i < diseaseList.length; i++) {
                                 inputText.push(this.sportsLevelFilter(diseaseList[i]));
                              }
                              var inputContent = inputText
                                 .join("")
                                 .replace(/,$/g, "")
                                 .replace(/、$/g, "");
                              this.sportsLevel = inputContent;
                           }
                        }
                        //生活方式
                        if (i == "custom") {
                           for (var j in msgSecond[i]) {
                              //吸烟
                              if (j == "CustomSmoke") {
                                 let diseaseList = iJdata.CustomSmoke.split(",");
                                 if (diseaseList.length == 1 && diseaseList[0] == "") {
                                    this.customSmoke = "--";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check0"
                                 ) {
                                    this.customSmoke = "否";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check1"
                                 ) {
                                    this.customSmoke = "是";
                                 } else {
                                    var inputText = [];
                                    for (var i = 0; i < diseaseList.length; i++) {
                                       inputText.push(this.smokeFilter(diseaseList[i]));
                                    }
                                    var inputContent = inputText
                                       .join("")
                                       .replace(/,$/g, "")
                                       .replace(/、$/g, "");
                                    this.customSmoke = inputContent;
                                 }
                              }
                              //饮酒
                              if (j == "CustomsDrink") {
                                 let diseaseList = iJdata.CustomsDrink.split(",");
                                 if (diseaseList.length == 1 && diseaseList[0] == "") {
                                    this.customsDrink = "--";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check0"
                                 ) {
                                    this.customsDrink = "不喝酒";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check1"
                                 ) {
                                    this.customsDrink = "偶尔";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check2"
                                 ) {
                                    this.customsDrink = "经常";
                                 } else {
                                    var inputText = [];
                                    for (var i = 0; i < diseaseList.length; i++) {
                                       inputText.push(this.drinkFilter(diseaseList[i]));
                                    }
                                    var inputContent = inputText
                                       .join("")
                                       .replace(/,$/g, "")
                                       .replace(/、$/g, "");
                                    this.customsDrink = inputContent;
                                 }
                              }
                              //睡眠
                              if (j == "CustomInsomnia") {
                                 let diseaseList = iJdata.CustomInsomnia;
                                 if (diseaseList == "") this.customInsomnia = "--";
                                 if (diseaseList == "check0") this.customInsomnia = "好";
                                 if (diseaseList == "check1") this.customInsomnia = "一般";
                                 if (diseaseList == "check2") this.customInsomnia = "差";
                              }
                              //是否常运动
                              if (j == "CustomSports") {
                                 let diseaseList = iJdata.CustomSports.split(",");
                                 if (diseaseList.length == 1 && diseaseList[0] == "") {
                                    this.customSports = "--";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check0"
                                 ) {
                                    this.customSports = "否";
                                 } else if (
                                    diseaseList.length == 1 &&
                                    diseaseList[0] == "check1"
                                 ) {
                                    this.customSports = "是";
                                 } else {
                                    var inputText = [];
                                    for (var i = 0; i < diseaseList.length; i++) {
                                       inputText.push(this.customSportsFilter(diseaseList[i]));
                                    }
                                    var inputContent = inputText
                                       .join("")
                                       .replace(/,$/g, "")
                                       .replace(/、$/g, "");
                                    var yd10Info =
                                       iJdata.yd10 == ""
                                          ? ""
                                          : "（ 其他 ：" + iJdata.yd10 + "）";
                                    this.customSports = inputContent + yd10Info;
                                 }
                              }
                              //摄入过多油脂？
                              if (j == "toofull") {
                                 let diseaseList = iJdata.toofull;
                                 if (diseaseList == "") this.toofull = "--";
                                 if (diseaseList == "check0") this.toofull = "否";
                                 if (diseaseList == "check1") this.toofull = "是";
                              }
                              //是否长期精神紧张
                              if (j == "tooOil") {
                                 let diseaseList = iJdata.tooOil;
                                 if (diseaseList == "") this.tooOil = "--";
                                 if (diseaseList == "check0") this.tooOil = "否";
                                 if (diseaseList == "check1") this.tooOil = "是";
                              }
                              //体力劳动情况？
                              if (j == "checkup") {
                                 let diseaseList = iJdata.checkup;
                                 if (diseaseList == "") this.checkup = "--";
                                 if (diseaseList == "check0") this.checkup = "缺乏";
                                 if (diseaseList == "check1") this.checkup = "一般";
                                 if (diseaseList == "check2") this.checkup = "经常";
                              }
                           }
                        }
                     }
                  }

                  /*if (res.data.healthInfo == null) {
                    this.healthMsg = null;
                  } else {
                    let msgSecond = res.data.healthInfo;
                    if (msgSecond === "" || msgSecond === null) return;
                    let healthMsg = JSON.parse(decodeURIComponent(msgSecond));
                    console.log(healthMsg)
                    this.healthMsg = healthMsg;
                  }*/
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

<style>
</style>
