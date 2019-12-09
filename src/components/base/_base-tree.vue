<template>
  <div class="base-tree">
    <!-- btn -->
    <el-tag v-for="item,index in list" :key="index" size="medium">{{ item }}</el-tag>
    <div class="tree-btn">
      <el-button type="primary" size="mini" @click="dialogVisible = true">浏 览</el-button>
    </div>
    <!-- 选择分类 -->
    <el-dialog title="选择分类" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <div
        style="height: 500px;overflow: auto;"
        v-loading="tree.length === 0"
        element-loading-text="拼命加载中"
      >
        <el-tree
          ref="tree"
          :data="tree"
          show-checkbox
          :node-key="nodeKey?nodeKey:'id'"
          :props="defaultProps"
          :default-expanded-keys="expanded"
          :default-checked-keys="checked"
          @check="check"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "BaseDisease",
  props: {
    nodeKey: String,
    tree: {
      type: Array,
      required: true,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Array,
      default: () => []
    },
    checked: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "label"
      })
    }
  },
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    // 确认树节点提交
    submit() {
      // 选中的数节点
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      // 半选的数节点
      const halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes();

      // 树节点集合
      const tree = [...checkedNodes, ...halfCheckedNodes];

      // 绑定数据
      this.$emit("confirm", tree);
      this.dialogVisible = false;
    },
    // 选中复选框钩子
    check(item, data) {
      this.$emit("check", { item, data });
    }
  }
};
</script>

