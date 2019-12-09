<template>
  <div class="error">
    <img src="./images/error.gif" alt="">
    <div class="box">
      <h2 v-if="$route.name==='404'">抱歉，您访问的页面不存在！</h2>
      <el-button v-if="$route.name==='404'" class="btn" style="width:100px;" @click="$router.replace({path:'/'})" type="primary">返回主页</el-button>

      <h2 v-if="$route.name==='401'">抱歉，您没有权限访问！</h2>
      <el-button v-if="$route.name==='401'" class="btn" style="width:100px;" @click="againLogin" type="success">重新登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    againLogin() {
      this.$router.replace({ path: "/login" });
      this.$store.dispatch("LoginOut");
    }
  }
};
</script>

<style scoped>
.error {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  width: 313px;
  height: 428px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-flow: column wrap;
}
.btn {
  margin: 0;
}
</style>
