<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :limit="uploadConfig.limit"
    :on-exceed="handleExceed"
    :action="header"
    :file-list="fileList"
    :headers="uploadHeaders"
    :show-file-list="true"
    :before-upload="uploadFileJudge"
    :on-success="uploadFileSuccess"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">{{uploadConfig.tip}}</div>
  </el-upload>
</template>

<script>
export default {
  name: "upload",
  props: {
    uploadConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    fileList:{
      type:Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken,
        pathL: this.uploadConfig.uploadUrl
      },
      header: "/data/uploadImg"
    };
  },
  watch:{
    'uploadConfig.fileList'(){
     // debugger

    }
  },
  mounted() {

  },
  methods: {
    uploadFileJudge(files) {
      let fg=this.uploadConfig.rule.type.indexOf(files.type);
      if (fg<=0) {
        this.$message({
          message: this.uploadConfig.tip,
          center: true
        });
        this.$refs.upload.clearFiles();
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.uploadConfig.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    uploadFileSuccess(val,fileList) {
      // 请求成功
      this.$emit("getUploadInfo", val,fileList);

    }
  }
};
</script>

<style scoped>
</style>