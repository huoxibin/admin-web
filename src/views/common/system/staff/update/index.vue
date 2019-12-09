<template>
  <div class="addyg">
    <div class="add_top">修改员工</div>
    <div class="addyg_show">
      <el-form ref="updataFrom" :model="updataFrom" :rules="updataFromRules" label-width="120px" size="mini" label-suffix="：">
        <div class="form">
          <div class="left">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="updataFrom.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="updataFrom.sex" slot-scope="scope">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日日期">
              <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="updataFrom.birthDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="updataFrom.mobile"></el-input>
            </el-form-item>
            <el-form-item label="所属区域" prop="areaId">
              <el-select style="width:100%" v-model="updataFrom.areaName" placeholder="请选择所属区域" @change="areaNameChange">
                <el-option v-for="item,index in divs" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="监管区域">
              <div class="time">
                <div class="sigleMarkPlace"></div>
                <el-select v-model="updataFrom.superviseProvinceId" @change="superviseProvinceIdChange">
                  <el-option label="无" :value="-1"></el-option>
                  <el-option label="全国" :value="0"></el-option>
                  <el-option v-for="item,index in superviseProvinceList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="updataFrom.superviseCityId" @change="superviseCityIdChange">
                  <el-option v-for="item,index in superviseCityList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="updataFrom.superviseCountyId">
                  <el-option v-for="item,index in superviseCountyList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item label="所属分部">
              <el-select style="width:100%" v-model="updataFrom.divisionName" placeholder="请选择所属分部" @change="divisionNameChange">
                <el-option v-for="item,index in firstDivs" :key="index" :label="item.divisionName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-select style="width:100%" v-model="updataFrom.deparName" placeholder="请选择部门">
                <el-option v-for="item,index in departs" :key="index" :label="item.departmentName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否是负责人">
              <el-radio-group v-model="updataFrom.isLeader">
                <el-radio :label=1>是</el-radio>
                <el-radio :label=0>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="职位">
              <el-select style="width:100%" v-model="updataFrom.titleName" placeholder="请选择职位">
                <el-option v-for="item,index in titles" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收审核短信">
              <el-checkbox v-model="updataFrom.receiveAuditMessage">接收</el-checkbox>
              <p style="color:#f00;">用于接收医生审核提醒</p>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="头像">
              <div class="addygtx_wrap">
                <div class="addygtx">
                  <img style="width:100%;height:100%" :src="updataFrom.headImg" alt="">
                </div>
                <div class="ygtx-right" style="margin-left:30px;">
                  <el-button @click="txShow=true" type="primary">
                    <i class="el-icon-upload el-icon--right"></i>上传</el-button>
                  <p style="color:#606266;">仅限*.jpg,*.jpeg,*.gif,*.png,*.bmp图片格式</p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select style="width:100%" v-model="updataFrom.roleName" placeholder="请选择角色">
                <el-option v-for="item,index in roles" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码">
              <el-input v-model="updataFrom.cardNo"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="loginName">
              <el-input v-model="updataFrom.loginName"></el-input>
            </el-form-item>
            <el-form-item label="常用邮箱">
              <el-input v-model="updataFrom.email"></el-input>
            </el-form-item>
            <el-form-item label="qq">
              <el-input v-model="updataFrom.qqNo"></el-input>
            </el-form-item>
            <el-form-item label="微信">
              <el-input v-model="updataFrom.wechatNo"></el-input>
            </el-form-item>
            <el-form-item label="现住址">
              <div class="live" style="display:flex;">
                <el-select v-model="updataFrom.provinceId" placeholder="请选择" @change="cityChange">
                  <el-option v-for="item,index in city" :key="index" :label="item.shortName" :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="updataFrom.cityId" placeholder="请选择">
                  <el-option v-for="item,index in cityer" :key="index" :label="item.shortName" :value="item.id">
                  </el-option>
                </el-select>
                <el-input style="width:100%;" v-model="updataFrom.address"></el-input>
              </div>
            </el-form-item>
          </div>
        </div>

      </el-form>
    </div>
    <div class="addyg_btn">
      <el-button @click="updata(updataFrom)" size="mini" style="width:100px" type="primary">保存</el-button>
      <el-button @click="back" style="width:100px" size="mini" plain>取消</el-button>
    </div>
    <!-- 上传头像模态框 -->
    <div class="txload" v-show="txShow">
      <div class="txload_content">
        <div class="txload_top">
          <span>上传图片</span>
          <i @click="txShow=false" class="el-icon-close"></i>
        </div>
        <div class="txload_bottom">
          <div class="bdsc">
            <div class="bdsc_show">
              <el-upload class="upload-demo" :headers="uploadHeaders" :on-success="onSuccess" :data="fileLister" name="file" :action="uploadUrl" :on-preview="handlePreview" :before-upload="beforeAvatarUpload" auto-upload list-type="picture" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
              </el-upload>
            </div>
            <div class="first_btn">
              <el-button @click="uploadTx" size="mini" type="primary">确定</el-button>
              <el-button @click="txShow=false" size="mini" type="info" plain>取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isValidPhone } from "@/utils/RegExp.js";
var CheckTel = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isValidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      },
      fileList: [],
      fileLister: {},
      city: [],
      cityer: [],
      txShow: false,
      updataFrom: {},
      divs: [],
      firstDivs: [],
      departs: [],
      roles: [],
      titles: [],
      superviseProvinceList: [],
      superviseCityList: [],
      superviseCountyList: [],
      updataFromRules: {
        userName: [
          {
            required: true,
            message: "内容不能为空，且字数控制在50个字之内！",
            trigger: "blur"
          },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            validator: CheckTel,
            trigger: "blur"
          }
        ],
        areaId: [
          { required: true, message: "请选择所属区域", trigger: "change" }
        ],
        roleId: [
          { required: true, message: "请选择所属区域", trigger: "change" }
        ],
        loginName: [
          {
            required: true,
            message: "请输入合理的用户名！",
            trigger: "blur"
          },
          { min: 6, max: 16, message: "长度在6-16位以内。", trigger: "blur" }
        ]
      },
      imgUrl: "",
      areaId: null
    };
  },
  methods: {
    areaNameChange(val) {
      this.areaId = val;
      this.updataFrom.deparName = "";
      this.updataFrom.divisionName = "";
      this.$axios
        .post("/data/my", {
          pathL: "/ap/sysDivision/list",
          parentId: val
        })
        .then(res => {
          if (res.data.state === 0) {
            this.firstDivs = res.data.data;
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
      this.$axios
        .post("/data/my", {
          pathL: "/ap/sysDepartment/list",
          areaId: val
        })
        .then(res => {
          if (res.data.state === 0) {
            this.departs = res.data.data.page.result;
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
    divisionNameChange(val) {
      this.updataFrom.deparName = "";
      let that=this;
      this.$get("/data/my", {
          pathL: "/ap/sysDepartment/queryListByAreaIdAndDivision",
          divisionId: val,
          areaId: this.areaId
        })
        .then(res => {
          if (res.state === 0) {
						that.departs = res.data;
          } else {
						that.$message({
              type: "info",
              message: res.msg,
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    superviseProvinceIdChange(val) {
      this.updataFrom.superviseCityId = "";
      this.updataFrom.superviseCountyId = "";
      this.superviseCityList = [];
      this.superviseCountyList = [];
      if (val !== 0 && val !== -1) {
        this.$get("/data/my", {
          pathL: "/common/area/findAreaList",
          provinceId: val
        }).then(res => {
          if (res.state === 0) {
            this.superviseCityList = res.data;
          } else {
            this.$message({
              type: "info",
              message: res.data.msg,
              center: true
            });
          }
        });
      }
    },
    superviseCityIdChange(val) {
      this.updataFrom.superviseCountyId = "";
      this.superviseCountyList = [];
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        cityId: val
      }).then(res => {
        if (res.state === 0) {
          this.superviseCountyList = res.data;
        } else {
          this.$message({
            type: "info",
            message: res.data.msg,
            center: true
          });
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
    uploadTx() {
      this.updataFrom.headImg = this.imgUrl;
      this.txShow = false;
    },
    onSuccess(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      this.imgUrl = response.data.url;
      this.fileList = fileUrl;
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
    handleChange(val) {
      console.log(val);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
    updata(updataFrom) {
      var areaName = typeof updataFrom.areaName;
      var divisionName = typeof updataFrom.divisionName;
      var deparName = typeof updataFrom.deparName;
      var titleName = typeof updataFrom.titleName;
      var roleName = typeof updataFrom.roleName;
      var provinceName = typeof updataFrom.provinceName;
      var cityName = typeof updataFrom.cityName;
      if (areaName == "string") {
        updataFrom.areaName = updataFrom.areaId;
      }
      if (divisionName == "string") {
        updataFrom.divisionName = updataFrom.divisionId;
      }
      if (deparName == "string") {
        updataFrom.deparName = updataFrom.departmentId;
      }
      if (titleName == "string") {
        updataFrom.titleName = updataFrom.titleId;
      }
      if (roleName == "string") {
        updataFrom.roleName = updataFrom.roleId;
      }
      if (provinceName == "string") {
        updataFrom.provinceName = updataFrom.provinceId;
      }
      if (cityName == "string") {
        updataFrom.cityName = updataFrom.cityId;
      }
      this.$refs.updataFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/data/my",
              this.$qs.stringify({
                pathL: "/ap/sysUser/save",
                id: Number(updataFrom.id),
                areaId: updataFrom.areaName,
                loginName: updataFrom.loginName,
                userName: updataFrom.userName,
                mobile: updataFrom.mobile,
                email: updataFrom.email,
                departmentId: updataFrom.deparName,
                birthDate: updataFrom.birthDate,
                sex: Number(updataFrom.sex),
                divisionId: updataFrom.divisionName,
                cardNo: updataFrom.cardNo,
                wechatNo: updataFrom.wechatNo,
                qqNo: updataFrom.qqNo,
                titleId: updataFrom.titleName,
                headImg: updataFrom.headImg,
                roleId: updataFrom.roleName,
                address: updataFrom.address,
                provinceId: updataFrom.provinceName,
                cityId: updataFrom.cityName,
								isLeader: Number(updataFrom.isLeader),
                receiveAuditMessage: Number(updataFrom.receiveAuditMessage),
                superviseProvinceId: updataFrom.superviseProvinceId,
                superviseCityId:
                  updataFrom.superviseCityId === ""
                    ? 0
                    : updataFrom.superviseCityId,
                superviseCountyId:
                  updataFrom.superviseCountyId === ""
                    ? 0
                    : updataFrom.superviseCountyId
              })
            )
            .then(res => {
              if (res.data.state === 0) {
                this.$message({
                  type: "success",
                  message: "修改成功！",
                  center: true
                });
                this.$router.push({ name: "系统设置/员工管理/员工列表" });
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
    cityChange(val) {
      this.updataFrom.cityId = "";
      this.cityer = [];
      this.$axios
        .get("/data/my", {
          params: {
            pathL: "/common/area/getCities",
            parentId: val
          }
        })
        .then(res => {
          if (res.data.state === 0) {
            var cityer = res.data.data;
            for (var q = 0; q < cityer.length; q++) {
              this.cityer.push({
                shortName: cityer[q].shortName,
                id: cityer[q].id
              });
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
    }
  },
  mounted() {
    var updataId = this.$route.query.id;
    this.$axios
      .post("/data/my", {
        pathL: "/ap/sysUser/details",
        id: updataId
      })
      .then(res => {
        if (res.data.state === 0) {
          this.updataFrom = res.data.data;
          if (this.updataFrom.superviseCityId === 0) {
            this.updataFrom.superviseCityId = "";
          }
          if (this.updataFrom.superviseCountyId === 0) {
            this.updataFrom.superviseCountyId = "";
          }
          this.$get("/data/my", {
            pathL: "/common/area/findAreaList",
            provinceId: 0
          }).then(res => {
            if (res.state === 0) {
              this.superviseProvinceList = res.data;
            } else {
              this.$message({
                type: "info",
                message: res.data.msg,
                center: true
              });
            }
          });
          if (
            res.data.data.superviseProvinceId !== 0 &&
            res.data.data.superviseProvinceId !== -1
          ) {
            this.$get("/data/my", {
              pathL: "/common/area/findAreaList",
              provinceId: this.updataFrom.superviseProvinceId
            }).then(res => {
              if (res.state === 0) {
                this.superviseCityList = res.data;
              } else {
                this.$message({
                  type: "info",
                  message: res.data.msg,
                  center: true
                });
              }
            });
            this.$get("/data/my", {
              pathL: "/common/area/findAreaList",
              cityId: this.updataFrom.superviseCityId
            }).then(res => {
              if (res.state === 0) {
                this.superviseCountyList = res.data;
              } else {
                this.$message({
                  type: "info",
                  message: res.data.msg,
                  center: true
                });
              }
            });
          }
          this.$axios
            .get("/data/my", {
              params: {
                pathL: "/common/area/getCities",
                parentId: this.updataFrom.provinceId
              }
            })
            .then(res => {
              if (res.data.state === 0) {
                var city = res.data.data;
                for (var i = 0; i < city.length; i++) {
                  this.cityer.push({
                    shortName: city[i].shortName,
                    id: city[i].id
                  });
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
          switch (this.updataFrom.receiveAuditMessage) {
            case 0:
              this.updataFrom.receiveAuditMessage = false;
              break;
            case 1:
              this.updataFrom.receiveAuditMessage = true;
              break;
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
    this.$axios
      .post("/data/my", {
        pathL: "/ap/sysUser/list",
        pageSize: this.pageSize
      })
      .then(res => {
        if (res.data.state === 0) {
          this.pageLength = res.data.data.page.total;
          this.tableData = res.data.data.page.result;
          var divs = res.data.data.divs;
          var titles = res.data.data.titles;
          var roles = res.data.data.roles;
          for (var i = 0; i < divs.length; i++) {
            this.divs.push({
              title: divs[i].divisionName,
              id: divs[i].id,
              parentId: divs[i].parentId
            });
          }
          for (var c = 0; c < titles.length; c++) {
            this.titles.push({
              title: titles[c].titleName,
              id: titles[c].id,
              parentId: titles[c].parentId
            });
          }
          for (var d = 0; d < roles.length; d++) {
            this.roles.push({
              title: roles[d].roleName,
              id: roles[d].id,
              parentId: roles[d].parentId
            });
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
    this.$axios
      .get("/data/my", {
        params: {
          pathL: "/common/area/getProvinces"
        }
      })
      .then(res => {
        if (res.data.state === 0) {
          var city = res.data.data;
          for (var i = 0; i < city.length; i++) {
            this.city.push({ shortName: city[i].shortName, id: city[i].id });
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
  }
};
</script>

<style scoped>
.addyg {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.add_top {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #ccc;
  color: #666;
  font-size: 14px;
  padding: 0 20px;
  box-sizing: border-box;
  line-height: 40px;
  background-color: rgba(243, 243, 243, 1);
}
.form {
  display: flex;
}
.left,
.right {
  flex: 1;
}
.addyg_show {
  margin: 20px;
  overflow: hidden;
}
.addyg_btn {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.addygtx {
  width: 100px;
  height: 100px;
}
.addygtx_wrap {
  display: flex;
  align-items: center;
}
.txload_top {
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
.txload {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 999;
  justify-content: center;
  align-items: center;
}

.txload_content {
  width: 800px;
  height: 500px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: #fff;
}

.txload_top i {
  float: right;
  margin: 8px 10px 0 0;
  cursor: pointer;
}
.txload_bottom {
  width: 100%;
  height: 470px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
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
.time {
  width: 100%;
  display: flex;
}
.sigleMarkPlace{
  position: relative;
}
.sigleMarkPlace:before{
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: -93px;
}
</style>
