<template>
  <div class="base-area">
    <el-select
      style="width:120px"
      v-model="form.provinceId"
      @change="handleArea(0,form.provinceId)"
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in province"
        :key="item.provinceId"
        :label="item.provinceName"
        :value="item.provinceId"
      ></el-option>
    </el-select>
    <span style="color: #606266;">省/市</span>
    <el-select style="width:120px" v-model="form.cityId" @change="handleArea(1,form.cityId)">
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in city"
        :key="item.cityId"
        :label="item.cityName"
        :value="item.cityId"
      ></el-option>
    </el-select>
    <span style="color: #606266;">市</span>
    <el-select style="width:120px" v-model="form.countyId">
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in county"
        :key="item.countyId"
        :label="item.countyName"
        :value="item.countyId"
      ></el-option>
    </el-select>
    <span style="color: #606266;">区/县</span>
  </div>
</template>

<script>
export default {
  name: "BaseArea",
  data: () => ({
    form: {
      provinceId: "",
      cityId: "",
      countyId: ""
    },
    province: [],
    city: [],
    county: []
  }),
  created() {
    this.getArea();
  },
  watch: {
    form: {
      handler(now) {
        this.$emit("handleArea", now);
      },
      deep: true
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
      });
    },
    // 改变地级信息
    handleArea(type, id) {
      const area = ["province", "city", "county"];
      const areaId = ["provinceId", "cityId", "countyId"];
      if (type === 0) {
        this.form.cityId = "";
        this.form.countyId = "";
        this.city = [];
        this.county = [];
      } else {
        this.form.countyId = "";
        this.county = [];
      }
      if (id) {
        this.$get("/data/my", {
          pathL: "/common/area/getAreaList",
          [areaId[type]]: id
        }).then(res => {
          this[area[type + 1]] = res;
        });
      }
    }
  }
};
</script>

<style>
</style>
