import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

// 导入全局样式表
import "./assets/css/global.css";
// 导入全局图标库
import "./assets/fonts/iconfont.css";
// 导入树形表格组件
import TreeTable from "vue-table-with-tree-grid";

// 导入请求库
import axios from "axios";

// 设置 axios 的基础路径
axios.defaults.baseURL = "http://www.ysqorz.top:8888/api/private/v1/";

// 添加 axios 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

// 挂载到 Vue 原型
Vue.prototype.$axios = axios;

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

// 全局注册组件
Vue.component("tree-table", TreeTable);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
