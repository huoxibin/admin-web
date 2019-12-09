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
        v-if="
          ($route.query.type == 'afterSale' && $route.query.markId == 110) ||
            ($route.query.type == 'health' && $route.query.markId == 110)
        "
        type="primary"
        @click="saveOne"
        >保 存</el-button>
      <el-button
        v-if="$route.query.type == 'clue' && $route.query.markId == 110"
        type="primary"
        @click="saveTwo"
        >保 存</el-button>
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
  components: { client, clue, order, health, history ,doctor },
  data() {
    return {
      type: this.$route.query.type,
      phone: null,
      customerId: null,//用来区分新老用户
      loading: false,
      isFirst: false,
      doctorLoading:false,
       doctorShow:false,
      //客户信息
      clientForm: {
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
        workOrderType: "",
        workOrderTitle: "",
        workOrderLevel: "",
        workTime:'',
        deptNo: "",
        receiverNo: "",
        problemDescription: "",
        accessory: ""
      }
    };
  },
  mounted() {
    const type = this.$route.query.id; //工单号
    if (type !== undefined) {
      this.editCustomerInformation(type);
    };
  },
  watch: {
    phone(now) {
       this.getDoctorMsg(now);//根据手机号--获取医生信息(只有---售后工单有)
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
    //客户信息---监听电话
    handlePhone(phone) {
      this.phone = phone;
    },
    //客户资料--监听电话
    handlePhoneClue(phone) {
      this.phone = phone;
    },
    //点击编辑客户---跳转到编辑页面，获取客户信息
    editCustomerInformation(id) {
      const orderType = this.$route.query.type == "afterSale" ? "1" : this.$route.query.type == "health" ? "2" : "3";
      const data = {
        pathL: "/customer/workOrder/getWorkOrder",
        id: id,
        orderType: orderType
      };
      if (orderType == 3) {
        //线索工单
        this.$get("/data/my", data).then(res => {
          if (res.state === 0) {
            this.clueForm = res.data;//客户资料
            this.orderForm = res.data; //工单记录资料
            let workOrderLevel = res.data.workOrderLevel;//工单记录资料--工单等级
            if(workOrderLevel == 1){
              this.orderForm.workTime = '24小时';
            }else if(workOrderLevel == 2){
              this.orderForm.workTime = '12小时';
            }else if(workOrderLevel ==3){
              this.orderForm.workTime = '8小时';
            };
            const handleOrderArea = this.$refs.order.handleDepartmentChange;//工单记录得handleDepartmentChange事件
            handleOrderArea(this.orderForm.deptNo);
            const handleArea = this.$refs.clue.handleArea;//客户资料中的事件---所属省市
            handleArea(this.clueForm.province);
             if(res.data.province == 0){//处理（所属省市）返回默认值为0
                this.clueForm.province = '';
                this.clueForm.city = '';
             }else if(res.data.city == 0){
                this.clueForm.city = '';
             }
            const handleAreas = this.$refs.clue.handleAreas;//客户资料中的事件---申请区域
            handleAreas(this.clueForm.provinceId);
            const handleCitys = this.$refs.clue.handleCitys;//客户资料中的事件---申请区域
            handleCitys(this.clueForm.cityId);
            if(res.data.provinceId == 0){//处理（申请区域）返回默认值为0
               this.clueForm.provinceId = '';
               this.clueForm.cityId = '';
               this.clueForm.countyId = '';
            }else if(res.data.cityId == 0){
               this.clueForm.cityId = '';
               this.clueForm.countyId = '';
            }else if(res.data.countyId == 0){
               this.clueForm.countyId = '';
            }
            if(res.data.customerType == 0){//处理（客户类型）返回默认值为0
               this.clueForm.customerType = '';
            }
            if(res.data.clueSource == 0){//处理（来源）返回默认值为0
               this.clueForm.clueSource = '';
            };
            if(res.data.accessory!==''){
               this.$refs.order.fileListAdd = JSON.parse(res.data.accessory);//拿到附件的内容
            };
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
            this.clientForm = res.data; //客户资料
            this.orderForm = res.data; //工单记录
            this.orderForm.workOrderNo = res.data.workOrderNo; //获取工单号
             let workOrderLevel = res.data.workOrderLevel;//工单等级
             if(workOrderLevel == 1){
                this.orderForm.workTime = '24小时';
             }else if(workOrderLevel == 2){
                this.orderForm.workTime = '12小时';
             }else if(workOrderLevel ==3){
                this.orderForm.workTime = '8小时';
             };
             const handleOrderArea = this.$refs.order.handleDepartmentChange;//工单记录得handleDepartmentChange事件
             handleOrderArea(this.orderForm.deptNo);
            this.clientForm.sex = (this.clientForm.sex == 0 ? "" :(this.clientForm.sex == 1 ? '男':'女') );
            this.clientForm.vip = this.clientForm.vip == 0 ? "" : this.clientForm.vip == 1 ?'非会员' : '会员';
            //一进入页面相当于点击省选中
            const handleArea = this.$refs.client.handleArea;
            handleArea(this.clientForm.provinceId);
             const citySel = this.$refs.client.citySel;//拿到组件里面的方法
             citySel(this.clientForm.cityId);
            if(res.data.provinceId == 0){//处理（所属省市）返回默认值为0
               this.clientForm.provinceId = '';
               this.clientForm.cityId = '';
               this.clientForm.areaId = '';
            }else if(res.data.cityId == 0){
               this.clientForm.cityId = '';
               this.clientForm.areaId = '';
            }else if(res.data.areaId == 0){
               this.clientForm.areaId = '';
            };
            if(res.data.packageType == 0){//处理（服务包）返回默认值为0
               this.clientForm.packageType ='';
            };
            if(res.data.accessory !==''){
               this.$refs.order.fileListAdd = JSON.parse(res.data.accessory);//拿到附件的内容
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

                       //客户信息中（所属省市县）--覆盖
                       // this.clientForm.provinceId = res.data.provinceId;
                       // this.clientForm.cityId = res.data.cityId;
                       // this.clientForm.areaId = res.data.areaId;
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
    //售后工单和健康工单---保存
    saveOne() {
       const orderType = this.$route.query.type == "afterSale" ? "1" : this.$route.query.type == "health" ? "2" : "3";
       if(orderType == 1 || orderType ==2){
          let formStatus = false;
          // 工单记录--表单验证
          let orderStatus = false;
          this.$refs.order.$refs.form.validate(valid => {
             orderStatus = valid;
          });
          //客户信息--表单验证
          let clientStatus = false;
          this.$refs.client.$refs.form.validate(valid => {
             clientStatus = valid;
          });
          //工单记录 + 客户信息 + 医生信息（售后工单才有）
          formStatus = orderStatus && clientStatus;
          if(formStatus){
             let data = {};
             const clientForm = {
                joinChannel:this.clientForm.joinChannel,
                accessChannel: this.clientForm.accessChannel,
                customerName: this.clientForm.customerName,
                sex: this.clientForm.sex == "" ? '' : this.clientForm.sex == '男' ? '1' :this.clientForm.sex =='女' ? '2' : this.clientForm.sex,
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
                vip: this.clientForm.vip == "" ? '' :  this.clientForm.vip == '非会员' ? '1' :  this.clientForm.vip == '会员'  ? '2' : this.clientForm.vip,
                familyNo: this.clientForm.familyNo,
                sn: this.clientForm.sn,
                expireDate: this.clientForm.expireDate
             };
             const doctorForm = {
                doctorId:this.doctorForm.doctorId,
                hospitalId:this.doctorForm.hospitalId,
                departmentIdZero:this.doctorForm.departmentIdZero,
                departmentId:this.doctorForm.departmentId,
                category:this.doctorForm.category,
                titleId:this.doctorForm.titleId
             };
             data = {
                pathL: "/customer/info/updateCustomerInfo",
                userId: this.$store.getters.userId,
                workOrderNo: this.orderForm.workOrderNo,
                ...clientForm,
                ...doctorForm,
                orderType:orderType
             };
             this.$post("/data/my", data).then(res => {
                if (res.state === 0) {
                   this.$message({
                      type: "success",
                      message: res.msg,
                      center: true
                   });
                   this.$router.go(-1);
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
    },
    //线索工单--保存
    saveTwo() {
       let formStatus = false;
       // 工单记录--表单验证
       let orderStatus = false;
       this.$refs.order.$refs.form.validate(valid => {
          orderStatus = valid;
       });
       //客户资料--表单验证
       let clueStatus = false;
       this.$refs.clue.$refs.form.validate(valid => {
          clueStatus = valid;
       });
       //工单记录 + 客户资料
       formStatus = orderStatus && clueStatus;
       if(formStatus){
          let data = {};
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
             pathL: "/customer/info/updateClueInfo",
             userId: this.$store.getters.userId,
             workOrderNo: this.orderForm.workOrderNo,
             ...clueForm
          };
          this.$post("/data/my", data).then(res => {
             if (res.state === 0) {
                this.$message({
                   type: "success",
                   message: res.msg,
                   center: true
                });
                this.$router.go(-1);
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
