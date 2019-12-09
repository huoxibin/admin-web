<template>
  <div>
    <dk-dialog
      :baseConfig="dialogConfig"
      :dialogShow.sync="show"
      @cancelCallback="cancel"
      @confirmCallback="confirmValue"
      @closeDialog="cancel"
    >

      <!-- 表单 -->
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

      <dk-table
        style="max-height: 300px"
        slot="table"
        ref="table"
        border
        selectRadio
        :radioSelect.sync="defaultVal.id"
        stripe
        :data="tableData"
        :config="tableConfig"
        index
        :pageNum="recordPage.pageNum"
        :pageSize="recordPage.pageSize"
        @radioClick="handleCurrentChange"
      >
      </dk-table>
      <dk-page slot="page" @currentChange="changePage" :pageConfig="recordPage"></dk-page>


    </dk-dialog>
  </div>
</template>

<script>
	export default {
		name: "bindDoctor",
		props: [ "show", "defaultVal" ],
		data () {
			return {
				dialogConfig: {
					title: "绑定医生",
					show: true,
					width: '700px'
				},
				////////表格的内容配置////////
				form: {
					doctorName: "",
					mobile: ""
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "医生名称",
						value: "doctorName",
						option: {
							placeholder: "请输入医生名称",
							disabled: false
						}
					},
					{
						type: "input",
						label: "手机号",
						value: "mobile",
						option: {
							placeholder: "请输入手机号",
							disabled: false
						}
					}
				],
				///////////相关的表格的配置////////////
				tableData: [],
				tableConfig: [

					{
						type: "",
						label: "医生姓名",
						value: "doctorName"
					},
					{
						type: "",
						label: "机构名称",
						value: "hospitalName"
					},
					{
						type: "",
						label: "科室",
						value: "deptName"
					},
					{
						type: "",
						label: "手机号",
						value: "mobile"
					},
				],
				recordPage: {
					pageNum: 1,
					pageSize: 10,
					total: 0
				},
				radio: ''
			};
		},
		mounted () {
			this.getTeacherArr(); //获取讲师的数据
		},
		watch: {
			show () {
				if (this.show) {
					if (this.$refs.table) {
						this.$refs.table.radioselVal = parseInt(this.defaultVal.id);
					}
				}
				else {
					if (this.$refs.table) {
						this.$refs.table.radioselVal = '';
					}
				}
			}
		},
		methods: {
			confirmValue () {
				this.form.doctorName='';
				this.form.mobile='';
				this.$emit("getStatus", this.defaultVal);
			},
			cancel () {
				//this.$refs.table.radioselVal = ''; // 重置radio 的选项值
				this.form.doctorName='';
				this.form.mobile='';
				this.$emit("closeTeacher");
			},
			handleCurrentChange (val) {
				this.defaultVal.name = val.doctorName;
				this.defaultVal.id = `${ val.doctorId }`;
				this.defaultVal.deptName = val.deptName;
				this.defaultVal.hospitalName = val.hospitalName;
				this.defaultVal.titleName = val.titleName;
			},
			////////////旧////////////////////
			getTeacherArr () {
				//获取讲师的列表
				this.loading = true;
				let that = this;
				this.$post("/data/my", {
					pathL: "/doctor/livecourseInfo/lectuerList",
					doctorName: this.form.doctorName,
					mobile: this.form.mobile,
					pageNum: this.recordPage.pageNum,
					pageSize: this.recordPage.pageSize
				}).then(res => {
					that.loading = false;
					if (!res.state) {
						that.dealTable(res.data.result);
						that.recordPage.total = res.data.total;
					}
					else {
						that.$message("获取讲师列表失败！");
					}
				});
			},
			dealTable (data) { // 设置勾选的绑定医生的列表值
				data.forEach(item => {
					item.radioName = item.doctorId;
				})
				this.tableData = data;
			},
			search () {

				this.recordPage.pageNum = 1;
				this.getTeacherArr();
			},
			changePage (page) { //单节点点击事件
				this.recordPage.pageNum = page;
				this.getTeacherArr();
			}
		}
	};
</script>
