<template>
  <div class="base-upload">
    <el-upload
      ref="upload"
      multiple
      :action="action"
      :data="data"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      list-type="picture"
      :on-success="handleSuccess"
      :limit="limit"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-preview="handlePreview"
    >
      <el-button size="mini" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
  </div>
</template>

<script>
import { getOption } from "@/api/upload";
export default {
  name: "BaseUpload",
  props: {
    tip: String,
    limit: Number,
    fileList: Array,
    rule: {
      type: Object,
      default: () => ({
        type: [],
        size: null
      })
    }
  },
  data() {
    return {
      data: {},
      action: "",
      beforeFiles: [],
      files: []
    };
  },
  watch: {
    fileList(now) {
      now.forEach(item => {
        this.files.push({
          name: item.name,
          url: item.url
        });
      });
    }
  },
  methods: {

    // 限制上传文件大小和类型
    limitFile(file) {
      const { type, size } = this.rule;
      const types = type.length === 0;
      const isType = types ? true : type.includes(file.type);
      const isSize = size ? file.size / 1024 / 1024 < size : true;
      const message = msg => {
        this.$message({
          message: msg,
          type: "warning",
          center: true
        });
      };
      if (!isType) {
      	message("请上传正确的文件类型");
				this.$refs.upload.clearFiles();
				this.$refs.upload.abort(file);
				return false;
      }
      if (!isSize) {
      	message(`当前上传限制为${size}M`);
				this.$refs.upload.clearFiles();
				this.$refs.upload.abort(file);
				return false;
      }
      return isType && isSize;
    },
    // 上传文件之前的钩子
    async beforeUpload(file) {
      try {
        const status = this.limitFile(file);
        if (!status) return false;
        const result = await getOption();
        // 生成10位随机数
        const random = Math.floor(
          (Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 9)
        );
        // 拿到上传路径
        this.action = result.host;
        // 拼接文件地址
        const url = `${result.host}/${result.dir}${random}`;
        this.beforeFiles.push({
          uid: file.uid,
          name: file.name,
          size: file.size,
          type: file.type,
          url
        });
        // 携带的参数
        const option = {
          name: random,
          key: `${result.dir}${random}`,
          policy: result.policy,
          OSSAccessKeyId: result.accessid,
          success_action_status: "200",
          signature: result.signature
        };
        this.data = option;
      } catch (error) {
        console.log(`上传失败${error}`);
      }
    },
    // 上传成功钩子
    handleSuccess(response, file, fileList) {
      const files = this.beforeFiles.filter(item => file.uid === item.uid);
      this.files.push(...files);
      this.$emit("notify", this.files);
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message({
        message: `当前限制上传${this.limit}个文件`,
        type: "warning",
        center: true
      });
    },
    // 文件删除钩子
    beforeRemove(file, fileList) {
      const status = file.url.includes("blob");
      if (status) {
        this.files = this.files.filter(item => item.uid !== file.uid);
      } else {
        this.files = this.files.filter(item => item.url !== file.url);
      }
      this.$emit("notify", this.files);
    },
    // 点击文件列表某一项钩子
    handlePreview(file) {
      const status = file.url.includes("blob");
      let url = "";
      if (status) {
        url = this.files.filter(item => item.uid === file.uid)[0].url;
      } else {
        url = this.files.filter(item => item.url === file.url)[0].url;
      }
      window.open(url);
    }
  }
};
</script>
