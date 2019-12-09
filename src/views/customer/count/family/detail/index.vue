<template>
  <div class="detail" v-loading="loading" element-loading-text="拼命加载中">
    <!--tab切换-->
    <el-tabs class="tabBtn" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <!--基本信息-->
        <div class="information" ref="information">
          <div class="baseMsgTable">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="180" class="table_right">姓名</td>
                <td width="180" class="table_left">{{baseMsg.name}}</td>
                <td width="180" class="table_right">序号</td>
                <td width="180" class="table_left">{{index}}</td>
                <td width="400" colspan="4" rowspan="3">
                  <div style="width: 100%;height: 180px;padding-left: 100px">
                    <div class="personPic">
                      <img
                        v-show="baseMsg.headImg === null || baseMsg.headImg === ''"
                        src="./../images/doctorPic.png"
                        alt
                      >
                      <img
                        v-show="baseMsg.headImg !== null && baseMsg.headImg !== ''"
                        v-bind:src="baseMsg.headImg"
                      >
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">性别</td>
                <td width="180" class="table_left">{{baseMsg.sex === 1 ? '男' : '女'}}</td>
                <td width="180" class="table_right">年龄</td>
                <td width="180" class="table_left">{{baseMsg.age}}</td>
              </tr>
              <tr>
                <td width="180" class="table_right">手机号码</td>
                <td width="180" class="table_left">{{baseMsg.mobile}}</td>
                <td width="180" class="table_right">家庭号</td>
                <td width="180" class="table_left">
                  <div v-for="item in familyNoArr" class="m-t-10 m-b-10">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">属性</td>
                <td width="180" class="table_left">
                  <p v-if="$route.query.memberType==='member'">成员</p>
                  <p v-if="$route.query.memberType==='follower'">关注用户</p>
                </td>
                <td width="200" class="table_right">添加时间</td>
                <td width="200" class="table_left">{{baseMsg.registerTime}}</td>
                <td width="180" class="table_right">账号状态</td>
                <td width="180" class="table_left">{{baseMsg.accountStatus}}</td>
              </tr>
              <tr>
                <td width="180" class="table_right">家医签约状态</td>
                <td width="180" class="table_left">
                  <span v-if="baseMsg.status == '--'">{{baseMsg.status}}</span>
                  <span v-if="baseMsg.status == 0">选购中</span>
                  <span v-if="baseMsg.status == 1">等待签约</span>
                  <span v-if="baseMsg.status == 2">已签约</span>
                  <span v-if="baseMsg.status == 3">已拒绝</span>
                  <span v-if="baseMsg.status == 5">已完成</span>
                  <span v-if="baseMsg.status == 6">签约历史</span>
                </td>
                <td width="200" class="table_right">签约团队</td>
                <td width="200" class="table_left">{{baseMsg.teamName}}</td>
                <td width="180" class="table_right">签约时间</td>
                <td width="180" class="table_left">{{baseMsg.signTime}}</td>
              </tr>
              <tr>
                <td width="180" class="table_right">身份证</td>
                <td class="table_left" colspan="5">{{ baseMsg.idCard }}</td>
              </tr>
            </table>
            <div class="back">
              <el-button
                type="primary"
                @click="$router.go(-1)"
                size="small"
                style="width:100px;"
              >返 回
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="健康信息" name="second">
        <!--健康信息-->
        <div class="information">
          <div class="baseMsgTable">
            <table border="0" cellspacing="0" cellpadding="0" style="width: 100%">
              <tr>
                <td width="180" class="table_right">身高</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?"-":healthMsg.userInfor.height+'CM'}}-->
                  {{useHeight}}
                </td>
                <td width="200" class="table_right">体重</td>
                <td width="200" class="table_left">
                  <!--{{healthMsg===null?"-":healthMsg.userInfor.weight+'KG'}}-->
                  {{useWeight}}
                </td>
                <td width="180" class="table_right">体重指数</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?"-":healthMsg.userInfor.weightIndex+'%'}}-->
                  {{useWeightIndex}}
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">腰围</td>
                <td width="180" class="table_left">
                  <!--<p v-if="healthMsg===null">-</p>
              <span v-else v-for="item in (healthMsg.medicalHistory.medicalHistory || '').split(',')">
                {{item | medicalHistory}}
                  </span>-->
                  <!--{{medicalHistory}}-->
                  {{useWaistline}}
                </td>
                <td width="200" class="table_right">过敏史</td>
                <td width="200" class="table_left">
                  <!--<p v-if="healthMsg===null">-</p>
              <span v-else v-for="item in (healthMsg.allergyInfor.allergyHistory || '').split(',')">
                {{item | allergyHistory}}
                  </span>-->
                  {{allergyInfor}}
                </td>
                <td width="180" class="table_right">生育史</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?'-':(healthMsg.produceHistory === 'check0' ? '无' : (healthMsg.produceHistory ==='check1' ? '有' : '-'))}}-->
                  {{produceHistory}}
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">家族史</td>
                <td width="180" class="table_left">
                  <!--<p v-if="healthMsg===null">-</p>
              <span v-else v-for="item in (healthMsg.familyHistory.familyHistory || '').split(',')">
                {{item | family}}
                  </span>-->
                  {{familyHistory}}
                </td>
                <td width="200" class="table_right">是否吸烟</td>
                <td width="200" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.CustomSmoke ==='check0' ? '无' : (healthMsg.custom.CustomSmoke ==='check1' ? '有' : '-'))}}-->
                  {{customSmoke}}
                </td>
                <td width="180" class="table_right">是否饮酒</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.CustomsDrink ==='check0' ? '无' : (healthMsg.custom.CustomsDrink ==='check1' ? '有' : '-'))}}-->
                  {{customsDrink}}
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">睡眠情况</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.CustomInsomnia ==='check0' ? '无' : (healthMsg.custom.CustomInsomnia ==='check1' ? '有' : '-'))}}-->
                  {{customInsomnia}}
                </td>
                <!--<td width="200" class="table_right">是否每餐都进食过饱</td>-->
                <td width="200" class="table_right">是否每日摄入过多油脂,高钠盐类食物</td>
                <td width="200" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.toofull ==='check0' ? '否' : (healthMsg.custom.toofull ==='check1' ? '是' : '-'))}}-->
                  {{toofull}}
                </td>
                <!--<td width="180" class="table_right">是否每年体检</td>-->
                <td width="180" class="table_right">是否长期精神紧张</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.checkup ==='check0' ? '否' : (healthMsg.custom.checkup ==='check1' ? '是' : '-'))}}-->
                  {{tooOil}}
                </td>
              </tr>
              <tr>
                <!--<td width="180" class="table_right">是否每年体重都增加</td>-->
                <td width="180" class="table_right">体力劳动情况</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.toFat ==='check0' ? '否' :(healthMsg.custom.toFat ==='check1' ? '是' : '-'))}}-->
                  {{checkup}}
                </td>
                <!--<td width="200" class="table_right">大小便是否正常</td>-->
                <td width="200" class="table_right">服药情况</td>
                <td width="200" class="table_left">
                  <!--{{healthMsg===null?"-":(healthMsg.custom.Stool ==='check0' ? '否' : (healthMsg.custom.Stool ==='check1' ? '是' : '-'))}}-->
                  {{takeMedicine}}
                </td>
                <!--<td width="180" class="table_right">是否长期服用止痛药</td>-->
                <td width="180" class="table_right">运动水平</td>
                <td width="180" class="table_left">
                  <!--{{healthMsg===null ? "-" : (healthMsg.custom.Anodyne ==='check0' ? '否' :(healthMsg.custom.Anodyne ==='check1' ? '是' : '-'))}}-->
                  {{sportsLevel}}
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">是否常运动</td>
                <td width="180" class="table_left" colspan="5">
                  <!--<p v-if="healthMsg===null">-</p>
              <span v-else v-for="item in (healthMsg.custom.CustomSports || '').split(',')">
                {{item | sportList}}
                  </span>-->
                  {{customSports}}
                </td>
              </tr>
              <tr>
                <td width="180" class="table_right">既往病史</td>
                <td width="180" class="table_left" colspan="5">
                  <!--<p v-if="healthMsg===null">-</p>
              <span v-else v-for="item in (healthMsg.custom.CustomSports || '').split(',')">
                {{item | sportList}}
                  </span>-->
                  {{medicalHistory}}
                </td>
              </tr>
            </table>
            <div class="back">
              <el-button
                type="primary"
                @click="$router.go(-1)"
                size="small"
                style="width:100px;"
              >返 回
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="测量数据" name="third">
        <!--测量数据-->
        <div class="information">
          <measure></measure>
        </div>
      </el-tab-pane>
      <el-tab-pane label="健康月报" name="fourth">
        <!--健康月报-->
        <div class="information">
          <monthly/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="检查单" name="fifth">
        <!--检查单-->
        <div class="information">
          <checklist/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
	import checklist from "./checklist";
	import measure from "./measure";
	import monthly from "./monthly";

	export default {
		name: "",
		components: {measure, monthly, checklist},
		filters: {
			//既往史
			medicalHistory (v) {
				const arr = {
					check0: "无",
					jb1: "高血压、",
					jb2: "冠心病、",
					jb3: "糖尿病、",
					jb4: "高血脂、",
					jb5: "脑梗死、",
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
					jb28: "其他"
				};
				return arr[ v ];
			},
			//过敏史
			allergyHistory (v) {
				const arr = {
					check0: "无",
					check1: "有",
					jb13: "药物过敏、",
					jb14: "食物过敏"
				};
				return arr[ v ];
			},
			//家族史
			family (v) {
				const arr = {
					check0: "无",
					jb1: "高血压、",
					jb2: "冠心病、",
					jb3: "糖尿病、",
					jb4: "高血脂、",
					jb5: "脑梗死、",
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
					jb28: "其他"
				};
				return arr[ v ];
			},
			//是否运动
			sportList (v) {
				const arr = {
					check0: "无",
					check1: "有",
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
				return arr[ v ];
			}
		},
		props: [],
		data () {
			return {
				familyNoArr: [],//家庭号
				height: 0,
				loading: false, //数据加载的e
				activeName: "first",
				index: this.$route.query.index, //序号
				firstId: this.$route.query.id, //基本信息Id
				//基本信息
				baseMsg: {
					headImg: "",
					idCard:'', //身份证号
				},
				//健康信息
				healthMsg: {
					medicalHistory: {
						medicalHistory: ""
					}, //既往病史
					allergyInfor: {
						allergyHistory: ""
					}, //过敏史
					custom: {}, //生活方式
					userInfor: {
						height: "",
						weight: "",
						weightIndex: ""
					}, //身高体重腰围
					produceHistory: {}, //生育史
					familyHistory: {
						familyHistory: ""
					} //家族史
				},
				useHeight: "--", //身高
				useWeight: "--", //体重
				useWaistline: "--", //腰围
				useWeightIndex: "--", //体重指数
				medicalHistory: "--", //既往病史
				allergyInfor: "--", //过敏史
				produceHistory: "--", //生育史
				familyHistory: "--", //家族史
				customSmoke: "--", //吸烟
				customsDrink: "--", //饮酒
				customInsomnia: "--", //睡眠
				customSports: "--", //是否常运动？
				toofull: "--", //是否每日摄入过多油脂？
				tooOil: "--", //是否长期精神紧张？
				checkup: "--", //体力劳动情况
				takeMedicine: "--", //服药情况
				sportsLevel: "--" //运动方式
			};
		},
		methods: {
			//基本信息
			queryListBase () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/user/member/getUserBasicInfo",
					memberId: this.firstId
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						let msgFirst = res.data;
						this.baseMsg = msgFirst;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//（既往病史、家族史）过滤器
			diseaseFilter (v) {
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
				return arr[ v ];
			},
			//过敏史
			allergyFilter (v) {
				var arr = {
					jb13: "药物过敏、",
					jb14: "食物过敏、"
				};
				return arr[ v ];
			},
			//吸烟过滤器
			smokeFilter (v) {
				var arr = {
					yd1: "<5根、",
					yd2: "5~10根、",
					yd3: "11~19根、",
					yd4: "≥20根、"
				};
				return arr[ v ];
			},
			//饮酒 过滤器
			drinkFilter (v) {
				var arr = {
					check1: "偶尔",
					check2: "经常",
					yd1: "<100g、",
					yd2: "100~200g、",
					yd3: "201~300g、",
					yd4: "301~400g、",
					yd5: ">400g、"
				};
				return arr[ v ];
			},
			//服药情况 过滤器
			takeMedicineFilter (v) {
				var arr = {
					check0: "无",
					jb1: "降压药、",
					jb2: "使血压升高的药物、",
					jb3: "降糖药、",
					jb4: "其他、"
				};
				return arr[ v ];
			},
			//运动方式 过滤器
			sportsLevelFilter (v) {
				var arr = {
					check0: "无",
					jb1: "诊断为心脏病、",
					jb2: "有过胸痛的感觉、",
					jb3: "因为头晕跌倒或晕厥、",
					jb4: "有其他原因限制运动、"
				};
				return arr[ v ];
			},
			//是否运动
			customSportsFilter (v) {
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
				return arr[ v ];
			},
			//健康信息
			queryListHealth () {
				this.$get("/data/my", {
					pathL: "/health/healthInfo/getInfo",
					memberId: this.firstId,
					healthVersion: 2
				}).then(res => {
					if (res.state === 0) {
						var msgSecond = JSON.parse(decodeURIComponent(res.data.healthInfo));
						// console.log(msgSecond);
						if (msgSecond == null) {
							console.log("为null");
						}
						else {
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
								let iJdata = msgSecond[ i ];
								//既往病史
								if (i == "medicalHistory") {
									// let diseaseList = iJdata.medicalHistory.split(',');
									let diseaseList = iJdata.split(",");
									let diseaseListLength = diseaseList.length;
									// console.log(diseaseListLength);
									// console.log(diseaseList);
									if (diseaseList.length == 4 && diseaseList[ 0 ] == "") {
										this.medicalHistory = "--";
									}
									else if (
										diseaseList.length == 4 &&
										diseaseList[ 0 ] == "check0"
									) {
										this.medicalHistory = "无";
									}
									else {
										var inputText = [];
										for (var i = 0; i < diseaseList.length; i++) {
											inputText.push(this.diseaseFilter(diseaseList[ i ]));
										}
										var inputContent = inputText
											.join("")
											.replace(/,$/g, "")
											.replace(/、$/g, "");
										var jb26Info =
											JSON.parse(diseaseList[ diseaseListLength - 3 ]).jb26Info ==
											""
												? ""
												: "癌症：" +
												JSON.parse(diseaseList[ diseaseListLength - 3 ])
													.jb26Info +
												"；";
										var jb27Info =
											JSON.parse(diseaseList[ diseaseListLength - 2 ]).jb27Info ==
											""
												? ""
												: "血液病：" +
												JSON.parse(diseaseList[ diseaseListLength - 2 ])
													.jb27Info +
												"；";
										var jb28Info =
											JSON.parse(diseaseList[ diseaseListLength - 1 ]).jb28Info ==
											""
												? ""
												: "其他：" +
												JSON.parse(diseaseList[ diseaseListLength - 1 ])
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
									if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
										this.allergyInfor = "--";
									}
									else if (
										diseaseList.length == 1 &&
										diseaseList[ 0 ] == "check0"
									) {
										this.allergyInfor = "无";
									}
									else if (
										diseaseList.length == 1 &&
										diseaseList[ 0 ] == "check1"
									) {
										this.allergyInfor = "有";
									}
									else {
										var inputText = [];
										for (var i = 0; i < diseaseList.length; i++) {
											inputText.push(this.allergyFilter(diseaseList[ i ]));
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
									}
									else if (iJdata == "check0") {
										this.produceHistory = "无";
									}
									else if (iJdata == "check1") {
										this.produceHistory = "有";
									}
								}
								//家族史
								if (i == "familyHistory") {
									// let diseaseList = iJdata.familyHistory.split(',');
									let diseaseList = iJdata.split(",");
									let diseaseListLength = diseaseList.length;
									// console.log(diseaseList);
									if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
										this.familyHistory = "--";
									}
									else if (
										diseaseList.length == 1 &&
										diseaseList[ 0 ] == "check0"
									) {
										this.familyHistory = "无";
									}
									else {
										var inputText = [];
										for (var i = 0; i < diseaseList.length; i++) {
											inputText.push(this.diseaseFilter(diseaseList[ i ]));
										}
										var inputContent = inputText
											.join("")
											.replace(/,$/g, "")
											.replace(/、$/g, "");

										var family_jb26Info =
											JSON.parse(diseaseList[ diseaseListLength - 3 ])
												.family_jb26Info == ""
												? ""
												: "癌症：" +
												JSON.parse(diseaseList[ diseaseListLength - 3 ])
													.family_jb26Info +
												"；";
										var family_jb27Info =
											JSON.parse(diseaseList[ diseaseListLength - 2 ])
												.family_jb27Info == ""
												? ""
												: "血液病：" +
												JSON.parse(diseaseList[ diseaseListLength - 2 ])
													.family_jb27Info +
												"；";
										var family_jb28Info =
											JSON.parse(diseaseList[ diseaseListLength - 1 ])
												.family_jb28Info == ""
												? ""
												: "其他：" +
												JSON.parse(diseaseList[ diseaseListLength - 1 ])
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
									if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
										this.takeMedicine = "--";
									}
									else if (
										diseaseList.length == 1 &&
										diseaseList[ 0 ] == "check0"
									) {
										this.takeMedicine = "无";
									}
									else {
										var inputText = [];
										for (var i = 0; i < diseaseList.length; i++) {
											inputText.push(this.takeMedicineFilter(diseaseList[ i ]));
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
									if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
										this.sportsLevel = "--";
									}
									else if (
										diseaseList.length == 1 &&
										diseaseList[ 0 ] == "check0"
									) {
										this.sportsLevel = "无";
									}
									else {
										var inputText = [];
										for (var i = 0; i < diseaseList.length; i++) {
											inputText.push(this.sportsLevelFilter(diseaseList[ i ]));
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
									for (var j in msgSecond[ i ]) {
										//吸烟
										if (j == "CustomSmoke") {
											let diseaseList = iJdata.CustomSmoke.split(",");
											if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
												this.customSmoke = "--";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check0"
											) {
												this.customSmoke = "否";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check1"
											) {
												this.customSmoke = "是";
											}
											else {
												var inputText = [];
												for (var i = 0; i < diseaseList.length; i++) {
													inputText.push(this.smokeFilter(diseaseList[ i ]));
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
											if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
												this.customsDrink = "--";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check0"
											) {
												this.customsDrink = "不喝酒";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check1"
											) {
												this.customsDrink = "偶尔";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check2"
											) {
												this.customsDrink = "经常";
											}
											else {
												var inputText = [];
												for (var i = 0; i < diseaseList.length; i++) {
													inputText.push(this.drinkFilter(diseaseList[ i ]));
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
											if (diseaseList.length == 1 && diseaseList[ 0 ] == "") {
												this.customSports = "--";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check0"
											) {
												this.customSports = "否";
											}
											else if (
												diseaseList.length == 1 &&
												diseaseList[ 0 ] == "check1"
											) {
												this.customSports = "是";
											}
											else {
												var inputText = [];
												for (var i = 0; i < diseaseList.length; i++) {
													inputText.push(this.customSportsFilter(diseaseList[ i ]));
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
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//tabs切换
			handleClick (tab, event) {
				// console.log(tab, event);
			}
		},
		mounted () {
			this.familyNoArr = this.$route.query.familyNo.split(',');
			this.height = this.$refs.information.offsetHeight;
			this.queryListBase();
			this.queryListHealth();
			let activeName = this.$route.query.activeName;
			// console.log(activeName);
			if (activeName == undefined) {
				this.activeName = "first";
				if (this.$route.query.type) {
					this.activeName = "third"
				}
			}
			else {
				this.activeName = activeName;
			}
		},
		computed: {},
		activated () {
		}
	};
</script>

<style scoped>
  /*table布局                 ----------------------start----------------------------*/
  .baseMsgTable {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    border-collapse: collapse;
  }

  .baseMsgTable table {
    /*width: 100%;*/
    border: 1px solid #dadfea;
  }

  .baseMsgTable table tr:nth-child(even) {
    background: rgb(243, 243, 243);
  }

  .table_right {
    text-align: right;
    width: 120px;
    padding-right: 20px;
  }

  .table_left {
    text-align: left;
    width: 220px;
    padding-left: 10px;
  }

  .table_pic {
    height: 200px;
  }

  .table_introduction {
    height: 40px;
  }

  .table_goodAt {
    height: 40px;
  }

  .baseMsgTable table td {
    border: 1px solid #ddd;
    height: 50px;
  }

  /*table布局                 ----------------------end----------------------------*/
  .detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    overflow-x: hidden;
  }

  .tabBtn {
    width: 100%;
    height: 39px;
  }

  .information {
    flex: 1;
    width: 100%;
    padding: 10px;
    overflow: auto;
    box-sizing: border-box;
  }

  .back {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .personPic {
    width: 180px;
    height: 180px;
  }

  .personPic img {
    width: 100%;
    height: 100%;
  }
</style>
