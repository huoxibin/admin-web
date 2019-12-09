<template>
  <el-main style="width: 600px;">
    <dk-form :form="form" :config="config" :rules="rules" :inline="false" labelWidth="120px"></dk-form>
    <el-form labelWidth="120px">
      <el-form-item label="所在城市">
        <base-local ref="stayCity" :form="formCity" :showCounty="false" :disable="true"></base-local>
      </el-form-item>
    </el-form>
    <el-form labelWidth="120px">
      <el-form-item label="申请城市">
        <base-local ref="reqCity" :form="formReqCity" :disable="true"></base-local>
      </el-form-item>
    </el-form>

    <dk-form :form="form" :config="config1" :rules="rules" :inline="false" labelWidth="120px"></dk-form>

    <div class="clear text-center" style="margin-left: 120px;">
      <el-button size="mini" @click="$router.push('/custorm/clue/list')">返回</el-button>
    </div>
  </el-main>
</template>

<script>
export default {
  data: () => ({
    /////三级联动测试//////
    formCity: {
      provinceId: "",
      cityId: ""
    },
    formReqCity: {
      provinceId: "",
      cityId: "",
      countyId: ""
    },

    showProvince: true,
    showCity: true,
    showCounty: false,
    //////////表格操作////////////////
    form: {
      clueNo: "", //编号
      companyName: "", //公司名称

      provinceId: "", //申请省
      cityId: "", //申请市
      countyId: "", //申请区

      province: "", // 所在省
      city: "", // 所在市

      contactNameOne: "", // 联系
      contactTelOne: "", // 区域
      contactNameTwo: "", // 联系
      contactTelTwo: "", // 区域
      contactNameThree: "", // 联系
      contactTelThree: "", // 区域
      customerType: null, //客户类型
      clueSource: null, //客户来源

      id: "",
      rest: "", // 其他来源
      remark: "" //备注
    },
    province: [], //省列表
    city: [], //市列表
    area: [], //区/县列表
    rules: {
      contactNameOne: [
        { required: true, message: "请输入联系人", trigger: "blur" }
      ],
      contactTelOne: [
        { required: true, message: "请输入联系方式", trigger: "blur" }
      ],
      clueSource: [{ required: true, message: "请输入来源", trigger: "blur" }]
    },
    config: [
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "线索编号",
        value: "clueNo",
        hide: true,
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "公司名称",
        value: "companyName",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "联系人1",
        value: "contactNameOne",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "联系方式1",
        value: "contactTelOne",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "联系人2",
        value: "contactNameTwo",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "联系方式2",
        value: "contactTelTwo",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "联系人3",
        value: "contactNameThree",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "联系方式3",
        value: "contactTelThree",
        option: {
          disabled: true
        }
      }
    ],
    config1: [
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "select",
        label: "客户类型",
        value: "customerType",
        option: {
          disabled: true,
          data: [
            {
              label: "请选择",
              value: 0
            },
            {
              label: "大客户",
              value: 1
            },
            {
              label: "合伙人",
              value: 2
            },
            {
              label: "经销商",
              value: 3
            }
          ]
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "select",
        label: "来源",
        value: "clueSource",
        option: {
          disabled: true,
          data: [
            {
              label: "请选择",
              value: 0
            },
            {
              label: "活动/会议",
              value: 8
            },
            {
              label: "自己开发",
              value: 9
            },
            {
              label: "朋友介绍",
              value: 7
            },
            {
              label: "展会",
              value: 2
            },
            {
              label: "官网",
              value: 1
            },
            {
              label: "朋友圈",
              value: 3
            },
            {
              label: "手机端广告",
              value: 4
            },
            {
              label: "400客服",
              value: 5
            },
            {
              label: "PC端广告",
              value: 6
            },
            {
              label: "其他",
              value: 10
            }
          ]
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "其他",
        value: "rest",
        hide: false,
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "textarea",
        label: "备注",
        value: "remark",
        option: {
          type: "textarea",
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "负责人",
        value: "principalName",
        option: {
          disabled: true
        }
      },
      {
        // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        type: "input",
        label: "创建时间",
        value: "createTime",
        option: {
          disabled: true
        }
      }
    ]
  }),

  mounted() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      let that = this;
      if (this.$route.query.hasOwnProperty("clueInfoNo")) { //基础平台跳转过来的入参为 "clueInfoNo"
        this.$get("/data/my", {
          pathL: "/marketing/clueInfo/query",
          "clueInfoNo": this.$route.query.clueInfoNo
        }).then(res => {
          if (!res.state) {
            that.dealData(res.data);
          }
        }).catch(err => {
          console.log(err);
        });
      } else {  //营销平台入参为 "clueInfoNo"
        this.$get("/data/my", {
          pathL: "/marketing/clueInfo/query",
          id: this.$route.query.id
        }).then(res => {
          if (!res.state) {
            that.dealData(res.data);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    dealData(data) {
      this.form = data;
      if (!this.form.cityId) {
        this.form.cityId = "";
      }
      if (!this.form.provinceId) {
        this.form.provinceId = "";
      }
      if (!this.form.countyId) {
        this.form.countyId = "";
      }
      if (data.provinceId !== "") {
        this.formReqCity.provinceId = parseInt(data.provinceId);
      }
      if (data.cityId !== "") {
        this.formReqCity.cityId = parseInt(data.cityId);
      }
      if (data.countyId !== "") {
        this.formReqCity.countyId = parseInt(data.countyId);
      }
      if (data.proIdSz !== "") {
        this.formCity.provinceId = parseInt(data.proIdSz); //省名
      }
      if (data.cityIdSz !== "") {
        this.formCity.cityId = parseInt(data.cityIdSz); //市名
      }

      this.$refs.reqCity.getCityList(this.formReqCity.provinceId);
      this.$refs.reqCity.getAreaList(this.formReqCity.cityId);

      this.$refs.stayCity.getCityList(this.formCity.provinceId);
      this.$refs.stayCity.getAreaList(this.formCity.cityId);
    }
  }
};
</script>

