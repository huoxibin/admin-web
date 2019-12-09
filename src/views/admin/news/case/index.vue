<template>
  <div class="health comment">
    <base-layout ref="layout" style="height: 100%" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="病例标题">
          <el-input v-model="form.diseasesTitle"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.onlineStatus">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="form.platformType">
            <el-option
              v-for="item in source"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布人">
          <el-input v-model="form.publisher"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-input v-model="form.belongedType"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <base-date v-model="createDate"></base-date>
        </el-form-item>
        <el-form-item label="发布日期">
          <base-date v-model="date"></base-date>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button size="mini" type="primary" @click="$router.push('/news/case/add')">新 增</el-button>
        <el-button size="mini" type="success" @click="exportExcel">导 出</el-button>
      </div>
      <!-- 表格 -->
      <el-table slot="table" :height="tableHeight" ref="table" :data="data" border stripe style="width: 100%">
        <el-table-column type="index" :index="serialNumber" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="diseasesTitle" label="病例标题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="preview(scope.row.id)"
            >{{scope.row.diseasesTitle}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="belongedType" label="所属分类" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publishedDate" label="操作时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publisher" label="发布人" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformType" label="来源" align="center" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="readAmount" label="阅读量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="onlineStatus" label="状态" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="discussionAmount" label="讨论数" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.onlineStatus === '审核通过'"
              type="text"
              size="small"
              @click="handleStatus(scope.row.id, 1)"
            >上线
            </el-button>
            <el-button
              v-if="scope.row.onlineStatus === '已上线'"
              type="text"
              size="small"
              @click="handleStatus(scope.row.id, 3)"
            >下线
            </el-button>
            <el-button
              v-if="scope.row.onlineStatus === '待审核' || scope.row.onlineStatus === '已下线' || scope.row.onlineStatus === '审核未通过'"
              type="text"
              size="small"
              @click="update(scope.row.id, 0)"
            >修改
            </el-button>
            <el-button
              v-if="scope.row.onlineStatus === '待审核' || scope.row.onlineStatus === '已下线'"
              type="text"
              size="small"
              @click="handleStatus(scope.row.id, 2)"
            >审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";

	export default {
		name: "Case",
		data () {
			return {
				tableHeight: 0,
				form: {
					pathL: "/doctor/typicalDiseasesArticle/getListByConditions",
					diseasesTitle: "",
					onlineStatus: Number(this.$route.query.onlineStatus) || '',
					publisher: "",
					belongedType: "",
					beginDate: "",
					endDate: "",
					beginDatePublish: this.$route.query.start || '',
					endDatePublish: this.$route.query.end || '',
					platformType: ''//来源
				},
				createDate: [ "", "" ],
				date: [ "", "" ],
				source: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "平台",
						value: 0
					},
					{
						label: "哆咖医生",
						value: 1
					},
				],
				status: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "待审核",
						value: 0
					},
					{
						label: "审核通过",
						value: 2
					},
					{
						label: "已上线",
						value: 1
					},
					{
						label: "已下线",
						value: 3
					},
					{
						label: "审核未通过",
						value: 4
					}
				],
				data: [],
				pageNum: 1,
				pageSize: 10
			};
		},
		watch: {
			createDate (now) {
				this.form.beginDate = now[ 0 ];
				this.form.endDate = now[ 1 ];
			},
			date (now) {
				this.form.beginDatePublish = now[ 0 ];
				this.form.endDatePublish = now[ 1 ];
			}
		},
		mounted () {
			if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
				this.date = [ this.$route.query.start, this.$route.query.end ];
			}
			if (this.$route.query.onlineStatus != undefined) {
				this.form.onlineStatus = Number(this.$route.query.onlineStatus);
			}

			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
			})
			window.onresize = () => {
				this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
			}
		},
		methods: {
			// 获取数据列表
			getData (data) {
				this.data = data.result;
				this.data.forEach(item => {
					const belongedType = JSON.parse(item.belongedType);
					item.belongedType = belongedType.map(i => i.label).join(",");
					item.platformType = item.platformType == 1 ? '哆咖医生' : '平台';
				});
				this.pageNum = data.pageNum;
				this.pageSize = data.pageSize;
			},
			// 修改编辑
			update (id) {
				this.$router.push({
					path: "/news/case/update",
					query: {id}
				});
			},
			// 修改病例状态
			handleStatus (id, onlineStatus) {
				const xhr = (id, onlineStatus) => {
					const getData = this.$refs.layout.getData;
					this.$post("/data/my", {
						pathL: "/doctor/typicalDiseasesArticle/updateOnlineStatus",
						id,
						onlineStatus
					}).then(res => {
						if (res.state === 0) {
							this.$message({
								type: "success",
								message: "设置成功",
								center: true
							});
							getData();
						}
						else {
							this.$message({
								message: res.msg,
								center: true
							});
						}
					});
				};
				if (onlineStatus === 2) {
					this.$confirm("审核结果，是否通过", "提示", {
						distinguishCancelAndClose: true,
						confirmButtonText: "是",
						cancelButtonText: "否",
						type: "warning"
					})
						.then(() => {
							xhr(id, 2);
						})
						.catch(action => {
							if (action === "cancel") {
								xhr(id, 4);
							}
						});
				}
				else {
					xhr(id, onlineStatus);
				}
			},
			// 预览
			preview (id) {
				this.$router.push({
					path: "/news/case/preview/app",
					query: {id}
				});
			},
			// 表格序号
			serialNumber (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 导出excel
			exportExcel () {
				const form = {...this.form};
				exportExcel(
					"doctor/typicalDiseasesArticle/getListByConditionsExcel",
					form
				);
			}
		}
	};
</script>

<style lang="scss" scoped>
  .case {
    width: 100%;
    height: 100%;
  }
</style>

