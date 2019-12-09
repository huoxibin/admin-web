<template>
  <div class="recommend-edit">
    <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="活动页名称" prop="activityName">
        <p v-if="type === 'preview'">{{form.activityName}}</p>
        <el-input v-else v-model="form.activityName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="医生图片" prop="doctorImage">
        <img v-if="type === 'preview'" :src="form.doctorImage">
        <base-upload v-else :fileList="fileList" :limit="1" :rule="ruleImg" :tip="tipImg" @notify="handleUpload"></base-upload>
      </el-form-item>
      <el-form-item
        v-for="item in formConfig"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
      >
        <el-button v-if="type !== 'preview'" type="primary" @click="binding(item.label)">选 择</el-button>
        <el-tag 
          v-for="(tag,index) in tags[item.value]" 
          :key="tag.id" 
          style="margin: 0 20px;"
          class="sortTag">
          <span>{{tag.name}}</span>
          <i v-show="isShowUp(item.value,index)" class="sortUp" @click="sortUp(item.value,index,index-1)" title="向前移动一个位置"></i>
          <i v-show="isShowDown(item.value,index)" class="sortDown" @click="sortDown(item.value,index,index+1)" title="向后移动一个位置"></i>
        </el-tag>
      
      </el-form-item>
      <el-form-item label="活动日期" prop="date">
        <p v-if="type === 'preview'">{{`${form.startTime} - ${form.endTime}`}}</p>
        <base-date v-else v-model="form.date" :picker-options="pickerOptions" type="daterange" @change="change"></base-date>
      </el-form-item>
      <el-form-item label="是否允许评论" prop="allowComment">
        <el-radio v-if="type !== 'preview'" v-model="form.allowComment" :label="0">否</el-radio>
        <el-radio v-if="type !== 'preview'" v-model="form.allowComment" :label="1">是</el-radio>
        <p v-if="type === 'preview' && form.allowComment === 1">是</p>
        <p v-if="type === 'preview' && form.allowComment === 0">否</p>
      </el-form-item>
      <el-form-item label="阅读量" v-if="type === 'preview'">
        <p>{{form.readCount}}</p>
      </el-form-item>
      <el-form-item label="创建日期" v-if="type === 'preview'">
        <p>{{form.createTime}}</p>
      </el-form-item>
      <el-form-item label="发布日期" v-if="type === 'preview'">
        <p>{{form.publishTime}}</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="type !== 'add'" @click="preview">预 览</el-button>
        <el-button type="primary" v-if="type !== 'preview'" @click="submit">保 存</el-button>
        <el-button @click="$router.back()">返 回</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择分类 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :append-to-body="true"
    >
      <!-- form -->
      <el-form :inline="true" :model="bindingForm" size="mini" label-width="80px">
        <!-- 绑定讲师 -->
        <el-form-item label="医生名称/手机号" label-width="120px" v-if="dialogTitle === '绑定讲师'">
          <el-input v-model="bindingForm.search"></el-input>
        </el-form-item>
        <!-- 绑定课程 -->
        <el-form-item label="课程名称" v-if="dialogTitle === '绑定课程'">
          <el-input v-model="bindingForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" v-if="dialogTitle === '绑定课程'">
          <el-select v-model="bindingForm.type">
            <el-option label="请选择" :value="null"></el-option>
            <el-option label="点播课程" :value="3"></el-option>
            <el-option label="回放课程" :value="2"></el-option>
            <el-option label="直播课程" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- 绑定资讯 -->
        <el-form-item label="资讯名称" v-if="dialogTitle === '绑定资讯'">
          <el-input v-model="bindingForm.title"></el-input>
        </el-form-item>
        <!-- 绑定病例 -->
        <el-form-item label="病例标题" v-if="dialogTitle === '绑定病例'">
          <el-input v-model="bindingForm.diseasesTitle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查 询</el-button>
        </el-form-item>
      </el-form>
      <div class="table" v-loading="loading">
        <el-table
          ref="table"
          :data="data"
          border
          stripe
          style="width: 100%"
          height="400"
          @selection-change="handleSelectionChange"
          :row-key="getRowKeys"
        >
          <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>
          <el-table-column
            type="index"
            fixed
            :index="serialNumber"
            width="100"
            label="序号"
            align="center"
          ></el-table-column>
          <div class="table-colum" v-for="(item, index) in tableConfig" :key="index">
            <el-table-column
              v-if="item.show === dialogTitle"
              :prop="item.value"
              :label="item.label"
              align="center"
            ></el-table-column>
          </div>
        </el-table>
        <!-- pagination -->
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="status" @click="bindSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RecommendEdit",
  computed: {
    date() {
      return this.form.date;
    }
  },
  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      ruleImg:{
        type: ['image/jpg', 'image/jpeg', 'image/gif', 'image/gif', 'image/png', 'image/bmp'],
        size: 100
      },
      tipImg: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
      type: this.$route.params.type,
      form: {
        activityName: "",
        doctorImage: "",
        doctorId: "",
        courseIds: "",
        articleIds: "",
        typicalIds: "",
        startTime: "",
        endTime: "",
        allowComment: "",
        date: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      formConfig: [
        {
          label: "绑定讲师",
          value: "doctorId"
        },
        {
          label: "绑定课程",
          value: "courseIds"
        },
        {
          label: "绑定资讯",
          value: "articleIds"
        },
        {
          label: "绑定病例",
          value: "typicalIds"
        }
      ],
      status: true,
      tags: {
        doctorId: [],
        courseIds: [],
        articleIds: [],
        typicalIds: []
      },
      beforeTags: {
        doctorId: [],
        courseIds: [],
        articleIds: [],
        typicalIds: []
      },
      rules: {
        activityName: {
          required: true,
          message: "请输入活动页名称",
          trigger: "blur"
        },
        doctorImage: {
          required: true,
          message: "请上传医生图片",
          trigger: "blur"
        },
        doctorId: {
          required: true,
          message: "请绑定医生",
          trigger: "blur"
        },
        date: {
          required: true,
          message: "请选择活动日期",
          trigger: "blur"
        },
        allowComment: {
          required: true,
          message: "请选择是否允许评论",
          trigger: "blur"
        }
      },
      fileList: [],
      dialogVisible: false,
      dialogTitle: "",
      bindingForm: {
        search: "",
        title: "",
        diseasesTitle: ""
      },
      tableConfig: [
        {
          show: "绑定讲师",
          label: "医生姓名",
          value: "doctorName"
        },
        {
          show: "绑定讲师",
          label: "机构名称",
          value: "hospitalName"
        },
        {
          show: "绑定讲师",
          label: "科室",
          value: "departmentName"
        },
        {
          show: "绑定讲师",
          label: "手机号",
          value: "mobile"
        },
        {
          show: "绑定课程",
          label: "课程名称",
          value: "courseName"
        },
        {
          show: "绑定课程",
          label: "课程讲师",
          value: "doctorName"
        },
        {
          show: "绑定课程",
          label: "所属类型",
          value: "typeName"
        },
        {
          show: "绑定课程",
          label: "创建人",
          value: "userName"
        },
        {
          show: "绑定资讯",
          label: "资讯名称",
          value: "title"
        },
        {
          show: "绑定资讯",
          label: "文章来源",
          value: "fromChannel"
        },
        {
          show: "绑定资讯",
          label: "平台分类",
          value: "terminalChannel"
        },
        {
          show: "绑定资讯",
          label: "创建人",
          value: "theCreater"
        },
        {
          show: "绑定病例",
          label: "病例标题",
          value: "diseasesTitle"
        },
        {
          show: "绑定病例",
          label: "平台分类",
          value: "belongedType"
        },
        {
          show: "绑定病例",
          label: "发布人",
          value: "publisher"
        }
      ],
      data: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  watch: {
    //编辑时更改时间
    date(now) {
      this.form.startTime = now[0];
      this.form.endTime = now[1];
    }
  },
  methods: {
    //显示排序的上下箭头
    isShowUp(type,index){
      if(type === "doctorId" || index === 0 || this.type === "preview"){
        return false;
      }else{
        return true;
      }
    },
    isShowDown(type,index){      
      if(type === "doctorId" || this.type === "preview"){
        return false;
      }else if(type === "courseIds"){
        let maxLength = this.tags.courseIds.length;
        if(maxLength === index+1){
          return false
        }else{
          return true;
        }
      }else if(type === "articleIds"){
        let maxLength = this.tags.articleIds.length;
        if(maxLength === index+1){
          return false
        }else{
          return true;
        }
      }else if(type === "typicalIds"){
        let maxLength = this.tags.typicalIds.length;
        if(maxLength === index+1){
          return false
        }else{
          return true;
        }
      }
    },
    //向前移动一个位置
    sortUp(type,currentIndex,sotrIndex){
      if(type === "courseIds"){
        let arr = this.tags.courseIds;
        arr[currentIndex] = arr.splice(sotrIndex, 1, arr[currentIndex])[0];
      }else if(type === "articleIds"){
        let arr = this.tags.articleIds;
        arr[currentIndex] = arr.splice(sotrIndex, 1, arr[currentIndex])[0];
      }else if(type === "typicalIds"){
        let arr = this.tags.typicalIds;
        arr[currentIndex] = arr.splice(sotrIndex, 1, arr[currentIndex])[0];
      }
    },
    //向后移动一个位置
    sortDown(type,currentIndex,sotrIndex){
      if(type === "courseIds"){
        let arr = this.tags.courseIds;
        arr[currentIndex] = arr.splice(sotrIndex, 1, arr[currentIndex])[0];
      }else if(type === "articleIds"){
        let arr = this.tags.articleIds;
        arr[currentIndex] = arr.splice(sotrIndex, 1, arr[currentIndex])[0];
      }else if(type === "typicalIds"){
        let arr = this.tags.typicalIds;
        arr[currentIndex] = arr.splice(sotrIndex, 1, arr[currentIndex])[0];
      }
    },
    //编辑时更改时间
    change (now) {
      this.form.startTime = `${now[0]} 00:00:00`;
      this.form.endTime = `${now[1]} 23:59:59`;
    },
    // 上传图片
    handleUpload(file) {
      if (file.length === 0) {
        this.form.doctorImage = "";
      } else {
        this.form.doctorImage = file[0].url;
      }
    },
    // 绑定
    binding(title) {
      this.pageNum = 1;
      this.dialogTitle = title;
      this.dialogVisible = true;
      this.getData(title);
    },
    getData(title) {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      switch (title) {
        case "绑定讲师":
          data.pathL = "/doctor/doctorInfo/getDoctorBaseInfoList";
          data.search = this.bindingForm.search;
          data.checked = 2;
          data.sort = "name";
          break;
        case "绑定课程":
          data.pathL = "/doctor/livecourseInfo/courseList";
          data.name = this.bindingForm.name;
          data.type = this.bindingForm.type;
          break;
        case "绑定资讯":
          data.pathL = "/news/newsArticle/getArticleList";
          data.title = this.bindingForm.title;
          data.status = 1;
          data.delFlag = 0;
          data.terminalId = 6;
          break;
        case "绑定病例":
          data.pathL = "/doctor/typicalDiseasesArticle/getListByConditions";
          data.diseasesTitle = this.bindingForm.diseasesTitle;
          data.onlineStatus = 1;
          data.publisher = "";
          data.belongedType = "";
          data.beginDate = "";
          data.endDate = "";
          data.beginDatePublish = "";
          data.endDatePublish = "";
          break;
      }
      this.loading = true;
      this.$get("/data/my", data).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.total = res.data.total;
          if (this.dialogTitle === "绑定病例") {
            this.data = res.data.result;
            this.data.forEach(item => {
              const belongedType = JSON.parse(item.belongedType);
              item.belongedType = belongedType.map(i => i.label).join(",");
            });
          } else {
            this.data = res.data.result;
          }
        } else {
          this.$message({
            type: "error",
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 查询
    search() {
      this.pageNum = 1;
      this.getData(this.dialogTitle);
    },
    // 表格序号
    serialNumber(index) {
      return (this.pageNum - 1) * this.pageSize + (index + 1);
    },
    // 分页列表
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData(this.dialogTitle);
    },
    // 多选框
    handleSelectionChange(val) {
      //绑定讲师
      let filterDoc = val.filter(item => {
        if(item.dataType === "DOC"){
          return item
        }
      });

      //绑定课程
      let filterCourse = val.filter(item => {
        if(item.dataType === "COURSE"){
          return item
        }
      });

      //绑定资讯
      let filterArticle = val.filter(item => {
        if(item.dataType === "ARTICLE"){
          return item
        }
      });

      //绑定病例
      let filterTypical  = val.filter(item => {
        if(item.dataType === "TYPICAL"){
          return item
        }
      });
      if (val.length !== 0) {
        this.status = false;
        switch (this.dialogTitle) {
          case "绑定讲师":
            if (filterDoc.length > 1) {
              this.$message({
                type: "warning",
                message: "只能选择一个医生",
                center: true
              });
              this.status = true;
            } else {
              this.beforeTags.doctorId = filterDoc.map(item =>{
                return {
                  name: val[0].doctorName,
                  id: val[0].doctorId
                }
              });
            }
            break;
          case "绑定课程":
            if (filterCourse.length > 4) {
              this.$message({
                type: "warning",
                message: "最多选择是四个课程",
                center: true
              });
              this.status = true;
            } else {
              this.beforeTags.courseIds = filterCourse.map(item => {
                return {
                  name: item.courseName,
                  id: `${item.type}_${item.id}`
                };
              });
            }
            break;
          case "绑定资讯":
            if (filterArticle.length > 4) {
              this.$message({
                type: "warning",
                message: "最多选择是四个资讯",
                center: true
              });
              this.status = true;
            } else {
              this.beforeTags.articleIds = filterArticle.map(item => {
                return {
                  name: item.title,
                  id: item.id
                };
              });
            }
            break;
          case "绑定病例":
            if (filterTypical.length > 4) {
                this.$message({
                type: "warning",
                message: "最多选择是四个病例",
                center: true
              });
              this.status = true;
            } else {
              this.beforeTags.typicalIds = filterTypical.map(item => {
                return {
                  name: item.diseasesTitle,
                  id: item.id
                };
              });
            }
            break;
        }
      }
    },
    // 绑定提交
    bindSubmit() {
      switch (this.dialogTitle) {
        case "绑定讲师":
          this.tags.doctorId = this.beforeTags.doctorId;
          this.form.doctorId = this.beforeTags.doctorId[0].id;
          break;
        case "绑定课程":
          this.tags.courseIds = this.beforeTags.courseIds;
          const courseIds = this.beforeTags.courseIds.map(item => item.id);
          this.form.courseIds = courseIds.join(",");
          break;
        case "绑定资讯":
          this.tags.articleIds = this.beforeTags.articleIds;
          const articleIds = this.beforeTags.articleIds.map(item => item.id);
          this.form.articleIds = articleIds.join(",");
          break;
        case "绑定病例":
          this.tags.typicalIds = this.beforeTags.typicalIds;
          const typicalIds = this.beforeTags.typicalIds.map(item => item.id);
          this.form.typicalIds = typicalIds.join(",");
          break;
      }
      this.dialogVisible = false;
      this.status = true;
    },
    // 预览
    preview() {
      this.$router.push({
        path: "/news/activity_page/recommend/preview",
        query: {
          id: this.$route.query.id
        }
      });
    },
    // 提交
    submit() {
      let articleIdsArr = [],
          typicalIdsArr = [],
          courseIdsArr = [];     
      for(var item in this.tags.articleIds){
        articleIdsArr.push(this.tags.articleIds[item].id);
      }
      for(var item in this.tags.typicalIds){
        typicalIdsArr.push(this.tags.typicalIds[item].id);
      }
      for(var item in this.tags.courseIds){
        courseIdsArr.push(this.tags.courseIds[item].id);
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            pathL: "/doctor/activityRecommendDoctor/addOrUpdateActivity",
            activityName: this.form.activityName,
            doctorImage: this.form.doctorImage,
            doctorId: this.form.doctorId,
            courseIds: courseIdsArr.join(','), //使用排序后的数据（绑定课程）
            articleIds: articleIdsArr.join(','), //使用排序后的数据（绑定资讯）
            typicalIds: typicalIdsArr.join(','), //使用排序后的数据（绑定病例）
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            createUserId: this.$store.getters.userInfo.id,
            createUserName: this.$store.getters.userInfo.userName,
            allowComment: this.form.allowComment,
            showTemplate: 0
          };
          if (this.type === "update") {
            data.id = this.form.id;
          }
          if (this.form.articleIds !== '' || this.form.courseIds !== '' || this.form.typicalIds !== '') {
            this.$post("/data/my", data).then(res => {
              if (res.state === 0) {
                this.$message({
                  type: "success",
                  message: "编辑成功",
                  center: true
                });
                this.$router.push("/news/activity_page/recommend/list");
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg,
                  center: true
                });
              }
            });
          } else {
            this.$message({
              type: "success",
              message: "课程,资讯,病例请至少绑定一个!",
              center: true
            });
            return
          }
        } else {
          this.$message({
            type: "warning",
            message: "请正确填写表单",
            center: true
          });
        }
      });
    },
    // 活动页详情
    getInfo(id) {
      this.$get("/data/my", {
        pathL: "/doctor/activityRecommendDoctor/recommendDetail",
        id
      }).then(res => {
        if (res.state === 0) {
          const form = res.data.recommend;
          this.form = form;
          this.fileList = [
            {
              url: form.doctorImage
            }
          ];
          this.form.date = [form.startTime, form.endTime];
          // 医生
          const doctorInfo = res.data.doctorInfo;
          this.tags.doctorId = [
            {
              name: doctorInfo.doctorName,
              id: doctorInfo.doctorId
            }
          ];
          // 课程
          let resCourseIds = form.courseIds.split(',');
          for(var p=0;p<resCourseIds.length; p++){            
            for(var q=0; q<res.data.courseInfoList.length; q++ ){
              if(resCourseIds[p] === `${res.data.courseInfoList[q].type}_${res.data.courseInfoList[q].id}`){
                this.tags.courseIds.push({
                  name: res.data.courseInfoList[q].courseName,
                  id: `${res.data.courseInfoList[q].type}_${res.data.courseInfoList[q].id}`                 
                });
              }
            }
          } 
          // 资讯
          let resArticleIds = form.articleIds.split(',');
          for(var m=0;m<resArticleIds.length; m++){            
            for(var n=0; n<res.data.newsArticleInfoList.length; n++ ){
              if(parseInt(resArticleIds[m]) === res.data.newsArticleInfoList[n].id){
                this.tags.articleIds.push({
                  name: res.data.newsArticleInfoList[n].title,
                  id: res.data.newsArticleInfoList[n].id                  
                });
              }
            }
          }          
          // 病例
          let resTypicalIds = form.typicalIds.split(',');
          for(var x=0;x<resTypicalIds.length; x++){            
            for(var y=0; y<res.data.typicalInfoList.length; y++ ){
              if(parseInt(resTypicalIds[x]) === res.data.typicalInfoList[y].id){
                this.tags.typicalIds.push({
                  name: res.data.typicalInfoList[y].diseasesTitle,
                  id: res.data.typicalInfoList[y].id                  
                });
              }
            }
          }
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
            center: true
          });
        }
      });
    }
  },
  created() {
    const type = this.$route.params.type;
    if (type !== "add") {
      this.getInfo(this.$route.query.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend-edit {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
.sotrTag{
  position: relative;
}
.sortUp,.sortDown{
  height: 100%;
  position: relative;
  font-style: normal;
}
.sortUp::before{
  display: block;
  content: "\2191";
  width: 10px;
  height: 100%;
  position: absolute;
  top: -6px;
  right: -28px;
}
.sortDown::before{
  display: block;
  content: "\2193";
  width: 10px;
  height: 100%;
  position: absolute;
  top: -6px;
  right: -42px;
}
</style>

