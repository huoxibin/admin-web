<template>
  <div class="add" v-loading="loading" element-loading-text="正在保存中">
    <el-form
      ref="form"
      size="mini"
      :rules="formRules"
      style="width:100%"
      :model="form"
      label-width="100px"
    >
      <div class="add-top">
        <div class="add-top-left">
          <el-form-item label="标题" prop="topical">
            <el-input v-model="form.topical" placeholder="请输入测试题目的标题"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              placeholder="选填，请输入测试题目的描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderNumber">
            <el-input v-model="form.orderNumber" placeholder="数字越大，在前端排序越靠后"></el-input>
          </el-form-item>
          <el-form-item label="栏目" prop="channelId">
            <el-select style="width:100%" v-model="form.channelId" placeholder="请选择">
              <el-option
                v-for="item,index in columnList"
                :key="index"
                :label="item.channelName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="add-top-right">
          <el-form-item label="封面" prop="imageUrl">
            <div class="upload-img" v-loading="loadingPic" element-loading-text="正在上传中···">
              <el-upload
                class="avatar-uploader"
                :headers="uploadHeaders"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="add-bottom">
        <!--新增题目-->
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:47px">
            <span style="font-weight: 700;line-height:47px">新增题目</span>
          </div>
          <el-card
            v-for="item,index in form.subject"
            :key="index"
            class="box-card"
            style="margin-top:10px;"
            shadow="hover"
          >
            <el-form
              ref="item"
              size="mini"
              :rules="itemRules"
              style="width:100%"
              :model="item"
              label-width="100px"
            >
              <el-form-item label="序号设置">
                <div class="number">
                  <el-input style="width:400px" disabled v-model="item.sortNumber"></el-input>
                  <ul>
                    <li @click="add(1)">
                      <img src="./../images/icone-1.png" alt>
                    </li>
                    <li @click="remove(1,index)">
                      <img src="./../images/icone-2.png" alt>
                    </li>
                    <li @click="upData(1,index)">
                      <img src="./../images/icone-3.png" alt>
                    </li>
                    <li @click="downData(1,index)">
                      <img src="./../images/icone-4.png" alt>
                    </li>
                  </ul>
                </div>
              </el-form-item>
              <el-form-item label="题目类型" prop="type">
                <el-select size="mini" v-model="item.type" disabled placeholder="请选择">
                  <el-option label="单选" value="1"></el-option>
                  <el-option label="多选" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="问题设置" prop="title">
                <el-input type="textarea" v-model="item.title"></el-input>
              </el-form-item>
              <el-form-item label="选项设置">
                <div class="tables">
                  <ul>
                    <li>选项文字描述</li>
                    <li>分数</li>
                    <li style="border-right:none;">操作</li>
                  </ul>
                  <el-form
                    v-for="itemer,indexer in item.options"
                    :key="indexer"
                    ref="itemer"
                    size="mini"
                    :rules="itemerRules"
                    style="width:100%"
                    :model="itemer"
                  >
                    <ol>
                      <li>
                        <el-form-item style="margin:18px;" prop="text">
                          <el-input v-model="itemer.text"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item style="margin:18px;" prop="score">
                          <el-input v-model="itemer.score"></el-input>
                        </el-form-item>
                      </li>
                      <li style="border-right:none;">
                        <el-form-item style="margin:18px;width:100%">
                          <div class="table-btn">
                            <img @click="add(2,indexer,index)" src="./../images/icone-1.png" alt>
                            <img @click="remove(2,indexer,index)" src="./../images/icone-2.png" alt>
                            <img @click="upData(2,indexer,index)" src="./../images/icone-3.png" alt>
                            <img
                              @click="downData(2,indexer,index)"
                              src="./../images/icone-4.png"
                              alt
                            >
                          </div>
                        </el-form-item>
                      </li>
                    </ol>
                  </el-form>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-card>
        <!--题目规则-->
        <el-card class="box-card" style="margin-top:20px;">
          <div slot="header" class="clearfix">
            <span style="font-weight: 700;">题目规则</span>
          </div>
          <div class="tables">
            <ul>
              <li>序号</li>
              <li style="flex:3">分数</li>
              <li style="flex:3">规则描述</li>
              <li style="border-right:none;">操作</li>
            </ul>
            <el-form
              v-for="itemest,indexest in form.answerrule"
              :key="indexest"
              ref="itemest"
              size="mini"
              :rules="itemestRules"
              style="width:100%"
              :model="itemest"
            >
              <ol>
                <li>
                  <el-form-item style="margin-top:18px;" prop="sortNumber">{{itemest.sortNumber}}</el-form-item>
                </li>
                <li style="flex:3;display:flex;justify-content: space-around;">
                  <el-form-item style="margin:18px;" prop="scoreMin">
                    <el-input size="mini" v-model="itemest.scoreMin"></el-input>
                  </el-form-item>
                  <i class="el-icon-minus"></i>
                  <el-form-item style="margin:18px;" prop="scoreMax">
                    <el-input size="mini" v-model="itemest.scoreMax"></el-input>
                  </el-form-item>
                </li>
                <li style="flex:3">
                  <el-form-item style="margin:18px;width:90%" prop="resultDesc">
                    <el-input
                      type="textarea"
                      maxlength="1000"
                      resize="none"
                      v-model="itemest.resultDesc"
                    ></el-input>
                  </el-form-item>
                </li>
                <li style="border-right:none;">
                  <el-form-item style="margin:18px;width:100%">
                    <div class="table-btn">
                      <img @click="add(3)" src="./../images/icone-1.png" alt>
                      <img @click="remove(3,indexest)" src="./../images/icone-2.png" alt>
                    </div>
                  </el-form-item>
                </li>
              </ol>
            </el-form>
          </div>
        </el-card>
        <!--分数规则-->
        <el-card class="box-card" style="margin-top:20px;" shadow="hover">
          <div slot="header" class="clearfix">
            <span style="font-weight: 700;">分数规则</span>
          </div>

          <el-form-item label prop="resource">
            <el-radio-group v-model="form.resource">
              <el-radio :label="1">分数正常累加</el-radio>
              <el-radio :label="2">总得分乘以系数 ×
                <el-input
                  size="mini"
                  :disabled="form.resource !== 2 "
                  placeholder="请输入数字及小数点，小数点后只能输入2位"
                  style="width: 85%;margin-left: 20px"
                  v-model="form.scoreRate"
                ></el-input>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-card>
      </div>
    </el-form>
    <div class="add-btn">
      <el-button size="mini" style="width:100px" @click="$router.go(-1)" round>取 消</el-button>
      <el-button size="mini" style="width:100px" @click="submit(form)" type="primary" round>保 存</el-button>
    </div>
    <el-dialog title="提示" :append-to-body="true" :visible.sync="dialogVisible" width="30%">
      <p style="text-align:center">
        <i class="el-icon-warning" style="margin-right:10px;;font-size:18px;color:#e6a23c"></i>
        <span style="font-size:14px">保存后是否开启？开启后，用户就可以进行该测试！</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addSubmit(form,0)">否</el-button>
        <el-button size="mini" type="primary" @click="addSubmit(form,1)">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isValidFiveNumber, isValidNumScore } from "@/utils/RegExp.js";
var CheckSort = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入1-99999之间的数字"));
  } else if (!isValidFiveNumber(value)) {
    callback(new Error("请输入1-99999之间的数字"));
  } else {
    callback();
  }
};
var CheckScore = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入正确的分数"));
  } else if (!isValidNumScore(value)) {
    callback(new Error("请输入正确的分数"));
  } else {
    callback();
  }
};
var move = function(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};
export default {
  data() {
    return {
      loadingPic: false,
      loading: false,
      dialogVisible: false,
      form: {
        scoreRate: "", //分数规则
        resource: null,
        topical: "",
        description: "",
        orderNumber: "",
        channelId: "",
        imageUrl: "",
        subject: [
          {
            type: "1",
            sortNumber: 1,
            title: "",
            options: [
              {
                text: "",
                score: ""
              }
            ]
          }
        ],
        answerrule: [{ sortNumber: 1, scoreMax: "", scoreMin: "" }]
      },
      formRules: {
        topical: [
          { required: true, message: "请输入正确的标题", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: false, message: "请输入正确的描述", trigger: "blur" },
          {
            min: 0,
            max: 9999,
            message: "长度在 0 到 9999 个字符",
            trigger: "blur"
          }
        ],
        resource: [
          { required: true, message: "请选择分数规则", trigger: "change" }
        ],
        orderNumber: [
          {
            required: true,
            validator: CheckSort,
            trigger: "blur"
          }
        ],
        channelId: [
          { required: true, message: "请选择栏目信息", trigger: "change" }
        ],
        imageUrl: [
          { required: true, message: "请上传封面图片", trigger: "change" }
        ]
      },
      itemRules: {
        title: [
          { required: true, message: "请输入正确的问题设置", trigger: "blur" },
          { min: 1, max: 99, message: "长度在 1 到 99 个字符", trigger: "blur" }
        ]
      },
      itemerRules: {
        text: [
          { required: true, message: "请输入正确的选项", trigger: "blur" },
          {
            min: 1,
            max: 999,
            message: "长度在 1 到 999 个字符",
            trigger: "blur"
          }
        ],
        score: [
          {
            required: true,
            validator: CheckScore,
            trigger: "blur"
          }
        ]
      },
      itemestRules: {
        scoreMax: [
          {
            required: true,
            validator: CheckScore,
            trigger: "blur"
          }
        ],
        scoreMin: [
          {
            required: true,
            validator: CheckScore,
            trigger: "blur"
          }
        ],
        resultDesc: [
          { required: true, message: "请输入正确的规则描述", trigger: "blur" }
        ]
      },
      columnList: [],
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      }
    };
  },
  updated() {
    this.form.scoreRate = this.form.resource === 1 ? "" : this.form.scoreRate;
  },
  methods: {
    // 获取栏目信息
    getColumn() {
      this.$get("/data/my", {
        pathL: "/health/healthAssessmentChannel/channelList",
        pageNum: 1,
        pageSize: 999999999
      }).then(res => {
        if (res.state === 0) {
          this.columnList = res.data.result;
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
      this.form.imageUrl = response.data.url;
      if (this.form.imageUrl !== "" || this.form.imageUrl !== null) {
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
        this.loadingPic = false;
        this.$message({
          message: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
          center: true
        });
      }
      if (!isLt2M) {
        this.loadingPic = false;
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
    // 添加
    add(order, index, indexer) {
      switch (order) {
        case 1:
          let subject = this.form.subject;
          let questionFormLength = subject.length;
          let previousNumber = Number(
            subject[questionFormLength - 1].sortNumber
          );
          let newFormList = {
            type: "1",
            sortNumber: previousNumber + 1,
            title: "",
            options: [
              {
                text: "",
                score: ""
              }
            ]
          };
          this.form.subject.push(newFormList);
          break;
        case 2:
          let newDataList = {
            text: "",
            score: ""
          };
          this.form.subject[indexer].options.push(newDataList);
          break;
        case 3:
          let answerrule = this.form.answerrule;
          let ruleDataLength = answerrule.length;
          let previousOrder = Number(answerrule[ruleDataLength - 1].sortNumber);
          let newRuleDataList = {
            sortNumber: previousOrder + 1,
            scoreMin: "",
            scoreMax: "",
            resultDesc: ""
          };
          this.form.answerrule.push(newRuleDataList);
          break;
      }
    },
    // 删除
    remove(order, index, indexer) {
      switch (order) {
        case 1:
          if (this.form.subject.length === 1) {
            this.$message({
              message: "至少保留一个问题",
              type: "warning",
              center: true
            });
          } else {
            this.form.subject.splice(index, 1);
            for (var i in this.form.subject) {
              this.form.subject[i].sortNumber = Number(i) + 1;
            }
          }
          break;
        case 2:
          if (this.form.subject[indexer].options.length === 1) {
            this.$message({
              message: "至少保留一个选项",
              type: "warning",
              center: true
            });
          } else {
            this.form.subject[indexer].options.splice(index, 1);
          }
          break;
        case 3:
          if (this.form.answerrule.length === 1) {
            this.$message({
              message: "至少保留一个题目规则",
              type: "warning",
              center: true
            });
          } else {
            this.form.answerrule.splice(index, 1);
            for (var i in this.form.answerrule) {
              this.form.answerrule[i].sortNumber = Number(i) + 1;
            }
          }
          break;
      }
    },
    // 向上移动
    upData(order, index, indexer) {
      switch (order) {
        case 1:
          if (this.form.subject.length > 1 && index !== 0) {
            this.form.subject = move(this.form.subject, index, index - 1);
            for (var i in this.form.subject) {
              this.form.subject[i].sortNumber = Number(i) + 1;
            }
          } else {
            this.$message({
              message: "该题目已位于第一个位置",
              type: "warning",
              center: true
            });
          }
          break;
        case 2:
          if (this.form.subject[indexer].options.length > 1 && index !== 0) {
            this.form.subject[indexer].options = move(
              this.form.subject[indexer].options,
              index,
              index - 1
            );
          } else {
            this.$message({
              message: "该选项已位于第一个位置",
              type: "warning",
              center: true
            });
          }
          break;
      }
    },
    // 向下移动
    downData(order, index, indexer) {
      switch (order) {
        case 1:
          if (
            this.form.subject.length > 1 &&
            index !== this.form.subject.length - 1
          ) {
            this.form.subject = move(this.form.subject, index, index + 1);
            for (var i in this.form.subject) {
              this.form.subject[i].sortNumber = Number(i) + 1;
            }
          } else {
            this.$message({
              message: "该题目已位于最后一个位置",
              type: "warning",
              center: true
            });
          }
          break;
        case 2:
          if (
            this.form.subject[indexer].options.length > 1 &&
            index !== this.form.subject[indexer].options.length - 1
          ) {
            this.form.subject[indexer].options = move(
              this.form.subject[indexer].options,
              index,
              index + 1
            );
          } else {
            this.$message({
              message: "该选项已位于最后一个位置",
              type: "warning",
              center: true
            });
          }
          break;
      }
    },
    // 保存提交
    addSubmit(form, status) {
      if (this.dialogVisible) {
        this.loading = true;
        this.$post(
          "/data/new",
          this.$qs.stringify({
            pathL: "/health/healthAssessmentInfo/saveAssessment",
            topical: form.topical,
            description: form.description,
            orderNumber: form.orderNumber,
            channelId: form.channelId,
            imageUrl: form.imageUrl,
            status: status,
            subject: JSON.stringify(form.subject),
            answerrule: JSON.stringify(form.answerrule),
            scoreRate: this.form.resource === 1 ? 1 : Number(form.scoreRate)
          })
        ).then(res => {
          this.loading = false;
          if (res.state === 0) {
            this.$message({
              message: "保存成功",
              type: "success",
              center: true
            });
            this.$router.push({
              name: "知识库/健康评估/健康评估列表"
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
    // 保存
    submit(form) {
      let flag = true;
      let flager = true;
      let flagest = true;
      let score = true;
      for (let i = 0; i < this.$refs.item.length; i++) {
        this.$refs.item[i].validate(valid => {
          if (!valid) {
            flag = false;
          }
        });
      }
      for (let c = 0; c < this.$refs.itemer.length; c++) {
        this.$refs.itemer[c].validate(valid => {
          if (!valid) {
            flager = false;
          }
        });
      }
      for (let m = 0; m < form.answerrule.length; m++) {
        this.$refs.itemest[m].validate(valid => {
          if (!valid) {
            flagest = false;
          }
        });
        if (
          Number(form.answerrule[m].scoreMin) >
          Number(form.answerrule[m].scoreMax)
        ) {
          score = false;
        }
      }

      if (this.form.resource === 2) {
        if (/^\d+(\.\d{1,2})?$/.test(this.form.scoreRate)) {
        } else {
          this.$message({
            message: "得分系数格式不正确",
            type: "warning",
            center: true
          });
          return;
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (flag) {
            if (flager) {
              if (flagest) {
                if (score) {
                  this.dialogVisible = true;
                } else {
                  this.$message({
                    message: "题目规则分数后者必须大于前者",
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
  },
  mounted() {
    this.getColumn();
  }
};
</script>

<style scoped>
.add {
  width: 100%;
  height: 100%;
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
.add-top {
  display: flex;
  padding: 20px 20px 10px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.wrap {
  display: flex;
}
.add-bottom {
  width: 60%;
  margin: 20px 0 20px 100px;
}
.add-top-left {
  flex: 2;
}
.add-top-right {
  flex: 1;
}
.type {
  float: right;
}
.number {
  display: flex;
  align-items: center;
}
.number ul {
  display: flex;
}
.number ul li {
  cursor: pointer;
  margin: 0 20px;
}
.tables {
  border: 1px solid #ccc;
  border-bottom: none;
}
.tables ul,
.tables ol {
  transition: 0.6s;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  border-bottom: 1px solid #ccc;
}
.tables ul li,
.tables ol li {
  font-size: 14px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ccc;
}
.tables ul li {
  line-height: 40px;
  font-weight: 700;
  color: #909399;
}
.tables ol:hover {
  background: #ecf5ff;
}
.table-btn {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.table-btn img {
  cursor: pointer;
}
.score {
  display: flex;
  align-items: center;
}
.add-btn {
  width: 60%;
  height: 100px;
  display: flex;
  margin-left: 100px;
  align-items: center;
  justify-content: space-around;
}
</style>
