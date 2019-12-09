<template>
  <div class="find">
    <p class="title">医院机构详情</p>
    <div class="form" v-loading="loading" element-loading-text="拼命加载中">
      <el-form ref="form" :model="form" style="margin-top:20px" label-width="100px">
        <el-form-item label="医院名称">{{form.name}}
        </el-form-item>
        <el-form-item label="医院等级">{{form.levelName}}
        </el-form-item>
        <el-form-item label="医院地址">{{form.address}}
        </el-form-item>
        <el-form-item label="所属地区">{{form.areaName}}
        </el-form-item>
        <el-form-item label="村镇/街道">{{form.street}}
        </el-form-item>
        <el-form-item label="医院简介">{{form.introduce}}
        </el-form-item>
      </el-form>
      <div class="back">
        <el-button size="small" style="width:100px;" @click="$router.go(-1)" type="primary" plain>返 回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      loading: true
    };
  },
  mounted() {
    let id = this.$route.query.id;
    this.$post("/data/my", {
      pathL: "/doctor/areaHospital/details",
      id: id
    }).then(res => {
      this.loading = false;
      if (res.state === 0) {
        this.form = res.data;
      } else {
        this.$message({
          message: res.msg,
          center: true
        });
      }
    });
  }
};
</script>

<style scoped>
.find {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
}
.title {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
  font-size: 14px;
  border-bottom: 1px solid #ccc;
}
.form {
  width: 100%;
  flex: 1;
  overflow: hidden;
}
.back {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
