# base-upload

## template

```Html
<base-upload
  :tip="tip"
  :rule="rule"
  :limit="limit"
  :fileList="fileList"
  @notify="handleUpload"
></base-upload>
```

## javaScript

```javaScript
/**
 * ----- 选 填 -----
 *
 * @prop { string } tip   描述上传文件的文字说明
 *
 * @prop { number } limit 文件限制上传个数
 *
 * @prop { array } fileList 文件上传列表
 *
 * @prop { object } rule  描述限制文件类型和大小  eg: { type: ['image/jpg', 'image/gif'], size: 10 }
 *
 * @callback notify 上传文件钩子函数 @param { object } data 上传文件列表数据
 *
 */
export default {
  data: () => ({
    tip: "只允许上传格式为*.mpg,*.mp4,*.rmvb的文件！",
    type: "file",
    rule: {
      type: ['image/jpg', 'image/gif'],
      size: 100
    },
    fileList: [
      {
        name: "",
        url: ""
      }
    ]
  }),
  methods: {
    handleUpload(data) {
      console.log(data);
    }
  }
};
```
