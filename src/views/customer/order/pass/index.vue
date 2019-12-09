<template>
  <div class="health comment">
    <base-layout ref="layout" methods="post" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="医生姓名">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="预约人姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="预约状态">
          <el-select v-model="form.status">
            <el-option label="全部" value></el-option>
            <el-option label="未处理" :value="1"></el-option>
            <el-option label="已处理" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <base-date v-model="date"></base-date>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button size="mini" type="success" @click="exportExcel">导 出</el-button>
      </div>
      <!-- 表格 -->
      <el-table slot="table" height="100%" :data="data" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="订单号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="预约人姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="doctorName" label="医生姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hospitalName" label="医院名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="date" label="预约时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="预约手机号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="预约状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.status === 2">已处理</p>
            <p v-else>未处理</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detail(scope.row.id)">查看</el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status === 1"
              @click="handleStatus(scope.row)"
            >已处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
    <!-- 查看订单信息 -->
    <el-dialog title="查看订单信息" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <el-form
        :model="detailForm"
        size="mini"
        label-width="100px"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <div class="detail-form">
          <div class="form-left">
            <el-form-item label="订单号">
              <el-input v-model="detailForm.orderNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="医生姓名">
              <el-input v-model="detailForm.doctorName" disabled></el-input>
            </el-form-item>
            <el-form-item label="预约时间">
              <el-input v-model="detailForm.date" disabled></el-input>
            </el-form-item>
            <el-form-item label="预约状态">
              <el-input v-model="detailForm.status===1?'未处理 ':'已处理'" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="detailForm.idCard" disabled></el-input>
            </el-form-item>
            <el-form-item label="疾病名称">
              <el-input v-model="detailForm.diseaseName" disabled></el-input>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item label="预约人姓名">
              <el-input v-model="detailForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="医院名称">
              <el-input v-model="detailForm.hospitalName" disabled></el-input>
            </el-form-item>
            <el-form-item label="预约手机号">
              <el-input v-model="detailForm.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-input v-model="detailForm.birthday" disabled></el-input>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-input v-model="detailForm.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="疾病详情">
              <el-input v-model="detailForm.diseaseDetail" disabled type="textarea"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
	import exportExcel from "@/api/excel";

	export default {
		name: "UserInfo",
		data: () => ({
			date: [ "", "" ],
			form: {
				pathL: "/doctor/greenchannelOrder/list",
				orderNum: "",
				doctorName: "",
				name: "",
				status: "",
				createTimeStart: "",
				createTimeEnd: ""
			},
			detailForm: {},
			data: [],
			loading: false,
			dialogVisible: false
		}),
		watch: {
			date (now) {
				this.form.createTimeStart = now[ 0 ];
				this.form.createTimeEnd = now[ 1 ];
			}
		},
		methods: {
			// 获取列表数据
			getData (data) {
				this.data = data.result;
			},
			// 查看详情
			detail (id) {
				this.dialogVisible = true;
				this.loading = true;
				this.$post("/data/my", {
					pathL: "/doctor/greenchannelOrder/details",
					id
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.detailForm = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 处理状态
			handleStatus (row) {
				const getData = this.$refs.layout.getData;
				this.$post("/data/my", {
					pathL: "/doctor/greenchannelOrder/status",
					id: row.id,
					status: 3 - row.status
				}).then(res => {
					if (res.state === 0) {
						getData();
						this.$message({
							message: "设置成功",
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
			},
			// 导出excel
			exportExcel () {
				exportExcel("doctor/greenchannelOrder/export", this.form);
			},
			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
					this.form.createTimeStart = this.$route.query.start;
					this.form.createTimeEnd = this.$route.query.end;
					this.date = [ this.$route.query.start, this.$route.query.end ];
				}
				this.$refs.layout.getData();
			}
		},
		mounted () {
			this.initPage();
		}
	};
</script>


