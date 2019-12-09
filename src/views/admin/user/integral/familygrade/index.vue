<template>
  <div class="familygrade">
  	<el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane label="启康之家" name="first" v-loading="loading" element-loading-text="正在加载中">
	    	<div class="public_box clearfix">
	    		<div class="public_txt" v-text="familytype1"></div>
	    		<div class="public_table">
	    			<el-table :data="tableData1" border style="width: 100%;">
				      <el-table-column prop="level" label="子等级" width="100" align="center"></el-table-column>
				      <el-table-column prop="name" label="积分区间" width="160" align="center"></el-table-column>
				    </el-table>
	    		</div>
	    		<div style="clear: both;"></div>
	    		<div class="public_mid clearfix">
	    			<p>权益：</p>
	    			<div class="detail" v-text="interests1"></div>
	    		</div>
	    	</div>
	    </el-tab-pane>
	    <el-tab-pane label="育康之家" name="second" v-loading="loading" element-loading-text="正在加载中">
	    	<div class="public_box clearfix">
	    		<div class="public_txt" v-text="familytype2"></div>
	    		<div class="public_table">
	    			<el-table :data="tableData2" border style="width: 100%;">
				      <el-table-column prop="level" label="子等级" width="100" align="center"></el-table-column>
				      <el-table-column prop="name" label="积分区间" width="160" align="center"></el-table-column>
				    </el-table>
	    		</div>
	    		<div style="clear: both;"></div>
	    		<div class="public_mid clearfix">
	    			<p>权益：</p>
	    			<div class="detail" v-text="interests2"></div>
	    		</div>
	    	</div>
	    </el-tab-pane>
	    <el-tab-pane label="慧康之家" name="third" v-loading="loading" element-loading-text="正在加载中">
	    	<div class="public_box clearfix">
	    		<div class="public_txt" v-text="familytype3"></div>
	    		<div class="public_table">
	    			<el-table :data="tableData3" border style="width: 100%;">
				      <el-table-column prop="level" label="子等级" width="100" align="center"></el-table-column>
				      <el-table-column prop="name" label="积分区间" width="160" align="center"></el-table-column>
				    </el-table>
	    		</div>
	    		<div style="clear: both;"></div>
	    		<div class="public_mid clearfix">
	    			<p>权益：</p>
	    			<div class="detail" v-text="interests3"></div>
	    		</div>
	    	</div>
	    </el-tab-pane>
	    <el-tab-pane label="智康之家" name="fourth" v-loading="loading" element-loading-text="正在加载中">
	    	<div class="public_box clearfix">
	    		<div class="public_txt" v-text="familytype4"></div>
	    		<div class="public_table">
	    			<el-table :data="tableData4" border style="width: 100%;">
				      <el-table-column prop="level" label="子等级" width="100" align="center"></el-table-column>
				      <el-table-column prop="name" label="积分区间" width="160" align="center"></el-table-column>
				    </el-table>
	    		</div>
	    		<div style="clear: both;"></div>
	    		<div class="public_mid clearfix">
	    			<p>权益：</p>
	    			<div class="detail" v-text="interests4"></div>
	    		</div>
	    	</div>
	    </el-tab-pane>
	    <el-tab-pane label="爱康之家" name="fifth" v-loading="loading" element-loading-text="正在加载中">
	    	<div class="public_box clearfix">
	    		<div class="public_txt" v-text="familytype5"></div>
	    		<div class="public_table">
	    			<el-table :data="tableData5" border style="width: 100%;">
				      <el-table-column prop="level" label="子等级" width="100" align="center"></el-table-column>
				      <el-table-column prop="name" label="积分区间" width="160" align="center"></el-table-column>
				    </el-table>
	    		</div>
	    		<div style="clear: both;"></div>
	    		<div class="public_mid clearfix">
	    			<p>权益：</p>
	    			<div class="detail" v-text="interests5"></div>
	    		</div>
	    	</div>
	    </el-tab-pane>
	  </el-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      	loading: true,
        activeName: 'first',
        tableData1: [],
	      tableData2: [],
	      tableData3: [],
	      tableData4: [],
	      tableData5: [],
	      familytype1:"",
	      familytype2:"",
	      familytype3:"",
	      familytype4:"",
	      familytype5:"",
	      interests1: "",
	      interests2: "",
	      interests3: "",
	      interests4: "",
	      interests5: "",
      };
    },
    mounted: function () {
    	let arr = [ [],[],[],[],[] ]
   	
    	//获取积分规则数据
    	this.$post("/data/my", {
		    pathL: "/family/honourLevel/rule"
		  }).then(res => {
			  if (res.state === 0) {
			  	this.loading = false;
			  	let resultData = res.data
			  	//家庭等级
			  	this.familytype1 = resultData[0].honourName + ' : ' + resultData[0].honourIntegral
			  	this.familytype2 = resultData[1].honourName + ' : ' + resultData[1].honourIntegral
			  	this.familytype3 = resultData[2].honourName + ' : ' + resultData[2].honourIntegral
			  	this.familytype4 = resultData[3].honourName + ' : ' + resultData[3].honourIntegral
			  	this.familytype5 = resultData[4].honourName + ' : ' + resultData[4].honourIntegral
			  	//权益说明
			  	this.interests1 = resultData[0].rights
			  	this.interests2 = resultData[1].rights
			  	this.interests3 = resultData[2].rights
			  	this.interests4 = resultData[3].rights
			  	this.interests5 = resultData[4].rights

			  	for(let i in arr){
			  		for(let j in resultData[i].subLevelRuleList){
			  			let obj2 = {
				  			name: resultData[i].subLevelRuleList[j].integral,
				  			level: resultData[i].subLevelRuleList[j].levelName
			  			};
			  			arr[i].push(obj2)
			  		}
			  	}
					//子等级 积分区间数据
			  	this.tableData1 = arr[0]
			  	this.tableData2 = arr[1]
			  	this.tableData3 = arr[2]
			  	this.tableData4 = arr[3]
			  	this.tableData5 = arr[4]
			  	
			  } else {
		      this.$message({
		        message: res.msg,
		        center: true
		      });
			  }
		  });
		  
		  
    },
    methods: {
      handleClick(tab, event) {
        //console.log(tab, event);
      }     	
    }
  };
</script>

<style scoped>
/* Clearfix */
.clearfix:after{ height:0; visibility:hidden; display:block; font-size:0; content:""; clear:both;}
.clearfix{ display:inline-table;}
*html .clearfix{ height:1%; zoom:1;}
.clearfix{ display:block;}	
.familygrade{
	padding-left: 20px;
}
.public_txt{
	padding-top: 14px;
	width: 200px;
	float: left;
}
.public_table{
	width: 262px;
	float: left;
}
.public_mid{
	margin-top: 30px;
	
}
.public_mid p{
	font-size: 16px;
	width: 50px;
	float: left;
	text-align: left;
}
.detail{
	border: 1px solid #ccc;
	margin-left: 70px;
	margin-right: 50px;
	line-height: 28px;
	padding: 10px;
}
</style>