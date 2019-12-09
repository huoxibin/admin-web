<!--
* author: huoxibin
* created: 2018/11/6
* describe: 信息管理/启动页管理
-->
<template>
  <div class="health comment">
    <!--左侧tab切换-->
    <el-tabs
      tab-position="left"
      v-model="initTab"
      @tab-click="handleClick"
      style="width:100%;height:100%"
    >
      <!--tab里面内容-->
      <el-tab-pane v-for="item,index in list" v-loading="loading" style="height:100%;" :key="index" :label="item.name"
                   :name="item.id">
        <!--右侧里面内容-->
        <!--title标题-->
        <div class="title-bar">
          <p>列表信息</p>
          <el-button @click="add(item)" size="mini" type="primary">新增</el-button>
        </div>
        <!--数据列表-->
        <el-table ref="table" :data="tableData" border stripe :style="{width: '100%', height:tableHeight+'px',overflow:'auto'}">
          <el-table-column prop="id" label="序号" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="image" label="图片" align="center">
            <template slot-scope="scope">
              <div class="cover-wrap">
                <img class="cover" :src="scope.row.image" alt>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="持续时长" sortable align="center"></el-table-column>
          <el-table-column prop="updateTime" label="操作时间" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.autoPublish===1"
                @change="status(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.autoPublish===2"
                @click="update(scope.row,item.id)"
                type="text"
                size="small"
              >编辑
              </el-button>
              <el-button @click="find(scope.row)" type="text" size="small">查看</el-button>
              <el-button
                v-if="scope.row.autoPublish===2"
                @click="remove(scope.row)"
                type="text"
                size="small"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageLength"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增 -->
    <el-dialog title="新增" :append-to-body="true" :visible.sync="addDialogVisible" width="600px">
      <el-form
        ref="addForm"
        size="mini"
        :rules="formRules"
        :model="addForm"
        label-width="100px"
        style="width:100%"
        v-loading="addLoading"
        element-loading-text="拼命加载中"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请概括该启动项内容，30字内"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="image">
          <div style="display:flex;align-items: flex-end;">
            <div class="uploadImg" v-loading="loadingPic" element-loading-text="正在上传中···">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="addSuccess"
                :before-upload="addBeforeAvatarUpload"
              >
                <img v-if="addForm.image" :src="addForm.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div style="margin-left:20px;">建议上传1125×2436的图片</div>
          </div>
        </el-form-item>
        <el-form-item label="持续时间" prop="duration">
          <el-col :span="5">
            <el-select v-model="addForm.duration" placeholder>
              <el-option v-for="(item,index) in lengthTime" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" :offset="1">
            秒
          </el-col>
        </el-form-item>

        <el-form-item label="链接地址" prop="linkType">
          <el-radio-group v-model="linkType">
            <div>
              <el-radio :label="2">外链：
                <el-input :disabled="linkType !== 2 " v-model="addForm.link"></el-input>
              </el-radio>
            </div>
            <div style="margin-top: 10px">
              <el-radio :label="1">内链：
                <el-select
                  style="width:20%"
                  v-model="addForm.typeId"
                  placeholder="请选择"
                  @change="typeChange"
                  :disabled="linkType !== 1 "
                >
                  <el-option
                    v-for="item,index in type"
                    :key="index"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
                <el-select
                  style="width:20%"
                  v-model="addForm.channelId"
                  placeholder="请选择"
                  @change="channelChange"
                  :disabled="linkType !== 1 "
                >
                  <el-option
                    v-for="item,index in channel"
                    :key="index"
                    :label="item.channelName"
                    :value="item.channelId"
                  ></el-option>
                </el-select>
                <el-select
                  style="width:20%"
                  v-model="addForm.articleId"
                  placeholder="请选择"
                  :disabled="linkType !== 1 "
                >
                  <el-option
                    v-for="item,index in article"
                    :key="index"
                    :label="item.articleName"
                    :value="item.articleId"
                  ></el-option>
                </el-select>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="发布时间" prop="issueTime">
          <el-date-picker
            v-model="addForm.issueTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible=false">关 闭</el-button>
        <el-button size="small" type="primary" @click="addSubmit(addForm)">保 存</el-button>
      </span>
    </el-dialog>
    <!--查看-->
    <el-dialog title="查看" :append-to-body="true" :visible.sync="findDialogVisible" width="50%">
      <el-form
        ref="findForm"
        size="mini"
        :model="findForm"
        label-width="100px"
        style="width:100%"
        v-loading="findLoading"
        element-loading-text="拼命加载中"
      >
        <el-form-item label="名称">{{findForm.name}}</el-form-item>
        <el-form-item label="类型">
          <p v-if="findForm.type === 1">图片</p>
          <p v-if="findForm.type === 2">视频</p>
        </el-form-item>
        <el-form-item>
          <img style="max-width:200px;max-height:200px;" :src="findForm.image" alt>
        </el-form-item>
        <el-form-item label="持续时间">{{findForm.duration + ' 秒'}}</el-form-item>
        <el-form-item label="链接地址">
          <p v-if="findForm.linkType===2">
            <el-radio v-model="radio" label="1">外链：</el-radio>
            {{findForm.link}}
          </p>
          <p v-if="findForm.linkType===1">
            <el-radio v-model="radio" label="1">内链：</el-radio>
            {{findForm.typeName+'——'+findForm.channelName+'——'+findForm.articleName}}
          </p>
        </el-form-item>
        <el-form-item label="发布时间">{{findForm.publishStartTime + ' '+findForm.publishEndTime}}</el-form-item>

      </el-form>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="编辑" :append-to-body="true" :visible.sync="updateDialogVisible" width="50%">
      <el-form
        ref="updateForm"
        size="mini"
        :rules="formRules"
        :model="updateForm"
        label-width="100px"
        style="width:100%"
        v-loading="updateLoading"
        element-loading-text="拼命加载中"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="updateForm.name" placeholder="请概括该启动项内容，30字内"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="updateForm.type">
            <el-radio :label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="image">
          <div style="display:flex;align-items: flex-end;">
            <div class="uploadImg" v-loading="updateUploadLoading" element-loading-text="正在上传中···">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="updateSuccess"
                :before-upload="updateBeforeAvatarUpload"
              >
                <img v-if="updateForm.image" :src="updateForm.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div style="margin-left:20px;">建议上传1125×2436的图片</div>
          </div>
        </el-form-item>
        <el-form-item label="持续时间" prop="duration">
          <el-select v-model="updateForm.duration" placeholder>
            <el-option v-for="(item,index) in lengthTime" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          秒
        </el-form-item>

        <el-form-item label="链接地址" prop="linkType">
          <el-radio-group v-model="linkType">
            <div>
              <el-radio :label="2">外链：
                <el-input :disabled="linkType !== 2 " v-model="updateForm.link" placeholder></el-input>
              </el-radio>
            </div>
            <div style="margin-top: 10px">
              <el-radio :label="1">内链：
                <el-select
                  style="width:20%"
                  v-model="updateForm.typeId"
                  placeholder="请选择"
                  @change="typeChange"
                  :disabled="linkType !== 1 "
                >
                  <el-option
                    v-for="item,index in type"
                    :key="index"
                    :label="item.typeName"
                    :value="item.typeId"
                  ></el-option>
                </el-select>
                <el-select
                  style="width:20%"
                  v-model="updateForm.channelId"
                  placeholder="请选择"
                  @change="channelChange"
                  :disabled="linkType !== 1 "
                >
                  <el-option
                    v-for="item,index in channel"
                    :key="index"
                    :label="item.channelName"
                    :value="item.channelId"
                  ></el-option>
                </el-select>
                <el-select
                  style="width:20%"
                  v-model="updateForm.articleId"
                  placeholder="请选择"
                  :disabled="linkType !== 1 "
                >
                  <el-option
                    v-for="item,index in article"
                    :key="index"
                    :label="item.articleName"
                    :value="item.articleId"
                  ></el-option>
                </el-select>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间" prop="issueTime">
          <el-date-picker
            v-model="updateForm.issueTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="updateDialogVisible=false">关 闭</el-button>
        <el-button size="small" type="primary" @click="updateSubmit(updateForm)">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import { getCurrDay } from '@/utils/getDate'
	import moment from 'moment';

	export default {
		name: "",
		components: {},
		props: [],
		filters: {},
		data () {
			return {
				pickerOptions: {
					disabledDate: (time) => {
						// 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
						// let a = new moment(Date.now()- 1*8.64e7).startOf('day').format('YYYY-MM-DD HH:mm:ss');
						//
						// console.log(a);
						return time.getTime() <= Date.now() - 1 * 8.64e7;
					}
				},
				tableHeight: 0,
				radio: "1", //查看里面的
				addLoading: false, //新增 对话框 加载标识
				loading: false, //列表数据加载标识
				//tabs切换
				initTab: "6", //tabs 切换标识
				list: [
					{
						name: "哆咖医生",
						id: "6"
					},
					{
						name: "哆咖家庭",
						id: "7"
					}
				],
				//数据列表
				tableData: [],
				//新增--对话框
				addDialogVisible: false,
				addForm: {
					name: "", //名称
					type: 1, //类型
					image: "", //图片地址
					duration: 1, //持续时间
					link: "",
					typeId: "",
					channelId: "",
					articleId: "",
					issueTime: []
				},
				linkType: "", //链接类型
				type: [],
				channel: [],
				channeler: [],
				article: [],
				articleer: [],

				lengthTime: [ 1, 2, 3, 4, 5 ], //持续时间里面的时间
				loadingPic: false, //加载图片标识
				//图片上传的验证
				uploadUrl: "/data/uploadImg",
				uploadHeaders: {
					accessToken: this.$store.getters.accessToken
				},
				formRules: {
					name: [
						{required: true, message: "请输入正确的名称", trigger: "blur"},
						{min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}
					],
					image: [ {required: true, message: "请上传启动页图片"} ],
					duration: [ {required: true} ],
					issueTime: [ {required: true, message: "请选择发布时间"} ]
				},
				//查看---对话款
				findDialogVisible: false, //整个对话框
				findForm: {}, //获取的表单信息
				findLoading: false, //加载标识
				//编辑---对话款
				updateDialogVisible: false, //对话款显示与否的标识
				updateForm: {issueTime: []}, //编辑的form表单
				updateLoading: false, //点击编辑保存的时候标识
				updateUploadLoading: false, //编辑 图片上传标识
				//分页
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1 //当前页码
			};
		},
		created () {
			this.getData();
		},
		mounted () {
			this.caleTableHeight();
			window.onresize = () => {
				//调用methods中的事件
				this.tableHeight = window.innerHeight - 230;
			}
		},
		watch: {
			addDialogVisible (now) {
				if (now === false) {
					this.$refs[ "addForm" ].resetFields();
					this.linkType = "";
					this.addForm.link = "";
					(this.addForm.typeId = ""),
						(this.addForm.channelId = ""),
						(this.addForm.articleId = "");
				}
			},
			updateDialogVisible (now) {
				if (now === false) {
					this.linkType = "";
					this.$refs[ "updateForm" ].resetFields();
				}
			},
			linkType (now) {
				switch (now) {
					case 1:
						this.addForm.link = "";
						this.updateForm.link = "";
						break;
					case 2:
						this.addForm.typeId = "";
						this.addForm.channelId = "";
						this.addForm.articleId = "";
						this.updateForm.typeId = "";
						this.updateForm.channelId = "";
						this.updateForm.articleId = "";
						break;
				}
			}
		},
		methods: {
			caleTableHeight () {

				this.tableHeight = window.innerHeight - 230;
			},
			// 列表请求
			getData () {
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/common/startpage/list",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					ofterminal: Number(this.initTab)
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			// 新增对话款 图片上传
			addSuccess (response, file, fileList) {
				this.addForm.image = response.data.url;
				if (this.addForm.image !== "" || this.addForm.image !== null) {
					this.loadingPic = false;
				}
			},
			addBeforeAvatarUpload (file) {
				this.loadingPic = true;
			},
			//编辑对话款 图片上传
			updateSuccess (response, file, fileList) {
				this.updateForm.image = response.data.url;
				if (this.updateForm.image !== "" || this.updateForm.image !== null) {
					this.updateUploadLoading = false;
				}
			},
			updateBeforeAvatarUpload (file) {
				this.updateUploadLoading = true;
			},
			//tabs选中菜单
			handleClick (tab, event) {
				this.pageNum=1;
				this.initTab = tab.name;
				this.getData();
				this.caleTableHeight();
			},
			// 状态改变
			status (row) {

				this.$post("/data/my", {
					pathL: "/common/startpage/status",
					id: row.id,
					ofterminal: Number(this.initTab),
					status: 3 - row.autoPublish
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							type: "success",
							message: "设置成功",
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
			},
			//新增按钮
			add (id) {
				this.addDialogVisible = true;
				this.getChain(true);
			},
			//内链 第一个下拉框
			typeChange (data) {
				this.addForm.channelId = "";
				this.addForm.articleId = "";
				this.updateForm.channelId = "";
				this.updateForm.articleId = "";
				const filterType = item => item.typeId === data;
				this.channel = this.channeler.filter(filterType);
			},
			//内链 第二个下拉框
			channelChange (data) {
				this.addForm.articleId = "";
				this.updateForm.articleId = "";
				const filterChannel = item => item.channelId === data;
				this.article = this.articleer.filter(filterChannel);
			},
			// 获取内链列表
			getChain (type) {
				this.$post("/data/my", {
					pathL: "/common/startpage/linkTree",
					ofterminal: this.initTab
				}).then(res => {
					if (res.state === 0) {
						if (type) {
							this.type = res.data.linkTree.type;
							this.channeler = res.data.linkTree.channel;
							this.articleer = res.data.linkTree.article;
						}
						else {
							this.type = res.data.linkTree.type;
							this.channeler = res.data.linkTree.channel;
							this.articleer = res.data.linkTree.article;
							this.channel = res.data.linkTree.channel;
							this.article = res.data.linkTree.article;
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
			validPublishTime (formName) {

				let [ start, end ] = [ formName.issueTime[ 0 ] ? formName.issueTime[ 0 ] : '', formName.issueTime[ 1 ] ? formName.issueTime[ 1 ] : '' ];

				let nowTime = new moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

				if (start.localeCompare(nowTime) <= 0) {
					this.$message('开始时间必须大于当前系统时间');
					return false;
				}
				if (!end.localeCompare(start)) {
					this.$message('结束时间必须大于开始时间');
					return false;
				}
				return {start: start, end: end};
			},
			//新增提交
			addSubmit (addForm) {
				this.$refs.addForm.validate(valid => {
					let start, end;

					if (!this.validPublishTime(addForm)) {
						return;
					}
					else {
						start = this.validPublishTime(addForm).start;
						end = this.validPublishTime(addForm).end;
					}

					if (valid) {
						this.addLoading = true;
						const data = {
							pathL: "/common/startpage/add",
							ofterminal: Number(this.initTab),
							name: addForm.name,
							type: addForm.type,
							image: addForm.image,
							duration: addForm.duration,
							linkType: Number(this.linkType),
							link: addForm.link,
							typeId: addForm.typeId,
							channelId: addForm.channelId,
							articleId: addForm.articleId,
							publishStartTime: start,
							publishEndTime: end,
							status: 2,//开启
						};
						this.$post("/data/my", data).then(res => {
							this.addLoading = false;
							this.addDialogVisible = false;
							if (res.state === 0) {
								this.getData();
								this.$message({
									message: "保存成功",
									type: "success",
									center: true
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
					else {
						this.$message({
							message: "请填写正确的表单信息",
							center: true
						});
					}
				});
			},
			//查看按钮
			find (row) {
				this.findDialogVisible = true;
				this.findLoading = true;
				this.$post("/data/my", {
					pathL: "/common/startpage/details",
					id: row.id
				}).then(res => {
					this.findLoading = false;
					if (res.state === 0) {
						this.findForm = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//编辑按钮
			update (row, id) {
				let that = this;
				this.updateDialogVisible = true;
				this.getChain();
				this.updateLoading = true;
				this.$post("/data/my", {
					pathL: "/common/startpage/details",
					id: row.id
				}).then(res => {
					this.updateLoading = false;
					if (res.state === 0) {
						that.updateForm = {issueTime: []};
						that.updateForm = {...res.data, ...that.updateForm};
						that.updateForm.issueTime.push(res.data.publishStartTime);
						that.updateForm.issueTime.push(res.data.publishEndTime);
						that.linkType = that.updateForm.linkType;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//编辑按钮提交
			updateSubmit (updateForm) {
				this.$refs.updateForm.validate(valid => {
					let start, end;
					if (!this.validPublishTime(updateForm)) {
						return;
					}
					else {
						start = this.validPublishTime(updateForm).start;
						end = this.validPublishTime(updateForm).end;
					}
					if (valid) {
						this.updateLoading = true;
						const data = {
							pathL: "/common/startpage/update",
							id: updateForm.id,
							name: updateForm.name,
							type: updateForm.type,
							image: updateForm.image,
							duration: updateForm.duration,
							linkType: Number(this.linkType),
							link: updateForm.link,
							typeId: updateForm.typeId,
							channelId: updateForm.channelId,
							articleId: updateForm.articleId,
							publishStartTime: start,
							publishEndTime: end,
						};
						this.$post("/data/my", data).then(res => {
							this.updateLoading = false;
							this.updateDialogVisible = false;
							if (res.state === 0) {
								this.getData();
								this.$message({
									message: "修改成功",
									type: "success",
									center: true
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
						this.$post("/data/my", {
							pathL: "/common/startpage/delete",
							id: row.id
						}).then(res => {
							if (res.state === 0) {
								this.getData();
								this.$message({
									message: "删除成功！",
									type: "success",
									center: true
								});
							}
							else {
								this.$message({
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
			}
		}
	};
</script>

