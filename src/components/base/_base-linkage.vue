<template>
    <div>
        <el-select v-model = "val.first" class = "w-100" @change = "getVal(1)" placeholder = "请选择">
            <el-option v-for = "(item,index) in data.firstList" :key = "index" :value = "item.id" :label = "item.name"></el-option>

        </el-select>
        <el-select v-model = "val.second" class = "w-100" @change = "getVal(2)" placeholder = "请选择">
            <el-option v-for = "(item,index) in data.secondList" :key = "index" :value = "item.id" :label = "item.name"></el-option>

        </el-select>
        <el-select v-model = "val.threed" class = "w-100" @change = "getVal(3)" placeholder = "请选择">
            <el-option v-for = "(item,index) in data.threedList" :key = "index" :value = "item.id" :label = "item.name"></el-option>

        </el-select>
    </div>
</template>

<script>
export default {
  name: "Baselinkage",
  props: {
    dataMuilt: {
      type: Object,
      require: true
    }
  },
  watch: {
    "dataMuilt.firstList"() {
      this.data.firstList = this.dataMuilt.firstList;
    },
    "dataMuilt.secondList"() {
      this.data.secondList = this.dataMuilt.secondList;
    },
    "dataMuilt.threedList"() {
      this.data.threedList = this.dataMuilt.threedList;
    }
  },
  data() {
    return {
      data: {
        firstList: [],
        secondList: [],
        threedList: []
      },
      val: {
        first: "",
        second: "",
        threed: ""
      }
    };
  },
  methods: {
    getVal(fg) {
      //监控下拉的变化
      let obj = this;
      switch (fg) {
        case 1:
          {
            //清空二级和三级的下拉列表
            obj.secondList = [];
            obj.threedList = [];
            //清空二级的选择项
            obj.second = "";
            obj.threed = "";
          }
          break;
        case 2:
          {
            obj.threedList = []; //清空三级的 列表内容
            //清空三级的选择项
            obj.threed = "";
          }
          break;
      }
      this.$emit("getlevelVal", fg + 1, this.val);
    }
  }
};
</script>
