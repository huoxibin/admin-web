<template>
  <div class="health comment">
    <base-layout ref="layout" :form="form" @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.activityName"></el-input>
        </el-form-item>
        <el-form-item label="内容状态">
          <el-select v-model="form.status">
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.createUserName"></el-input>
        </el-form-item>
        <el-form-item label="活动医生">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <base-date v-model="createTime"></base-date>
        </el-form-item>
        <el-form-item label="发布日期">
          <base-date v-model="publishTime"></base-date>
        </el-form-item>
        <el-form-item label="活动日期">
          <base-date v-model="time"></base-date>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button
          size="mini"
          type="primary"
          @click="$router.push('/news/activity_page/recommend/list/add')"
        >新 增</el-button>
        <el-button size="mini" type="primary" @click="exportExcel">导 出</el-button>
      </div>

      <!-- 表格 -->
      <el-table ref="table" :height="tableHeight" slot="table" :data="data" border stripe style="width: 100%">
        <el-table-column prop="activityName" label="活动页面名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="活动医生" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUserName" label="创建人" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publishTime" label="活动日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ `${scope.row.startTime} - ${scope.row.endTime}` }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readCount" label="阅读量" align="center"> show-overflow-tooltip</el-table-column>
        <el-table-column prop="status" label="内容状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.status === 1">已上线</p>
            <p v-if="scope.row.status === 2">待上线</p>
            <p v-if="scope.row.status === 3">已下线</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="180" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 1"
              type="text"
              size="small"
              @click="release(scope.row.id, scope.row)"
            >发布</el-button>
            <el-button type="text" size="small" @click="preview(scope.row.id)">查看</el-button>
            <el-button
              v-if="scope.row.status !== 1"
              type="text"
              size="small"
              @click="update(scope.row.id)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="text"
              size="small"
              @click="handleStatus(scope.row.id, 3)"
            >下线</el-button>
            <el-button
              v-if="scope.row.status !== 1"
              type="text"
              size="small"
              @click="remove(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
    <!-- 发布 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <el-date-picker
        v-model="releaseTime"
        size="mini"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="选择发布时间"
      ></el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="releaseTime===''"
          @click="releaseSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import exportExcel from "@/api/excel";
export default {
  name: "Recommend",
  data() {
    return {
			tableHeight: 0,
      form: {
        pathL: "/doctor/activityRecommendDoctor/activeListByPage",
        doctorName: "",
        activityName: "",
        createUserName: "",
        createTimeBegin: "",
        createTimeEnd: "",
        publishTimeBegin: this.$route.query.start || "",
        publishTimeEnd: this.$route.query.end || "",
        startTime: "",
        endTime: "",
        status: ""
      },
      createTime: [],
      publishTime: [],
      time: [],
      releaseTime: "",
      releaseId: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      dialogVisible: false,
      statusList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "已上线",
          value: 1
        },
        {
          label: "待上线",
          value: 2
        },
        {
          label: "已下线",
          value: 3
        }
      ],
      data: [],
      activity_startTime:'', //活动开始时间
      showPublicNotice: false
    };
  },
  watch: {
    createTime(now) {
      this.form.createTimeBegin = now[0];
      this.form.createTimeEnd = now[1];
    },
    publishTime(now) {
      this.form.publishTimeBegin = `${now[0]}`;
      this.form.publishTimeEnd = `${now[1]}`;
    },
    time(now) {
      this.form.startTime = now[0];
      this.form.endTime = now[1];
    },
    dialogVisible() {
      this.releaseTime = "";
    }
  },
	mounted (){
		if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
			this.publishTime = [ this.$route.query.start, this.$route.query.end ];
		}
		// 获取 table 高度
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		})
		window.onresize = ()=>{
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		}
	},
  methods: {
    // 获取数据
    getData(data) {
      this.data = data.result;
    },
    // 导出
    exportExcel() {
      const form = { ...this.form };
      delete form.pathL;
      exportExcel("/doctor/activityRecommendDoctor/activeListToExcel", form);
    },
    // 编辑
    update(id) {
      this.$router.push({
        path: "/news/activity_page/recommend/list/update",
        query: {
          id
        }
      });
    },
    // 查看
    preview(id) {
      this.$router.push({
        path: "/news/activity_page/recommend/list/preview",
        query: {
          id
        }
      });
    },
    // 改变状态
    handleStatus(id, status) {
      const getData = this.$refs.layout.getData;
      const data = {
        pathL: "/doctor/activityRecommendDoctor/setNewStatus",
        id,
        status
      };
      if (status === 1) {
        data.publishTime = this.releaseTime;
        let startTime = new Date(Date.parse(this.releaseTime)); //选择活动发布时间
        let endTime = new Date(Date.parse(this.activity_startTime)); //活动开始时间
        if(endTime <= startTime) {

        }else{
            this.$message({
                type: "warning",
                message: "发布时间要在活动开始时间后才能开启！",
                center: true
            });
            return
        }
      }
      this.$post("/data/my", data).then(res => {
        if (res.state === 0) {
          getData();
          this.$message({
            type: "success",
            message: "设置成功",
            center: true
          });
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 发布
    release(id, row) {
      console.log(id, row)
      this.dialogVisible = true;
      this.releaseId = id;
      this.activity_startTime = row.startTime;
    },
    // 发布提交
    releaseSubmit() {
      let systemTime = new Date(); //系统当前时间
      let releaseTime = new Date(Date.parse(this.releaseTime)); //选择活动发布时间
      if (systemTime > releaseTime) {
        this.$message({
          type: "warning",
          message: "选择活动发布时间必须大于当前系统时间！",
          center: true
        });
        return
      } else {
        this.handleStatus(this.releaseId, 1);
        this.dialogVisible = false;
      }
    },
    // 删除
    remove(id) {
      const getData = this.$refs.layout.getData;
      this.$post("/data/my", {
        pathL: "/doctor/activityRecommendDoctor/deleteActivityById",
        id
      }).then(res => {
        if (res.state === 0) {
          getData();
          this.$message({
            type: "success",
            message: "删除成功",
            center: true
          });
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>


