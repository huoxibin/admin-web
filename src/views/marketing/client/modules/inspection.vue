<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>实地考察结果</span>
    </div>
    <div class="form">
      <el-form-item v-for="item in config" :key="item.label" :label="item.label">
        <span v-if="type === 'detail'">{{form[item.value]}}</span>
        <el-input v-else v-model="form[item.value]" type="textarea" :placeholder='item.placeholder'></el-input>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Inspection",
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type: this.$route.params.type,
      config: [
        {
          label: "经营环境",
          value: "businessEnvironment",
          placeholder:' 建议这样写：办公室面积不小于150平米，仓库面积不小于30平方米、不少于10人的经营团队'
        },
        {
          label: "服务能力",
          value: "serviceAbility",
          placeholder:'建议这样写：有专职的销售人员和网络以及网络开发能力，有一定的售后服务能力'
        },
        {
          label: "配送能力",
          value: "distributionCapacity",
          placeholder:'建议这样写：有至少一辆可用于送货和服务的机动车辆，具备一定的区域产品配送能力'
        },
        {
          label: "社会关系",
          value: "socialRelations",
          placeholder:'建议这样写：有一定的政府及社会关系（非必须）'
        }
      ]
    };
  }
};
</script>
