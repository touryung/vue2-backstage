import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

// 导入全局样式表
import "./assets/css/global.css";

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
