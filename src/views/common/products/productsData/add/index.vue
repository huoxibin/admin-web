<template>
  <div>
    <el-main style="width: 600px;">
      <dk-form
        style="width: 500px;"
        :form="form"
        :config="config"
        :rules="rules"
        :inline="false"
        labelWidth="120px"
      ></dk-form>
      <el-form :inline="false" labelWidth="120px">
        <el-form-item label="商品说明">
          <base-editor v-model="form.goodsMemo"></base-editor>
        </el-form-item>
      </el-form>
      <div style="margin-left: 120px">
        <el-button size="mini" @click="$router.back();">取消</el-button>
        <el-button type="primary" @click="save" size="mini">保存</el-button>
      </div>
    </el-main>

    <!--//////////颜色弹窗//////////-->
    <additem ref="colorValue" :show.sync="colorConfig.show" @close="closeColorSel" @getData="getSelColor"></additem>
    <!--//////////型号弹窗//////////-->
    <additem ref="modelValue" :show.sync="modelConfig.show" @close="closeModelSel"
             @getData="getSelModel"></additem>

    <additem ref="specsValue" :show.sync="SpecsConfig.show" @close="closeSpecsSel" @getData="getSelSpecs"></additem>
  </div>
</template>

<script>
	import additem from "@/components/common/additem";
	import { isValidPrice } from "@/utils/RegExp";

	var validateRetailPrice = (rule, value, callback) => {
		if (!isValidPrice(value)) {
			callback(new Error("必须是正数"));
			return;
		}
	};
	export default {
		components: {additem},
		computed: {},
		data: () => ({
			editInfo: "",
			loading: false,
			form: {
				goodsName: "",
				goodsType: "",
				categray: [],
				barcode: "",
				goodsModel: "",
				goodsSpecs: "",
				goodsColor: "",
				goodsUnit: "",
				carton: "",
				tpgoodsCode: "",
				goodsSupplier: "",
				interfaceSign: "",
				selfSign: "",
				retailPrice: "",
				channelPrice: "",
				minPrice: "",
				costPrice: "",
				status: 0, //上下架是否开启 true :开启
				goodsClassifyI: "",
				goodsClassifyIi: "",
				goodsClassifyIii: ""
			},
			rules: {
				goodsName: [
					{required: true, message: "请输入商品名称", trigger: "blur"}
				],
				goodsType: [
					{required: true, message: "请选择商品类型", trigger: "blur"}
				],
				categray: [ {required: true, message: "请选择分类", trigger: "blur"} ],
				goodsModel: [ {required: true, message: "请选择型号", trigger: "blur"} ],
				goodsUnit: [ {required: true, message: "请选择单位", trigger: "blur"} ],
				//goodsSupplier: [{required: true, message: "请选择供应商", trigger: "blur"}],
				retailPrice: [
					{required: true, message: "请输入零售价", trigger: "blur"},
					{validator: validateRetailPrice, trigger: "blur"}
				],
				channelPrice: [
					{required: true, message: "请输入建议渠道价", trigger: "blur"},
					{validator: validateRetailPrice, trigger: "blur"}
				],
				minPrice: [
					{required: true, message: "请输入最低价", trigger: "blur"},
					{validator: validateRetailPrice, trigger: "blur"}
				],
				costPrice: [
					{required: true, message: "请输入参考成本价", trigger: "blur"},
					{validator: validateRetailPrice, trigger: "blur"}
				]
			},
			config: [
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "商品编号",
					value: "goodsNo",
					option: {
						disabled: true
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "商品名称",
					value: "goodsName",
					option: {
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "radio",
					label: "商品类型",
					value: "goodsType",
					option: {
						placeholder: "请输入商品类型",
						disabled: false,
						data: [
							{
								label: "实物商品",
								value: 2
							},
							{
								label: "原材料",
								value: 3
							},
							{
								label: "虚拟商品",
								value: 1
							}
						]
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "cascader",
					label: "商品分类",
					value: "categray",
					option: {
						placeholder: "请选择商品分类",
						disabled: false,
						cascader: {
							// 联动菜单数据控制
							data: [],
							changeOnSelect: true, // 是否可以选择任意一级
							filterable: true // 开启搜索
						}
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "条形码",
					value: "barcode",
					option: {
						placeholder: "请输入条形码",
						disabled: false
					}
				},
				{
					type: "select",
					label: "型号",
					value: "goodsModel",
					option: {
						placeholder: "请选择",
						disabled: false,
						data: [
							{
								dictId: "",
								label: "新增",
								value: "new"
							}
						]
					}
				},
				{
					type: "select",
					label: "规格",
					value: "goodsSpecs",
					option: {
						placeholder: "请选择",
						disabled: false,
						data: [
							{
								dictId: "",
								label: "新增",
								value: "new"
							}
						]
					}
				},
				{
					type: "select",
					label: "颜色",
					value: "goodsColor",
					option: {
						placeholder: "请选择",
						disabled: false,
						data: [
							{
								dictId: "",
								label: "新增",
								value: "new"
							}
						]
					}
				},
				{
					type: "select",
					label: "单位",
					value: "goodsUnit",
					option: {
						placeholder: "请选择",
						disabled: false,
						data: []
					}
				},

				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "装箱规格",
					value: "carton",
					option: {
						disabled: false
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "第三方商品编号",
					value: "tpgoodsCode",
					option: {
						disabled: false
					}
				},

				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "button",
					label: "供应商",
					value: "goodsSupplier",
					hide: true,
					option: {
						disabled: false,
						btnConfig: {
							label: "请选择供应商",
							btnCallBack: "selectSupplier"
						},
						type: "primary"
					}
				},
				{
					type: "radio",
					label: "接口标志",
					value: "interfaceSign",
					option: {
						disabled: false,
						data: [
							{
								label: "是",
								value: 1
							},
							{
								label: "否",
								value: 0
							}
						]
					}
				},
				{
					type: "radio",
					label: "自营标志",
					value: "selfSign",
					option: {
						disabled: false,
						data: [
							{
								label: "是",
								value: 1
							},
							{
								label: "否",
								value: 0
							}
						]
					}
				},
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "零售价(元)",
					value: "retailPrice",
					option: {
						placeholder: "请输入零售价",
						disabled: false
					}
				},
				{
					type: "input",
					label: "建议渠道价(元)",
					value: "channelPrice",
					option: {
						placeholder: "请输入建议渠道价",
						disabled: false
					}
				},
				{
					type: "input",
					label: "最低售价(元)",
					value: "minPrice",
					option: {
						placeholder: "请输入最低售价",
						disabled: false
					}
				},
				{
					type: "input",
					label: "参考成本价(元)",
					value: "costPrice",
					option: {
						placeholder: "请输入参考成本价",
						disabled: false
					}
				},
				{
					type: "radio",
					label: "商品状态",
					value: "status",
					option: {
						disabled: false,
						data: [
							{
								label: "上架",
								value: 1
							},
							{
								label: "下架",
								value: 0
							}
						]
					}
				}
			],
			/////////供应商弹窗配置////////////
			dialogConfig: {
				dialogVisible: false,
				width: "450px",
				title: "选择供应商"
			},
			/////////颜色弹窗////////
			colorConfig: {
				show: false
			},
			/////////型号弹窗////////
			modelConfig: {
				show: false
			},
			/////////规格弹窗////////
			SpecsConfig: {
				show: false
			},

			xflag: {
				dictId: "",
				sortInt: 0
			}, // 型号标识
			gflag: {
				dictId: "",
				sortInt: 0
			}, // 规格标识
			yflag: {
				dictId: "",
				sortInt: 0
			}, // 颜色标识
			dflag: {
				dictId: "",
				sortInt: 0
			} // 单位标识
		}),
		watch: {
			"form.goodsColor" () {
				if (this.form.goodsColor === "new") {
					this.colorConfig.show = true;
				}
			},
			"form.goodsModel" () {
				if (this.form.goodsModel === "new") {
					this.modelConfig.show = true;
				}
			},
			"form.goodsSpecs" () {
				if (this.form.goodsSpecs === "new") {
					this.SpecsConfig.show = true;
				}
			}
		},
		mounted () {
			this.getConfigForm("型号", "marketingGoodsModel");
			this.getConfigForm("规格", "marketingGoodsSpecs");
			this.getConfigForm("颜色", "marketingGoodsColor");
			this.getConfigForm("单位", "marketingGoodsUnit");
			///区分编辑和添加//
			if (this.$route.query.tag === "edit") {
				this.loading = true;
			}
			else if (this.$route.query.tag === "add") {
				this.loading = false;
			}
			this.getGoodsCategory(); // 查询分类
		},
		methods: {
			getNewItem (name, r) {
				// 可新增下拉列表
				let that = this;
				this.$get("/data/my", {
					pathL: "/ap/sysDictItem/getValueByName",
					dictName: name
				})
					.then(res => {
						if (!res.state && res.data.length) {
							let arr = that.dealData(res.data);

							arr.forEach(item => {
								r.data.unshift(item);
							});
							that.setDiffFlag(name, arr);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealData (data) {
				let arr = [];
				data.forEach(item => {
					let im = {
						value: item.itemValue,
						label: item.itemName,
						dictId: item.dictId
					};
					arr.push(im);
				});
				return arr;
			},
			getConfigForm (name, name1) {
				let that = this;
				this.config.forEach(item => {
					if (item.label === name) {
						if (item.label !== "单位") {
							// 不给单位加"新增功能"
							item.option.data = [
								{
									dictId: "",
									label: "新增",
									value: "new"
								}
							];
						}
						//console.log("ddd");
						that.getNewItem(name1, item.option);
					}
				});
			},
			setDiffFlag (name, data) {
				if (data[ 0 ]) {
					let dicId = data[ 0 ].dictId;
					let length = data.length + 1;
					switch (name) {
						case "marketingGoodsModel": {
							this.xflag.dictId = dicId;
							this.xflag.sortInt = length;
						}
							break;
						case "marketingGoodsSpecs": {
							this.gflag.dictId = dicId;
							this.gflag.sortInt = length;
						}
							break;
						case "marketingGoodsColor": {
							this.yflag.dictId = dicId;
							this.yflag.sortInt = length;
						}
							break;
					}
				}
				if (this.$route.query.tag === "edit") {
					// 编辑状态下
					this.getDetail(); //获取数据详情
				}
			},

			getGoodsCategory () {
				// 获取商品分类数据
				let that = this;
				this.$get("/data/my", {
					pathL: "/common/goodsClassify/query"
				})
					.then(res => {
						//console.log(res);
						if (!res.state) {
							for (let item of that.config) {
								//debugger
								if (item.label === "商品分类") {
									//item.option.cascader.data = res.data;
									for (let im of res.data) {
										let arr1 = {
											label: im.label,
											value: im.value,
											children: []
										};
										if (im.children) {
											for (let ime of im.children) {
												let arr2 = {
													label: ime.label,
													value: ime.value,
													children: []
												};
												if (ime.children) {
													for (let imer of ime.children) {
														let arr3 = {
															label: imer.label,
															value: imer.value
														};
														arr2.children.push(arr3);
													}
													arr1.children.push(arr2);
												}
											}
											item.option.cascader.data.push(arr1);
										}
									}
								}
							}
						}
					})
					.catch(err => {
						console.log(err);
					});
			},

			////////选择供应商///////////////////
			selectSupplier () {
				this.dialogConfig.dialogVisible = true;
				// dialogConfig
			},
			confirmSelSupplier () {
				// 确认供应商弹窗
				this.dialogConfig.dialogVisible = false;
			},
			cancelSelSupplier () {
				// 关闭供应商弹窗
				this.dialogConfig.dialogVisible = false;
			},
			getAddSelect () {
			},
			/////////////添加颜色/////////////////
			getSelColor: function (data) {
				//确认
				let that = this;
				this.colorConfig.show = false;
				let itemR = {
					label: data.name,
					value: data.name,
					dictId: this.yflag.dictId
				};
				this.$post("/data/my", {
					pathL: "/ap/sysDictItem/add",
					itemName: itemR.name,
					itemValue: itemR.value,
					dictId: this.yflag.dictId,
					sortInt: this.yflag.sortInt
				})
					.then(res => {
						if (!res.state) {
							that.$message("颜色新增成功！");
							for (let item of this.config) {
								if (item.label === "颜色") {
									item.option.data.unshift(itemR);
								}
							}
							that.form.goodsColor = data.name;
							that.$refs.colorValue.colorform.name = '';

							//that.getConfigForm("颜色", "marketingGoodsColor");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			closeColorSel () {
				this.colorConfig.show = false;
				this.$refs.colorValue.colorform.name = '';
				this.form.goodsColor='';
			},
			/////////////添加型号/////////////////
			getSelModel (data) {
				//确认
				let that = this;
				this.modelConfig.show = false;
				let itemR = {
					label: data.name,
					value: data.name,
					dictId: this.xflag.dictId
				};
				this.$post("/data/my", {
					pathL: "/ap/sysDictItem/add",
					itemName: itemR.name,
					itemValue: itemR.value,
					dictId: this.xflag.dictId,
					sortInt: this.xflag.sortInt
				})
					.then(res => {
						if (!res.state) {
							//debugger
							that.$message("型号新增成功！");
							for (let item of this.config) {
								if (item.label === "型号") {
									item.option.data.unshift(itemR);
								}
							}
							that.form.goodsModel = data.name;
							that.$refs.modelValue.colorform.name = '';
							//that.getConfigForm("型号", "marketingGoodsModel");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			closeModelSel () {
				this.modelConfig.show = false;
				this.$refs.modelValue.colorform.name = '';
				this.form.goodsModel = '';
			},
			////////////////规格//////////////////
			getSelSpecs (data) {
				//确认
				let that = this;
				this.SpecsConfig.show = false;
				let itemR = {
					label: data.name,
					value: data.name,
					dictId: this.gflag.dictId
				};
				this.$post("/data/my", {
					pathL: "/ap/sysDictItem/add",
					itemName: itemR.name,
					itemValue: itemR.value,
					dictId: this.gflag.dictId,
					sortInt: this.gflag.sortInt
				})
					.then(res => {
						if (!res.state) {
							that.$message("规格新增成功！");
							for (let item of this.config) {
								if (item.label === "规格") {
									item.option.data.unshift(itemR);
								}
							}
							that.form.goodsSpecs = data.name;
							that.$refs.specsValue.colorform.name = '';
							//that.getConfigForm("规格", "marketingGoodsSpecs");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			closeSpecsSel () {
				this.SpecsConfig.show = false;
				this.$refs.specsValue.colorform.name = '';
				this.form.goodsSpecs='';
			},
			/////////////商品获取详情////////////////
			getDetail () {
				// 获取数据详情
				let that = this;
				this.$get("/data/my", {
					pathL: "/common/pubGoods/query",
					id: this.$route.query.id
				})
					.then(res => {
						if (!res.state) {
							that.dealshowData(res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			dealshowData (data) {
				// if (data.status === 1) {
				//   data.status = true;
				// } else {
				//   data.status = false;
				// }
				this.form = data;
				this.form.categray = [
					data.goodsClassifyI,
					data.goodsClassifyIi,
					data.goodsClassifyIii
				];
			},
			///////////数据保存///////////////
			judgeData () {
				if (this.form.goodsName === "") {
					this.$message("请输入商品名称");
					return false;
				}
				if (this.form.goodsType === "") {
					this.$message("请输入商品类型");
					return false;
				}
				if (this.form.categray.length == 0) {
					this.$message("请输入商品分类");
					return false;
				}
				if (this.form.goodsModel === "") {
					this.$message("请输入商品型号");
					return false;
				}
				if (this.form.goodsUnit === "") {
					this.$message("请输入商品单位");
					return false;
				}
				if (this.form.retailPrice === "") {
					this.$message("请输入商品零售价");
					return false;
				}
				if (this.form.channelPrice === "") {
					this.$message("请输入商品渠道价");
					return false;
				}
				if (this.form.minPrice === "") {
					this.$message("请输入商品最低价");
					return false;
				}
				if (this.form.costPrice === "") {
					this.$message("请输入商品参考成本价");
					return false;
				}
				return true;
			},
			save () {
				let item = this.form.categray;
				let that = this;
				if (!this.judgeData()) {
					return;
				}

				//this.form.status = this.form.status == false ? 0 : 1;

				item.forEach((im, index) => {
					switch (index) {
						case 0: {
							this.form.goodsClassifyI = im;
						}
							break;
						case 1: {
							this.form.goodsClassifyIi = im;
						}
							break;
						case 2: {
							this.form.goodsClassifyIii = im;
						}
							break;
					}
				});
				let addForm = this.form;
				let url = "/common/pubGoods/add";
				delete addForm.categray;
				if (this.$route.query.tag === "edit") {
					url = "/common/pubGoods/update";
					delete addForm.createTime;
					delete addForm.updateTime;
				}
				else {
					delete addForm.id;
				}
				this.$post("/data/my", {
					pathL: url,
					...addForm
				})
					.then(res => {
						if (!res.status) {
							that.$message("保存成功！");
							that.$router.back();
						}
						else {
							that.$message("保存错误！");
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	};
</script>
