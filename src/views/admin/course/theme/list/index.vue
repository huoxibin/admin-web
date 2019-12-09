<template>
  <el-container ref="content" class="m-10" style="height: 96%;" v-loading="loading" element-loading-text="拼命加载中">
    <el-aside width="300px" class="border ">
      <el-header class="header-page">
        课程系列主题
      </el-header>
      <el-tree
        :expand-on-click-node="false"
        :highlight-current="true"
        ref="tree"
        node-key="id"
        :data="treeData"
        :props="defaultProps"
        :default-checked-keys="defaultKeys"
        current-node-key
        @node-click="checkedNode"
      >
      </el-tree>
    </el-aside>
    <el-container class="border m-l-10">
      <el-header class="header-page">
        基本信息
        <div class="pull-right">
          <el-button size="mini" type="primary" @click="isAdd=true;newTheme()">新增主题</el-button>
        </div>
      </el-header>
      <el-main>
        <el-form label-width="150px" class="w-500" ref="form" :rules="rules" :model="form">
          <el-form-item label="主题名称" prop="themeName">
            <el-input class="w-60" size="mini" type="text" v-model="form.themeName"></el-input>
          </el-form-item>

          <el-form-item label="绑定点播课程" prop="courseList">
            <el-row>
              <el-col :span="17">
                <!--绑定课程修改-->
                <el-button size="mini" type="primary" @click="openDialog">绑定课程</el-button>
              </el-col>
            </el-row>

            <el-row v-for="(item,index) in selectArr" :key="index">
              <el-col :span="24">
                <!--绑定课程排序 修改-->
                <el-button size="mini" @click="isAdd=true">{{item.courseName}}</el-button>
                <el-button size="mini" type="text" icon="el-icon-bottom"
                           v-if="selectArr.length>1 && (index+1)!=selectArr.length"
                           @click="sortCourse(true,index)"></el-button>
                <el-button size="mini" type="text" icon="el-icon-top"
                           v-if="(index+1)==selectArr.length && selectArr.length>1"
                           @click="sortCourse(false,index)"></el-button>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item prop="sort" label="主题排序">
            <el-row>
              <el-col :span="24">
                <el-input style="width: 150px" v-model="form.sort" size="mini" type="text"
                          placeholder="请输入排序数字"></el-input>
                <el-link type="info" class="m-l-10" disabled> 数字越大越靠前</el-link>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item prop="themeImage" label="主题图片">
            <el-row>
              <el-col :span="24">
                <img :src="form.themeImage" alt class="img-90">

                <base-upload
                  ref="upload"
                  :tip="upload.tip"
                  :rule="upload.rule"
                  :limit="upload.limit"
                  @notify="handleUploadImg"
                ></base-upload>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="save" size="mini">保存</el-button>
            <el-button @click="$router.push({path:'/commodity/course/list'})" size="mini">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <!----绑定课程的弹窗---->
    <dk-dialog
      :baseConfig="dialog"
      :dialogShow.sync="dialog.visible"
      @confirmCallback="confirm"
      @cancelCallback="cancel"
      @closeDialog="cancel"
      ref="dialog"
    >
      <!-- 表单 -->
      <dk-form
        size="mini"
        :form="courseform"
        :config="courseformConfig"
        :inline="true"
        labelWidth="80px"
        slot="form"
        style="display: inline;"
      ><!-- 按钮 -->
      </dk-form>
      <el-form slot="btns" style="display: inline;" :inline="true" size="mini">
        <el-form-item label="">
          <el-button size="mini" type="primary" @click="search();">搜索</el-button>
        </el-form-item>
      </el-form>

      <dk-table
        ref="multipleTable"
        slot="table"
        border
        stripe
        :data="tableData"
        defaultFieldName="id"
        :config="config"
        index
        :pageNum="recordPage.pageNum"
        :pageSize="recordPage.pageSize"
        selection
        @selectionChange="handleSelectionChange"
        style="max-height: 300px"
      >
      </dk-table>
      <!--<dk-page slot="page" @currentChange="changePage" :pageConfig="recordPage"></dk-page>-->

    </dk-dialog>
  </el-container>
</template>

<script>
	import { isValidNumber } from '@/utils/RegExp';

	export default {
		data () {
			var checkSort = (rule, value, callback) => {
				if (!isValidNumber(value)) {
					this.$message('输入主题排序数字之能为正整数！');
				}
				else {
					callback();
				}
			};
			return {
				prevSelrow: [],
				currSelrow: [],
				isNewadd: false,
				upload: {
					limit: 1, //上传文件个数限制
					tip: "",
					type: "file",
					rule: {
						type: [ "image/jpg", "image/gif", "image/jpeg", "image/png" ],
						size: 100
					}
				},
				defaultCognate: [],//默认的疾病关联tree 设置
				defaultShowKeys: [],//默认展开的id
				defaultKeys: [],//默认初始key
				form: {//分类
					id: '',
					courseList: [],
					themeName: '',
					sort: null,
					themeImage: '',
				},
				rules: {
					themeName: [
						{required: true, message: '请输入主题名称'},
						{min: 1, max: 20, message: '主题名称是1~20个字', trigger: "blur"}
					],
					themeImage: [
						{required: true, message: '请上传主题图片'}
					],
					sort: [
						{required: true, message: '请输入排序数字'},
						{validator: checkSort, trigger: 'blur'},
					],
					courseList: [
						{type: 'array', required: true, message: '请选择绑定的点播课程', trigger: 'change'},
					]
				},
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				treeData: [],//左侧的树形菜单
				selectArr: [],//绑定课程选中项
				remTableArr: [],//绑定课程临时选项
				loading: true, //加载条进度条
				dialog: {
					visible: false,
					width: "700px",
					title: "绑定课程"
				},
				courseform: {
					name: null
				},
				recordPage: {
					pageNum: 1,
					pageSize: 10,
					total: 0
				},
				courseformConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "课程名称",
						value: "name",
						option: {
							placeholder: "请输入课程名称",
							disabled: false
						}
					}
				],
				tableData: [],
				config: [
					//相关的表格的配置
					{
						type: "button",
						label: "课程名称",
						value: "name"
					},
					{
						type: "",
						label: "课程讲师",
						value: "lecturer"
					},
					{
						type: "",
						label: "操作人",
						value: "creater"
					},
				]
			}
		},
		mounted () {
			this.getTreeData(); // 获取左侧课程主题列表
			this.searchBindCourse();// 获取绑定课程列表
		},
		methods: {
			handleUploadImg (url) {
				if (url.length) {
					this.form.themeImage = '';
					this.form.themeImage = url[ 0 ].url;
				}
			},
			search () {
				this.recordPage.pageNum = 1;
				this.searchBindCourse(true);
			},
			searchBindCourse (fg = false) {
				// 获取绑定课程列表
				let that = this;
				this.$get('/data/my', {
					pathL: '/doctor/course/getCourseList',
					pageNum: this.recordPage.pageNum,
					//pageSize: this.recordPage.pageSize,
					pageSize: 999999,
					courseName: this.courseform.name == '' ? null : this.courseform.name,
					status: 1,//显示课程
				}).then(res => {
					if (res.state == 0) {
						that.tableData = res.data.result;
						that.recordPage.total = res.data.total;
						if (fg) {
							that.siteMuiltSelect(that.selectArr);
						}
					}
				}).catch(err => {
					console.log(err);
				})
			},
			setCheckedKeys (data) {
				//设置第一次加载的默认节点
				let that = this;
				let treeData = data[ 0 ];
				if (treeData) {
					this.form.id = treeData.id;
					this.form.themeName = treeData.label;
					this.form.themeImage = treeData.themeImage;
					this.form.sort = treeData.sort;
					this.form.courseList = treeData.courseList;
					this.dealSelectArr(this.form.courseList);
					//设置默认节点状态
					this.defaultKeys = [];
					this.defaultKeys.push(treeData.id);
					//设置高亮显示
					this.$nextTick(function () {
						this.$refs.tree.setCurrentKey(treeData.id);
						this.$refs.tree.store.nodesMap[ treeData.id ].expanded = true;
					})
				}
			},
			save () { //保存主题
				let that = this;
				this.$refs.form.validate((valid) => {
					if (valid) {
						let idArr = '';
						this.selectArr.forEach(item => {
							idArr += item.id + ',';
						});
						this.$post('/data/my', {
							pathL: '/doctor/courseThemeInfo/addOrEditTheme',
							themeName: this.form.themeName,
							sort: this.form.sort,
							connectionCourseIds: idArr.substr(0, idArr.length - 1),//排序的id
							id: this.form.id,
							themeImage: this.form.themeImage
						}).then(res => {
							if (res.state == 0) {
								that.$message("保存成功");
								that.selectArr = [];
								that.getTreeData();

								that.$refs.upload.$refs.upload.clearFiles();// 清空上传列表

							}
							else {
								that.$message(res.msg);
							}
						}).catch(err => {
							that.$message(err)
						})
					}
					else {
						that.$message("请正确填写表单！");
					}
				})


			},
			getTreeData () {//获取节点树数据
				let that = this;
				this.$get("/data/my", {
					pathL: "/doctor/courseThemeInfo/themeList"
				}).then(res => {
					if (res.state == 0) {
						that.dealTreeData(res.data);
						that.setCheckedKeys(that.treeData);
						that.loading = false;
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			dealTreeData (data) { //重新赋值
				let that = this;
				this.treeData = [];
				data.forEach((item, index) => { //获取一级树
					let it = {
						id: item.id,
						label: item.themeName,
						sort: item.sort,
						themeImage: item.themeImage,
						courseList: item.courseList
					}
					that.treeData.push(it);
				})
			},
			resetForm () {
				//判断不同的类型进行数据提交
				this.form.id = '';
				this.form.courseList = [];
				this.selectArr = [];
				this.form.themeName = '';
				this.form.sort = '';
				this.form.themeImage = '';

			},
			newTheme () {
				//新增主题
				this.$refs.form.clearValidate();
				this.isNewadd = true;
				this.resetForm();
			},
			checkedNode (data, node) { //选中节点
				this.resetForm();
				this.isNewadd = false;
				this.selectArr = [];
				this.remTableArr = [];
				this.form.id = data.id;
				this.form.courseList = data.courseList;
				this.form.themeName = data.label;
				this.form.themeImage = data.themeImage;
				this.form.sort = data.sort;
				this.dealSelectArr(this.form.courseList);
				this.$refs.form.clearValidate();
			},
			unique5 (arr) { //去重
				var result = [];
				var obj = {};
				for (var i = 0; i < arr.length; i++) {
					if (!obj[ arr[ i ].id ]) {
						result.push(arr[ i ]);
						obj[ arr[ i ].id ] = true;
					}
				}
				return result;
			},
			dealSelectArr (obj) {
				let that = this;
				obj.forEach(item => {
					if (item !== undefined) {
						that.selectArr.push({
							id: item.id,
							courseName: item.courseName || item.name
						});
					}
				})
				this.selectArr = this.unique5(this.selectArr);
				this.form.courseList = this.selectArr;

			},
			confirm () {
				this.selectArr = [];
				this.dealSelectArr(this.remTableArr);
				this.resiteRemVal();
			},
			cancel () {
				this.resiteRemVal();
				this.remTableArr = [];//清空记录的选项

			},
			resiteRemVal () {
				this.dialog.visible = false;
				this.courseform.name = '';
				this.$refs.multipleTable.$refs.table.clearSelection();//清空表格选中的项
			},
			handleSelectionChange (val) {
				////debugger
				this.remTableArr = [];
				val.forEach(item => {
					if (item != undefined) {
						this.remTableArr.push(item);
						this.$refs.multipleTable.$refs.table.toggleRowSelection(item, true);
					}
				})
				if (!this.isNewadd) {
					this.remTableArr = this.unique5(this.remTableArr);
					//this.siteMuiltSelect(this.remTableArr);
				}
			},
			changePage (page) { //分页点击事件
				this.recordPage.pageNum = page;
				this.searchBindCourse(true);
			},
			openDialog () {
				this.dialog.visible = true;
				this.recordPage.pageNum = 1;
				if (this.isNewadd) {
					this.selectArr = [];
				}
				this.searchBindCourse(true);
			},
			siteMuiltSelect (slectRow) {
				let that = this;
				if (slectRow && slectRow.length > 0) {
					slectRow.forEach(row => {
						that.$nextTick(() => {
							let arr = that.tableData.filter(item => item.id == row.id);
							that.$refs.multipleTable.$refs.table.toggleRowSelection(arr[ 0 ], true);
						})
					});
				}
				else {
					that.$refs.multipleTable.$refs.table.clearSelection();
				}
			},
			sortCourse (fg, index) {
				//排序课程, 默认倒序
				let a = null;
				let selctArrCopy = this.selectArr;
				this.selectArr = [];
				if (fg) { //倒序 ,change number
					a = selctArrCopy[ index ];
					selctArrCopy[ index ] = selctArrCopy[ index + 1 ];
					selctArrCopy[ index + 1 ] = a;
				}
				else { // 升序
					a = selctArrCopy[ index - 1 ];
					selctArrCopy[ index - 1 ] = selctArrCopy[ index ];
					selctArrCopy[ index ] = a;
				}
				this.selectArr = selctArrCopy;
			},
		}
	}
</script>

<style scoped>
  .w-500 {
    width: 500px
  }

  .span-block {
    background: #fff;
    border: 0;
  }
</style>
