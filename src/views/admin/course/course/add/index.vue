<template>
  <div>
    <el-form
      v-loading="loading"
      element-loading-text="努力加载中"
      style="width: 900px;"
      size="mini"
      class="m-t-20 f-s-14"
      :rules="rules"
      ref="form"
      :model="form"
      label-width="150px"
    >
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName"></el-input>
      </el-form-item>

      <el-form-item label="发布渠道" prop="platformType">
        <el-checkbox-group v-model="form.platformType">
          <el-checkbox :label="1">哆咖医生</el-checkbox>
          <el-checkbox :label="2">医哆咖</el-checkbox>
          <el-checkbox :label="3">哆咖医生web端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="视频" prop="video">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.video" disabled></el-input>
          </el-col>
          <el-col :span="5" :offset="1" v-show="!isDoctorWeb">
            时长：<b class="symbol-start" v-show="!isSaveVideo">时长获取中......</b>{{form.duration}}
          </el-col>
          <el-col :span="7" :offset="1">
            <!--视频上传  -->
            <UploadAuth
              :upType="STSparam.type"
              :name="form.courseName"
              :uId="STSparam.userId"
              :outTime="STSparam.tOtime"
              :size="STSparam.size"
              :num="STSparam.num"
              v-on:showVd="showVedio"
              v-on:getID="getVedioId"
              :reCount="STSparam.retryCount"
            />
            <!--上传结束 -->
          </el-col>
        </el-row>
        <!--  v-if="isShowVedio"-->
        <!--<el-row>-->
        <!--<el-col>-->
        <!--<aliPlayer :vInfo="vedioInfo"/>-->
        <!--</el-col>-->
        <!--</el-row>-->
      </el-form-item>



      <el-form-item label="课程介绍" prop="desc">
        <el-input type="textarea" v-model="form.desc" rows="5"></el-input>
      </el-form-item>

      <el-form-item label="课程内容" prop="courseIntroduction">
        <base-editor style="height: 150px;" v-model="form.courseIntroduction"></base-editor>
      </el-form-item>

      <el-form-item label="Tag词" prop="tag">
        <base-tag :list="taglist" @handleClick="getTagClick"></base-tag>
      </el-form-item>
      <el-form-item label="选择分类" prop="category">
        <span v-for="(item,index) in form.categoryList" :key="index">
          <span v-for="(itm,idx) in item.children" :key="idx">
            <span v-for="(im,id) in itm.children" :key="id">
              <div class="m-b-10" :key="im.typeId">
                <el-tag class="span-block">{{item.label}}</el-tag>
                <el-tag class="span-block">{{itm.label}}</el-tag>
                <el-tag class="span-block">{{im.label}}</el-tag>
              </div>
            </span>
          </span>
        </span>
        <base-tree
          :tree="disseaseTreeData"
          :list="list"
          :checked="checked"
          nodeKey="treeOnlyId"
          @confirm="getCurrent"
          @check="check"
          :defaultProps="defaultProps"
        ></base-tree>
        <!--<el-button size="mini" type="primary" @click="dialogTreeVisible=true">浏览</el-button>-->
      </el-form-item>
      <el-form-item label="引导图" prop="pic">
        <el-row>
          <el-col :span="10">
            <img :src="form.pic" alt class="img-90">
          </el-col>
          <el-col :span="13" :offset="1">
            <base-upload
              :tip="upload.tip"
              :rule="upload.rule"
              :limit="upload.limit"
              @notify="handleUploadImg"
            ></base-upload>
          </el-col>
        </el-row>
      </el-form-item>


      <el-form-item label="绑定讲师" prop="teacher">
        {{form.teacher.name}}
        <el-button
          class="m-l-10"
          type="primary"
          @click="showTeachDialog=true;setTeacherArrDefault()"
          size="mini"
        >选择
        </el-button>
      </el-form-item>

      <el-form-item label="课程费用" prop="expense">
        <el-col :span="8">
          <el-radio-group v-model="form.expense">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="2">付费</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="courseCost">
            <el-input
              placeholder="输入课程金额"
              class="d-i-b"
              type="number"
              @blur="judgeExpenseVal"
              v-if="showExpenseInput"
              v-model="form.courseCost"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item>
            <el-input
              placeholder="输入折扣价"
              class="d-i-b"
              type="number"
              @blur="judgeDiscountedPrice"
              v-if="showExpenseInput"
              v-model="form.discountedPrice"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-form-item>
            <el-input
              placeholder="折扣"
              disabled
              class="w-60 d-i-b"
              type="number"
              v-if="showExpenseInput"
              v-model="form.discount"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item v-show="isDoctorWeb || !equities || !equitiesFamily" label="权益设置" prop="interests">
        <el-row class="m-b-20">
          <el-col :span="8" class="text-center">
            哆咖医生
          </el-col>
          <el-col :span="16" class="text-center">
            医哆咖
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-row class="m-b-10" v-for="(item,index) in form.interestList" :key="item.levelId">
              <el-col :span="3">{{item.levelName}}</el-col>
              <el-col :span="6" :offset="1">所享折扣</el-col>
              <el-col :span="8" :offset="1">
                <el-input :disabled="equities" v-model="item.discount"
                          @blur="judgeDiscount(form.interestList,index)"></el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row class="m-b-10" v-if="index<=11" v-for="(item,index) in form.interestYdkList" :key="item.levelId">
              <template>
                <el-col :span="3" :offset="4">{{item.levelName}}</el-col>
                <el-col :span="6" :offset="1">所享折扣</el-col>
                <el-col :span="8" :offset="1">
                  <el-input :disabled="equitiesFamily" v-model="item.discount"
                            @blur="judgeDiscount(form.interestYdkList,index)"></el-input>
                </el-col>
              </template>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row class="m-b-10" v-if="index>11" v-for="(item,index) in form.interestYdkList" :key="item.levelId">
              <template>
                <el-col :span="3" :offset="1">{{item.levelName}}</el-col>
                <el-col :span="6" :offset="1">所享折扣</el-col>
                <el-col :span="8" :offset="1">
                  <el-input :disabled="equitiesFamily" v-model="item.discount"
                            @blur="judgeDiscount(form.interestYdkList,index)"></el-input>
                </el-col>
              </template>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>


      <el-form-item v-show="isDoctorWeb || !equities || !equitiesFamily" label="是否允许评论" prop="discuss">
        <el-radio-group v-model="form.discuss">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="初始阅读量" prop="initReadnum">
        <el-input v-model="form.initReadnum" @blur="readNumJudge(form.initReadnum,'初始阅读量',1)"></el-input>
      </el-form-item>

      <el-form-item v-show="isDoctorWeb || !equities || !equitiesFamily" label="阅读量增长系数" prop="plusReadnum">
        <el-input v-model="form.plusReadnum" @blur="readNumJudge(form.plusReadnum,'阅读量增长系数',2)"></el-input>
      </el-form-item>

      <el-form-item v-show="isDoctorWeb || !equities || !equitiesFamily" label="初始收藏量" prop="defaultFavoriteAmout">
        <el-input v-model="form.defaultFavoriteAmout"
                  @blur="readNumJudge(form.defaultFavoriteAmout,'初始收藏量',1)"></el-input>
      </el-form-item>

      <el-form-item v-show="isDoctorWeb || !equities || !equitiesFamily" label="收藏量增长数" prop="favoriteIncreaseNum">
        <el-input v-model="form.favoriteIncreaseNum"
                  @blur="readNumJudge(form.favoriteIncreaseNum,'收藏量增长数',2)"></el-input>
      </el-form-item>

      <el-row class="m-t-20 text-center m-b-20">
        <el-col :span="8" :offset="12">
          <el-button @click="saveData" :disabled="!isSaveFg || !isSaveVideo" type="primary" size="mini">保存</el-button>
          <el-button @click="$router.back()" size="mini">取消</el-button>
        </el-col>
      </el-row>
    </el-form>

    <sys-teacher
      v-model="teacherArr"
      :defaultVal.sync="teacherDefault"
      :show.sync="showTeachDialog"
      v-on:getStatus="getTeacherData"
      @closeTeacher="closeTeacher"
    ></sys-teacher>

  </div>
</template>

<script>
	import UploadAuth from "./component/UploadAuth.vue";
	//import aliPlayer from './component/aliPlayer/aliPlayer'
	import { isValidNumber } from "@/utils/RegExp.js";

	const CheckInt = (rule, value, callback) => {
		if (!value) {
			callback();
		}
		else if (!isValidNumber(value)) {
			callback(new Error("请输入整数数字"));
		}
		else {
			callback();
		}
	};

	let getVideoTime = null

	export default {
		components: {
			UploadAuth
			//aliPlayer
		},
		data () {
			return {
				isDoctorWeb: true,//是否显示web端相关
				equities: true,
				equitiesFamily: true,
				isShowVedio: false, //默认不显示视频播放器
				isSaveVideo: false,//是否拿到时长可以启动保存
				vedioInfo: {
					//视频的信息
					playAuth: null, //播放凭证
					requestId: null, //返回的id
					coverURL: null, //视频封面图地址
					videoId: null, //视频id
					playUrl: null //播放的url
				},
				STSparam: {
					userId: "250797151670904013", //阿里云服务器id
					tOtime: 60000, //请求超时的时间
					size: 2, //视频大小 ，M 计
					num: 1, //上传个数
					retryCount: 5, //上传重试次数
					type: [
						"video/mp4",
						"video/mpg",
						"video/rmvb",
						"video/avi",
						"video/wmv",
						"video/x-flv",
						"video/quicktime"
					] //上传格式限制
				},
				teacherDefault: {
					id: null,
					name: null
				},
				defaultProps: {
					children: "children",
					label: "label"
				},
				dialogTreeVisible: false,
				taglist: [], //tag 词列表
				list: [],
				checked: [],
				////////////////////////
				loading: false, //加载中
				disseaseTreeData: [],
				isSaveFg: true, //保存按钮是否可用
				showExpenseInput: false, //开启付费的输入框
				showTeachDialog: false,
				teacherArr: [], //选择的教师列表
				upload: {
					limit: 1, //上传文件个数限制
					tip: "",
					type: "file",
					rule: {
						type: [ "image/jpg", "image/gif", "image/jpeg", "image/png" ],
						size: 100
					}
				},
				addNum: 0, //增加权益标识
				form: {
					courseIntroduction: '',//课程内容
					platformType: [],
					discount: "", // 折扣，不做后台提交
					id: "", //课程的id
					courseName: "",
					desc: "",
					tag: "",
					category: "",
					categoryList: [], //分类列表
					pic: "",
					video: "",
					videoId: "", //视频的返回id
					duration: '',//时长
					teacher: {
						name: "",
						id: null
					},
					courseCost: null, // 折扣价
					discountedPrice: null, // 折扣
					buyCount: null, //购买数量
					expense: null, //课程费用
					expenseVal: null, //付费输入比例
					interestList: [], // 多咖医生
					interestSite: [], //多咖医生-权益设置
					interestYdkList: [],// 医哆咖权益列表
					interestYdkSite: [],// 医哆咖-权益列表
					discuss: 1,
					initReadnum: "", //初始阅读量
					plusReadnum: "",//增长量
					defaultFavoriteAmout: "",//收藏量
					favoriteIncreaseNum: "",//收藏系数
				},
				rules: {
					favoriteIncreaseNum: {
						validator: CheckInt,
						trigger: "blur"
					},
					courseIntroduction: [
						{trigger: "blur", required: true},
						{min: 1, max: 10000, message: "长度在 1 到 10000 个字符", trigger: "blur"}
					],
					defaultFavoriteAmout: {
						validator: CheckInt,
						trigger: "blur"
					},
					initReadnum: {
						validator: CheckInt,
						trigger: "blur"
					},
					plusReadnum: {
						validator: CheckInt,
						trigger: "blur"
					},
					platformType: [
						{required: true, message: "请输入发布渠道", trigger: "blur"}
					],
					courseName: [
						{required: true, message: "请输入课程名称", trigger: "blur"},
						{min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
					],
					desc: [
						{required: true, message: "请输入课程介绍", trigger: "blur"},
						{
							min: 1,
							max: 999,
							message: "长度在 1 到 999 个字符",
							trigger: "blur"
						}
					],
					category: [ {required: true, message: "请选择分类", trigger: "blur"} ],
					expense: [ {required: true} ],
					teacher: [
						//绑定讲师
						{required: true}
					],
					video: [ {required: true, message: "请上传视频"} ],
					pic: [ {required: true, message: "请上传引导图"} ],
					discuss: [ {required: true} ]
				}
			};
		},
		mounted () {
			if (this.$route.query.tag === "edit") {
				this.loading = true;
				this.countDiscount();
			}
			else if (this.$route.query.tag === "add") {
				this.loading = false;
			}
			this.getCateTreeData(); //获取疾病分类

		},
		watch: {
			"form.platformType" () {
				this.equities = true;
				this.equitiesFamily = true;
				this.isDoctorWeb = true;
				this.form.platformType.forEach(item => {
					if (item == 1) {
						this.equities = false;//多咖医生
					}
					else if (item == 2) {
						this.equitiesFamily = false;//医多咖
					}
					else if (item == 3) {
						this.isDoctorWeb = false;//哆咖医生web端
					}
				})
				//debugger
			},
			"form.expense" () {
				//开启和关闭付费的输入框
				if (this.form.expense == 2) {
					this.showExpenseInput = true;
				}
				else {
					this.showExpenseInput = false;
				}
			}
		},
		methods: {
			getSecond (time) {
				//let time = '30.255';
				if (time.includes('.')) {
					time = time.split('.')[ 0 ];
				}
				else {
					time = time;
				}
				time = Number(time);
				let min = Math.floor(time / 60) < 10 ? `0${ Math.floor(time / 60) }` : Math.floor(time / 60);
				let sec = time % 60;
				let s = `${ min }:${ sec }`;
				return s;
			},
			getVedioId (id) {
				//获取视频的id  v-on:showVd="showVedio"
				this.loading = true;
				this.form.video = id;
				this.form.videoId = id;

				this.isSaveVideo = false;
				this.form.duration = '';
				if(!this.isDoctorWeb){
					this.getVideoTime();
        }else{
					this.isSaveVideo = true;
        }
			},
      getVideoTime(){
				let that = this;
				getVideoTime = setInterval(() => {
					that.$get('/data/my', {
						pathL: '/doctor/alimedia/getPlayInfo',
						videoId: this.form.videoId
					}).then(res => {
						if (res.state === 0) {
							that.isSaveVideo = true;
							//debugger
							that.form.duration = that.getSecond(res.data.videoBase.duration);
							clearInterval(getVideoTime);
							getVideoTime = null;
						}
					}).catch(err => {
						that.$message(err);
					})
				}, 5000);
      },
			showVedio (fg) {
				//展示视频
				this.loading = false;
				// let that=this;
				// this.$get('/data/my',{
				//     pathL:'/doctor/alimedia/getVideoPlayAuth',
				//     videoId:this.form.videoId
				// }).then(res=>{
				//     if(!res.state) {
				//         //that.isShowVedio = fg;
				//         that.vedioInfo.playAuth = res.data.playAuth;//播放凭证
				//         that.vedioInfo.requestId = res.data.requestId;//返回的id
				//         that.vedioInfo.coverURL = res.data.coverURL; //视频封面图地址
				//         that.vedioInfo.videoId = res.data.videoId;//视频id
				//
				//         that.getPlayUrl();
				//     }
				// }).catch(err=>{
				//     console.log(err);
				// })
			},
			getPlayUrl () {
				//获取播放的地址
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/alimedia/getPlayInfo",
					videoId: this.form.videoId
				})
					.then(res => {
						if (!res.state) {
							that.loading = false;
							that.form.video = res.data.playInfoList[ 0 ].playURL;
							that.vedioInfo.playUrl = res.data.playInfoList[ 0 ].playURL; //视频播放地址
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			///////////详情的////////////////
			setTeacherArrDefault () {
				this.teacherDefault = this.form.teacher;
			},
			getDetailData () {
				//获取课程详情
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getCourseInfo",
					courseId: this.$route.query.id //课程的id
				})
					.then(res => {
						if (!res.state) {
							that.loading = false;
							//that.$message('获取数据成功');
							that.dealShowData(res.data);
						}
						else {
							that.loading = false;
							that.$message("获取数据失败");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealShowData (data) {
				if (data) {
					this.form.id = this.$route.query.id; //课程的id
					this.form.courseName = data.name;
					this.form.desc = data.introduction;
					this.form.tag = data.tagStr;

					if (data.tagStr !== "") {
						this.taglist = data.tagStr.split(","); //设置默认的tag 词列表
					}

					this.dealLeavelTree(data.diseaseClassify); //重新重置节点树
					this.checked = this.getSelectedId(data.diseaseClassify); //设置分类的默认值

					this.form.pic = data.imageUrl;
					this.form.video = data.videoUrl;
					this.form.duration = data.duration;//时长
					this.form.teacher.name = data.lecturerName; //讲师名字
					this.form.teacher.id = data.lecturer; //讲师的id

					this.form.expense = data.costType; //课程类型，免费还是付费
					this.form.courseCost = data.courseCost; //课程的费用
					this.form.discountedPrice = data.discountedPrice; //课程输入折扣
					/////////////////////////////////////

					this.form.interestList = this.dealInterestList(data.equityInfo); //权益设置
					this.form.interestYdkList = this.dealInterestList(data.equityInfoFamily); //权益设置

					data.platformType = data.platformType.split(',');
					let arr = [];
					data.platformType.forEach(item => {
						arr.push(Number(item));
					})
					this.form.platformType = arr; //权益设置
					this.form.courseIntroduction = data.courseIntroduction; //权益设置

					this.form.discuss = data.isAllowComment;
					this.form.initReadnum = data.defaultReadCount; //初始阅读量
					this.form.plusReadnum = data.increaseCoefficient; //增长量


					this.form.defaultFavoriteAmout = data.defaultFavoriteAmout; // 初始收藏量
					this.form.favoriteIncreaseNum = data.favoriteIncreaseNum; // 收藏增长系数

					this.form.buyCount = data.buyCount; //购买数量

					this.form.videoId = data.videoId; //视频的id
					this.countDiscount(); // 计算折扣
					this.isSaveVideo = true;
				}
			},
			///////////////新增/////////////////
			getCurrent (tree) {
				// 获取选中的树节点
				if (tree) {
					this.dealLeavelTree(tree);
				}
			},
			dealInterestList (data) {
				data.forEach(item => {
					item.levelId = Number(item.levelId);
				});

				return data;
			},
			dealFirstTreeNode (one, two) {
				//获取1级
				one.forEach(item => {
					two.forEach(itm => {
						if (typeof itm.parentId == "string") {
							if (Number(itm.parentId.replace("_", "")) == item.typeId) {
								item.children.push(itm);
							}
						}
						else {
							if (itm.parentId == item.typeId) {
								item.children.push(itm);
							}
						}
					});
				});
				return one;
			},
			getSelectedId (tree) {
				let arr = [];
				tree.forEach(item => {
					if (item.level == 3) {
						let a = Number(item.onlyFlag.replace(/\_/g, ""));
						arr.push(a);
					}
				});
				return arr;
			},
			dealLeavelTree (tree) {
				//处理层级节点对应关系
				this.form.categoryList = [];
				let First = [],
					second = [],
					threed = [];
				tree.forEach((item, index) => {
					const arr = {
						id: item.id,
						typeId: Number(item.id.replace("_", "")), //唯一id
						label: item.label,
						level: item.level
					};
					switch (item.level) {
						case 1: {
							arr.children = [];
							First.push(arr);
						}
							break;
						case 2: {
							arr.children = [];
							arr.parentId = item.parentId;
							second.push(arr);
						}
							break;
						case 3: {
							arr.parentId = item.parentId;
							threed.push(arr);
						}
							break;
					}
				});
				second = this.dealFirstTreeNode(second, threed); //挂钩2级和3级
				First = this.dealFirstTreeNode(First, second); //挂钩1级和2级
				this.form.categoryList = First;
				this.form.category = this.dealCategoryReqStr(First);
			},
			dealCategoryReqStr (data) {
				//处理分类的请求数据
				let arr = [];

				function changeNum (str) {
					let a = Number(str.split("_")[ 1 ]);
					return a;
				}

				data.forEach(item => {
					if (item.children) {
						item.children.forEach(itm => {
							if (itm.children) {
								itm.children.forEach(im => {
									arr.push({
										baseId: changeNum(item.id), //一级
										departmentId: changeNum(itm.id), //二级
										diseaseId: changeNum(im.id) //三级
									});
								});
							}
						});
					}
				});
				if (arr.length != 0) {
					arr = JSON.stringify(arr);
				}
				return arr;
			},
			check (item, data) {
				// 选中复选框钩子
				this.$emit("check", {item, data});
			},
			getCateTreeData () {
				//获取疾病树
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getDiseaseClassifies"
				})
					.then(res => {
						if (!res.state) {
							that.dealTreeData(res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealTreeData (data) {
				//重新赋值
				let that = this;
				this.disseaseTreeData = [];
				data.forEach((item, index) => {
					//获取一级树
					let it = {
						typeId: Number(item.id.replace("_", "")), //唯一id
						treeOnlyId: Number(item.onlyFlag.replace(/\_/g, "")), //唯一id
						id: item.id,
						label: item.name,
						level: item.level,
						disabled: true, //禁用一级分类点击
						children: []
					};
					if (item.children) {
						item.children.forEach((itm, val) => {
							//获取二级树
							const im = {
								typeId: Number(itm.id.replace("_", "")), //
								treeOnlyId: Number(itm.onlyFlag.replace(/\_/g, "")), //唯一id
								parentId: Number(itm.parentId.replace("_", "")), //节点标识
								id: itm.id,
								label: itm.name,
								level: itm.level,
								disabled: true, //禁用二级分类点击
								children: []
							};
							if (itm.children) {
								itm.children.forEach((ite, val) => {
									//获取二级树
									const ime = {
										typeId: Number(ite.id.replace("_", "")),
										treeOnlyId: Number(ite.onlyFlag.replace(/\_/g, "")), //唯一id
										parentId: Number(ite.parentId.replace("_", "")),
										id: ite.id,
										label: ite.name,
										level: ite.level
									};
									im.children.push(ime);
								});
							}
							it.children.push(im);
						});
					}
					that.disseaseTreeData.push(it);
				});

				if (this.$route.query.tag == "edit") {
					this.getDetailData(); //获取疾病详情
				}
				else if (this.$route.query.tag == "add") {
					this.getLv(); //获取权益的等级
					this.getYdkLv(); //获取权益的等级
					return;
				}
			},
			getTagClick (data) {
				//获取tag 词
				this.taglist = [];
				this.form.tag = data.join(",");
				this.taglist = data;
			},
			getLv () {
				//获取权益等级的值
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getEquityList"
				}).then(res => {
					if (!res.state) {
						that.form.interestList = res.data;
					}
				});
			},
			getYdkLv () {
				//获取医哆咖权益等级的值
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/course/getFamilyHonourLevelList"
				}).then(res => {
					if (!res.state) {
						that.form.interestYdkList = res.data;
					}
				});
			},

			closeTeacher () {
				this.showTeachDialog = false;
			},
			getTeacherData (obj) {
				this.closeTeacher();

				this.form.teacher.name = obj.name;
				this.form.teacher.id = obj.id;
			},
			handleUploadImg (url) {
				if (url.length) {
					this.form.pic = url[ 0 ].url;
				}
				else {
					//this.form.pic='';
				}
			},
			dealEquities (data) {
				//规范请求的权益的参数值
				let str = [];
				data.forEach((item, index) => {
					if (item.discount !== null) {
						const im = {
							levelId: item.levelId,
							levelName: item.levelName,
							discount: item.discount
						};
						str.push(im);
					}
				});
				str = JSON.stringify(str);
				if (str === "[]") {
					str = "";
				}
				return str;
			},
			formJudge () {
				let that = this,
					obj = this.form;
				if (!obj.courseName) {
					this.$message("请输入课程名称");
					return false;
				}
				if (!obj.desc) {
					this.$message("请输入课程介绍");
					return false;
				}
				if (!obj.courseIntroduction) {
					this.$message("请输入课程内容");
					return false;
				}
				if (obj.category == 0) {
					this.$message("请选择课程分类");
					return false;
				}
				if (!obj.pic) {
					this.$message("请上传引导图");
					return false;
				}
				if (!obj.video) {
					this.$message("请上传视频");
					return false;
				}

				// if (!obj.duration) {
				// 	this.$message("上传视频没有大小不能正常播放");
				// 	return false;
				// }
				if (!obj.teacher.id) {
					this.$message("请选择讲师");
					return false;
				}
				if (!obj.expense) {
					this.$message("请选择课程费用类型");
					return false;
				}

				if (obj.expense == 2 && !obj.courseCost) {
					this.$message("请输入课程费用");
					return false;
				}


				if (obj.discuss == null) {
					this.$message("请选择课程是否评论");
					return false;
				}
				return true;
			},
			saveData () {
				//保存新建内容
				let obj = this.form,
					that = this;

				this.loading = true;
				if (obj.expense == 1) {
					obj.expenseVal = "0";
				}
				if (!this.formJudge()) {
					//校验表单的值
					this.loading = false;
					return;
				}

				this.$refs.form.validate(valid => {
					if (valid) {
						let platformType = that.form.platformType.join(',');

						let equities = this.equities ? '' : this.dealEquities(obj.interestList);
						let equitiesFamily = this.equitiesFamily ? '' : this.dealEquities(obj.interestYdkList);
						//debugger
						//return;
						that.loading = true;
						that.$post(
							"/data/new",
							this.$qs.stringify({
								pathL: "/doctor/course/addOrEdit",
								tagStr: obj.tag, //tag词
								id: obj.id, //课程的id
								name: obj.courseName, //课程名称
								introduction: obj.desc, //课程描述
								diseaseClassifies: obj.category, //分类
								imageUrl: obj.pic, //引导图
								videoType: 1, //视频类型
								videoUrl: obj.video, //视频url
								costType: obj.expense, //课程费用类型：1.免费,2.付费
								courseCost: obj.courseCost, //课程费用
								discountedPrice: obj.discountedPrice, //课程折扣
								isAllowComment: obj.discuss, //是否允许评论，0不允许，1允许
								defaultReadCount: obj.initReadnum, //预设阅读数量
								increaseCoefficient: obj.plusReadnum, //增长量
								lecturer: obj.teacher.id, //讲师，医生id
								platformType,//发布渠道
								equities, //课程关联权益
								equitiesFamily, //课程关联权益
								videoId: obj.videoId,// 视频的id
								duration: obj.duration,//视频时长
								courseIntroduction: obj.courseIntroduction,//课程内容
								defaultFavoriteAmout: obj.defaultFavoriteAmout, // 收藏量
								favoriteIncreaseNum: obj.favoriteIncreaseNum // 收藏系数
							})
						)
							.then(res => {
								that.loading = false;
								if (!res.state && res.state != undefined) {
									if (that.$route.query.tag == "add") {
										//防止添加课程的时候重复提交
										that.isSaveFg = false;
									}
									that.$message("保存成功!");
									setTimeout(function () {
										that.$router.back();
										//that.saveVideoTime();
									}, 1000);
								}
								else {
									that.$message("保存失败！");
								}
							})
							.catch(err => {
								console.log(err);
							});

					}
					else {
						that.loading = false;
						that.$message("请填写正确表单信息!");
					}
				})
			},

			testEVal (n) {
				//两位正整数的校验
				let reg = /^\d+(\.\d{1,2})?$/;
				return reg.test(n);
			},
			testZnumber (n) {
				let reg = /^[0-9]+$/;
				return reg.test(n);
			},
			judgeExpenseVal () {
				let val = this.form.courseCost;
				if (!this.testEVal(val)) {
					this.$message("付费金额是正数，且只能有两位小数");
				}
			},
			testOneNum (n) {
				let reg = /^\d+(\.\d{1})?$/;
				if (!reg.test(n)) {
					this.$message("折扣只能是正数，且只能有一位小数！");
					return false;
				}
				if (n > 9) {
					this.$message("所享折扣必须为1-9的数字！");
					return false;
				}
				return true;
			},
			countDiscount () {
				//计算折扣
				let discount = (this.form.discountedPrice / this.form.courseCost) * 10;
				this.form.discount = discount.toFixed(1);
			},
			judgeDiscountedPrice () {
				let val = Number(this.form.discountedPrice);
				let val1 = Number(this.form.courseCost);
				if (!val) {
					this.$message("折扣价不能等于 0！");
					this.form.discountedPrice = "";
					return;
				}

				if (val > val1) {
					this.$message("折扣价不能大于课程金额！");
					this.form.discountedPrice = "";
					return;
				}
				if (!this.testEVal(val)) {
					this.$message("折扣的金额是正数，且只能有两位小数");
				}
				this.countDiscount();
			},
			judgeDiscount (obj, index) {
				let value = obj[ index ].discount;
				if (!this.testOneNum(value)) {
					obj[ index ].discount = "";
				}
			},
			readNumJudge (val, msg, fg) {
				if (!this.testZnumber(val)) {
					const m = msg + ",必须为整数数字";
					this.$message(m);
				}
			},
			getNum (n) {
				return n.replace(/[^0-9]/gi, "");
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
