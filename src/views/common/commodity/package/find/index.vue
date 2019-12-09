<template>
    <div class="find" v-loading="loading" element-loading-text="拼命加载中">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>服务包基本信息</span>
            </div>
            <el-form size="mini" ref="form" :model="form" label-width="120px">
                <div class="form">
                    <div class="form-left">
                        <el-form-item label="服务包名称">{{form.name}}</el-form-item>
                        <el-form-item label="适用人群">{{form.introduction}}</el-form-item>
                        <el-form-item label="服务包类型">
                            <p v-if="form.packType===1">基础服务包</p>
                            <p v-if="form.packType===2">增值服务包</p>
                        </el-form-item>
                        <el-form-item label="服务包状态">
                            <p v-if="form.state===1">已启用</p>
                            <p v-if="form.state===0">已禁用</p>
                        </el-form-item>
                    </div>
                    <div class="form-right">
                        <el-form-item label="服务包缩略图">
                            <div class="upload-img">
                                <img :src="form.packIcon" class="avatar">
                            </div>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top:20px">
            <div slot="header" class="clearfix">
                <span>服务项设置</span>
            </div>
            <el-card v-for="item,index in form.subList" :key="index" shadow="hover" style="margin-top:10px;">
                <el-form ref="item" :model="item" style="width:40%" size="mini" label-width="100px">
                    <el-form-item label="服务项名称">
                        <div class="price">{{item.name}}</div>
                    </el-form-item>
                    <el-form-item label="价格">
                        <div class="price">
                            {{item.price}}
                            <p style="margin-left:10px;">元 / 次</p>
                        </div>
                    </el-form-item>
                    <div class="prices">
                        <div class="prices-input">
                            <el-form-item label="建议指导价">
                                {{item.minimumPirce}}
                            </el-form-item>
                            <i style="margin:0 6px 18px 6px;" class="el-icon-minus"></i>
                            <el-form-item label-width="0">
                                {{item.maxmumPrice}}
                            </el-form-item>
                        </div>
                        <p style="margin: 0 0 20px 10px;">元 / 次</p>
                    </div>
                    <el-form-item label="频次">
                        <div class="price">
                            {{item.frequency}}
                            <p style="margin-left:10px;">次 / 年</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="服务项描述">
                        {{item.description}}
                    </el-form-item>
                    <el-form-item label="服务项总价">
                        {{item.frequency*item.price}}
                    </el-form-item>
                </el-form>
            </el-card>
        </el-card>
        <div class="find-btn">
            <el-button @click="$router.go(-1)" size="mini" style="width:100px" type="primary" plain>返 回</el-button>
            <el-button v-if="form.state===0" @click="status" size="mini" style="width:100px" type="primary">启 用</el-button>
            <el-button v-if="form.state===1" @click="status" size="mini" style="width:100px" type="primary">禁 用</el-button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      loading: true
    };
  },
  methods: {
    // 启用禁用
    status() {
      this.$post("/data/my", {
        pathL: "/doctor/teamPackTemplate/setUsingStatus",
        id: this.id,
        state: 1 - this.form.state
      }).then(res => {
        if (res.state === 0) {
          this.$message({
            type: "success",
            message: this.form.state === 0 ? "启用成功" : "禁用成功",
            center: true
          });
          this.$router.push({
            name: "商品管理/服务包管理/服务包列表"
          });
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  },
  mounted() {
    this.id = Number(this.$route.query.id);
    this.$get("/data/my", {
      pathL: "/doctor/teamPackTemplateitem/itemListByPackageId",
      packageId: this.id
    }).then(res => {
      this.loading = false;
      if (res.state === 0) {
        this.form = res.data;
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
.find {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.form {
  width: 100%;
  display: flex;
}
.form-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
}
.prices {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.prices-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.form-left {
  flex: 1;
}
.form-right {
  flex: 1;
}
.upload-img {
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.upload-img:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  max-width: 200px;
  max-height: 200px;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.length {
  position: absolute;
  right: 0;
  line-height: 20px;
}
.find-btn {
  height: 100px;
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
