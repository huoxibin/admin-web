<template>
  <el-row style="width: 600px">
    <el-col :span="23" :offset="1" class="m-t-20">
      <div v-loading="loading">
        <!-- type === route.params.type -->
        <!-- 编辑表单 -->
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="mini"
          label-width="120px"
        >
          <!-- 名称 -->
          <el-form-item label="名称" prop="name">
            <p v-if="type==='detail'">{{form.name}}</p>
            <el-input v-else v-model="form.name" placeholder="请概括该弹窗内容，30字内"></el-input>
          </el-form-item>
          <!-- 弹窗图片 -->
          <el-form-item label="弹窗图片" prop="image">
            <img v-if="type==='detail'" :src="form.image" style="max-width:200px;max-height:200px">
            <div class="upload" v-loading="uploadLoading" v-else>
              <el-upload
                class="avatar-uploader"
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="form.image" :src="form.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <!-- 启动次数 -->
          <el-form-item label="启动次数" prop="dailynum">
            <p v-if="type==='detail'">{{form.dailynum+"次/" + (form.frequencyDays == "1" ? "日" : form.frequencyDays ==
              "7" ? "周" : "月")}}</p>
            <div v-else>
              <el-select v-model="form.dailynum" style="width: 20%">
                <el-option v-for="item in times" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span style="margin:0 8px;">次</span>
              <!-- 启动周期 -->
              <el-select v-model="form.frequencyDays" style="width: 20%">
                <el-option v-for="item in frequencyDaysArr" :key="item.keysNum" :label="item.valueStr"
                           :value="item.keysNum"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <!-- 弹窗链接 -->
          <el-form-item label="弹窗链接" prop="linkType">
            <!--查看-->
            <div v-if="type==='detail'">
              <p v-if="form.linkType==2">
                外链 {{form.link}}
              </p>
              <p v-if="form.linkType==1">
                内链：{{findText}}
              </p>
            </div>
            <!--新增-->
            <div v-else>
              <el-radio-group v-model="form.linkType">
                <div>
                  <el-radio :label="2">外链：
                    <el-input :disabled="form.linkType !== 2 " v-model="form.link"></el-input>
                  </el-radio>
                </div>
                <div class="m-t-10">
                  <el-radio :label="1">内链：
                    <el-select
                      style="width: 20%"
                      v-model="form.typeId"
                      placeholder="请选择"
                      @change="typeChange"
                      :disabled="form.linkType !== 1 "
                    >
                      <el-option
                        v-for="(item1,index) in typeArr"
                        :key="index"
                        :label="item1.name"
                        :value="item1.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      style="width: 20%"
                      v-model="form.channelId"
                      @change="channelChange"
                      placeholder="请选择"
                      :disabled="form.linkType !== 1 "
                    >
                      <el-option
                        v-for="(item2,index) in channels"
                        :key="index"
                        :label="item2.channelName"
                        :value="item2.channelId"
                      ></el-option>
                    </el-select>
                    <el-select
                      style="width: 20%"
                      v-model="form.articleId"
                      placeholder="请选择"
                      :disabled="form.linkType !== 1 "
                    >
                      <el-option
                        v-for="(item3,index) in article"
                        :key="index"
                        :label="item3.articleName"
                        :value="item3.articleId"
                      ></el-option>
                    </el-select>
                  </el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <!-- 上线/下线时间 -->
          <el-form-item label="上线/下线时间" prop="date">
            <p v-if="type==='detail'">{{form.date[0]}} - {{form.date[1]}}</p>
            <el-date-picker
              v-else
              v-model="form.date"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="上线日期"
              end-placeholder="下线日期"
            ></el-date-picker>
          </el-form-item>
          <!-- 发布对象 -->
          <el-form-item label="发布对象" prop="target">
            <div class="flex">
              <div class="tags">
                <el-tag v-for="(item,index) in tags" :key="index" type="success">{{item.value}}</el-tag>
              </div>
              <el-button
                v-if="type!=='detail'"
                style="width:100px"
                @click="dialogVisible = true"
                type="primary"
              >选 择
              </el-button>
            </div>
          </el-form-item>
          <!-- 触发条件 -->
          <el-form-item label="触发条件" prop="touchoff">
            <p v-if="type==='detail' && form.touchoff === 1">启动APP</p>
            <el-select v-else v-model="form.touchoff">
              <el-option v-for="item in trigger" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 发布位置 -->
          <el-form-item label="发布位置" prop="position">
            <p v-if="type==='detail' && form.position === 1">前沿</p>
            <el-select v-else v-model="form.position">
              <el-option v-for="item in position" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- submit -->
          <el-form-item>
            <el-button style="width:100px" v-if="type!=='detail'" @click="submit" type="primary">保 存</el-button>
            <el-button style="width:100px" @click="$router.back()">返 回</el-button>
          </el-form-item>
        </el-form>

        <!-- 发布对象dialog -->
        <el-dialog title="选择发布对象" :append-to-body="true" :visible.sync="dialogVisible" width="50%">
          <el-tabs tab-position="left">
            <el-tab-pane label="哆咖医生">
              <div class="select">
                <div class="select-left">
                  <el-checkbox-group v-model="target.all" size="mini">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.all"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>用户标签</p>
                  <el-checkbox-group
                    v-model="target.qualifier"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.qualifier"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>性别标签</p>
                  <el-checkbox-group v-model="target.sex" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.sex"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>职称标签</p>
                  <el-checkbox-group
                    v-model="target.title"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.title"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>地区标签</p>
                  <el-checkbox-group
                    v-model="target.city"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:200px"
                      v-for="(item,index) in option.city"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <div class="select-switch">
                  <i class="el-icon-arrow-right"></i>
                  <i class="el-icon-arrow-left"></i>
                </div>

                <div class="select-right">
                  <el-checkbox-group v-model="target.all" size="mini">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.all"
                      v-show="target.all.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>用户标签</p>
                  <el-checkbox-group
                    v-model="target.qualifier"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.qualifier"
                      v-show="target.qualifier.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>性别标签</p>
                  <el-checkbox-group v-model="target.sex" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.sex"
                      v-show="target.sex.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>职称标签</p>
                  <el-checkbox-group
                    v-model="target.title"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.title"
                      v-show="target.title.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>地区标签</p>
                  <el-checkbox-group
                    v-model="target.city"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:200px"
                      v-for="(item,index) in option.city"
                      v-show="target.city.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <span slot="footer" class="dialog-footer">
        <el-button style="width:100px" size="mini" type="primary" @click="checkboxSubmit">确 定</el-button>
        <el-button style="width:100px" size="mini" @click="dialogVisible = false">关 闭</el-button>
      </span>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>

<script>
	export default {
		name: "WindowEdit",
		computed: {
			checkboxAll () {
				return this.target.all.length;
			}
		},
		data () {
			return {
				loading: false,
				type: this.$route.params.type,
				selectLenth: 2,
				// form表单
				form: {
					name: "", //活动名称
					image: "", //弹窗图片
					dailynum: 1, //启动次数
					frequencyDays: 1, //启动周期
					typeId: "", //弹窗一级id
					channelId: "", //弹窗二级id
					articleId: "", //弹窗三级id
					link: '',
					date: [], //上下线时间
					target: {
						all: [],
						qualifier: [],
						sex: [],
						title: [],
						city: []
					}, //发布对象
					touchoff: 1, //触发条件
					position: 1, //发布位置
					linkType: "", //链接类型
				},
				// form表单验证
				rules: {
					name: [
						{
							required: this.$route.params.type !== "detail",
							message: "请输入弹窗名称",
							trigger: "blur"
						},
						{min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}
					],
					image: {
						required: this.$route.params.type !== "detail",
						message: "请上传弹窗图片"
					},
					date: {
						required: this.$route.params.type !== "detail",
						message: "请选择上线/下线时间"
					},
					dailynum: {
						required: this.$route.params.type !== "detail",
						message: "请选择启动次数"
					},
					target: {
						required: this.$route.params.type !== "detail",
						message: "请选择发布对象"
					},
					touchoff: {
						required: this.$route.params.type !== "detail",
						message: "请选择触发条件"
					},
					position: {
						required: this.$route.params.type !== "detail",
						message: "请选择发布位置"
					},
					linkType: {
						required: this.$route.params.type !== "detail",
						message: "请选择弹窗链接"
					}
				},
				// 上传URL
				action: "/data/uploadImg",
				// 上传headers
				headers: {
					accessToken: this.$store.getters.accessToken
				},
				// 上传loading
				uploadLoading: false,
				// times 1-100
				times: Array.from({length: 100}, (_, index) => index + 1),
				// 上下线时间限制
				pickerOptions: {
					disabledDate (time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				// 触发条件选项
				trigger: [
					{
						name: "启动APP",
						id: 1
					}
				],
				// 发布位置选项
				position: [
					{
						name: "前沿",
						id: 1
					}
				],
				// 发布对象dialog
				dialogVisible: false,
				// 发布对象选项
				option: {
					all: [],
					qualifier: [],
					sex: [],
					title: [],
					city: []
				},
				tags: [],
				target: {
					all: [],
					qualifier: [],
					sex: [],
					title: [],
					city: []
				},
				frequencyDaysArr: [
					{"keysNum": 31, "valueStr": "月"},
					{"keysNum": 7, "valueStr": "周"},
					{"keysNum": 1, "valueStr": "日"}
				],
				typeArr: [
					{
						name: "健康资讯",
						id: 1
					},
					{
						name: "点播课程",
						id: 2
					},
					{
						name: "哆咖医生的直播",
						id: 4
					},
					{
						name: "医生活动页",
						id: 3
					},
					{
						name: "哆咖医生的指南共识",
						id: 5
					},
					{
						name: "经典病例",
						id: 6
					}
				],
				channels: [], //弹窗二级下拉数据
				article: [], //弹窗三级级下拉数据
				beforeArticle: [], //弹窗三级级下拉数据（未过滤）
				findText: "",
				createTime: "" //弹窗创建时间
			};
		},
		watch: {
			checkboxAll (now) {
				if (now) {
					this.target.qualifier = [];
					this.target.sex = [];
					this.target.title = [];
					this.target.city = [];
				}
			},
			'form.linkType' (now) {
				switch (now) {
					case 1:
						this.form.link = "";
						break;
					case 2:
						this.form.typeId = "";
						this.form.channelId = "";
						this.form.articleId = "";
						break;
				}
			}
		},
		created () {
			this.getTep();
		},
		methods: {
			// 获取内链列表
			getChain (typeId) {
				this.$get("/data/my", {
					pathL: "/news/newsChannel/getPopupMenuList",
					typeId
				}).then(res => {
					if (res.state === 0) {
						this.channels = res.data.channelMaps;
						this.beforeArticle = res.data.articleMaps;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 内链 type
			typeChange (data) {
				this.form.channelId = "";
				this.form.articleId = "";
				this.channels = [];
				this.article = [];
				this.getChain(data);

			},
			// 内链 channel
			channelChange (data) {
				this.form.articleId = "";
				if (data === -500) {
					this.article = this.beforeArticle;
				}
				else {
					const arrFiter = item => item.channelId === data;
					this.article = this.beforeArticle.filter(arrFiter);
				}
			},
			// 读取信息
			async getTep () {
				await this.getData();
				await this.getInfo();
			},
			// 获取详情
			getInfo () {
				if (this.$route.params.type !== "add") {
					this.loading = true;
					this.$post("/data/my", {
						pathL: "/doctor/doctorPopup/details",
						id: this.$route.query.id
					}).then(res => {
						this.loading = false;
						if (res.state === 0) {
							const data = res.data;
							this.target = JSON.parse(data.targetName);
							data.date = [ data.onlineTime, data.offlineTime ];
							data.target = JSON.parse(data.target);
							this.form.date = [ data.onlineTime, data.offlineTime ]; //上下线时间
							this.form.name = data.name; //名称
							this.form.image = data.image;  //弹窗图片
							this.form.dailynum = data.dailynum; //启动次数
							this.form.frequencyDays = data.frequencyDays; //启动周期
							this.form.linkType = data.linkType; //启动周期
							this.form.link = data.link; //启动周期
							//解析下拉id
							let selectId = JSON.parse(data.menuJsonarray);
							this.form.typeId = selectId[ 0 ].typeId; //弹窗链接一级下拉id
							// this.form.terminalId = selectId[0].terminalId;
							this.form.channelId = selectId[ 1 ].channelId; //弹窗链接二级下拉id
							this.form.articleId = selectId[ 2 ].articleId; //弹窗链接三级下拉id
							this.createTime = data.createTime; //弹窗创建时间
							const checkbox = data.target;
							this.tags = [
								...checkbox.all,
								...checkbox.qualifier,
								...checkbox.sex,
								...checkbox.title,
								...checkbox.city
							];
							this.form.target.all = [ ...checkbox.all ];
							this.form.target.qualifier = [ ...checkbox.qualifier ];
							this.form.target.sex = [ ...checkbox.sex ];
							this.form.target.title = [ ...checkbox.title ];
							this.form.target.city = [ ...checkbox.city ];
							this.$get("/data/my", {
								pathL: "/news/newsChannel/getPopupMenuList",
								typeId: selectId[ 0 ].typeId
							}).then(reser => {
								if (reser.state === 0) {
									// 编辑

									if (reser.data !== null || (typeof reser.data == 'Array' && reser.data.lenght > 0)) {
										this.channels = reser.data.channelMaps;
										this.beforeArticle = reser.data.articleMaps;
										this.article = reser.data.articleMaps.filter(
											item => item.channelId === this.form.channelId
										);
										// 查看
										const typeName = this.typeArr.filter(
											item => item.id === this.form.typeId
										);
										// // const terminalName = reser.data.terminalMaps.filter(
										// //   item => item.termianlId === this.form.terminalId
										// // );
										const channelName = reser.data.channelMaps.filter(
											item => item.channelId === this.form.channelId
										);
										const articleName = reser.data.articleMaps.filter(
											item => item.articleId === this.form.articleId
										);

										if (this.form.linkType !== 2) {
											this.findText = `${ typeName[ 0 ].name }-${ channelName[ 0 ].channelName }-${ articleName[ 0 ].articleName }`;
										}
									}
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
								message: res.msg,
								center: true
							});
						}
					});
				}
			},
			// 获取发布对象
			getData () {
				this.$post("/data/my", {
					pathL: "/doctor/doctorPopup/publishTargetTag"
				}).then(res => {
					if (res.state === 0) {
						this.option = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 发送对象提交
			checkboxSubmit () {
				const target = this.target;
				const option = this.option;
				const fn = (option, target) => {
					let arr = [];
					target.forEach(i => {
						arr.push(option.filter(item => item.name === i)[ 0 ]);
					});
					return arr;
				};
				const list = {
					all: fn(option.all, target.all),
					qualifier: fn(option.qualifier, target.qualifier),
					sex: fn(option.sex, target.sex),
					title: fn(option.title, target.title),
					city: fn(option.city, target.city)
				};
				this.form.target = list;
				this.tags = [
					...list.all,
					...list.qualifier,
					...list.sex,
					...list.title,
					...list.city
				];
				this.dialogVisible = false;
			},
			// 图片上传验证
			beforeUpload (file) {
				const type = [ 'image/jpg', 'image/jpeg', 'image/gif', 'image/gif', 'image/png', 'image/bmp' ];
				let isType = type.includes(file.type);
				if (!isType) {
					this.$message({
						message: "只能上传图片哦！",
						type: "warning",
						center: true
					});
					return isType;
				}
				this.uploadLoading = true;
			},
			// 图片上传成功
			handleUploadSuccess (response, file, fileList) {
				this.uploadLoading = false;
				if (response.state === 0) {
					this.form.image = response.data.url;
				}
				else {
					this.$message({
						type: "error",
						message: response.msg,
						center: true
					});
				}
			},
			// 提交
			submit () {
				this.$refs.form.validate(valid => {
					if (valid) {
						// 发布日期大于系统当前日期
						let systemTime = new Date(); //系统当前时间
						let releaseTime = new Date(Date.parse(this.form.date[ 0 ])); //选择活动发布时间
						if (systemTime > releaseTime) {
							this.$message({
								type: "warning",
								message: "选择活动发布时间必须大于当前系统时间！",
								center: true
							});
							return
						}
						//发布对象不能为空
						let targetStr = [];
						for (let itme in this.target) {
							if (this.target[ itme ].length) {
								targetStr.push("true");
							}
							else {
								targetStr.push("false");
							}
						}
						if (!targetStr.includes("true")) {
							this.$message({
								type: "warning",
								message: "请选择发布对象！",
								center: true
							});
							return
						}
						const data =
							this.type === "add"
								? {
									pathL: "/doctor/doctorPopup/add",
									name: this.form.name, //活动名称
									image: this.form.image, //弹窗图片
									dailynum: this.form.dailynum, //启动次数
									linkType: Number(this.form.linkType),
									frequencyDays: this.form.frequencyDays, //启动周期
									menuJsonarray: JSON.stringify([
										{typeId: this.form.typeId},
										// {terminalId: this.form.terminalId},
										{channelId: this.form.channelId},
										{articleId: this.form.articleId}
									]),
									link: this.form.link,
									onlineTime: this.form.date[ 0 ], //上线时间
									offlineTime: this.form.date[ 1 ], //下线时间
									target: JSON.stringify(this.form.target), //发布对象
									touchoff: this.form.touchoff, //触发条件
									position: this.form.position, //发布位置
								}
								: {
									pathL: "/doctor/doctorPopup/edit",
									id: this.$route.query.id,
									name: this.form.name, //活动名称
									image: this.form.image, //弹窗图片
									dailynum: this.form.dailynum, //启动次数
									frequencyDays: this.form.frequencyDays, //启动周期
									linkType: Number(this.form.linkType),
									menuJsonarray: JSON.stringify([
										{typeId: this.form.typeId},
										// {terminalId: this.form.terminalId},
										{channelId: this.form.channelId},
										{articleId: this.form.articleId}
									]),
									link: this.form.link, //弹窗链接
									onlineTime: this.form.date[ 0 ], //上线时间
									offlineTime: this.form.date[ 1 ], //下线时间
									target: JSON.stringify(this.form.target), //发布对象
									touchoff: this.form.touchoff, //触发条件
									position: this.form.position, //发布位置
									status: this.form.status,
									priority: this.form.priority,
									createTime: this.createTime
								};
						this.$post("/data/my", data).then(res => {
							if (res.state === 0) {
								this.$message({
									message: "保存成功",
									type: "success",
									center: true
								});
								this.$router.push("/news/window/list");
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
							message: "请填写正确的表单信息",
							center: true
						});
					}
				});
			}
		}
	};
</script>

<style scoped>


  .flex {
    display: flex;
  }

  .upload {
    width: 200px;
    height: 200px;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-around;
  }

  .select {
    width: 100%;
    height: 400px;
    display: flex;
  }

  .select-left,
  .select-right {
    flex: 5;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    overflow: auto;
  }

  .select-left p,
  .select-right p {
    margin: 10px 0;
    font-weight: 600;
  }

  .select-switch {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
</style>
