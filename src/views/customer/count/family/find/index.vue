<template>
  <div class="find" v-loading="loading" element-loading-text="拼命加载中">
    <div class="title">
      <p>家庭人员列表</p>
      <el-button @click="$router.go(-1)" type="primary" size="mini">返 回</el-button>
    </div>
    <div class="table">
      <el-table :data="data" border stripe style="width: 100%;">
        <el-table-column width="100" type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.sex===1">男</p>
            <p v-if="scope.row.sex===2">女</p>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="年龄" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.birthday===0"></p>
            <p v-if="scope.row.birthday!==0">{{scope.row.birthday}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="registerTime" label="添加时间" align="center">
        </el-table-column>
        <el-table-column prop="memberType" label="属性" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.memberType==='member'">成员</p>
            <p v-if="scope.row.memberType==='follower'">关注用户</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="view(scope)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      data: []
    };
  },
  methods: {
    //查看详情
    view(scope) {
      this.$router.push({
        name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
        query: {
          id: scope.row.id,
          memberType:scope.row.memberType,
          familyNo:this.$route.query.familyNo,
          index:scope.$index + 1
        }
      });
    }
  },
  mounted() {
    let familyNo = this.$route.query.familyNo;
    this.$get("/data/my", {
      pathL: "/family/familyInfoOperating/familyMemberList",
      familyNo: familyNo
    }).then(res => {
      this.loading = false;
      if (res.state === 0) {
        this.data = res.data;
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
.table {
  width: 100%;
  flex: 1;
  overflow: auto;
}
</style>
