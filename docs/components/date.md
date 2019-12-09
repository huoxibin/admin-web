# base-date

## template

```Html
<base-date v-model="date" type="daterange" :pickerOptions="pickerOptions" @change="change"></base-date>
```

## javaScript

```javaScript
/**
 * @prop { string } type 时间选择器类型 （ daterange/datetimerange ）
 *
 * @prop { object } pickerOptions 限制时间所选范围
 * 
 * @callback change 确定触发钩子
 */
export default {
  data: () => ({
    date: ["", ""],
    pickerOptions: {
      disabledDate: time => time.getTime() > Date.now()
    }
  }),
  methods: {
    change(now) {
      console.log(now);
    }
  }
};
```
