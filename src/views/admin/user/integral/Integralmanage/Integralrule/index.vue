
<template>
  <div class="family_table">
  	<el-table :data="tableData6" stripe :span-method="objectSpanMethod" border style="width: 100%;" v-loading="loading" element-loading-text="正在加载中">
		  <el-table-column prop="family" label="家庭荣誉" width="180" align="center"></el-table-column>
		  <el-table-column prop="levelName" label="荣誉星级" width="120" align="center"></el-table-column>
		  <el-table-column prop="integral" label="对应积分" width="120" align="center"></el-table-column>
		</el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
    	loading: true,
      tableData6: []
    };
  }, 
  mounted: function () {
  	let arrObj = [ [ ],[ ],[ ],[ ],[ ] ]
  	let arr=[];
  	
  	//获取积分规则数据
  	this.$post("/data/my", {
	    pathL: "/family/honourLevel/rule"
	  }).then(res => {
		  if (res.state === 0) {
		  	this.loading = false;
		  	let resultData = res.data
		  	
		  	for(let i in arrObj){
		  		for(let j in resultData[i].subLevelRuleList){
		  			let obj2 = {
			  			family: resultData[i].honourName + ' ' + resultData[i].honourIntegral,
			  			integral: resultData[i].subLevelRuleList[j].integral,
			  			levelName: resultData[i].subLevelRuleList[j].levelName
		  			};
		  			arrObj[i].push(obj2)
		  		}
		  	}
		  	
		  	for(let n in arrObj){
		  		for(let m in arrObj[n]){
		  			arr.push(arrObj[n][m])
			  	}
		  	}		  	
		  	
		  	this.tableData6 = arr
		  	
		  } else {
	      this.$message({
	        message: res.msg,
	        center: true
	      });
		  }
	  });		
  },
  methods: {
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
	    if (columnIndex === 0) {
	      if (rowIndex % 5 === 0) {
	        return {
	          rowspan: 5,
	          colspan: 1
	        };
	      } else {
	        return {
	          rowspan: 0,
	          colspan: 0
	        };
	      }
	    }
	  }
  }
};
</script>

<style scoped>
.family_table{
	width: 422px;
	margin-left: 20px;
	margin-bottom: 20px;
	margin-top: 20px
}
.el-le .cell{
	line-height: 12px;
}
</style>