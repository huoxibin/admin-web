<template>
  <!--基础平台没有工作台页面-->
  <div style="display:none;">
    <el-row class="landpage">
      <el-col :span="13">
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoArticlePage" :dataList="panesData" @getData="getArticlelNum"></sys-deskwork>
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoReadPage" :dataList="panesData1" @getData="getArticleRead"></sys-deskwork>
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
              <span class="link-txt" @click="openNews(item.url)">{{ index+1 }} 、{{item.title}}</span>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="text-center m-b-10 m-t-10 f-9">点播课程购买排名</div>
            <div class="newsList" v-for="(item,index) in newsList1" :key="index">
              <span class="link-txt" @click="openNews(item.url)">{{ index+1 }} 、{{item.title}}</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="11">
        <!--我是日历-->
        <full-calendar
          :events="fcEvents"
          locale="en"
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
				value: "",
				fcEvents: [
					{
						title: "记录时间", // 事件内容
						start: "2019-05-12", // 事件开始时间
						end: "2019-05-12", // 事件结束时间
						content: "内容"
					},
					{
						title: "记录事件", // 事件内容
						start: "2019-05-12", // 事件开始时间
						end: "2019-05-12", // 事件结束时间
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
										param: {start: null, end: null}
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
										desc: "指南共识",
										link: "/news/guide"
									},
									{
										num: 0,
										unit: "",
										desc: "经典病例",
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
						value: 1
					},
					{
						label: "上月",
						value: 2
					},
					{
						label: "本季度",
						value: 3
					},
					{
						label: "上季度",
						value: 4
					},
					{
						label: "本年",
						value: 5
					}
				],
				newsList: [
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					}
				],
				newsList1: [
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					},
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					},
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					},
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					},
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					},
					{
						title: "官方发布：2019年家庭医生签约服务工作重点确定",
						url: "http://www.baidu.com"
					}
				],
				remArticleSelect: 0,
				articleDate: {
					start: '',
					end: ''
				},
				remArticleSelectRead: 0,
				readDate: {
					start: '',
					end: ''
				},
			};
		},
    mounted(){
			let date = {};
			date = getCurrDay();
			//debugger
			this.articleDate.start = date.start;
			this.articleDate.end = date.end;
			this.readDate.start = date.start;
			this.readDate.end = date.end;
    },
		watch: {
			remArticleSelect () {
				this.setSelectDate(this.remArticleSelect, this.articleDate);
			},
			remArticleSelectRead () {
				this.setSelectDate(this.remArticleSelectRead, this.readDate);
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
			gotoArticlePage(url,param){
        param.start=this.articleDate.start;
        param.end=this.articleDate.end;
				this.$router.push({
					path: url,
					query: param
				})
      },
			gotoReadPage(url,param){
				// param.start=this.readDate.start;
				// param.end=this.readDate.end;
        if(param){
					this.$router.push({
						path: url,
						query: param
					})
        }else{
					this.$router.push({
						path: url
					})
        }

      },
      getArticlelNum (index) {
				// 重新渲染文章显示数
				let that = this;
				this.remArticleSelect = index;
				this.panesData[ 0 ].column[ 0 ].data[ 1 ].num = 92323999;
				// this.$get("/data/my", {
				//   pathL: ""
				// })
				//   .then(res => {
				//     if (res.state == 0) {
				//       that.$message(res.msg);
				//     } else {
				//       that.$message(res.msg);
				//     }
				//   })
				//   .catch(err => {
				//     that.$message(err.msg);
				//   });
			},
			getArticleRead (index) {
				// 重新渲染阅读显示数
				this.panesData1[ 0 ].column[ 0 ].data[ 1 ].num = 9999;
				let that = this;
				this.remArticleSelectRead = index;
				// this.$get("/data/my", {
				//   pathL: ""
				// })
				//   .then(res => {
				//     if (res.state == 0) {
				//       that.$message(res.msg);
				//     } else {
				//       that.$message(res.msg);
				//     }
				//   })
				//   .catch(err => {
				//     that.$message(err.msg);
				//   });
			},
			openNews (url) {
				window.open(url);
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