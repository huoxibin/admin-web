<template>
  <div class="client-edit">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <!--基本信息-->
      <basis ref="basis" :form="form"/>
      <!--详细信息-->
      <detailed :form="form"/>
      <!--附件-->
      <annex ref="annex" :form="form"/>
      <!--实地考察结果-->
      <inspection :form="form"/>
      <!--按钮-->
      <div class="btns">
        <el-button type="primary" size="mini"  :disabled="disableBtn" v-if="type !== 'detail'" @click="submitSave">保存并提交审核</el-button>
        <el-button type="primary" size="mini" v-if="type !== 'detail'" @click="submit">临时保存</el-button>
        <el-button size="mini"  @click="$router.push('/custorm/intention/list')">返 回</el-button>
      </div>
    </el-form>
    <approvalWork
            :data="workData"
            @closeDialog="closeWorkConfigDialog"
            :dialogShow="workConfig.visible"
            :workConfig="workConfig"
            @cancelDialog="cancelWorkConfig"
    ></approvalWork>
  </div>
</template>

<script>
import { isValidPhone , isValidEmali } from "@/utils/RegExp.js"
import basis from "./modules/basis";
import detailed from "./modules/detailed";
import annex from "./modules/annex";
import inspection from "./modules/inspection";
import approvalWork from "@/components/common/approvalWork";
export default {
  name: "ClientEdit",
  components: { basis, detailed, annex, inspection, approvalWork},
  data() {
    //邮箱验证
    let checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (!isValidEmali(value)) {
        this.$message("邮箱格式不正确");
      } else {
        callback();
      }
    }
    //联系人1的联系方式
    let checkContactTelOne = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话号码不能为空"))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"))
        } else {
          if (isValidPhone(value)) {
            callback()
          } else {
            callback(new Error("电话号码格式不正确"))
          }
        }
      }, 100)
    }
    return {
      workConfig: {
        visible: false,
        width: "500px",
        title: "审批"
      },
      workData: {
        auditNum: '',
        businessType: 0,
        url: '',
        fileName: '',
        id:''
      },
      type: this.$route.params.type,
      form: {
        customerNo: "",
        clueNo: "",
        companyName: "",
        provinceId: "",
        cityId: "",
        countyId: "",
        provinceName: "",
        region: "",
        contactNameOne: "",
        applicationType: "",
        contactTelOne: "",
        customerType: "",
        contactNameTwo: "",
        clueSource: "",
        rest: "",
        contactTelTwo: "",
        remark: "",
        contactNameThree: "",
        contactTelThree: "",
        deptNo: "",
        principal: "",
        // ----
        companyNature: "",
        companyAbbrev: "",
        email: "",
        opcode: "",
        ownerCode: "",
        bankAccount: "",
        bankDeposit: "",
        shipAddress: "",
        commAddress: "",
        gspControls: "",
        postalCode: "",
        regtime: "",
        companyLegal: "",
        workingCapital: "",
        registeredCapital: "",
        companyHeadcount: "",//公司总人数
        annualSales: "",
        salesmenCount: "",//业务人员数
        techniciansCount: "",//技术人员数
        consignee: "",
        consigneeTel: "",
        technicalCapacity: [],
        professionalProficiency: [],
        socialResources: "",
        restsProduct: "",
        businessLicense: "",
        corporateIdentityCard: "",
        businessCertificate: "",
        bankReferenceLetter: "",
        joinApplication: "",
        businessPlan: "",
        businessEnvironment: "",
        serviceAbility: "",
        distributionCapacity: "",
        socialRelations: ""
      },
      rules: {
        contactNameOne: {
          required: true,
          message: "请输入联系人1",
          trigger: "blur"
        },
        contactTelOne: {
          required: true,
          validator: checkContactTelOne, 
          trigger: "blur"
        },
        clueSource: {
          required: true,
          message: "请选择来源",
          trigger: "blur"
        },
        principal: {
          required: true,
          message: "请选择负责人",
          trigger: "blur"
        },
        email: {
          required: false, 
          validator: checkEmail, 
          trigger: "blur" 
        },
      },
      disableBtn:true,
    };
  },
  mounted() {
		if(this.$route.query.access!==undefined){
			this.resiteHeaderClass();  //重置跨平台跳转顶部的平台菜单没有置active
		}
    this.getInfo();
  },
  methods: {
  	resiteHeaderClass(){ //重置跨平台跳转顶部的平台菜单没有置active
			let abtn=document.getElementsByClassName('header-left');
			if(abtn){
				let childBtn=abtn[0].children;
				for(let i=0;i<childBtn.length;i++){
					if(childBtn[i].outerText=='基础平台'){
						childBtn[i].className+=' active';
					}else{
						let nameStr=childBtn[i].className;
						if(nameStr.includes('active')){
							nameStr=nameStr.replace(/active/,' ');
							childBtn[i].className=nameStr;
						}
					}
				}
			}
    },
    closeWorkConfigDialog(data, user, send) { //获取审批值
      let sendIds = "";
      let userIds = "";
      user.forEach(item => {
        userIds += item.id + ",";
      });
      userIds = userIds.substr(0, userIds.length - 1);

      send.forEach(item => {
        sendIds += item.id + ",";
      })
      sendIds = sendIds.substr(0, sendIds.length - 1);
      let that = this;

      this.workConfig.visible = false;
      this.$post('/data/my', {
        pathL: '/common/audit/add',
        businessType: this.workData.type,
        businessId: this.workData.id,
        userIds: userIds,
        sendIds: sendIds,
        auditName: data.auditName,
        auditContent: data.auditContent
      }).then(res => {
        if (res.state == 0) {
          // debugger
          that.$post('/data/my',{
            pathL:'/common/customerInfo/updateProcessStatusById',
            id:that.form.id
          }).then(res=>{
            if(res.state==0){
              that.$message("审批提交成功！");
              setTimeout(()=>{
                this.$router.push({
                  path: "/client/list"
                })
              },1000)
            }else{
              that.$message(res.message);
            }
          })

        }
      }).catch(err => {
        console.log(err);
      })
    },
    cancelWorkConfig() {
      this.workConfig.visible = false;
    },
    //设置三级联动的值
    dealData(data) {
      let reqCity = this.$refs.basis.$refs.reqCity;
      let stayCity = this.$refs.basis.$refs.stayCity;

      reqCity.getCityList(data.provinceId);
      reqCity.getAreaList(data.cityId);

      stayCity.getCityList(data.province);
      stayCity.getAreaList(data.city);

      if (!data.cityId) {
        data.cityId = "";
      }
      if (!data.provinceId) {
        data.provinceId = "";
      }
      if (!data.countyId) {
        data.countyId = "";
      }
      if (!data.province) {
        data.province = "";
      }
      if (!data.city) {
        data.city = "";
      }
      if (data.provinceId !== "") {
        this.$refs.basis.formReqCity.provinceId = parseInt(data.provinceId);
      }
      if (data.cityId !== "") {
        this.$refs.basis.formReqCity.cityId = parseInt(data.cityId);
      }
      if (data.countyId !== "") {
        this.$refs.basis.formReqCity.countyId = parseInt(data.countyId);
      }

      if (data.province !== "") {
        this.$refs.basis.formCity.provinceId = parseInt(data.province); //省名
      }
      if (data.city !== "") {
        this.$refs.basis.formCity.cityId = parseInt(data.city); //市名
      }
    },
    getReqData(){
      let reqCity = this.$refs.basis.formReqCity;//基本信息---申请城市
      let stayCity = this.$refs.basis.formCity;//基本信息---所在城市
      const form = this.form;
      const data = {
        pathL: "/common/customerInfo/saveCustomerInfo",
        customerNo: form.customerNo,
        clueNo: form.clueNo,
        companyName: form.companyName,

        provinceId: reqCity.provinceId,
        cityId: reqCity.cityId,
        countyId: reqCity.countyId,
        province: stayCity.provinceId,
        city: stayCity.cityId,

        //provinceName: form.provinceName, 申请城市
        region: form.region,
        contactNameOne: form.contactNameOne,
        applicationType: form.applicationType,
        contactTelOne: form.contactTelOne,
        customerType: form.customerType,
        contactNameTwo: form.contactNameTwo,
        clueSource: form.clueSource,
        rest: form.rest,
        contactTelTwo: form.contactTelTwo,
        remark: form.remark,
        contactNameThree: form.contactNameThree,
        contactTelThree: form.contactTelThree,
        deptNo: form.deptNo,
        principal: form.principal,
        // ----
        companyNature: form.companyNature,
        companyAbbrev: form.companyAbbrev,
        email: form.email,
        opcode: form.opcode,
        ownerCode: form.ownerCode,
        bankAccount: form.bankAccount,
        bankDeposit: form.bankDeposit,
        shipAddress: form.shipAddress,
        commAddress: form.commAddress,
        gspControls: form.gspControls,
        postalCode: form.postalCode,
        regtime: form.regtime,
        companyLegal: form.companyLegal,
        workingCapital: form.workingCapital,
        registeredCapital: form.registeredCapital,
        companyHeadcount: form.companyHeadcount,
        annualSales: form.annualSales,
        salesmenCount: form.salesmenCount,
        techniciansCount: form.techniciansCount,
        consignee: form.consignee,
        consigneeTel: form.consigneeTel,
        technicalCapacity: form.technicalCapacity.join("_"),
        professionalProficiency: form.professionalProficiency.join("_"),
        socialResources: form.socialResources,
        restsProduct: form.restsProduct,
        businessLicense: form.businessLicense,
        corporateIdentityCard: form.corporateIdentityCard,
        businessCertificate: form.businessCertificate,
        bankReferenceLetter: form.bankReferenceLetter,
        joinApplication: form.joinApplication,
        businessPlan: form.businessPlan,
        businessEnvironment: form.businessEnvironment,
        serviceAbility: form.serviceAbility,
        distributionCapacity: form.distributionCapacity,
        socialRelations: form.socialRelations
      };
      return data;
    },
    validateForm(){ // 校验前端表单数据
      if(isNaN(this.form.companyHeadcount)){
        this.form.companyHeadcount = '';
        this.$message({
          message: "（公司总人数）请输入纯数字",
          type: "warning",
          center: true
        });
        return false;
      };
      if(isNaN(this.form.salesmenCount)){
        this.form.salesmenCount = '';
        this.$message({
          message: "（业务人员数）请输入纯数字",
          type: "warning",
          center: true
        });
        return false;
      };
      if(isNaN(this.form.techniciansCount)){
        this.form.techniciansCount = '';
        this.$message({
          message: "（技术人员数）请输入纯数字",
          type: "warning",
          center: true
        });
        return false
      };
      return true;
    },
    // 临时保存按钮
    submit() {
      if(!this.validateForm()){
        return;
      }
      let that=this;
      this.$refs.form.validate(valid => {
        if (valid) {
          const data=this.getReqData();
          const type = this.$route.params.type;
          if (type !== "add") {
            data.pathL = "/common/customerInfo/updateCustomerInfo";
            data.id = this.form.id;
          }
          this.$post("/data/my", data).then(res => {
            if (res.state === 0) {
              this.$message({
                message: "编辑成功！",
                center: true,
                type: "success"
              });
              this.$router.push("/custorm/intention/list");
            } else {
              this.$message({
                message: res.msg,
                center: true,
                type: "warning"
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
      });
    },

    submitSave(){ // 保存并提交审核、
      if(!this.validateForm()){
        return;
      }
      let that=this;
      this.$refs.form.validate(valid => {
        if (valid) {
          const data=this.getReqData();
          const type = this.$route.params.type;

          if (type !== "add") {
            data.pathL = "/common/customerInfo/updateCustomerInfo";
            data.id = this.form.id;
          }

          let p1 = new Promise((resolve, reject) => {
            this.$get("/data/my",{
              pathL:'/marketing/records/query',
              customerId:this.$route.query.id
            }).then(res=>{
              if(res.state==0){
                resolve(res.data);
              }else{
                resolve([]);
              }
            }).catch(err=>{
              that.$message(err.msg);
            })
          })

          let p2 = new Promise((resolve, reject) => {
            this.$post("/data/my", data).then(res => {
              if (res.state === 0) {
                this.$message({
                  message: "编辑成功！",
                  center: true,
                  type: "success"
                });
                resolve(res.data);
              }else {
                this.$message({
                  message: res.msg,
                  center: true,
                  type: "warning"
                });
                that.workConfig.visible = true;
              }
          })
          });
          Promise.all([p1, p2]).then((result) => {
            //debugger
            if(result[0].length){
              that.siteWorkInfo(result[1]);
            }else{
							that.$alert('请添加一条跟进记录，才可提交审核', '提示', {
								confirmButtonText: '确定',
								callback: action => {
									  that.$router.push({
									    path:"/custorm/intention/list"
									  });
								}
							});
            }
          }).catch((error) => {
						that.$message({
							message: error,
							center: true,
							type: "warning"
						});
          })
        } else {
          this.$message({
            message: "请正确填写表单",
            center: true,
            type: "warning"
          });
        }
      });
    },
    siteWorkInfo(data){ // 赋值工作审批内容
      //debugger
      this.workData = {};
      this.workConfig.visible = true;
      this.form.id = data.id; // 根据id 判断是 新增还是更新
      this.workData.auditNo = data.auditNo; // 审批的编号
      if(data.bankReferenceLetter!==''){
        data.bankReferenceLetter=JSON.parse(data.bankReferenceLetter);
      }
      if(data.businessCertificate!==''){
        data.businessCertificate=JSON.parse(data.businessCertificate);
      }
      if(data.businessLicense!==''){
        data.businessLicense=JSON.parse(data.businessLicense);
      }
      if(data.businessPlan!==''){
        data.businessPlan=JSON.parse(data.businessPlan);
      }
      if(data.corporateIdentityCard!==''){
        data.corporateIdentityCard=JSON.parse(data.corporateIdentityCard);
      }

      if(data.joinApplication!==''){
        data.joinApplication=JSON.parse(data.joinApplication);
      }

      this.workData.file = [...data.bankReferenceLetter,...data.businessCertificate,...data.businessLicense,...data.businessPlan,...data.corporateIdentityCard,...data.joinApplication]; // 审批的编号

      this.workData.businessType = 2; // 审批的类型id，需要转换成文字

      this.workData.id = data.id;  // 校验的id ，如果新增的话需要回传回去
      this.workData.type = 2; // 保存的id

    },
    // 获取详细信息-----这是点击（客户编号）---进来时候的调取的接口
    getInfo() {
      const type = this.$route.params.type;
      let that = this;
      if (type !== "add") {
        this.$get("/data/my", {
          pathL: "/common/customerInfo/getCustomerInfo",
          id: this.$route.query.id
        }).then(res => {
          if (res.state === 0) {
            that.form = res.data;
            res.data.deptNo = res.data.deptNo === 0 ? "" : res.data.deptNo; //选择部门 返回值如果是 0 前台显示“请选择”
            res.data.principal = res.data.principal === 0 ? "" : res.data.principal; //选择负责人 返回值如果是 0 前台显示“请选择”
            res.data.customerType = res.data.customerType === 0 ? "" : res.data.customerType; //客户类型 返回值如果是 0 前台显示“请选择”
            that.form.companyNature = parseInt(that.form.companyNature); //企业性质
            
            if (type === "detail") {
              switch (this.form.companyNature) {
                case 1:
                  this.form.companyNature = "国企";
                  break;
                case 2:
                  this.form.companyNature = "国有控股";
                  break;
                case 3:
                  this.form.companyNature = "私企";
                  break;
                case 4:
                  this.form.companyNature = "其他";
                  break;
              }
            }

            if (type !== "detail") {
              that.dealData(that.form);
            }
            that.$refs.basis.handleDepartmentChange(that.form.deptNo);
            if(that.$route.query.markedId == 110){
              that.form.technicalCapacity = that.form.technicalCapacity.replace(/_/g,'、');
              that.form.professionalProficiency = that.form.professionalProficiency.replace(/_/g,'、');
            }else {
              that.form.technicalCapacity = that.form.technicalCapacity.split('_');
              that.form.professionalProficiency = that.form.professionalProficiency.split('_');
            }

            if(that.form.businessLicense!=''){
              that.$refs.annex.fileList1 = JSON.parse(that.form.businessLicense);
            }
            if(that.form.corporateIdentityCard!=''){
              that.$refs.annex.fileList2 = JSON.parse(that.form.corporateIdentityCard);
            }
            if(that.form.businessCertificate!=''){
              that.$refs.annex.fileList3 = JSON.parse(that.form.businessCertificate);
            }
            if(that.form.bankReferenceLetter!=''){
              that.$refs.annex.fileList4 = JSON.parse(that.form.bankReferenceLetter);
            }
            if(that.form.joinApplication!=""){
              that.$refs.annex.fileList5 = JSON.parse(that.form.joinApplication);
            }
            if(that.form.businessPlan!=''){
              that.$refs.annex.fileList6 = JSON.parse(that.form.businessPlan);
            }

          } else {
            that.$message({
              message: res.msg,
              center: true,
              type: "warning"
            });
          }
        });
        this.disableBtn=false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.client-edit {
  width: 100%;
  height: 100%;
  .box-card {
    margin: 20px;
    overflow:initial!important;
    max-height:initial;
    .base-info {
      display: flex;
    }
  }
  .btns {
    margin: 20px;
  }
}
</style>
