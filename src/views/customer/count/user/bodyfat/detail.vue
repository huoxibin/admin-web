<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p></p>
        <el-button @click="$router.go(-1)" size="mini" type="primary">返回</el-button>
      </div>
    </div>
    <!-- 信息 -->
    <el-form :inline="true" :model="form" class="m-t-20" label-width="160px">
      <el-form-item label="家庭号">
        {{ form.familyNo }}
      </el-form-item>
      <el-form-item label="用户手机号">
        {{ form.mobile }}
      </el-form-item>
      <el-form-item label="测量用户">
        {{ form.name }}
      </el-form-item>
      <el-form-item label="性别">
        {{ form.sex }}
      </el-form-item>
      <el-form-item label="年龄">
        {{ form.age }}
      </el-form-item>
      <el-form-item label="用户类型">
        {{ form.type }}
      </el-form-item>
      <el-form-item label="累计测量次数">
        {{ form.amount }}
      </el-form-item>
    </el-form>


    <div class="health-bottom">
      <div class="title-bar">
        <span>测量历史</span>
        <el-button @click="viewUser" size="mini" type="primary">查看用户完整信息</el-button>
      </div>
      <dk-table
        slot="table"
        border
        stripe
        :data="tableData"
        :config="tableConfig"
        :pageNum="recordPage.pageNum"
        :pageSize="10"
      >
      </dk-table>
      <dk-page @currentChange="changePage" :pageConfig="recordPage"></dk-page>

    </div>
  </div>
</template>

<script>
	export default {
		name: "",
		components: {},
		props: [],
		filters: {},
		data () {
			return {
				recordPage: {
					pageNum: 1,
					pageSize: 10,
					total: 0
				},
				form: {
					//注意处理null 变成 -- 的情况
					familyNo: '',
					mobile: '',
					name: '',
					age: null,
					sex: '',
					type: '',
					amount: '',
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "",
						label: "家庭号",
						value: "familyNo",
						option: {
							placeholder: "家庭号",
							disabled: false
						}
					},
					{
						type: "",
						label: "用户手机号",
						value: "mobile",
						option: {
							placeholder: "用户手机号",
							disabled: false
						}
					},
					{
						type: "",
						label: "测量用户",
						value: "name",
						option: {
							placeholder: "测量用户",
							disabled: false
						}
					},
					{
						type: "",
						label: "性别",
						value: "sex",
						option: {
							placeholder: "性别",
							disabled: false
						}
					},
					{
						type: "",
						label: "年龄",
						value: "age",
						option: {
							placeholder: "年龄",
							disabled: false
						}
					},
					{
						type: "",
						label: "用户类型",
						value: "type",
						option: {
							placeholder: "用户类型",
							disabled: false
						}
					},
					{
						type: "",
						label: "累计测量次数",
						value: "amount",
						option: {
							placeholder: "累计测量次数",
							disabled: false
						}
					},
				],
				tableConfig: [
					//相关的表格的配置
					{
						type: "",
						label: "体重",
						value: "weight"
					},
					{
						type: "",
						label: "BMI",
						value: "bmi"
					},
					{
						type: "",
						label: "BMI标准",
						value: "analyzeFatType"
					},
					{
						type: "",
						label: "测量时间",
						value: "measuringTime"
					}
				],
				tableData: []
			}
		},
		mounted () {
			this.getDetail();
		},
		methods: {
			changePage (val) {
				//单节点点击事件
				console.log(val);
				this.recordPage.pageNum = val;
				this.getDetail();
			},
			//查看用户信息
			viewUser () {
				this.$router.push({
					name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
					query: {
						id: this.$route.query.id,
						familyNo: this.$route.query.familyNo,
						memberType: '',
						index: '',
						activeName: 'second'
					}
				});
			},
			getDetail () {
				let that = this;
				this.$get('/data/my', {
					pathL: '/health/bodyFatRate/details',
					userId: this.$route.query.id,
					pageNum: this.recordPage.pageNum,
					pageSize:10,
				}).then(res => {
					if (res.state == 0) {
						that.tableData = res.data.result.list;
						that.recordPage.total = res.data.total;
						let people = res.data.result;
						that.form.familyNo = people.familyNo == '' ? '--' : people.familyNo;
						that.form.mobile = people.mobile == '' ? "--" : people.mobile;
						that.form.name = people.NAME == '' ? '--' : people.NAME;
						that.form.age = people.age == '' ? '--' : people.age;
						that.form.sex = people.sex == '' ? '--' : people.sex;
						that.form.type = people.userType == 1 ? '测试用户' : '正式用户';
						that.form.amount = people.num == '' ? '--' : people.num;
					}
					else {
						that.$message(res.msg);
					}
				}).catch(err => {
					this.$message(err);
				})
			}
		},

	}
</script>

