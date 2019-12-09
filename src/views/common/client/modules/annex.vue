<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>附件</span>
    </div>
    <div class="form">
      <el-form-item label="营业执照" label-width="200px">
        <div v-if="type === 'detail'">
          <p v-for="(item,index) in fileList1" :key="index" style="margin-top:0;">
            <!-- <span>{{item.name}}</span> -->
            <el-button style="margin-left:50px" type="success" @click="previewFn(item.url)">查看附件</el-button>
          </p>
        </div>
        <base-upload v-else :fileList="fileList1" @notify="handleUpload1"></base-upload>
      </el-form-item>
      <el-form-item label="法人身证份" label-width="200px">
        <div v-if="type === 'detail'">
          <p v-for="(item,index) in fileList2" :key="index" style="margin-top:0;">
            <!-- <span>{{item.name}}</span> -->
            <el-button style="margin-left:50px" type="success" @click="previewFn(item.url)">查看附件</el-button>
          </p>
        </div>
        <base-upload v-else :fileList="fileList2" @notify="handleUpload2"></base-upload>
      </el-form-item>
      <el-form-item label="二类医疗器械经营许可证" label-width="200px">
        <div v-if="type === 'detail'">
          <p v-for="(item,index) in fileList3" :key="index" style="margin-top:0;">
            <!-- <span>{{item.name}}</span> -->
            <el-button style="margin-left:50px" type="success" @click="previewFn(item.url)">查看附件</el-button>
          </p>
        </div>
        <base-upload v-else :fileList="fileList3" @notify="handleUpload3"></base-upload>
      </el-form-item>
      <el-form-item label="银行资信证明" label-width="200px">
        <div v-if="type === 'detail'">
          <p v-for="(item,index) in fileList4" :key="index" style="margin-top:0;">
            <!-- <span>{{item.name}}</span> -->
            <el-button style="margin-left:50px" type="success" @click="previewFn(item.url)">查看附件</el-button>
          </p>
        </div>
        <base-upload v-else :fileList="fileList4" @notify="handleUpload4"></base-upload>
      </el-form-item>
      <el-form-item label="医哆咖项目城市合伙人、经销商加盟信息登记申请表" label-width="200px">
        <div v-if="type === 'detail'">
          <p v-for="(item,index) in fileList5" :key="index" style="margin-top:0;">
            <!-- <span>{{item.name}}</span> -->
            <el-button style="margin-left:50px" type="success" @click="previewFn(item.url)">查看附件</el-button>
          </p>
        </div>
        <base-upload v-else :fileList="fileList5" @notify="handleUpload5"></base-upload>
      </el-form-item>
      <el-form-item label="经营规划" label-width="200px">
        <div v-if="type === 'detail'">
          <p v-for="(item,index) in fileList6" :key="index" style="margin-top:0;">
            <!-- <span>{{item.name}}</span> -->
            <el-button style="margin-left:50px" type="success" @click="previewFn(item.url)">查看附件</el-button>
          </p>
        </div>
        <base-upload v-else :fileList="fileList6" @notify="handleUpload6"></base-upload>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Annex",
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type: this.$route.params.type,
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      fileList6: []
    };
  },
  methods: {
    handleUpload1(file) {
      const files = file.map(item => ({
        name: item.name,
        url: item.url
      }));
      this.form.businessLicense = JSON.stringify(files);
    },
    handleUpload2(file) {
      const files = file.map(item => ({
        name: item.name,
        url: item.url
      }));
      this.form.corporateIdentityCard = JSON.stringify(files);
    },
    handleUpload3(file) {
      const files = file.map(item => ({
        name: item.name,
        url: item.url
      }));
      this.form.businessCertificate = JSON.stringify(files);
    },
    handleUpload4(file) {
      const files = file.map(item => ({
        name: item.name,
        url: item.url
      }));
      this.form.bankReferenceLetter = JSON.stringify(files);
    },
    handleUpload5(file) {
      const files = file.map(item => ({
        name: item.name,
        url: item.url
      }));
      this.form.joinApplication = JSON.stringify(files);
    },
    handleUpload6(file) {
      const files = file.map(item => ({
        name: item.name,
        url: item.url
      }));
      this.form.businessPlan = JSON.stringify(files);
    },
    //查看附件事件
    previewFn (url) {
      window.open(url);
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