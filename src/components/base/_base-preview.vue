<template>
  <div class="base-preview">
    <div class="base-preview-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasePreview"
};
</script>

<style lang="scss" scoped>
.base-preview {
  width: 496px;
  height: 1005px;
  margin: auto;
  background: url("../../assets/iphone.jpg") no-repeat center;
  position: relative;
  &-container {
    width: 421px;
    height: 748px;
    position: absolute;
    top: 129px;
    left: 38px;
    overflow-x: hidden;
    overflow-y: auto;

  }
  .title {
    margin-top: 10px;
    border-style: solid;
    border-width: 10px 0 0 0;
    border-color: #eee;
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
    h4{ border-left: solid 4px #00c1de; padding-left:10px;}

    ul {

      display: flex;
      flex-flow: wrap;
      margin: 15px auto;
      width: 100%;


      li {
        width: 25%;
        img {

          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          margin: 0 auto;
          text-align: center;
          border-radius: 10px;
        }
      }

      .text {
        text-align: center;
        color: #999;
        margin-top: 10px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
</style>