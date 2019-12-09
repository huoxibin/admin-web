<template>
  <div class="find" v-loading="loading" element-loading-text="正在加载中">
    <p class="title">家医团队详情</p>
    <div style="padding-left: 50px">
      <div class="team-1">
        <div class="team-img">
          <img v-show="teamInfo.headimg === null || teamInfo.headimg === ''" src="./../images/doctorTeam.png" alt="">
          <img v-show="teamInfo.headimg !== null && teamInfo.headimg !== ''" v-bind:src="teamInfo.headimg"/>
        </div>
        <div class="team-name">
          <p style="font-weight: 700;font-size: 17px">{{teamInfo.name}}</p>
          <p style="font-weight: 700;font-size: 14px;">{{teamInfo.hospitalName}}</p>
        </div>
      </div>
      <div class="team-2">
        <span>团队成员数：</span>
        <span>{{teamCounts.teamMemberCount}}人</span>
        <span>签约家庭数：</span>
        <span>{{teamCounts.signFamilyCount}}户</span>
        <span>服务患者数：</span>
        <span>{{teamCounts.signMemberCount}}名</span>
        <span>团队成立时间：</span>
        <span>{{teamInfo.teamCreateTime}}</span>
      </div>
      <div class="team-3">
        <p class="team-title" style="font-size: 16px;font-weight: 700">团队简介</p>
        <p style="color:rgb(51,51,51)">{{teamInfo.introduction}}</p>
      </div>
      <div class="team-4">
        <p class="team-title">团队成员</p>
        <ul>
          <li :key="index"
              @click="findMemberCap(teamMembersCap.doctorId)"
              style="padding-right: 40px">
            <div class="member-img">
              <img v-show="teamMembersCap.headimg === null || teamMembersCap.headimg===''" src="./../images/doctorPic.png" alt="">
              <img v-show="teamMembersCap.headimg !== null && teamMembersCap.headimg !==''"  v-bind:src="teamMembersCap.headimg"/>
              <span class="captainTitle">队长</span>
            </div>
            <div class="member-data">
              <p style="font-weight: 700;font-size:15px;margin-top: 8px;margin-bottom: 5px ">{{teamMembersCap.name}}</p>
              <p style="font-size: 14px">{{teamMembersCap.titleName}}</p>
            </div>
          </li>
          <li v-for="(item,index) in teamMembers"
              :key="index"
              @click="findMember(item.doctorId)"
              style="padding-right: 40px">
            <div class="member-img">
              <img v-show="item.headimg === null || item.headimg === '' " src="./../images/doctorPic.png" alt="">
              <img v-show="item.headimg !== null && item.headimg !== ''"  v-bind:src="item.headimg"/>
            </div>
            <div class="member-data">
              <p style="font-weight: 700;font-size: 16px;margin-top: 8px;margin-bottom: 5px">{{item.name}}</p>
              <p style="font-size: 14px">{{item.titleName}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="team-5">
        <p class="team-title">团队服务包</p>
        <p v-show="teamPackItems.length <= 0">暂无团队服务包</p>
        <ul>
          <li v-for="(item,index) in teamPackItems"
              :key="index"
              @click="findBox(item)">
            <div class="box-img">
              <img src="./../images/doctor.png" alt="">
            </div>
            <div class="box-name">
              <!--<p style="font-weight: 700;">孕产妇增值服务包(18服务项)</p>-->
              <p style="font-weight: 700;">{{item.name}} ({{item.packItemCount}}服务项)</p>
              <!--<p>总金额：¥ 679.00</p>-->
              <p style="font-weight: 700;">总金额：¥ {{item.packMoney}}</p>
            </div>
          </li>
        </ul>
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
      Data: [],
      loading:true,
      teamId:'',//从列表中获取的teamId
      teamMsg:{
        teamMembers:[
          {
            "titleName": "",
            "headimg": '',
            "doctorId": '',
            "teamId": '',
            "name": ""
          },
          {
            "titleName": "",
            "headimg": '',
            "doctorId": '',
            "teamId": '',
            "name": ""
          },
        ]
      },//数据渲染的对象

      teamInfo:{
        headimg:'',
        name:'',
        hospitalName:'',
        teamCreateTime:'',
        introduction:'',
      },
      teamCounts:{
        teamMemberCount:0,
        signFamilyCount:0,
        signMemberCount:0
      },
      teamMembers:[],//团队成员
      teamMembersCap:{}, // 队长信息
      teamPackItems:[{name:'', packItemCount:'', packMoney:''}]//团队服务包
    };
  },
  methods: {
    //获取--家医团队详情查看--接口
    queryListTeam(){
      this.$get("/data/my", {
        pathL: "/doctor/teamInfoOperating/teamInfoAndPackList",
        teamId:this.teamId
      }).then(res => {
        if (res.state === 0) {
          // console.log(res);
          this.teamMsg = res.data;
          if(this.teamMsg){
            this.teamInfo = this.teamMsg.teamInfo;
            this.teamCounts = this.teamMsg.teamCounts;

            this.teamMembersCap = this.teamMsg.teamMembers[0];
            this.teamMembers = this.teamMsg.teamMembers.slice(1,this.teamMsg.teamMembers.length);

            this.teamPackItems = this.teamMsg.teamPackItems;
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
    //家医详情
    findMemberCap(item){
      this.$router.push({
        name: "医护管理/团队管理/家医团队列表/家医团队详情/家医详情",
        query:{
          id:item,
          type:1
        }
      });
    },
    findMember(item) {
      this.$router.push({
        name: "医护管理/团队管理/家医团队列表/家医团队详情/家医详情",
        query:{
          id:item,
          type:2
        }
      });
    },
    //服务包详情
    findBox(item) {
      this.$router.push({
        name: "医护管理/团队管理/家医团队列表/家医团队详情/服务包详情",
        query:{
          packId:item.id,
          packMoney:item.packMoney
        }
      });
    }
  },
  mounted(){
    let teamId = this.$route.query.id;
    this.teamId = teamId;
    // console.log(this.teamId);
    this.queryListTeam();
  }
};
</script>

<style scoped>
.find {
  width: 100%;
  height: 100%;
}
.find > div {
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
.team-1 {
  width: 100%;
  height: 100px;
  display: flex;
}
.team-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.team-img img {
  max-width: 80px;
  max-height: 80px;
}
.team-name {
  margin-left: 20px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: flex-start;
}
.team-2 span {
  font-weight: 700;
  font-size: 16px;
}
.team-2 span:nth-last-of-type(odd) {
  margin-right: 50px;
}
.team-3 p {
  font-size: 14px;
}
.team-title {
  margin: 10px 0;
  font-weight: 700;
  font-size: 16px;
}
.team-4 ul {
  display: flex;
}
.team-4 ul li {
  cursor: pointer;
}
.member-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.member-img img{
  width: 100%;
  height: 100%;
}

.member-img{
  position: relative;
}

.member-img .captainTitle{
  width: 40px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  font-weight: bolder;
  background: rgb(0,204,51);
  position: absolute;
  bottom: 0;
  right: 0;
}
.member-data {
  width: 100px;
  text-align: center;
}
.team-5 ul {
  display: flex;
  flex-flow: row wrap;
}
.team-5 ul li {
  height: 100px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.box-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-img img {
  max-width: 50px;
  max-height: 50px;
}
.box-name {
  width: 300px;
  height: 60px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: flex-start;
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
