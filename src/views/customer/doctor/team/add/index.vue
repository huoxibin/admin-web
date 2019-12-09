<template>
    <div class="add-team" v-loading="loadingLeader" element-loading-text="加载中，请稍等！">
        <div class="add-top">
            <span>新增家医团队</span>
        </div>
        <div class="add-bottom">
            <el-form ref="form" :model="form" :rules="formRules" label-width="100px" size="mini">
                <!-- 队长姓名 -->
                <div class="team-leader">
                    <el-form-item label="确定队长" style="width:600px" class="sigleMark">
                        <el-input v-model="form.leaderName" placeholder="请输入队长手机号 / 医生号查询"></el-input>
                    </el-form-item>
                    <el-form-item label-width="20px">
                      <el-button v-if="searchShow" @click="serachLeader(form.leaderName)" :disabled="form.leaderName===''?true:false" size="mini" type="primary" round>搜索</el-button>
                    </el-form-item>
                    <!-- 搜索队长信息 -->
                    <div class="search-leader" v-show="leaderDataShow">
                        <el-card class="box-card">
                            <div slot="header" class="box-top">
                                <div class="leader-img">
                                    <!--<img src="/static/images/信息管理1.png" alt="">-->
                                  <img v-show="captainMsg.doctorUrl === null || captainMsg.doctorUrl === ''" src="./../images/doctorPic.png" alt="">
                                  <img v-show="captainMsg.doctorUrl !== null && captainMsg.doctorUrl !== ''" v-bind:src="captainMsg.doctorUrl"/>
                                </div>
                                <div class="leader-name">
                                    <p style="font-size:18px;font-weight:700">
                                        <span style="color:#009966;margin-right:10px">{{captainMsg.doctorName}}</span>
                                        <span>{{captainMsg.titleName}}</span>
                                    </p>
                                    <p style="font-weight: 700;font-size: 14px">
                                        <span style="margin-right:10px">{{captainMsg.hospitalName}}</span>
                                        <span>{{captainMsg.departmentName}}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="box-bottom">
                                <p style="font-size:14px">
                                    <span>擅长：</span>
                                    <span>{{captainMsg.goodAt}}</span>
                                </p>
                                <p style="margin-top:20px;font-size:14px">
                                    <span>简介：</span>
                                    <span>{{captainMsg.introduction}}</span>
                                </p>
                            </div>
                            <div class="box-btn" style="margin-top:20px">
                                <el-button @click="leaderDataShow = false" style="width:100px" size="small" type="info" plain>返回</el-button>
                                <el-button @click="confirmLeader" style="width:100px" size="small" type="primary">确定为队长</el-button>
                            </div>
                        </el-card>
                    </div>
                </div>
                <!-- 队长信息 -->
                <el-form-item label="队长" v-if="leaderShow">
                    <div class="leader">
                        <div class="leader-img">
                            <!--<img src="/static/images/信息管理1.png" alt="">-->
                          <img v-show="captainMsg.doctorUrl === null || captainMsg.doctorUrl === ''" src="./../images/doctorPic.png" alt="">
                          <img v-show="captainMsg.doctorUrl !== null && captainMsg.doctorUrl !== ''" v-bind:src="captainMsg.doctorUrl"/>
                          <span class="captainTitle">队长</span>
                        </div>
                        <div class="leader-data">
                            <p style="font-weight: 700;">{{captainMsg.doctorName}}</p>
                            <p>{{captainMsg.titleName}}</p>
                        </div>
                    </div>
                </el-form-item>
                <!-- 队员信息 -->
                <el-form-item label="队员">
                    <div class="team-member">
                        <ul>
                            <li v-for="(item,index) in memberData"
                                :key="index">
                                <div class="member-img">
                                    <img v-bind:src="item.doctorUrl" alt="">
                                </div>
                                <div class="member-data">
                                    <p style="font-weight: 700;">{{item.name}}</p>
                                    <p>{{item.title}}</p>
                                </div>
                            </li>
                        </ul>
                        <div @click="addMember" class="add-member" v-if="memberData.length>3?false:true">
                            <div class="add-icon">
                                <i class="el-icon-plus"></i>
                            </div>
                            <p>添加新成员</p>
                        </div>
                        <el-dialog width="40%" title="添加成员" :visible.sync="dialogVisibleMember" :append-to-body="true" center>
                            <p>请输入需要添加成员的手机号 或者 医生号</p>
                            <el-input style="margin-top:20px" v-model="memberValue" auto-complete="off"></el-input>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" round style="width:100px" :disabled="memberValue===''?true:false" @click="searchMember">搜索</el-button>
                            </div>
                        </el-dialog>
                        <!-- 搜索队员信息 -->
                        <div class="search-member" v-show="memberDataShow">
                            <el-card class="box-card">
                                <div slot="header" class="box-top">
                                    <div class="member-img">
                                        <!--<img src="/static/images/信息管理1.png" alt="">-->
                                      <img v-show="memberMsg.doctorUrl === null || memberMsg.doctorUrl === ''" src="./../images/doctorPic.png" alt="">
                                      <img v-show="memberMsg.doctorUrl !== null && memberMsg.doctorUrl !== ''" v-bind:src="memberMsg.doctorUrl"/>
                                    </div>
                                    <div class="member-name">
                                        <p style="font-size:18px;font-weight:700">
                                            <span style="color:#009966;margin-right:10px">{{memberMsg.doctorName}}</span>
                                            <span>{{memberMsg.titleName}}</span>
                                        </p>
                                        <p style="font-weight: 700;font-size: 14px">
                                            <span style="margin-right:10px">{{memberMsg.hospitalName}}</span>
                                            <span>{{memberMsg.departmentName}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="box-bottom">
                                    <p style="font-size:14px">
                                        <span>擅长：</span>
                                        <span>{{memberMsg.goodAt}}</span>
                                    </p>
                                    <p style="margin-top:20px;font-size:14px">
                                        <span>简介：</span>
                                        <span>{{memberMsg.introduction}}</span>
                                    </p>
                                </div>
                                <div class="box-btn" style="margin-top:20px">
                                    <el-button @click="confirmMemberBack" style="width:100px" size="small" type="info" plain>返回</el-button>
                                    <el-button @click="confirmMember" style="width:100px" size="small" type="primary">确定为队员</el-button>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </el-form-item>
                <!-- 团队头像 -->
                <el-form-item label="团队头像">
                    <img style="max-width:200px;" :src="form.img" alt="">
                    <el-button @click="dialogVisibleTeamImg=true" type="primary">上传头像</el-button>
                    <el-dialog :append-to-body="true" title="上传头像" :visible.sync="dialogVisibleTeamImg" width="50%" center>
                        <el-upload class="upload-demo" :action="uploadUrl" :headers="uploadHeaders" :on-success="onSuccess" :limit=1 :on-exceed="handleExceed" :on-remove="handleRemove" list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="small" @click="dialogVisibleTeamImg = false">取 消</el-button>
                            <el-button size="small" type="primary" @click="confirmTeamImg">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-form-item>
                <!-- 团队名称 -->
                <el-form-item label="团队名称" prop="teamName">
                    <el-input style="width:500px" v-model="form.teamName" placeholder="请输入团队名称"></el-input>
                    <span style="color:#606266">{{form.teamName.length}}/20</span>
                </el-form-item>
                <!-- 团队简介 -->
                <el-form-item label="团队简介" prop="abstract">
                    <el-input type="textarea" :rows=8 resize="none" style="width:500px" v-model="form.abstract" placeholder="请输入团队简介"></el-input>
                    <span style="color:#606266">{{form.abstract.length}}/200</span>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item>
                    <el-button style="width:100px" @click="$router.go(-1)" round>取 消</el-button>
                    <el-button style="width:100px" @click="submit(form)" type="primary" round>创 建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibleMember: false,
      dialogVisibleTeamImg: false,
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      },
      form: {
        leaderName: "",
        abstract: "",
        teamName: "",
        img:''
      },
      formRules: {
        teamName: [
          { required: true, message: "请输入团队名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        abstract: [
          { required: true, message: "请输入团队简介", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ]
      },
      leaderDataShow: false,
      memberDataShow: false,
      loadingLeader: false,
      loadingMember: false,
      searchShow: true,
      leaderShow: false,
      memberShow: false,
      memberData: [],//队员信息
      memberValue: "",
      teamImgBus: "",
      captainMsg:{
        "departmentName": "",
        "reason": "",
        "doctorName": "",
        "titleName": "",
        "doctorUrl": "",
        "goodAt": "",
        "doctorUrl": "",
        "hospitalName": "",
        "introduction": ""
      },//队长信息,
      memberMsg:'',//队员信息
      captainMsgId:'',//队长ID
      memberMsgIdArr:[],//队员ID数组
      memberIdString:'',//队员ID字符串,
      loading:false,
      oneMem:[],
      twoMem:[],
      threeMem:[]
    };
  },
  methods: {
    // 新增队员
    addMember() {
      if (this.leaderShow === true) {
        this.dialogVisibleMember = true;
      } else {
        this.$message({
          message: "请添加队长后才能添加队员",
          center: true
        });
      }
    },
    // 搜索队长
    serachLeader(val) {
      // this.leaderDataShow = true;//需要注释掉
      //搜索队长接口
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/doctor/teamInfoOperating/newDoctorForTeam",
        mobile:val,
        doctorType:1  //1是对队长，2是成员
      }).then(res => {
        if (res.state === 0) {
          // console.log(res);
          this.loading =false;
          this.leaderDataShow = true;
          this.captainMsg = res.data.doctorInfo;
          this.captainMsgId = res.data.doctorInfo.id; //队长ID
          this.form.leaderName = '';
          // console.log(this.captainMsgId );
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      })
    },
    // 确定队长
    confirmLeader() {
      this.searchShow = false;
      this.leaderDataShow = false;
      this.leaderShow = true;
    },
    // 搜索队员
    searchMember() {
      // this.dialogVisibleMember = false;//需要注释掉
      // this.memberDataShow = true;//需要注释掉
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/doctor/teamInfoOperating/newDoctorForTeam",
        mobile:this.memberValue,
        doctorType:2 //1是对队长，2是成员
      }).then(res => {
        if (res.state === 0) {
          // console.log(res);
          this.loading =false;
          this.dialogVisibleMember = false;
          this.memberDataShow = true;
          this.memberMsg = res.data.doctorInfo;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      })
    },
    //确定团员里面的返回按钮
    confirmMemberBack(){
      this.memberDataShow = false;
      this.memberValue = '';
    },
    // 确定队员
    confirmMember() {
      this.memberDataShow = false;
      let memObj = {doctorUrl:this.memberMsg.doctorUrl,name:this.memberMsg.doctorName,title:this.memberMsg.titleName};//点击一次  获取到的队员信息
      let memIdArr =this.memberMsg.id;//点击一次 获取到的队员id
      if(memIdArr === this.captainMsgId ){  //队员id要与队长id对比
        this.$message({
          message: "该医生已经添加过，请换一名！",
          type: "warning",
          center: true
        });
        this.memberValue = '';
        return
      };

      this.memberMsgIdArr.push(memIdArr);//把队员id放到一个数组[10024,10034,10056]
      this.memberData.push(memObj);
      // console.log(this.memberMsgIdArr.length);
      /*if(this.memberMsgIdArr.length == 2){
        if(this.memberMsgIdArr[0] === memIdArr){
          this.$message({
            message: "该医生已经添加过，请换一名！",
            type: "warning",
            center: true
          });
        }
        this.memberData.pop();
        console.log(this.memberData);
      }*/
      let memberIdString = this.memberMsgIdArr.join();//把队员id数组变为字符串形式10024,10034,10056
      this.memberIdString =memberIdString;//获取到的队员的id数组(字符串形式)
      this.memberValue = '';
    },
    // 团队头像上传成功
    onSuccess(response, file, fileList) {
      this.teamImgBus = response.data.url;
    },
    // 确认头像
    confirmTeamImg() {
      this.form.img = this.teamImgBus;
      this.dialogVisibleTeamImg = false;
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.teamImgBus = "";
    },
    // 限制文件
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 创建团队
    submit(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let memberIdArry = this.memberIdString.split(',');
          let nary=memberIdArry.sort();
          if(nary.length >1){
           /* var s=[];*/
            for(var i=0;i<nary.length;i++){
              if(nary[i] == nary [i+1]){
                this.$message({
                  message: "队员重复添加，请重新添加队员！",
                  type: "warning",
                  center: true
                });
                this.memberData.splice(0,this.memberData.length);
                this.memberMsgIdArr.splice(0,this.memberMsgIdArr.length);
                return;
              }
              /*if(s.indexOf(nary[i]) == -1){
                s.push(nary[i]);
              }*/
            }
          }

          //创建家医团对接口
          let ids = this.captainMsgId +','+ this.memberIdString;

          if(this.captainMsgId === '' || this.captainMsgId === null ){
            this.$message({
              message: "请务必选择一名对队长！",
              type: "warning",
              center: true
            });
            return
          }
          this.$get("/data/my", {
            pathL: "/doctor/teamInfo/createTeam",
            ids: this.memberIdString === '' ? this.captainMsgId : ids,//队长ID+队员ID
            teamName:form.teamName,//团队名
            introduction:form.abstract,//团队描述
            imgUrl:form.img//团队头像
          }).then(res => {
            if (res.state === 0) {
              this.loading = false;
              this.$message({
                message: "创建成功",
                type: "success",
                center: true
              });
              this.$router.push({ name: "医护管理/团队管理/家医团队列表" });
            } else {
              this.$message({
                message: res.msg,
                center: true
              });
            }
          })
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    }
  },
  watch: {
    dialogVisibleMember(now){
      if(now === false){
       this.memberValue = ''
      }
    }
  },
};
</script>

<style scoped>
  .sigleMark:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    position: absolute;
    left: 40px;
    top:65px;
  }
.add-team {
  width: 100%;
}
.add-top {
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
.add-bottom {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.team-leader {
  display: flex;
}
.search-leader,
.search-member {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  top: 0;
  left: 0;
}
.leader-img,
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

  .leader-img{
    position: relative;
  }
  .leader-img .captainTitle{
    width: 40px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    font-weight: bolder;
    background: rgb(0,204,51);
    position: absolute;
    bottom: 0;
    right: 0;
  }
.leader-img img {
  max-width: 100px;
  max-height: 100px;
}
.box-card {
  width: 500px;
}
.box-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box-top {
  display: flex;
  justify-content: space-around;
}
.leader-name,
.member-name {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: center;
}
.leader-data,
.member-data {
  width: 100px;
  text-align: center;
}
.add-icon {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #999;
  border-radius: 10px;
  font-size: 30px;
}
.team-member {
  display: flex;
}
.team-member ul {
  display: flex;
}
  .team-member ul li{
    padding-right: 10px;
  }
.add-member {
  width: 100px;
  height: 100px;
  margin-top: 35px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
.add-member p {
  text-align: center;
  font-weight: 700;
}
</style>
