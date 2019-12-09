<!--
* author: huoxibin
* created: 2018/7/26
* describe:订单管理/订单管理/查看详情
-->
<template>
    <div class="member-details">
      <div class="details">
        <el-form  label-width="100px" size="mini" class="demo-ruleForm">

          <el-row>
            <el-col :span="16">
              <el-form-item label="套餐名称:" label-width="120px">
                <div>忧享套餐</div>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div class="back">
          <el-button type="primary" @click="$router.go(-1)" size="small" style="width:100px;" plain>返 回</el-button>
        </div>
      </div>
    </div>
</template>

<style scoped>
  .member-details{
    width: 100%;
    height: 100%;
  }
  .details{
    width: 100%;
    height: 100%;
  }
   .back {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
    export default {
        name: "",
        components: {},
        props: [],
        data() {
            return {}
        },
        methods: {},
        mounted() {

        },
        watch: {},
        computed: {}
    }
</script>

