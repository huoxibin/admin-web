<template>
  <div class="upload-container">
    <div class="upload">
      <el-row>
        <el-col :span="8">
          <div class="upload-btn">
            <el-button type="primary" :disabled="continueUpload" class="show-btn" size="mini">上传视频</el-button>
            <input
              type="file"
              :disabled="continueUpload"
              class="real-btn"
              id="fileUpload"
              @click="showProgress=true"
              @change="fileChange($event);authUpload()"
            >
          </div>
        </el-col>
        <!--<el-col :span="8" :offset="1" v-if="showProgress">-->
        <!--<el-button size="mini" @click="clearUpload">恢复上传</el-button>-->
        <!--</el-col>-->
      </el-row>
      <el-row class="m-t-10" v-if="showProgress">
        <el-col>
          <label class="el-upload__tip">
            上传状态:
            <span>{{statusText}}</span>
          </label>
        </el-col>
      </el-row>
      <el-row v-if="showProgress">
        <el-col>
          <el-progress :percentage="authProgress"></el-progress>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from "axios";
/////////////////////阿里云上传视频文件引用包//////////////////////////
import "./aliyun-upload-sdk/aliyun-oss-sdk-5.3.1.min.js";
import "./aliyun-upload-sdk/aliyun-upload-sdk-1.5.0.min.js";

export default {
  name: "UploadAuth",
  props: ["uId", "outTime", "size", "num", "reCount", "name", "upType"], //参数
  data() {
    return {
      continueUpload: true,
      showProgress: false,
      timeout: this.outTime || 60000, //超时时间
      partSize: this.size * 1048576, //大小
      parallel: this.num || 5, //上传个数限制
      retryCount: this.reCount || 3, //重试次数
      fileName: this.name, //上传的课程的名字
      retryDuration: "",
      region: "cn-shanghai",
      userId: this.uId,
      type: this.upType,
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: ""
    };
  },
  watch: {
    name: function() {
      this.fileName = this.name;
      if (this.fileName === "") {
        this.continueUpload = true;
      } else {
        this.continueUpload = false;
      }
    }
  },
  methods: {
    checkUploadType(file) {
      //校验上传的类型

      for (let i = 0; i < this.type.length; i++) {
        if (file.type === this.type[i]) {
          return true;
        }
      }
      return false;
    },
    fileChange(e) {
      this.file = e.target.files[0];
      if (!this.file) {
        this.$message("请先选择需要上传的文件!");
        return;
      }

      if (!this.checkUploadType(this.file)) {
        //校验上传的文件类型
        this.$message("请上传正确的视频类型!");
        return;
      }
      var Title = this.file.name;
      var userData = '{"Vod":{}}';
      if (this.uploader) {
        this.uploader.stopUpload();
        this.authProgress = 0;
        this.statusText = "";
      }
      this.uploader = this.createUploader();
      console.log(userData);
      this.uploader.addFile(this.file, null, null, null, userData);
      this.uploadDisabled = false;
      this.pauseDisabled = true;
      this.resumeDisabled = true;
    },
    authUpload() {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.uploadDisabled = true;
        this.pauseDisabled = false;
      }
    },
    // 暂停上传
    pauseUpload() {
      if (this.uploader !== null) {
        this.uploader.stopUpload();
        this.resumeDisabled = false;
        this.pauseDisabled = true;
      }
    },
    // 恢复上传
    resumeUpload() {
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.resumeDisabled = true;
        this.pauseDisabled = false;
      }
    },
    createUploader(type) {
      let self = this;
      let uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          self.uploadDisabled = false;
          self.resumeDisabled = false;
          self.statusText = "添加文件成功, 等待上传...";
          console.log("addFileSuccess: " + uploadInfo.file.name);
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)

          if (!uploadInfo.videoId) {
            self.continueUpload = true;
            self
              .$get("/data/my", {
                pathL: "/doctor/alimedia/createUploadVideo",
                title: self.fileName,
                fileName: uploadInfo.file.name //文件的完整名称
              })
              .then(res => {
                if (!res.state) {
                  let uploadAuth = res.data.uploadAuth;
                  let uploadAddress = res.data.uploadAddress;
                  let videoId = res.data.videoId;
                  uploader.setUploadAuthAndAddress(
                    uploadInfo,
                    uploadAuth,
                    uploadAddress,
                    videoId
                  );
                  self.$emit("getID", res.data.videoId); //回调，并传递视频的id
                }
              })
              .catch(err => {
                console.log(err);
              });
            self.statusText = "文件开始上传...";
            console.log(
              "onUploadStarted:" +
                uploadInfo.file.name +
                ", endpoint:" +
                uploadInfo.endpoint +
                ", bucket:" +
                uploadInfo.bucket +
                ", object:" +
                uploadInfo.object
            );
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            self
              .$get("/data/my", {
                pathL: "/doctor/alimedia/refreshUploadVideo",
                videoId: uploadInfo.videoId
              })
              .then(res => {
                //刷新视频上传的凭证
                let uploadAuth = res.data.uploadAuth;
                let uploadAddress = res.data.uploadAddress;
                let videoId = res.data.videoId;
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                );
              })
              .catch(error => {
                console.log(error);
              });
          }
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log(
            "onUploadSucceed: " +
              uploadInfo.file.name +
              ", endpoint:" +
              uploadInfo.endpoint +
              ", bucket:" +
              uploadInfo.bucket +
              ", object:" +
              uploadInfo.object
          );
          self.statusText = "文件上传成功!";
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log(
            "onUploadFailed: file:" +
              uploadInfo.file.name +
              ",code:" +
              code +
              ", message:" +
              message
          );
          self.statusText = "文件上传失败!";
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {
          console.log(
            "Canceled file: " +
              uploadInfo.file.name +
              ", code: " +
              code +
              ", message:" +
              message
          );
          self.statusText = "文件已暂停上传";
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          console.log(
            "onUploadProgress:file:" +
              uploadInfo.file.name +
              ", fileSize:" +
              totalSize +
              ", percent:" +
              Math.ceil(progress * 100) +
              "%"
          );
          let progressPercent = Math.ceil(progress * 100);
          self.$nextTick(() => {
            self.authProgress = progressPercent;
          });
          self.statusText = "文件上传中...";
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth

          self
            .$get("/data/my", {
              pathL: "/doctor/alimedia/refreshUploadVideo",
              videoId: uploadInfo.videoId
            })
            .then(res => {
              //刷新视频上传的凭证
              let uploadAuth = res.data.uploadAuth;
              uploader.resumeUploadWithAuth(uploadAuth);
            })
            .catch(error => {
              console.log(error);
            });
          self.statusText = "文件超时...";
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          self.continueUpload = false;
          self.$emit("showVd", true); //上传成功显示视频
          console.log("onUploadEnd: uploaded all the files");
          self.statusText = "文件上传完毕";
        }
      });
      return uploader;
    }
  }
};
</script>
<style>
.upload-container {
  width: 100%;
  margin: 0 auto;
}

.upload-btn {
  position: relative;
  width: 84px;
  height: 24px;
}
.show-btn,
.real-btn {
  position: absolute;
}
.show-btn {
  z-index: 1;
}
.real-btn {
  cursor: pointer;
  width: 84px;
  height: 24px;
  z-index: 2;
  opacity: 0;
  -webkit-opacity: 0;
  -moz-opacity: 0;
  -o-opacity: 0;
}
</style>
