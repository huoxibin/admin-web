<template>
  <div class="find" v-loading="loading" element-loading-text="拼命加载中">
    <div class="find-top">
      <el-form ref="form" size="mini" style="width:100%" :model="form" label-width="100px">
        <div class="wrap">
          <div class="find-top-left">
            <el-form-item label="标题">{{form.topical}}</el-form-item>
            <el-form-item label="描述">
              <p style="white-space: pre-line;">{{form.description}}</p>
            </el-form-item>
            <el-form-item label="排序">{{form.orderNumber}}</el-form-item>
            <el-form-item label="栏目">{{form.channelName}}</el-form-item>
          </div>
          <div class="find-top-right">
            <el-form-item label="封面">
              <div class="upload-img">
                <img :src="form.imageUrl" class="avatar">
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="find-bottom">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: 700;">题目列表</span>
        </div>
        <el-card
          v-for="item,index in form.subject"
          :key="index"
          shadow="hover"
          style="margin-top:10px;"
        >
          <div class="subject">
            <p>
              <span>{{item.sortNumber}}、</span>
              <span style="white-space: pre-line;">{{item.title}}</span>
            </p>
            <p style="width:300px;text-align: right;">
              <span>题目类型：</span>
              <span v-if="item.type==='1'">单选</span>
              <span v-if="item.type==='2'">多选</span>
            </p>
          </div>
          <el-radio-group
            v-if="item.type==='1'"
            v-model="item.choice"
            style="display:flex;flex-flow: column wrap;"
          >
            <el-radio
              style="margin:20px 0px 0px 30px"
              v-for="itemer,indexer in item.options"
              :key="indexer"
              :label="itemer.score"
            >{{itemer.text}}</el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-if="item.type==='2'"
            v-model="item.choice"
            style="display:flex;flex-flow: column wrap;"
          >
            <el-checkbox
              style="margin:20px 0px 0px 30px"
              v-for="itemer,indexer in item.options"
              :key="indexer"
              :label="itemer.score"
            >{{itemer.text}}</el-checkbox>
          </el-checkbox-group>
        </el-card>
      </el-card>
      <el-card class="box-card" style="margin-top:20px;">
        <div slot="header" class="clearfix">
          <span style="font-weight: 700;">题目规则</span>
        </div>
        <el-form ref="ruleForm" label-width="80px" label-position="top">
          <el-form-item
            v-for="item,index in form.answerrule"
            :key="index"
            :label="index+1+'、'+item.scoreMin+' — '+item.scoreMax+'分'"
          >
            <p style="word-wrap:break-word;margin-left:20px">{{item.resultDesc}}</p>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="find-btn">
      <el-button size="mini" style="width:100px" @click="$router.go(-1)" type>返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      form: {}
    };
  },
  methods: {},
  mounted() {
    let id = this.$route.query.id;
    this.$get("/data/my", {
      pathL: "/health/healthAssessmentInfo/assessmentDetailManager",
      assessmentId: id
    }).then(res => {
      this.loading = false;
      if (res.state === 0) {
        this.form = res.data;
        this.form.answerrule = JSON.parse(res.data.answerrule);
        let subject = JSON.parse(res.data.subject);
        this.form.subject = JSON.parse(res.data.subject);
        for (let i = 0; i < subject.length; i++) {
          this.form.subject[i].options = JSON.parse(subject[i].options);
          this.form.subject[i].type = "1";
        }
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
.find {
  width: 100%;
  height: 100%;
}
.upload-img {
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.upload-img:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
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
.find-top {
  display: flex;
  padding: 20px 20px 10px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.wrap {
  display: flex;
}
.find-bottom {
  width: 60%;
  margin: 20px 0 20px 100px;
}
.find-top-left {
  overflow: hidden;
  flex: 2;
}
.find-top-right {
  overflow: hidden;
  flex: 1;
}
.type {
  float: right;
  width: 300px;
  justify-content: space-around;
  align-items: center;
  display: flex;
}
.number {
  display: flex;
  align-items: center;
}
.number ul {
  display: flex;
}
.number ul li {
  cursor: pointer;
  margin: 0 20px;
}
.table-btn {
  display: flex;
  justify-content: space-around;
}
.table-btn img {
  cursor: pointer;
}
.score {
  display: flex;
  align-items: center;
}
.find-btn {
  width: 60%;
  height: 100px;
  display: flex;
  margin-left: 100px;
  align-items: center;
  justify-content: space-around;
}
.subject {
  display: flex;
  justify-content: space-between;
}
</style>
