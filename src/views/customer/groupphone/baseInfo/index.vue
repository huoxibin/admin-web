<template>
  <el-container class="m-10" v-loading="loading" element-loading-text="拼命加载中">
    <el-aside width="200px" class="border ">
      <el-header class="header-page">
        话务分组管理
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
          <el-button size="mini" type="primary" @click="isAdd=true;newGroup()">新增分组</el-button>
        </div>
      </el-header>
      <el-main>
        <el-form size="mini" label-width="190px" class="w-500" ref="form" :rules="rules" :model="form">
          <el-form-item label="分组名称" prop="name">
            <el-input class="w-60" size="mini" type="text" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="绑定工单类型" prop="type">
            <el-row>
              <el-col :span="17">
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="分组图片" prop="image">
            <base-upload
              ref="upload"
              :tip="upload.tip"
              :rule="upload.rule"
              :limit="upload.limit"
              @notify="handleUploadImg"
            ></base-upload>
          </el-form-item>
          <el-form-item label="">
            <img style="width: 100%;" :src="form.image" alt>
          </el-form-item>
          <el-form-item label="绑定员工" prop="member">
            <el-row>
              <el-col :span="7">
                <el-button size="mini" type="primary" @click="dialogVisible = true">请绑定</el-button>
              </el-col>
            </el-row>
            <el-row class="m-t-10" v-for="(item,index) in memberList" :key="index">
              <el-col :span="8">
                {{ item.name }}
              </el-col>
              <el-col :span="16">
                <el-col :span="10">接听顺序</el-col>
                <el-col :span="14">
                  <el-select v-model="item.sortValue" class="d-i" @change="setSortdisable(item.sortValue)">
                    <el-option v-for="(itm,ind) in sortList" :label="itm.value"
                               :value="itm.value" :disabled="itm.disabled" :key="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="noSave" @click="saveForm" size="mini">保存</el-button>
            <el-button @click="" size="mini">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-dialog
      title="选择员工"
      class="ovh"
      :visible.sync="dialogVisible"
      append-to-body
      @open="openDialog"
      width="550px">
      <dk-form
        size="mini"
        :form="form"
        :config="formConfig"
        :inline="true"
        labelWidth="80px"
        slot="form"
        style="display: inline;"
      ><!-- 按钮 -->
      </dk-form>
      <el-form slot="btns" style="display: inline;" :inline="true" size="mini">
        <el-form-item label="">
          <el-button size="mini" type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <v-table
        :height="300"
        is-vertical-resize=""
        is-horizontal-resize
        style="width:100%"
        :multiple-sort="true"
        :min-height="350"
        even-bg-color="#f2f2f2"
        :select-all="selectALL"
        :select-change="selectChange"
        :columns="tableConfig.columns"
        :table-data="tableConfig.tableData"
        row-hover-color="#eee"
        row-click-color="#edf7ff"
      ></v-table>
      <!--<bindMember ref="bindMember" :id="form.id" @selectionData="getMemBerList"></bindMember>-->
      <div class="clear m-t-10 m-b-20">
        <div class="pull-right ">
          <el-button type="primary" @click="confirmSelection" size="mini">确定</el-button>
          <el-button @click="dialogVisible=false" size="mini">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
	let pageSizeNum = 10;
	let pageIndexNum = 1;
	/////////////////vue /////////////////////////////////
	var beCallNum = ''; //被呼叫号码
	export default {
		data () {
			return {
				upload: {
					limit: 1, //上传文件个数限制
					tip: "",
					type: "file",
					rule: {
						type: [ "image/jpg", "image/gif", "image/jpeg", "image/png" ],
						size: 100
					}
				},
				noSave: false,
				//弹窗数据配置
				pageNum: 1,
				pageSize: 100000,
				totalNum: 0,
				////////表格的内容配置////////
				formSearch: {
					userName: '', //医生姓名
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "医生名称",
						value: "userName",
						option: {
							placeholder: "请输入医生名称",
							disabled: false
						}
					}
				],
				//页面基本数据
				loading: false,
				memberList: [],
				multipSelection: [],
				sortList: [],
				options: [
					{
						label: '售后工单',
						value: 1
					},
					{
						label: '健康工单',
						value: 2
					},
					{
						label: '线索工单',
						value: 3
					},
				],
				form: {//分类
					id: '',//id
					name: '',//名称
					type: '', //类型
					image: '',//图片
				},
				rules: {
					name: [
						{required: true, message: '请输入分类名称', trigger: 'blur'},
					],
					type: [
						{required: true, message: '请选择绑定类型', trigger: 'blur'}
					],
					member: [
						{required: true, message: '请选择绑定员工', trigger: 'blur'}
					],
					image: [
						{required: true, message: '请上传分组图片', trigger: 'blur'}
					]
				},
				//其他配置
				defaultKeys: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				treeData: [],//左侧的树形菜单
				tableConfig: {
					multipleSort: false,
					tableData: [],
					columns: [
						{width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection'},
						{
							field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
							formatter: function (rowData, rowIndex, pagingIndex, field) {
								return (pageIndexNum - 1) * pageSizeNum + (rowIndex + 1);
							}
						},
						{
							field: 'userName',
							title: '员工名称',
							width: 80,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{
							field: 'departmentName',
							title: '所属部门',
							width: 150,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{field: 'roleName', title: '角色', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
					],
				},
				//弹窗
				dialogVisible: false,
				clearSelectAll: false,
			}
		},
		mounted () {
			this.getTreeData();
			//videoConfig();
		},
		methods: {

			handleUploadImg (url) {
				if (url.length) {
					this.form.image = url[ 0 ].url;
				}
			},
			getTableData (pn = 1) {
				pageIndexNum = pn;
				//重新获取当前页的数据
				this.loading = true;
				let that = this;
				this.$get("/data/my", {
					pathL: "/ap/sysUser/getUserListByTrafficChannelId",
					userName: this.formSearch.userName,
					trafficChannelId: this.form.id,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					that.loading = false;
					if (!res.state) {
						that.tableConfig.tableData = res.data.result;
						that.totalNum = res.data.total;
						that.judgeChecked();
					}
					else {
						that.$message("获取员工列表失败！");
					}
				});
			},
			judgeChecked (fg = false) {
				this.tableConfig.tableData.forEach((item, index) => {
					item._checked = false;
					if (item.checked == 1 && !fg) {
						item._checked = true;
					}
				})
			},
			search () {
				this.pageSizeChange(this.pageSize);
			},
			checkedNode (treeNode) { //树菜单的点击
				let that = this;
				this.form.id = String(treeNode.id);
				this.getTableData();
				this.$get('/data/my', {
					pathL: '/customer/trafficChannel/getTrafficChannelByTrafficChannelId',
					trafficChannelId: treeNode.id
				}).then(res => {
					if (res.state == 0) {
						that.form.image = res.data.trafficChannel.image;
						that.form.name = res.data.trafficChannel.groupName;
						that.form.type = res.data.trafficChannel.orderType;
						that.dealMemberList(res.data.user);
						that.$refs.form.clearValidate();
					}
				}).catch(err => {
					console.log(err);
				})
			},
			distinct (arr) { // 对数组去重
				let s = Array.from(new Set([ ...arr ]));
				return s;
			},
			dealMemberList (list) {
				let that = this;
				this.memberList = [];
				if (list != '') {
					list.map((item, index) => {
						const value = {
							id: item.id,
							name: item.userName,
							sortValue: item.trafficChannelOrder
						}
						that.$set(that.memberList, index, value);
					})
					this.calcSortListLength(that.memberList, true);
				}
			},
			calcSortListLength (data, fg = false) {
				this.sortList = [];
				let num = data.length;
				for (let i = 1; i <= num; i++) {
					this.$set(this.sortList, i - 1, {value: i, disabled: false})
				}
				//this.sortList = this.distinct(this.sortList);
			},
			dealTreeData (data) {
				let that = this;
				data.forEach(item => {
					const value = {
						label: item.groupName,
						type: item.orderType,
						id: item.id
					}
					that.treeData.push(value);
				});
			},
			setCheckedKeys (data) {//设置第一次加载的默认节点
				this.form.id = String(data.id);
				this.form.name = data.label;
				this.form.type = data.type;
				this.form.image = data.image;
				//设置默认节点状态
				this.defaultKeys = [];
				this.defaultKeys.push(data.id);
				//设置高亮显示
				this.$nextTick(function () {
					setTimeout(() => {
						this.$refs.tree.setCurrentKey(data.id);
						this.$refs.tree.store.nodesMap[ data.id ].expanded = true;
					})
				}, 500)
				this.checkedNode(this.form);// 重新获取数据
			},
			getTreeData () {//获取节点树数据
				let that = this;
				this.treeData = [];
				this.$get("/data/my", {
					pathL: "/customer/trafficChannel/getTrafficChannelList"
				}).then(res => {
					if (!res.state) {
						that.dealTreeData(res.data);
						that.setCheckedKeys(that.treeData[ 0 ]);
						that.loading = false;
					}
				}).catch(err => {
					console.log(err);
				})
			},
			pageSizeChange (pageSize) {
				//this.pageNum = 1;
				this.pageSize = pageSize;
			},
			pageChange (pageIndex) { //点击分页
				this.pageNum = pageIndex;
				pageIndexNum = pageIndex;
				this.getTableData(pageIndexNum);
			},
			selectALL (selection) { //选中所有的
				let that = this;
				if (selection.length) {
					that.clearSelectAll = false;
					selection.map((item, index) => {
						if (item.checked != 1) {
							let arr = {
								id: item.id,
								name: item.userName,
								sortValue: ''
							}
							that.multipSelection.push(arr);
						}
					})
				}
				else {
					this.clearSelectAll = true;
					this.multipSelection = [];
				}
			},
			selectChange (selection, rowData) {
				rowData._checked = !rowData._checked;
				if (rowData._checked && rowData.checked != 1) {
					let arr = {
						id: rowData.id,
						name: rowData.userName,
						sortValue: '',
					}
					this.multipSelection.push(arr);
				}
				else if (!rowData._checked) {
					this.multipSelection.forEach((item, index) => {
						if (item.id == rowData.id) {
							this.multipSelection.splice(index, 1);
						}
					})
					this.memberList.forEach((item, index) => {
						if (item.id == rowData.id) {
							this.memberList.splice(index, 1);
						}
					})
				}
				this.multipSelection = this.distinct(this.multipSelection);

			},
			openDialog () {
				let that = this;
				this.pageNum = 1;
			},
			confirmSelection () {
				let that = this;
				this.dialogVisible = false;
				if (this.clearSelectAll) {
					this.memberList = [];
				}

				this.multipSelection = this.distinct(this.multipSelection);
				if (this.memberList.length) {
					this.memberList.forEach(item => {
						that.multipSelection.forEach(itm => {
							if (item.id != itm.id) {
								that.memberList.push(itm);
							}
						})
					})
				}
				else {
					this.memberList = this.multipSelection;
				}
				this.memberList = this.distinct(this.memberList);
				this.calcSortListLength(this.memberList);

			},
			saveForm () {
				let that = this;
				let jsonArr = [];
				this.memberList.forEach(item => {
					let arr = {
						id: item.id,
						trafficChannelOrder: item.sortValue,
					}
					if (item.sortValue == '') {
						that.noSave = true;
						return;
					}
					jsonArr.push(arr);
				})
				if (this.noSave) {
					this.$message('请选择接听顺序！');
					return;
				}
				if (this.form.image == '') {
					this.$message('请上传分组图片');
					return;
				}
				this.$post('/data/my', {
					pathL: '/customer/trafficChannel/saveTrafficChannel',
					id: this.form.id,
					groupName: this.form.name,
					orderType: this.form.type,
					image: this.form.image,
					json: JSON.stringify(jsonArr)
				}).then(res => {
					if (res.state == 0) {
						that.$message('保存分组成功！');
						if (that.$store.getters.trafficChannel.groupName == that.form.name) {
							that.$store.getters.trafficChannel.orderType = that.form.type;
						}
						that.getTreeData();
						that.$refs.upload.$refs.upload.clearFiles();// 清空上传列表

					}
				}).catch(err => {
					console.log(err);
				})
			},
			setSortdisable (value) {
				for (let i of this.sortList.values()) {
					if (value == i.value) {
						i.disabled = true;
					}
				}
				let num = 0;
				for (let m of this.memberList.values()) {
					if (value == m.sortValue) {
						num++;
					}
				}
				if (num > 1) {
					this.noSave = true;
					this.$message('接听顺序不可重复');
				}
				else {
					this.noSave = false;
				}
			},
			newGroup () {
				this.$refs.form.resetFields();
				this.form.id = '';
				this.form.image = '';
				this.memberList = [];
				this.sortList = [];
				this.judgeChecked(true);
			}
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
