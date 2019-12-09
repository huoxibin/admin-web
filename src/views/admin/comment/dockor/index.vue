<template>
  <div class="health comment">
    <base-layout ref="layout" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model="form.businessTitle"></el-input>
        </el-form-item>
        <el-form-item label="评论用户">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="form.commentsCotent"></el-input>
        </el-form-item>
        <el-form-item label="评论状态">
          <el-select v-model="form.commentsStatus">
            <el-option label="全部" value></el-option>
            <el-option label="通过" :value="2"></el-option>
            <el-option label="屏蔽" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="form.roleType">
            <el-option label="全部" value=""></el-option>
            <el-option label="用户" value="0"></el-option>
            <el-option label="医多咖" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户状态">
          <el-select v-model="form.userStatus">
            <el-option label="全部" value></el-option>
            <el-option label="正常状态" :value="0"></el-option>
            <el-option label="暂时禁言" :value="1"></el-option>
            <el-option label="永久禁言" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <div slot="table" class="comment-table">
        <div class="table-radio">
          <el-radio-group
            style="margin: 10px"
            v-model="form.businessType"
            @change="handleChange"
            size="mini"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button
              v-for="item in list"
              :key="item.id"
              :label="item.itemValue"
            >{{item.itemName}}
            </el-radio-button>
          </el-radio-group>
        </div>

        <!--<div class="box">批量操作</div>-->
        <el-table
          ref="multipleTable"
          :data="data"

          border
          stripe
          :height="tableHeight"
          @select="handleSelect"
        >
          <el-table-column type="selection" :selectable="selectable" width="80" align="center"></el-table-column>
          <el-table-column
            type="index"
            :index="serialNumber"
            width="100"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column label="文章标题" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="preview(scope.row)"
              >{{scope.row.businessTitle}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="评论用户" align="center"></el-table-column>
          <el-table-column label="评论内容" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="top"
                trigger="hover"
                :content="scope.row.content"
              >
                <p slot="reference">{{scope.row.contentInsensitive}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="评论时间" align="center"></el-table-column>
          <el-table-column prop="checkState" label="评论状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.checkState == 2">通过</p>
              <p v-if="scope.row.checkState == 3">屏蔽</p>
            </template>
          </el-table-column>
          <el-table-column label="用户状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.userStatus === '--'">{{ scope.row.userStatus }}</p>
              <p v-else style="color: #f00;">{{ scope.row.userStatus }}</p>
            </template>
          </el-table-column>
          <el-table-column width="100px" fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.userStatusType==0"
                @click="banned(1, scope.row)"
              >禁言
              </el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.checkState === 2"
                @click="handleStatus(1, 3, scope.row)"
              >屏蔽
              </el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.checkState === 3"
                @click="handleStatus(1, 2, scope.row)"
              >通过
              </el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.userStatusType != 0"
                @click="solution(1, scope.row)"
              >解禁
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="table-footer">
          <el-button
            type="danger"
            size="mini"
            v-if="status === 2 || status === 3"
            @click="banned(0)"
          >禁言
          </el-button>
          <el-button type="warning" size="mini" v-if="status === 2" @click="handleStatus(0, 3)">屏蔽</el-button>
          <el-button type="success" size="mini" v-if="status === 3" @click="handleStatus(0, 2)">通过</el-button>
          <el-button type="primary" size="mini" v-if="status === 1" @click="solution(0)">解禁</el-button>
        </div>
      </div>
    </base-layout>
    <!-- 禁言 -->
    <el-dialog title="禁言" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <p>禁言时长</p>
      <el-radio-group style="margin:20px 0" v-model="date">
        <el-radio v-for="item in radioList" :key="item.value" :label="item.value">{{item.name}}</el-radio>
      </el-radio-group>

      <div class="popover">
        <el-button style="margin-right: 20px" type="primary" size="mini" @click="customize">自定义</el-button>
        <el-input size="mini" style="width: 100px" v-model="bannedForm.day" :disabled="date !== ''"></el-input>
        <span style="margin: 0 10px">天</span>
        <el-input
          size="mini"
          style="width: 100px"
          v-model="bannedForm.time"
          :disabled="date !== ''"
        ></el-input>
        <span style="margin: 0 10px">时</span>
        <el-input
          size="mini"
          style="width: 100px"
          v-model="bannedForm.minute"
          :disabled="date !== ''"
        ></el-input>
        <span style="margin: 0 10px">分</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="date === '' && bannedForm.day === '' && bannedForm.time === '' && bannedForm.minute === ''"
          @click="bannedSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import { isValidNumber } from "@/utils/RegExp";
	import format from "@/utils/date-format";

	export default {
		name: "Comment",
		data: () => ({
			form: {
				pathL: "/family/commentsCheck/getCommentsList",
				businessTitle: "",
				userName: "",
				commentsCotent: "",
				commentsStatus: "",
				userStatus: "",
				businessType: "",
				roleType: ''
			},
			list: [],
			data: [],
			selection: [],
			dialogVisible: false,
			visible: false,
			status: null,
			pageNum: 1,
			pageSize: 10,
			date: "",
			radioList: [
				{
					name: "1小时",
					value: 3600
				},
				{
					name: "12小时",
					value: 43200
				},
				{
					name: "24小时",
					value: 86400
				},
				{
					name: "3天",
					value: 259200
				},
				{
					name: "7天",
					value: 604800
				},
				{
					name: "30天",
					value: 2592000
				},
				{
					name: "永久禁言",
					value: -1
				}
			],
			bannedForm: {
				day: "",
				time: "",
				minute: ""
			},
			tableHeight: 0,
		}),
		watch: {
			pageNum (now) {
				this.status = null;
			},
			date (now) {
				this.bannedForm.day = "";
				this.bannedForm.time = "";
				this.bannedForm.minute = "";
			},
			dialogVisible (now) {
				this.bannedForm.day = "";
				this.bannedForm.time = "";
				this.bannedForm.minute = "";
				this.date = "";
			}
		},
		mounted () {
			// 获取 table 高度
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 440;
			})
			this.getList();
		},
		methods: {
			// 获取数据
			getData (data) {
				this.data = data.result;
				this.pageNum = data.pageNum;
				this.pageSize = data.pageSize;
			},
			// 修改分类
			handleChange () {
				this.status = null;
				const getData = this.$refs.layout.getData;
				getData();
			},
			// 表格序号
			serialNumber (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 获取分类
			getList () {
				this.$get("/data/my", {
					pathL: "/ap/sysDictItem/getValueByName",
					dictName: "userCommentBusinessType"
				}).then(res => {
					if (res.state === 0) {
						this.list = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 预览文章
			preview (row) {
				const businessType = row.businessType;
				const path = row.businessType == 12 ? '/commodity/playCourse/detail' : '/commodity/course/detail';
				debugger
				this.$router.push({
					path: path,
					query: {
						id: row.businessId
					}
				});
			},
			// 点击选择框
			handleSelect (selection, row) {
				const length = selection.length;
				if (length === 0) {
					this.status = null;
				}
				else {
					this.status = row.judgeFlagRtn;
				}
				this.selection = selection;
			},
			// 选择框是否可选
			selectable (row, index) {
				if (this.status) {
					return row.commentStatusRtn === this.status;
				}
				else {
					return true;
				}
			},
			// 禁言
			banned (type, row) {
				if (type === 1) {
					this.selection = [ row ];
				}
				this.dialogVisible = true;
			},
			// 禁言自定义
			customize () {
				this.date = "";
			},
			// 禁言提交
			bannedSubmit () {
				// 自定义时分秒
				const {day, time, minute} = this.bannedForm;
				// 禁言时间戳
				let date = null;

				if (this.date === "") {
					if (
						!isValidNumber(day) ||
						!isValidNumber(time) ||
						!isValidNumber(minute)
					) {
						this.$message({
							type: "warning",
							message: "请输入正确的时间，时间不得为空",
							center: true
						});
					}
					else {
						const dayS = Number.parseInt(day) * 24 * 60 * 60;
						const timeS = Number.parseInt(time) * 60 * 60;
						const minuteS = Number.parseInt(minute) * 60;
						date = dayS + timeS + minuteS;
					}
				}
				else {
					date = this.date;
				}
				// 时间获取成功
				if (date) {
					// 限制三十天
					const thirty = 30 * 24 * 60 * 60;
					if (date > thirty) {
						this.$message({
							type: "warning",
							message: "自定义禁言时间不能超过30天",
							center: true
						});
					}
					else {
						const getData = this.$refs.layout.getData;
						let forbidDateTime = null;
						if (date === -1) {
							forbidDateTime = -1;
						}
						else {
							// 获取当前时间戳
							const statrDate = Number.parseInt(new Date().getTime() / 1000);
							// 禁言到期时间
							const endDate = statrDate + date;
							// 根据时间戳生成的时间对象
							forbidDateTime = format(new Date(endDate * 1000));
						}
						const selection = this.selection.map(item => {
							return {
								forbidUserId: item.userId,
								forbidDateTime,
								forbidRoleType: item.roleType,
								mainCommentId: item.mainCommentId,
								commemtId: item.id
							};
						});
						this.$post("/data/my", {
							pathL: "/family/commentsCheck/setUserForbidStatus",
							forbidArryJsonStr: JSON.stringify(selection)
						}).then(res => {
							if (res.state === 0) {
								this.status = null;
								this.$message({
									type: "success",
									message: "设置成功",
									center: true
								});
								getData();
								this.dialogVisible = false;
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
			},
			// 解禁
			solution (type, row) {
				this.$confirm("此操作将解禁该用户, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						const getData = this.$refs.layout.getData;
						if (type === 1) {
							this.selection = [ row ];
						}
						const selection = this.selection.map(item => {
							return {
								userId: item.userId,
								roleType: item.roleType
							};
						});
						this.$post("/data/my", {
							pathL: "/family/commentsCheck/deleteUserForbiden",
							deleteDoctorForbiden: JSON.stringify(selection)
						}).then(res => {
							if (res.state === 0) {
								this.status = null;
								this.$message({
									type: "success",
									message: "解禁成功!",
									center: true
								});
								getData();
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
							message: "已取消解禁",
							center: true
						});
					});
			},
			// 屏蔽通过状态修改
			handleStatus (type, status, row) {
				this.$confirm(
					status === 2
						? "通过后，前端将可展示，您确定要通过吗？"
						: "屏蔽后，前端将不可展示，您确定要屏蔽吗？",
					"评论",
					{
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}
				)
					.then(() => {
						const getData = this.$refs.layout.getData;
						if (type === 1) {
							this.selection = [ row ];
						}
						const selection = this.selection.map(item => {
							return {
								mainCommentId: item.mainCommentId,
								commemtId: item.id,
								checkStateNum: status
							};
						});

						//mainCommentId;
						//commemtId;
						//checkStateNum 2-通过 3-屏蔽


						this.$post("/data/my", {
							pathL: "/family/commentsCheck/setCommentsStatus",
							setCommentsStatus: JSON.stringify(selection)
						}).then(res => {
							if (res.state === 0) {
								this.status = null;
								this.$message({
									type: "success",
									message: "设置成功!",
									center: true
								});
								getData();
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
							message: "已取消操作",
							center: true
						});
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
  .comment {
    width: 100%;
  }

  .popover {
    display: flex;
    align-items: center;
  }
</style>

