# base-tree

## template

```Html
<base-tree
  :tree="tree"
  :list="list"
  :expanded="expanded"
  :checked="checked"
  nodeKey="id"
  @confirm="getCurrent"
  @check="check"
  :defaultProps="defaultProps"
></base-tree>
```

## javaScript

```javaScript
/**
 * @prop { array } tree 树结构数据
 *
 * @prop { array } list tag词列表
 *
 * @prop { string } nodeKey 树节点唯一字段
 *
 * @prop { array } expanded 默认展开
 *
 * @prop { array } checked 默认选中
 *
 * @prop { object } defaultProps 树结构key
 *
 * @callback getCurrent 获取选中的树节点
 *
 * @callback check 选中复选框钩子
 *
 */
export default {
  data: () => ({
    tree: [],
    list: [],
    expanded: [],
    checked: [],
    defaultProps: {
      children: "children",
      label: "label"
    }
  }),
  methods: {
    // 获取选中的树节点
    getCurrent(tree) {
      console.log(tree);
    },
    // 选中复选框钩子
    check(item, data) {
      this.$emit("check", { item, data });
    }
  }
};
```
