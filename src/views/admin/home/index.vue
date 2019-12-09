<template>
  <div>
    <el-row class="landpage">
      <el-col :span="13">
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoArticlePage" :dataList="panesData"
                      @getData="getArticlelNum"></sys-deskwork>
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoReadPage" :dataList="panesData1"
                      @getData="getArticleRead"></sys-deskwork>
        <!--//////////排行内容//////////////-->
        <el-header class="head-txt m-t-10 m-b-10 bgd">
          统计信息
          <el-select v-model="value" size="mini" style="width:100px;" class="pull-right" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-header>
        <el-row>
          <el-col :span="10" :offset="1">
            <div class="text-center m-b-10 m-t-10 f-9">健康资讯阅读量排名</div>
            <div class="newsList" v-for="(item,index) in newsList" :key="index">
              <span class="link-txt" :style="{color:(index+1==newsList.length?'#333':'#333')}"
                    @click="openNews(item.id)"> {{ index+1 }} 、{{item.title}}</span>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="text-center m-b-10 m-t-10 f-9">哆咖医生点播课程购买排名</div>
            <div class="newsList" v-for="(item,index) in newsList1" :key="index">
              <span class="link-txt" :style="{color:(index+1==newsList1.length?'#333':'#333')}"
                    @click="openNews(item.id)">{{ index+1 }} 、{{item.name}}</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="11">
        <!--我是日历-->
        <full-calendar
          :events="fcEvents"
          lang="zh"
          @changeMonth="changeMonth"
          @eventClick="eventClick"
          @dayClick="dayClick"
          @moreClick="moreClick"
        ></full-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import {
		getCurrWeek,
		getCurrMonth,
		getCurrYear,
		getCurrDay,
		getCurrQuality,
		getPrevMonth,
		getPrevQuality
	} from '@/utils/getDate';

	export default {
		name: "landPage",
		components: {
			"full-calendar": require("vue-fullcalendar")
		},
		data () {
			return {
				//日历相关
				value: 3,
				fcEvents: [
					{
						title: "记录时间", // 事件内容
						start: "2019-01-12", // 事件开始时间
						end: "2019-01-12", // 事件结束时间
						content: "内容"
					},
					{
						title: "记录事件", // 事件内容
						start: "2019-02-12", // 事件开始时间
						end: "2019-02-12", // 事件结束时间
						content: "内容"
					}
				],
				panesData: [
					{
						name: "简报",
						column: [
							{
								title: "文章数",
								defaultValue: 1,
								selectOption: [
									{
										value: 1,
										label: "本日"
									},
									{
										value: 2,
										label: "本周"
									},
									{
										value: 3,
										label: "本月"
									},
									{
										value: 4,
										label: "上月"
									},
									{
										value: 5,
										label: "本季度"
									},
									{
										value: 6,
										label: "上季度"
									},
									{
										value: 7,
										label: "本年"
									}
								],
								data: [
									{
										num: 0,
										unit: "篇",
										desc: "新增医哆咖资讯数",
										link: "/news/health/list",
										param: {appid: 'PAD', start: null, end: null}
									},
									{
										num: 0,
										unit: "篇",
										desc: "新增哆咖医生资讯数",
										link: "/news/health/list",
										param: {appid: 'doctorAPP', start: null, end: null}

									},
									{
										num: 0,
										unit: "篇",
										desc: "新增哆咖家庭资讯数",
										link: "/news/health/list",
										param: {appid: 'relativeAPP', start: null, end: null}
									},
									{
										num: 0,
										unit: "篇",
										desc: "新增经典病例数",
										link: "/news/case",
										param: {start: null, end: null, onlineStatus: 1}
									},
									{
										num: 18,
										unit: "篇",
										desc: "新增指南共识数",
										link: "/news/guide",
										param: {start: null, end: null}
									},
									{
										num: 0,
										unit: "篇",
										desc: "新增医生活动页",
										link: "/news/activity_page/recommend/list",
										param: {start: null, end: null}
									},
									{
										num: 0,
										unit: "篇",
										desc: "新增消息推送数",
										link: "/news/push/list",
										param: {start: null, end: null}
									}
								]
							}
						]
					}
				],
				panesData1: [
					{
						name: "",
						column: [
							{
								title: "阅读量",
								defaultValue: 1,
								selectOption: [
									{
										value: 1,
										label: "本日"
									},
									{
										value: 2,
										label: "本周"
									},
									{
										value: 3,
										label: "本月"
									},
									{
										value: 4,
										label: "上月"
									},
									{
										value: 5,
										label: "本季度"
									},
									{
										value: 6,
										label: "上季度"
									},
									{
										value: 7,
										label: "本年"
									}
								],
								data: [
									{
										num: 0,
										unit: "",
										desc: "医哆咖资讯",
										link: "/news/health/list"
									},
									{
										num: 0,
										unit: "",
										desc: "医哆咖原创健康资讯",
										link: "/news/health/list"
									},
									{
										num: 0,
										unit: "",
										desc: "哆咖医生资讯",
										link: "/news/health/list"
									},
									{
										num: 0,
										unit: "",
										desc: "哆咖医生原创健康资讯",
										link: "/news/health/list"
									},
									{
										num: 0,
										unit: "",
										desc: "哆咖家庭资讯",
										link: "/news/health/list"
									},
									{
										num: 0,
										unit: "",
										desc: "哆咖家庭原创健康资讯",
										link: "/news/health/list"
									},
									{
										num: 0,
										unit: "",
										desc: "哆咖医生指南共识",
										link: "/news/guide"
									},
									{
										num: 0,
										unit: "",
										desc: "哆咖医生经典病例",
										link: "/news/case"
									}
								]
							}
						]
					}
				],
				///排行相关/
				tableData: [],
				tableConfig: [
					{
						type: "",
						label: "姓名",
						value: "name",
						tooltip: true
					},
					{
						type: "",
						label: "完成业绩",
						value: "type",
						tooltip: true
					}
				],
				options: [
					{
						label: "本月",
						value: 3
					},
					{
						label: "上月",
						value: 4
					},
					{
						label: "本季度",
						value: 5
					},
					{
						label: "上季度",
						value: 6
					},
					{
						label: "本年",
						value: 7
					}
				],
				newsList: [],
				newsList1: [],
				remArticleSelect: 1,
				articleDate: {
					start: '',
					end: ''
				},
				remArticleSelectRead: 1,
				readDate: {
					start: '',
					end: ''
				},
				articleNumArr: {
					yidoka: 0,//医哆咖资讯
					doctor: 0,//哆咖家医资讯
					relative: 0,//哆咖家庭资讯
					typicalDiseases: 0,//经典病例
					guideConsensus: 0,//指南共识
					activity: 0,//医生活动
					messageSend: 0//消息推送
				},
				readNumArr: {
					readyidoka: 0,//医哆咖资讯
					readDoctor: 0,//哆咖医生资讯
					readRelative: 0,//哆咖家庭资讯
					readyidokaoriginal: 0,//医哆咖原创健康资讯
					readDoctorOriginal: 0,//哆咖医生原创健康资讯
					readRelativeOriginal: 0,//哆咖家庭原创健康资讯
					readTypicalDiseases: 0,//经典病例
					readGuideConsensus: 0,//指南共识
				}
			};
		},
		mounted () {
			let date = {};
			date = getCurrDay();
			//debugger
			this.articleDate.start = date.start;
			this.articleDate.end = date.end;
			this.readDate.start = date.start;
			this.readDate.end = date.end;
			this.getArticlelNum(this.remArticleSelect);
			this.getArticleRead(this.remArticleSelectRead);
			this.getHealthNews();
			this.getcourseSort();
		},
		watch: {
			remArticleSelect () {
				this.setSelectDate(this.remArticleSelect, this.articleDate);
			},
			remArticleSelectRead () {
				this.setSelectDate(this.remArticleSelectRead, this.readDate);
			},
			value () {
				this.getHealthNews();
				this.getcourseSort();
			},
		},
		methods: {
			setSelectDate (selectObject, dateObject) {
				let date = {};
				switch (selectObject) {
					case 1: {// 本日
						date = getCurrDay();
					}
						break;
					case 2: {// 本周
						date = getCurrWeek();
					}
						break;
					case 3: {// 本月
						// 本月
						date = getCurrMonth();
					}
						break;
					case 4: {// 上月
						date = getPrevMonth();
					}
						break;
					case 5: {// 本季度
						date = getCurrQuality();

					}
						break;
					case 6: {// 上季度
						date = getPrevQuality();
					}
						break;
					case 7: {// 本年
						date = getCurrYear();
					}
						break;
				}
				dateObject.start = date.start;
				dateObject.end = date.end;
			},
			///////左侧显示内容操作////////////////
			getMenuAccess (url) {
				let hasAccess = false;
				const menuURL = this.$store.getters.menuInfo.menuURL.filter(
					item => item.menuName === "运营平台"
				);
				for (let i = 0; i < menuURL[ 0 ].urlList.length; i++) {
					if (menuURL[ 0 ].urlList[ i ] == url) {
						hasAccess = true;
						break;
					}
					else {
						hasAccess = false;
					}
				}
				return hasAccess;
			},
			gotoArticlePage (url, param) { //文章数跳转
				param.start = this.articleDate.start;
				param.end = this.articleDate.end;
				let fg = this.getMenuAccess(url);
				if (fg) { // 有跳转的权限
					if (param) {
						this.$router.push({
							path: url,
							query: param
						})
					}
					else {
						this.$router.push({
							path: url
						})
					}
				}
				else { // 无跳转的权限
					this.$message('您没有该菜单权限无法访问');
				}
			},
			gotoReadPage (url, param) { //阅读量跳转
				//param.start = this.readDate.start;
				//param.end = this.readDate.end;
				let fg = this.getMenuAccess(url);
				if (fg) { // 有跳转的权限
					if (param) {
						this.$router.push({
							path: url,
							query: param
						})
					}
					else {
						this.$router.push({
							path: url
						})
					}
				}
				else { // 无跳转的权限
					this.$message('您没有该菜单权限无法访问');
				}
			},
			getAllRead (index) {
				let that = this;
				let p1 = new Promise((resolve, reject) => {
					that.$get("/data/my", {
						scope: index,
						pathL: '/news/newsArticle/countReadNews'
					}).then(res => {
						if (res.state == 0) {
							resolve(res.data);
						}
						else {
							resolve([]);
							that.$message(res.msg);
						}
					}).catch(err => {
						that.$message(err.msg);
					})
				})

				let p2 = new Promise((resolve, reject) => {
					that.$get("/data/my", {
						scope: index,
						pathL: '/doctor/typicalDiseasesArticle/countReadTypicalDiseases'
					}).then(res => {
						if (res.state == 0) {
							resolve(res.data);
						}
						else {
							that.$message(res.msg);
							resolve([]);
						}
					}).catch(err => {
						that.$message(err.msg);
					})
				});

				Promise.all([ p1, p2 ]).then((result) => {
					let numArr = this.panesData1[ 0 ].column[ 0 ].data;
					numArr[ 0 ].num = result[ 0 ].readyidoka || 0;
					numArr[ 1 ].num = result[ 0 ].readyidokaoriginal || 0;
					numArr[ 2 ].num = result[ 0 ].readDoctor || 0;
					numArr[ 3 ].num = result[ 0 ].readDoctorOriginal || 0;
					numArr[ 4 ].num = result[ 0 ].readRelative || 0;
					numArr[ 5 ].num = result[ 0 ].readRelativeOriginal || 0;
					numArr[ 6 ].num = result[ 1 ].readGuideConsensus || 0;
					numArr[ 7 ].num = result[ 1 ].readTypicalDiseases || 0;
				}).catch((err) => {
					that.$message(err);
				})
			},
			getAllArticle (index) {
				let that = this;
				let param = {
					scope: index,
					pathL: ''
				}

				let p1 = new Promise((resolve, reject) => {
					that.$get("/data/my", {
						scope: index,
						pathL: '/news/newsArticle/countNews'
					}).then(res => {
						if (res.state == 0) {
							resolve(res.data);
						}
						else {
							that.$message(res.msg);
							resolve([]);

						}
					}).catch(err => {
						that.$message(err.msg);
					})
				});

				let p2 = new Promise((resolve, reject) => {
					that.$get("/data/my", {
						scope: index,
						pathL: '/doctor/typicalDiseasesArticle/countTypicalDiseases'
					}).then(res => {
						if (res.state == 0) {
							resolve(res.data);
						}
						else {
							that.$message(res.msg);
							resolve([]);
						}
					}).catch(err => {
						that.$message(err.msg);
					})
				});

				let p3 = new Promise((resolve, reject) => {
					that.$get("/data/my", {
						scope: index,
						pathL: '/ap/messageSendInfo/countMessageSend'
					}).then(res => {
						if (res.state == 0) {
							resolve(res.data);
						}
						else {
							resolve([]);

						}
					})
				});
				Promise.all([ p1, p2, p3 ]).then((result) => {
					let numArr = this.panesData[ 0 ].column[ 0 ].data;
					numArr[ 0 ].num = result[ 0 ].yidoka || 0;
					numArr[ 1 ].num = result[ 0 ].doctor || 0;
					numArr[ 2 ].num = result[ 0 ].relative || 0;
					numArr[ 3 ].num = result[ 1 ].typicalDiseases || 0;
					numArr[ 4 ].num = result[ 1 ].guideConsensus || 0;
					numArr[ 5 ].num = result[ 1 ].activity || 0;
					numArr[ 6 ].num = result[ 2 ].messageSend || 0;
				}).catch((err) => {
					that.$message(err);
				})
			},
			getArticlelNum (index) {
				// 重新渲染文章显示数
				this.remArticleSelect = index;
				this.getAllArticle(this.remArticleSelect);

			},
			getArticleRead (index) {
				// 重新渲染阅读显示数
				this.remArticleSelectRead = index;
				this.getAllRead(this.remArticleSelectRead);


			},
			openNews (url) {
				//window.open(url);
			},
			getHealthNews () { // 获取健康资讯
				let that = this;
				that.newsList = [];
				this.$get('/data/my', {
					pathL: '/news/newsArticle/readRanking',
					scope: this.value
				}).then(res => {
					if (res.state == 0) {
						that.newsList = res.data;
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					that.$message(err);
				})
			},
			getcourseSort () { // 获取课程排名
				let that = this;
				that.newsList1 = [];
				this.$get('/data/my', {
					pathL: '/doctor/doctorOrderOperator/bunchRanking',
					scope: this.value
				}).then(res => {
					if (res.state == 0) {
						that.newsList1 = res.data;
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					that.$message(err);
				})
			},
			//////////日历操作////////////
			// 选择月份
			changeMonth (start, end, current) {
				//console.log("changeMonth", start, end, current);
			},
			// 点击事件
			eventClick (event, jsEvent, pos) {
				//console.log("eventClick", event, jsEvent, pos);
			},
			// 点击当天
			dayClick (day, jsEvent) {
				// console.log("dayClick", day, jsEvent);
			},
			// 查看更多
			moreClick (day, events, jsEvent) {
				//console.log("moreCLick", day, events, jsEvent);
			},
		}
	};
</script>

<style lang="scss" scoped>
  .is-selected {
    color: #f60;
  }
</style>
