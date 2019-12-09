<template>
  <base-preview>
    <div class="case-preview">
      <h3>{{form.diseasesTitle}}</h3>
      <div class="doctor">
        <img class="avatar-photo" :src="form.doctorImage" alt="doctor">
        <div class="info">
          <p>
            <span>{{form.doctorPosition}}</span>
            <span class="now">{{form.doctorName}}</span>
          </p>
          <p>
            <span>{{form.hospitalName}}</span>
            <span class="now">{{form.ownedSecondLev}}</span>
          </p>
          <p>
            <span>擅长：</span>
            <span>{{form.doctorProfession}}</span>
          </p>
        </div>
      </div>
      <div class="disease">
        <ul>
          <li v-for="item in list" :key="item.model">
            <p style="margin: 10px 0;font-size: 18px">{{`【${item.name}】`}}</p>
            <p style="margin-left: 20px;">{{form.diseasesContent[item.model]}}</p>
          </li>
        </ul>
      </div>
    </div>
  </base-preview>
</template>

<script>
export default {
  name: "CasePreview",
  data() {
    return {
      form: {},
      list: [
        {
          name: "基本信息",
          model: "baseInfo"
        },
        {
          name: "主诉",
          model: "tell"
        },
        {
          name: "现病史",
          model: "currentDisease"
        },
        {
          name: "个人史",
          model: "personal"
        },
        {
          name: "既往史",
          model: "past"
        },
        {
          name: "婚育史",
          model: "marriage"
        },
        {
          name: "月经史",
          model: "menstruation"
        },
        {
          name: "外伤及手术史",
          model: "trauma"
        },
        {
          name: "中毒及药物过敏史",
          model: "poisoning"
        },
        {
          name: "冶游史",
          model: "metalTour"
        },
        {
          name: "家族史",
          model: "family"
        },
        {
          name: "查体",
          model: "physicalExamination"
        },
        {
          name: "辅助检查",
          model: "auxiliary"
        },
        {
          name: "诊断",
          model: "diagnosis"
        },
        {
          name: "鉴别诊断",
          model: "Identification"
        },
        {
          name: "治疗",
          model: "treatment"
        },
        {
          name: "分析总结",
          model: "analysis"
        }
      ]
    };
  },
  created() {
    this.getData(this.$route.query.id);
  },
  methods: {
    // 获取疾病信息
    getData(id) {
      this.$get("/data/my", {
        pathL: "/doctor/typicalDiseasesArticle/getTypicalDetail",
        id
      }).then(res => {
        if (res.state === 0) {
          this.form = res.data;
          this.form.diseasesContent = JSON.parse(this.form.diseasesContent);
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.case-preview {
  padding: 10px;
  box-sizing: border-box;
  h3 {
    text-align: left;
    line-height: 30px;
  }
  .doctor {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .avatar-photo {
      max-width: 150px;
      max-height: 180px;
    }
    .info {
      height: 100px;
      display: flex;
      flex-flow: column;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      justify-content: space-around;
      .now {
        margin: 20px;
      }
    }
  }
}
</style>

