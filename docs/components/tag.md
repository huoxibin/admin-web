# base-tag

## template

```Html
<base-tag :list="list" @handleClick="handleClick"></base-tag>
```

## javaScript

```javaScript
/**
 * @prop { array } list tag词列表
 *
 * @callback handleClick 选中tag词钩子
 *
 */
export default {
  data: () => ({
    list: []
  }),
  methods: {
    // 选中tag词
    handleClick(data) {
      this.list = data;
    },
  }
};
```
