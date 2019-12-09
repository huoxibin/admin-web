<template>
  <div class="flgl">

    <div class="flgl_left">
      <div class="flgl_title">区域及分部办事处</div>
      <div class="flgl_tree">
        <el-tree highlight-current :data="flglData" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="[1]" node-key="id"></el-tree>
      </div>
    </div>
    <div class="flgl_right">

      <div class="flgl_top">
        <p>基本信息</p>
        <el-button @click="xzdq" v-show="oneBtnShow" size="mini" type="primary" plain>新增大区</el-button>
        <div class="zflBtn" v-show="twoBtnShow">
          <el-button @click="xzfq" style="width:100px;" size="mini" type="primary" plain>新增办事处</el-button>
          <el-button @click="remove" style="width:100px;" size="mini" type="info" plain>删除</el-button>
        </div>
      </div>

      <div class="flgl_bottom">

        <div class="add" v-show="boxShow==='add'">

          <!-- 表单 -->
          <el-form ref="addFrom" label-suffix="：" size="mini" :model="addFrom" :rules="addFromRules" label-width="120px">
            <el-form-item label="名称" prop="divisionName">
              <el-input ref="divisionName" style="width:400px" v-model="addFrom.divisionName"></el-input>
              <span style="margin-left:10px;color:#666;">字数：{{addNameLength}}</span>
            </el-form-item>

            <el-form-item label="启用与禁用" prop="status">
              <el-radio-group v-model="addFrom.status">
                <el-radio label=1>启用</el-radio>
                <el-radio label=2>禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input ref="sort" style="width:400px" v-model="addFrom.sort"></el-input>
            </el-form-item>

            <el-form-item label="引导图" prop="ydt">
              <img style="float:left;max-width:200px;" :src="addFrom.guidIconUrl" alt="">
              <div class="ydtBtn">
                <el-button @click="addUploadShow=true" type="primary">
                  <i class="el-icon-upload el-icon--right"></i>上传图片</el-button>
                <p style="color:#666;">
                  <span>仅限</span>
                  <span>.jpg .jpeg .gif .png .bmp</span>
                  <span>等图片格式</span>
                </p>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button @click="add(addFrom)" style="width:80px;" size="mini" type="primary">保存</el-button>
              <el-button @click="back" style="width:80px;" size="mini" type="info" plain>取消</el-button>
            </el-form-item>
          </el-form>

          <!-- 引导图模态框 -->
          <div class="guideModel" v-show="addUploadShow">
            <div class="ydt_content">
              <div class="ydt_top">
                <span>上传图片</span>
                <i @click="addUploadShow=false" class="el-icon-close"></i>
              </div>
              <div class="ydt_bottom">
                <el-tabs style="height:100%" v-model="activeName">
                  <el-tab-pane label="本地上传" name="first">
                    <div class="bdsc">
                      <div class="bdsc_show">
                        <el-upload class="upload-demo" :headers="uploadHeaders" :action="uploadUrl" :on-preview="handlePreview" :before-upload="beforeAvatarUpload" :on-success="onSuccessAdd" auto-upload list-type="picture" multiple :limit=1 :on-exceed="handleExceed" :data="fileListAdder" :file-list="fileListAdd" name="file" v-model="addFrom">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
                        </el-upload>
                      </div>
                      <div class="first_btn">
                        <el-button @click="addOk" size="mini" type="primary">确定</el-button>
                        <el-button @click="addUploadShow=false" size="mini" type="info" plain>取消</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>

        <div class="updata" v-show="boxShow==='updata'">

          <!-- 表单 -->
          <el-form ref="updataFrom" label-suffix="：" size="mini" :model="updataFrom" :rules="updataFromRules" label-width="120px">
            <el-form-item label="名称" prop="divisionName">
              <el-input style="width:400px" v-model="updataFrom.divisionName"></el-input>
              <span style="margin-left:10px;color:#666;">字数：{{updataNameLength}}</span>
            </el-form-item>

            <el-form-item label="启用与禁用" prop="status">
              <el-radio-group v-model="updataFrom.status">
                <el-radio :label=1>启用</el-radio>
                <el-radio :label=2>禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input ref="sort" style="width:400px" v-model="updataFrom.sort"></el-input>
            </el-form-item>

            <el-form-item label="引导图" prop="guidIconUrl">
              <img style="float:left;max-width:200px" :src="updataFrom.guidIconUrl" alt="">
              <div class="ydtBtn">
                <el-button @click="updataUploadShow=true" type="primary">
                  <i class="el-icon-upload el-icon--right"></i>上传图片</el-button>
                <p style="color:#666;">
                  <span>仅限</span>
                  <span>.jpg .jpeg .gif .png .bmp</span>
                  <span>等图片格式</span>
                </p>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button @click="updata(updataFrom)" style="width:80px;" size="mini" type="primary">保存</el-button>
              <el-button @click="back" style="width:80px;" size="mini" type="info" plain>取消</el-button>
            </el-form-item>
          </el-form>

          <!-- 引导图模态框 -->
          <div class="guideModel" v-show="updataUploadShow">
            <div class="ydt_content">
              <div class="ydt_top">
                <span>上传图片</span>
                <i @click="updataUploadShow=false" class="el-icon-close"></i>
              </div>
              <div class="ydt_bottom">
                <el-tabs style="height:100%" v-model="activeName">
                  <el-tab-pane label="本地上传" name="first">
                    <div class="bdsc">
                      <div class="bdsc_show">
                        <el-upload class="upload-demo" :headers="uploadHeaders" :action="uploadUrl" :on-preview="handlePreview" :before-upload="beforeAvatarUpload" :on-success="onSuccessUpdata" auto-upload list-type="picture" multiple :limit=1 :on-exceed="handleExceed" :data="fileListUpdataer" :file-list="fileListUpdata" name="file" v-model="updataFrom">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
                        </el-upload>
                      </div>
                      <div class="first_btn">
                        <el-button @click="updataOk" size="mini" type="primary">确定</el-button>
                        <el-button @click="updataUploadShow=false" size="mini" type="info" plain>取消</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>

        </div>

        <div class="adder" v-show="boxShow==='adder'">
          <!-- 表单 -->
          <el-form ref="adderFrom" label-suffix="：" size="mini" :model="adderFrom" :rules="adderFromRules" label-width="120px">
            <el-form-item label="名称" prop="divisionName">
              <el-input ref="divisionName" style="width:400px" v-model="adderFrom.divisionName"></el-input>
              <span style="margin-left:10px;color:#666;">字数：{{adderNameLength}}</span>
            </el-form-item>

            <el-form-item label="启用与禁用" prop="status">
              <el-radio-group v-model="adderFrom.status">
                <el-radio label=1>启用</el-radio>
                <el-radio label=2>禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input ref="sort" style="width:400px" v-model="adderFrom.sort"></el-input>
            </el-form-item>

            <el-form-item label="引导图" prop="guidIconUrl">
              <img style="float:left;max-width:200px" :src="adderFrom.guidIconUrl" alt="">
              <div class="ydtBtn">
                <el-button @click="adderUploadShow=true" type="primary">
                  <i class="el-icon-upload el-icon--right"></i>上传图片</el-button>
                <p style="color:#666;">
                  <span>仅限</span>
                  <span>.jpg .jpeg .gif .png .bmp</span>
                  <span>等图片格式</span>
                </p>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button @click="adder(adderFrom)" style="width:80px;" size="mini" type="primary">保存</el-button>
              <el-button @click="back" style="width:80px;" size="mini" type="info" plain>取消</el-button>
            </el-form-item>
          </el-form>

          <!-- 引导图模态框 -->
          <div class="guideModel" v-show="adderUploadShow">
            <div class="ydt_content">
              <div class="ydt_top">
                <span>上传图片</span>
                <i @click="adderUploadShow=false" class="el-icon-close"></i>
              </div>
              <div class="ydt_bottom">
                <el-tabs style="height:100%" v-model="activeName">
                  <el-tab-pane label="本地上传" name="first">
                    <div class="bdsc">
                      <div class="bdsc_show">
                        <el-upload class="upload-demo" :headers="uploadHeaders" :action="uploadUrl" :on-preview="handlePreview" :before-upload="beforeAvatarUpload" :on-success="onSuccessAdder" auto-upload list-type="picture" multiple :limit=1 :on-exceed="handleExceed" :data="fileListAdderer" :file-list="fileListAddera" name="file" v-model="adderFrom">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
                        </el-upload>
                      </div>
                      <div class="first_btn">
                        <el-button @click="adderOk" size="mini" type="primary">确定</el-button>
                        <el-button @click="adderUploadShow=false" size="mini" type="info" plain>取消</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>

  </div>
</template>

<script>
import { isValidFiveNumber } from "@/utils/RegExp.js";
var CheckSort = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入正整数进行排序！"));
  } else if (!isValidFiveNumber(value)) {
    callback(new Error("请输入五位正整数进行排序！"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      addUploadShow: false,
      adderUploadShow: false,
      updataUploadShow: false,
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      },
      addNameLength: 0,
      adderNameLength: 0,
      updataNameLength: 0,
      oneBtnShow: true,
      twoBtnShow: false,
      boxShow: null,
      flglData: [],
      dataFrom: {},
      addFrom: {
        divisionName: "",
        status: "",
        sort: "",
        guidIconUrl: ""
      },
      adderFrom: {
        divisionName: "",
        status: "",
        sort: "",
        guidIconUrl: ""
      },
      updataFrom: {},
      addFromRules: {
        divisionName: [
          {
            required: true,
            message: "内容不能为空，且字数控制在6个字之内！",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "内容不能为空，且字数控制在5个字之内！",
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "请选择启用或者禁用", trigger: "blur" }
        ],
        sort: [
          {
            required: true,
            validator: CheckSort,
            trigger: "blur"
          }
        ]
      },
      adderFromRules: {
        divisionName: [
          {
            required: true,
            message: "内容不能为空，且字数控制在6个字之内！",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "内容不能为空，且字数控制在5个字之内！",
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "请选择启用或者禁用", trigger: "blur" }
        ],
        sort: [
          {
            required: true,
            validator: CheckSort,
            trigger: "blur"
          }
        ]
      },
      updataFromRules: {
        divisionName: [
          {
            required: true,
            message: "内容不能为空，且字数控制在6个字之内！",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "内容不能为空，且字数控制在5个字之内！",
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "请选择启用或者禁用", trigger: "blur" }
        ],
        sort: [
          {
            required: true,
            validator: CheckSort,
            trigger: "blur"
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "divisionName"
      },
      activeName: "first",
      fileListAdd: [],
      fileListAddera: [],
      fileListAdder: {},
      fileListAdderer: {},
      fileListUpdata: [],
      fileListUpdataer: {},
      ydtImage: ""
    };
  },
  methods: {
    loadTree() {
      this.$axios
        .post("/data/my", {
          pathL: "/ap/sysDivision/tree"
        })
        .then(res => {
          if (res.data.state === 0) {
            this.flglData = res.data.data;
          } else {
            this.$message({
              type: "info",
              message: res.data.msg,
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    back() {
      window.location.reload();
    },
    beforeAvatarUpload(file) {
      const extension = file.type === "image/jpg";
      const extension2 = file.type === "image/jpeg";
      const extension3 = file.type === "image/gif";
      const extension4 = file.type === "image/png";
      const extension5 = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 10;
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
          message: "上传图片大小不能超过10MB!",
          center: true
        });
      }
      return (
        (extension || extension2 || extension3 || extension4 || extension5) &&
        isLt2M
      );
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onSuccessAdd(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      this.ydtImage = response.data.url;
      this.fileListAdd = fileUrl;
    },
    onSuccessAdder(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      this.ydtImage = response.data.url;
      this.fileListAdder = fileUrl;
    },
    onSuccessUpdata(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      this.ydtImage = response.data.url;
      this.fileListUpdata = fileUrl;
    },
    addOk() {
      this.addFrom.guidIconUrl = this.ydtImage;
      this.addUploadShow = false;
    },
    adderOk() {
      this.adderFrom.guidIconUrl = this.ydtImage;
      this.adderUploadShow = false;
    },
    updataOk() {
      this.updataFrom.guidIconUrl = this.ydtImage;
      this.updataUploadShow = false;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    xzdq() {
      this.boxShow = "add";
      this.oneBtnShow = false;
      this.$refs["addFrom"].resetFields();
    },
    xzfq() {
      this.boxShow = "adder";
      this.$refs["adderFrom"].resetFields();
    },
    add(addFrom) {
      this.$refs.addFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post("/data/my", {
              pathL: "/ap/sysDivision/duplicate",
              divisionName: addFrom.divisionName,
              parentId: "0",
              sort: addFrom.sort
            })
            .then(res => {
              if (res.data.state === 0) {
                this.$axios
                  .post("/data/my", {
                    pathL: "/ap/sysDivision/save/",
                    divisionName: addFrom.divisionName,
                    parentId: "0",
                    status: addFrom.status,
                    sort: addFrom.sort,
                    guidIconUrl: addFrom.guidIconUrl,
                    pathIds: "1",
                    level: "1"
                  })
                  .then(res => {
                    if (res.data.state === 0) {
                      this.$message({
                        message: "新增成功",
                        type: "success",
                        center: true
                      });
                      this.loadTree();
                      for (var i in this.addFrom) {
                        this.addFrom[i] = "";
                      }
                    } else {
                      this.$message({
                        type: "info",
                        message: res.data.msg,
                        center: true
                      });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                this.$message({
                  type: "info",
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    },
    updata(updataFrom) {
      this.$refs.updataFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post("/data/my", {
              pathL: "/ap/sysDivision/duplicate",
              id: updataFrom.id,
              divisionName: updataFrom.divisionName,
              parentId: updataFrom.parentId,
              sort: updataFrom.sort
            })
            .then(res => {
              if (res.data.state === 0) {
                this.$axios
                  .post("/data/my", {
                    pathL: "/ap/sysDivision/update",
                    id: updataFrom.id,
                    divisionName: updataFrom.divisionName,
                    status: updataFrom.status,
                    sort: updataFrom.sort,
                    guidIconUrl: updataFrom.guidIconUrl
                  })
                  .then(res => {
                    if (res.data.state === 0) {
                      this.$message({
                        type: "success",
                        message: "修改成功！",
                        center: true
                      });
                      this.loadTree();
                    } else {
                      this.$message({
                        type: "info",
                        message: res.data.msg,
                        center: true
                      });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                this.$message({
                  type: "info",
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    },
    adder(adderFrom) {
      var parentId = this.dataFrom.id;
      var pathIds = this.dataFrom.id;
      var level = Number(this.dataFrom.level) + 1;
      this.$refs.adderFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post("/data/my", {
              pathL: "/ap/sysDivision/duplicate",
              divisionName: adderFrom.divisionName,
              parentId: parentId,
              sort: adderFrom.sort
            })
            .then(res => {
              if (res.data.state === 0) {
                this.$axios
                  .post("/data/my", {
                    pathL: "/ap/sysDivision/save/",
                    divisionName: adderFrom.divisionName,
                    parentId: parentId,
                    status: adderFrom.status,
                    sort: adderFrom.sort,
                    guidIconUrl: adderFrom.guidIconUrl,
                    pathIds: pathIds,
                    level: level
                  })
                  .then(res => {
                    if (res.data.state === 0) {
                      this.$message({
                        type: "success",
                        message: "添加成功！",
                        center: true
                      });
                      this.loadTree();
                    } else {
                      this.$message({
                        type: "info",
                        message: res.data.msg,
                        center: true
                      });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                this.$message({
                  type: "info",
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    },
    handleNodeClick(data) {
      if (data.id !== 0) {
        this.$refs["updataFrom"].resetFields();
        this.$axios
          .post("/data/my", {
            pathL: "/ap/sysDivision/detail",
            id: data.id
          })
          .then(res => {
            if (res.data.state === 0) {
              this.oneBtnShow = false;
              this.twoBtnShow = true;
              this.dataFrom = data;
              this.boxShow = "updata";
              this.updataFrom = res.data.data;
            } else {
              this.$message({
                type: "info",
                message: res.data.msg,
                center: true
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    remove() {
      var removeId = this.updataFrom.id;
      this.$confirm("确定要删除吗", "删除分区", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/data/my", {
              pathL: "/ap/sysDivision/remove",
              id: removeId
            })
            .then(res => {
              if (res.data.state === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                  center: true
                });
                this.loadTree();
              } else {
                this.$message({
                  type: "info",
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.loadTree();
  },
  updated() {
    if (this.addFrom.divisionName) {
      this.addNameLength = this.addFrom.divisionName.length;
    }
    if (this.adderFrom.divisionName) {
      this.adderNameLength = this.adderFrom.divisionName.length;
    }
    if (this.updataFrom.divisionName) {
      this.updataNameLength = this.updataFrom.divisionName.length;
    }
  }
};
</script>

<style scoped>
.flgl {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
}

.ydt_top {
  width: 100%;
  height: 30px;
  text-align: center;
  color: #333;
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
  line-height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  border-radius: 4px 4px 0 0;
}

.flgl_left {
  width: 260px;
  min-height: 600px;
  border: 1px solid #ccc;
  background: #fff;
  padding: 1px;
  overflow: auto;
  margin-right: 5px;
}

.ydt_content {
  width: 800px;
  height: 500px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: #fff;
}

.ydt_top i {
  float: right;
  margin: 8px 10px 0 0;
  cursor: pointer;
}

.first_btn {
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #ccc;
}

.ydt_bottom {
  width: 100%;
  height: 470px;
  box-sizing: border-box;
  padding: 10px;
}

.bdsc {
  width: 100%;
  height: 400px;
}

.bdsc_show {
  width: 100%;
  height: 340px;
  overflow: auto;
}

.flgl_title {
  width: 100%;
  height: 40px;
  color: #666;
  text-align: center;
  line-height: 40px;
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
}

.flgl_right {
  flex: 1;
  height: auto;
  overflow: hidden;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.flgl_top {
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flgl_top p {
  color: #666;
  font-size: 14px;
  font-weight: 600;
}

.flgl_bottom {
  padding: 20px;
  box-sizing: border-box;
}

.ydtBtn {
  float: left;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
}

.guideModel {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 9999;
  justify-content: center;
  align-items: center;
}
</style>
