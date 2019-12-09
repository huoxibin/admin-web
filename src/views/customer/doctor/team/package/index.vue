<template>
  <div class="package" v-loading="loading" element-loading-text="正在加载中">
    <p class="title">服务包详情页</p>
    <div class="package-show">
      <div class="package-top">
        <img src="./../images/doctor.png" alt="">
        <span>{{packInfo.name}}</span>
        <span>总金额：</span>
        <span>¥ {{packMoney}}</span>
      </div>
      <ul>
        <li v-for="(item,index) in packItems">
          <p>
            <span>{{item.name}}</span>
            <span style="margin-left:100px;">¥{{item.price}}</span>
            <span style="margin-left:10px;">{{item.suggestPriceDesc}}</span>
          </p>
          <p>{{item.description}}</p>
        </li>
      </ul>
    </div>
    <div class="back">
      <el-button @click="$router.go(-1)" size="small" style="width:100px;" type="primary" plain>返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      packId:'',
      loading:true,
      packMoney:'',
      packMsg:'',

      packInfo:{
        name:'',
      },
      packItems:[

      ]
    };
  },
  methods: {
    //获取--服务包详情页--接口
    queryList(){
      this.$get("/data/my", {
        pathL: "/doctor/teamInfo/teamPackDetail",
        packId:this.packId
      }).then(res => {
        if (res.state === 0) {
          // console.log(res);
          this.packMsg = res.data;
          if(this.packMsg){
            this.packInfo = this.packMsg.packInfo;
            this.packItems = this.packMsg.packItems;
            this.loading =false;
          }
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      })
    },
  },
  mounted(){
    let packId = this.$route.query.packId;
    this.packId = packId;
    // console.log(this.packId);
    let packMoney = this.$route.query.packMoney;
    this.packMoney = packMoney;
    // console.log(this.packMoney);

    this.queryList();
  }
};
</script>

<style scoped>
.package {
  width: 100%;
  height: 100%;
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
.package-show {
  width: 100%;
  box-sizing: border-box;
  padding: 50px;
}
.package-top {
  display: flex;
  align-items: center;
}
.package-top span {
  font-weight: 700;
}
.package-top span:nth-of-type(1) {
  font-weight: 700;
  font-size: 18px;
  margin: 0 50px 0 20px;
}
.package-show ul {
  display: flex;
  flex-flow: column wrap;
  padding: 20px 0;
}
.package-show ul li {
  width: 100%;
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 20px;
  border: 1px solid rgba(134, 134, 134, 1);
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: flex-start;
}
.package-show ul li p:nth-of-type(1) {
  color: #333333;
  font-size: 14px;
}
.package-show ul li p:nth-of-type(2) {
  color: #999999;
  font-size: 14px;
}
.back {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
