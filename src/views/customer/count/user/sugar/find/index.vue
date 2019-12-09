<template>
  <div class="sugar-find">
    <div class="title">
      <p></p>
      <el-button @click="$router.go(-1)" size="mini" type="primary">返回</el-button>
    </div>
    <!-- 信息 -->
    <el-form v-if="data.length!==0" ref="form" inline style="margin-top:18px;" label-width="120px" label-suffix=":">
      <el-form-item label="家庭号">{{$route.query.familyNo}}</el-form-item>
      <el-form-item label="用户手机号">{{$route.query.mobile}}</el-form-item>
      <el-form-item label="测量用户">{{data[0].name}}</el-form-item>
      <el-form-item label="性别">{{data[0].userSexName}}</el-form-item>
      <el-form-item label="年龄">{{data[0].userAge}}</el-form-item>
      <el-form-item label="用户类型">{{$route.query.deviceSnType}}</el-form-item>
      <el-form-item label="累计测量次数">{{data[0].countNumber}}</el-form-item>
    </el-form>
    <div class="title" style="border-top: 1px solid #ccc">
      <span>测量历史</span>
      <el-button @click="viewUser" size="mini" type="primary">查看用户完整信息</el-button>
    </div>
    <!-- 测量历史 -->
    <div class="table" ref="table" v-loading="loading" element-loading-text="拼命加载中">
      <el-table :data="data" border stripe style="width: 100%;">
        <el-table-column prop="date" label="时段" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.timePeriod===1">空腹</p>
            <p v-if="scope.row.timePeriod===2">早餐后两小时</p>
            <p v-if="scope.row.timePeriod===3">午餐前</p>
            <p v-if="scope.row.timePeriod===4">午餐后两小时</p>
            <p v-if="scope.row.timePeriod===5">晚餐前</p>
            <p v-if="scope.row.timePeriod===6">晚餐后两小时</p>
            <p v-if="scope.row.timePeriod===7">睡前</p>
            <p v-if="scope.row.timePeriod===-1">随机血糖</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="血糖值" align="center">
          <template slot-scope="scope">
            <p>
              <span>{{scope.row.mmol+' mmol/L'}}</span>
              <span>（{{scope.row.sugarLevel}}）</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="timeResult" label="测量时间" align="center">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      data: [],
      pageNum: 1,
      pageSize: 0,
      pageLength: 0
    };
  },
  mounted() {
    let tableHeight = this.$refs.table.offsetHeight;
    let pageSize = tableHeight / 57;
    this.pageSize = Number.parseInt(pageSize - 1);
    this.getData();
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
    // 获取数据列表
    getData() {
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/health/bloodSugar/queryAllSugarByUserId",
        userId: this.$route.query.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.data = res.data.result;
          this.pageLength = res.data.total;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 页数请求
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    }
  }
};
</script>

<style scoped>
.sugar-find {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
}
.table {
  flex: 1;
  overflow: auto;
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
