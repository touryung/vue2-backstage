import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 导入全局样式表和图标库
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";

// 导入富文本编辑器组件和样式并全局注册
import VueQuillEditor from "vue-quill-editor";
Vue.use(VueQuillEditor);

// 导入树形表格组件并全局注册组件
import TreeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", TreeTable);

// 导入工具库并注册
import _ from "lodash";
Vue.prototype.$_ = _;

// 导入进度条
import NProgress from "nprogress";

// 导入请求库并挂载到 Vue 原型
import axios from "axios";
// 设置 axios 的基础路径
axios.defaults.baseURL = "http://www.ysqorz.top:8888/api/private/v1/";
// 添加 axios 请求和响应拦截器
axios.interceptors.request.use((config) => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});
Vue.prototype.$axios = axios;

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

// 全局日期过滤器
Vue.filter("dateFormat", (timestamp) => {
  const dt = new Date(timestamp * 1000);
  const y = String(dt.getFullYear());
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  const ss = String(dt.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
