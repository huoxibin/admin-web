<template>
    <div>

        <dk-dialog
          :baseConfig="dialogConfigImport"
          :dialogShow.sync="dialogShowImport"
          @confirmCallback="confirmImport"
          @cancelCallback="cancelImport"
          @closeDialog="cancelImport"
        >
            <dk-form slot="form" :form="importForm" :config="configImport" :inline="true" labelWidth="130px"></dk-form>

        </dk-dialog>
        ////////通用导入////////
        <dk-reqfile
          :upload="upload"
          :reqFileConfig="importDialogConfig"
          :getUploadFile="getfile"
        ></dk-reqfile>
    </div>
</template>

<script>
  export default {
	name: "Infile",
	props: {
	  upload: {
		require: true,
		type: Object
	  },
	  dialogShowImport: { // 是否显示
		require: true,
		type: Boolean
	  }

	},

	data () {
	  return {
		importForm: {},
		/////////////通用导入//////////////
		importDialogConfig: {
		  visible: false,
		  width: "350px",
		  title: "导入"
		},
		importFileForm: {},
		dialogConfigImport: {
		  title: '导入', //标题
		  width: '500px', //宽
		  cancelBtnTxt: '关闭',
		},
		configImport: [
		  {
			type: 'button',
			label: '导入',
			value: 'name',
			option: {
			  disabled: false,
			  type: 'primary',
			  btnConfig: {
				label: '导入模板',
				btnCallBack: 'imortModel'
			  },
			},
		  },
		  {
			type: 'button',
			label: '导出',
			value: 'name1',
			option: {
			  disabled: false,
			  type: 'primary',
			  btnConfig: {
				label: '导出模板',
				btnCallBack: 'exportModel'
			  },
			},
		  },
		  {
			type: 'input',
			label: '已导入表格名称',
			value: 'name2',
			option: {
			  disabled: true,
			  type: 'primary'
			},
		  },
		  {
			type: 'input',
			label: '已成功导入用户数',
			value: 'num',
			option: {
			  disabled: true,
			  type: 'primary'
			},
		  }
		],
	  }
	},
	methods: {
	  getfile (file) {
		//获取导入的文件 值
		debugger;
	  },
	  confirmImport () {
		this.$emit('confirmImport', this.importForm);
	  },
	  cancelImport () {
		this.$emit('cancelImport');
	  },
	  imortModel(){

	  },
	  exportModel(){

	  }

	}
  }
</script>

<style scoped>

</style>