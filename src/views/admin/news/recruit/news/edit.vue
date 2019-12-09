<template>
  <div class="recruit-news-edit" v-loading="loading && type !== 'add'">
    <!-- 表单 -->
    <el-form
      ref="form"
      :model="form"
      size="mini"
      :rules="rules"
      label-width="120px"
      style="width: 800px"
    >
      <el-form-item label="封面">
        <base-upload
          tip="仅限*.jpg,*.jpeg,*.gif,*.png,*.bmp图片格式"
          :rule="rule"
          :limit="1"
          :fileList="fileList"
          @notify="handleUpload"
          v-if="type !== 'preview'"
        ></base-upload>
        <img v-else :src="form.coverUrl" alt="preview">
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input v-if="type !== 'preview'" v-model="form.name"></el-input>
        <p v-else>{{form.name}}</p>
      </el-form-item>
      <el-form-item label="权重" prop="priority">
        <el-input v-if="type !== 'preview'" v-model="form.priority"></el-input>
        <p v-else>{{form.priority}}</p>
      </el-form-item>
      <el-form-item label="计划招募人数" prop="planNum">
        <div class="flex">
          <el-input v-if="type !== 'preview'" v-model="form.planNum"></el-input>
          <p v-else>{{form.planNum}}</p>
          <span style="width: 80px;text-align: center">人</span>
        </div>
      </el-form-item>
      <el-form-item label="奖励金设置"> <!--prop="bonus"-->
        <div class="flex">
          <el-input v-if="type !== 'preview'" v-model="form.bonus"></el-input>
          <p v-else>{{form.bonus}}</p>
          <span style="width: 80px;text-align: center">/人元</span>
        </div>
      </el-form-item>
      <el-form-item label="适用症状" prop="symptom">
        <el-input v-if="type !== 'preview'" v-model="form.symptom"></el-input>
        <p v-else>{{form.symptom}}</p>
      </el-form-item>
      <el-form-item label="展示位置">
        <div v-if="type !== 'preview'">
          <el-checkbox-group v-model="form.place">
            <el-checkbox label="1" border size="medium">哆咖医生</el-checkbox>
            <el-checkbox label="2" border size="medium">医哆咖</el-checkbox>
          </el-checkbox-group>
        </div>
        <p v-else>{{form.place === 1 ? "哆咖医生" : "医哆咖"}}</p>
      </el-form-item>
      <el-form-item label="报名截止时间" prop="offTime">
        <el-date-picker
          v-if="type !== 'preview'"
          v-model="form.offTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :pickerOptions="pickerOptions"
          @change="offTimeChange"
        ></el-date-picker>
        <p v-else>{{form.offTime}}</p>
      </el-form-item>
      <el-form-item label="试验起止日期">
        <base-date
          v-if="type !== 'preview'"
          v-model="date"
          type="datetimerange"
          :pickerOptions="pickerOptions"
          @change="endChange"
        ></base-date>
        <p v-else>{{`${form.createTime}-${form.endTime}`}}</p>
      </el-form-item>
      <el-form-item label="招募问卷" prop="questionUrl">
        <el-input v-if="type !== 'preview'" v-model="form.questionUrl" placeholder="输入链接地址"></el-input>
        <p v-else>{{form.questionUrl}}</p>
      </el-form-item>
      <el-form-item label="招募内容" prop="content">
        <base-editor v-if="type !== 'preview'" style="height: 500px;" v-model="form.content"></base-editor>
        <base-editview v-else :element="form.content"></base-editview>
      </el-form-item>
      <el-form-item>
        <el-button v-if="type !=='preview'" size="mini" type="primary" @click="submit">保 存</el-button>
        <el-button size="mini" v-if="type !== 'add'" @click="previewApp" type="success">预 览</el-button>
        <el-button
          size="mini"
          v-if="type === 'preview' && form.status === 2"
          @click="update"
          type="success"
        >编 辑
        </el-button>
        <el-button size="mini" @click="$router.back()">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
	import {
		isValidSexNumber,
		isValidSexNumberZero,
		isValidNumber
	} from "@/utils/RegExp";

	const validSexNumber = (rule, value, callback) => {
		if (value === "") {
			callback(new Error("请输入权重信息"));
		}
		else if (!isValidSexNumber(value)) {
			callback(new Error("请正确填写权重信息"));
		}
		else {
			callback();
		}
	};
	const validNumber = (rule, value, callback) => {
		if (value === "") {
			callback(new Error("请输入内容信息"));
		}
		else if (!isValidSexNumber(value)) {
			callback(new Error("请输入正确的正整数"));
		}
		else {
			callback();
		}
	};
	const validZeroNumber = (rule, value, callback) => {
		if (value === "") {
			callback(new Error("请输入奖励金额"));
		}
		else if (!isValidSexNumberZero(value)) {
			callback(new Error("请输入正确的整数"));
		}
		else {
			callback();
		}
	};
	export default {
		name: "RecruitNewsEdit",
		data () {
			return {
				type: this.$route.params.type,
				loading: false,
				form: {
					coverUrl: "",
					name: "",
					priority: "",
					planNum: "",
					bonus: "",
					symptom: "",
					offTime: "",
					startTime: "",
					endTime: "",
					questionUrl: "",
					content: "",
					place: []
				},
				date: [ "", "" ],
				rules: {
					name: [
						{
							required: this.$route.params.type !== "preview",
							message: "请输入标题内容",
							trigger: "blur"
						},
						{
							min: 1,
							max: 30,
							message: "内容不能为空，且字数控制在30个字之内!",
							trigger: "blur"
						}
					],
					priority: {
						required: this.$route.params.type !== "preview",
						validator: validSexNumber,
						trigger: "blur"
					},
					planNum: {
						required: this.$route.params.type !== "preview",
						validator: validNumber,
						trigger: "blur"
					},
					bonus: {
						required: false, //奖励金设置为非必填项
						validator: validZeroNumber,
						trigger: "blur"
					},
					symptom: [
						{
							required: this.$route.params.type !== "preview",
							message: "请输入适用症状",
							trigger: "blur"
						},
						{
							min: 1,
							max: 24,
							message: "请将字数控制在24个字之内！",
							trigger: "blur"
						}
					],
					offTime: {
						required: this.$route.params.type !== "preview",
						message: "请选择正确的日期范围",
						trigger: "blur"
					},
					questionUrl: {
						required: this.$route.params.type !== "preview",
						message: "请输入招募问卷链接",
						trigger: "blur"
					},
					content: {
						required: this.$route.params.type !== "preview",
						message: "请输入招募内容",
						trigger: "blur"
					}
				},
				rule: {
					type: [ "image/jpg", "image/jpeg", "image/gif", "image/png", "image/bmp" ]
				},
				fileList: [],
				pickerOptions: {
					disabledDate: time => time.getTime() < Date.now()
				}
			};
		},
		watch: {
			date (now) {
				this.form.startTime = now[ 0 ];
				this.form.endTime = now[ 1 ];
			}
		},
		created () {
			if (this.type !== "add") {
				this.getInfo(Number(this.$route.query.id));
			}
		},
		methods: {
			// 手机APP预览
			previewApp () {
				this.$router.push({
					path: "/news/recruit/news/preview/app",
					query: {id: this.$route.query.id}
				});
			},
			// 编辑
			update () {
				this.$router.push("/news/recruit/news");
				setTimeout(() => {
					this.$router.push({
						path: "/news/recruit/news/update",
						query: {id: this.form.id}
					});
				}, 0);
			},
			// 获取图片信息
			handleUpload (data) {
				this.form.coverUrl = data[ 0 ].url;
			},
			// 提交
			submit () {
				this.$refs.form.validate(valid => {
					if (valid) {
						const data = {
							pathL: "/doctor/recruitInfo/add",
							coverUrl: this.form.coverUrl,
							name: this.form.name,
							priority: this.form.priority,
							planNum: this.form.planNum,
							bonus: this.form.bonus,
							symptom: this.form.symptom,
							offTime: this.form.offTime,
							startTime: this.form.startTime,
							endTime: this.form.endTime,
							questionUrl: this.form.questionUrl,
							content: this.form.content,
							place: this.form.place.join(',')
						};
						if (this.type === "update") {
							data.pathL = "/doctor/recruitInfo/edit";
							data.id = this.form.id;
						}
						this.$post("/data/new", this.$qs.stringify(data)).then(res => {
							if (res.state === 0) {
								this.$message({
									type: "success",
									message: "编辑成功",
									center: true
								});
								this.$router.push("/news/recruit/news");
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
			// 获取详情信息
			getInfo (id) {
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/doctor/recruitInfo/details",
					id
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.form = res.data;
						this.form.place = `${ res.data.place }`.split(',');
						this.fileList = [
							{
								url: res.data.coverUrl
							}
						];
						this.form.bonus = res.data.bonus ? res.data.bonus.split(".")[ 0 ] : '';
						if (res.data.startTime) {
							this.date = [ res.data.startTime, res.data.endTime ];
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
			// 报名截止时间
			offTimeChange (now) {
				this.date = [];
			},
			// 试验起止日期
			endChange (now) {
				const time = this.form.offTime;
				if (time !== "" && time) {
					const fn = date => {
						return date.substring(0, 19).replace(/-/g, "/");
					};
					const timestamp = new Date(fn(now[ 0 ])).getTime();
					const offTime = new Date(fn(time)).getTime();
					if (timestamp < offTime) {
						this.$message({
							message: "时间范围应大于报名截止时间",
							type: "warning",
							center: true
						});
						this.date = [];
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
  .recruit-news-edit {
    padding: 20px;
    box-sizing: border-box;

    .flex {
      display: flex;
    }
  }
</style>
