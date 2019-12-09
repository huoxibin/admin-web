<template>
  <el-row>
    <el-col :span="15" :offset="1" class="m-t-20">
      <div class="push-edit" v-loading="loadings">
        <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
          <el-form-item label="发送对象" prop="sendPlatform">
            <p v-if="type === 'detail'">{{form.sendCrowd}}</p>
            <div v-else>
              <div>
                <el-button type="primary" @click="selectData">选择对象</el-button>
                <span
                  v-if="sendCrowd===1 && type==='add'"
                  style="margin-left:20px;"
                >{{`已选 ${tabName} ${sendNumber}用户`}}</span>
                <span
                  v-if="type === 'update' && sendCrowd === 1 "
                  style="margin-left:20px;"
                >{{form.sendCrowd}}</span>
              </div>
              <div style="margin:10px 0;">
                <el-button type="primary" @click="importDialogVisible = true;isRecommendContent = true;">导入对象
                </el-button>
                <span
                  v-if="sendCrowd===2 && sendPlatform===1 && type==='add'"
                  style="margin-left:20px;"
                >{{`已选 医哆咖 ${sendNumber}用户`}}</span>
                <span
                  v-if="sendCrowd===2 && sendPlatform===2 && type==='add'"
                  style="margin-left:20px;"
                >{{`已选 哆咖家庭 ${sendNumber}用户`}}</span>
                <span
                  v-if="sendCrowd===2 && sendPlatform===3 && type==='add'"
                  style="margin-left:20px;"
                >{{`已选 哆咖医生 ${sendNumber}用户`}}</span>
                <span
                  v-if="type === 'update' && sendCrowd === 2 "
                  style="margin-left:20px;"
                >{{form.sendCrowd}}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="发送渠道">
            <p v-if="form.sendChannel==='3' || form.sendChannel=== 3">短 信</p>
            <p v-if="form.sendChannel==='2' || form.sendChannel=== 2">PUSH</p>
            <p v-if="form.sendChannel==='1' || form.sendChannel=== 1">站内信</p>
          </el-form-item>
          <el-form-item label="消息内容" prop="messageContent">
            <p v-if="type === 'detail'">{{form.messageContent}}</p>
            <el-input rows="6" v-else type="textarea" v-model="form.messageContent"></el-input>
          </el-form-item>
          <el-form-item
            label="消息链接"
            v-show="type !== 'detail'"
            v-if="form.sendChannel !=='3' || form.sendChannel !== 3"
          >
            <el-radio-group v-model="form.linkType">
              <div>
                <el-radio :label="2">外链：
                  <el-input :disabled="form.linkType !== 2 " v-model="form.messageLink"></el-input>
                </el-radio>
              </div>
              <div style="margin-top: 10px">
                <el-radio :label="1">内链：
                  <el-select
                    style="width:20%"
                    v-model="form.typeId"
                    placeholder="请选择"
                    @change="typeChange"
                    :disabled="form.linkType !== 1 "
                  >
                    <el-option
                      v-for="(item,index) in types"
                      :key="index"
                      :label="item.typeName"
                      :value="item.typeId"
                    ></el-option>
                  </el-select>
                  <el-select
                    style="width:20%"
                    v-model="form.channelId"
                    placeholder="请选择"
                    @change="channelChange"
                    :disabled="form.linkType !== 1 "
                  >
                    <el-option
                      v-for="(item,index) in channel"
                      :key="index"
                      :label="item.channelName"
                      :value="item.channelId"
                    ></el-option>
                  </el-select>
                  <el-select
                    style="width:20%"
                    v-model="form.articleId"
                    placeholder="请选择"
                    :disabled="form.linkType !== 1 "
                  >
                    <el-option
                      v-for="(item,index) in article"
                      :key="index"
                      :label="item.articleName"
                      :value="item.articleId"
                    ></el-option>
                  </el-select>
                </el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="消息链接"
            v-if="form.linkType === 2"
            v-show="type === 'detail'"
          >{{form.messageLink}}
          </el-form-item>
          <el-form-item
            label="消息链接"
            v-else
            v-show="type === 'detail'"
          >{{form.typeName}} - {{form.channelName}} - {{form.articleName}}
          </el-form-item>
          <el-form-item label="操作人" v-show="type === 'detail'">{{form.operateName}}</el-form-item>
          <el-form-item label="发送日期" v-show="type === 'detail'">{{form.sendTime}}</el-form-item>
          <el-form-item label="发送条数" v-show="type === 'detail'">{{form.sendNumber}}</el-form-item>
          <el-form-item label="消息到达数" v-show="type === 'detail'">{{form.arriveNumber}}</el-form-item>
          <el-form-item label="消息点击数" v-show="type === 'detail'">{{form.messageLink}}</el-form-item>
          <el-form-item label="消息分类" v-if="isRequiresFg" v-show="type !== 'detail'"
                        :rules="{required: isRequiresFg,message: '请选择消息分类'}"
                        prop="messageType">
            <el-select style="width: 200px;" v-model="form.messageType" placeholder="请选择">
              <el-option
                v-for="item in msgList"
                :key="item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息分类" v-show="type === 'detail' && form.sendChannel==1 ">
            <el-select style="width: 200px;" v-model="form.messageType" disabled placeholder="请选择">
              <el-option
                v-for="item in msgList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐内容">
            <el-button @click="dialogVisible=true" type="primary" :disabled="isRecommendContent">
              请选择
            </el-button>
            <div v-for="item in selectionData">
              {{ item.doctorName }}
            </div>
          </el-form-item>
          <el-form-item>
            <el-button v-if="type !== 'detail'" type="primary" @click="submit">保存</el-button>
            <el-button @click="$router.go(-1)">返 回</el-button>
          </el-form-item>
        </el-form>
        <!-- 选择对象dialog -->
        <el-dialog title="选择对象" :append-to-body="true" :visible.sync="selectDialogVisible" width="80%">
          <el-tabs v-model="form.sendPlatform" tab-position="left" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in tab" :key="index" :label="item.name" :name="item.id">
              <div v-show="item.name==='哆咖医生'" class="select" v-loading="loading">
                <div class="select-left">
                  <el-checkbox-group v-model="target.all" size="mini">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.all"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>用户标签</p>
                  <el-checkbox-group
                    v-model="target.qualifier"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.qualifier"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>性别标签</p>
                  <el-checkbox-group v-model="target.sex" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.sex"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>职称标签</p>
                  <el-checkbox-group
                    v-model="target.title"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.title"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>地区标签</p>
                  <el-checkbox-group
                    v-model="target.city"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:200px"
                      v-for="(item,index) in option.city"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <div class="select-switch">
                  <i class="el-icon-arrow-right"></i>
                  <i class="el-icon-arrow-left"></i>
                </div>

                <div class="select-right">
                  <el-checkbox-group v-model="target.all" size="mini">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.all"
                      v-show="target.all.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>用户标签</p>
                  <el-checkbox-group
                    v-model="target.qualifier"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.qualifier"
                      v-show="target.qualifier.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>性别标签</p>
                  <el-checkbox-group v-model="target.sex" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.sex"
                      v-show="target.sex.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>职称标签</p>
                  <el-checkbox-group
                    v-model="target.title"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.title"
                      v-show="target.title.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>地区标签</p>
                  <el-checkbox-group
                    v-model="target.city"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:200px"
                      v-for="(item,index) in option.city"
                      v-show="target.city.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div v-show="item.name!=='哆咖医生'" class="select" v-loading="loading">
                <div class="select-left">
                  <el-checkbox-group v-model="target.all" size="mini">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.all"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>用户标签</p>
                  <el-checkbox-group
                    v-model="target.qualifier"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.qualifier"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>性别标签</p>
                  <el-checkbox-group v-model="target.sex" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.sex"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>年龄标签</p>
                  <el-checkbox-group v-model="target.age" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.age"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <div class="select-switch">
                  <i class="el-icon-arrow-right"></i>
                  <i class="el-icon-arrow-left"></i>
                </div>

                <div class="select-right">
                  <el-checkbox-group v-model="target.all" size="mini">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.all"
                      v-show="target.all.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>用户标签</p>
                  <el-checkbox-group
                    v-model="target.qualifier"
                    size="mini"
                    :disabled="target.all.length!==0"
                  >
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.qualifier"
                      v-show="target.qualifier.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>性别标签</p>
                  <el-checkbox-group v-model="target.sex" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.sex"
                      v-show="target.sex.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>

                  <p>年龄标签</p>
                  <el-checkbox-group v-model="target.age" size="mini" :disabled="target.all.length!==0">
                    <el-checkbox
                      style="margin:10px;width:120px"
                      v-for="(item,index) in option.age"
                      v-show="target.age.includes(item.name)"
                      :key="index"
                      :label="item.name"
                      border
                    >{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <span slot="footer" class="dialog-footer">
        <el-button style="width:100px" size="mini" type="primary" @click="checkboxSubmit">确 定</el-button>
        <el-button style="width:100px" size="mini" @click="selectDialogVisible = false">关 闭</el-button>
      </span>
        </el-dialog>

        <!-- 导入对象dialog -->
        <el-dialog title="导入对象" :append-to-body="true" :visible.sync="importDialogVisible" width="50%">
          <el-form label-width="130px" size="mini" :model="form">
            <el-form-item label="选择导入用户平台">
              <el-radio-group v-model="form.sendPlatform" @change="handleTabClick">
                <el-radio v-for="(item,index) in tabs" :key="index" :label="item.id">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="导入">
              <div class="flex" style="display:flex;">
                <el-upload
                  class="upload-demo"
                  :action="action"
                  :headers="headers"
                  :on-success="onSuccess"
                  :show-file-list="false"
                  :data="importData"
                  :before-upload="beforeUpload"
                  name="excel"
                >
                  <el-button type="primary">导入模板</el-button>
                </el-upload>
                <el-button style="margin-left:20px;" type="success" @click="exportExcel">导出模板</el-button>
              </div>
            </el-form-item>
            <el-form-item label="已导入表格名称">{{sendCrowd===2?excelName:""}}</el-form-item>
            <el-form-item label="已成功导入用户数">{{sendCrowd===2?sendNumber:""}}</el-form-item>
            <el-form-item>
              <el-button type="primary" @click="exportSubmit">确 认</el-button>
              <el-button @click="importDialogVisible = false">返 回</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          ref="selectionDoctor"
          title="选择医生"
          :visible.sync="dialogVisible"
          :append-to-body="true"
          width="700px"
        >
          <!--导入绑定的医生-->
          <dk-form
            size="mini"
            :form="dialogForm"
            :config="formConfig"
            :inline="true"
            labelWidth="80px"
            style="display: inline;"
          ><!-- 按钮 -->
          </dk-form>
          <el-form style="display: inline;" :inline="true" size="mini">
            <el-form-item label="">
              <el-button size="mini" type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
          <v-table
            :height="300"
            is-vertical-resize=""
            is-horizontal-resize
            style="width:100%"
            :multiple-sort="true"
            :min-height="350"
            even-bg-color="#f2f2f2"
            :select-change="selectChange"
            :columns="tableConfig.columns"
            :table-data="tableConfig.tableData"
            row-hover-color="#eee"
            row-click-color="#edf7ff"
          ></v-table>

          <!--<bindDoctor :defaultCheck="selectionData" @getSelectionData="getSelectionData"></bindDoctor>-->
          <div class="clear"></div>
          <div class="m-t-10 text-right">
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            <el-button size="mini" :disabled="noSave" type="primary" @click="dialogVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>
<script>
	import bindDoctor from './components/bindDoctor'

	let pageSizeNum = 10;
	let pageIndexNum = 1;
	export default {
		name: "PushEdit",
		components: {bindDoctor},
		computed: {
			checkboxAll () {
				return this.target.all.length;
			},
			linkType () {
				return this.form.linkType;
			}
		},
		data () {
			return {
				////弹窗内容///
				formSearch: {
					userName: '', //医生姓名
				},
				dialogForm: {
					doctorName: '', //医生姓名
					mobile: '' // 医生手机号
				},
				formConfig: [
					// 搜索条件相关配置
					{
						type: "input",
						label: "医生名称",
						value: "doctorName",
						option: {
							placeholder: "请输入医生名称",
							disabled: false
						}
					},
					{
						type: "input",
						label: "手机号",
						value: "mobile",
						option: {
							placeholder: "请输入手机号",
							disabled: false
						}
					}
				],
				pageNum: 1,
				pageSize: 999999999,
				total: 0,
				tableConfig: {
					multipleSort: false,
					tableData: [],
					columns: [
						{width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection'},
						{
							field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
							formatter: function (rowData, rowIndex, pagingIndex, field) {
								return (pageIndexNum - 1) * pageSizeNum + (rowIndex + 1);
							}
						},
						{
							field: 'doctorName',
							title: '医生姓名',
							width: 80,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{
							field: 'hospitalName',
							title: '机构名称',
							width: 150,
							titleAlign: 'center',
							columnAlign: 'center',
							isResize: true
						},
						{field: 'deptName', title: '科室', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
						{field: 'mobile', title: '手机号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
					],
				},

				//////////////

				isRecommendContent: true,//是否可以选择推荐内容
				noSave: false,//不可保持
				selectionData: [],//复选的内容
				dialogVisible: false, //绑定医生弹窗
				isRequiresFg: false,
				isDkDoctorFg: false, //多咖医生的标识
				msgList: [
					{
						value: 1,
						label: '课程上新',
						disabled: false
					},
					{
						value: 2,
						label: '活动通知',
						disabled: false
					},
					{
						value: 3,
						label: '系统消息',
						disabled: false
					},
				],
				loading: false,
				loadings: false,
				selectDialogVisible: false,
				importDialogVisible: false,
				type: this.$route.params.type,
				sendType: this.$route.query.sendType,
				tab: [
					// {
					//   name: "医哆咖",
					//   id: "1"
					// },
					{
						name: "哆咖家庭",
						id: "2"
					},
					{
						name: "哆咖医生",
						id: "3"
					}
				],
				tabs: [
					{
						name: "医哆咖",
						id: "1"
					},
					{
						name: "哆咖家庭",
						id: "2"
					},
					{
						name: "哆咖医生",
						id: "3"
					}
				],
				onlyFlag: null,
				form: {
					sendChannel: this.$route.query.sendChannel,
					sendPlatform: "2",
					messageContent: "",
					linkType: null,
					messageLink: "",
					typeId: "",
					channelId: "",
					articleId: "",
					messageType: ''
				},
				sendPlatform: "",
				sendCrowd: 0,
				tabName: "医哆咖",
				types: [],
				channel: [],
				channeler: [],
				article: [],
				articleer: [],
				// 发布对象选项
				option: {
					all: [],
					qualifier: [],
					sex: [],
					title: [],
					age: [],
					city: []
				},
				target: {
					all: [],
					age: [],
					qualifier: [],
					sex: [],
					title: [],
					city: []
				},
				targeter: {},
				rules: {
					sendPlatform: {
						required: this.$route.params.type !== "detail",
						message: "请选择发送对象"
					},
					messageContent: [
						{
							required: this.$route.params.type !== "detail",
							message: "请填写消息内容"
						},
						{
							min: 1,
							max: 999,
							message: "长度在 1 到 999 个字符",
							trigger: "blur"
						}
					]
				},
				// 导入excel
				action: "/data/excel",
				headers: {
					accessToken: this.$store.getters.accessToken,
					pathL: "/ap/messageSendInfo/importExcel"
				},
				importData: {},
				excelName: "",
				sendNumber: null,
				remSelTabName: '',//记录选择的发送对象的类型
			};
		},
		watch: {
			checkboxAll (now) {
				if (now === 1) {
					this.target = {
						all: this.target.all,
						age: [],
						qualifier: [],
						sex: [],
						title: [],
						city: []
					};
				}
			},
			linkType () {
				this.form.messageLink = "";
				this.form.typeId = "";
				this.form.channelId = "";
				this.form.articleId = "";
			},
			isDkDoctorFg () {
				if (!this.isDkDoctorFg) { // 非是哆咔医生
					this.msgList.forEach(item => {
						if (item.label === '系统消息') {
							item.disabled = false;
						}
						else {
							item.disabled = true;
						}
					})
				}
				else { // 哆咖医生
					this.msgList.forEach(item => {
						item.disabled = false;
					})
				}
			},
			tabName () {
				this.remSelTabName = this.tabName;
			},
			sendPlatform () {
				switch (this.sendPlatform) {
					case 1: {
						this.remSelTabName = '医哆咖';
					}
						break;
					case 2: {
						this.remSelTabName = '哆咖家庭';
					}
						break;
					case 3: {
						this.remSelTabName = '哆咖医生';
					}
						break;
				}
			},
			remSelTabName () {
				switch (this.remSelTabName) {
					case "医哆咖":
					case "哆咖家庭": {
						this.isDkDoctorFg = false;
					}
						break;
					case "哆咖医生": {
						this.isDkDoctorFg = true;
					}
						break;
				}
			}
		},
		created () {
			this.getInit();
			this.getTableData();
			if (this.form.sendChannel == 2 || this.form.sendChannel == 3) { //发送渠道为站内信
				this.$nextTick(() => {
					this.isRequiresFg = false;
				})
			}
			else {
				this.$nextTick(() => {
					this.isRequiresFg = true;
				})
			}
		},
		methods: {
			search () {
        this.getTableData();
			},
			selectChange (selection, rowData) {
				rowData._checked = !rowData._checked;
				this.selectionData = selection;
				if (this.selectionData.length > 4) {
					this.$message('所选的医生不能大于4个');
					this.selectionData = selection.slice(0, 4);
				}
			},
			selectCheck () {
				let that = this;
				this.tableConfig.tableData.forEach(item => {
					item._checked = false;//重置所有的记录
					that.selectionData.forEach(itm => {
						if (itm.doctorId == item.doctorId) {
							item._checked = true;
						}
					})
				})
			},
			getTableData () {
				//重新获取当前页的数据
				this.loading = true;
				let that = this;
				this.$post("/data/my", {
					pathL: "/doctor/livecourseInfo/lectuerList",
					doctorName: this.dialogForm.doctorName,
					mobile: this.dialogForm.mobile,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					that.loading = false;
					if (!res.state) {
						that.tableConfig.tableData = res.data.result;
						that.total = res.data.total;
						that.selectCheck(); //重新设置页面勾选内容

					}
					else {
						that.$message("获取讲师列表失败！");
					}
				});
			},
			async getInit () {
				await this.getMsg();
				await this.getChain(1);
			},
			// 获取消息内容
			getMsg () {
				let that = this;
				if (this.$route.params.type !== "add") {
					this.loadings = true;
					this.$get("/data/my", {
						pathL: "/ap/messageSendInfo/getMessageInfo",
						messageId: this.$route.query.id
					}).then(res => {
						that.loadings = false;
						if (res.state === 0) {
							const data = res.data;
							data.sendPlatform = data.sendPlatform.toString();
							that.sendCrowd = data.peopleType;

							that.selectionData = JSON.parse(data.doctorIds);
							that.isRecommendContent = false;

							that.form = data;
							if (!that.form.messageType) {
								that.form.messageType = ' ';
							}
							that.getChain(1);
							that.target = res.data.crowdList;
						}
						else {
							that.$message({
								message: res.msg,
								center: true
							});
						}
					});
				}
			},
			// switch
			switchTab (tab) {
				let data = {};
				switch (tab) {
					case "1":
					case "2":
						data = {
							pathL: "/ap/messageSendInfo/getSendObjectList"
						};
						break;
					case "3":
						data = {
							pathL: "/doctor/doctorPopup/publishTargetTag"
						};
						break;
				}
				this.getData(data);
			},
			// 获取对象信息
			getData (data) {
				this.loading = true;
				this.$post("/data/my", data).then(res => {
					this.loading = false;
					if (res.state === 0) {
						this.option = res.data;
					}
					else {
						this.$message({
							message: res.msg,
							center: true
						});
					}
				});
			},
			// 选择对象
			selectData () {
				this.switchTab(this.form.sendPlatform);
				this.selectDialogVisible = true;
			},
			// 获取内链列表
			getChain (sendCrowd) {
				if (this.$route.params.type !== "detail") {
					const change = [ null, 5, 7, 6 ];
					let ofterminal = change[ Number(this.form.sendPlatform) ];
					this.$post("/data/my", {
						pathL: "/common/startpage/innerLinkTree",
						"sendCrowd": sendCrowd,
						ofterminal
					}).then(res => {
						if (res.state === 0) {
							this.types = res.data.linkTree.type;  //内链的第一个type是接口返回的
							this.channeler = res.data.linkTree.channel;
							this.articleer = res.data.linkTree.article;
						}
						else {
							this.$message({
								message: res.msg,
								center: true
							});
						}
					});
				}
			},
			// 切换单选
			handleTabClick (tab) {
				if (this.form.sendChannel == 1) { //站内信，需要重新选择消息分类
					this.form.messageType = '';
				}
				this.getChain(2);
				this.form.linkType = null;
			},
			// 切换tab
			handleClick (tab) {
				if (this.form.sendChannel == 1) { //站内信，需要重新选择消息分类
					this.form.messageType = '';
				}
				this.getChain(1);
				this.tabName = tab.label;
				this.switchTab(tab.name);
				this.target = {
					all: [],
					age: [],
					qualifier: [],
					sex: [],
					title: [],
					city: []
				};
			},
			// 选择对象提交
			checkboxSubmit () {
				const target = this.target;
				const option = this.option;
				let status = false;
				for (let item in target) {
					if (target[ item ].length !== 0) {
						status = true;
					}
				}
				if (status) {
					// 性别数据处理
					const targetSex = [];
					target.sex.forEach(item => {
						targetSex.push(item);
					});
					let sex = null;
					switch (targetSex.length) {
						case 2:
							sex = 0;
							break;
						case 1:
							sex = target.sex[ 0 ];
							break;
					}
					// 公共部分data
					const data = {
						pathL: "/ap/messageSendInfo/getCrowdCount",
						sendPlatform: this.form.sendPlatform,
						crowdType: target.all.length === 0 ? 2 : 1
					};
					if (sex !== null) {
						data.sex = sex;
					}
					const fn = (option, target) => {
						let arr = [];
						target.forEach(i => {
							arr.push(option.filter(item => item.name === i)[ 0 ]);
						});
						return arr;
					};

					if (this.form.sendPlatform === "3") {
						// 资质数据处理
						const qualifier = [];
						target.qualifier.forEach(item => {
							qualifier.push(item);
						});
						let certificType = null;
						switch (qualifier.length) {
							case 2:
								certificType = 0;
								break;
							case 1:
								certificType = qualifier[ 0 ];
								break;
						}
						data.certificType = certificType;

						data.titleIds = target.title.join(",");
						// 地区数据处理
						const city = fn(option.city, target.city);
						const areaIds = [];
						city.forEach(item => {
							areaIds.push({
								areaId: item.name,
								areaLevel: item.level
							});
						});
						data.areaIds = JSON.stringify(areaIds);
					}
					else {
						// 疾病类型数据处理
						const qualifier = fn(option.qualifier, target.qualifier);
						const healthType = [];
						qualifier.forEach(item => {
							healthType.push(item.value);
						});
						data.healthType = healthType.join(",");
						data.ageType = target.age.join(",");
					}
					this.targeter = data;
					this.$get("/data/my", data).then(res => {
						if (res.state === 0) {
							this.sendNumber = res.data;
							this.selectDialogVisible = false;
							this.sendCrowd = 1;
						}
						else {
							this.$message({
								message: res.msg,
								center: true
							});
						}
					});
				}
				else {
					this.$message({
						message: "请选择发送对象",
						center: true
					});
				}
			},
			// 导入对象提交
			exportSubmit () {
				this.importDialogVisible = false;
				if (this.form.sendPlatform == 1 && this.sendPlatform == 1) {
					this.isRecommendContent = false; //选择'医哆咖' 推荐内容可用
				}
				else {
					this.selectionData = [];
					this.isRecommendContent = true;
				}
			},
			// 上传之前
			beforeUpload (file) {
				if (this.type === "add") {
					this.importData.sendPlatform = Number(this.form.sendPlatform);
				}
				if (this.type === "update") {
					this.importData.sendPlatform = Number(this.form.sendPlatform);
				}
			},
			// 上传成功
			onSuccess (response, file, fileList) {
				if (response.state === 0) {
					this.excelName = file.name;
					this.sendNumber = response.data.count;
					this.sendPlatform = response.data.sendPlatform;
					this.onlyFlag = response.data.onlyFlag;
					this.sendCrowd = 2;
				}
				else {
					this.$message({
						message: response.msg,
						center: true
					});
				}
			},
			// 导出模板
			exportExcel () {
				window.open(
					"http://jkywoss-udoctor-new.oss-cn-beijing.aliyuncs.com/common/%E6%B6%88%E6%81%AF%E6%8E%A8%E9%80%81%E5%AF%BC%E5%85%A5%E5%AF%B9%E8%B1%A1%E6%A8%A1%E6%9D%BF.xls"
				);
			},
			// 切换选项
			typeChange (data) {
				this.form.channelId = "";
				this.form.articleId = "";
				const filterType = item => item.typeId === data;
				this.channel = this.channeler.filter(filterType);
			},
			channelChange (data) {
				this.form.articleId = "";
				const filterChannel = item => item.channelId === data;
				this.article = this.articleer.filter(filterChannel);
			},
			// 提交
			submit () {
				let idArr=[];
				this.selectionData.forEach(item=>{
					idArr.push({
						doctorId:item.doctorId,
						doctorName:item.doctorName
					});
        })
				const data = {
					pathL: "/ap/messageSendInfo/saveOrEditMessage",
					sendPlatform: Number(this.form.sendPlatform),
					sendChannel: this.form.sendChannel,
					sendNumber: this.sendNumber || this.form.sendNumber,
					messageContent: this.form.messageContent,
					userId: this.$store.getters.userId,
					sendCrowd: this.sendCrowd,
					messageType: this.form.sendChannel == 1 ? this.form.messageType : 3, //消息分类
					doctorIds: JSON.stringify(idArr),
				};
				if (this.onlyFlag) {
					data.onlyFlag = this.onlyFlag;
				}
				if (this.form.linkType !== null) {
					data.linkType = this.form.linkType;
					data.messageLink =
						this.form.linkType === 2
							? this.form.messageLink
							: JSON.stringify({
								typeId: this.form.typeId,
								channelId: this.form.channelId,
								articleId: this.form.articleId
							});
				}

				if (this.sendCrowd === 0) {
					this.$message({
						message: "请选择发送对象",
						center: true
					});
				}
				else {
					if (this.sendCrowd === 1) {
						if (this.target.all.length === 1) {
							data.crowdType = 1;
						}
						else {
							data.crowdType = 2;
							data.certificType = this.targeter.crowdType;
							data.sex = this.targeter.sex;
							data.titleIds = this.targeter.titleIds;
							data.areaIds = this.targeter.areaIds;
							data.healthType = this.targeter.healthType;
							data.ageType = this.targeter.ageType;
						}
					}
					if (this.type === "update") {
						data.id = this.$route.query.id;
					}
					const fn = () => {
						this.$refs.form.validate(valid => {
							if (valid) {
								this.$post("/data/my", data).then(res => {
									if (res.state === 0) {
										this.$message({
											type: "success",
											message: "保存成功！",
											center: true
										});
										this.$router.push("/news/push/list");
									}
									else {
										this.$message({
											message: res.msg,
											center: true
										});
									}
								});
							}
							else {
								this.$message({
									message: "请正确填写表单",
									center: true
								});
							}
						});
					};
					if (this.form.linkType !== null) {
						if (
							this.form.messageLink === "" &&
							(this.form.typeId === "" ||
								this.form.channelId === "" ||
								this.form.articleId === "")
						) {
							this.$message({
								message: "请正确填写内外链",
								center: true
							});
						}
						else {
							fn();
						}
					}
					else {
						fn();
					}
				}
			}
		}
	};
</script>

<style scoped>


  .dialog-footer {
    display: flex;
    justify-content: space-around;
  }

  .select {
    width: 100%;
    height: 400px;
    display: flex;
  }

  .select-left,
  .select-right {
    flex: 5;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    overflow: auto;
  }

  .select-left p,
  .select-right p {
    margin: 10px 0;
    font-weight: 600;
  }

  .select-switch {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
</style>
