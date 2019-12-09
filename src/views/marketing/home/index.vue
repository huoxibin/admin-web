<template>
  <div>
    <el-row class="landpage">
      <el-col :span="13">
        <sys-deskwork :rowNum="4" :showSelect=false @open="gotoLinkPage" :dataList="panesData"></sys-deskwork>
        <sys-deskwork :rowNum="4" :showSelect=false @open="gotoLinkPage" :dataList="panesData1"></sys-deskwork>
        <sys-deskwork :rowNum="5" :showSelect=false @open="gotoLinkPage" :dataList="panesData2"></sys-deskwork>
        <sys-deskwork :rowNum="5" :showSelect=false @open="gotoLinkPage" :dataList="panesData3"></sys-deskwork>


        <!--//////////排行内容//////////////-->
        <el-header class="head-txt m-t-10 m-b-10 bgd">
          业绩排行（成功签约数）
          <el-select style="width: 120px;" v-model="value" @change="getTopTenInfo" size="mini" class="pull-right"
                     placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-header>
        <el-table
          :data="tableData"
          align="center"
          style="width: 100%">
          <el-table-column
            label="姓名"
            width="100px"
            align="center"
            prop="userName">
            <template slot-scope="scope">
              <div :style="{color:(scope.$index+1==tableData.length? '#f60' :'#333')}"> {{ scope.row.userName }} </div>
            </template>
          </el-table-column>
          <el-table-column
            label="完成业绩"
            align="center"
            prop="count">
            <template slot-scope="scope">
              <div :style="{color:(scope.$index+1==tableData.length? '#f60' :'#333')}"> 签订 {{ scope.row.count }} 份合同</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="11">
        <!--我是日历-->
        <full-calendar
          :events="fcEvents"
          lang="zh"
          @changeMonth="changeMonth"
          @eventClick="eventClick"
          @dayClick="dayClick"
          @moreClick="moreClick"
        ></full-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	export default {
		name: "landPage",
		components: {
			"full-calendar": require("vue-fullcalendar")
		},
		data () {
			return {
				//日历相关
				value: 3,
				fcEvents: [
					{
						title: "事项", // 事件内容
						start: "2019-01-12", // 事件开始时间
						end: "2019-01-12", // 事件结束时间
						content: "内容"
					},
					{
						title: "事项", // 事件内容
						start: "2019-01-12", // 事件开始时间
						end: "2019-02-12", // 事件结束时间
						content: "内容"
					}
				],
				panesData: [
					{
						name: "简报",
						column: [
							{
								title: "线索",
								link: "/custorm/clue/list",
								data: [
									{
										num: 0,
										unit: "个",
										desc: "待处理线索",
										link: "/custorm/clue/list",
										param: {status: 1, user: null}
									},
									{
										num: 0,
										unit: "个",
										desc: "关闭线索",
										link: "/custorm/clue/list",
										param: {status: 3, user: null}

									},
									{
										num: 0,
										unit: "个",
										desc: "已处理线索",
										link: "/custorm/clue/list",
										param: {status: 2, user: null}
									}
								]
							}
						]
					} ],
				panesData1: [
					{
						name: "",
						column: [
							{
								title: "意向客户",
								link: "/custorm/intention/list",
								data: [
									{
										num: 0,
										unit: "个",
										desc: "待跟进的客户",
										link: "/custorm/intention/list",
										param: {status: 4, user: null}
									},
									{
										num: 0,
										unit: "个",
										desc: "跟进中的客户",
										link: "/custorm/intention/list",
										param: {status: 5, user: null}
									},
									{
										num: 0,
										unit: "个",
										desc: "正式客户",
										link: "/custorm/intention/list",
										param: {status: 2, user: null}
									},
									{
										num: 0,
										unit: "个",
										desc: "终止谈判",
										link: "/custorm/intention/list",
										param: {status: 3, user: null}
									}
								]
							}
						]
					} ],
				panesData2: [
					{
						name: "审批中心",
						column: [
							{
								title: "意向客户",
								link: "/work/list",
								param: {auditType: 2},
								data: [
									{
										num: 0,
										unit: "个",
										desc: "待我审核",
										link: "/work/list",
										param: {auditType: 2, auditStatus: 2, principal: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "审核中",
										link: "/work/list",
										param: {auditType: 2, auditStatus: 2, user: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "审核通过",
										link: "/work/list",
										param: {auditType: 2, auditStatus: 3, user: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "审核拒绝",
										link: "/work/list",
										param: {auditType: 2, auditStatus: 4, user: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "抄送我的",
										link: "/work/list",
										param: {auditType: 2, send: ''}
									}
								]
							}
						]
					}
				],
				panesData3: [
					{
						name: "",
						column: [
							{
								title: "加盟合同",
								link: "/work/list",
								param: {auditType: 1},
								data: [
									{
										num: 0,
										unit: "个",
										desc: "待我审核",
										link: "/work/list",
										param: {auditType: 1, auditStatus: 2, principal: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "审核中",
										link: "/work/list",
										param: {auditType: 1, auditStatus: 2,user: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "审核通过",
										link: "/work/list",
										param: {auditType: 1, auditStatus: 3,user: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "审核拒绝",
										link: "/work/list",
										param: {auditType: 1, auditStatus: 4,user: ''}
									},
									{
										num: 0,
										unit: "个",
										desc: "抄送我的",
										link: "/work/list",
										param: {auditType: 1, send: ''}
									}
								]
							}
						]
					}
				],
				///排行相关/
				tableData: [],
				options: [
					{
						label: "本月",
						value: 3
					},
					{
						label: "上月",
						value: 4
					},
					{
						label: "本季度",
						value: 5
					},
					{
						label: "上季度",
						value: 6
					},
					{
						label: "本年",
						value: 7
					}
				]
			};
		},
		mounted () {
			this.panesData2[ 0 ].column[ 0 ].data[ 4 ].param.send = this.$store.getters.userInfo.userName;
			this.panesData3[ 0 ].column[ 0 ].data[ 4 ].param.send = this.$store.getters.userInfo.userName;
			this.getClueInfo(); // 获得线索
			this.getWorkbench(); // 获得意向客户
			this.getCustormNum(); // 获得审批中心客户
			this.getintentionNum(); // 获得审批中心合同
			this.getTopTenInfo(); // 获得排行
		},
		methods: {
			getClueInfo () {
				let that = this;
				let clue = this.panesData[ 0 ].column[ 0 ];
				that.$get('/data/my', {
					pathL: '/marketing/clueInfo/workbench'
				}).then(res => {
					if (res.state == 0) {
						clue.data[ 0 ].num = res.data.newClue;
						clue.data[ 1 ].num = res.data.close;
						clue.data[ 2 ].num = res.data.processed;
					}
				}).catch(err => {
					that.$message(err.msg);
				})

			},
			getWorkbench () {
				let that = this;
				let bench = this.panesData1[ 0 ].column[ 0 ];
				that.$get('/data/my', {
					pathL: '/marketing/customerInfo/workbench'
				}).then(res => {
					if (res.state == 0) {
						bench.data[ 0 ].num = res.data.waitFollowUp;
						bench.data[ 1 ].num = res.data.followUp;
						bench.data[ 2 ].num = res.data.normal;
						bench.data[ 3 ].num = res.data.end;
					}
				}).catch(err => {
					that.$message(err.msg);
				})
			},
			getCustormNum () {
				let that = this;
				let bench = this.panesData2[ 0 ].column[ 0 ];
				that.$get('/data/my', {
					pathL: '/common/audit/workbench',
					businessType: 2
				}).then(res => {
					if (res.state == 0) {
						bench.data[ 0 ].num = res.data.waitAudit; // 待审
						bench.data[ 1 ].num = res.data.approval; //审核中
						bench.data[ 2 ].num = res.data.succeed; // 通过
						bench.data[ 3 ].num = res.data.reject; // 拒绝
						bench.data[ 4 ].num = res.data.copy; // 抄送
					}
					else {
						that.$message("获取数据失败");
					}
				}).catch(err => {
					that.$message(err.msg);
				})
			},
			getintentionNum () {
				let that = this;
				let bench = this.panesData3[ 0 ].column[ 0 ];
				that.$get('/data/my', {
					pathL: '/common/audit/workbench',
					businessType: 1
				}).then(res => {
					if (res.state == 0) {
						bench.data[ 0 ].num = res.data.waitAudit; // 待审
						bench.data[ 1 ].num = res.data.approval; //审核中
						bench.data[ 2 ].num = res.data.succeed; // 通过
						bench.data[ 3 ].num = res.data.reject; // 拒绝
						bench.data[ 4 ].num = res.data.copy; // 抄送
					}
					else {
						that.$message("获取数据失败");
					}
				}).catch(err => {
					that.$message(err.msg);
				})
			},
			getTopTenInfo () {
				let that = this;
				that.$get('/data/my', {
					pathL: '/marketing/contractInfo/PerformanceRanking',
					scope: this.value
				}).then(res => {
					if (res.state == 0) {
						that.tableData = res.data;
					}
					else {
						that.$message("获取数据失败");
					}
				}).catch(err => {
					that.$message(err.msg);
				})
			},
			getMenuAccess (url) {
				let hasAccess = false;
				const menuURL = this.$store.getters.menuInfo.menuURL.filter(
					item => item.menuName === "营销平台"
				);
				for (let i = 0; i < menuURL[ 0 ].urlList.length; i++) {
					if (menuURL[ 0 ].urlList[ i ] == url) {
						hasAccess = true;
						break;
					}
					else {
						hasAccess = false;
					}
				}
				return hasAccess;
			},
			gotoLinkPage (url, param) {
				let fg = this.getMenuAccess(url);
				if (fg) { // 有跳转的权限
					if (param) {
						if (param.hasOwnProperty('user')) {
							param.user = this.$store.getters.userInfo.userName;
						}
						if (param.hasOwnProperty('principal')) {
							param.principal = this.$store.getters.userInfo.userName;
						}
						this.$router.push({
							path: url,
							query: param
						})
					}
					else {
						this.$router.push({
							path: url
						})
					}
				}
				else { // 无跳转的权限
					this.$message('您没有该菜单权限无法访问');
				}
			},

			///////日历相关操作/////////
			// 选择月份
			changeMonth (start, end, current) {
				//console.log("changeMonth", start, end, current);
			},
			// 点击事件
			eventClick (event, jsEvent, pos) {
				//console.log("eventClick", event, jsEvent, pos);
			},
			// 点击当天
			dayClick (day, jsEvent) {
				// console.log("dayClick", day, jsEvent);
			},
			// 查看更多
			moreClick (day, events, jsEvent) {
				//console.log("moreCLick", day, events, jsEvent);
			}
		}
	};
</script>

<style lang="scss" scoped>
  .is-selected {
    color: #f60;
  }

  .redbg {
    background: #f60;
  }
</style>