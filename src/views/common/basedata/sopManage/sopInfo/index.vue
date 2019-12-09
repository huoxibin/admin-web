<template>
  <el-container class="m-10" v-loading="loading" element-loading-text="拼命加载中">
    <el-aside width="200px" class="border ">
      <el-header class="header-page">
        科室分类
      </el-header>
      <el-tree
        :expand-on-click-node="false"
        :highlight-current="true"
        ref="tree"
        node-key="typeAndId"
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
          <el-button size="mini" type="primary" @click="isAdd=true;newCate()">新增科室</el-button>
          <el-button size="mini" :disabled="!cateFg" type="primary" @click="isAdd=true;newDissease()">新增子科室</el-button>
        </div>
      </el-header>
      <el-main>
        <el-form label-width="190px" class="w-500" ref="form" :rules="rules" :model="form">
          <el-form-item :label="cateFg==true?'一级科室':'二级科室'" prop="sopName">
            <el-input class="w-60" size="mini" type="text" v-model="form.sopName"></el-input>
          </el-form-item>
          <el-form-item v-if="showCont" label="关联疾病">
            <el-row>
              <el-col :span="24">
                <template v-for="(item,index) in form.dissease">
                  <el-tag size="mini" class="span-block">{{item.name}}</el-tag>
                </template>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="space-content">
                <el-button size="mini" type="primary" @click="getCognateTree">关联</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="科室大图" prop="bigPic">
            <el-row>
              <el-col :span="7">
                <img :src="form.bigPic" class="img-90"/>
              </el-col>
              <el-col :span="17">
                <!--科室图片修改-->
                <base-upload
                  :fileList="bigFileList"
                  :rule="imgUpload.rule"
                  :limit="imgUpload.limit"
                  @notify="handleBigUpload"
                >
                  <template slot-scope="scope">
                    <img :src="form.bigPic" class="img-90"/>
                  </template>
                </base-upload>

              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item label="科室小图" prop="smallPic">
            <el-row>
              <el-col :span="7">
                <img :src="form.smallPic" class="img-90"/>
              </el-col>
              <el-col :span="17">
                <!---科室小图修改-->
                <base-upload
                  :fileList="smallFileList"
                  :rule="imgUpload.rule"
                  :limit="imgUpload.limit"
                  @notify="handleSmallUpload"
                >
                  <template>
                    <img :src="form.smallPic" class="img-90"/>
                  </template>
                </base-upload>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="cateFg==true && this.isMenulevel==1" prop="sort" label="科室排序">
            <el-row>
              <el-col :span="24">
                <el-input style="width: 150px" v-model="form.sort" size="mini" type="text"
                          placeholder="请输入排序数字"></el-input>
                <el-link type="info" class="m-l-10" disabled> 数字越大越靠前</el-link>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="多咖医生web端展示" prop="doctorWeb">
            <el-radio-group v-model="form.doctorWeb">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="siteIdStatue" size="mini">保存</el-button>
            <el-button @click="$router.go()" size="mini">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-dialog
      title="关联疾病"
      :visible.sync="dialogVisible"
      append-to-body
      width="500">
      <el-tree
        :data="cognateTree"
        show-checkbox
        :expand-on-click-node="false"
        :highlight-current="true"
        node-key="typeAndId"
        ref="cognateTree"
        current-node-key
        :default-checked-keys="defaultCognate"
        default-expand-all
        class="tree-overflow"
        :props="defaultProps">
      </el-tree>
      <el-row class="m-t-10">
        <el-col :span="10" :offset="7">
          <el-button type="primary" size="mini" @click="saveDisseaseTree">保存</el-button>
          <el-button size="mini" @click="dialogVisible=false;">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script>
	import { isValidNumber } from '@/utils/RegExp';

	export default {
		data () {
			var checkSort = (rule, value, callback) => {
				if (!isValidNumber(value)) {
					this.$message('输入科室排序数字之能为正整数！');
				}
				else {
					callback();
				}
			};
			return {
				smallFileList: [],//小图上传列表
				bigFileList: [],//大图上传列表
				showSaveBtn: true, //是否显示保存按钮
				defaultCognate: [],//默认的疾病关联tree 设置
				defaultShowKeys: [],//默认展开的id
				defaultKeys: [],//默认初始key
				dialogVisible: false,//关联的疾病树弹窗的控制
				isMenulevel: 1,//1：一级科室，2：二级科室
				cateFg: true,//true：一级 false: 二级
				isAdd: false,//是否是新增
				showCont: false,//默认不显示关联项
				form: {//分类
					id: '',//id
					baseId: '',//父级id
					sopName: '',//科室名称
					bigPic: '',//大图
					smallPic: '',//小图
					dissease: [],//关联的疾病
					diseaseIds: '',
					sort: null,
					doctorWeb:null,//是否web端展示
				},
				rules: {
					sopName: [
						{required: true, message: '请输入科室名称'},
						{min: 1, max: 10, message: '科室名只能是1-10个字符', trigger: 'blur'}
					],
					sort: [
						{required: true, message: '请输入排序数字'},
						{validator: checkSort, trigger: 'blur'},
					],
					bigPic: [
						{required: true}
					],
					smallPic: [
						{required: true}
					]
				},
				imgUpload: {
					limit: 1,//上传文件个数限制
					type: "file",
					rule: {
						type: [ 'image/jpg', 'image/gif', 'image/png', 'image/jpeg' ],
						size: 100
					}
				},
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				treeData: [],//左侧的树形菜单
				cognateTree: [],//关联疾病的tree
				loading: true, //加载条进度条
				diseaseList: [],//关联疾病
			}
		},
		mounted () {
			this.getTreeData();
		},
		methods: {
			setCheckedKeys (data) {//设置第一次加载的默认节点
				let that = this;
				if (!this.setTreeId) {
					this.cateFg = true;
					let treeData = data[ 0 ];
					if (treeData) {
						this.form.id = treeData.id;
						this.form.sopName = treeData.label;//科室名称
						this.form.bigPic = treeData.bImg;//大图
						this.form.smallPic = treeData.sImg;//小图
						this.form.typeAndId = treeData.typeAndId;
						this.form.sort = treeData.sort;
						this.form.doctorWeb = treeData.doctorWeb;
						//设置默认节点状态
						this.defaultKeys = [];
						this.defaultKeys.push(treeData.typeAndId);
						//设置高亮显示
						this.$nextTick(function () {
							this.$refs.tree.setCurrentKey(treeData.typeAndId);
							this.$refs.tree.store.nodesMap[ treeData.typeAndId ].expanded = true;
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
			saveDisseaseTree () {
				//回带选择疾病树的值
				// this.loading=true;
				this.dialogVisible = false;
				let that = this;
				that.form.dissease = [];
				let nodeArr = this.$refs.cognateTree.getCheckedNodes();
				let diseaseIds = '';
				nodeArr.forEach((item, index) => {
					if (!item.children) {
						diseaseIds += item.id + ',';
						const itm = {
							name: item.label,
							id: item.id,
							typeAndId: Number('2' + item.id)
						}
						that.form.dissease.push(itm);
					}
				})
				this.form.diseaseIds = diseaseIds.substring(0, diseaseIds.length - 1);

			},
			gotoCognateDiscess () {
				let that = this;
				this.$post('/data/my', {
					pathL: '/doctor/department/connectDisease',
					departmentId: this.form.id,//关联科室的id
					diseaseIds: this.form.diseaseIds//关联疾病的id 数组
				}).then(res => {
					if (!res.state) {
						//that.getTreeData();
						that.loading = false;
						that.$message('保存成功！');
						that.$refs.form.clearValidate();
					}
				}).catch(err => {
					console.log(err);
				})
			},
			siteIdStatue () { //新增/编辑下 修改id 的值
				if (this.isAdd) {//新建
					this.form.id = '';
				}
				if (this.cateFg) {
					this.saveFirst();
				}
				else {
					this.saveSecond();
				}
			},
			formJudge () { //校验表单
				if (!this.form.sopName) {
					this.$message("科室名不能为空");
					this.loading = false;
					return false;
				}
				if (this.form.sopName.length > 10) {
					this.$message("科室名只能是1-10个字符！");
					this.loading = false;
					return false;
				}
				if (!this.form.bigPic) {
					this.$message("科室大图不能为空");
					this.loading = false;
					return false;
				}
				if (!this.form.smallPic) {
					this.$message("科室小图不能为空");
					this.loading = false;
					return false;
				}

				if (this.cateFg) { // 一级科室
					if (!isValidNumber(this.form.sort)) {
						this.$message('输入科室排序数字之能为正整数！');
						this.loading = false;
						return false;
					}
				}

				return true;
			},
			saveFirst () {
				this.loading = true;
				if (!this.formJudge()) { //校验失败了退出
					return;
				}
				let that = this;
				this.$post('/data/my', {
					pathL: '/doctor/departmentBase/addOrEdit',
					name: this.form.sopName,//一级科室名称
					imageUrl: this.form.bigPic,//图片名
					smallImageUrl: this.form.smallPic,//小图片名
					id: this.form.id,//如果是新建则不传、如果是编辑则必传
					sort: this.form.sort,//排序字段
					doctorWeb:this.form.doctorWeb//是否web端展示
				}).then(res => {
					that.loading = false;
					if (!res.state) {
						that.$message('保存成功！');
						that.smallFileList = [];
						that.bigFileList = [];
						// setTimeout(()=>{
						//     that.$router.go();
						// },1000)
						that.getTreeData();
					}
					else {
						that.$message('保存失败！');
					}
				}).catch(err => {
					console.log(err);
				})
			},
			saveSecond () { //保存二级菜单
				this.loading = true;
				if (!this.formJudge()) { //校验失败了退出
					return;
				}
				let that = this;
				this.$post('/data/my', {
					pathL: '/doctor/department/addOrEdit',
					twoLevel: this.form.sopName,//二级科室名称
					imageUrl: this.form.bigPic,//图片名
					smallImageUrl: this.form.smallPic,//小图片名
					baseId: this.form.baseId,//所归属的一级科室的id号
					id: this.form.id,//二级科室id号 新建时不用传，修改是必传
					doctorWeb:this.form.doctorWeb//是否web端展示
				}).then(res => {
					that.loading = false;
					if (res.state == 0) {
						that.gotoCognateDiscess();
						that.smallFileList = [];
						that.bigFileList = [];
						that.getTreeData();
					}
					// else if (res.state == 6255) {
					// 	that.$message('该科室已被运用无法修改！');
					// }
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			getCognateTree () { //获取关联的疾病的树
				let that = this;
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/doctorSearchDiseaseCategory/getCategoryAndDiseaseTree"
				})
					.then(res => {
						if (!res.state) {
							that.loading = false;
							that.dialogVisible = true;
							that.cognateTree = [];
							that.dealDissTree(res.data)
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			handleBigUpload (data) { //对当前的上传文件数据、状态处理
				if (data.length) {
					this.form.bigPic = data[ 0 ].url;
					this.bigFileList = [ {
						url: this.form.bigPic
					} ]
					console.log("大图  " + this.form.bigPic);
				}
			},
			handleSmallUpload (data) { //对当前的上传文件数据、状态处理
				if (data.length) {
					this.form.smallPic = data[ 0 ].url;
					this.smallFileList = [ {
						url: this.form.smallPic
					} ]
					console.log("小图  " + this.form.smallPic);
				}
			},
			getTreeData () {//获取节点树数据
				let that = this;
				let dataArr = [];
				this.$get("/data/my", {
					pathL: "/doctor/departmentBase/getDepartmentTree"
				}).then(res => {
					if (!res.state) {
						dataArr = res.data;
						that.dealTreeData(res.data);
						that.setCheckedKeys(that.treeData);
						that.loading = false;
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
						typeAndId: Number(item.typeAndId.replace("_", '')),//节点唯一的标识
						id: item.id,
						label: item.name,
						bImg: item.imageUrl,//大图
						sImg: item.smallImageUrl,//小图
						sort: item.sort,
						doctorWeb:item.doctorWeb,//是否web显示
						children: []
					}
					if (item.twoLevelDepartment) {
						item.twoLevelDepartment.forEach((itm, val) => { //获取二级树
							const im = {
								typeAndId: Number(itm.typeAndId.replace("_", '')),//节点唯一标识
								id: itm.id,
								label: itm.twoLevel,
								bImg: itm.imageUrl,//大图
								sImg: itm.smallImageUrl,//小图
								sort: itm.sort,
								baseId: itm.baseId,//父级科室的id
								doctorWeb:itm.doctorWeb,//是否web显示
								parentTypeAndId: it.typeAndId
							}
							it.children.push(im);
						})
					}
					that.treeData.push(it);
				})

			},
			newCate () { //新增科室
				if (this.isMenulevel == 2) { //二级科室，不能再新增子科室
					this.cateFg = false;
				}
				else {
					this.cateFg = true;//能新增
				}
				this.showCont = false;
				this.resetForm();
			},
			newDissease () { //新增子科室
				if (this.isMenulevel == 2) { //子科室不能再新增子科室
					this.cateFg = false;
				}
				else if (this.isMenulevel == 1) { //一级科室可以继续新增科室
					this.cateFg = false;
				}
				this.showCont = false;
				this.resetForm();
			},
			resetForm () {
				//判断不同的类型进行数据提交
				this.form.id = '';
				this.form.sopName = '';//科室名称
				this.form.bigPic = '';//大图
				this.form.smallPic = '';//小图
				this.form.doctorWeb = null;
				this.form.dissease = [];//关联疾病
				this.setTreeId = null; //清空选中的树节点
				this.setTreeShowId = null;//清空展开的树
				this.form.sort = null;
			},
			checkedNode (data, node) { //选中节点
				this.$refs.form.clearValidate();
				this.resetForm();
				this.isAdd = false;//更改为编辑状态
				this.smallFileList = [];
				this.bigFileList = [];

				this.form.typeAndId = node.data.typeAndId;// 当前节点唯一的标识的id
				this.form.parentTypeAndId = data.parentTypeAndId;
				this.setTreeId = this.form.typeAndId;
				this.setTreeShowId = this.form.parentTypeAndId;
				if (data.children) {
					this.cateFg = true;
					this.isMenulevel = 1;
					console.log("父节点");
					this.form.baseId = node.data.id;
					this.showCont = false;
					this.setTreeShowId = this.setTreeId;
				}
				else {
					this.cateFg = false;
					this.isMenulevel = 2;
					this.form.dissease = [];
					console.log("子节点");
					this.form.baseId = node.data.baseId;
					this.getdisease(node.data.id);
					this.showCont = true;
				}
				this.form.id = node.data.id;
				this.form.sopName = node.data.label;
				this.form.bigPic = node.data.bImg;
				this.form.smallPic = node.data.sImg;
				this.form.sort = node.data.sort;
				this.form.doctorWeb = node.data.doctorWeb;
			},
			dealDisseaseVal () {
				let diseaseIds = '';
				this.form.dissease.forEach((item, index) => {
					item.typeAndId = Number(('2_' + item.id).replace('_', ''));
					diseaseIds += item.id + ','
				})
				this.form.diseaseIds = diseaseIds.substring(0, diseaseIds.length - 1);

			},
			getdisease (id) { //获取对应的二级菜单关联的疾病值
				let that = this;
				this.loading = true;
				this.$get('/data/my', {
					pathL: '/doctor/department/getConnectDisease',
					departmentId: id
				}).then(res => {
					if (!res.state) {
						that.form.dissease = res.data;
						that.loading = false;
						that.dealDisseaseVal();
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
								label: itm.disease
							}
							it.children.push(im);
						})
					}
					that.cognateTree.push(it);
				})
				this.setDefaultCognate(); //设置关联疾病项目
			},
			setDefaultCognate () { //设置默认的关联疾病
				this.defaultCognate = [];
				let that = this;
				this.form.dissease.forEach((item, idx) => {
					that.defaultCognate.push(item.typeAndId);
				})
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
