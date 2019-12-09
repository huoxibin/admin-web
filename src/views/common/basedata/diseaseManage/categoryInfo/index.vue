<template>
  <el-container class="m-10">
    <el-aside width="200px" class="border" v-loading="loadingTree" element-loading-text="树形菜单加载中">
      <el-header class="header-page">
        疾病分类
      </el-header>
      <el-tree
        :expand-on-click-node="false"
        :highlight-current="true"
        ref="tree"
        node-key="typeAndId"
        :data="treeData"
        :props="defaultProps"
        :default-expanded-keys="defaultShowKeys"
        :default-checked-keys="defaultKeys"
        current-node-key
        accordion
        @node-click="checkedNode"
      >
      </el-tree>
    </el-aside>
    <el-container class="border m-l-10">
      <el-header class="header-page">
        基本信息
        <div class="pull-right">
          <el-button size="mini" type="primary" @click="newCate">新增分类</el-button>
          <el-button size="mini" type="primary" @click="newDissease">新增疾病</el-button>
        </div>
      </el-header>
      <el-main v-loading="loadingForm" element-loading-text="内容加载中">
        <el-form label-width="100px" class="w-500" ref="form" :rules="rules" :model="form">
          <el-form-item :label="cateFg==true?'分类名称':'疾病名称'" prop="sopName">
            <el-input type="text" v-model="form.sopName"></el-input>
          </el-form-item>
          <el-form-item v-if="!cateFg && !isAdd" label="已关联科室" prop="connectSop">
            <template v-for="(item,index) in form.connectSop">
              <el-tag size="mini" class="span-block">{{item.departmentName}}</el-tag>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveForm" size="mini">保存</el-button>
            <el-button @click="resetForm" size="mini">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
	export default {
		data () {
			return {
				defaultShowKeys: [],//默认展开的id
				defaultKeys: [],//默认的值
				cateFg: true,//true：分类 false: 疾病
				form: {//分类
					id: '',//id
					parentName: '',//父级的name
					parentId: '', //父级id
					sopName: '',//分类名
					connectSop: []//关联科室
				},
				rules: {
					sopName: [
						{required: true, message: '请输入名称'}
					],
				},
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				setTreeId: null,//设置树的指定位置
				setTreeShowId: null,//设置展开的位置id
				isAdd: false,//默认是编辑状态
				treeData: [],
				loadingTree: true, //加载条Tree进度条
				loadingForm: false,//加载右侧的form
			}
		},
		mounted () {
			this.loadingTree = false;
			this.getTreeData();
		},
		methods: {
			setCheckedKeys (data) {//设置第一次加载的默认节点
				let that = this;
				if (!this.setTreeId) {
					this.cateFg = true;
					let treeData = data[ 0 ];
					if (treeData) {
						this.form.parentName=treeData.label;//所属分类名称
            this.form.parentId=treeData.id;//所属分类的id
						this.form.id = treeData.id;
						this.form.sopName = treeData.label;//疾病名称
						this.form.typeAndId = treeData.typeAndId;
						//设置默认展开的节点
						this.defaultShowKeys = [];
						this.defaultShowKeys.push(treeData.typeAndId);
						//设置默认节点状态
						this.defaultKeys = [];
						this.defaultKeys.push(treeData.typeAndId);
						//设置高亮显示
						this.$nextTick(function () {

							that.$refs.tree.setCurrentKey(treeData.typeAndId);
							that.$refs.tree.store.nodesMap[ treeData.typeAndId ].expanded = true;
						})
					}
				}
				else {
					//设置默认展开的节点
					this.defaultShowKeys = [];
					this.defaultShowKeys.push(this.setTreeShowId);
					//设置默认节点状态
					this.defaultKeys = [];
					this.defaultKeys.push(this.setTreeId);
					this.$nextTick(function () {
						that.$refs.tree.store.nodesMap[ that.setTreeShowId ].expanded = true;
						that.$refs.tree.setCurrentKey(that.setTreeId);
						that.$refs.tree.store.nodesMap[ that.setTreeId ].expanded = true;
					})
				}
			},
			getTreeData () { //获取节点树数据
				let that = this;
				this.loadingTree = true;
				this.$get("/data/my", {
					pathL: "/doctor/doctorSearchDiseaseCategory/getCategoryAndDiseaseTree"
				})
					.then(res => {
						if (!res.state) {
							that.treeData = [];
							that.loadingTree = false;
							that.dealDissTree(res.data);
							that.setCheckedKeys(that.treeData);
							if (that.treeData[ 0 ] && !that.cateFg) {
								that.getConSop(that.treeData[ 0 ].id);
							}
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			getConSop (id) {
				let that = this;
				this.$get('/data/my', {
					pathL: '/doctor/searchDiseaseDiseases/diseaseDepartment',
					diseaseId: id
				}).then(res => {
					if (!res.state) {
						that.loadingForm = false;
						that.form.connectSop = res.data;
					}
				}).catch(err => {
					console.log(err);
				})
			},
			dealDissTree (data) {
				let that = this;
				data.forEach((item, index) => { //获取一级树
					let it = {
						typeAndId: Number(item.typeAndId.replace("_", '')),//节点唯一的标识
						id: item.id,
						label: item.categoryName,
						children: []
					}
					if (item.diseases) {
						item.diseases.forEach((itm, val) => { //获取二级树
							const im = {
								typeAndId: Number(itm.typeAndId.replace("_", '')),//节点唯一标识
								id: itm.id,
								label: itm.disease,
								parentId: itm.categoryId,
								parentName: itm.category,
								parentTypeAndId: it.typeAndId
							}
							it.children.push(im);
						})
					}
					that.treeData.push(it);
				})
			},
			newCate () {
				this.cateFg = true; //一级状态
				this.isAdd = true;//新增状态
				this.resetForm();
			},
			newDissease () {
				this.cateFg = false;//二级状态
				this.isAdd = true;//新增状态
				this.resetForm();
			},
			resetForm () { //重置表单数据
				this.form.sopName = '';
				this.form.connectSop = '';//关联科室
				this.setTreeId = null; //清空选中的树节点
				this.setTreeShowId = null;//清空展开的树
			},
			saveForm () { //保存表单
				if (!this.form.sopName) {
					this.$message('请输入名称');
					return;
				}
				this.loadingForm = true;
				if (this.cateFg) {
					this.saveForCate();
				}
				else {
					this.saveDissease();
				}
			},
			saveForCate () { //保存分类
				let newId = '', that = this;
				if (!this.isAdd) {
					newId = this.form.id;
				}
				this.$post('/data/my', {
					pathL: '/doctor/doctorSearchDiseaseCategory/saveCategory',
					categoryName: this.form.sopName,//分类名称
					remark: '',//描述
					id: newId//新建不需要，编辑需要
				}).then(res => {
					that.loadingForm = false;
					if (res.state == 0) {
						that.$message("保存分类成功！");
						that.getTreeData();
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			saveDissease () { //保存疾病
				let newId = '', that = this;
				if (!this.isAdd) {
					newId = this.form.id;
				}
				this.$post('/data/my', {
					pathL: '/doctor/searchDiseaseDiseases/saveDisease',
					id: newId,
					category: this.form.parentName,//所属分类名称
					categoryId: this.form.parentId,//所属分类的id
					disease: this.form.sopName//疾病name
				}).then(res => {
					that.loadingForm = false;
					if (res.state == 0) {
						that.$message('保存疾病成功！');
						that.getTreeData();
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			checkedNode (data, node) { //选中节点
				this.resetForm();
				this.form.id = node.data.id;
				this.form.sopName = node.data.label;
				this.form.connectSop = '';//关联科室
				this.form.typeAndId = data.typeAndId;
				this.form.parentTypeAndId = data.parentTypeAndId;
				this.setTreeId = this.form.typeAndId;
				this.setTreeShowId = this.form.parentTypeAndId;

				if (data.children) { //父节点
					this.cateFg = true;
					this.form.parentId = node.data.id;//一级无父id
					this.form.parentName = node.data.label;//父级的name
					this.setTreeShowId = this.setTreeId;
				}
				else { //子节点
					this.cateFg = false;
					this.isAdd = false;//开启"关联科室"
					this.loadingForm = true;
					this.form.parentId = data.parentId;//一级无父id
					this.form.parentName = data.parentName;//父级的name

					this.getConSop(node.data.id); //疾病
				}


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
