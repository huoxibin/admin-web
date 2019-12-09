<template>
  <div class="ecg-find">
    <div class="title">
      <p></p>
      <el-button @click="$router.go(-1)" size="mini" type="primary">返回</el-button>
    </div>
    <!-- 信息 -->
    <el-form ref="form" inline style="margin-top:18px;" label-width="120px" label-suffix=":">
      <el-form-item label="家庭号">{{ $route.query.familyNo }}</el-form-item>
      <el-form-item label="用户手机号">{{$route.query.mobile}}</el-form-item>
      <el-form-item label="测量用户">{{ name }}</el-form-item>
      <el-form-item label="性别">{{ userSexName }}</el-form-item>
      <el-form-item label="年龄">{{ userAge }}</el-form-item>
      <el-form-item label="用户类型">{{$route.query.deviceSnType}}</el-form-item>
      <el-form-item label="累计测量次数">{{ countNumber }}</el-form-item>
    </el-form>
    <div class="title" style="border-top: 1px solid #ccc">
      <span>测量历史</span>
      <el-button @click="viewUser" size="mini" type="primary">查看用户完整信息</el-button>
    </div>
    <!--数据列表-->
    <div class="table" ref="table" v-loading="loading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border stripe style="width: 100%;">

        <el-table-column prop="" label="收缩压" align="center">
          <template slot-scope="scope">{{ scope.row.sbp +' mmHg ' + '(' + scope.row.sbpDesc + ')' }}</template>
        </el-table-column>

        <el-table-column prop="" label="舒张压" align="center">
          <template slot-scope="scope">{{ scope.row.dbp +' mmHg ' + '(' + scope.row.dbpDesc + ')' }}</template>
        </el-table-column>

        <el-table-column prop="" label="心率" align="center">
          <template slot-scope="scope">{{ scope.row.heartRate +' bpm ' + '(' + scope.row.heartRateDesc + ')' }}</template>
        </el-table-column>

        <el-table-column prop="measureTime" label="测量时间" align="center"></el-table-column>

      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>
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
        loading:false,//加载标识
        tableData:[],
        pageSize: 0,//每页显示得条数
        pageLength: 0,//一共多少条数据
        pageNum: 1, //当前页码
        familyId: '',//家庭号
        name: '', //测量用户
        userSexName: '',//性别
        userAge: '',//年龄
        countNumber: ''//累计测量次数
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
      //获取table列表
        getData() {
            this.loading = true;
            this.$get("/data/my", {
                pathL: "/health/bloodPressure/queryAllPressureByUserId",
                userId: this.$route.query.id,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then(res => {
                this.loading = false;
                if (res.state === 0) {
                    this.tableData = res.data.result;
                    this.pageLength = res.data.total;
                    this.familyId = res.data.result[0].familyId; //家庭号
                    this.name = res.data.result[0].name; //测量用户
                    this.userSexName = res.data.result[0].userSexName;//性别
                    this.userAge = res.data.result[0].userAge;//年龄
                    this.countNumber = res.data.result[0].countNumber;//累计测量次数
                } else {
                    this.$message({
                        message: res.msg,
                        center: true
                    });
                }
            });
        },
      // 页数请求
      handleCurrentChange(val){
        this.pageNum =val;
        this.getData();
      },
    },
    mounted(){
        let tableHeight = this.$refs.table.offsetHeight;
        let pageSize = tableHeight / 57;
        this.pageSize = Number.parseInt(pageSize - 1);
        this.getData();

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
  .ecg-find {
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
  .table {
    flex: 1;
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
