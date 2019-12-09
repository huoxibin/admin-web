<template>
    <div class="work-order-edit">
        <!--客户信息-->
        <client
                v-if="type !== 'clue'"
                :form="clientForm"
                ref="client"
                v-loading="loading"
                @handlePhone="handlePhone"
        />
        <!--客户资料-->
        <clue
                v-else
                :form="clueForm"
                ref="clue"
                v-loading="loading"
                @handlePhoneClue="handlePhoneClue"
        />
        <!--医生信息-->
        <doctor v-loading="doctorLoading" ref="doctor" :form="doctorForm" v-show="doctorShow" :phone="phone"/>
        <!--健康信息-->
        <health :phone="phone" v-if="type === 'health'" />
        <!--工单记录-->
        <order :form="orderForm" ref="order" />
        <!--历史工单-->
        <history :phone="phone" />
        <!--按钮-->
        <div class="btns">
            <el-button
                    v-if="$route.query.id == undefined"
                    type="primary"
                    @click="submit(1, '派/转单')"
            >派/转 单</el-button>
            <el-button
                    v-if="$route.query.id == undefined"
                    type="primary"
                    @click="submit(2, '结单')"
            >结 单</el-button>
            <el-button @click="$router.back()">取 消</el-button>
        </div>
    </div>
</template>

<script>
   import client from "./components/client";
   import clue from "./components/clue";
   import doctor from "./components/doctor";
   import health from "./components/health";
   import order from "./components/order";
   import history from "./components/history";
   export default {
      name: "WorkOrder",
      components: { client, clue, order, health, history, doctor },
      data() {
         return {
            type: this.$route.query.type,
            phone: null,
            customerId: null,//用来区分新老用户
            loading: false,
            doctorLoading:false,
            isFirst: false,
            doctorShow:false,
            //客户信息
            clientForm: {
               joinChannel:'',//接入渠道
               accessChannel: "",
               customerName: "",
               sex: "",
               phone: "",
               provinceId: "",
               cityId: "",
               areaId:"",
               detailedAddress: "",
               wechat: "",
               email: "",
               otherPhone: "",
               buyChannel: "",
               orderNo: "",
               buyTime: "",
               productName: "",
               packageType: "",
               vip: "",
               familyNo: "",
               sn: "",
               expireDate: ""
            },
            //客户资料
            clueForm: {
               joinChannel:'',//接入渠道
               accessChannel: "",
               companyName: "",
               contactNameOne: "",
               contactTelOne: "",
               contactNameTwo: "",
               contactTelTwo: "",
               contactNameThree: "",
               contactTelThree: "",
               province: "",
               city: "",
               provinceId: "",
               cityId: "",
               countyId: "",
               customerType: "",
               clueSource: "",
               rest: "",
               remark: ""
            },
            //医生信息
            doctorForm:{
               doctorId:'',
               hospitalId:'',
               departmentIdZero:'',
               departmentId:'',
               category:'',
               createTime:'',
               honourName:'',
               checked:'',
               joinChannel:'',
               signFamily:'',
               packageName:'',
               teamName:''
            },
            //工单记录
            orderForm: {
               workOrderNo: "",
               consultType:"",
               workOrderType: "",
               workOrderTitle: "",
               workOrderLevel: "",
               workTime:'',
               deptNo: "",
               receiverNo: "",
               problemDescription: "",
               accessory: "",
               typeConsultation:''//咨询类型
            }
         };
      },
      mounted() {
         this.getPath();
      },
      watch: {
         phone(now) {
            this.getUserInfo(now);
            setTimeout(()=>{
               this.getDoctorMsg(now);
            },1000);
         },
         //监听客户信息里面--所属省市县变动
         'clientForm.provinceId':{
            handler(newValue, oldValue) {
               // this.doctorForm.hospitalId = '';
               const getTeacherArr = this.$refs.doctor.getTeacherArr;//拿到组件(执业机构)方法
               getTeacherArr('',this.clientForm.provinceId,this.clientForm.cityId,this.clientForm.areaId);
            },
            deep:true
         },
         'clientForm.cityId':{
            handler(newValue, oldValue) {
               // this.doctorForm.hospitalId = '';
               const getTeacherArr = this.$refs.doctor.getTeacherArr;//拿到组件(执业机构)方法
               getTeacherArr('',this.clientForm.provinceId,this.clientForm.cityId,this.clientForm.areaId);
            },
            deep:true
         },
         'clientForm.areaId':{
            handler(newValue, oldValue) {
               // this.doctorForm.hospitalId = '';
               const getTeacherArr = this.$refs.doctor.getTeacherArr;//拿到组件(执业机构)方法
               getTeacherArr('',this.clientForm.provinceId,this.clientForm.cityId,this.clientForm.areaId);
            },
            deep:true
         }
      },
      methods: {
         //拿到从智齿客服平台传来的链接地址
         getParams() {
            var url = String(window.location.href);
            if (url.indexOf('?') > 0) {
               return url.substring(url.indexOf("?") - 0 + 1);
            }
            return "";
         },
         //从智齿哪里便利地址栏参数
         getRequestParam(key) {
            var params = this.getParams();
            if (params && params != null) {
               var args = params.split("&");
               for (var i = 0; i < args.length; i++) {
                  var param = args[i].split("=");
                  if (param[0] == key) {
                     return param[1];
                  }
               }
               return "";
            }
         },
         //拿到从智齿传来的手机号
         getPath(){
            this.phone = this.getRequestParam('uphone');
            //目前从智齿打电话过来获取不到（接入渠道)所以为空
            this.clientForm.joinChannel = "";
            this.clueForm.joinChannel = "";
         },
         //客户信息---监听电话
         handlePhone(phone) {
            this.phone = phone;
         },
         //客户资料--监听电话
         handlePhoneClue(phone) {
            this.phone = phone;
         },
         // 派/转 单、结单按钮
         submit(status, text) {
            // 表单状态 ----------------------------------------------
            let formStatus = false;
            // 工单记录
            let orderStatus = false;
            this.$refs.order.$refs.form.validate(valid => {
               orderStatus = valid;
            });
            if (this.type === "clue") {
               // 客户资料 - 线索
               let clueStatus = false;
               this.$refs.clue.$refs.form.validate(valid => {
                  clueStatus = valid;
               });
               formStatus = orderStatus && clueStatus;
            } else {
               // 客户信息 - 非线索
               let clientStatus = false;
               this.$refs.client.$refs.form.validate(valid => {
                  clientStatus = valid;
               });
               formStatus = orderStatus && clientStatus;
            }
            // ---------------------------------------------- 表单状态
            if (formStatus) {
               let data = {};
               const orderType = this.$route.query.type; //afterSale、health、clue
               const typeList = { afterSale: 1, health: 2, clue: 3 };
               const orderForm = {
                  //工单记录表单
                  workOrderNo: this.orderForm.workOrderNo, //工单号
                  consultType:this.orderForm.consultType,//咨询类型
                  workOrderType: this.orderForm.workOrderType, //工单类型
                  workOrderTitle: this.orderForm.workOrderTitle, //工单标题
                  workOrderLevel: this.orderForm.workOrderLevel, //工单等级
                  deptNo: this.orderForm.deptNo, //处理部门
                  receiverNo: this.orderForm.receiverNo, //受理人
                  problemDescription: this.orderForm.problemDescription, //问题描述
                  accessory: this.orderForm.accessory //附件
               };
               if (this.type === "clue") {
                  //线索工单
                  const clueForm = {
                     //线索工单---客户资料表单
                     joinChannel:this.clueForm.joinChannel,
                     accessChannel: this.clueForm.accessChannel,
                     companyName: this.clueForm.companyName,
                     contactNameOne: this.clueForm.contactNameOne,
                     contactTelOne: this.clueForm.contactTelOne,
                     contactNameTwo: this.clueForm.contactNameTwo,
                     contactTelTwo: this.clueForm.contactTelTwo,
                     contactNameThree: this.clueForm.contactNameThree,
                     contactTelThree: this.clueForm.contactTelThree,
                     province: this.clueForm.province,
                     city: this.clueForm.city,
                     provinceId: this.clueForm.provinceId,
                     cityId: this.clueForm.cityId,
                     countyId: this.clueForm.countyId,
                     customerType: this.clueForm.customerType == '' ? '' : this.clueForm.customerType == '大客户'  ? '1' :  this.clueForm.customerType == '合伙人'  ? '2' :  this.clueForm.customerType == '经销商'  ? '3' : this.clueForm.customerType,
                     clueSource: this.clueForm.clueSource == '' ? '' : this.clueForm.clueSource == '展会' ? '2' : this.clueForm.clueSource == '朋友介绍' ? '7' : this.clueForm.clueSource == '活动/会议' ? '8' : this.clueForm.clueSource == '自己开发' ? '9' : this.clueForm.clueSource == '其他' ? '10' : this.clueForm.clueSource,
                     rest: this.clueForm.rest,
                     remark: this.clueForm.remark
                  };
                  data = {
                     pathL: "/customer/clueWorkOrder/saveClueWordOrder",
                     status,
                     ...orderForm, //工单记录表单
                     ...clueForm, //客户资料表单
                     customerId:this.customerId || ''//用来区分新老用户
                  };
               } else {
                  const clientForm = {
                     //售后工单、健康工单----客户信息表单
                     joinChannel:this.clientForm.joinChannel,
                     accessChannel: this.clientForm.accessChannel,
                     customerName: this.clientForm.customerName,
                     sex: this.clientForm.sex == '女' ? 2 : this.clientForm.sex == '男' ? '1' : this.clientForm.sex == '' ? '' :this.clientForm.sex,
                     phone: this.clientForm.phone,
                     provinceId: this.clientForm.provinceId,
                     cityId: this.clientForm.cityId,
                     areaId: this.clientForm.areaId,
                     detailedAddress: this.clientForm.detailedAddress,
                     wechat: this.clientForm.wechat,
                     email: this.clientForm.email,
                     otherPhone: this.clientForm.otherPhone,
                     buyChannel: this.clientForm.buyChannel,
                     orderNo: this.clientForm.orderNo,
                     buyTime: this.clientForm.buyTime,
                     productName: this.clientForm.productName,
                     packageType: this.clientForm.packageType,
                     vip: this.clientForm.vip == '非会员' ? 1 :this.clientForm.vip == '会员' ? 2 : this.clientForm.vip == '' ? '' :this.clientForm.vip,
                     familyNo: this.clientForm.familyNo,
                     sn: this.clientForm.sn,
                     expireDate: this.clientForm.expireDate,
                     //售后工单---医生信息
                     doctorId:this.doctorForm.doctorId,
                     hospitalId:this.doctorForm.hospitalId,
                     departmentIdZero:this.doctorForm.departmentIdZero,
                     departmentId:this.doctorForm.departmentId,
                     category:this.doctorForm.category,
                     titleId:this.doctorForm.titleId
                  };
                  data = {
                     pathL: "/customer/workOrder/saveWorkOrder",
                     status,
                     orderType: typeList[orderType],
                     ...clientForm, //客户信息表单
                     ...orderForm, //工单记录表单
                     customerId:this.customerId || ''//用来区分新老用户
                  };
               };
               //--customerId不清楚这到底是干什么得
               // if (!this.isFirst) {
               //   data.customerId = this.customerId;
               // };
               this.$post("/data/my", data).then(res => {
                  if (res.state === 0) {
                     this.$message({
                        type: "success",
                        message: `${text}成功！`,
                        center: true
                     });
                     this.$router.push("/work/order/list");
                  } else {
                     this.$message({
                        type: "warning",
                        message: res.msg,
                        center: true
                     });
                  }
               });
            } else {
               this.$message({
                  message: "请正确填写表单",
                  center: true,
                  type: "warning"
               });
            }
         },

         // 根据手机号--获取客户信息
         getUserInfo(now) {
            const type = this.$route.query.type; //afterSale、health、clue
            const phone = now;
            this.loading = true;
            let pathL = "";
            if (type === "clue") {
               pathL = "/customer/clueInfo/getClueInfoByPhone";
            } else {
               pathL = "/customer/info/getCustomerByPhone";
            };
            for(let i in this.clientForm){
               this.clientForm[i] = '';
            };
            for(let i in this.clueForm){
               this.clueForm[i] = '';
            };
            this.$get("/data/my", { pathL, phone }).then(res => {
               this.loading = false;
               if (res.state === 0) {
                  if (res.data && JSON.stringify(res.data) !== '[]') {
                     if (type === "clue") {//线索
                        this.clueForm = res.data;
                        this.customerId = res.data.id;
                        this.clueForm.customerType = this.clueForm.customerType == 0 ? '' : this.clueForm.customerType == 1 ? '大客户' : this.clueForm.customerType == 2 ? '合伙人' : '经销商';
                        this.clueForm.clueSource = this.clueForm.clueSource == 0 ? '' : this.clueForm.clueSource == 2 ? '展会' :  this.clueForm.clueSource == 7 ? '朋友介绍' : this.clueForm.clueSource == 8 ? '活动/会议' :this.clueForm.clueSource == 9 ? '自己开发' : '其他';
                        this.clueForm.province = this.clueForm.province == 0 ?'' : this.clueForm.province;//所属省市--省
                        this.clueForm.city = this.clueForm.city == 0 ? '' : this.clueForm.city;
                        this.clueForm.provinceId = this.clueForm.provinceId == 0 ? '' :this.clueForm.provinceId;
                        this.clueForm.cityId = this.clueForm.cityId == 0 ? '' : this.clueForm.cityId;
                        this.clueForm.countyId = this.clueForm.countyId == 0 ? '' : this.clueForm.countyId;
                        const handleArea = this.$refs.clue.handleArea;
                        handleArea(this.clueForm.province);
                        const handleAreas = this.$refs.clue.handleAreas;
                        handleAreas(this.clueForm.provinceId);
                        const handleCitys = this.$refs.clue.handleCitys;
                        handleCitys(this.clueForm.cityId);
                     } else {//健康、售后
                        this.customerId = res.data.id;
                        this.clientForm = res.data;//拿到之前保存过的信息--并回显
                        this.clientForm.sex = this.clientForm.sex == 0 ? "" : this.clientForm.sex == 1 ?'男':'女';//特殊处理--性别
                        this.clientForm.vip = this.clientForm.vip == 0 ? "" : this.clientForm.vip == 1 ? '非会员' :'会员';//特殊处理--会员
                        this.clientForm.packageType = this.clientForm.packageType == 0 ? '' :this.clientForm.packageType;//服务包
                        //所属省市县
                        const handleArea = this.$refs.client.handleArea;
                        handleArea(this.clientForm.provinceId);//调用组件里面的方法
                        const citySel = this.$refs.client.citySel;//拿到组件里面的方法
                        citySel(this.clientForm.cityId);
                        if(this.clientForm.provinceId == 0){
                           this.clientForm.provinceId = '';
                           this.clientForm.cityId = '';
                           this.clientForm.areaId = '';
                        }else if(this.clientForm.cityId == 0){
                           this.clientForm.cityId = '';
                           this.clientForm.areaId = '';
                        }else if(this.clientForm.areaId  == 0){
                           this.clientForm.areaId = '';
                        }
                     }
                  } else {
                     this.isFirst = true;
                     if (type === "clue") {//线索
                        this.clueForm.contactTelOne = phone;
                     } else {//健康、售后
                        this.clientForm.phone = phone;
                     }
                  }
               } else {
                  this.$message({
                     message: res.msg,
                     center: true,
                     type: "warning"
                  });
               }
            });
         },
         // 根据手机号--获取医生信息(只有---售后工单有)
         getDoctorMsg(phone){
            const type = this.$route.query.type; //afterSale、health、clue
            if (type === "afterSale") {
               if(phone !== ''){
                  this.doctorLoading = true;
                  this.doctorShow = false;
                  for(let i in this.doctorForm){
                     this.doctorForm[i] = '';
                  };
                  this.$get("/data/my", {
                     pathL: "/doctor/doctorInfo/getDoctorInfoByMobile",
                     mobile:phone
                  }).then(res => {
                     this.doctorLoading = false;
                     if (res.state === 0) {
                        if(res.data && JSON.stringify(res.data) !== '[]'){
                           this.doctorShow = true;
                           this.doctorForm = res.data;

                           //客户信息中（客户姓名）--覆盖
                           if(res.data.doctorName !=='' && res.data.doctorName !== null){
                              this.clientForm.customerName = res.data.doctorName;
                           };

                           //客户信息中（所属省市县）--覆盖
                           this.clientForm.provinceId = res.data.provinceId;
                           const handleArea = this.$refs.client.handleArea;
                           handleArea(this.clientForm.provinceId);//调用组件里面的方法
                           this.clientForm.cityId = res.data.cityId;
                           const citySel = this.$refs.client.citySel;//拿到组件里面的方法
                           citySel(this.clientForm.cityId);
                           this.clientForm.areaId = res.data.areaId;

                           // const handleArea = this.$refs.client.handleArea;
                           // handleArea(res.data.provinceId);//调用组件里面的方法
                           // const citySel = this.$refs.client.citySel;//拿到组件里面的方法
                           // citySel(res.data.cityId);
                           // if(res.data.provinceId == 0){
                           //    this.clientForm.provinceId = '';
                           //    this.clientForm.cityId = '';
                           //    this.clientForm.areaId = '';
                           // }else if(res.data.cityId == 0){
                           //    this.clientForm.cityId = '';
                           //    this.clientForm.areaId = '';
                           // }else if(res.data.areaId  == 0){
                           //    this.clientForm.areaId = '';
                           // };


                           let checked = this.doctorForm.checked;
                           switch (checked){
                              case 0:
                                 this.doctorForm.checked = '资质未提交';
                                 break;
                              case 1:
                                 this.doctorForm.checked = '资质待认证';
                                 break;
                              case 2:
                                 this.doctorForm.checked = '资质已认证';
                                 break;
                              case -1:
                                 this.doctorForm.checked = '资质认证失败';
                                 break;
                           } ;
                           const getTeacherArr = this.$refs.doctor.getTeacherArr;//拿到组件(执业机构)方法
                           getTeacherArr(this.doctorForm.hospitalName,this.doctorForm.provinceId,this.doctorForm.cityId,this.doctorForm.areaId);
                           const departmentSel =  this.$refs.doctor.departmentSel;//拿到组件(执业科室)方法
                           departmentSel(this.doctorForm.departmentIdZero);
                           const selectChangeHandler = this.$refs.doctor.selectChangeHandler;//拿到组件(职称)方法
                           selectChangeHandler(this.doctorForm.category);
                        }else {
                          console.log('null');
                        }
                     } else {
                        this.$message({
                           message: res.msg,
                           center: true
                        });
                     }
                  });
               }
            };
         },

      }
   };
</script>

<style lang="scss" scoped>
    .work-order-edit {
        width: 100%;
        height: 100%;
        .work-order-card {
            margin: 10px;
        }
        .btns {
            margin: 20px;
        }
    }
</style>
