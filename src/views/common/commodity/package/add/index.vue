<template>
  <div
    class="add"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>服务包基本信息</span>
      </div>
      <el-form
        size="mini"
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <div class="form">
          <div class="form-left">
            <el-form-item
              label="服务包名称"
              prop="name"
            >
              <el-input
                v-model="form.name"
                placeholder="请输入服务包名称"
                maxlength="20"
              ></el-input>
              <p class="length">{{form.name.length}}/20</p>
            </el-form-item>
            <el-form-item
              label="适用人群"
              prop="introduction"
            >
              <el-input
                v-model="form.introduction"
                placeholder="适用人群请输入 “ 、 ” 隔开"
                maxlength="30"
              ></el-input>
              <p class="length">{{form.introduction.length}}/30</p>
            </el-form-item>
            <el-form-item
              label="服务包类型"
              prop="packType"
            >
              <el-select
                v-model="form.packType"
                style="width:100%"
                placeholder="请选择服务包类型"
              >
                <el-option
                  label="基础服务包"
                  value="1"
                ></el-option>
                <el-option
                  label="增值服务包"
                  value="2"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item label="服务包缩略图">
              <div class="upload-img">
                <el-upload
                  class="avatar-uploader"
                  :headers="uploadHeaders"
                  :action="uploadUrl"
                  v-loading="loadingPicOne"
                  element-loading-text="正在上传中···"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="form.packIcon"
                    :src="form.packIcon"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </div>
              <span>上传一张即可，支持扩展名："jpg"、"gif"、"bmp"、“png"</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card
      class="box-card"
      style="margin-top:20px"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>服务项设置</span>
      </div>
      <el-card
        v-for="item,index in form.subList"
        :key="index"
        shadow="hover"
        style="margin-top:10px;"
      >
        <el-form
          ref="item"
          :model="item"
          :rules="dataRules"
          style="width:60%"
          size="mini"
          label-width="100px"
        >
          <el-form-item
            label="服务项名称"
            prop="name"
          >
            <div class="price">
              <el-input
                v-model="item.name"
                style="width:500px"
                maxlength="20"
              ></el-input>
              <p style="width:80px;text-align: right;">{{item.name.length}} / 20</p>
            </div>
          </el-form-item>
          <el-form-item
            label="价格"
            prop="price"
          >
            <div class="price">
              <el-input
                v-model.number="item.price"
                style="width:500px"
              ></el-input>
              <p style="width:80px;text-align: right;">元 / 次</p>
            </div>
          </el-form-item>
          <div class="prices">
            <div class="prices-input">
              <el-form-item
                label="建议指导价"
                prop="minimumPirce"
              >
                <el-input v-model="item.minimumPirce"></el-input>
              </el-form-item>
              <i
                style="margin-bottom:18px"
                class="el-icon-minus"
              ></i>
              <el-form-item
                label-width="0"
                prop="maxmumPrice"
              >
                <el-input v-model="item.maxmumPrice"></el-input>
              </el-form-item>
            </div>
            <p style="width:80px;text-align: right;font-size:14px;margin-bottom:16px;">元 / 次</p>
          </div>
          <el-form-item
            label="频次"
            prop="frequency"
          >
            <div class="price">
              <el-input
                v-model="item.frequency"
                style="width:500px"
              ></el-input>
              <p style="width:80px;text-align: right;">次 / 年</p>
            </div>
          </el-form-item>
          <el-form-item
            label="服务项描述"
            prop="description"
          >
            <div class="price">
              <el-input
                v-model="item.description"
                maxlength="40"
                rows="3"
                type="textarea"
                style="width:500px"
                resize="none"
              ></el-input>
              <p style="width:80px;text-align: right;">{{item.description.length}} / 40</p>
            </div>
          </el-form-item>
          <el-form-item label="服务项总价">
            {{item.frequency!==''&&item.price!==''?item.frequency*item.price:''}} 元
          </el-form-item>
          <el-form-item>
            <div class="form-btn">
              <el-button
                v-if="form.subList.length!==1"
                @click="remove(index)"
                style="width:100px;"
                type="danger"
                plain
              >删 除</el-button>
              <el-button
                v-if="form.subList.length===index+1"
                @click="add"
                style="width:100px;"
                type="primary"
              >继续添加</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <div class="add-btn">
      <el-button
        @click="$router.go(-1)"
        size="mini"
        style="width:100px"
        type="info"
        plain
      >取 消</el-button>
      <el-button
        @click="submit(form)"
        size="mini"
        style="width:100px"
        type="primary"
      >创 建</el-button>
    </div>
  </div>
</template>

<script>
import { isValidPrice, isValidFrequency } from "@/utils/RegExp.js";
var CheckPrice = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入价格"));
  } else if (!isValidPrice(value)) {
    callback(new Error("您输入的价格格式有误"));
  } else {
    callback();
  }
};
var CheckPriceStart = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入建议指导价"));
  } else if (!isValidPrice(value)) {
    callback(new Error("您输入的指导价格式有误"));
  } else {
    callback();
  }
};
var CheckFrequency = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入频次"));
  } else if (!isValidFrequency(value)) {
    callback(new Error("您只能输入最大为99的整数数字"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      loading: false,
      loadingPicOne: false,
      form: {
        name: "",
        introduction: "",
        packType: "",
        packIcon: "",
        subList: [
          {
            name: "",
            price: "",
            minimumPirce: "",
            maxmumPrice: "",
            frequency: "",
            description: ""
          }
        ]
      },
      formRules: {
        name: [
          { required: true, message: "请输入服务包名称", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请输入适用人群", trigger: "blur" }
        ],
        packType: [
          { required: true, message: "请选择服务包类型", trigger: "change" }
        ]
      },
      dataRules: {
        name: [
          { required: true, message: "请输入服务项名称", trigger: "blur" }
        ],
        price: [
          {
            required: true,
            validator: CheckPrice,
            trigger: "blur"
          }
        ],
        minimumPirce: [
          {
            required: true,
            validator: CheckPriceStart,
            trigger: "blur"
          }
        ],
        maxmumPrice: [
          {
            required: true,
            validator: CheckPriceStart,
            trigger: "blur"
          }
        ],
        frequency: [
          {
            required: true,
            validator: CheckFrequency,
            trigger: "blur"
          }
        ],
        description: [
          { required: true, message: "请输入服务项描述", trigger: "blur" }
        ]
      },
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      }
    };
  },
  methods: {
    //  图片上传成功
    handleAvatarSuccess(response, file, fileList) {
      this.form.packIcon = response.data.url;
      if (this.form.packIcon !== "" || this.form.packIcon !== null) {
        this.loadingPicOne = false;
      }
    },
    // 图片上传验证
    beforeAvatarUpload(file) {
      this.loadingPicOne = true;
      const extension = file.type === "image/jpg";
      const extension2 = file.type === "image/jpeg";
      const extension3 = file.type === "image/gif";
      const extension4 = file.type === "image/png";
      const extension5 = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5
      ) {
        this.loadingPicOne = false;
        this.$message({
          message: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
          center: true
        });
      }
      if (!isLt2M) {
        this.loadingPicOne = false;
        this.$message({
          message: "上传图片大小不能超过5MB!",
          center: true
        });
      }
      return (
        (extension || extension2 || extension3 || extension4 || extension5) &&
        isLt2M
      );
    },
    // 继续添加
    add() {
      let newList = {
        name: "",
        price: "",
        minimumPirce: "",
        maxmumPrice: "",
        frequency: "",
        description: ""
      };
      this.form.subList.push(newList);
    },
    // 删除
    remove(index) {
      if (this.form.subList.length === 1) {
        this.$message({
          message: "至少保留一个服务项",
          type: "warning",
          center: true
        });
      } else {
        this.form.subList.splice(index, 1);
      }
    },
    // 提交
    submit(form) {
      let flag = true;
      let sort = true;
      let price = true;
      for (let i = 0; i < this.form.subList.length; i++) {
        this.$refs.item[i].validate(valid => {
          if (!valid) {
            flag = false;
          }
          if (
            Number(form.subList[i].maxmumPrice) <
            Number(form.subList[i].minimumPirce)
          ) {
            sort = false;
          }
          if (
            Number(form.subList[i].price) <
              Number(form.subList[i].minimumPirce) ||
            Number(form.subList[i].price) > Number(form.subList[i].maxmumPrice)
          ) {
            price = false;
          }
        });
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (flag) {
            if (sort) {
              if (price) {
                this.$post("/data/my", {
                  pathL: "/doctor/teamPackTemplate/createTemplate",
                  name: this.form.name,
                  introduction: this.form.introduction,
                  packType: this.form.packType,
                  packIcon: this.form.packIcon,
                  state: 0,
                  delFlag: 0
                }).then(res => {
                  if (res.state === 0) {
                    let subList = this.form.subList;
                    for (let i = 0; i < subList.length; i++) {
                      subList[i].suggestPriceDesc =
                        subList[i].minimumPirce +
                        "元 — " +
                        subList[i].maxmumPrice +
                        "元/次";
                      subList[i].frequencyUnit = "年";
                      subList[i].packageId = res.data.packageId;
                      subList[i].id = -1;
                    }
                    this.$post(
                      "/data/new",
                      this.$qs.stringify({
                        pathL: "/doctor/teamPackTemplate/saveOrEditTemplate",
                        name: this.form.name,
                        introduction: this.form.introduction,
                        packType: this.form.packType,
                        packIcon: this.form.packIcon,
                        state: 0,
                        delFlag: 0,
                        subList: encodeURI(JSON.stringify(subList))
                      })
                    ).then(res => {
                      if (res.state === 0) {
                        this.$message({
                          message: "创建成功",
                          type: "success",
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
                  } else {
                    this.$message({
                      message: res.msg,
                      center: true
                    });
                  }
                });
              } else {
                this.$message({
                  message: "您输入的价格只能在指导价范围之内",
                  type: "warning",
                  center: true
                });
              }
            } else {
              this.$message({
                message: "最高价必须大于最低价",
                type: "warning",
                center: true
              });
            }
          } else {
            this.$message({
              message: "请填写正确的表单信息",
              center: true
            });
          }
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.add {
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
  width: 100%;
  display: flex;
  align-items: center;
}
.prices-input {
  width: 600px;
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
  cursor: pointer;
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
.add-btn {
  height: 100px;
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
