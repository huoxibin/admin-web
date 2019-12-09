<template>
  <div>
    <dk-dialog
            :center="true"
            :showConfirmBtn="type!=='detail'"
            :baseConfig="workConfig"
            :dialogShow.sync="dialogShow"
            @confirmCallback="closeDialog"
            @cancelCallback="cancelDialog"
            @closeDialog="cancelDialog"
    >
      <dk-form
              :form="form"
              :rules="rules"
              :config="formConfig"
              :inline="false"
              labelWidth="80px"
              slot="form"
      ></dk-form>

      <el-form
              slot="form"
              size="mini"
              :rules="rules"
              :form="form"
              :inline="false"
              labelWidth="80px"
      >
        <el-form-item label="获取关联">
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
                <i v-if="type!=='detail'" @click="deleteUser(item.nodeId)">X</i>
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
              <span class="name">
                {{item.label}}
                <i v-if="type!=='detail'" @click="deleteSend(item.nodeId)">X</i>
              </span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </dk-dialog>
    <!--审批人-->
    <dk-dialog
            :center="true"
            :baseConfig="userConfig"
            :dialogShow.sync="userConfig.visible"
            @confirmCallback="userConfirm"
            @cancelCallback="userCancel"
            @closeDialog="userCancel"
    >
      <dk-tree
              ref="treeUser"
              slot="tree"
              :data="treeDataPeopleUser"
              multiple
              accordion
              draggable
              :defaultCheckedKeys="userCheckKeys"
              defaultExpandAll
              :nodeKey="nodeKey"
              @getCheckNode="getTreeData"
              @getAllSelectData="getAllSelTree"
              style="max-height: 300px; overflow: auto;"
      ></dk-tree>
    </dk-dialog>
    <!--抄送人-->
    <dk-dialog
            :center="true"
            :baseConfig="sendConfig"
            :dialogShow.sync="sendConfig.visible"
            @confirmCallback="sendConfirm"
            @cancelCallback="sendCancel"
            @closeDialog="sendCancel"
    >
      <dk-tree
              ref="treeSend"
              slot="tree"
              :data="treeDataPeopleSend"
              multiple
              accordion
              draggable
              defaultExpandAll
              :defaultCheckedKeys="sendCheckKeys"
              :nodeKey="nodeKey"
              @getCheckNode="getSendTreeSelData"
              @getAllSelectData="getAllSelDendTree"
              style="max-height: 300px; overflow: auto;"
      ></dk-tree>
    </dk-dialog>
  </div>
</template>

<script>
  

  export default {
    name: "approvalWork",
  
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
          userTreeData: [{required: true}]
        },
        form: {},
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
              type: "textarea",
              placeholder: "请输入审核内容(0~500)",
              disabled: false
            }
          }
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
        treeDataPeopleUser: [], // 审批人树
        treeDataPeopleSend: [], // 抄送人树
        
        nodeKey: "nodeId",
        userCheckKeys: [],
        sendCheckKeys: []
      };
    },
    props: {
      type: {
        type: String,
        default: () => {
          return "";
        }
      },
      userTreeData: {
        type: Array,
        default: () => {
          return [];
        }
      },
      sendTreeData: {
        type: Array,
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
      }
    },
    mounted() {
      if (this.type == "detail") {
        this.formConfig[0].hide = false;
        this.formConfig[1].hide = false;
        this.formConfig[3].option.disabled = true;
        this.formConfig[4].option.disabled = true;
      }
      this.getPeopleList(); // 获取审批人
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
      setUserTree() {
        let that = this;
        this.userTreeData.forEach(item => {
          that.userCheckKeys.push(item.id);
        });
      },
      setSendTree() {
        let that = this;
        this.sendTreeData.forEach(item => {
          that.sendCheckKeys.push(item.id);
        });
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
        if (this.form.auditName == undefined) {
          this.$message("审核名称不能为空");
          return;
        }
        if (this.form.auditContent == undefined) {
          this.$message("审核内容不能为空");
          return;
        }
        if (!this.userTreeData.length) {
          this.$message("请选择审批人");
          return;
        }
        this.$emit(
          "closeDialog",
          this.form,
          this.userTreeData,
          this.sendTreeData
        );
      },
      cancelDialog() {
        this.$emit("cancelDialog");
      },
      getPeopleList() { // 获取人列表
        
        let that = this;
        this.$get("/data/my", {
          pathL: "/ap/sysUser/getSysDepartmentAndUser"
        })
          .then(res => {
            if (res.state == 0) {
              res.data.filter(item => {
                item.disabled = false;
                item.children.filter(im => {
                  im.disabled = false;
                });
              });
              that.treeDataPeopleUser = res.data;
              that.treeDataPeopleSend = JSON.parse(JSON.stringify(res)).data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      /////////////审批人
      userConfirm() {
        // 审批人选择确认
        this.userConfig.visible = false;
      },
      userCancel() {
        // 审批人选择取消
        this.userConfig.visible = false;
      },
      ////////////抄送人
      sendConfirm() {
        // 抄送人选择确认
        this.sendConfig.visible = false;
      },
      sendCancel() {
        // 抄送人选择取消
        this.sendConfig.visible = false;
      },
      reReArrData(nodeId) {
        let flag = false; // 无重复
        let indexFg;
        for(let i=0;i<this.userTreeData.length;i++){
          if(this.userTreeData[i].nodeId == nodeId){
            indexFg = i;
            flag = true; //有重复
            break;
          }else {
            indexFg = i;
            flag = false;
          }
        }
        return {flag: flag, index: indexFg};
      },
      reReSendArrData(nodeId) {
        let flag = false; // 无重复
        let indexFg;
        for(let i=0;i<this.sendTreeData.length;i++){
          if(this.sendTreeData[i].nodeId == nodeId){
            indexFg = i;
            flag = true; //有重复
            break;
          }else {
            indexFg = i;
            flag = false;
          }
        }
        return {flag: flag, index: indexFg};
      },
      siteTreeDisable(arr, data) {
        //////重置/////////
        data.filter(item => {
          item.disabled = false;
          item.children.filter(im => {
            im.disabled = false;
          });
        });
        //////设置选择的id禁用/////////
        data.map(item => {
          item.children.map(im => {
            arr.forEach(imr => {
              if (imr == im.nodeId) {
                im.disabled = true;
              }
            });
          });
        });
      },
      opratorTreeData() {
      },
      getTreeData(nodeObject) {
        // 获取所选择树
        //debugger
        if (nodeObject.isSelect && !nodeObject.node.children) {
          if (this.userTreeData.length) {
            if (!this.reReArrData(nodeObject.node.nodeId).flag) {
              this.userTreeData.push(nodeObject.node);
            }
          } else {
            this.userTreeData.push(nodeObject.node);
          }
        } else {
          if (this.userTreeData.length) {

            if (this.reReArrData(nodeObject.node.nodeId).flag) {
              this.userTreeData.splice(
                this.reReArrData(nodeObject.node.nodeId).index,
                1
              );
            }
          } else {
            this.userTreeData.splice(0, 1);
          }
        }

        //设置树不能勾选
        this.$refs.treeUser.returnAllSelectData();
      },
      getSendTreeSelData(nodeObject) {
        if (nodeObject.isSelect && !nodeObject.node.children) {
          if (this.sendTreeData.length) {
            if (!this.reReSendArrData(nodeObject.node.nodeId).flag) {
              this.sendTreeData.push(nodeObject.node);
            }
          } else {
            this.sendTreeData.push(nodeObject.node);
          }
        } else {
          if (this.sendTreeData.length) {
            //debugger
            if (this.reReSendArrData(nodeObject.node.nodeId).flag) {
              this.sendTreeData.splice(
                this.reReSendArrData(nodeObject.node.nodeId).index,
                1
              );
            }
          } else {
            this.sendTreeData.splice(0, 1);
          }
        }
        //设置树不能勾选
        this.$refs.treeSend.returnAllSelectData();
      },
      getAllSelTree(id, node) {
        // 获取所选择的审核人树的id
        this.siteTreeDisable(id, this.treeDataPeopleSend);
      },
      getAllSelDendTree(id, node) {
        // 获取所选择发送人的树的id,
        this.siteTreeDisable(id, this.treeDataPeopleUser);
      },
      deleteUser(nodeId) {
        let that = this;
        this.userTreeData.forEach((item, index) => {
          if (item.nodeId == nodeId) {
            that.userTreeData.splice(index, 1);
          }
        });
        let arr = [];
        this.userTreeData.forEach(item => {
          arr.push(item.nodeId);
        });
        that.$refs.treeUser.$children[0].setCheckedKeys(arr);
      },
      deleteSend(nodeId) {
        let that = this;
        this.sendTreeData.forEach((item, index) => {
          if (item.nodeId == nodeId) {
            that.sendTreeData.splice(index, 1);
          }
        });
        let arr = [];
        this.sendTreeData.forEach(item => {
          arr.push(item.nodeId);
        });
        that.$refs.treeSend.$children[0].setCheckedKeys(arr);
      }
    }
  };
</script>

<style scoped></style>
