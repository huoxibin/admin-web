<template>
  <div class="health comment">
    <div class="health-top">
      <div class="title-bar">
        <p>筛选查询</p>
        <el-button @click="search(form)" size="mini" type="primary">搜索查询</el-button>
      </div>
      <!--检索条件-->
      <el-form
        ref="form"
        inline
        style="margin-top:18px;"
        :model="form"
        size="mini"
        label-width="100px"
      >
        <el-form-item label="医生姓名">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>

        <el-form-item label="哆咖医生号">
          <el-input v-model="form.doctorId"></el-input>
        </el-form-item>

        <el-form-item label="地区">
          <base-local @handleArea="handleArea" :form="form"></base-local>
        </el-form-item>

        <el-form-item label="职称">
          <el-select v-model="form.titleId" placeholder="请选择">
            <el-option
              v-for="item in titleList"
              :key="item.id"
              :label="item.titleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间筛选">
          <el-date-picker
            v-model="form.date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="账号状态">
          <el-select v-model="beforeAccountStatus" placeholder="请选择" @change="dealAccountStatus">
            <el-option
              v-for="item in accountState"
              :key="item.id"
              :label="item.state"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--title栏-->
    <div class="health-bottom">
      <div class="title-bar" style="border-top: 1px solid #ccc">
        <p>
          <span>医护列表</span>
          <span>（共{{ pageLength }}条）</span>
          <span style="margin-left:20px;">图文咨询总次数:</span>
          <span>{{ totalImage }}</span>
          <span style="margin-left:20px;">语音咨询总次数:</span>
          <span>{{ totalAudio }}</span>
          <span style="margin-left:20px;">视频咨询总次数:</span>
          <span>{{ totalVideo }}</span>
        </p>
        <el-button @click="exportExcle" size="mini" type="primary">导出</el-button>
      </div>
      <!--数据列表-->
      <div class="column-bottom" ref="table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table height="100%" :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
          <el-table-column prop="doctorId" label="哆咖医生号" align="center"></el-table-column>
          <el-table-column prop="area" label="地区" align="center"></el-table-column>
          <el-table-column prop="hospital" label="所属机构" align="center"></el-table-column>
          <el-table-column prop="department" label="所属科室" align="center"></el-table-column>
          <el-table-column prop="title" label="职称" align="center"></el-table-column>
          <el-table-column prop="patient" label="累积服务患者数" align="center"></el-table-column>
          <el-table-column prop="earn" label="累计收入" align="center"></el-table-column>
          <el-table-column prop="image" label="图文咨询次数" align="center"></el-table-column>
          <el-table-column prop="audio" label="语音咨询次数" align="center"></el-table-column>
          <el-table-column prop="video" label="视频咨询次数" align="center"></el-table-column>
          <el-table-column prop="duration" label="累计在线时长" align="center"></el-table-column>
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
	import { isText } from "@/utils/RegExp";

	export default {
		//name: "",
		//components: {},
		//props:[],
		//filters:{},
		data () {
			return {
				loading: false, //加载表示
				//禁用日期
				pickerOptions: {
					disabledDate: time => {
						return time.getTime() > Date.now();
					}
				},
				//检索表单
				form: {
					doctorName: "", //医生姓名
					doctorId: "", //哆咖医生号
					date: [], //时间筛选
					provinceId: "",
					cityId: "",
					countyId: "",
					titleId: "",
					accountStatus: {
						normalAccount: 0,
						forbidenAccount: 1
					}
				},
				titleList: [],
				//列表数据
				tableData: [],
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1, //当前页码
				totalImage: "", //图文咨询总次数
				totalAudio: "", //语音咨询总次数
				totalVideo: "", //视频咨询总次数
				accountState: [
					{
						state: "全部",
						id: 0
					},
					{
						state: "启用",
						id: 1
					},
					{
						state: "禁用",
						id: 2
					}
				],
				beforeAccountStatus: 0
			};
		},
		created () {
			this.getTitleList();
		},
		methods: {
			// 获取职称列表
			getTitleList () {
				this.$get("/data/my", {
					pathL: "/doctor/medical/getTitleList"
				}).then(res => {
					if (res.state === 0) {
						this.titleList = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 获取地级id
			handleArea (data) {
				this.form.provinceId = data.provinceId;
				this.form.cityId = data.cityId;
				this.form.countyId = data.countyId;
			},
			//获取table列表
			queryList () {
				if (isText(this.form.doctorName) || this.form.doctorName === "") {
					this.loading = true;
					this.$post("/data/my", {
						pathL: "/doctor/doctorInfo/statistics",
						doctorName: this.form.doctorName, //医生姓名
						provinceId: this.form.provinceId,
						cityId: this.form.cityId,
						countyId: this.form.countyId,
						titleId: this.form.titleId,
						doctorId: this.form.doctorId, //哆咖医生号
						startTime: this.form.date === null ? "" : this.form.date[ 0 ], //时间筛选开始
						endTime: this.form.date === null ? "" : this.form.date[ 1 ], //时间筛选结束
						pageNum: this.pageNum, //当前页码
						pageSize: this.pageSize, //每页显示得条数
						accountStatus: JSON.stringify(this.form.accountStatus) //账号状态
					}).then(res => {
						this.loading = false;
						if (res.state === 0) {
							this.tableData = res.data.result.list; //数据列表
							this.totalImage = res.data.result.totalImage; //图文咨询总次数
							this.totalAudio = res.data.result.totalAudio; //语音咨询总次数
							this.totalVideo = res.data.result.totalVideo; //视频咨询总次数
							this.pageLength = res.data.total;
						}
						else {
							this.$message({
								message: res.msg,
								center: true
							});
						}
					});
				}
				else {
					this.$message({
						message: "请输入正确的医生姓名",
						center: true
					});
				}
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 搜索信息
			search (form) {
				if (form.doctorId.replace(/[^\d]/g).includes(undefined)) {
					this.$message({
						message: "请输入正确的哆咖医生号",
						type: "warning",
						center: true
					});
				}
				else {
					this.pageNum = 1;
					this.queryList();
				}
			},
			//导出
			exportExcle () {
				let startTime_export = this.form.date.length ? this.form.date[ 0 ] : "";
				let endTime_export = this.form.date.length ? this.form.date[ 1 ] : "";

				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let url = `
                ${ realm }doctor/doctorInfo/statistics/excel?
                  &version=${ version }
                  &doctorName=${ this.form.doctorName }
                  &provinceId=${ this.form.provinceId }
                  &cityId=${ this.form.cityId }
                  &titleId=${ this.form.titleId }
                  &countyId=${ this.form.countyId }
                  &doctorId=${ this.form.doctorId }
                  &startTime=${ startTime_export }
                  &endTime=${ endTime_export }
                  &accessToken=${ this.$store.getters.accessToken }
                `;
				this.$get("/data/exportExecl", {
					url: url.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			},
			dealAccountStatus () {
				switch (this.beforeAccountStatus) {
					case 0: //账号状态  全部
						this.form.accountStatus.normalAccount = 0;
						this.form.accountStatus.forbidenAccount = 1;
						break;
					case 1: //账号状态  启用
						this.form.accountStatus.normalAccount = 0;
						this.form.accountStatus.forbidenAccount = -1;
						break;
					case 2: //账号状态  禁用
						this.form.accountStatus.normalAccount = -1;
						this.form.accountStatus.forbidenAccount = 1;
						break;
				}
			}
		},
		mounted () {
			this.queryList();
		}
	};
</script>



