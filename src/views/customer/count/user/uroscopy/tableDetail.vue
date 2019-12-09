<template>
  <el-table
    :data="tableData"
    border
    lazy
    stripe
    height="100%"
    style="width: 100%">

    <el-table-column
      prop="c1"
      label="酮体"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c1 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c1)>0.5"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c1)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c2"
      label="潜血"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c2 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c2)>10"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c2)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c3"
      label="葡萄糖"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c3 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c3)>5"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c3)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c4"
      label="白细胞"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c4 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c4)>15"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c4)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c5"
      label="胆红素"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c5 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c5)>17"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c5)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c6"
      label="蛋白质"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c6 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c6)>0.15"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c6)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c7"
      label="亚硝酸盐"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c7 }}
      </template>
    </el-table-column>
    <el-table-column
      prop="c8"
      label="抗坏血酸"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c8 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c8)>0.5"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c8)<0"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="c9"
      label="尿胆原"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.c9 }}
        <i class="el-icon-top b symbol-start" v-if="changeNumber(scope.row.c9)>16"></i>
        <i class="el-icon-bottom b symbol-start" v-if="changeNumber(scope.row.c9)<0"></i>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
	export default {
		name: "tableList",
		props: {
			tableData: {
				type: Array,
				required: true
			}
		},
		data: () => {
			return {
				// tableData: [],
			}
		},
		methods: {
			detailRecord (row) {
				this.$router.push({
					path: '/count/uroscopy/detail',
					query: {
						id: row.userId,
						mobile: row.mobile,
						deviceSnType: row.deviceSnType
					}
				})
			},
			changeNumber (number) {
				return number.replace(/[^\d.]/g, '');
			}
		}
	}
</script>

<style scoped>

</style>
