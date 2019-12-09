<template>
  <div class="update" v-loading="loading" element-loading-text="拼命加载中">
    <el-form ref="form" size="mini" :model="form" :rules="formRules" label-width="80px" style="width:100%">
      <el-form-item label="栏目名称" prop="channelName">
        <el-input v-model="form.channelName" placeholder="请填写栏目"></el-input>
      </el-form-item>
      <el-form-item label="栏目描述" prop="channelDesc">
        <el-input v-model="form.channelDesc"></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input v-model="form.weight" placeholder="数字越大，在前端排序越靠前"></el-input>
      </el-form-item>
      <el-form-item label="适配终端">
        <el-checkbox-group v-model="form.fit">
          <el-checkbox :label="1" disabled>PAD</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.go(-1)" type="primary" plain>取 消</el-button>
        <el-button @click="submit(form)" type="primary">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isValidFiveNumber } from "@/utils/RegExp.js";
var CheckSort = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入1-99999之间的数字"));
  } else if (!isValidFiveNumber(value)) {
    callback(new Error("请输入1-99999之间的数字"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      loading: true,
      form: {},
      formRules: {
        channelName: [
          { required: true, message: "请填写正确的栏目名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        channelDesc: [
          { required: false, trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        weight: [
          {
            required: true,
            validator: CheckSort,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //   提交
    submit(form) {
      this.loading = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$post("/data/my", {
            pathL: "/health/healthAssessmentChannel/saveChannel",
            id: form.id,
            channelName: form.channelName,
            channelDesc: form.channelDesc,
            weight: form.weight,
            terminal: "PAD"
          }).then(res => {
            this.loading = false;
            if (res.state === 0) {
              this.$message({
                message: "保存成功",
                type: "success",
                center: true
              });
              this.$router.push({ name: "知识库/评估栏目/栏目列表管理" });
            } else {
              this.$message({
                message: res.msg,
                center: true
              });
            }
          });
        } else {
          this.$message({
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    }
  },
  mounted() {
    let id = this.$route.query.id;
    this.$get("/data/my", {
      pathL: "/health/healthAssessmentChannel/channelInfo",
      id: id
    }).then(res => {
      this.loading = false;
      if (res.state === 0) {
        this.form = res.data;
        this.form.fit = [1];
        console.log(this.form);
      } else {
        this.$message({
          message: res.msg,
          center: true
        });
      }
    });
  }
};
</script>

<style scoped>
.update {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
