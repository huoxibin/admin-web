<template>
  <div  style="height: 100%;" v-loading="adLoading" element-loading-text="拼命加载中">
    <!-- tab -->
    <el-tabs
      tab-position="left"
      v-model="initTab"
      @tab-click="handleClick"
      style="width:100%;height:100%"
    >
      <el-tab-pane
        style="height: 100%;width:100%;"
        v-for="item,index in list"
        :key="index"
        :label="item.note"
        :name="item.name"
        :tabId="item.id"
      >
        <div class="title-bar">
          <p>列表信息</p>
          <el-button @click="add(item.id)" size="mini" type="primary">新增</el-button>
        </div>
        <el-table :data="data" border height="88%" stripe style=" width: 100%;">
          <el-table-column prop="id" label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="url" label="图片" align="center">
            <template slot-scope="scope">
              <div class="cover-wrap">
                <img class="cover" :src="scope.row.url" alt>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" sortable align="center"></el-table-column>
          <el-table-column prop="updateTime" label="操作时间" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status===1?true:false"
                @change="handleStatus(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="update(scope.row,item.id)"
                v-if="scope.row.status===0"
                type="text"
                size="small"
              >编辑
              </el-button>
              <el-button
                @click="find(scope.row)"
                v-if="scope.row.status===0||scope.row.status===1"
                type="text"
                size="small"
              >查看
              </el-button>
              <el-button
                @click="remove(scope.row)"
                v-if="scope.row.status===0"
                type="text"
                size="small"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageLength"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- edit -->
    <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogVisible" width="680px">
      <el-form
        ref="form"
        size="mini"
        :rules="formRules"
        :model="form"
        label-width="100px"
        style="width:100%"
        v-loading="editLoading"
        element-loading-text="拼命加载中"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-if="status !== 'find'" v-model="form.name" placeholder="请概括该运营位内容，30字内"></el-input>
          <p v-else style="max-width:400px">{{form.name}}</p>
        </el-form-item>
        <el-form-item v-if="status !== 'find'" label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="url">
          <div
            v-if="status !== 'find'"
            class="uploadImg"
            v-loading="uploadLoading"
            element-loading-text="正在上传中···"
          >
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.url" :src="form.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <img v-else style="margin-right: 20px;float:right" :src="form.url" class="avatar">
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-if="status !== 'find'" v-model="form.sort" placeholder="数字越大，在前端排序越靠前"></el-input>
          <p v-else style="max-width:400px">{{form.sort}}</p>
        </el-form-item>

        <el-form-item label="链接地址" prop="urlType">
          <el-radio-group v-model="form.urlType" v-if="status !== 'find'" style="width: 100%">
            <div style="display: flex;align-items: center;">
              <el-radio :label="1">外链：</el-radio>
              <el-input :disabled="form.urlType !== 1 " v-model="form.linkAddress"></el-input>
            </div>
            <div style="margin-top: 10px;width: 100%">
              <el-radio :label="0">内链：</el-radio>
              <el-select
                style="width: 20%"
                v-model="form.typeId"
                placeholder="请选择"
                @change="typeChange"
                :disabled="form.urlType !== 0"
              >
                <el-option
                  v-for="item,index in type"
                  :key="index"
                  :label="item.name"
                  :disabled="((!item.name.includes('点播课程')) && tabName=='doctor_pad_course') || (!item.name.includes('直播课程') && tabName=='doctor_pad_live_course')"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="width: 20%"
                v-model="form.terminalId"
                placeholder="请选择"
                @change="terminalsChange"
                v-if="selectLenth > 2"
                :disabled="form.urlType !== 0 "
              >
                <el-option
                  v-for="item,index in terminals"
                  :key="index"
                  :label="item.terminalName"
                  :value="item.termianlId"
                ></el-option>
              </el-select>
              <el-select
                style="width: 20%"
                v-model="form.channelId"
                @change="channelChange"
                placeholder="请选择"
                v-if="selectLenth > 1"
                :disabled="form.urlType !== 0 "
              >
                <el-option
                  v-for="item,index in channels"
                  :key="index"
                  :label="item.channelName"
                  :value="item.channelId"
                ></el-option>
              </el-select>
              <el-select
                style="width: 20%"
                v-model="form.articleId"
                placeholder="请选择"
                v-if="selectLenth > 1"
                :disabled="form.urlType !== 0 "
              >
                <el-option
                  v-for="item,index in article"
                  :key="index"
                  :label="item.articleName"
                  :value="item.articleId"
                ></el-option>
              </el-select>
            </div>
          </el-radio-group>
          <p v-else style="max-width:400px">{{findText}}</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" v-if="status !== 'find'" @click="dialogVisible=false">取 消</el-button>
        <el-button size="small" v-if="status !== 'find'" type="primary" @click="submit(form)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import { isValidFiveNumber } from "@/utils/RegExp.js";

	var CheckSort = (rule, value, callback) => {
		if (!value) {
			callback(new Error("请输入1-99999之间的数字"));
		}
		else if (!isValidFiveNumber(value)) {
			callback(new Error("请输入1-99999之间的数字"));
		}
		else {
			callback();
		}
	};
	export default {
		computed: {
			linkType () {
				return this.form.urlType;
			}
		},
		data () {
			return {
				disableSelect: false,//直播点播课程禁用
				tableHeight: 0,
				title: null,
				status: null,
				loading: true,
				adLoading: true,
				editLoading: false,
				removeLoading: false,
				uploadLoading: false,
				dialogVisible: false,
				selectLenth: 1,
				initTab: "",
				data: [],
				list: [],
				form: {
					placeId: 0,
					name: "",
					type: 1,
					url: "",
					sort: "",
					urlType: "",
					linkAddress: "",
					typeId: "",
					terminalId: "",
					channelId: "",
					articleId: ""
				},
				findText: "",
				type: [
					{
						name: "资讯",
						id: 1
					},
					{
						name: "点播课程",
						id: 2
					},
					{
						name: "直播课程",
						id: 4
					},
					{
						name: "医生活动页",
						id: 3
					}
				],
				terminals: [],
				channels: [],
				beforeChannels: [],
				article: [],
				beforeArticle: [],
				formRules: {
					name: [
						{required: true, message: "请输入正确的名称", trigger: "blur"},
						{min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}
					],
					sort: [
						{
							required: true,
							validator: CheckSort,
							trigger: "blur"
						}
					],
					url: [ {required: true, message: "请上传广告位图片"} ],
					urlType: {required: true, message: "请选择内外链", trigger: "change"}
				},
				uploadUrl: "/data/uploadImg",
				uploadHeaders: {
					accessToken: this.$store.getters.accessToken
				},
				dialogVisibleImg: false,
				addBus: "",
				pageLength: 0,
				pageNum: 1,
				pageSize: 10,
				tabName: ""
			};
		},
		methods: {
			// 获取内链列表
			getChain (typeId) {
				this.$get("/data/my", {
					pathL: "/news/newsChannel/getAdvertisePlaceArticleMenu",
					typeId
				}).then(res => {
					if (res.state === 0) {
						if (typeId === 1) {
							this.terminals = res.data.terminalMaps;
							this.beforeChannels = res.data.channelMaps;
							this.beforeArticle = res.data.articleMaps;
						}
						else {
							this.form.terminalId = 6;
							this.channels = res.data.channelMaps;
							this.beforeArticle = res.data.articleMaps;
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
			// 内链 type
			typeChange (data) {
				this.selectLenth = data === 1 ? 3 : 2;
				this.form.terminalId = "";
				this.form.channelId = "";
				this.form.articleId = "";
				this.getChain(data);
				this.terminals = [];
				this.channels = [];
				this.article = [];
			},
			// 内链 terminals
			terminalsChange (data) {
				this.form.channelId = "";
				this.form.articleId = "";
				this.channels = [];
				this.article = [];
				const arrFiter = item => item.terminalId === data;
				this.channels = this.beforeChannels.filter(arrFiter);
			},
			// 内链 channel
			channelChange (data) {
				this.form.articleId = "";
				this.article = [];
				if (data === -500) {
					this.article = this.beforeArticle;
				}
				else {
					const arrFiter = item => item.channelId === data;
					this.article = this.beforeArticle.filter(arrFiter);
				}
			},
			judgeImgsize (width, height, file) {
				//上传尺寸校验
				let _URL = window.URL || window.webkitURL;
				let img = new Image();
				const isSize = new Promise(function (resolve, reject) {
					img.onload = function () {
						let valid = img.width == width && img.height == height;
						valid ? resolve() : reject();
					}

					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					this.uploadLoading = false;
					this.$message.error(`图片尺寸限制为${ width }X${ height }`);
					img.src = '';
					return Promise.reject();
				});
				return isSize;
			},
			// 图片上传验证
			beforeAvatarUpload (file) {
				this.uploadLoading = true;
				const extension = file.type === "image/jpg";
				const extension2 = file.type === "image/jpeg";
				const extension3 = file.type === "image/gif";
				const extension4 = file.type === "image/png";
				const extension5 = file.type === "image/bmp";
				const isLt2M = file.size / 1024 / 1024 < 5;

				let isSize = {};
				// if (this.tabName == 'banner_app') { //亲属端广告
				// 	isSize = this.judgeImgsize(750, 320, file);
				// }
				//debugger
				if (this.tabName == 'doctor_web_course') {
					isSize = this.judgeImgsize(750, 422, file);
				}
				if (
					!extension &&
					!extension2 &&
					!extension3 &&
					!extension4 &&
					!extension5
				) {
					this.uploadLoading = false;
					this.$message({
						message: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
						center: true
					});
				}
				if (!isLt2M) {
					this.uploadLoading = false;
					this.$message({
						message: "上传图片大小不能超过5MB!",
						center: true
					});
				}
				return (
					(extension || extension2 || extension3 || extension4 || extension5) &&
					isLt2M && isSize
				);
			},
			// 图片上传成功
			uploadSuccess (response, file, fileList) {
				this.uploadLoading = false;
				if (response.state === 0) {
					this.form.url = response.data.url;
				}
				else {
					this.$message({
						type: "error",
						message: response.msg,
						center: true
					});
				}
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			// 状态改变
			handleStatus (row) {
				console.log(this.data)
				let message =
					row.status === 1
						? "关闭后，用户将无法看见数据，是否要关闭？"
						: "开启后，用户就可以查看该内容，是否要开启？";
				let title = row.status === 1 ? "关闭" : "开启";
				let success = row.status === 1 ? "关闭成功" : "开启成功";
				let info = row.status === 1 ? "已取消关闭" : "已取消开启";
				this.$confirm(message, title, {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$post("/data/my", {
							pathL: "/common/advertise/release",
							id: row.id,
							status: 1 - row.status
						}).then(res => {
							if (res.state === 0) {
								this.$message({
									type: "success",
									message: success,
									center: true
								});
								this.getData();
							}
							else {
								this.$message({
									type: "error",
									message: res.msg,
									center: true
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: info,
							center: true
						});
					});
			},
			// 新增
			add (id) {
				this.form.placeId = id;
				this.title = '新增';
				this.dialogVisible = true;
				this.status = "add";
			},
			// 提交
			submit (form) {
				this.$refs.form.validate(valid => {
					if (valid) {
						const fn = () => {
							this.editLoading = true;
							const data = {
								pathL: "/common/advertise/save",
								placeId: form.placeId,
								name: form.name,
								type: form.type,
								url: form.url,
								linkAddress: encodeURIComponent(
									encodeURIComponent(form.linkAddress)
								),
								urlType: form.urlType,
								sort: form.sort,
								status: 0,
								typeId: form.typeId,
								terminalId: form.terminalId,
								channelId: form.channelId,
								articleId: form.articleId
							};
							if (this.status === "update") {
								data.id = form.id;
							}
							this.$post("/data/my", data).then(res => {
								this.editLoading = false;
								if (res.state === 0) {
									this.getData();
									this.$message({
										message: "保存成功",
										type: "success",
										center: true
									});
									this.dialogVisible = false;
								}
								else {
									this.$message({
										type: "error",
										message: res.msg,
										center: true
									});
								}
							});
						};
						if (this.form.urlType === 1 || this.form.urlType === 0) {
							if (
								this.form.linkAddress === "" &&
								(this.form.typeId === "" ||
									this.form.channelId === "" ||
									this.form.terminalId === "" ||
									this.form.articleId === "")
							) {
								this.$message({
									message: "请正确填写内外链",
									center: true
								});
							}
							else {
								fn();
							}
						}
						else {
							fn();
						}
					}
					else {
						this.$message({
							message: "请填写正确的表单信息",
							center: true
						});
					}
				});
			},
			// 删除
			remove (row) {
				this.$confirm("删除后该条数据将无法找回，是否要删除？", "删除", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.removeLoading = true;
						this.$post("/data/my", {
							pathL: "/common/advertise/del",
							id: row.id
						}).then(res => {
							this.removeLoading = false;
							if (res.state === 0) {
								this.$message({
									type: "success",
									message: "删除成功",
									center: true
								});
								this.getData();
							}
							else {
								this.$message({
									type: "error",
									message: res.msg,
									center: true
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
							center: true
						});
					});
			},
			// 读取广告信息
			getADInfo (id) {
				this.editLoading = true;
				this.$get("/data/my", {
					pathL: "/common/advertise/queryOne",
					id
				}).then(res => {
					this.editLoading = false;
					if (res.state === 0) {
						this.form = res.data.advertise;
						if (this.form.urlType !== 0) {
							this.form.typeId = "";
							this.form.terminalId = "";
							this.form.channelId = "";
							this.form.articleId = "";
							this.selectLenth = 1;
							this.findText = this.form.linkAddress;
						}
						else {
							this.$get("/data/my", {
								pathL: "/news/newsChannel/getAdvertisePlaceArticleMenu",
								typeId: this.form.typeId
							}).then(reser => {
								if (reser.state === 0) {
									this.selectLenth = this.form.typeId === 1 ? 3 : 2;
									// 编辑
									this.terminals = reser.data.terminalMaps;
									this.beforeChannels = reser.data.channelMaps;
									this.beforeArticle = reser.data.articleMaps;
									this.channels = this.beforeChannels.filter(
										item => item.terminalId === this.form.terminalId
									);
									if (this.form.channelId === -500) {
										this.article = this.beforeArticle;
									}
									else {
										this.article = this.beforeArticle.filter(
											item => item.channelId === this.form.channelId
										);
									}
									// 查看
									const typeName = this.type.filter(
										item => item.id === this.form.typeId
									);
									const terminalName = reser.data.terminalMaps.filter(
										item => item.termianlId === this.form.terminalId
									);
									const channelName = reser.data.channelMaps.filter(
										item => item.channelId === this.form.channelId
									);
									const articleName = reser.data.articleMaps.filter(
										item => item.articleId === this.form.articleId
									);
									this.findText = `${ typeName[ 0 ].name }-${
										terminalName[ 0 ].terminalName
										}-${ channelName[ 0 ].channelName }-${ articleName[ 0 ].articleName }`;
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
					else {
						this.$message({
							type: "error",
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 编辑
			update (row, id) {
				this.status = "update";
				this.title = '编辑';
				this.dialogVisible = true;
				this.getADInfo(row.id);
			},
			// 查看
			find (row) {
				this.status = "find";
				this.title = '查看';
				this.dialogVisible = true;
				this.getADInfo(row.id);
			},
			// 选中菜单
			handleClick (tab, event) {

				if (tab.name === "banner_doctor") {
					this.type.push(
						{
							name: "经典病例",
							id: 5
						},
						{
							name: "患者招募",
							id: 6
						});
				}
				else {
					this.type = [
						{
							name: "资讯",
							id: 1
						},
						{
							name: "点播课程",
							id: 2
						},
						{
							name: "直播课程",
							id: 4
						},
						{
							name: "医生活动页",
							id: 3
						}
					];
				}
				this.tabName = tab.name;
				this.getData();
			},
			// 获取广告列表
			getData () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/common/advertise/queryListByAdmin",
					advertisePlaceName: this.tabName,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.data = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							type: "error",
							message: res.msg,
							center: true
						});
					}
				});
			}
		},
		mounted () {
			this.$get("/data/my", {
				pathL: "/common/advertisePlace/getAdvertisePlaceList"
			}).then(res => {
				this.adLoading = false;
				if (res.state === 0) {
					this.list = res.data;
					this.initTab = res.data[ 0 ].name;
					this.tabName = res.data[ 0 ].name;
					this.getData();
				}
				else {
					this.$message({
						message: res.msg,
						type: "error",
						center: true
					});
				}
			});

		},
		watch: {
			linkType (now) {
				switch (now) {
					case 0:
						this.form.linkAddress = "";
						break;
					case 1:
						this.form.typeId = "";
						this.form.terminalId = "";
						this.form.channelId = "";
						this.form.articleId = "";
						break;
				}
			},
			dialogVisible (now) {
				if (now === false) {
					this.$refs[ "form" ].resetFields();
					this.form = {
						placeId: 0,
						name: "",
						type: 1,
						url: "",
						sort: "",
						urlType: -1,
						linkAddress: "",
						typeId: "",
						terminalId: "",
						channelId: "",
						articleId: ""
					};
				}
			}
		}
	};
</script>


