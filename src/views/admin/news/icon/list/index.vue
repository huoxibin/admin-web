<template>
  <div class="health comment" v-loading="Loading" element-loading-text="拼命加载中" style="overflow: scroll;">
    <el-tabs tab-position="left" v-model="initTab" @tab-click="handleClick">
      <el-tab-pane
        style="height: 100%;"
        v-for="item,index in list"
        :key="index"
        :label="item.note"
        :name="item.name"
        :tabId="item.id"
      >
        <div class="health-bottom" :style="{height:tableHeight+'px'}" element-loading-text="拼命加载中">
          <div class="title-bar">
            <p>列表信息</p>
          </div>
          <div class="column-bottom">
            <el-table
              :height="tableHeight"
              :max-height="tableHeight"
              border
              stripe
              style="width: 100%"
              ref="data"
              :data="tableData"
            >
              <el-table-column
                prop="num"
                label="序号"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                align="center"
                width="220">
              </el-table-column>
              <el-table-column
                prop="imgurl"
                label="图片"
                align="center"
                width="120">
                <template slot-scope="columnVal">
                  <img class="small-img" :src="columnVal.row.imgurl" alt/>
                </template>
              </el-table-column>
              <el-table-column
                label="排序"
                align="center"
                width="120">
                <template slot-scope="scope">
                  <el-button type="text" :disabled="scope.$index!==0 ? false:true" @click="sortRowInfo(1,scope.$index)">
                    <i
                      class="el-icon-upload2 small-icon c-p" :class="scope.$index!==0 ?'blue':''"></i></el-button>
                  <el-button type="text" :disabled="scope.$index==7 ? true:false" @click="sortRowInfo(2,scope.$index)">
                    <i
                      class="el-icon-download small-icon c-p" :class="scope.$index==7 ?'':'blue'"></i></el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="editRowInfo(scope.$index, scope.row)" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog width="400px" title="编辑" append-to-body :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 300px">
        <el-form-item label="名称" :label-width="formLabelWidth">
          {{form.name}}
        </el-form-item>
        <el-form-item label="ICON图片" :label-width="formLabelWidth">
          <img :src="form.url" class="small-img"/>
          <!-- <base-upload
              :fileList="fileList"
              :rule="imgUpload.rule"
              :limit="imgUpload.limit"
              @notify="handleUpload"
          >
          </base-upload> -->
          <div class="upload" v-loading="uploadLoading">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="form.url" :src="form.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" @click="saveRowInfo" size="mini">保存</el-button>
            <el-button @click="dialogFormVisible = false" size="mini">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				tableHeight:0,
				initTab: 'first',//设置默认的tab显示的标签
				Loading: false, //加载条进度条
				list: [ //左侧的二级菜单tab显示
					{
						note: '医生端首页ICON',
						name: 'first',
						id: '1'
					}
				],
				fileList: [],//icon 上传文件列表
				tableData: [],
				dialogFormVisible: false,
				form: {
					id: '',//存储的id
					name: '',//存储icon 名称
					url: '' //存储icon 图片路径
				},
				formLabelWidth: '90px',
				// imgUpload:{
				//     limit:1,//上传文件个数限制
				//     type: "file",
				//     rule: {
				//         type: ['image/jpg', 'image/gif','image/png','image/jpeg'],
				//         size: 100
				//     }
				// },
				// 上传URL
				action: "/data/uploadImg",
				// 上传headers
				headers: {
					accessToken: this.$store.getters.accessToken
				},
				// 上传loading
				uploadLoading: false
			}
		},
		mounted () {
			this.$nextTick(()=> {
				this.tableHeight = window.innerHeight - 150;
			})
			window.onresize = ()=>{
				//调用methods中的事件
				this.$nextTick(() => {
					this.tableHeight = window.innerHeight- 150;
				})
			}
			this.getData();
		},
		methods: {
			getData () {
				let that = this;
				this.$get("/data/my", {
					pathL: "/common/iconPage/getIconList",
				})
					.then(res => {
						if (!res.state) {
							this.tableData = [];
							res.data.forEach((item, index) => {
								const tableitem = {
									num: item.sort, //序号
									name: item.name, //姓名
									imgurl: item.iconUrl, //图片
									id: item.id
								};
								this.tableData.push(tableitem);
							})
						}
						else {
							that.$message("获取数据失败！");
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			handleClick () {
				console.log('进入页面');
			},
			editRowInfo (index, row) {
				this.dialogFormVisible = true;//显示弹窗
				//给显示当前的行信息
				this.form.id = row.id;
				this.form.name = row.name;
				this.form.url = row.imgurl;
			},
			getSortId (fg, rowNum) { //获取排序的id
				let objId = {
					"iconId": 1,
					"sort": 1,
					"nextIconId": "",
					"nextSort": 1
				};

				if (fg == 1) { //向上排序
					objId.iconId = this.tableData[ rowNum - 1 ].id;
					objId.sort = this.tableData[ rowNum - 1 ].num;
					objId.nextIconId = this.tableData[ rowNum ].id;
					objId.nextSort = this.tableData[ rowNum ].num;
				}
				else { //向下排序
					objId.iconId = this.tableData[ rowNum ].id;
					objId.sort = this.tableData[ rowNum ].num;
					objId.nextIconId = this.tableData[ rowNum + 1 ].id;
					objId.nextSort = this.tableData[ rowNum + 1 ].num;
				}
				return objId;
			},
			sortRowInfo (fg, rowNum) {
				let idArr = this.getSortId(fg, rowNum);
				let that = this;
				this.$get('/data/my', {
					pathL: "/common/iconPage/updateIconSort",
					iconId: idArr.iconId,
					sort: idArr.sort,
					nextIconId: idArr.nextIconId,
					nextSort: idArr.nextSort
				}).then(res => {
					if (!res.state) {
						console.log("排序成功了！");
						that.getData();
					}
				}).catch(err => {
					console.log(err);
				});
			},
			saveRowInfo () { //保存行信息
				let that = this;
				this.dialogFormVisible = false; //关闭弹窗
				this.$get("/data/my", {
					pathL: "/common/iconPage/updateIcon",
					iconId: this.form.id,
					iconUrl: this.form.url
				}).then(res => {
					if (!res.state) {
						that.$message('编辑成功！');
						that.fileList = [];
						that.$nextTick(function () {//更新dom
								that.getData();
							}
						)
					}
				})
					.catch(err => {
						console.log(err);
					})
			},
			// handleUpload(data) { //对当前的上传文件数据、状态处理
			//     console.log(data)
			//     if(data.length){
			//         this.form.url=data[0].url;
			//         console.log(this.form.url);
			//         this.fileList=[{
			//             url:this.form.url
			//         }]
			//     }
			// },
			// 图片上传验证
			beforeUpload () {
				this.uploadLoading = true;
			},
			// 图片上传成功
			handleUploadSuccess (response, file, fileList) {
				this.uploadLoading = false;
				if (response.state === 0) {
					this.form.url = response.data.url;
					console.log(this.form.url);
					this.fileList = [ {
						url: this.form.url
					} ]
					// this.form.image = response.data.url;
				}
				else {
					this.$message({
						type: "error",
						message: response.msg,
						center: true
					});
				}
			}
		}
	}
</script>

<style scoped>

  .small-img {
    width: 90px;
  }

  .small-icon {
    width: 20px;
  }
</style>
