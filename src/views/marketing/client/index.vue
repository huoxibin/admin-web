<template>
  <div style="height: 100%">
    <base-layout ref="layout" :form="form" @getData="getData">
      <!-- 表单 -->
      <dk-form slot="form" :form="form" :config="formConfig" :inline="true" labelWidth="100px"></dk-form>
      <!-- 按钮 -->
      <div slot="btns" class="btns">
        <el-button type="primary" @click="exportExcel">导出</el-button>
        <el-button type="primary" @click="dialogVisible = true">导入</el-button>
        <el-button type="primary" @click="downloadTemplate">导入模板</el-button>
        <el-button type="primary" @click="$router.push('/client/list/add')">新增</el-button>
      </div>
      <!-- 表格 -->
      <dk-table
        slot="table"
        :data="data"
        :config="dataConfig"
        operating
        index
        :pageNum="1"
        :pageSize="1"
        @buttonClick="detail"
        @sortChange="handleSortChange"
      >
        <!-- slot 插槽 用于放置操作按钮 -->
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
        </template>
      </dk-table>
    </base-layout>
    <!-- 导入 -->
    <el-dialog title="导入" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :on-success="onSuccess"
        name="file"
        :limit="1"
      >
        <el-button size="small" type="success">导入文件</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import exportExcel from "@/api/excel";
export default {
  name: "Client",
  data() {
    return {
      form: {
        pathL: "/common/customerInfo/getCustomerInfoPage",
        customerNo: "",
        companyName: "",
        contactNameOne: "",
        contactTelOne: "",
        provinceName: "",
        customerType: "",
        principal: "",
        createTime: "",
        sortType: ""
      },
      formConfig: [
        {
          type: "input",
          label: "客户编号",
          value: "customerNo",
          option: {}
        },
        {
          type: "input",
          label: "公司名称",
          value: "companyName",
          option: {}
        },
        {
          type: "input",
          label: "联系人",
          value: "contactNameOne",
          option: {}
        },
        {
          type: "input",
          label: "联系方式",
          value: "contactTelOne",
          option: {}
        },
        {
          type: "input",
          label: "所在城市",
          value: "provinceName",
          option: {}
        },
        {
          type: "select",
          label: "客户类型",
          value: "customerType",
          option: {
            data: [
              {
                label: "全部",
                value: ""
              },
              {
                label: "大客户",
                value: 1
              },
              {
                label: "合伙人",
                value: 2
              },
              {
                label: "经销商",
                value: 3
              }
            ]
          }
        },
        {
          type: "input",
          label: "负责人",
          value: "principalName",
          option: {}
        },
        {
          type: "date",
          label: "创建时间",
          value: "createTime",
          option: {
            type: "date"
          }
        }
      ],
      data: [],
      dataConfig: [
        {
          type: "button",
          label: "客户编号",
          value: "customerNo",
          sort: true,
          tooltip: true
        },
        {
          label: "公司名称",
          value: "companyName",
          tooltip: true
        },
        {
          label: "企业性质",
          value: "companyNature",
          tooltip: true
        },
        {
          label: "公司简称",
          value: "companyAbbrev",
          tooltip: true
        },
        {
          label: "法人代表",
          value: "companyLegal",
          tooltip: true
        },
        {
          label: "公司总人数",
          value: "companyHeadcount",
          tooltip: true
        },
        {
          label: "业务员人数",
          value: "salesmenCount",
          tooltip: true
        },
        {
          label: "技术员人数",
          value: "techniciansCount",
          tooltip: true
        },
        {
          label: "联系人",
          value: "contactNameOne",
          tooltip: true
        },
        {
          label: "联系方式",
          value: "contactTelOne",
          tooltip: true
        },
        {
          label: "注册资金",
          value: "registeredCapital",
          tooltip: true
        },
        {
          label: "流动资金",
          value: "workingCapital",
          tooltip: true
        },
        {
          label: "年销售额",
          value: "annualSales",
          tooltip: true
        },
        {
          label: "E-Mail",
          value: "email",
          tooltip: true
        },
        {
          label: "所在城市",
          value: "provinceName",
          tooltip: true
        },
        {
          label: "申请区域",
          value: "applicationArea",
          tooltip: true
        },
        {
          label: "所属大区",
          value: "region",
          tooltip: true
        },
        {
          label: "申请类别",
          value: "applicationType",
          tooltip: true
        },
        {
          label: "通讯地址",
          value: "commAddress",
          tooltip: true
        },
        {
          label: "收货地址",
          value: "shipAddress",
          tooltip: true
        },
        {
          label: "邮编",
          value: "postalCode",
          tooltip: true
        },
        {
          label: "银行账户",
          value: "bankAccount",
          tooltip: true
        },
        {
          label: "开户银行",
          value: "bankDeposit",
          tooltip: true
        },
        {
          label: "组织代码（三证合一）",
          value: "ownerCode",
          tooltip: true
        },
        {
          label: "客户类型",
          value: "customerType",
          tooltip: true
        },
        {
          label: "GSP管控",
          value: "gspControls",
          tooltip: true
        },
        {
          label: "助记码",
          value: "opcode",
          tooltip: true
        },
        {
          label: "成立时间",
          value: "regtime",
          tooltip: true
        },
        {
          label: "社会资源",
          value: "socialResources",
          tooltip: true
        },
        {
          label: "经营其他产品",
          value: "restsProduct",
          tooltip: true
        },
        {
          label: "技术能力",
          value: "technicalCapacity",
          tooltip: true
        },
        {
          label: "业务能力",
          value: "professionalProficiency",
          tooltip: true
        },
        {
          label: "营业环境",
          value: "businessEnvironment",
          tooltip: true
        },
        {
          label: "服务能力",
          value: "serviceAbility",
          tooltip: true
        },
        {
          label: "配送能力",
          value: "distributionCapacity",
          tooltip: true
        },
        {
          label: "社会关系",
          value: "socialRelations",
          tooltip: true
        },
        {
          label: "客户状态",
          value: "status",
          tooltip: true
        },
        {
          label: "审核状态", ////---------------------------------------------
          value: "processStatus",
          tooltip: true
        },
        {
          label: "负责人",
          value: "principalName",
          tooltip: true
        }
      ],
      uploadUrl: "/data/excel",
      uploadHeaders: {
        accessToken: this.$store.getters.accessToken,
        userId: this.$store.getters.userId,
        pathL: "/common/customerInfo/import"
      },
      dialogVisible: false
    };
  },
  methods: {
    // 上传成功
    onSuccess(res, file, fileList) {
      if (res.state === 0) {
        this.$message({
          message: "导入成功",
          type: "success",
          center: true
        });
        this.dialogVisible = false;

        const getData = this.$refs.layout.getData;
        getData();
      } else {
        this.$message({
          message: res.msg,
          center: true,
          type: "warning"
        });
      }
    },
    // 获取数据
    getData(res) {
      this.data = res.result;
      this.data.forEach(item => {
        //客户状态
        item.status = item.status === 1 ? "意向客户" : item.status === 2 ? "正式客户" : "关闭"; 
        
        //客户类型
        const customerType = ["", "大客户", "合伙人", "经销商"]; 
        item.customerType = customerType[item.customerType];
        
        //审核状态
        const processStatus = ["", "临时保存", "审核中", "通过", "撤销", "拒绝"];
        item.processStatus = processStatus[item.processStatus];

        item.applicationArea = `${item.provinceName}-${item.cityName}-${item.countyName}`;
        item.provinceName = `${item.provName}-${item.cName}`;
      });
    },
    // 导出
    exportExcel() {
      const form = { ...this.form };
      delete form.pathL;
      exportExcel("common/customerInfo/exportExcelCustomerInfo", form);
    },
    // 编辑
    handleEdit(id) {
      this.$router.push({
        path: "/client/list/update",
        query: {
          id
        }
      });
    },
    // 查看
    detail({ id }) {
      this.$router.push({
        path: "/client/list/detail",
        query: {
          markedId:110,
          id
        }
      });
    },
    // 排序
    handleSortChange(row) {
      const getData = this.$refs.layout.getData;
      switch (row.order) {
        case null:
          this.form.sortType = "";
          break;
        case "ascending":
          this.form.sortType = "ASC";
          break;
        case "descending":
          this.form.sortType = "DESC";
          break;
      }
      getData();
    },
    //导入模板
    downloadTemplate () {
      window.open(`http://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/excel%E6%A8%A1%E6%9D%BF/%E6%84%8F%E5%90%91%E5%AE%A2%E6%88%B7-%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88-0.01.xlsx`)
    }
  }
};
</script>

<style>
</style>
