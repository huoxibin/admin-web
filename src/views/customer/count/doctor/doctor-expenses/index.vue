<template>
  <div class="health comment">
    <base-layout methods="get" ref="layout" :form="form" @getData="getData">
      <!-- 表单 -->
      <dk-form :form="form" :rules="rules" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->

      <div class="pull-right" slot="btns">
        <el-button size="mini" type="primary" v-if="btnActive" @click="importExcel">导入</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="exportExcel">导出</el-button>
      </div>

      <dk-table
        slot="table"
        :height="tableHeight"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="200"
        index
        :pageNum="1"
        :pageSize="10"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="seeRowInfo(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="seeRecord(scope.row)">充值记录</el-button>
        </template>
      </dk-table>
    </base-layout>
    <!--      查看详情弹窗-->
    <dk-dialog
      :baseConfig="dialogConfig"
      :dialogShow.sync="dialogShow"
      :showConfirmBtn="false"
      @cancelCallback="cancel"
      @closeDialog="cancel"
    >
      <dk-form slot="form" :form="dialogForm" :config="config" :inline="true" labelWidth="90px"></dk-form>
    </dk-dialog>
    <!--      充值记录弹窗-->
    <dk-dialog
      :baseConfig="dialogConfigRecord"
      :dialogShow.sync="dialogShowRecord"
      :showConfirmBtn="false"
      @confirmCallback="confirmRecord"
      @cancelCallback="cancelRecord"
      @closeDialog="cancelRecord"
    >
      <dk-table
        slot="table"
        :data="dataRecord"
        :config="configRecord"
        index
        :pageNum="1"
        :pageSize="10"
      ></dk-table>
      <dk-page @currentChange="changePage" :pageConfig="recordPage" slot="page"></dk-page>
    </dk-dialog>
    <!--      导入弹窗-->

    <dk-dialog
      :baseConfig="dialogConfigImport"
      :dialogShow.sync="dialogShowImport"
      @confirmCallback="confirmImport"
      @cancelCallback="cancelImport"
      @closeDialog="cancelImport"
    >
      <el-form slot="form" size="mini" :inline="false" labelWidth="130px">
        <el-form-item label="导入">
          <el-upload
            ref="upload"
            class="upload-demo"
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadUrl"
            :data="dataParam"
            :headers="uploadHeaders"
            :file-list="fileList"
            :show-file-list="true"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadFileSuccess"
            name="excel"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xls文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="导出">
          <el-button @click="exportModel" type="primary" size="mini">导出模板</el-button>
        </el-form-item>
        <el-form-item label="是否导入成功">
          <div>{{ this.importForm.fg }}</div>
        </el-form-item>
      </el-form>
    </dk-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";
	import DkPage from "../../../../../components/package/page";
	import BaseLayout from "../../../../../components/base/_base-layout";

	export default {
		components: {BaseLayout, DkPage},
		computed: {
			date () {
				return this.form.date;
			}
		},
		data () {
			return {
				tableHeight:100,
				btnActive: false,
				form: {
					pathL: "/doctor/doctorAccount/getAccountList",
					doctorId: "",
					doctorName: "",
					mobile: "",
					timeStart: "",
					timeEnd: "",
					sort: "CONVERT(di.name USING gbk) DESC",
					pageNum: 1,
					pageSize: 10
				},
				////////新的页面配置///////////
				rules: {
					doctorId: [
						{validator: this.subStrDoctorId, trigger: "blur"},
						{required: false, message: "请输入医生号", trigger: "blur"}
					]
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "医生姓名",
						value: "doctorName",
						option: {
							placeholder: "请输入医生姓名",
							disabled: false
						}
					},
					{
						type: "input",
						label: "医生号",
						value: "doctorId",
						option: {
							placeholder: "请输入医生号",
							disabled: false
						}
					},
					{
						type: "input",
						label: "手机号",
						value: "mobile",
						option: {
							placeholder: "请输入医生号",
							disabled: false
						}
					},
					{
						type: "date",
						label: "时间查询",
						value: "date",
						option: {
							type: "daterange",
							// date - [ yyyy-MM-dd/yyyy-MM-dd HH:mm:ss ]
							format: "yyyy-MM-dd",
							disabled: false
						}
					}
				],
				tableData: [],
				tableConfig: [
					//相关的表格的配置
					{
						type: "",
						label: "医生姓名",
						value: "name"
					},
					{
						type: "",
						label: "医生号",
						value: "id"
					},
					{
						type: "",
						label: "机构名称",
						value: "hospitalName"
					},

					{
						type: "",
						label: "手机号",
						value: "mobile"
					},
					{
						type: "",
						label: "当前余额",
						value: "nowBalance"
					},
					{
						type: "",
						label: "剩余虚拟币",
						value: "virtualAmount"
					},
					{
						type: "",
						label: "总收入",
						value: "nowBalance1"
					},
					{
						type: "",
						label: "总提现",
						value: "totalCashWithdrawal"
					}
				],
				///////导入配置////
				fileList: [],
				uploadUrl: "/data/excel",
				uploadHeaders: {
					accessToken: this.$store.getters.accessToken,
					pathL: "/doctor/docAccountOperating/importDoctorNewFrom",
					userId: this.$store.getters.userId,
					userName: this.$store.getters.userInfo.loginName,
				},
				dataParam: {
					userId: this.$store.getters.userId,
					userName: this.$store.getters.userInfo.loginName,
				},
				importDialogConfig: {
					visible: false,
					width: "350px",
					title: "导入"
				},
				importForm: {
					fg: "否"
				},
				importFileForm: {},
				dialogConfigImport: {
					title: "导入", //标题
					width: "400px", //宽
					cancelBtnTxt: "关闭"
				},
				///////弹窗的基本配置/////////
				dialogShow: false, // 查看框
				dialogConfig: {
					title: "查看收支明细", //标题
					width: "600px", //宽
					modal: "", //遮罩
					center: "", //居中
					confirmBtnTxt: "返回",
					cancelBtnTxt: "取消"
				},
				//////////明细弹窗//////////
				dialogForm: {},
				config: [
					{
						type: "input",
						label: "医生姓名",
						value: "name",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "医生号",
						value: "id",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "机构名称",
						value: "hospitalName",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "手机号",
						value: "mobile",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "当前余额",
						value: "nowBalance",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "总收入",
						value: "totalEvenue",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "总提现",
						value: "totalCashWithdrawal",
						option: {
							disabled: true
						}
					},
					{
						type: "input",
						label: "剩余虚拟币",
						value: "virtualAmount",
						option: {
							disabled: true
						}
					}
				],
				////////////充值记录弹窗//////////////
				dialogShowRecord: false, // 充值记录框
				dialogConfigRecord: {
					title: "充值记录", //标题
					width: "600px", //宽
					confirmBtnTxt: "返回",
					cancelBtnTxt: "取消"
				},
				configRecord: [
					{
						// type 可选范围 [ input/button/image/switch ] 不传值则默认展示
						type: "",
						label: "充值金额",
						value: "orderAmount"
					},
					{
						// type 可选范围 [ input/button/image/switch ] 不传值则默认展示
						type: "",
						label: "所购虚拟币",
						value: "amount"
					},
					{
						// type 可选范围 [ input/button/image/switch ] 不传值则默认展示
						type: "",
						label: "充值日期",
						value: "createTime"
					}
				],
				dataRecord: [],
				//////////////导入记录弹窗//////////////////////////
				dialogShowImport: false,
				recordPage: {
					pageNum: 1,
					pageSize: 10,
					total: 0
				}
			};
		},
		watch: {
			date (now) {
				this.form.timeStart = now[ 0 ];
				this.form.timeEnd = now[ 1 ];
			}
		},
		mounted () {
			const btnArr = this.$store.getters.menuInfo.btnMenu;
			btnArr.forEach(item => {
				if (item.menuName === "客服平台") {
					for (let it of item.btnList) {
						if (it.linkUrl === "shouzhi") {
							this.btnActive = true; //开启分派的权限
							//this.$refs.list.search();
						}
					}
				}
			});
			this.calcPageTable();
		},
		methods: {
			calcPageTable () {

				this.tableHeight = window.innerHeight - this.$refs.layout.$refs.table.offsetTop -300;
				console.log(this.tableHeight);
			},
			subStrDoctorId () {
				this.form.doctorId = this.form.doctorId.substr(0, 6);
			},
			// 获取数据
			getData (data) {
				if (data.result) {
					this.tableData = data.result;
					this.tableData.forEach(item => {
						item.nowBalance1 = item.nowBalance;
					});
				}
			},
			exportExcel () {
				// 导出
				let url = "/doctor/doctorAccount/accountListToExcel";
				let remForm = JSON.parse(JSON.stringify(this.form))
				delete remForm.pathL;
				exportExcel(url, remForm);
			},
			importExcel () {
				//导入弹窗
				this.dialogShowImport = true;
			},
			// 表格序号
			serialNumber (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 查看行信息
			seeRowInfo (row) {
				this.dialogShow = true;
				this.dialogForm = row;
			},
			// 查看充值记录
			seeRecord (row) {
				this.dialogShowRecord = true;
				this.recordPage.id = row.id;
				this.getRecord();
			},
			getRecord () {
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/doctorAccountturnover/getAccountRechargeList",
					doctorId: this.recordPage.id,
					pageNum: this.recordPage.pageNum,
					pageSize: this.recordPage.pageSize
				})
					.then(res => {
						if (!res.state) {
							console.log("ddd");
							that.dataRecord = res.data.result;
							that.recordPage.total = res.data.total;
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			changePage (val) {
				//单节点点击事件
				console.log(val);
				this.recordPage.pageNum = val;
				this.getRecord();
			},
			confirmRecord () {
				this.dialogShowRecord = false;
				console.log("确认");
			},
			cancelRecord () {
				this.dialogShowRecord = false;
				console.log("取消");
			},
			updataDidalogVisible () {
				this.dialogShow = false;
			},
			confirmValue () {
				this.dialogShow = false;
				console.log("确认");
			},
			cancel () {
				// 详情关闭弹窗
				this.dialogShow = false;
			},
			confirmImport (val) {
				// 导入文件确认
				this.dialogShowImport = false;
				this.$refs.upload.clearFiles();
			},
			cancelImport () {
				// 导入文件取消
				this.dialogShowImport = false;
				this.$refs.upload.clearFiles();
			},
			exportModel () {
				// 导出模板
				let url = "/doctor/docAccountOperating/importTemplateExcel";
				exportExcel(url);
			},
			uploadFileJudge (files) {
				//debugger
				// if (files.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
				// 	this.$message({
				// 		message: "只允许上传格式为.xlsx的文件！",
				// 		center: true
				// 	});
				// 	this.$refs.upload.clearFiles()
				// }
			},

			// 引导图本地上传验证
			beforeAvatarUpload (file) {
				const extension = file.name.includes('.xls');
				if (!extension) {
					this.$message({
						message: "只允许上传格式为excel的文件！",
						type: "warning",
						center: true
					});
				}
				return (
					extension
				);
			},
			handleExceed (files, fileList) {
				this.$message.warning(
					`当前限制选择 1 个文件，本次选择了 ${
						files.length
						} 个文件，共选择了 ${ files.length + fileList.length } 个文件`
				);
			},
			uploadFileSuccess (response, file, fileList) {
				if (response.state == 0) {
					this.$message({
						message: "导入成功",
						type: "success",
						center: true
					});
					this.importForm.fg = "是";
					const getData = this.$refs.layout.getData;
					getData();
				}
				else {
					this.$message({
						message: response.msg,
						type: "warning",
						center: true
					});
					this.fileList = [];
				}
			}
		}
	};
</script>

