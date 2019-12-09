<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button size="mini" type="primary" @click="search">搜索查询</el-button>
      </div>
      <el-form
        ref="form"
        size="mini"
        style="margin-top:18px"
        :model="form"
        inline
        label-width="100px"
      >
        <el-form-item label="姓名">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="医生号">
          <el-input v-model="form.doctorId" placeholder="请输入纯数字"></el-input>
        </el-form-item>
        <el-form-item label="账户类型">
          <el-select v-model="form.accountType">
            <el-option label="全部" value></el-option>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="银行卡" value="银行卡"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.accountChars"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar" style="border-top:1px solid #ccc;">
        <p>数据列表</p>
        <el-button size="mini" @click="exportExcel" type="primary">导 出</el-button>
      </div>
      <div class="column-bottom" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="data" border stripe style="width: 100%">
          <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="id" label="医生号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accountType" label="账户类型" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accountNumber" label="账号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="bankName" label="开户行" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="relieve(scope.row)" type="text" size="small">解除绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				loading: false,
				form: {
					doctorName: "",
					doctorId: "",
					accountType: "",
					accountChars: ""
				},
				data: [],
				pageSize: 10,
				pageLength: 0,
				pageNum: 1
			};
		},
		methods: {
			// 获取数据
			getData (search) {
				if (isNaN(this.form.doctorId)) {
					this.form.doctorId = "";
					this.$message({
						message: "请输入正确的医生号",
						type: "warning",
						center: true
					});
					return;
				}
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/doctorAccount/operatingAccountList",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					doctorName: this.form.doctorName,
					doctorId: this.form.doctorId,
					accountType: this.form.accountType,
					accountChars: this.form.accountChars
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.data = res.data.result;
						this.pageLength = res.data.total;
						if (search) {
							this.$message({
								type: "success",
								message: "完成搜索",
								center: true
							});
						}
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 导出
			exportExcel () {
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let url = `
      ${ realm }doctor/doctorAccount/accountExportToExcelFile?
        &version=${ version }
        &accessToken=${ this.$store.getters.accessToken }
        &doctorName=${ this.form.doctorName }
        &doctorId=${ this.form.doctorId }
        &accountType=${ this.form.accountType }
        &accountChars=${ this.form.accountChars }
      `;
				this.$get("/data/exportExecl", {
					url: url.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			},
			// 搜索
			search () {
				this.pageNum = 1;
				this.getData(true);
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			//   解除绑定
			relieve (row) {
				this.$confirm(
					"确认解除账号绑定，系统会默认添加人已同意清空此账号信息。",
					"确认解绑",
					{
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}
				)
					.then(() => {
						this.$post("/data/my", {
							pathL: "/doctor/doctorAccount/resetAccountToNull",
							doctorId: row.id
						}).then(res => {
							if (res.state === 0) {
								this.getData();
								this.$message({
									type: "success",
									message: "解绑成功",
									center: true
								});
							}
							else {
								this.$message({
									message: res.msg,
									center: true
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "取消解绑",
							center: true
						});
					});
			}
		},
		mounted () {
			this.getData();
		}
	};
</script>

<style scoped>
  .patient {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
  }

  .table {
    flex: 1;
    width: 100%;
    overflow: auto;
  }

  .form {
    display: flex;
  }

  .left,
  .right {
    flex: 1;
  }

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }

  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
