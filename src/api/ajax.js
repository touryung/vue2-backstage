import axios from "axios";

// 设置 axios 的基础路径
axios.defaults.baseURL = "http://www.ysqorz.top:8888/api/private/v1/";

// 添加 axios 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

// export default function(url = "", method = "GET", data = {}) {
//   if (method.toUpperCase() === "GET") {
//     let queryStr = Object.keys(data).reduce((accumulateStr, key) => {
//       accumulateStr += `${key}=${data[key]}&`;
//     }, "");
//     // 根据是否有数据请求不同接口
//     return axios.get(`${url}${queryStr ? "?" + queryStr.slice(0, -1) : ""}`);
//   } else if (method.toUpperCase() === "POST") {
//     return axios.post(url, data);
//   }
// }
export default function(url = "", method = "GET", data = {}) {
  if (method.toUpperCase() === "GET") {
    if (Object.keys(data).length) {
      return axios.get(url, { params: data });
    } else {
      return axios.get(url);
    }
  } else {
    return axios.post(url, data);
  }
}
