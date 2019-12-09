<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogShow"
    :width="width"
    :center="center"
    :modal="modal"
    :show-close="false"
    :close-on-click-modal="false"
    @close="otherCloseDialog"
    :append-to-body="true"
    :close-on-press-escape='false'
  >
    <span class="close-dialog el-dialog__close" @click="closeDialog">X</span>
    <slot name="form"></slot>
    <slot name="btns"></slot>
    <slot name="tree"></slot>
    <slot name="table"></slot>
    <slot name="buttonGroup"></slot>
    <slot name="page"></slot>
    <span slot="footer" class="dialog-footer">
     <el-button
       type="primary"
       v-if="showConfirmBtn"
       @click="handleConfirmBtn"
       size="mini"
     >{{ confirmBtnTxt }}</el-button>
      <el-button v-if="showCancelBtn" @click="handleCancelBtn" size="mini">{{ cancelBtnTxt }}</el-button>
      <el-button v-if="otherBtn" @click="handleOtherBtn" size="mini">{{ otherBtnTxt }}</el-button>

    </span>
  </el-dialog>
</template>

<script>
	export default {
		name: "DkDialog",
		props: {
			center: {
				// 标题居中
				type: Boolean,
				default () {
					return false;
				}
			},
			// buttonGroupConifg: {  // 设置按钮组
			//   type: Array,
			//   default() {
			//     return {};
			//   },
			// },
			dialogShow: {
				type: Boolean,
				default: () => {
					return false;
				}
			},
			showCancelBtn: {
				type: Boolean,
				default () {
					return true;
				}
			},
			showConfirmBtn: {
				type: Boolean,
				default () {
					return true;
				}
			},
			otherBtn: {
				type: Boolean,
				default () {
					return false;
				}
			},
			aboutConfig: {
				type: Object,
				default: () => {
					return {};
				},
				require: true
			},
			baseConfig: {
				type: Object,
				default: () => {
					return {};
				}
			}
		},
		watch: {
			dialogShow (val) {
				//debugger
				//if (val) {
				//this.$emit("updataDialogShow", true);
				// } else {
				//this.$emit("updataDialogShow", false);
				//}
			}
		},
		mounted () {
			//console.log(this.buttonGroupConifg);
		},

		data () {
			return {
				title: this.baseConfig.title || "",
				width: this.baseConfig.width || "50%",
				modal: this.baseConfig.modal || true,
				confirmBtnTxt: this.baseConfig.confirmBtnTxt || "确认", // 默认 "确认"
				cancelBtnTxt: this.baseConfig.cancelBtnTxt || "取消", // 默认 "确认"
				otherBtnTxt: this.baseConfig.otherBtnTxt || "取消" // 默认 "确认"
			};
		},

		methods: {
			handleConfirmBtn () {
				this.$emit("confirmCallback");
			},
			handleCancelBtn () {
				this.$emit("cancelCallback");
			},
			otherCloseDialog () {
				//this.$emit("updataDialogShow",false);
			},
			handleOtherBtn () {
				this.$emit("handleOtherBtn");
			},
			closeDialog(){
				this.$emit("closeDialog");
      }
		}
	};
</script>
<style lang="scss" scoped>
  .close-dialog{ position: absolute; right: 20px; top:20px; cursor: pointer; }
</style>
