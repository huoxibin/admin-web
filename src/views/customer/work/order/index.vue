<template>
  <div class="health comment">
    <base-layout ref="layout" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form
        slot="form"
        :inline="true"
        :model="form"
        size="mini"
        label-width="100px"
      >
        <el-form-item label="工单号">
          <el-input v-model="form.workOrderNo"></el-input>
        </el-form-item>
        <el-form-item label="工单标题">
          <el-input v-model="form.workOrderTitle"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.createName"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input v-model="form.receiverName"></el-input>
        </el-form-item>
        <el-form-item label="结单人">
          <el-input v-model="form.updateName"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="form.workOrderType">
            <el-option label="全部" value></el-option>
            <el-option
                    v-for="item in orderType"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="form.status">
            <el-option label="全部" value></el-option>
            <el-option label="待处理" :value="1"></el-option>
            <el-option label="已解决" :value="2"></el-option>
            <el-option label="已关闭" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <base-date v-model="date" type="daterange"></base-date>
        </el-form-item>
        <el-form-item label="工单分类">
          <el-select v-model="form.orderType">
            <el-option label="全部" value></el-option>
            <el-option label="售后工单" :value="1"></el-option>
            <el-option label="健康工单" :value="2"></el-option>
            <el-option label="线索工单" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- btns -->
      <div slot="btns" class="pull-right">
        <el-button
          size="mini"
          type="primary"
          @click="$router.push('/work/category')"
        >类型工单
        </el-button
        >
        <el-button size="mini" type="primary" @click="dialogVisible = true"
        >新增工单
        </el-button
        >
        <el-button size="mini" type="success" @click="exportExcel"
        >导出
        </el-button
        >
      </div>

      <!-- 表格 -->
      <div slot="table" class="health-bottom">
        <div class="table-radio">
          <!--我的工单、全部工单-->
          <el-radio-group
            style="margin: 10px"
            v-model="form.isAll"
            @change="handleChange"
            size="mini"
          >
            <el-radio-button label="我的工单"></el-radio-button>
            <el-radio-button v-show="allOrderActive" label="全部工单"></el-radio-button>
          </el-radio-group>
        </div>
        <!--表格数据-->
        <div class="column-bottom">
          <el-table
            height="100%"
            ref="multipleTable"
            :data="data"
            style="width: 100%;"
            border
            stripe
            @sort-change="handleSortChange"
          >
            <el-table-column type="index" :index="serialNumber" label="序号" align="center" width="50px"></el-table-column>
            <el-table-column prop="workOrderNo" label="工单号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="workOrderTitle" label="工单标题" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.urge === 2" style="color: #f00"
                >【催】</span
                >
                <span>{{ scope.row.workOrderTitle }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="customerName" label="客户姓名" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="电话号码" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="workOrderTypeName" label="工单类型" align="center" show-overflow-tooltip sortable="custom"></el-table-column>
            <el-table-column prop="workOrderLevel" label="工单等级" align="center" show-overflow-tooltip sortable="custom">
              <template slot-scope="scope">
                <span v-if="scope.row.workOrderLevel === 1">普通</span>
                <span v-if="scope.row.workOrderLevel === 2">重大</span>
                <span v-if="scope.row.workOrderLevel === 3">加急</span>
              </template>
            </el-table-column>
            <el-table-column prop="doctorNameRtn" label="预计处理时间" align="center" show-overflow-tooltip sortable="custom">
              <template slot-scope="scope">
                <span v-if="scope.row.workOrderLevel === 1">24小时</span>
                <span v-if="scope.row.workOrderLevel === 2">12小时</span>
                <span v-if="scope.row.workOrderLevel === 3">8小时</span>
              </template>
            </el-table-column>
            <el-table-column prop="createName" label="创建人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="工单状态" align="center" show-overflow-tooltip sortable="custom">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">待处理</span>
                <span v-if="scope.row.status === 2">已解决</span>
                <span v-if="scope.row.status === 3">已关闭</span>
              </template>
            </el-table-column>
            <el-table-column prop="receiverName" label="受理人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip sortable="custom">
              <template slot-scope="scope">
                <span>
                  {{scope.row.createTime.split('.')[0]}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="updateName" label="结单人" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">- -</span>
                <span v-else>{{ scope.row.updateName }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="provinceName" label="所属省市" align="center" show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="sn" label="SN号" align="center" show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="familyNo" label="家庭号" align="center" show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="updateTime" label="最新派单时间" align="center" show-overflow-tooltip sortable="custom">-->
              <!--<template slot-scope="scope">-->
                <!--<span>-->
                  <!--{{scope.row.updateTime.split('.')[0]}}-->
                <!--</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="updateTime" label="结单时间" align="center" show-overflow-tooltip sortable="custom">-->
              <!--<template slot-scope="scope">-->
                <!--<span v-if="scope.row.status === 1">- -</span>-->
                <!--<span v-else>{{ scope.row.updateTime.split('.')[0] }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column fixed="right" label="操作" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="preview(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </base-layout>

    <!-- add -->
    <el-dialog
      title="选择工单分类"
      :visible.sync="dialogVisible"
      width="50%"
      :append-to-body="true"
    >
      <el-button
        v-for="item in btns"
        :key="item.value"
        size="mini"
        type="primary"
        @click="add(item.value)"
      >{{ item.label }}
      </el-button
      >
    </el-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";

	export default {
		name: "WorkOrder",
		data () {
			return {
				form: {
					pathL: "/customer/workOrder/getWorkOrderList",
					workOrderNo: "",//工单号
					workOrderTitle: "",//工单标题
					createName: "",//创建人
					receiverName: "",//受理人
					updateName: "",//结单人
					phone: "",//手机号
					sn: "",
					familyNo: "",
					provinceId: "",
					cityId: "",
					workOrderType: "",//工单类型
					status: "",//工单状态
					createTimeStart: "",//创建开始时间
					createTimeEnd: "",//创建结束时间
					orderType: '',//工单分类
					isAll: ""//我的工单、全部工单
				},
				date: [],
				orderType: [],
				dialogVisible: false,
				data: [],
				btns: [
					{
						label: "售后工单",
						value: "afterSale"
					},
					{
						label: "健康服务工单",
						value: "health"
					},
					{
						label: "线索工单",
						value: "clue"
					}
				],
				pageNum: 1,
				pageSize: 10,
				province: [],
				city: [],
				allOrderActive: false
			};
		},
		watch: {
			date (now) {
				this.form.createTimeStart = now[ 0 ];
				this.form.createTimeEnd = now[ 1 ];
			}
		},
		mounted () {
			this.initPage();
		},
		created () {
			this.getArea();
			//运营平台配置的按钮权限
			const btnArr = this.$store.getters.menuInfo.btnMenu;
			btnArr.forEach(item => {
				if (item.menuName == '客服平台') {
					for (let it of item.btnList) {
						let linkUrl = it.linkUrl;
						if (linkUrl == "allOrder") {
							this.allOrderActive = true;
						}
					}
				}
			});
			this.getOrderType();
			this.form.isAll = "我的工单";
			this.initPage();
		},
		methods: {
			// 导出
			exportExcel () {
				const form = {...this.form};
				delete form.pathL;
				form.userId = this.$store.getters.userId;
				exportExcel("customer/workOrder/exportExcelWorkOrder", form);
			},
			// 排序
			handleSortChange (val) {
				const getData = this.$refs.layout.getData;
				if (val.prop) {
					const toLine = name => name.replace(/([A-Z])/g, "_$1").toLowerCase();
					const list = {
						descending: "desc",
						ascending: "asc"
					};
					this.form.sortProperty = toLine(val.prop);
					this.form.sortType = list[ val.order ];
				}
				else {
					this.form.sortProperty = "";
					this.form.sortType = "";
				}
				getData();
			},
			// 获取工单类型
			getOrderType () {
				this.$get("/data/my", {
					pathL: "/customer/orderType/getOrderTypeList"
				}).then(res => {
					if (res.state === 0) {
						this.orderType = res.data.rootNodes;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 获取省信息
			getArea () {
				this.$get("/data/my", {
					pathL: "/common/area/getAreaList",
					provinceId: 0
				}).then(res => {
					this.province = res;
				});
			},
			// 改变地级信息
			handleArea (provinceId) {
				this.form.cityId = "";
				this.$get("/data/my", {
					pathL: "/common/area/getAreaList",
					provinceId
				}).then(res => {
					this.city = res;
				});
			},
			// 获取数据
			getData (res) {
				this.pageNum = res.pageNum;
				this.pageSize = res.pageSize;
				this.data = res.result;
				this.dealTableListShow(this.data);
			},
			// 处理页面显示的 "--"
			dealTableListShow (data) {
				for (let item of data) {
					for (let it in item) {
						if (item[ it ] == "" || item[ it ] == null) {
							item[ it ] = "--";
						}
					}
				}
			},
			// 表格序号
			serialNumber (index) {
				return (this.pageNum - 1) * this.pageSize + (index + 1);
			},
			// 全部工单/我的工单
			handleChange (val) {
				const getData = this.$refs.layout.getData;
				this.$refs.layout.pageNum = 1;
				this.form.isAll = val;
                getData();
			},
			add (type) {
				this.$router.push({
					path: "/work/order/add",
					query: {type}
				});
			},
			// 查看
			preview (row) {
				this.$router.push({
					path: "/work/order/list/preview",
					query: {
						type: row.orderType,//1是售后、2是健康、3是线索
						id: row.id,//工单号
						urge: row.urge,//催单标识
						phoneNumber: row.phone,//手机号
						status: row.status//工单状态（1待处理、2已解决、3已关闭）
					}
				});
			},
			//从工作台跳转过来
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.createTimeStart = this.$route.query.start;
					this.form.createTimeEnd = this.$route.query.end;
					this.date = [ this.$route.query.start, this.$route.query.end ];
					this.form.status = 1;//待处理
					this.form.orderType = this.$route.query.orderType;//工单分类
					this.form.createBy = this.$store.getters.userId;//创建人
					// this.form.receiverName = this.$store.getters.userInfo.userName;//受理人
					const getData = this.$refs.layout.getData;
					getData();
				}
				else {
					this.form.orderType = '';//工单类型
					this.form.createBy = '';//创建人
					this.form.status = '';
				}
			}
		},
    /*beforeRouteEnter(to, from, next) {
     if (from.name !== "工单管理/工单管理/查看") {
     next(vm => {
     // console.log(vm);
     vm.$refs.layout.pageNum =1;//分页组件从第一页开始
     vm.pageNum =1;//列表序号
     vm.serialNumber(vm.pageNum);//列表序号
     vm.form.isAll = '我的工单';
     // ----------方法一
     const getData = vm.$refs.layout.getData;
     getData();
     // ----------方法二
     /!*const data = {
     pathL: "/customer/workOrder/getWorkOrderList",
     workOrderNo: "",//工单号
     workOrderTitle: "",//工单标题
     createName: "",//创建人
     receiverName: "",//受理人
     updateName: "",//结单人
     phone: "",//手机号
     sn: "",
     familyNo: "",
     provinceId: "",
     cityId: "",
     workOrderType: "",
     status: "",
     createTimeStart: "",
     createTimeEnd: "",
     isAll: "我的工单",
     pageNum: 1,
     pageSize: vm.pageSize
     };
     vm.$get("/data/my", data ).then(res => {
     if (res.state === 0) {
     vm.loading = false;
     vm.data = res.data.result;
     vm.total = res.data.total;
     } else {
     vm.$message({
     message: res.msg,
     center: true
     });
     }
     });*!/
     });
     } else {
     next(vm => {
     vm.getData();
     });
     }

     },
     watch:{
     $route(now){
     if(now.name!=='工单管理/工单管理'){
     this.dialogVisible = false;
     }
     }
     }*/
	};
</script>

