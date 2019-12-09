<!--
* author: huoxibin
* created: 2019/5/27
* describe: 医护管理中的医生的基本信息增加机构弹窗页面
-->
<template>
    <div>
        <dk-dialog
                :baseConfig="dialogConfig"
                :dialogShow.sync="show"
                @cancelCallback="cancel"
                @confirmCallback="confirmValue"
                @closeDialog="cancel"
                >

            <!-- 表单 -->
            <dk-form
                    size="mini"
                    :form="form"
                    :config="formConfig"
                    :inline="true"
                    labelWidth="80px"
                    slot="form"
            ><!-- 按钮 -->
            </dk-form>
            <el-form slot="btns" :inline="true" size="mini">
                <el-form-item label="">
                    <el-button  size="mini" type="primary" @click="search">搜索</el-button>

                </el-form-item>
            </el-form>

            <dk-table
                    slot="table"
                    ref="table"
                    border
                    selectRadio
                    stripe
                    :data="tableData"
                    :config="tableConfig"
                    index
                    :pageNum="1"
                    :pageSize="1"
                    @radioClick="handleCurrentChange"
                    :radioSelect="radioSelect"
            >
            </dk-table>
            <dk-page slot="page" @currentChange="changePage" :pageConfig="recordPage"></dk-page>


        </dk-dialog>
    </div>
</template>

<script>
   export default {
      name: "hospitalName",
      props: [ "show", "defaultVal","selectedArea"],
      //selectedArea(是从父组件传过来的省、市、曲线Id)
      //defaultVal(是父组件传给子组件的默认的用于回显单选按钮的值)
      data () {
         return {
            dialogConfig: {
               title: "选择医院",
               width:'60%'
            },
            //检索表单
            form: {
               hospitalName: ""
            },
            // 搜索条件相关配置
            formConfig: [
               {
                  type: "input",
                  label: "医院名称",
                  value: "hospitalName",
                  option: {
                     placeholder: "请输入医院名称",
                     disabled: false
                  }
               }
            ],
            //table数据
            tableData: [],
            tableConfig: [
               {
                  type: "",
                  label: "机构名称",
                  value: "name"
               },
               {
                  type: "",
                  label: "机构等级",
                  value: "levelName"
               }
            ],
            //pageSize、pageNumber
            recordPage:{
               pageNum: 1,
               pageSize: 10,
               total: 0
            },
            radioSelect:''//用于给table里单选按钮的回显
         };
      },
      mounted () {
         this.getTeacherArr(); //获取医院列表
      },
      watch: {
         'defaultVal.name':{//（radioSelect）用于回显table单选的默认值
            handler(newValue, oldValue) {
               this.radioSelect = this.defaultVal.name;
               console.log(this.radioSelect);
            },
            deep:true,
            immediate: true
         },
         'selectedArea.city':{//监听省ID值变动
            handler(newValue, oldValue) {
               this.getTeacherArr();
            },
            deep:true,
            immediate: true
         },
         'selectedArea.county':{//监听市ID值变动
            handler(newValue, oldValue) {
               this.getTeacherArr();
            },
            deep:true,
            immediate: true
         },
         'selectedArea.area':{//监听区县ID值变动
            handler(newValue, oldValue) {
               this.getTeacherArr();
            },
            deep:true,
            immediate: true
         }
      },
      methods: {
         //表格点击事件
         handleCurrentChange (val) {
            console.log(val);
            this.defaultVal.name=val.name;
            this.defaultVal.id=val.id;
         },
         //点击（确定）按钮---把子组件的值传给父组件
         confirmValue () {
            this.$emit("getStatus",this.defaultVal);
         },
         //关闭弹窗
         cancel () {
            this.$emit("closeTeacher")
         },
         //根据从父组件传过来的省、市、区县获取医院
         getTeacherArr () {
            //获取讲师的列表
            this.loading = true;
            this.$get("/data/my", {
               pathL: "/doctor/areaHospital/hospitalList",
               pageNum:this.recordPage.pageNum,
               pageSize:this.recordPage.pageSize,
               name: this.form.hospitalName,//医院名称
               provinceId:this.selectedArea.city,//省id
               cityId:this.selectedArea.county,//市id
               countyId:this.selectedArea.area,//县id
               sort:'gbkName'
            }).then(res => {
               this.loading = false;
               if (!res.state) {
                  this.dealTable(res.data.result);
                  this.recordPage.total=res.data.total;
               }
               else {
                  this.$message("获取医院列表失败！");
               }
            });
         },
         //下面是处理table单选radio中需要绑定的radioName值
         dealTable(data){
            data.forEach(item=>{
               item.radioName=item.name;
            });
            this.tableData = data;
         },
         //点击（搜索）按钮
         search () {
            this.recordPage.pageNum= 1;
            this.getTeacherArr();
         },
         //单节点点击事件
         changePage(page) {
            this.recordPage.pageNum=page;
            this.getTeacherArr();
         }
      }
   };
</script>

