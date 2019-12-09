<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index">
      <el-header class="head-txt m-t-10 m-b-10" v-if="item.name!==''">{{item.name}}</el-header>
      <div v-for="(itm,ind) in item.column" :key="ind">
        <el-header class="head-txt bgd">
          <span @click="openWin(itm.link,itm.param)">{{itm.title}}</span>
          <el-select v-model="itm.defaultValue" style="width: 100px" v-if="showSelect" @change="changeOption" size="mini" class="pull-right"
                     placeholder="请选择">
            <el-option
                    v-for="item in itm.selectOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            ></el-option>
          </el-select>
        </el-header>
        <div class="fill-row">
          <div class="block" :style="{width:(100/rowNum)+'%'}" v-for="(im,idx) in itm.data" :key="idx">
              <span
                      type="primary"
                      class="num"
                      @click="openWin(im.link,im.param)"
              >{{ im.num }} {{im.unit}}</span>
            <span class="txt">{{ im.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    name: "deskWork",
    props: {
      dataList: {
        type: Array,
        require: true
      },
      rowNum: {
        type: Number,
        require: true
      },
			showSelect: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        value: ''
      }
    },
    mounted() {
      //console.log("ddd");
    },
    methods: {
      changeOption(val) {
        this.$emit('getData', val)
      },
      openWin(url,param){
        if(url){
					this.$emit('open',url,param)
        }else{
        	return;
        }
        //this.$emit('open',url,param)
      },
    }
  };
</script>

<style scoped>
</style>