<template>
  <div>
    <dk-dialog
            :center="true"
            :baseConfig="workConfig"
            :dialogShow.sync="dialogShow"
            @confirmCallback="closeDialog"
            @cancelCallback="cancelDialog"
            @closeDialog="cancelDialog"
    >
      <dk-form :form="form" :config="formConfig" :inline="false" labelWidth="80px" slot="form"></dk-form>

      <el-form slot="form" size="mini" :form="form" :inline="false" labelWidth="80px">
        <el-form-item label="合同内容">
          <el-button type="text">{{form.fileName}}</el-button>
        </el-form-item>
        <div class="line-1"></div>
        <el-form-item label="审批人" prop="userTreeData">
          <el-button type="text" v-if="type!=='detail'" @click="userConfig.visible=true">请选择</el-button>
        </el-form-item>
        <el-form-item label>
          <div class="workStream" v-for="(item,index) in userTreeData" :key="index">
            <div class="content">
              <span class="name">
                {{item.label}}
                <i v-if="type!=='detail'" @click="deleteUser(item.id)">X</i>
              </span>

              <span class="status">{{item.status}}</span>
              <span class="desctext">{{item.reason}}</span>
            </div>
            <div class="h-line" v-if="(index+1)<userTreeData.length"></div>
          </div>
        </el-form-item>
        <div class="line-1"></div>
        <el-form-item label="抄送人">
          <el-button type="text" v-if="type!=='detail'" @click="sendConfig.visible=true">请选择</el-button>
          <el-button type="text" disabled>审批通过后，通知的抄送人</el-button>
        </el-form-item>
        <el-form-item label>
          <div class="workStream workSendlist" v-for="(item,index) in sendTreeData" :key="index">
            <div class="content">
              <span class="name">{{item.label}}
              <i v-if="type!=='detail'" @click="deleteSend(item.id)">X</i></span>
            </div>
            </div>
        </el-form-item>
      </el-form>
    </dk-dialog>
   </div>
</template>
<script>
  import DkTree from "../package/tree";

  export default {
    name: "approvalWorkDel",
    components: {DkTree},
    data() {
      return {
        rules: {
          businessType: [
            {required: true, message: "请输入审核类型", trigger: "blur"}
          ],
          auditName: [
            {required: true, message: "请输入审核名称", trigger: "blur"}
          ],
          auditContent: [
            {required: true, message: "请输入审核内容(0~500)", trigger: "blur"}
          ],
          userTreeData:[
            {required: true}
          ]
        },
        form: {
        },
        formConfig: [
          // 搜索条件相关配置
          {
            type: "input",
            label: "审核状态",
            value: "auditStatus",
            hide: true,
            option: {
              disabled: true
            }
          },
          // 搜索条件相关配置
          {
            type: "input",
            label: "审核编号",
            hide: true,
            value: "auditNum",
            option: {
              disabled: true
            }
          },
          // 搜索条件相关配置
          {
            type: "input",
            label: "审核类型",
            value: "businessType",
            option: {
              disabled: true
            }
          },
          {
            type: "input",
            label: "审核名称",
            value: "auditName",
            option: {
              placeholder: "请输入审核名称",
              disabled: false
            }
          },
          {
            type: "textarea",
            label: "审核内容",
            value: "auditContent",
            option: {
              type: 'textarea',
              placeholder: "请输入审核内容(0~500)",
              disabled: false
            }
          },
        ],
        showtype: "",
        auditStatus: "",
        ////审批人/////
        userConfig: {
          visible: false,
          width: "500px",
          title: "选择审批人"
        },
        sendConfig: {
          visible: false,
          width: "500px",
          title: "选择抄送人"
        },
        treeData: [],
        nodeKey: 'id',
        userCheckKeys:[],
        sendCheckKeys:[],
      };
    },
    props: {
      type: {
        type: String,
        default: () => {
          return "";
        }
      },
      userTreeData:{
        type:Array,
        default: () => {
          return [];
        }
      },
      sendTreeData:{
        type:Array,
        default: () => {
          return [];
        }
      },
      data: {
        type: Object,
        default: () => {
          return {};
        }
      },
      workConfig: {
        type: Object,
        default: () => {
          return {};
        }
      },
      dialogShow: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
    },
    mounted() {
      if (this.type == "detail") {
        this.formConfig[0].hide = false;
        this.formConfig[1].hide = false;
        this.formConfig[3].option.disabled = true;
        this.formConfig[4].option.disabled = true;
      }
      this.getPeopleList();// 获取审批人
      this.setUserTree();
      this.setSendTree();
      this.dealData();

    },
    watch: {
      data() {
        this.dealData();
      }
    },
    methods: {
      setUserTree(){
        let that=this;
        this.userTreeData.forEach(item=>{
          that.userCheckKeys.push(item.id);
        })
      },
      setSendTree(){
        let that=this;
        this.sendTreeData.forEach(item=>{
          that.sendCheckKeys.push(item.id);
        })

      },
      dealData() {
        this.form = this.data;
        switch (this.form.businessType) {
          case 1: {
            this.form.businessType = "合同";
          }
            break;
          case 2: {
            this.form.businessType = "客户资质";
          }
            break;
          case 3: {
            this.form.businessType = "大客户报备";
          }
            break;
          case 4: {
            this.form.businessType = "订单报价";
          }
            break;
          case 5: {
            this.form.businessType = "生产计划";
          }
            break;
          case 6: {
            this.form.businessType = "退换货";
          }
            break;
          case 7: {
            this.form.businessType = "其他";
          }
            break;
          // case 8:{this.showtype="商品编号";}break;
          // case 9:{this.showtype="工单编号";}break;
          // case 10:{this.showtype="客户编号";}break;
          // case 11:{this.showtype="线索编号";}break;
          // case 12:{this.showtype="合同编号";}break;
          // case 13:{this.showtype="售后编号";}break;
          // case 14:{this.showtype="健康服务";}break;
        }
        switch (this.form.auditStatus) {
          case 1: {
            this.form.auditStatus = "待审核";
          }
            break;
          case 2: {
            this.form.auditStatus = "审核中";
          }
            break;
          case 3: {
            this.form.auditStatus = "审核通过";
          }
            break;
          case 4: {
            this.form.auditStatus = "审核拒绝";
          }
            break;
          case 5: {
            this.form.auditStatus = "撤销";
          }
            break;
        }
      },
      closeDialog() {
        if (this.form.businessType == "") {
          this.$message("审核类型不能为空");
          return;
        }
        if (this.form.auditName ==undefined ) {
          this.$message("审核名称不能为空");
          return;
        }
        if (this.form.auditContent==undefined) {
          this.$message("审核内容不能为空");
          return;
        }
        if(!this.userTreeData.length){
          this.$message("请选择审批人");
          return;
        }
        this.$emit("closeDialog", this.form,this.userTreeData,this.sendTreeData);
      },
      cancelDialog() {
        this.$emit("cancelDialog");
      },
      getPeopleList() {// 获取人列表
        let that=this;
        this.$get('/data/my', {
          pathL: '/ap/sysUser/getSysDepartmentAndUser'
        }).then(res => {
          if (res.state==0) {
            that.treeData=res.data;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      /////////////审批人
      userConfirm() { // 审批人选择确认
        this.userConfig.visible = false;
      },
      userCancel() {// 审批人选择取消
        this.userConfig.visible = false;

      },
      ////////////抄送人
      sendConfirm() { // 抄送人选择确认
        this.sendConfig.visible = false;
      },
      sendCancel() {// 抄送人选择取消
        this.sendConfig.visible = false;
      },
      reReArrData(id){
        let flag=false;// 无重复
        this.userTreeData.forEach(item=>{
          if(item.id==id){
            flag=true; //有重复
            return;
          }else{
            flag=false;
          }
        })
        return flag;
      },
      getTreeData(nodeObject) { // 获取所选择树
        if (nodeObject.isSelect && !nodeObject.node.children) {
          if(this.userTreeData.length){
            if(!this.reReArrData(nodeObject.node.id)){
              this.userTreeData.push(nodeObject.node);
            }
          }else{
            this.userTreeData.push(nodeObject.node);
          }
        }
      },
      getSendTreeSelData(nodeObject) {
        if (nodeObject.isSelect && !nodeObject.node.children) {
          if(this.sendTreeData.length){
            if(!this.reReArrData(nodeObject.node.id)){
              this.sendTreeData.push(nodeObject.node);
            }
          }else{
            this.sendTreeData.push(nodeObject.node);
          }
        }
      },
      deleteUser(id){
        let that=this;
        this.userTreeData.forEach((item,index)=>{
          if(item.id==id){
            that.userTreeData.splice(index,1);
          }
        })
        let arr=[];
        this.userTreeData.forEach(item=>{
          arr.push(item.id);
        })
        that.$refs.treeUser.$children[0].setCheckedKeys(arr);
      },
      deleteSend(id){
        let that=this;
        this.sendTreeData.forEach((item,index)=>{
          if(item.id==id){
            that.sendTreeData.splice(index,1);
          }
        })
        let arr=[];
        this.sendTreeData.forEach(item=>{
          arr.push(item.id);
        })
        that.$refs.treeSend.$children[0].setCheckedKeys(arr);

      },
    }
  };
</script>

<style scoped></style>
