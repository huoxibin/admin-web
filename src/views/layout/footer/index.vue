<template>
  <footer>
    <p>©️2017-{{date}}健科云网&nbsp;技术支持  {{version}}</p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      date: new Date().getFullYear(),
      version:process.env.VUE_APP_VERSION
    };
  }
};
</script>

<style scoped>
footer {
  width: 100%;
  height: 50px;
  background-color: #0099dd;
}
footer p {
  text-align: center;
  line-height: 50px;
  color: #fff;
}
</style>
