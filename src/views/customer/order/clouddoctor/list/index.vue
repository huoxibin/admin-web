<template>
  <div class="health comment">
    <!-- 检索条件 -->
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <el-form class="m-t-20" inline ref="form" label-width="100px" size="mini" :model="form">
        <el-form-item label="订单号">
          <el-input v-model="form.orderNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="form.serviceName" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="图文咨询" value="图文咨询"></el-option>
            <el-option label="语音咨询" value="语音咨询"></el-option>
            <el-option label="视频咨询" value="视频咨询"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.payFrom" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="账户余额" value="账户余额"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payStatus" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待付款" value="待付款"></el-option>
            <el-option label="已付款" value="已付款"></el-option>
            <el-option label="已退款" value="已退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.applyFormStatus" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待受理" value="1"></el-option>
            <el-option label="咨询中" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="已拒绝" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务评价">
          <el-select v-model="form.serviceCode" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="非常不满意" value="1"></el-option>
            <el-option label="不满意，比较差" value="2"></el-option>
            <el-option label="一般，还需改善" value="3"></el-option>
            <el-option label="比较满意，仍可改善" value="4"></el-option>
            <el-option label="非常满意，无可挑剔" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付时间：">
          <el-date-picker v-model="form.paydate" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下单时间：">
          <el-date-picker v-model="form.orderDate" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div class="health-bottom">
      <div class="title-bar">
        <span>数据列表</span>
        <el-button @click="exportExcel" size="mini" type="primary">导出</el-button>
      </div>
      <div ref="table" class="column-bottom" v-loading="loading" element-loading-text="正在加载中">
        <el-table height="100%" :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="serviceName" show-overflow-tooltip label="订单类型" align="center"></el-table-column>
          <el-table-column prop="doctorName" show-overflow-tooltip label="咨询医生" align="center"></el-table-column>
          <el-table-column prop="memberName" show-overflow-tooltip label="咨询用户" align="center"></el-table-column>
          <el-table-column prop="payFrom" show-overflow-tooltip label="支付方式" align="center"></el-table-column>
          <el-table-column prop="payStatus" show-overflow-tooltip label="支付状态" align="center"></el-table-column>
          <el-table-column prop="formTime" show-overflow-tooltip label="下单时间" align="center"></el-table-column>
          <el-table-column prop="amount" show-overflow-tooltip label="支付金额" align="center"></el-table-column>
          <el-table-column prop="payTime" show-overflow-tooltip label="支付时间" align="center"></el-table-column>
          <el-table-column prop="applyFormStatus" show-overflow-tooltip label="订单状态" align="center">
            <template slot-scope="scope">
              {{scope.row.applyFormStatus === '1' ? '待受理' : (scope.row.applyFormStatus === '2' ? '咨询中':
              (scope.row.applyFormStatus === '3' ? '已完成 ': '已拒绝'))}}
            </template>
          </el-table-column>
          <el-table-column prop="serviceGradeDesc" show-overflow-tooltip label="订单评价" align="center"></el-table-column>
          <el-table-column fixed="right" width="100" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
              <el-button
                v-if="scope.row.applyFormStatus == 3 && (scope.row.serviceName=='语音咨询' || scope.row.serviceName=='视频咨询') "
                @click="prevview(scope.row)" type="text" size="small">
                回放
              </el-button>
              <!--<el-button @click="refund(scope.row)" type="text" size="small">退款</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                       layout="total, prev, pager, next, jumper" :total="pageLength">
        </el-pagination>
      </div>
    </div>
    <!-- 退款按钮对话框 -->
    <el-dialog title="确认退款" :visible.sync="dialogRefundVisible" center :modal-append-to-body='false' width="60%">
      <div class="dialogCount">
        退款金额：<span>54.00</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="remarks">
          <el-form-item label="退款理由：" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            <span style="color:#606266">{{ruleForm.desc.length}}/50</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFormCancel(ruleForm)">否</el-button>
        <el-button type="primary" @click="submitForm(ruleForm)">是</el-button>
      </div>
    </el-dialog>
    <!-- 查看按钮对话框 -->
    <el-dialog title="查看订单信息" :visible.sync="dialogTableVisible" center :modal-append-to-body='false' width="60%"
               v-loading="loadingTixian" element-loading-text="拼命加载中">
      <!--图文咨询待受理/图文待咨询已退款-->
      <el-form ref="formPut" size="mini" :model="formPut" label-width="100px" v-show="formPut.serviceName==='图文咨询'">
        <div class="form">
          <div class="left">
            <el-form-item label="订单号">
              <el-input v-model="formPut.orderNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="咨询用户">
              <el-input v-model="formPut.memberName" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-input v-model="formPut.payFrom" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-input v-model="formPut.payStatus" disabled></el-input>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-input v-model="formPut.formTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="退款时间" v-show="formPut.payStatus == '已退款'">
              <el-input v-model="formPut.refundTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="反馈速度">
              <el-input v-model="formPut.feedbackGradeDesc" disabled></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="咨询医生">
              <el-input v-model="formPut.doctorName" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-input v-model="formPut.serviceName" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单金额">
              <el-input v-model="moneyW" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付时间">
              <el-input v-model="formPut.payTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="退款金额" v-show="formPut.payStatus == '已退款'">
              <el-input v-model="formPut.refundAmount" disabled></el-input>
            </el-form-item>
            <!-- <el-form-item label="退款理由">
               <el-input v-model="formPut.name" disabled></el-input>
             </el-form-item>-->
            <el-form-item label="服务评价">
              <el-input v-model="formPut.serviceGradeDesc" disabled></el-input>
            </el-form-item>
            <el-form-item label="专业水平">
              <el-input v-model="formPut.professionalGradeDesc" disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="评价内容">
          <el-input v-model="formPut.evalContent" disabled></el-input>
        </el-form-item>
        <el-form-item label="评价显示:">
          <el-switch
            style="display: block"
            v-model="showFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleShow"
            active-text="显示"
            inactive-text="不显示">
          </el-switch>
        </el-form-item>
      </el-form>
      <!--语音咨询已完成/视频咨询直接拨打订单-->
      <el-form ref="formPut" size="mini" :model="formPut" label-width="100px"
               v-show="formPut.serviceName === '语音咨询' || formPut.serviceName ==='视频咨询'">
        <div class="form">
          <div class="left">
            <el-form-item label="订单号">
              <el-input v-model="formPut.orderNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="咨询用户">
              <el-input v-model="formPut.memberName" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-input v-model="formPut.payFrom" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-input v-model="formPut.payStatus" disabled></el-input>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-input v-model="formPut.formTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="通话时长">
              <el-input v-model="timeLong" disabled></el-input>
            </el-form-item>
            <el-form-item label="反馈速度">
              <el-input v-model="formPut.feedbackGradeDesc" disabled></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="咨询医生">
              <el-input v-model="formPut.doctorName" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-input v-model="formPut.serviceName" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单金额">
              <el-input v-model="moneyW" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付时间">
              <el-input v-model="formPut.payTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="预约时间">
              <el-input v-model="formPut.orderTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="服务评价">
              <el-input v-model="formPut.serviceGradeDesc" disabled></el-input>
            </el-form-item>
            <el-form-item label="专业水平">
              <el-input v-model="formPut.professionalGradeDesc" disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="评价内容">
          <el-input v-model="formPut.evalContent" disabled></el-input>
        </el-form-item>
        <el-form-item label="评价显示:">
          <el-switch
            style="display: block"
            v-model="showFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleShow"
            active-text="显示"
            inactive-text="不显示">
          </el-switch>
        </el-form-item>
      </el-form>
    </el-dialog>
    <dk-dialog
      :showCancelBtn=false
      :showConfirmBtn=false
      :baseConfig="dialog"
      :dialogShow.sync="dialog.visible"
      @confirmCallback="confirm"
      @cancelCallback="cancel"
      @closeDialog="cancel"
    >
      <!-- 表单 -->
      <dk-form
        size="mini"
        :form="prevviewform"
        :config="prevviewConfig"
        :inline="true"
        labelWidth="120px"
        slot="form"
      ><!-- 按钮 -->
      </dk-form>
      <el-form slot="btns" labelWidth="120px" :inline="false" size="mini">
        <el-form-item label="回放内容" v-if="flag">
          <!--<el-button size="mini" type="text" @click="downloadVedio">下载</el-button>-->
          暂无可播放内容！
        </el-form-item>
        <el-form-item label="视频播放" v-show="videoShow">
          <!--<video id="my-video" style="width: 445px; height: 200px; background: #000;"-->
          <!--webkit-playsinline-->
          <!--controls-->
          <!--controlsList='nodownload'-->
          <!--preload="auto" width="445" height="200">-->
          <!--<source :src="prevviewform.playUrlv" type="video/mp4">-->
          <!--</video>-->
          <div class="m-t-10" v-for="(item,index) in videoList" :key="item.sources.src">
            <video-player
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="item"
            ></video-player>
          </div>
        </el-form-item>
        <el-form-item label="音频播放" v-show="audioShow">
          <div class="m-t-10" v-for="(item,index) in musicList" :key="item.src">
          <aplayer
            theme="#b7daff"
            :autoplay=false
            :music="item"/>
          </div>
          <!--v-if='flag'-->
          <!--<video id="my-audio" style="height: 54px; width:445px;" x-webkit-airplay="allow"-->
          <!--webkit-playsinline-->
          <!--controls-->
          <!--controlsList='nodownload'-->
          <!--preload="auto" width="445" height="54">-->
            <!--<source :src="prevviewform.playUrla" type="video/mp4">-->
          <!--</video>-->
        </el-form-item>
      </el-form>
    </dk-dialog>
  </div>
</template>

<script>
	import './neplayer.min.css';
	import './neplayer.min.js';
	import Aplayer from 'vue-aplayer';

	export default {
		name: "",
		components: {Aplayer},
		props: [],
		data () {
			return {
				videoShow: false,//视频播放
				audioShow: false,//音频播放
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
				//视频播放内容
				playerOptions: {
					playbackRates: [ 0.7, 1.0, 1.5, 2.0 ], //播放速度
					autoplay: false, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 导致视频一结束就重新开始。
					preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: 'zh-CN',
					aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					sources: [
						{
							type: "",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
							src: "" //url地址 http://vjs.zencdn.net/v/oceans.mp4
						},
						// {
						// 	type: "",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
						// 	src: "http://jdvodb6qvxseg.vod.126.net/jdvodb6qvxseg/5295487545-51267798468575-0.mp4" //url地址
						// }
					],
					poster: "", //你的封面地址
					// width: document.documentElement.clientWidth, //播放器宽度
					notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar: {
						timeDivider: true,
						durationDisplay: true,
						remainingTimeDisplay: false,
						fullscreenToggle: true  //全屏按钮
					}
				},
				//查看回放内容
				dialog: {
					visible: false,
					width: "650px",
					title: "查看回放"
				},
				prevviewform: {
					orderNo: '',
					doctorName: '',
					serviceName: '',
					memberName: '',
					endTime: '',
					playUrlv: '',
					playUrla: '',
				},
				prevviewConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "订单号",
						value: "orderNo",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "咨询医生",
						value: "doctorName",
						option: {
							disabled: true
						}
					}, {
						type: "input",
						label: "咨询用户",
						value: "memberName",
						option: {
							disabled: true
						}
					}, {
						type: "input",
						label: "订单类型",
						value: "serviceName",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "完成时间",
						value: "endTime",
						option: {
							disabled: true
						}
					}
				],
				showFlag: true,
				applyFormId: 0,
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				dialogTableVisible: false,//查看详情现实与隐藏
				dialogRefundVisible: false,//退款对话款显示与隐藏
				loadingTixian: false,//详情加载的
				loading: false,
				//查看详情
				formPut: {
					orderNo: '',//订单号
					memberName: '',//咨询用户
					payFrom: '',//支付方式
					payStatus: '',//订单状态
					formTime: '',//下单时间
					timeLong: '',//通话时长
					refundTime: '',//退款时间
					doctorName: '',//咨询医生
					serviceName: '',//订单类型
					amount: '',//订单金额
					payTime: '',//支付时间
					refundAmount: '',//退款金额
					orderTime: ''//预约时间
				},
				//退款的Form验证
				ruleForm: {
					desc: ''
				},
				timeLong: '',//通话时长
				rules: {
					desc: [
						{required: true, message: '请填写退款理由', trigger: 'blur'},
						{min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
					]
				},
				//检索条件
				form: {
					orderNo: "",//订单号
					serviceName: '',//订单类型
					payFrom: '',// 支付方式
					payStatus: '',//支付状态
					applyFormStatus: '',//订单状态
					paydate: [],//支付时间
					orderDate: [],//下单时间
					serviceCode: '',//服务评价
				},
				tableData: [],//table内容
				pageSize: 10,//每页显示得条数
				pageLength: 0,//一共多少条数据
				pageNum: 1,//当前页码
				moneyW: '' // 微信、支付宝---（查看）---订单金额
			}
		},
		methods: {
			//获取table列表
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/doctorApplyFormOrder/list",
					pageNum: this.pageNum,//当前页码
					pageSize: this.pageSize,//每页显示得条数
					orderNo: this.form.orderNo,//订单号
					serviceName: this.form.serviceName,//订单类型
					payFrom: this.form.payFrom,// 支付方式
					payStatus: this.form.payStatus,//支付状态
					applyFormStatus: this.form.applyFormStatus,//订单状态
					serviceCode: this.form.serviceCode,//服务评价
					payTimeStart: this.form.paydate === null ? '' : this.form.paydate[ 0 ],//支付时间开始
					payTimeEnd: this.form.paydate === null ? '' : this.form.paydate[ 1 ],//支付时间结束
					formTimeStart: this.form.orderDate === null ? '' : this.form.orderDate[ 0 ],//下单时间开始
					formTimeEnd: this.form.orderDate === null ? '' : this.form.orderDate[ 1 ],//下单时间结束
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				})
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			//搜索信息
			search () {
				this.pageNum = 1;
				this.queryList();
			},
			//查看按钮
			view (row) {
				this.dialogTableVisible = true;
				this.loadingTixian = true;
				this.moneyW = row.amount;
				this.$get("/data/my", {
					pathL: "/doctor/doctorApplyFormOrder/detail",
					accountId: row.accountId,
					accountType: row.accountType
				}).then(res => {
					this.loadingTixian = false;
					if (res.state === 0) {
						this.showFlag = res.data.showFlag === 1 ? true : false;
						this.applyFormId = res.data.applyFormId;
						this.formPut = res.data;
						if (this.formPut.timeLong) {
							let _timeLong = this.formPut.timeLong;
							this.timeLong = _timeLong + ' 分钟';
						}
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				})
			},
			//退款按钮
			refund (row) {
				this.dialogRefundVisible = true;
			},
			//退款对话框里面 否 按钮
			submitFormCancel (ruleForm) {
				this.dialogRefundVisible = false;
			},
			//退款对话框里面 是 按钮
			submitForm (ruleForm) {
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						// this.loading = true;
						this.dialogRefundVisible = false;
						this.$get("/data/my", {
							pathL: "",
							description: this.ruleForm.desc//备注
						}).then(res => {
							if (res.state === 0) {
								// console.log(res);
                /*this.loading = false;
                 this.queryList();
                 this.dialogRefundVisible = false;
                 this.$message({
                 type: "success",
                 message: "退款成功！",
                 center: true
                 });*/
							}
							else {
								this.$message({
									message: res.msg,
									center: true
								});
							}
						})

					}
					else {
						return false;
					}
				});
			},
			//金额保留2位小数
			toFixed (row) {
				let price = Number(row.serviceCopy).toFixed(2);
				return price;
			},
			//导出
			exportExcel () {
				let payTimeStart_export = (this.form.paydate === null || this.form.paydate[ 0 ] === undefined) ? '' : this.form.paydate[ 0 ];
				let payTimeEnd_export = (this.form.paydate === null || this.form.paydate[ 1 ] === undefined) ? '' : this.form.paydate[ 1 ];
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let urlL = `${ realm }doctor/doctorApplyFormOrder/listToExcel?
               &version=${ version }
               &accessToken=${ this.$store.getters.accessToken }
               &orderNo=${ this.form.orderNo }
               &serviceName=${ this.form.serviceName }
               &payFrom=${ this.form.payFrom }
               &payStatus=${ this.form.payStatus }
               &applyFormStatus=${ this.form.applyFormStatus }
               &payTimeStart=${ payTimeStart_export }
               &payTimeEnd=${ payTimeEnd_export }
            `;
				this.$get("/data/exportExecl", {
					url: urlL.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url
				});
			},
			//是否显示评价
			toggleShow () {
				let a = this.showFlag === true ? 1 : 0;
				this.$post("/data/my", {
					pathL: "/doctor/doctorApplyFormOrder/updateShowFlag",
					applyFormId: this.applyFormId,
					showFlag: a
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							type: "success",
							message: "保存成功",
							center: true
						});
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				})
			},
			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined && this.$route.query.markId == 1) {
					this.form.orderDate = [ this.$route.query.start, this.$route.query.end ];
					this.queryList();
				}
				else if (this.$route.query.start != undefined && this.$route.query.end != undefined && this.$route.query.serviceCode == 1) {
					this.form.orderDate = [ this.$route.query.start, this.$route.query.end ];
					this.form.serviceCode = '1';
					this.queryList();
				}
				else {
					this.queryList();
				}
			},
			prevview (row) {
				// 查看回放
				this.audioShow = false;
				this.videoShow = false;
				this.flag = false;
				this.prevviewform.playUrlv = '';
				this.prevviewform.playUrla = '';
				if (row.serviceName == "语音咨询") {
					this.audioShow = true;
				}
				else if (row.serviceName == "视频咨询") {
					this.videoShow = true;
				}
				//this.prevviewform = {};
				let that = this;
				this.$get('/data/my', {
					pathL: '/doctor/doctorApplyFormOrder/videoDetail',
					accountId: row.accountId
				}).then(res => {
					if (res.state == 0) {
						that.prevviewform.orderNo = row.orderNo;
						that.prevviewform.doctorName = row.doctorName;
						that.prevviewform.serviceName = row.serviceName;
						that.prevviewform.memberName = row.memberName;

						if (res.data.fileInfo.length == 0 || res.data.fileInfo[ 0 ].url == '') {
							that.flag = true;
							that.audioShow = false;
							that.videoShow = false;
						}
						else {
							if (row.serviceName == "语音咨询") {
								that.dealAudio(res.data.fileInfo);
								//that.prevviewform.playUrla = res.data.fileInfo;
							}
							else if (row.serviceName == "视频咨询") {
								that.dealVideo(res.data.fileInfo);
								//that.prevviewform.playUrlv = res.data.fileInfo;
							}
						}
						that.dialog.visible = true;
						that.prevviewform.endTime = res.data.endTime;

					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					that.$message(err);
				})

			},
			dealAudio (data) {
				let that = this;
				data.forEach((item, index) => {
					let config = that.songList;
					config.src = item.url;
					config.title = item.filename;
					config = JSON.parse(JSON.stringify(config));
					that.musicList.push(config);
				})

			},
			dealVideo (data) {
				let that = this;
				data.forEach((item, index) => {
					let config = that.playerOptions;
					config.sources[ 0 ].src = item.url;
					config = JSON.parse(JSON.stringify(config));
					that.videoList.push(config);
				})
			},
			confirm () {
				this.dialog.visible = false;
				this.videoList = [];
				this.musicList = [];
			},
			cancel () {
				this.dialog.visible = false;
				this.videoList = [];
				this.musicList = [];
			}
		},
		mounted () {
			this.initPage();
			this.flag = false;
		},
		watch: {
			dialogRefundVisible (now) {
				if (now === false) {
					this.$refs[ "ruleForm" ].resetFields();
				}
			}
		}
	}


</script>

<style scoped>

  .form {
    display: flex;
  }

  .left,
  .right {
    flex: 1;
  }

  .dialogCount {
    width: 100%;
    margin-left: 18px;
    margin-bottom: 20px;
  }

  .dialogCount span {
    padding-left: 12px;
  }

  .cloud {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    overflow: hidden;
  }

  .table {
    flex: 1;
    width: 100%;
    overflow: auto;
  }

  .cloud-search {
    margin-top: 8px;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    background: rgba(238, 246, 248, 1);
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .cloud-bottom {
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: column wrap;
    border-top: 1px solid #ccc;
    overflow-y: auto;
  }

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }

  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
