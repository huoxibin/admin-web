<!--
* author: huoxibin
* created: 2018/7/24
* describe:医护管理/医护管理/操作/查看
-->
<template>
  <div class="health_find" v-loading="loading" element-loading-text="正在加载中">
    <div>
      <!--tab也签切换-->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="base"></el-tab-pane>
        <el-tab-pane label="团队信息" name="team" v-if="isShowThree"></el-tab-pane>
      </el-tabs>
      <!--基本信息-->
      <div
        class="health_base"
        v-show="activeName === 'base'"
        v-loading="loadingSave"
        element-loading-text="正在保存中"
      >
        <!--table布局-->
        <div class="baseMsgTable">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="180" class="table_right">姓名</td>
              <td width="180" class="table_left">{{baseMsg.doctorName}}</td>
              <td width="180" class="table_right">哆咖医生号</td>
              <td width="180" class="table_left">{{baseMsg.doctorId}}</td>
              <td width="400" colspan="4" rowspan="3">
                <div style="width: 100%;height: 180px;padding-left: 100px;position: relative;">
                  <!--<img src="/static/images/信息管理1.png" alt="">-->
                  <div class="personPic">
                    <img
                      v-show="baseMsg.doctorUrl === null || baseMsg.doctorUrl === ''"
                      src="./../images/doctorPic.png"
                      alt
                    >
                    <img
                      v-show="baseMsg.doctorUrl !== null && baseMsg.doctorUrl !== ''"
                      v-bind:src="baseMsg.doctorUrl"
                    >
                    <el-button class="changeImg" size="mini" @click="dialogVisibleTeamImg=true" type="primary">更改头像</el-button>
                    <el-dialog :append-to-body="true" title="上传头像" :visible.sync="dialogVisibleTeamImg" width="50%" center>
                      <el-upload class="upload-demo" :action="uploadUrl" :headers="uploadHeaders" :on-success="onSuccess" :limit=1 :on-exceed="handleExceed" :on-remove="handleRemove" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                      <span slot="footer" class="dialog-footer">
                            <el-button size="small" @click="dialogVisibleTeamImg = false">取 消</el-button>
                            <el-button size="small" type="primary" @click="confirmTeamImg">确 定</el-button>
                        </span>
                    </el-dialog>

                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td width="180" class="table_right">性别</td>
              <td width="180" class="table_left">{{baseMsg.sex==1?'男':baseMsg.sex==2?"女":baseMsg.sex || ''}}</td>
              <!-- <td width="180" class="table_right">出生日期</td><td width="180" class="table_left">{{baseMsg.birthday}}</td> -->
              <td width="180" class="table_right">出生日期</td>
              <td width="180" class="table_left">
                <el-date-picker
                  v-model="baseMsg.birthday"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                  :pickerOptions="pickerOptions"
                  @change="dateChange"
                  size="mini"
                ></el-date-picker>
              </td>
            </tr>
            <tr>
              <td width="180" class="table_right">手机号码</td>
              <td width="180" class="table_left">{{baseMsg.mobile}}</td>
              <td width="180" class="table_right">所属机构地点</td>
              <td style="width: 450px" class="table_left">
                <el-form v-show="checkFlag == 0" inline class="ruleForm_box" :disabled="didianActive">
                  <el-form-item style="float: left">
                    <el-select
                      style="width: 90px"
                      v-model="ruleForm.city"
                      @change="currentSel"
                      label="请选择"
                    >
                      <el-option
                        v-for="(item,index) in city"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <span style="color: #606266;">省/市</span>
                  </el-form-item>
                  <el-form-item style="float: left">
                    <el-select
                      style="width: 90px"
                      v-model="ruleForm.county"
                      label="请选择"
                      @change="citySel"
                    >
                      <el-option
                        v-for="(item,index) in county"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <span style="color: #606266;">市</span>
                  </el-form-item>
                  <el-form-item style="float: left">
                    <el-select
                      style="width: 90px"
                      v-model="ruleForm.area"
                      label="请选择"
                    >
                      <el-option
                        v-for="(item,index) in area"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <span style="color: #606266;">区/县</span>
                  </el-form-item>

                  <div style="clear: both"></div>
                </el-form>
              </td>
            </tr>
            <tr>
              <td width="180" class="table_right">所属机构</td>
              <td width="180" class="table_left">
                <el-button type="primary"
                      @click="showTeachDialog=true;setTeacherArrDefault()"
                      :disabled = "jigouActive">
                    {{hospitalNameWrite}}
                </el-button>
              </td>
              <td width="200" class="table_right">科室</td>
              <td width="200" class="table_left">

                <el-form v-show="checkFlag == 0" inline class="ruleForm_box" :disabled="keshiActive">
                  <el-form-item style="float: left">
                    <el-select
                            style="width: 140px"
                            v-model="ruleForm.departmentZero"
                            @change="departmentSel"
                            label="请选择"
                    >
                      <el-option
                              v-for="(item,index) in officeZero"
                              :key="index"
                              :label="item.name"
                              :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item style="float: left">
                    <el-select
                            style="width: 140px"
                            v-model="ruleForm.department"
                            label="请选择"
                    >
                      <el-option v-for="(item,index) in office"
                                 :key="index"
                                 :label="item.twoLevel"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>


              </td>
              <td width="180" class="table_right">所属团队</td>
              <td width="180" class="table_left">{{baseMsg.teamName}}</td>
            </tr>
            <tr>
              <td width="180" class="table_right">职称类型</td>
              <td width="180" class="table_left">
                <el-select style="width:93%"
                           v-model="ruleForm.category"
                           :disabled="typeActive"
                           label="请选择"
                           @change="selectChangeHandler">
                  <el-option v-for="(item,index) in occupationType"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </td>
              <td width="200" class="table_right">职称</td>
              <td width="200" class="table_left">
                <el-select
                        style="width:96%"
                        :disabled="zhichengActive"
                        label="请选择"
                        v-model="ruleForm.title">
                  <el-option v-for="(item,index) in technicalTitle"
                             :key="index"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </td>
              <td width="180" class="table_right">邮箱</td>
              <td width="180" class="table_left">{{baseMsg.mailbox}}</td>
            </tr>
            <tr>
              <td width="180" class="table_right">账号状态</td>
              <td width="180" class="table_left" colspan="5">{{baseMsg.disable === 0 ? '已启用' :'禁用'}}</td>
            </tr>
            <tr calss="table_goodAt">
              <td width="180" class="table_right">擅长领域</td>
              <td width="180" class="table_left" colspan="5">{{baseMsg.goodAt}}</td>
            </tr>
            <tr class="table_introduction">
              <td width="180" class="table_right">个人简介</td>
              <td width="180" class="table_left" colspan="5">{{baseMsg.introduction}}</td>
            </tr>
            <tr class="table_pic">
              <td width="180" height="200" class="table_right">职业证书</td>
              <td width="940" colspan="5">
                <div style="width: 100%;height: 200px;" class="picture">
                  <div class="list">
                    <div class="list_top">
                      <!--<img src="/static/images/信息管理1.png" alt="">-->
                      <img @click="dialogVisible1=true" v-bind:src="baseMsg.zigeUrl">
                    </div>
                    <div class="list_bottom">职称证/证明照片</div>
                  </div>

                  <div class="list">
                    <div class="list_top">
                      <!--<img src="/static/images/信息管理1.png" alt="">-->
                      <img @click="dialogVisible2=true" v-bind:src="baseMsg.zhiyeUrl">
                    </div>
                    <div class="list_bottom">执业证照片</div>
                  </div>

                  <div class="list">
                    <div class="list_top">
                      <!--<img src="/static/images/信息管理1.png" alt="">-->
                      <img @click="dialogVisible3=true" v-bind:src="baseMsg.cardUrl">
                    </div>
                    <div class="list_bottom">身份证照片</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td width="180" class="table_right">注册时间</td>
              <td width="180" class="table_left">{{baseMsg.creatTime}}</td>
              <td width="200" class="table_right">认证状态</td>
              <td
                width="200"
                class="table_left"
              >{{baseMsg.checked === 0 ? '资质未提交':(baseMsg.checked === 1 ? '等待审核':(baseMsg.checked === 2 ? '审核通过': '审核未通过'))}}</td>
              <td width="180" class="table_right">认证时间</td>
              <td width="180" class="table_left">{{baseMsg.checkTime}}</td>
            </tr>
          </table>
          <div class="back">
            <el-button
              type="primary"
              v-show="checkFlag == 0"
              @click="save()"
              size="small"
              style="width:100px;margin-right: 50px"
              plain
            >保 存</el-button>
            <el-button
              type="primary"
              @click="$router.go(-1)"
              size="small"
              style="width:100px;"
              plain
            >返 回</el-button>
          </div>
        </div>
      </div>
      <!--团队信息-->
      <div class="health_team" v-show="activeName === 'team'">
        <div class="find">
          <div class="team-1">
            <div class="team-img">
              <!--<img src="/static/images/信息管理1.png" alt="">-->
              <img v-bind:src="teamInfo.headimg">
            </div>
            <div class="team-name">
              <p style="font-weight: 700;">{{teamInfo.name}}</p>
              <p style="font-weight: 700;font-size: 14px;">{{teamInfo.hospitalName}}</p>
            </div>
          </div>
          <div class="team-2">
            <span>团队成员数：</span>
            <span>{{teamCounts.teamMemberCount}}人</span>
            <span>签约家庭数：</span>
            <span>{{teamCounts.signFamilyCount}}户</span>
            <span>服务患者数：</span>
            <span>{{teamCounts.signMemberCount}}户</span>
            <span>团队成立时间：</span>
            <span>{{teamInfo.teamCreateTime}}</span>
          </div>
          <div class="team-3">
            <p class="team-title">团队简介</p>
            <p>{{teamInfo.introduction}}</p>
          </div>
          <div class="team-4">
            <p class="team-title">团队成员</p>
            <ul>
              <li @click="findMember(teamMembersCap.doctorId)" style="padding-right: 40px">
                <div class="member-img">
                  <img
                    v-show="teamMembersCap.headimg === null || teamMembersCap.headimg===''"
                    src="./../images/doctorPic.png"
                    alt
                  >
                  <img
                    v-show="teamMembersCap.headimg !== null && teamMembersCap.headimg !==''"
                    v-bind:src="teamMembersCap.headimg"
                  >
                  <span class="captainTitle">队长</span>
                </div>
                <div class="member-data">
                  <p style="font-weight: 700;">{{teamMembersCap.name}}</p>
                  <p>{{teamMembersCap.titleName}}</p>
                </div>
              </li>

              <li
                v-for="(item,index) in teamMembers"
                :key="index"
                @click="findMember"
                style="padding-right: 40px"
              >
                <div class="member-img">
                  <!--<img src="/static/images/信息管理1.png" alt="">-->
                  <img
                    v-show="item.headimg === null || item.headimg === '' "
                    src="./../images/doctorPic.png"
                    alt
                  >
                  <img
                    v-show="item.headimg !== null && item.headimg !== ''"
                    v-bind:src="item.headimg"
                  >
                </div>
                <div class="member-data">
                  <p style="font-weight: 700;">{{item.name}}</p>
                  <p>{{item.titleName}}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="team-5">
            <p class="team-title">团队服务包</p>
            <p v-show="teamPackItems.length <= 0 ">暂无团队服务包</p>
            <ul>
              <li v-for="(item,index) in teamPackItems" :key="index" @click="findBox">
                <div class="box-img">
                  <img src="./../images/doctor.png" alt>
                </div>
                <div class="box-name">
                  <p style="font-weight: 700;">{{item.name}} ({{item.packItemCount}}服务项)</p>
                  <p>总金额：¥ {{item.packMoney}}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="back">
            <el-button
              type="primary"
              @click="$router.go(-1)"
              size="small"
              style="width:100px;"
              plain
            >返 回</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--从业资格证照片  放大-->
    <el-dialog
      title = '点击图片可预览大小'
      :visible.sync="dialogVisible1"
      width="30%"
      :modal-append-to-body="false"
      center
    >
      <viewer :images="zigeUrlSee">
        <img v-for="src in zigeUrlSee" :src="src" :key="src" width="100%"  height="490">
      </viewer>
    </el-dialog>

    <!--执业证照片  放大-->
    <el-dialog
      title = '点击图片可预览大小'
      :visible.sync="dialogVisible2"
      width="30%"
      :modal-append-to-body="false"
      center
    >
      <viewer :images="zhiyeUrlSee">
        <img v-for="src in zhiyeUrlSee" :src="src" :key="src" width="100%"  height="490">
      </viewer>
    </el-dialog>

    <!--手持身份证照片  放大-->
    <el-dialog
      title = '点击图片可预览大小'
      :visible.sync="dialogVisible3"
      width="30%"
      :modal-append-to-body="false"
      center
    >
      <viewer :images="cardUrlSee">
        <img v-for="src in cardUrlSee" :src="src" :key="src" width="100%"  height="490">
      </viewer>
    </el-dialog>

    <!--所属机构弹窗页面-->
    <sys-hospital-name
            :defaultVal.sync="teacherDefault"
            :show.sync="showTeachDialog"
            @getStatus="getTeacherData"
            @closeTeacher="closeTeacher"
            :selectedArea="ruleForm"
    ></sys-hospital-name>

  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: [],
  data() {
    return {
    	//上传头像
			dialogVisibleTeamImg: false,
			uploadUrl: "/data/uploadImg",
			uploadHeaders: {
				accessToken: this.$store.getters.accessToken
			},
			teamImgBus:'',//医生头像
      //弹窗组件
      teacherDefault: {
        id: null,
        name: null
      },
      showTeachDialog: false,//弹窗显示与隐藏
       //获取科室
       officeZero:[],
       office:[],
       //职称类型
       occupationType:[
          {value: '医生', label: '医生'},
          {value: '护士', label: '护士'},
          {value: '药师', label: '药师'},
          {value: '技师', label: '技师'}
       ],
       //职称
       technicalTitle:[],

      zigeUrlSee:[],//职称证/证明照片
      zhiyeUrlSee:[],//职称证/证明照片
      cardUrlSee:[],//身份证照片
      // 出生日期
      pickerOptions: {
        disabledDate: time => time.getTime() > Date.now()
      },
      loadingSave: false, //保存标识
      hDoctorId: "", //医生Id
      hospitalNameWrite: "", //可编辑的机构名称
      checkFlag: "", //可不可编辑
      //智能搜索 医院 数据库
      value9: ["昌平区中西区结合医院"],
      options4: [],
      loadingHospital: false,
      states: [],

      dialogVisible1: false, //从业资格证大图
      dialogVisible2: false, //执业证照片大图
      dialogVisible3: false, //手持身份证照片大图
      activeName: "base",
      //基本信息
      name: "张超",
      doctorId: "",
      baseMsg: {},
      isShowThree: false,
      //团队信息
      teamId: "",
      teamMsg: {
        teamMembers: [
          {
            titleName: "",
            headimg: "",
            doctorId: "",
            teamId: "",
            name: ""
          },
          {
            titleName: "",
            headimg: "",
            doctorId: "",
            teamId: "",
            name: ""
          }
        ]
      },
      loading: true,

      teamInfo: {
        headimg: "",
        name: "",
        hospitalName: "",
        teamCreateTime: "",
        introduction: ""
      },
      teamCounts: {
        teamMemberCount: 0,
        signFamilyCount: 0,
        signMemberCount: 0
      },
      teamMembers: [{ headimg: "", name: "", titleName: "" }], //团队成员
      teamMembersCap: { headimg: "", name: "", titleName: "", doctorId: "" }, // 队长信息
      teamPackItems: [{ name: "", packItemCount: "", packMoney: "" }], //团队服务包
      city: [], //  省
      county: [], //市
      area: [], //区县
      //所属机构地点 下拉框选择
      ruleForm: {
        departmentZero:'',//一级科室
        department:'',//二级科室
        category:'',//职称类型
        title:'',//职称
        city: "", //省
        county: "", //市
        area: "" //区县
      },
      hospitalId:'',//所属机构Id

      //权限分配
       didianActive:true,//所属机构地点
       jigouActive:true,//所属机构
       keshiActive:true,//科室
       typeActive:true,//职称类型
       zhichengActive:true,//职称
    };
  },
  created() {
     //基础数据平台配置的按钮权限
     const btnArr = this.$store.getters.menuInfo.btnMenu;
     btnArr.forEach(item => {
        if(item.menuName == '客服平台'){
           for (let it of item.btnList) {
              let linkUrl = it.linkUrl;
              if (linkUrl == "jigouLocation") {
                 this.didianActive = false;
              }else if(linkUrl == "agency"){
                 this.jigouActive = false;
              }else if(linkUrl == "doctorOffices"){
                 this.keshiActive = false;
              }else if(linkUrl == "titleType"){
                 this.typeActive = false;
              }else if(linkUrl == "technicalTitle"){
                 this.zhichengActive = false
              }
           }
        }
     });
  },
  methods: {
		// 确认头像
		confirmTeamImg() {
			this.baseMsg.doctorUrl = this.teamImgBus;
			this.dialogVisibleTeamImg = false;
		},
     // 关闭--弹窗
     closeTeacher() {
        this.showTeachDialog = false;
     },
     //点击（确定）按钮---子组件向父组件传递的医院
     getTeacherData(obj) {
        console.log(obj);
        this.closeTeacher();
        this.hospitalNameWrite = obj.name;//所属机构名称
        this.hospitalId = obj.id;//所属机构Id
     },
     //点击（所属机构）
     setTeacherArrDefault() {
        this.teacherDefault.name = this.hospitalNameWrite;//所属机构
        this.teacherDefault.id = this.hospitalId;//所属机构Id
     },



     //获取一级科室列表
     queryListOfficeZero(){
        this.$get("/data/my", {
           pathL: "/doctor/departmentBase/departmentList"
        }).then(res => {
           if (res.state === 0) {
              this.officeZero = res.data;
           } else {
              this.$message({
                 message: res.msg,
                 center: true
              });
           }
        })
     },
     //一级科室被选中获取二级科室列表
     departmentSel(value){
        this.ruleForm.department = '';
        this.$get("/data/my", {
           pathL: "/doctor/department/getDepartmentListByOne",
           baseId : value
        }).then(res => {
           if (res.state === 0) {
              this.office = res.data;
           } else {
              this.$message({
                 message: res.msg,
                 center: true
              });
           }
        });
     },
     //职业类型下拉菜单里面值被选中
     selectChangeHandler(value){
        // console.log(value);
        this.ruleForm.title = '';
        this.$get("/data/my", {
           pathL: "/doctor/medical/getTitleByCategory",
           category:value
        }).then(res => {
           if (res.state === 0) {
              this.technicalTitle = res.data
           } else {
              this.$message({
                 message: res.msg,
                 center: true
              });
           }
        })
     },


    // 出生日期确定
    dateChange() {
      this.$post("/data/my", {
        pathL: "/doctor/medical/editBirth",
        id: this.baseMsg.doctorId,
        birthday: this.baseMsg.birthday
      }).then(res => {
        if (res.state === 0) {
          this.$message({
            type: "success",
            message: "设置成功",
            center: true
          });
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //获取省、市列表
    getProvinceList() {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        provinceId: 0
      }).then(res => {
        if (res.state === 0) {
          this.city = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //省列表值被选中事件
    currentSel(selVal) {
      this.ruleForm.county = "";
      this.ruleForm.area = "";
      this.county = [];
      this.area = [];
      this.$get("/data/my", {
          pathL: "/common/area/findAreaList",
          provinceId: selVal
      }).then(res => {
          if (res.state === 0) {
             this.county = res.data;
          } else {
             this.$message({
                message: res.msg,
                center: true
             });
          }
       });
    },
    //市列表值被选中事件
    citySel(cityVal) {
      this.ruleForm.area = "";
       this.area = [];
      this.$get("/data/my", {
          pathL: "/common/area/findAreaList",
          cityId: cityVal
      }).then(res => {
          if (res.state === 0) {
             this.area = res.data;
          } else {
             this.$message({
                message: res.msg,
                center: true
             });
          }
       });
    },
		// 团队头像上传成功
		onSuccess(response, file, fileList) {
			this.teamImgBus = response.data.url;
		},
    //获取医护人员团队信息
    queryListTeam() {
      if (this.teamId) {
        this.$get("/data/my", {
          pathL: "/doctor/teamInfoOperating/teamInfoAndPackList",
          teamId: this.teamId
        }).then(res => {
           this.loading = false;
          if (res.state === 0) {
            this.teamMsg = res.data;
            if (this.teamMsg) {
              this.isShowThree = true;
              this.teamInfo = this.teamMsg.teamInfo;
              this.teamCounts = this.teamMsg.teamCounts;
              this.teamMembersCap = this.teamMsg.teamMembers[0];
              this.teamMembers = this.teamMsg.teamMembers.slice(1, this.teamMsg.teamMembers.length);
              this.teamPackItems = this.teamMsg.teamPackItems;
            }
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        });
      } else {
        return;
      }
    },
    //获取医护人员基本信息
    queryList() {
      this.$get("/data/my", {
        pathL: "/doctor/medical/findDoctorInfo",
        doctorId: this.doctorId
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.baseMsg = res.data;

          // 职称证/证明照片
          this.zigeUrlSee.push(res.data.zigeUrl);
          // 执业证照片
          this.zhiyeUrlSee.push(res.data.zhiyeUrl);
          // 身份证照片
          this.cardUrlSee.push(res.data.cardUrl);
          this.hDoctorId = res.data.doctorId; //医生id
          this.hospitalNameWrite = res.data.hospitalName; //所属机构
          this.hospitalId = res.data.hospitalId;//所属机构Id
          this.ruleForm.city = res.data.provinceId; //省id
          this.currentSel(res.data.provinceId);
           this.ruleForm.county = res.data.cityId; //市id
          this.citySel(res.data.cityId);
          this.ruleForm.area = res.data.areaId; //区、县id

          if(res.data.departmentIdZero == null){
             this.ruleForm.departmentZero = '';
             this.ruleForm.department = '';
          }else {
             this.ruleForm.departmentZero = res.data.departmentIdZero;//一级科室id
             this.departmentSel(res.data.departmentIdZero);
             this.ruleForm.department = res.data.departmentId;//二级科室id
          }

          this.ruleForm.category = res.data.category;//职称类型

          this.selectChangeHandler(res.data.category);
          this.ruleForm.title =res.data.titleId;//职称

        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //tab切换
    handleClick(tab, event) {
      // console.log(tab,event);
    },
    //跳转1
    findMember() {
      // this.$router.push({
      //   name: "医护管理/团队管理/家医团队列表/家医团队详情/家医详情"
      // });
    },
    //跳转2
    findBox() {
      // this.$router.push({
      //    name: "医护管理/团队管理/家医团队列表/家医团队详情/服务包详情"
      // });
    },
    //保存按钮
    save() {
      if (this.ruleForm.title == "") {
        this.$message({
          message: "请选择职称",
          type: "warning",
          center: true
        });
        return;
      }else if(this.ruleForm.department == ''){
         this.$message({
            message: "请选择科室",
            type: "warning",
            center: true
         });
         return;
      } else {
        this.loadingSave = true;
        this.$post("/data/my", {
          pathL: "/doctor/doctorInfo/editDoctorInfo",
          doctorId: this.hDoctorId,//医生id
          hospitalId:this.hospitalId,//机构id
          departmentIdZero:this.ruleForm.departmentZero,//一级科室id
          departmentId:this.ruleForm.department,//二级科室id
          titleId: this.ruleForm.title,//职称id
					headimg:this.baseMsg.doctorUrl// 医生头像
        }).then(res => {
          this.loadingSave = false;
          if (res.state === 0) {
            this.$router.push({
              name: "医护管理/医护管理"
            });
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        });
      }
    }
  },
  mounted() {
     this.queryListOfficeZero();//科室
    let doctorId = this.$route.query.id;
    this.doctorId = doctorId;
    let teamId = this.$route.query.teamId;
    this.teamId = teamId;
    // console.log(this.teamId);
    //可不可编辑
    let checkFlag = this.$route.query.checkFlag;//1.9版本开始，所有医生都可以编辑
    //checkFlag=0的时候是可以编辑的
    this.checkFlag = checkFlag;

    this.queryList(); //获取医护人员基本信息
    this.queryListTeam(); //获取医护人员团队信息
    this.getProvinceList(); //获取省列表

    this.list = this.states.map(item => {
      console.log(item);
      return { value: item, label: item };
    });
  },
  watch: {},
  computed: {}
};
</script>

<style scoped>
.ruleForm_box .el-form-item {
  margin-bottom: 0px;
}
/*table布局                 ----------------------start----------------------------*/
.baseMsgTable {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  border-collapse: collapse;
}
.baseMsgTable table {
  border: 1px solid #dadfea;
}
.baseMsgTable table tr:nth-child(even) {
  background: rgb(243, 243, 243);
}
.table_right {
  text-align: right;
  width: 120px;
  padding-right: 20px;
}
.table_left {
  text-align: left;
  width: 220px;
  padding-left: 10px;
}
.table_pic {
  height: 200px;
}
.table_introduction {
  height: 40px;
}
.table_goodAt {
  height: 40px;
}
.baseMsgTable table td {
  border: 1px solid #ddd;
  height: 50px;
}
/*table布局                 ----------------------end----------------------------*/
.personPic {
  width: 180px;
  height: 180px;

}
.personPic img {
  width: 100%;
  height: 100%;
}
.personPic .changeImg{
  position: absolute;
  right: 0;
  bottom: 0;

}
/*全局的*/
.health_find {
  width: 100%;
  height: 100%;
  background: rgb(250, 250, 250);
}
.health_team {
  margin-left: 60px;
}
.health_base {
  padding-left: 10px;
  background: rgb(250, 250, 250);
}
/*基本信息*/
.baseMsg {
  width: 100%;
  height: 100%;
}
.picture {
  padding: 10px;
  display: flex;
  justify-content: space-around;
}
.list {
  width: 180px;
  height: 100%;
}
.list_top {
  width: 100%;
  height: 180px;
  border: 1px solid #e6e6e6;
}
.list_top img {
  width: 100%;
  height: 100%;
}
.list_bottom {
  text-align: center;
  margin-top: 5px;
}
/*团队信息*/
.find {
  width: 100%;
  height: 100%;
}
.find > div {
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
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
.team-1 {
  width: 100%;
  height: 100px;
  display: flex;
}
.team-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.team-img img {
  max-width: 80px;
  max-height: 80px;
}
.team-name {
  margin-left: 20px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: flex-start;
}
.team-2 span {
  font-weight: 700;
  font-size: 14px;
}
.team-2 span:nth-last-of-type(odd) {
  margin-right: 50px;
}
.team-3 p {
  font-size: 14px;
}
.team-title {
  margin: 10px 0;
  font-weight: 700;
  font-size: 14px;
}
.team-4 ul {
  display: flex;
}
.member-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.member-img img {
  width: 100%;
  height: 100%;
}

.member-img {
  position: relative;
}
.member-img .captainTitle {
  width: 40px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  font-weight: bolder;
  background: rgb(0, 204, 51);
  position: absolute;
  right: 0;
  bottom: 0;
}
.member-data {
  width: 100px;
  text-align: center;
}
.team-5 ul {
  display: flex;
  flex-flow: row wrap;
}
.team-5 ul li {
  height: 100px;
  display: flex;
  align-items: center;
  /*cursor: pointer;*/
}
.box-img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-img img {
  max-width: 50px;
  max-height: 50px;
}
.box-name {
  width: 300px;
  height: 60px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: flex-start;
  font-size: 14px;
}
.back {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
