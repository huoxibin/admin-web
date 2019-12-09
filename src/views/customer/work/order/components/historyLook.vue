<!--
* author: huoxibin
* created: 2019/5/8
* describe: 工单查看里面的历史工单
-->
<template>
  <!-- 历史工单 -->
  <el-card class="work-order-card" shadow="hover" id="huoOrder">
    <div slot="header" class="clearfix">
      <div class="box">
        <div class="titleHistory">
          <span>历史工单</span>
        </div>
        <div class="firstTitle">
          <el-radio-group
            v-model="orderType"
            @change="getOrderType(phone, orderType)"
          >
            <el-radio-button
              v-for="(item, index) in firstOrder"
              :key="index"
              :label="item.id"
            >
              <span class="firstName">{{ item.name }}</span>
              <span>( {{ firstOrderNum[index] }} )</span>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <!--列表-->
    <el-table :data="tableData" style="width: 100%" v-loading="loading" @row-click="openDetails">
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      >
        <template slot-scope="scope">
          <span>
            {{scope.row.createTime.split('.')[0]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workOrderTypeName"
        label="工单类型"
      ></el-table-column>
      <el-table-column prop="workOrderTitle" label="工单标题"></el-table-column>
      <el-table-column
        prop="problemDescription"
        label="问题描述"
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">待处理</span>
          <span v-if="scope.row.status === 2">已解决</span>
          <span v-if="scope.row.status === 3">已关闭</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "workOrderHistory",
  props: {
    phone: String
  },
  data() {
    return {
      orderType: "全部",
      firstOrder: [], //一级工单类型列表
      firstOrderNum: [], //一级工单对应的数量
      tableData: [], //历史列表
      loading: false
    };
  },
  created() {
    this.getFirstOrderType(); //获取所有一级工单类型
    this.getOrderType(this.phone); //这是查看里面的用到的
    this.getOrderAll(this.phone);//一输入手机号拿到全部工单记录
  },
  methods: {
     //tabel中点击某一行事件
     openDetails(row){
        this.$router.push({
           path: "/work/order/list/preview",
           query:{
              type: row.orderType,//1是售后、2是健康、3是线索
              id: row.id,//工单号
              urge: row.urge,//催单标识
              phoneNumber:row.phone,//手机号
              status:row.status//工单状态（1待处理、2已解决、3已关闭）
           }
        });
     },
    // 获取工单类型分类、点击分类的时候
    getOrderType(now, orderType) {
      if (orderType == null) {//目的------为了拿到对应分类的（数量）；
        this.$get("/data/my", {
          pathL: "/customer/workOrder/getHistoryWorkOrder",
          phone: now,
          orderType: orderType
        }).then(res => {
          if (res.state === 0) {
            let count = res.data.orderTypeList;
            let s = 0;
            for (var value of count) {
              this.firstOrderNum.push(value.count);
               s += value.count;
            };
            this.firstOrderNum.unshift(s);
          } else {
            this.$message({
              type: "warning",
              message: res.msg,
              center: true
            });
          }
        });
      }else if(orderType == '全部'){
          this. getOrderAll(now);
      } else {//点击某一个分类的数量----拿到对应的列表值
        this.loading = true;
        this.$get("/data/my", {
          pathL: "/customer/workOrder/getHistoryWorkOrder",
          phone: now,
          orderType: orderType
        }).then(res => {
          this.loading = false;
          if (res.state === 0) {
            this.tableData = res.data;
          } else {
            this.$message({
              type: "warning",
              message: res.msg,
              center: true
            });
          }
        });
      }
    },

     //一输入手机号拿到全部工单记录
     getOrderAll(now){
        this.$get("/data/my", {
           pathL: "/customer/workOrder/getHistoryWorkOrder",
           phone: now,
           orderType:''
        }).then(res => {
           this.loading = false;
           if (res.state === 0) {
              this.tableData = res.data.viewWorkOrderList;
           } else {
              this.$message({
                 type: "warning",
                 message: res.msg,
                 center: true
              });
           }
        });
     },
    //获取所有一级工单类型------是为了获取所有一级分类的名字
    getFirstOrderType() {
      this.$get("/data/my", {
        pathL: "/customer/orderType/getFirstOrderType"
      }).then(res => {
        if (res.state === 0) {
          this.firstOrder = res.data;
          this.firstOrder.unshift({name:'全部',id:'全部'});
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .titleHistory {
    width: 100px;
    height: 30px;
    line-height: 30px;
  }
  .firstTitle {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.firstName {
  margin-right: 5px;
}
</style>
