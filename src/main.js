import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

// 导入全局样式表
import "./assets/css/global.css";
// 导入全局图标库
import "./assets/fonts/iconfont.css";

// 导入封装的请求
import ajax from "./api/ajax.js";
// 将请求方法绑定在 Vue 原型
Vue.prototype.$axios = ajax;

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
