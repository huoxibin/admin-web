<template>
  <div class="member"  v-loading="loading" element-loading-text="正在加载中">
    <p class="title">家医详情</p>
    <div style="padding-left: 50px">
      <div class="member-1">
        <div class="member-img">
          <img v-show="doctorUrl === null || doctorUrl === ''" src="./../images/doctorPic.png" alt="">
          <img v-show="doctorUrl !== null && doctorUrl !== ''" v-bind:src="doctorUrl"/>
        </div>
        <div class="member-name">
          <p style="font-weight: 700;font-size: 17px">
            <span>{{doctorName}}</span>
            <span style="margin-left: 10px">{{memType == 1 ? '队长' : '队员'}}</span>
          </p>
          <p class="member-news" style="font-weight: 700;font-size: 16px;">
            <span>{{hospitalName}}</span>
            <span>{{departmentName}}</span>
            <span>{{titleName}}</span>
            <span style="margin-right:0;">哆咖医生号：</span>
            <span>{{id}}</span>
          </p>
        </div>
      </div>
      <div class="member-2">
        <p class="member-title" style="font-weight: 700;font-size: 16px">擅长</p>
        <p>{{goodAt}}</p>
      </div>
      <div class="member-3">
        <p class="member-title" style="font-weight: 700;font-size: 16px">简介</p>
        <p>{{introduction}}</p>
      </div>
    </div>
    <div class="back">
      <el-button type="primary" @click="$router.go(-1)" size="small" style="width:100px;" plain>返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      doctorId:'',
      memType:'',
      doctorMsg:{},
      loading:true,

      doctorUrl:'',
      doctorName:'',
      hospitalName:'',
      departmentName:'',
      titleName:'',
      id:'',
      goodAt:'',
      introduction:''

    };
  },
  methods: {
    //家医详情--查看接口
    getDoctorInfo(){
      this.$get("/data/my", {
        pathL: "/doctor/teamInfo/getDoctorInfo",
        doctorId:this.doctorId
      }).then(res => {
        if (res.state === 0) {
          console.log(res);
          this.doctorMsg = res.data.doctorInfo;

          if(this.doctorMsg){
            this.doctorUrl = this.doctorMsg.doctorUrl;
            this.doctorName =this.doctorMsg.doctorName;
            this.hospitalName =this.doctorMsg.hospitalName;
            this.departmentName =this.doctorMsg.departmentName;
            this.titleName =this.doctorMsg.titleName;
            this.id =this.doctorMsg.id;
            this.goodAt = this.doctorMsg.goodAt;
            this.introduction =this.doctorMsg.introduction;
            this.loading = false;
          }else {
            this.loading = false;
            this.$message({
              message: "暂无数据",
              type: "success",
              center: true
            });
          }


        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      })
    }
  },
  mounted(){
    let doctorId = this.$route.query.id;
    this.doctorId = doctorId;
    let memType = this.$route.query.type;
    this.memType = memType;
    console.log(memType);
    console.log(doctorId);
    this.getDoctorInfo();
  }
};
</script>

<style scoped>
.member {
  width: 100%;
  height: 100%;
}
.member > div {
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
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
.member-1 {
  width: 100%;
  height: 100px;
  display: flex;
}
.member-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.member-img img {
  max-width: 80px;
  max-height: 80px;
}
.member-name {
  margin-left: 20px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: flex-start;
}
.member-news span {
  margin-right: 60px;
}
.member-2 p,
.member-3 p {
  font-size: 14px;
}
.member-title {
  margin: 10px 0;
  font-weight: 700;
  font-size: 16px;
}
.back {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
