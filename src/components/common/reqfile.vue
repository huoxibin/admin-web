<template>
  <dk-dialog
    :baseConfig="reqFileConfig"
    :showCancelBtn="false"
    :dialogShow.sync="reqFileConfig.visible"
    @confirmCallback="importFileConfirm"
    @cancelCallback="importFileCancel"
    @closeDialog="importFileCancel"
  >
    <el-form
            :inline="false"
            :model="importFileForm"
            label-width="0px"
            size="mini"
            slot="form"
    >
      <el-form-item label>
        <base-upload
          :tip="upload.tip"
          :rule="upload.rule"
          :limit="upload.limit"
          @notify="handleUploadImg"
        ></base-upload>
      </el-form-item>
    </el-form>
  </dk-dialog>
</template>

<script>
export default {
  name: "DkReqfile",
  props: {
    reqFileConfig: {
      type: Object,
      require: true
    },
    upload: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      uplaodFile: "",
      importFileForm: {}
    };
  },
  methods: {
    importFileConfirm() {
      this.reqFileConfig.visible = false;
      this.$emit("getUploadFile", this.uplaodFile);
    },
    importFileCancel() {
      this.reqFileConfig.visible = false;
    },
    handleUploadImg(url) {
      //上传文件
      if (url.length) {
        this.uplaodFile = url[0].url;
      } else {
        this.uplaodFile = "";
      }
    }
  }
};
</script>

<style scoped></style>
