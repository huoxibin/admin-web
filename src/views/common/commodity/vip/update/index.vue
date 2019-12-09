<template>
  <div class="update" v-loading="loading" element-loading-text="正在加载中">
    <el-form ref="form" size="mini" :rules="formRules" :model="form" label-width="100px">
      <div class="form">
        <div class="form-left">
          <el-form-item label="套餐名称" prop="name">
            <el-input v-model="form.name" placeholder="填写不超过10个字"></el-input>
          </el-form-item>
          <el-form-item label="面向人群" prop="show">
            <el-radio-group v-model="form.show">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="2">会员</el-radio>
              <el-radio :label="1">非会员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="人数" prop="num">
            <el-select v-model="form.num" style="width:100%" placeholder="请选择">
              <!--<el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>-->
              <el-option label="6" value="6"></el-option>
              <el-option label="不限制" value="不限制"></el-option>
              <el-option label="不配置" value="不配置"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="URL" prop="url">
            <el-input v-model="form.url" placeholder="套餐详情URL"></el-input>
          </el-form-item>-->
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
                  <el-option label="年" value="年"></el-option>
                  <el-option label="月" value="月"></el-option>
                  <el-option label="日" value="日"></el-option>
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
      form: {
        name: "",
        show: "",
        num: "",
        url: "",
        context: "",
        description: "",
        sort: "",
        indate: "",
        indateType: "",
        price: "",
        presentPrice: "",
        img: ""
      },
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
        url: [{ required: false, message: "请填写套餐地址", trigger: "blur" }],
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
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      },
      comboMsg: "", //获取到的数据
      loading: true
    };
  },
  methods: {
    //获取-会员服务配置-列表-编辑  接口
    queryList() {
      this.$get("/data/my", {
        pathL: "/family/familyServicepackage/getServicePackageDetail",
        id: this.comboId
      }).then(res => {
        if (res.state === 0) {
          // console.log(res);
          this.comboMsg = res.data;
          if (this.comboMsg) {
            this.form.name = this.comboMsg.name; //套餐名字
            this.form.show = this.comboMsg.directFamilyKind; //面向人群
            this.form.num =
               this.comboMsg.memberCount == "999" ? "不限制" :
                  this.comboMsg.memberCount == "-1" ? "不配置" :
                     this.comboMsg.memberCount == "3" ? "3" :
                        this.comboMsg.memberCount == "4" ? "4" :
                           this.comboMsg.memberCount == "5" ? "5" :
                              "6"; //人数
            // this.form.url = this.comboMsg.detailUrl;//URL
            this.form.context = this.comboMsg.detailContext; //富文本编辑内容
            this.form.description = this.comboMsg.description; //描述
            this.form.sort = this.comboMsg.sort; //排序
            this.form.indate = this.comboMsg.indate; //有效期限---时间
            this.form.indateType =
              this.comboMsg.indateType === 1
                ? "年"
                : this.comboMsg.indateType === 2
                ? "月"
                : "日"; //1年 2月 3日
            this.form.price = this.comboMsg.price; //原价
            this.form.presentPrice = this.comboMsg.presentPrice; //现价
            this.form.img = this.comboMsg.photoUrl; //套餐封面
            this.loading = false;
          }
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //  图片上传成功
    handleAvatarSuccess(response, file, fileList) {
      this.form.img = response.data.url;
    },
    // 图片上传验证
    beforeAvatarUpload(file) {
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
          //编辑之后点击--保存按钮
          this.$post("/data/my", {
            pathL: "/family/familyServicepackage/savePackage",
            name: form.name, //套餐名称
            photoUrl: form.img, //套餐封面地址
            // detailUrl:form.url,//URL地址
            detailContext: form.context, //富文本编辑内容
            description: form.description, //描述
            sort: form.sort, //排序
            memberCount:
               form.num == "不限制" ? "999" :
                  form.num == "不配置" ? "-1" :
                     form.num == "3" ? "3" :
                        form.num == "4" ? "4" :
                           form.num == "5" ? '5' :
                              '6', //人数
            indate: Number(form.indate), //有效期限
            indateType:
              form.indateType == "年" ? 1 : form.indateType == "月" ? 2 : 3, //有效期类型
            price: Number(form.price), //原价
            presentPrice: form.presentPrice, //现价
            directFamilyKind: form.show, //面向人群(0-全部 1-非会员家庭 2-会员家庭)，
            id: this.comboId
          }).then(res => {
            if (res.state === 0) {
              console.log(res);
              this.$router.push({
                name: "商品管理/会员服务配置/列表"
              });
              this.$message({
                message: "编辑成功",
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
  mounted() {
    let comboId = this.$route.query.id;
    this.comboId = comboId;
    // console.log(this.comboId);

    this.queryList();
  }
};
</script>

<style scoped>
.update {
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
