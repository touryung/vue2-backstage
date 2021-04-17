import axios from "axios";

// 设置 axios 的基础路径
axios.defaults.baseURL = "http://www.ysqorz.top:8888/api/private/v1/";

export default function(url = "", method = "GET", data = {}) {
  if (method.toUpperCase() === "GET") {
    let queryStr = Object.keys(data).reduce((accumulateStr, key) => {
      accumulateStr += `${key}=${data[key]}&`;
    }, "");

    if (queryStr) {
      return axios.get(`${url}?${queryStr.slice(0, -1)}`);
    }
  } else if (method.toUpperCase() === "POST") {
    return axios.post(url, data);
  }
}
