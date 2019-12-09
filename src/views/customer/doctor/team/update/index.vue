<template>
  <div class="update-team" v-loading="loading" element-loading-text="正在加载中">
    <div class="update-top">
      <span>编辑家医团队</span>
    </div>
    <div class="update-bottom">
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px" size="mini">
        <!-- 队长信息 -->
        <el-form-item label="队长">
          <div class="leader">
            <div class="leader-img">
              <!--<img src="/static/images/信息管理1.png" alt="">-->
              <img v-show="teamLeaderMeg.headimg === null || teamLeaderMeg.headimg === ''" src="./../images/doctorPic.png" alt="">
              <img v-show="teamLeaderMeg.headimg !== null && teamLeaderMeg.headimg !== ''"  v-bind:src="teamLeaderMeg.headimg" alt="">
            </div>
            <div class="leader-data">
              <p style="font-weight: 700;">{{teamLeaderMeg.name}}</p>
              <p>{{teamLeaderMeg.titleName}}</p>
            </div>
          </div>
        </el-form-item>
        <!-- 队员信息 -->
        <el-form-item label="队员">
          <div class="team-member">
            <ul>
              <li v-for="(item,index) in memberData"
                  :key="index" style="padding-right: 15px">
                <div class="member-img">
                  <!--<img src="/static/images/信息管理1.png" alt="">-->
                  <img v-show="item.headimg === null || item.headimg === ''" src="./../images/doctorPic.png" alt="">
                  <img v-show="item.headimg !== null && item.headimg !== ''" v-bind:src="item.headimg" alt="">
                </div>
                <div class="member-data">
                  <p style="font-weight: 700;">{{item.name}}</p>
                  <p>{{item.titleName}}</p>
                </div>
              </li>
            </ul>
          </div>
        </el-form-item>
        <!-- 团队头像 -->
        <el-form-item label="团队头像">
          <img style="max-width:200px;" v-bind:src="form.img" alt="">
          <el-button @click="dialogVisibleTeamImg=true" type="primary">更换头像</el-button>
          <el-dialog :append-to-body="true" title="上传头像" :visible.sync="dialogVisibleTeamImg" width="50%">
            <el-upload class="upload-demo"
                       :action="uploadUrl"
                       :headers="uploadHeaders"
                       :on-success="onSuccess"
                       :limit=1
                       :on-exceed="handleExceed"
                       :on-remove="handleRemove"
                       list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleTeamImg = false">取 消</el-button>
              <el-button type="primary" @click="confirmTeamImg">确 定</el-button>
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
          <el-button style="width:100px" @click="submit(form)" type="primary" round>保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      dialogVisibleMember: false,
      dialogVisibleTeamImg: false,
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      },
      form: {
        teamName: "",
        abstract: "",
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
      memberShow: false,
      memberValue: "",
      teamImgBus: "",
      teamId:'',
      teamMsg:'',//拿到的团队信息
      teamLeaderMeg:{
        titleName: "",
        headimg: '',
        name: ""
      },//队长信息
      memberData: [] //队员信息
    };
  },
  methods: {
    //家医团队信息编辑
    teamEdit(){
      this.$get("/data/my", {
        pathL: "/doctor/teamInfoOperating/teamInfoAndPackList",
        teamId:this.teamId
      }).then(res => {
        if (res.state === 0) {
          // console.log(res);
          this.teamMsg = res.data;
          if(this.teamMsg){
            if(res.data.teamMembers[0]){
              this.teamLeaderMeg = res.data.teamMembers[0];
            }
            let teamMemLength = res.data.teamMembers.length;
            this.memberData = res.data.teamMembers.splice(1,teamMemLength);
            this.form.img = res.data.teamInfo.headimg;
            this.form.teamName = res.data.teamInfo.name;
            this.form.abstract =res.data.teamInfo.introduction;
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
    // 编辑团队
    submit(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          //编辑团队按钮接口
          this.$get("/data/my", {
            pathL: "/doctor/teamInfo/editTeamInfo",
            teamId:this.teamId,//团队id
            teamName:form.teamName,//团队名
            introduction:form.abstract,//团队描述
            teamUrl:form.img//团队头像
          }).then(res => {
            if (res.state === 0) {
              this.loading =false;
              this.$message({
                message: "保存成功",
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
          });
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    }
  },
  mounted(){
    let teamId = this.$route.query.id;
    this.teamId = teamId;
    // console.log(this.teamId);
    this.teamEdit();
  }
};
</script>

<style scoped>
.update-team {
  width: 100%;
}
.update-top {
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
.update-bottom {
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
  width: 100px;
  height: 100px;
}
.leader-img img {
  width: 100%;
  height: 100%;
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
.update-icon {
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
.update-member {
  width: 100px;
  height: 100px;
  margin-top: 35px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
.update-member p {
  text-align: center;
  font-weight: 700;
}
</style>
