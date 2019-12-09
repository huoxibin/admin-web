<template>
  <el-container class="m-10">
    <el-aside
            width="200px"
            class="border"
            v-loading="loadingTree"
            element-loading-text="树形菜单加载中"
    >
      <el-header class="header-page">工单类型</el-header>
      <dk-tree
              ref="tree"
              :data="treeData"
              accordion
              draggable
              defaultExpandAll
              :nodeKey="nodeKey"
              :defaultCheckedKeys="defaultKeys"
              :defaultExpandedKeys="defaultShowKeys"
              @getNodeClick="getSelectNode"
      ></dk-tree>
    </el-aside>
    <el-container class="border m-l-10">
      <el-header class="header-page">
        基本信息
        <div class="pull-right">
          <el-button
                  size="mini"
                  v-if="addFirst"
                  type="primary"
                  @click="addFirstCategory"
          >新增类型
          </el-button
          >
          <el-button
                  size="mini"
                  v-if="addSecond"
                  type="primary"
                  @click="addSecondCategory"
          >新增子类型
          </el-button
          >
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
          <el-button size="mini">取消</el-button>
          <el-button size="mini" type="primary" @click="save">保存</el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: "",
          parentId: '', // 父ID，1级为0
          pathLevel: '', // 新增类型等级
          pathIds: '' // 所有父ID路径。1_2_
        },
        rules: {
          name: [
            {required: true, message: "请输入类型名称"},
            {min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur"}
          ]
        },
        config: [
          {
            type: "input",
            label: "类型名称",
            value: "name",
            option: {
              placeholder: "类型名称",
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
        //////////////控制新增按钮状态/////////////////
        addFirst: true,
        addSecond: true,
        addLevel: 1,// 添加的等级
        addParentId: '', // 新增的时候的id
        clickAddfg: false, //判断是否点击了 添加按钮
        clickLevel: null, // 点击了几级按钮
      };
    },
    mounted() {
      this.loadingTree = false;
      this.getTreeData();

    },
    methods: {
      setCheckedKeys() {
        //设置第一次加载的默认节点
        let defaultNode = this.treeData[0];
				this.$nextTick(() => {
					this.$refs.tree.$refs.tree.setCurrentKey(defaultNode.id);
					this.$refs.tree.$refs.tree.store.nodesMap[defaultNode.id].expanded = true;
				});
				//debugger
				//this.$refs.tree.setDefaultNode(defaultNode.id);
        this.form.name = defaultNode.label;
        this.form.parentId = defaultNode.parentId; // 父ID，1级为0
        this.form.level = defaultNode.level; // 新增类型等级
        this.form.pathIds = defaultNode.pathIds;
        this.form.id = defaultNode.id;
        this.addParentId=defaultNode.id;

      },
      resetForm() {
        //重置表单数据
        this.clickAddfg = true;
        this.form.name = "";
      },
      getSelectNode(data) {
				data=data.node;
        this.clickAddfg = false;
        this.form.name = data.label;
        this.form.id = data.id;
        this.form.parentId = data.parentId;
        this.form.level = data.level;
        this.form.pathIds = data.pathIds;
        this.addParentId = data.id;
        this.clickLevel = null;
        this.addSecond = this.form.level <= 4;
      },
      getTreeData() {
        //获取类型节点树
        let that = this;
        this.$get('/data/my', {
          pathL: '/customer/orderType/getOrderTypeList'
        }).then(res => {
          if (!res.state) {
            that.treeData = res.data.rootNodes;
            if(that.treeData.length){
              that.setCheckedKeys();
            }
          }
        }).then(err => {
          console.log(err);
        })
      },
      addFirstCategory() {
        // 添加一级分类
        this.resetForm();
        this.clickLevel = 1;

      },
      addSecondCategory() {
        // 添加二级分类
        this.resetForm();
        this.clickLevel = 2;
      },
      save() {
        let that=this;
        if (this.form.name == '') {
          this.$message('请输入新增分类名称！')
          return
        }
				if (this.form.name.length>10) {
					this.$message('分类名称长度在 1 到 10 个字符！')
					return
        }

        if (this.clickAddfg) {
          this.saveAdd();
        } else {
          let pathL = '/customer/orderType/updateOrderType';
          this.$post('/data/my', {
            pathL,
            name: this.form.name,
            id: this.addParentId
          })
            .then(res => {
              if(!res.state){
                that.$message('保存成功！')
                this.getTreeData();
              }
            })
            .catch(err => {
              console.log(err);
            })
        }

      },
      saveAdd() {
        let im = this.addParentId;
        if (this.clickLevel == 1) {
          im = this.form.parentId;
        }
        let that=this;
        let pathL = '/customer/orderType/saveOrderType';
        this.$post('/data/my', {
          pathL,
          parentId: im,
          name: this.form.name,
          pathIds: this.form.pathIds,
        })
          .then(res => {
            if(!res.state){
              that.$message("保存成功");
              that.getTreeData();
            }
          })
          .catch(err => {
            console.log(err);
          })
      },

      setDefaultNode(id) {
        this.$nextTick(() => {
					this.$refs.tree.$refs.tree.setCurrentKey(id);
					this.$refs.tree.$refs.tree.store.nodesMap[id].expanded = true;
        });
      }
    }
  };
</script>
