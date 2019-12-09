<!--
* author: huoxibin
* created: 2019/7/15
* describe: v2.0医生信息
-->
<template>
    <!-- 医生信息 -->
    <el-card class="work-order-card" shadow="hover">
        <div slot="header" class="clearfix">
            <span>医生信息</span>
        </div>
        <el-form
                ref="form"
                size="mini"
                class="form"
                :model="form"
                label-width="110px"
                label-suffix="："
        >
            <el-form-item label="哆咖医生号">
                <el-input v-model="form.doctorId" disabled maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="执业机构">
                <el-select v-model="form.hospitalId" :disabled="doctorIdNull" placeholder="请选择">
                    <el-option
                            v-for="item in hospitalList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执业科室">
                <div class="area" style="width: 100%;display: flex;">
                    <el-select v-model="form.departmentIdZero"
                               @change="departmentSel"
                               :disabled="doctorIdNull"
                               label="请选择">
                        <el-option
                                v-for="(item,index) in officeZero"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-select v-model="form.departmentId" :disabled="doctorIdNull" label="请选择">
                        <el-option v-for="(item,index) in office"
                                   :key="index"
                                   :label="item.twoLevel"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="职称类型">
                <el-select v-model="form.category"  :disabled="doctorIdNull" label="请选择" @change="selectChangeHandler">
                    <el-option v-for="(item,index) in occupationType"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职称">
                <el-select label="请选择" :disabled="doctorIdNull" v-model="form.titleId">
                    <el-option v-for="(item,index) in technicalTitle"
                               :key="index"
                               :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="注册时间">
                <el-input v-model="form.creatTime" disabled maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="医生会员等级">
                <el-input v-model="form.honourName" disabled maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="审核状态">
                <el-input v-model="form.checked" disabled maxlength="50">资质未提交</el-input>
            </el-form-item>
            <el-form-item label="已开通服务">
                <el-input v-model="form.serviceName" disabled maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="是否签约家庭">
                <el-input v-model="form.signFamily" disabled maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="已设置服务包">
                <el-input v-model="form.packageName" disabled maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="已加入家医团队">
                <el-input v-model="form.teamName" disabled maxlength="50"></el-input>
            </el-form-item>

        </el-form>
    </el-card>
</template>

<script>
   export default {
      name: "doctor",
      computed: {
         doctorId() {
            return this.form.doctorId;
         }
      },
      props: {
         phone: String,
         form: {
            type: Object,
            required: true
         }
      },
      data() {
         return {
            //执行机构
            hospitalList:[],
            //获取科室
            officeZero:[],
            office:[],
            //职称类型
            occupationType:[
               {value: '医生', label: '医生'},
               {value: '护士', label: '护士'},
               {value: '药师', label: '药师'},
               {value: '技师', label: '技师'}
            ],
            //职称
            technicalTitle:[],
            doctorIdNull:true
         }
      },
      watch: {
         phone(now) {

         },
         doctorId(now){
            if(now == '' || now == null){
               this.doctorIdNull = true;
            }else {
               this.doctorIdNull = false;
            }
         },
      },
      mounted() {
         this.queryListOfficeZero();//科室
      },
      methods: {
         //获取执业机构列表
         getTeacherArr (hospitalName,provinceId,cityId,areaId) {
            this.$get("/data/my", {
               pathL: "/doctor/areaHospital/hospitalList",
               pageNum:1,
               pageSize:1000,
               name: '',//医院名称
               provinceId:provinceId,//省id
               cityId:cityId,//市id
               countyId:areaId,//县id
               sort:'gbkName'
            }).then(res => {
               if(res.state === 0){
                  this.hospitalList=res.data.result;
               }else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            });
         },
         //获取一级科室列表
         queryListOfficeZero(){
            this.$get("/data/my", {
               pathL: "/doctor/departmentBase/departmentList"
            }).then(res => {
               if (res.state === 0) {
                  this.officeZero = res.data;
               } else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
         //一级科室被选中获取二级科室列表
         departmentSel(value){
            this.form.departmentId = '';
            this.$get("/data/my", {
               pathL: "/doctor/department/getDepartmentListByOne",
               baseId : value
            }).then(res => {
               if (res.state === 0) {
                  this.office = res.data;
               } else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            });
         },
         //职业类型下拉菜单里面值被选中
         selectChangeHandler(value){
            this.form.titleId = '';
            this.$get("/data/my", {
               pathL: "/doctor/medical/getTitleByCategory",
               category:value
            }).then(res => {
               if (res.state === 0) {
                  this.technicalTitle = res.data
               } else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            })
         },
      },
   }
</script>


<style lang="scss" scoped>
    .form {
        display: flex;
        flex-flow: wrap;
        & > div {
            width: 100%;
        }
    }
</style>
