<template>
  <div class="login" v-loading="loading" element-loading-text="正在登陆中">
    <div class="login_content">
      <!-- logo -->
      <div class="logo">
        <div class="logo_top">
          <img src="./images/logo.png" alt="logo">
        </div>
        <div class="logo_bottom">
          <div class="one"></div>
          <div class="two"></div>
        </div>
      </div>
      <!-- 登录 -->
      <div class="login_center">

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="login_title">哆咖智云运营平台</span>
          </div>
          <div class="text item">

            <!-- 登录表单 -->
            <el-form ref="loginFrom" :model="loginFrom" router :rules="loginRules" label-width="70px" label-suffix="：">

              <!-- 用户名 -->
              <el-form-item label="账号" prop="username">
                <el-input size="small" @keyup.enter.native="login(loginFrom)" v-model="loginFrom.username" placeholder="请输入用户名称"></el-input>
              </el-form-item>

              <!-- 密码 -->
              <el-form-item label="密码" prop="password">
                <el-input size="small" @keyup.enter.native="login(loginFrom)" v-model="loginFrom.password" type="password" placeholder="请输入登录密码"></el-input>
              </el-form-item>

            </el-form>

            <!-- 按钮 -->
            <el-button @click="login(loginFrom)" style="width:120px;" size="small" type="primary" round>登录</el-button>

          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      loginFrom: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入您的用户名称！", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入您的登录密码！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login(loginFrom) {
      this.$refs.loginFrom.validate(valid => {
        if (valid) {
          this.loading = true;
          const loginForm = {
            loginName: loginFrom.username,
            pwd: this.$md5(loginFrom.password)
          };
          this.$store.dispatch("LoginIn", loginForm).then(state => {
            this.loading = false;
            if (state === 0) {
              this.$router.replace({ path: "/" });
            } else {
              this.$message({
                message: state,
                type: "warning",
                center: true
              });
            }
          });
        } else {
          this.$message({
            message: "请输入登录信息",
            center: true
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("./images/loginbg.png") no-repeat top;
  background-color: #00a5ee;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  margin: auto;
  overflow: hidden;
}
.logo_top {
  width: 160px;
  height: 60px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.logo_top img {
  width: 100px;
}
.logo_bottom {
  width: 160px;
  height: 20px;
  margin: 10px auto;
}
.one {
  width: 80px;
  height: 10px;
  background: #fff;
  margin: auto;
}
.two {
  width: 120px;
  height: 10px;
  background: #fff;
  border-radius: 10px 10px 0 0;
  margin: auto;
}
.login_title {
  color: #009aeb;
  font-weight: 700;
  font-size: 28px;
}
.login_center {
  text-align: center;
  width: 500px;
  margin: auto;
}
</style>
