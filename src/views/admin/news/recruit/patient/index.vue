 <template>
  <div class="health comment">
    <base-layout ref="layout" methods="post" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="招募主题">
          <el-input v-model="form.infoName"></el-input>
        </el-form-item>
        <el-form-item label="所属医生">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="form.patientName"></el-input>
        </el-form-item>
        <el-form-item label="患者联系方式">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="全部" value></el-option>
            <el-option label="待审核" :value="1"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核失败" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button size="mini" @click="exportExcel" type="primary">导 出</el-button>
        <el-button size="mini" @click="importExcel" type="primary">导 入</el-button>
        <el-button size="mini" @click="downExcelTemplate" type="primary">下载导入模板</el-button>
      </div>

      <!-- 表格 -->
      <el-table ref="table" slot="table" :data="data" border :height="tableHeight" stripe style="width: 100%">
        <el-table-column type="index" :index="serialNumber" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="status" label="所属招募主题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="preview(scope.row.infoId)"
            >{{scope.row.infoName}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="departName" label="所属科室" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="patientName" label="患者姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="患者性别" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="age" label="患者年龄" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="患者联系方式" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="doctorName" label="推荐医生" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="doctorMobile" label="推荐医生手机号" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="diseaseHistory" label="疾病史" align="center" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="cureHistory" label="治疗史" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              placement="top"
              title="审核结果"
              :disabled="scope.row.status !== '审核失败'"
              width="200"
              trigger="click"
              :content="`不通过原因：${scope.row.cause}`"
            >
              <p
                :style="scope.row.status === '审核失败'?'color: #f00;cursor: pointer;':''"
                slot="reference"
              >{{scope.row.status}}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === '待审核'"
              type="text"
              size="small"
              @click="handleStatus(scope.row)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <el-radio v-model="status" :label="2">通过</el-radio>
      <el-radio v-model="status" :label="3">不通过</el-radio>
      <el-input
        v-model="cause"
        v-show="status === 3"
        size="mini"
        style="margin-top: 10px;"
        placeholder="请输入不通过原因"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleStatusSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--导入Excel-->
    <el-dialog title="导入" :visible.sync="dialogVisibleExcel" width="50%" :append-to-body="true">
      <el-upload
          ref="upload"
          class="upload-demo"
          :action="action"
          :headers="headers"
          :on-success="onSuccess"
          :show-file-list="true"
          :before-upload="beforeUpload"
          name="file"
        >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import exportExcel from "@/api/excel";
export default {
  name: "RecruitPatien",
  data() {
    return {
			tableHeight:0,
      form: {
        pathL: "/doctor/recruitPatient/list",
        infoName: "",
        doctorName: "",
        patientName: "",
        mobile: "",
        status: ""
      },
      pageNum: 1,
      pageSize: 10,
      data: [],
      dialogVisible: false,
      dialogVisibleExcel: false,
      status: "",
      cause: "",
      infoId: "",
      // 导入excel
      action: "/data/excel",
      headers: {
        accessToken: this.$store.getters.accessToken,
        pathL: "/doctor/recruitPatient/importExcel"
      },
      importData: {},
      excelName: "",
      sendNumber: null
    }  
  },
  methods: {
    // 获取数据
    getData(data) {
      this.data = data.result;
      this.pageNum = data.pageNum;
      this.pageSize = data.pageSize;
    },
    // 表格序号
    serialNumber(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    },
    // 导出excel
    exportExcel() {
      exportExcel("doctor/recruitPatient/export", this.form);
    },
    // 导入excel
    importExcel() {
      this.dialogVisibleExcel = true;
    },
    // 上传之前
    beforeUpload(file) {
    },
    // 上传成功
    onSuccess(response, file, fileList) {
      if (response.state === 0) {
        this.$message({
          type: "success",
          message: response.msg,
          center: true
        });
        this.dialogVisibleExcel = false;
        const getData = this.$refs.layout.getData;
        getData();
        this.$refs.upload.clearFiles();
      } else {
        this.$message({
          message: response.msg,
          center: true
        });
        this.$refs.upload.clearFiles();
      }
    },
    // 下载excel模板
    downExcelTemplate() {
      window.open(`https://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/excel%E6%A8%A1%E6%9D%BF/%E6%8B%9B%E5%8B%9F%E6%82%A3%E8%80%85%E9%97%AE%E5%8D%B7%EF%BC%8D%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx`)
    },
    // 预览
    preview(id) {
      this.$router.push({
        path: "/news/recruit/news/preview",
        query: { id }
      });
    },
    // 审核dialogVisible
    handleStatus(row) {
      this.id = row.id;
      this.infoId = row.infoId;
      this.dialogVisible = true;
    },
    // 审核提交
    handleStatusSubmit() {
      const getData = this.$refs.layout.getData;
      this.$post("/data/my", {
        pathL: "/doctor/recruitPatient/edit",
        id: this.id,
        status: this.status,
        cause: this.cause,
        infoId: this.infoId
      }).then(res => {
        this.dialogVisible = false;
        this.status = "";
        this.cause = "";
        if (res.state === 0) {
          getData();
          this.$message({
            type: "success",
            message: "设置成功",
            center: true
          });
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  },
  mounted(){
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		})
		window.onresize = ()=>{
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		}
  },
};
</script>

<style lang="scss" scoped>
.recruit-patient {
  height: 100%;
}
</style>

