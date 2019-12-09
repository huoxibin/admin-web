<template>
  <div class="addyg">
    <div class="add_top">新增员工</div>
    <div class="addyg_show">
      <el-form ref="addFrom" :model="addFrom" size="mini" :rules="addFromRules" label-width="120px" label-suffix="：">
        <div class="form">
          <div class="left">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="addFrom.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="addFrom.sex">
                <el-radio label=1>男</el-radio>
                <el-radio label=2>女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日日期">
              <el-date-picker style="width:100%" v-model="addFrom.birthDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="addFrom.mobile"></el-input>
            </el-form-item>
            <el-form-item label="所属区域" prop="areaId">
              <el-select style="width:100%" v-model="addFrom.areaId" placeholder="请选择所属区域" @change="areaIdChange">
                <el-option v-for="item,index in divs" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="监管区域">
              <div class="time">
                <div class="sigleMarkPlace"></div>
                <el-select v-model="addFrom.superviseProvinceId" @change="superviseProvinceIdChange">
                  <el-option label="无" :value="-1"></el-option>
                  <el-option label="全国" :value="0"></el-option>
                  <el-option v-for="item,index in superviseProvinceList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="addFrom.superviseCityId" @change="superviseCityIdChange">
                  <el-option v-for="item,index in superviseCityList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="addFrom.superviseCountyId">
                  <el-option v-for="item,index in superviseCountyList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item label="所属分部" prop="divisionId">
              <el-select style="width:100%" v-model="addFrom.divisionId" placeholder="请选择所属分部" @change="divisionIdChange">
                <el-option v-for="item,index in firstDivs" :key="index" :label="item.divisionName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-select style="width:100%" v-model="addFrom.departmentId" placeholder="请选择部门">
                <el-option v-for="item,index in departs" :key="index" :label="item.departmentName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否是负责人">
            <el-radio-group v-model="addFrom.isLeader">
              <el-radio label=1>是</el-radio>
              <el-radio label=0>否</el-radio>
            </el-radio-group>
          </el-form-item>

            <el-form-item label="职位">
              <el-select style="width:100%" v-model="addFrom.titleId" placeholder="请选择职位">
                <el-option v-for="item,index in titles" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收审核短信">
              <el-checkbox v-model="addFrom.receiveAuditMessage">接收</el-checkbox>
              <p style="color:#f00;">用于接收医生审核提醒</p>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="头像">
              <div class="addygtx_wrap">
                <div class="addygtx">
                  <img style="width:100%;height:100%" :src="addFrom.headImg" alt="">
                </div>
                <div class="ygtx-right" style="margin-left:30px;">
                  <el-button @click="txShow=true" type="primary">
                    <i class="el-icon-upload el-icon--right"></i>上传</el-button>
                  <p style="color:#606266;">仅限*.jpg,*.jpeg,*.gif,*.png,*.bmp图片格式</p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select style="width:100%" v-model="addFrom.roleId" placeholder="请选择角色">
                <el-option v-for="item,index in roles" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码">
              <el-input v-model="addFrom.cardNo"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="loginName">
              <el-input v-model="addFrom.loginName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addFrom.password"></el-input>
            </el-form-item>
            <el-form-item label="常用邮箱" prop="email">
              <el-input v-model="addFrom.email"></el-input>
            </el-form-item>
            <el-form-item label="qq" prop="qqNo">
              <el-input v-model="addFrom.qqNo"></el-input>
            </el-form-item>
            <el-form-item label="微信" prop="wechatNo">
              <el-input v-model="addFrom.wechatNo"></el-input>
            </el-form-item>
            <el-form-item label="现住址">
              <div class="live" style="display:flex;">
                <el-select v-model="addFrom.provinceId" placeholder="请选择" @change="cityChange">
                  <el-option v-for="item,index in city" :key="index" :label="item.shortName" :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="addFrom.cityId" placeholder="请选择">
                  <el-option v-for="item,index in cityer" :key="index" :label="item.shortName" :value="item.id">
                  </el-option>
                </el-select>
                <el-input style="width:100%" v-model="addFrom.address"></el-input>
              </div>
            </el-form-item>
          </div>
        </div>

      </el-form>
    </div>
    <div class="addyg_btn">
      <el-button @click="add(addFrom)" size="mini" style="width:100px" type="primary">保存</el-button>
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
              <el-upload class="upload-demo" v-model="addFrom" :headers="uploadHeaders" :on-success="onSuccess" :data="fileLister" name="file" :action="uploadUrl" :on-preview="handlePreview" :before-upload="beforeAvatarUpload" auto-upload list-type="picture" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                <el-button size="mini" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
              </el-upload>
            </div>
            <div class="first_btn">
              <el-button @click="uploadTx" type="primary">确定</el-button>
              <el-button @click="txShow=false" type="info" plain>取消</el-button>
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
      imgUrl: "",
      txShow: false,
      addFrom: {
        loginName: "",
        userName: "",
        mobile: "",
        email: "",
        password: "123456",
        departmentId: "",
        birthDate: "",
        areaId: "",
        sex: "",
        divisionId: "",
        cardNo: "",
        wechatNo: "",
        qqNo: "",
        titleId: "",
        headImg: "",
        roleId: "",
        provinceId: "",
        cityId: "",
        address: "",
        receiveAuditMessage: false,
        superviseProvinceId: -1,
        superviseCityId: "",
        superviseCountyId: ""
      },
      superviseProvinceList: [],
      superviseCityList: [],
      superviseCountyList: [],
      addFromRules: {
        userName: [
          {
            required: true,
            message: "内容不能为空，且字数控制在50个字之内！",
            trigger: "blur"
          },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入您的登陆密码！", trigger: "blur" }
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
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        loginName: [
          {
            required: true,
            message: "请输入合理的用户名！",
            trigger: "blur"
          },
          { min: 6, max: 16, message: "长度在6-16位以内。", trigger: "blur" }
        ],
        email: [
          {
            min: 0,
            max: 100,
            message: "请将字数控制在100个字之内！",
            trigger: "blur"
          }
        ],
        wechatNo: [
          {
            min: 0,
            max: 100,
            message: "请将字数控制在100个字之内！",
            trigger: "blur"
          }
        ],
        qqNo: [
          {
            min: 0,
            max: 100,
            message: "请将字数控制在100个字之内！",
            trigger: "blur"
          }
        ]
      },
      divs: [],
      firstDivs: [],
      departs: [],
      roles: [],
      titles: [],
      pageSize: 15,
      pageNum: 1,
      areaId: null
    };
  },
  methods: {
    areaIdChange(val) {
      this.areaId = val;
      this.addFrom.divisionId = "";
      this.addFrom.departmentId = "";
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
    divisionIdChange(val) {
      this.addFrom.departmentId = "";
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
      this.addFrom.superviseCityId = "";
      this.addFrom.superviseCountyId = "";
      this.superviseCityList=[]
      this.superviseCountyList=[]
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
      this.addFrom.superviseCountyId = "";
      this.superviseCountyList=[]
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
      this.addFrom.headImg = this.imgUrl;
      this.txShow = false;
    },
    onSuccess(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      console.log(response);
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
    add(addFrom) {
      this.$refs.addFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/data/my",
              this.$qs.stringify({
                pathL: "/ap/sysUser/save",
                areaId: addFrom.areaId,
                loginName: addFrom.loginName,
                userName: addFrom.userName,
                mobile: addFrom.mobile,
                email: addFrom.email,
                password: this.$md5(addFrom.password),
                departmentId: Number(addFrom.departmentId),
                birthDate: addFrom.birthDate,
                sex: Number(addFrom.sex),
                divisionId: Number(addFrom.divisionId),
                cardNo: addFrom.cardNo,
                wechatNo: addFrom.wechatNo,
                qqNo: addFrom.qqNo,
                titleId: Number(addFrom.titleId),
                headImg: addFrom.headImg,
                roleId: Number(addFrom.roleId),
                address: addFrom.address,
                provinceId: addFrom.provinceId,
                cityId: addFrom.cityId,
								isLeader: addFrom.isLeader,
                receiveAuditMessage: Number(addFrom.receiveAuditMessage),
                superviseProvinceId: addFrom.superviseProvinceId,
                superviseCityId: addFrom.superviseCityId===""?0:addFrom.superviseCityId,
                superviseCountyId: addFrom.superviseCountyId===""?0:addFrom.superviseCountyId
              })
            )
            .then(res => {
              console.log(res);
              if (res.data.state === 0) {
                this.$message({
                  type: "success",
                  message: "添加成功！",
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
      this.addFrom.cityId = "";
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
    this.$axios
      .post("/data/my", {
        pathL: "/ap/sysUser/list",
        pageSize: this.pageSize,
        pageNum: this.pageNum
      })
      .then(res => {
        if (res.data.state === 0) {
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
.form {
  display: flex;
}
.left,
.right {
  flex: 1;
}
.addygtx {
  width: 100px;
  height: 100px;
  background: #ccc;
  border-radius: 50%;
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
