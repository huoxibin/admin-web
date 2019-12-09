<template>
  <div class="add">
    <!-- title -->
    <div class="addTitle">新增{{title}}</div>

    <!-- 填写文章表单 -->
    <div class="textForm" v-loading.fullscreen.lock="addloading" element-loading-text="正在保存">
      <el-form
        style="width:800px;"
        status-icon
        size="small"
        :model="textForm"
        :rules="rules"
        ref="textForm"
        label-width="200px"
        class="demo-ruleForm"
        label-suffix="："
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="textForm.title" ref="title"></el-input>
          <span v-if="textForm.title" class="Prompt">字数：{{textForm.title.length}}</span>
        </el-form-item>
        <el-form-item label="短标题">
          <el-input v-model="textForm.shortTitle" ref="shortTitle"></el-input>
          <span v-if="textForm.shortTitle" class="Prompt">字数：{{textForm.shortTitle.length}}</span>
        </el-form-item>
        <el-form-item label="文章来源" prop="articleType">
          <el-radio-group v-model="textForm.articleType" ref="articleType">
            <el-radio label="1" value="1">原创</el-radio>
            <el-radio label="2" value="2">转载</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 转载Show -->
        <el-form-item label="来源" prop="fromChannel" v-if="zzShow">
          <el-input v-model="textForm.fromChannel" ref="fromChannel"></el-input>
        </el-form-item>
        <el-form-item label="来源网址" prop="fromUrl" v-if="zzShow">
          <el-input v-model="textForm.fromUrl" ref="fromUrl"></el-input>
        </el-form-item>
        <el-form-item label="原标题" prop="fromTitle" v-if="zzShow">
          <el-input v-model="textForm.fromTitle" ref="fromTitle"></el-input>
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="textForm.author" ref="author"></el-input>
        </el-form-item>
        <el-form-item label="编辑" prop="editor">
          <el-input v-model="textForm.editor" ref="editor"></el-input>
        </el-form-item>
        <el-form-item label="Tag词" prop="tagStr">
          <div class="liulan" @click="tagShow=true">浏览</div>
          <div class="eltagShow">
            <el-tag v-for="(item,index) in tagStr" :key="index">{{item}}</el-tag>
          </div>
        </el-form-item>

        <!-- tag词浏览 -->
        <div class="llmtk" v-show="tagShow">
          <div class="llmtk_content">
            <div class="ll_top">
              <span>Tag词设置</span>
              <i @click="tagShow=false" class="el-icon-close"></i>
            </div>
            <div class="ll_center">
              <h5>您希望把内容归属那类标签？</h5>
              <el-checkbox-group v-model="checkboxGroup">
                <el-popover
                  v-for="(item,index) in tags"
                  :key="index"
                  placement="top-start"
                  width="80"
                  trigger="hover"
                >
                  <div class="tagchange">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="handleClose(item,index)"
                      plain
                    >删除该标签
                    </el-button>
                  </div>
                  <el-checkbox
                    style="margin:5px"
                    size="mini"
                    slot="reference"
                    :label="item.itemValue"
                    border
                  >{{item.itemValue}}
                  </el-checkbox>
                </el-popover>
              </el-checkbox-group>
              <el-button
                style="margin:5px"
                size="mini"
                type="danger"
                plain
                class="button-new-tag"
                @click="addTagmtk=true"
              >+ 新增
              </el-button>
            </div>

            <!-- 添加tag模态框 -->
            <div class="tagwarp" v-show="addTagmtk">
              <div class="addTagmtk">
                <div class="addTagmtk_top">添加</div>
                <div class="addTagmtk_bottom">
                  <el-form-item label-width="100px" label="名称" prop="tagName">
                    <el-input style="width:200px" v-model="tagName" ref="tagName"></el-input>
                  </el-form-item>
                </div>
                <div class="addTagmtk_btn">
                  <div @click="addTagName">确定</div>
                  <div @click="addTagmtk=false;tagName=''">取消</div>
                </div>
              </div>
            </div>

            <div class="ll_bottom">
              <div @click="addTagss">确定</div>
              <div @click="tagShow=false">取消</div>
            </div>
          </div>
        </div>

        <el-form-item label="发布平台及所属分类" prop="channelIds">
          <el-input
            resize="none"
            placeholder="这里是分类信息"
            rows="6"
            disabled
            type="textarea"
            v-model="channelIdsName"
            :value="channelIdsName"
            ref="channelIds"
          ></el-input>
        </el-form-item>
        <div class="xuanze" @click="flShow=true">选择</div>

        <!-- 分类模态框 -->
        <div class="flwarp" v-show="flShow">
          <div class="flmtk">
            <div class="fl_top">请选择发布的平台及所属分类</div>
            <div class="fl_center" style="padding-top:20px">
              <div class="fl_show" style="overflow:auto">
                <el-tree
                  :data="tree"
                  show-checkbox
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :props="defaultProps"
                ></el-tree>
              </div>
            </div>
            <div class="fl_bottom">
              <el-button @click="flyes" size="mini" type="primary">确定</el-button>
              <el-button @click="flShow=false" size="mini" type="info" plain>取消</el-button>
            </div>
          </div>
        </div>

        <!-- 引导图 -->
        <el-form-item label="引导图" prop="image">
          <div class="ydt">
            <img style="float:left;max-width:200px;max-height:120px" :src="textForm.image" alt>
            <div class="ybt_btn">
              <el-button @click="ydtShow=true" size="mini" type="primary">
                <i class="el-icon-upload el-icon--right"></i>上传图片
              </el-button>
              <p>
                <span>仅限</span>
                <span>*.jpg,*.jpeg,*.gif,*.png,*.bmp</span>
                <span>图片格式</span>
              </p>
            </div>
          </div>
        </el-form-item>

        <!-- 引导图模态框 -->
        <div class="ydtmtk" v-show="ydtShow">
          <div class="ydt_content">
            <div class="ydt_top">
              <span>上传图片</span>
              <i @click="ydtShow=false" class="el-icon-close"></i>
            </div>
            <div class="ydt_bottom">
              <el-tabs style="height:100%" v-model="activeName">
                <el-tab-pane label="本地上传" name="first">
                  <div class="bdsc">
                    <div class="bdsc_show">
                      <el-upload
                        class="upload-demo"
                        :headers="uploadHeaders"
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-upload="beforeAvatarUpload"
                        :on-success="onSuccess"
                        auto-upload
                        list-type="picture"
                        multiple
                        :limit="1"
                        :on-exceed="handleExceed"
                        :data="fileLister"
                        :file-list="fileList"
                        name="file"
                        v-model="textForm"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div
                          slot="tip"
                          class="el-upload__tip"
                        >只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！
                        </div>
                      </el-upload>
                    </div>
                    <div class="first_btn">
                      <el-button @click="imgOk" size="mini" type="primary">确定</el-button>
                      <el-button @click="ydtShow=false" size="mini" type="info" plain>取消</el-button>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="资源库" name="second">
                  <div class="server">
                    <div class="server_left">
                      <el-tree
                        :data="tree"
                        ref="serverTree1"
                        @check-change="serverTree(1,2)"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                      ></el-tree>
                    </div>
                    <div class="server_right">
                      <el-radio-group v-model="imgGroup" class="imgGroup">
                        <el-radio
                          class="imgCheck"
                          v-for="(item,index) in serverGroup1"
                          @change="imgGroupChange"
                          :key="index"
                          :label="item.image"
                        >
                          <img :src="item.image" alt>
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="server_btn">
                    <el-button @click="serverImgOK(1)" size="mini" type="primary">确定</el-button>
                    <el-button @click="ydtShow=false" size="mini" type="info" plain>取消</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <!-- 评论 -->
        <el-form-item label="是否允许评论" prop="isAllowComment">
          <el-radio-group v-model="textForm.isAllowComment" ref="isAllowComment">
            <el-radio label="0" value="0">否</el-radio>
            <el-radio label="1" value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 评论时间 -->
        <div style="display:flex;" v-if="commentShow">
          <el-form-item label="评论开始时间" prop="date">
            <el-date-picker
              style="width:600px"
              v-model="textForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>

        <!-- 摘要 -->
        <el-form-item label="摘要" prop="introduction">
          <el-input
            resize="none"
            placeholder="请输入摘要信息"
            rows="6"
            type="textarea"
            v-model="textForm.introduction"
            ref="introduction"
          ></el-input>
        </el-form-item>

        <!-- 富文本编辑器 -->
        <el-form-item label="文章内容" prop="context" v-if="id==='1' || id===1">
          <base-editor style="width:100%;height:300px" v-model="textForm.context"></base-editor>
        </el-form-item>

        <!-- 上传图片 -->
        <el-form-item v-if="id==='2' || id===2" prop="context">
          <el-button @click="uploadShow=true" type="primary">
            <i class="el-icon-upload2 el-icon--right"></i>上传图片
          </el-button>
          <div class="photoList" v-for="(item,index) in uploadImgGrouper" :key="index">
            <div class="photoList_left">
              <img :src="item.imageurl" alt>
              <div class="photoList_btn">
                <i @click="photoBig(index)" class="el-icon-zoom-in"></i>
                <i @click="photoChange(index)" class="el-icon-edit-outline"></i>
                <i @click="photoRemove(index)" class="el-icon-delete"></i>
              </div>
            </div>
            <div class="photoList_right">
              <el-form
                ref="uploadImgGrouper"
                :rules="imgFromRules"
                :model="item"
                size="mini"
                label-width="80px"
              >
                <!--:model="item.imgFrom" :rules="imgFromRules"-->
                <el-form-item label="标题" prop="title">
                  <el-input v-model="item.title"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                  <el-input v-model="item.sort"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                  <el-input
                    type="textarea"
                    rows="3"
                    placeholder="请输入内容"
                    v-model="item.introduction"
                    resize="none"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-form-item>
        <div class="photobigbox" v-show="photobigboxShow" @click="photobigboxShow=false">
          <img :src="photobigbox" alt>
        </div>

        <!-- 上传图片模态框 -->
        <div class="ydtmtk" v-show="uploadShow" v-if="id==='2'||id===2">
          <div class="ydt_content">
            <div class="ydt_top">
              <span>上传图片</span>
              <i @click="uploadShow=false" class="el-icon-close"></i>
            </div>
            <div class="ydt_bottom">
              <el-tabs style="height:100%" v-model="activeName">
                <el-tab-pane label="本地上传" name="first">
                  <div class="bdsc">
                    <div class="bdsc_show">
                      <el-upload
                        class="upload-demo"
                        :headers="uploadHeaders"
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-upload="photoUpload"
                        :on-success="onSuccessPhoto"
                        auto-upload
                        list-type="picture"
                        multiple
                        :limit="100"
                        :on-exceed="handleExceed"
                        :data="fileListPhotoer"
                        :file-list="fileListPhoto"
                        name="file"
                        v-model="textForm"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div
                          slot="tip"
                          class="el-upload__tip"
                        >只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件
                        </div>
                      </el-upload>
                    </div>
                    <div class="first_btn">
                      <el-button @click="imgGroupOk" size="mini" type="primary">确定</el-button>
                      <el-button @click="uploadShow=false" size="mini" type="info" plain>取消</el-button>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="资源库" name="second">
                  <div class="server">
                    <div class="server_left">
                      <el-tree
                        :data="tree"
                        ref="serverTree2"
                        @check-change="serverTree(2,2)"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                      ></el-tree>
                    </div>
                    <div class="server_right">
                      <el-checkbox-group v-model="uploadImgGroup" class="imgGroup">
                        <el-checkbox
                          class="imgCheck"
                          v-for="(item,index) in serverGroup2"
                          :key="index"
                          :label="item.image"
                        >
                          <img :src="item.image" alt>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="server_btn">
                    <el-button @click="photoYes" size="mini" type="primary">确定</el-button>
                    <el-button @click="uploadShow=false" size="mini" type="info" plain>取消</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <el-form-item label="视频内容" v-if="id==='3' || id===3" prop="context">
          <el-radio-group v-model="videoType" @change="videoChange">
            <el-radio :label="1">
              <!-- 上传视频 -->
              <el-button @click="uploadShow=true" :disabled="videoType!==1" type="primary">
                <i class="el-icon-upload2 el-icon--right"></i>上传视频
              </el-button>
              <span
                style="color:#ccc;margin-left:50px"
              >仅限*.mpg,*.mp4,*.rmvb,*.rm,*.mpeg,*.avi,*.wmv,*.flv主流视频格式</span>
            </el-radio>
            <el-radio style="margin:20px 0;" :label="2">
              <el-popover placement="right" trigger="manual" v-model="videoPopover">
                <iframe
                  id="videoer"
                  width="500"
                  height="400"
                  allowfullscreen="true"
                  frameborder="0"
                  :src="textForm.context"
                ></iframe>
                <el-input
                  style="width:580px;"
                  v-model="textForm.context"
                  :disabled="videoType!==2"
                  placeholder="请输入视频链接地址"
                  slot="reference"
                ></el-input>
              </el-popover>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="videoShow">
          <video ref="videos" width="100%" style="margin-top:10px" controls>
            <source :src="textForm.context" type="video/mp4">
            <source :src="textForm.context" type="video/webm">
            <source :src="textForm.context" type="video/ogg">
          </video>
        </el-form-item>

        <!-- 上传视频模态框 -->
        <div class="ydtmtk" v-show="uploadShow" v-if="id==='3' || id===3">
          <div class="ydt_content">
            <div class="ydt_top">
              <span>上传视频</span>
              <i @click="uploadShow=false" class="el-icon-close"></i>
            </div>
            <div class="ydt_bottom">
              <el-tabs style="height:100%" v-model="activeName">
                <el-tab-pane label="本地上传" name="first">
                  <div class="bdsc">
                    <div class="bdsc_show">
                      <base-upload
                        :limit="1"
                        tip="只允许上传格式为*.mpg,*.mp4,*.rmvb,*.rm,*.mpeg,*.avi,*.wmv,*.flv的文件！"
                        @notify="getUrl"
                      ></base-upload>
                    </div>
                    <div class="first_btn">
                      <el-button @click="videoYes" size="mini" type="primary">确定</el-button>
                      <el-button @click="uploadShow=false" size="mini" type="info" plain>取消</el-button>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="资源库" name="second">
                  <div class="server">
                    <div class="server_left">
                      <el-tree
                        :data="tree"
                        ref="serverTree3"
                        @check-change="serverTree(3,3)"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                      ></el-tree>
                    </div>
                    <div class="server_right">
                      <el-checkbox-group v-model="uploadImgGroup" class="imgGroup">
                        <el-checkbox
                          class="videoCheck"
                          v-for="(item,index) in serverGroup3"
                          :key="index"
                          :label="item.fileUrl"
                        >
                          <video width="400" height="260" controls>
                            <source :src="item.fileUrl" type="video/mp4">
                            <source :src="item.fileUrl" type="video/webm">
                            <source :src="item.fileUrl" type="video/ogg">
                          </video>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="server_btn">
                    <el-button @click="videoYes" size="mini" type="primary">确定</el-button>
                    <el-button @click="uploadShow=false" size="mini" type="info" plain>取消</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <!-- 上传音频 -->
        <el-form-item v-if="id==='4' || id===4">
          <el-button @click="uploadShow=true" type="primary">
            <i class="el-icon-upload2 el-icon--right"></i>上传音频
          </el-button>
          <span style="color:#ccc;margin-left:100px">仅限mp3音频格式</span>
          <audio style="width:100%;margin-top:20px" controls v-if="audioShow">
            <source :src="textForm.context" type="audio/ogg">
            <source :src="textForm.context" type="audio/mpeg">
            <source :src="textForm.context" type="audio/wav">
          </audio>
        </el-form-item>

        <!-- 上传音频模态框 -->
        <div class="ydtmtk" v-show="uploadShow" v-if="id==='4' || id===4">
          <div class="ydt_content">
            <div class="ydt_top">
              <span>上传音频</span>
              <i @click="uploadShow=false" class="el-icon-close"></i>
            </div>
            <div class="ydt_bottom">
              <el-tabs style="height:100%" v-model="activeName">
                <el-tab-pane label="本地上传" name="first">
                  <div class="bdsc">
                    <div class="bdsc_show">
                      <el-upload
                        class="upload-demo"
                        :headers="uploadHeaders"
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemoveAudio"
                        :before-upload="addioUpload"
                        :on-success="onSuccessAudio"
                        auto-upload
                        list-type="picture"
                        multiple
                        :limit="1"
                        :on-exceed="handleExceed"
                        :data="fileListAudioer"
                        :file-list="fileListAudio"
                        name="file"
                        v-model="textForm"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只允许上传格式为*.mp3的文件！</div>
                      </el-upload>
                    </div>
                    <div class="first_btn">
                      <el-button @click="audioYes" size="mini" type="primary">确定</el-button>
                      <el-button @click="uploadShow=false" size="mini" type="info" plain>取消</el-button>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="资源库" name="second">
                  <div class="server">
                    <div class="server_left">
                      <el-tree
                        :data="tree"
                        ref="serverTree4"
                        @check-change="serverTree(4,4)"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                      ></el-tree>
                    </div>
                    <div class="server_right">
                      <el-checkbox-group v-model="uploadImgGroup" class="imgGroup">
                        <el-checkbox
                          class="audioCheck"
                          v-for="(item,index) in serverGroup4"
                          :key="index"
                          :label="item.fileUrl"
                        >
                          <audio style="width:400px" controls>
                            <source :src="item.fileUrl" type="audio/ogg">
                            <source :src="item.fileUrl" type="audio/mpeg">
                            <source :src="item.fileUrl" type="audio/wav">
                          </audio>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="server_btn">
                    <el-button @click="audioYes" size="mini" type="primary">确定</el-button>
                    <el-button @click="uploadShow=false" size="mini" type="info" plain>取消</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <!-- 初始阅读量 -->
        <el-form-item label="初始阅读量" prop="defaultReadCount">
          <el-input v-model="textForm.defaultReadCount"></el-input>
        </el-form-item>

        <!-- 阅读量的增长数 -->
        <el-form-item label="阅读量的增长数" prop="readStep">
          <el-input v-model="textForm.readStep"></el-input>
        </el-form-item>

        <!-- 收藏量 -->
        <el-form-item label="初始收藏量" prop="defaultFavoriteAmout">
          <el-input v-model="textForm.defaultFavoriteAmout"></el-input>
        </el-form-item>

        <!-- 收藏量的增长数 -->
        <el-form-item label="收藏量增长数" prop="favoriteIncreaseNum">
          <el-input v-model="textForm.favoriteIncreaseNum"></el-input>
        </el-form-item>

        <!-- 语音播放按钮 -->
        <el-form-item v-if="$route.query.title == '文章'" label="语音播放" prop="favoriteIncreaseNum">
          <el-switch v-model="textForm.radioPlay" active-color="#13ce66"
                     inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <!-- 提交表单 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm(textForm)">保存</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
	import { isValidNumber } from "@/utils/RegExp.js";

	const CheckInt = (rule, value, callback) => {
		if (!value) {
			callback();
		}
		else if (!isValidNumber(value)) {
			callback(new Error("请输入整数数字"));
		}
		else {
			callback();
		}
	};
	export default {
		computed: {
			videoUrl () {
				return this.textForm.context;
			}
		},
		data () {
			return {
				videoType: 1, // 1 是上传视频  2是外部视频
				videoPopover: false,
				addloading: false,
				audioShow: false,
				videoShow: false,
				audioNice: false,
				videoNice: false,
				photoNice: false,
				removema: [ "1" ],
				uploadUrl: "/data/uploadImg",
				uploadHeaders: {
					accessToken: this.$store.getters.accessToken
				},
				tagStr: [],
				popoverShow: false,
				title: "",
				id: null,
				contextType: null,
				tags: [],
				tagName: "",
				inputVisible: false,
				tagShow: false,
				zzShow: false,
				addTags: false,
				flShow: false,
				ydtShow: false,
				uploadShow: false,
				uploadPhoto: "",
				uploadVideo: "",
				uploadAudio: "",
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				pickerOptionsPlend: {
					disabledDate: time => {
						return time.getTime() < new Date(this.textForm.plstart).getTime();
					}
				},
				pickerOptionsXxtime: {
					disabledDate: time => {
						return time.getTime() < new Date(this.textForm.fabuTime).getTime();
					}
				},
				commentShow: false,
				activeName: "first",
				fileLister: {pathL: ""},
				fileList: [],
				fileListPhoto: [],
				fileListPhotoer: {},
				fileListAudio: [],
				fileListAudioer: {},
				newTags: [],
				addTagmtk: false,
				tree: [],
				item: "",
				defaultProps: {
					children: "children",
					label: "label"
				},
				ydtImage: "",
				textForm: {
					context: "",
					title: "",
					shortTitle: "",
					image: "",
					articleType: "1",
					fromChannel: "",
					fromUrl: "",
					fromTitle: "",
					author: "",
					editor: "",
					tagStr: "",
					time: "",
					isAllowComment: "1",
					commentBdate: "",
					commentEdate: "",
					date: "",
					introduction: "",
					channelIds: "",
					videoFrameUrl: "",
					defaultReadCount: "",
					readStep: "",
					defaultFavoriteAmout: "",
					favoriteIncreaseNum: "",
					radioPlay: false,//语音播放默认开启
				},
				channelIdsName: "",
				rules: {
					favoriteIncreaseNum: {
						validator: CheckInt,
						trigger: "blur"
					},
					defaultFavoriteAmout: {
						validator: CheckInt,
						trigger: "blur"
					},
					defaultReadCount: {
						validator: CheckInt,
						trigger: "blur"
					},
					readStep: {
						validator: CheckInt,
						trigger: "blur"
					},
					context: [
						{
							required: true,
							message: "内容不能为空！",
							trigger: "blur"
						}
					],
					title: [
						{
							required: true,
							message: "内容不能为空，且字数控制在100个字之内！",
							trigger: "blur"
						},
						{min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
					],
					shortTitle: [
						{
							required: true,
							message: "内容不能为空，且字数控制在100个字之内！",
							trigger: "blur"
						},
						{min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
					],
					articleType: [
						{required: true, message: "请选择文章来源", trigger: "change"}
					],
					fromChannel: [
						{
							required: true,
							message: "内容不能为空！"
						},
						{
							min: 1,
							max: 100,
							message: "长度在 1 到 100 个字符",
							trigger: "blur"
						}
					],
					author: [
						{
							required: true,
							message: "内容不能为空，且字数控制在24个字之内！",
							trigger: "blur"
						},
						{min: 1, max: 24, message: "长度在 1 到 24 个字符", trigger: "blur"}
					],
					editor: [
						{
							required: false,
							message: "内容不能为空，且字数控制在24个字之内！",
							trigger: "blur"
						},
						{min: 0, max: 24, message: "长度在 0 到 24 个字符", trigger: "blur"}
					],
					tagStr: [
						{
							min: 0,
							max: 10,
							message: "请将字数控制在10个字之内！",
							trigger: "change"
						}
					],
					channelIds: [
						{
							required: true,
							message: "请选择发布平台及所属分类",
							trigger: "blur"
						}
					],
					image: [
						{
							required: true,
							message: "请上传引导图",
							trigger: "change"
						}
					],
					time: [
						{
							required: true,
							message: "发布时间不能为空!",
							trigger: "blur"
						}
					],
					isAllowComment: [
						{
							required: true,
							message: "请选择是否允许文章评论",
							trigger: "change"
						}
					],
					date: [
						{
							required: true,
							message: "评论时间不能为空!",
							trigger: "blur"
						}
					],
					introduction: [
						{
							required: true,
							message: "内容不能为空！",
							trigger: "blur"
						},
						{
							min: 1,
							max: 200,
							message: "请将字数控制在200个字之内！",
							trigger: "blur"
						}
					]
				},
				imgFrom: {},
				imgFromRules: {
					title: [
						{
							required: true,
							message: "内容不能为空！",
							trigger: "blur"
						}
					],
					sort: [
						{
							required: true,
							message: "内容不能为空！",
							trigger: "blur"
						}
					]
				},
				xzaa: [],
				tagchange: false,
				checkboxGroup: [],
				serverGroup1: [],
				serverGroup2: [],
				serverGroup3: [],
				serverGroup4: [],
				imgGroup: [],
				uploadImgGroup: [],
				uploadImgGrouper: [],
				photobigbox: "",
				uploadBus: {},
				photobigboxShow: false
			};
		},
		watch: {
			videoUrl (now) {
				if (now === "") {
					this.videoPopover = false;
				}
				else if (this.videoType === 2) {
					document.getElementById("videoer").src = now;
					this.videoPopover = true;
				}
			}
		},
		methods: {
			// 获取视频地址
			getUrl (data) {
				this.videoNice = true;
				this.uploadVideo = data[ 0 ].url;
				this.$post("/data/my", {
					pathL: "/ap/aliyunOss/bigVideoFrame",
					videoUrl: data[ 0 ].url
				}).then(res => {
					if (res.state === 0) {
						this.textForm.videoFrameUrl = res.data;
					}
					else {
						this.$message({
							type: "error",
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 视频类型单选修改
			videoChange (now) {
				this.videoShow = false;
				this.textForm.context = "";
			},
			// 引导图本地上传验证
			beforeAvatarUpload (file) {
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
			// 音频本地上传验证
			addioUpload (file) {
				const extension = file.type === "audio/mp3";
				const extension2 = file.type === "audio/mpeg";
				const isLt2M = file.size / 1024 / 1024 < 100;
				if (!extension && !extension2) {
					this.$message({
						message: "只允许上传格式为*.mp3的文件！",
						center: true
					});
				}
				if (!isLt2M) {
					this.$message({
						message: "上传音频大小不能超过100MB!",
						center: true
					});
				}
				return (extension || extension2) && isLt2M;
			},
			// 图片上传验证
			photoUpload (file) {
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
			// 提交表单
			submitForm (textForm) {
				console.log(textForm.channelIds);
				if (textForm.date === null || textForm.date === undefined) {
					textForm.date = "";
				}
				var This = this;
				var uploadImgGrouper = This.uploadImgGrouper;
				var iT = true;
				if (uploadImgGrouper != undefined && uploadImgGrouper.length > 0) {
					for (var i = 0; i < uploadImgGrouper.length; i++) {
						this.$refs.uploadImgGrouper[ i ].validate(valid => {
							if (!valid) {
								iT = false;
								This.$message({
									message: "请填写正确的表单信息",
									center: true
								});
							}
						});
					}
				}
				this.$refs.textForm.validate(valid => {
					if (valid) {
						if (iT) {
							if (
								textForm.isAllowComment === 0 ||
								textForm.isAllowComment === "0"
							) {
								textForm.date = "";
							}
							else if (
								textForm.isAllowComment === 1 ||
								textForm.isAllowComment === "1"
							) {
								textForm.date = textForm.date;
							}
							if (textForm.articleType === 1 || textForm.articleType === "1") {
								(textForm.fromChannel = ""),
									(textForm.fromUrl = ""),
									(textForm.fromTitle = "");
							}
							else if (
								textForm.articleType === 2 ||
								textForm.articleType === "2"
							) {
								(textForm.fromChannel = textForm.fromChannel),
									(textForm.fromUrl = textForm.fromUrl),
									(textForm.fromTitle = textForm.fromTitle);
							}
							this.addloading = true;
							this.$axios
								.post(
									"/data/new",
									this.$qs.stringify({
										pathL: "/news/newsArticle/saveArticle",
										contextType: Number(this.id),
										title: textForm.title,
										image: textForm.image,
										shortTitle: textForm.shortTitle,
										articleType: textForm.articleType,
										fromChannel: textForm.fromChannel,
										fromUrl: textForm.fromUrl,
										fromTitle: textForm.fromTitle,
										author: textForm.author,
										editor: textForm.editor,
										tagStr: this.tagStr.join(","),
										isAllowComment: textForm.isAllowComment,
										commentBdate: textForm.date[ 0 ],
										commentEdate: textForm.date[ 1 ],
										introduction: textForm.introduction,
										channelIds: textForm.channelIds,
										context: textForm.context,
										readCount: 0,
										defaultReadCount:
											textForm.defaultReadCount === ""
												? 0
												: textForm.defaultReadCount,
										readStep: textForm.readStep === "" ? 1 : textForm.readStep,
										videoFrameUrl: textForm.videoFrameUrl,
										theCreater: this.$store.getters.userInfo.userName,
										videoType: Number(this.id) === 3 ? this.videoType : null,
										favoriteIncreaseNum: textForm.favoriteIncreaseNum == "" ? 1 : textForm.favoriteIncreaseNum,
										defaultFavoriteAmout: textForm.defaultFavoriteAmout == "" ? 0 : textForm.defaultFavoriteAmout,
										radioPlay: textForm.radioPlay ? 1 : 0,//是否播放 1，播放，0 不播放
									})
								)
								.then(res => {
									this.addloading = false;
									if (res.data.state === 0) {
										this.$message({
											message: "添加成功",
											type: "success",
											center: true
										});
										if (this.id === 2 || this.id === "2") {
											this.$axios
												.post(
													"/data/my",
													this.$qs.stringify({
														pathL: "/news/newsArticleImage/saveArticleImages",
														articleId: res.data.data,
														articleImages: JSON.stringify(This.uploadImgGrouper)
													})
												)
												.then(res => {
												})
												.catch(err => {
												});
										}
										this.back();
									}
									else {
										this.$message.error({
											message: res.data.msg,
											type: "errer",
											center: true
										});
									}
								})
								.catch(err => {
									this.addloading = false;
									console.log(err);
								});
						}
						else {
							this.$message({
								message: "请填写正确的表单信息",
								center: true
							});
						}
					}
					else {
						this.$message({
							message: "请填写正确的表单信息",
							center: true
						});
					}
				});
			},
			addTagss () {
				this.tagStr = this.checkboxGroup;
				this.tagShow = false;
			},
			// 取消返回
			back () {
				this.$router.push({name: "信息管理/健康资讯/资讯列表"});
			},
			handleClose (item) {
				this.$confirm("您确定要删除该标签吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios
							.post(
								"/data/my",
								this.$qs.stringify({
									pathL: "/ap/sysDictItem/del",
									itemId: item.id
								})
							)
							.then(res => {
								if (res.data.state === 0) {
									this.$message({
										message: "删除成功",
										type: "success",
										center: true
									});
									this.getTags();
									this.tagStr = this.checkboxGroup;
									var iN = item.itemName;
									this.tagStr.splice(this.tagStr.indexOf(iN), 1);
								}
							})
							.catch(err => {
								console.log(err);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			handleRemove (file, fileList) {
				this.removema = fileList;
			},
			handlePreview (file) {
				console.log(file);
			},
			handleExceed (files, fileList) {
				this.$message.warning(
					`当前限制选择 1 个文件，本次选择了 ${
						files.length
						} 个文件，共选择了 ${ files.length + fileList.length } 个文件`
				);
			},
			onSuccess (response, file, fileList) {
				if (response.state === 0) {
					this.photoNice = true;
					var fileUrl = [
						{
							name: file.name,
							url: response.data.url
						}
					];
					this.ydtImage = response.data.url;
					this.fileList = fileUrl;
				}
				else {
					this.$message({
						message: response.msg,
						center: true
					});
				}
			},
			imgOk () {
				if (this.photoNice === true) {
					if (this.removema.length === 0) {
						this.textForm.image = "";
					}
					else {
						this.textForm.image = this.ydtImage;
					}
					this.ydtShow = false;
				}
				else {
					this.$message({
						message: "文件还没有上传成功！",
						center: true
					});
				}
			},
			onSuccessPhoto (response, file, fileList) {
				var fileUrl = [];
				for (var m = 0; m < fileList.length; m++) {
					fileUrl.push({
						name: fileList[ m ].name,
						imageurl: fileList[ m ].response.data.url
					});
				}
				this.uploadBus = fileUrl;
			},
			imgGroupOk () {
				var uploadBus = this.uploadBus;
				var uploadImgGrouper = [];
				for (var c = 0; c < uploadBus.length; c++) {
					uploadImgGrouper.push({
						imageurl: uploadBus[ c ].imageurl
					});
				}
				this.uploadImgGrouper = uploadImgGrouper;
				this.uploadShow = false;
			},
			photoYes () {
				this.uploadImgGrouper = this.fileListPhoto;
				this.uploadShow = false;
			},
			serverTree (index, fileType) {
				var serverTree;
				switch (index) {
					case 1:
						serverTree = this.$refs.serverTree1.getCheckedNodes();
						break;
					case 2:
						serverTree = this.$refs.serverTree2.getCheckedNodes();
						break;
					case 3:
						serverTree = this.$refs.serverTree3.getCheckedNodes();
						break;
					case 4:
						serverTree = this.$refs.serverTree4.getCheckedNodes();
						break;
				}
				var channelIds = [];
				for (var m = 0; m < serverTree.length; m++) {
					channelIds.push(serverTree[ m ].id);
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
								case 3:
									this.serverGroup3 = res.data.data;
									break;
								case 4:
									this.serverGroup4 = res.data.data;
									break;
							}
						}
						else {
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
			photoRemove (index) {
				this.uploadImgGrouper.splice(index, 1);
				this.fileListPhoto.splice(index, 1);
			},
			photoBig (index) {
				this.photobigbox = this.uploadImgGrouper[ index ].imageurl;
				this.photobigboxShow = true;
			},
			photoChange (index) {
			},
			imgGroupChange (val) {
				this.ydtImage = val;
			},
			serverImgOK () {
				this.textForm.image = this.ydtImage;
				this.ydtShow = false;
			},
			videoYes () {
				if (this.videoNice === true) {
					this.videoShow = true;
					this.uploadShow = false;
					this.textForm.context = this.uploadVideo;
					this.$refs.videos.src = this.uploadVideo;
				}
				else {
					this.$message({
						message: "请确认视频上传成功",
						center: true
					});
				}
			},

			onSuccessAudio (response, file, fileList) {
				if (response.state === 0) {
					this.audioNice = true;
					var fileUrl = [
						{
							name: file.name,
							url: response.data.url
						}
					];
					this.uploadAudio = response.data.url;
					this.fileListAudio = fileUrl;
				}
				else {
					this.$message({
						message: response.msg,
						center: true
					});
				}
			},
			handleRemoveAudio () {
				this.audioShow = false;
				this.textForm.context = "";
			},
			audioYes () {
				if (this.audioNice === true) {
					this.audioShow = true;
					this.textForm.context = this.uploadAudio;
					this.uploadShow = false;
				}
				else {
					this.$message({
						message: "文件还没有上传成功！",
						center: true
					});
				}
			},

			getTags () {
				this.$axios
					.get("/data/my", {
						params: {
							pathL: "/ap/sysDictItem/getValueByName",
							dictName: "articleTag"
						}
					})
					.then(res => {
						if (res.data.state === 0) {
							this.tags = res.data.data;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			addTagName () {
				if (this.tagName === "") {
					this.$message({
						message: "请输入您要添加的Tag词！",
						center: true
					});
				}
				else {
					this.$axios
						.post(
							"/data/my",
							this.$qs.stringify({
								pathL: "/ap/sysDictItem/addByName",
								dictName: "articleTag",
								itemName: this.tagName,
								itemValue: this.tagName,
								sortInt: 0
							})
						)
						.then(res => {
							if (res.data.state === 0) {
								this.$message({
									message: "添加成功！",
									type: "success",
									center: true
								});
								this.getTags();
								this.tagName = "";
							}
							else {
								this.$message({
									message: res.data.msg,
									center: true
								});
							}
						})
						.catch(err => {
							console.log(err);
						});
					this.addTagmtk = false;
				}
				filter
			},
			flyes () {
				let tree = this.$refs.tree.getCheckedNodes();
				tree = tree.filter(item => item.waperChan === undefined); //解决 “健康资讯发布时候选择的平台是医哆咖所有平台，结果在医生端也有展示” bug
				console.log(tree);
				let [ treeId, treeName, treeIds, treeNames ] = [ [], [], [], [] ];
				for (let i of tree) {
					treeId.push(i.id);
					treeName.push(i.label);
				}
				let getInfo = item => {
					if (item.pathLevel !== 0 && item.pathLevel !== undefined) {
						let data = this.$refs.tree.getNode(item.id).parent.data;
						if (data.pathLevel === undefined) {
							return;
						}
						else {
							treeIds.push(data.id);
							treeNames.push(data.label);
							getInfo(data);
						}
					}
				};
				for (let item of tree) {
					getInfo(item);
				}
				treeIds = [ ...new Set([ ...treeId, ...treeIds ]) ];
				treeNames = [ ...new Set([ ...treeName, ...treeNames ]) ];
				this.channelIdsName = treeNames.join(",");
				this.textForm.channelIds = treeIds.join(",");
				this.flShow = false;
			}
		},
		mounted () {
			this.title = this.$route.query.title;
			this.id = this.$route.query.id;
			this.getTags();
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
								id: terminals[ i ].id,
								label: terminals[ i ].name,
								waperChan: terminals[ i ]
							});
						}
						for (var b = 0; b < channels.length; b++) {
							for (var y = 0; y < flglDatas.length; y++) {
								if (channels[ b ].terminalId == flglDatas[ y ].id) {
									if (flglDatas[ y ].children != undefined) {
										flglDatas[ y ].children.push(channels[ b ]);
									}
									else {
										flglDatas[ y ].children = [];
										flglDatas[ y ].children.push(channels[ b ]);
									}
								}
							}
						}
						this.tree = flglDatas;
					}
				})
				.catch(err => {
					console.log(err);
				});
			if (this.$route.query.title == "文章") {
				this.textForm.radioPlay = true;
			}
		},
		updated () {
			if (this.$refs.articleType.value === "2") {
				this.zzShow = true;
			}
			else {
				this.zzShow = false;
			}
			if (this.$refs.isAllowComment.value === "1") {
				this.commentShow = true;
			}
			else {
				this.commentShow = false;
			}
		}
	};
</script>

<style scoped>
  .addText {
    width: 100%;
    height: auto;
  }

  .videoMsg {
    width: 600px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .loading {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
  }

  .addTitle {
    width: 100%;
    height: 50px;
    background: rgba(243, 243, 243, 1);
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    padding-left: 20px;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
  }

  .textForm {
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
  }

  .Prompt {
    width: 100px;
    position: absolute;
    top: 0;
    right: -120px;
  }

  .liulan,
  .xuanze {
    width: 80px;
    height: 30px;
    background: #fff;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    float: right;
    margin-right: -100px;
    color: #666;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  .liulan:hover {
    background: rgba(0, 165, 238, 1);
    color: #fff;
  }

  .xuanze {
    margin-top: -140px;
  }

  .xuanze:hover {
    background: rgba(0, 165, 238, 1);
    color: #fff;
  }

  .llmtk {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .llmtk_content {
    width: 600px;
    height: 300px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 1px solid #999;
  }

  .ll_top {
    width: 100%;
    height: 30px;
    background: rgba(136, 136, 136, 0.2);
    text-align: center;
    position: relative;
    border-bottom: 1px solid #999;
  }

  .ll_top span {
    line-height: 30px;
    color: #333;
    font-size: 14px;
  }

  .ll_top i {
    position: absolute;
    right: 10px;
    line-height: 30px;
    cursor: pointer;
  }

  .ll_center {
    width: 100%;
    height: 200px;
    padding: 10px;
    overflow: auto;
    box-sizing: border-box;
  }

  .ll_bottom h5 {
    margin-bottom: 10px;
  }

  .eltagShow {
    width: 580px;
    height: 100px;
    float: left;
    overflow: auto;
  }

  .ll_show {
    width: 100%;
    height: 170px;
    overflow-y: auto;
  }

  .ll_show ul {
    width: 100%;
    height: 160px;
  }

  .ll_show ul li {
    width: 90px;
    height: 50px;
    border-radius: 4px;
    border: 1px solid rgba(188, 188, 188, 1);
    float: left;
    margin: 10px 8px;
    font-size: 14px;
    box-sizing: border-box;
    background: rgba(242, 242, 242, 1);
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }

  .ll_show ul .now {
    color: #fff;
    background: rgba(0, 165, 238, 1);
  }

  .ll_show ul .tianjia {
    background: rgba(255, 204, 204, 1);
  }

  .ll_show ul li:hover {
    color: #fff;
    background: rgba(0, 165, 238, 1);
  }

  .ll_bottom,
  .addTagmtk_btn {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #ccc;
    align-items: center;
  }

  .addTagmtk_btn {
    height: 50px;
  }

  .ll_bottom > div,
  .addTagmtk_btn > div {
    width: 80px;
    height: 30px;
    background: rgba(242, 242, 242, 1);
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #eee;
    color: #666;
  }

  .ll_bottom > div:hover {
    border: 1px solid rgba(188, 188, 188, 1);
  }

  .tagwarp {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 199;
  }

  .tagchange {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .addTagmtk {
    width: 400px;
    height: 160px;
    position: absolute;
    background: #fff;
    border: 1px solid #666;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .addTagmtk_bottom {
    width: 100%;
    height: 80px;
    padding-top: 24px;
    box-sizing: border-box;
  }

  .addTagmtk_top {
    width: 100%;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
  }

  .flwarp {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.3);
  }

  .flmtk {
    width: 400px;
    height: 400px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 4px;
  }

  .fl_top,
  .ydt_top {
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

  .fl_btn {
    width: 100%;
    height: 60px;
    padding: 10px 20px;
    box-sizing: border-box;
  }

  .fl_show {
    width: 100%;
    height: 300px;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
  }

  .fl_bottom {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .ydt,
  .tagbox {
    width: 700px;
    height: 120px;
    padding-top: 10px;
    box-sizing: border-box;
  }

  .ydt p {
    margin-top: 10px;
    font-size: 14px;
    color: #ccc;
  }

  .ydt .ydtTitle,
  .tagbox .tagboxTitle {
    font-size: 14px;
    color: #606266;
    float: left;
    margin: 0 15px 0 35px;
  }

  .ybt_btn {
    margin: 10px 0 0 20px;
    float: left;
  }

  .ydtmtk,
  .photobigbox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    z-index: 9999;
    justify-content: center;
    align-items: center;
  }

  .ydt_content {
    width: 800px;
    height: 500px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    background: #fff;
  }

  .ydt_top i {
    float: right;
    margin: 8px 10px 0 0;
    cursor: pointer;
  }

  .ydt_bottom {
    width: 100%;
    /* height: 470px; */
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

  .videoCheck {
    width: 500px;
    height: 300px;
    margin: 10px -10px 10px 28px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  .audioCheck {
    width: 500px;
    height: 80px;
    margin: 10px -10px 10px 28px;
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

  .imgGroup p {
    font-size: 12px;
  }

  .photoList {
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-top: 10px;
    display: flex;
  }

  .photoList_left img {
    max-width: 100%;
    max-height: 120px;
  }

  .photoList_left {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .photoList_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px;
    margin: 20px 0;
    cursor: pointer;
    display: flex;
    font-size: 20px;
    justify-content: space-around;
  }

  .photoList_right {
    flex: 2;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
