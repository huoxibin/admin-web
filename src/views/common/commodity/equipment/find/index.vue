<!--
* author: huoxibin
* created: 2018/9/29
* describe:商品管理/设备管理/详情
-->
<template>
    <div class="equipment-find">
      <div class="title">
        <p></p>
        <el-button @click="$router.go(-1)" size="mini" type="primary">返回</el-button>
      </div>
      <!-- 信息 -->
      <el-form ref="form" :model="form" inline style="margin-top:18px;" label-width="120px" label-suffix=":">
        <el-form-item label="家庭号">{{familyNo}}</el-form-item>
        <el-form-item label="设备ID">{{deviceId}}</el-form-item>
        <el-form-item label="当前版本号">{{appVersion}}</el-form-item>
        <el-form-item label="绑定状态">
          <span v-if="$route.query.SN == null">未绑定</span>
          <span v-if="$route.query.SN !== null">已绑定</span>
        </el-form-item>
        <el-form-item label="服务套餐">{{serviceName}}</el-form-item>
        <el-form-item label="设备激活地点">{{ipCity}}</el-form-item>
        <el-form-item label="设备激活时间">{{createTime}}</el-form-item>
        <el-form-item label="服务套餐有效期">{{indate}}</el-form-item>
      </el-form>
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane v-for="item,index in list" :key="index" :label="item">
          <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
            <!--版本升级历史-->
            <el-table-column  label="版本号" prop="appVersion" v-if="index===0"  align="center"></el-table-column>
            <el-table-column  label="更新时间" prop="updateTime" v-if="index===0"  align="center"></el-table-column>
            <!--设备绑定记录-->
            <el-table-column  label="设备ID" prop="deviceSn" v-if="index===1"  align="center"></el-table-column>
            <el-table-column  label="绑定时间" prop="createTime" v-if="index===1"  align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
        props: [],
        filters: {},
        data() {
            return {
              loading:false,//加载中表示
              //tabs 切换
              list:["版本升级历史", "设备绑定记录"],
              index:'0', //tabs 切换标识
              form: {}, //获取到的信息
              //列表数据
              tableData:[],
              pageSize: 10,//每页显示得条数
              pageLength: 0,//一共多少条数据
              pageNum:1,//当前页码
              familyNo:this.$route.query.familyNo,//传过来的家庭号
              deviceId:this.$route.query.SN,//设备Id
              appVersion:this.$route.query.appVersion,//当前版本号
              serviceName:this.$route.query.serviceName,//服务套餐
              ipCity:this.$route.query.ipCity,//设备激活地点
              createTime:this.$route.query.createTime,//设备激活时间
              indate:this.$route.query.indate//服务套餐有效期
            }
        },
        created() {
          this.queryList("/common/deviceOperating/getAppUpdateHistory","0")
        },
        methods: {
          //获取列表数据
          queryList(pathL,index){
            let data = {};
            switch (index) {
              case "0":
                data = {
                  pathL,
                  familyNo: this.familyNo,
                  pageNum: this.pageNum,
                  pageSize: this.pageSize
                };
                break;
              case "1":
                data = {
                  pathL,
                  familyNo: this.familyNo,
                  pageNum: this.pageNum,
                  pageSize: this.pageSize
                };
                break;
            }
            this.loading = true;
            this.$get("/data/my",
                data
            ).then(res => {
              this.loading = false;
              if (res.state === 0) {
                this.tableData = res.data.result;
                this.pageLength =res.data.total;
              }
            })
          },
          // tab切换
          handleClick(tab) {
            this.pageNum = 1;
            this.index = tab.index;
            switch(tab.index){
              case "0":
                this.queryList("/common/deviceOperating/getAppUpdateHistory", "0");
                break;
              case "1":
                this.queryList("/common/deviceOperating/getDeviceBindHistory", "1");
                break;
            }
          },
          //页码请求
          handleCurrentChange(val){
            this.pageNum =val;
            switch (this.index) {
              case "0":
                this.queryList("/common/deviceOperating/getAppUpdateHistory", "0");
                break;
              case "1":
                this.queryList("/common/deviceOperating/getDeviceBindHistory", "1");
                break;
            }
          },
        },
        mounted() {},
        watch: {},
        computed: {},
        activated() {},
        deactivated() {}
    }
</script>

<style scoped>
  .equipment-find{
    width: 100%;
    height: 100%;
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
  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 40px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
