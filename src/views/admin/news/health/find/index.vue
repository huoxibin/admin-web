<template>
  <div class="find">
    <el-tabs type="border-card">
      <el-tab-pane label="官网">
        <div class="bgimg pc">
          <div class="show pcShow">
            <h2>{{findFrom.title}}</h2>
            <p>
              <span>作者：{{findFrom.author}}</span>
              <span>评论：99+</span>
            </p>
            <div class="ql-container ql-snow" v-if="contextType===1">
              <div class="ql-editor" v-if="contextType===1">
                <div class="text" v-html="text" v-if="contextType===1"></div>
              </div>
            </div>
            <div class="photo" ref="photo" v-if="contextType===2">
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item,index in photoList" :key="index">
                  <img :src="item.imageurl" alt>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="video" ref="video" v-if="contextType===3">
              <video v-if="findFrom.videoType === 1" controls="controls">
                <source :src="findFrom.context" type="video/mp4">
                <source :src="findFrom.context" type="video/webm">
                <source :src="findFrom.context" type="video/ogg">
              </video>
              <iframe
                v-else
                id="videoer"
                width="100%"
                height="600"
                allowfullscreen="true"
                frameborder="0"
                :src="findFrom.context"
              ></iframe>
            </div>
            <div class="audio" ref="audio" v-if="contextType===4">
              <audio controls="controls">
                <source :src="findFrom.context" type="audio/ogg">
                <source :src="findFrom.context" type="audio/mpeg">
                <source :src="findFrom.context" type="audio/wav">
              </audio>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="医生端app">
        <div class="bgimg app">
          <div class="show appShow">
            <h2>{{findFrom.title}}</h2>
            <p>
              <span>作者：{{findFrom.author}}</span>
              <span>评论：99+</span>
            </p>
            <div class="ql-container ql-snow" v-if="contextType===1">
              <div class="ql-editor" v-if="contextType===1">
                <div class="text" v-html="text" v-if="contextType===1"></div>
              </div>
            </div>
            <div class="photo" ref="photo" v-if="contextType===2">
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item,index in photoList" :key="index">
                  <img :src="item.imageurl" alt>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="video" ref="video" v-if="contextType===3">
              <video v-if="findFrom.videoType === 1" controls="controls">
                <source :src="findFrom.context" type="video/mp4">
                <source :src="findFrom.context" type="video/webm">
                <source :src="findFrom.context" type="video/ogg">
              </video>
              <iframe
                v-else
                id="videoer"
                width="100%"
                height="400"
                allowfullscreen="true"
                frameborder="0"
                :src="findFrom.context"
              ></iframe>
            </div>
            <div class="audio" ref="audio" v-if="contextType===4">
              <audio controls="controls">
                <source :src="findFrom.context" type="audio/ogg">
                <source :src="findFrom.context" type="audio/mpeg">
                <source :src="findFrom.context" type="audio/wav">
              </audio>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="pad终端">
        <div class="bgimg pad">
          <div class="show padShow">
            <h2>{{findFrom.title}}</h2>
            <p>
              <span>作者：{{findFrom.author}}</span>
              <span>评论：99+</span>
            </p>
            <div class="ql-container ql-snow" v-if="contextType===1">
              <div class="ql-editor" v-if="contextType===1">
                <div class="text" v-html="text" v-if="contextType===1"></div>
              </div>
            </div>
            <div class="photo" ref="photo" v-if="contextType===2">
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item,index in photoList" :key="index">
                  <img :src="item.imageurl" alt>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="video" ref="video" v-if="contextType===3">
              <video v-if="findFrom.videoType === 1" controls="controls">
                <source :src="findFrom.context" type="video/mp4">
                <source :src="findFrom.context" type="video/webm">
                <source :src="findFrom.context" type="video/ogg">
              </video>
              <iframe
                v-else
                id="videoer"
                width="100%"
                height="400"
                allowfullscreen="true"
                frameborder="0"
                :src="findFrom.context"
              ></iframe>
            </div>
            <div class="audio" ref="audio" v-if="contextType===4">
              <audio controls="controls">
                <source :src="findFrom.context" type="audio/ogg">
                <source :src="findFrom.context" type="audio/mpeg">
                <source :src="findFrom.context" type="audio/wav">
              </audio>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="亲属端app">
        <div class="bgimg app">
          <div class="show appShow">
            <h2>{{findFrom.title}}</h2>
            <p>
              <span>作者：{{findFrom.author}}</span>
              <span>评论：99+</span>
            </p>
            <div class="ql-container ql-snow" v-if="contextType===1">
              <div class="ql-editor" v-if="contextType===1">
                <div class="text" v-html="text" v-if="contextType===1"></div>
              </div>
            </div>
            <div class="photo" ref="photo" v-if="contextType===2">
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item,index in photoList" :key="index">
                  <img :src="item.imageurl" alt>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="video" ref="video" v-if="contextType===3">
              <video v-if="findFrom.videoType === 1" controls="controls">
                <source :src="findFrom.context" type="video/mp4">
                <source :src="findFrom.context" type="video/webm">
                <source :src="findFrom.context" type="video/ogg">
              </video>
              <iframe
                v-else
                id="videoer"
                width="100%"
                height="400"
                allowfullscreen="true"
                frameborder="0"
                :src="findFrom.context"
              ></iframe>
            </div>
            <div class="audio" ref="audio" v-if="contextType===4">
              <audio controls="controls">
                <source :src="findFrom.context" type="audio/ogg">
                <source :src="findFrom.context" type="audio/mpeg">
                <source :src="findFrom.context" type="audio/wav">
              </audio>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  data() {
    return {
      findFrom: {},
      contextType: null,
      photoList: [],
      text: ""
    };
  },
  mounted() {
    var findId = this.$route.query.id;
    this.$axios
      .get("/data/my", {
        params: {
          pathL: "/news/newsArticle/articleDetail",
          id: findId
        }
      })
      .then(res => {
        if (res.data.state === 0) {
          this.findFrom = res.data.data.articleInfo;
          this.contextType = res.data.data.articleInfo.contextType;
          if (res.data.data.imageList) {
            if (res.data.data.imageList.length !== 0) {
              this.photoList = res.data.data.imageList.reverse();
            }
          }
          this.text = this.findFrom.context;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scoped>
.card-box {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.text,
.photo,
.video,
.audio {
  width: 100%;
  position: relative;
}
.photo img {
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
video,
audio {
  width: 100%;
}
.el-tab-pane {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bgimg {
  position: relative;
}
.pcShow {
  width: 100%;
  height: auto;
}
.appShow {
  width: 421px;
  height: 748px;
  position: absolute;
  top: 129px;
  left: 38px;
  overflow-x: hidden;
  overflow-y: auto;
}
.padShow {
  width: 585px;
  height: 746px;
  position: absolute;
  top: 153px;
  left: 95px;
  overflow-x: hidden;
  overflow-y: auto;
}
.pc {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 10px;
}
.app {
  width: 496px;
  height: 1005px;
  background: url("./../images/iphone.jpg") no-repeat center;
}
.pad {
  width: 769px;
  height: 1024px;
  background: url("./../images/iPad.jpg") no-repeat center;
  background-size: cover;
}
h2,
p {
  text-align: center;
  margin-bottom: 20px;
}
span {
  margin: 0 20px;
}
.show {
  box-sizing: border-box;
  padding: 10px;
}
</style>
