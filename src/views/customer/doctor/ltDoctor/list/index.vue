<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button size="mini" type="primary" @click="getData">查询结果</el-button>

      </div>
      <!-- 检索条件 -->
      <el-form class="m-t-10" slot="serach" :inline="true" :model="serach" size="mini" label-width="80px">
        <el-form-item label="输入搜索">
          <el-input v-model="serach.val" placeholder="姓名/医院/科室"></el-input>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-select v-model="serach.status" @change="changeVal">
            <el-option v-for="(item,index) in serach.statusList" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <span>数据列表</span>
      </div>
      <!-- 表格 -->
      <div class="column-bottom">
        <el-table slot="table" height="100%" :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="org" label="机构名称" align="center"></el-table-column>
          <el-table-column prop="departments" label="科室" align="center"></el-table-column>
          <el-table-column prop="title" label="职称" align="center"></el-table-column>
          <el-table-column prop="accountStatus" label="账号状态" align="center"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="170">
            <template slot-scope="scope">
              <el-button type="text" @click="showRowInfo(scope.$index, scope.row)"
                         v-if="scope.row.accountStatus=='关闭绿通' || scope.row.accountStatus=='开启绿通'" size="small">查看
              </el-button>
              <el-button type="text" @click="changeRecordStatus(scope.$index, scope.row,1)"
                         v-if="scope.row.accountStatus=='开启绿通'" size="small">关闭绿通
              </el-button>
              <el-button type="text" @click="changeRecordStatus(scope.$index, scope.row,2)"
                         v-if="scope.row.accountStatus=='关闭绿通'" size="small">开启绿通
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--- 分页---->
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                     :total="form.pageLength">
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="查看医生" width="800px" append-to-body :visible.sync="dialogFormVisible">
      <table class="orientation-table">
        <tr>
          <td class="w-60 w-s-n">
            姓名
          </td>
          <td class="w-s-n">
            {{form.name}}
          </td>
          <td class="w-60 w-s-n">
            机构名称
          </td>
          <td>
            {{form.org}}
          </td>
          <td class="w-60 w-s-n">
            科室
          </td>
          <td>
            {{form.departments}}
          </td>
        </tr>
        <tr class="bge">
          <td class="w-60 w-s-n">
            职称
          </td>
          <td class="w-s-n">
            {{form.title}}
          </td>
          <td class="w-60 w-s-n">
            账号状态
          </td>
          <td>
            {{form.accountStatus}}
          </td>
          <td class="w-60 w-s-n">
            出诊时间
          </td>
          <td>
            {{form.outTime}}
          </td>
        </tr>
        <tr>
          <td class="w-60 w-s-n">
            擅长
          </td>
          <td colspan="5">
            {{form.special}}
          </td>
        </tr>
      </table>
      <el-row type="flex" justify="center" class="m-t-10">
        <el-col :span="3">
          <el-button type="primary" class="m-t-10 text-center" @click="dialogFormVisible = false" size="mini">关闭
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
	export default {
		data: () => ({
			dialogFormVisible: false,//开启弹窗
			formLabelWidth: '300px',
			pageNum: 1,//当前页
			pageSize: 10,//每页条数
			serach: { //搜索相关
				val: '',//搜索关键字
				status: '',//搜索状态
				statusList: [
					{
						label: '请选择',
						value: ''
					},
					{
						label: '关闭绿通',
						value: '1'
					},
					{
						label: '开启绿通',
						value: '2'
					}
				]
			},
			form: {
				pageLength: 0,//总长度
				name: '',
				org: '',//机构名称
				departments: '',//科室名称
				title: '',//职称
				accountStatus: '',//账号状态
				outTime: '',
				special: ''
			},
			tableData: []
		}),
		mounted () {
			this.getData();
		},
		methods: {
			handleSizeChange (val) {
				let sh = this.search;
				sh.pageSize = val//每页条数
				this.searchCourseList();
			},
			handleCurrentChange (val) {
				let sh = this.search;
				sh.pageNum = val;//当前页
				this.searchCourseList();
			},
			changeVal () {
				if (this.serach.status == 0) {
					this.serach.status = '';
				}
			},
			// 获取表格数据
			getData () {
				this.changeVal();
				let that = this;
				this.$post("/data/my", {
					pathL: "/doctor/greenchannelDoctor/list",
					pageNum: this.pageNum,//页码
					pageSize: this.pageSize,//页数
					name: this.serach.val,
					disable: this.serach.status//账号状态
				}).then(res => {
					if (!res.state) {
						that.dealTableData(res.data.result);
						that.form.pageLength = res.data.total;
					}
				})
			},
			dealTableData (data) {
				let that = this;
				this.tableData = [];
				data.forEach((item, index) => {
					const it = {
						name: item.name,
						org: item.hospital,//机构名称
						departments: item.department,//科室名称
						title: item.theTitle,//职称
						accountStatus: that.changeStatus(item.disable),//账号状态
						outTime: item.visit,
						special: item.goodAt,
						id: item.id//课程id
					}
					that.$nextTick(function () {
						that.tableData.push(it);
					})
				})
			},
			changeStatus (n) {
				switch (n) {
					case 1: {
						return '关闭绿通'
					}
						break;
					case 2: {
						return '开启绿通'
					}
						break;
				}
			},
			showRowInfo (index, row) {
				this.dialogFormVisible = true;
				this.form.name = row.name;
				this.form.org = row.org;//机构名称
				this.form.departments = row.departments;//科室名称
				this.form.title = row.title;//职称
				this.form.accountStatus = row.accountStatus;//账号状态
				this.form.outTime = row.outTime;
				this.form.special = row.special;
			},
			changeRecordStatus (index, row, fg) { //关闭绿通
				let that = this;
				//更新记录状态
				this.$post('/data/my', {
					pathL: '/doctor/greenchannelDoctor/status',
					disable: fg,
					id: row.id
				}).then(res => {
					if (!res.state) {
						if (fg == 1) {
							that.$message("关闭成功");
						}
						else {
							that.$message("开启成功");
						}
						that.getData();//更新列表状态
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleSizeChange (val) {
				this.pageSize = val;
				this.getData();
			},
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			loadData () { ///加载数据

			}
		}
	}
</script>

<style scoped>

</style>
