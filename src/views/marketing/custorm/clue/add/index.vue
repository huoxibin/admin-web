<template>
  <el-main style="width: 600px;">
    <dk-form :form="form" :config="config" :rules="rules" :inline="false" labelWidth="120px"></dk-form>
    <el-form labelWidth="120px">
      <el-form-item label="所在城市">
        <base-local ref="stayCity" :form="formCity" :showCounty="false"></base-local>
      </el-form-item>
    </el-form>
    <el-form labelWidth="120px">
      <el-form-item label="申请城市">
        <base-local ref="reqCity" :form="formReqCity"></base-local>
      </el-form-item>
    </el-form>

    <dk-form :form="form" :config="config1" :rules="rules" :inline="false" labelWidth="120px"></dk-form>

    <div class="clear text-center" style="margin-left: 120px;">
      <el-button size="mini" @click="$router.back()">取消</el-button>
      <el-button type="primary" size="mini" @click="saveClue">保存</el-button>
    </div>
  </el-main>
</template>

<script>
	export default {
		data: () => ({
			/////三级联动测试//////
			formCity: {
				provinceId: "",
				cityId: ""
			},
			formReqCity: {
				provinceId: "",
				cityId: "",
				countyId: ""
			},

			showProvince: true,
			showCity: true,
			showCounty: false,
			//////////表格操作////////////////
			form: {
				clueNo: "", //编号
				companyName: "", //公司名称

				provinceId: "", //申请省
				cityId: "", //申请市
				countyId: "", //申请区

				province: "", // 所在省
				city: "", // 所在市

				contactNameOne: "", // 联系
				contactTelOne: "", // 区域
				contactNameTwo: "", // 联系
				contactTelTwo: "", // 区域
				contactNameThree: "", // 联系
				contactTelThree: "", // 区域
				customerType: null, //客户类型
				clueSource: null, //客户来源

				id: "",
				rest: "", // 其他来源
				remark: "" //备注
			},
			province: [], //省列表
			city: [], //市列表
			area: [], //区/县列表
			rules: {
				contactNameOne: [
					{required: true, message: "请输入联系人", trigger: "blur"}
				],
				contactTelOne: [
					{required: true, message: "请输入联系方式", trigger: "blur"}
				],
				clueSource: [ {required: true, message: "请输入来源", trigger: "blur"} ]
			},
			config: [
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "线索编号",
					value: "clueNo",
					hide: true,
					option: {
						disabled: true
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "公司名称",
					value: "companyName",
					option: {
						placeholder: "请输入公司名称",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "联系人1",
					value: "contactNameOne",
					option: {
						placeholder: "请输入联系人",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "联系方式1",
					value: "contactTelOne",
					option: {
						placeholder: "请输入联系方式",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "联系人2",
					value: "contactNameTwo",
					option: {
						placeholder: "请输入联系人",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "联系方式2",
					value: "contactTelTwo",
					option: {
						placeholder: "请输入联系方式",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "联系人3",
					value: "contactNameThree",
					option: {
						placeholder: "请输入联系人",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "联系方式3",
					value: "contactTelThree",
					option: {
						placeholder: "请输入联系方式",
						disabled: false
					}
				}
			],
			config1: [
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "select",
					label: "客户类型",
					value: "customerType",
					option: {
						placeholder: "请选择",
						disabled: false,
						data: [
							{
								label: "大客户",
								value: 1
							},
							{
								label: "合伙人",
								value: 2
							},
							{
								label: "经销商",
								value: 3
							}
						]
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "select",
					label: "来源",
					value: "clueSource",
					option: {
						placeholder: "请选择",
						disabled: false,
						data: [
							{
								label: "展会",
								value: 2
							},
							{
								label: "朋友介绍",
								value: 7
							},
							{
								label: "活动/会议",
								value: 8
							},
							{
								label: "自己开发",
								value: 9
							},
							{
								label: "其他",
								value: 10
							}
						]
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "其他",
					value: "rest",
					hide: true,
					option: {
						placeholder: "请输入其他来源",
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "textarea",
					label: "备注",
					value: "remark",
					option: {
						placeholder: "请输入备注",
						type: "textarea",
						disabled: false
					}
				}
			]
		}),
		watch: {
			"form.clueSource" () {
				if (this.form.clueSource === 10) {
					this.config1.map(item => {
						if (item.label === "其他") {
							//debugger
							item.hide = false;
						}
					});
				}
				else {
					this.config1.map(item => {
						if (item.label === "其他") {
							//debugger
							item.hide = true;
						}
					});
				}
			}
		},
		mounted () {
			//this.getProvinceList(); // 获取省份列表
			if (this.$route.query.tag === "edit") {
				this.getData();
				this.config[ 0 ].hide = false;
			}
		},
		methods: {
			// 获取数据
			getData () {
				let that = this;
				this.$get("/data/my", {
					pathL: "/marketing/clueInfo/query",
					id: this.$route.query.id
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
				this.form = data;
				if (!this.form.cityId) {
					this.form.cityId = "";
				}
				if (!this.form.provinceId) {
					this.form.provinceId = "";
				}
				if (!this.form.countyId) {
					this.form.countyId = "";
				}
				if (data.provinceId !== "") {
					this.formReqCity.provinceId = parseInt(data.provinceId);
				}
				if (data.cityId !== "") {
					this.formReqCity.cityId = parseInt(data.cityId);
				}
				if (data.countyId !== "") {
					this.formReqCity.countyId = parseInt(data.countyId);
				}
				if (data.proIdSz !== "") {
					this.formCity.provinceId = parseInt(data.proIdSz); //省名
				}
				if (data.cityIdSz !== "") {
					this.formCity.cityId = parseInt(data.cityIdSz); //市名
				}

				if (this.form.clueSource == 5) {
					// 400客服不支持修改
					this.config1[ 1 ].option.data.push({
						label: "400客服",
						value: 5,
					});

					this.config1[ 1 ].option.disabled = true;
				}
				else {
					this.config1[ 1 ].option.disabled = false;
				}

				if (this.form.customerType == 0) {
					this.form.customerType = '';
				}
				if (this.form.clueSource == 0) {
					this.form.clueSource = '';
				}

				this.$refs.reqCity.getCityList(this.formReqCity.provinceId);
				this.$refs.reqCity.getAreaList(this.formReqCity.cityId);

				this.$refs.stayCity.getCityList(this.formCity.provinceId);
				this.$refs.stayCity.getAreaList(this.formCity.cityId);
			},
			checkForm () {
				if (this.form.contactNameOne === "") {
					this.$message("请输入联系人1");
					return false;
				}
				if (this.form.contactTelOne === "") {
					this.$message("请输入联系方式1");
					return false;
				}
				if (this.form.clueSource === null || this.form.clueSource === "") {
					this.$message("请输入来源");
					return false;
				}
				return true;
			},
			saveClue () {
				if (!this.checkForm()) {
					return;
				}
				let url = "/marketing/clueInfo/add";
				let sh = this.form;
				let remForm = {
					companyName: sh.companyName, //公司名称
					provinceId: this.formReqCity.provinceId, //省名
					cityId: this.formReqCity.cityId, //市名
					countyId: this.formReqCity.countyId, //区名
					province: this.formCity.provinceId, // 所在省
					city: this.formCity.cityId, // 所在市
					contactNameOne: sh.contactNameOne, // 联系
					contactTelOne: sh.contactTelOne, // 区域
					contactNameTwo: sh.contactNameTwo, // 联系
					contactTelTwo: sh.contactTelTwo, // 区域
					contactNameThree: sh.contactNameThree, // 联系
					contactTelThree: sh.contactTelThree, // 区域
					customerType: sh.customerType == null ? 0 : sh.customerType, //客户类型
					clueSource: sh.clueSource, //客户来源
					id: sh.id,
					rest: sh.rest, // 其他来源
					remark: sh.remark //备注
				};

				if (this.$route.query.tag === "edit") {
					url = "/marketing/clueInfo/update";
				}
				else {
					delete remForm.id;
				}

				let that = this;
				this.$post("/data/my", {
					pathL: url,
					...remForm
				})
					.then(res => {
						if (!res.state) {
							that.$message("保存线索成功");
							setTimeout(function () {
								that.$router.back();
							}, 1000);
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
			///////////三级联动//////////
		}
	};
</script>

