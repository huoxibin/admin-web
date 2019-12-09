<template>
  <div class="health comment">
    <base-layout ref="list" methods="get" :form="form" @getData="getData">
      <!-- 表单 -->
      <dk-form :config="formConfig" :form="form" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <el-button @click="requireFile" class="pull-right" style="margin-left: 10px" size="mini" type="primary">导入
        </el-button>
        <el-button @click="exportList" class="pull-right" size="mini" type="primary">导出</el-button>
        <el-button @click="cityManage" class="pull-right" size="mini" type="primary">城市类型管理</el-button>
      </div>
      <!--表格-->
      <dk-table
        :config="tableConfig"
        :data="tableData"
        :pageNum="1"
        :pageSize="1"
        @sortChange="sortByData"
        border
        index
        slot="table"
        stripe
      ></dk-table>
    </base-layout>

    <!--导入弹窗-->
    <importExcel
      @closeDialog="closeExportDialog"
      :dialogShow="exportExcelConfig.visible"
      :exportExcelConfig="exportExcelConfig"
      @cancelExcelConfig="cancelExcelConfig"
    ></importExcel>

    <!--城市类型管理弹窗-->
    <dk-dialog
      :baseConfig="cityDconfig"
      :dialogShow.sync="cityDconfig.visible"
      @cancelCallback="closeCityDialog"
      @confirmCallback="saveCityManage"
      @closeDialog="closeCityDialog"
    >
      <dk-form
        :rules="rules"
        :config="cityformConfig"
        :form="cityform"
        :inline="true"
        labelWidth="130px"
        slot="form"
      ></dk-form>
    </dk-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";
	import importExcel from "@/components/common/importExcel";
	import { isValidPrice } from "@/utils/RegExp";

	var validateRetailPrice = (rule, value, callback) => {
		if (!isValidPrice(value)) {
			callback(new Error("必须是正数,可包含两位小数"));
			return;
		}
	};
	export default {
		components: {importExcel},
		data: () => ({
			form: {
				pathL: "/common/mold/getCityList",
				sortProperty: "",
				sortType: "",
				provinceName: "",
				cityName: "",
				type: "",
				region: ""
			},
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "省名称",
					value: "provinceName",
					option: {
						placeholder: "请输入省名称",
						disabled: false
					}
				},
				{
					type: "input",
					label: "市名称",
					value: "cityName",
					option: {
						placeholder: "请输入市名称",
						disabled: false
					}
				},

				{
					type: "select",
					label: "城市类型",
					value: "type",
					option: {
						placeholder: "请输入城市类型",
						disabled: false,
						data: [
							{
								value: "",
								label: "请选择"
							},
							{
								value: "A",
								label: "A"
							},
							{
								value: "B",
								label: "B"
							},
							{
								value: "C",
								label: "C"
							}
						]
					}
				},
				{
					type: "select",
					label: "所属大区",
					value: "region",
					option: {
						placeholder: "请输入城市类型",
						disabled: false,
						data: [
							{
								value: "",
								label: "请选择"
							},
							{
								value: "华北",
								label: "华北"
							},
							{
								value: "华南",
								label: "华南"
							},
							{
								value: "华中",
								label: "华中"
							},
							{
								value: "华东",
								label: "华东"
							},
							{
								value: "西南",
								label: "西南"
							},
							{
								value: "西北",
								label: "西北"
							}
						]
					}
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "所属大区",
					value: "region",
					sort: true
				},
				{
					type: "",
					label: "省名称",
					value: "provinceName"
				},
				{
					type: "",
					label: "市名称",
					value: "cityName",
					sort: true
				},
				{
					type: "",
					label: "城市类型",
					value: "type",
					sort: true
				}
			],
			tableData: [],
			/////////弹窗配置////////////
			cityDconfig: {
				visible: false,
				width: "660px",
				title: "城市管理"
			},
			remCityManageVal: [],
			exportExcelConfig: {
				visible: false,
				uploadUrl: "/common/mold/import"
			},
			cityform: {
				agencyFeeA: "",
				agencyFeeB: "",
				agencyFeeC: "",
				cashDepositA: "",
				cashDepositB: "",
				cashDepositC: "",
				platformLicensingA: "",
				platformLicensingB: "",
				platformLicensingC: ""
			},
			cityformConfig: [
				{
					type: "input",
					label: "A类保证金",
					value: "cashDepositA",
					option: {
						placeholder: "请输入A类保证金",
						disabled: false
					}
				},
				{
					type: "input",
					label: "A类代理费",
					value: "agencyFeeA",
					option: {
						placeholder: "请输入A类代理费",
						disabled: false
					}
				},
				{
					type: "input",
					label: "A类平台使用费",
					value: "platformLicensingA",
					option: {
						placeholder: "请输入A类平台使用费",
						disabled: false
					}
				},
				{
					type: "input",
					label: "B类保证金",
					value: "cashDepositB",
					option: {
						placeholder: "请输入B类保证金",
						disabled: false
					}
				},
				{
					type: "input",
					label: "B类代理费",
					value: "agencyFeeB",
					option: {
						placeholder: "请输入B类代理费",
						disabled: false
					}
				},
				{
					type: "input",
					label: "B类平台使用费",
					value: "platformLicensingB",
					option: {
						placeholder: "请输入B类平台使用费",
						disabled: false
					}
				},
				{
					type: "input",
					label: "C类保证金",
					value: "cashDepositC",
					option: {
						placeholder: "请输入C类保证金",
						disabled: false
					}
				},
				{
					type: "input",
					label: "C类代理费",
					value: "agencyFeeC",
					option: {
						placeholder: "请输入C类代理费",
						disabled: false
					}
				},
				{
					type: "input",
					label: "C类平台使用费",
					value: "platformLicensingC",
					option: {
						placeholder: "请输入C类平台使用费",
						disabled: false
					}
				}
			],
			rules: {
				cashDepositA: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入A类保证金", trigger: "blur"}
				],
				agencyFeeA: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入A类代理费", trigger: "blur"}
				],
				platformLicensingA: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入A类平台使用费", trigger: "blur"}
				],
				cashDepositB: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入B类保证金", trigger: "blur"}
				],
				agencyFeeB: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入B类代理费", trigger: "blur"}
				],
				platformLicensingB: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入B类平台使用费", trigger: "blur"}
				],
				cashDepositC: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入C类保证金", trigger: "blur"}
				],
				agencyFeeC: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入C类代理费", trigger: "blur"}
				],
				platformLicensingC: [
					{validator: validateRetailPrice, trigger: "blur"},
					{required: true, message: "请输入C类平台使用费", trigger: "blur"}
				]
			}
		}),
		mounted () {
			this.getCityType();
		},
		methods: {
			getCityType () {
				//获取城市数据类型
				let that = this;
				this.$get("/data/my", {
					pathL: "/common/mold/getCityMold"
				})
					.then(res => {
						if (!res.state) {
							that.dealData(res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealData (data) {
				this.remCityManageVal = data;
				for (let item of data) {
					this.cityform[ `agencyFee${ item.type }` ] = item.agencyFee;
					this.cityform[ `cashDeposit${ item.type }` ] = item.cashDeposit;
					this.cityform[ `platformLicensing${ item.type }` ] = item.platformLicensing;
				}
			},
			// 获取数据
			getData (data) {
				this.tableData = data.result;
			},
			/////////////导入操作////////////////////
			requireFile () {
				// 开启导入dialog
				this.exportExcelConfig.visible = true;
			},
			closeExportDialog (val) {
				// 关闭导入dialog

				this.exportExcelConfig.visible = false;
				if (val == 0) {
					setTimeout(() => {
						this.$message("导入成功！");
					}, 1000);
					this.$refs.list.search();
				}
				else {
					this.$message("导入失败！");
				}
			},
			///////////////图片上传/////////////////
			handleUploadImg () {
			},
			//////////城市管理//////////////////
			cityManage () {
				this.cityDconfig.visible = true;
			},
			closeCityDialog () {
				// 关闭城市管理
				this.cityDconfig.visible = false;
			},
			updataCityManageVal () {
				for (let item of this.remCityManageVal) {
					item.agencyFee = Number(this.cityform[ `agencyFee${ item.type }` ]);
					item.cashDeposit = Number(this.cityform[ `cashDeposit${ item.type }` ]);
					item.platformLicensing = Number(
						this.cityform[ `platformLicensing${ item.type }` ]
					);
				}
			},
			checkCityManage () {
				if (this.cityform.agencyFeeA === "") {
					this.$message("请输入A类代理费");
					return false;
				}
				if (this.cityform.agencyFeeB === "") {
					this.$message("请输入B类代理费");
					return false;
				}
				if (this.cityform.agencyFeeC === "") {
					this.$message("请输入C类代理费");
					return false;
				}
				if (this.cityform.cashDepositA === "") {
					this.$message("请输入A保证金");
					return false;
				}
				if (this.cityform.cashDepositB === "") {
					this.$message("请输入B保证金");
					return false;
				}
				if (this.cityform.cashDepositC === "") {
					this.$message("请输入C保证金");
					return false;
				}
				if (this.cityform.platformLicensingA === "") {
					this.$message("请输入A平台使用费");
					return false;
				}
				if (this.cityform.platformLicensingB === "") {
					this.$message("请输入B平台使用费");
					return false;
				}
				if (this.cityform.platformLicensingC === "") {
					this.$message("请输入C平台使用费");
					return false;
				}

				if (!this.judgeInput(this.cityform.cashDepositA, "A保证金")) {
					return false;
				}
				if (!this.judgeInput(this.cityform.agencyFeeA, "A类代理费")) {
					return false;
				}
				if (!this.judgeInput(this.cityform.platformLicensingA, "A平台使用费")) {
					return false;
				}
				if (!this.judgeInput(this.cityform.cashDepositB, "B保证金")) {
					return false;
				}
				if (!this.judgeInput(this.cityform.agencyFeeB, "B类代理费")) {
					return false;
				}
				if (!this.judgeInput(this.cityform.platformLicensingB, "B平台使用费")) {
					return false;
				}

				if (!this.judgeInput(this.cityform.cashDepositC, "C保证金")) {
					return false;
				}

				if (!this.judgeInput(this.cityform.agencyFeeC, "C类代理费")) {
					return false;
				}
				if (!this.judgeInput(this.cityform.platformLicensingC, "C平台使用费")) {
					return false;
				}

				return true;
			},
			judgeInput (value, mesg) {
				const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

				if (!reg.test(value)) {
					this.$message(`${ mesg }必须是正数,可包含两位小数`);
					return false;
				}
				return true;
			},
			saveCityManage () {
				// 关闭城市管理
				let that = this;
				if (!this.checkCityManage()) {
					return;
				}

				this.cityDconfig.visible = false;
				this.updataCityManageVal();
				let list = JSON.stringify(this.remCityManageVal);
				this.$post("/data/my", {
					pathL: "/common/mold/updateCityMold",
					list
				})
					.then(res => {
						if (!res.state) {
							that.$message("保存成功！");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			cancelExcelConfig (val) {
				this.exportExcelConfig.visible = val;
			},
			/////////表格操作////////////
			exportList () {
				//导出
				let search = this.form;
				//delete search.pathL;
				let url = "/common/mold/exportExcelMoldCity";
				exportExcel(url, search);
			},
			sortByData (obj) {
				// 排序
				this.form.sortProperty = `${ obj.prop }`;
				if (obj.order == "ascending") {
					this.form.sortType = "ASC";
				}
				else {
					this.form.sortType = "DESC";
				}
				this.$refs.list.search();
			}
		}
	};
</script>
