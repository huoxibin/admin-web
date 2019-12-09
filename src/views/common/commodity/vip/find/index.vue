<template>
    <div class="find" v-loading="loading" element-loading-text="正在加载中">
        <el-form ref="form" size="mini" :model="form" label-width="100px">
            <div class="form">
                <div class="form-left">
                    <el-form-item label="套餐名称">
                        {{comboMsg.name}}
                    </el-form-item>
                    <el-form-item label="展示">
                        {{comboMsg.directFamilyKind === 0 ? '全部' : (comboMsg.directFamilyKind === 1 ? '非会员家庭' : '会员家庭')}}
                    </el-form-item>
                    <el-form-item label="人数">
                        {{memberCount}}
                    </el-form-item>
                    <el-form-item label="套餐内容">
                        <!--{{comboMsg.detailUrl}}-->
                        <div class="ql-container ql-snow" >
                            <div class="ql-editor" >
                                <div class="text" v-html="comboMsg.detailContext" >
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="描述">
                        {{comboMsg.description}}
                    </el-form-item>
                    <el-form-item label="权重">
                        {{comboMsg.sort}}
                    </el-form-item>
                    <el-form-item label="有效期限">
                        {{comboMsg.indate}}{{comboMsg.indateType === 1 ? '年' : (comboMsg.indateType === 2 ? '月' : '日')}}
                    </el-form-item>
                    <el-form-item label="原价">
                        {{comboMsg.price === 0 ? '免费' :(comboMsg.price + '元')}}
                    </el-form-item>
                    <el-form-item label="现价">
                        {{comboMsg.presentPrice}}元
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width:100px" @click="$router.go(-1)" type="primary">返 回</el-button>
                    </el-form-item>
                </div>
                <div class="form-right">
                    <el-form-item label="套餐封面">
                        <div class="upload-img">
                            <img v-bind:src="comboMsg.photoUrl" class="avatar">
                        </div>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    name: "",
                    show: [],
                    num: "",
                    img: ""
                },
                comboId:'',
                comboMsg:'',//查看信息
                loading:true,
                memberCount:''
            };
        },
        methods:{
            //获取-会员服务配置-列表-查看 内容接口
            queryList(){
                this.$get("/data/my", {
                    pathL: "/family/familyServicepackage/getServicePackageDetail",
                    id:this.comboId
                }).then(res => {
                    if (res.state === 0) {
                        // console.log(res);
                        this.comboMsg = res.data;
                        if(this.comboMsg.memberCount == 3) this.memberCount = 3;
                        if(this.comboMsg.memberCount == 4) this.memberCount = 4;
                        if(this.comboMsg.memberCount == 5) this.memberCount = 5;
                        if(this.comboMsg.memberCount == 6) this.memberCount = 6;
                        if(this.comboMsg.memberCount == 999) this.memberCount = '不限制';
                        if(this.comboMsg.memberCount == -1) this.memberCount = '不配置';
                        if(this.comboMsg){
                            this.loading =false;
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            center: true
                        });
                    }
                })
            }
        },
        mounted(){
            let comboId = this.$route.query.id;
            this.comboId = comboId;
            // console.log(this.comboId);
            this.queryList();

        }
    };
</script>

<style scoped>
    .find {
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .form {
        display: flex;
    }
    .form-left {
        flex: 1;
    }
    .form-right {
        flex: 1;
    }
    .upload-img {
        width: 200px;
        height: 200px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
    }
    .upload-img:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 200px;
        line-height: 200px;
        text-align: center;
    }
    .avatar {
        max-width: 200px;
        max-height: 200px;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .time {
        width: 100%;
        display: flex;
    }
</style>
