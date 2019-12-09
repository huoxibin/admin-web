<template>
  <el-form
    class="w-800 m-t-20 f-s-14"
    v-loading="loading"
    element-loading-text="努力加载中"
    ref="form"
    :model="form"
    label-width="250px"
  >
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n">课程名称</b>
      </el-col>
      <el-col :span="12" :offset="1">{{form.courseName}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">发布渠道</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.platformType}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right m-t-10">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">课程介绍</b>
      </el-col>
      <el-col :span="17" :offset="1" class="l-h-35">{{form.desc}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right m-t-10">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">课程内容</b>
      </el-col>
      <el-col :span="17" :offset="1" class="l-h-35">
        <base-editor :disable="false" style="height: 150px;" v-model="form.courseIntroduction"></base-editor>
      </el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">Tag词</b>
      </el-col>
      <el-col :span="12" :offset="1">
        <template v-for="item in form.tag">
          <el-tag size="mini" class="span-block" :key="item">{{item}}</el-tag>
        </template>
      </el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">选择分类</b>
      </el-col>
      <el-col :span="12" :offset="1">
        <template v-for="item,index in form.category">
          <div class="m-b-10" :key="index">
            <template v-for="im,idx in item" :span="5">
              <el-tag size="mini" class="span-block" :key="idx">{{im}}</el-tag>
            </template>
          </div>
        </template>
      </el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">引导图</b>
      </el-col>
      <el-col :span="12" :offset="1">
        <img :src="form.pic" alt class="img-90">
      </el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">视频</b>
      </el-col>
      <el-col :span="12" :offset="1">
        <aliPlayer :vInfo="vedioInfo"/>
      </el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">绑定讲师</b>
      </el-col>
      <el-col :span="12" :offset="1">{{form.teacher}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">课程费用</b>
      </el-col>
      <el-col :span="12" :offset="1">{{form.expense}}</el-col>
    </el-row>

    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">权益设置</b>
      </el-col>
      <el-col :span="17" :offset="1">
        <el-row class="m-b-20">
          <el-col :span="8" class="text-center" v-show="showDk">
            哆咖医生
          </el-col>
          <el-col :span="16" class="text-center" v-show="showYd">
            医哆咖
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">&nbsp;</b>
      </el-col>
      <el-col :span="17" :offset="1">
        <el-row>
          <el-col :span="8" v-show="showDk">
            <el-row class="m-b-10" v-for="(item,index) in form.interestList" :key="Number(item.levelId)">
              <el-col :span="4">{{item.levelName}}</el-col>
              <el-col :span="9" :offset="2">所享折扣</el-col>
              <el-col :span="8" :offset="1">
                {{ item.discount }}
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" v-show="showYd">
            <el-row class="m-b-10" v-if="index<=11" v-for="(item,index) in form.interestYdkList" :key="item.levelId">
              <template>
                <el-col :span="4" :offset="4">{{item.levelName}}</el-col>
                <el-col :span="9" :offset="2">所享折扣</el-col>
                <el-col :span="4" :offset="1">
                  {{ item.discount }}
                </el-col>
              </template>
            </el-row>
          </el-col>
          <el-col :span="8" v-show="showYd">
            <el-row class="m-b-10" v-if="index>11" v-for="(item,index) in form.interestYdkList" :key="Number(item.levelId)">
              <template>
                <el-col :span="4" :offset="4">{{item.levelName}}</el-col>
                <el-col :span="9" :offset="2">所享折扣</el-col>
                <el-col :span="4" :offset="1">
                  {{ item.discount }}
                </el-col>
              </template>
            </el-row>
          </el-col>
        </el-row>
      </el-col>

    </el-row>
    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <span class="symbol-start">*</span>
        <b class="f-s-n f-w-n f-s-14">是否允许评论</b>
      </el-col>
      <el-col :span="12" :offset="1">{{form.discuss}}</el-col>
    </el-row>


    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">初始阅读量</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.initReadnum}}</el-col>
    </el-row>
    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">阅读量增长系数</b>
      </el-col>
      <el-col
        :span="12"
        :offset="1"
        v-if="form.plusReadnum"
        class="set-content"
      >X {{form.plusReadnum}}
      </el-col>
    </el-row>

    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">初始收藏量</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.defaultFavoriteAmout}}</el-col>
    </el-row>
    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">收藏量增长数</b>
      </el-col>
      <el-col
        :span="12"
        :offset="1"
        v-if="form.favoriteIncreaseNum"
        class="set-content"
      >X {{form.favoriteIncreaseNum}}
      </el-col>
    </el-row>

    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">购买数量</b>
      </el-col>
      <el-col :span="12" :offset="1">{{form.buyCount}}</el-col>
    </el-row>
    <el-row class="m-t-20" v-show="!showWeb || showDk || showYd">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">销售总金额</b>
      </el-col>
      <el-col :span="12" :offset="1">{{form.plusReadnum}}</el-col>
    </el-row>

    <el-row class="m-t-20" v-if="false">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">购买数量</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.buynum}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">创建时间</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.createTime}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">创建人</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.createPeople}}</el-col>
    </el-row>
    <el-row class="m-t-20">
      <el-col :span="6" class="text-right">
        <b class="f-s-n f-w-n f-s-14">状态</b>
      </el-col>
      <el-col :span="12" :offset="1" class="set-content">{{form.status}}</el-col>
    </el-row>
    <el-row class="m-t-20 text-center m-b-20">
      <el-col :span="3" :offset="12">
        <el-button @click="$router.back()" type="primary" plain size="mini">返回</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
	import aliPlayer from "@/views/admin/course/course/add/component/aliPlayer/aliPlayer";

	export default {
		components: {
			aliPlayer
		},
		data () {
			return {
				showDk:false,
				showYd:false,
        showWeb:false,
				vedioInfo: {
					//视频的信息
					autoplay: false, //自动播放
					playAuth: null, //播放凭证
					requestId: null, //返回的id
					coverURL: null, //视频封面图地址
					videoId: null, //视频id
					playUrl: null, //播放的url
					accessKeyId: null, //返回的id
					securityToken: null, //视频封面图地址
					accessKeySecret: null
				},
				loading: true,
				form: {
					courseIntroduction: '',//课程内容
					platformType: '',
					courseName: "",
					desc: "",
					tag: "",
					category: "",
					pic: "",
					video: "",
					teacher: "",
					expense: "", //课程费用
					interestList: [], //权益设置
					discuss: "",
					initReadnum: "", //初始阅读量
					plusReadnum: "", //增长量
					buynum: "", //购买量
					createTime: "",
					createPeople: "",
					status: "", //状态
					defaultFavoriteAmout: '',
					favoriteIncreaseNum: ''

				}
			};
		},
		mounted () {
			this.getData();
		},
		methods: {
			getData () {
				//获取课程详情
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getCourseInfo",
					courseId: this.$route.query.id //课程的id
				})
					.then(res => {
						if (!res.state) {
							//that.$message('获取数据成功');
							that.dealShowData(res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealShowData (data) {
				if (data) {
					this.form.courseName = data.name;
					this.form.desc = data.introduction;
					this.form.tag = this.getTag(data.tagStr);
					this.form.category = this.getCategory(data.classifyInfo);
					this.form.pic = data.imageUrl;
					//this.form.video=data.videoUrl;
					this.form.videoId = data.videoId; //获取视频的id

					this.form.teacher = data.lecturerName;
					this.form.expense = data.costType == 1 ? "免费" : `￥${ data.courseCost }   -   折扣价￥${ data.discountedPrice }   -   折扣数${ data.discountNumber }`; //课程费用
					/////////////////////////////////////
					this.form.interestList = this.dealInterestList(data.equityInfo); //权益设置
					this.form.interestYdkList = this.dealInterestList(data.equityInfoFamily); //权益设置
					this.form.discuss = data.isAllowComment ? "允许" : "不允许";
					this.form.initReadnum = data.defaultReadCount; //初始阅读量
					this.form.plusReadnum = data.increaseCoefficient; //增长量

					this.form.defaultFavoriteAmout = data.defaultFavoriteAmout; //增长量
					this.form.favoriteIncreaseNum = data.favoriteIncreaseNum; //增长量

					this.form.platformType = data.platformType.split(',');
					this.form.courseIntroduction = data.courseIntroduction;// 课程内容


					let arr = [];

					this.form.platformType.forEach(im => {
						switch (im) {
							case "1": {
								arr.push(`哆咖医生`);
								this.showDk=true;
							}
								break;
							case "2": {
								arr.push(`医哆咖`);
								this.showYd=true;
							}
								break;
							case "3": {
								arr.push(`哆咖医生web端`);
								this.showWeb=true;
							}
								break;
						}
					})
					this.form.platformType = arr.join(', ');

					this.form.buynum = ""; //购买量
					this.form.createTime = data.createTime;
					this.form.createPeople = data.theCreater;
					this.form.status = data.courseStatus; //状态
					this.loading = false;
					this.getVedioInfo(); //获取播放的视频的信息
				}
			},
			dealInterestList (data) {
				data.forEach(item => {
					item.levelId = Number(item.levelId);
				})
				return data;
			},
			getVedioInfo () {
				//展示视频
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/alimedia/getVideoPlayAuth",
					videoId: this.form.videoId
				})
					.then(res => {
						if (!res.state) {
							that.vedioInfo.playAuth = res.data.playAuth; //播放凭证
							that.vedioInfo.requestId = res.data.requestId; //返回的id
							that.vedioInfo.coverURL = res.data.videoMeta.coverURL; //视频封面图地址
							that.vedioInfo.videoId = res.data.videoMeta.videoId; //视频id
							that.getVedioUrl(); //使用url 播放
							//that.getVeidocceptAKey();//获取视频的播放信息
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			getVeidocceptAKey () {
				//第二种Id播放方式
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/aliyun/vod/sts/get",
					videoId: this.form.videoId
				})
					.then(res => {
						if (!res.state) {
							that.vedioInfo.accessKeyId = res.data.accessKeyId; //返回的id
							that.vedioInfo.securityToken = res.data.securityToken; //视频封面图地址
							that.vedioInfo.accessKeySecret = res.data.accessKeySecret; //视频id
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			getVedioUrl () {
				//第一中url播放方式
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/alimedia/getPlayInfo",
					videoId: this.form.videoId
				})
					.then(res => {
						if (!res.state) {
							that.loading = false;
							that.form.video = res.data.playInfoList[ 0 ].playURL;
							that.vedioInfo.playUrl = that.form.video; //视频播放地址
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			getTag (tag) {
				//获取tag 标签
				if (tag) {
					return tag.split(",");
				}
				else {
					return "";
				}
			},
			getCategory (cate) {
				if (cate) {
					cate = cate.split(",");
					let arr = [];
					cate.forEach((item, index) => {
						let im = item.split("--");
						arr[ index ] = im;
					});
					return arr;
				}
				else {
					return "";
				}
			},
			getInterest (data) {
				//获取权益
				let that = this,
					arr = [];
				data.forEach((item, index) => {
					item.oneEquity = !item.oneEquity ? "" : item.oneEquity;
					item.twoEquity = !item.twoEquity ? "" : item.twoEquity;
					let idx = ++index;
					if (item.oneEquity !== "" || item.twoEquity !== "") {
						let im = {
							name: `权益${ idx }`,
							val: `${ item.oneEquity }~${ item.twoEquity }`,
							discount: item.discount
						};
						arr.push(im);
					}
				});
				return arr;
			}
		}
	};
</script>

<style scoped>
  .span-block {
    background: #fff;
    border: 0;
    font-size: 14px;
  }
</style>
