<template>
  <div class="recommend-preview">
    <base-preview>
      <div class="box">
        <h2>{{form.activityName}}</h2>
        <img :src="form.doctorImage">
        <p class="title-1">
          <span class="f-16">{{doctor.doctorName}}</span>
          <span>{{doctor.theTitleName}}</span>
        </p>
        <p class="title-2">
          <span>{{doctor.hospitalName}}</span>
          <span>{{doctor.departmentName}}</span>
        </p>
        <p>{{doctor.introduction}}</p>
      </div>
      <div class="title">
        <h4>课程</h4>
        <ul>
          <li v-for="item in courseInfoList" :key="item.id">
            <img :src="item.imageUrl">
            <p class="text">{{item.courseName}}</p>
          </li>
        </ul>
      </div>
      <div class="title">
        <h4>资讯</h4>
        <ul>
          <li v-for="item in newsArticleInfoList" :key="item.id">
            <img :src="item.image">
            <p class="text">{{item.title}}</p>
          </li>
        </ul>
      </div>
      <div class="title">
        <h4>病例</h4>
        <ul>
          <li v-for="item in typicalInfoList" :key="item.id">
            <img :src="item.doctorImage" alt>
            <p class="text">{{item.diseasesTitle}}</p>
          </li>
        </ul>
      </div>
    </base-preview>
  </div>
</template>

<script>
	export default {
		name: "RecommendPreview",
		data () {
			return {
				form: {},
				doctor: {},
				newsArticleInfoList: [],
				typicalInfoList: [],
				courseInfoList: []
			};
		},
		created () {
			this.$get("/data/my", {
				pathL: "/doctor/activityRecommendDoctor/recommendDetail",
				id: this.$route.query.id
			}).then(res => {
				if (res.state === 0) {
					this.form = res.data.recommend;
					// 医生信息
					this.doctor = res.data.doctorInfo;
					// 课程
					this.courseInfoList = res.data.courseInfoList;
					// 资讯
					this.newsArticleInfoList = res.data.newsArticleInfoList;
					// 病例
					this.typicalInfoList = res.data.typicalInfoList;
				}
				else {
					this.$message({
						type: "warning",
						message: res.msg,
						center: true
					});
				}
			});
		}
	};
</script>

<style lang="scss" scoped>

  .box {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 10px 0;
    h2 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    img {
      max-width: 100%;

    }

    .title-1 {
      margin-top: 10px;
      font-size: 14px;
      span{
        color: #666;
        margin: 0 10px;
      }
      .f-16 {
        font-size: 16px;
        color: #000;
        font-weight: bold;
      }
    }

    .title-2 {
      margin-top: 10px;
      font-size: 14px;
      color: #666;

    }

  }


</style>

