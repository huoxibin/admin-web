<template>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    :show-checkbox="multiple"
    :default-expand-all="defaultExpandAll"
    :accordion="accordion"
    :draggable="draggable"
    :node-key="nodeKey"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    ref="tree"
    highlight-current
    @node-click="handleNodeClick"
    @check-change="handleCheckChange"
  ></el-tree>
</template>
<script>
export default {
  name: "DkTree",
  props: {
    data: {
      type: Array,
      require: true
    },
    multiple: {
      // 多选
      type: Boolean,
      default() {
        return false;
      }
    },
    accordion: {
      // 手风琴
      type: Boolean,
      default() {
        return false;
      }
    },
    draggable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default() {
        return false;
      }
    },

    nodeKey: {
      type: String,
      default() {
        return "id";
      }
    },
    defaultExpandedKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    data() {
      this.treeData = this.data;
    }
  },
  mounted() {
    this.treeData = this.data;
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        //默认tree 结构
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    handleNodeClick(node, isSelect, childISselect) {
      //单节点点击事件
      let object = { node, isSelect, childISselect };
      this.$emit("getNodeClick", object);
      //this.returnAllSelectData();
    },
    handleCheckChange(node, isSelect, childISselect) {
      let object = { node, isSelect, childISselect };
      this.$emit("getCheckNode", object);
      //this.returnAllSelectData();
    },
    getCheckId() {
      // 获取所选择的id
    },
    returnAllSelectData() {
      if (this.multiple) {
        this.checkedIds = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
        this.checkedData = this.$refs.tree.getCheckedNodes(); // 所有被选中的节点所组成的数组数据
      } else {
        this.checkedIds = this.$refs.tree.getCurrentKey();
        this.checkedData = this.$refs.tree.getCurrentNode();
      }
      this.$emit("getAllSelectData", this.checkedIds, this.checkedData);
    }
  }
};
</script>
