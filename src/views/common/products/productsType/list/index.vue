<template>
  <el-container class="m-10">
    <el-aside class="border" element-loading-text="树形菜单加载中" v-loading="loadingTree" width="200px">
      <el-header class="header-page">商品分类</el-header>
      <dk-tree
        ref="tree"
        :data="treeData"
        accordion
        draggable
        defaultExpandAll
        :nodeKey="nodeKey"
        :defaultCheckedKeys="defaultKeys"
        :defaultExpandedKeys="defaultShowKeys"
        @getNodeClick="getTreeData"
      ></dk-tree>
    </el-aside>
    <el-container class="border m-l-10">
      <el-header class="header-page">
        基本信息
        <div class="pull-right">
          <el-button @click="addFirstCategory" size="mini" type="primary">新增一级分类</el-button>
          <el-button @click="addSecondCategory" v-if="!closeBtn" size="mini" type="primary">新增子分类</el-button>
          <el-button size="mini" @click="delTree">删除</el-button>
        </div>
      </el-header>

      <el-main v-loading="loadingForm" element-loading-text="内容加载中">
        <dk-form
          style="width: 400px"
          :form="form"
          :config="config"
          :rules="rules"
          :inline="false"
          labelWidth="120px"
        ></dk-form>
        <div style="margin-left: 120px;">
          <el-button size="mini" @click="cancel">取消</el-button>
          <el-button size="mini" type="primary" @click="save">保存</el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { isValidNumber } from '@/utils/RegExp.js'
export default {
  data() {
		let checkNum = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (!isValidNumber(value)) {
				this.$message("请输入正确编码！");
			} else {
				callback();
			}
		}
    return {
      closeBtn: false, //是否显示新增子分类按钮
      isAdd: false, //是否新增
      form: {
        name: "",
        level: "",
        id: "",
        parentId: "",
        parentLabel: "",
        pathIds: "",
				code:'',//编码
				parentCode:'',//父级编码
      },
      rules: {
        name: [
          { required: true, message: "请输入分类名称" },
          { min: 1, max: 14, message: "长度在 1 到 14 个字符", trigger: "blur" }
        ],
				code: [
					{validator: checkNum, required: true, message: "请输入商品编码" },
					{ min: 1, max: 8, message: "长度在 1 到 8 个数字", trigger: "blur" }
				]
      },
      config: [
        {
          type: "input",
          label: "分类级别",
          value: "level",
          option: {
            placeholder: "1",
            disabled: true
          }
        },
        {
          type: "input",
          label: "上级分类",
          value: "parentLabel",
          hide: false,
          option: {
            placeholder: "上级分类名",
            disabled: true
          }
        },
				{
					type: "input",
					label: "编码",
					value: "code",
					option: {
						placeholder: "请输入商品编码",
						disabled: false
					}
				},
				// {
				// 	type: "input",
				// 	label: "父编码",
				// 	value: "parentCode",
				// 	option: {
				// 		placeholder: "请输入商品编码",
				// 		disabled: false
				// 	}
				// },
        {
          type: "input",
          label: "分类名称",
          value: "name",
          option: {
            placeholder: "请输入分类名",
            disabled: false
          }
        }
      ],
      loadingTree: true, //加载条Tree进度条
      loadingForm: false, //加载右侧的form
      /////////////树菜单相关///////////

      treeData: [],
      defaultShowKeys: [], //默认展开的id
      defaultKeys: [], //默认的值
      nodeKey: "id",
      isFirst: false, // 一级新增
      isSecond: false // 二级新增
    };
  },
  mounted() {
    this.loadingTree = false;
    this.getTree();
  },
  methods: {
    setCheckedKeys() {
      //设置第一次加载的默认节点
      let defaultNode = this.treeData[0];
			this.$nextTick(() => {
				this.$refs.tree.$refs.tree.setCurrentKey(defaultNode.id);
			})
      this.form.name = defaultNode.label;
      this.form.id = defaultNode.id;
      this.form.parentId = defaultNode.parentId;
      this.form.parentLabel = defaultNode.parentLabel;
      this.form.code = defaultNode.code;
      this.form.parentCode = defaultNode.parentCode;
      this.setParentshow(true);
      //重置保存状态////
      this.isFirst = false;
      this.isSecond = false;
      this.isAdd = false;
      this.closeBtn = true;
    },
    getTree() {
      let that = this;
      this.$get("/data/my", {
        pathL: "/common/goodsClassify/query"
      })
        .then(res => {
          if (!res.state) {
            that.treeData = res.data;
            if (res.data.length) {
              that.setCheckedKeys();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetForm() {
      //重置表单数据
      this.form.name = "";

      this.form.code = "";
      this.isAdd = true;
    },
    getTreeData(data) {
      //选中节点
      data=data.node;
      this.closeBtn = false;
      this.isFirst = false;
      this.isSecond = false;
      this.isAdd = false;
      this.form.name = data.label;
      this.form.level = data.level;
      this.form.id = data.id;
      this.form.parentId = data.parentId;
      this.form.pathIds = data.pathIds;
      this.form.parentLabel = data.parentLabel;
      this.form.parentCode = data.parentCode;
      this.form.code = data.code;
      if (data.level === 1) {
        this.setParentshow(true);
        this.form.parentLabel = data.label;
      } else {
        this.setParentshow(false);
      }

      if (data.level === 4) {
        this.closeBtn = true;
      } else {
        this.closeBtn = false;
      }
    },
    setParentshow(fg) {
      this.config.map(item => {
        if (item.value === "parentLabel") {
          item.hide = fg;
        }
      });
    },
    save() {
      let that = this;
      if(this.form.name==''){
      	this.$message("请输入分类名");
      	return;
      }

			if(!this.form.code || this.form.code==''){
				this.$message("请输入商品编码");
				return;
			}

			if(this.form.code.length>8){
				this.$message("编码长度在 1 到 8 个数字");
				return;
      }
      if (this.isAdd) {
        // 新增
        this.form.parentId = this.form.id; // 新增的时候更改
        this.form.level = this.form.level + 1; // 新增的时候更改

        if (this.isFirst) {
          this.form.level = 1;
          this.form.parentId = 0;
          this.form.pathIds = "";
					this.form.parentCode = 0;
        }

        this.$post("/data/my", {
          pathL: "/common/goodsClassify/add",
          name: this.form.name,
          pathLevel: this.form.level,
          pathIds: this.form.pathIds,
          parentId: this.form.parentId,
					parentCode: this.form.parentCode,
          code: this.form.code
        })
          .then(res => {
            if (!res.state) {
              that.$message("保存成功！");
              that.getTree();
            }
          })
          .then(err => {
            console.log(err);
          });
      } else {

        this.$post("/data/my", {
          // 更新
          pathL: "/common/goodsClassify/update",
          name: this.form.name,
          id: this.form.id,
					parentCode: this.form.parentCode,
					code: this.form.code
        })
          .then(res => {
            if (!res.state) {
              that.$message("保存成功！");
              that.getTree();
            }
          })
          .then(err => {
            console.log(err);
          });
      }
    },

    addFirstCategory() {
      this.resetForm();
      this.isFirst = true;
      this.setParentshow(true); //显示上级分类
      this.closeBtn = true;
    },
    addSecondCategory() {
      this.isSecond = true;
      this.setParentshow(false); //不显示上级分类
      this.form.parentLabel = this.form.name;
      this.form.parentCode = this.form.code;
      this.resetForm();
    },
    delTree() {
      let that = this;
      if(this.form.id==''){
				this.$message("请选择要删除的分类！");
      	return;
      }
      this.$post("/data/my", {
        pathL: "/common/goodsClassify/delete",
        id: this.form.id //被删除id
      })
        .then(res => {
          if (res.state==0) {
            that.$message("删除成功！");
            that.getTree();
          }else{
            that.$message(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.closeBtn = false;
    }
  }
};
</script>
