<template>
  <div class="health comment">
    <!-- 搜索表单 -->
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <div>
          <el-button @click="reset(form)" size="mini" type="primary">重 置</el-button>
          <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
        </div>
      </div>

      <el-form
        ref="form"
        inline
        style="margin-top:18px;"
        :model="form"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="机构名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="机构地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-select
            style="width:160px"
            v-model="form.provinceId"
            @change="getRegion(1,form.provinceId)"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item,index in province"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
          <span style="color: #606266;">省/市</span>
          <el-select style="width:160px" v-model="form.cityId" @change="getRegion(2,form.cityId)">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item,index in city"
              :key="index"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
          <span style="color: #606266;">市</span>
          <el-select style="width:160px" v-model="form.countyId">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item,index in county"
              :key="index"
              :label="item.countyName"
              :value="item.countyId"
            ></el-option>
          </el-select>
          <span style="color: #606266;">区/县</span>
        </el-form-item>
        <el-form-item label="机构等级">
          <el-select v-model="form.levelId">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item,index in levelList"
              :key="index"
              :label="item.levelName"
              :value="item.levelId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </div>
    <!-- 数据表格 -->
    <div class="health-bottom" v-loading="loading" element-loading-text="拼命加载中">
      <div class="title-bar">
        <span>医院机构列表（共{{pageLength}}条）</span>
        <div>
          <el-button @click="dialogVisible=true;" size="mini" type="success">导 入</el-button>
          <el-button @click="exportExcel" size="mini" type="primary">导 出</el-button>
        </div>
      </div>
      <div ref="table" class="column-bottom">
        <el-table id="table" ref="data" :height="tableHeight" :data="data" border stripe style="width: 100%;height:100%;">
          <el-table-column show-overflow-tooltip prop="name" label="机构名称" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="address" label="医院地址" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" label="地区" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="street" label="街道/村镇" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="levelName" label="机构等级" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
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
    <!-- 导入模态框 -->
    <el-dialog :append-to-body="true" title="导入数据" :visible.sync="dialogVisible" width="50%" center>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :file-list="fileList"
        :headers="uploadHeaders"
        :on-success="onSuccess"
        name="excel"
        :limit="1"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
      >
        <el-button size="small" type="success">导入文件</el-button>
      </el-upload>
    </el-dialog>
    <!-- 导入失败提示 -->
    <el-dialog
      :append-to-body="true"
      title="部分数据导入失败"
      :visible.sync="dialogTableVisible"
      width="50%"
      center
    >
      <el-button
        style="float:right;margin:0 0 10px 0;"
        @click="exportErrExcel"
        size="mini"
        round
        type="primary"
      >导出列表
      </el-button>
      <el-table
        ref="errData"
        id="errData"
        :data="errData"
        border
        stripe
        height="400"
        style="width:100%"
      >
        <el-table-column show-overflow-tooltip prop="name" label="机构名称" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="医院地址" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="countyId" label="区县/编码" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="street" label="街道/村镇" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="levelName" label="机构等级" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="introduce" label="医院简介" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="comment" label="失败原因" align="center">
          <template slot-scope="scope">
            <p style="color:#f00">{{scope.row.comment}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
	import FileSaver from "file-saver";
	import XLSX from "xlsx";

	export default {
		data () {
			return {
				tableHeight:0,
				loading: false,
				fileList: [],
				dialogVisible: false,
				dialogTableVisible: false,
				errData: [],
				uploadUrl: "/data/excel",
				uploadHeaders: {
					accessToken: this.$store.getters.accessToken,
					pathL: "/doctor/areaHospital/import"
				},
				form: {
					name: "",
					address: "",
					provinceId: "",
					cityId: "",
					countyId: "",
					levelId: ""
				},
				data: [],
				province: [],
				city: [],
				county: [],
				levelList: [],
				pageLength: 0,
				pageNum: 1,
				pageSize: 10
			};
		},
		beforeRouteEnter (to, from, next) {
			if (
				from.name !== "机构管理/医院机构/医院机构列表/医院机构详情" &&
				from.name !== "机构管理/医院机构/医院机构列表/编辑医院机构"
			) {
				next(vm => {
					vm.pageNum = 1;
					for (let i in vm.form) {
						vm.form[ i ] = "";
					}
					vm.getData(false);
				});
			}
			else {
				next(vm => {
					vm.getData(false);
				});
			}
		},
		methods: {
			// 获取数据列表
			getData (search) {
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/doctor/areaHospital/list",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					name: this.form.name,
					address: this.form.address,
					provinceId: this.form.provinceId,
					cityId: this.form.cityId,
					countyId: this.form.countyId,
					levelId: this.form.levelId
				}).then(res => {
					if (res.state === 0) {
						this.data = res.data.page.result;
						this.pageLength = res.data.page.total;
						this.loading = false;
						if (search) {
							this.$message({
								message: "搜索完成",
								type: "success",
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
			// 重置搜索表单
			reset (form) {
				for (let i in form) {
					form[ i ] = "";
				}
				this.$message({
					message: "搜索表单已重置",
					type: "success",
					center: true
				});
			},
			// 切换省份
			getRegion (type, id) {
				if (id !== "") {
					switch (type) {
						case 1:
							this.form.cityId = "";
							this.form.countyId = "";
							this.city = [];
							this.county = [];
							this.$get("/data/my", {
								pathL: "/common/area/getAreaList",
								provinceId: id
							}).then(res => {
								this.city = res;
							});
							break;
						case 2:
							this.form.countyId = "";
							this.$get("/data/my", {
								pathL: "/common/area/getAreaList",
								cityId: id
							}).then(res => {
								this.county = res;
							});
							break;
					}
				}
				else {
					switch (type) {
						case 1:
							this.form.cityId = "";
							this.form.countyId = "";
							this.city = [];
							this.county = [];
							break;
						case 2:
							this.form.countyId = "";
							this.county = [];
							break;
					}
				}
			},
			// 搜索信息
			search (form) {
				this.pageNum = 1;
				this.getData(true);
			},
			// 上传成功
			onSuccess (response, file, fileList) {
				switch (response.state) {
					case 0:
						this.$message({
							message: "导入成功",
							type: "success",
							center: true
						});
						this.dialogVisible = false;
						this.fileList = fileList;
						this.getData();
						break;
					case 1:
						this.dialogTableVisible = true;
						this.dialogVisible = false;
						this.errData = response.data;
						this.getData();
						break;
					default:
						this.$message({
							message: response.msg,
							center: true
						});
				}
			},
			// 失败导出
			exportErrExcel () {
        /* generate workbook object from table */
				var wb = XLSX.utils.table_to_book(document.querySelector("#errData"));
        /* get binary string as output */
				var wbout = XLSX.write(wb, {
					bookType: "xls",
					bookSST: true,
					type: "array"
				});
				try {
					FileSaver.saveAs(
						new Blob([ wbout ], {type: "application/octet-stream"}),
						"导入失败的医院机构列表.xls"
					);
				}
				catch (e) {
					if (typeof console !== "undefined") console.log(e, wbout);
				}
				return wbout;
			},
			// 限制文件
			handleExceed (files, fileList) {
				this.$message({
					type: "warning",
					message: "当前限制上传一个文件",
					center: true
				});
			},
			// 删除文件
			handleRemove (file, fileList) {
			},
			// 导出表格
			exportExcel () {
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let url = `
      ${ realm }doctor/areaHospital/export?
        &version=${ version }
        &name=${ this.form.name }
        &address=${ this.form.address }
        &provinceId=${ this.form.provinceId }
        &cityId=${ this.form.cityId }
        &countyId=${ this.form.countyId }
        &levelId=${ this.form.levelId }
        &accessToken=${ this.$store.getters.accessToken }
      `;
				this.$get("/data/exportExecl", {
					url: url.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.getData();
			},
			// 查看
			find (row) {
				this.$router.push({
					name: "机构管理/医院机构/医院机构列表/医院机构详情",
					query: {
						id: row.id
					}
				});
			},
			// 编辑
			update (row) {
				this.$router.push({
					name: "机构管理/医院机构/医院机构列表/编辑医院机构",
					query: {
						id: row.id
					}
				});
			}
		},
		mounted () {
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -85;
			})
			window.onresize=()=>{
				this.tableHeight = window.innerHeight - this.$refs.data.$el.offsetTop -85;
      }
			this.getData();
			// 获取省市地区
			this.$get("/data/my", {
				pathL: "/common/area/getAreaList",
				provinceId: 0
			}).then(res => {
				this.province = res;
			});
			// 获取机构等级
			this.$post("/data/my", {
				pathL: "/doctor/areaHospital/level"
			}).then(res => {
				if (res.state === 0) {
					this.levelList = res.data;
				}
				else {
					this.$message({
						message: res.msg,
						center: true
					});
				}
			});
		},
		watch: {
			dialogVisible (now) {
				if (now === false) {
					this.fileList = [];
				}
			}
		}
	};
</script>

<style scoped>
  .hospital {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
  }

  .hospital-top {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .hospital-bottom {
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: column wrap;
    border-top: 1px solid #ccc;
    overflow: hidden;
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

  .table {
    flex: 1;
    overflow: auto;
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
