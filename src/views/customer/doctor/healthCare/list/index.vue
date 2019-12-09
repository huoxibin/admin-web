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
        class="m-t-20"
        style="width:100%"
        inline
        ref="form"
        size="mini"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="输入搜索">
          <el-input style="width:100%" v-model="form.search" placeholder="姓名／哆咖医生号／手机号"></el-input>
        </el-form-item>

        <el-form-item label="所属机构">
          <!--下拉框搜索-->
          <!--<el-select style="width:100%" v-model="form.organization">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in organizations"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
          </el-select>-->
          <el-input style="width:100%" v-model="form.hospital" placeholder="请输入机构名称"></el-input>
          <!--智能搜索-->
          <!--<el-autocomplete
              v-model="form.hospital"
              style="width: 100%"
              ref="autoInput"
              @blur="autoFocusOut"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
              placeholder="请输入内容">
          </el-autocomplete>-->
        </el-form-item>

        <el-form-item label="科室">
          <el-select style="width:100%" v-model="form.department" value="">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item,index) in departmentName"
              :key="index"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称">
          <el-select style="width:100%" v-model="form.title">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item,index) in titleName"
              :key="index"
              :label="item.titleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职业类型">
          <el-select style="width:100%" v-model="form.category">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item,index) in occupationType"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="认证状态">
          <el-select style="width:120px" v-model="form.checked">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item,index) in authStatus"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账号状态">
          <el-select v-model="form.disable">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item,index) in accountStatus"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="显示状态">
          <el-select v-model="form.isHide">
            <el-option label="全部" value></el-option>
            <el-option label="开启" :value="0"></el-option>
            <el-option label="关闭" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册日期">
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
        <span>数据列表（共{{pageLength}}条）</span>
        <div>
          <el-button @click="exportExcel" size="mini" type="primary">导 出</el-button>
          <el-button @click="add" size="mini" type="primary">新增医生</el-button>
        </div>
      </div>
      <div ref="table" class="column-bottom">
        <el-table
          ref="data"
          height="100%"
          :data="tableData"
          border
          stripe
          v-loading="loading"
          element-loading-text="正在加载中"
        >
          <el-table-column
            prop="doctorName"
            show-overflow-tooltip
            label="姓名"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            prop="doctorId"
            show-overflow-tooltip
            label="哆咖医生号"
            align="center"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            show-overflow-tooltip
            label="手机号"
            align="center"
            width="120px"
          ></el-table-column>
          <el-table-column prop="hospitalName" show-overflow-tooltip label="机构名称" align="center"></el-table-column>
          <el-table-column prop="area" show-overflow-tooltip label="地区" align="center"></el-table-column>
          <el-table-column prop="departmentName" show-overflow-tooltip label="科室" align="center"></el-table-column>
          <el-table-column
            prop="teamRole"
            show-overflow-tooltip
            label="是否家医"
            align="center"
            width="80px"
          >
            <template slot-scope="scope">{{scope.row.teamRole === 0 ? '否' : '是'}}</template>
          </el-table-column>
          <el-table-column prop="titleName" show-overflow-tooltip label="职称" align="center"></el-table-column>
          <el-table-column prop="teamName" show-overflow-tooltip label="家医团队" align="center"></el-table-column>
          <el-table-column
            prop="disable"
            show-overflow-tooltip
            label="账号状态"
            align="center"
            width="80px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.disable=== 0" style="font-size: 12px">启用</span>
              <span v-if="scope.row.disable=== 1" style="font-size: 12px;color:red">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="inviteNum" show-overflow-tooltip label="邀请医生数量" align="center">
            <template slot-scope="scope">
              <div
                style="color:#409EFF;cursor:pointer;text-align: center"
                @click="inviteRecord(scope.row)"
              >{{scope.row.inviteNum}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalMoney" show-overflow-tooltip label="累计获得现金奖励" align="center"></el-table-column>
          <el-table-column prop="checked" show-overflow-tooltip label="认证状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.checked=== 0" style="color:#c7c4c4">资质未提交</span>
              <span v-if="scope.row.checked=== 1" style="color:#ff5133">资质待认证</span>
              <span v-if="scope.row.checked=== 2" style="color:#323232">资质已认证</span>
              <span v-if="scope.row.checked=== -1" style="color:#ff8653">资质认证失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="uploadTime" show-overflow-tooltip label="认证提交时间" align="center"></el-table-column>
          <el-table-column prop="isHide" show-overflow-tooltip label="显示状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isHide===0"
                @change="status(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="250px">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
              <!--<el-button @click="find(scope.row)" type="text" size="small" :disabled="scope.row.checked ===2 ? true :false">资质认证</el-button>-->
              <!-- <el-button @click="stop(scope.row)" type="text" size="small" :disabled="scope.row.disable ===1 ? true :false">禁用</el-button>
              <el-button @click="start(scope.row)" type="text" size="small" :disabled="scope.row.disable === 1 ? false :true">启用</el-button>-->
              <el-button
                @click="stop(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.disable ===0"
              >禁用
              </el-button>
              <el-button
                @click="start(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.disable ===1"
              >启用
              </el-button>
              <el-button
                @click="find(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.checked ===1"
              >资质认证
              </el-button>
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

    <!-- 资质认证对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible"
      center
      :modal-append-to-body="false"
      v-loading="loadingZiZhi"
      element-loading-text="正在资质认证中"
    >
      <el-form
        :model="ruleFormZi"
        :rules="rulesZi"
        ref="ruleFormZi"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="disable_causes" style="margin-top: 10px">
          <el-form-item label="认证结果：" prop="cardChecked">
            <el-radio-group v-model="ruleFormZi.cardChecked">
              <el-radio :label="2">通过</el-radio>
              <el-radio :label="-1">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="remarks" v-if="ruleFormZi.cardChecked == '2'">
          <el-form-item label="证件号码：" prop="cardNo">
            <el-input placeholder="请输入医生的身份证号码以便排重" v-model="ruleFormZi.cardNo"></el-input>
          </el-form-item>
        </div>
        <div class="remarks" v-if="ruleFormZi.cardChecked == '-1'">
          <el-form-item label="备注：" prop="checkDescription">
            <el-input type="textarea" v-model="ruleFormZi.checkDescription"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFormZiCancel(ruleFormZi)">取 消</el-button>
        <el-button type="primary" @click="submitFormZi(ruleFormZi)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 禁用按钮对话框 -->
    <el-dialog title="提示" :visible.sync="dialogStopVisible" center :modal-append-to-body="false">
      <div class="dialogCount">您确定要禁用该医护账号吗？</div>
      <div class="dialogCount" style="margin-top: 10px;line-height: 14px">
        <i class="el-icon-info"></i>
        <span style="padding-left: 5px">账号被禁用后该医护人员将无法登录医生端！</span>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="disable_causes" style="margin-top: 10px">
          <el-form-item label="禁用原因" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio :label="1">不够专业</el-radio>
              <el-radio :label="2">言论不合法</el-radio>
              <el-radio :label="3">被投诉过多</el-radio>
              <el-radio :label="4">其他原因</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="remarks">
          <el-form-item label="备注：" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            <span style="color:#606266">{{ruleForm.desc.length}}/50</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFormCancel(ruleForm)">取 消</el-button>
        <el-button type="primary" @click="submitForm(ruleForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 启用按钮对话框 -->
    <el-dialog title="提示" :visible.sync="dialogStartVisible" center :modal-append-to-body="false">
      <div class="dialogCount">您确定要启用该医护账号吗？</div>
      <div class="dialogCount" style="margin-top: 10px;line-height: 14px">
        <i class="el-icon-info"></i>
        <span style="padding-left: 5px">账号被启用后该医护人员将正常使用医生端！</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogStartVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitStart">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看邀请记录弹框-->
    <el-dialog
      title="查看邀请记录"
      :visible.sync="dialogInviteVisible"
      width="40%"
      top="5vh"
      center
      :modal-append-to-body="false"
    >
      <div class="inviteBox" v-loading="loadingInvite" element-loading-text="正在加载中">
        <div style="border-bottom: 1px solid #666;height: 30px">
          <h3>邀请信息</h3>
        </div>
        <div class="nvite_Form_All">
          <el-form
            label-position="left"
            class="nvite_Form_one"
            ref="inviteForm"
            :model="inviteForm"
            label-suffix=":"
          >
            <el-form-item label="姓名">{{inviteForm.doctorName}}</el-form-item>
            <el-form-item label="哆咖医生号">{{inviteForm.doctorId}}</el-form-item>
            <el-form-item label="总邀请数">{{inviteForm.inviteNum}}</el-form-item>
          </el-form>
          <el-form
            label-position="left"
            class="nvite_Form_two"
            ref="inviteForm"
            :model="inviteForm"
            label-suffix=":"
          >
            <el-form-item label="机构名称">{{inviteForm.hospitalName}}</el-form-item>
            <el-form-item label="手机号">{{inviteForm.mobile}}</el-form-item>
            <el-form-item label="累计获得现金奖励">{{inviteForm.totalMoney}}</el-form-item>
          </el-form>
        </div>
        <div style="border-bottom: 1px solid #666;height: 30px">
          <h3>邀请历史</h3>
        </div>
        <div style="height: 300px;overflow-y: auto">
          <el-table :data="gridData">
            <el-table-column property="name" label="被邀请人姓名"></el-table-column>
            <el-table-column property="createTime" align="center" label="邀请时间"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="inviteView(scope.row)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogInviteVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
  .health-bottom {
    overflow: auto;
  }

  .column-bottom {
    overflow: auto;
  }

  .nvite_Form_All {
    display: flex;
  }

  .nvite_Form_one {
    flex: 1;
  }

  .nvite_Form_two {
    flex: 2;
  }

  .dialogCount {
    width: 100%;
    display: flex;
    justify-content: center;
  }

</style>

<script>
	import { isValidCardNumber } from "@/utils/RegExp.js";

	var CheckNumber = (rule, value, callback) => {
		if (!value) {
			callback(new Error("请输入正确格式的身份证号码"));
		}
		else if (!isValidCardNumber(value)) {
			callback(new Error("请输入正确格式的身份证号码"));
		}
		else {
			callback();
		}
	};

	export default {
		name: "",
		components: {},
		props: [],
		data () {
			return {
				loadingInvite: false, //查看邀请记录加载标识
				//邀请人员名单
				gridData: [], //被邀请人员列表
				//邀请人的信息
				inviteForm: {
					doctorName: "--",
					hospitalName: "--",
					doctorId: "--",
					mobile: "--",
					inviteNum: "--",
					totalMoney: "--"
				},
				//禁用的Form验证
				ruleForm: {
					desc: "",
					type: ""
				},
				rules: {
					type: [ {required: true, message: "请选择", trigger: "change"} ],
					desc: [
						{required: true, message: "请填写备注", trigger: "blur"},
						{min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
					]
				},
				//资质认证的Form验证
				ruleFormZi: {
					cardChecked: "", //通过 不通过
					checkDescription: "", //备注
					cardNo: "" //证件号码
				},
				rulesZi: {
					cardChecked: [ {required: true, message: "请选择", trigger: "change"} ],
					checkDescription: [
						{required: true, message: "请输入", trigger: "change"}
					],
					cardNo: [ {required: true, validator: CheckNumber, trigger: "change"} ]
				},
				dialogInviteVisible: false,
				dialogFormVisible: false,
				dialogStopVisible: false,
				dialogStartVisible: false,
				radio: "",
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				pageNum: 1, //当前页码
				loading: false,
				loadingZiZhi: false, //资质认证对话框
				//检索条件
				form: {
					search: "", //姓名、智医号、手机号
					hospital: "", //所属机构
					department: "", //科室
					title: "", //职称
					category: "", //职业类型
					checked: "", //认证状态
					disable: "", //账号状态
					isHide: "",
					date: [],
					startTime: "", //注册开始时间
					endTime: "" //注册结束时间
				},
				organizations: [
					{value: "广东省第一医院", label: "广东省第一医院"},
					{value: "广东省第2医院", label: "广东省第2医院"},
					{value: "广东省第3医院", label: "广东省第3医院"},
					{value: "广东省第4医院", label: "广东省第5医院"}
				],
				departmentName: [], //科室列表
				titleName: [], //职称列表
				occupationType: [], //职业类型列表
				authStatus: [
					{id: 0, name: "资质未提交"},
					{id: 1, name: "资质待认证"},
					{id: 2, name: "资质已认证"},
					{id: -1, name: "资质认证失败"}
				],
				accountStatus: [ {id: 0, name: "启用"}, {id: 1, name: "禁用"} ],
				tableData: [],
				//资质ID
				ziZhiID: "",
				doctorId: "", //禁用医生ID
				doctorIdStart: "" //启用医生ID
			};
		},
		methods: {
			//邀请列表里面查看 页面跳转
			inviteView (row) {
				this.$router.push({
					name: "医护管理/医护管理/查看",
					query: {
						id: row.id,
						teamId: row.teamId,
						checkFlag: 0
					}
				});
			},
			//邀请记录
			inviteRecord (row) {
				this.dialogInviteVisible = true;
				this.loadingInvite = true;
				//邀请人的个人信息
				this.inviteForm.doctorName = row.doctorName;
				this.inviteForm.hospitalName = row.hospitalName;
				this.inviteForm.doctorId = row.doctorId;
				this.inviteForm.mobile = row.mobile;
				this.inviteForm.inviteNum = row.inviteNum;
				this.inviteForm.totalMoney = row.totalMoney;
				//获取被邀请人员列表
				this.$get("/data/my", {
					pathL: "/doctor/medical/getInviteDoctorList",
					doctorId: row.doctorId
				}).then(res => {
					this.loadingInvite = false;
					if (res.state === 0) {
						this.gridData = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 修改状态
			status (row) {
				console.log(row);
				this.$get("/data/my", {
					pathL: "/doctor/medical/showOrHide",
					doctorId: row.doctorId,
					kind: 1 - row.isHide
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
			dealDataTable (data) {
				data.forEach(item => {
					item.area = `${ item.provinceName } ${ item.cityName } ${ item.countyName }`;
					item.area = item.area == '  ' ? '--' : item.area;
				})
				this.tableData = data;
			},
			// 获取医护人员分页列表
			queryList (val) {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/doctor/medical/getDoctorInfoList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					search: this.form.search,
					hospital: this.form.hospital,
					department: this.form.department,
					isHide: this.form.isHide,
					title: this.form.title,
					category: this.form.category,
					checked: this.form.checked,
					disable: this.form.disable,
					startTime: this.form.date === null ? '' : this.form.date[ 0 ],
					endTime: this.form.date === null ? "" : this.form.date[ 1 ]
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.dealDataTable(res.data.result);
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
			//获取科室列表
			queryListOffice () {
				this.$post("/data/my", {
					pathL: "/doctor/typicalDiseasesArticle/getDepartmentListSecond"
				}).then(res => {
					if (res.state === 0) {
						this.departmentName = res.data.secondLevelMenu;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//获取职称列表
			queryListtitleName () {
				this.$get("/data/my", {
					pathL: "/doctor/medical/getTitleList"
				}).then(res => {
					if (res.state === 0) {
						this.titleName = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//获取职业类型列表
			queryListOccupationType () {
				this.$get("/data/my", {
					pathL: "/doctor/medical/getCategoryList"
				}).then(res => {
					if (res.state === 0) {
						this.occupationType = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			//启用按钮
			start (row) {
				this.doctorIdStart = row.doctorId;
				this.dialogStartVisible = true;
			},
			//启用对话框--确定按钮
			submitStart () {
				this.loading = true;
				//医护人员账号的启用接口
				this.$get("/data/my", {
					pathL: "/doctor/medical/forbiddenOrOpen",
					doctorId: this.doctorIdStart, //医生ID
					kind: 0 //启用按钮
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.dialogStartVisible = false;
						this.queryList();
						this.$message({
							type: "success",
							message: "启用成功！",
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
			//禁用按钮
			stop (row) {
				this.dialogStopVisible = true;
				this.doctorId = row.doctorId;
			},
			//禁用对话框里面取消按钮
			submitFormCancel (ruleForm) {
				this.dialogStopVisible = false;
				this.$refs[ "ruleForm" ].resetFields();
			},
			//禁用对话框里面确定按钮
			submitForm (ruleForm) {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						this.loading = true;
						//医护人员账号的禁用接口
						this.$get("/data/my", {
							pathL: "/doctor/medical/forbiddenOrOpen",
							doctorId: this.doctorId, //医生ID
							kind: 1, //禁用按钮
							reason: this.ruleForm.type, //禁用原因
							description: this.ruleForm.desc //备注
						}).then(res => {
							if (res.state === 0) {
								console.log(res);
								this.loading = false;
								this.queryList();
								this.dialogStopVisible = false;
								this.$refs[ "ruleForm" ].resetFields();
								this.$message({
									type: "success",
									message: "禁用成功！",
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
					}
					else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			//查看按钮
			view (row) {
				this.$router.push({
					name: "医护管理/医护管理/查看",
					query: {
						id: row.doctorId,
						teamId: row.teamId,
						checkFlag: 0
					}
				});
			},
			// 资质认证按钮
			find (row) {
				this.ziZhiID = row.confirmId;
				this.dialogFormVisible = true;
			},
			//资质认证对话框里面的取消按钮
			submitFormZiCancel (ruleFormZi) {
				this.dialogFormVisible = false;
				this.$refs[ "ruleFormZi" ].resetFields();
			},
			//资质认证对话框里面的确定按钮
			submitFormZi (ruleFormZi) {
				this.$refs.ruleFormZi.validate(valid => {
					if (valid) {
						this.loadingZiZhi = true;
						// 资质认证接口
						let getUserId = this.$store.getters.userId;

						//2审核通过、-1审核不通过
						if (this.ruleFormZi.cardChecked == 2) {
							this.$post("/data/my", {
								pathL: "/doctor/doctorCertifiedCard/checkcard",
								id: this.ziZhiID, //资质ID
								checkerId: getUserId, //审核人id
								cardChecked: this.ruleFormZi.cardChecked, //2审核通过
								cardNo: this.ruleFormZi.cardNo, //通过的话 身份证ID试别
								checkDescription: ""
							}).then(res => {
								this.loadingZiZhi = false;
								if (res.state === 0) {
									// console.log(res);
									let msg = res.msg;
									this.dialogFormVisible = false;
									this.queryList();
									this.$refs[ "ruleFormZi" ].resetFields();
									this.$message({
										type: "success",
										message: msg,
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
						}
						else if (this.ruleFormZi.cardChecked == -1) {
							this.$post("/data/my", {
								pathL: "/doctor/doctorCertifiedCard/checkcard",
								id: this.ziZhiID, //资质ID
								checkerId: getUserId, //审核人id
								cardChecked: this.ruleFormZi.cardChecked, //-1 审核未通过
								checkDescription: this.ruleFormZi.checkDescription, //审核不通过理由
								cardNo: ""
							}).then(res => {
								this.loadingZiZhi = false;
								if (res.state === 0) {
									// console.log(res);
									let msg = res.msg;
									this.dialogFormVisible = false;
									this.queryList();
									this.$refs[ "ruleFormZi" ].resetFields();
									this.$message({
										type: "success",
										message: msg,
										center: true
									});
								}
								else {
									this.loadingZiZhi = false;
									this.$message({
										message: res.msg,
										center: true
									});
								}
							});
						}
					}
					else {
						console.log("error!");
						return false;
					}
				});
			},
			// 重置搜索表单
			reset (form) {
				for (let i in form) {
					form[ i ] = "";
				}
				this.loading = true;
				this.pageNum = 1;
				// this.queryList();
				this.$get("/data/my", {
					pathL: "/doctor/medical/getDoctorInfoList",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					search: this.form.search,
					hospital: this.form.hospital,
					department: this.form.department,
					isHide: this.form.isHide,
					title: this.form.title,
					category: this.form.category,
					checked: this.form.checked,
					disable: this.form.disable,
					startTime: this.form.date === null ? '' : this.form.date[ 0 ],
					endTime: this.form.date === null ? "" : this.form.date[ 1 ]
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.dealDataTable(res.data.result);
						this.pageLength = res.data.total;
						this.$message({
							message: "搜索表单已重置",
							type: "success",
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
			// 搜索信息
			search (form) {
				this.loading = true;
				this.pageNum = 1;
				this.$get("/data/my", {
					pathL: "/doctor/medical/getDoctorInfoList",
					search: this.form.search,
					hospital: this.form.hospital,
					department: this.form.department,
					isHide: this.form.isHide,
					title: this.form.title,
					category: this.form.category,
					checked: this.form.checked,
					disable: this.form.disable,
					startTime: this.form.date === null ? '' : this.form.date[ 0 ],
					endTime: this.form.date === null ? "" : this.form.date[ 1 ],
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					if (res.state === 0) {
						this.loading = false;
						this.dealDataTable(res.data.result);
						this.pageLength = res.data.total;
						this.$message({
							message: "搜索完成",
							type: "success",
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
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			},
			// 跳转新增路由
			add () {
				this.$router.push({
					name: "医护管理/医护管理/新增"
				});
			},
			// 导出表格
			exportExcel () {
				let createTimeStart_export =
					this.form.date === null || this.form.date[ 0 ] === undefined
						? ""
						: this.form.date[ 0 ]; //开始注册日期
				let createTimeEnd_export =
					this.form.date === null || this.form.date[ 1 ] === undefined
						? ""
						: this.form.date[ 1 ]; //结束注册日期
				let realm = process.env.VUE_APP_URL;
				let version = process.env.VUE_APP_VERSION;
				let urlL = `${ realm }doctor/medical/exportExcelDoctorList?
           &version=${ version }
           &accessToken=${ this.$store.getters.accessToken }

           &search=${ this.form.search }
           &hospital=${ this.form.hospital }
           &department=${ this.form.department }
           &isHide=${ this.form.isHide }
           &title=${ this.form.title }
           &category=${ this.form.category }
           &checked=${ this.form.checked }
           &disable=${ this.form.disable }

           &startTime=${ createTimeStart_export }
           &endTime=${ createTimeEnd_export }
        `;
				this.$get("/data/exportExecl", {
					url: urlL.replace(/\ +/g, "")
				}).then(res => {
					window.location.href = res.data.url;
				});
			},
			//初始化
			initPage () {
				if (this.$route.query.start != undefined && this.$route.query.end != undefined && this.$route.query.checked == 0) {
					this.form.date = [ this.$route.query.start, this.$route.query.end ];
					this.form.checked = 0;//资质未提交
					this.queryList();
				}
				else if (this.$route.query.start != undefined && this.$route.query.end != undefined && this.$route.query.checked == 1) {
					this.form.date = [ this.$route.query.start, this.$route.query.end ];
					this.form.checked = 1;//资质待认证
					this.queryList();
				}
				else {
					this.queryList();
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			if (from.name !== "医护管理/医护管理/查看") {
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
			this.queryListOffice();
			this.queryListtitleName();
			this.queryListOccupationType();
		},
		watch: {
			dialogStopVisible (now) {
				if (now === false) {
					this.$refs[ "ruleForm" ].resetFields();
				}
			},
			dialogFormVisible (now) {
				if (now === false) {
					this.$refs[ "ruleFormZi" ].resetFields();
				}
			}
		},
		computed: {}
	};
</script>

