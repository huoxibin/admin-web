<template>
  <div :form="form">

      <el-select :disabled="disable" v-if="showProvince" class="w-140" v-model="form.provinceId" @change="currentSel" label="省">
        <el-option
                v-for="(item,index) in province"
                :key="index"
                :label="item.name"
                :value="item.id"
        ></el-option>
      </el-select>

      <el-select :disabled="disable" v-if="showCity" class="w-140" v-model="form.cityId" label="市" @change="citySel">
        <el-option v-for="(item,index) in city" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>

      <el-select :disabled="disable" v-if="showCounty" class="w-140" v-model="form.countyId" label="区县" @change="areaSel">
        <el-option v-for="(item,index) in area" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>

  </div>
</template>

<script>
export default {
  name: "BaseLocal",
  props:{
    form:{
      type:Object,
      require:true
    },
    disable:{
      type: Boolean,
      default:false
    },
    showProvince:{
      type: Boolean,
      default:true
    },
    showCity:{
      type: Boolean,
      default:true
    },
    showCounty:{
      type: Boolean,
      default:true
    },
  },
  data: () => ({
    province: [], //省列表
    city: [], //市列表
    area: [], //区/县列表
  }),
  mounted() {
    this.getProvinceList();
    //debugger
    //this.getCityList(this.form.cityId);
  },
  watch:{

  },

  methods: {
    ///////////三级联动//////////
    //根据省列表
    getProvinceList() {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        provinceId: 0
      }).then(res => {
        if (res.state === 0) {
          this.province = res.data;
          // console.log(this.city);
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //根据省获取市列表
    getCityList(val) {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        provinceId: val
      }).then(res => {
        if (res.state === 0) {
          this.city = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //根据市获取区/县列表
    getAreaList(val) {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        cityId: val
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
    //省列表值被选中事件
    currentSel(selVal) {
      this.form.cityId = "";
      this.form.countyId = "";
      this.area.length = 0;
      if(this.showProvince){
        this.getCityList(selVal);
      }
    },
    //市列表值被选中事件
    citySel(cityVal) {
      this.form.countyId = "";
      if(this.showCounty){
        this.getAreaList(cityVal);
      }
    },
    //区/县列表值被选中事件
    areaSel(areaVal) {
      this.form.countyId = areaVal;
    }
  }
};
</script>

<style>
  .w-140{ width: 140px}
</style>
