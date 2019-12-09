<template>
  <el-date-picker
    v-model="date"
    :value-format="type === 'daterange' ?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
    :type="type === 'daterange' ? 'daterange' : 'datetimerange'"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :picker-options="pickerOptions"
    @change="changeData"
  ></el-date-picker>
</template>

<script>
export default {
  name: "BaseDate",
  model: {
    prop: "time",
    event: "setDate"
  },
  props: {
    type: {
      type: String,
      default: "daterange"
    },
    pickerOptions: {
      type: Object
    },
    time: Array
  },
  data: () => ({
    date: []
  }),
  methods: {
    // 改变时间
    changeData(now) {
      this.$emit("change", now || ["", ""]);
    }
  },
  watch: {
    date(now) {
      this.$emit("setDate", now || ["", ""]);
    },
    time(now) {
      this.date = now;
    }
  }
};
</script>
