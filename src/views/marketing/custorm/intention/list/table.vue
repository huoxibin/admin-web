<template>
  <!-- table -->
  <el-table
    :data="data"
    ref="table"
    border
    stripe
    @current-change="handleCurrentChange"
    :cell-class-name="cellClassSet"
    :cell-style="cellStyleSet"
    @cell-click="handleCellCilck"
    :height="tableHeight"
    highlight-current-row
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    @row-click="handleRowClick"
    style="width: 100%"
  >
    <!-- 多选框 -->
    <el-table-column :selectable="selectable" v-if="selection" type="selection" width="50"
                     align="center"></el-table-column>

    <!-- 序号 -->
    <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
            v-if="index"
            :index="indexMethod"
    ></el-table-column>

    <!-- table-column -->
    <el-table-column
            v-for="item in config"
            :key="item.value"
            :prop="item.value"
            :label="item.label"
            :width="item.width"
            :sortable="item.sort ? 'custom' : false"
            :show-overflow-tooltip="item.tooltip"
            align="center"
            :cell-class-name="item.cellClassName"
    >
      <!-- template -->
      <template slot-scope="scope">
        <!-- input -->
        <el-input
                v-if="item.type === 'input'"
                v-model="scope.row[item.value]"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
        ></el-input>

        <!-- button -->
        <el-button
                type="text"
                v-if="item.type === 'button'"
                @click="handleButtonClick(scope.row)"
        >{{ scope.row[item.value] }}
        </el-button>

        <!-- image -->
        <div v-if="item.type === 'image'" class="table-column-image-wrap">
          <img class="table-column-image" :src="scope.row[item.value]" alt>
        </div>

        <!-- switch -->
        <el-switch
                v-if="item.type === 'switch'"
                v-model="scope.row[item.value]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleSwitch(scope.row)"
        ></el-switch>

        <!-- 没有功能，只做展示 -->
        <p :class="item.cellClassName" v-if="!item.type">{{ scope.row[item.value] }}</p>
      </template>
    </el-table-column>

    <el-table-column
            v-if="operating"
            :width="operatingWidth"
            label="操作"
            fixed="right"
            align="center"
    >
      <template slot-scope="scope">
        <slot :row="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "custormTable",
    props: {
      // 表格数据源

      data: {
        type: Array,
        required: true
      },
      selectableSite: {
        type: Array,
        required: false
      },
      // 表格配置表
      config: {
        type: Array,
        required: true
      },
      // 表格是否支持序号
      index: {
        type: Boolean,
        default: false
      },
      // 表格是否支持多选
      selection: {
        type: Boolean,
        default: false
      },
      // 表格是否支持操作
      operating: {
        type: Boolean,
        default: false
      },
      operatingWidth: {
        type: Number,
        default: 100
      },
      // 分页 - 用于计算序号
      pageNum: Number,
      pageSize: Number,
      currentRow: null
    },
    data(){
    	return{
				tableHeight:0
      }
    },
    watch:{
      cellClass(){
        console.log("改变值");
      }
    },
    mounted(){
			// 获取 table 高度
			this.$nextTick(()=>{
				this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
			})
    },
    methods: {
      // row
      handleRowClick(row) {
        this.$emit("rowClick", row);
      },
      // input
      handleInputConfirm(row) {
        this.$emit("inputConfirm", row);
      },
      // button
      handleButtonClick(row) {
        this.$emit("buttonClick", row);
      },
      // switch
      handleSwitch(row) {
        this.$emit("switch", row);
      },
      handleCurrentChange(row){
        //this.currentRow = row;
        this.$emit("currentChange", row);
      },
      // selection
      handleSelectionChange(val) {
        this.$emit("selectionChange", val);
      },
      // sort
      handleSortChange(val) {
        this.$emit("sortChange", val);
      },
      // index
      indexMethod(index) {
        return (this.pageNum - 1) * this.pageSize + (index + 1);
      },
      selectable(row, index) {

        if(this.selectableSite){
          let fg=true;
          this.selectableSite.forEach(itm => {
            if (row[itm.name] === itm.val) {
              fg=true;
            } else {
              fg=false;
            }
          })
          return fg;
        }else{
          return true;
        }

      },
      cellClassSet({row, column, rowIndex, columnIndex}) {
        //debugge
        let obj = {row, column, rowIndex, columnIndex};
        this.$emit("cellClassName", obj);
      },
      cellStyleSet({row, column, rowIndex, columnIndex}){
        if (columnIndex === 12) {
          if((row.status ==="意向客户") && (row.process_status==="临时保存" || row.process_status==="撤销" || row.process_status==="拒绝")){
            return 'color:#409EFF; cursor:pointer;';
          }else{
            return 'color:#606266;';
          }
        }else{
          return '';
        }
      },
      handleCellCilck(row,column,cell,event){
        let obj = {row, column, cell, event};
        this.$emit("cellClick", obj);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .table-column-image-wrap {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;

    .table-column-image {
      width: 100%;
      height: 100%;
      transition: 0.5s;

      &:hover {
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
      }
    }
  }
</style>
