<template>
  <div class="case-edit" v-loading="loading && type !== 'add'">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="150px"
      style="width: 500px"
    >
      <el-form-item label="绑定医生" prop="doctorName">
        {{ form.doctorName }}
        <el-button size="mini" type="primary" @click="bindDinfo">绑定</el-button>
      </el-form-item>
      <!--<el-form-item label="医生图片" prop="doctorImage">-->
      <!--<base-upload :fileList="fileList" :limit="1" @notify="handleDoctorUpload"></base-upload>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="列表图" prop="asd">-->
      <!--<base-upload :fileList="imgfileList" :limit="1" @notify="handleImgUpload"></base-upload>-->
      <!--</el-form-item>-->
      <!--<el-form-item v-for="item in text" :key="item.name" :label="item.name" :prop="item.model">-->
      <!--<el-input v-model="form[item.model]"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="医生科室" prop="doctorDepartment">-->
      <!--<base-tree-->
      <!--:tree="doctorTree"-->
      <!--:list="doctorList"-->
      <!--nodeKey="levelType"-->
      <!--@confirm="getDoctorCurrent"-->
      <!--@check="check"-->
      <!--:expanded="doctorExpanded"-->
      <!--:checked="doctorChecked"-->
      <!--&gt;</base-tree>-->
      <!--</el-form-item>-->
      <el-form-item label="病例标题" prop="diseasesTitle">
        <el-input v-model="form.diseasesTitle"></el-input>
      </el-form-item>
      <el-form-item label="选择科室分类" prop="belongedType">
        <base-tree
          :tree="tree"
          :list="list"
          nodeKey="levelType"
          @confirm="getCurrent"
          :expanded="expanded"
          :checked="checked"
        ></base-tree>
      </el-form-item>
      <el-form-item v-for="item in textarea" :key="item.name" :label="item.name" :prop="item.model">
        <el-input
          v-model="form[item.model]"
          type="textarea"
          :placeholder="item.name === '基本信息'?'例如：患者      女    21岁':''"
        ></el-input>
        <base-upload
          style="margin-top: 20px"
          :fileList="fileLists"
          v-if="item.name==='辅助检查'"
          @notify="handleUpload"
        ></base-upload>
      </el-form-item>
      <el-form-item label="是否允许评论">
        <el-radio-group v-model="form.allowDiscussion">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="初始阅读量" prop="originalReadAmount">
        <el-input v-model="form.originalReadAmount" placeholder="请输入数字"></el-input>
      </el-form-item>
      <el-form-item label="阅读量增长系数 ×" prop="readamountAddrule">
        <el-input v-model="form.readamountAddrule" placeholder="请输入数字"></el-input>
      </el-form-item>
      <!--1.9新增-->
      <el-form-item label="初始收藏量" prop="defaultFavoriteAmout">
        <el-input v-model="form.defaultFavoriteAmout" placeholder="请输入数字"></el-input>
      </el-form-item>
      <el-form-item label="收藏量增长系数 ×" prop="favoriteIncreaseNum">
        <el-input v-model="form.favoriteIncreaseNum" placeholder="请输入数字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="$router.back()">取 消</el-button>
      </el-form-item>
    </el-form>
    <sys-bindDoctor
      ref="bindDoctor"
      v-model="teacherArr"
      :defaultVal.sync="teacherDefault"
      :show.sync="showTeachDialog"
      v-on:getStatus="getTeacherData"
      @closeTeacher="closeTeacher"
    ></sys-bindDoctor>
  </div>
</template>

<script>
	import { isValidNumber } from "@/utils/RegExp.js";

	const CheckInt = (rule, value, callback) => {
		if (!value) {
			callback();
		}
		else if (!isValidNumber(value)) {
			callback(new Error("请输入正确的信息"));
		}
		else {
			callback();
		}
	};
	export default {
		name: "CaseEdit",
		//components:{sysBindDoctor},
		data () {
			return {
				type: this.$route.params.type,
				loading: false,
				form: {
					publisher: '',//发布人
					doctorName: '',
					doctorId: null,
					doctorImage: "",
					guideImages: "",
					hospitalName: "",
					doctorPosition: "",
					doctorProfession: "",
					doctorDepartment: '',
					diseasesTitle: "",
					belongedType: "",
					diseasesContent: {},
					// ------
					baseInfo: "",
					tell: "",
					currentDisease: "",
					personal: "",
					past: "",
					marriage: "",
					menstruation: "",
					trauma: "",
					poisoning: "",
					metalTour: "",
					family: "",
					physicalExamination: "",
					auxiliary: "",
					diagnosis: "",
					Identification: "",
					treatment: "",
					analysis: "",
					// ------
					allowDiscussion: 1,
					diseasesImages: [],
					originalReadAmount: "",
					readamountAddrule: "",
					defaultFavoriteAmout: "",//初始收藏量
					favoriteIncreaseNum: "",//收藏量增长系数
					secondLevelIds: "",
					platformType: 0, //平台类型
				},
				rules: {
					doctorName: {
						required: true,
						message: "请选择绑定医生",
						trigger: "blur"
					},
					diseasesTitle: [
						{
							required: true,
							message: "请输入病例标题",
							trigger: "blur"
						},
						{min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}
					],
					belongedType: {
						required: true,
						message: "请选择科室分类",
						trigger: "blur"
					},
					baseInfo: {
						required: true,
						message: "请输入病例内容的基本信息",
						trigger: "blur"
					},
					tell: {
						required: true,
						message: "请输入病例内容的主诉",
						trigger: "blur"
					},
					currentDisease: {
						required: true,
						message: "请输入病例内容的现病史",
						trigger: "blur"
					},
					past: {
						required: true,
						message: "请输入病例内容的既往史",
						trigger: "blur"
					},
					physicalExamination: {
						required: true,
						message: "请输入病例内容的查体",
						trigger: "blur"
					},
					auxiliary: {
						required: true,
						message: "请输入病例内容的辅助检查",
						trigger: "blur"
					},
					diagnosis: {
						required: true,
						message: "请输入病例内容的诊断",
						trigger: "blur"
					},
					Identification: {
						required: true,
						message: "请输入病例内容的鉴别诊断",
						trigger: "blur"
					},
					treatment: {
						required: true,
						message: "请输入病例内容的治疗",
						trigger: "blur"
					},
					analysis: {
						required: true,
						message: "请输入病例内容的分析总结",
						trigger: "blur"
					},
					originalReadAmount: {
						validator: CheckInt,
						trigger: "blur"
					},
					readamountAddrule: {
						validator: CheckInt,
						trigger: "blur"
					},
					defaultFavoriteAmout: {
						validator: CheckInt,
						trigger: "blur"
					},
					favoriteIncreaseNum: {
						validator: CheckInt,
						trigger: "blur"
					}
				},
				treeTotal: [],
				doctorList: [],
				doctorTree: [],
				doctorExpanded: [],
				doctorChecked: [],
				expanded: [],
				checked: [],
				tree: [],
				list: [],
				text: [
					{
						name: "医生姓名",
						model: "doctorName"
					},
					{
						name: "医生职称",
						model: "doctorPosition"
					},
					{
						name: "医院名称",
						model: "hospitalName"
					},
					{
						name: "医生擅长",
						model: "doctorProfession"
					}
				],
				textarea: [
					{
						name: "基本信息",
						model: "baseInfo"
					},
					{
						name: "主诉",
						model: "tell"
					},
					{
						name: "现病史",
						model: "currentDisease"
					},
					{
						name: "个人史",
						model: "personal"
					},
					{
						name: "既往史",
						model: "past"
					},
					{
						name: "婚育史",
						model: "marriage"
					},
					{
						name: "月经史",
						model: "menstruation"
					},
					{
						name: "外伤及手术史",
						model: "trauma"
					},
					{
						name: "中毒及药物过敏史",
						model: "poisoning"
					},
					{
						name: "冶游史",
						model: "metalTour"
					},
					{
						name: "家族史",
						model: "family"
					},
					{
						name: "查体",
						model: "physicalExamination"
					},
					{
						name: "辅助检查",
						model: "auxiliary"
					},
					{
						name: "诊断",
						model: "diagnosis"
					},
					{
						name: "鉴别诊断",
						model: "Identification"
					},
					{
						name: "治疗",
						model: "treatment"
					},
					{
						name: "分析总结",
						model: "analysis"
					}
				],
				fileList: [],
				imgfileList: [],
				fileLists: [],
				//绑定医生
				teacherArr: [], //选择的教师列表
				teacherDefault: {
					id: null,
					name: null
				},
				showTeachDialog: false,
			};
		},
		mounted () {
			this.getTree();
			// console.log(this.$route.params.type);
			// 因为新增和编辑是共用同一页面（动态路由），下面是判断是修改得时候调用接口

			if (this.type === "update") {
				this.getInfo(this.$route.query.id);
			}
		},
		methods: {
			bindDinfo () {//绑定医生
				this.teacherDefault.id = this.form.doctorId;
				this.teacherDefault.name = this.form.doctorName;
				this.showTeachDialog = true;

				this.$refs.bindDoctor.search();
			},
			closeTeacher () {
				this.teacherDefault = {
					id: null,
					name: null
				};
				this.showTeachDialog = false;
			},
			getTeacherData (obj) {
				// 获取讲师的选择内容
				this.closeTeacher();
				this.form.doctorName = obj.name;
				this.form.ownedSecondLev = obj.deptName;
				this.form.doctorDepartment = obj.deptName;

				this.form.hospitalName = obj.hospitalName;
				this.form.doctorPosition = obj.titleName;

				this.form.doctorId = obj.id;
			},
			// 图片
			handleUpload (data) {
				this.form.diseasesImages = data.map(item => ({
					name: item.name,
					url: item.url
				}));
			},
			handleImgUpload (data) {
				if (data.length !== 0) {
					this.form.guideImages = data[ 0 ].url;
				}
				else {
					this.form.guideImages = "";
				}
			},
			// 获取tree
			getTree () {
				this.$post("/data/my", {
					pathL: "/doctor/typicalDiseasesArticle/getDepartmentList"
				}).then(res => {
					if (res.state === 0) {
						if (res.data.firstMenuList) {
							const lv1 = res.data.firstMenuList;
							const lv2 = res.data.secondLevelMenu;

							const lv1s = JSON.parse(JSON.stringify(lv1));
							const lv2s = JSON.parse(JSON.stringify(lv2));
							this.treeTotal = {lv1s, lv2s};

							lv1s.forEach(item => {
								item.children = lv2s.filter(i => item.id === i.parentId);
								item.disabled = true;
							});
							this.doctorTree = lv1s;
							const tree = JSON.parse(JSON.stringify(lv1s));
							tree.forEach(item => {
								delete item.disabled;
							});
							this.tree = tree;
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
			// 医生科室选中钩子
			check (data) {
				const isSelect = data.data.checkedKeys.length !== 0;
				const {lv1s, lv2s} = JSON.parse(JSON.stringify(this.treeTotal));
				const levelType = data.item.levelType;
				const parentId = `levelType1_${ data.item.parentId }`;
				if (isSelect) {
					lv2s.forEach(item => {
						if (item.levelType !== levelType) {
							item.disabled = true;
						}
					});
					lv1s.forEach(item => {
						item.children = lv2s.filter(i => item.id === i.parentId);
						item.disabled = true;
					});
					this.doctorTree = lv1s;
					this.doctorChecked = [ levelType ];
				}
				else {
					lv1s.forEach(item => {
						item.children = lv2s.filter(i => item.id === i.parentId);
						item.disabled = true;
					});
					this.doctorTree = lv1s;
					this.doctorChecked = [];
				}
				this.doctorExpanded = [ parentId ];
			},
			// 医生图片
			handleDoctorUpload (data) {
				if (data.length !== 0) {
					this.form.doctorImage = data[ 0 ].url;
				}
				else {
					this.form.doctorImage = "";
				}
			},
			// 医生科室确定分类
			getDoctorCurrent (now) {
				// this.doctorList = now.map(item => item.label);
				// this.form.doctorDepartment = now;
				// const ownedSecondLev = now.filter(item =>
				// 	item.levelType.includes("levelType2")
				// );
				// debugger
				//
				// this.form.ownedSecondLev = ownedSecondLev
				// 	.map(item => item.label)
				// 	.join(",");
			},
			// 疾病科室确定分类
			getCurrent (now) {
				//debugger
				this.list = now.map(item => item.label);
				this.form.belongedType = now;
				const ids = now.filter(item => item.levelType.includes("levelType2"));
				this.form.secondLevelIds = ids.map(item => item.id).join(",");
				this.form.ownedSecondLev = now[ 0 ].children[ 0 ].label;
			},
			// 提交
			submit () {
				//this.getDoctorCurrent();
				this.$refs.form.validate(valid => {
					if (valid) {
						const form = {...this.form};
						const data = {
							pathL: "/doctor/typicalDiseasesArticle/addDiseasesArticle",
							doctorImage: form.doctorImage,
							guideImages: form.guideImages,
							doctorName: form.doctorName,
							doctorId: form.doctorId,
							hospitalName: form.hospitalName,
							doctorPosition: form.doctorPosition,
							doctorProfession: form.doctorProfession,
							doctorDepartment: JSON.stringify(JSON.parse(form.doctorDepartment)),
							diseasesTitle: form.diseasesTitle,
							belongedType: JSON.stringify(form.belongedType),
							diseasesContent: JSON.stringify({
								baseInfo: form.baseInfo,
								tell: form.tell,
								currentDisease: form.currentDisease,
								personal: form.personal,
								past: form.past,
								marriage: form.marriage,
								menstruation: form.menstruation,
								trauma: form.trauma,
								poisoning: form.poisoning,
								metalTour: form.metalTour,
								family: form.family,
								physicalExamination: form.physicalExamination,
								auxiliary: form.auxiliary,
								diagnosis: form.diagnosis,
								Identification: form.Identification,
								treatment: form.treatment,
								analysis: form.analysis
							}),
							allowDiscussion: form.allowDiscussion,
							diseasesImages: JSON.stringify(form.diseasesImages),
							originalReadAmount: form.originalReadAmount == '' ? 0 : form.originalReadAmount,//初始阅读量
							readamountAddrule: form.readamountAddrule == '' ? 1 : form.readamountAddrule,//阅读量增长系数
							defaultFavoriteAmout: form.defaultFavoriteAmout == '' ? 0 : form.defaultFavoriteAmout,//初始收藏量
							favoriteIncreaseNum: form.favoriteIncreaseNum == '' ? 1 : form.favoriteIncreaseNum,//初始收藏量系数
							secondLevelIds: form.secondLevelIds,
							ownedSecondLev: form.ownedSecondLev,
							platformType: form.platformType,
							publisher: form.publisher
						};

						if (this.type === "update") {
							data.pathL = "/doctor/typicalDiseasesArticle/updateDiseasesArticle";
							data.id = form.id;
							data.isUpdatePublishedDate = true;
							data.onlineStatus = 0;
							data.readAmount = form.originalReadAmount;//初始阅读量（不知道定义这个干嘛）
						}
						this.$post("/data/new", this.$qs.stringify(data)).then(res => {
							if (res.state === 0) {
								this.$message({
									type: "success",
									message: "编辑成功",
									center: true
								});
								this.$router.push("/news/case");
							}
							else {
								this.$message({
									message: res.msg,
									center: true
								});
							}
						});
					}
					else {
						this.$message({
							message: "请正确填写表单",
							center: true
						});
					}
				});
			},
			// ------------------------------
			// （点击上个页面得--修改按钮）获取数据
			getInfo (id) {
				let that = this;
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/typicalDiseasesArticle/getTypicalDetail",
					id
				}).then(res => {
					that.loading = false;
					if (res.state == 0) {
						that.form = res.data;

						that.teacherDefault.name = this.form.doctorName;
						that.teacherDefault.id = this.form.doctorId;
						// 病例内容
						that.form.diseasesContent = JSON.parse(this.form.diseasesContent);
						for (const item in that.form.diseasesContent) {
							//debugger
							that.form[ item ] = that.form.diseasesContent[ item ];
						}
						that.form = JSON.parse(JSON.stringify(that.form));

						// 医生头像
						// this.fileList = [
						// 	{
						// 		url: this.form.doctorImage
						// 	}
						// ];
						// 列表图
						// this.imgfileList = [
						// 	{
						// 		url: this.form.guideImages
						// 	}
						// ];
						// if (res.data.guideImages) {
						// 	this.imgfileList = [
						// 		{
						// 			url: this.form.guideImages
						// 		}
						// 	];
						// }
						// else {
						// 	this.imgfileList = [];
						// }
						// 辅助检查图片
						this.form.diseasesImages = JSON.parse(this.form.diseasesImages);
						this.form.diseasesImages.forEach(item => {
							this.fileLists.push({
								name: item.name,
								url: item.url
							});
						});
						// 医生科室
						// this.form.doctorDepartment = JSON.parse(this.form.doctorDepartment);
						// this.doctorList = this.form.doctorDepartment.map(item => item.label);
						// this.form.doctorDepartment.forEach(item => {
						// 	if (item.parentId) {
						// 		this.doctorExpanded = [ `levelType1_${ item.parentId }` ];
						// 		this.doctorChecked = [ item.levelType ];
						// 	}
						// });
						// 疾病科室
						this.form.belongedType = JSON.parse(this.form.belongedType);
						this.list = this.form.belongedType.map(item => item.label);
						this.form.belongedType.forEach(item => {
							if (item.parentId) {
								this.expanded.push(`levelType1_${ item.parentId }`);
								this.checked.push(item.levelType);
							}
						});
					}
					else {
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

<style lang="scss" scoped>
  .case-edit {
    width: 100%;
    height: 100%;
    padding-top: 40px;
    box-sizing: border-box;
  }
</style>
