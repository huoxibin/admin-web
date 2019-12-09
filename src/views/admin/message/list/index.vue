<template>
  <div class="message">
    <div class="list-title">
      <p>筛选查询</p>
      <el-button size="mini" @click="search" type="primary">搜索查询</el-button>
    </div>
    <div class="form">
      <el-form
        :inline="true"
        :model="form"
        size="mini"
        style="margin-top:18px;"
        label-width="80px"
        class="demo-form-inline"
      >
        <el-form-item label="处理人">
          <el-input v-model="form.dealName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.dealType">
            <el-option label="全部" value></el-option>
            <el-option label="待处理" :value="0"></el-option>
            <el-option label="处理中" :value="1"></el-option>
            <el-option label="已处理" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间">
          <el-date-picker
            v-model="form.inform"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="处理时间">
          <el-date-picker
            v-model="form.deal"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-title" style="border:1px solid #ccc;">
      <p>数据列表</p>
    </div>
    <div class="table" ref="table" v-loading="loading" element-loading-text="正在加载中">
      <el-table :data="data" stripe border style="width: 100%" @sort-change="sortChange">
        <el-table-column type="index" :index="indexMethod" label="序号" align="center"></el-table-column>
        <el-table-column prop="messageContent" label="通知内容" align="center">
          <template slot-scope="scope">
            <p>
              <span
                v-for="item,index in scope.row.messageContentArr"
                :style="item === '异' || item === '常' || item === '↑' || item === '↓'?'color:#f00;':''"
                :key="index"
              >{{item}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="informTime"
          label="通知时间"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column
          sortable="custom"
          prop="dealType"
          label="处理状态"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column prop="userName" label="处理人" align="center" width="200px"></el-table-column>
        <el-table-column
          sortable="custom"
          prop="dealTime"
          label="处理时间"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column fixed="right" prop="date" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.dealType==='待处理'"
              @click="status(scope.row)"
              type="text"
              size="small"
            >开始处理</el-button>
            <el-button
              v-if="scope.row.dealType==='处理中'"
              @click="status(scope.row)"
              type="text"
              size="small"
            >已处理</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="list-pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  data() {
    return {
      loading: false,
      form: {
        dealName: "",
        dealType: "",
        inform: [],
        deal: []
      },
      data: [],
      pageNum: 1,
      pageSize: 8,
      pageLength: 0
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 序号
    indexMethod(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    },
    sortChange(data) {
      const list = {
        ascending: 1,
        descending: 2
      };
      switch (data.prop) {
        case "informTime":
          this.getData(false, list[data.order], null, null);
          break;
        case "dealType":
          this.getData(false, null, list[data.order], null);
          break;
        case "dealTime":
          this.getData(false, null, null, list[data.order]);
          break;
        default:
          this.getData(false, null, null, null);
      }
    },
    // 获取消息列表
    getData(search, informTimeSort, dealTypeSort, dealTimeSort) {
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/ap/messageHealth/getMemberHealthList",
        dealName: this.form.dealName,
        dealType: this.form.dealType,
        informStartTime: this.form.inform === null ? "" : this.form.inform[0],
        informEndTime: this.form.inform === null ? "" : this.form.inform[1],
        dealStartTime: this.form.deal === null ? "" : this.form.deal[0],
        dealEndTime: this.form.deal === null ? "" : this.form.deal[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        informTimeSort,
        dealTypeSort,
        dealTimeSort
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          if (search) {
            this.$message({
              type: "success",
              message: "搜索完成",
              center: true
            });
          }
          const messageList = res.data.messageList;
          messageList.forEach(item => {
            item.messageContentArr = item.messageContent.split("");
          });
          this.data = messageList;
          this.pageLength = res.data.total;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    status(row) {
      this.$get("/data/my", {
        pathL: "/ap/messageHealth/startOrEndDealMessage",
        id: row.id,
        userId: this.$store.getters.userId,
        kind: row.dealType === "处理中" ? 2 : 1
      }).then(res => {
        if (res.state === 0) {
          this.$message({
            type: "success",
            message: "设置成功",
            center: true
          });
          this.getData();
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 搜索查询
    search() {
      this.pageNum = 1;
      this.getData(true);
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
    // 查看详情
    detail(row) {
      const messageContent = row.messageContent;
      const list = [
        "血压数据",
        "血糖数据",
        "体温数据",
        "心电数据",
        "血氧数据",
        "体脂数据"
      ];
      const fn = item => messageContent.includes(item);
      const active = list.filter(fn);
      this.$router.push({
        name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
        query: {
          id: row.memberId,
          memberType: row.memberType,
          familyNo: row.familyNo,
          index: "--",
          type: true,
          active:active[0]
        }
      });
    }
  }
};
</script>

<style scoped>
.message {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}
.table {
  flex: 1;
  overflow: auto;
}
</style>
