<template>
  <div>
    <el-input
      placeholder="输入人员名"
      v-model="filterText">
    </el-input>
    <div class="m-t-10" style="height: 300px; overflow: auto;">
      <el-tree
        accordion
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        node-key="pId"
        :check-strictly="true"
        :filter-node-method="filterNode"
        @check-change="handleNodeClick"
        ref="tree">
      </el-tree>
    </div>
  </div>
</template>

<script>
	export default {
		name: "addPeople",
		data () {
			return {
				filterText: '',
				data: [ {
					id: 1,
					label: '一级 1',
					children: [ {
						id: 4,
						label: '二级 1-1',
						children: [ {
							id: 9,
							label: '三级 1-1-1'
						}, {
							id: 10,
							label: '三级 1-1-2'
						} ]
					} ]
				}, {
					id: 2,
					label: '一级 2',
					children: [ {
						id: 5,
						label: '二级 2-1'
					}, {
						id: 6,
						label: '二级 2-2'
					} ]
				}, {
					id: 3,
					label: '一级 3',
					children: [ {
						id: 7,
						label: '二级 3-1'
					}, {
						id: 8,
						label: '二级 3-2'
					} ]
				} ],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				checkedId: ''
			};
		},
		mounted () {
			this.getPeople();
		},
		watch: {
			filterText (val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			filterNode (value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			getPeople () {
				let that = this;
				that.data = [];
				this.$get('/data/my', {
					pathL: '/ap/sysUser/getSysDepartmentAndUserById'
				}).then(res => {
					if (res.state == 0) {
						that.data = that.dealData(res.data.rootNodes);
					}
					else {
						that.$message("获取数据错误！");
					}
				}).catch(err => {
					that.$message("请求数据失败！");
				})
			},
			dealData (data) { // 递归处理数据的值
				let that = this;
				data.forEach(item => {
					item.pId = item.value;
					if (item.pathIds=='d') {
						item.disabled = true;
						that.dealData(item.children);
					}
				})
				return data;
			},
			handleNodeClick (data, checked, node) {
				if (checked == true) {
					this.checkedId = data.id;
					this.$refs.tree.setCheckedNodes([ data ]);
					this.$emit('treeClick', data)
				}else{
					this.$emit('treeClick', null)
        }
			}
		},
	};
</script>

<style scoped>

</style>