<template>
  <el-main style="width: 500px;">
    <dk-form :config="config" :form="form" :inline="false" labelWidth="160px"></dk-form>
    <el-form :inline="false" :form="form" labelWidth="160px">
      <el-form-item label="商品说明">
        <base-editor v-model="form.goodsMemo" ref="editor" :disable="false"></base-editor>
      </el-form-item>
    </el-form>
    <el-button @click="$router.back()" size="mini" style="margin-left: 160px" type="primary">返回</el-button>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      form: {},
      config: [
        {
          type: "input",
          label: "商品编号",
          value: "goodsNo",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "商品名称",
          value: "goodsName",
          option: {
            disabled: true
          }
        },
        {
          type: "radio",
          label: "商品类型",
          value: "goodsType",
          option: {
            disabled: true,
            data: [
              {
                label: "实物商品",
                value: 2
              },
              {
                label: "原材料",
                value: 3
              },
              {
                label: "虚拟商品",
                value: 1
              }
            ]
          }
        },
        {
          type: "input",
          label: "商品分类",
          value: "category",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "条形码",
          value: "barcode",
          option: {
            disabled: true
          }
        },
        {
          type: "input",
          label: "型号",
          value: "goodsModel",
          option: {
            disabled: true
          }
        },

        {
          type: "input",
          label: "规格",
          value: "goodsSpecs",
          option: {
            disabled: true
          }
        },

        {
          type: "input",
          label: "颜色",
          value: "goodsColor",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "单位",
          value: "goodsUnit",
          option: {
            disabled: true
          }
        },

        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "装箱规格",
          value: "carton",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "第三方商品编号",
          value: "tpgoodsCode",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "供应商",
          value: "goodsSupplier",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "radio",
          label: "接口标志",
          value: "interfaceSign",
          option: {
            disabled: true,
            data: [
              {
                label: "是",
                value: 1
              },
              {
                label: "否",
                value: 0
              }
            ]
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "自营标志",
          value: "selfSign",
          option: {
            disabled: true,
            data: [
              {
                label: "是",
                value: 1
              },
              {
                label: "否",
                value: 0
              }
            ]
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "零售价（元）",
          value: "retailPrice",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "建议渠道价（元）",
          value: "channelPrice",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "最低售价（元） ",
          value: "minPrice",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "input",
          label: "参考成本价（元）",
          value: "costPrice",
          option: {
            disabled: true
          }
        },
        {
          // type 可选范围 [ input/select/date/switch/checkbox/radio ]
          type: "switch",
          label: "商品状态(是否下架)",
          value: "status",
          option: {
            disabled: true
          }
        }
        // {
        //   // type 可选范围 [ input/select/date/switch/checkbox/radio ]
        //   type: "textarea",
        //   label: "商品说明",
        //   value: "goodsMemo",
        //   option: {
        //     disabled: true
        //   }
        // }
      ],
      firstList: [], // 一级分类列表
      secondList: [], // 二级分类列表
      threeList: [] // 三级分类列表
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      // 获取数据详情
      let that = this;
      this.$get("/data/my", {
        pathL: "/common/pubGoods/query",
        id: this.id
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
      if (data.status === 1) {
        data.status = true;
      } else {
        data.status = false;
      }
      this.form = data;
      this.form.category = `${
        data.goodsClassifyIName !== "" ? data.goodsClassifyIName : ""
      }/${data.goodsClassifyIiName !== "" ? data.goodsClassifyIiName : ""}/${
        data.goodsClassifyIiiName !== "" ? data.goodsClassifyIiiName : ""
      }`;
    }
  }
};
</script>
