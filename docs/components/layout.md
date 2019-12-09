# base-layout

## template

```Html
<base-layout methods="post" :form="form" @getData="getData">
  <!-- 表单 -->
  <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
    <el-form-item label="表单一">
      <el-input v-model="form.first"></el-input>
    </el-form-item>
    <el-form-item label="表单二">
      <el-select v-model="form.second">
        <el-option label="选项一" value="one"></el-option>
        <el-option label="选项二" value="two"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发布日期">
      <base-date v-model="form.date"></base-date>
    </el-form-item>
  </el-form>

  <!-- 按钮 -->
  <div slot="btns" class="btns">
    <el-button size="mini" type="primary">主要按钮</el-button>
    <el-button size="mini" type="success">成功按钮</el-button>
    <el-button size="mini" type="info">信息按钮</el-button>
    <el-button size="mini" type="warning">警告按钮</el-button>
    <el-button size="mini" type="danger">危险按钮</el-button>
  </div>

  <!-- 表格 -->
  <el-table slot="table" :data="data" border stripe style="width: 100%">
    <el-table-column type="index" :index="serialNumber" width="100" label="序号" align="center"></el-table-column>
    <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column prop="status" label="状态" align="center">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.status === 1"
          @change="handleStatus(scope.row)"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="small">编辑</el-button>
        <el-button type="text" size="small">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</base-layout>
```

## javaScript

```javaScript
/**
 * @prop { string } methods 请求列表方法
 *
 * @prop { object } form 表单字段 （ 必填且必须包含 pathL ）
 *
 * @prop { string } tableTitle 表格上方文字提示
 *
 * @callback getData 列表检索钩子函数 @param { object } data 列表数据
 */
export default {
  data: () => ({
    form: {
      pathL: "/api",
      first: "",
      second: ""
    },
    data: []
  }),
  methods: {
    // 获取数据
    getData(data) {
      console.log(data);
    },
    // 表格序号
    serialNumber(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    },
    // 改变状态
    handleStatus(row) {
      console.log(row);
    }
  }
  }
};
```
