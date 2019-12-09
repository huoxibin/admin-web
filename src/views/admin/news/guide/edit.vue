<template>
  <div class="guide-edit" v-loading="loading && type !== 'add'">
    <el-form
      ref="form"
      :model="form"
      size="mini"
      :rules="rules"
      label-width="150px"
      style="width: 800px"
      v-if="type !== 'preview'"
    >
      <el-form-item label="指南名称" prop="consensusName">
        <el-input v-model="form.consensusName"></el-input>
      </el-form-item>
      <el-form-item label="Tag词">
        <base-tag :list="tagList" @handleClick="handleClick"></base-tag>
      </el-form-item>
      <el-form-item label="选择分类" prop="belongedType">
        <base-tree
          :tree="tree"
          :list="list"
          :expanded="expanded"
          nodeKey="levelType"
          :checked="checked"
          @confirm="getCurrent"
        ></base-tree>
      </el-form-item>
      <el-form-item label="文章来源" prop="articleSource">
        <el-input v-model="form.articleSource"></el-input>
      </el-form-item>
      <el-form-item label="指南内容" prop="consensusContent">
        <base-editor v-model="form.consensusContent" style="height: 400px;"></base-editor>
      </el-form-item>
      <el-form-item label="上传附件">
        <base-upload :rule="rule" :fileList="fileList" :limit="1" @notify="handleUpload"></base-upload>
      </el-form-item>
      <el-form-item label="初始阅读量" prop="originalReadAmount">
        <el-input v-model="form.originalReadAmount"></el-input>
      </el-form-item>
      <el-form-item label="阅读量增长系数" prop="readamountAddrule">
        <el-input v-model="form.readamountAddrule"></el-input>
      </el-form-item>

      <!-- 收藏量 -->
      <el-form-item label="初始收藏量" prop="defaultFavoriteAmout">
        <el-input v-model="form.defaultFavoriteAmout"></el-input>
      </el-form-item>

      <!-- 收藏量的增长数 -->
      <el-form-item label="收藏量增长数" prop="favoriteIncreaseNum">
        <el-input v-model="form.favoriteIncreaseNum"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="$router.back()">取 消</el-button>
      </el-form-item>
    </el-form>
    <base-preview v-else>
      <div class="preview">
        <div class="header">
          <h2>{{form.consensusName}}</h2>
        </div>
        <div class="info">
          <p>作者：{{form.publisher}}</p>
          <p>评论：99+</p>
        </div>
      </div>
      <base-editview :element="form.consensusContent"></base-editview>
    </base-preview>
  </div>
</template>

<script>
import { isValidNumber } from "@/utils/RegExp.js";
const CheckInt = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (!isValidNumber(value)) {
    callback(new Error("请输入整数数字"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      type: this.$route.params.type,
      loading: false,
      form: {
        consensusName: "",
        tagWords: "",
        belongedType: "",
        articleSource: "",
        consensusContent: "",
        importedAddition: {},
        originalReadAmount: "",
        readamountAddrule: "",
        ownedFirstLev: "",
        ownedSecondLev: "",
        ownedThridLev: "",
        ownedFirstIds: "",
        ownedSecondIds: "",
        ownedThridIds: "",
        createdDate: null,
        publishedDate: null,
        favoriteAmount: 0,
				defaultFavoriteAmout:'',
				favoriteIncreaseNum:'',
        likeAmount: 0
      },
      rules: {
				favoriteIncreaseNum:{
					validator: CheckInt,
					trigger: "blur"
				},
				defaultFavoriteAmout:{
					validator: CheckInt,
					trigger: "blur"
				},
        consensusName: [
          { required: true, message: "请输入指南名称", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        belongedType: {
          required: true,
          message: "请选择分类",
          trigger: "blur"
        },
        articleSource: [
          {
            required: true,
            message: "请输入文章来源",
            trigger: "blur"
          },
          {
            min: 1,
            max: 500,
            message: "长度在 1 到 500 个字符",
            trigger: "blur"
          }
        ],
        consensusContent: {
          required: true,
          message: "请输入指南内容",
          trigger: "blur"
        },
        originalReadAmount: {
          validator: CheckInt,
          trigger: "blur"
        },
        readamountAddrule: {
          validator: CheckInt,
          trigger: "blur"
        }
      },
      tagList: [],
      tree: [],
      list: [],
      expanded: [],
      checked: [],
      rule: {
        type: ["application/pdf"]
      },
      fileList: []
    };
  },
  beforeRouteEnter(to, from, next) {
    if(to.query.type == 2){ //编辑
      to.meta.bread[2].name='预览'
    }else{ //预览
      to.meta.bread[2].name='编辑'
    }
    next()
  },
  created() {
    this.getTree();
    if (this.type !== "add") {
      this.getInfo(this.$route.query.id);
    }
  },
  methods: {
    // 选中tag词
    handleClick(data) {
      this.tagList = data;
      this.form.tagWords = data.join(",");
    },
    // 获取Tree
    getTree() {
      this.$post("/data/my", {
        pathL: "/doctor/guideConsensus/getDepartmentList"
      }).then(res => {
        if (res.state === 0) {
          const lv1 = res.data.firstMenuList;
          const lv2 = res.data.secondLevelMenu;
          const lv3 = res.data.thirdLevelMenu;
          lv2.forEach(item => {
            item.children = lv3.filter(i => item.id === i.parentId);
          });
          lv1.forEach(item => {
            item.children = lv2.filter(i => item.id === i.parentId);
          });
          this.tree = lv1;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 获取选中的树节点
    getCurrent(tree) {
      this.form.belongedType = tree;
      this.list = tree.map(item => item.label);
      const lv1 = tree.filter(item => item.levelType.includes("levelType1"));
      const lv2 = tree.filter(item => item.levelType.includes("levelType2"));
      const lv3 = tree.filter(item => item.levelType.includes("levelType3"));
      // label
      this.form.ownedFirstLev = lv1.map(item => item.label).join(",");
      this.form.ownedSecondLev = lv2.map(item => item.label).join(",");
      this.form.ownedThridLev = lv3.map(item => item.label).join(",");
      // ids
      this.form.ownedFirstIds = lv1.map(item => item.id).join(",");
      this.form.ownedSecondIds = lv2.map(item => item.id).join(",");
      this.form.ownedThridIds = lv3.map(item => item.id).join(",");
    },
    // 文件上传钩子
    handleUpload(data) {
      if (data.length !== 0) {
        const file = data[0];
        this.form.importedAddition = {
          name: file.name,
          url: file.url,
          size: file.size
        };
      } else {
        this.form.importedAddition = "";
      }
    },
    // 表单提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const form = this.form;
          const data = {
            pathL: "/doctor/guideConsensus/addGuideConsensus",
            consensusName: form.consensusName,
            tagWords: form.tagWords,
            belongedType: JSON.stringify(form.belongedType),
            articleSource: form.articleSource,
            consensusContent: form.consensusContent,
            importedAddition: JSON.stringify(form.importedAddition),
            originalReadAmount: form.originalReadAmount == '' ? 0 : form.originalReadAmount,//初始阅读量,
            readamountAddrule: form.readamountAddrule == '' ? 1 : form.readamountAddrule,//阅读量增长系数
            status: 4,
            publisher: "",
            createdDate: form.createdDate,
            publishedDate: form.publishedDate,
            favoriteAmount: form.favoriteAmount,
            likeAmount: form.likeAmount,
            ownedFirstLev: form.ownedFirstLev,
            ownedSecondLev: form.ownedSecondLev,
            ownedThridLev: form.ownedThridLev,
            ownedFirstIds: form.ownedFirstIds,
            ownedSecondIds: form.ownedSecondIds,
            ownedThridIds: form.ownedThridIds,
						favoriteIncreaseNum:form.favoriteIncreaseNum == '' ? 1 : form.favoriteIncreaseNum,//初始收藏量系数
						defaultFavoriteAmout:form.defaultFavoriteAmout == '' ? 0 : form.defaultFavoriteAmout,//初始收藏量
					};
          if (this.type === "update") {
            data.pathL = "/doctor/guideConsensus/updateGuideConsensus";
            data.id = form.id;
            data.isUpdatePublishedDate = true;
            data.status = 4;
            data.readAmount = form.originalReadAmount;
          }
          this.$post("/data/new", this.$qs.stringify(data)).then(res => {
            if (res.state === 0) {
              this.$message({
                type: "success",
                message: "编辑成功",
                center: true
              });
              this.$router.push("/news/guide");
            } else {
              this.$message({
                message: res.msg,
                center: true
              });
            }
          });
        } else {
          this.$message({
            type: "warning",
            message: "请填写正确的表单信息",
            center: true
          });
        }
      });
    },
    // 获取指南详情
    getInfo(id) {
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/doctor/guideConsensus/getGuideDetail",
        id
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.form = res.data;
          this.form.importedAddition = JSON.parse(res.data.importedAddition);
          const fileList = this.form.importedAddition;
          if (fileList.url) {
            this.fileList = [
              {
                name: fileList.name,
                url: fileList.url
              }
            ];
          }
          if (res.data.tagWords.length !== 0) {
            this.tagList = res.data.tagWords.split(",");
          }
          const list = `${res.data.ownedFirstLev},${res.data.ownedSecondLev},${
            res.data.ownedThridLev
          }`;
          this.list = list.split(",");
          this.form.belongedType = JSON.parse(res.data.belongedType);
          const levelType = this.form.belongedType.map(item => item.levelType);
          this.checked = levelType.filter(item => item.includes("levelType3"));
          this.expanded = levelType.filter(item => item.includes("levelType2"));
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.guide-edit {
  width: 100%;
  height: 100%;
  padding-top: 40px;
  box-sizing: border-box;
  .preview {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    .header {
      text-align: center;
    }
    .info {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
