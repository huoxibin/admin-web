<template>
  <div class="flgl">
    <div class="flgl_left">
      <div class="flgl_title">发布平台及所属分类</div>
      <div class="flgl_tree">
        <el-tree ref="tree" node-key="id" :default-expanded-keys="keyId" highlight-current :data="flglData" :props="defaultProps" @node-click="handleNodeClick" :check-on-click-node="true">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <img class="tree-icon" v-if="data.favoriteDefault===1" src="./../images/icon.png" alt="">
            <span style="font-size:14px;">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="flgl_right" v-loading="removeLoading" element-loading-text="正在删除">
      <div class="flgl_top">
        <p>基本信息</p>
        <div class="zflBtn" v-show="twoBtnShow">
          <el-button style="width:100px;" size="mini" @click="goXzpt" type="primary" plain>新增子分类</el-button>
          <el-button style="width:100px;" v-show="delBtnShow" size="mini" @click="delChannel" type="info" plain>删除</el-button>
        </div>
      </div>
      <!--<router-view/>-->
      <div class="xzpt" v-show="EditShow">
        <!-- 表单 -->
        <el-form id="flglFrom" ref="flglFrom" label-suffix="：" size="mini" :model="flglFrom" :rules="flglFromRules" label-width="120px">
          <el-input type="hidden" ref="id" label="id" style="width:400px" v-model="flglFrom.id"></el-input>
          <el-input type="hidden" ref="terminalId" label="terminalId" style="width:400px" v-model="flglFrom.terminalId"></el-input>
          <el-input type="hidden" ref="parentId" label="parentId" style="width:400px" v-model="flglFrom.parentId"></el-input>
          <el-form-item label="名称" prop="name">
            <el-input ref="name" style="width:400px" v-model="flglFrom.name"></el-input>
            <span style="margin-left:10px;color:#666;">字数：{{flglFrom.name?flglFrom.name.length:0}}</span>
          </el-form-item>

          <el-form-item label="别名" prop="alias">
            <el-input ref="alias" style="width:400px" v-model="flglFrom.alias"></el-input>
            <span style="margin-left:10px;color:#666;">字数：{{flglFrom.alias?flglFrom.alias.length:0}}</span>
          </el-form-item>

          <el-form-item label="启用与禁用" prop="enable">
            <el-radio-group v-model="flglFrom.enable">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="flglFrom.parentId===0" label="推荐" prop="favoriteDefault">
            <el-radio-group v-model="flglFrom.favoriteDefault">
              <el-radio :label="0">不推荐</el-radio>
              <el-radio :label="1">推荐</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input ref="sort" style="width:400px" v-model="flglFrom.sort"></el-input>
          </el-form-item>

          <el-form-item label="友盟事件ID">
            <el-input style="width:400px" v-model="flglFrom.umengStatistics"></el-input>
          </el-form-item>

          <el-form-item label="引导图" prop="image">
            <el-input ref="image" type="hidden" v-model="flglFrom.image"></el-input>
            <img style="float:left;" v-bind:src="flglFrom.image" class="isWidth" alt="">
            <div class="ydtBtn">
              <el-button @click="photoUploadShow=true" type="primary">
                <i class="el-icon-upload el-icon--right"></i>上传图片</el-button>
              <p style="color:#666;">
                <span>仅限</span>
                <span>.jpg .jpeg .gif .png .bmp</span>
                <span>等图片格式</span>
              </p>
            </div>
          </el-form-item>

          <el-form-item label="首页模板" prop="homePageTemplate">
            <el-input ref="homePageTemplate" style="width:400px" v-model="flglFrom.homePageTemplate"></el-input>
          </el-form-item>

          <el-form-item label="列表页模板" prop="listPageTemplate">
            <el-input ref="listPageTemplate" style="width:400px" v-model="flglFrom.listPageTemplate"></el-input>
          </el-form-item>

          <el-form-item label="SEO关键词" prop="seoWords">
            <el-input style="width:400px" type="textarea" rows="6" resize="none" v-model="flglFrom.seoWords">
            </el-input>
            <p style="color:#666;">注意：多个SEO关键词以逗号隔开</p>
          </el-form-item>

          <el-form-item>
            <el-button style="width:80px;" @click="saveChannel" size="mini" type="primary">保存</el-button>
            <el-button @click="goFlgl" style="width:80px;" size="mini" type="info" plain>取消</el-button>
          </el-form-item>
        </el-form>

        <!-- 引导图模态框 -->
        <div class="guideModel" v-show="photoUploadShow">
          <div class="guide_content">
            <div class="guide_top">
              <span>上传图片</span>
              <i @click="photoUploadShow=false" class="el-icon-close"></i>
            </div>
            <div class="guide_bottom">
              <el-tabs style="height:100%">
                <el-tab-pane label="本地上传">
                  <div class="bdsc">
                    <div class="bdsc_show">
                      <el-upload class="upload-demo" :headers="uploadHeaders" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :on-success="onSuccess" :on-error="onError" auto-upload list-type="picture" multiple :limit=1 :on-exceed="handleExceed" :data="fileLister" :file-list="fileList" name="file" v-model="fileData">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
                      </el-upload>
                    </div>
                    <div class="first_btn">
                      <el-button size="mini" @click="upOk" type="primary">确定</el-button>
                      <el-button size="mini" type="info" plain @click="photoUploadShow=false">取消</el-button>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="资源库" name="second">
                  <div class="server">
                    <div class="server_left">
                      <el-tree :data="treeServer" ref="serverTree1" @check-change="serverTree(1,2)" show-checkbox node-key="id" :props="defaultProps">
                      </el-tree>
                    </div>
                    <div class="server_right">
                      <el-radio-group v-model="flglFromImage" class="imgGroup">
                        <el-radio class="imgCheck" v-for="item,index in serverGroup1" @change="flglGroupChange" :key="index" :label="item.image">
                          <img :src="item.image" alt="">
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="server_btn">
                    <el-button @click="flglYes" size="mini" type="primary">确定</el-button>
                    <el-button @click="photoUploadShow=false" size="mini" type="info" plain>取消</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <div class="xzpt" v-show="addEditShow">
        <!-- 表单 -->
        <el-form id="addFrom" ref="addFrom" label-suffix="：" size="mini" :model="addFrom" :rules="flglFromRules" label-width="120px">
          <el-input type="hidden" ref="id" label="id" style="width:400px" v-model="addFrom.id"></el-input>
          <el-input type="hidden" ref="terminalId" label="terminalId" style="width:400px" v-model="addFrom.terminalId"></el-input>
          <el-input type="hidden" ref="parentId" label="parentId" style="width:400px" v-model="addFrom.parentId"></el-input>
          <el-form-item label="名称" prop="name">
            <el-input ref="name" style="width:400px" v-model="addFrom.name"></el-input>
            <span style="margin-left:10px;color:#666;">字数：{{addFrom.name?addFrom.name.length:0}}</span>
          </el-form-item>

          <el-form-item label="别名" prop="alias">
            <el-input ref="alias" style="width:400px" v-model="addFrom.alias"></el-input>
            <span style="margin-left:10px;color:#666;">字数：{{addFrom.alias?addFrom.alias.length:0}}</span>
          </el-form-item>

          <el-form-item label="启用与禁用" prop="enable">
            <el-radio-group v-model="addFrom.enable">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="showId===1" label="推荐" prop="favoriteDefault">
            <el-radio-group v-model="addFrom.favoriteDefault">
              <el-radio :label="0">不推荐</el-radio>
              <el-radio :label="1">推荐</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input ref="sort" style="width:400px" v-model="addFrom.sort"></el-input>
          </el-form-item>


          <el-form-item label="友盟事件ID">
            <el-input style="width:400px" v-model="addFrom.umengStatistics"></el-input>
          </el-form-item>

          <el-form-item label="引导图" prop="image">
            <el-input ref="image" type="hidden" v-model="addFrom.image"></el-input>
            <img style="float:left;" v-bind:src="addFrom.image" class="isWidth" alt="">
            <div class="ydtBtn">
              <el-button @click="addphotoUploadShow=true" type="primary">
                <i class="el-icon-upload el-icon--right"></i>上传图片</el-button>
              <p style="color:#666;">
                <span>仅限</span>
                <span>.jpg .jpeg .gif .png .bmp</span>
                <span>等图片格式</span>
              </p>
            </div>
          </el-form-item>

          <el-form-item label="首页模板" prop="homePageTemplate">
            <el-input ref="homePageTemplate" style="width:400px" v-model="addFrom.homePageTemplate"></el-input>
          </el-form-item>

          <el-form-item label="列表页模板" prop="listPageTemplate">
            <el-input ref="listPageTemplate" style="width:400px" v-model="addFrom.listPageTemplate"></el-input>
          </el-form-item>

          <el-form-item label="SEO关键词" prop="seoWords">
            <el-input style="width:400px" type="textarea" rows="6" resize="none" v-model="addFrom.seoWords">
            </el-input>
            <p style="color:#666;">注意：多个SEO关键词以逗号隔开</p>
          </el-form-item>

          <el-form-item>
            <el-button style="width:80px;" @click="addFromSubimit(addFrom)" size="mini" type="primary">保存</el-button>
            <el-button @click="goFlgl" style="width:80px;" size="mini" type="info" plain>取消</el-button>
          </el-form-item>
        </el-form>

        <!-- 引导图模态框 -->
        <div class="guideModel" v-show="addphotoUploadShow">
          <div class="guide_content">
            <div class="guide_top">
              <span>添加 上传图片</span>
              <i @click="addphotoUploadShow=false" class="el-icon-close"></i>
            </div>
            <div class="guide_bottom">
              <el-tabs style="height:100%">
                <el-tab-pane label="本地上传">
                  <div class="bdsc">
                    <div class="bdsc_show">
                      <el-upload class="upload-demo" :headers="uploadHeaders" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" name="file" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :on-success="addOnSuccess" :on-error="onError" auto-upload list-type="picture" multiple :limit=1 :on-exceed="handleExceed" :data="addfileLister" :file-list="addfileList" v-model="addFrom">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！</div>
                      </el-upload>
                    </div>
                    <div class="first_btn">
                      <el-button size="mini" @click="upOk" type="primary">确定</el-button>
                      <el-button size="mini" type="info" plain @click="addphotoUploadShow=false">取消</el-button>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="资源库" name="second">
                  <div class="server">
                    <div class="server_left">
                      <el-tree :data="treeServer" ref="serverTree2" @check-change="serverTree(2,2)" show-checkbox node-key="id" :props="defaultProps">
                      </el-tree>
                    </div>
                    <div class="server_right">
                      <el-radio-group v-model="addFromImage" class="imgGroup">
                        <el-radio class="imgCheck" v-for="item,index in serverGroup2" @change="addGroupChange" :key="index" :label="item.image">
                          <img :src="item.image" alt="">
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="server_btn">
                    <el-button @click="addYes" size="mini" type="primary">确定</el-button>
                    <el-button @click="addphotoUploadShow=false" size="mini" type="info" plain>取消</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showId: null,
      addOpenid: null,
      addFromImage: "",
      flglFromImage: "",
      flglBus: "",
      addBus: "",
      treeServer: [],
      serverGroup1: [],
      serverGroup2: [],
      removeLoading: false,
      addEditShow: false,
      keyId: [],
      addphotoUploadShow: false,
      addFrom: {
        parentId: "",
        name: "",
        alias: "",
        enable: "",
        sort: "",
        umengStatistics:"",
        image: "",
        favoriteDefault: "",
        homePageTemplate: "",
        listPageTemplate: "",
        seoWords: "",
        terminalId: ""
      },
      addfileLister: {},
      addfileList: [],
      EditShow: false,
      delBtnShow: true,
      twoBtnShow: false,
      flglData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      photoUploadShow: false,
      flglFrom: {},
      flglFromRules: {
        name: [
          {
            required: true,
            message: "内容不能为空，且字数控制在6个字之内！",
            trigger: "blur"
          },
          {
            min: 1,
            max: 6,
            message: "内容不能为空，且字数控制在6个字之内！",
            trigger: "blur"
          }
        ],
        alias: [
          {
            required: false,
            message: "字数控制在6个字之内！",
            trigger: "blur"
          },
          {
            min: 1,
            max: 6,
            message: "字数控制在6个字之内！",
            trigger: "blur"
          }
        ],
        enable: [
          { required: true, message: "请选择启用或者禁用", trigger: "change" }
        ],
        sort: [
          { required: true, message: "请输入正整数进行排序！", trigger: "blur" }
        ]
      },
      activeName: "first",
      fileData: null,
      fileList: [],
      fileLister: {},
      uploadUrl: "/data/uploadImg",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      }
    };
  },
  methods: {
    flglGroupChange(val) {
      this.flglBus = val;
    },
    addGroupChange(val) {
      this.addBus = val;
    },
    flglYes() {
      this.flglFrom.image = this.flglBus;
      this.photoUploadShow = false;
    },
    addYes() {
      this.addFrom.image = this.addBus;
      this.addphotoUploadShow = false;
    },
    serverTree(index, fileType) {
      var serverTree;
      switch (index) {
        case 1:
          serverTree = this.$refs.serverTree1.getCheckedNodes();
          break;
        case 2:
          serverTree = this.$refs.serverTree2.getCheckedNodes();
          break;
      }
      var channelIds = [];
      for (var m = 0; m < serverTree.length; m++) {
        channelIds.push(serverTree[m].id);
      }
      channelIds = channelIds.join(",");
      this.$axios
        .get("/data/my", {
          params: {
            pathL: "/news/newsArticle/sourceFiles",
            channelIds: channelIds,
            fileType: fileType
          }
        })
        .then(res => {
          if (res.data.state === 0) {
            switch (index) {
              case 1:
                this.serverGroup1 = res.data.data;
                break;
              case 2:
                this.serverGroup2 = res.data.data;
                break;
            }
          } else {
            this.$message.error({
              message: res.data.msg,
              type: "errer",
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleNodeClick(data) {
      this.openId = data.id;
      this.showId = data.parentId === undefined ? 1 : 0;
      this.$refs["addFrom"].resetFields();
      this.twoBtnShow = true;
      if (data.parentId !== undefined) {
        this.EditShow = true;
        this.flglFrom = data;
        this.addEditShow = false;
      }
      this.addFrom.parentId = data.parentId !== undefined ? data.id : 0;
      this.addFrom.terminalId =
        data.terminalId !== undefined ? data.terminalId : Number(data.id.slice(0,data.id.length-1));
    },
    updataTree(openId) {
      this.$axios
        .get("/data/my", {
          params: {
            pathL: "/news/newsChannel/channelTree"
          }
        })
        .then(res => {
          if (res.data.state === 0) {
            let terminals = res.data.data.terminals;
            let channels = res.data.data.channels;
            let flglDatas = [];
            for (var i = 0; i < terminals.length; i++) {
              flglDatas.push({
                id: terminals[i].id + ".",
                label: terminals[i].name,
                waperChan: terminals[i]
              });
            }
            for (var b = 0; b < channels.length; b++) {
              for (var y = 0; y < flglDatas.length; y++) {
                if (channels[b].terminalId == flglDatas[y].id) {
                  if (flglDatas[y].children != undefined) {
                    flglDatas[y].children.push(channels[b]);
                  } else {
                    flglDatas[y].children = [];
                    flglDatas[y].children.push(channels[b]);
                  }
                }
              }
            }
            this.flglData = flglDatas;
            this.EditShow = false;
            if (openId != undefined && openId != null) {
              this.keyId = [openId];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delChannel() {
      let openId = this.flglFrom.id;
      let parentId = this.flglFrom.parentId;
      this.$confirm("您确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeLoading = true;
          this.$axios
            .post(
              "/data/my",
              this.$qs.stringify({
                pathL: "/news/newsChannel/delChannel",
                id: openId
              })
            )
            .then(res => {
              this.removeLoading = false;
              if (res.data.state === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功",
                  center: true
                });
                this.EditShow = false;
                //更新树,openId应该传上级树ID
                this.updataTree(parentId);
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true
          });
        });
    },
    addFromSubimit(addFrom) {
      let openId = this.addOpenid;
      this.$axios
        .post(
          "/data/my",
          this.$qs.stringify({
            pathL: "/news/newsChannel/saveNewChannel",
            parentId: this.addFrom.parentId,
            favoriteDefault: this.showId === 1 ? addFrom.favoriteDefault : 0,
            name: addFrom.name,
            alias: addFrom.alias,
            enable: addFrom.enable,
            sort: addFrom.sort,
            umengStatistics:addFrom.umengStatistics,
            image: addFrom.image,
            homePageTemplate: addFrom.homePageTemplate,
            listPageTemplate: addFrom.listPageTemplate,
            seoWords: addFrom.seoWords,
            terminalId: this.addFrom.terminalId
          })
        )
        .then(res => {
          if (res.data.state === 0) {
            this.$message({
              type: "success",
              message: "保存成功",
              center: true
            });
            //更新树
            this.updataTree(this.openId);
            this.$refs["addFrom"].resetFields();
            this.goFlgl();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveChannel() {
      let openId;
      openId = this.flglFrom.id;
      this.$axios
        .post(
          "/data/my",
          this.$qs.stringify({
            pathL: "/news/newsChannel/saveNewChannel",
            id: this.flglFrom.id,
            parentId: this.flglFrom.parentId,
            name: this.flglFrom.name,
            favoriteDefault:
              this.flglFrom.parentId === 0 ? this.flglFrom.favoriteDefault : 0,
            alias: this.flglFrom.alias,
            enable: this.flglFrom.enable,
            sort: this.flglFrom.sort,
            umengStatistics:this.flglFrom.umengStatistics,
            image: this.flglFrom.image,
            homePageTemplate: this.flglFrom.homePageTemplate,
            listPageTemplate: this.flglFrom.listPageTemplate,
            seoWords: this.flglFrom.seoWords,
            terminalId: this.flglFrom.terminalId
          })
        )
        .then(res => {
          if (res.data.state === 0) {
            this.$message({
              type: "success",
              message: "保存成功",
              center: true
            });
            //更新树
            this.updataTree(this.openId);
            this.$refs["flglFrom"].resetFields();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    goXzpt() {
      this.EditShow = false;
      this.addEditShow = true;
    },
    goFlgl() {
      this.EditShow = false;
      this.addEditShow = false;
    },
    beforeAvatarUpload(file) {
      const extension = file.type === "image/jpg";
      const extension2 = file.type === "image/jpeg";
      const extension3 = file.type === "image/gif";
      const extension4 = file.type === "image/png";
      const extension5 = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5
      ) {
        this.$message({
          message: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
          center: true
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传图片大小不能超过10MB!",
          center: true
        });
      }
      return (
        (extension || extension2 || extension3 || extension4 || extension5) &&
        isLt2M
      );
    },
    onSuccess(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      this.flglFrom.image = response.data.url;
      this.fileList = fileUrl;
    },
    addOnSuccess(response, file, fileList) {
      var fileUrl = [
        {
          name: file.name,
          url: response.data.url
        }
      ];
      this.addFrom.image = response.data.url;
      this.fileList = fileUrl;
    },
    addonSuccess() {},
    upOk() {
      this.photoUploadShow = false;
      this.addphotoUploadShow = false;
    },
    onError(err, file, fileList) {},
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
  mounted() {
    this.updataTree(null);
    this.$axios
      .get("/data/my", {
        params: {
          pathL: "/news/newsChannel/channelTree"
        }
      })
      .then(res => {
        if (res.data.state === 0) {
          let terminals = res.data.data.terminals;
          let channels = res.data.data.channels;
          let flglDatas = [];
          for (var i = 0; i < terminals.length; i++) {
            flglDatas.push({
              id: terminals[i].id,
              label: terminals[i].name,
              waperChan: terminals[i]
            });
          }
          for (var b = 0; b < channels.length; b++) {
            for (var y = 0; y < flglDatas.length; y++) {
              if (channels[b].terminalId == flglDatas[y].id) {
                if (flglDatas[y].children != undefined) {
                  flglDatas[y].children.push(channels[b]);
                } else {
                  flglDatas[y].children = [];
                  flglDatas[y].children.push(channels[b]);
                }
              }
            }
          }
          this.treeServer = flglDatas;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scoped>
.isWidth {
  width: 100px;
  height: 100px;
}
.xzpt {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 10px;
}

.ydtBtn {
  float: left;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
}
.guideModel {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 999;
  justify-content: center;
  align-items: center;
}
.guide_content {
  width: 800px;
  height: 500px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: #fff;
}
.server {
  width: 100%;
  height: 340px;
  display: flex;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.server_left {
  flex: 1;
  overflow: auto;
  border-right: 1px solid #ccc;
}
.server_right {
  flex: 3;
  overflow: auto;
}
.server_btn {
  width: 100%;
  height: 60px;
  display: flex;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  align-items: center;
}

.imgGroup {
  width: 100%;
  height: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}
.imgCheck {
  width: 150px;
  height: 150px;
  margin: 10px -10px 3px 28px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.imgGroup img {
  max-width: 100px;
  max-height: 100px;
}
.guide_top {
  width: 100%;
  height: 30px;
  text-align: center;
  color: #333;
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
  line-height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  border-radius: 4px 4px 0 0;
}
.guide_top i {
  float: right;
  margin: 8px 10px 0 0;
  cursor: pointer;
}
.guide_bottom {
  width: 100%;
  height: 470px;
  box-sizing: border-box;
  padding: 10px;
}
.bdsc {
  width: 100%;
  height: 400px;
}
.bdsc_show {
  width: 100%;
  height: 340px;
  overflow: auto;
}
.first_btn {
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #ccc;
}
.flgl {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  height: auto;
  display: flex;
}

.flgl_left {
  width: 260px;
  min-height: 600px;
  border: 1px solid #ccc;
  background: #fff;
  padding: 1px;
  overflow: auto;
  margin-right: 5px;
}
.custom-tree-node {
  display: flex;
  align-items: center;
}
.tree-icon {
  margin-right: 6px;
}
.flgl_title {
  width: 100%;
  height: 40px;
  color: #666;
  text-align: center;
  line-height: 40px;
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
}

.flgl_right {
  flex: 1;
  height: auto;
  overflow: hidden;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.flgl_top {
  background: linear-gradient(
    0deg,
    rgba(226, 226, 226, 1) 0%,
    rgba(226, 226, 226, 1) 0%,
    rgba(242, 242, 242, 1) 100%,
    rgba(242, 242, 242, 1) 100%
  );
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flgl_top p {
  color: #666;
  font-size: 14px;
  font-weight: 600;
}
</style>
