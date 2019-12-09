<!--
* author: huoxibin
* created: 2018/9/30
* describe:统计分析/用户统计/心电测量统计/详情
-->
<template>
  <div class="ecg-find">
    <div class="title">
      <p></p>
      <el-button @click="$router.go(-1)" size="mini" type="primary">返回</el-button>
    </div>
    <!-- 信息 -->
    <el-form ref="form" :model="form" inline style="margin-top:18px;" label-width="120px" label-suffix=":">
      <el-form-item label="家庭号">{{form.familyNo}}</el-form-item>
      <el-form-item label="用户手机号">{{$route.query.mobile}}</el-form-item>
      <el-form-item label="测量用户">{{form.name}}</el-form-item>
      <el-form-item label="性别">{{form.sex}}</el-form-item>
      <el-form-item label="年龄">
        {{form.age == null ? '--' : form.age}}
      </el-form-item>
      <el-form-item label="用户类型">{{$route.query.deviceSnType}}</el-form-item>
      <el-form-item label="累计测量次数">{{form.amount}}</el-form-item>
    </el-form>
    <div class="title" style="border-top: 1px solid #ccc">
      <span>测量历史</span>
      <el-button @click="viewUser" size="mini" type="primary">查看用户完整信息</el-button>
    </div>
    <!--数据列表-->
    <div class="table" ref="table" v-loading="loading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border stripe style="width: 100%;">
        <el-table-column prop="averageHeartRate" label="心率" align="center">
          <template slot-scope="scope">
            <p>
              {{scope.row.averageHeartRate + '次/分'}}
              <span v-if="scope.row.heartRisk ==1">(正常)</span>
              <span v-if="scope.row.heartRisk ==2">(偏低)</span>
              <span v-if="scope.row.heartRisk ==3">(偏高)</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="measuringTime" label="测量时间" align="center">
        </el-table-column>
        <el-table-column label="查看心电图" align="center">
          <template slot-scope="scope">
            <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>

    <!--心电图对话框-->
    <el-dialog title="" :visible.sync="dialogeVisible" width="40%" top="4vh" center :modal-append-to-body='false'>
      <div class="bigBox" v-loading="loadingXin" element-loading-text="拼命加载中">
        <div class="xidian">
          <p>
            走速:{{elecForm.ecgSpeed}}
          </p>
          <p>
            增益:{{elecForm.ecgGain}}
          </p>
        </div>
        <div class="xiPic">
          <!--<img v-if="elecForm.ecgImage == null || elecForm.ecgImage == ''" src="../../images/doctorPic.png" alt="">-->
          <img v-if="elecForm.ecgImage != null && elecForm.ecgImage !== ''" v-bind:src="elecForm.ecgImage"/>
        </div>
        <div class="xiTitle">
          <h2>
            心电分析
          </h2>
        </div>
        <div class="xinOne offect">
          <p>
            记录开始时间：<span>{{elecForm.measuringTime}}</span>
          </p>
          <p>
            记录时长：<span>30s</span>
          </p>
        </div>
        <div class="offect">
          平均心率：<span class="colorFont">{{elecForm.averageHeartRate}}次/分</span>
        </div>
        <div class="xinTwo offect">
          <p>节律正常范围：<span>{{elecForm.rhythmNormal}}%</span></p>
          <p>疑似心率不齐或早搏：<span>{{elecForm.heartRateAbnormal}}%</span></p>
          <p>疑似心房颤动或早搏：<span>{{elecForm.atriumAbnormal}}%</span></p>
        </div>
        <div style="width:100%;border-bottom: 1px solid #e3e3e3">
        </div>
        <div class="xinThree offect">
          <p>心率正常范围：<span>{{elecForm.heartRateNormal}}%</span></p>
          <p>稍快稍慢：<span>{{elecForm.heartRateSlightly}}%</span></p>
          <p>过快过慢：<span>{{elecForm.heartRateExceed}}%</span></p>
        </div>
        <div style="width:100%;border-bottom: 1px solid #e3e3e3">
        </div>
        <div class="offect status">
          <p v-if="elecForm.heartRisk ==1">
            心脏节律异常风险······<span style="padding-right: 20px;color: #6590FF;">正常</span>您的心脏节律异常风险低。请您继续保持良好的生活习惯：清淡饮食、适量运动、保证睡眠、戒烟限酒。少量的异常节律可以是心律不齐或者早搏、干扰引起，请您咨询医师或专业人员。定期和随时监测，有助您提早发现心脏风险。
          </p>
          <p v-if="elecForm.heartRisk ==2">
            心脏节律异常风险······<span style="padding-right: 20px;color:#FFAB2B">偏低</span>如您多次在静止、无干扰的状态下测量，异常节律仍高于10%，为了您的健康，请您咨询医师或专业人员。异常节律可以是心律不齐或者早搏、干扰引起，请您咨询医师或专业人员。请您定期或随时监测，跟踪心脏健康风险。
          </p>
          <p v-if="elecForm.heartRisk ==3">
            心脏节律异常风险······<span style="padding-right: 20px;color: #FF5F5F">偏高</span>如您多次在静止、无干扰的状态下测量，异常节律仍高于20%，提示您的心脏可能存在心律失常风险，建议您尽快咨询医师或专业人员。请您定期和随时监测，跟踪心脏健康风险。
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeVisible = false">关 闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props:[],
    filters:{},
    data () {
      return {
        dialogeVisible:false,//查看对话框
        loading:false,//加载标识
        loadingXin:false,//心电弹框
        //个人信息
        form: {},
        tableData:[],//数据列表
        pageSize: 0,//每页显示得条数
        pageLength: 0,//一共多少条数据
        pageNum:1,//当前页码
        userId:this.$route.query.id,
        //心电图内容
        elecForm:{
          ecgSpeed:'',//走速
          ecgGain:'',//增益
          ecgImage:'',//图片
          measuringTime:'',//记录时间
          averageHeartRate:'',//平均心率
          heartRateSlightly:'',//节律正常范围
          heartRateNormal:'',//疑似心率不齐或早搏
          rhythmNormal:'',//节律正常范围
          heartRateAbnormal:'',//疑似心率不齐或早搏
          atriumAbnormal:'',//疑似心房颤动或早搏
          heartRateExceed:'',//过快过慢
          heartRisk:''//正常、偏低、偏高
        }
      }
    },
    created() {

    },
    methods: {
      //查看用户信息
      viewUser(){
        this.$router.push({
          name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
          query: {
            id:this.$route.query.id,
            familyNo:this.$route.query.familyNo,
            memberType:'',
            index:'',
            activeName:'second'
          }
        });
      },
      //查看心电图
      view(row){
        this.dialogeVisible = true;
        this.loadingXin = true;
        this.$get("/data/my", {
          pathL: "/health/electrocardio/getEcgSingle",
          heartRisk: row.heartRisk == 1 ? '正常' :(row.heartRisk == 2 ? '偏低' : '偏高'),
          id:row.id
        }).then(res => {
          this.loadingXin = false;
          if (res.state === 0) {
            // console.log(res.data);
            this.elecForm = res.data;
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        })
      },
      //获取table列表
      queryList(){
        this.loading = true;
        this.$get("/data/my", {
          pathL: "/health/electrocardio/getEcgList",
          pageNum:this.pageNum,//当前页码
          pageSize:this.pageSize,//每页显示得条数
          userId:this.userId
        }).then(res => {
          this.loading = false;
          if (res.state === 0) {
            this.tableData = res.data.result;
            this.pageLength =res.data.total
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        })
      },
      // 页数请求
      handleCurrentChange(val){
        this.pageNum =val;
        this.queryList();
      },
      //获取基本信息
      getUserInfo(){
        this.$get("/data/my", {
          pathL: "/health/electrocardio/getUserInfo",
          userId:this.userId
        }).then(res => {
          if (res.state === 0) {
            this.form = res.data;
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
      let tableHeight = this.$refs.table.offsetHeight;
      let pageSize = tableHeight / 48;
      this.pageSize = Number.parseInt(pageSize - 1);
      this.queryList();
      this.getUserInfo();
    },
    watch:{

    },
    computed: {

    },
    activated(){

    },
    deactivated(){

    }
  }
</script>

<style scoped>
  /*心电对话框---start*/
  .status p{
    line-height: 30px;
  }
  .status p span{
    font-size: 20px;
  }
  .colorFont{
    color: #6590FF;
    font-size: 20px;
  }
  .offect{
    margin: 15px 0;
  }
  .bigBox div{
    font-size: 15px;
    font-weight: bolder;
  }
  .xinOne,.xinTwo,.xinThree{
    display: flex;
    justify-content: space-between;
  }
  .xiTitle{
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .xidian{
    display: flex;
    justify-content: space-between;
    color: #9c9c9c;
  }
  .xiPic{
    width: 100%;
    height: 350px;
  }
  .xiPic img{
    width: 100%;
    height: 100%;
  }
  /*心电查看 ---end*/

  .ecg-find {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    overflow: hidden;
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
  .table {
    flex: 1;
    overflow: auto;
  }
  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
