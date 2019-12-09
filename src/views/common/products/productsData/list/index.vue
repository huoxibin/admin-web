<template>
  <div class="health comment">
    <base-layout :form="form" ref="list" @getData="getData" methods="get">
      <!-- 表单 -->
      <dk-form :config="formConfig" :form="form" :inline="true" labelWidth="120px" slot="form"></dk-form>
      <!-- 按钮 -->
      <div class="pull-right" slot="btns">
        <a
          style="margin-left:10px;"
          class="el-button pull-right el-button--primary el-button--mini"
          :href="exportJd.exportUrl"
          :download="exportJd.exportTxt"
        >金蝶导入模板</a>
        <el-button @click="requireJdFile" class="pull-right" size="mini" type="primary">金蝶导入</el-button>

        <a
          style="margin-left:10px;"
          class="el-button pull-right el-button--primary el-button--mini"
          :href="exportExcelConfig.exportUrl"
          :download="exportExcelConfig.exportTxt"
        >导入模板</a>
        <el-button @click="exportList" class="pull-right" size="mini" type="primary">导出</el-button>
        <el-button @click="requireFile" class="pull-right" size="mini" type="primary">导入</el-button>
        <el-button @click="addRecord" class="pull-right" size="mini" type="primary">新增</el-button>
      </div>
      <!--表格-->
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        operating
        :operatingWidth="300"
        index
        :pageNum="1"
        :pageSize="1"
        @sortChange="sortByData"
        @switch="switchClick"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button @click="rowDetail(scope.row)" size="mini">查看</el-button>
          <el-button @click="editDetail(scope.row)" size="mini" type="primary">编辑</el-button>
          <el-button @click="editPic(scope.row)" size="mini" type="primary">编辑图片</el-button>
        </template>
      </dk-table>
    </base-layout>
    <!--上传图片-->
    <dk-dialog
      refs="dkupload"
      :baseConfig="dialogConfig"
      :dialogShow.sync="dialogConfig.dialogVisible"
      @confirmCallback="importFileConfirm"
      @cancelCallback="importFileCancel"
      @closeDialog="importFileCancel"
    >
      <el-form :inline="false" :model="uploadImgForm" label-width="100px" size="mini" slot="form">
        <el-form-item label="图片">
          <img :src="uploadImgForm.pic" alt style="width: 90px">
        </el-form-item>
        <el-form-item label="新图片">
          <sys-upload @getUploadInfo="getUploadInfo" :fileList="uploadImgForm.fileList"
                      :uploadConfig="uploadImgForm.uploadImgConfig"></sys-upload>
        </el-form-item>
      </el-form>
    </dk-dialog>
    <!--      金蝶导入弹窗-->
    <dkexportExcel
      @closeDialog="closeExportjd"
      :dialogShow="exportJd.visible"
      :exportExcelConfig="exportJd"
      @cancelExcelConfig="cancelExceljd"
    ></dkexportExcel>

    <!--      导入弹窗-->
    <dkexportExcel
      @closeDialog="closeExportDialog"
      :dialogShow="exportExcelConfig.visible"
      :exportExcelConfig="exportExcelConfig"
      @cancelExcelConfig="cancelExcelConfig"
    ></dkexportExcel>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";
	import dkexportExcel from "@/components/common/importExcel";
	import dkupload from "@/components/common/upload";

	export default {
		components: {dkexportExcel, dkupload},
		data: () => ({
			form: {
				pathL: "/common/pubGoods/queryPage",
				goodsNo: "",
				goodsName: "",
				goodsModel: "",
				opcode: "",
				tpgoodsCode: "",
				status: "",
				barcode: "",
				categray: [],
				goodsClassifyI: "",
				goodsClassifyIi: "",
				goodsClassifyIii: "",
				goodsType: "",
				field: "",
				sort: ""
			},
			fileList: [],
			formConfig: [
				// 搜索条件相关配置
				{
					type: "input",
					label: "商品编号",
					value: "goodsNo",
					option: {
						placeholder: "请输入商品编号",
						disabled: false
					}
				},
				{
					type: "input",
					label: "商品名称",
					value: "goodsName",
					option: {
						placeholder: "请输入商品名称",
						disabled: false
					}
				},
				{
					type: "input",
					label: "商品型号",
					value: "goodsModel",
					option: {
						placeholder: "请输入商品型号",
						disabled: false
					}
				},
				{
					type: "input",
					label: "助记码",
					value: "opcode",
					option: {
						placeholder: "请输入助记码",
						disabled: false
					}
				},
				{
					type: "input",
					label: "第三方产品编码",
					value: "tpgoodsCode",
					option: {
						placeholder: "请输入第三方产品编码",
						disabled: false
					}
				},
				{
					type: "select",
					label: "商品状态",
					value: "status",
					option: {
						placeholder: "请输入商品状态",
						disabled: false,
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: "1",
								label: "已上架"
							},
							{
								value: "0",
								label: "已下架"
							}
						]
					}
				},
				{
					type: "input",
					label: "条形码",
					value: "barcode",
					option: {
						placeholder: "请输入条形码",
						disabled: false
					}
				},

				{
					type: "cascader",
					label: "商品分类",
					value: "categray",
					option: {
						placeholder: "请输入商品分类",
						disabled: false,
						cascader: {
							// 联动菜单数据控制
							data: [
								{
									value: "",
									label: "全部"
								}
							],
							changeOnSelect: true, // 是否可以选择任意一级
							filterable: true // 开启搜索
						}
					}
				},

				{
					type: "select",
					label: "商品类型",
					value: "goodsType",
					option: {
						placeholder: "请输入商品类型",
						disabled: false,
						data: [
							{
								value: "",
								label: "全部"
							},
							{
								value: "3",
								label: "原材料商品"
							},
							{
								value: "2",
								label: "实物商品"
							},
							{
								value: "1",
								label: "虚拟商品"
							}
						]
					}
				}
			],
			tableConfig: [
				//相关的表格的配置
				{
					type: "",
					label: "商品编号",
					value: "goods_no",
					sort: true
				},
				{
					type: "",
					label: "商品名称",
					value: "goods_name",
					sort: true
				},
				{
					type: "",
					label: "助记码",
					value: "opcode",
					sort: true
				},
				{
					type: "",
					label: "商品类型",
					value: "goods_type"
				},
				{
					type: "",
					label: "商品分类",
					value: "goods_classify"
				},
				{
					type: "image",
					label: "商品图片",
					value: "image"
				},
				{
					type: "",
					label: "条形码",
					value: "barcode"
				},
				{
					type: "",
					label: "型号",
					value: "goods_model"
				},
				{
					type: "",
					label: "规格",
					value: "goods_specs",
					sort: true
				},
				{
					type: "",
					label: "颜色",
					value: "goods_color",
					sort: true
				},
				{
					type: "",
					label: "单位",
					value: "goods_unit",
					sort: true
				},
				// {
				//   type: "",
				//   label: "说明",
				//   value: "goods_memo",
				//   sort: true,
				//   tooltip: true,
				//   width: 70
				// },
				{
					type: "",
					label: "供应商",
					value: "goods_supplier"
				},
				{
					type: "",
					label: "装箱规格",
					value: "carton",
					sort: true
				},
				{
					type: "",
					label: "第三方产品编号",
					value: "tpgoods_code",
					sort: true,
					tooltip: true
				},
				{
					type: "",
					label: "参考成本（元）",
					value: "cost_price",
					sort: true
				},
				{
					type: "",
					label: "参考渠道价（元）",
					value: "channel_price",
					sort: true
				},
				{
					type: "",
					label: "建议零售价（元)",
					value: "retail_price",
					sort: true
				},
				{
					type: "",
					label: "最低售价（元)",
					value: "min_price",
					sort: true
				},
				{
					type: "switch",
					label: "商品上下架",
					value: "status",
					sort: true
				}
			],
			tableData: [],
			/////////弹窗配置////////////
			dialogConfig: {
				dialogVisible: false,
				width: "450px",
				title: "编辑图片"
			},
			//////////导出并导入文件//////////////
			exportJd: {
				exportUrl:
					"https://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/excel%E6%A8%A1%E6%9D%BF/%E9%87%91%E8%9D%B6%E5%95%86%E5%93%81-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88-0.01.xlsx",
				exportTxt: "金蝶商品导出模板.xlsx",
				visible: false,
				uploadUrl: "/common/pubGoods/importKingdeeExcel"
			},

			exportExcelConfig: {
				exportUrl:
					"http://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/excel%E6%A8%A1%E6%9D%BF/%E5%95%86%E5%93%81%E8%A1%A8-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88-0.01.xlsx",
				exportTxt: "商品导出模板.xlsx",
				visible: false,
				uploadUrl: "/common/pubGoods/importExcel"
			},
			///上传图片配置/////////
			uploadImgForm: {
				fileList: [],
				pic: "",
				uploadImgConfig: {
					uploadUrl: "/common/pubGoods/uploadFile",
					limit: 1, //上传文件个数限制
					tip: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png的文件！",
					rule: {
						type: [ "image/jpg", "image/gif", "image/jpeg", "image/png" ],
						size: 100
					}
				}
			}
		}),
		watch: {
			"form.categray" () {
				let itm = this.form.categray;
				if (itm) {
					this.form.goodsClassifyI = itm[ 0 ] || "";
					this.form.goodsClassifyIi = itm[ 1 ] || "";
					this.form.goodsClassifyIii = itm[ 2 ] || "";
				}
			}
		},
		mounted () {
			this.getGoodsCategory(); // 查询分类
		},
		methods: {
			getGoodsCategory () {
				let that = this;
				this.$get("/data/my", {
					pathL: "/common/goodsClassify/query"
				})
					.then(res => {
						//console.log(res);
						if (!res.state) {
							that.formConfig.forEach(item => {
								if (item.label === "商品分类") {
									res.data.forEach(im => {
										let arr1 = {
											label: im.label,
											value: im.value,
											children: []
										};
										for (let ime in im.children) {
											/// 二级
											let arr2 = {
												label: im.children[ ime ].label,
												value: im.children[ ime ].value,
												children: []
											};
											for (let imer in im.children[ ime ].children) {
												let arr3 = {
													label: im.children[ ime ].children[ imer ].label,
													value: im.children[ ime ].children[ imer ].value
												};
												arr2.children.push(arr3);
											}
											arr1.children.push(arr2);
										}
										item.option.cascader.data.push(arr1);
									});
								}
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 获取数据
			getData (data) {
				data = data.result.list;
				data.forEach(item => {
					switch (item.goods_type) {
						case 1: {
							item.goods_type = "虚拟商品";
						}
							break;
						case 2: {
							item.goods_type = "实物商品";
						}
							break;
						case 3: {
							item.goods_type = "原材料商品";
						}
							break;
					}
					if (item.status) {
						item.status = true;
					}
					else {
						item.status = false;
					}
					item.goods_classify = `${ item.goods_classify_I_name }-${
						item.goods_classify_II_name
						}-${ item.goods_classify_III_name }`;
				});
				this.tableData = data;
				this.dealTableListShow(this.tableData);
			},
			dealTableListShow (data) {
				// 处理页面显示的 "--"
				for (let item of data) {
					for (let it in item) {
						if (item[ it ] === "" || item[ it ] === null) {
							item[ it ] = "-";
						}
					}
				}
			},
			importFile () {
				// 导入
				this.dialogConfig.dialogVisible = true;
			},
			addRecord () {
				this.$router.push({
					path: "/products/productsData/add"
				});
			},
			rowDetail (row) {
				this.$router.push({
					path: "/products/productsData/detail",
					query: {id: row.id}
				});
			},
			editDetail (row) {
				this.$router.push({
					path: "/products/productsData/add",
					query: {tag: "edit", id: row.id}
				});
			},
			editPic (row) {
				// 编辑图片
				this.dialogConfig.dialogVisible = true;
				this.uploadImgForm.pic = row.image;
				this.uploadImgForm.id = row.id;
			},
			exportList () {
				// 导出查询出的结果
				let search = JSON.parse(JSON.stringify(this.form));
				delete search.pathL;
				let url = "/common/pubGoods/exportExcel";
				exportExcel(url, search);
			},
			requireJdFile(){
				// 开启金蝶导入dialog
				this.exportJd.visible = true;
			},

			closeExportjd (val) {
				// 金蝶导入

				this.exportJd.visible = false;
				if (!val) {
					this.$message("导入成功！");
					setTimeout(() => {
						this.$refs.list.search();
					}, 1000);
				}else{
					this.$message("导入失败！");
        }
			},
			cancelExceljd (val) {
				this.exportJd.visible = false;
			},
      /////////

			requireFile () {
				// 开启导入dialog
				this.exportExcelConfig.visible = true;
			},
			closeExportDialog (val) {
				this.exportExcelConfig.visible = false;
				if (!val) {
					this.$message("导入成功！");
					setTimeout(() => {
						this.$refs.list.search();
					}, 1000);
				}else{
					this.$message("导入失败！");
				}
			},
			cancelExcelConfig (val) {
				this.exportExcelConfig.visible = false;
			},
			//////////弹窗内容//////////
			importFileConfirm () {
				let that = this;
				this.dialogConfig.dialogVisible = false;
				this.uploadImgForm.fileList = [];
				this.$post("/data/my", {
					pathL: "/common/pubGoods/saveFile",
					id: this.uploadImgForm.id,
					url: this.uploadImgForm.pic
				})
					.then(res => {
						if (!res.state) {
							that.$message("编辑图片成功！");
							setTimeout(() => {
								that.$refs.list.getData(false);
							}, 1000);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			importFileCancel () {
				this.dialogConfig.dialogVisible = false;
			},
			sortByData (obj) {
				// 排序
				this.form.field = `${ obj.prop }`;
				if (obj.order === "ascending") {
					this.form.sort = "ASC";
				}
				else {
					this.form.sort = "DESC";
				}
				this.$refs.list.search();
			},
			getUploadInfo (val, fileList) {
				// 获取请求的信息
				this.uploadImgForm.pic = val.data.url;
				//this.uploadImgForm.fileList = fileList;
			},
			cancelExcelConfig (val) {
				this.exportExcelConfig.visible = val;
			},
			switchClick (row) {
				row.status = !row.status;
				let that = this;
				this.$post("/data/my", {
					pathL: "/common/pubGoods/update",
					status: row.status ? 0 : 1,
					id: row.id
				})
					.then(res => {
						if (!res.state) {
							that.$refs.list.search();
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	};
</script>
<style>
  .el-tooltip__popper {
    max-width: 300px;
    line-height: 180%;
  }
</style>
