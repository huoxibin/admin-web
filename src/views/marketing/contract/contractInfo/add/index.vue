<template>
  <div>
    <el-main style="width: 500px;">
      <el-form :form="form" labelWidth="130px">
        <el-form-item label="甲方">
          <el-input value="北京健科云网科技有限公司 " :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <dk-form
        size="mini"
        :form="form"
        :rules="rules"
        :config="config"
        :inline="false"
        labelWidth="130px"
      ></dk-form>
      <el-form :form="form" :rules="rules" labelWidth="130px">
        <el-form-item label="乙方（客户）" prop="selCustormval">
          <el-row>
            <el-col :span="23">
              <el-col :span="20">
                <el-input v-model="selCustormval" :disabled="true"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="selectCustorm">请选择</el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <el-form :rules="rules" :form="form" labelWidth="130px">
        <el-form-item label="授权区域" prop="authority">
          <el-row>
            <el-col :span="20">
              <el-row v-for="(item,index) in selAreaList" :key="index">
                <el-col :span="20">{{item.provinceName}} {{item.cityName}} {{item.countyName}}</el-col>
                <el-col :span="4">
                  <el-button size="mini" type="primary" @click="delArea(index)">删除</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-button size="mini" type="primary" @click="addArea">添加</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <dk-form
        size="mini"
        :rules="rules"
        :form="form"
        :config="config2"
        :inline="false"
        labelWidth="130px"
      ></dk-form>

      <el-form labelWidth="130px">
        <el-form-item label="上传附件">
          <!--@delNotify="delUploadImg"-->
          <sys-uploadFile
            :fileList="imgUpload"
            :tip="uploadConfig.tip"
            :rule="uploadConfig.rule"
            :limit="uploadConfig.limit"
            :headerUrl="uploadConfig.headerUrl"
            :headerPathL="uploadConfig.headerPathL"
            @notify="handleUploadImg"
          ></sys-uploadFile>
        </el-form-item>
      </el-form>

      <dk-form
        size="mini"
        :rules="rules"
        :form="form"
        :config="config3"
        :inline="false"
        labelWidth="130px"
      ></dk-form>

      <el-button style="margin-left: 120px" size="mini" @click="goBack">取消</el-button>
      <el-button class="m-l-15" size="mini" type="primary" @click="saveForm">临时保存</el-button>
      <el-button class="m-l-15" size="mini" type="primary" @click="saveSubmit">保存并提交审核</el-button>
    </el-main>

    <dk-dialog
      :baseConfig="areaDialog"
      :dialogShow.sync="areaDialog.dialogVisible"
      @confirmCallback="areaConfirm"
      @cancelCallback="areaCancel"
      @closeDialog="areaCancel"
    >
      <el-form :form="formArea" labelWidth="80px" slot="form">
        <el-form-item label="授权区域">
          <el-select
            :disabled="provinceActive"
            style="width:140px"
            v-model="formArea.provinceId"
            @change="currentSel"
            label="省"
          >
            <el-option
              v-for="(item,index) in province"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-select style="width:150px" v-model="formArea.cityId" label="市" @change="citySel">
            <el-option
              v-for="(item,index) in city"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-select style="width:150px" v-model="formArea.countyId" label="区县" @change="areaSel">
            <el-option
              v-for="(item,index) in area"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </dk-dialog>
    <dk-dialog
      :baseConfig="custormDialog"
      :dialogShow.sync="custormDialog.dialogVisible"
      @confirmCallback="custormConfirm"
      @cancelCallback="custormCancel"
      @closeDialog="custormCancel"
    >
      <base-layout
        slot="form"
        style="height: 600px"
        methods="get"
        :form="custormForm"
        @getData="getCustorm"
      >
        <dk-form
          slot="form"
          size="mini"
          :form="custormForm"
          :config="curtormConfig"
          :inline="true"
          labelWidth="120px"
        ></dk-form>
        <dk-table
          slot="table"
          border
          stripe
          :data="custormTableData"
          :config="custormTableConfig"
          index
          :pageNum="1"
          :pageSize="1"
          @rowClick="selectRowCustorm"
        ></dk-table>
      </base-layout>
      <!--marketing/contractInfo/queryCustomerPage-->
    </dk-dialog>
    <sys-approvalWork
      :data="workData"
      @closeDialog="closeWorkConfigDialog"
      :dialogShow="workConfig.visible"
      :workConfig="workConfig"
      @cancelDialog="cancelWorkConfig"
    ></sys-approvalWork>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      /////////审批弹窗配置////////////
      workConfig: {
        visible: false,
        width: "500px",
        title: "审批"
      },
      workData: {
        auditNum: "",
        businessType: '',
        url: "",
        fileName: "",
        id: ""
      },
      imgUpload: [],
      form: {
        pathL: "/api",
        contractName: "", //合同名称
        partyA: "", //甲方授权代表
        customerNo: "", //客户编号
        partyB: "", //乙方授权代表
        region: "", //所属大区
        applicationType: "", //所属类型 ，abc
        cashDeposit: "", //保证金
        agencyFee: "", //代理费
        platformLicensing: "", //平台使用费
        effectiveDate: "", //生效日期
        signingData: "", //签署日期
        contractTerm: "", //合同期限
        dueData: "", //到期日期
        probationaryPeriod: "", //考察期
        probationaryPeriodDueData: "", //考察到期日期
        prototypeNumber: "", //样机数量
        prototypeCashDeposit: "", //样机押金
        accessory: "", //附件
        remark: "", //备注
        createBy: "", //创建人
        authority: "" //授权区域 省id_市id_区id
      },
      rules: {
        contractName: [
          { required: true, message: "请输入合同名称", trigger: "blur" }
        ],
        partyA: [
          { required: true, message: "请输入甲方授权代表", trigger: "blur" }
        ],
        selCustormval: [
          { required: true, message: "请输入乙方客户", trigger: "blur" }
        ],
        partyB: [
          { required: true, message: "请输入乙方授权代表", trigger: "blur" }
        ],
        authority: [
          { required: true, message: "请输入授权区域", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请输入所属大区", trigger: "blur" }
        ],
        applicationType: [
          { required: true, message: "请输入申请类别", trigger: "blur" }
        ],
        signingData: [
          { required: true, message: "请输入签署日期", trigger: "blur" }
        ],
        effectiveDate: [
          { required: true, message: "请输入生效日期", trigger: "blur" }
        ],
        contractTerm: [
          { required: true, message: "请输入合同到期日期", trigger: "blur" }
        ],
        probationaryPeriod: [
          { required: true, message: "请输入考察期", trigger: "blur" }
        ],
        probationaryPeriodDueData: [
          { required: true, message: "请输入考察期到期日期", trigger: "blur" }
        ]
      },
      config3: [
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "textarea",
          label: "备注",
          value: "remark",
          option: {
            type: "textarea",
            disabled: false
          }
        }
      ],
      config2: [
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "所属大区",
          value: "region",
          option: {
            placeholder: "选择了授权区域在这里进行展示",
            disabled: false
          }
        },

        {
          type: "radio",
          label: "申请类别",
          value: "applicationType",
          option: {
            disabled: false,
            data: [
              {
                label: "A",
                value: "A"
              },
              {
                label: "B",
                value: "B"
              },
              {
                label: "C",
                value: "C"
              }
            ]
          }
        },

        {
          type: "input",
          label: "保证金",
          value: "cashDeposit",
          option: {
            placeholder: "根据授权申请类别自动带出",
            disabled: false
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "代理费",
          value: "agencyFee",
          option: {
            placeholder: "根据授权申请类别自动带出",
            disabled: false
          }
        },

        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "平台使用费",
          value: "platformLicensing",
          option: {
            placeholder: "根据授权申请类别自动带出",
            disabled: false
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "date",
          label: "签署日期",
          value: "signingData",
          option: {
            disabled: false,
            format: "yyyy-MM-dd"
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "date",
          label: "生效日期",
          value: "effectiveDate",
          option: {
            disabled: false,
            format: "yyyy-MM-dd"
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "合同期限(月)",
          value: "contractTerm",
          option: {
            disabled: false
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "到期日期",
          value: "dueData",
          option: {
            placeholder: "生效日期+合同期限-1",
            disabled: true,
            format: "yyyy-MM-dd"
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "考察期(月)",
          value: "probationaryPeriod",
          option: {
            disabled: false
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "考察期到期日期",
          value: "probationaryPeriodDueData",
          option: {
            placeholder: "生效效日期+考察期-1",
            disabled: true,
            format: "yyyy-MM-dd"
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "样机（台）",
          value: "prototypeNumber",
          option: {
            disabled: false
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "样机押金",
          value: "prototypeCashDeposit",
          option: {
            placeholder: "请输入押金",
            disabled: false
          }
        }
      ],
      config1: [
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "cascader",
          label: "授权区域",
          value: "authority",
          option: {
            placeholder: "请输入授权区域",
            disabled: false,
            cascader: {
              data: [],
              filterable: true,
              changeOnSelect: true
            }
          }
        }
      ],
      config: [
        {
          type: "input",
          label: "合同编码",
          value: "contractNo",
          hide: true,
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "合同名称",
          value: "contractName",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "甲方授权代表",
          value: "partyA",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "已方授权代表",
          value: "partyB",
          option: {
            disabled: false
          }
        }
      ],
      ///////////地域选择/////////////
      areaDialog: {
        dialogVisible: false,
        width: "570px",
        title: "选择区域"
      },
      province: [],
      city: [],
      area: [],
      formArea: {
        provinceName: "", // 省名
        provinceId: "", //省ID
        cityId: "", //市ID
        cityName: "", //市名
        countyId: "", //区ID
        countyName: "" //区名
      },
      selAreaList: [
        // {
        //   provinceId: "",
        //   cityId: "",
        //   countyId: ""
        // }
      ], //所选区域列表
      //////////附件上传////////
      upload: {
        limit: 1, //上传文件个数限制
        tip: "",
        type: "file",
        rule: {
          type: [],
          size: 100
        }
      },
      uploadConfig: {
        // 文件上传配置
        limit: 1, //上传文件个数限制
        tip: "",
        headerUrl: "/data/excel",
        headerPathL: "/zuul/marketing/contractInfo/uploadFile",
        rule: {
          type: [],
          size: 100
        }
      },
      provinceActive: false, // 控制省的是否可用
      ///////////客户选择/////////////
      custormDialog: {
        dialogVisible: false,
        width: "900px",
        title: "选择客户"
      },
      custormTableData: [],
      custormTableConfig: [
        {
          type: "",
          label: "客户编号",
          value: "customer_no"
        },
        {
          type: "",
          label: "公司名称",
          value: "company_name"
        },
        {
          type: "",
          label: "公司简介",
          value: "company_abbrev"
        },
        {
          type: "",
          label: "所在城市",
          value: "city_name"
        },
        {
          type: "",
          label: "申请城市",
          value: "province_name"
        },
        {
          type: "",
          label: "所在大区",
          value: "region"
        },
        {
          type: "",
          label: "申请类别",
          value: "application_type"
        },
        {
          type: "",
          label: "联系人",
          value: "contact_name_one"
        },
        {
          type: "",
          label: "联系电话",
          value: "contact_tel_one"
        },
        {
          type: "",
          label: "客户状态",
          value: "remark"
        },
        {
          type: "",
          label: "负责人",
          value: "user_name"
        }
      ],
      custormForm: {
        pathL: "/marketing/contractInfo/queryCustomerPage",
        customerNo: "",
        companyName: "",
        provinceName: "",
        region: "",
        applicationType: "",
        contactNameOne: "",
        contactTelOne: "",
        principalName: "",
        cityName: ""
      },
      selCustormval: null, // 乙方客户
      curtormConfig: [
        {
          type: "input",
          label: "客户编号",
          value: "customerNo",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "公司名称",
          value: "companyName",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "所在城市",
          value: "cityName",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "申请城市",
          value: "provinceName",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "所属大区",
          value: "region",
          option: {
            disabled: false
          }
        },
        {
          type: "select",
          label: "申请类型",
          value: "applicationType",
          option: {
            disabled: false,
            data: [
              {
                label: "请选择",
                value: ""
              },
              {
                label: "A",
                value: "A"
              },
              {
                label: "B",
                value: "B"
              },
              {
                label: "C",
                value: "C"
              }
            ]
          }
        },
        {
          type: "input",
          label: "联系人",
          value: "contactNameOne",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "联系电话",
          value: "contactTelOne",
          option: {
            disabled: false
          }
        },
        {
          type: "input",
          label: "负责人",
          value: "principalName",
          option: {
            disabled: false
          }
        }
      ],
      remSelCustormInfo: null
    };
  },
  mounted() {
    this.getProvinceList(); // 获取省份列表
    //this.getCustorm(); // 获取客户列表
    if (this.$route.query.tag === "edit") {
      this.getData();
      this.config[0].hide = false;
    }
  },

  watch: {
    "form.source"() {
      if (this.form.source === 6) {
        this.config.map(item => {
          if (item.label === "其他") {
            item.hide = false;
          }
        });
      } else {
        this.config.map(item => {
          if (item.label == "其他") {
            item.hide = true;
          }
        });
      }
    },
    "form.effectiveDate"(){
			//this.computedAllDate(1);

      if(this.form.effectiveDate=='' || !this.form.effectiveDate){
				this.form.dueData='';
				this.form.probationaryPeriodDueData='';
      }else{
				this.computedAllDate(1);
				this.computedAllDate(2);
      }

    },
    "form.contractTerm"() {
			this.computedAllDate(1);
    },
    "form.probationaryPeriod"() {
    	this.computedAllDate(2);
    }
  },
  methods: {
  	computedAllDate(fg){
  		if(fg==1){
				if(this.form.contractTerm!==""){
					let newDate = this.coputedDate(this.form.contractTerm);
					this.form.dueData = newDate;
				}else{
					this.form.dueData='';
				}

      }else if(fg==2){
				if(this.form.probationaryPeriod!=''){
					let newDate = this.coputedDate(this.form.probationaryPeriod);

					this.form.probationaryPeriodDueData = newDate;
				}else{
					this.form.probationaryPeriodDueData='';
				}
      }

    },
    selAreaListGet() {
      if (this.selAreaList.length) {
        this.provinceActive = true;
      } else {
        this.provinceActive = false;
        ///重置其他选项//
        this.form.agencyFee = "";
        this.form.cashDeposit = "";
        this.form.applicationType = "";
        this.form.platformLicensing = "";
        this.form.region = "";
      }
      let that = this;
      this.form.authority = "";
      this.selAreaList.forEach(item => {
        let im = "";
        if (item.provinceId !== "") {
          im += `${item.provinceId}_`;
        }
        if (item.cityId !== "") {
          im += `${item.cityId}_`;
        }
        if (item.countyId !== "") {
          im += `${item.countyId}_`;
        }
        im = im.substr(0, im.length - 1);
        that.form.authority += `${im},`;
      });
    },
    coputedDate(date) {
      // 计算日期
			let newDate = new Date(this.form.effectiveDate);
      let end=moment(newDate).subtract(1, 'days').add(parseInt(date), 'months').format('YYYY-MM-DD');

			return end;
    },

    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
      return y + "-" + this.add0(m) + "-" + this.add0(d);
    },
    getCustorm(data) {
      let arr=[];
			data.result.list.forEach(item=>{
				if(item){
					arr.push(item);
        }
      })
      this.custormTableData = arr;
    },
    getData() {
      let that = this;
      this.$get("/data/my", {
        pathL: "/marketing/contractInfo/query",
        id: this.$route.query.id
      })
        .then(res => {
          if (!res.state) {
            that.dealData(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    dealData(data) {
      // 获取详情

      let sh = data.contractInfo;
      sh.due_data = this.format(sh.due_data);
      sh.effective_date = this.format(sh.effective_date);
      sh.probationary_period_due_data = this.format(
        sh.probationary_period_due_data
      );
      sh.signing_data = this.format(sh.signing_data);

      this.form.contractName = sh.contract_name; //合同名称
      this.form.partyA = sh.party_a; //甲方授权代表
      this.form.customerNo = sh.customer_no; //客户编号
      this.form.partyB = sh.party_b; //乙方授权代表
      this.form.region = sh.region; //所属大区
      this.form.applicationType = sh.application_type; //所属类型 ，abc
      this.form.cashDeposit = sh.cash_deposit; //保证金
      this.form.agencyFee = sh.agency_fee; //代理费
      this.form.platformLicensing = sh.platform_licensing; //平台使用费
      this.form.effectiveDate = sh.effective_date; //生效日期
      this.form.signingData = sh.signing_data; //签署日期
      this.form.contractTerm = sh.contract_term; //合同期限
      this.form.dueData = data.contractInfo.due_data; //到期日期
      this.form.probationaryPeriod = sh.probationary_period; //考察期
      this.form.probationaryPeriodDueData = sh.probationary_period_due_data; //考察到期日期
      this.form.prototypeNumber = sh.prototype_number || 0; //样机数量
      this.form.prototypeCashDeposit = sh.prototype_cash_deposit || 0; //样机押金
      this.form.accessory = sh.accessory; //附件
      if (sh.accessory !== "") {
        this.imgUpload.push(JSON.parse(sh.accessory));
      }

      this.form.remark = sh.remark; //备注
      this.form.createBy = sh.create_by; //创建人
      this.form.contractNo = sh.contract_no; //授权区域 省id_市id_区id
      this.form.id = sh.id; //授权区域 省id_市id_区id

      //this.selAreaList = data.authorities;
      for (let i = 0; i < data.authorities.length; i++) {
        let item = {
          provinceId: data.authorities[i].province_id,
          cityId: data.authorities[i].city_id,
          countyId: data.authorities[i].county_id,
          provinceName: data.authorities[i].pro_name,
          cityName: data.authorities[i].city_name,
          countyName: data.authorities[i].county_name
        };
        this.selAreaList[i] = item;
      }
      this.selCustormval = sh.company_name;

      this.selAreaListGet();
    },
    goBack() {
      this.$router.back();
    },
    /////////区域操作///////
    addArea() {
      // 添加区域
      this.areaDialog.dialogVisible = true;
    },
    delArea(index) {
      // 删除区域
      this.selAreaList.splice(index, 1);
      this.selAreaListGet(); // 删除
    },
    areaConfirm() {
      // 确认区域

      this.areaDialog.dialogVisible = false;
      this.selAreaList.push(JSON.parse(JSON.stringify(this.formArea)));
      if (this.formArea.provinceId !== "") {
        this.getRegion(); // 获取所属大区，根据省获取
      }

      if (this.formArea.cityId !== "") {
        this.getSqCity(); // 获取授权区域，根据市获取
      }
      this.selAreaListGet();
    },
    getSqCity() {
      //
      let that = this;
      this.$get("/data/my", {
        pathL: "/marketing/contractInfo/queryCityByCityId",
        cityId: this.formArea.cityId
      })
        .then(res => {
          if (!res.state) {
            that.form.agencyFee = res.data.agencyFee;
            that.form.cashDeposit = res.data.cashDeposit;
            that.form.applicationType = res.data.type;
            that.form.platformLicensing = res.data.platformLicensing;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRegion() {
      // 获取所属大区，根据省获取
      let that = this;
      this.$get("/data/my", {
        pathL: "/marketing/contractInfo/queryRegionList",
        provinceId: this.formArea.provinceId
      })
        .then(res => {
          if (!res.state) {
            that.form.region = res.data[0];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    areaCancel() {
      // 取消区域
      this.areaDialog.dialogVisible = false;
    },
    handleUploadImg(data) {
      //上传文件
      if (data.data) {
        this.form.accessory = JSON.stringify(data.data);
      } else {
        this.form.accessory = "";
      }
      // if (data.data) {
      //   let ar=JSON.stringify(data.data);
      //   let item =JSON.parse('['+ar+']');
      //   this.form.accessory = item;
      // }
    },
    delUploadImg(data) {
      // this.form.accessory.forEach((item,index)=>{
      //
      //   if(item.fileName==data.fileName){
      //     this.form.accessory.splice(index,1)
      //   }
      // })
      // debugger
    },
    checkFormVal() {
      // 检测输入的表单错误
      let sh = this.form;
      if (sh.contractName === "") {
        this.$message("请填写合同名称");
        return false;
      }
      if (sh.partyA === "") {
        this.$message("请填写甲方授权代表");
        return false;
      }

      if (this.selCustormval === null) {
        this.$message("请选择乙方客户");
        return false;
      }
      if (sh.partyB === "") {
        this.$message("请填写乙方授权代表");
        return false;
      }

      if (sh.authority === "") {
        this.$message("请填写授权区域");
        return false;
      }
      if (sh.region === "") {
        this.$message("请填写所属大区");
        return false;
      }
      if (sh.applicationType === "") {
        this.$message("请填写申请类别");
        return false;
      }
      if (sh.signingData === "") {
        this.$message("请填写签署日期");
        return false;
      }
      if (sh.effectiveDate === "") {
        this.$message("请填写生效日期");
        return false;
      }
      if (sh.contractTerm === "") {
        this.$message("请填写合同到期日期");
        return false;
      }
      if (sh.probationaryPeriod === "") {
        this.$message("请填写考察期");
        return false;
      }
      if (sh.probationaryPeriodDueData === "") {
        this.$message("请填写考察期到期日期");
        return false;
      }
      return true;
    },
    saveForm() {
      // 临时保存
      if (!this.checkFormVal()) {
        return;
      }
      this.form.effectiveDate = this.format(this.form.effectiveDate);
      this.form.authority = this.form.authority.substr(
        0,
        this.form.authority.length - 1
      );
      let that = this;
      let remForm = JSON.parse(JSON.stringify(this.form));
      delete remForm.pathL;
      let url = "/marketing/contractInfo/add";
      if (this.$route.query.tag === "edit") {
        url = "/marketing/contractInfo/update";
      } else {
        delete remForm.id;
      }
      this.$post("/data/my", {
        pathL: url,
        ...remForm
      })
        .then(res => {
          if (!res.state) {
            that.$message("保存合同成功！");
            setTimeout(function() {
              that.$router.back();
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //////审批流/////////
    saveSubmit() {
      // 开启审批流弹窗
      if (!this.checkFormVal()) {
        return;
      }
      this.form.effectiveDate = this.format(this.form.effectiveDate);
      this.form.authority = this.form.authority.substr(
        0,
        this.form.authority.length - 1
      );
      let that = this;
      let remForm = JSON.parse(JSON.stringify(this.form));
      delete remForm.pathL;
      let url = "/marketing/contractInfo/addAndSubmit";
      if (this.form.id == "") {
        delete remForm.id;
      }
      this.$post("/data/my", {
        pathL: url,
        ...remForm
      })
        .then(res => {
          if (res.state == 0) {
            that.workData = {};
            that.$message("保存合同成功！");
            that.workConfig.visible = true;
            that.form.id = res.data.id;

            that.workData.auditNo = res.data.auditNo;
            that.workData.businessType = res.data.approvalType;
            that.workData.id = res.data.id;
            that.workData.type = res.data.approvalType;
            if (res.data.file !== "") {
              that.workData.url = JSON.parse(res.data.file).url;
              that.workData.fileName = JSON.parse(res.data.file).fileName;
            }
          } else {
            //that.workConfig.visible = true;
            that.$message("保存合同失败！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeWorkConfigDialog(data, user, send) {
      //获取审批值
      let sendIds = "";
      let userIds = "";
      user.forEach(item => {
        userIds += item.id + ",";
      });
      userIds = userIds.substr(0, userIds.length - 1);

      send.forEach(item => {
        sendIds += item.id + ",";
      });
      sendIds = sendIds.substr(0, sendIds.length - 1);
      let that = this;
      this.workConfig.visible = false;

      this.$post("/data/my", {
        pathL: "/common/audit/add",
        businessType: this.workData.type,
        businessId: this.workData.id,
        userIds: userIds,
        sendIds: sendIds,
        auditName: data.auditName,
        auditContent: data.auditContent
      })
        .then(res => {
          if (res.state == 0) {
            that
              .$post("/data/my", {
                pathL: "/marketing/contractInfo/updateProcessStatus",
                status: 2,
                id: that.form.id
              })
              .then(res => {
                if (res.state == 0) {
                  that.$message("审批提交成功！");
                  setTimeout(() => {
                    that.$router.back();
                  }, 1000);
                } else {
                  that.$message(res.message);
                }
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancelWorkConfig() {
      this.workConfig.visible = false;
    },
    //根据省列表
    getProvinceList() {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        provinceId: 0
      }).then(res => {
        if (res.state === 0) {
          this.province = res.data;
          // console.log(this.city);
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    //根据省获取市列表
    getCityList(val) {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        provinceId: val
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
    //根据市获取区/县列表
    getAreaList(val) {
      this.$get("/data/my", {
        pathL: "/common/area/findAreaList",
        cityId: val
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
    getSelAreaName(data, selVal) {
      let obj = {};
      obj = data.find(item => {
        return item.id === selVal; //筛选出匹配数据
      });
      return obj.name;
    },
    //省列表值被选中事件
    currentSel(selVal) {
      this.formArea.cityId = "";
      this.formArea.cityName = "";
      this.formArea.countyId = "";
      this.formArea.countyName = "";
      this.area.length = 0;
      this.formArea.provinceName = this.getSelAreaName(this.province, selVal);

      this.getCityList(selVal);
    },
    //市列表值被选中事件
    citySel(cityVal) {
      this.formArea.countyId = "";
      this.formArea.countyName = "";
      this.formArea.cityName = this.getSelAreaName(this.city, cityVal);

      this.getAreaList(cityVal);
    },
    //区/县列表值被选中事件
    areaSel(areaVal) {
      this.formArea.countyId = areaVal;
      this.formArea.countyName = this.getSelAreaName(this.area, areaVal);
    },
    ///选择客户///
    selectCustorm() {
      //请选择客户
      this.custormDialog.dialogVisible = true;
    },
    custormConfirm() {
      this.custormDialog.dialogVisible = false;
      this.selCustormval = this.remSelCustormInfo.company_name;
      this.form.customerNo = this.remSelCustormInfo.customer_no;
    },
    custormCancel() {
      this.custormDialog.dialogVisible = false;
    },
    selectRowCustorm(row) {
      //单选行客户
      this.remSelCustormInfo = row;
    }
  }
};
</script>

