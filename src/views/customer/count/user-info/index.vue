<template>
  <div class="user-info">
    <base-layout :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="用户姓名">
          <el-input v-model="form.first"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.first"></el-input>
        </el-form-item>
        <el-form-item label="家庭号">
          <el-input v-model="form.first"></el-input>
        </el-form-item>
        <el-form-item label="会员情况">
          <el-select v-model="form.second">
            <el-option label="选项一" value="one"></el-option>
            <el-option label="选项二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="form.second">
            <el-option label="选项一" value="one"></el-option>
            <el-option label="选项二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约状态">
          <el-select v-model="form.second">
            <el-option label="选项一" value="one"></el-option>
            <el-option label="选项二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在地区">
          <el-select v-model="form.second">
            <el-option label="选项一" value="one"></el-option>
            <el-option label="选项二" value="two"></el-option>
          </el-select>
          <el-select v-model="form.second">
            <el-option label="选项一" value="one"></el-option>
            <el-option label="选项二" value="two"></el-option>
          </el-select>
          <el-select v-model="form.second">
            <el-option label="选项一" value="one"></el-option>
            <el-option label="选项二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活日期">
          <base-date v-model="form.date"></base-date>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table slot="table" :data="data" border stripe style="width: 100%">
        <el-table-column type="index" :index="serialNumber" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="用户姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="家庭号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="渠道" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="激活时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="所在地区" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="手机号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="签约团队" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="签约状态" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="签约时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="会员情况" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data: () => ({
    form: {},
    data: []
  }),
  methods: {
    // 获取列表数据
    getData() {},
    // 表格序号
    serialNumber(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  height: 100%;
}
</style>

