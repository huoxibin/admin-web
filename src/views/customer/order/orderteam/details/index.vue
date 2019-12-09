<template>
  <div class="order">   
    <p class="order-title">签约订单信息</p>
    <ul class="order-list-msg" style="padding-bottom: 120px;">
      <li>订单号：<span v-text="signOrderInfo.orderNum"></span></li>    
      <li>家医团队：<el-button type="text" @click="fadeBox()" v-text="signOrderInfo.teamName"></el-button></li>    
      <li>签约家庭号：<span v-text="signOrderInfo.familyNo"></span></li>
      <li>签约家庭成员数：<span v-text="signOrderInfo.memberCount"></span></li>
      <li>签约服务包数：<span v-text="signOrderInfo.packageCount"></span></li>
      <li>签约状态：<span>{{signOrderInfo.status === 1 ? '等待签约' : (signOrderInfo.status === 2 ? '已签约' : (signOrderInfo.status === 5 ? '已完成' : ''))}}</span></li>
      <li>待完成服务项数：<span v-text="signOrderInfo.itemNotCount"></span></li>
      <li>已完成服务项数：<span v-text="signOrderInfo.itemYesCount"></span></li>
      <li>签约提交时间：<span v-text="signOrderInfo.payTime"></span></li>
      <li>签约时间：<span v-text="signOrderInfo.signTime"></span></li>
      <li>签约单金额：<span v-text="signOrderInfo.orderAmount"></span></li>
      <li>纸质签约单：
	      <div v-show="signOrderInfo.signImgUrl" class="imgBox"><img width="120" height="120" @click="fadeBigimg()" :src="signOrderInfo.signImgUrl"></div>
	      <span class="order-team" :class="{'order-team-other': signOrderInfo.signImgUrl !== '' && signOrderInfo.signImgUrl !== null }" @click="changeImg()">更换</span>
      </li>
    </ul>
    
    <!-- 弹窗-更换纸质签约单 --> 
    <el-dialog title="更换纸质签约单" style="text-align: center;" :visible.sync="dialogVisible2" width="30%"  :modal-append-to-body="false">
    	<el-upload
    		class="upload-img"
    		:action="uploadUrl" 
    		:show-file-list="false" 
    		:headers="uploadHeaders" 
    		:on-success="handleAvatarSuccessOne" 
    		:before-upload="beforeAvatarUploadOne">
	      <img v-if="ruleForm.signorderUrl" :src="ruleForm.signorderUrl" class="avatarTou">
	      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	    </el-upload>
	    <el-button type="primary" style="width:100px;margin-top: 20px;" @click="submitForm()">保存</el-button>
		</el-dialog>
		
    <!-- 弹窗-纸质签约单大图 --> 
    <el-dialog title="" style="text-align: center;" :visible.sync="dialogVisible1" width="30%"  :modal-append-to-body="false">
    	<img width="500" height="500" :src="signOrderInfo.signImgUrl">
		</el-dialog>
		
    <!-- 弹窗-家医团队信息 --> 
    <el-dialog title="家医团队信息" style="text-align: center;" :visible.sync="dialogVisible" width="30%" :modal-append-to-body="false">
		  <div id="tance">
		  	<div class="tance_caption clearfix" id="tance_caption">
		  		<div class="tance_title">队长信息</div>
					<ul class="tance_contain clearfix">
						<li class="captionImg"><img :src="doctorCaptain.headimg" width="100" height="100" /></li>
						<li class="captionTxt">
							<p><span>{{ doctorCaptain.name }}</span>{{doctorCaptain.title}}</p>
							<p><span>{{ doctorCaptain.hospital }}</span>{{ doctorCaptain.department }}</p>
							<p><span>手机号：</span>{{doctorCaptain.mobile}}</p>
						</li>
					</ul>
		  	</div>
		  	<div class="tance_team" v-if="isshowMemberList">
		  		<div class="tance_title">成员信息</div>
		  		<div id="tance_team" class="clearfix">
		  			
		  			<ul class="tance_contain clearfix" v-for="item in doctorMemberList">
						<li class="teamImg"><img :src="item.headimg" width="100" height="100" /></li>
						<li class="teamTxt">
							<p><span>{{ item.name }}</span>{{item.title}}</p>
							<p><span>{{ item.hospital }}</span>{{ item.department }}</p>
							<p><span>手机号：</span>{{item.mobile}}</p>
						</li>
						<div style="clear:both;"></div>
					</ul>
						
		  		</div>	  		
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">关  闭</el-button>
		  </span>
		</el-dialog>
    
    <p class="order-title">签约服务包信息</p>
   	<div class="order-service-msg">  		
   		<div style="width: 100%;">
	      <div class="table-head">
		      <table>
		        <!--<colgroup><col /><col /></colgroup>-->
		        <thead>
		          <tr>
		          	<th width="180">服务包名称</th>
					      <th width="180">所选成员</th>
					      <th width="180">服务项名称</th>
					      <th width="180">服务项总价格</th>
					      <th width="180">服务项频次</th>
					      <th width="180">服务项状态</th>
					      <th width="180">完成时间</th>
					      <th width="180">交易流水号</th>
		          </tr>
		        </thead>
		    	</table>
		    </div>
		    <div class="table-body">
			    <table>
			      <!--<colgroup><col style="width: 180px;" /><col /></colgroup>-->
			      <tbody>
			      	<tr v-for="item in serviceList">
			      		<td width="180" v-text="item.packageName"></td>
			      		<td width="180" v-text="item.memberName"></td>
			      		<td width="180"><p class="itemName" v-for="item1 in item.itemList" v-text="item1.itemName" :title="item1.itemName"></p></td>
			      		<td width="180"><p v-for="item2 in item.itemList" v-text="item2.itemMoney"></p></td>
			      		<td width="180"><p v-for="item3 in item.itemList" v-text="item3.frequency + '次/' + item3.frequencyUnit"></p></td>
			      		<td width="180">
			      			<p v-for="item4 in item.itemList" >
			      				{{item4.serviceState === 1 ? '等待签约' : (item4.serviceState === 2 ? '已签约' : (item4.serviceState === 5 ? '已完成' : ''))}}
			      			</p>
			      		</td>
			      		<td width="180"><p v-for="item5 in item.itemList" v-text="item5.finishTime"></p></td>
			      		<td width="180"><p v-for="item6 in item.itemList" v-text="item6.orderNum"></p></td>			      		
			      	</tr>
			      </tbody>
			    </table>
		    </div>
	  	</div>
   	</div>
   	
   	<p class="order-title clearfix">
   		<span>服务项总数：<i v-text="this.itemTotalCount"></i></span>
   		<span>未完成总数：<i v-text="this.itemNotCount">0</i></span>
   		<span>已完成总数：<i v-text="this.itemYesCount">260</i></span>
   	</p>
   	
    <div class="back">
      <el-button type="primary" @click="$router.go(-1)" size="small" style="width:100px;" plain>返 回</el-button>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
    	orderNum:"", //订单号
    	dialogVisible: false, //查看家医团队
    	dialogVisible1: false, //查看签约单大图
    	dialogVisible2: false, //更换纸质签约单
    	uploadUrl: "/data/uploadImg",
    	uploadHeaders: {
        accessToken: this.$store.getters.accessToken
      },
    	ruleForm: {
    		signorderUrl: "", //纸质签约单
    		UPsignorderUrl: ""     		
    	},
    	signOrderInfo: [], //签约订单信息
    	doctorCaptain:{}, //家医队长
    	doctorMemberList: [], //家医成员
    	isshowMemberList:false, //是否显示家医成员  有成员显示  无成员不显示
      serviceList: [],
      itemNotCount: "", //已完成总数
      itemYesCount: "", //未完成总数
      itemTotalCount: "", //服务项总数
      signInfoId: ""
    };
  },
	methods: {
		fadeBox() {
    	this.dialogVisible = true;     	
    },
    fadeBigimg() {
    	this.dialogVisible1 = true;     	
    },
		changeImg() {
			this.dialogVisible2 = true; 
		},    
	  //更换纸质签约单
	  handleAvatarSuccessOne(response, file, fileList) {
	    this.ruleForm.signorderUrl = file.url;
	    this.ruleForm.UPsignorderUrl = response.data.url;
	  },
	  beforeAvatarUploadOne(file) {
	
	  },
	  //保存按钮
	  submitForm(){ //上传纸质签约单
	    this.$post("/data/my", {
	      pathL: "/doctor/teamSignInfo/editImg",
	      imgUrl: this.ruleForm.UPsignorderUrl,
	      signInfoId: this.signInfoId
	    }).then(res => {
	      if (res.state === 0) {
	        this.dialogVisible2 = false;
	        this.ruleForm.signorderUrl = '';
	        this.$message({
	          message: "纸质签约单保存成功",
	          type: "success",
	          center: true
	        });
	      } else {
	        this.$message({
	          message: res.msg,
	          center: true
	        });
	      }
	    }) 
	  },
	  queryOrdermsg() { //签约订单信息
    	this.$post("/data/my", {
	      pathL: "/doctor/teamSignInfo/orderDetails",
	      signInfoId: this.orderNum
	    }).then(res => {
	      if (res.state === 0) {
	      	let resData = res.data
	      	this.signInfoId = resData.signOrderInfo.signInfoId; //上传纸质签约单
	      	this.itemNotCount = resData.itemNotCount; //已完成总数
		      this.itemYesCount = resData.itemYesCount; //未完成总数
		      this.itemTotalCount = resData.itemTotalCount; //服务项总数
	      	this.serviceList = resData.signPackInfo;
	      	this.signOrderInfo = resData.signOrderInfo;
	      	this.queryPackmsg(resData.signOrderInfo.teamId) //查看家医团队信息
	      } else {
	        this.$message({
	          message: res.msg,
	          center: true
	        });
	      }
	    })
    },
    queryPackmsg(teamId) { //查看家医团队信息
    	//console.log(teamId)
    	this.$post("/data/my", {
	      pathL: "/doctor/teamInfo/members",
	      teamId: teamId
	    }).then(res => {
	      if (res.state === 0) {
	      	this.doctorCaptain = res.data.captain;
	      	this.doctorMemberList = res.data.memberList;
	      	if(res.data.memberList.length != 0){
	      		this.isshowMemberList = true;
	      	}
	      	//console.log(res)
	      } else {
	        this.$message({
	          message: res.msg,
	          center: true
	        });
	      }
	    })
    }
  },
  mounted: function () {
	  this.orderNum = this.$route.query.signInfoId;
	  this.queryOrdermsg();
  },
};
</script>

<style scoped>
table{ border-collapse:collapse; border-spacing:0;}
table,tr,td,th{ border:0 none;}
td,th{ padding:0;}
/* Clearfix */
.clearfix:after{ height:0; visibility:hidden; display:block; font-size:0; content:""; clear:both;}
.clearfix{ display:inline-table;}
*html .clearfix{ height:1%; zoom:1;}
.clearfix{ display:block;}
.table-head{
	padding-right:17px;
	text-align:center;
	color:#000;
	background-color:#f9f9f9;
}
.table-head thead tr{
	text-align: center;
	height: 40px;
}
.table-head thead tr th{
	text-align: center;
	font-weight: normal;
	border:1px solid #ccc;
	border-top: none;
	background-color:#f9f9f9;
}
.table-body{
	width:100%; 
	height:300px;
	overflow-y:scroll;
}
.table-head table,.table-body table{
	width:100%;
}
.table-body tbody tr td{
	text-align: center;
	line-height: 30px;
	border: 1px solid #ccc;
	border-top: none;
	max-width: 180px;
}
.table-body tbody tr td p{
	text-align: center;
	line-height: 30px;
	height: 30px;
	border-bottom:1px solid #ccc;
}
.table-body tbody tr td p:nth-child(2n){
	background-color:#f9f9f9;
}
.table-body tbody tr td p:last-child{
	border-bottom: none;
}
/*
.table-body tbody tr:last-child td{
	border-bottom: none;
}*/
.order {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  position: relative;
}
.order-title {
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  box-sizing: border-box;
  font-size: 14px;
}
.order-title span{
	display:block;
	width: 200px;
	font-size: 14px;
	line-height: 22px;
	float: left;
}
.order-title span i{
	font-style:normal
}
.order-list-msg{
	background: #fff;
	border: 1px solid #ccc;
	margin:10px 50px 0 50px;
	padding:10px 30px;
	min-width: 1200px;
	border-radius: 4px;
	padding-bottom: 50px;
	position: relative;
}
.order-list-msg li{
	display: inline-block;
	margin-right: 30px;
	height: 30px;
	line-height: 30px;
	position: relative;
}
.imgBox{
	width: 120px;
	height: 120px;
	display: inline-block;
	border: 1px solid #ccc;
	position: absolute;
	left: 100px;
	top: 30px;
}
.order-list-msg span{
	display: inline-block;
	font-size: 14px;
	margin-top: 30px;
}

.order-team{
	color: #0099DD;
	cursor: pointer;
}
.order-team-other{
	margin-left: 130px;
	position: relative;
	top: 100px;
}
.order-service-msg{
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	border-right: 1px solid #ccc;
	background: #fff;
	margin:10px 50px 0 50px;
	min-width: 1200px;
	max-width: 1600px;
}
#service-msg{
	width: 100%;
}
.back {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/*家医团队信息*/
#tance_team{
	max-height: 200px;
	overflow-y: scroll;
}
#tance{
	padding:0 20px;
}
.tance_title{
	font-size: 16px;
	text-align: left;
	line-height: 24px;
}
.tance_contain{
	padding: 10px 0;
}
.tance_contain li.captionImg,.tance_contain li.teamImg{
	float: left;
	width: 100px;
	height: 100px;
	margin-right: 20px;
	margin-left: 20px;
}
.tance_contain li.captionTxt p,.tance_contain li.teamTxt p{
	text-align: left;
}
.tance_contain li.captionTxt p span,.tance_contain li.teamTxt p span{
	font-size: 14px;
	line-height: 30px;
	margin-right: 12px;
}
.upload-img {
	width: 200px;
	height: 200px;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	margin-left: auto;
	margin-right: auto;
}
.upload-img:hover {
  border-color: #409eff;
}

.avatarTou{
	width: 100%;
	max-width: 200px;
	max-height: 200px;
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
}
.avatarTou{
	max-width: 500px;
	display: block;
}
.el-icon-plus{
	display: flex;
	width: 200px;
	height: 200px;
	justify-content: center;
	align-items: center;
	border: 1px dashed #ccc;
	border-radius: 4px;
}
.itemName{
	cursor: pointer;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	box-sizing: border-box;
	text-align: center;
	padding: 0 10px;
	display:block;
}
</style>
