<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--筛选条件-->
      <el-form ref="form" size="mini" style="margin-top:18px" :model="form" inline label-width="100px">
        <el-form-item label="家庭号">
          <el-input v-model="form.familyNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="form.deviceSn" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备ID状态">
          <el-select v-model="form.activateState" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="已绑定" value="1"></el-option>
            <el-option label="未绑定" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备激活地点">
          <el-select style="width:100%" v-model="form.provinceName" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in provinceName" :key="index" :label="item.provinceName"
                       :value="item.provinceName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="health-bottom">
      <div class="title-bar">
        <p>设备列表（共{{pageLength}}条）</p>
        <el-button @click="exportExcel" size="mini" type="primary">导 出</el-button>
      </div>
      <!--table列表-->
      <div ref="table" class="column-bottom" v-loading="loading" element-loading-text="拼命加载中">
        <el-table ref="data" :height="tableHeight" :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="familyNo" label="家庭号" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="SN" label="设备ID" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="appVersion" label="当前版本号" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="serviceName" label="服务套餐" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" label="设备激活时间" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ipCity" label="设备激活地点" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="SN" label="绑定ID状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.SN !== null">已绑定</span>
              <span v-if="scope.row.SN == null">未绑定</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" fixed="right" width="150" align="center">
            <template slot-scope="scope">
              <el-button @click="bind(scope.row)" v-if="scope.row.SN == null" type="text" size="small">绑定设备ID
              </el-button>
              <el-button @click="bindNo(scope.row)" v-if="scope.row.SN !== null" type="text" size="small">解绑设备ID
              </el-button>
              <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="pageLength">
      </el-pagination>
    </div>

    <!-- 解绑设备ID 对话框 -->
    <el-dialog :visible.sync="bindNoDialog" width="20%" center :modal-append-to-body='false' style="margin-top: 20vh">
      <span>一旦解除设备ID后，该设备ID将会作废，需要重现绑定新的设备ID。</span>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
        <el-button type="primary" @click="bindNoBtn">解绑</el-button>
        <el-button type="info" @click="bindNoDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 绑定设备ID 对话框 -->
    <el-dialog :visible.sync="bindDialog" width="20%" center :modal-append-to-body='false' style="margin-top: 20vh">
      <el-form :model="ruleFormZi" :rules="rulesZi" ref="ruleFormZi" class="demo-ruleForm">
        <el-form-item label="" prop="equipmentId">
          <el-input v-model="ruleFormZi.equipmentId" placeholder="请输入设备ID"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
        <el-button type="primary" @click="bindBtn">绑定</el-button>
        <el-button type="info" @click="bindDialog = false">关闭</el-button>
      </span>
    </el-dialog>

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
				tableHeight:0,
				loading: false, //加载标识
				//绑定设备ID的Form验证
				ruleFormZi: {
					equipmentId: ""
				},
				rulesZi: {
					equipmentId: [
						{required: true, message: "请输入设备ID", trigger: "blur"}
					]
				},
				bindNoDialog: false, //解绑设备ID
				bindDialog: false, //绑定设备ID
				//检索条件
				form: {
					familyNo: "", //家庭号
					deviceSn: "", //设备ID
					activateState: "", //设备ID状态
					provinceName: "" //设备激活地点
				},
				provinceName: [], //设备激活地点
				//数据列表
				tableData: [],
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1, //当前页码
				familyNo: "", //家庭号
				deviceSn: "" //设备SN
			};
		},

		beforeRouteEnter (to, from, next) {
			if (from.name !== "商品管理/设备管理/列表/详情") {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.form) {
						vm.form[ i ] = "";
					}
					vm.queryList();
				});
			}
			else {
				next(vm => {
					vm.queryList();
				});
			}
		},
		methods: {
			//获取省份列表
			getProvinces () {
				this.$get("/data/my", {
					pathL: "/common/area/getAreaList",
					provinceId: 0
				}).then(res => {
					this.provinceName = res;
				});
			},
			//获取table列表
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/common/deviceOperating/getDeviceList",
					familyNo: this.form.familyNo, //家庭号
					deviceSn: this.form.deviceSn, //设备ID
					activateState: this.form.activateState, //设备ID状态
					provinceName: this.form.provinceName, //设备激活地点
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize //每页显示得条数
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 搜索查询按钮
			search () {
				this.pageNum = 1;
				this.queryList();
			},
			//查看 按钮
			view (row) {
				this.$router.push({
					name: "商品管理/设备管理/列表/详情",
					query: {
						familyNo: row.familyNo, //家庭号
						deviceId: row.deviceId, //设备Id
						appVersion: row.appVersion, //当前版本号
						SN: row.SN, //绑定状态
						serviceName: row.serviceName, //服务套餐
						ipCity: row.ipCity, //设备激活地点
						createTime: row.createTime, //设备激活时间
						indate: row.indate //服务套餐有效期
					}
				});
			},
			// 解绑设备ID 按钮
			bindNo (row) {
				this.bindNoDialog = true;
				this.familyNo = row.familyNo;
				this.deviceSn = row.SN;
			},
			bindNoBtn () {
				this.$post("/data/my", {
					pathL: "/common/deviceBinding/unbingding",
					familyNo: this.familyNo,
					deviceSn: this.deviceSn
				}).then(res => {
					this.bindNoDialog = false;
					if (res.state === 0) {
						this.queryList();
					}
				});
			},
			//绑定设备ID 按钮
			bind (row) {
				this.bindDialog = true;
				this.familyNo = row.familyNo;
			},
			bindBtn () {
				this.$post("/data/my", {
					pathL: "/common/deviceBinding/bingding",
					familyNo: this.familyNo,
					deviceSn: this.ruleFormZi.equipmentId
				}).then(res => {
					if (res.state === 0) {
						this.bindDialog = false;
						this.queryList();
					}
					else {
						this.bindDialog = true;
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//导出
			exportExcel () {
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let urlL = `
               ${ realm }common/deviceOperating/exportDeviceExcelFile?
               &version=${ version }
               &familyNo=${ this.form.familyNo }
               &deviceSn=${ this.form.deviceSn }
               &activateState=${ this.form.activateState }
               &provinceName=${ this.form.provinceName }
            `;
				this.$get("/data/exportExecl", {
					url: urlL.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			}
		},
		mounted () {

			this.queryList();
			this.getProvinces();
			// 获取 table 高度
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;
			})
			window.onresize=()=>{
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -185;

			}
		},
		watch: {
			bindDialog (display) {
				if (display === false) {
					setTimeout(() => {
						this.$refs[ "ruleFormZi" ].resetFields();
					}, 500);
				}
			}
		},
		computed: {},
		activated () {
		},
		deactivated () {
		}
	};
</script>

