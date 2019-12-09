<template>
  <div class="health comment">
    <div class="health-top">
      <!-- 筛选查询 -->
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(ruleForm)" size="mini" type="primary">搜索查询</el-button>
      </div>

      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        inline

        size="mini"
        label-position="right"
        class="m-t-10"
      >
        <el-form-item label="输入搜索:" prop="title">
          <el-input v-model="ruleForm.title" placeholder="标题/短标题/原标题"></el-input>
        </el-form-item>
        <el-form-item label="内容类型:" prop="contextType">
          <el-select v-model="ruleForm.contextType">
            <el-option label="全部" value></el-option>
            <el-option label="文章" value="1"></el-option>
            <el-option label="图片" value="2"></el-option>
            <el-option label="视频" value="3"></el-option>
            <el-option label="音频" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台分类:" prop="channelId">
          <el-select v-model="ruleForm.terminalId" @change="terChange">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item,index in terminals"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章分类:" prop="channelId">
          <el-select v-model="ruleForm.channelId">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item,index in channelIds"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文章来源:" prop="fromChannel">
          <el-input v-model="ruleForm.fromChannel"></el-input>
        </el-form-item>
        <el-form-item label="置顶状态:" prop="isTop">
          <el-select v-model="ruleForm.isTop">
            <el-option label="全部" value></el-option>
            <el-option label="未过期" value="1"></el-option>
            <el-option label="已过期" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容状态:" prop="status">
          <el-select v-model="ruleForm.status">
            <el-option label="全部" value></el-option>
            <el-option label="暂存" value="0"></el-option>
            <el-option label="已上线" value="1"></el-option>
            <el-option label="待审核" value="2"></el-option>
            <el-option label="已过审" value="3"></el-option>
            <el-option label="未过审" value="4"></el-option>
            <el-option label="待上线" value="5"></el-option>
            <el-option label="已下线" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人:">
          <el-input v-model="ruleForm.theCreater"></el-input>
        </el-form-item>
        <el-form-item label="创建日期:">
          <el-date-picker
            size="mini"
            :unlink-panels="true"
            value-format="yyyy-MM-dd"
            v-model="ruleForm.createDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="发布日期:">
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="ruleForm.sendDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

      </el-form>
    </div>
    <div class="health-bottom" v-loading="loading" element-loading-text="正在加载中">

      <!-- 数据操作 -->
      <div class="title-bar">
        <span>数据列表</span>
        <div>
          <el-button size="mini" @click="addShow=true">新增</el-button>
          <el-button size="mini" @click="sortAdmin" :disabled="btnShow">排序管理</el-button>
          <el-button size="mini" @click="setTop">置顶</el-button>
          <el-button size="mini" @click="goGlgl">分类管理</el-button>
          <el-button size="mini" @click="exportExcel" type="success">导出</el-button>
        </div>
      </div>
      <!-- 数据表格 -->
      <div class="column-bottom" ref="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          height="100%"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="标题" align="center" width="400" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="tablePic">
                <img class="ydturl" :src="scope.row.image" alt>
              </div>
              <div
                class="titler"
                :style="scope.row.isTop===1?'color:#00A5EE':''"
              >{{ scope.row.title }}
              </div>
              <div class="tableIcon">
                <img
                  class="flimg"
                  v-if="scope.row.contextType===1"
                  src="./../images/text_icon.png"
                  alt
                >
                <img
                  class="flimg"
                  v-if="scope.row.contextType===2"
                  src="./../images/photo_icon.png"
                  alt
                >
                <img
                  class="flimg"
                  v-if="scope.row.contextType===3"
                  src="./../images/video_icon.png"
                  alt
                >
                <img
                  class="flimg"
                  v-if="scope.row.contextType===4"
                  src="./../images/audio_icon.png"
                  alt
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="terminalChannel" label="平台/分类" align="center">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.terminalChannel" placement="top">
                <div slot="content">
                  <p
                    v-for="item,index in scope.row.terminalChannel.split(',')"
                    :key="index"
                  >{{ item }}</p>
                </div>
                <p style="white-space:nowrap;overflow: hidden;">{{scope.row.terminalChannel}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="fromChannel" label="文章来源" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ADDTIME" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="theCreater" label="创建人" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="readCount" label="阅读量" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
                <span
                  :style="scope.row.readCount>=1000?'color:#f00':''"
                >{{ scope.row.readCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status=== 0" style="color:#c57565">暂存</span>
              <span v-if="scope.row.status=== 1" style="color:#008000">已上线</span>
              <span v-if="scope.row.status=== 2" style="color:#FF0000">待审核</span>
              <span v-if="scope.row.status=== 3" style="color:#0099FF">已过审</span>
              <el-tooltip
                class="item"
                effect="light"
                :content="scope.row.refuseReason"
                placement="top"
              >
                <span v-if="scope.row.status=== 4" style="color:#800080">未过审</span>
              </el-tooltip>
              <span v-if="scope.row.status=== 5" style="color:#33CC00">待上线</span>
              <span v-if="scope.row.status=== 6" style="color:#666666">已下线</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status===0||scope.row.status===2||scope.row.status===4||scope.row.status===6"
                @click="updata(scope.row)"
                type="text"
                size="small"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.status===0||scope.row.status===2||scope.row.status===4||scope.row.status===6"
                @click="remove(scope.row)"
                type="text"
                size="small"
              >删除
              </el-button>
              <el-button
                v-if="scope.row.status===0||scope.row.status===1||scope.row.status===2 || scope.row.status===3 || scope.row.status===4 || scope.row.status===5 || scope.row.status===6"
                type="text"
                size="small"
                @click="jumpUrl(scope.row)"
              >预览
              </el-button>
              <el-button
                v-if="scope.row.status===3||scope.row.status===5"
                @click="fabu(scope.row)"
                type="text"
                size="small"
              >发布
              </el-button>
              <el-button
                v-if="scope.row.status===0||scope.row.status===2"
                type="text"
                size="small"
                @click="verify(scope.row)"
              >审核
              </el-button>
              <el-button
                v-if="scope.row.status===3||scope.row.status===1||scope.row.status===5"
                @click="Downline(scope.row)"
                type="text"
                size="small"
              >下线
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增模态框 -->
    <el-dialog :append-to-body="true" title="请选择文章类型" :visible.sync="addShow" width="50%" center>
      <div class="add_bottom">
        <el-button
          style="width:100px"
          v-for="item,index in addList"
          :disabled="index===1"
          round
          :key="index"
          @click="addrouter(index,item)"
          type="primary"
        >{{item}}
        </el-button>
      </div>
    </el-dialog>

    <!-- 排序管理模态框 -->
    <div class="sortmtk" v-show="sortShow">
      <div class="sort_content">
        <div class="sort_title">
          <span>排序管理</span>
          <i @click="sortShow=false" class="el-icon-close"></i>
        </div>
        <div class="sort_center" v-loading="sortloading" element-loading-text="正在加载中">
          <el-tabs v-model="sortIndex" @tab-click="sortTab">
            <el-tab-pane
              v-for="item,index in sortMenu"
              :key="index"
              :label="item.name"
              :name="item.name"
            >
              <div class="sort-show">
                <el-table :data="sortTables" stripe style="width: 100%;" height="400px">
                  <el-table-column
                    prop="title"
                    label="标题"
                    width="300"
                    align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <div :style="scope.row.isTop===1?'color:#00A5EE':''">{{ scope.row.title }}</div>
                      <div class="tableIcon">
                        <img
                          class="flimg"
                          v-if="scope.row.contextType===1"
                          src="./../images/text_icon.png"
                          alt
                        >
                        <img
                          class="flimg"
                          v-if="scope.row.contextType===2"
                          src="./../images/photo_icon.png"
                          alt
                        >
                        <img
                          class="flimg"
                          v-if="scope.row.contextType===3"
                          src="./../images/video_icon.png"
                          alt
                        >
                        <img
                          class="flimg"
                          v-if="scope.row.contextType===4"
                          src="./../images/audio_icon.png"
                          alt
                        >
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="terminalChannel"
                    label="发布平台"
                    align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span>{{item.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="terminalChannel" label="所属分类" align="center">
                    <template slot-scope="scope">
                      <el-tooltip v-if="scope.row.terminalChannel" placement="top">
                        <div slot="content">
                          <p
                            v-for="item,index in scope.row.terminalChannel.split(',')"
                            :key="index"
                          >{{ item }}</p>
                        </div>
                        <p
                          style="white-space:nowrap;overflow: hidden;"
                        >{{scope.row.terminalChannel}}</p>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="articleType"
                    label="文章来源"
                    align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.articleType=== 1">原创</span>
                      <span v-if="scope.row.articleType=== 2">{{scope.row.fromChannel}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ADDTIME" label="发布时间" align="center"></el-table-column>
                  <el-table-column prop="readCount" label="阅读量" align="center">
                    <template slot-scope="scope">
                        <span
                          :style="scope.row.readCount>=1000?'color:#f00':''"
                        >{{ Number(scope.row.readCount)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status=== 0" style="color:#ccc">暂存</span>
                      <span v-if="scope.row.status=== 1" style="color:#008000">已上线</span>
                      <span v-if="scope.row.status=== 2" style="color:#FF0000">待审核</span>
                      <span v-if="scope.row.status=== 3" style="color:#0099FF">已过审</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.refuseReason"
                        placement="top"
                      >
                        <span v-if="scope.row.status=== 4" style="color:#800080">未过审</span>
                      </el-tooltip>
                      <span v-if="scope.row.status=== 5" style="color:#33CC00">待上线</span>
                      <span v-if="scope.row.status=== 6" style="color:#666666">已下线</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sort" label="排序" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.sort" placeholder="请输入数值"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="sort_btn">
                  <el-button
                    @click="updataSort(sortTable,item.id)"
                    style="width:80px"
                    size="mini"
                    type="primary"
                  >保存
                  </el-button>
                  <el-button
                    @click="sortShow=false"
                    style="width:80px"
                    size="mini"
                    type="info"
                    plain
                  >取消
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 置顶模态框 -->
    <div class="topmtk" v-show="setTopShow">
      <div class="setTop">
        <div class="setTop_top">
          <span>提示</span>
          <i @click="setTopShow=false" class="el-icon-close"></i>
        </div>
        <div class="setTop_center">
          <el-form
            ref="setTopTime"
            :model="setTopTimeFrom"
            :rules="setToprules"
            label-width="80px"
          >
            <el-form-item label="有效期至" prop="time">
              <el-date-picker
                v-model="setTopTimeFrom.time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="setTopTimeGz"
                placeholder="选择置顶时间"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="setTop_bottom">
          <el-button style="width:80px" size="mini" @click="saveTop" type="primary">保存</el-button>
          <el-button style="width:80px" size="mini" type="info" plain @click="setTopShow=false">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 审核模态框 -->
    <div class="topmtk" v-show="setVerifyShow">
      <div class="setTop topmtkVerify">
        <div class="setTop_top">
          <span>提示</span>
          <i @click="setVerifyShow=false" class="el-icon-close"></i>
        </div>
        <div class="setTop_center">
          <el-form
            ref="setVerifyTimeFrom"
            :model="setVerifyTimeFrom"
            :rules="setVerifyrules"
            label-width="80px"
          >
            <el-input
              type="hidden"
              ref="articleId"
              label="articleId"
              style="width:400px"
              v-model="articleId"
            ></el-input>
            <el-form-item label="审核结果">
              <el-radio-group v-model="setVerifyTimeFrom.radio">
                <el-radio :label="3">审核通过</el-radio>
                <el-radio :label="4">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="setVerifyTimeFrom.radio===4">
              <el-form-item label="原因" prop="reason">
                <el-input
                  resize="none"
                  type="textarea"
                  :value="setVerifyTimeFrom.reason"
                  v-model="setVerifyTimeFrom.reason"
                ></el-input>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div class="setTop_bottom">
          <el-button
            style="width:80px"
            size="mini"
            @click="setVerify(setVerifyTimeFrom)"
            type="primary"
          >保存
          </el-button>
          <el-button
            style="width:80px"
            size="mini"
            type="info"
            plain
            @click="setVerifyShow=false"
          >取消
          </el-button>
        </div>
      </div>
    </div>
    <!-- 上线模态框 -->
    <div class="topmtk" v-show="onlineShow">
      <div class="setTop">
        <div class="setTop_top">
          <span>提示</span>
          <i @click="onlineShow=false" class="el-icon-close"></i>
        </div>
        <div class="setTop_center">
          <el-form
            ref="onlineFrom"
            :model="onlineFrom"
            size="mini"
            :rules="onlineFromrules"
            label-width="100px"
          >
            <el-form-item label="发布时间" prop="date">
              <el-date-picker
                v-model="onlineFrom.date"
                type="datetimerange"
                :picker-options="setTopTimeGz"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="选择发布时间"
                end-placeholder="选择下线时间"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="setTop_bottom">
          <el-button style="width:80px" size="mini" @click="online" type="primary">发布</el-button>
          <el-button style="width:80px" size="mini" type="info" plain @click="onlineShow=false">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="fenye">
      <el-pagination
        @size-change="handleSizeChange"
        :current-page="pageNum"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				//tableHeight: 0,
				channelIds: [],
				sortloading: true,
				contextType: "",
				loading: true,
				onlineFrom: {
					date: ""
				},
				onlineFromrules: {
					date: [ {required: true, message: "内容不能为空", trigger: "blur"} ]
				},
				onlineData: {},
				onlineShow: false,
				articleId: null,
				setTopTimeGz: {
					disabledDate: time => {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				seleLength: 0,
				setVerifyShow: false,
				setVerifyTime: "",
				setVerifyTimeFrom: {
					radio: 3,
					reason: ""
				},
				setVerifyrules: {
					reason: [ {required: true, message: "请输入原因", trigger: "blur"} ]
				},
				status: null,
				articleId: null,
				sortIndex: 0,
				pageLength: null,
				btnShow: true,
				setTopTime: "",
				ruleForm: {
					title: "",
					fromChannel: "",
					terminalId: "",
					channelId: "",
					contextType: "",
					createDate: "",
					theCreater: "",
					status: "",
					sendDate: [],
					isTop: ""
				},
				rules: {},
				tableData: [],
				setTopTimeFrom: {
					time: ""
				},
				setToprules: {
					time: [
						{
							required: true,
							message: "请选择时间",
							trigger: "change"
						}
					]
				},
				sortTable: [],
				sortTables: [],
				sortMenu: [],
				addList: [ "文章", "图片", "视频", "音频" ],
				addShow: false,
				sortShow: false,
				setTopShow: false,
				pageNum: 1,
				pageSize: 10,
				terminals: [],
				channels: []
			};
		},
		beforeRouteEnter (to, from, next) {
			if (
				from.name !== "信息管理/健康资讯/资讯列表/修改" &&
				from.name !== "信息管理/健康资讯/资讯列表/预览"
			) {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.ruleForm) {
						vm.ruleForm[ i ] = "";
					}
					vm.initPage();
				});
			}
			else {
				next(vm => {
					vm.initPage();
				});
			}
		},
		methods: {
			// 导出
			exportExcel () {
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let url = `
      ${ realm }news/newsArticle/articleListToFile?
        &version=${ version }
        &accessToken=${ this.$store.getters.accessToken }
        &title=${ this.ruleForm.title }
        &addTimeStart=${ this.ruleForm.createDate[ 0 ] || "" }
        &addTimeEnd=${ this.ruleForm.createDate[ 1 ] || "" }
        &contextType=${ this.ruleForm.contextType }
        &isTop=${ this.ruleForm.isTop }
        &terminalId=${ this.ruleForm.terminalId }
        &channelId=${ this.ruleForm.channelId }
        &status=${ this.ruleForm.status }
        &theCreater=${ this.ruleForm.theCreater }
        &fromChannel=${ this.ruleForm.fromChannel }
        &publishBtime=${ this.ruleForm.sendDate[ 0 ] || "" }
        &publishEtime=${ this.ruleForm.sendDate[ 1 ] || "" }
        &delFlag=${ 0 }
      `;
				this.$get("/data/exportExecl", {
					url: url.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			},
			terChange (now) {
				this.ruleForm.channelId = "";
				const arrFiter = item => item.terminalId === now;
				this.channelIds = this.channels.filter(arrFiter);
			},
			updataSort (sortTable, id) {
				var articleIds = [];
				var sortValue = [];
				for (var s = 0; s < sortTable.length; s++) {
					articleIds.push(sortTable[ s ].id);
					sortValue.push(sortTable[ s ].sort);
				}
				this.$axios
					.post(
						"/data/my",
						this.$qs.stringify({
							pathL: "/news/articleTerminalsort/reSetArticleSortByTerminal",
							articleIds: articleIds.join(","),
							sortValue: sortValue.join(","),
							terminalId: id
						})
					)
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								type: "success",
								message: "设置成功",
								center: true
							});
							this.loadData();
							this.sortShow = false;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
							this.sortShow = false;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			sortAdmin () {
				this.sortloading = true;
				var sortTable = this.sortTable;
				var sortTableOne = [];
				for (var u = 0; u < sortTable.length; u++) {
					sortTableOne += sortTable[ u ].terminalChannel;
				}
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/news/terminalAccount/all"
						}
					})
					.then(res => {
						this.sortloading = false;
						this.sortMenu = res.data.data;
						this.sortIndex = sortMenu[ 0 ].name;
						this.sortTables = [];
						let flag = false;
						let sortTable = this.sortTable;
						let sortMenu = this.sortMenu;
						let sortTables = sortTable.map(item => {
							if (item.terminalChannel.includes(sortMenu[ 0 ].name)) {
								flag = true;
								return item;
							}
						});
						sortTables = [ ...new Set(sortTables) ];
						for (let c in sortTables) {
							if (sortTables[ c ] === undefined) {
								sortTables.splice(c, 1);
							}
						}
						if (flag) {
							this.sortTables = sortTables;
						}
					})
					.catch(err => {
						this.sortloading = false;
					});
				var sortList = this.sortTable;
				for (var s = 0; s < sortList.length; s++) {
					if (sortList[ s ].status === 1) {
						this.sortShow = true;
					}
					else {
						this.$message({
							type: "info",
							message: "请先选择列表中已上线的内容！",
							center: true
						});
						this.sortShow = false;
						break;
					}
				}
			},
			loadData () {
				this.loading = true;
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/news/newsArticle/getArticleList",
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							title: this.ruleForm.title,
							addTimeStart: this.ruleForm.createDate[ 0 ],
							addTimeEnd: this.ruleForm.createDate[ 1 ],
							contextType: this.ruleForm.contextType,
							isTop: this.ruleForm.isTop,
							terminalId: this.ruleForm.terminalId,
							channelId: this.ruleForm.channelId,
							status: this.ruleForm.status,
							theCreater: this.ruleForm.theCreater,
							fromChannel: this.ruleForm.fromChannel,
							publishBtime: this.ruleForm.sendDate[ 0 ],
							publishEtime: this.ruleForm.sendDate[ 1 ],
							delFlag: 0
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.loading = false;
							this.pageLength = res.data.data.total;
							this.tableData = res.data.data.result;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			search (ruleForm) {
				this.pageNum = 1;
				this.contextType = ruleForm.contextType;
				if (this.ruleForm.createDate === null) {
					this.ruleForm.createDate = "";
				}
				if (this.ruleForm.sendDate === null) {
					this.ruleForm.sendDate = "";
				}
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/news/newsArticle/getArticleList",
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							title: this.ruleForm.title,
							addTimeStart: this.ruleForm.createDate[ 0 ],
							addTimeEnd: this.ruleForm.createDate[ 1 ],
							contextType: this.ruleForm.contextType,
							isTop: this.ruleForm.isTop,
							terminalId: this.ruleForm.terminalId,
							channelId: this.ruleForm.channelId,
							theCreater: this.ruleForm.theCreater,
							status: this.ruleForm.status,
							fromChannel: this.ruleForm.fromChannel,
							publishBtime: this.ruleForm.sendDate[ 0 ],
							publishEtime: this.ruleForm.sendDate[ 1 ],
							delFlag: 0
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								type: "success",
								message: "完成查询",
								center: true
							});
							this.pageLength = res.data.data.total;
							this.tableData = res.data.data.result;
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			sortTab (tab) {
				this.sortTables = [];
				let flag = false;
				let sortTable = this.sortTable;
				let sortMenu = this.sortMenu;
				let sortTables = sortTable.map(item => {
					if (item.terminalChannel.includes(tab.label)) {
						flag = true;
						return item;
					}
				});
				sortTables = [ ...new Set(sortTables) ];
				for (let c in sortTables) {
					if (sortTables[ c ] === undefined) {
						sortTables.splice(c, 1);
					}
				}
				if (flag) {
					this.sortTables = sortTables;
				}
			},
			goGlgl () {
				this.$router.push({name: "信息管理/健康资讯/资讯列表/分类管理"});
			},
			remove (row) {
				this.$confirm("您确定要删除该内容吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/news/newsArticle/articleDelFlag",
									articleId: row.id,
									delFlag: 1
								})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "删除成功",
										center: true
									});
									this.loadData();
								}
								else {
									this.$message({
										type: "info",
										message: res.data.msg,
										center: true
									});
								}
							})
							.catch(err => {
								console.log(err);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			fabu (row) {
				this.onlineId = row.id;
				this.onlineShow = true;
			},
			online () {
				this.$refs.onlineFrom.validate(valid => {
					if (valid) {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/news/newsArticle/setNewStatus",
									articleId: this.onlineId,
									status: 5,
									onLineBTime: this.onlineFrom.date[ 0 ],
									onLineETime: this.onlineFrom.date[ 1 ]
								})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										type: "success",
										message: "设置成功",
										center: true
									});
									this.onlineShow = false;
									this.loadData();
								}
								else {
									this.$message({
										type: "info",
										message: res.data.msg,
										center: true
									});
								}
							})
							.catch(err => {
								console.log(err);
							});
					}
					else {
						this.$message({
							message: "请输入时间信息",
							center: true
						});
					}
				});
			},
			Downline (row) {
				this.$axios
					.post(
						"/data/my",
						this.$qs.stringify({
							pathL: "/news/newsArticle/setNewStatus",
							articleId: row.id,
							status: 6
						})
					)
					.then(res => {
						if (res.data.state === 0) {
							this.$message({
								type: "success",
								message: "设置成功",
								center: true
							});
							this.loadData();
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			updata (row) {
				this.$router.push({
					name: "信息管理/健康资讯/资讯列表/修改",
					query: {
						id: row.id,
						contextType:row.contextType
					}
				});
			},
			jumpUrl (row) {
				this.$router.push({
					name: "信息管理/健康资讯/资讯列表/预览",
					query: {
						id: row.id
					}
				});
			},

			saveTop () {
				this.$axios
					.post(
						"/data/my",
						this.$qs.stringify({
							pathL: "/news/newsArticle/articleToTop",
							articleId: this.articleId,
							topEndTime: this.setTopTimeFrom.time
						})
					)
					.then(res => {
						if (res.data.state === 0) {
							this.setTopShow = false;
							this.$message({
								type: "success",
								message: "置顶成功",
								center: true
							});
							this.loadData();
						}
						else {
							this.$message({
								type: "info",
								message: res.data.msg,
								center: true
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			setTop () {
				if (this.seleLength === 0) {
					this.$message({
						message: "请先选择列表中已上线的内容！",
						center: true
					});
				}
				else if (this.seleLength === 1) {
					if (this.status == 1) {
						//已上线；判断选中的数据是否是一上线
						var now = new Date(); //当前日期
						var nowDay = now.getDate(); //当前日
						var nowMonth = now.getMonth() + 1; //当前月
						var nowYear = now.getFullYear(); //当前年
						var iHour = now.getHours();
						var iMinute = now.getMinutes();
						var iSecond = now.getSeconds();
						this.setTopTimeFrom.time =
							now.getFullYear() +
							"-" +
							addZero(nowMonth) +
							"-" +
							addZero(nowDay) +
							" " +
							addZero(iHour) +
							":" +
							addZero(iMinute) +
							":" +
							addZero(iSecond);
						this.setTopShow = true;
					}
					else {
						this.$message({
							message: "请选择列表中已上线的内容！",
							center: true
						});
					}
				}
				else {
					this.$message({
						message: "请选择一条内容！",
						center: true
					});
				}

				function addZero (n) {
					if (n < 10) {
						return "0" + n;
					}
					else {
						return "" + n;
					}
				}
			},
			verify (data) {
				this.articleId = data.id;
				this.setVerifyShow = true;
			},
			setVerify (formName) {
				if (
					this.setVerifyTimeFrom.radio === 4 &&
					this.setVerifyTimeFrom.reason === ""
				) {
					this.$message({
						message: "请输入审核原因",
						center: true
					});
				}
				else {
					this.$axios
						.post(
							"/data/my",
							this.$qs.stringify({
								pathL: "/news/newsArticle/setNewStatus",
								articleId: this.articleId,
								status: this.setVerifyTimeFrom.radio,
								unAuditMemo: this.setVerifyTimeFrom.reason
							})
						)
						.then(res => {
							if (res.data.state === 0) {
								this.setVerifyShow = false;
								this.$message({
									type: "success",
									message: "成功",
									center: true
								});
								this.loadData();
							}
							else {
								this.$message({
									type: "info",
									message: res.data.msg,
									center: true
								});
							}
						})
						.catch(err => {
							console.log(err);
						});
				}
			},

			resetForm (formName) {
				this.$refs[ formName ].resetFields();
			},
			handleSelectionChange (val) {
				this.sortTable = val;
				if (val.length > 0) {
					this.btnShow = false;
				}
				else {
					this.btnShow = true;
				}
				this.seleLength = val.length;
				this.status = this.seleLength === 0 ? "" : val[ 0 ].status;
				this.articleId = this.seleLength === 0 ? "" : val[ 0 ].id;
			},
			handleSizeChange (val) {
				this.pageSize = val;
				this.loadData();
			},
			handleCurrentChange (val) {
				this.pageNum = val;
				this.loadData();
			},
			addrouter (index, item) {
				this.$router.push({
					name: "信息管理/健康资讯/资讯列表/新增",
					query: {id: index + 1, title: item}
				});
			},
			siteSearchQuery (data) { // 重置查询条件
				let that = this;
				data.forEach(item => {
					if (item.appid == that.$route.query.appid) {
						that.ruleForm.terminalId = item.id;
					}
				})
			},
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.ruleForm.sendDate = [ this.$route.query.start, this.$route.query.end ];
				}

				let that = this;
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/news/newsChannel/channelTree"
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							that.terminals = res.data.data.terminals;
							that.channels = res.data.data.channels;
							if (that.$route.query.appid != undefined) {
								that.siteSearchQuery(that.terminals);
							}
							that.loadData();
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
		},
		mounted () {
			this.initPage();
			// 获取 table 高度
			// this.$nextTick(() => {
			// 	this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop;
			// })
		},
		deactivated () {
			this.addShow = false;
		}
	};
</script>

<style scoped>


  .form_top,
  .form_bottom {
    width: 100%;
    height: 36px;
  }

  .addmtk {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .addmtk_content {
    width: 400px;
    height: 200px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 1px solid #999;
  }

  .add_top {
    width: 100%;
    height: 30px;
    background: rgba(136, 136, 136, 0.2);
    text-align: center;
    position: relative;
    border-bottom: 1px solid #999;
  }

  .add_top span {
    line-height: 30px;
    color: #333;
    font-size: 14px;
  }

  .add_top i {
    position: absolute;
    right: 10px;
    line-height: 30px;
    cursor: pointer;
  }

  .add_bottom {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
    align-items: center;
  }

  .sortmtk {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sort_content {
    width: 1200px;
    height: 600px;
    background: #fff;
  }

  .sort_title,
  .setTop_top {
    width: 100%;
    height: 40px;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    text-align: center;
    line-height: 40px;
  }

  .sort_title i,
  .setTop_top i {
    float: right;
    margin-right: 10px;
    line-height: 40px;
    cursor: pointer;
  }

  .sort_top {
    width: 100%;
    height: 60px;
  }

  .sort_top ul {
    width: 100%;
    height: 50px;
    display: flex;
  }

  .sort_top ul li {
    flex: 1;
    height: 50px;
    text-align: center;
    margin: 5px;
    line-height: 50px;
    background: rgba(226, 226, 226, 1);
    cursor: pointer;
    color: #333;
  }

  .sort_top ul .now {
    background: rgba(0, 165, 238, 1);
    color: #fff;
  }

  .sort_center {
    width: 100%;
    height: 560px;
    overflow: auto;
    box-sizing: border-box;
    padding: 5px;
  }

  .sort-show {
    width: 100%;
    height: 490px;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    align-items: center;
  }

  .sort_btn {
    width: 100%;
    height: 50px;
    display: flex;
    border-top: 1px solid #ccc;
    justify-content: space-around;
    align-items: center;
  }

  .topmtk {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .setTop {
    width: 600px;
    height: 200px;
    background: #fff;
  }

  .topmtkVerify {
    width: 500px;
    height: 300px;
  }

  .setTop_center {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .topmtkVerify .setTop_center {
    height: 200px;
  }

  .topmtkVerify .el-textarea__inner {
    width: 204px;
  }

  .topmtkVerify .setTop_bottom {
    height: 55px;
  }

  .setTop_bottom {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #ccc;
  }

  .fenye {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    z-index: 200;
    justify-content: flex-end;
    border-top: 1px solid #ccc;
    background: #fff;
  }

  .tablePic {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .tablePic:hover .ydturl {
    width: 200%;
    height: 200%;
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
  }

  .tableIcon {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .titler {
    width: 100%;
    height: 100%;
    padding-left: 40px;
    padding-right: 30px;
    text-align: left;
    box-sizing: border-box;
  }

  .el-table_2_column_10 {
    position: relative;
  }

  .ydturl {
    width: 100%;
    height: 100%;
    transition: 0.5s;
  }

  .flimg {
    width: 100%;
    height: 100%;
  }
</style>
