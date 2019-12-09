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
            <el-col :span="6" class="text-right m-t-10">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">课程介绍</b>
            </el-col>
            <el-col :span="17" :offset="1" class="l-h-35">{{form.desc}}</el-col>
        </el-row>
        <el-row class="m-t-20">
            <el-col :span="6" class="text-right m-t-10">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">课程提纲</b>
            </el-col>
            <el-col :span="17" :offset="1" class="l-h-35">{{form.desc}}</el-col>
        </el-row>
        <el-row class="m-t-20">
            <el-col :span="6" class="text-right">
                <b class="f-s-n f-w-n f-s-14">Tag词</b>
            </el-col>
            <el-col :span="12" :offset="1">
                <template v-for="item in form.tag">
                    <el-tag size="mini" class="span-block">{{item}}</el-tag>
                </template>
            </el-col>
        </el-row>
        <el-row class="m-t-20">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">选择分类</b>
            </el-col>
            <el-col :span="12" :offset="1">
                <template v-for="item in form.category">
                    <div class="m-b-10" :key="item">
                        <template v-for="im in item" :span="5">
                            <el-tag size="mini" class="span-block" :key="im">{{im}}</el-tag>
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
        <el-row class="m-t-20" v-if="hideZbContent==2">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">视频</b>
            </el-col>
            <el-col :span="12" :offset="1">
                <aliPlayer :vInfo="vedioInfo"/>
            </el-col>
        </el-row>
        <el-row class="m-t-20" v-if="hideZbContent==1">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">直播地址</b>
            </el-col>
            <el-col :span="12" :offset="1">{{ form.liveUrl }}</el-col>
        </el-row>
        <el-row class="m-t-20" v-if="hideZbContent==1">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">直播频道号</b>
            </el-col>
            <el-col :span="12" :offset="1">{{ form.playChannel }}</el-col>
        </el-row>



        <el-row class="m-t-20">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">绑定讲师</b>
            </el-col>
            <el-col :span="12" :offset="1">{{form.teacher}}</el-col>
        </el-row>
        <el-row class="m-t-20" v-if="hideZbContent==1">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">直播日期</b>
            </el-col>
            <el-col :span="12" :offset="1">{{form.liveTime}}</el-col>
        </el-row>

        <el-row class="m-t-20">
            <el-col :span="6" class="text-right">
                <span class="symbol-start">*</span>
                <b class="f-s-n f-w-n f-s-14">是否允许评论</b>
            </el-col>
            <el-col :span="12" :offset="1">{{form.discuss}}</el-col>
        </el-row>

        <el-row class="m-t-20">
          <el-col :span="6" class="text-right">
            <span class="symbol-start">*</span>
            <b class="f-s-n f-w-n f-s-14">发布渠道</b>
          </el-col>
          <el-col :span="12" :offset="1" class="set-content">{{form.channelType}}</el-col>
        </el-row>

        <el-row class="m-t-20">
            <el-col :span="6" class="text-right">
                <b class="f-s-n f-w-n f-s-14">初始阅读量</b>
            </el-col>
            <el-col :span="12" :offset="1" class="set-content">{{form.initReadnum}}</el-col>
        </el-row>



        <el-row class="m-t-20">
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

      <!--<el-row class="m-t-20">-->
        <!--<el-col :span="6" class="text-right">-->
          <!--<b class="f-s-n f-w-n f-s-14">初始收藏量</b>-->
        <!--</el-col>-->
        <!--<el-col :span="12" :offset="1" class="set-content">{{form.defaultFavoriteAmout}}</el-col>-->
      <!--</el-row>-->
      <!--<el-row class="m-t-20">-->
        <!--<el-col :span="6" class="text-right">-->
          <!--<b class="f-s-n f-w-n f-s-14">收藏量增长数</b>-->
        <!--</el-col>-->
        <!--<el-col-->
          <!--:span="12"-->
          <!--:offset="1"-->
          <!--v-if="form.favoriteIncreaseNum"-->
          <!--class="set-content"-->
        <!--&gt;X {{form.favoriteIncreaseNum}}-->
        <!--</el-col>-->
      <!--</el-row>-->

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
        <el-row class="m-t-20" v-if="hideZbContent==2">
            <el-col :span="6" class="text-right">
                <b class="f-s-n f-w-n f-s-14">排序</b>
            </el-col>
            <el-col :span="12" :offset="1" class="set-content">{{form.sort}}</el-col>
        </el-row>
        <el-row class="m-t-20 text-center m-b-20">
            <el-col :span="3" :offset="7">
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
			channelType:'',//发布渠道
		  courseName: "",
		  desc: "",
		  tag: "",
		  category: "",
		  pic: "",
		  video: "",
		  teacher: "",
		  expense: "", //课程费用
		  interestsite: [], //权益设置
		  discuss: "",
		  initReadnum: "", //初始阅读量
		  plusReadnum: "", //增长量
		  buynum: "", //购买量
		  createTime: "",
		  createPeople: "",
		  status: "", //状态
			defaultFavoriteAmout:'',
			favoriteIncreaseNum:''
		},
		hideZbContent: 0
	  };
	},
	mounted () {
	  this.getData();
	},
	methods: {
	  getData () {
		//获取课程详情
		let that = this;
		this.$post("/data/my", {
		  pathL: "/doctor/livecourseInfo/details",
		  id: Number(this.$route.query.id) //课程的id
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
	  dealShow (data) {
		  this.hideZbContent = data.type;
	  },
	  dealShowData (data) {
		if (data) {
		  this.form.courseName = data.courseName;
		  this.form.desc = data.introduction;
		  this.form.tag = this.getTag(data.tagStr);
		  this.form.category = this.getCategory(data.classify);
		  this.form.pic = data.imageUrl;
		  this.form.channelType = data.channel.split(',');
			let arr='';
			this.form.channelType.filter(item => {
				if (item==1){
					arr+=` 哆咖医生 `;
        }else{
					arr+=` 医哆咖 `;
        }
			})
			this.form.channelType=arr;
		  //this.form.video=data.videoUrl;
		  //this.form.videoId = data.videoId; //获取视频的id

		  this.form.teacher = data.doctorName;
		  this.form.expense = "免费"; //课程费用
		  /////////////////////////////////////
		  //this.form.interestsite = this.getInterest(data.equityList); //权益设置
		  this.form.discuss = data.isAllowComment == 0 ? "不允许" : "允许";
		  this.form.initReadnum = data.defaultReadCount; //初始阅读量
		  this.form.plusReadnum = data.increaseCoefficient; //增长量
		  this.form.defaultFavoriteAmout = data.defaultFavoriteAmout; //增长量
		  this.form.favoriteIncreaseNum = data.favoriteIncreaseNum; //增长量


		  this.form.liveTime = data.liveTime; //直播日期
		  this.form.liveUrl = data.liveUrl; //直播日期
		  this.form.playChannel = data.channelId; //直播日期
		  this.form.videoId = data.videoId; //视频的id

		  this.form.createTime = data.createTime;
		  this.form.createPeople = data.sysUserName;
		  this.form.status = data.status; //状态
		  this.form.sort = data.sort; //状态
		  this.loading = false;
		  this.hideZbContent=data.type;

		  if (this.hideZbContent==2) {
			this.getVedioInfo(); //获取播放的视频的信息
		  }

		}
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
