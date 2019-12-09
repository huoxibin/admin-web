<template>
  <div>
    <dk-dialog
      :baseConfig="importDialogConfig"
      :dialogShow.sync="dialogShow"
      @confirmCallback="closeDialog"
      @cancelCallback="cancelDialog"
      @closeDialog="cancelDialog"
    >
      <el-form slot="form" size="mini" :inline="false" labelWidth="20px">
        <el-form-item>
          <el-upload
            ref="upload"
            class="upload-demo"
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="true"
            :before-upload="uploadFileJudge"
            :on-success="uploadFileSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xlsx文件</div>
          </el-upload>
        </el-form-item>
        <!--<el-form-item label="导出">-->
        <!--<a-->
        <!--class="el-button pull-right el-button&#45;&#45;primary el-button&#45;&#45;mini"-->
        <!--:href="exportExcelConfig.exportUrl"-->
        <!--:download="exportExcelConfig.exportTxt"-->
        <!--&gt;导出模板</a>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="是否导入成功">-->
        <!--<div>{{ this.importForm.fg }}</div>-->
        <!--</el-form-item>-->
      </el-form>
    </dk-dialog>
  </div>
</template>

<script>
export default {
  name: "exportExcel",
  data() {
    return {
      /////////////通用导入//////////////
      importDialogConfig: {
        width: "350px",
        title: "导入",
        cancelBtnTxt: "关闭"
      },
      importForm: {
        fg: "否",
        state: false //上传反应状态
      },
      uploadUrl: "/data/excel",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken,
        pathL: this.exportExcelConfig.uploadUrl,
        userId:this.$store.getters.userId
      }
    };
  },
  props: {
    exportExcelConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    dialogShow: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  mounted() {},
  methods: {
    uploadFileJudge(files) {
      if (
        files.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        this.$message({
          message: "只允许上传格式为.xlsx的文件！",
          center: true
        });
        this.$refs.upload.clearFiles();
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    uploadFileSuccess(val) {
      if (val.state === 0) {
        //this.importForm.fg = "是";
        this.importForm.state = true;
      } else {
        this.importForm.state = false;
        this.$message("导入失败！");
        this.$refs.upload.clearFiles(); // 清空上传
      }
    },
    closeDialog() {
      this.$refs.upload.clearFiles(); // 清空上传
      this.$emit("closeDialog", this.importForm.state);
    },
    cancelDialog() {
      this.$refs.upload.clearFiles(); // 清空上传
      this.$emit("cancelExcelConfig", this.importForm.state);
    }
  }
};
</script>

<style scoped></style>
