import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
//import './mock';  // 该项目所有请求使用mockjs模拟
import './login.js' 
import './ui.js' 

//引入iconfont
import '@/assets/fonts/iconfont.css';

import Axios from 'axios';
Vue.prototype.$http = Axios;
//Vue.use(Axios);

//import '@/assets/css/base.scss';

//引入element-ui
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

//定义全局函数
import base from '@/utils/base';
Vue.use(base);

Vue.config.productionTip = false;


import VideoPlayer from 'vue-video-player';
Vue.use(VideoPlayer);
import 'video.js/dist/video-js.css';

var vm=new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


