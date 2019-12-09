<template>
  <div>
    <el-form
      v-loading="loading"
      element-loading-text="努力加载中"
      style="width: 700px;"
      size="mini"
      class="m-t-20 f-s-14"
      :rules="rules"
      ref="form"
      :model="form"
      label-width="250px"
    >
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName"></el-input>
      </el-form-item>
      <el-form-item label="课程介绍" prop="desc">
        <el-input type="textarea" :rows="5" v-model="form.desc" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="课程提纲" prop="synopsis">
        <el-input type="textarea" :rows="5" v-model="form.synopsis" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="Tag词" prop="tag">
        <base-tag :list="taglist" @handleClick="getTagClick"></base-tag>
      </el-form-item>
      <el-form-item label="选择分类" prop="category">
        <template v-for="item in form.categoryList">
          <template v-for="itm in item.children">
            <template v-for="im in itm.children">
              <div class="m-b-10" :key="im.label">
                <el-tag class="span-block">{{item.label}}</el-tag>
                <el-tag class="span-block">{{itm.label}}</el-tag>
                <el-tag class="span-block">{{im.label}}</el-tag>
              </div>
            </template>
          </template>
        </template>
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
      <el-form-item label="所属类型" prop="vedioType">
        <el-col :span="8">
          <el-radio-group v-model="form.vedioType">
            <el-radio :label="1">直播</el-radio>
            <el-radio :label="2">回放</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>

      <el-form-item label="视频" prop="video" v-show="form.vedioType==2">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.video" disabled></el-input>
          </el-col>
          <el-col :span="13" :offset="1">
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
      <el-form-item label="直播频道号" prop="playChannel" v-if="form.vedioType==1">
        <el-input v-model="form.playChannel" @blur="judgeChannel" placeholder="请输入直播频道"></el-input>
      </el-form-item>
      <el-form-item label="直播地址" prop="playUrl" v-if="form.vedioType==1">
        <el-input v-model="form.playUrl" placeholder="请输入直播地址"></el-input>
      </el-form-item>
      <el-form-item label="直播日期" prop="playTime" v-if="form.vedioType==1">
        <el-date-picker
          v-model="form.playTime"
          type="datetime"
          placeholder="选择日期时间"
          @change="judgeDateTime"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
        ></el-date-picker>
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
          </el-radio-group>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="expenseVal">
            <el-input
              class="w-60 d-i-b"
              type="number"
              @blur="judgeExpenseVal"
              v-if="showExpenseInput"
              v-model="form.expenseVal"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="是否允许评论" prop="discuss">
        <el-radio-group v-model="form.discuss">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="发布渠道" prop="channelType">
        <el-checkbox-group v-model="form.channelType">
          <el-checkbox :label="1">哆咖医生</el-checkbox>
          <el-checkbox :label="2">医哆咖</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="初始阅读量" prop="initReadnum">
        <el-input v-model="form.initReadnum" @blur="readNumJudge(form.initReadnum,'初始阅读量',1)"></el-input>
      </el-form-item>

      <el-form-item label="阅读量增长系数" prop="plusReadnum">
        <el-input v-model="form.plusReadnum" @blur="readNumJudge(form.plusReadnum,'阅读量增长系数',2)"></el-input>
      </el-form-item>

      <el-form-item label="初始收藏量" prop="defaultFavoriteAmout">
        <el-input v-model="form.defaultFavoriteAmout"
                  @blur="readNumJudge(form.defaultFavoriteAmout,'初始收藏量',1)"></el-input>
      </el-form-item>

      <el-form-item label="收藏量增长数" prop="favoriteIncreaseNum">
        <el-input v-model="form.favoriteIncreaseNum"
                  @blur="readNumJudge(form.favoriteIncreaseNum,'收藏量增长数',2)"></el-input>
      </el-form-item>

      <el-form-item label="排序" v-if="form.vedioType==2">
        <el-input v-model="form.sort" @blur="judgeSortValue" placeholder="请输入1～9999之间的正整数"></el-input>
      </el-form-item>

      <el-row class="m-t-20 text-center m-b-20">
        <el-col :span="8" :offset="12">
          <el-button @click="saveData" :disabled="!isSaveFg" type="primary" size="mini">保存</el-button>
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
	import UploadAuth from "@/views/admin/course/course/add/component/UploadAuth";
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
	export default {
		components: {
			UploadAuth
			//aliPlayer
		},
		data () {
			return {
				pickerOptions: {
					disabledDate (time) {
						let nowData = new Date();
						nowData = new Date(nowData.setDate(nowData.getDate() - 1));
						return time < nowData;
					}
				},
				isShowVedio: false, //默认不显示视频播放器
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
					playhour: "", // 默认选择的小时
					id: "", //课程的id
					courseName: "",
					desc: "",
					synopsis: "", // 提纲
					tag: "",
					playTime: "", //直播日期
					playChannel: "", //直播频道
					vedioType: "", //所属类型
					category: "",
					categoryList: [], //分类列表
					pic: "",
					video: "",
					videoId: "", //视频的返回id
					teacher: {
						name: "",
						id: null
					},
					sort: null,
					playUrl: "", // 直播地址
					expense: 1, //课程费用
					discuss: 1,
					initReadnum: "", //初始阅读量
					plusReadnum: "",//增长量
					favoriteIncreaseNum: "",//收藏量增长数
					defaultFavoriteAmout: "",//初始收藏量
					channelType: [],//发布渠道
				},
				rules: {
					favoriteIncreaseNum: {
						validator: CheckInt,
						trigger: "blur"
					},
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
					channelType: [ {
						required: true,
						message: "请选择发布渠道",
					} ],
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
					playUrl: [
						{required: true, message: "请输入直播地址", trigger: "blur"}
					],
					playChannel: [
						{required: true, message: "请输入直播频道", trigger: "blur"}
					],
					synopsis: [
						{required: true, message: "请输入课程提纲", trigger: "blur"},
						{
							min: 1,
							max: 999,
							message: "长度在 1 到 999 个字符",
							trigger: "blur"
						}
					],

					category: [ {required: true, message: "请选择分类", trigger: "blur"} ],
					playTime: [
						{required: true, message: "请选择直播日期", trigger: "blur"}
					],
					vedioType: [
						{required: true, message: "请选择所属类型", trigger: "blur"}
					],
					expense: [ {required: true,message: "请选择课程费用类型"} ],
					teacher: [
						//绑定讲师
						{
							required: true,
							message: "请选择绑定的讲师"
						}
					],
					video: [ {message: "请上传视频"} ],
					pic: [ {required: true, message: "请上传引导图"} ],
					discuss: [ {required: true} ]
				},
				showVedioUpload: false
			};
		},
		mounted () {
			if (this.$route.query.tag === "edit") {
				this.loading = true;
			}
			else if (this.$route.query.tag === "add") {
				this.loading = false;
			}
			this.getCateTreeData(); //获取疾病分类
		},
		methods: {
			getVedioId (id) {
				//获取视频的id  v-on:showVd="showVedio"
				this.loading = true;
				this.form.video = id;
				this.form.videoId = id;
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
				this.$post("/data/my", {
					pathL: "/doctor/livecourseInfo/details",
					id: this.$route.query.id //课程的id
				})
					.then(res => {
						if (!res.state) {
							that.loading = false;
							that.dealShowData(res.data);
						}
						else {
							that.loading = false;
							that.$message("获取数据失败！");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},

			dealShowData (data) {
				if (data) {
					this.form.id = this.$route.query.id; //课程的id
					this.form.courseName = data.courseName; // 课程名字
					this.form.desc = data.introduction; // 课程描述
					this.form.synopsis = data.outline; // 提纲

					this.form.channelType = data.channel.split(','); // 提纲
					let arr = [];
					this.form.channelType.filter(item => {
						arr.push(Number(item));
					})
					this.form.channelType = arr;
					this.form.vedioType = data.typeName === "回放" ? 2 : 1;

					if (data.tagStr) {
						this.form.tag = data.tagStr; // tag 词
						this.taglist = data.tagStr.split(","); //设置默认的tag 词列表
					}
					this.dealLeavelTree(data.diseaseClassify); //重新疾病节点树

					this.checked = this.getSelectedId(data.diseaseClassify); //设置分类的默认值

					this.form.pic = data.imageUrl;
					this.form.video = data.videoUrl;
					this.form.teacher.name = data.doctorName; //讲师名字
					this.form.teacher.id = data.doctorId; //讲师的id

					this.form.playTime = data.liveTime; //直播日期
					this.form.playUrl = data.liveUrl; // 直播url
					this.form.playChannel = data.channelId; // 直播频道号

					this.form.initReadnum = data.defaultReadCount; // 初始阅读量
					this.form.plusReadnum = data.increaseCoefficient; // 增长系数

					this.form.defaultFavoriteAmout = data.defaultFavoriteAmout; // 初始收藏量
					this.form.favoriteIncreaseNum = data.favoriteIncreaseNum; // 收藏增长系数
					this.form.sort = data.sort; // 排序

					/////////////////////////////////////

					this.form.discuss = data.isAllowComment;
					this.form.initReadnum = data.defaultReadCount; //初始阅读量
					this.form.plusReadnum = data.increaseCoefficient; //增长量

					this.form.videoId = data.videoId; //视频的id
				}
			},
			///////////////新增/////////////////
			getCurrent (tree) {
				// 获取选中的树节点
				if (tree) {
					this.dealLeavelTree(tree);
				}
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
					this.getDetailData(); //获取课程详情
				}
				else if (this.$route.query.tag == "add") {
					// 添加课程
					return;
				}
			},
			getTagClick (data) {
				//获取tag 词
				this.taglist = [];
				this.form.tag = data.join(",");
				this.taglist = data;
			},

			closeTeacher () {
				// 关闭讲师弹窗
				this.showTeachDialog = false;
			},
			getTeacherData (obj) {
				// 获取讲师的选择内容
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
					const im = {
						oneEquity: item.lv1_val,
						twoEquity: item.lv2_val,
						equityLevel: index,
						discount: item.discount
					};
					str.push(im);
				});
				str = JSON.stringify(str);
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

				if (!obj.synopsis) {
					this.$message("请输入课程提纲");
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

				if (!obj.vedioType) {
					this.$message("请选择所属类型");
					return false;
				}

				if (obj.vedioType == 1) {
					// 直播
					if (!obj.playUrl) {
						this.$message("请填写直播地址");
						return false;
					}
					if (!obj.playTime) {
						this.$message("请选择直播日期");
						return false;
					}
					if (!obj.playChannel) {
						this.$message("请选择直播频道");
						return false;
					}
				}
				else {
					// 回放
					if (!obj.video) {
						this.$message("请上传视频");
						return false;
					}
				}

				if (!obj.teacher.id) {
					this.$message("请选择讲师");
					return false;
				}

				if (!obj.expense) {
					this.$message("请选择课程费用类型");
					return false;
				}

				if (obj.expense == 2 && !obj.expenseVal) {
					this.$message("请输入课程费用");
					return false;
				}

				if (obj.discuss == null) {
					this.$message("请选择课程是否评论");
					return false;
				}
				return true;
			},
			formatDate (date) {
				date = date == null ? "" : date;
				if (date !== "") {
					date = new Date(date);
					let dateTime = {
						y: date.getFullYear(),
						M:
							date.getMonth() + 1 < 10
								? "0" + (date.getMonth() + 1)
								: date.getMonth() + 1,
						d: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
						H: date.getHours() < 10 ? `0${ date.getHours() }` : date.getHours(),
						m:
							date.getMinutes() < 10 ? `0${ date.getMinutes() }` : date.getMinutes()
					};
					return `${ dateTime.y }-${ dateTime.M }-${ dateTime.d } ${ dateTime.H }:${
						dateTime.m
						}`;
				}
				else {
					return "";
				}
			},

			saveData () {
				//保存新建内容
				let obj = this.form,
					that = this;
				that.loading = true;
				if (!this.formJudge()) {
					//校验表单的值
					this.loading = false;
					return;
				}
				let url = "/doctor/livecourseInfo/add";
				if (this.$route.query.tag === "edit") {
					url = "/doctor/livecourseInfo/edit";
				}

				let remForm = {
					pathL: url,
					name: obj.courseName, //课程名称
					introduction: obj.desc, //课程描述
					outline: obj.synopsis, // 课程提纲
					tagStr: obj.tag, //tag词
					diseaseClassifies: obj.category, //分类
					imageUrl: obj.pic, //引导图
					type: obj.vedioType, // 直播或者回放
					videoUrl: obj.video, //视频url
					liveUrl: obj.playUrl, //直播地址
					doctorId: obj.teacher.id, // 讲师id
					liveTime: this.formatDate(obj.playTime), // 直播时间
					courseCost: obj.expense, //课程费用类型：1.免费,2.付费
					isAllowComment: obj.discuss, //是否允许评论，0不允许，1允许
					defaultReadCount: obj.initReadnum, //初始化阅读量
					increaseCoefficient: obj.plusReadnum, //增长系数
					sort: obj.sort, // 排序
					id: obj.id, //课程的id
					videoId: obj.videoId,// 视频的id
					defaultFavoriteAmout: obj.defaultFavoriteAmout == '' ? 0 : obj.defaultFavoriteAmout, // 收藏量
					favoriteIncreaseNum: obj.favoriteIncreaseNum == '' ? 1 : obj.favoriteIncreaseNum, // 收藏系数
					channel: obj.channelType.join(',')
				};
				if (obj.vedioType === 1) {
					remForm.channelId = obj.playChannel; //// 视频的频道号
				}

				this.$refs.form.validate(valid => {
					if (valid) {
						that.loading = false;
						that.$post("/data/new", this.$qs.stringify(remForm))
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
									}, 1000);
								}
								else {
									that.$message(res.msg);
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
				let reg = /^[0-9]\d*$/;
				return reg.test(n);
			},
			testSortnumber (n) {
				let reg = /^[0-9]+$/;
				return reg.test(n);
			},

			judgeExpenseVal () {
				let val = this.form.expenseVal;
				if (!this.testEVal(val)) {
					this.$message("付费金额是正数，且只能有两位小数");
				}
			},
			judgeChannel () {
				let val = Number(this.form.playChannel);
				let reg = /^(-?\d+)?$/;
				if (!reg.test(val)) {
					this.$message("频道不能带小数");
					this.form.playChannel = "";
					return;
				}
				if (!(val >= -2147483648 && val <= 2147483647)) {
					this.$message("频道输入区间是 [-2147483648——2147483647]");
					this.form.playChannel = "";
					return;
				}
			},
			judgeDiscount (index) {
				let reg = /^\d+(\.\d{1})?$/;
				let value = this.form.interestSite[ index ].discount;
				if (!reg.test(value)) {
					this.$message("权益折扣只能是正数，且只能有一位小数！");
					return;
				}
				if (value > 9) {
					this.$message("所享折扣必须为1-9的数字！");
					return;
				}
			},
			judgeSortValue () {
				let val = this.form.sort;
				if (!this.testSortnumber(val)) {
					this.$message("请输入数字");
					return;
				}
				else if (val < 1) {
					this.$message("排序值只能是大于1的正整数");
					return;
				}
				else if (val > 9999) {
					this.$message("排序值只能是小于9999的正整数");
					return;
				}
			},
			readNumJudge (val, msg, fg) {
				if (!this.testZnumber(val)) {
					const m = msg + ",必须为正整数";
					this.$message(m);
				}
			},
			getNum (n) {
				return n.replace(/[^0-9]/gi, "");
			},
			judgeDateTime (val) {
				let timestamp = new Date().getTime(); // 当前的时间戳
				//timestamp = timestamp + 2 * 60 * 60 * 1000;
				if (val < timestamp) {
					this.$message("只能选择当前时间之后的时间");
					this.form.playTime = "";
				}
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
