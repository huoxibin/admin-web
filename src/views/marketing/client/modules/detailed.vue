<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>详细信息</span>
    </div>
    <div class="form">
      <el-form-item
        v-for="item in config"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
        label-width="100px"
      >
        <div v-if="type === 'detail'">
          <span>{{form[item.value]}}</span>
        </div>
        <component
          v-else
          style="width: 100%"
          :is="item.type"
          v-model="form[item.value]"
          :placeholder="placeholder[item.type]"
          :type="item.types?item.types:''"
          value-format="yyyy-MM-dd"
        >
          {{ item.type === 'span' ? form[item.value] : ''}}
          <div v-if="item.option" class="option">
            <div v-if="item.type === 'el-radio-group'" class="radio">
              <el-radio
                v-for="radio in item.option"
                :key="radio.label"
                :label="radio.value"
              >{{radio.label}}</el-radio>
            </div>
            <div v-if="item.type === 'el-checkbox-group'" class="radio">
              <el-checkbox
                v-for="checkbox in item.option"
                :key="checkbox.label"
                :label="checkbox.value"
              >{{checkbox.label}}</el-checkbox>
            </div>
            <div v-if="item.type === 'el-select'" class="select">
              <el-option
                v-for="select in item.option"
                :key="select.value"
                :label="select.label"
                :value="select.id">
              </el-option>
            </div>
          </div>
        </component>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
import pinyin from "js-pinyin";
export default {
  name: "detailed",
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  computed: {
    companyName() {
      return this.form.companyName;
    }
  },
  data() {
    return {
      type: this.$route.params.type,
      config: [
        {
          type: "el-input",
          label: "公司名称",
          value: "companyName"
        },
        {
          type: "el-select",
          label: "公司性质",
          value: "companyNature",
          option: [
            {
              label: "国企",
              value: "国企",
              id:1
            },
            {
              label: "国有控股",
              value: "国有控股",
              id:2
            },
            {
              label: "私企",
              value: "私企",
              id:3
            },
            {
              label: "其他",
              value: "其他",
              id:4
            }
          ]
        },
        {
          type: "el-input",
          label: "公司简称",
          value: "companyAbbrev"
        },
        {
          type: "el-input",
          label: "E-Mail",
          value: "email"
        },
        {
          type: "span",
          label: "助记码",
          value: "opcode"
        },
        {
          type: "el-input",
          label: "组织代码（三证合一）",
          value: "ownerCode"
        },
        {
          type: "el-input",
          label: "银行账户",
          value: "bankAccount"
        },
        {
          type: "el-input",
          label: "开户银行",
          value: "bankDeposit"
        },
        {
          type: "el-input",
          label: "收货地址",
          value: "shipAddress"
        },
        {
          type: "el-input",
          label: "通讯地址",
          value: "commAddress"
        },
        {
          type: "el-radio-group",
          label: "GSP管控",
          value: "gspControls",
          option: [
            {
              label: "是",
              value: "是"
            },
            {
              label: "否",
              value: "否"
            }
          ]
        },
        {
          type: "el-input",
          label: "邮政编码",
          value: "postalCode"
        },
        {
          type: "el-date-picker",
          label: "成立时间",
          value: "regtime",
          types: "date"
        },
        {
          type: "el-input",
          label: "法人代表",
          value: "companyLegal"
        },
        {
          type: "el-input",
          label: "流动资金",
          value: "workingCapital"
        },
        {
          type: "el-input",
          label: "注册资金",
          value: "registeredCapital"
        },
        {
          type: "el-input",
          label: "公司总人数",
          value: "companyHeadcount"
        },
        {
          type: "el-input",
          label: "年销售额",
          value: "annualSales"
        },
        {
          type: "el-input",
          label: "业务人员数",
          value: "salesmenCount"
        },
        {
          type: "el-input",
          label: "技术人员数",
          value: "techniciansCount"
        },
        {
          type: "el-input",
          label: "授权收货人",
          value: "consignee"
        },
        {
          type: "el-input",
          label: "授权收货人联系方式",
          value: "consigneeTel"
        },
        {
          type: "el-checkbox-group",
          label: "技术能力",
          value: "technicalCapacity",
          option: [
            {
              label: "有技术团队",
              value: "有技术团队"
            },
            {
              label: "承接过技术开发",
              value: "承接过技术开发"
            },
            {
              label: "其他",
              value: "其他"
            }
          ]
        },
        {
          type: "el-checkbox-group",
          label: "业务能力",
          value: "professionalProficiency",
          option: [
            {
              label: "懂产品",
              value: "懂产品"
            },
            {
              label: "懂技术",
              value: "懂技术"
            },
            {
              label: "懂售后",
              value: "懂售后"
            },
            {
              label: "懂运营",
              value: "懂运营"
            },
            {
              label: "懂营销",
              value: "懂营销"
            },
            {
              label: "有资源",
              value: "有资源"
            }
          ]
        },
        {
          type: "el-input",
          label: "社会资源",
          value: "socialResources",
          types: "textarea"
        },
        {
          type: "el-input",
          label: "经销其他产品",
          value: "restsProduct",
          types: "textarea"
        }
      ],
      // 提示语
      placeholder: {
        "el-input": "请输入",
        "el-select": "请选择",
        "el-date-picker": "选择日期"
      }
    };
  },
  watch: {
    companyName: {
      handler(now) {
        pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
        const letter = pinyin.getFullChars(now);
        const capital = letter.replace(/[a-z]/g, "");
        this.form.opcode = capital;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-flow: wrap;
  & > div {
    width: 50%;
  }
}
</style>