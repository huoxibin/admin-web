<template>
  <base-layout methods="post" :form="form" @getData="getData">
    <!-- 表单 -->
    <dk-form :form="form" :config="formConfig" :inline="true" labelWidth="120px" slot="form"></dk-form>
    <!-- 按钮 -->
    <div class="header-page" slot="btns">
      <div class="pull-right">
        <el-button size="mini" type="primary" @click="importFile">导入</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="exportList">导出</el-button>
        <el-button size="mini" type="primary" class="pull-right" @click="exportList">导入模板</el-button>
      </div>
    </div>
    <!--表格-->
    <dk-table
      slot="table"
      border
      stripe
      :data="tableData"
      :config="tableConfig"
      operating
      :operatingWidth="200"
      @cellClassName="setCellClass"
      index
      :pageNum="1"
      :pageSize="1"
      selection
      @selectionChange="handleSelectionChange"
      @rowClick="handleRowClick"
      @inputConfirm="handleInputConfirm"
      @buttonClick="handleButtonClick"
    >
      <!-- slot 插槽 用于放置操作按钮 -->
      <template #default="{ row }">
        <el-button size="mini" type="primary" @click="handleDelete(row)">编辑</el-button>
        <el-button size="mini" @click="rowDetail(row)">跟进记录</el-button>
      </template>
    </dk-table>
    <dk-dialog
      :baseConfig="dialogConfig"
      :dialogShow.sync="dialogConfig.dialogVisible"
      @confirmCallback="importFileConfirm"
      @cancelCallback="importFileCancel"
      @closeDialog="importFileCancel"
    >
      <el-form slot="form" :inline="true" :model="form" size="mini" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="form.first"></el-input>
        </el-form-item>
        <el-form-item label="医生姓名">
          <el-input v-model="form.second"></el-input>
        </el-form-item>
      </el-form>
      <el-table slot="table" :data="tableData" border stripe>
        <el-table-column prop="orderNum" label="订单号" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </dk-dialog>
  </base-layout>
</template>

<script>
//import exportExcel from "@/api/excel";

export default {
  data: () => ({
    form: {},
    formConfig: [
      // 搜索条件相关配置
      {
        type: "input",
        label: "客户编号",
        value: "num",
        option: {
          placeholder: "请输入客户编号",
          disabled: false
        }
      },
      {
        type: "input",
        label: "公司名称",
        value: "name",
        option: {
          placeholder: "请输入公司名称",
          disabled: false
        }
      },
      {
        type: "select",
        label: "公司性质",
        value: "companyType",
        option: {
          placeholder: "请输入公司性质",
          disabled: false,
          data: [
            {
              value: "1",
              label: "大客户"
            },
            {
              value: "2",
              label: "合伙人"
            }
          ]
        }
      },
      {
        type: "input",
        label: "注册资金",
        value: "createMoney",
        option: {
          placeholder: "请选择",
          disabled: false
        }
      },
      {
        type: "input",
        label: "所在城市",
        value: "city",
        option: {
          placeholder: "请输入城市名",
          disabled: false
        }
      },
      {
        type: "date",
        label: "下次联系时间",
        value: "dateTime",
        option: {
          type: "datetime",
          placeholder: "请输入城市名",
          disabled: false
        }
      },
      {
        type: "select",
        label: "客户类型",
        value: "customerType",
        option: {
          placeholder: "请输入公司性质",
          disabled: false,
          data: [
            {
              value: "1",
              label: "大客户"
            },
            {
              value: "2",
              label: "合伙人"
            }
          ]
        }
      },
      {
        type: "input",
        label: "负责人",
        value: "people",
        option: {
          placeholder: "请输入负责人",
          disabled: false
        }
      },
      {
        type: "date",
        label: "创建时间",
        value: "createTime",
        option: {
          type: "datetime",
          placeholder: "请输入创建时间",
          disabled: false
        }
      },
      {
        type: "select",
        label: "客户状态",
        value: "customerStatus",
        option: {
          data: [
            {
              value: "1",
              label: "临时客户"
            },
            {
              value: "2",
              label: "全部"
            },
            {
              value: "3",
              label: "审核中"
            },
            {
              value: "4",
              label: "未审核"
            },
            {
              value: "5",
              label: "通过"
            },
            {
              value: "6",
              label: "拒绝"
            }
          ]
        }
      },
      {
        type: "select",
        label: "状态",
        value: "status",
        option: {
          placeholder: "请选择",
          data: [
            {
              value: "2",
              label: "全部"
            },
            {
              value: "4",
              label: "审核中"
            },
            {
              value: "5",
              label: "通过"
            },
            {
              value: "6",
              label: "拒绝"
            },
            {
              value: "3",
              label: "临时保存"
            }
          ]
        }
      }
    ],
    tableConfig: [
      //相关的表格的配置
      {
        type: "",
        label: "客户编号",
        value: "name",
        tooltip: true,
        styleClass: ""
      },
      {
        type: "",
        label: "公司名称",
        value: "name1"
      },
      {
        type: "",
        label: "公司性质",
        value: "name11"
      },
      {
        type: "",
        label: "注册资金",
        value: "name111"
      },
      {
        type: "",
        label: "所在城市",
        value: "name1111"
      },
      {
        type: "",
        label: "联系方式",
        value: "name11111"
      },
      {
        type: "",
        label: "申请城市",
        value: "name222"
      },
      {
        type: "",
        label: "客户类型",
        value: "name2"
      },
      {
        type: "button",
        label: "负责人",
        value: "name22"
      },
      {
        type: "",
        label: "下次联系时间",
        value: "name33",
        sort: true
      },
      {
        type: "",
        label: "创建时间",
        value: "name4"
      },
      {
        type: "",
        label: "客户状态",
        value: "name5"
      },
      {
        type: "",
        label: "状态",
        value: "name6"
      }
    ],
    tableData: [],
    /////////弹窗配置////////////
    dialogConfig: {
      dialogVisible: false,
      title: "三生三世"
    },
    importForm: {}
  }),
  mounted() {
    this.setData();
  },
  methods: {
    // 获取数据
    getData(data) {
      console.log(data);
    },
    setData() {
      let item = {
        name: "解决",
        id: "2"
      };
      this.tableData = new Array(20).fill(item);
    },
    setCellClass(obj) {
      console.log(obj);
      if (obj.columnIndex == 2 || obj.columnIndex == 9) {
        return "f-blue";
      }
    },

    handleSelectionChange(val) {
      console.log(val);
    },
    handleRowClick(row) {
      console.log(row);
    },
    handleInputConfirm(row) {
      console.log(row);
    },
    handleButtonClick(row) {
      console.log(row);
    },

    searchCourseList() {
      // 搜索课程列表
      this.loading = true;
      let that = this;
      let sh = that.search;
      this.$get("/data/my", {
        pathL: "/doctor/course/getCourseList",
        courseName: sh.name, //课程名
        status: sh.statusVal, // 状态
        creater: sh.people, //创建人
        lecturerName: sh.teacher, //讲师
        baseId: sh.category.first, //一级id
        departmentId: sh.category.second, //二级id
        diseaseId: sh.category.threed, //三级id
        createTimeStart: sh.createTime ? sh.createTime[0] : "", //创建开始时间
        createTimeEnd: sh.createTime ? sh.createTime[1] : "", //创建结束时间
        publishTimeStart: sh.issueTime ? sh.issueTime[0] : "", //发布开始时间
        publishTimeEnd: sh.issueTime ? sh.issueTime[1] : "", //发布开始时间
        pageNum: sh.pageNum, // 当前页
        pageSize: sh.pageSize // 每页条数
      })
        .then(res => {
          if (!res.state) {
            that.loading = false;
            that.tableData = [];
            that.$nextTick(() => {
              that.dealTableData(res.data.result);
              that.pageLength = res.data.total;
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    importFile() {
      this.dialogConfig.dialogVisible = true;
    },
    exportList() {
      //导出
      let that = this;
      let sh = that.search;
      let url = "/doctor/course/exportCourse";
      let data = {
        courseName: sh.name, //课程名
        status: sh.statusVal, // 状态
        creater: sh.people, //创建人
        lecturerName: sh.teacher, //讲师
        baseId: sh.category.first, //一级id
        departmentId: sh.category.second, //二级id
        diseaseId: sh.category.threed, //三级id
        createTimeStart: sh.createTime[0] || "", //创建开始时间
        createTimeEnd: sh.createTime[1] || "", //创建结束时间
        publishTimeStart: sh.issueTime[0] || "", //发布开始时间
        publishTimeEnd: sh.issueTime[1] || "" //发布开始时间
      };
      exportExcel(url, data);
    },
    rowDetail(row) {
      //this.$router.push({ path: '/custorm/detail',query:{id:row.id}});
    },
    setCellClass(obj) {
      console.log(obj);
      //第八列添加 red 类
      if (obj.columnIndex == 2) {
        return "f-blue";
      }
    },
    importFileConfirm() {
      //导入的确认操作
      this.dialogConfig.dialogVisible = false;
    },
    importFileCancel() {
      //导入的取消操作
      this.dialogConfig.dialogVisible = false;
    }
  }
};
</script>
