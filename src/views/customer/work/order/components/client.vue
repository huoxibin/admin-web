<template>
  <!-- 客户信息 -->
  <el-card class="work-order-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>客户信息</span>
    </div>
    <el-form
      ref="form"
      size="mini"
      class="form"
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
      <el-form-item label="客户姓名" prop="customerName">
        <el-input v-model="form.customerName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="form.phone" maxlength="11" :disabled="$route.query.markId == 110 ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="所属省市县" prop="cityId">
        <div class="area" style="width: 100%;display: flex;">
          <el-select v-model="form.provinceId" placeholder="请选择" @change="handleArea">
            <el-option
              v-for="item in province"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
          <el-select v-model="form.cityId" placeholder="请选择" @change="citySel">
            <el-option
              v-for="item in city"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
          <el-select v-model="form.areaId" label="请选择">
            <el-option
                    v-for="(item,index) in area"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailedAddress">
        <el-input v-model="form.detailedAddress" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="微信号/QQ" prop="wechat">
        <el-input v-model="form.wechat" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="其他电话" prop="otherPhone">
        <el-input v-model="form.otherPhone" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="购买渠道" prop="buyChannel">
        <!--<el-input v-model="form.buyChannel" maxlength="50"></el-input>-->
        <el-select v-model="form.buyChannel" placeholder="请选择">
          <el-option label="官网" value="官网"></el-option>
          <el-option label="合伙人" value="合伙人"></el-option>
          <el-option label="经销商" value="经销商"></el-option>
          <el-option label="其他渠道" value="其他渠道"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="form.orderNo" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="购买日期" prop="buyTime">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          v-model="form.buyTime"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="form.productName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="服务包" prop="packageType">
        <el-select v-model="form.packageType" placeholder="请选择">
          <el-option v-for="item in packageData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员属性" prop="vip">
        <el-select v-model="form.vip" placeholder="请选择">
          <el-option label="会员" :value="2"></el-option>
          <el-option label="非会员" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="家庭号" prop="familyNo">
        <el-input v-model="form.familyNo" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="SN码" prop="sn">
        <el-input v-model="form.sn" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="会员有效期" prop="expireDate">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          v-model="form.expireDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { isValidPhone,isValidEmali ,isValidNumber } from "@/utils/RegExp.js";
var CheckTel = (rule, value, callback) => {
  if (!value) {
     callback(new Error("请输入电话号码"));
  } else if (!isValidNumber(value)) {
     callback(new Error("请输入正确格式的电话号码"));
  } else {
     callback();
  }
};
var CheckEmali = (rule, value, callback) => {
   if (value == '' ) {
      callback();
   } else if (!isValidEmali(value)) {
      callback(new Error("请输入正确格式的邮箱地址"));
   } else {
      callback();
   }
};
export default {
  name: "client",
  computed: {
    phone() {
      return this.form.phone;
    }
  },
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  watch: {
    phone: {
      handler(now) {
        if (now.length === 11 || now.length === 8) {
          this.$emit("handlePhone", now);
        }
      },
      immediate: true
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
        customerName: {
          required: false,
          message: "请输入客户姓名",
          trigger: "blur"
        },
        sex: { required: false, message: "请选择性别", trigger: "blur" },
        phone: [
           { validator : CheckTel, trigger: "blur", required: true}
        ],
        cityId: { required: false, message: "请选择所属省市", trigger: "blur" },
        detailedAddress: {
          required: false,
          message: "请输入详细地址",
          trigger: "blur"
        },
        wechat: { required: false, message: "请输入微信号/QQ", trigger: "blur" },
        email: [
           { validator : CheckEmali, trigger: "blur" , required: false}
        ],
        otherPhone: {
          required: false,
          message: "请输入其他电话",
          trigger: "blur"
        },
        buyChannel: {
          required: false,
          message: "请输入购买渠道",
          trigger: "blur"
        },
        orderNo: {
          required: false,
          message: "请输入订单号",
          trigger: "blur"
        },
        buyTime: { required: false, message: "请选择购买日期", trigger: "blur" },
        productName: {
          required: false,
          message: "请输入产品名称",
          trigger: "blur"
        },
        packageType: {
          required: false,
          message: "请选择服务包",
          trigger: "blur"
        },
        vip: { required: false, message: "请选择会员属性", trigger: "blur" },
        familyNo: { required: false, message: "请输入家庭号", trigger: "blur" },
        sn: { required: false, message: "请输入SN码", trigger: "blur" },
        expireDate: {
          required: false,
          message: "请选择会员有效期",
          trigger: "blur"
        }
      },
      province: [],
      city: [],
       area:[],
      packageData: []
    };
  },
  created() {
    this.getArea();
    this.getPackage();
  },
  methods: {
    // 获取省信息
    getArea() {
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        provinceId: 0
      }).then(res => {
        this.province = res;
      });
    },
    // 改变地级信息
    handleArea(provinceId) {
      this.form.cityId = "";
      this.form.areaId = "";
       this.city = [];
       this.area=[];
      this.$get("/data/my", {
        pathL: "/common/area/getAreaList",
        provinceId
      }).then(res => {
        this.city = res;
      });
    },
    //市列表值被选中事件
    citySel(cityVal) {
        this.form.areaId = "";
       this.area=[];
        this.$get("/data/my", {
           pathL: "/common/area/findAreaList",
           cityId: cityVal
        }).then(res => {
           if (res.state === 0) {
              this.area = res.data;
           } else {
              this.$message({
                 message: res.msg,
                 center: true
              });
           }
        });
     },
    // 获取服务包
    getPackage() {
      this.$get("/data/my", {
        pathL: "/doctor/teamPackTemplate/listSearch",
        pageNum: 1,
        pageSize: 9999999
      }).then(res => {
        this.packageData = res.data.result;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-flow: wrap;
  & > div {
    width: 33%;
  }
}
</style>
