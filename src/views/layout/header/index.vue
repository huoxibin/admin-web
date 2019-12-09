<template>
  <header onselectstart="return false">
    <!-- logo -->
    <div class="header-left">
      <div @click="logo" class="logo">{{$route.matched[0].meta.title}}</div>
      <!--平台按钮-->
      <el-button
        v-for="(item, index) in platform"
        :key="item.id"
        round
        size="mini"
        type="success"
        v-if="item.menuName!=='接口平台' && item.menuName!=='监管平台'"
        @click="jump(item.menuName, item.menuName)"
        :class="{'active': item.menuName === nowIndex}"
      >{{item.menuName}}
      </el-button>
      <el-button
        v-for="(item, index) in platform"
        :key="item.id"
        round
        size="mini"
        type="success"
        v-if="item.menuName=='接口平台' || item.menuName=='监管平台'"
        @click="jump(item.menuName, item.menuName)"
      >{{item.menuName}}
      </el-button>
    </div>

    <!-- 登陆信息 -->
    <div class="message">
      <!-- 消息提醒 -->
      <div class="badge" v-if="purview" @click="goMessage">
        <el-badge :value="news" :max="99">
          <i class="el-icon-bell" style="font-size:24px;color:#fff;" :class="news>0?'swing':''"></i>
        </el-badge>
      </div>

      <el-popover placement="bottom" v-model="userShow" class="user">
        <div class="userBtn">
          <el-button @click="resetShow=true;userShow=false" type="success" size="mini" plain>重置密码</el-button>
          <el-button @click="loginOut" type="danger" size="mini" plain>退出系统</el-button>
        </div>
        <div slot="reference" class="user">
          <div class="userimg">
            <img :src="userInfo.headImg" alt>
          </div>
          <span class="username">{{userInfo.loginName}}</span>
          <div style="color:#fff;" class="el-icon-caret-bottom"></div>
        </div>
      </el-popover>
    </div>

    <!-- 重置密码模态框 -->
    <div class="resetPassword" v-show="resetShow">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>重置密码</span>
        </div>
        <div class="text item">
          <el-form ref="passwordFrom" size="mini" :model="passwordFrom" label-width="100px">
            <el-form-item label="输入原密码">
              <el-input v-model="passwordFrom.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="输入新密码">
              <el-input v-model="passwordFrom.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="再次输入">
              <el-input v-model="passwordFrom.newPassworder" type="password"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="resetBtn">
          <el-button @click="resetPassword(passwordFrom)" size="mini" type="primary">确定</el-button>
          <el-button size="mini" @click="resetShow=false" type="info" plain>取消</el-button>
        </div>
      </el-card>
    </div>

    <!-- 消息提示 -->
    <transition name="fade">
      <el-card class="box-card message-box" v-show="messageShow">
        <div slot="header" class="clearfix">
          <span>消息通知</span>
          <el-popover placement="top" trigger="click" v-model="messageVisible">
            <el-button size="mini" @click="messageCloseToday" type="primary">本日不再提醒</el-button>
            <el-button size="mini" @click="messageClose" type="danger">关闭</el-button>
            <i
              slot="reference"
              style="float: right; padding: 3px 0;color:#f00;cursor: pointer; color: #333;"
              class="el-icon-circle-close-outline"
            >X</i>
          </el-popover>
        </div>
        <div class="messages">
          <p v-if="msg !==null">
            <span
              v-for="(item,index) in msg.lists"
              :style="item === '异' || item === '常' || item === '↑' || item === '↓'?'color:#f00;':''"
              :key="index"
            >{{item}}</span>
          </p>
          <div>
            <el-button
              style="margin: 20px 0;"
              size="mini"
              @click="detail(msg)"
              type="primary"
            >点击查看详情
            </el-button>
          </div>
        </div>
      </el-card>
    </transition>

    <!--呼叫信息-->
    <!--<button style="position: fixed; bottom: 130px; right: 20px; z-index: 999999" onclick="callPeople()">呼叫</button>-->

    <div class="videoOnCall" id="videoOnCall" style="z-index: 999999;">
      <div class="header">医哆咖语音呼入提醒</div>
      <div id="netcall-video-local" style="">
      </div>
      <div id="netcall-video-remote">
        <button style="display: inline;" @click="judgeWordType">接听</button>
      </div>
    </div>

    <div class="hangupCall" id="hangupCall" style="z-index: 999999;">
      <div>时长<b id="timeSecond"></b></div>
      <button style="display: inline;" onClick="hangup()">挂断</button>
    </div>
  </header>
</template>

<script>
	import { mapGetters } from "vuex";
	import { setMessageCookie, getCookie } from "@/utils/cookie";

	export default {
		computed: {
			...mapGetters([ "userInfo" ])
		},
		data () {
			return {
				callWindow: false,//拨号
				calledWin: false,//接听
				purview: false,
				messageVisible: false,
				news: 0,
				msg: null,
				userShow: false,
				resetShow: false,
				messageShow: false,
				platform: [],
				passwordFrom: {
					oldPassword: "",
					newPassword: "",
					newPassworder: ""
				},
				nowIndex: sessionStorage.platformName,
				isOpenMsg: false,
				linkUrlFg: false,
			};
		},
		watch: {
			//监听路由变化
			$route (to, from) {
				console.log("88");
				this.judgeMesgShowHide();
			}
		},
		created () {
			this.platform = this.$store.getters.menuInfo.menu;
			this.platform = this.platform;
			this.judgeMesgShowHide();
		},
		methods: {
			judgeWordType () {
				console.log(this.$store.getters.menuInfo.menu);
				this.$store.getters.menuInfo.menu.forEach(item => {
					callLinkUrl(item, '/work/order');
				})
				this.judgeCallSh();
				onCallAccepted();
			},
			judgeCallSh () {
				let str = '';
				switch (Number(this.$store.getters.trafficChannel.orderType)) {
					case 1: {
						str = 'afterSale';
					}
						break;
					case 2: {
						str = 'health';
					}
						break;
					case 3: {
						str = 'clue';
					}
						break;
				}
				if (linkUrlFg) {
					this.$router.push({
						path: '/work/order/add',
						query: {
							add: str
						}
					})
					document.getElementById('videoOnCall').style.display = 'none';
					document.getElementById('hangupCall').style.display = 'block';
				}
				else {
					alert("暂无访问工单新增页面权限！");
				}
			},

			///////////////////////////////////////////////////////////
			judgeMesgShowHide () {
				const btnMenu = this.$store.getters.menuInfo.btnMenu;
				if (this.nowIndex == "客服平台") {
					btnMenu.forEach(item => {
						if (item.menuName == '客服平台') {
							for (let it of item.btnList) {
								let linkUrl = it.linkUrl;
								if (linkUrl === "/message/list") {
									this.purview = true;
								}
							}
						}
					});
				}
				else {
					this.purview = false;
				}
				this.gethasMesgBtn();
				if (this.purview && this.isOpenMsg) {
					this.getMessage();
				}
			},
			gethasMesgBtn () {
				if (this.nowIndex == "客服平台") {
					this.isOpenMsg = true;
				}
				else {
					this.isOpenMsg = false;
					this.messageShow = false;
				}
			},
			// 获取消息
			getMessage () {
				let that = this;
				this.$get("/data/my", {
					pathL: "/ap/messageHealth/myLatest"
				}).then(res => {
					if (res.state === 0) {
						that.news = res.data.count;
						if (that.news > 0 && getCookie("msgStatus") !== "no") {
							that.messageShow = true;
							const data = res.data.latest;
							data.lists = data.messageContent.split("");
							that.msg = data;
						}
					}
					else {
						that.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 本日关闭消息
			messageCloseToday () {
				this.messageShow = false;
				this.messageVisible = false;
				setMessageCookie("no");
			},
			// 关闭消息
			messageClose () {
				this.messageShow = false;
				this.messageVisible = false;
			},
			// 前往消息中心
			goMessage () {
				this.$router.push("/message/list");
				this.messageShow = false;
				this.$post("/data/my", {
					pathL: "/ap/messageHealth/readAll"
				}).then(res => {
					if (res.state === 0) {
						this.news = 0;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 查看消息
			detail (row) {
				const messageContent = row.messageContent;
				const list = [
					"血压数据",
					"血糖数据",
					"体温数据",
					"心电数据",
					"血氧数据",
					"体脂数据"
				];
				const fn = item => messageContent.includes(item);
				const active = list.filter(fn);
				this.$router.push({
					name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
					query: {
						id: row.memberId,
						memberType: row.memberType,
						familyNo: row.familyNo,
						index: "--",
						type: true,
						active: active[ 0 ]
					}
				});
				this.messageShow = false;
				this.$post("/data/my", {
					pathL: "/ap/messageHealth/readOne"
				}).then(res => {
					if (res.state === 0) {
						this.news = res.data.count;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			jump (menuName, index) {
				if (menuName != '接口平台' && menuName != '监管平台') {
					this.nowIndex = index;
				}
				this.$emit('togglePlatform', menuName);
			},
			logo () {
				this.$router.push("/");
			},
			resetPassword (passwordFrom) {
				if (passwordFrom.newPassword === passwordFrom.newPassworder) {
					this.$axios
						.post(
							"/data/my",
							this.$qs.stringify({
								pathL: "/ap/sysUser/editPassword",
								pwd: this.$md5(passwordFrom.oldPassword),
								newPwd: this.$md5(passwordFrom.newPassword)
							})
						)
						.then(res => {
							this.resetShow = false;
							if (res.data.state === 0) {
								this.$store.dispatch("LoginOut").then(state => {
									if (state === 0) {
										this.$message({
											message: "修改成功，请重新登陆！",
											type: "success",
											center: true
										});
										this.$router.push({path: "/login"});
									}
									else {
										this.$message({
											message: state,
											type: "warning",
											center: true
										});
									}
								});
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
						message: "请确保输入两次密码相同",
						center: true
					});
				}
			},
			loginOut () {
				this.$confirm("您确定要退出系统吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$router.replace({path: "/login"});
						this.$store.dispatch("LoginOut");
						this.userShow = false;
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消退出",
							center: true
						});
					});
			}
		}
	};
</script>

<style scoped>
  header {
    width: 100%;
    height: 50px;
    background-color: #0099dd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  header .logo {
    line-height: 50px;
    font-weight: 700;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    margin: 0 20px;
  }

  header .message {
    width: 260px;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    display: flex;
  }

  .messages {
    text-align: left;
  }

  .message-box {
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 99999999;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: bottom 1s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    bottom: -200px;
  }

  .badge {
    margin-right: 50px;
    cursor: pointer;
  }

  header .swing {
    animation: swing 2s linear infinite;
  }

  @keyframes swing {
    10% {
      transform: rotate(25deg);
    }
    20% {
      transform: rotate(-20deg);
    }
    30% {
      transform: rotate(15deg);
    }
    40% {
      transform: rotate(-15deg);
    }
    50%,
    100% {
      transform: rotate(0deg);
    }
  }

  .user {
    height: 50px;
  }

  .userBtn {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  header .user {
    flex: 2;
    display: flex;
    background-color: #62a8d1;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
  }

  header .user:hover {
    background-color: #2e6589;
  }

  header .userimg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
  }

  header .userimg img {
    width: 100%;
    height: 100%;
  }

  header .username {
    font-size: 14px;
    color: #fff;
  }

  .resetPassword {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .box-card {
    width: 500px;
    text-align: center;
  }

  .resetBtn {
    width: 100%;
    height: 40px;
    align-items: center;
    display: flex;
    justify-content: space-around;
  }

  .el-button.active {
    background: red !important;
  }
</style>
