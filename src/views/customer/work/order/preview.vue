<template>
  <div class="work-preview">
    <div class="work-preview-left">
      <el-form ref="form" size="mini" :model="form" label-width="80px">
        <el-form-item label="工单标题">
          <span>
            {{ form.workOrderTitle }}
          </span>
        </el-form-item>
        <el-form-item label="问题描述">
          <span>
            {{ form.problemDescription }}
          </span>
        </el-form-item>
        <el-form-item label="附件">
          <p v-for="(item, index) in orderFormUrl" class="orderFujin">
            <span class="nameOrder">{{ item.name }}</span>
            <el-button
                    size="mini"
                    @click="downLoadFuOrder(item.url,item.name)"
                    type="success"
            >下载附件</el-button
            >
          </p>
        </el-form-item>
        <el-form-item v-if="$route.query.status !== 3 " label="回复工单">
          <el-input v-model="form.name" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item v-if="$route.query.status !== 3 " label="添加附件">
          <!--<base-upload
            ref="upload"
            :fileList="fileList"
            @notify="handleUpload"
          ></base-upload>-->

            <el-upload
                    ref = "upload"
                    class="upload-demo"
                    :headers="uploadHeaders"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :before-upload="beforeAvatarUpload"
                    :before-remove="beforeRemove"
                    :on-success="onSuccessAdd"
                    auto-upload
                    list-type="picture"
                    multiple
                    :limit="5"
                    :on-exceed="handleExceed"
                    :data="fileListAdder"
                    :file-list="fileListAdd"
                    name="file"
                    v-model="addFrom"
            >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>


        </el-form-item>
        <el-form-item v-if="$route.query.status !== 3 " label="受理人">
          <div style="display: flex;">
            <el-select v-model="form.deptNo" placeholder="请选择" @change="handleDepartmentChange">
              <el-option
                v-for="item in department"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="form.receiverNo" placeholder="请选择">
              <el-option
                v-for="(item,index) in staff"
                :key="index"
                :label="`${item.userName}${item.currentLine==1?'(在线)':''}`"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <!--派/转 单 、催 单 、结 单、 关闭工单、 编辑客户-->
        <el-form-item>
          <el-button
                  :disabled="$route.query.status == 3 || closeOrder == 1 || endStatus == 3 || firstClick"
                  type="primary"
                  @click="Pickup"
          >派/转 单</el-button>
          <el-button
                  :disabled="$route.query.status == 3 || closeOrder == 1 || endOrder ==1 || endStatus ==2 || endStatus==3 || secondClick"
                  type="primary"
                  @click="Reminder"
          >催 单</el-button>
          <el-button
                  :disabled="$route.query.status == 3 || closeOrder == 1 || endOrder ==1 || endStatus ==2 || endStatus==3 || thirdClick"
                  type="primary"
                  @click="ReceiveOrders"
          >结 单</el-button>
          <el-button
                  :disabled="$route.query.status == 3 || closeOrder == 1 || fourthClick"
                  type="primary"
                  @click="CloseWorkOrders"
          >关闭工单</el-button>
          <el-button
                  :disabled="$route.query.status == 3 || closeOrder == 1 || endStatus == 3"
                  type="primary"
                  @click="EditClient"
                  v-show="editActive"
          >编辑客户</el-button>
        </el-form-item>
      </el-form>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>所有回复</span>
        </div>
        <div
          v-for="(item, index) in commentList"
          :key="index"
          class="text item"
        >
          <!--{{ "列表内容 " + index}}-->
          <div class="commentList">
            <div
              class="perImg"
              v-bind:style="{ backgroundImage: 'url(' + item.headImg + ')' }"
            ></div>
            <div class="perSpeech">
              <div class="perName">
                <div class="doctorName">{{ item.createName }}</div>
                <div class="doctorJob">{{ item.createRole }}</div>
              </div>
              <div class="speechTime">
                <span class="talkTime">{{ item.createTime }}</span>
                <!--<span>回复</span>-->
                <!--<span class="talkName">白小醋</span>-->
              </div>
              <!--没有催单的-->
              <div class="speechCon" v-if="item.urge == 1">
                {{ item.orderRepair }}
                <div v-if="item.accessory !== ''" style="margin-top: 10px">
                  <p v-for="(fujian, i) in JSON.parse(item.accessory)">
                    <span>{{ fujian.name }}</span>
                    <el-button
                            size="mini"
                            @click="downLoadFu(fujian.url)"
                            type="success"
                    >下载附件</el-button
                    >
                  </p>
                </div>
              </div>
              <div class="speechCon" v-if="item.urge == 2 && item.orderRepair !== ''">
                  <p style="color: #747474">发起了催单</p>
                  <p style="color: #f00">{{item.orderRepair}}</p>
              </div>
              <!--催单的-->
              <div class="speechCon" v-if="item.urge == 2 && item.orderRepair == ''">
                <p style="color: #747474">发起了催单</p>
                <p style="color: #f00">快点处理，这个工单一直没有人回复！</p>
              </div>
              <div class="deleteFu">
                <el-button size="mini" @click="deleteHui(item.id)" type="danger" v-show="false">删除回复</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="work-preview-right">
      <el-tabs v-model="tab" type="border-card" @tab-click="handleClick">
        <el-tab-pane
          v-if="type == 1 || type == 2"
          label="客户信息"
          name="客户信息"
        >
          <el-form :model="form" label-width="100px">
            <el-form-item
              v-for="item in clientConfig"
              :key="item.label"
              :label="item.label"
            >
              <span>{{ clientForm[item.value] == '' ? '--' : clientForm[item.value] }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane v-if="type == 3" label="客户资料" name="客户信息">
          <el-form :model="form" label-width="100px">
            <el-form-item
              v-for="item in clientConfigTwo"
              :key="item.label"
              :label="item.label"
            >
              <span>{{ clientFormTwo[item.value] == '' ? '--' : clientFormTwo[item.value]  }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane v-if="type == 2" label="健康信息" name="健康信息">
          <el-form :model="form" label-width="100px">
            <el-form-item
              v-for="item in healthConfig"
              :key="item.label"
              :label="item.label"
            >
              <span>{{ healthForm[item.value] == undefined ? '--' : healthForm[item.value] }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="工单信息" name="工单信息">
          <el-form :model="form" label-width="100px">
            <el-form-item
              v-for="item in orderConfig"
              :key="item.label"
              :label="item.label"
            >
              <span>{{ orderForm[item.value] }}</span>
            </el-form-item>
          </el-form>
          <!--历史工单-->
          <history-look :phone="phone" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import historyLook from "./components/historyLook";
export default {
  name: "WorkPreview",
  components: { historyLook },
  data() {
    return {
       uploadHeaders: { accessToken: this.$store.getters.accessToken }, //设置上传的请求头部
       uploadUrl: "/data/uploadImg", //必选参数，上传的地址
       fileListAdder: {}, //上传时附带的额外参数
       fileListAdd: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
       addFrom: {},


      type: this.$route.query.type,
      form: {
         deptNo:'',
         receiverNo:''
      },
      //右边客户信息
      clientForm: {},
      clientConfig: [
        {
          label: "访问渠道",
          value: "accessChannel"
        },
        {
          label: "客户姓名",
          value: "customerName"
        },
        {
          label: "性别",
          value: "sex"
        },
        {
          label: "电话号码",
          value: "phone"
        },
        {
          label: "所属省市",
          value: "provinceAdress"
        },
        {
          label: "详细地址",
          value: "detailedAddress"
        },
        {
          label: "微信号/QQ",
          value: "wechat"
        },
        {
          label: "邮箱",
          value: "email"
        },
        {
          label: "其他电话",
          value: "otherPhone"
        },
        {
          label: "购买渠道",
          value: "buyChannel"
        },
        {
          label: "订单号",
          value: "orderNo"
        },
        {
          label: "购买日期",
          value: "buyTime"
        },
        {
          label: "产品名称",
          value: "productName"
        },
        {
          label: "服务包",
          value: "packageName"
        },
        {
          label: "会员属性",
          value: "vip"
        },
        {
          label: "家庭号",
          value: "familyNo"
        },
        {
          label: "SN码",
          value: "sn"
        },
        {
          label: "会员有效期",
          value: "expireDate"
        }
      ],
      //右边客户资料
      clientFormTwo: {},
      clientConfigTwo: [
        {
          label: "访问渠道",
          value: "accessChannel",
        },
        {
          label: "公司名称",
          value: "companyName"
        },
        {
          label: "联系人1",
          value: "contactNameOne"
        },
        {
          label: "联系方式1",
          value: "contactTelOne"
        },
        {
          label: "联系人2",
          value: "contactNameTwo"
        },
        {
          label: "联系方式2",
          value: "contactTelTwo"
        },
        {
          label: "联系人3",
          value: "contactNameThree"
        },
        {
          label: "联系方式3",
          value: "contactTelThree"
        },
        {
          label: "所属省市",
          value: "provinceAdressTwo"
        },
        {
          label: "申请区域",
          value: "applicationArea"
        },
        {
          label: "客户类型",
          value: "customerType"
        },
        {
          label: "来源",
          value: "clueSource"
        },
        {
          label: "备注",
          value: "remark"
        }
      ],
      // 右边健康信息
      healthForm: {
         useHeight: "--", //身高
         useWeight: "--", //体重
         useWaistline: "--", //腰围
         customSmoke: "--", //吸烟
         customsDrink: "--", //饮酒
         customInsomnia: "--", //睡眠
         toofull: "--", //是否每日摄入过多油脂？
         tooOil: "--", //是否长期精神紧张？
         takeMedicine: "--", //服药情况
         customSports: "--", //是否常运动？
         // --针状描述---
         allergyInfor: "--", //过敏史
         produceHistory: "--", //生育史
         familyHistory: "--", //家族史
         medicalHistory: "--", //既往病史
         sportsLevel:'',//运动水平
      },
      healthConfig: [
        {
          label: "身高",
          value: "useHeight"
        },
        {
          label: "体重",
          value: "useWeight"
        },
        {
          label: "腰围",
          value: "useWaistline"
        },
        {
          label: "是否吸烟",
          value: "customSmoke"
        },
        {
          label: "是否饮酒",
          value: "customsDrink"
        },
        {
          label: "睡眠情况",
          value: "customInsomnia"
        },
        {
          label: "是否每日摄入过多油脂，高钠盐类食物",
          value: "toofull"
        },
        {
          label: "是否长期精神紧张",
          value: "tooOil"
        },
        {
          label: "服药情况",
          value: "takeMedicine"
        },
        {
          label: "运动水平",
          value: "sportsLevel"
        },
        {
          label: "症状描述", //
          value: "asd"
        },
        {
          label: "过敏史",
          value: "allergyInfor"
        },
        {
          label: "生育史",
          value: "produceHistory"
        },
        {
          label: "家族史",
          value: "familyHistory"
        },
        {
          label: "既往史",
          value: "medicalHistory"
        }
      ],
      // 右边工单信息
      orderForm: {},
      orderConfig: [
        {
          label: "工单号",
          value: "workOrderNo"
        },
        {
          label: "工单类型",
          value: "workOrderTypeName"
        },
        {
          label: "工单等级",
          value: "workOrderLevel"
        },
        {
          label: "预计处理时间",
          value: "chuLiTime"
        },
        {
          label: "处理部门",
          value: "deptName"
        },
        {
          label: "创建人",
          value: "createName"
        },
        {
          label: "创建时间",
          value: "createTime"
        },
        {
          label: "更新时间",
          value: "updateTime"
        },
        {
          label: "工单状态",
          value: "status"
        }
      ],
      fileList: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      tab: "客户信息",
      department: [],
      staff: [],
      commentList: [],
      orderFormUrl: [], //工单信息里面下载附件连接
      phone: null, //手机号
      closeOrder:null,//关闭工单成功标识
      endOrder:null,//结单成功标识
      endStatus:null,//结单成功标识、关闭工单成功标识

      //权限分配
       editActive:false,//编辑客户
       //根据登陆人ID、受理人ID、创建人ID进行按钮是否允许点击
       firstClick:true,//派\转单
       secondClick:true,//催单
       thirdClick:true,//结单
       fourthClick:true//关闭工单
    };
  },
  created() {
    this.getOrderInfo();
    this.getDepartment();
    this.GetCommentList();//评论列表
    this.phone = this.$route.query.phoneNumber;//上个页面传来的手机号
    const type = this.$route.query.type;//1是售后、2是健康、3是线索
    if (type == 2) this.getId(this.phone);//健康工单才显示----健康信息
    //运营平台配置的按钮权限
     const btnArr = this.$store.getters.menuInfo.btnMenu;
     btnArr.forEach(item => {
        if(item.menuName == '客服平台'){
           for (let it of item.btnList) {
              let linkUrl = it.linkUrl;
              if(linkUrl == "editCustomer"){
                 this.editActive = true;
              }
           }
        }
     });
  },
   watch: {
      // 解决动态路由页面不刷新问题
      '$route' (to, from) { //监听路由是否变化
         if(this.$route.query.id){//  判断传递值的变化
            this.$router.go(0)
         }
      }
   },
   // beforeRouteUpdate (to, from, next) {
   //
   //    next();  // 一定要有next
   // },
  methods: {
     //使用 before-upload 的钩子函数 beforeAvatarUpload 限制用户上传的图片格式和大小。
     beforeAvatarUpload(file) {

     },
     //点击文件列表中已上传的文件时的钩子
     handlePreview(file) {
        console.log(file);
     },
     //on-success 文件上传成功时的钩子
     onSuccessAdd(response, file, fileList) {
        this.fileListAdd.push({
           name: file.name,
           url: response.data.url
        });
        // console.log(this.fileListAdd);
        // console.log(JSON.stringify(this.fileListAdd));
        this.form.businessLicense = JSON.stringify(this.fileListAdd);
     },
     //文件超出个数限制时的钩子
     handleExceed(files, fileList) {
        this.$message.warning(
           `当前限制选择 1 张图片，本次选择了 ${
              files.length
              } 张图片，共选择了 ${files.length + fileList.length} 张图片`
        );
     },
     // 文件删除钩子
     beforeRemove(file, fileList) {
        const status = file.url.includes("blob");
        if (status) {
           this.fileListAdd = this.fileListAdd.filter(item => item.uid !== file.uid);
        } else {
           this.fileListAdd = this.fileListAdd.filter(item => item.url !== file.url);
        }
        // console.log(this.fileListAdd);
        this.form.businessLicense = JSON.stringify(this.fileListAdd);
     },


    //根据手机号获取ID，来拿到健康信息
     getId(phone) {
        this.$get("/data/my", {
           pathL: "/customer/workOrder/getMemberIdByPhone",
           phone
        }).then(res => {
           if (res.state === 0) {
              if(res.data && JSON.stringify(res.data) !== '[]'){
                 this.queryListHealth(res.data.id);
              }
           } else {
              this.$message({
                 message: res.msg,
                 center: true
              });
           }
        });
     },
    //下载附件
    downLoadFu(pathL) {
      window.open(pathL);
    },
    //删除列表评论
    deleteHui(id) {
      let message = "是否删除该条回复？";
      let title = "删除";
      let info = "已取消删除";
      this.$confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/data/my", {
            pathL: "/customer/orderRepair/deleteOrderRepair",
            id: id //评论id
          }).then(res => {
            if (res.state === 0) {
              this.$message({
                message: "删除成功",
                center: true,
                type: "success"
              });
              this.GetCommentList();
            } else {
              this.$message({
                message: res.msg,
                center: true,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: info,
            center: true
          });
        });
    },
    //获取评论列表
    GetCommentList() {
      this.$get("/data/my", {
        pathL: "/customer/orderRepair/getOrderRepairList",
        orderId: this.$route.query.id, //工单id
        orderType: this.$route.query.type //工单类型(1售后工单2健康服务工单3线索工单)
      }).then(res => {
        if (res.state === 0) {
          this.commentList = res.data;
        }
      });
    },
     //清空附件列表
     qingkong(){
        this.$refs.upload.clearFiles();
        this.fileListAdd = [];
        this.form.businessLicense = '';
        this.form.name = '';
        this.form.deptNo = '';
        this.form.receiverNo = '';
     },
    //派/转 单
    Pickup() {
       if(this.form.name == '' || this.form.name == null){
          this.$message({
             message: "回复工单请务必填写！",
             type: "warning",
             center: true
          });
          return;
       };
      this.$post("/data/my", {
        pathL: "/customer/orderRepair/sendOrders",
        orderType: this.$route.query.type, //工单类型(1售后工单2健康服务工单3线索工单)
        orderId: this.$route.query.id, //工单id
        orderRepair: this.form.name, //回复工单
        accessory: this.form.businessLicense, //附件
         deptNo:this.form.deptNo,//部门
        receiverNo: this.form.receiverNo //受理人ID
      }).then(res => {
        if (res.state === 0) {
          this.endOrder = null;
          this.qingkong();
          this.$message({
            message: res.msg,
            center: true,
            type: "success"
          });
          this.GetCommentList();
        } else {
          this.$message({
            message: res.msg,
            center: true,
            type: "warning"
          });
        }
      });
    },
    //催单
    Reminder() {
      this.$post("/data/my", {
        pathL: "/customer/workOrder/urgeOrder",
        id: this.$route.query.id, //工单id
        orderType: this.$route.query.type, //工单类型(1售后工单2健康服务工单3线索工单)
        urge: this.$route.query.urge,//列表传来的
        //以下是非必传的
        orderRepair: this.form.name, //回复工单
        accessory: this.form.businessLicense, //附件
        deptNo:this.form.deptNo,//部门
        receiverNo: this.form.receiverNo //受理人ID
      }).then(res => {
        if (res.state === 0) {
          this.qingkong();
          this.$message({
            message: res.msg,
            center: true,
            type: "success"
          });
           this.GetCommentList();
        } else {
          this.$message({
            message: res.msg,
            center: true,
            type: "warning"
          });
        }
      });
    },
    //结单
    ReceiveOrders() {
      this.$post("/data/my", {
        pathL: "/customer/orderRepair/finishOrders",
        orderId: this.$route.query.id, //工单id
        orderRepair: this.form.name, //回复工单
        accessory: this.form.businessLicense, //附件
         deptNo:this.form.deptNo,//部门
        receiverNo: this.form.receiverNo, //受理人ID
         orderType:this.$route.query.type,//工单类型
      }).then(res => {
        if (res.state === 0) {
          this.endOrder ='1';
          this.qingkong();
          this.$message({
            message: res.msg,
            center: true,
            type: "success"
          });
          this.GetCommentList();
        } else {
          this.$message({
            message: res.msg,
            center: true,
            type: "warning"
          });
        }
      });
    },
    //关闭工单
    CloseWorkOrders() {
      let message = "关闭后，工单将不可再次修改与回复，确定关闭该工单？";
      let title = "关闭工单";
      let info = "已取消关闭";
      this.$confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //改变状态接口
          this.$post("/data/my", {
            pathL: "/customer/orderRepair/closeOrders",
            orderId: this.$route.query.id, //工单id
            orderRepair: this.form.name, //回复工单
            accessory: this.form.businessLicense, //附件
             deptNo:this.form.deptNo,//部门
            receiverNo: this.form.receiverNo, //受理人ID
             orderType:this.$route.query.type,//工单类型
          }).then(res => {
            if (res.state === 0) {
              this.closeOrder = '1';
              this.qingkong();
              this.$message({
                message: res.msg,
                center: true,
                type: "success"
              });
              this.GetCommentList();
            } else {
              this.$message({
                message: res.msg,
                center: true,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: info,
            center: true
          });
        });
    },
    //编辑客户
    EditClient() {
      const typeLei = this.$route.query.type == 1 ? "afterSale" : this.$route.query.type == 2 ? "health" : "clue";
      this.$router.push({
        path: "/work/order/list/edit",
        query: {
          id: this.$route.query.id, //工单号
          type: typeLei, //1是售后、2是健康、3是线索
          markId: 110
        }
      });
    },
    // 获取部门信息
    getDepartment() {
      this.$post("/data/my", {
        pathL: "/ap/sysDepartment/list",
        pageNum: 1,
        pageSize: 99999
      }).then(res => {
        this.department = res.data.page.result;
      });
    },
    // 切换部门
    handleDepartmentChange(departmentId) {
      // console.log(departmentId);
      let that=this;
      this.form.receiverNo = "";
      this.$post("/data/my", {
        pathL: "/ap/sysUser/list",
        pageNum: 1,
        pageSize: 9999999,
        departmentId: departmentId
      }).then(res => {
      	if(res.state==0){
      		if(res.data.page.result){
						that.staff = res.data.page.result;
          }
        }
      });
    },
    // 一进入页面，获取右边客户信息、健康信息、工单信息接口
    getOrderInfo() {
      const type = this.$route.query.type;
      const data = {
        pathL: "/customer/workOrder/getWorkOrder",
        id: this.$route.query.id,
        orderType: type
      };
      if (type == 3) {
        //线索
        this.$get("/data/my", data).then(res => {
          if (res.state === 0) {
            let clientMessageTwo = res.data;
            this.clientFormTwo = res.data;
            this.orderForm = res.data; //工单信息
            this.endStatus = res.data.status;//(1待处理、2待解决、3已关闭)
            let workOrderLevel = res.data.workOrderLevel;
            if (workOrderLevel == 1) {
              this.orderForm.workOrderLevel = "普通";
              this.orderForm.chuLiTime = "24小时";
            } else if (workOrderLevel == 2) {
              this.orderForm.workOrderLevel = "重大";
              this.orderForm.chuLiTime = "12小时";
            } else if (workOrderLevel == 3) {
              this.orderForm.workOrderLevel = "加急";
              this.orderForm.chuLiTime = "8小时";
            }
            this.orderForm.status = res.data.status == 1 ? "待处理" : res.data.status == 2 ? "已解决" : "已关闭"; //工单信息-工单状态
            this.form.workOrderTitle = res.data.workOrderTitle; //工单标题
            this.form.problemDescription = res.data.problemDescription; //问题描述
            this.clientFormTwo.provinceAdressTwo = clientMessageTwo.provName + clientMessageTwo.cName; //客户资料-所属省市
            this.clientFormTwo.applicationArea = clientMessageTwo.provinceName + clientMessageTwo.cityName + clientMessageTwo.countyName; //客户资料-申请区域

             if(res.data.accessory == ''){//新建工单不添加附件
                this.orderFormUrl = [];
             }else {
                this.orderFormUrl = JSON.parse(res.data.accessory);//附件里面的链接
             }
            let customerType = clientMessageTwo.customerType; //客户类型
            if (customerType == 1) {
              this.clientFormTwo.customerType = "大客户";
            } else if (customerType == 2) {
              this.clientFormTwo.customerType = "合伙人";
            } else if (customerType == 3) {
              this.clientFormTwo.customerType = "经销商";
            }else {
               this.clientFormTwo.customerType = '--';
            }
            let clueSource = clientMessageTwo.clueSource; //来源
            if (clueSource == 2) {
              this.clientFormTwo.clueSource = "展会";
            } else if (clueSource == 7) {
              this.clientFormTwo.clueSource = "朋友介绍";
            } else if (clueSource == 8) {
              this.clientFormTwo.clueSource = "活动/会议";
            } else if (clueSource == 9) {
              this.clientFormTwo.clueSource = "自己开发";
            } else if (clueSource == 10) {
              this.clientFormTwo.clueSource = "其他";
            }else {
              this.clientFormTwo.clueSource = "--";
            };
             ///受理人回显
             this.form.deptNo = res.data.createDeptId;
             this.handleDepartmentChange(res.data.createDeptId);
             this.form.receiverNo = res.data.createBy;
             //登陆人ID、受理人ID、创建人ID对比
             let userId = Number(this.$store.getters.userId);//登陆人ID
             let receiverNoId = Number(res.data.receiverNo);//受理人ID
             let createById =  Number(res.data.createBy);//创建人ID
             if(userId == receiverNoId && userId !== createById){
                console.log('只能派单');
                this.firstClick = false;
             }else if(userId == createById && userId !== receiverNoId){
                console.log('只能催单');
                this.secondClick = false;
             }else if(userId == receiverNoId && userId == createById){
                console.log('都可以点');
                this.firstClick = false;
                this.secondClick = false;
                this.thirdClick = false;
                this.fourthClick = false;
             }
          } else {
            this.$message({
              message: res.msg,
              center: true,
              type: "warning"
            });
          }
        });
      } else {
        //售后、健康
        this.$get("/data/my", data).then(res => {
          if (res.state === 0) {
            let clientMessage = res.data;
            this.clientForm = res.data; //客户信息
            this.orderForm = res.data; //工单信息
            this.endStatus = res.data.status;//(1待处理、2待解决、3已关闭)
            let workOrderLevel = res.data.workOrderLevel;
            if (workOrderLevel == 1) {
              this.orderForm.workOrderLevel = "普通";
              this.orderForm.chuLiTime = "24小时";
            } else if (workOrderLevel == 2) {
              this.orderForm.workOrderLevel = "重大";
              this.orderForm.chuLiTime = "12小时";
            } else if (workOrderLevel == 3) {
              this.orderForm.workOrderLevel = "加急";
              this.orderForm.chuLiTime = "8小时";
            }
            this.clientForm.provinceAdress =
              clientMessage.provinceName + clientMessage.cityName; //所属省市

            if(res.data.accessory == ''){//新建工单不添加附件
               this.orderFormUrl = [];
            }else {
               this.orderFormUrl = JSON.parse(res.data.accessory);//附件里面的链接
            }
            this.orderForm.status =
              res.data.status == 1
                ? "待处理"
                : res.data.status == 2
                ? "已解决"
                : "已关闭"; //工单信息-工单状态
            this.form.workOrderTitle = res.data.workOrderTitle; //工单标题
            this.form.problemDescription = res.data.problemDescription; //问题描述
            this.clientForm.sex = (this.clientForm.sex === 0 ? "--" : (this.clientForm.sex === 1 ?'男' : "女"));
            this.clientForm.vip = (this.clientForm.vip === 0 ? "--" : (this.clientForm.vip === 1 ? '非会员' :'会员'));
            //受理人回显
             this.form.deptNo = res.data.createDeptId;
             this.handleDepartmentChange(res.data.createDeptId);
             this.form.receiverNo = res.data.createBy;
            //登陆人ID、受理人ID、创建人ID对比
            let userId = Number(this.$store.getters.userId);//登陆人ID
            let receiverNoId = Number(res.data.receiverNo);//受理人ID
            let createById =  Number(res.data.createBy);//创建人ID
             if(userId == receiverNoId && userId !== createById){
                console.log('只能派单');
                this.firstClick = false;
             }else if(userId == createById && userId !== receiverNoId){
                console.log('只能催单');
                this.secondClick = false;
             }else if(userId == receiverNoId && userId == createById){
                console.log('都可以点');
                this.firstClick = false;
                this.secondClick = false;
                this.thirdClick = false;
                this.fourthClick = false;
             }
          } else {
            this.$message({
              message: res.msg,
              center: true,
              type: "warning"
            });
          }
        });
      }
    },
    //工单信息里面下载附件
    downLoadFuOrder(pathL,nameL) {
       const url = pathL;
       const link = document.createElement('a');
       link.style.display = 'none';
       link.href = url;
       link.setAttribute('download', nameL);
       document.body.appendChild(link);
       link.click()
      // window.open(pathL);
    },
    // tab 点击
    handleClick() {},
    //健康信息
    queryListHealth(memberId) {
      this.$get("/data/my", {
        pathL: "/health/healthInfo/getInfo",
        memberId,
        healthVersion: 2
      }).then(res => {
        if (res.state === 0) {
          var msgSecond = JSON.parse(decodeURIComponent(res.data.healthInfo));
          // console.log(msgSecond);
          if (msgSecond == null) {
             this.healthForm = {};
          } else {
            let userInfor = msgSecond.userInfor;
            if(userInfor == undefined){
               this.healthForm.useHeight = '--';
               this.healthForm.useWeight ='--';
               this.healthForm.useWaistline ='--';
               this.healthForm.useWeightIndex ='--';
            }else {
               this.healthForm.useHeight = userInfor.height == "" || userInfor.height == undefined ? "--" : userInfor.height + " CM";
               this.healthForm.useWeight = userInfor.weight == "" || userInfor.weight == undefined ? "--" : userInfor.weight + " KG";
               this.healthForm.useWaistline = userInfor.waistline == "--" || userInfor.waistline == undefined ? "--" : userInfor.waistline + " CM";
               this.healthForm.useWeightIndex = userInfor.weightIndex == "" || userInfor.weightIndex == undefined ? "--" : userInfor.weightIndex + " %";
            };
            for (var i in msgSecond) {
              let iJdata = msgSecond[i];
              //既往病史
              if (i == "medicalHistory") {
                let diseaseList = iJdata.split(",");
                let diseaseListLength = diseaseList.length;
                if (diseaseList.length == 4 && diseaseList[0] == "") {
                  this.healthForm.medicalHistory = "--";
                } else if (diseaseList.length == 4 && diseaseList[0] == "check0") {
                  this.healthForm.medicalHistory = "无";
                } else {
                  var inputText = [];
                  for (var i = 0; i < diseaseList.length; i++) {
                    inputText.push(this.diseaseFilter(diseaseList[i]));
                  };
                  var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                  var jb26Info = JSON.parse(diseaseList[diseaseListLength - 3]).jb26Info == "" ? "" : "癌症：" + JSON.parse(diseaseList[diseaseListLength - 3]).jb26Info + "；";
                  var jb27Info = JSON.parse(diseaseList[diseaseListLength - 2]).jb27Info == "" ? "" : "血液病：" + JSON.parse(diseaseList[diseaseListLength - 2]).jb27Info + "；";
                  var jb28Info = JSON.parse(diseaseList[diseaseListLength - 1]).jb28Info == "" ? "" : "其他：" + JSON.parse(diseaseList[diseaseListLength - 1]).jb28Info + "；";
                  var jb29Info = (jb26Info + jb27Info + jb28Info).replace(/、$/g, "");
                  var jb30Info = jb26Info == "" && jb27Info == "" && jb28Info == "" ? "" : "（" + jb29Info + "）";
                  this.healthForm.medicalHistory = inputContent + jb30Info;
                  // console.log(inputContent);
                }
              }
              //过敏史
              if (i == "allergyInfor") {
                let diseaseList = iJdata.allergyHistory.split(",");
                if (diseaseList.length == 1 && diseaseList[0] == "") {
                  this.healthForm.allergyInfor = "--";
                } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                  this.healthForm.allergyInfor = "无";
                } else if (diseaseList.length == 1 && diseaseList[0] == "check1") {
                  this.healthForm.allergyInfor = "有";
                } else {
                  var inputText = [];
                  for (var i = 0; i < diseaseList.length; i++) {
                    inputText.push(this.allergyFilter(diseaseList[i]));
                  }
                  var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                  var jb13Info = iJdata.jb13Info == "" ? "" : "药物过敏：" + iJdata.jb13Info + "；";
                  var jb14Info = iJdata.jb14Info == "" ? "" : "食物过敏：" + iJdata.jb14Info + "；";
                  var jb15Info = (jb13Info + jb14Info).replace(/、$/g, "");
                  var jb16Info = jb13Info == "" && jb14Info == "" ? "" : "(" + jb15Info + ")";
                  this.healthForm.allergyInfor = inputContent + jb16Info;
                }
              }
              //生育史
              if (i == "produceHistory") {
                if (iJdata == "") {
                  this.healthForm.produceHistory = "--";
                } else if (iJdata == "check0") {
                  this.healthForm.produceHistory = "无";
                } else if (iJdata == "check1") {
                  this.healthForm.produceHistory = "有";
                }
              }
              //家族史
              if (i == "familyHistory") {
                let diseaseList = iJdata.split(",");
                let diseaseListLength = diseaseList.length;
                if (diseaseList.length == 1 && diseaseList[0] == "") {
                  this.healthForm.familyHistory = "--";
                } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                  this.healthForm.familyHistory = "无";
                } else {
                  var inputText = [];
                  for (var i = 0; i < diseaseList.length; i++) {
                    inputText.push(this.diseaseFilter(diseaseList[i]));
                  }
                  var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                  var family_jb26Info = JSON.parse(diseaseList[diseaseListLength - 3]).family_jb26Info == "" ? "" : "癌症：" + JSON.parse(diseaseList[diseaseListLength - 3]).family_jb26Info + "；";
                  var family_jb27Info = JSON.parse(diseaseList[diseaseListLength - 2]).family_jb27Info == "" ? "" : "血液病：" + JSON.parse(diseaseList[diseaseListLength - 2]).family_jb27Info + "；";
                  var family_jb28Info = JSON.parse(diseaseList[diseaseListLength - 1]).family_jb28Info == "" ? "" : "其他：" + JSON.parse(diseaseList[diseaseListLength - 1]).family_jb28Info + "；";
                  var family_jb29Info = (family_jb26Info + family_jb27Info + family_jb28Info).replace(/、$/g, "");
                  var family_jb30Info = family_jb26Info == "" && family_jb27Info == "" && family_jb28Info == "" ? "" : "（" + family_jb29Info + "）";
                  this.healthForm.familyHistory = inputContent + family_jb30Info;
                }
              }
              //服药情况
              if (i == "takeMedicine") {
                let diseaseList = iJdata.takeMedicine.split(",");
                if (diseaseList.length == 1 && diseaseList[0] == "") {
                  this.healthForm.takeMedicine = "--";
                } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                  this.healthForm.takeMedicine = "无";
                } else {
                  var inputText = [];
                  for (var i = 0; i < diseaseList.length; i++) {
                    inputText.push(this.takeMedicineFilter(diseaseList[i]));
                  }
                  var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                  var jb1Info = iJdata.jb1Info == "" || iJdata.jb1Info == undefined ? "" : "降压药：" + iJdata.jb1Info + "；";
                  var jb2Info = iJdata.jb2Info == "" || iJdata.jb2Info == undefined ? "" : "使血压升高的药物：" + iJdata.jb2Info + "；";
                  var jb3Info = iJdata.jb3Info == "" || iJdata.jb3Info == undefined ? "" : "降糖药：" + iJdata.jb3Info + "；";
                  var jb4Info = iJdata.jb4Info == "" || iJdata.jb4Info == undefined ? "" : "其他：" + iJdata.jb4Info + "；";
                  var jb5Info = (jb1Info + jb2Info + jb3Info + jb4Info).replace(/、$/g, "");
                  var jb6Info = jb1Info == "" && jb2Info == "" && jb3Info == "" && jb4Info == "" ? "" : "（" + jb5Info + "）";
                  this.healthForm.takeMedicine = inputContent + jb6Info;
                }
              }
              //运动水平
              if (i == "sportsLevel") {
                let diseaseList = iJdata.sportsLevel.split(",");
                if (diseaseList.length == 1 && diseaseList[0] == "") {
                  this.healthForm.sportsLevel = "--";
                } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                  this.healthForm.sportsLevel = "无";
                } else {
                  var inputText = [];
                  for (var i = 0; i < diseaseList.length; i++) {
                    inputText.push(this.sportsLevelFilter(diseaseList[i]));
                  }
                  var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                  this.healthForm.sportsLevel = inputContent;
                }
              }
              //生活方式
              if (i == "custom") {
                for (var j in msgSecond[i]) {
                  //吸烟
                  if (j == "CustomSmoke") {
                    let diseaseList = iJdata.CustomSmoke.split(",");
                    if (diseaseList.length == 1 && diseaseList[0] == "") {
                      this.healthForm.customSmoke = "--";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                      this.healthForm.customSmoke = "否";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check1") {
                      this.healthForm.customSmoke = "是";
                    } else {
                      var inputText = [];
                      for (var i = 0; i < diseaseList.length; i++) {
                        inputText.push(this.smokeFilter(diseaseList[i]));
                      }
                      var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                      this.healthForm.customSmoke = inputContent;
                    }
                  }
                  //饮酒
                  if (j == "CustomsDrink") {
                    let diseaseList = iJdata.CustomsDrink.split(",");
                    if (diseaseList.length == 1 && diseaseList[0] == "") {
                      this.healthForm.customsDrink = "--";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                      this.healthForm.customsDrink = "不喝酒";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check1") {
                      this.healthForm.customsDrink = "偶尔";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check2") {
                      this.healthForm.customsDrink = "经常";
                    } else {
                      var inputText = [];
                      for (var i = 0; i < diseaseList.length; i++) {
                        inputText.push(this.drinkFilter(diseaseList[i]));
                      }
                      var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                      this.healthForm.customsDrink = inputContent;
                    }
                  }
                  //睡眠
                  if (j == "CustomInsomnia") {
                    let diseaseList = iJdata.CustomInsomnia;
                    if (diseaseList == "") this.healthForm.customInsomnia = "--";
                    if (diseaseList == "check0") this.healthForm.customInsomnia = "好";
                    if (diseaseList == "check1") this.healthForm.customInsomnia = "一般";
                    if (diseaseList == "check2") this.healthForm.customInsomnia = "差";
                  }
                  //是否常运动
                  if (j == "CustomSports") {
                    let diseaseList = iJdata.CustomSports.split(",");
                    if (diseaseList.length == 1 && diseaseList[0] == "") {
                      this.healthForm.customSports = "--";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check0") {
                      this.healthForm.customSports = "否";
                    } else if (diseaseList.length == 1 && diseaseList[0] == "check1") {
                      this.healthForm.customSports = "是";
                    } else {
                      var inputText = [];
                      for (var i = 0; i < diseaseList.length; i++) {
                        inputText.push(this.customSportsFilter(diseaseList[i]));
                      }
                      var inputContent = inputText.join("").replace(/,$/g, "").replace(/、$/g, "");
                      var yd10Info = iJdata.yd10 == "" ? "" : "（ 其他 ：" + iJdata.yd10 + "）";
                      this.healthForm.customSports = inputContent + yd10Info;
                    }
                  }
                  //摄入过多油脂？
                  if (j == "toofull") {
                    let diseaseList = iJdata.toofull;
                    if (diseaseList == "") this.healthForm.toofull = "--";
                    if (diseaseList == "check0") this.healthForm.toofull = "否";
                    if (diseaseList == "check1") this.healthForm.toofull = "是";
                  }
                  //是否长期精神紧张
                  if (j == "tooOil") {
                    let diseaseList = iJdata.tooOil;
                    if (diseaseList == "") this.healthForm.tooOil = "--";
                    if (diseaseList == "check0") this.healthForm.tooOil = "否";
                    if (diseaseList == "check1") this.healthForm.tooOil = "是";
                  }
                  //体力劳动情况？
                  if (j == "checkup") {
                    let diseaseList = iJdata.checkup;
                    if (diseaseList == "") this.healthForm.checkup = "--";
                    if (diseaseList == "check0") this.healthForm.checkup = "缺乏";
                    if (diseaseList == "check1") this.healthForm.checkup = "一般";
                    if (diseaseList == "check2") this.healthForm.checkup = "经常";
                  }
                }
              }
            }
          };

        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
     //（既往病史、家族史）过滤器
     diseaseFilter(v) {
        var arr = {
           check0: "无",
           jb1: "高血压、",
           jb2: "冠心病、",
           jb3: "糖尿病、",
           jb4: "高血脂、",
           jb5: "脑梗死/脑卒中、",
           jb6: "脑出血、",
           jb7: "肝病、",
           jb8: "结核、",
           jb9: "肿瘤、",
           jb10: "手术、",
           jb11: "外伤、",
           jb12: "脂肪肝、",
           jb15: "消化道溃疡高、",
           jb16: "尿酸、",
           jb17: "痛风、",
           jb18: "肥胖症、",
           jb19: "动脉粥样硬化、",
           jb20: "肾脏病、",
           jb21: "骨关节炎、",
           jb22: "骨质疏松、",
           jb23: "外周血管疾病、",
           jb24: "巨大儿生产史、",
           jb25: "多囊卵巢综合征、",
           jb26: "癌症、",
           jb27: "血液病、",
           jb28: "其他、"
        };
        return arr[v];
     },
     //过敏史
     allergyFilter(v) {
        var arr = {
           jb13: "药物过敏、",
           jb14: "食物过敏、"
        };
        return arr[v];
     },
     //吸烟过滤器
     smokeFilter(v) {
        var arr = {
           yd1: "<5根、",
           yd2: "5~10根、",
           yd3: "11~19根、",
           yd4: "≥20根、"
        };
        return arr[v];
     },
     //饮酒 过滤器
     drinkFilter(v) {
        var arr = {
           check1: "偶尔",
           check2: "经常",
           yd1: "<100g、",
           yd2: "100~200g、",
           yd3: "201~300g、",
           yd4: "301~400g、",
           yd5: ">400g、"
        };
        return arr[v];
     },
     //服药情况 过滤器
     takeMedicineFilter(v) {
        var arr = {
           check0: "无",
           jb1: "降压药、",
           jb2: "使血压升高的药物、",
           jb3: "降糖药、",
           jb4: "其他、"
        };
        return arr[v];
     },
     //运动方式 过滤器
     sportsLevelFilter(v) {
        var arr = {
           check0: "无",
           jb1: "诊断为心脏病、",
           jb2: "有过胸痛的感觉、",
           jb3: "因为头晕跌倒或晕厥、",
           jb4: "有其他原因限制运动、"
        };
        return arr[v];
     },
     //是否运动
     customSportsFilter(v) {
        const arr = {
           yd1: "散步、",
           yd2: "游泳、",
           yd3: "慢跑、",
           yd4: "广场舞、",
           yd5: "太极拳、",
           yd6: "羽毛球、",
           yd7: "乒乓球、",
           yd8: "踢毽子、",
           yd9: "其他"
        };
        return arr[v];
     },
     // 上传附件
     // handleUpload(file) {
     //   const files = file.map(item => ({
     //     name: item.name,
     //     url: item.url
     //   }));
     //   this.form.businessLicense = JSON.stringify(files);
     //   this.fileList = files;
     // },
  }
};
</script>

<style lang="scss" scoped>
.work-preview {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  &-left,
  &-right {
    flex: 1;
  }
}
.commentList {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e3e3e3;
  .perImg {
    display: flex;
    justify-content: flex-start;
    width: 40px;
    height: 40px;
    background: url(../../../../assets/logo.png) no-repeat top center;
    background-size: cover;
    border-radius: 50%;
  }
  .perSpeech {
    margin-left: 5px;
    flex: 1;
    .perName {
      display: flex;
      height: 30px;
      line-height: 30px;
      .doctorName {
        font-size: 16px;
      }
      .doctorJob {
        margin-left: 10px;
        font-size: 12px;
        color: #b1b1b1;
      }
    }
    .speechTime {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #b1b1b1;
      span {
        &:nth-child(2) {
          margin-left: 10px;
        }
        &:nth-child(3) {
          margin-left: 10px;
        }
      }
    }
    .speechCon {
      margin-top: 10px;
      font-size: 14px;
      p {
        span {
          margin-right: 10px;
        }
      }
    }
    .deleteFu{
      margin-top: 10px;
    }
  }
}
.orderFujin {
  margin: 0;
  .nameOrder {
    margin-right: 20px;
  }
  &:not(:first-child) {
    margin-top: 10px;
  }
}
</style>
