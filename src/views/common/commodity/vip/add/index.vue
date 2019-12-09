<template>
  <div class="add">
    <el-form ref="form" size="mini" :rules="formRules" :model="form" label-width="100px">
      <div class="form">
        <div class="form-left">
          <el-form-item label="套餐名称" prop="name">
            <el-input v-model="form.name" placeholder="填写不超过10个字"></el-input>
          </el-form-item>
          <el-form-item label="展示" prop="show">
            <el-radio-group v-model="form.show">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="2">会员</el-radio>
              <el-radio :label="1">非会员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="人数" prop="num">
            <el-select v-model="form.num" style="width:100%" placeholder="请选择">
              <!--<el-option label="3" value="3"></el-option>-->
              <!--<el-option label="4" value="4"></el-option>-->
              <!--<el-option label="5" value="5"></el-option>-->
              <el-option label="6" value="6"></el-option>
              <el-option label="不限制" value="999"></el-option>
              <el-option label="不配置" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="URL" prop="url">
             <el-input v-model="form.url" placeholder="套餐详情URL"></el-input>
          </el-form-item>-->
          <!--富文本编辑器-->
          <el-form-item label="套餐内容" prop="context">
            <base-editor style="width:1000px;height:600px" v-model="form.context"></base-editor>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" rows="4" resize="none" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="有效期限" style="margin-bottom: 0px">
            <div class="time">
              <div class="sigleMarkPlace"></div>
              <el-form-item prop="indate">
                <el-input style="flex:1" v-model="form.indate"></el-input>
              </el-form-item>
              <el-form-item prop="indateType">
                <el-select v-model="form.indateType" style="flex:1" placeholder="请选择">
                  <el-option label="年" value="1"></el-option>
                  <el-option label="月" value="2"></el-option>
                  <el-option label="日" value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="原价" prop="price">
            <div style="display:flex">
              <el-input v-model="form.price" placeholder="注：填写0，为免费"></el-input>
              <span style="width:30px;text-align:center">元</span>
            </div>
          </el-form-item>
          <el-form-item label="现价" prop="presentPrice">
            <div style="display:flex">
              <el-input v-model="form.presentPrice"></el-input>
              <span style="width:30px;text-align:center">元</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100px" @click="$router.go(-1)" plain>返 回</el-button>
            <el-button style="width:100px" @click="submit(form)" type="primary">保 存</el-button>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item label="套餐封面" prop="img">
            <div class="upload-img">
              <el-upload
                class="avatar-uploader"
                :headers="uploadHeaders"
                :action="uploadUrl"
                :show-file-list="false"
                v-loading="loadingPic"
                element-loading-text="正在上传中···"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.img" :src="form.img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isValidFiveNumber } from "@/utils/RegExp.js";
var CheckNumber = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入排序数字"));
  } else if (!isValidFiveNumber(value)) {
    callback(new Error("排序支持输入五位正整数"));
  } else {
    callback();
  }
};

export default {
  data() {
    return {
      //加载图片标识
      loadingPic: false,
      //上传的信息form
      form: {
        name: "",
        // show: [],
        show: "",
        num: "",
        img: "",
        context: "" //富文本
      },
      //信息的验证
      formRules: {
        indate: [{ required: true, message: "请填写数字", trigger: "change" }],
        indateType: [
          { required: true, message: "请选择年/月/日", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入套餐名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        show: [
          { required: true, message: "请选择展示的人群", trigger: "change" }
        ],
        num: [{ required: true, message: "请选择人数", trigger: "blur" }],
        url: [{ required: true, message: "请填写套餐地址", trigger: "blur" }],
        context: [
          { required: true, message: "请填写套餐内容", trigger: "blur" }
        ],
        sort: [{ required: true, validator: CheckNumber, trigger: "blur" }],
        price: [{ required: true, message: "请输入套餐原价", trigger: "blur" }],
        presentPrice: [
          { required: true, message: "请输入套餐现价", trigger: "blur" }
        ],
        img: [{ required: true, message: "请选择照片", trigger: "change" }]
      },
      //图片上传的验证
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      }
    };
  },
  methods: {
    //  图片上传成功
    handleAvatarSuccess(response, file, fileList) {
      this.form.img = response.data.url;
      if (this.form.img !== "" || this.form.img !== null) {
        this.loadingPic = false;
      }
    },
    // 图片上传验证
    beforeAvatarUpload(file) {
      this.loadingPic = true;
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
        this.$message({
          message: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
          center: true
        });
      }
      if (!isLt2M) {
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
    // 表单提交
    submit(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          //添加套餐列表
          this.$post("/data/my", {
            pathL: "/family/familyServicepackage/savePackage",
            name: form.name, //套餐名称
            photoUrl: form.img, //套餐封面地址
            // detailUrl:form.url,//URL地址
            detailContext: form.context, //富文本
            description: form.description, //描述
            sort: form.sort, //排序
            memberCount: form.num, //人数
            indate: form.indate, //有效期限
            indateType: form.indateType, //有效期类型
            price: form.price, //原价
            presentPrice: form.presentPrice, //现价
            directFamilyKind: form.show //面向人群(0-全部 1-非会员家庭 2-会员家庭)
          }).then(res => {
            if (res.state === 0) {
              // console.log(res);
              this.$router.push({
                name: "商品管理/会员服务配置/列表"
              });
              //清空表单
              /*for(var m in this.form){
                                  this.form[m] = "";
                                }*/
              this.$message({
                message: "保存成功",
                type: "success",
                center: true
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
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    }
  },
  updated() {
    console.log(this.form.context);
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
  display: flex;
}
.form-left {
  flex: 2;
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
.time {
  width: 100%;
  display: flex;
}
.sigleMarkPlace {
  position: relative;
}
.sigleMarkPlace:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: -78px;
}
</style>
