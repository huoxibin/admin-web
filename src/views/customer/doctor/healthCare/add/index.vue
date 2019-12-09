<!--
* author: huoxibin
* created: 2018/7/24
* describe:医护管理/医护管理/新增医生
-->
<template>
    <div class="add-doctor" v-loading="loading" element-loading-text="正在创建中，请稍等！">
      <div class="add-top">
        <span>新增医生信息</span>
      </div>
      <div class="add-bottom">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" size="mini" class="demo-ruleForm">

          <el-row>
            <el-col :span="16">
              <el-form-item label="姓名" prop="doctorName" label-width="120px">
                <el-input v-model="ruleForm.doctorName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="性别" prop="sex" label-width="120px">
                <el-select v-model="ruleForm.sex" placeholder="请选择">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="出生日期" label-width="120px">
                <el-date-picker
                  v-model="ruleForm.birthday"
                  type="date"
                  @change="dateChangebirthday"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="手机号码" prop="mobile" label-width="120px">
                <el-input v-model="ruleForm.mobile" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="上传头像" prop="headimg"  label-width="120px">
                <el-upload
                  class="upload-img"
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  v-loading="loadingPic" element-loading-text="正在上传中···"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="ruleForm.headimg" :src="ruleForm.headimg" class="avatarTou">
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="display: flex;width: 200px;height: 200px;justify-content: center;align-items: center;"></i>
                </el-upload>
                <span>
                    请上传一张 JPG/PNG格式的图片当做医生头像
                </span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="所属机构地点" prop="" label-width="120px" required>

                <el-form-item prop="city" style="float: left">
                  <el-select style="width:83%" v-model="ruleForm.city" @change="currentSel" label="请选择">
                    <el-option v-for="(item,index) in city"
                               :key="index"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <span style="color: #606266;">省/市</span>
                </el-form-item>

                <el-form-item prop="county" style="float: left">
                  <el-select style="width:85%" v-model="ruleForm.county" label="请选择" @change="citySel">
                    <el-option v-for="(item,index) in county"
                               :key="index"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <span style="color: #606266;">市</span>
                </el-form-item>

                <el-form-item prop="area" style="float: left">
                  <el-select style="width:83%" v-model="ruleForm.area" label="请选择" @change="areaSel">
                    <el-option v-for="(item,index) in area"
                               :key="index"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <span style="color: #606266;">区/县</span>
                </el-form-item>


                <div style="clear: both"></div>

              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="所属机构" prop="hospital" label-width="120px" style="margin-top: -16px">
                <!--下拉框形式-->
                <el-select style="width:100%" v-model="ruleForm.hospital" label="请选择">
                  <!--<el-option label="请选择" value=""></el-option>-->
                  <el-option v-for="(item,index) in hospital"
                             :key="index"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="科室" label-width="120px" required>
                <el-form-item prop="departmentZero"  style="float: left;width: 50%">
                  <el-select
                          style="width: 100%"
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
                <el-form-item prop="department" style="float: left;width: 50%">
                  <el-select
                          style="width:100%"
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
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="职称类型" prop="category" label-width="120px" style="margin-top: -16px">
                <el-select style="width:100%" v-model="ruleForm.category" label="请选择" @change="selectChangeHandler">
                  <el-option v-for="(item,index) in occupationType"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="职称" prop="title" label-width="120px">
                <!--职称类型没选的情况下-->
                <el-select style="width:100%" label="请选择" v-model="ruleForm.title">
                  <el-option v-for="(item,index) in technicalTitle"
                             :key="index"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="邮箱" prop="mailbox" label-width="120px">
                <el-input v-model="ruleForm.mailbox" style="width: 500px" placeholder="请输入"></el-input>
                <span style="color:#606266;">{{ruleForm.mailbox.length}}/30</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="擅长领域" prop="goodAt" label-width="120px">
                <el-input type="textarea" :rows=8 resize="none" style="width:500px" v-model="ruleForm.goodAt" placeholder="请输入"></el-input>
                <span style="color:#606266">{{ruleForm.goodAt.length}}/200</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="个人简介" prop="introduction" label-width="120px">
                <el-input type="textarea" :rows=8 resize="none" style="width:500px" v-model="ruleForm.introduction" placeholder="请输入"></el-input>
                <span style="color:#606266">{{ruleForm.introduction.length}}/200</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="职业证书" prop="" label-width="120px" required>
                <div style="width: 100%;height: 240px;border: 1px solid #e6e6e6;" class="picture">
                  <!--从业资格证照片-->
                  <div class="list">
                    <div class="list_top">
                      <el-form-item prop="zigeUrl">
                        <el-upload
                          class="upload-img"
                          :action="uploadUrl"
                          :headers="uploadHeaders"
                          v-loading="loadingPicOne" element-loading-text="正在上传中···"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccessOne"
                          :before-upload="beforeAvatarUploadOne">
                          <img v-if="ruleForm.zigeUrl" :src="ruleForm.zigeUrl" class="avatarTou">
                          <i v-else class="el-icon-plus avatar-uploader-icon" style="display: flex;width: 200px;height: 200px;justify-content: center;align-items: center;"></i>
                        </el-upload>
                      </el-form-item>

                    </div>
                    <div class="list_bottom">
                      从业资格证照片
                    </div>
                  </div>
                  <!--执业证照片-->
                  <div class="list">
                    <div class="list_top">
                      <el-form-item prop="zhiyeUrl">
                        <el-upload
                          class="upload-img"
                          :action="uploadUrl"
                          :headers="uploadHeaders"
                          :show-file-list="false"
                          v-loading="loadingPicTwo" element-loading-text="正在上传中···"
                          :on-success="handleAvatarSuccessTwo"
                          :before-upload="beforeAvatarUploadTwo">
                          <img v-if="ruleForm.zhiyeUrl" :src="ruleForm.zhiyeUrl" class="avatarTou">
                          <i v-else class="el-icon-plus avatar-uploader-icon" style="display: flex;width: 200px;height: 200px;justify-content: center;align-items: center;"></i>
                        </el-upload>
                      </el-form-item>

                    </div>
                    <div class="list_bottom">
                      执业证照片
                    </div>
                  </div>
                  <!--手持身份证照片-->
                  <div class="list">
                    <div class="list_top">
                      <el-form-item prop="cardUrl">
                        <el-upload
                          class="upload-img"
                          :action="uploadUrl"
                          :headers="uploadHeaders"
                          :show-file-list="false"
                          v-loading="loadingPicThree" element-loading-text="正在上传中···"
                          :on-success="handleAvatarSuccessThree"
                          :before-upload="beforeAvatarUploadThree">
                          <img v-if="ruleForm.cardUrl" :src="ruleForm.cardUrl" class="avatarTou">
                          <i v-else class="el-icon-plus avatar-uploader-icon" style="display: flex;width: 200px;height: 200px;justify-content: center;align-items: center;"></i>
                        </el-upload>
                      </el-form-item>

                    </div>
                    <div class="list_bottom">
                      手持身份证照片
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16" :offset="6">
              <el-form-item>
                <el-button style="width:100px" @click="$router.go(-1)" round>返回</el-button>
                <el-button type="primary" style="width:100px" @click="submitForm('ruleForm')" round>创建</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
    </div>
</template>

<style  scoped>
  /*table布局                 ----------------------start----------------------------*/
  .baseMsgTable{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    border-collapse:collapse;
  }
  .baseMsgTable table{
    border: 1px solid #dadfea;
  }
  .baseMsgTable table tr:nth-child(even){
    background: rgb(243,243,243);
  }
  .table_right{
    text-align: right;
    width: 120px;
    padding-right: 20px;
  }
  .table_left{
    text-align: left;
    width: 220px;
    padding-left: 10px;
  }
  .table_pic{
    height: 200px;
  }
  .table_introduction{
    height: 40px;
  }
  .table_goodAt{
    height: 40px;
  }
  .baseMsgTable table td{
    border: 1px solid #ddd;
    height: 50px;
  }
  /*table布局                 ----------------------end----------------------------*/
  .sigleMarkPlace:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    position: absolute;
    left: 15px;
    top: 5px;
  }
  .sigleMark:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    position: absolute;
    left: 40px;
    top: 5px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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

  .avatarTou{
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

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border:1px solid sandybrown;
  }

  .add-doctor{
    width: 100%;
  }
  .add-top {
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
  .add-bottom {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .picture{
    padding: 10px;
    display: flex;
    justify-content: space-around;
  }
  .list{
    width: 180px;
    height: 100%;
  }
  .list_top{
    width: 100%;
    height: 180px;
    /*border: 1px solid #e6e6e6;*/
  }
  .list_bottom{
    text-align: center;
    margin-top: 35px;
  }
</style>

<script>
    import { isValidPhone , isValidEmali } from "@/utils/RegExp.js"
    var CheckTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isValidPhone(value)) {
        callback(new Error("请输入正确格式的11位手机号码"));
      } else {
        callback();
      }
    };
    var CheckEail = (rule, value, callback) =>{
      if (!isValidEmali(value)) {
        if(!value){
          callback();
        }
        callback(new Error("请输入正确格式的邮箱"));
      } else {
        callback();
      }
    };
    export default {
        name: "",
        components: {},
        props: [],
        data() {
            return {
              loadingPic:false,
              loadingPicOne:false,
              loadingPicTwo:false,
              loadingPicThree:false,
              loading:false,
              imageUrl: '',
              imageUrlOne: '',
              imageUrlTwo: '',
              imageUrlThree: '',
              ruleForm: {
                doctorName:'',//姓名
                sex:'',//性别
                birthday:'',//出生日期
                mobile:'',//手机号码
                headimg:'',//上传头像
                areaId:'',//所属机构地点ID
                hospital:'',//所属机构ID
                departmentZero:'',//一级科室ID
                department:'',//二级科室ID
                category:'',//职称类型
                title:'',// 职称ID
                mailbox:'',//邮箱
                goodAt:'',//擅长领域
                introduction:'',//个人简介
                zigeUrl:'',//资格证照片
                zhiyeUrl:'',//执业证照片
                cardUrl:'',//手持身份证照片
                city:'',//省
                county:'',//市
                area:'',//区县
              },
              rules: {
                doctorName: [
                  { required: true, message: '请输入姓名(1-5个汉字)', trigger: 'blur' },
                  { min: 1, max: 5, message: '长度在 1到 5 个汉字', trigger: 'blur' }
                ],
                sex:[
                  { required: true, message: '请选择性别', trigger: 'change' }
                ],
                mobile:[
                  { required: true,validator: CheckTel, trigger: 'blur' },
                ],
                place:[
                  { required: true, message: '请选择地址', trigger: 'change' }
                ],
                city:[
                  { required: true, message: '请选择地址', trigger: 'change' }
                ],
                county:[
                  { required: true, message: '请选择地址', trigger: 'change' }
                ],
                area:[
                  { required: true, message: '请选择地址', trigger: 'change' }
                ],
                hospital:[
                  { required: true, message: '请输入', trigger: 'change' }
                ],
                 departmentZero:[
                    { required: true, message: '请选择', trigger: 'change' }
                 ],
                department:[
                  { required: true, message: '请选择', trigger: 'change' }
                ],
                category:[
                  { required: true, message: '请选择', trigger: 'change' }
                ],
                title:[
                  { required: true, message: '请选择', trigger: 'change' }
                ],
                mailbox:[
                  { required: false,validator:CheckEail , trigger: "blur" },
                  { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
                ],
                goodAt:[
                  { required: false, message: "请输入", trigger: "blur" },
                  { min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" }
                ],
                introduction:[
                  { required: false, message: "请输入", trigger: "blur" },
                  { min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" }
                ],
                headimg:[
                  { required: true, message: '请上传头像', trigger: 'change'}
                ],
                zigeUrl:[
                  { required: true, message: '请选择照片', trigger: 'change'}
                ],
                zhiyeUrl:[
                  { required: true, message: '请选择照片', trigger: 'change'}
                ],
                cardUrl:[
                  { required: true, message: '请选择照片', trigger: 'change'}
                ],

              },
              city:[],  //  省
              county:[], //市
              area:[], //区县
              hospital:[],//所属机构
              //获取科室
              officeZero:[],//一级科室
              office:[],//二级科室
              occupationType:[
                {value: '医生', label: '医生'},
                {value: '护士', label: '护士'},
                {value: '药师', label: '药师'},
                {value: '技师', label: '技师'}
              ],
              technicalTitle:[],
              restaurants: [],
              uploadUrl: "/data/uploadImg",
              uploadHeaders: {
                accessToken: this.$store.getters.accessToken
              },
              getUserId:'',
              provinceId:'',//省ID被选中
              countyId:''//市ID被选中
            }
        },
        methods: {
          //获取省列表
          getProvinceList(){
            this.$get("/data/my", {
              pathL: "/common/area/findAreaList",
              provinceId:0
            }).then(res => {
              if (res.state === 0) {
                this.city = res.data;
              } else {
                this.$message({
                  message: res.msg,
                  center: true
                });
              }
            })
          },
          //根据省获取市列表
          getCityList(val){
            this.$get("/data/my", {
              pathL: "/common/area/findAreaList",
              provinceId:val
            }).then(res => {
              if (res.state === 0) {
                this.county = res.data;
              } else {
                this.$message({
                  message: res.msg,
                  center: true
                });
              }
            })
          },
          //根据市获取区/县列表
          getAreaList(val){
            this.$get("/data/my", {
              pathL: "/common/area/findAreaList",
              cityId:val
            }).then(res => {
              if (res.state === 0) {
                this.area = res.data;
              } else {
                this.$message({
                  message: res.msg,
                  center: true
                });
              }
            })
          },
          //根据省、市获取机构列表
          getHospitalList(province,county,area){
            this.$get("/data/my", {
              pathL: "/doctor/medical/getHospitalList",
              provinceId:province,
              cityId:county,
              countyId:area
            }).then(res => {
              if (res.state === 0) {
                this.hospital = res.data;
              } else {
                this.$message({
                  message: res.msg,
                  center: true
                });
              }
            })
          },
          //省列表值被选中事件
          currentSel(selVal){
            this.provinceId =selVal;
            this.ruleForm.county ='';
            this.ruleForm.area = '';
            this.area.length = 0;
            this.ruleForm.hospital ='';
            this.hospital.length = 0;
            this.getCityList(selVal);
          },
          //市列表值被选中事件
          citySel(cityVal){
            this.countyId = cityVal;
            this.ruleForm.area = '';
            this.ruleForm.hospital ='';
            this.getAreaList(cityVal);
          },
          //区/县列表值被选中事件
          areaSel(areaVal){
            this.ruleForm.hospital ='';
            this.getHospitalList(this.provinceId,this.countyId,areaVal);
          },
          //出生日期选择
          dateChangebirthday(val) {
            this.ruleForm.birthday = val;
          },
          //根据职业类型获取职称列表
          getZiCheng(val){
            this.$get("/data/my", {
              pathL: "/doctor/medical/getTitleByCategory",
              category:val
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
          //职业类型下拉菜单里面值被选中
          selectChangeHandler(value){
            this.ruleForm.title = '';
            this.getZiCheng(value);
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

          //头像图片上传
          handleAvatarSuccess(response, file, fileList) {
            //文件上传成功时的钩子on-success
            this.ruleForm.headimg = response.data.url;
            if(this.ruleForm.headimg !=='' || this.ruleForm.headimg !== null){
              this.loadingPic = false;
            }
          },
          beforeAvatarUpload(file) {
            this.loadingPic = true;
            //使用 before-upload 限制用户上传的图片格式和大小
            const extension = file.type === "image/jpg";
            const extension2 = file.type === "image/jpeg";
            const extension3 = file.type === "image/png";
            if (
              !extension &&
              !extension2 &&
              !extension3
            ) {
              this.$message({
                message: "请上传一张 JPG/PNG格式的图片当做医生头像",
                center: true
              });
            }
            return extension || extension2 || extension3 ;
          },
          //从业资格证照片
          handleAvatarSuccessOne(response, file, fileList) {
            this.ruleForm.zigeUrl = response.data.url;
            if(this.ruleForm.zigeUrl !=='' || this.ruleForm.zigeUrl != null){
              this.loadingPicOne = false;
            }
          },
          beforeAvatarUploadOne(file) {
            this.loadingPicOne = true;
          },
          //执业证照片
          handleAvatarSuccessTwo(response, file, fileList) {
            this.ruleForm.zhiyeUrl = response.data.url;
            if(this.ruleForm.zhiyeUrl !=='' || this.ruleForm.zhiyeUrl != null){
              this.loadingPicTwo = false;
            }
          },
          beforeAvatarUploadTwo(file) {
            this.loadingPicTwo = true;
          },
          //手持身份证照片
          handleAvatarSuccessThree(response, file, fileList) {
            this.ruleForm.cardUrl =response.data.url;
            if( this.ruleForm.cardUrl !== '' ||  this.ruleForm.cardUrl != null){
              this.loadingPicThree = false;
            }
          },
          beforeAvatarUploadThree(file) {
            this.loadingPicThree = true;
          },
          //保存按钮
          submitForm(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                //新增医护人员
                this.loading = true;
                this.$get("/data/my", {
                  pathL: "/doctor/medical/save",
                  // AccessToken:this.getUserId,
                  doctorName:this.ruleForm.doctorName,//医生名字
                  sex:this.ruleForm.sex,//性别 number
                  birthday:this.ruleForm.birthday,//出生日期
                  mobile:this.ruleForm.mobile,//手机号
                  areaId:this.ruleForm.area,//地区id传区/县ID就行
                  headimg:this.ruleForm.headimg,//头像地址
                  hospital:this.ruleForm.hospital,//医院机构ID
                  departmentZero:this.ruleForm.departmentZero,//一级科室id
                  department:this.ruleForm.department,//二级科室id
                  category:this.ruleForm.category,//职业类型
                  title:this.ruleForm.title,//职称ID number
                  mailbox:this.ruleForm.mailbox,//邮箱
                  goodAt:this.ruleForm.goodAt,//擅长领域
                  introduction:this.ruleForm.introduction,//个人简介
                  zigeUrl:this.ruleForm.zigeUrl,//资格证照片
                  zhiyeUrl:this.ruleForm.zhiyeUrl,//执业证照片
                  cardUrl:this.ruleForm.cardUrl//手持身份证照片
                }).then(res => {
                  if (res.state === 0) {
                    this.loading =false;
                    this.$message({
                      message: "医生名单创建成功",
                      type: "success",
                      center: true
                    });
                    this.$router.push({
                      name: "医护管理/医护管理"
                    });
                  }else if(res.msg == "手机号已经存在，请重新输入"){
                    this.loading =false;
                    this.$message({
                      message: "手机号已经存在，请重新输入",
                      type: "warning",
                      center: true
                    });
                  } else {
                    this.$message({
                      message: res.msg,
                      center: true
                    });
                  }
                })
              } else {
                return false;
              }
            });
          }
        },
        mounted() {
          this.queryListOfficeZero();//科室
          this.getProvinceList();
        },
        watch: {

        },
        computed: {

        },
        activated(){

        }
    }
</script>


