<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本信息</span>
      <div style="float:right">客户状态：<span>{{ form.status === 1 ? "意向客户" : form.status === 2 ? "正式客户": "关闭" }}</span></div>
    </div>
    <div class="form">
      <!-- ————客户编号———— -->
      <el-form-item label="客户编号">
        <span v-if="type === 'detail'">{{form.customerNo}}</span>
        <el-button v-else type="text">{{form.customerNo}}</el-button>
      </el-form-item>
      <!-- ————关联线索———— -->
      <el-form-item label="关联线索">
        <span :class="{activeClick: form.clueNo}" @click="goMarketing(form.clueNo)">{{form.clueNo ? form.clueNo : "--"}}</span>
      </el-form-item>
      <el-form-item label="公司名称">
        <span v-if="type === 'detail'">{{form.companyName}}</span>
        <el-input v-else v-model="form.companyName"></el-input>
      </el-form-item>

        <el-form-item label="所在城市">
          <span v-if="type === 'detail'">{{form.provName!==''?form.provName:''}}--{{form.cName!==''?form.cName:''}}</span>

          <base-local  v-else ref="stayCity" :form="formCity" :showCounty="false"></base-local>
        </el-form-item>
        <el-form-item label="申请城市">
          <span v-if="type === 'detail'"> {{form.provinceName!==''?form.provinceName:''}}{{form.cityName!==''?`-${form.cityName}`:''}}{{form.countyName!==''?`-${form.countyName}`:''}}  </span>

          <base-local v-else ref="reqCity" :form="formReqCity"></base-local>
        </el-form-item>

      <!-- ————所属大区———— -->
      <el-form-item label="所属大区">
        <span v-if="type === 'detail'">{{form.region}}</span>
        <el-input v-else v-model="form.region" disabled></el-input>
      </el-form-item>
      <el-form-item label="联系人1" prop="contactNameOne">
        <span v-if="type === 'detail'">{{form.contactNameOne}}</span>
        <el-input v-else v-model="form.contactNameOne"></el-input>
      </el-form-item>
      <!-- ————申请类别———— -->
      <el-form-item label="申请类别">
        <span v-if="type === 'detail'">{{form.applicationType}}</span>
        <el-input v-else v-model="form.applicationType" disabled></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactTelOne">
        <span v-if="type === 'detail'">{{form.contactTelOne}}</span>
        <el-input v-else v-model="form.contactTelOne"></el-input>
      </el-form-item>
      <el-form-item label="客户类型">
        <div v-if="type === 'detail'">
          <span v-if="form.customerType === 1">大客户</span>
          <span v-if="form.customerType === 2">合伙人</span>
          <span v-if="form.customerType === 3">经销商</span>
        </div>
        <el-select v-else v-model="form.customerType" placeholder="请选择" style="width: 100%">
          <el-option label="大客户" :value="1"></el-option>
          <el-option label="合伙人" :value="2"></el-option>
          <el-option label="经销商" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人2">
        <span v-if="type === 'detail'">{{form.contactNameTwo}}</span>
        <el-input v-else v-model="form.contactNameTwo"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="clueSource">
        <div v-if="type === 'detail'">
          <span v-if="form.clueSource === 2">展会</span>
          <span v-if="form.clueSource === 7">朋友介绍</span>
          <span v-if="form.clueSource === 8">活动/会议</span>
          <span v-if="form.clueSource === 9">自己开发</span>
          <span v-if="form.clueSource === 10">其他----</span>
          <span v-if="form.clueSource === 10">{{form.rest}}</span>
        </div>
        <div v-else-if="form.clueSource === 5" class="clue-source" style="display: flex;">
          <el-select v-model="form.clueSource" placeholder="请选择" disabled="disabled">
            <el-option label="400客服" :value="5"></el-option>
          </el-select>
          <el-input v-if="form.clueSource === 10" v-model="form.rest" maxlength="50"></el-input>
        </div>
        <div v-else class="clue-source" style="display: flex;">
          <el-select v-model="form.clueSource" placeholder="请选择">
            <el-option label="展会" :value="2"></el-option>
            <el-option label="朋友介绍" :value="7"></el-option>
            <el-option label="活动/会议" :value="8"></el-option>
            <el-option label="自己开发" :value="9"></el-option>
            <el-option label="其他" :value="10"></el-option>
          </el-select>
          <el-input v-if="form.clueSource === 10" v-model="form.rest" maxlength="50"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="联系方式">
        <span v-if="type === 'detail'">{{form.contactTelTwo}}</span>
        <el-input v-else v-model="form.contactTelTwo" @blur="regexpVal(form.contactTelTwo)"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <span v-if="type === 'detail'">{{form.remark}}</span>
        <el-input v-else type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="联系人3">
        <span v-if="type === 'detail'">{{form.contactNameThree}}</span>
        <el-input v-else v-model="form.contactNameThree"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <span v-if="type === 'detail'">{{form.contactTelThree}}</span>
        <el-input v-else v-model="form.contactTelThree" @blur="regexpVal(form.contactTelThree)"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="principal">
        <div v-if="type === 'detail'">
          <span>{{form.deptName}}----{{form.principalName}}</span>
        </div>
        <div v-else class="principal" style="display: flex;">
          <el-select v-model="form.deptNo" placeholder="请选择部门" @change="handleDepartmentChange">
            <el-option
              v-for="item in department"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="form.principal" placeholder="请选择负责人" @change="handleDepartmentChange">
            <el-option v-for="item in staff" :key="item.id" :label="item.userName" :value="item.id"></el-option>
          </el-select>
        </div>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Basis",
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type: this.$route.params.type,
      provinces: [],
      citys: [],
      county: [],
      department: [],
      staff: [],
      ////三级联动//////
      formCity: {
        provinceId: "",
        cityId: ""
      },
      formReqCity: {
        provinceId: "",
        cityId: "",
        countyId: ""
      },
      showProvince: true,
      showCity: true,
      showCounty: false,
    };
  },
  created() {
    this.getDepartment();
  },
  watch:{
    'formReqCity.provinceId'(){
      this.$get("/data/my",{
        pathL:'/common/mold/getRegionList',
        provinceId:this.formReqCity.provinceId
      }).then(res=>{
        if(!res.state){
          this.form.region=res.data[0];
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    'formReqCity.cityId'(){
      this.$get("/data/my",{
        pathL:'/common/mold/getCityByCityId',
        cityId:this.formReqCity.cityId
      }).then(res=>{
        if(!res.state){
          //debugger
          this.form.applicationType=res.data.type;
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  methods: {
    goMarketing (id) {
      this.$router.push({
        path: "/client/info",
        query: {
          clueInfoNo:id
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
      this.principal = "";
      this.$post("/data/my", {
        pathL: "/ap/sysUser/list",
        pageNum: 1,
        pageSize: 9999999,
        departmentId
      }).then(res => {
        this.staff = res.data.page.result;
      });
    },
    // 获取省信息
    getArea() {
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        provinceId: 0
      }).then(res => {
        this.provinces = res;
      });
    },
    //验证
    regexpVal (value) {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (value === '') { //联系人2、联系人3的联系方式非必填项  
      } else if (!phoneReg.test(value)) {
        this.$message("电话号码格式不正确");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-flow: wrap;
  & > div {
    width: 50%;
  }
}
.activeClick{
  color:#409EFF;
}
</style>