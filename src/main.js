import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import md5 from "js-md5";
import { axios, qs, get, post } from "@/utils/request.js";
import VideoPlayer from 'vue-video-player';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import './styles/reset.css';
//import 'video.js/dist/video-js.css'

import 'vue-video-player/node_modules/video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';

////// 引入 vue-easytable  组件
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {VTable,VPagination} from 'vue-easytable'

// 注册到全局
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

Vue.use(VideoPlayer)

//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
   defaultOptions: {
      zIndex: 9999
   }
});

Vue.directive('loadmore', {
   bind(el, binding) {
      const selectWrap = el.querySelector('.el-table__body-wrapper');
      selectWrap.addEventListener('scroll', function() {
         let sign = 0;
         const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
         if (scrollDistance <= sign) {
            binding.value()
         }
      })
   }
});


// 引用基础组件
import "@/components";

Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$md5 = md5;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
