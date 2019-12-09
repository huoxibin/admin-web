<template>
  <div>
    <el-row class="m-t-20">
      <el-col :span="15" :offset="1">
        <dk-form :rules="rules" :form="form" :config="formConfig" labelWidth="120px"></dk-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15" :offset="1">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
          <el-form-item label="证书附件" prop="accessory">
            <div class="imgContent" v-for="(item,index) in form.accessory" :key="index">
              <img :src="item" class="w-80"/>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15" :offset="1" class="text-center">
        <el-button class="m-l-15" size="mini" @click="goBack">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				rules: {
					action: [
						{required: true}
					],
					param: [
						{required: true}
					],
					measured: [
						{required: true}
					],
					deviceFirm: [
						{required: true}
					],
					deviceModel: [
						{required: true}
					],
					bluetooth: [
						{required: true}
					],
					macSite: [
						{required: true}
					],
					applyName: [
						{required: true}
					],
					ccieName: [
						{required: true}
					],
					ccieCode: [
						{required: true}
					],
					accessory: [
						{required: true}
					],
				},
				form: {
					action: '功能',
					param: '功能指标',
					measured: "测量项",
					deviceFirm: '设备厂商',
					deviceModel: '设备型号',
					bluetooth: '蓝牙名称',
					macSite: 'mac地址',
					applyName: '引用于',
					ccieName: '证书名称',
					ccieCode: '证书代码',
					accessory: []
				},
				formConfig: [
					{
						type: "text",
						label: "功能",
						value: "actionName",
						option: {
							disabled: false,
							placeholder: "请输入功能",
						}
					},
					{
						type: "text",
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
							disabled: true,
							rows: 4
						}
					},
					{
						type: "text",
						label: "设备厂商",
						value: "deviceFirm",
						option: {
							placeholder: "请输入设备厂商",
							disabled: false
						}
					},
					{
						type: "text",
						label: "设备型号",
						value: "deviceModel",
						option: {
							placeholder: "请输入设备型号",
							disabled: false
						}
					},
					{
						type: "text",
						label: "蓝牙名称",
						value: "bluetooth",
						option: {
							placeholder: "请输入蓝牙名称",
							disabled: false
						}
					},
					{
						type: "textarea",
						label: "mac地址",
						value: "macSite",
						option: {
							placeholder: 'mac地址字数最多为1000000个字',
							type: "textarea",
							disabled: true,
							rows: 4
						}
					},
					{
						type: "text",
						label: "引用于",
						value: "applyName",
						option: {
							placeholder: "请输入蓝牙名称",
							disabled: false
						}
					},
					{
						type: "text",
						label: "证书名称",
						value: "ccieName",
						option: {
							placeholder: "请输入证书名称",
							disabled: false
						}
					},
					{
						type: "text",
						label: "证书代码",
						value: "ccieCode",
						option: {
							placeholder: "请输入证书代码",
							disabled: false
						}
					},
				]
			}
		},
		mounted () {
			this.getdetail();
		},
		methods: {
			getdetail () {
				let that = this;
				this.$get('/data/my', {
					pathL: '/common/external/getDeviceExternal',
					id: this.$route.query.id
				}).then(res => {
					if (res.state == 0) {
						that.form = res.data;
						that.form.accessory = that.form.accessory.split(',');
						that.form.applyName = that.form.apply == 1 ? '医哆咖' : '机构版';
					}
				}).catch(err => {
					this.$message(err);
				})
			},
			goBack () {
				this.$router.push({
					path: '/system/device'
				})
			}

		}

	}
</script>


