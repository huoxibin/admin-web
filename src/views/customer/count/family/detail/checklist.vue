<template>
  <div class="checklist">
    <div class="title" style="border-top:1px solid #ccc;">
      <p>数据列表</p>
      <el-button @click="addCheckList" size="mini" type="primary">上传检查单</el-button>
    </div>
    <!--数据列表-->
    <div ref="table" class="table" v-loading="loading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="saveUrl" label="检查单图片" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="cover-wrap">
              <img class="cover" :src="scope.row.saveUrl" alt>
              <!--<img src="../images/doctorPic.png">-->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="操作人" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uploadTime" label="操作时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
            <el-button
              v-if="scope.row.uploaderType == 4"
              @click="deleate(scope.row)"
              type="text"
              size="small"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageLength"
      ></el-pagination>
    </div>

    <!--查看按钮对话框-->
    <el-dialog
      title="检查单图片"
      style="text-align: center;"
      :visible.sync="dialogVisible1"
      width="30%"
      :modal-append-to-body="false"
    >
      <img width="100%" height="490" :src="jianchaUrl">
      <!--<img width="100%" height="490" src="../images/doctorPic.png">-->
    </el-dialog>

    <!--上传检查单对话框-->
    <div
      class="guideModel"
      v-show="addUploadShow"
      v-loading="loadingPic"
      element-loading-text="上传图片中"
    >
      <div class="ydt_content">
        <!--title-->
        <div class="ydt_top">
          <span>上传图片</span>
          <i @click="addUploadShow=false" class="el-icon-close"></i>
        </div>
        <div class="ydt_bottom">
          <!--tabs切换-->
          <el-tabs style="height:100%" v-model="activeName">
            <!--本地上传-->
            <el-tab-pane label="本地上传" name="first">
              <div class="bdsc">
                <div class="bdsc_show">
                  <el-upload
                    class="upload-demo"
                    :headers="uploadHeaders"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :before-upload="beforeAvatarUpload"
                    :on-success="onSuccessAdd"
                    auto-upload
                    list-type="picture"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :data="fileListAdder"
                    :file-list="fileListAdd"
                    name="file"
                    v-model="addFrom"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div
                      slot="tip"
                      class="el-upload__tip"
                    >只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！
                    </div>
                  </el-upload>
                </div>
                <div class="first_btn">
                  <el-button @click="addOk" size="mini" type="primary">确定</el-button>
                  <el-button @click="addUploadShow=false" size="mini" type="info" plain>取消</el-button>
                </div>
              </div>
            </el-tab-pane>
            <!--资源库-->
            <el-tab-pane label="资源库" name="second">资源库</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: "",
		components: {},
		props: [],
		filters: {},
		data () {
			return {
				uploadHeaders: {accessToken: this.$store.getters.accessToken}, //设置上传的请求头部
				uploadUrl: "/data/uploadImg", //必选参数，上传的地址
				fileListAdder: {}, //上传时附带的额外参数
				fileListAdd: [], //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
				addFrom: {
					divisionName: "",
					status: "",
					sort: "",
					guidIconUrl: ""
				},
				ydtImage: "", //上传图片地址
				activeName: "first", //tabs切换
				addUploadShow: false, //上传检查单 对话框
				dialogVisible1: false, //检查单图片 对话框
				loading: false, //数据列表加载的
				tableData: [
					{
						url: "",
						name: "霍",
						time: "2018-12-25 12:00:00"
					}
				], //列表数据
				pageSize: 10, //每页显示得条数
				pageLength: 0, //一共多少条数据
				loadingPic: false,
				pageNum: 1, //当前页码
				personId: this.$route.query.id, //个人id
				jianchaUrl: "" //查看检查单图片
			};
		},
		created () {
		},
		methods: {
			//获取数据列表
			queryList () {
				this.loading = true;
				this.$get("/data/my", {
					pathL: "/health/inspectionReport/getInspectionResults",
					pageNum: this.pageNum, //当前页码
					pageSize: this.pageSize, //每页显示得条数
					memberId: this.personId
				}).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.tableData = res.data.result;
						this.pageLength = res.data.total;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},

			//使用 before-upload 的钩子函数 beforeAvatarUpload 限制用户上传的图片格式和大小。
			beforeAvatarUpload (file) {
				const extension = file.type === "image/jpg";
				const extension2 = file.type === "image/jpeg";
				const extension3 = file.type === "image/gif";
				const extension4 = file.type === "image/png";
				const extension5 = file.type === "image/bmp";
				const isLt2M = file.size / 1024 / 1024 < 10;
				if (
					!extension &&
					!extension2 &&
					!extension3 &&
					!extension4 &&
					!extension5
				) {
					this.$message({
						message: "只允许上传格式为*.jpg,*.jpeg,*.gif,*.png,*.bmp的文件！",
						center: true
					});
				}
				if (!isLt2M) {
					this.$message({
						message: "上传图片大小不能超过10MB!",
						center: true
					});
				}
				return (
					(extension || extension2 || extension3 || extension4 || extension5) &&
					isLt2M
				);
			},
			//点击文件列表中已上传的文件时的钩子
			handlePreview (file) {
				console.log(file);
			},
			//on-success 文件上传成功时的钩子
			onSuccessAdd (response, file, fileList) {
				var fileUrl = [
					{
						name: file.name,
						url: response.data.url
					}
				];
				this.ydtImage = response.data.url;
				console.log(this.ydtImage);
				this.fileListAdd = fileUrl;
			},
			//文件超出个数限制时的钩子
			handleExceed (files, fileList) {
				this.$message.warning(
					`当前限制选择 1 张图片，本次选择了 ${
						files.length
						} 张图片，共选择了 ${ files.length + fileList.length } 张图片`
				);
			},
			//本地上传  确定  按钮
			addOk () {
				this.addFrom.guidIconUrl = this.ydtImage;
				// console.log(this.addFrom.guidIconUrl);
				var userId = this.$store.getters.userId;
				this.loadingPic = true;
				this.$post("/data/my", {
					pathL: "/health/inspectionReport/addInspectionResult",
					memberId: this.personId,
					uploaderId: Number(userId),
					imageUrl: this.addFrom.guidIconUrl
				}).then(res => {
					this.loadingPic = false;
					if (res.state === 0) {
						this.addUploadShow = false;
						this.queryList();
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},

			//查看 按钮
			view (row) {
				this.dialogVisible1 = true;
				this.jianchaUrl = row.saveUrl;
			},

			//删除 按钮
			deleate (row) {
				this.$confirm("是否删除该检查单？", "删除", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						//删除按钮接口
						this.$post("/data/my", {
							pathL: "/health/inspectionReport/delMemberInspection",
							ids: row.id
						}).then(res => {
							if (res.state === 0) {
								this.queryList();
								this.$message({
									type: "success",
									message: "删除成功",
									center: true
								});
							}
							else {
								this.$message({
									message: res.msg,
									center: true
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
							center: true
						});
					});
			},
			//上传检查单 按钮
			addCheckList () {
				this.fileListAdd = [];
				this.addUploadShow = true;
			},
			// 页数请求
			handleCurrentChange (val) {
				this.pageNum = val;
				this.queryList();
			}
		},
		mounted () {
			this.queryList();
		},
		updated () {
		},
		watch: {},
		computed: {},
		destroyed () {
		},
		activated () {
		},
		deactivated () {
		}
	};
</script>

<style scoped>
  .guideModel {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    z-index: 9999;
    justify-content: center;
    align-items: center;
  }

  .ydt_content {
    width: 800px;
    height: 500px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    background: #fff;
  }

  .ydt_top {
    width: 100%;
    height: 30px;
    text-align: center;
    color: #333;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    line-height: 30px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    border-radius: 4px 4px 0 0;
  }

  .ydt_top i {
    float: right;
    margin: 8px 10px 0 0;
    cursor: pointer;
  }

  .ydt_bottom {
    width: 100%;
    height: 470px;
    box-sizing: border-box;
    padding: 10px;
  }

  .bdsc {
    width: 100%;
    height: 400px;
  }

  .bdsc_show {
    width: 100%;
    height: 340px;
    overflow: auto;
  }

  .first_btn {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #ccc;
  }

  .cover-wrap {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }

  .cover-wrap img {
    width: 100%;
    height: 100%;
  }

  .checklist {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    overflow: hidden;
  }

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 1) 0%,
      rgba(226, 226, 226, 1) 0%,
      rgba(242, 242, 242, 1) 100%,
      rgba(242, 242, 242, 1) 100%
    );
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }

  .table {
    flex: 1;
    width: 100%;
    overflow: auto;
  }

  .pagination {
    width: 100%;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-right: 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: flex-end;
    z-index: 200;
    align-items: center;
  }
</style>
