<template>
  <div class="health comment">
    <!-- 搜索表单 -->
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <div>
          <el-button @click="reset(form)" size="mini" type="primary">重 置</el-button>
          <el-button
            :disabled="(form.province !== '' &&  form.city === '') || (form.city !== '' &&  form.area === '') "
            @click="search(form)"
            size="mini"
            type="primary"
          >搜索查询
          </el-button>
        </div>
      </div>

      <el-form
        style="margin-top:18px"
        inline
        ref="form"
        size="mini"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="团队名称">
          <el-input v-model="form.teamName" placeholder="输入团队名称"></el-input>
        </el-form-item>
        <el-form-item label="队长名称">
          <el-input v-model="form.captainName" placeholder="输入队长名字"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-select style="width:120px" v-model="form.province" @change="currentSel" label="请选择">
            <el-option
              v-for="(item,index) in province"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span style="color: #606266;">省/市</span>

          <el-select style="width:120px" v-model="form.city" label="请选择" @change="citySel">
            <el-option
              v-for="(item,index) in city"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span style="color: #606266;">市</span>

          <el-select style="width:120px" v-model="form.area" @change="areaSel">
            <el-option
              v-for="(item,index) in area"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span style="color: #606266;">区/县</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

    </div>
    <!-- 数据表格 -->
    <div class="health-bottom">
      <div class="title-bar">
        <span>家医团队列表（共{{pageLength}}条）</span>
        <el-button @click="add" size="mini" type="primary">新增团队</el-button>
      </div>
      <div ref="table" class="column-bottom">
        <el-table
          ref="data"
          height="100%"
          :data="data"
          border
          stripe
          style="width: 100%;height:100%;"
          v-loading="loading"
          element-loading-text="正在加载中"
        >
          <el-table-column prop="name" show-overflow-tooltip label="家医团队名称" align="center"></el-table-column>
          <el-table-column prop show-overflow-tooltip label="队长姓名（职称）" align="center" width="200px">
            <template slot-scope="scope">{{scope.row.captainName}} ( {{scope.row.titleName}} )</template>
          </el-table-column>
          <el-table-column prop="hospitalName" show-overflow-tooltip label="队长执业机构" align="center"></el-table-column>
          <el-table-column prop="mobile" show-overflow-tooltip label="队长手机号" align="center"></el-table-column>
          <el-table-column
            prop="countInfo[0].teamMemberCount"
            show-overflow-tooltip
            label="队员人数"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="countInfo[0].signFamilyCount"
            show-overflow-tooltip
            label="服务家庭数(户)"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="countInfo[0].signMemberCount"
            show-overflow-tooltip
            label="服务患者数（名）"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="countInfo[0].packItemCount"
            show-overflow-tooltip
            label="服务包数"
            align="center"
          ></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" align="center"></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" align="center"></el-table-column>
          <el-table-column prop="status" show-overflow-tooltip label="是否隐藏" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status===1"
                @change="status(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="120" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="find(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="update(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
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
				loading: true,
				form: {
					teamName: "", //团队名称
					captainName: "", //队长名称
					province: "",
					city: "",
					area: "",
					date: [] //日期
				},
				data: [],
				province: [], //省列表
				city: [], //市列表
				area: [], //区/县列表
				pageLength: 0,
				pageSize: 10,
				pageNum: 1
			};
		},

		methods: {
			// 修改数据状态
			status (row) {
				this.$post("/data/my", {
					pathL: "/doctor/teamInfo/editTeamStatus",
					teamId: row.teamId,
					status: 4 - row.status
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							type: "success",
							message: "设置成功",
							center: true
						});
						this.queryList();
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//获取省列表
			getProvinceList () {
				this.$get("/data/my", {
					pathL: "/common/area/findAreaList",
					provinceId: 0
				}).then(res => {
					if (res.state === 0) {
						this.province = res.data;
						// console.log(this.city);
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//根据省获取市列表
			getCityList (val) {
				this.$get("/data/my", {
					pathL: "/common/area/findAreaList",
					provinceId: val
				}).then(res => {
					if (res.state === 0) {
						this.city = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//根据市获取区/县列表
			getAreaList (val) {
				this.$get("/data/my", {
					pathL: "/common/area/findAreaList",
					cityId: val
				}).then(res => {
					if (res.state === 0) {
						this.area = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//省列表值被选中事件
			currentSel (selVal) {
				this.form.city = "";
				this.form.area = "";
				this.area.length = 0;
				this.getCityList(selVal);
			},
			//市列表值被选中事件
			citySel (cityVal) {
				this.form.area = "";
				this.getAreaList(cityVal);
			},
			//区/县列表值被选中事件
			areaSel (areaVal) {
				this.form.area = areaVal;
			},
			//家医团队列表接口
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/teamInfoOperating/teamList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					teamName: this.form.teamName, //团队名称
					captainName: this.form.captainName, //队长名称
					areaId: this.form.area == "" ? '' : this.form.area, //区/县ID
					createTimeB: this.form.date == null ? '' : this.form.date[ 0 ], //团队创建时间-起始
					createTimeE: this.form.date == null ? '' : this.form.date[ 1 ] //团队创建时间-终止
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.data = res.data.result;
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
			// 重置搜索表单
			reset (form) {
				for (let i in form) {
					form[ i ] = "";
				}
				this.pageNum = 1;
				this.queryList();
			},
			// 搜索信息
			search (form) {
				this.pageNum = 1;
				this.queryList();
			},
			// 跳转新增路由
			add () {
				this.$router.push({
					name: "医护管理/团队管理/家医团队列表/新增家医团队"
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				// console.log(val);
				this.pageNum = val;
				this.queryList();
			},
			// 编辑
			update (row) {
				this.$router.push({
					name: "医护管理/团队管理/家医团队列表/编辑家医团队",
					query: {
						id: row.teamId
					}
				});
			},
			// 查看
			find (row) {
				this.$router.push({
					name: "医护管理/团队管理/家医团队列表/家医团队详情",
					query: {
						id: row.teamId
					}
				});
			},
			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.date = [ this.$route.query.start, this.$route.query.end ];
					this.queryList();
				}
				else {
					this.queryList();
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			if (
				from.name !== "医护管理/团队管理/家医团队列表/家医团队详情" &&
				from.name !== "医护管理/团队管理/家医团队列表/编辑家医团队"
			) {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.form) {
						vm.form[ i ] = "";
					}
					vm.initPage();
				});
			}
			else {
				next(vm => {
					vm.initPage();
				});
			}
		},
		mounted () {

			this.initPage();
			this.getProvinceList();
		}
	};
</script>

