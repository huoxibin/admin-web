<template>
  <!-- 工单记录 -->
  <el-card class="work-order-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>工单记录</span>
    </div>
    <el-form
            ref="form"
            size="mini"
            class="form"
            :rules="rules"
            :model="form"
            label-width="110px"
            label-suffix="："
    >
      <el-form-item label="工单号">
        <span>{{form.workOrderNo}}</span>
      </el-form-item>
      <el-form-item label="咨询类型" prop="consultType">
        <el-select v-model="form.consultType" placeholder="请选择">
          <el-option label="咨询" :value="1"></el-option>
          <el-option label="投诉" :value="2"></el-option>
          <el-option label="合理化建议" :value="3"></el-option>
          <el-option label="其他" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单类型" prop="workOrderType">
        <el-button size="mini" type="primary" @click="dialogVisible = true">请选择</el-button>
        <el-tag style="margin-left: 20px;" size="medium" v-if="tag !==''">{{tag}}</el-tag>
      </el-form-item>
      <el-form-item label="工单标题" prop="workOrderTitle">
        <el-input v-model="form.workOrderTitle" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="工单等级" prop="workOrderLevel">
        <el-select v-model="form.workOrderLevel" placeholder="请选择" @change="handleChange">
          <el-option label="普通" :value="1"></el-option>
          <el-option label="重大" :value="2"></el-option>
          <el-option label="加急" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理时限">
        <span>{{time}}</span>
      </el-form-item>
      <el-form-item label="处理部门" prop="deptNo">
        <el-select v-model="form.deptNo" placeholder="请选择" @change="handleDepartmentChange">
          <el-option
                  v-for="item in department"
                  :key="item.id"
                  :label="item.departmentName"
                  :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="受理人" prop="receiverNo">
        <el-select v-model="form.receiverNo" placeholder="请选择">
          <el-option v-for="item in staff" :key="item.id" :label="item.userName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" prop="problemDescription">
        <el-input v-model="form.problemDescription" type="textarea" maxlength="999"></el-input>
      </el-form-item>
      <el-form-item label="添加附件" prop="accessory">
        <!--<base-upload :limit="5" :fileList="fileList" @notify="handleUpload"></base-upload>-->
        <el-upload
                ref = "upload"
                class="upload-demo"
                :headers="uploadHeaders"
                :action="uploadUrl"
                :on-preview="handlePreview"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :on-success="onSuccessAdd"
                auto-upload
                list-type="picture"
                multiple
                :limit="5"
                :on-exceed="handleExceed"
                :data="fileListAdder"
                :file-list="fileListAdd"
                name="file"
                v-model="addFrom"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>

      </el-form-item>
    </el-form>
    <!-- 选择工单类型 -->
    <el-dialog title="选择工单类型" :visible.sync="dialogVisible" width="95%" :append-to-body="true">
      <el-tree ref="tree" :data="tree" show-checkbox node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleTreeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
   export default {
      name: "order",
      props: {
         form: {
            type: Object,
            required: true
         }
      },
      data() {
         return {
            uploadHeaders: { accessToken: this.$store.getters.accessToken }, //设置上传的请求头部
            uploadUrl: "/data/uploadImg", //必选参数，上传的地址
            fileListAdder: {}, //上传时附带的额外参数
            fileListAdd: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
            addFrom: {},




            rules: {
               consultType:{
                  required: true,
                  message: "请选择咨询类型",
                  trigger: "blur"
               },
               workOrderType: {
                  required: true,
                  message: "请选择工单类型",
                  trigger: "blur"
               },
               workOrderTitle: {
                  required: true,
                  message: "请输入工单标题",
                  trigger: "blur"
               },
               workOrderLevel: {
                  required: true,
                  message: "请选择工单等级",
                  trigger: "blur"
               },
               deptNo: { required: true, message: "请选择处理部门", trigger: "blur" },
               receiverNo: {
                  required: true,
                  message: "请选择受理人",
                  trigger: "blur"
               },
               problemDescription: {
                  required: true,
                  message: "请输入问题描述",
                  trigger: "blur"
               },
               accessory: { required: false, message: "请上传附件", trigger: "blur" }
            },
            tree: [],
            tag: "",
            dialogVisible: false,
            time: "",
            department: [],
            staff: [],
            fileList: []
         };
      },
      created() {
         this.getDepartment();
         this.getTree();
      },
      methods: {
         //使用 before-upload 的钩子函数 beforeAvatarUpload 限制用户上传的图片格式和大小。
         beforeAvatarUpload(file) {

         },
         //点击文件列表中已上传的文件时的钩子
         handlePreview(file) {
            console.log(file);
         },
         //on-success 文件上传成功时的钩子
         onSuccessAdd(response, file, fileList) {
            this.fileListAdd.push({
               name: file.name,
               url: response.data.url
            });
            // console.log(this.fileListAdd);
            // console.log(JSON.stringify(this.fileListAdd));
            this.form.accessory = JSON.stringify(this.fileListAdd);
         },
         //文件超出个数限制时的钩子
         handleExceed(files, fileList) {
            this.$message.warning(
               `当前限制选择 1 张图片，本次选择了 ${
                  files.length
                  } 张图片，共选择了 ${files.length + fileList.length} 张图片`
            );
         },
         // 文件删除钩子
         beforeRemove(file, fileList) {
            const status = file.url.includes("blob");
            if (status) {
               this.fileListAdd = this.fileListAdd.filter(item => item.uid !== file.uid);
            } else {
               this.fileListAdd = this.fileListAdd.filter(item => item.url !== file.url);
            }
            // console.log(this.fileListAdd);
            this.form.accessory = JSON.stringify(this.fileListAdd);
         },

         // 获取附件url
         // handleUpload(data) {
         //    const files = data.map(item => ({
         //       name: item.name,
         //       url: item.url
         //    }));
         //    this.form.accessory = JSON.stringify(files);
         // },





         // 获取部门信息
         getDepartment() {
            this.$post("/data/my", {
               pathL: "/ap/sysDepartment/list",
               pageNum: 1,
               pageSize: 99999
            }).then(res => {
               this.department = res.data.page.result;
            });
         },
         // 切换部门
         handleDepartmentChange(departmentId) {
            this.receiverNo = "";
            this.$post("/data/my", {
               pathL: "/ap/sysUser/list",
               pageNum: 1,
               pageSize: 9999999,
               departmentId
            }).then(res => {
               this.staff = res.data.page.result;
            });
         },
         // 获取树节点
         getTree() {
            this.$get("/data/my", {
               pathL: "/customer/orderType/getOrderTypeList"
            }).then(res => {
               if (res.state === 0) {
                  this.tree = res.data.rootNodes;
               } else {
                  this.$message({
                     message: res.msg,
                     center: true
                  });
               }
            });
         },
         // tree
         handleTreeSubmit() {
            const checkedNodes = this.$refs.tree.getCheckedKeys(true);
            const checkedNames = this.$refs.tree.getCheckedNodes(true, true);
            if (checkedNodes.length === 1) {
               this.form.workOrderType = checkedNodes[0];
               this.tag = checkedNames[0].label;
               this.dialogVisible = false;
            } else {
               this.$message({
                  message: "请选择一个工单类型",
                  center: true,
                  type: "warning"
               });
            }
         },
         // 工单等级
         handleChange(val) {
            const list = ["24小时", "12小时", "8小时"];
            this.time = list[val-1];
         }
      }
   };
</script>

<style lang="scss" scoped>
  .form {
    display: flex;
    flex-flow: wrap;
    & > div {
      width: 100%;
    }
  }
</style>