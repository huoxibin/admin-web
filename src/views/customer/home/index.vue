<template>
  <div>
    <el-row class="landpage">
      <!--左边文案-->
      <el-col :span="13">
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoChuLiPage" :dataList="waitProcess" @getData="getChuLiNum"></sys-deskwork>
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoArticlePageTwo" :dataList="panesData" @getData="getArticlelNumTwo"></sys-deskwork>
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoUserPage" :dataList="panesData1" @getData="getArticleReadTwo"></sys-deskwork>
        <sys-deskwork :rowNum="4" :showSelect=true @open="gotoOrderPage" :dataList="panesData2" @getData="getOrderRead"></sys-deskwork>
        <el-header class="head-txt bgd" style="position: relative">
          分管用户
          <span class="partUsers" @click="assignUsersClick" style="cursor: pointer" v-if="didianActive">分配用户</span>
          <el-select :disabled="clickActive" v-model="chargeUsers" style="width: 100px" @change="changeOption" size="mini" class="pull-right" placeholder="本人">
            <el-option
                    v-for="item in usersList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            ></el-option>
          </el-select>

          <!--医哆咖用户、医护用户-->
          <div>
            <el-radio-group style="margin: 10px" v-model="userType" @change="handleChange" size="mini">
              <el-radio-button
                      v-for="item in userTypeList"
                      :key="item.id"
                      :label="item.id"
              >{{item.menuName}}</el-radio-button>
            </el-radio-group>
            <!--table数据-->
            <div ref="table" class="table">
              <el-table
                      ref="data"
                      height="400"
                      :data="tableData"
                      border
                      stripe
                      v-loading="loadingData"
                      element-loading-text="正在加载中"
              >
                <el-table-column label="序号" width="100px" align="center" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userName" show-overflow-tooltip label="用户姓名" align="center"></el-table-column>
                <el-table-column prop="phone" show-overflow-tooltip label="用户手机号" align="center"></el-table-column>
                <el-table-column prop="principalName" show-overflow-tooltip label="负责人" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="250px">
                  <template slot-scope="scope">
                    <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!--分页-->
            <div class="pagination">
              <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="pageNum"
                      :page-size="pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="pageLength">
              </el-pagination>
            </div>
          </div>
        </el-header>
      </el-col>

      <!--右边日历-->
      <el-col :span="11">
        <full-calendar
                :events="fcEvents"
                lang="zh"
                @changeMonth="changeMonth"
                @eventClick="eventClick"
                @dayClick="dayClick"
                @moreClick="moreClick"
        ></full-calendar>
      </el-col>
    </el-row>

    <!--分配用户弹窗-->
    <el-dialog
            title="选择分管用户"
            :visible.sync="dialogVisible"
            width="60%"
            :append-to-body="true"
    >
      <el-form :inline="true" size="mini" label-width="120px" ref="form" :model="form" :rules="formRules">
        <el-form-item label="请选择负责人" required>
          <el-form-item prop="department" style="float: left">
            <el-select style="width: 150px" v-model="form.department" placeholder="请选择" @change="handleDepartmentChange">
              <el-option
                      v-for="item in departmentFen"
                      :key="item.id"
                      :label="item.departmentName"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="receiverNo" style="float: left">
            <el-select style="width: 150px" v-model="form.receiverNo" placeholder="请选择">
              <el-option v-for="item in staff" :key="item.id" :label="item.userName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="已分配负责人" prop="">
          <el-select style="width: 150px" v-model="form.personAssigned" placeholder="请选择">
            <el-option label="空" value="0"></el-option>
            <el-option
                    v-for="item in personAssignedList"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="form.userNameFen" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button  size="mini" type="primary" @click="submitForm">搜索</el-button>
        </el-form-item>
      </el-form>
      <!--医哆咖用户、医护用户-->
      <el-radio-group style="margin: 10px" v-model="userTypeDialog" @change="handleChangeDialog" size="mini">
        <el-radio-button :disabled="cilckNo" label='1'>医哆咖用户</el-radio-button>
        <el-radio-button :disabled="cilckNo" label='2'>医护用户</el-radio-button>
      </el-radio-group>
      <!--table-->
      <div class="table" v-loading="loadingDialog">
        <el-table
                ref="tableDialog"
                :data="dataDialog"
                border
                stripe
                style="width: 100%"
                height="450"
                @selection-change="handleSelectionChange"
                :row-key="getRowKeys"
                reserve-selection="true"
        >
          <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>
          <el-table-column fixed width="100" label="序号" type="index" align="center"></el-table-column>
          <div class="table-colum" v-for="(item, index) in tableConfig" :key="index">
            <el-table-column
                    v-if="item.show === userTypeDialog"
                    :prop="item.value"
                    :label="item.label"
                    align="center"
            ></el-table-column>
          </div>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" v-if="false">
          <el-pagination
                  @current-change="handleCurrentChangeDialog"
                  :current-page="pageNumDialog"
                  :page-size="pageSizeDialog"
                  layout="total, prev, pager, next, jumper"
                  :total="pageLengthDialog"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelSubmit">取 消</el-button>
        <!--<el-button size="mini" type="primary" :disabled="bindSubmitClick == 1 ? true : false" @click="bindSubmit">确 定</el-button>-->
        <el-button size="mini" type="primary" :disabled="bindSubmitClick == 1 ? true : false" v-show="userTypeDialog ==1"  @click="bindSubmitOne">确 定 ( 医哆咖 )</el-button>
        <el-button size="mini" type="primary" :disabled="bindSubmitClick == 1 ? true : false" v-show="userTypeDialog ==2" @click="bindSubmitTwo">确 定 ( 医护 )</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
   import {getCurrWeek, getCurrMonth, getCurrYear, getCurrDay, getCurrQuality, getPrevMonth, getPrevQuality} from '@/utils/getDate';
   export default {
      name: "landPage",
      components: {"full-calendar": require("vue-fullcalendar")},
      data () {
         return {
            cilckNo:false,
            //弹窗显示
            dialogVisible:false,
            form:{
               department:'',//请选择负责人第一个下拉框
               receiverNo:'',//请选择负责人第二个下拉框
               personAssigned:'',//已分配负责人
               userNameFen:''//用户姓名
            },
            formRules:{
               department:{ required: true, message: '请选择部门', trigger: 'change' },
               receiverNo:{ required: true, message: '请选择负责人', trigger: 'change' }
            },
            departmentFen:[],
            personAssignedList:[],
            staff:[],
            loadingDialog:false,
            dataDialog:[],
            getRowKeys(row) {
               return row.id;
            },
            pageSizeDialog: 50,//每页显示得条数
            pageLengthDialog: 0,//一共多少条数据
            pageNumDialog:1,//当前页码
            tableConfig:[
               {
                  show:'1',
                  label: "姓名",
                  value: "userName"
               },
               {
                  show:'1',
                  label: "手机号",
                  value: "phone"
               },
               {
                  show:'1',
                  label: "已分配负责人",
                  value: "principalName"
               },
               {
                  show:'2',
                  label: "姓名",
                  value: "userName"
               },
               {
                  show:'2',
                  label: "手机号",
                  value: "phone"
               },
               {
                  show:'2',
                  label: "已分配负责人",
                  value: "principalName"
               },
            ],
            //医哆咖用户、医护用户
            userTypeDialog:'1',
            yidokaSelection:[],//多选框选中的id(医哆咖用户)
            yihuSelection:[],//多选框选中的id(医护用户)
            huixianSelectionOld:[],

            totalDialogPageSize:'',//拿到的数据总共的页数

            //日历相关配置
            value: "",
            fcEvents: [
               {
                  title: "记录时间", // 事件内容
                  start: "2019-05-12", // 事件开始时间
                  end: "2019-05-12", // 事件结束时间
                  content: "内容"
               },
               {
                  title: "记录事件", // 事件内容
                  start: "2019-05-12", // 事件开始时间
                  end: "2019-05-12", // 事件结束时间
                  content: "内容"
               }
            ],
            //（第一个）待处理信息
            waitProcess:[
               {
                  name: "简报",
                  column: [
                     {
                        title: "待处理信息",
                        //时间默认绑定值1
                        defaultValue: 1,
                        //时间选择
                        selectOption: [
                           {
                              value: 1,
                              label: "本日"
                           },
                           {
                              value: 2,
                              label: "本周"
                           },
                           {
                              value: 3,
                              label: "本月"
                           },
                           {
                              value: 4,
                              label: "上月"
                           },
                           {
                              value: 5,
                              label: "本季度"
                           },
                           {
                              value: 6,
                              label: "上季度"
                           },
                           {
                              value: 7,
                              label: "本年"
                           }
                        ],
                        //跳转链接
                        data: [
                           {
                              num: 0,
                              unit: "",
                              desc: "待处理售后工单",
                              link: "/work/order/list",
                              param: {start: null, end: null,orderType:1}
                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "待处理健康工单",
                              link: "/work/order/list",
                              param: {start: null, end: null,orderType:2}

                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "待处理线索工单",
                              link: "/work/order/list",
                              param: {start: null, end: null,orderType:3}
                           }
                        ]
                     }
                  ]
               }
            ],
            //（第二个）测量信息
            panesData: [
               {
                  name: "",
                  column: [
                     {
                        title: "测量信息",
                        //时间默认绑定值1
                        defaultValue: 1,
                        //时间选择
                        selectOption: [
                           {
                              value: 1,
                              label: "本日"
                           },
                           {
                              value: 2,
                              label: "本周"
                           },
                           {
                              value: 3,
                              label: "本月"
                           },
                           {
                              value: 4,
                              label: "上月"
                           },
                           {
                              value: 5,
                              label: "本季度"
                           },
                           {
                              value: 6,
                              label: "上季度"
                           },
                           {
                              value: 7,
                              label: "本年"
                           }
                        ],
                        //跳转链接
                        data: [
                           {
                              num: 0,
                              unit: "",
                              desc: "血压异常数",
                              link: "/count/user/pressure",
                              param: {start: null, end: null,isAll:null}
                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "血糖异常数",
                              link: "/count/user/sugar",
                              param: { start: null, end: null,isAll:null}

                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "血氧异常数",
                              link: "/count/user/oxygen",
                              param: {start: null, end: null,isAll:null}
                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "心电异常数",
                              link: "/count/user/ecg",
                              param: {start: null, end: null,isAll:null}
                           }
                        ]
                     }
                  ]
               }
            ],
            //（第三个）用户信息
            panesData1: [
               {
                  name: "",
                  column: [
                     {
                        title: "用户信息",
                        defaultValue: 1,
                        selectOption: [
                           {
                              value: 1,
                              label: "本日"
                           },
                           {
                              value: 2,
                              label: "本周"
                           },
                           {
                              value: 3,
                              label: "本月"
                           },
                           {
                              value: 4,
                              label: "上月"
                           },
                           {
                              value: 5,
                              label: "本季度"
                           },
                           {
                              value: 6,
                              label: "上季度"
                           },
                           {
                              value: 7,
                              label: "本年"
                           }
                        ],
                        data: [
                           {
                              num: 0,
                              unit: "名",
                              desc: "新增医生数",
                              link: "/doctor/healthCare/list",
                              param: {start: null, end: null,checked:0}

                           },
                           {
                              num: 0,
                              unit: "名",
                              desc: "待审核医生",
                              link: "/doctor/healthCare/list",
                              param: {start: null, end: null,checked:1}
                           },
                           {
                              num: 0,
                              unit: "个",
                              desc: "新增家医团队数",
                              link: "/doctor/team/list",
                              param: {start: null, end: null}
                           },
                           {
                              num: 0,
                              unit: "个",
                              desc: "新开通家庭数",
                              link: "/count/family/list",
                              param: {start: null, end: null}
                           }
                        ]
                     }
                  ]
               }
            ],
            //(第四个)订单信息
            panesData2:[
               {
                  name: "",
                  column: [
                     {
                        title: "订单信息",
                        defaultValue: 1,
                        selectOption: [
                           {
                              value: 1,
                              label: "本日"
                           },
                           {
                              value: 2,
                              label: "本周"
                           },
                           {
                              value: 3,
                              label: "本月"
                           },
                           {
                              value: 4,
                              label: "上月"
                           },
                           {
                              value: 5,
                              label: "本季度"
                           },
                           {
                              value: 6,
                              label: "上季度"
                           },
                           {
                              value: 7,
                              label: "本年"
                           }
                        ],
                        data: [
                           {
                              num: 0,
                              unit: "",
                              desc: "云医订单数",
                              link: "/order/clouddoctor/list",
                              param: {start: null, end: null,markId:1}
                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "云医差评订单数",
                              link: "/order/clouddoctor/list",
                              param: {start: null, end: null,serviceCode:1}
                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "家医签约订单数",
                              link: "/order/orderteam/list",
                              param: {start: null, end: null}
                           },
                           {
                              num: 0,
                              unit: "",
                              desc: "点播课程订单数",
                              link: "/order/course/list",
                              param: {start: null, end: null}
                           },
                           {
                              num: 0,
                              unit: "个",
                              desc: "绿通订单数",
                              link: "/order/pass",
                              param: {start: null, end: null}
                           }
                        ]
                     }
                  ]
               }
            ],
            //分管用户
            chargeUsers:'1',
            usersList:[
               {value: '1', label: '本人'},
               {value: '2', label: '全部'},
            ],
            //医哆咖用户、医护用户
            userType:'1',
            userTypeList:[
               {id:'1',menuName:'医哆咖用户'},
               {id:'2',menuName:'医护用户'}
            ],
            //表格数据
            loadingData:false,
            tableData:[],
            pageSize: 10,//每页显示得条数
            pageLength: 0,//一共多少条数据
            pageNum:1,//当前页码



            //第一个跳转时间相关配置项
            chuliSelect: 0,
            chuliDate: {
               start: '',
               end: ''
            },
            //第二个跳转时间相关配置项
            celiangSelect: 0,
            celiangDate: {
               start: '',
               end: ''
            },
            //第三个跳转时间相关配置项
            userSelect:0,
            userData:{
               start: '',
               end: ''
            },
            //第四个跳转时间相关配置项
            orderSelect:0,
            orderData:{
               start: '',
               end: ''
            },

            //分配权限
            didianActive:false,
            clickActive:true,
            bindSubmitClick:1,//确定按钮是否允许点击
            yiSelectionNew:[],
            offOn:true,
            timers:null
         };
      },
      created() {
         //基础数据平台配置的按钮权限
         const btnArr = this.$store.getters.menuInfo.btnMenu;
         btnArr.forEach(item => {
            if(item.menuName == '客服平台'){
               for (let it of item.btnList) {
                  let linkUrl = it.linkUrl;
                  if (linkUrl == "assignUsers") {
                     this.didianActive = true;
                     this.clickActive = false;
                  }
               }
            }
         });
      },
      mounted(){
         let date = {};
         date = getCurrDay();//当天{start: "2019-06-05", end: "2019-06-05"}
         //待处理信息
         this.getChuLiNum(1);
         this.chuliDate.start = date.start;
         this.chuliDate.end = date.end;
         //测量信息
         this.getArticlelNumTwo(1);
         this.celiangDate.start = date.start;
         this.celiangDate.end = date.end;
         //用户信息
         this.getArticleReadTwo(1);
         this.userData.start = date.start;
         this.userData.end = date.end;
         //订单信息
         this.getOrderRead(1);
         this.orderData.start = date.start;
         this.orderData.end = date.end;
         //获取表格数据
         this.getDataTable();
      },
      watch: {
         //待处理信息
         chuliSelect () {
            this.setSelectDate(this.chuliSelect, this.chuliDate);
         },
         //测量信息
         celiangSelect () {
            this.setSelectDate(this.celiangSelect, this.celiangDate);
         },
         //用户信息
         userSelect(){
            this.setSelectDate(this.userSelect, this.userData);
         },
         //订单信息
         orderSelect(){
            this.setSelectDate(this.orderSelect, this.orderData);
         },
         //个人、全部切换（待处理信息、测量信息）需要重新请求接口
         chargeUsers(){
            this.getChuLiNum(1);//待处理信息
            this.getArticlelNumTwo(1);//测量信息
         },
         //弹框隐藏
         dialogVisible(now){
            if (now === false) {
               this.cancelSubmit();
               this.getDataTable();
               this.offOn = false;
               this.dataDialog = [];
            }
         }
      },
      methods: {
         // 获取部门信息
         getDepartment() {
            this.$post("/data/my", {
               pathL: "/ap/sysDepartment/list",
               pageNum: 1,
               pageSize: 99999
            }).then(res => {
               this.departmentFen = res.data.page.result;
            });
         },
         //获取（已分配负责人）接口
         getListPrincipalName(){
            this.$get("/data/my", {
               pathL: "/customer/chargeUser/listPrincipalName",
            }).then(res => {
               this.personAssignedList = res.data;
            })
         },
         //Dialog---切换部门
         handleDepartmentChange(departmentId) {
            this.$post("/data/my", {
               pathL: "/ap/sysUser/list",
               pageNum: 1,
               pageSize: 9999999,
               departmentId
            }).then(res => {
               if (res.state === 0) {
                  this.form.receiverNo = '';
                  this.staff = res.data.page.result;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            });
         },
         // 序号
         indexMethodTwo(index) {
            return (this.pageNumDialog - 1) * this.pageSizeDialog + (index + 1);
         },
         //分配用户(按钮)
         assignUsersClick(){
            this.dialogVisible = true;
            this.userTypeDialog = '1';
            this.bindSubmitClick = 1;
            this.dataDialog = [];
            this.cilckNo = false;
            this.getDepartment();//获取选择负责人第一个下拉框
            this.getListPrincipalName();//获取（已分配负责人）方法
         },
         //搜索
         submitForm(){
            this.$refs.form.validate((valid) => {
               if (valid) {
                  this.$refs.tableDialog.clearSelection();//切换tab的时候清空多选框选中的
                  this.pageNumDialog = 1;
                  this.huixianSelectionOld = [];
                  this.dataDialog = [];
                  this.bindSubmitClick = 1;
                  //---------------方法1
                  // this.queryList();
                  //---------------方法2
                  this.getInit();
               } else {
                  return false;
               }
            })
         },
         //Dialog---1医哆咖用户2医护用户
         handleChangeDialog(val){
            this.bindSubmitClick = 1;
            for(let i in this.form) {this.form[i] = ""};
            this.pageLengthDialog = 0;
            this.pageNumDialog = 1;
            this.dataDialog = [];
            this.staff = [];
            this.userTypeDialog = val;
            this.$refs.tableDialog.clearSelection();//切换tab的时候清空多选框选中的
            this.huixianSelectionOld = [];//最开始的状态
            this.yiSelectionNew = [];//最新的状态

         },

         //-------------------------------------方法1(分页)
         //获取列表
         queryList(){
            this.loadingDialog = true;
            this.$get("/data/my", {
               pathL: "/customer/chargeUser/getChargeUserListByPrincipalId",
               pageNum: this.pageNumDialog, //当前页码
               pageSize:this.pageSizeDialog, //每页显示得条数
               principalId:this.form.receiverNo,//负责人id
               memberType:this.userTypeDialog,//1医哆咖用户2医护用户
               chargeUserId:this.form.personAssigned,//已分配负责人id
               memberName:this.form.userNameFen//用户姓名
            }).then(res => {
               this.loadingDialog = false;
               if (res.state === 0) {
                  this.bindSubmitClick = 2;
                  this.dataDialog= res.data.userList;
                  this.pageLengthDialog = res.data.total;
                  //多选框的回显
                  res.data.userCheckedIds.forEach(row => {
                     this.$refs.tableDialog.toggleRowSelection(row);
                  });
                  //记住最开始的状态
                  res.data.userCheckedIds.forEach(res=>{
                     this.huixianSelectionOld.push(res);
                  });
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //Dialog---分页
         handleCurrentChangeDialog(val){
            this.pageNumDialog = val;
            this.queryList();
         },

         //-------------------------------------方法2(不分页)
         // async 来处理异步
         async getInit() {
            this.offOn = true;
            this.cilckNo = true;
            this.loadingDialog = true;
            await this.getDataTableDialog();
            setTimeout(()=>{
               this.loadMoreData()
            },1000);
            // await this.loadMoreData();
         },
         getDataTableDialog(){
            this.$get("/data/my", {
               pathL: "/customer/chargeUser/getChargeUserListByPrincipalId",
               pageNum: this.pageNumDialog, //当前页码
               pageSize:this.pageSizeDialog, //每页显示得条数
               principalId:this.form.receiverNo,//负责人id
               memberType:this.userTypeDialog,//1医哆咖用户2医护用户
               chargeUserId:this.form.personAssigned,//已分配负责人id
               memberName:this.form.userNameFen//用户姓名
            }).then(res => {
               this.loadingDialog = false;
               if (res.state === 0) {
                  this.totalDialogPageSize = res.data.pages;//总页数
                  if(res.data.userList.length >= 0){
                     res.data.userList.forEach(res => {
                        this.dataDialog.push(res)
                     });
                     //多选框的回显
                     res.data.userCheckedIds.forEach(row => {
                        this.$refs.tableDialog.toggleRowSelection(row);
                     });
                     //记住最开始的状态
                     res.data.userCheckedIds.forEach(res=>{
                        this.huixianSelectionOld.push(res);
                     });
                  }else {
                     this.offOn = false;
                  };
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         loadMoreData() {
            let that = this;
            if(that.offOn){
               that.timers = setInterval(function() {
                  that.pageNumDialog++;
                  if( that.pageNumDialog <= that.totalDialogPageSize){
                     that.getDataTableDialog(); //调用执行下面的加载方法
                  }else {
                     that.bindSubmitClick = 2;
                     that.offOn =false;
                     that.cilckNo = false;
                     clearInterval(that.timers);
                  }
               }, 500);
            }else {
               return;
            }
         },


         //Dialog--多选框
         handleSelectionChange(val) {
            // console.log(val);
            //-----------------------------方法1
            // var result = [];
            // var obj = {};
            // for(var i =0; i<val.length; i++){
            //    if(!obj[val[i].id]){
            //       result.push(val[i]);
            //       obj[val[i].id] = true;
            //    }
            // };
            // if (result.length !== 0) {
            //    this.yiSelectionNew = result;
            //    console.log(this.yiSelectionNew);
            // }else {
            //    this.yiSelectionNew = [];
            // }
            //-----------------------------方法2
            if (val.length !== 0) {
               this.yiSelectionNew = val;
               // console.log(this.yiSelectionNew);
            }else {
               this.yiSelectionNew = [];
            }
         },
         //（医哆咖用户）确定按钮
         bindSubmitOne(){
            this.loadingDialog = true;
            //数组对比取不同
            //-----------------------------方法1
            // let array = this.huixianSelectionOld;//最开始的
            // var array1 = [];
            // var obj = {};
            // for(var i =0; i<array.length; i++){
            //    if(!obj[array[i].id]){
            //       array1.push(array[i]);
            //       obj[array[i].id] = true;
            //    }
            // }
            //-----------------------------方法2
            let array1 = this.huixianSelectionOld;//最开始的
            // console.log(array1);
            let array2 = this.yiSelectionNew;//最新的(医哆咖)
            // console.log(array2);

            let resultYiDoKaAdd = [];//新增的(医哆咖)
            for(var i = 0; i < array2.length; i++){
               var obj = array2[i];
               var num = obj.id;
               var flag = false;
               for(var j = 0; j < array1.length; j++){
                  var aj = array1[j];
                  var n = aj.id;
                  if(n == num){
                     flag = true;
                     break;
                  }
               }
               if(!flag){
                  resultYiDoKaAdd.push(obj);
               }
            }
            var resultOneYiDoKaDel = [];//删除的(医哆咖)
            for(var i = 0; i < array1.length; i++){
               var obj = array1[i];
               var num = obj.id;
               var flag = false;
               for(var j = 0; j < array2.length; j++){
                  var aj = array2[j];
                  var n = aj.id;
                  if(n == num){
                     flag = true;
                     break;
                  }
               }
               if(!flag){
                  resultOneYiDoKaDel.push(obj);
               }
            }
            let userListJson={};
            userListJson = {
               principalDeptId:this.form.department,
               principalId:this.form.receiverNo,
               yiDuKaAddList:resultYiDoKaAdd,
               yiDuKaDelList:resultOneYiDoKaDel,
               yiHuAddList:'',
               yiHuDelList:''
            };
            console.log(userListJson);
            this.$post("/data/new", this.$qs.stringify({
               pathL: "/customer/chargeUser/chargeUser",
               userListJson:JSON.stringify(userListJson)
            })).then(res => {
               this.loadingDialog = false;
               if (res.state === 0) {
                  this.cancelSubmit();
                  this.$message({
                     message: "保存成功",
                     type: "success",
                     center: true
                  });
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //（医护用户）确定按钮
         bindSubmitTwo(){
            this.loadingDialog = true;
            //数组对比取不同
            //-----------------------------方法1
            // let array = this.huixianSelectionOld;//最开始的
            // var array1 = [];
            // var obj = {};
            // for(var i =0; i<array.length; i++){
            //    if(!obj[array[i].id]){
            //       array1.push(array[i]);
            //       obj[array[i].id] = true;
            //    }
            // }
            // console.log(array1);
            //-----------------------------方法2
            let array1 = this.huixianSelectionOld;//最开始的
            // console.log(array1);
            let array3 = this.yiSelectionNew;//最新的(医护)
            // console.log(array3);
            let resultYiHuAdd = [];//新增的(医护)
            for(var i = 0; i < array3.length; i++){
               var obj = array3[i];
               var num = obj.id;
               var flag = false;
               for(var j = 0; j < array1.length; j++){
                  var aj = array1[j];
                  var n = aj.id;
                  if(n == num){
                     flag = true;
                     break;
                  }
               }
               if(!flag){
                  resultYiHuAdd.push(obj);
               }
            }
            // console.log(resultYiHuAdd);
            var resultOneYiHuKaDel = [];//删除的(医护)
            for(var i = 0; i < array1.length; i++){
               var obj = array1[i];
               var num = obj.id;
               var flag = false;
               for(var j = 0; j < array3.length; j++){
                  var aj = array3[j];
                  var n = aj.id;
                  if(n == num){
                     flag = true;
                     break;
                  }
               }
               if(!flag){
                  resultOneYiHuKaDel.push(obj);
               }
            }
            // console.log(resultOneYiHuKaDel);

            let userListJson={};
            userListJson = {
               principalDeptId:this.form.department,
               principalId:this.form.receiverNo,
               yiDuKaAddList:'',
               yiDuKaDelList:'',
               yiHuAddList:resultYiHuAdd,
               yiHuDelList:resultOneYiHuKaDel
            };
            console.log(userListJson);
            this.$post("/data/new", this.$qs.stringify({
               pathL: "/customer/chargeUser/chargeUser",
               userListJson:JSON.stringify(userListJson)
            })).then(res => {
               this.loadingDialog = false;
               if (res.state === 0) {
                  this.cancelSubmit();
                  this.$message({
                     message: "保存成功",
                     type: "success",
                     center: true
                  });
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },

         //取消按钮
         cancelSubmit(){
            this.dialogVisible = false;
            for(let i in this.form) {this.form[i] = ""};
            this.staff = [];
            this.dataDialog = [];
            clearInterval(this.timers);
            this.pageLengthDialog = 0;
            this.pageNumDialog =1;
            this.$refs.tableDialog.clearSelection();//切换tab的时候清空多选框选中的
         },

         //跳转需要把时间传到相应页面
         setSelectDate (selectObject, dateObject) {
            let date = {};
            switch (selectObject) {
               case 1: {// 本日
                  date = getCurrDay();
               }
                  break;
               case 2: {// 本周
                  date = getCurrWeek();
               }
                  break;
               case 3: {// 本月
                  // 本月
                  date = getCurrMonth();
               }
                  break;
               case 4: {// 上月
                  date = getPrevMonth();
               }
                  break;
               case 5: {// 本季度
                  date = getCurrQuality();

               }
                  break;
               case 6: {// 上季度
                  date = getPrevQuality();
               }
                  break;
               case 7: {// 本年
                  date = getCurrYear();
               }
                  break;
            }
            dateObject.start = date.start;
            dateObject.end = date.end;
         },
         //跳转相关权限
         getMenuAccess(url){
            let hasAccess = false;
            const menuURL = this.$store.getters.menuInfo.menuURL.filter(
               item => item.menuName === "客服平台"
            );
            for (let i = 0; i < menuURL[0].urlList.length; i++) {
               if (menuURL[0].urlList[i] == url) {
                  hasAccess = true;
                  break;
               }else{
                  hasAccess = false;
               }
            }
            return hasAccess;
         },
         //待处理信息（跳转）
         gotoChuLiPage(url,param){
            param.start=this.chuliDate.start;
            param.end=this.chuliDate.end;
            let fg=this.getMenuAccess(url);
            if(fg){ // 有跳转的权限
               if (param) {
                  this.$router.push({
                     path: url,
                     query: param
                  })
               }else {
                  this.$router.push({path: url})
               }
            }else{ // 无跳转的权限
               this.$message('您没有该菜单权限无法访问');
            }
         },
         //待处理信息选择（调取接口）
         getChuLiNum (index) {
            this.chuliSelect = index;
            this.$get("/data/my", {
               pathL: "/customer/workOrder/countBeSolvedOrder",
               scope:index,
               isAll:this.chargeUsers
            }).then(res => {
               if (res.state === 0) {
                  this.waitProcess[0].column[0].data[0].num = res.data.sh;
                  this.waitProcess[0].column[0].data[1].num = res.data.jk;
                  this.waitProcess[0].column[0].data[2].num = res.data.xs;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //测量信息（跳转）
         gotoArticlePageTwo(url,param){
            param.start=this.celiangDate.start;
            param.end=this.celiangDate.end;
            param.isAll = this.chargeUsers;
            let fg=this.getMenuAccess(url);
            if(fg){ // 有跳转的权限
               if (param) {
                  this.$router.push({
                     path: url,
                     query: param
                  })
               }else {
                  this.$router.push({path: url})
               }
            }else{ // 无跳转的权限
               this.$message('您没有该菜单权限无法访问');
            }
         },
         //测量信息（调取接口）
         getArticlelNumTwo (index) {
            this.celiangSelect = index;
            this.$get("/data/my", {
               pathL: "/health/blood/countException",
               scope:index,
               isAll:this.chargeUsers
            }).then(res => {
               if (res.state === 0) {
                  this.panesData[0].column[0].data[0].num = res.data.pressure;
                  this.panesData[0].column[0].data[1].num = res.data.sugar;
                  this.panesData[0].column[0].data[2].num = res.data.oxygen;
                  this.panesData[0].column[0].data[3].num = res.data.electrocardio;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //用户信息（跳转）
         gotoUserPage(url,param){
            param.start=this.userData.start;
            param.end=this.userData.end;
            let fg=this.getMenuAccess(url);
            if(fg){ // 有跳转的权限
               if (param) {
                  this.$router.push({
                     path: url,
                     query: param
                  })
               }else {
                  this.$router.push({path: url})
               }
            }else{ // 无跳转的权限
               this.$message('您没有该菜单权限无法访问');
            }
         },
         //用户信息（调取接口）
         getArticleReadTwo(index){
            this.userSelect = index;
            this.$get("/data/my", {
               pathL: "/doctor/doctorInfo/countDoctorAndTeam",
               scope:index
            }).then(res => {
               if (res.state === 0) {
                  this.panesData1[0].column[0].data[0].num = res.data.doctor;
                  this.panesData1[0].column[0].data[1].num = res.data.beSolved;
                  this.panesData1[0].column[0].data[2].num = res.data.team;
                  this.panesData1[0].column[0].data[3].num = res.data.family;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //订单信息（跳转）
         gotoOrderPage(url,param){
            param.start=this.orderData.start;
            param.end=this.orderData.end;
            let fg=this.getMenuAccess(url);
            if(fg){ // 有跳转的权限
               if (param) {
                  this.$router.push({
                     path: url,
                     query: param
                  })
               }else {
                  this.$router.push({path: url})
               }
            }else{ // 无跳转的权限
               this.$message('您没有该菜单权限无法访问');
            }
         },
         //订单信息（调取接口）
         getOrderRead(index){
            this.orderSelect = index;
            this.$get("/data/my", {
               pathL: "/doctor/doctorOrderOperator/countOrder",
               scope:index
            }).then(res => {
               if (res.state === 0) {
                  this.panesData2[0].column[0].data[0].num = res.data.apply;
                  this.panesData2[0].column[0].data[1].num = res.data.evaluate;
                  this.panesData2[0].column[0].data[2].num = res.data.team;
                  this.panesData2[0].column[0].data[3].num = res.data.bunch;
                  this.panesData2[0].column[0].data[4].num = res.data.greenchannel;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },



         // 序号
         indexMethod(index) {
            return (this.pageNum - 1) * this.pageSize + (index + 1);
         },
         // 页数请求
         handleCurrentChange(val){
            this.pageNum =val;
            this.getDataTable();
         },
         //获取表格数据
         getDataTable(){
            this.loadingData = true;
            this.$get("/data/my", {
               pathL: "/customer/chargeUser/getChargeUserPage",
               pageNum: this.pageNum, //当前页码
               pageSize: this.pageSize, //每页显示得条数
               scope:this.chargeUsers,//1本人2全部
               memberType:this.userType//1医哆咖用户2医护用户
            }).then(res => {
               this.loadingData = false;
               if (res.state === 0) {
                  this.tableData = res.data.result;
                  this.pageLength = res.data.total;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //查看
         view(row) {
            if(this.userType == 1){//医哆咖用户的查看跳转
               this.$router.push({
                  name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
                  query: {
                     id:row.memberId,
                     memberType:'',
                     index:'',
                     activeName:'first'
                  }
               });
            }else {//医护用户的查看跳转
               this.$router.push({
                  name: "医护管理/医护管理/查看",
                  query: {
                     id:row.memberId,
                     teamId:null,
                     checkFlag: 0,
                  }
               });
            }
         },
         //本人1、全部2
         changeOption(val){
            this.chargeUsers = val;
            this.pageNum = 1;
            this.getDataTable()
         },
         //1医哆咖用户2医护用户
         handleChange(val){
            this.userType = val;
            this.pageNum = 1;
            this.getDataTable()
         },

         //日历--选择月份
         changeMonth (start, end, current) {
            //console.log("changeMonth", start, end, current);
         },
         //日历--点击事件
         eventClick (event, jsEvent, pos) {
            //console.log("eventClick", event, jsEvent, pos);
         },
         //日历--点击当天
         dayClick (day, jsEvent) {
            // console.log("dayClick", day, jsEvent);
         },
         //日历--查看更多
         moreClick (day, events, jsEvent) {
            //console.log("moreCLick", day, events, jsEvent);
         },
      }
   };
</script>

<style lang="scss" scoped>
  .is-selected {
    color: #f60;
  }
  .partUsers{
    position: absolute;
    right: 140px;
    color: #409eff;
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
  .recommend-edit {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
</style>