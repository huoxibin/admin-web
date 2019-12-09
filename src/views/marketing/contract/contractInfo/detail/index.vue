<template>
  <el-main style="width: 400px">
    <dk-form
            :rules="rules"
            size="mini"
            :form="form"
            :config="config"
            :inline="false"
            labelWidth="130px"
    ></dk-form>
    <el-form :form="form" :rules="rules" labelWidth="130px">
      <el-form-item label="授权区域" prop="authority">
        <el-row v-for="(item,index) in selAreaList" :key="item">
          <el-col :span="24">
            {{item.provinceName}} {{item.cityName}} {{item.countyName}}
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <dk-form
            :rules="rules"
            size="mini"
            :form="form"
            :config="config1"
            :inline="false"
            labelWidth="130px"
    ></dk-form>
    <el-button style="margin-left: 130px" size="mini" @click="goBack">返回</el-button>
  </el-main>
</template>
<script>
  export default {
    data: () => ({
      form: {},
      config: [
        {
          type: "input",
          label: "合同编码",
          value: "contract_no",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "合同名称",
          value: "contract_name",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "甲方",
          value: "name",//
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "甲方授权代表",
          value: "party_a",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "已方(客户)",
          value: "company_name",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "已方授权代表",
          value: "party_b",
          option: {
            disabled: true
          }
        }
      ],
      config1: [
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "所属大区",
          value: "region",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "所在城市类别",
          value: "application_type",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "保证金",
          value: "cash_deposit",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "代理费",
          value: "agency_fee",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "平台使用费",
          value: "platform_licensing",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "签署日期",
          value: "signing_data",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "生效日期",
          value: "effective_date",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "合同期限(月)",
          value: "contract_term",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "到期日期",
          value: "due_data",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "考察期(月)",
          value: "probationary_period",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "考察期到期日期",
          value: "probationary_period_due_data",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "样机（台）",
          value: "prototype_number",
          option: {
            disabled: true
          }
        },

        {
          type: "input",
          label: "合同负责人",
          value: "prototype_cash_deposit",
          option: {
            disabled: true
          }
        },
        {
          type: "button",
          label: "上传附件",
          value: "",
          option: {
            disabled: false,
            btnConfig: {
              btnCallBack: "downFile",
              label: '查看附件'
            },
            type: 'primary'
          }
        },
        {
          type: "textarea",
          label: "备注",
          value: "remark",
          option: {
            disabled: true
          }
        }
      ],
      selAreaList: [],
      rules: {
        contract_name: [
          {required: true, message: "请输入合同名称", trigger: "blur"}
        ],
        party_a: [
          {required: true, message: "请输入甲方授权代表", trigger: "blur"}
        ],
        company_name: [
          {required: true, message: "请输入乙方客户", trigger: "blur"}
        ],
        party_b: [
          {required: true, message: "请输入乙方授权代表", trigger: "blur"}
        ],
        authority: [
          {required: true, message: "请输入授权区域", trigger: "blur"}
        ],
        region: [{required: true, message: "请输入所属大区", trigger: "blur"}],
        application_type: [
          {required: true, message: "请输入申请类别", trigger: "blur"}
        ],
        signing_data: [
          {required: true, message: "请输入签署日期", trigger: "blur"}
        ],
        effective_date: [
          {required: true, message: "请输入生效日期", trigger: "blur"}
        ],
        contract_term: [
          {required: true, message: "请输入合同到期日期", trigger: "blur"}
        ],
        probationary_period: [
          {required: true, message: "请输入考察期", trigger: "blur"}
        ],
        probationary_period_due_data: [
          {required: true, message: "请输入考察期到期日期", trigger: "blur"}
        ]
      },
    }),
    mounted() {
      this.getData();
    },

    methods: {
      getData() {
        let that = this;
        this.$get("/data/my", {
          pathL: "/marketing/contractInfo/query",
          id: this.$route.query.id
        })
          .then(res => {
            if (!res.state) {
              that.form = res.data.contractInfo;
              that.form.name = '北京健科云网科技有限公司';
              //that.form.accessory = res.data.accessory;
              that.dealArea(res.data);
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      dealArea(data) {
        let arr=[];
        for (let i = 0; i < data.authorities.length; i++) {
          arr={
            provinceName:data.authorities[i].pro_name,
            cityName:data.authorities[i].city_name,
            countyName:data.authorities[i].county_name,

          };
          this.selAreaList.push(arr);
        }
      },
      goBack() {
        this.$router.back();
      },
      downFile() {
      	if(this.form.accessory!=''){
					let url=JSON.parse(this.form.accessory).url;
					window.open(url);
        }else{
      		this.$message("未上传附件");
        }
      }
    }
  };
</script>