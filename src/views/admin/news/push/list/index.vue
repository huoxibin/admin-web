<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button size="mini" @click="search" type="primary">搜索查询</el-button>
      </div>
    </div>
    <div class="form">
      <el-form
        :inline="true"
        :model="form"
        size="mini"
        style="margin-top:18px;"
        label-width="80px"
        class="demo-form-inline"
      >
        <el-form-item label="操作人">
          <el-input v-model="form.operateName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.sendType">
            <el-option label="全部" value></el-option>
            <el-option label="待发送" :value="1"></el-option>
            <el-option label="已发送" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送平台">
          <el-select v-model="form.sendPlatform">
            <el-option label="全部" value></el-option>
            <el-option label="医哆咖" :value="1"></el-option>
            <el-option label="哆咖医生" :value="3"></el-option>
            <el-option label="哆咖家庭" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送渠道">
          <el-select v-model="form.sendChannel">
            <el-option label="全部" value></el-option>
            <el-option label="站内信" :value="1"></el-option>
            <el-option label="PUSH" :value="2"></el-option>
            <el-option label="短信" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送日期">
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <p>数据列表</p>
        <el-button size="mini" @click="dialogVisible = true" type="primary">新 增</el-button>
      </div>
      <div class="column-bottom" ref="table" v-loading="loading" element-loading-text="正在加载中">
        <el-table ref="data" :data="data" :height="tableHeight" stripe border style="width: 100%">
          <el-table-column type="index" :index="indexMethod" label="序号" align="center"></el-table-column>
          <el-table-column prop="messageContent" label="消息内容" align="center"></el-table-column>
          <el-table-column prop="sendPlatformName" label="发送平台" align="center"></el-table-column>
          <el-table-column prop="sendChannelName" label="发送渠道" align="center"></el-table-column>
          <el-table-column prop="sendType" label="状态" align="center"></el-table-column>
          <el-table-column prop="operateName" label="操作人" align="center"></el-table-column>
          <el-table-column prop="sendNumber" label="发送条数" align="center"></el-table-column>
          <el-table-column prop="arriveNumber" label="到达条数" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" align="center"></el-table-column>
          <el-table-column prop="sendTime" label="发送日期" align="center"></el-table-column>
          <el-table-column fixed="right" prop="date" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.sendType==='待发送'"
                @click="update(scope.row)"
                type="text"
                size="small"
              >编辑
              </el-button>
              <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
              <el-button
                v-if="scope.row.sendType==='待发送'"
                @click="send(scope.row)"
                type="text"
                size="small"
              >发送
              </el-button>
              <el-button
                v-if="scope.row.sendType==='待发送'"
                @click="remove(scope.row)"
                type="text"
                size="small"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>

    <!-- 发布对象dialog -->
    <el-dialog title="选择发送渠道" :append-to-body="true" :visible.sync="dialogVisible" width="30%">
      <el-button size="mini" @click="add(1)" type="primary">站内信</el-button>
      <el-button size="mini" @click="add(2)" type="primary">PUSH</el-button>
      <el-button size="mini" @click="add(3)" type="primary">短 信</el-button>
    </el-dialog>

    <!-- 发送dialog -->
    <el-dialog title="发送" :append-to-body="true" :visible.sync="sendDialogVisible" width="50%">
      <el-form :model="sendForm" size="mini" label-width="100px">
        <el-form-item>
          <el-radio-group v-model="sendForm.sendKind">
            <el-radio :label="1">立即发送</el-radio>
            <el-radio :label="2">预约发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            :disabled="sendForm.sendKind!==2"
            v-model="sendForm.sendTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="sendSubmit" type="primary">确 定</el-button>
          <el-button size="mini" @click="sendDialogVisible = false">返 回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		name: "Push",
		computed: {
			sendKind () {
				return this.sendForm.sendKind;
			}
		},
		data () {
			return {
				tableHeight:0,
				loading: false,
				form: {
					operateName: "",
					sendType: "",
					sendPlatform: "",
					sendChannel: "",
					date: []
				},
				data: [],
				pageNum: 1,
				pageSize: 10,
				pageLength: null,
				dialogVisible: false,
				sendDialogVisible: false,
				pickerOptions: {
					disabledDate (time) {
						return time.getTime() < Date.now();
					}
				},
				sendForm: {
					sendKind: 1,
					sendTime: ""
				}
			};
		},
		watch: {
			sendKind (now) {
				this.sendForm.sendTime = "";
			}
		},
		mounted () {
			if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
				this.form.date = [ this.$route.query.start, this.$route.query.end ];
			}
			// 获取 table 高度
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
			})
			window.onresize = ()=>{
				//调用methods中的事件
				this.$nextTick(() => {
					this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;

				})
			}
			this.getData();
		},
		methods: {
			// 序号
			indexMethod (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 获取列表
			getData (search) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/ap/messageSendInfo/getMessageList",
					operateName: this.form.operateName,
					sendType: this.form.sendType,
					sendPlatform: this.form.sendPlatform,
					sendChannel: this.form.sendChannel,
					startTime: this.form.date === null ? "" : this.form.date[ 0 ],
					endTime: this.form.date === null ? "" : this.form.date[ 1 ],
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						if (search) {
							this.$message({
								type: "success",
								message: "搜索完成",
								center: true
							});
						}
						this.data = res.data.messageList;
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
			// 筛选查询
			search () {
				this.pageNum = 1;
				this.getData(true);
			},
			// 新增
			add (sendChannel) {
				this.$router.push({
					path: "/news/push/edit/add",
					query: {sendChannel}
				});
			},
			// 编辑
			update (row) {
				this.$router.push({
					path: "/news/push/edit/update",
					query: {
						id: row.id
					}
				});
			},
			// 查看
			detail (row) {
				this.$router.push({
					path: "/news/push/edit/detail",
					query: {
						id: row.id
					}
				});
			},
			// 发送
			send (row) {
				this.sendForm.messageId = row.id;
				this.sendForm.messageContent = row.messageContent;
				this.sendForm.sendChannel = row.sendChannel;
				this.sendForm.sendPlatform = row.sendPlatform;
				this.sendDialogVisible = true;
			},
			// 发送提交
			sendSubmit () {
				this.$get("/data/my", {
					pathL: "/ap/messageSendInfo/sendMessage",
					sendKind: this.sendForm.sendKind,
					messageId: this.sendForm.messageId,
					messageContent: this.sendForm.messageContent,
					sendTime: this.sendForm.sendTime,
					sendChannel: this.sendForm.sendChannel,
					sendPlatform: this.sendForm.sendPlatform
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							type: "success",
							message: "设置成功",
							center: true
						});
						this.sendDialogVisible = false;
						this.getData();
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 删除
			remove (row) {
				this.$confirm("此操作将永久删除是否继续？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$get("/data/my", {
							pathL: "/ap/messageSendInfo/deleteMessage",
							messageId: row.id
						}).then(res => {
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
			// 分页
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			}
		}
	};
</script>
