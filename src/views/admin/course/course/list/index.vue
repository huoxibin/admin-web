<template>
  <div class="tabZujian">
    <child1 ref="ydkPage"></child1>
  </div>
</template>
<script>
import dkDoctorTab from "./dkDoctorTab";
export default {
  name: "index",
  components: {
    child1: dkDoctorTab
  },
  data() {
    return {
      currentP: 1,
      initTab: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path === "/commodity/course/add") {
      next(vm => {
        console.log("不刷新定位");
        vm.$refs.ydkPage.searchCourseList();
      });
    } else {
      console.log("重新刷新");
      next();
    }
  },
  mounted() {
    //this.initTab = this.list[0].key;
  },
  methods: {
    getCurrentPage(val) {
      this.currentP = val;
    },
    handleClick() {
      console.log("切换标签");
    }
  }
};
</script>

<style scoped>
</style>
