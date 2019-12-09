<template>
  <div class="health comment">
    <!-- title -->
    <div class="title-bar">
      <p>服务码列表</p>
    </div>
    <!-- 搜索 -->
    <div class="service-top">
      <el-button @click="dialogVisibleBinds=true" size="mini" type="primary">绑定套餐</el-button>
      <div class="search">
        <el-input size="mini" style="width:200px" v-model="searchValue" placeholder="可搜索SN号"></el-input>
        <el-button size="mini" @click="search(searchValue)" type="primary">搜索查询</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div ref="table" class="column-bottom">
      <el-table
        ref="resData"
        :data="resData"
        height="100%"
        border
        stripe
        style="width: 100%;"
        v-loading="loading"
        element-loading-text="正在加载中"
      >
        <el-table-column show-overflow-tooltip type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="SN" label="SN号" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" label="操作时间" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="packName" label="绑定套餐" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="find(scope.row)"
              v-if="scope.row.packId !== null"
              type="text"
              size="small"
            >查看
            </el-button>
            <el-button
              @click="bind(scope.row)"
              v-if="scope.row.packId == null"
              type="text"
              size="small"
            >绑定套餐
            </el-button>
            <el-select
              size="mini"
              style="width:150px;margin-left:10px"
              v-model="scope.row.deviceSnType"
              @change="userChange(scope.row)"
            >
              <el-option label="正式用户" :value="2"></el-option>
              <el-option label="测试用户" :value="1"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>
    <!-- 查看模态框 -->
    <el-dialog
      ref="findData"
      :data="findData"
      center
      :append-to-body="true"
      title="SN号绑定套餐"
      :visible.sync="dialogVisibleFind"
      width="30%"
      :show-close="false"
    >
      <ul class="find-list">
        <li>
          <span>SN号：</span>
          <span v-text="findData.SN"></span>
        </li>
        <li>
          <span>绑定套餐名：</span>
          <span v-text="findData.packName"></span>
        </li>
        <li>
          <span>价格：</span>
          <span v-text="findData.price"></span>
        </li>
        <li>
          <span>操作时间：</span>
          <span v-text="findData.updateTime"></span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          style="width:100px"
          size="mini"
          @click="dialogVisibleFind = false"
        >关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 绑定单个模态框 -->
    <el-dialog
      center
      :append-to-body="true"
      title="请绑定套餐"
      :visible.sync="dialogVisibleBind"
      width="50%"
    >
      <el-form ref="bindForm" :model="bindForm" label-width="100px" size="mini">
        <!-- 套餐选择 -->
        <el-form-item label="套餐选择">
          <el-select style="width:100%" v-model="bindForm.setMeal">
            <el-option
              v-for="item,index in mealData"
              :key="index"
              :label="item.name"
              :value="item.name + ',' + item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- SN号段 -->
        <el-form-item>
          <el-radio-group v-model="bindForm.type">
            <el-radio :label="1">绑定单个SN号段</el-radio>
            <el-radio :label="2">SN号段绑定</el-radio>
            <el-radio :label="3">绑定全部SN号段</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="bindForm.type===1" label="SN号">
          <el-input v-model="bindForm.strSnlist1"></el-input>
        </el-form-item>

        <el-form-item v-show="bindForm.type===2" label="SN号">
          <div class="sn">
            <div class="sn-Form">
              <el-input v-model="searchSn.snStart"></el-input>
              <span class="el-icon-minus"></span>
              <el-input v-model="searchSn.snEnd"></el-input>
            </div>
            <div class="sn-btn">
              <el-button
                size="mini"
                @click="snSearch(searchSn.snStart,searchSn.snEnd)"
                type="primary"
              >搜 索
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="bindForm.type===2" v-show="snsShow">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>SN号列表</span>
            </div>
            <div v-loading="loading1" element-loading-text="正在加载中">
              <div v-for="item,index in snList" :key="index" class="text item">{{item.SN}}</div>
            </div>
          </el-card>
          <p style="text-align: center;margin-top:10px;">共 {{snList.length}} 条</p>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button style="width:100px" size="mini" @click="bindSubmit(bindForm)" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 绑定模态框 -->
    <el-dialog
      center
      :append-to-body="true"
      title="请绑定套餐"
      :visible.sync="dialogVisibleBinds"
      width="50%"
    >
      <el-form ref="bindsForm" :model="bindsForm" label-width="100px" size="mini">
        <el-form-item label="套餐选择">
          <el-select style="width:100%" v-model="bindsForm.setMeal">
            <el-option
              v-for="item,index in mealData"
              :key="index"
              :label="item.name"
              :value="item.name + ',' + item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="bindsForm.type">
            <el-radio :label="1">绑定单个SN号段</el-radio>
            <el-radio :label="2">SN号段绑定</el-radio>
            <el-radio :label="3">绑定全部SN号段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="bindsForm.type===1" label="SN号">
          <el-input v-model="bindsForm.strSnlist1"></el-input>
        </el-form-item>
        <el-form-item v-if="bindsForm.type===2" label="SN号">
          <div class="sn">
            <div class="sn-Form">
              <el-input v-model="searchSn.snStart"></el-input>
              <span class="el-icon-minus"></span>
              <el-input v-model="searchSn.snEnd"></el-input>
            </div>
            <div class="sn-btn">
              <el-button
                size="mini"
                @click="snSearch(searchSn.snStart,searchSn.snEnd)"
                type="primary"
              >搜 索
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="bindsForm.type===2" v-show="snsShow">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>SN号列表</span>
            </div>
            <div v-for="item,index in snList" :key="index" class="text item">{{item.SN}}</div>
          </el-card>
          <p style="text-align: center;margin-top:10px;">共 {{snList.length}} 条</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="width:100px"
          size="mini"
          @click="bindsSubmit(bindsForm)"
          type="primary"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				loading: true,
				loading1: true,
				searchValue: "",
				resData: [], //列表数据
				findData: {}, //查看按钮数据
				mealData: [], //套餐列表
				bindForm: {
					//绑定单个套餐
					setMeal: "",
					type: "",
					strSnlist1: "", //绑定单个SN号段
					strSnlist2: "", //SN号段绑定
					strSnlist3: "" //绑定全部SN号段
				},
				bindsForm: {
					//绑定套餐
					setMeal: "",
					type: "",
					strSnlist1: "", //绑定单个SN号段
					strSnlist2: "", //SN号段绑定
					strSnlist3: "" //绑定全部SN号段
				},
				searchSn: {
					//搜索SN号段
					snStart: "",
					snEnd: ""
				},
				snList: [],
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1, //当前页码
				accessToken: this.$store.getters.accessToken,
				dialogVisibleFind: false,
				dialogVisibleBinds: false,
				dialogVisibleBind: false,
				snsShow: false
			};
		},
		methods: {
			userChange (row) {
				this.$post("/data/my", {
					pathL: "/common/device/updateSNType",
					deviceId: row.id,
					snType: row.deviceSnType
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
						this.queryList();
					}
				});
			},
			queryList () {
				this.loading = true;
				//服务码列表
				this.$get("/data/my", {
					pathL: "/common/device/getDeviceList",
					accessToken: this.accessToken,
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					deviceSn: ""
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.resData = res.data.result;
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
			search (searchValue) {
				// 按SN号搜索服务码列表
				console.log(searchValue);
				this.$get("/data/my", {
					pathL: "/common/device/getDeviceList",
					accessToken: this.accessToken,
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					deviceSn: searchValue
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.resData = res.data.result;
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
			querymealData () {
				//下拉选择套餐列表
				this.$get("/data/my", {
					pathL: "/family/familyServicepackage/getPackageList",
					accessToken: this.accessToken
				}).then(res => {
					if (res.state === 0) {
						//console.log(res)
						this.mealData = res.data;
						//console.log(this.mealData)
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			handleCurrentChange (val) {
				// 页数请求
				this.pageNum = val;
				this.queryList();
			},
			find (row) {
				// 查看
				//alert(row.id + row.SN + row.updateTime + row.packName + row.packId + row.price)
				this.findData = row;
				this.dialogVisibleFind = true;
			},
			bind (row) {
				// 绑定
				this.dialogVisibleBind = true;
				this.bindForm.strSnlist1 = row.SN;
				this.bindForm.type = 1;
			},
			snSearch (snStart, snEnd) {
				// 搜索多个sn号
				//console.log(snStart, snEnd);
				this.$get("/data/my", {
					pathL: "/common/device/getSNList",
					accessToken: this.accessToken,
					start: snStart,
					end: snEnd
				}).then(res => {
					if (res.state === 0) {
						this.loading1 = false;
						let resData = res.data;
						this.snList = resData;
						let snArr = [];
						for (let i in resData) {
							snArr.push(resData[ i ].SN);
						}
						this.bindForm.strSnlist2 = snArr.join(","); //绑定单个套餐
						this.bindsForm.strSnlist2 = snArr.join(","); //绑定套餐
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
				this.snsShow = true;
			},
			bindSubmit (bindForm) {
				// 单个绑定套餐
				//console.log(bindForm)
				let packArr = [];
				let setmealStr = bindForm.setMeal;
				let snValue = "";
				let snKind = "";
				packArr = setmealStr.split(",");
				if (bindForm.type == "1") {
					snValue = bindForm.strSnlist1;
					snKind = "1";
				}
				else if (bindForm.type == "2") {
					snValue = this.bindForm.strSnlist2;
					snKind = "2";
				}
				else {
					snValue = bindForm.strSnlist3;
					snKind = "3";
				}
				this.$get("/data/my", {
					pathL: "/common/device/bindPackage",
					accessToken: this.accessToken,
					packId: packArr[ 1 ],
					packName: packArr[ 0 ],
					kind: snKind,
					sn: snValue
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							message: "绑定成功",
							type: "success",
							center: true
						});
						this.bindForm.setMeal = ""; //清空下拉选择框
						this.bindForm.type = ""; //清空单选按钮
						this.bindForm.strSnlist1 = ""; //清空下拉选择框
						this.searchSn.snStart = ""; //清空SN区间
						this.searchSn.snEnd = ""; //清空SN区间
						this.dialogVisibleBind = false; //关闭弹框
						this.snsShow = false; //关闭SN下拉展示列表
						this.queryList(); //刷新列表
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			bindsSubmit (bindsForm) {
				// 绑定套餐
				console.log(bindsForm);
				let packArr = [];
				let setmealStr = bindsForm.setMeal;
				let snValue = "";
				let snKind = "";
				packArr = setmealStr.split(",");
				if (bindsForm.type == "1") {
					snValue = bindsForm.strSnlist1;
					snKind = "1";
				}
				else if (bindsForm.type == "2") {
					snValue = this.bindsForm.strSnlist2;
					snKind = "2";
				}
				else {
					snValue = bindsForm.strSnlist3;
					snKind = "3";
				}
				this.$get("/data/my", {
					pathL: "/common/device/bindPackage",
					accessToken: this.accessToken,
					packId: packArr[ 1 ],
					packName: packArr[ 0 ],
					kind: snKind,
					sn: snValue
				}).then(res => {
					if (res.state === 0) {
						this.$message({
							message: "绑定成功",
							type: "success",
							center: true
						});
						this.bindsForm.setMeal = ""; //清空下拉选择框
						this.bindsForm.type = ""; //清空单选按钮
						this.bindsForm.strSnlist1 = ""; //清空下拉选择框
						this.searchSn.snStart = ""; //清空SN区间
						this.searchSn.snEnd = ""; //清空SN区间
						this.dialogVisibleBinds = false; //关闭弹框
						this.snsShow = false; //关闭SN下拉展示列表
						this.queryList(); //刷新列表
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			}
		},
		mounted: function () {
			this.queryList(); //列表
			this.querymealData(); //套餐列表
		}
	};
</script>

<style scoped>


  .service-top {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
  }

  .service-bottom {
    width: 100%;
    flex: 1;
    overflow-y: auto;
  }

  .search {
    width: 300px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .find-list li {
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .find-list li span:nth-of-type(1) {
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }

  .sn {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .sn-Form {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .sn-btn {
    margin-left: 50px;
  }
</style>
