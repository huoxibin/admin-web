<template>
  <dk-dialog
    :baseConfig="colorDConfig"
    :showConfirmBtn="showConfirmBtn"
    :dialogShow.sync="colorDConfig.visible"
    @confirmCallback="confirmSelColor"
    @cancelCallback="cancelSelColor"
    @closeDialog="cancelSelColor"
  >
    <dk-form
      :form="colorform"
      :config="colorConfig"
      :inline="false"
      :rules="rules"
      slot="form"
      labelWidth="80px"
    ></dk-form>
  </dk-dialog>
</template>

<script>
	export default {
		name: "additem",
		props: {
			show: {
				require: true,
				default: false
			},
			value: {
				require: false,
				default: ''
			},
		},
		data: () => ({
			/////////颜色弹窗配置////////////
			colorDConfig: {
				visible: false,
				width: "450px",
				title: "添加"
			},
			colorform: {
				name: ''
			},
			colorConfig: [
				{
					// type 可选范围 [ input/select/date/switch/checkbox/radio ]
					type: "input",
					label: "添加项",
					value: "name",
					option: {
						disabled: false
					}
				}
			],
			showConfirmBtn: false,
			rules: {
				name: [ {required: true, message: "请输入添加项", trigger: "blur"} ]
			}
		}),
		watch: {
			show () {
				this.colorDConfig.visible = this.show;
			},
			"colorform.name" () {
				if (this.colorform.name !== "") {
					this.showConfirmBtn = true;
				}
				else {
					this.showConfirmBtn = false;
				}
			}
		},
		mounted () {
			this.colorDConfig.visible = this.show;
		},
		methods: {
			confirmSelColor () {
				//确认
				this.colorDConfig.visible = false;
				this.$emit("getData", this.colorform);
			},
			cancelSelColor () {
				// 取消
				this.colorDConfig.visible = false;
				this.$emit("close");
			}
		}
	};
</script>

<style scoped></style>
