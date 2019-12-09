<template>
  <div class="health comment">
    <base-layout ref="layout" style="height: 100%" methods="post" :form="form"  @getData="getData">
      <!-- 表单 -->
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="指南名称">
          <el-input v-model="form.consensusName"></el-input>
        </el-form-item>
        <el-form-item label="内容状态">
          <el-select v-model="form.status">
            <el-option
              v-for="item in selectList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select
            v-model="form.owedFirstLev"
            style="width:120px"
            @change="classChange('/doctor/guideConsensus/getSecondLevels',form.owedFirstLev,'owedSecondLev')"
          >
            <el-option
              v-for="item in owedFirstLev"
              :key="item.firstLevelId"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.owedSecondLev"
            style="width:120px"
            @change="classChange('/doctor/guideConsensus/getThirdLevels',form.owedSecondLev,'owedThirdLev')"
          >
            <el-option
              v-for="item in owedSecondLev"
              :key="item.secondLevelId"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-select v-model="form.owedThirdLev" style="width:120px">
            <el-option
              v-for="item in owedThirdLev"
              :key="item.thirdLevelId"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.publisher"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <base-date v-model="createDate" :pickerOptions="pickerOptions"></base-date>
        </el-form-item>
        <el-form-item label="发布日期">
          <base-date v-model="date" :pickerOptions="pickerOptions"></base-date>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <div slot="btns" class="pull-right">
        <el-button size="mini" type="primary" @click="$router.push('/news/guide/add')">新 增</el-button>
        <el-button size="mini" type="success" @click="exportExcel">导 出</el-button>
      </div>

      <!-- 表格 -->
      <el-table slot="table" ref="table" :height="tableHeight" :data="data" border stripe style="width: 100%">
        <el-table-column type="index" :index="serialNumber" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="consensusName" label="指南名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="所属分类" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{`${scope.row.ownedFirstLev},${scope.row.ownedSecondLev},${scope.row.ownedThridLev}`}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publisher" label="创建人" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readAmount" label="阅读量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p
              v-for="item in selectList"
              :key="item.id"
              v-if="scope.row.status === item.id"
            >{{item.value}}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 4"
              type="text"
              size="small"
              @click="update(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="preview(scope.row.id)"
            >预览</el-button>
            <el-button
              v-if="scope.row.status === 6"
              type="text"
              size="small"
              @click="handleStatus(scope.row.id,1)"
            >发布</el-button>
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 6"
              type="text"
              size="small"
              @click="handleStatus(scope.row.id,4)"
            >下线</el-button>
            <el-button
              v-if="scope.row.status === 4"
              type="text"
              size="small"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
            <el-button
              v-if="scope.row.status === 4"
              type="text"
              size="small"
              @click="review(scope.row.id)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
      <el-radio v-model="status" :label="6">通过</el-radio>
      <el-radio v-model="status" :label="4">不通过</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="status === ''" @click="reviewSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import exportExcel from "@/api/excel";
export default {
  name: "Guide",
  data() {
    return {
			tableHeight:0,
      form: {
        pathL: "/doctor/guideConsensus/listGuideConsensus",
        consensusName: "",
        status: "",
        publisher: "",
        beginDate: "",
        endDate: "",
        beginDatePublish: this.$route.query.start|| "",
        endDatePublish: this.$route.query.end || "",
        owedFirstLev: "",
        owedSecondLev: "",
        owedThirdLev: ""
      },
      createDate: ["", ""],
      date: ["", ""],
      pickerOptions: {
        disabledDate: time => time.getTime() > Date.now()
      },
      pageNum: 1,
      pageSize: 10,
      selectList: [
        // {
        //   value: "暂存",
        //   id: 0
        // },
        {
          value: "待审核",
          id: 4
        },
        {
          value: "已审核",
          id: 2
        },
        {
          value: "未过审",
          id: 3
        },
        {
          value: "已上线",
          id: 1
        },
        {
          value: "已下线",
          id: 5
        },
        {
          value: "待上线",
          id: 6
        }
      ],
      owedFirstLev: [],
      owedSecondLev: [],
      owedThirdLev: [],
      data: [],
      dialogVisible: false,
      status: "",
      id: ""
    };
  },
  watch: {
    createDate(now) {
      this.form.beginDate = now[0];
      this.form.endDate = now[1];
    },
    date(now) {
      this.form.beginDatePublish = now[0];
      this.form.endDatePublish = now[1];
    },
    dialogVisible(now) {
      this.status = "";
    }
  },
  created() {
    this.getClass(
      "/doctor/guideConsensus/getFirstLevels",
      null,
      "owedFirstLev"
    );
  },
	mounted (){
		if (this.$route.query.start != undefined && this.$route.query.end != undefined) {
			this.date = [ this.$route.query.start, this.$route.query.end ];
		}
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		})
		window.onresize = ()=>{
			this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
		}
	},
  methods: {
    // 获取科室分类
    getClass(pathL, id, name) {
      this.$get("/data/my", { pathL, id }).then(res => {
        if (res.state === 0) {
          this[name] = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 修改分类
    classChange(pathL, id, name) {
      const option = {
        owedSecondLev: "owedFirstLev",
        owedThirdLev: "owedSecondLev"
      };
      const item = option[name];
      const list = this[item];
      const lev = list.filter(item => item.name === id);
      const ids = {
        owedFirstLev: "firstLevelId",
        owedSecondLev: "secondLevelId"
      };
      const items = ids[item];
      this.getClass(pathL, lev[0][items], name);
    },
    // 获取数据
    getData(data) {
      this.data = data.result;
    },
    // 修改编辑
    update(id) {
      this.$router.push({
        path: "/news/guide/update",
        query: { id, type: 1 }
      });
    },
    // 预览
    preview(id) {
      this.$router.push({
        path: "/news/guide/preview",
        query: { id, type: 2 }
      });
    },
    // 导出excel
    exportExcel() {
      const form = { ...this.form };
      exportExcel("doctor/guideConsensus/getListByConditionsExcel", form);
    },
    // 表格序号
    serialNumber(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    },
    // 状态fun
    statusFun(id, status) {
      const getData = this.$refs.layout.getData;
      this.$post("/data/my", {
        pathL: "/doctor/guideConsensus/updateStatusById",
        id,
        status
      }).then(res => {
        this.id = "";
        this.status = "";
        this.dialogVisible = false;
        if (res.state === 0) {
          getData();
          this.$message({
            type: "success",
            message: "设置成功!",
            center: true
          });
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 审核
    review(id) {
      this.id = id;
      this.dialogVisible = true;
    },
    reviewSubmit() {
      this.statusFun(this.id, this.status);
    },
    // 修改状态
    handleStatus(id, status) {
      const message = status === 4 ? "是否下线该指南？" : "是否发布该指南？";
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.statusFun(id, status);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作",
            center: true
          });
        });
    },
    // 删除
    handleDelete(guideConsensusId) {
      const getData = this.$refs.layout.getData;
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/data/my", {
            pathL: "/doctor/guideConsensus/deleteGuideConsensus",
            guideConsensusId
          }).then(res => {
            if (res.state === 0) {
              getData();
              this.$message({
                type: "success",
                message: "删除成功!",
                center: true
              });
            } else {
              this.$message({
                message: res.msg,
                center: true
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true
          });
        });
    }
  }
};
</script>

