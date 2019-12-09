<template>
  <div class="update">
    <p class="title">编辑医院机构</p>
    <div class="form" v-loading="loading" element-loading-text="拼命加载中">
      <el-form ref="form" size="mini" style="width:100%;" :model="form" label-width="100px">
        <el-form-item label="医院名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="医院地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="医院等级">
          <el-select v-model="form.levelId">
            <el-option v-for="item,index in grade" :key="index" :label="item.levelName" :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区">
          <el-select style="width:120px" v-model="form.provinceId" @change="getRegion(1,form.provinceId)">
            <el-option label="全部" :value=0></el-option>
            <el-option v-for="item,index in province" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
          </el-select>
          <span style="color: #606266;">省/市</span>
          <el-select style="width:120px" v-model="form.cityId" @change="getRegion(2,form.cityId)">
            <el-option label="全部" :value=0></el-option>
            <el-option v-for="item,index in city" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
          <span style="color: #606266;">市</span>
          <el-select style="width:120px" v-model="form.countyId" @change="getRegion(3,form.countyId)">
            <el-option label="全部" :value=0></el-option>
            <el-option v-for="item,index in county" :key="index" :label="item.countyName" :value="item.countyId"></el-option>
          </el-select>
          <span style="color: #606266;">区/县</span>
        </el-form-item>
        <el-form-item label="街道/村镇">
          <el-select style="width:120px" v-model="form.townId">
            <el-option label="全部" :value=0></el-option>
            <el-option v-for="item,index in town" :key="index" :label="item.townName" :value="item.townId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院简介">
          <el-input type="textarea" maxlength="200" :rows=10 resize="none" v-model="form.introduce"></el-input>
          <span v-if="form.introduce" class="abstract-length">{{form.introduce.length}}/200</span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100px" @click="$router.go(-1)" size="mini" round>返 回</el-button>
          <el-button style="width:100px" @click="submit(form)" size="mini" type="primary" round>保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {},
      province: [],
      city: [],
      county: [],
      town: [],
      grade: []
    };
  },
  methods: {
    // 保存修改
    submit(form) {
      this.$confirm("你确定要保存以上修改吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.loading = true;
          this.$post("/data/my", {
            pathL: "/doctor/areaHospital/edit",
            id: form.id,
            name: form.name,
            address: form.address,
            levelId: form.levelId,
            introduce: form.introduce,
            provinceId: form.provinceId,
            cityId: form.cityId,
            countyId: form.countyId,
            townId: form.townId
          }).then(res => {
            this.loading = false;
            if (res.state === 0) {
              this.$message({
                type: "success",
                message: "保存成功",
                center: true
              });
              this.$router.push({ name: "机构管理/医院机构/医院机构列表" });
            } else {
              this.$message({
                message: res.msg,
                center: true
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消保存",
            center: true
          });
        });
    },
    // 切换省份
    getRegion(type, id) {
      if (id !== "") {
        switch (type) {
          case 1:
            this.form.cityId = "";
            this.form.countyId = "";
            this.form.townId = "";
            this.city = [];
            this.county = [];
            this.town = [];
            this.$get("/data/my", {
              pathL: "/common/area/getAreaList",
              provinceId: id
            }).then(res => {
              this.city = res;
            });
            break;
          case 2:
            this.form.countyId = "";
            this.form.townId = "";
            this.county = [];
            this.town = [];
            this.$get("/data/my", {
              pathL: "/common/area/getAreaList",
              cityId: id
            }).then(res => {
              this.county = res;
            });
            break;
          case 3:
            this.form.townId = "";
            this.town = [];
            this.$get("/data/my", {
              pathL: "/common/area/getAreaList",
              countyId: id
            }).then(res => {
              this.town = res;
            });
            break;
        }
      } else {
        switch (type) {
          case 1:
            this.form.cityId = "";
            this.form.countyId = "";
            this.city = [];
            this.county = [];
            break;
          case 2:
            this.form.countyId = "";
            this.county = [];
            break;
        }
      }
    }
  },
  created() {
    let id = this.$route.query.id;
    // 获取机构详情
    this.$post("/data/my", {
      pathL: "/doctor/areaHospital/details",
      id: id
    }).then(res => {
      if (res.state === 0) {
        this.form = res.data;

        // 获取省市地区
        this.$get("/data/my", {
          pathL: "/common/area/getAreaList",
          provinceId: 0
        }).then(res => {
          this.province = res;
        });
        this.$get("/data/my", {
          pathL: "/common/area/getAreaList",
          provinceId: res.data.provinceId
        }).then(res => {
          this.city = res;
        });
        this.$get("/data/my", {
          pathL: "/common/area/getAreaList",
          cityId: res.data.cityId
        }).then(res => {
          this.county = res;
        });
        this.$get("/data/my", {
          pathL: "/common/area/getAreaList",
          countyId: res.data.countyId
        }).then(res => {
          this.loading = false;
          this.town = res;
        });

        // 获取机构等级
        this.$post("/data/my", {
          pathL: "/doctor/areaHospital/level"
        }).then(res => {
          if (res.state === 0) {
            this.grade = res.data;
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        });
      } else {
        this.$message({
          message: res.msg,
          center: true
        });
      }
    });
  }
};
</script>

<style scoped>
.update {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
}
.form {
  width: 100%;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}
.title {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
  font-size: 14px;
  border-bottom: 1px solid #ccc;
}
.abstract-length {
  position: absolute;
  color: #606266;
  right: 0;
}
</style>
