<template>
  <div class="health comment">
    <base-layout methods="get" ref="list" :form="form" @getData="getData" style="height: 100%;">
      <!-- 表单 -->
      <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" @click="exportList">导出</el-button>
      </div>
      <!--表格-->
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="100"
        index
        :pageNum="1"
        :pageSize="10"
        @sortChange="sortByData"
        @cellClick="goDetail"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="rowDetail(scope.row)">查看</el-button>
        </template>
      </dk-table>
    </base-layout>
    <dk-dialog
      :baseConfig="dialogConfig"
      :dialogShow.sync="dialogConfig.visible"
      :showCancelBtn=false
      :showConfirmBtn=false
      @closeDialog="closeDialog"
    >
      <dk-form :form="dialogform" :config="dialogformConfig" :inline="true" labelWidth="85px" slot="form"></dk-form>
      <el-form slot="btns" labelWidth="85px" :inline="false" size="mini">
        <el-form-item label="音频播放">
          <div class="m-t-10" v-for="(item,index) in musicList" :key="item.src">
            <aplayer
              theme="#b7daff"
              :autoplay=false
              :music="item"/>
          </div>
        </el-form-item>
      </el-form>

    </dk-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";
	import Aplayer from 'vue-aplayer';

	export default {
		components: {Aplayer},
		data: () => ({
			//音频播放内容
			flag: false,
			musicList: [],
			videoList: [],
			songList: {
				title: '音频名称',
				artist: '  ',
				src: '',
				pic: ''
			},
			form: {
				pathL: "/customer/callStatistics/queryPage",
				userName: '',
				dateTime: [],
				familyId: '',
				startTime: '',
				endTime: '',
				pageNum: 1,
				pageSize: 10
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "客户名称",
					value: "userName",
					option: {
						placeholder: "请输入客户名称",
						disabled: false
					}
				},
				{
					type: "input",
					label: "家庭号",
					value: "familyId",
					option: {
						placeholder: "请输入家庭号",
						disabled: false
					}
				},
				{
					type: "date",
					label: "接听时间",
					value: "dateTime",
					option: {
						type: 'daterange',
						disabled: false,
						format: 'yyyy-MM-dd'
					},
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "客服姓名",
					value: "user_name",
					cellClassName: 'c-p',
				},
				{
					type: "",
					label: "坐席",
					value: "group_name"
				},
				{
					type: "",
					label: "家庭号",
					value: "family_id"
				},
				{
					type: "",
					label: "接听时间",
					value: "answer_time"
				},
				{
					type: "",
					label: "通话时长",
					value: "talk_time"
				},
				{
					type: "",
					label: "挂断时间",
					value: "hangup_time"
				}
			],
			tableData: [],
			/////////弹窗配置////////////
			dialogConfig: {
				visible: false,
				width: "550px",
				title: "查看"
			},
			dialogform: {},
			dialogformConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "客服姓名",
					value: "userName",
					option: {
						placeholder: "客服姓名",
						disabled: true
					}
				},
				// 搜索条件相关配置
				{
					type: "input",
					label: "家庭号",
					value: "familyId",
					option: {
						placeholder: "家庭号",
						disabled: true
					}
				},
				// 搜索条件相关配置
				{
					type: "input",
					label: "接听时间",
					value: "answerTime",
					option: {
						placeholder: "接听时间",
						disabled: true
					}
				},
				// 搜索条件相关配置
				{
					type: "input",
					label: "挂断时间",
					value: "hangupTime",
					option: {
						placeholder: "挂断时间",
						disabled: true
					}
				},
				{
					type: "input",
					label: "通话时长",
					value: "talkTime",
					option: {
						placeholder: "通话时长",
						disabled: true
					}
				}
			],
		}),
		watch: {
			'form.dateTime' () {
				let date = this.form.dateTime;
				if (date) {
					this.form.startTime = date[ 0 ] || '';
					this.form.endTime = date[ 1 ] || '';
				}
				else {
					this.form.startTime = '';
					this.form.endTime = '';
				}
			}
		},
		methods: {
			// 获取数据
			getData (data) {
				this.tableData = data.result.list;
			},
			closeDialog () {
				this.dialogConfig.visible = false;
				this.musicList=[];
			},
			exportList () {
				//导出
				let url = "/customer/callStatistics/exportExcel";
				let remForm = JSON.parse(JSON.stringify(this.form));
				delete remForm.pathL;
				exportExcel(url, remForm);
			},
			rowDetail (row) {
				let that = this;
				this.$get('/data/my', {
					pathL: '/notify/imMsgvideo/getFileByChannelId',
					channelId: row.channel_id
				}).then(res => {
					if (res.state == 0) {
						that.dialogConfig.visible = true;
						that.dialogform.userName = row.user_name;
						that.dialogform.familyId = row.family_id;
						that.dialogform.answerTime = row.answer_time;
						that.dialogform.hangupTime = row.hangup_time;
						that.dialogform.talkTime = `${ row.talk_time }  s`;
						res.data.forEach(item => {
							that.musicList.push({
								src: item.url,
								title: item.filename
							})
						})
					}
				}).catch(err => {
					console.log(err);
				})


			}
		}
	};
</script>
