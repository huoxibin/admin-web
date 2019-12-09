# base-area

## template

```Html
<base-area @handleArea="handleArea"></base-area>
```

## javaScript

```javaScript
/**
 * @callback handleArea 获取地区id
 */
export default {
  // 获取地区id
  handleArea(data) {
    console.log(data);
  },
};
```
