<template>
     <div id="ree">
          <ali-player
                  @play="played"
                  :source="aplayer.source"
                  :cover="aplayer.cover"
                  :autoplay="aplayer.autoplay"
                  :accessKeyId="aplayer.accessKeyId"
                  :securityToken="aplayer.securityToken"
                  :accessKeySecret="aplayer.accessKeySecret"
                  :vid="aplayer.vid"
                  :playauth="aplayer.playauth"
                  ref="player">
          </ali-player>
          <!--<el-row class="m-t-10">-->
               <!--<el-col>-->
                    <!--<el-button  round size="mini" @click="play">播放</el-button>-->
                    <!--<el-button  round size="mini" @click="pause">暂停</el-button>-->
                    <!--<el-button  round size="mini" @click="replay">重播</el-button>-->
                    <!--<el-button size="mini" @click="convert">切换</el-button>-->
               <!--</el-col>-->
          <!--</el-row>-->
     </div>
</template>
<script>
     import VueAliplayer from "./VueAliplayer.vue"
     export default {
          props:['vInfo'],
          data() {
               return {
                    aplayer: {
                         autoplay:false,//自动播放
                         source: "",
                         vid: "",
                         playauth:"",
                         accessKeyId:'',
                         securityToken:'',
                         accessKeySecret:''
                    },
                    player: null
               };
          },
          watch:{
               "vInfo.playUrl"(){

                    this.aplayer.source=this.vInfo.playUrl;
                    this.aplayer.cover=this.vInfo.coverURL;
                    this.aplayer.vid=this.vInfo.videoId;
                    this.aplayer.playauth=this.vInfo.playAuth;
                    this.aplayer.autoplay=this.vInfo.autoplay;
                    this.aplayer.accessKeyId=this.vInfo.accessKeyId;
                    this.aplayer.securityToken=this.vInfo.securityToken;
                    this.aplayer.accessKeySecret=this.vInfo.accessKeySecret;

               }
          },
          methods: {
               played() {
                    console.log("play callback");
               },
               play() {
                    const player = this.$refs.player.instance;
                    player && player.play();

               },
               pause() {
                    const player = this.$refs.player.instance;
                    player && player.pause();
               },
               replay() {
                    const player = this.$refs.player.instance;
                    player && player.replay();
                    console.log(this.aplayer.source)
               },
               convert() {
                    //this.aplayer.source = 'http://ykugc.cp31.ott.cibntv.net/6774C188D9A30713541076C9A/03001201005BBAAFA8F56495AD6498AF7795DC-BAD0-4B20-BC5B-7566F0340E59.mp4?ccode=050F&duration=227&expire=18000&psid=7cbece700aca4715da4efc5e16296caf&ups_client_netip=de80b12e&ups_ts=1552386774&ups_userid=&utid=8yoAFQEyI1UCAXOrPgDAOe7w&vid=XMzg1MzQyNDg0OA%3D%3D&vkey=Af65d29dc4e5ba093fd5045e79b44a094&sp=';
                    //this.aplayer.source='https://outin-464cf2d0357e11e985d200163e00b174.oss-cn-beijing.aliyuncs.com/fad9142ce0a244f984b312b68732aaf0/10bc928c868c452bba9147b7ce9da48b-cfd349175806725f51fb0e6947a6153d-ld.m3u8?Expires=1552390866&OSSAccessKeyId=LTAI8bKSZ6dKjf44&Signature=Fdxg%2F87djXSVPsQCTHjJykUS01w%3D'

                    const player = this.$refs.player;
                    player && player.reloadPlayer();
               }
          },
          components: {
               "ali-player": VueAliplayer
          }
     };
</script>

<style>

     .dplayer {
          width: 800px;
          margin: 50px auto;
     }

</style>
