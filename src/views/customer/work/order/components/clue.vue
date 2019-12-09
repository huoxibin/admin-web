<template>
  <!-- 客户资料 -->
  <el-card class="work-order-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>客户资料</span>
    </div>
    <el-form
      ref="form"
      size="mini"
      :rules="rules"
      :model="form"
      label-width="110px"
      label-suffix="："
    >
      <el-form-item label="接入渠道">
        <el-input v-model="form.joinChannel" disabled maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="访问渠道" prop="accessChannel">
        <el-input v-model="form.accessChannel" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="form.companyName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系人1" prop="contactNameOne">
        <el-input v-model="form.contactNameOne" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactTelOne">
        <el-input v-model="form.contactTelOne" maxlength="50" :disabled="$route.query.markId == 110 ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="联系人2" prop="contactNameTwo">
        <el-input v-model="form.contactNameTwo" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactTelTwo">
        <el-input v-model="form.contactTelTwo" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系人3" prop="contactNameThree">
        <el-input v-model="form.contactNameThree" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactTelThree">
        <el-input v-model="form.contactTelThree" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="所属省市" prop="city">
        <div class="area" style="width: 100%;display: flex;">
          <el-select
            v-model="form.province"
            placeholder="请选择"
            @change="handleArea"
          >
            <el-option
              v-for="item in province"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
          <el-select v-model="form.city" placeholder="请选择">
            <el-option
              v-for="item in city"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="申请区域" prop="countyId">
        <div class="area" style="width: 100%;display: flex;">
          <el-select
            v-model="form.provinceId"
            placeholder="请选择"
            @change="handleAreas"
          >
            <el-option
              v-for="item in provinces"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.cityId"
            placeholder="请选择"
            @change="handleCitys"
          >
            <el-option
              v-for="item in citys"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
          <el-select v-model="form.countyId" placeholder="请选择">
            <el-option
              v-for="item in county"
              :key="item.countyId"
              :label="item.countyName"
              :value="item.countyId"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="客户类型" prop="customerType">
        <el-select v-model="form.customerType" placeholder="请选择">
          <el-option label="大客户" :value="1"></el-option>
          <el-option label="合伙人" :value="2"></el-option>
          <el-option label="经销商" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源" prop="clueSource">
        <div class="clue-source" style="display: flex;">
          <el-select v-model="form.clueSource" placeholder="请选择">
            <el-option label="展会" :value="2"></el-option>
            <el-option label="朋友介绍" :value="7"></el-option>
            <el-option label="活动/会议" :value="8"></el-option>
            <el-option label="自己开发" :value="9"></el-option>
            <el-option label="其他" :value="10"></el-option>
          </el-select>
          <el-input
            v-if="form.clueSource === 10"
            v-model="form.rest"
            maxlength="50"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" maxlength="50"></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { isValidNumber } from "@/utils/RegExp.js";
var CheckTel = (rule, value, callback) => {
   if (!value) {
      callback(new Error("请输入电话号码"));
   } else if (!isValidNumber(value)) {
      callback(new Error("请输入正确格式的电话号码"));
   } else {
      callback();
   }
};
var CheckTelSpec = (rule, value, callback) => {
   if ( value == '' ) {
      callback();
   } else if (!isValidNumber(value)) {
      callback(new Error("请输入正确格式的电话号码"));
   } else {
      callback();
   }
};
export default {
  name: "clue",
  computed: {
    contactTelOne() {
      return this.form.contactTelOne;
    }
  },
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        accessChannel: {
          required: false,
          message: "请输入访问渠道",
          trigger: "blur"
        },
        companyName: {
          required: false,
          message: "请输入公司名称",
          trigger: "blur"
        },
        contactNameOne: {
          required: true,
          message: "请输入联系人1",
          trigger: "blur"
        },
        contactTelOne: [
           { validator : CheckTel, trigger: "blur",required: true}
        ],
        contactNameTwo: {
          required: false,
          message: "请输入联系人2",
          trigger: "blur"
        },
        contactTelTwo: [
           { validator : CheckTelSpec, trigger: "blur",required: false}
        ],
        contactNameThree: {
          required: false,
          message: "请输入联系人3",
          trigger: "blur"
        },
        contactTelThree: [
           { validator : CheckTelSpec, trigger: "blur",required: false}
        ],
        city: {
          required: false,
          message: "请选择所属省市",
          trigger: "blur"
        },
        countyId: {
          required: false,
          message: "请选择申请区域",
          trigger: "blur"
        },
        customerType: {
          required: false,
          message: "请选择客户类型",
          trigger: "blur"
        },
        clueSource: {
          required: false,
          message: "请选择来源",
          trigger: "blur"
        },
        remark: {
          required: false,
          message: "请输入备注",
          trigger: "blur"
        }
      },
      province: [],
      provinces: [],
      city: [],
      citys: [],
      county: []
    };
  },
  created() {
    this.getArea();
  },
  watch: {
    contactTelOne: {
      handler(now) {
        if (now.length === 11 || now.length === 8) {
          this.$emit("handlePhoneClue", now);
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取省信息
    getArea() {
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        provinceId: 0
      }).then(res => {
        this.province = res;
        this.provinces = res;
      });
    },
    // 改变地级信息
    handleArea(provinceId) {
      this.form.city = "";
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        provinceId
      }).then(res => {
        this.city = res;
      });
    },
    handleAreas(provinceId) {
      this.form.cityId = "";
      this.form.countyId = "";
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        provinceId
      }).then(res => {
        this.citys = res;
      });
    },
    handleCitys(cityId) {
      this.form.countyId = "";
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        cityId
      }).then(res => {
        this.county = res;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
