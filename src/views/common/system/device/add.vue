<template>
  <div>
    <el-row class="m-t-20">
      <el-col :span="15" :offset="1">
        <dk-form ref="vform1" :rules="rules" :form="form" :config="formConfig" labelWidth="120px"></dk-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15" :offset="1">
        <el-form ref="vform2" :rules="rules" :model="form" labelWidth="120px">
          <el-form-item label="mac地址" prop="macSite">
            <el-row>
              <el-col :span="24">
                <el-input v-model="form.macSite" placeholder="mac地址字数最多为1000000个字" :rows="5" type="textarea"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-upload
          class="upload-demo"
          :action="action"
          :headers="headers"
          :on-success="onSuccess"
          :show-file-list="false"
          name="file"
        >
          <el-button size="mini" type="primary">导入</el-button>

        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15" :offset="1">
        <dk-form ref="vform3" :rules="rules" :form="form" :config="formConfig1" labelWidth="120px"></dk-form>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15" :offset="1">
        <el-form :rules="rules" ref="vform4" labelWidth="120px" :model="form">
          <el-form-item label="证书附件" prop="accessory">
            <!--@delNotify="delUploadImg"-->
            <div class="d-b-i imgContent" v-if="type=='edit'"
                 v-for="(item,index) in img"
                 :key="index">
              <img :src="item" class="w-60"/>
              <div class="el-icon-close" @click="removeImg(index)"></div>
            </div>

            <UploadImg
              ref="upload"
              :diableBtn="disableBtn"
              :tip="upload.tip"
              :rule="upload.rule"
              :limit="upload.limit"
              @notify="handleUploadImg"
              @delUpImg="handleUploadImg"
            ></UploadImg>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="m-b-20">
      <el-col :span="15" :offset="1" class="text-center">
        <el-button class="m-l-15" size="mini" type="primary" @click="saveForm">保存</el-button>
        <el-button class="m-l-15" size="mini" @click="goBack">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import UploadImg from './upload'

	export default {
		components: {UploadImg},
		data () {
			return {
				rules: {
					action: [
						{required: true, message: '请输入功能', trigger: 'blur'}
					],
					param: [
						{required: true, message: '请输入功能指标', trigger: 'blur'}
					],
					measured: [
						{required: true, message: '长度在 1 到 1000000 个字符', trigger: 'blur'},
						{min: 1, max: 1000000, message: '长度在 1 到 1000000 个字符', trigger: 'blur'}
					],
					deviceFirm: [
						{required: true, message: '请输入设备厂商', trigger: 'blur'},
						{min: 1, max: 1000000, message: '长度在 1 到 1000000 个字符', trigger: 'blur'}
					],
					deviceModel: [
						{required: true, message: '请输入设备型号', trigger: 'blur'}
					],
					bluetooth: [
						{required: true, message: '请输入蓝牙名称', trigger: 'blur'}
					],
					macSite: [
						{required: true, message: '请输入mac地址', trigger: 'blur'}
					],
					apply: [
						{required: true, message: '请选择应用项', trigger: 'blur'}
					],
					ccieName: [
						{required: true, message: '请输入证书名称', trigger: 'blur'}
					],
					ccieCode: [
						{required: true, message: '请输入证书代码', trigger: 'blur'}
					],
					accessory: [
						{required: true, message: '请上传附件', trigger: 'blur'}
					],
				},
				imgUpload: [],
				upload: {
					limit: 5, //上传文件个数限制
					tip: "",
					type: "file",
					rule: {
						type: [ "image/jpg", "image/gif", "image/jpeg", "image/png" ],
						size: 100
					}
				},
				img: [],
				form: {
					action: '',
					param: '',
					measured: "",
					deviceFirm: '',
					deviceModel: '',
					bluetooth: '',
					macSite: '',
					applyName: '',
					ccieName: '',
					ccieCode: '',
					accessory: [],//记录上传的附件
					imgarr: [],// 显示的附件内容
				},
				type: '',
				formConfig: [
					{
						type: "select",
						label: "功能",
						value: "action",
						option: {
							disabled: false,
							data: [
								{
									label: "请选择",
									value: ""
								},
								{
									label: "血压",
									value: 1
								},
								{
									label: "血糖",
									value: 2
								},
								{
									label: "心电",
									value: 3
								},
								{
									label: "体温",
									value: 4
								},

								{
									label: "血氧",
									value: 5
								},
								{
									label: "体脂",
									value: 6
								},
								{
									label: "尿检",
									value: 7
								},
								{
									label: "血脂",
									value: 8
								},
								{
									label: "尿酸",
									value: 9
								},
								{
									label: "跌倒监测",
									value: 10
								},
								{
									label: "运动手环",
									value: 11
								},
								{
									label: "胎心仪",
									value: 12
								}
							]
						}
					},
					{
						type: "input",
						label: "功能指标",
						value: "param",
						option: {
							placeholder: "请输入功能指标",
							disabled: false
						}
					},
					{
						type: "textarea",
						label: "测量项",
						value: "measured",
						option: {
							placeholder: '测量项字数最多为1000000个字',
							type: "textarea",
							disabled: false,
							rows: 4
						}
					},
					{
						type: "input",
						label: "设备厂商",
						value: "deviceFirm",
						option: {
							placeholder: "请输入设备厂商",
							disabled: false
						}
					},
					{
						type: "input",
						label: "设备型号",
						value: "deviceModel",
						option: {
							placeholder: "请输入设备型号",
							disabled: false
						}
					},
					{
						type: "input",
						label: "蓝牙名称",
						value: "bluetooth",
						option: {
							placeholder: "请输入蓝牙名称",
							disabled: false
						}
					}
				],
				formConfig1: [
					{
						type: "select",
						label: "应用于",
						value: "apply",
						option: {
							disabled: false,
							data: [
								{
									label: "请选择",
									value: ""
								},
								{
									label: "机构版",
									value: 2
								},
								{
									label: "医哆咖",
									value: 1
								}
							]
						}
					},
					{
						type: "input",
						label: "证书名称",
						value: "ccieName",
						option: {
							placeholder: "请输入证书名称",
							disabled: false
						}
					},
					{
						type: "input",
						label: "证书代码",
						value: "ccieCode",
						option: {
							placeholder: "请输入证书代码",
							disabled: false
						}
					},
				],
				imgCountNum: 0,
				disableBtn: false,
				action: "/data/excel",
				headers: {
					accessToken: this.$store.getters.accessToken,
					pathL: "/common/external/import"
				},
			}
		},
		watch: {
			'form.accessory' () {
				this.imgCountNum = this.form.accessory.length + this.form.imgarr.length;

			},
			imgCountNum () {
				console.log('this.imgCountNum    ' + this.imgCountNum);
				if (this.imgCountNum >= 5) {
					this.disableBtn = true
				}
			}
		},
		mounted () {
			if (this.$route.query.type) {
				this.type = this.$route.query.type;
			}
			if (this.$route.query.id) {
				this.getDetail();
			}
			this.imgCountNum = this.form.accessory.length + this.form.imgarr.length;

		},
		methods: {
			getDetail () {
				let that = this;
				this.$get('/data/my', {
					pathL: '/common/external/getDeviceExternal',
					id: this.$route.query.id
				}).then(res => {
					if (res.state == 0) {
						that.form = res.data;
						that.form.accessory = that.form.accessory.split(',');
						that.form.imgarr = that.form.accessory;
						that.img = that.form.accessory;
						that.form.accessory = [];
					}
				}).catch(err => {
					this.$message(err);
				})
			},
			validForm (formName) {
				let fg = false;
				formName.validate((valid) => {
					if (valid) {
						fg = true;
					}
					else {
						//fg = false;
						return false;
					}
				})
				return fg;
			},
			saveForm () {
				//debugger
				let fg1 = this.validForm(this.$refs.vform1.$refs.form);
				let fg2 = this.validForm(this.$refs[ 'vform2' ]);
				let fg3 = this.validForm(this.$refs.vform3.$refs.form);
				//let fg4 = this.validForm(this.$refs[ 'vform4' ]);
				if (this.form.imgarr.length == 0 && this.form.accessory == 0) {
					this.$message("请上传证书附件！")
					return;
				}

				let obj = this.form;
				let uploadImgArr = [];
				obj.accessory.forEach(item => {
					uploadImgArr.push(item.url);
				})
				let img = [ ...uploadImgArr, ...this.form.imgarr ];
				let data = {
					pathL: '',
					action: obj.action,
					param: obj.param,
					measured: obj.measured,
					deviceFirm: obj.deviceFirm,
					deviceModel: obj.deviceModel,
					bluetooth: obj.bluetooth,
					macSite: obj.macSite,
					apply: obj.apply,
					ccieName: obj.ccieName,
					ccieCode: obj.ccieCode,
					accessory: img.join(',')
				}
				if (this.type == 'edit') {
					data.pathL = '/common/external/updateDeviceExternal';
					data.id = this.form.id;
				}
				else {
					data.pathL = '/common/external/saveDeviceExternal';
				}
				let that = this;

				if (fg1 && fg2 && fg3) {
					this.$post('/data/my', data).then(res => {
						if (res.state == 0) {
							that.$message("保存成功！");
							that.goBack();
						}
					}).catch(err => {
						that.$message(err);
					})
				}
				else {
					this.$message('请输入正确的表单');
				}
			},
			removeImg (index) {
				//debugger
				let newArr = this.form.imgarr;
				newArr.splice(index, 1);
				this.form.imgarr = [];
				this.form.imgarr = newArr;
				this.img = newArr;
			},
			//导入操作
			// 上传成功
			onSuccess (response, file, fileList) {
				if (response.state === 0) {
					this.form.macSite += response.data;
				}
				else {
					this.$message({
						message: response.msg,
						center: true
					});
				}
			},
			handleUploadImg (data) {
				//上传文件
				this.form.accessory = data;
			},
			goBack () {
				this.$router.push({
					path: '/system/device'
				})
			}
		}

	}
</script>
